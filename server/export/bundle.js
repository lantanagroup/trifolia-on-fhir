const FhirHelper = require('../fhirHelper');
const Q = require('q');
const rp = require('request-promise');
const _ = require('underscore');
const config = require('config');
const log4js = require('log4js');

const log = log4js.getLogger();
const fhirConfig = config.get('fhir');

function BundleExporter(fhirServerBase, fhirServerId, fhir, implementationGuideId) {
    this._fhirServerBase = fhirServerBase;
    this._fhirServerId = fhirServerId;
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

BundleExporter.prototype._getStu3Resources = function(implementationGuide) {
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
};

BundleExporter.prototype._getR4Resources = function(implementationGuide) {
    if (!implementationGuide.definition) {
        return Q.resolve([]);
    }

    const promises = _.chain(implementationGuide.definition.resource)
        .filter((resource) => !!resource.reference && !!resource.reference.reference)
        .map((resource) => {
            const reference = resource.reference.reference;
            const parsed = FhirHelper.parseUrl(reference);
            const resourceUrl = FhirHelper.buildUrl(this._fhirServerBase, parsed.resourceType, parsed.id);
            const resourcePromise = rp({ url: resourceUrl, json: true, resolveWithFullResponse: true });
            return resourcePromise;
        })
        .value();

    return Q.all(promises);
};

BundleExporter.prototype.getBundle = function() {
    const deferred = Q.defer();
    const igUrl = FhirHelper.buildUrl(this._fhirServerBase, 'ImplementationGuide', this._implementationGuideId);
    const fhirServerConfig = _.find(fhirConfig.servers, (serverConfig) => {
        return serverConfig.id === this._fhirServerId;
    });
    let implementationGuide;
    let implementationGuideFullUrl;

    rp({ url: igUrl, json: true, resolveWithFullResponse: true })
        .then((response) => {
            implementationGuide = response.body;
            implementationGuideFullUrl = response.headers['content-location'];

            if (fhirServerConfig.version === 'stu3') {
                return this._getStu3Resources(implementationGuide);
            }

            return this._getR4Resources(implementationGuide);
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
            if (err && err.response && err.response.body) {
                const errBody = err.response.body;
                const issueTexts = _.map(errBody.issue, (issue) => issue.diagnostics);

                if (issueTexts.length > 0) {
                    deferred.reject(issueTexts.join(' & '));
                } else if (errBody.text && errBody.text.div) {
                    deferred.reject(errBody.text.div);
                } else {
                    log.error(errBody);
                    deferred.reject('Unknown error returned by FHIR server when getting resources for implementation guide');
                }
            } else {
                log.error(err);
                deferred.reject(err);
            }
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