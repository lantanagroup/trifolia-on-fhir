const ImportController = require('../server/controllers/import').ImportController;
const nock = require('nock');
const assert = require('assert');

describe('ImportController', () => {
    const baseUrl = 'http://test.com/fhir';
    const vsacUrl = 'https://cts.nlm.nih.gov/fhir';
    const controller = new ImportController(baseUrl);

    describe('Resources and Transaction Bundles', () => {
        beforeEach(() => {
            nock(baseUrl)
                .post('/Medication')
                .reply(200, {resourceType: 'OperationOutcome', issue: [{diagnostics: 'Imported Medication'}]});

            nock(baseUrl)
                .put('/Medication/test-med')
                .reply(200, {resourceType: 'OperationOutcome', issue: [{diagnostics: 'Imported Medication test-med'}]});

            nock(baseUrl)
                .post('/Bundle')
                .reply(200, {resourceType: 'OperationOutcome', issue: [{diagnostics: 'Imported Document Bundle'}]});

            nock(baseUrl)
                .post('/', { resourceType: 'Bundle', type: 'transaction' })
                .reply(200, {resourceType: 'OperationOutcome', issue: [{diagnostics: 'Imported Transaction Bundle'}]});
        });

        it('Should import a single resource', (done) => {
            controller.importResource({resourceType: 'Medication'})
                .then((results) => {
                    assert(results, 'Expected to receive results');
                    assert.equal(results.issue[0].diagnostics, 'Imported Medication');
                    done();
                })
                .catch((err) => done(err));
        });

        it('Should import a resource with a pre-defined ID', (done) => {
            controller.importResource({ resourceType: 'Medication', id: 'test-med' })
                .then((results) => {
                    assert(results, 'Expected to receive results');
                    assert.equal(results.issue[0].diagnostics, 'Imported Medication test-med');
                    done();
                })
                .catch((err) => done(err));
        });

        it('Should import a non-transaction Bundle', (done) => {
            controller.importResource({ resourceType: 'Bundle', type: 'document' })
                .then((results) => {
                    assert(results, 'Expected to receive results');
                    assert.equal(results.issue[0].diagnostics, 'Imported Document Bundle');
                    done();
                })
                .catch((err) => done(err));
        });

        it('Should import a transaction Bundle', (done) => {
            controller.importResource({ resourceType: 'Bundle', type: 'transaction' })
                .then((results) => {
                    assert(results, 'Expected to receive results');
                    assert.equal(results.issue[0].diagnostics, 'Imported Transaction Bundle');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('VSAC', () => {
        beforeEach(() => {
            nock(vsacUrl)
                .get('/ValueSet/2.16.840.1.113762.1.4.1096.153')
                .reply(200, {
                    "resourceType": "ValueSet",
                    "id": "2.16.840.1.113762.1.4.1096.153",
                    "identifier": [
                        {
                            "system": "urn:ietf:rfc:3986",
                            "value": "urn:oid:2.16.840.1.113762.1.4.1096.153"
                        }
                    ]});

            nock(baseUrl)
                .put('/ValueSet/2.16.840.1.113762.1.4.1096.153')
                .reply(200, {resourceType: 'OperationOutcome', issue: [{diagnostics: 'Imported ValueSet 2.16.840.1.113762.1.4.1096.153'}]});

            nock(vsacUrl)
                .get('/ValueSet/234')
                .reply(404, {
                    "resourceType": "OperationOutcome",
                    "text": {
                        "status": "generated",
                        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table class=\"grid\"><tr><td><b>Severity</b></td><td><b>Location</b></td><td><b>Code</b></td><td><b>Details</b></td><td><b>Diagnostics</b></td></tr><tr><td>ERROR</td><td/><td>Not Found</td><td/><td>The value set '234' is not found.</td></tr></table></div>"
                    },
                    "issue": [
                        {
                            "severity": "error",
                            "code": "not-found",
                            "diagnostics": "The value set '234' is not found."
                        }
                    ]
                });
        });

        it('Should error correctly when not able to find a value set', (done) => {
            controller.importVsacValueSet('testAuth', 'ValueSet', '234')
                .then(() => {
                    done('Expected to catch an error when there was none');
                })
                .catch((err) => {
                    assert(err);
                    assert.equal(err.statusCode, 404);
                    done();
                });
        });

        it('Should import a value set', (done) => {
            controller.importVsacValueSet('testAuth', 'ValueSet', '2.16.840.1.113762.1.4.1096.153')
                .then((results) => {
                    assert(results, 'Expected to receive results');
                    assert.equal(results.issue[0].diagnostics, 'Imported ValueSet 2.16.840.1.113762.1.4.1096.153');
                    done();
                })
                .catch((err) => done(err));
        });
    });
});