const assert = require('assert');
const FhirHelper = require('../server/fhirHelper');
const HtmlExporter = require('../server/export/html');
const Fhir = require('fhir');
const Q = require('q');
const nock = require('nock');
const fs = require('fs-extra');
const path = require('path');
const tmp = require('tmp');

function emptySocketCallback(type, content) {
    console.log(`Socket message sent without a callback being registered: ${type} with ${content}`);
}

function getFhirStu3Instance() {
    const parser = new Fhir.ParseConformance(false, Fhir.ParseConformance.VERSIONS.STU3);
    parser.parseBundle(require('../src/assets/stu3/valuesets'));
    parser.parseBundle(require('../src/assets/stu3/profiles-types'));
    parser.parseBundle(require('../src/assets/stu3/profiles-resources'));
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
    describe('stu3', () => {
        describe('html', () => {
            const exporter = new HtmlExporter('http://test.com/', 'fhirserver1', getFhirStu3Instance(), null, null, 'CCDA-on-FHIR');

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

                    exporter._writeStu3Pages(rootPath, implementationGuide);

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

                    exporter._writeStu3Pages(rootPath, implementationGuide);

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
            const exporter = new HtmlExporter('http://test.com/', 'fhirserver1', new Fhir(), null, null, 'CCDA-on-FHIR');

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

                    exporter._writeR4Pages(rootPath, implementationGuide);

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

                    exporter._writeR4Pages(rootPath, implementationGuide);

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