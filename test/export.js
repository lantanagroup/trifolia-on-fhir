const assert = require('assert');
const exportController = require('../controllers/export');
const FhirHelper = require('../fhirHelper');
const Q = require('q');
const nock = require('nock');
const fs = require('fs-extra');

function emptySocketCallback(type, content) {
    console.log(`Socket message sent without a callback being registered: ${type} with ${content}`);
}

function createMockRequest(query, params, fhirServerBase, socketCallback) {
    const req = {
        query: query || {},
        params: params || {},
        fhirServerBase: fhirServerBase,
        getFhirServerUrl: function(resourceType, id, operation, params) {
            return FhirHelper.buildUrl(req.fhirServerBase, resourceType, id, operation, params);
        },
        io: {
            emit: socketCallback || emptySocketCallback
        }
    };
    return req;
}

describe('export', () => {
    describe('build_package', () => {
        const implementationGuide = {
            resourceType: 'ImplementationGuide',
            id: 'id',
            url: 'http://test.com/base/stu3/ImplementationGuide/test',
            page: {
                extension: [{
                    url: 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-content',
                    valueReference: { reference: '#binary1' }
                }],
                source: 'index.html'
            },
            contained: [{
                resourceType: 'Binary',
                id: 'binary1',
                contentType: 'text/html',
                content: 'VGhpcyBpcyBhIHRlc3QgbWVzc2FnZQ=='
            }]
        };

        beforeEach(() => {
            nock('http://test.com')
                .get("/baseDstu3/ImplementationGuide?_id=id&_include=ImplementationGuide%3Aresource&_format=application%2Fjson")
                .reply(200, { resourceType: 'Bundle', entry: [ { resource: implementationGuide } ] });
        });

        it('should produce a control file correctly', () => {
            const control = exportController.getControl('.json', implementationGuide);

            assert(control.tool === 'jekyll');
            assert(control.canonicalBase === 'http://test.com/base/stu3');
            assert(control.source === 'ImplementationGuide/id.json');
        });

        it('should produce a build package correctly', (done) => {
            const req = createMockRequest({ executeIgPublisher: 'false' }, { implementationGuideId: 'id' }, 'http://test.com/baseDstu3');
            const res = {
                send: (content) => {
                    assert(content && content.startsWith('tmp-'));
                }
            };

            exportController.exportHtml(req, res, (rootPath, err) => {
                const igExists = fs.existsSync(rootPath + '/ig.json');
                assert(igExists);

                if (rootPath) {
                    fs.emptyDirSync(rootPath);
                    fs.rmdirSync(rootPath);
                }
                done(err);
            });
        });
    });

    describe('bundle', () => {

    });
});