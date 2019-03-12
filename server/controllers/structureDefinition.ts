import * as nanoid from 'nanoid';
import * as express from 'express';
import * as AuthHelper from '../authHelper';
import * as rp from 'request-promise';
import * as config from 'config';
import * as semver from 'semver';
import * as _ from 'underscore';
import * as FhirHelper from '../fhirHelper';
import {FhirLogic} from './fhirLogic';
import {RequestHandler} from 'express';
import {ExtendedRequest, Fhir, FhirConfig, RequestOptions, RestRejection} from './models';
import {ConfigController} from './config';
import {checkJwt} from '../authHelper';

const fhirConfig = <FhirConfig> config.get('fhir');

export interface StructureDefinitionOptions {
    implementationGuides: [{
        id: string;
        isNew: boolean;
        isRemoved: boolean;
    }];
}

export interface SaveStructureDefinitionRequest {
    options?: StructureDefinitionOptions;
    resource: Fhir.StructureDefinition;
}

export class StructureDefinitionController extends FhirLogic {
    private fhirServerVersion: string;

    public static initRoutes() {
        const router = express.Router();

        router.get('/', <RequestHandler> checkJwt, (req: ExtendedRequest, res) => {
            FhirLogic.log.trace(`Searching for resource StructureDefinition`);

            const fhirLogic = new this('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            fhirLogic.search(req.query)
                .then((results) => res.send(results))
                .catch((err) => FhirLogic.handleError(err, null, res));
        });

        router.get('/:id', <RequestHandler> checkJwt, (req: ExtendedRequest, res) => {
            FhirLogic.log.trace(`Retrieving resource StructureDefinition/${req.params.id}`);

            const fhirLogic = new this('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            fhirLogic.get(req.params.id, req.query)
                .then((results) => res.send(results))
                .catch((err) => FhirLogic.handleError(err, null, res));
        });

        router.post('/', <RequestHandler> checkJwt, (req: ExtendedRequest, res) => {
            FhirLogic.log.trace(`Creating resource StructureDefinition`);

            const fhirLogic = new this('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            fhirLogic.create(req.body, req.query)
                .then((results) => res.send(results))
                .catch((err) => FhirLogic.handleError(err, null, res));
        });

        router.put('/:id', <RequestHandler> checkJwt, (req: ExtendedRequest, res) => {
            FhirLogic.log.trace(`Updating resource StructureDefinition/${req.params.id}`);

            const fhirLogic = new this('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            fhirLogic.update(req.params.id, req.body, req.query)
                .then((results) => res.send(results))
                .catch((err) => FhirLogic.handleError(err, null, res));
        });

        router.delete('/:id', <RequestHandler> checkJwt, (req: ExtendedRequest, res) => {
            FhirLogic.log.trace(`Deleting resource StructureDefinition/${req.params.id}`);

            const fhirLogic = new this('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            fhirLogic.delete(req.params.id, req.query)
                .then((results) => res.send(results))
                .catch((err) => FhirLogic.handleError(err, null, res));
        });

        router.get('/base/:id', <RequestHandler> AuthHelper.checkJwt, <RequestHandler> (req: ExtendedRequest, res) => {
            const controller = new StructureDefinitionController('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            controller.getBaseStructureDefinition(req.params.id)
                .then((results) => res.send(results))
                .catch((err) => StructureDefinitionController.handleError(err, null, res));
        });

        return router;
    }

    constructor(resourceType: string, baseUrl: string, fhirServerVersion: string) {
        super(resourceType, baseUrl);

        this.fhirServerVersion = fhirServerVersion;
    }

    /**
     * Adds a structure definition to the specified implementation guide
     * @param structureDefinition The structure definition to add (must have an id)
     * @param implementationGuideId The id of the implementation guide to add the structure definition to
     */
    private addToImplementationGuide(structureDefinition, implementationGuideId): Promise<any> {
        return new Promise((resolve, reject) => {
            const options = <RequestOptions> {
                url: FhirHelper.buildUrl(this.baseUrl, 'ImplementationGuide', implementationGuideId),
                method: 'GET',
                json: true
            };

            rp(options)
                .then((implementationGuide: Fhir.ImplementationGuide) => {
                    this.assertEditingAllowed(implementationGuide);

                    if (this.fhirServerVersion !== 'stu3') {        // r4+
                        const r4 = <Fhir.R4.ImplementationGuide> implementationGuide;

                        if (!r4.definition) {
                            r4.definition = { resource: [] };
                        }

                        if (!r4.definition.resource) {
                            r4.definition.resource = [];
                        }

                        const foundResource = _.find(r4.definition.resource, (resource) => {
                            if (resource.reference) {
                                return resource.reference.reference === `StructureDefinition/${structureDefinition.id}`;
                            }
                        });

                        if (!foundResource) {
                            r4.definition.resource.push({
                                reference: {
                                    reference: `StructureDefinition/${structureDefinition.id}`,
                                    display: structureDefinition.title || structureDefinition.name
                                }
                            });
                        }
                    } else {                                        // stu3
                        const stu3 = <Fhir.STU3.ImplementationGuide> implementationGuide;

                        if (!stu3.package) {
                            stu3.package = [];
                        }

                        const foundInPackages = _.filter(stu3.package, (igPackage) => {
                            return _.filter(igPackage.resource, (resource) => {
                                if (resource.sourceReference && resource.sourceReference.reference) {
                                    return resource.sourceReference.reference === `StructureDefinition/${structureDefinition.id}`;
                                }
                            }).length > 0;
                        });

                        if (foundInPackages.length === 0) {
                            const newResource = <Fhir.STU3.ImplementationGuidePackageResource> {
                                name: structureDefinition.title || structureDefinition.name,
                                sourceReference: {
                                    reference: `StructureDefinition/${structureDefinition.id}`,
                                    display: structureDefinition.title || structureDefinition.name
                                }
                            };

                            if (stu3.package.length === 0) {
                                stu3.package.push({
                                    name: 'Default Package',
                                    resource: [newResource]
                                });
                            } else {
                                if (!stu3.package[0].resource) {
                                    stu3.package[0].resource = [];
                                }

                                stu3.package[0].resource.push(newResource);
                            }
                        }
                    }

                    options.method = 'PUT';
                    options.body = implementationGuide;

                    return rp(options);
                })
                .then((results) => resolve(results))
                .catch((err) => reject(err));
        });
    }

    /**
     * Removes the structure definition from the specified implementation guide
     * @param structureDefinition The structure definition to remove (must have an id)
     * @param implementationGuideId The id of the implementation guide to remove the structure definition from
     */
    private removeFromImplementationGuide(structureDefinition, implementationGuideId): Promise<any> {
        return new Promise((resolve, reject) => {
            const options = <RequestOptions> {
                url: FhirHelper.buildUrl(this.baseUrl, 'ImplementationGuide', implementationGuideId),
                method: 'GET',
                json: true
            };

            rp(options)
                .then((implementationGuide: Fhir.ImplementationGuide) => {
                    this.assertEditingAllowed(implementationGuide);

                    if (this.fhirServerVersion !== 'stu3') {                // r4+
                        const r4 = <Fhir.R4.ImplementationGuide> implementationGuide;

                        if (!r4.definition) {
                            r4.definition = { resource: [] };
                        }

                        if (!r4.definition.resource) {
                            r4.definition.resource = [];
                        }

                        const foundResource = _.find(r4.definition.resource, (resource) => {
                            if (resource.reference) {
                                return resource.reference.reference === `StructureDefinition/${structureDefinition.id}`;
                            }
                        });

                        if (foundResource) {
                            const index = r4.definition.resource.indexOf(foundResource);
                            r4.definition.resource.splice(index, 1);
                        }
                    } else {                                                // stu3
                        const stu3 = <Fhir.STU3.ImplementationGuide> implementationGuide;

                        if (!stu3.package) {
                            stu3.package = [];
                        }

                        _.each(stu3.package, (igPackage) => {
                            const foundResource = _.find(igPackage.resource, (resource) => {
                                if (resource.sourceReference && resource.sourceReference.reference) {
                                    return resource.sourceReference.reference === `StructureDefinition/${structureDefinition.id}`;
                                }
                            });

                            if (foundResource) {
                                const index = igPackage.resource.indexOf(foundResource);
                                igPackage.resource.splice(index, 1);
                            }
                        });
                    }

                    options.method = 'PUT';
                    options.body = implementationGuide;

                    return rp(options);
                })
                .then((results) => resolve(results))
                .catch((err) => reject(err));
        });
    }

    private saveStructureDefinition(id: string, structureDefinition: Fhir.StructureDefinition, options?: StructureDefinitionOptions) {
        return new Promise((resolve, reject) => {
            this.assertEditingAllowed(structureDefinition);

            if (!structureDefinition) {
                throw <RestRejection> { statusCode: 400, message: 'A structureDefinition property is required' };
            }

            if (!structureDefinition.id) {
                structureDefinition.id = id;
            }

            let updatedStructureDefinition;
            const updateOptions = <RequestOptions> {
                url: FhirHelper.buildUrl(this.baseUrl, this.resourceType, id),
                method: 'PUT',
                json: true,
                body: structureDefinition,
                resolveWithFullResponse: true
            };

            rp(updateOptions)
                .then((results) => {
                    const location = results.headers.location || results.headers['content-location'];

                    if (!location) {
                        throw new Error(`FHIR server did not respond with a location to the newly created ${this.resourceType}`);
                    }

                    return rp({
                        url: location,
                        method: 'GET',
                        json: true
                    });
                })
                .then((results) => {
                    updatedStructureDefinition = results;

                    const igUpdatePromises = [];

                    if (options) {
                        _.each(options.implementationGuides, (implementationGuide) => {
                            if (implementationGuide.isNew) {
                                igUpdatePromises.push(this.addToImplementationGuide(updatedStructureDefinition, implementationGuide.id));
                            } else if (implementationGuide.isRemoved) {
                                igUpdatePromises.push(this.removeFromImplementationGuide(updatedStructureDefinition, implementationGuide.id));
                            }
                        });
                    }

                    return Promise.all(igUpdatePromises);
                })
                .then(() => resolve(updatedStructureDefinition))
                .catch((err) => reject(err));
        });
    }

    public getBaseStructureDefinition(id: string): Promise<Fhir.StructureDefinition> {
        return new Promise((resolve, reject) => {
            const configController = new ConfigController(this.baseUrl);
            configController.getFhirCapabilities()
                .then((capabilities) => {
                    const publishedFhirVersion = _.find(fhirConfig.publishedVersions, (publishedVersion) => {
                        return semver.satisfies(capabilities.fhirVersion, publishedVersion.version);
                    });

                    if (!publishedFhirVersion) {
                        throw <RestRejection> { statusCode: 400, message: 'Unsupported FHIR version ' + capabilities.fhirVersion };
                    }

                    return rp({
                        url: publishedFhirVersion.url + '/' + id + '.profile.json',
                        method: 'GET',
                        json: true
                    });
                })
                .then((baseStructureDefinition) => resolve(baseStructureDefinition))
                .catch((err) => reject(err));
        });
    }

    protected prepareSearchQuery(query?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            super.prepareSearchQuery(query)
                .then((preparedQuery) => {
                    if (preparedQuery.implementationGuideId) {
                        preparedQuery['_has:ImplementationGuide:resource:_id'] = preparedQuery.implementationGuideId;
                        delete preparedQuery.implementationGuideId;
                    }

                    resolve(preparedQuery);
                })
                .catch((err) => reject(err));
        });
    }

    public get(id: string, query?: any) {
        return new Promise((resolve, reject) => {
            const url = FhirHelper.buildUrl(this.baseUrl, this.resourceType, id, null, query);
            const requestOptions = {
                url: url,
                method: 'GET',
                json: true,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            };
            let structureDefinition;

            rp(requestOptions)
                .then((results) => {
                    structureDefinition = results;

                    return rp({
                        url: FhirHelper.buildUrl(this.baseUrl, 'ImplementationGuide', null, null, { resource: `StructureDefinition/${id}` }),
                        method: 'GET',
                        json: true,
                        headers: {
                            'Cache-Control': 'no-cache'
                        }
                    });
                })
                .then((results: Fhir.Bundle) => {
                    const options = results ? {
                        implementationGuides: _.map(results && results.entry ? results.entry : [], (entry) => {
                            return {
                                name: (<Fhir.ImplementationGuide> entry.resource).name,
                                id: entry.resource.id
                            };
                        })
                    } : null;

                    resolve({
                        resource: structureDefinition,
                        options: options
                    });
                })
                .catch((err) => reject(err));
        });
    }

    public create(data: SaveStructureDefinitionRequest, query?: any): Promise<any> {
        return this.saveStructureDefinition(nanoid(8), data.resource, data.options);
    }

    public update(id: string, data: SaveStructureDefinitionRequest, query?: any): Promise<any> {
        return this.saveStructureDefinition(id, data.resource, data.options);
    }
}