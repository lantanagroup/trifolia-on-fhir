const FhirHelper = require('../fhirHelper');
const Q = require('q');
const rp = require('request-promise');
const _ = require('underscore');

function BundleExporter(fhirServerBase, fhir, implementationGuideId) {
    this._fhirServerBase = fhirServerBase;
    this._fhir = fhir;
    this._implementationGuideId = implementationGuideId;
}

/*
function getBundle(req, format) {
    const deferred = Q.defer();
    let query = {
        '_id': req.params.implementationGuideId,
        '_include': 'ImplementationGuide:resource',
        '_format': format || format
    };
    const url = req.getFhirServerUrl('ImplementationGuide', null, null, query);

    request(url, (error, results, body) => {
        if (error) {
            log.error('Error retrieving implementation guide bundle from FHIR server: ' + error);
            return deferred.reject('Error retrieving implementation guide bundle from FHIR server');
        }

        deferred.resolve(body);
    });

    return deferred.promise;
}
*/

BundleExporter.prototype.getBundle = function() {
    const deferred = Q.defer();
    const igUrl = FhirHelper.buildUrl(this._fhirServerBase, 'ImplementationGuide', this._implementationGuideId);
    let implementationGuide;
    let implementationGuideFullUrl;

    rp({ url: igUrl, json: true, resolveWithFullResponse: true })
        .then((response) => {
            implementationGuide = response.body;
            implementationGuideFullUrl = response.headers['content-location'];

            const promises = [];

            _.each(implementationGuide.package, (igPackage) => {
                const references = _.chain(igPackage.resource)
                    .filter((resource) => resource.sourceReference && resource.sourceReference.reference)
                    .map((resource) => resource.sourceReference.reference)
                    .value();

                _.each(references, (reference) => {
                    const parsed = FhirHelper.parseUrl(reference);
                    const resourceUrl = FhirHelper.buildUrl(this._fhirServerBase, parsed.resourceType, parsed.id);
                    const resourcePromise = rp({ url: resourceUrl, json: true, resolveWithFullResponse: true });
                    promises.push(resourcePromise);
                });
            });

            return Q.all(promises);
        })
        .then((responses) => {
            const badResponses = _.filter(responses, (response) => {
                return !response.body || !response.body.resourceType;
            });
            const resourceEntries = _.chain(responses)
                .filter((response) => {
                    return response.body && response.body.resourceType;
                })
                .map((response) => {
                    let fullUrl = response.headers['content-location'];

                    if (!fullUrl) {
                        fullUrl = FhirHelper.joinUrl(this._fhirServerBase, response.body.resourceType, response.body.id);

                        if (response.body.meta && response.body.meta.versionId) {
                            fullUrl = FhirHelper.joinUrl(fullUrl, '_history', response.body.meta.versionId);
                        }
                    }

                    return {
                        fullUrl: fullUrl,
                        resource: response.body
                    };
                })
                .value();

            if (responses.length !== resourceEntries.length) {
                log.error(`Expected ${responses.length} entries in the export bundle, but only returning ${resourceEntries.length}. Some resources could not be returned in the bundle due to the response from the server.`);
            }

            const bundle = {
                resourceType: 'Bundle',
                type: 'collection',
                total: resourceEntries.length + 1,
                entry: [{ fullUrl: implementationGuideFullUrl, resource: implementationGuide }].concat(resourceEntries)
            };

            deferred.resolve(bundle);
        })
        .catch((err) => {
            deferred.reject(err);
        });

    return deferred.promise;
};

/**
 * Exports the bundle in the specified format
 * @param format {'json'|'xml'|'application/json'|'application/xml'|'application/fhir+json'|'application/fhir+xml'} The format to return the bundle in
 * @return {Promise<Bundle|string>} A Bundle object or a string depending on the format specified
 */
BundleExporter.prototype.export = function(format) {
    const deferred = Q.defer();

    this.getBundle()
        .then((bundle) => {
            let response = bundle;

            if (format === 'xml' || format === 'application/xml' || format === 'application/fhir+xml') {
                response = this._fhir.objToXml(bundle);
            }

            deferred.resolve(response);
        })
        .catch(deferred.reject);

    return deferred.promise;
};

module.exports = BundleExporter;