"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid = require("nanoid");
const express = require("express");
const AuthHelper = require("../authHelper");
const rp = require("request-promise");
const config = require("config");
const semver = require("semver");
const _ = require("underscore");
const FhirHelper = require("../fhirHelper");
const fhirLogic_1 = require("./fhirLogic");
const config_1 = require("./config");
const authHelper_1 = require("../authHelper");
const fhirConfig = config.get('fhir');
class StructureDefinitionController extends fhirLogic_1.FhirLogic {
    static initRoutes() {
        const router = express.Router();
        router.get('/', authHelper_1.checkJwt, (req, res) => {
            fhirLogic_1.FhirLogic.log.trace(`Searching for resource StructureDefinition`);
            const fhirLogic = new this('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            fhirLogic.search(req.query)
                .then((results) => res.send(results))
                .catch((err) => fhirLogic_1.FhirLogic.handleError(err, null, res));
        });
        router.get('/:id', authHelper_1.checkJwt, (req, res) => {
            fhirLogic_1.FhirLogic.log.trace(`Retrieving resource StructureDefinition/${req.params.id}`);
            const fhirLogic = new this('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            fhirLogic.get(req.params.id, req.query)
                .then((results) => res.send(results))
                .catch((err) => fhirLogic_1.FhirLogic.handleError(err, null, res));
        });
        router.post('/', authHelper_1.checkJwt, (req, res) => {
            fhirLogic_1.FhirLogic.log.trace(`Creating resource StructureDefinition`);
            const fhirLogic = new this('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            fhirLogic.create(req.body, req.query)
                .then((results) => res.send(results))
                .catch((err) => fhirLogic_1.FhirLogic.handleError(err, null, res));
        });
        router.put('/:id', authHelper_1.checkJwt, (req, res) => {
            fhirLogic_1.FhirLogic.log.trace(`Updating resource StructureDefinition/${req.params.id}`);
            const fhirLogic = new this('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            fhirLogic.update(req.params.id, req.body, req.query)
                .then((results) => res.send(results))
                .catch((err) => fhirLogic_1.FhirLogic.handleError(err, null, res));
        });
        router.delete('/:id', authHelper_1.checkJwt, (req, res) => {
            fhirLogic_1.FhirLogic.log.trace(`Deleting resource StructureDefinition/${req.params.id}`);
            const fhirLogic = new this('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            fhirLogic.delete(req.params.id, req.query)
                .then((results) => res.send(results))
                .catch((err) => fhirLogic_1.FhirLogic.handleError(err, null, res));
        });
        router.get('/base/:id', AuthHelper.checkJwt, (req, res) => {
            const controller = new StructureDefinitionController('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            controller.getBaseStructureDefinition(req.params.id)
                .then((results) => res.send(results))
                .catch((err) => StructureDefinitionController.handleError(err, null, res));
        });
        return router;
    }
    constructor(resourceType, baseUrl, fhirServerVersion) {
        super(resourceType, baseUrl);
        this.fhirServerVersion = fhirServerVersion;
    }
    /**
     * Adds a structure definition to the specified implementation guide
     * @param structureDefinition The structure definition to add (must have an id)
     * @param implementationGuideId The id of the implementation guide to add the structure definition to
     */
    addToImplementationGuide(structureDefinition, implementationGuideId) {
        return new Promise((resolve, reject) => {
            const options = {
                url: FhirHelper.buildUrl(this.baseUrl, 'ImplementationGuide', implementationGuideId),
                method: 'GET',
                json: true
            };
            rp(options)
                .then((implementationGuide) => {
                this.assertEditingAllowed(implementationGuide);
                if (this.fhirServerVersion !== 'stu3') { // r4+
                    const r4 = implementationGuide;
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
                }
                else { // stu3
                    const stu3 = implementationGuide;
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
                        const newResource = {
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
                        }
                        else {
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
    removeFromImplementationGuide(structureDefinition, implementationGuideId) {
        return new Promise((resolve, reject) => {
            const options = {
                url: FhirHelper.buildUrl(this.baseUrl, 'ImplementationGuide', implementationGuideId),
                method: 'GET',
                json: true
            };
            rp(options)
                .then((implementationGuide) => {
                this.assertEditingAllowed(implementationGuide);
                if (this.fhirServerVersion !== 'stu3') { // r4+
                    const r4 = implementationGuide;
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
                }
                else { // stu3
                    const stu3 = implementationGuide;
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
    saveStructureDefinition(id, structureDefinition, options) {
        return new Promise((resolve, reject) => {
            this.assertEditingAllowed(structureDefinition);
            if (!structureDefinition) {
                throw { statusCode: 400, message: 'A structureDefinition property is required' };
            }
            if (!structureDefinition.id) {
                structureDefinition.id = id;
            }
            let updatedStructureDefinition;
            const updateOptions = {
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
                        }
                        else if (implementationGuide.isRemoved) {
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
    getBaseStructureDefinition(id) {
        return new Promise((resolve, reject) => {
            const configController = new config_1.ConfigController(this.baseUrl);
            configController.getFhirCapabilities()
                .then((capabilities) => {
                const publishedFhirVersion = _.find(fhirConfig.publishedVersions, (publishedVersion) => {
                    return semver.satisfies(capabilities.fhirVersion, publishedVersion.version);
                });
                if (!publishedFhirVersion) {
                    throw { statusCode: 400, message: 'Unsupported FHIR version ' + capabilities.fhirVersion };
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
    prepareSearchQuery(query) {
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
    get(id, query) {
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
                .then((results) => {
                const options = results ? {
                    implementationGuides: _.map(results && results.entry ? results.entry : [], (entry) => {
                        return {
                            name: entry.resource.name,
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
    create(data, query) {
        return this.saveStructureDefinition(nanoid(8), data.resource, data.options);
    }
    update(id, data, query) {
        return this.saveStructureDefinition(id, data.resource, data.options);
    }
}
exports.StructureDefinitionController = StructureDefinitionController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RydWN0dXJlRGVmaW5pdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0cnVjdHVyZURlZmluaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsbUNBQW1DO0FBQ25DLDRDQUE0QztBQUM1QyxzQ0FBc0M7QUFDdEMsaUNBQWlDO0FBQ2pDLGlDQUFpQztBQUNqQyxnQ0FBZ0M7QUFDaEMsNENBQTRDO0FBQzVDLDJDQUFzQztBQUd0QyxxQ0FBMEM7QUFDMUMsOENBQXVDO0FBRXZDLE1BQU0sVUFBVSxHQUFnQixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBZW5ELE1BQWEsNkJBQThCLFNBQVEscUJBQVM7SUFHakQsTUFBTSxDQUFDLFVBQVU7UUFDcEIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWhDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFtQixxQkFBUSxFQUFFLENBQUMsR0FBb0IsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUNyRSxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUVsRSxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzdGLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztpQkFDdEIsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNwQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLHFCQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFtQixxQkFBUSxFQUFFLENBQUMsR0FBb0IsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4RSxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsMkNBQTJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVoRixNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzdGLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQztpQkFDbEMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNwQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLHFCQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFtQixxQkFBUSxFQUFFLENBQUMsR0FBb0IsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN0RSxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztZQUU3RCxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzdGLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDO2lCQUNoQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3BDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMscUJBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQW1CLHFCQUFRLEVBQUUsQ0FBQyxHQUFvQixFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ3hFLHFCQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTlFLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDN0YsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUM7aUJBQy9DLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDcEMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxxQkFBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBbUIscUJBQVEsRUFBRSxDQUFDLEdBQW9CLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDM0UscUJBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFOUUsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUM3RixTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUM7aUJBQ3JDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDcEMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxxQkFBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBbUIsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFrQixHQUFvQixFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ3pHLE1BQU0sVUFBVSxHQUFHLElBQUksNkJBQTZCLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUN2SCxVQUFVLENBQUMsMEJBQTBCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7aUJBQy9DLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDcEMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25GLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELFlBQVksWUFBb0IsRUFBRSxPQUFlLEVBQUUsaUJBQXlCO1FBQ3hFLEtBQUssQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFN0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0lBQy9DLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssd0JBQXdCLENBQUMsbUJBQW1CLEVBQUUscUJBQXFCO1FBQ3ZFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsTUFBTSxPQUFPLEdBQW9CO2dCQUM3QixHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLHFCQUFxQixDQUFDO2dCQUNwRixNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsSUFBSTthQUNiLENBQUM7WUFFRixFQUFFLENBQUMsT0FBTyxDQUFDO2lCQUNOLElBQUksQ0FBQyxDQUFDLG1CQUE2QyxFQUFFLEVBQUU7Z0JBQ3BELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxNQUFNLEVBQUUsRUFBUyxNQUFNO29CQUNsRCxNQUFNLEVBQUUsR0FBaUMsbUJBQW1CLENBQUM7b0JBRTdELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFO3dCQUNoQixFQUFFLENBQUMsVUFBVSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDO3FCQUNwQztvQkFFRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7d0JBQ3pCLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztxQkFDL0I7b0JBRUQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO3dCQUM5RCxJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUU7NEJBQ3BCLE9BQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEtBQUssdUJBQXVCLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxDQUFDO3lCQUMzRjtvQkFDTCxDQUFDLENBQUMsQ0FBQztvQkFFSCxJQUFJLENBQUMsYUFBYSxFQUFFO3dCQUNoQixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7NEJBQ3hCLFNBQVMsRUFBRTtnQ0FDUCxTQUFTLEVBQUUsdUJBQXVCLG1CQUFtQixDQUFDLEVBQUUsRUFBRTtnQ0FDMUQsT0FBTyxFQUFFLG1CQUFtQixDQUFDLEtBQUssSUFBSSxtQkFBbUIsQ0FBQyxJQUFJOzZCQUNqRTt5QkFDSixDQUFDLENBQUM7cUJBQ047aUJBQ0o7cUJBQU0sRUFBeUMsT0FBTztvQkFDbkQsTUFBTSxJQUFJLEdBQW1DLG1CQUFtQixDQUFDO29CQUVqRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDZixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztxQkFDckI7b0JBRUQsTUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUU7d0JBQ3pELE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUU7NEJBQzdDLElBQUksUUFBUSxDQUFDLGVBQWUsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRTtnQ0FDaEUsT0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsS0FBSyx1QkFBdUIsbUJBQW1CLENBQUMsRUFBRSxFQUFFLENBQUM7NkJBQ2pHO3dCQUNMLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7b0JBQ2xCLENBQUMsQ0FBQyxDQUFDO29CQUVILElBQUksZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7d0JBQzlCLE1BQU0sV0FBVyxHQUFrRDs0QkFDL0QsSUFBSSxFQUFFLG1CQUFtQixDQUFDLEtBQUssSUFBSSxtQkFBbUIsQ0FBQyxJQUFJOzRCQUMzRCxlQUFlLEVBQUU7Z0NBQ2IsU0FBUyxFQUFFLHVCQUF1QixtQkFBbUIsQ0FBQyxFQUFFLEVBQUU7Z0NBQzFELE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxLQUFLLElBQUksbUJBQW1CLENBQUMsSUFBSTs2QkFDakU7eUJBQ0osQ0FBQzt3QkFFRixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs0QkFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0NBQ2QsSUFBSSxFQUFFLGlCQUFpQjtnQ0FDdkIsUUFBUSxFQUFFLENBQUMsV0FBVyxDQUFDOzZCQUMxQixDQUFDLENBQUM7eUJBQ047NkJBQU07NEJBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO2dDQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7NkJBQ2pDOzRCQUVELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt5QkFDOUM7cUJBQ0o7aUJBQ0o7Z0JBRUQsT0FBTyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsbUJBQW1CLENBQUM7Z0JBRW5DLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDbkMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssNkJBQTZCLENBQUMsbUJBQW1CLEVBQUUscUJBQXFCO1FBQzVFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsTUFBTSxPQUFPLEdBQW9CO2dCQUM3QixHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLHFCQUFxQixDQUFDO2dCQUNwRixNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsSUFBSTthQUNiLENBQUM7WUFFRixFQUFFLENBQUMsT0FBTyxDQUFDO2lCQUNOLElBQUksQ0FBQyxDQUFDLG1CQUE2QyxFQUFFLEVBQUU7Z0JBQ3BELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxNQUFNLEVBQUUsRUFBaUIsTUFBTTtvQkFDMUQsTUFBTSxFQUFFLEdBQWlDLG1CQUFtQixDQUFDO29CQUU3RCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRTt3QkFDaEIsRUFBRSxDQUFDLFVBQVUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQztxQkFDcEM7b0JBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFO3dCQUN6QixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7cUJBQy9CO29CQUVELE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRTt3QkFDOUQsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFOzRCQUNwQixPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxLQUFLLHVCQUF1QixtQkFBbUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQzt5QkFDM0Y7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBRUgsSUFBSSxhQUFhLEVBQUU7d0JBQ2YsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUM1RCxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUMzQztpQkFDSjtxQkFBTSxFQUFpRCxPQUFPO29CQUMzRCxNQUFNLElBQUksR0FBbUMsbUJBQW1CLENBQUM7b0JBRWpFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO3FCQUNyQjtvQkFFRCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRTt3QkFDL0IsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUU7NEJBQzFELElBQUksUUFBUSxDQUFDLGVBQWUsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRTtnQ0FDaEUsT0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsS0FBSyx1QkFBdUIsbUJBQW1CLENBQUMsRUFBRSxFQUFFLENBQUM7NkJBQ2pHO3dCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUVILElBQUksYUFBYSxFQUFFOzRCQUNmLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOzRCQUN4RCxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ3ZDO29CQUNMLENBQUMsQ0FBQyxDQUFDO2lCQUNOO2dCQUVELE9BQU8sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixPQUFPLENBQUMsSUFBSSxHQUFHLG1CQUFtQixDQUFDO2dCQUVuQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QixDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ25DLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sdUJBQXVCLENBQUMsRUFBVSxFQUFFLG1CQUE2QyxFQUFFLE9BQW9DO1FBQzNILE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFFL0MsSUFBSSxDQUFDLG1CQUFtQixFQUFFO2dCQUN0QixNQUFzQixFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLDRDQUE0QyxFQUFFLENBQUM7YUFDcEc7WUFFRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRSxFQUFFO2dCQUN6QixtQkFBbUIsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO2FBQy9CO1lBRUQsSUFBSSwwQkFBMEIsQ0FBQztZQUMvQixNQUFNLGFBQWEsR0FBb0I7Z0JBQ25DLEdBQUcsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUM7Z0JBQzdELE1BQU0sRUFBRSxLQUFLO2dCQUNiLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxtQkFBbUI7Z0JBQ3pCLHVCQUF1QixFQUFFLElBQUk7YUFDaEMsQ0FBQztZQUVGLEVBQUUsQ0FBQyxhQUFhLENBQUM7aUJBQ1osSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ2QsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUVqRixJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsb0VBQW9FLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO2lCQUM1RztnQkFFRCxPQUFPLEVBQUUsQ0FBQztvQkFDTixHQUFHLEVBQUUsUUFBUTtvQkFDYixNQUFNLEVBQUUsS0FBSztvQkFDYixJQUFJLEVBQUUsSUFBSTtpQkFDYixDQUFDLENBQUM7WUFDUCxDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ2QsMEJBQTBCLEdBQUcsT0FBTyxDQUFDO2dCQUVyQyxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztnQkFFNUIsSUFBSSxPQUFPLEVBQUU7b0JBQ1QsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFO3dCQUN6RCxJQUFJLG1CQUFtQixDQUFDLEtBQUssRUFBRTs0QkFDM0IsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQywwQkFBMEIsRUFBRSxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3lCQUM1Rzs2QkFBTSxJQUFJLG1CQUFtQixDQUFDLFNBQVMsRUFBRTs0QkFDdEMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQywwQkFBMEIsRUFBRSxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3lCQUNqSDtvQkFDTCxDQUFDLENBQUMsQ0FBQztpQkFDTjtnQkFFRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO2lCQUMvQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLDBCQUEwQixDQUFDLEVBQVU7UUFDeEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuQyxNQUFNLGdCQUFnQixHQUFHLElBQUkseUJBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVELGdCQUFnQixDQUFDLG1CQUFtQixFQUFFO2lCQUNqQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRTtnQkFDbkIsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7b0JBQ25GLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNoRixDQUFDLENBQUMsQ0FBQztnQkFFSCxJQUFJLENBQUMsb0JBQW9CLEVBQUU7b0JBQ3ZCLE1BQXNCLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsMkJBQTJCLEdBQUcsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO2lCQUM5RztnQkFFRCxPQUFPLEVBQUUsQ0FBQztvQkFDTixHQUFHLEVBQUUsb0JBQW9CLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsZUFBZTtvQkFDMUQsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsSUFBSSxFQUFFLElBQUk7aUJBQ2IsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxDQUFDLHVCQUF1QixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztpQkFDbkUsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFUyxrQkFBa0IsQ0FBQyxLQUFXO1FBQ3BDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQztpQkFDMUIsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQ3BCLElBQUksYUFBYSxDQUFDLHFCQUFxQixFQUFFO29CQUNyQyxhQUFhLENBQUMsdUNBQXVDLENBQUMsR0FBRyxhQUFhLENBQUMscUJBQXFCLENBQUM7b0JBQzdGLE9BQU8sYUFBYSxDQUFDLHFCQUFxQixDQUFDO2lCQUM5QztnQkFFRCxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sR0FBRyxDQUFDLEVBQVUsRUFBRSxLQUFXO1FBQzlCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsRixNQUFNLGNBQWMsR0FBRztnQkFDbkIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsT0FBTyxFQUFFO29CQUNMLGVBQWUsRUFBRSxVQUFVO2lCQUM5QjthQUNKLENBQUM7WUFDRixJQUFJLG1CQUFtQixDQUFDO1lBRXhCLEVBQUUsQ0FBQyxjQUFjLENBQUM7aUJBQ2IsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ2QsbUJBQW1CLEdBQUcsT0FBTyxDQUFDO2dCQUU5QixPQUFPLEVBQUUsQ0FBQztvQkFDTixHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsdUJBQXVCLEVBQUUsRUFBRSxFQUFFLENBQUM7b0JBQ3BILE1BQU0sRUFBRSxLQUFLO29CQUNiLElBQUksRUFBRSxJQUFJO29CQUNWLE9BQU8sRUFBRTt3QkFDTCxlQUFlLEVBQUUsVUFBVTtxQkFDOUI7aUJBQ0osQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxDQUFDLE9BQW9CLEVBQUUsRUFBRTtnQkFDM0IsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7d0JBQ2pGLE9BQU87NEJBQ0gsSUFBSSxFQUE4QixLQUFLLENBQUMsUUFBUyxDQUFDLElBQUk7NEJBQ3RELEVBQUUsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7eUJBQ3hCLENBQUM7b0JBQ04sQ0FBQyxDQUFDO2lCQUNMLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFFVCxPQUFPLENBQUM7b0JBQ0osUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsT0FBTyxFQUFFLE9BQU87aUJBQ25CLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLE1BQU0sQ0FBQyxJQUFvQyxFQUFFLEtBQVc7UUFDM0QsT0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFTSxNQUFNLENBQUMsRUFBVSxFQUFFLElBQW9DLEVBQUUsS0FBVztRQUN2RSxPQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekUsQ0FBQztDQUNKO0FBdlhELHNFQXVYQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG5hbm9pZCBmcm9tICduYW5vaWQnO1xyXG5pbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgKiBhcyBBdXRoSGVscGVyIGZyb20gJy4uL2F1dGhIZWxwZXInO1xyXG5pbXBvcnQgKiBhcyBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xyXG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnY29uZmlnJztcclxuaW1wb3J0ICogYXMgc2VtdmVyIGZyb20gJ3NlbXZlcic7XHJcbmltcG9ydCAqIGFzIF8gZnJvbSAndW5kZXJzY29yZSc7XHJcbmltcG9ydCAqIGFzIEZoaXJIZWxwZXIgZnJvbSAnLi4vZmhpckhlbHBlcic7XHJcbmltcG9ydCB7RmhpckxvZ2ljfSBmcm9tICcuL2ZoaXJMb2dpYyc7XHJcbmltcG9ydCB7UmVxdWVzdEhhbmRsZXJ9IGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQge0V4dGVuZGVkUmVxdWVzdCwgRmhpciwgRmhpckNvbmZpZywgUmVxdWVzdE9wdGlvbnMsIFJlc3RSZWplY3Rpb259IGZyb20gJy4vbW9kZWxzJztcclxuaW1wb3J0IHtDb25maWdDb250cm9sbGVyfSBmcm9tICcuL2NvbmZpZyc7XHJcbmltcG9ydCB7Y2hlY2tKd3R9IGZyb20gJy4uL2F1dGhIZWxwZXInO1xyXG5cclxuY29uc3QgZmhpckNvbmZpZyA9IDxGaGlyQ29uZmlnPiBjb25maWcuZ2V0KCdmaGlyJyk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0cnVjdHVyZURlZmluaXRpb25PcHRpb25zIHtcclxuICAgIGltcGxlbWVudGF0aW9uR3VpZGVzOiBbe1xyXG4gICAgICAgIGlkOiBzdHJpbmc7XHJcbiAgICAgICAgaXNOZXc6IGJvb2xlYW47XHJcbiAgICAgICAgaXNSZW1vdmVkOiBib29sZWFuO1xyXG4gICAgfV07XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2F2ZVN0cnVjdHVyZURlZmluaXRpb25SZXF1ZXN0IHtcclxuICAgIG9wdGlvbnM/OiBTdHJ1Y3R1cmVEZWZpbml0aW9uT3B0aW9ucztcclxuICAgIHJlc291cmNlOiBGaGlyLlN0cnVjdHVyZURlZmluaXRpb247XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdHJ1Y3R1cmVEZWZpbml0aW9uQ29udHJvbGxlciBleHRlbmRzIEZoaXJMb2dpYyB7XHJcbiAgICBwcml2YXRlIGZoaXJTZXJ2ZXJWZXJzaW9uOiBzdHJpbmc7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0Um91dGVzKCkge1xyXG4gICAgICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG4gICAgICAgIHJvdXRlci5nZXQoJy8nLCA8UmVxdWVzdEhhbmRsZXI+IGNoZWNrSnd0LCAocmVxOiBFeHRlbmRlZFJlcXVlc3QsIHJlcykgPT4ge1xyXG4gICAgICAgICAgICBGaGlyTG9naWMubG9nLnRyYWNlKGBTZWFyY2hpbmcgZm9yIHJlc291cmNlIFN0cnVjdHVyZURlZmluaXRpb25gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZoaXJMb2dpYyA9IG5ldyB0aGlzKCdTdHJ1Y3R1cmVEZWZpbml0aW9uJywgcmVxLmZoaXJTZXJ2ZXJCYXNlLCByZXEuZmhpclNlcnZlclZlcnNpb24pO1xyXG4gICAgICAgICAgICBmaGlyTG9naWMuc2VhcmNoKHJlcS5xdWVyeSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiByZXMuc2VuZChyZXN1bHRzKSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiBGaGlyTG9naWMuaGFuZGxlRXJyb3IoZXJyLCBudWxsLCByZXMpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcm91dGVyLmdldCgnLzppZCcsIDxSZXF1ZXN0SGFuZGxlcj4gY2hlY2tKd3QsIChyZXE6IEV4dGVuZGVkUmVxdWVzdCwgcmVzKSA9PiB7XHJcbiAgICAgICAgICAgIEZoaXJMb2dpYy5sb2cudHJhY2UoYFJldHJpZXZpbmcgcmVzb3VyY2UgU3RydWN0dXJlRGVmaW5pdGlvbi8ke3JlcS5wYXJhbXMuaWR9YCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmaGlyTG9naWMgPSBuZXcgdGhpcygnU3RydWN0dXJlRGVmaW5pdGlvbicsIHJlcS5maGlyU2VydmVyQmFzZSwgcmVxLmZoaXJTZXJ2ZXJWZXJzaW9uKTtcclxuICAgICAgICAgICAgZmhpckxvZ2ljLmdldChyZXEucGFyYW1zLmlkLCByZXEucXVlcnkpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4gcmVzLnNlbmQocmVzdWx0cykpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gRmhpckxvZ2ljLmhhbmRsZUVycm9yKGVyciwgbnVsbCwgcmVzKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJvdXRlci5wb3N0KCcvJywgPFJlcXVlc3RIYW5kbGVyPiBjaGVja0p3dCwgKHJlcTogRXh0ZW5kZWRSZXF1ZXN0LCByZXMpID0+IHtcclxuICAgICAgICAgICAgRmhpckxvZ2ljLmxvZy50cmFjZShgQ3JlYXRpbmcgcmVzb3VyY2UgU3RydWN0dXJlRGVmaW5pdGlvbmApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZmhpckxvZ2ljID0gbmV3IHRoaXMoJ1N0cnVjdHVyZURlZmluaXRpb24nLCByZXEuZmhpclNlcnZlckJhc2UsIHJlcS5maGlyU2VydmVyVmVyc2lvbik7XHJcbiAgICAgICAgICAgIGZoaXJMb2dpYy5jcmVhdGUocmVxLmJvZHksIHJlcS5xdWVyeSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiByZXMuc2VuZChyZXN1bHRzKSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiBGaGlyTG9naWMuaGFuZGxlRXJyb3IoZXJyLCBudWxsLCByZXMpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcm91dGVyLnB1dCgnLzppZCcsIDxSZXF1ZXN0SGFuZGxlcj4gY2hlY2tKd3QsIChyZXE6IEV4dGVuZGVkUmVxdWVzdCwgcmVzKSA9PiB7XHJcbiAgICAgICAgICAgIEZoaXJMb2dpYy5sb2cudHJhY2UoYFVwZGF0aW5nIHJlc291cmNlIFN0cnVjdHVyZURlZmluaXRpb24vJHtyZXEucGFyYW1zLmlkfWApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZmhpckxvZ2ljID0gbmV3IHRoaXMoJ1N0cnVjdHVyZURlZmluaXRpb24nLCByZXEuZmhpclNlcnZlckJhc2UsIHJlcS5maGlyU2VydmVyVmVyc2lvbik7XHJcbiAgICAgICAgICAgIGZoaXJMb2dpYy51cGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHJlcS5xdWVyeSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiByZXMuc2VuZChyZXN1bHRzKSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiBGaGlyTG9naWMuaGFuZGxlRXJyb3IoZXJyLCBudWxsLCByZXMpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcm91dGVyLmRlbGV0ZSgnLzppZCcsIDxSZXF1ZXN0SGFuZGxlcj4gY2hlY2tKd3QsIChyZXE6IEV4dGVuZGVkUmVxdWVzdCwgcmVzKSA9PiB7XHJcbiAgICAgICAgICAgIEZoaXJMb2dpYy5sb2cudHJhY2UoYERlbGV0aW5nIHJlc291cmNlIFN0cnVjdHVyZURlZmluaXRpb24vJHtyZXEucGFyYW1zLmlkfWApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZmhpckxvZ2ljID0gbmV3IHRoaXMoJ1N0cnVjdHVyZURlZmluaXRpb24nLCByZXEuZmhpclNlcnZlckJhc2UsIHJlcS5maGlyU2VydmVyVmVyc2lvbik7XHJcbiAgICAgICAgICAgIGZoaXJMb2dpYy5kZWxldGUocmVxLnBhcmFtcy5pZCwgcmVxLnF1ZXJ5KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHJlcy5zZW5kKHJlc3VsdHMpKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IEZoaXJMb2dpYy5oYW5kbGVFcnJvcihlcnIsIG51bGwsIHJlcykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByb3V0ZXIuZ2V0KCcvYmFzZS86aWQnLCA8UmVxdWVzdEhhbmRsZXI+IEF1dGhIZWxwZXIuY2hlY2tKd3QsIDxSZXF1ZXN0SGFuZGxlcj4gKHJlcTogRXh0ZW5kZWRSZXF1ZXN0LCByZXMpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBTdHJ1Y3R1cmVEZWZpbml0aW9uQ29udHJvbGxlcignU3RydWN0dXJlRGVmaW5pdGlvbicsIHJlcS5maGlyU2VydmVyQmFzZSwgcmVxLmZoaXJTZXJ2ZXJWZXJzaW9uKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5nZXRCYXNlU3RydWN0dXJlRGVmaW5pdGlvbihyZXEucGFyYW1zLmlkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHJlcy5zZW5kKHJlc3VsdHMpKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IFN0cnVjdHVyZURlZmluaXRpb25Db250cm9sbGVyLmhhbmRsZUVycm9yKGVyciwgbnVsbCwgcmVzKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByb3V0ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocmVzb3VyY2VUeXBlOiBzdHJpbmcsIGJhc2VVcmw6IHN0cmluZywgZmhpclNlcnZlclZlcnNpb246IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHJlc291cmNlVHlwZSwgYmFzZVVybCk7XHJcblxyXG4gICAgICAgIHRoaXMuZmhpclNlcnZlclZlcnNpb24gPSBmaGlyU2VydmVyVmVyc2lvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBzdHJ1Y3R1cmUgZGVmaW5pdGlvbiB0byB0aGUgc3BlY2lmaWVkIGltcGxlbWVudGF0aW9uIGd1aWRlXHJcbiAgICAgKiBAcGFyYW0gc3RydWN0dXJlRGVmaW5pdGlvbiBUaGUgc3RydWN0dXJlIGRlZmluaXRpb24gdG8gYWRkIChtdXN0IGhhdmUgYW4gaWQpXHJcbiAgICAgKiBAcGFyYW0gaW1wbGVtZW50YXRpb25HdWlkZUlkIFRoZSBpZCBvZiB0aGUgaW1wbGVtZW50YXRpb24gZ3VpZGUgdG8gYWRkIHRoZSBzdHJ1Y3R1cmUgZGVmaW5pdGlvbiB0b1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZFRvSW1wbGVtZW50YXRpb25HdWlkZShzdHJ1Y3R1cmVEZWZpbml0aW9uLCBpbXBsZW1lbnRhdGlvbkd1aWRlSWQpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSA8UmVxdWVzdE9wdGlvbnM+IHtcclxuICAgICAgICAgICAgICAgIHVybDogRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsICdJbXBsZW1lbnRhdGlvbkd1aWRlJywgaW1wbGVtZW50YXRpb25HdWlkZUlkKSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBycChvcHRpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGltcGxlbWVudGF0aW9uR3VpZGU6IEZoaXIuSW1wbGVtZW50YXRpb25HdWlkZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXNzZXJ0RWRpdGluZ0FsbG93ZWQoaW1wbGVtZW50YXRpb25HdWlkZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZoaXJTZXJ2ZXJWZXJzaW9uICE9PSAnc3R1MycpIHsgICAgICAgIC8vIHI0K1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByNCA9IDxGaGlyLlI0LkltcGxlbWVudGF0aW9uR3VpZGU+IGltcGxlbWVudGF0aW9uR3VpZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXI0LmRlZmluaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI0LmRlZmluaXRpb24gPSB7IHJlc291cmNlOiBbXSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXI0LmRlZmluaXRpb24ucmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI0LmRlZmluaXRpb24ucmVzb3VyY2UgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRSZXNvdXJjZSA9IF8uZmluZChyNC5kZWZpbml0aW9uLnJlc291cmNlLCAocmVzb3VyY2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZS5yZWZlcmVuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2UucmVmZXJlbmNlLnJlZmVyZW5jZSA9PT0gYFN0cnVjdHVyZURlZmluaXRpb24vJHtzdHJ1Y3R1cmVEZWZpbml0aW9uLmlkfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZFJlc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uLnJlc291cmNlLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U6IGBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7c3RydWN0dXJlRGVmaW5pdGlvbi5pZH1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBzdHJ1Y3R1cmVEZWZpbml0aW9uLnRpdGxlIHx8IHN0cnVjdHVyZURlZmluaXRpb24ubmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3R1M1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHUzID0gPEZoaXIuU1RVMy5JbXBsZW1lbnRhdGlvbkd1aWRlPiBpbXBsZW1lbnRhdGlvbkd1aWRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHUzLnBhY2thZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0dTMucGFja2FnZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZEluUGFja2FnZXMgPSBfLmZpbHRlcihzdHUzLnBhY2thZ2UsIChpZ1BhY2thZ2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLmZpbHRlcihpZ1BhY2thZ2UucmVzb3VyY2UsIChyZXNvdXJjZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZS5zb3VyY2VSZWZlcmVuY2UgJiYgcmVzb3VyY2Uuc291cmNlUmVmZXJlbmNlLnJlZmVyZW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2Uuc291cmNlUmVmZXJlbmNlLnJlZmVyZW5jZSA9PT0gYFN0cnVjdHVyZURlZmluaXRpb24vJHtzdHJ1Y3R1cmVEZWZpbml0aW9uLmlkfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkubGVuZ3RoID4gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmRJblBhY2thZ2VzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3UmVzb3VyY2UgPSA8Rmhpci5TVFUzLkltcGxlbWVudGF0aW9uR3VpZGVQYWNrYWdlUmVzb3VyY2U+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdHJ1Y3R1cmVEZWZpbml0aW9uLnRpdGxlIHx8IHN0cnVjdHVyZURlZmluaXRpb24ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VSZWZlcmVuY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlOiBgU3RydWN0dXJlRGVmaW5pdGlvbi8ke3N0cnVjdHVyZURlZmluaXRpb24uaWR9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogc3RydWN0dXJlRGVmaW5pdGlvbi50aXRsZSB8fCBzdHJ1Y3R1cmVEZWZpbml0aW9uLm5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHUzLnBhY2thZ2UubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1My5wYWNrYWdlLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnRGVmYXVsdCBQYWNrYWdlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IFtuZXdSZXNvdXJjZV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHUzLnBhY2thZ2VbMF0ucmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1My5wYWNrYWdlWzBdLnJlc291cmNlID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHUzLnBhY2thZ2VbMF0ucmVzb3VyY2UucHVzaChuZXdSZXNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubWV0aG9kID0gJ1BVVCc7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ib2R5ID0gaW1wbGVtZW50YXRpb25HdWlkZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJwKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiByZXNvbHZlKHJlc3VsdHMpKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIHN0cnVjdHVyZSBkZWZpbml0aW9uIGZyb20gdGhlIHNwZWNpZmllZCBpbXBsZW1lbnRhdGlvbiBndWlkZVxyXG4gICAgICogQHBhcmFtIHN0cnVjdHVyZURlZmluaXRpb24gVGhlIHN0cnVjdHVyZSBkZWZpbml0aW9uIHRvIHJlbW92ZSAobXVzdCBoYXZlIGFuIGlkKVxyXG4gICAgICogQHBhcmFtIGltcGxlbWVudGF0aW9uR3VpZGVJZCBUaGUgaWQgb2YgdGhlIGltcGxlbWVudGF0aW9uIGd1aWRlIHRvIHJlbW92ZSB0aGUgc3RydWN0dXJlIGRlZmluaXRpb24gZnJvbVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlbW92ZUZyb21JbXBsZW1lbnRhdGlvbkd1aWRlKHN0cnVjdHVyZURlZmluaXRpb24sIGltcGxlbWVudGF0aW9uR3VpZGVJZCk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IDxSZXF1ZXN0T3B0aW9ucz4ge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBGaGlySGVscGVyLmJ1aWxkVXJsKHRoaXMuYmFzZVVybCwgJ0ltcGxlbWVudGF0aW9uR3VpZGUnLCBpbXBsZW1lbnRhdGlvbkd1aWRlSWQpLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGpzb246IHRydWVcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJwKG9wdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoaW1wbGVtZW50YXRpb25HdWlkZTogRmhpci5JbXBsZW1lbnRhdGlvbkd1aWRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hc3NlcnRFZGl0aW5nQWxsb3dlZChpbXBsZW1lbnRhdGlvbkd1aWRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZmhpclNlcnZlclZlcnNpb24gIT09ICdzdHUzJykgeyAgICAgICAgICAgICAgICAvLyByNCtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcjQgPSA8Rmhpci5SNC5JbXBsZW1lbnRhdGlvbkd1aWRlPiBpbXBsZW1lbnRhdGlvbkd1aWRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyNC5kZWZpbml0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uID0geyByZXNvdXJjZTogW10gfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyNC5kZWZpbml0aW9uLnJlc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uLnJlc291cmNlID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kUmVzb3VyY2UgPSBfLmZpbmQocjQuZGVmaW5pdGlvbi5yZXNvdXJjZSwgKHJlc291cmNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UucmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlLnJlZmVyZW5jZS5yZWZlcmVuY2UgPT09IGBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7c3RydWN0dXJlRGVmaW5pdGlvbi5pZH1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZFJlc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHI0LmRlZmluaXRpb24ucmVzb3VyY2UuaW5kZXhPZihmb3VuZFJlc291cmNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI0LmRlZmluaXRpb24ucmVzb3VyY2Uuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3R1M1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHUzID0gPEZoaXIuU1RVMy5JbXBsZW1lbnRhdGlvbkd1aWRlPiBpbXBsZW1lbnRhdGlvbkd1aWRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHUzLnBhY2thZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0dTMucGFja2FnZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goc3R1My5wYWNrYWdlLCAoaWdQYWNrYWdlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZFJlc291cmNlID0gXy5maW5kKGlnUGFja2FnZS5yZXNvdXJjZSwgKHJlc291cmNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlLnNvdXJjZVJlZmVyZW5jZSAmJiByZXNvdXJjZS5zb3VyY2VSZWZlcmVuY2UucmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5zb3VyY2VSZWZlcmVuY2UucmVmZXJlbmNlID09PSBgU3RydWN0dXJlRGVmaW5pdGlvbi8ke3N0cnVjdHVyZURlZmluaXRpb24uaWR9YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmRSZXNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gaWdQYWNrYWdlLnJlc291cmNlLmluZGV4T2YoZm91bmRSZXNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdQYWNrYWdlLnJlc291cmNlLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5tZXRob2QgPSAnUFVUJztcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmJvZHkgPSBpbXBsZW1lbnRhdGlvbkd1aWRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnAob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHJlc29sdmUocmVzdWx0cykpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2F2ZVN0cnVjdHVyZURlZmluaXRpb24oaWQ6IHN0cmluZywgc3RydWN0dXJlRGVmaW5pdGlvbjogRmhpci5TdHJ1Y3R1cmVEZWZpbml0aW9uLCBvcHRpb25zPzogU3RydWN0dXJlRGVmaW5pdGlvbk9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFzc2VydEVkaXRpbmdBbGxvd2VkKHN0cnVjdHVyZURlZmluaXRpb24pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzdHJ1Y3R1cmVEZWZpbml0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyA8UmVzdFJlamVjdGlvbj4geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdBIHN0cnVjdHVyZURlZmluaXRpb24gcHJvcGVydHkgaXMgcmVxdWlyZWQnIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghc3RydWN0dXJlRGVmaW5pdGlvbi5pZCkge1xyXG4gICAgICAgICAgICAgICAgc3RydWN0dXJlRGVmaW5pdGlvbi5pZCA9IGlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdXBkYXRlZFN0cnVjdHVyZURlZmluaXRpb247XHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZU9wdGlvbnMgPSA8UmVxdWVzdE9wdGlvbnM+IHtcclxuICAgICAgICAgICAgICAgIHVybDogRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsIHRoaXMucmVzb3VyY2VUeXBlLCBpZCksXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICAgICAganNvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IHN0cnVjdHVyZURlZmluaXRpb24sXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlV2l0aEZ1bGxSZXNwb25zZTogdHJ1ZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcnAodXBkYXRlT3B0aW9ucylcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSByZXN1bHRzLmhlYWRlcnMubG9jYXRpb24gfHwgcmVzdWx0cy5oZWFkZXJzWydjb250ZW50LWxvY2F0aW9uJ107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGSElSIHNlcnZlciBkaWQgbm90IHJlc3BvbmQgd2l0aCBhIGxvY2F0aW9uIHRvIHRoZSBuZXdseSBjcmVhdGVkICR7dGhpcy5yZXNvdXJjZVR5cGV9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkU3RydWN0dXJlRGVmaW5pdGlvbiA9IHJlc3VsdHM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlnVXBkYXRlUHJvbWlzZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKG9wdGlvbnMuaW1wbGVtZW50YXRpb25HdWlkZXMsIChpbXBsZW1lbnRhdGlvbkd1aWRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5pc05ldykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnVXBkYXRlUHJvbWlzZXMucHVzaCh0aGlzLmFkZFRvSW1wbGVtZW50YXRpb25HdWlkZSh1cGRhdGVkU3RydWN0dXJlRGVmaW5pdGlvbiwgaW1wbGVtZW50YXRpb25HdWlkZS5pZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmlzUmVtb3ZlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnVXBkYXRlUHJvbWlzZXMucHVzaCh0aGlzLnJlbW92ZUZyb21JbXBsZW1lbnRhdGlvbkd1aWRlKHVwZGF0ZWRTdHJ1Y3R1cmVEZWZpbml0aW9uLCBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGlnVXBkYXRlUHJvbWlzZXMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHJlc29sdmUodXBkYXRlZFN0cnVjdHVyZURlZmluaXRpb24pKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QmFzZVN0cnVjdHVyZURlZmluaXRpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8Rmhpci5TdHJ1Y3R1cmVEZWZpbml0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29uZmlnQ29udHJvbGxlciA9IG5ldyBDb25maWdDb250cm9sbGVyKHRoaXMuYmFzZVVybCk7XHJcbiAgICAgICAgICAgIGNvbmZpZ0NvbnRyb2xsZXIuZ2V0RmhpckNhcGFiaWxpdGllcygpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoY2FwYWJpbGl0aWVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVibGlzaGVkRmhpclZlcnNpb24gPSBfLmZpbmQoZmhpckNvbmZpZy5wdWJsaXNoZWRWZXJzaW9ucywgKHB1Ymxpc2hlZFZlcnNpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbXZlci5zYXRpc2ZpZXMoY2FwYWJpbGl0aWVzLmZoaXJWZXJzaW9uLCBwdWJsaXNoZWRWZXJzaW9uLnZlcnNpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXB1Ymxpc2hlZEZoaXJWZXJzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IDxSZXN0UmVqZWN0aW9uPiB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ1Vuc3VwcG9ydGVkIEZISVIgdmVyc2lvbiAnICsgY2FwYWJpbGl0aWVzLmZoaXJWZXJzaW9uIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHB1Ymxpc2hlZEZoaXJWZXJzaW9uLnVybCArICcvJyArIGlkICsgJy5wcm9maWxlLmpzb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGJhc2VTdHJ1Y3R1cmVEZWZpbml0aW9uKSA9PiByZXNvbHZlKGJhc2VTdHJ1Y3R1cmVEZWZpbml0aW9uKSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByZXBhcmVTZWFyY2hRdWVyeShxdWVyeT86IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgc3VwZXIucHJlcGFyZVNlYXJjaFF1ZXJ5KHF1ZXJ5KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHByZXBhcmVkUXVlcnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJlcGFyZWRRdWVyeS5pbXBsZW1lbnRhdGlvbkd1aWRlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlcGFyZWRRdWVyeVsnX2hhczpJbXBsZW1lbnRhdGlvbkd1aWRlOnJlc291cmNlOl9pZCddID0gcHJlcGFyZWRRdWVyeS5pbXBsZW1lbnRhdGlvbkd1aWRlSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBwcmVwYXJlZFF1ZXJ5LmltcGxlbWVudGF0aW9uR3VpZGVJZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocHJlcGFyZWRRdWVyeSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0KGlkOiBzdHJpbmcsIHF1ZXJ5PzogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsIHRoaXMucmVzb3VyY2VUeXBlLCBpZCwgbnVsbCwgcXVlcnkpO1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGpzb246IHRydWUsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCBzdHJ1Y3R1cmVEZWZpbml0aW9uO1xyXG5cclxuICAgICAgICAgICAgcnAocmVxdWVzdE9wdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0cnVjdHVyZURlZmluaXRpb24gPSByZXN1bHRzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEZoaXJIZWxwZXIuYnVpbGRVcmwodGhpcy5iYXNlVXJsLCAnSW1wbGVtZW50YXRpb25HdWlkZScsIG51bGwsIG51bGwsIHsgcmVzb3VyY2U6IGBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7aWR9YCB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0czogRmhpci5CdW5kbGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gcmVzdWx0cyA/IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb25HdWlkZXM6IF8ubWFwKHJlc3VsdHMgJiYgcmVzdWx0cy5lbnRyeSA/IHJlc3VsdHMuZW50cnkgOiBbXSwgKGVudHJ5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICg8Rmhpci5JbXBsZW1lbnRhdGlvbkd1aWRlPiBlbnRyeS5yZXNvdXJjZSkubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZW50cnkucmVzb3VyY2UuaWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSA6IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogc3RydWN0dXJlRGVmaW5pdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZShkYXRhOiBTYXZlU3RydWN0dXJlRGVmaW5pdGlvblJlcXVlc3QsIHF1ZXJ5PzogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zYXZlU3RydWN0dXJlRGVmaW5pdGlvbihuYW5vaWQoOCksIGRhdGEucmVzb3VyY2UsIGRhdGEub3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShpZDogc3RyaW5nLCBkYXRhOiBTYXZlU3RydWN0dXJlRGVmaW5pdGlvblJlcXVlc3QsIHF1ZXJ5PzogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zYXZlU3RydWN0dXJlRGVmaW5pdGlvbihpZCwgZGF0YS5yZXNvdXJjZSwgZGF0YS5vcHRpb25zKTtcclxuICAgIH1cclxufSJdfQ==