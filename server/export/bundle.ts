import {Fhir} from 'fhir/fhir';
import {ImplementationGuide as STU3ImplementationGuide, OperationOutcome} from '../../src/app/models/stu3/fhir';
import {ImplementationGuide as R4ImplementationGuide} from '../../src/app/models/r4/fhir';
import * as _ from 'underscore';
import * as rp from 'request-promise';
import * as FhirHelper from '../fhirHelper';
import * as log4js from 'log4js';
import * as config from 'config';
import {FhirConfig} from '../controllers/models';

export class BundleExporter {
    readonly log = log4js.getLogger();
    readonly fhirServerBase: string;
    readonly fhirServerId: string;
    readonly fhir: Fhir;
    readonly implementationGuideId: string;

    public fhirConfig: FhirConfig;

    constructor(fhirServerBase: string, fhirServerId: string, fhir: Fhir, implementationGuideId: string) {
        this.fhirServerBase = fhirServerBase;
        this.fhirServerId = fhirServerId;
        this.fhir = fhir;
        this.implementationGuideId = implementationGuideId;
        this.fhirConfig = <FhirConfig> config.get('fhir');
    }

    private _getStu3Resources(implementationGuide: STU3ImplementationGuide) {
        const promises = [];

        _.each(implementationGuide.package, (igPackage) => {
            const references = _.chain(igPackage.resource)
                .filter((resource) => !!resource.sourceReference && !!resource.sourceReference.reference)
                .map((resource) => resource.sourceReference.reference)
                .value();

            _.each(references, (reference) => {
                const parsed = FhirHelper.parseUrl(reference);
                const resourceUrl = FhirHelper.buildUrl(this.fhirServerBase, parsed.resourceType, parsed.id);
                const resourcePromise = rp({ url: resourceUrl, json: true, resolveWithFullResponse: true });
                promises.push(resourcePromise);
            });
        });

        return Promise.all(promises);
    }

    private _getR4Resources(implementationGuide: R4ImplementationGuide) {
        if (!implementationGuide.definition) {
            return Promise.resolve([]);
        }

        const promises = _.chain(implementationGuide.definition.resource)
            .filter((resource) => !!resource.reference && !!resource.reference.reference)
            .map((resource) => {
                const reference = resource.reference.reference;
                const parsed = FhirHelper.parseUrl(reference);
                const resourceUrl = FhirHelper.buildUrl(this.fhirServerBase, parsed.resourceType, parsed.id);
                const resourcePromise = rp({ url: resourceUrl, json: true, resolveWithFullResponse: true });
                return resourcePromise;
            })
            .value();

        return Promise.all(promises);
    }

    public getBundle() {
        return new Promise((resolve, reject) => {
            const igUrl = FhirHelper.buildUrl(this.fhirServerBase, 'ImplementationGuide', this.implementationGuideId);
            const fhirServerConfig = _.find(this.fhirConfig.servers, (serverConfig) => {
                return serverConfig.id === this.fhirServerId;
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
                    const resourceEntries = _.chain(responses)
                        .filter((response) => {
                            return !!response.body && !!response.body.resourceType;
                        })
                        .map((response) => {
                            let fullUrl = response.headers['content-location'];

                            if (!fullUrl) {
                                fullUrl = FhirHelper.joinUrl(this.fhirServerBase, response.body.resourceType, response.body.id);

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
                        this.log.error(`Expected ${responses.length} entries in the export bundle, but only returning ${resourceEntries.length}. Some resources could not be returned in the bundle due to the response from the server.`);
                    }

                    const bundle = {
                        resourceType: 'Bundle',
                        type: 'collection',
                        total: resourceEntries.length + 1,
                        entry: [{ fullUrl: implementationGuideFullUrl, resource: implementationGuide }].concat(resourceEntries)
                    };

                    resolve(bundle);
                })
                .catch((err) => {
                    if (err && err.response && err.response.body) {
                        const errBody = <OperationOutcome> err.response.body;
                        const issueTexts = _.map(errBody.issue, (issue) => issue.diagnostics);

                        if (issueTexts.length > 0) {
                            reject(issueTexts.join(' & '));
                        } else if (errBody.text && errBody.text.div) {
                            reject(errBody.text.div);
                        } else {
                            this.log.error(errBody);
                            reject('Unknown error returned by FHIR server when getting resources for implementation guide');
                        }
                    } else {
                        this.log.error(err);
                        reject(err);
                    }
                });
        });
    }

    public export(format: 'json'|'xml'|'application/json'|'application/fhir+json'|'application/xml'|'application/fhir+xml' = 'json') {
        return new Promise((resolve, reject) => {
            this.getBundle()
                .then((results) => {
                    let response = results;

                    if (format === 'xml' || format === 'application/xml') {
                        response = this.fhir.objToXml(results);
                    }

                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}