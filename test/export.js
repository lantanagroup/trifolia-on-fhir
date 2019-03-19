const assert = require('assert');
const FhirHelper = require('../server/fhirHelper');
const {HtmlExporter} = require('../server/export/html');
const {BundleExporter} = require('../server/export/bundle');
const {Fhir, Versions, ParseConformance} = require('fhir');
const Q = require('q');
const nock = require('nock');
const fs = require('fs-extra');
const path = require('path');
const tmp = require('tmp');

function emptySocketCallback(type, content) {
    console.log(`Socket message sent without a callback being registered: ${type} with ${content}`);
}

function getFhirStu3Instance() {
    const parser = new ParseConformance(false, Versions.STU3);
    parser.parseBundle(require('../src/assets/stu3/valuesets'));
    parser.parseBundle(require('../src/assets/stu3/profiles-types'));
    parser.parseBundle(require('../src/assets/stu3/profiles-resources'));
    const fhir = new Fhir(parser);
    return fhir;
}

function getFhirR4Instance() {
    const parser = new ParseConformance(false, Versions.R4);
    parser.parseBundle(require('../src/assets/r4/valuesets'));
    parser.parseBundle(require('../src/assets/r4/profiles-types'));
    parser.parseBundle(require('../src/assets/r4/profiles-resources'));
    const fhir = new Fhir(parser);
    return fhir;
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
    describe('bundle', () => {
        describe('r4', () => {
            beforeEach(() => {
                nock('http://test.com/fhir')
                    .get("/ImplementationGuide/test")
                    .reply(200, require('./data/r4/CCDA-on-FHIR-R4'));
                nock('http://test.com/fhir')
                    .get("/StructureDefinition/CCDA-on-FHIR-Care-Plan")
                    .reply(200, require('./data/r4/CCDA-on-FHIR-Care-Plan'));
                nock('http://test.com/fhir')
                    .get("/StructureDefinition/CCDA-on-FHIR-Consent")
                    .reply(200, require('./data/r4/CCDA-on-FHIR-Consent'));
            });

            it('should create a JSON bundle export for "test" ig', (done) => {
                const exporter = new BundleExporter('http://test.com/fhir', 'fhirserver1', 'r4', getFhirR4Instance(), 'test');
                exporter.fhirConfig.servers.push({
                    id: 'fhirserver1',
                    version: 'r4',
                    uri: 'urn:test',
                    name: 'test fhir server',
                    short: 'test'
                });
                exporter.export('json')
                    .then((results) => {
                        assert(results);
                        assert.equal(results.resourceType, 'Bundle');
                        assert.equal(results.type, 'collection');
                        assert(results.entry);
                        assert.equal(results.entry.length, 3);
                        assert.equal(results.total, 3);
                        assert(results.entry[0]);
                        assert(results.entry[0].resource);
                        assert.equal(results.entry[0].resource.resourceType, 'ImplementationGuide');
                        assert(results.entry[1]);
                        assert(results.entry[1].resource);
                        assert.equal(results.entry[1].resource.resourceType, 'StructureDefinition');
                        assert.equal(results.entry[1].fullUrl, 'http://test.com/fhir/StructureDefinition/CCDA-on-FHIR-Care-Plan/_history/2');
                        assert(results.entry[2]);
                        assert(results.entry[2].resource);
                        assert.equal(results.entry[2].fullUrl, 'http://test.com/fhir/StructureDefinition/CCDA-on-FHIR-Consent/_history/1');
                        assert.equal(results.entry[2].resource.resourceType, 'StructureDefinition');
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should create a XML bundle export for "test" ig', (done) => {
                const exporter = new BundleExporter('http://test.com/fhir', 'fhirserver1', 'r4', getFhirR4Instance(), 'test');
                exporter.fhirConfig.servers.push({
                    id: 'fhirserver1',
                    version: 'r4',
                    uri: 'urn:test',
                    name: 'test fhir server',
                    short: 'test'
                });
                exporter.export('xml')
                    .then((results) => {
                        assert(results);
                        assert(results.startsWith('<?xml version="1.0" encoding="UTF-8"?><Bundle xmlns="http://hl7.org/fhir">'));
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
        });
    });

    describe('stu3', () => {
        describe('html', () => {
            const exporter = new HtmlExporter('http://test.com/', 'fhirserver1', 'stu3', getFhirStu3Instance(), null, null, 'CCDA-on-FHIR');

            beforeEach(() => {
                nock('http://test.com')
                    .get("/baseDstu3/ImplementationGuide?_id=CCDA-on-FHIR&_include=ImplementationGuide%3Aresource&_format=application%2Fjson")
                    .reply(200, require('./data/stu3/ccda_on_fhir_bundle'));
            });

            it('should produce pages and auto-generate table of contents', (done) => {
                const bundle = require('./data/stu3/ccda_on_fhir_bundle');
                const implementationGuide = bundle.entry[0].resource;

                tmp.dir((err, rootPath, cleanup) => {
                    // Initialize the temp directory with a dummy file for the ig publisher template
                    // This file should get appended to by the write-pages functionality
                    const tocPath = path.join(rootPath, 'source/pages/toc.md');
                    fs.ensureDirSync(path.join(rootPath, 'source/pages/'));
                    fs.writeFileSync(tocPath, '# Table of Contents\n\n');

                    exporter.writeStu3Pages(rootPath, implementationGuide);

                    const page1Path = path.join(rootPath, 'source/pages/page1.md');
                    const page2Path = path.join(rootPath, 'source/pages/page2.md');
                    const page3Path = path.join(rootPath, 'source/pages/page3.md');

                    // Make sure the pages were created as files
                    assert(fs.existsSync(page1Path));
                    assert(fs.existsSync(page2Path));
                    assert(fs.existsSync(page3Path));

                    const page1Content = fs.readFileSync(page1Path).toString();
                    const page2Content = fs.readFileSync(page2Path).toString();
                    const page3Content = fs.readFileSync(page3Path).toString();

                    // Make sure the files have the right content
                    assert.equal(page1Content, "---\ntitle: Some info #1\nlayout: default\nactive: Some info #1\n---\n\nthis is a test");
                    assert.equal(page2Content, "---\ntitle: Some info #2\nlayout: default\nactive: Some info #2\n---\n\nthis is a test 2");
                    assert.equal(page3Content, "---\ntitle: Some info #3\nlayout: default\nactive: Some info #3\n---\n\nthis is a test 3");

                    const tocContent = fs.readFileSync(tocPath).toString();
                    assert.equal(tocContent, "# Table of Contents\n\n* Table of Contents\n    * <a href=\"page1.html\">Some info #1</a>\n        * <a href=\"page3.html\">Some info #3</a>\n    * <a href=\"page2.html\">Some info #2</a>\n");

                    // Cleanup the temporary directory
                    fs.emptyDirSync(rootPath);
                    cleanup();
                    done();
                });
            });

            it('should not auto-generate table of contents', (done) => {
                const bundle = require('./data/stu3/ccda_on_fhir_bundle');
                const implementationGuide = bundle.entry[0].resource;

                // Set auto-generate extension to false
                implementationGuide.page.extension[1].valueBoolean = false;

                tmp.dir((err, rootPath, cleanup) => {
                    // Initialize the temp directory with a dummy file for the ig publisher template
                    // This file should get appended to by the write-pages functionality
                    const tocPath = path.join(rootPath, 'source/pages/toc.md');
                    fs.ensureDirSync(path.join(rootPath, 'source/pages/'));
                    fs.writeFileSync(tocPath, '# Table of Contents\n\n');

                    exporter.writeStu3Pages(rootPath, implementationGuide);

                    const tocContent = fs.readFileSync(tocPath).toString();
                    assert.equal(tocContent, '# Table of Contents\n\nthis is the table of contents');

                    // Cleanup the temporary directory
                    fs.emptyDirSync(rootPath);
                    cleanup();
                    done();
                });
            });
        });
    });

    describe('r4', () => {
        describe('html', () => {
            const exporter = new HtmlExporter('http://test.com/', 'fhirserver1', 'r4', getFhirR4Instance(), null, null, 'CCDA-on-FHIR');

            beforeEach(() => {
                nock('http://test.com')
                    .get("/baseR4/ImplementationGuide?_id=CCDA-on-FHIR&_include=ImplementationGuide%3Aresource&_format=application%2Fjson")
                    .reply(200, require('./data/r4/us_core_bundle'));
            });

            it('should produce pages and auto-generate table of contents', (done) => {
                const bundle = require('./data/r4/us_core_bundle');
                const implementationGuide = bundle.entry[0].resource;

                tmp.dir((err, rootPath, cleanup) => {
                    // Initialize the temp directory with a dummy file for the ig publisher template
                    // This file should get appended to by the write-pages functionality
                    const tocPath = path.join(rootPath, 'source/pages/toc.md');
                    fs.ensureDirSync(path.join(rootPath, 'source/pages/'));
                    fs.writeFileSync(tocPath, '# Table of Contents\n\n');

                    exporter.writeR4Pages(rootPath, implementationGuide);

                    const page1Path = path.join(rootPath, 'source/pages/Some_page_1.md');
                    const page2Path = path.join(rootPath, 'source/pages/Some_page_2.md');
                    const page3Path = path.join(rootPath, 'source/pages/Some_page_3.md');

                    // Make sure the pages were created as files
                    assert(fs.existsSync(page1Path));
                    assert(fs.existsSync(page2Path));
                    assert(fs.existsSync(page3Path));

                    const page1Content = fs.readFileSync(page1Path).toString();
                    const page2Content = fs.readFileSync(page2Path).toString();
                    const page3Content = fs.readFileSync(page3Path).toString();

                    // Make sure the files have the right content
                    assert.equal(page1Content, "---\ntitle: Some page 1\nlayout: default\nactive: Some page 1\n---\n\nthis is a test");
                    assert.equal(page2Content, "---\ntitle: Some page 2\nlayout: default\nactive: Some page 2\n---\n\nthis is a test 2");
                    assert.equal(page3Content, "---\ntitle: Some page 3\nlayout: default\nactive: Some page 3\n---\n\nthis is a test 3");

                    const tocContent = fs.readFileSync(tocPath).toString();
                    assert.equal(tocContent, "# Table of Contents\n\n* <a href=\"US_Core_R4_Homepage.html\">US Core R4 Homepage</a>\n    * <a href=\"Some_page_1.html\">Some page 1</a>\n        * <a href=\"Some_page_3.html\">Some page 3</a>\n    * <a href=\"Some_page_2.html\">Some page 2</a>\n");

                    // Cleanup the temporary directory
                    fs.emptyDirSync(rootPath);
                    cleanup();
                    done();
                });
            });

            it('should not auto-generate table of contents', (done) => {
                const bundle = require('./data/r4/us_core_bundle');
                const implementationGuide = bundle.entry[0].resource;

                // Set auto-generate extension to false
                implementationGuide.definition.page.extension[0].valueBoolean = false;

                tmp.dir((err, rootPath, cleanup) => {
                    // Initialize the temp directory with a dummy file for the ig publisher template
                    // This file should get appended to by the write-pages functionality
                    const tocPath = path.join(rootPath, 'source/pages/toc.md');
                    fs.ensureDirSync(path.join(rootPath, 'source/pages/'));
                    fs.writeFileSync(tocPath, '# Table of Contents\n\n');

                    exporter.writeR4Pages(rootPath, implementationGuide);

                    const tocContent = fs.readFileSync(tocPath).toString();
                    assert.equal(tocContent, '# Table of Contents\n\nthis is the table of contents');

                    // Cleanup the temporary directory
                    fs.emptyDirSync(rootPath);
                    cleanup();
                    done();
                });
            });
        });
    });
});