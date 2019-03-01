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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RydWN0dXJlRGVmaW5pdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0cnVjdHVyZURlZmluaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsbUNBQW1DO0FBQ25DLDRDQUE0QztBQUM1QyxzQ0FBc0M7QUFDdEMsaUNBQWlDO0FBQ2pDLGlDQUFpQztBQUNqQyxnQ0FBZ0M7QUFDaEMsNENBQTRDO0FBQzVDLDJDQUFzQztBQUd0QyxxQ0FBMEM7QUFDMUMsOENBQXVDO0FBRXZDLE1BQU0sVUFBVSxHQUFnQixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBZW5ELE1BQWEsNkJBQThCLFNBQVEscUJBQVM7SUFHakQsTUFBTSxDQUFDLFVBQVU7UUFDcEIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWhDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFtQixxQkFBUSxFQUFFLENBQUMsR0FBb0IsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUNyRSxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUVsRSxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzdGLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztpQkFDdEIsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNwQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLHFCQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFtQixxQkFBUSxFQUFFLENBQUMsR0FBb0IsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4RSxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsMkNBQTJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVoRixNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzdGLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQztpQkFDbEMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNwQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLHFCQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFtQixxQkFBUSxFQUFFLENBQUMsR0FBb0IsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN0RSxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztZQUU3RCxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzdGLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDO2lCQUNoQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3BDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMscUJBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQW1CLHFCQUFRLEVBQUUsQ0FBQyxHQUFvQixFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ3hFLHFCQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTlFLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDN0YsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUM7aUJBQy9DLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDcEMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxxQkFBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBbUIscUJBQVEsRUFBRSxDQUFDLEdBQW9CLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDM0UscUJBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFOUUsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUM3RixTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUM7aUJBQ3JDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDcEMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxxQkFBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBbUIsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFrQixHQUFvQixFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ3pHLE1BQU0sVUFBVSxHQUFHLElBQUksNkJBQTZCLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUN2SCxVQUFVLENBQUMsMEJBQTBCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7aUJBQy9DLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDcEMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25GLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELFlBQVksWUFBb0IsRUFBRSxPQUFlLEVBQUUsaUJBQXlCO1FBQ3hFLEtBQUssQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFN0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0lBQy9DLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssd0JBQXdCLENBQUMsbUJBQW1CLEVBQUUscUJBQXFCO1FBQ3ZFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsTUFBTSxPQUFPLEdBQW9CO2dCQUM3QixHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLHFCQUFxQixDQUFDO2dCQUNwRixNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsSUFBSTthQUNiLENBQUM7WUFFRixFQUFFLENBQUMsT0FBTyxDQUFDO2lCQUNOLElBQUksQ0FBQyxDQUFDLG1CQUE2QyxFQUFFLEVBQUU7Z0JBQ3BELElBQUksSUFBSSxDQUFDLGlCQUFpQixLQUFLLE1BQU0sRUFBRSxFQUFTLE1BQU07b0JBQ2xELE1BQU0sRUFBRSxHQUFpQyxtQkFBbUIsQ0FBQztvQkFFN0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUU7d0JBQ2hCLEVBQUUsQ0FBQyxVQUFVLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUM7cUJBQ3BDO29CQUVELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTt3QkFDekIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO3FCQUMvQjtvQkFFRCxNQUFNLGFBQWEsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUU7d0JBQzlELElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRTs0QkFDcEIsT0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsS0FBSyx1QkFBdUIsbUJBQW1CLENBQUMsRUFBRSxFQUFFLENBQUM7eUJBQzNGO29CQUNMLENBQUMsQ0FBQyxDQUFDO29CQUVILElBQUksQ0FBQyxhQUFhLEVBQUU7d0JBQ2hCLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzs0QkFDeEIsU0FBUyxFQUFFO2dDQUNQLFNBQVMsRUFBRSx1QkFBdUIsbUJBQW1CLENBQUMsRUFBRSxFQUFFO2dDQUMxRCxPQUFPLEVBQUUsbUJBQW1CLENBQUMsS0FBSyxJQUFJLG1CQUFtQixDQUFDLElBQUk7NkJBQ2pFO3lCQUNKLENBQUMsQ0FBQztxQkFDTjtpQkFDSjtxQkFBTSxFQUF5QyxPQUFPO29CQUNuRCxNQUFNLElBQUksR0FBbUMsbUJBQW1CLENBQUM7b0JBRWpFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO3FCQUNyQjtvQkFFRCxNQUFNLGVBQWUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRTt3QkFDekQsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRTs0QkFDN0MsSUFBSSxRQUFRLENBQUMsZUFBZSxJQUFJLFFBQVEsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFO2dDQUNoRSxPQUFPLFFBQVEsQ0FBQyxlQUFlLENBQUMsU0FBUyxLQUFLLHVCQUF1QixtQkFBbUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs2QkFDakc7d0JBQ0wsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDbEIsQ0FBQyxDQUFDLENBQUM7b0JBRUgsSUFBSSxlQUFlLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTt3QkFDOUIsTUFBTSxXQUFXLEdBQWtEOzRCQUMvRCxJQUFJLEVBQUUsbUJBQW1CLENBQUMsS0FBSyxJQUFJLG1CQUFtQixDQUFDLElBQUk7NEJBQzNELGVBQWUsRUFBRTtnQ0FDYixTQUFTLEVBQUUsdUJBQXVCLG1CQUFtQixDQUFDLEVBQUUsRUFBRTtnQ0FDMUQsT0FBTyxFQUFFLG1CQUFtQixDQUFDLEtBQUssSUFBSSxtQkFBbUIsQ0FBQyxJQUFJOzZCQUNqRTt5QkFDSixDQUFDO3dCQUVGLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFOzRCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztnQ0FDZCxJQUFJLEVBQUUsaUJBQWlCO2dDQUN2QixRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUM7NkJBQzFCLENBQUMsQ0FBQzt5QkFDTjs2QkFBTTs0QkFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7Z0NBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs2QkFDakM7NEJBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3lCQUM5QztxQkFDSjtpQkFDSjtnQkFFRCxPQUFPLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDdkIsT0FBTyxDQUFDLElBQUksR0FBRyxtQkFBbUIsQ0FBQztnQkFFbkMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkIsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNuQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyw2QkFBNkIsQ0FBQyxtQkFBbUIsRUFBRSxxQkFBcUI7UUFDNUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuQyxNQUFNLE9BQU8sR0FBb0I7Z0JBQzdCLEdBQUcsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUscUJBQXFCLENBQUM7Z0JBQ3BGLE1BQU0sRUFBRSxLQUFLO2dCQUNiLElBQUksRUFBRSxJQUFJO2FBQ2IsQ0FBQztZQUVGLEVBQUUsQ0FBQyxPQUFPLENBQUM7aUJBQ04sSUFBSSxDQUFDLENBQUMsbUJBQTZDLEVBQUUsRUFBRTtnQkFDcEQsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEtBQUssTUFBTSxFQUFFLEVBQWlCLE1BQU07b0JBQzFELE1BQU0sRUFBRSxHQUFpQyxtQkFBbUIsQ0FBQztvQkFFN0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUU7d0JBQ2hCLEVBQUUsQ0FBQyxVQUFVLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUM7cUJBQ3BDO29CQUVELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTt3QkFDekIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO3FCQUMvQjtvQkFFRCxNQUFNLGFBQWEsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUU7d0JBQzlELElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRTs0QkFDcEIsT0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsS0FBSyx1QkFBdUIsbUJBQW1CLENBQUMsRUFBRSxFQUFFLENBQUM7eUJBQzNGO29CQUNMLENBQUMsQ0FBQyxDQUFDO29CQUVILElBQUksYUFBYSxFQUFFO3dCQUNmLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDNUQsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDM0M7aUJBQ0o7cUJBQU0sRUFBaUQsT0FBTztvQkFDM0QsTUFBTSxJQUFJLEdBQW1DLG1CQUFtQixDQUFDO29CQUVqRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDZixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztxQkFDckI7b0JBRUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUU7d0JBQy9CLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFOzRCQUMxRCxJQUFJLFFBQVEsQ0FBQyxlQUFlLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUU7Z0NBQ2hFLE9BQU8sUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEtBQUssdUJBQXVCLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxDQUFDOzZCQUNqRzt3QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFFSCxJQUFJLGFBQWEsRUFBRTs0QkFDZixNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs0QkFDeEQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO3lCQUN2QztvQkFDTCxDQUFDLENBQUMsQ0FBQztpQkFDTjtnQkFFRCxPQUFPLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDdkIsT0FBTyxDQUFDLElBQUksR0FBRyxtQkFBbUIsQ0FBQztnQkFFbkMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkIsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNuQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLHVCQUF1QixDQUFDLEVBQVUsRUFBRSxtQkFBNkMsRUFBRSxPQUFvQztRQUMzSCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ25DLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtnQkFDdEIsTUFBc0IsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSw0Q0FBNEMsRUFBRSxDQUFDO2FBQ3BHO1lBRUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsRUFBRTtnQkFDekIsbUJBQW1CLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQzthQUMvQjtZQUVELElBQUksMEJBQTBCLENBQUM7WUFDL0IsTUFBTSxhQUFhLEdBQW9CO2dCQUNuQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDO2dCQUM3RCxNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsbUJBQW1CO2dCQUN6Qix1QkFBdUIsRUFBRSxJQUFJO2FBQ2hDLENBQUM7WUFFRixFQUFFLENBQUMsYUFBYSxDQUFDO2lCQUNaLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNkLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFFakYsSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDWCxNQUFNLElBQUksS0FBSyxDQUFDLG9FQUFvRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztpQkFDNUc7Z0JBRUQsT0FBTyxFQUFFLENBQUM7b0JBQ04sR0FBRyxFQUFFLFFBQVE7b0JBQ2IsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsSUFBSSxFQUFFLElBQUk7aUJBQ2IsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNkLDBCQUEwQixHQUFHLE9BQU8sQ0FBQztnQkFFckMsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7Z0JBRTVCLElBQUksT0FBTyxFQUFFO29CQUNULENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLENBQUMsbUJBQW1CLEVBQUUsRUFBRTt3QkFDekQsSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLEVBQUU7NEJBQzNCLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsMEJBQTBCLEVBQUUsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDNUc7NkJBQU0sSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUU7NEJBQ3RDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsMEJBQTBCLEVBQUUsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDakg7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7aUJBQ047Z0JBRUQsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztpQkFDL0MsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSwwQkFBMEIsQ0FBQyxFQUFVO1FBQ3hDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLHlCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1RCxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRTtpQkFDakMsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLEVBQUU7Z0JBQ25CLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO29CQUNuRixPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDaEYsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLG9CQUFvQixFQUFFO29CQUN2QixNQUFzQixFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLDJCQUEyQixHQUFHLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztpQkFDOUc7Z0JBRUQsT0FBTyxFQUFFLENBQUM7b0JBQ04sR0FBRyxFQUFFLG9CQUFvQixDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLGVBQWU7b0JBQzFELE1BQU0sRUFBRSxLQUFLO29CQUNiLElBQUksRUFBRSxJQUFJO2lCQUNiLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7aUJBQ25FLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRVMsa0JBQWtCLENBQUMsS0FBVztRQUNwQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ25DLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7aUJBQzFCLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO2dCQUNwQixJQUFJLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRTtvQkFDckMsYUFBYSxDQUFDLHVDQUF1QyxDQUFDLEdBQUcsYUFBYSxDQUFDLHFCQUFxQixDQUFDO29CQUM3RixPQUFPLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQztpQkFDOUM7Z0JBRUQsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLEdBQUcsQ0FBQyxFQUFVLEVBQUUsS0FBVztRQUM5QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ25DLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEYsTUFBTSxjQUFjLEdBQUc7Z0JBQ25CLEdBQUcsRUFBRSxHQUFHO2dCQUNSLE1BQU0sRUFBRSxLQUFLO2dCQUNiLElBQUksRUFBRSxJQUFJO2dCQUNWLE9BQU8sRUFBRTtvQkFDTCxlQUFlLEVBQUUsVUFBVTtpQkFDOUI7YUFDSixDQUFDO1lBQ0YsSUFBSSxtQkFBbUIsQ0FBQztZQUV4QixFQUFFLENBQUMsY0FBYyxDQUFDO2lCQUNiLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNkLG1CQUFtQixHQUFHLE9BQU8sQ0FBQztnQkFFOUIsT0FBTyxFQUFFLENBQUM7b0JBQ04sR0FBRyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFLEVBQUUsRUFBRSxDQUFDO29CQUNwSCxNQUFNLEVBQUUsS0FBSztvQkFDYixJQUFJLEVBQUUsSUFBSTtvQkFDVixPQUFPLEVBQUU7d0JBQ0wsZUFBZSxFQUFFLFVBQVU7cUJBQzlCO2lCQUNKLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsQ0FBQyxPQUFvQixFQUFFLEVBQUU7Z0JBQzNCLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO3dCQUNqRixPQUFPOzRCQUNILElBQUksRUFBOEIsS0FBSyxDQUFDLFFBQVMsQ0FBQyxJQUFJOzRCQUN0RCxFQUFFLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO3lCQUN4QixDQUFDO29CQUNOLENBQUMsQ0FBQztpQkFDTCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBRVQsT0FBTyxDQUFDO29CQUNKLFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLE9BQU8sRUFBRSxPQUFPO2lCQUNuQixDQUFDLENBQUM7WUFDUCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxNQUFNLENBQUMsSUFBb0MsRUFBRSxLQUFXO1FBQzNELE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRU0sTUFBTSxDQUFDLEVBQVUsRUFBRSxJQUFvQyxFQUFFLEtBQVc7UUFDdkUsT0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pFLENBQUM7Q0FDSjtBQWpYRCxzRUFpWEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBuYW5vaWQgZnJvbSAnbmFub2lkJztcbmltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgKiBhcyBBdXRoSGVscGVyIGZyb20gJy4uL2F1dGhIZWxwZXInO1xuaW1wb3J0ICogYXMgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcbmltcG9ydCAqIGFzIGNvbmZpZyBmcm9tICdjb25maWcnO1xuaW1wb3J0ICogYXMgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0ICogYXMgRmhpckhlbHBlciBmcm9tICcuLi9maGlySGVscGVyJztcbmltcG9ydCB7RmhpckxvZ2ljfSBmcm9tICcuL2ZoaXJMb2dpYyc7XG5pbXBvcnQge1JlcXVlc3RIYW5kbGVyfSBmcm9tICdleHByZXNzJztcbmltcG9ydCB7RXh0ZW5kZWRSZXF1ZXN0LCBGaGlyLCBGaGlyQ29uZmlnLCBSZXF1ZXN0T3B0aW9ucywgUmVzdFJlamVjdGlvbn0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHtDb25maWdDb250cm9sbGVyfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge2NoZWNrSnd0fSBmcm9tICcuLi9hdXRoSGVscGVyJztcblxuY29uc3QgZmhpckNvbmZpZyA9IDxGaGlyQ29uZmlnPiBjb25maWcuZ2V0KCdmaGlyJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RydWN0dXJlRGVmaW5pdGlvbk9wdGlvbnMge1xuICAgIGltcGxlbWVudGF0aW9uR3VpZGVzOiBbe1xuICAgICAgICBpZDogc3RyaW5nO1xuICAgICAgICBpc05ldzogYm9vbGVhbjtcbiAgICAgICAgaXNSZW1vdmVkOiBib29sZWFuO1xuICAgIH1dO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNhdmVTdHJ1Y3R1cmVEZWZpbml0aW9uUmVxdWVzdCB7XG4gICAgb3B0aW9ucz86IFN0cnVjdHVyZURlZmluaXRpb25PcHRpb25zO1xuICAgIHJlc291cmNlOiBGaGlyLlN0cnVjdHVyZURlZmluaXRpb247XG59XG5cbmV4cG9ydCBjbGFzcyBTdHJ1Y3R1cmVEZWZpbml0aW9uQ29udHJvbGxlciBleHRlbmRzIEZoaXJMb2dpYyB7XG4gICAgcHJpdmF0ZSBmaGlyU2VydmVyVmVyc2lvbjogc3RyaW5nO1xuXG4gICAgcHVibGljIHN0YXRpYyBpbml0Um91dGVzKCkge1xuICAgICAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG4gICAgICAgIHJvdXRlci5nZXQoJy8nLCA8UmVxdWVzdEhhbmRsZXI+IGNoZWNrSnd0LCAocmVxOiBFeHRlbmRlZFJlcXVlc3QsIHJlcykgPT4ge1xuICAgICAgICAgICAgRmhpckxvZ2ljLmxvZy50cmFjZShgU2VhcmNoaW5nIGZvciByZXNvdXJjZSBTdHJ1Y3R1cmVEZWZpbml0aW9uYCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZoaXJMb2dpYyA9IG5ldyB0aGlzKCdTdHJ1Y3R1cmVEZWZpbml0aW9uJywgcmVxLmZoaXJTZXJ2ZXJCYXNlLCByZXEuZmhpclNlcnZlclZlcnNpb24pO1xuICAgICAgICAgICAgZmhpckxvZ2ljLnNlYXJjaChyZXEucXVlcnkpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHJlcy5zZW5kKHJlc3VsdHMpKVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiBGaGlyTG9naWMuaGFuZGxlRXJyb3IoZXJyLCBudWxsLCByZXMpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVyLmdldCgnLzppZCcsIDxSZXF1ZXN0SGFuZGxlcj4gY2hlY2tKd3QsIChyZXE6IEV4dGVuZGVkUmVxdWVzdCwgcmVzKSA9PiB7XG4gICAgICAgICAgICBGaGlyTG9naWMubG9nLnRyYWNlKGBSZXRyaWV2aW5nIHJlc291cmNlIFN0cnVjdHVyZURlZmluaXRpb24vJHtyZXEucGFyYW1zLmlkfWApO1xuXG4gICAgICAgICAgICBjb25zdCBmaGlyTG9naWMgPSBuZXcgdGhpcygnU3RydWN0dXJlRGVmaW5pdGlvbicsIHJlcS5maGlyU2VydmVyQmFzZSwgcmVxLmZoaXJTZXJ2ZXJWZXJzaW9uKTtcbiAgICAgICAgICAgIGZoaXJMb2dpYy5nZXQocmVxLnBhcmFtcy5pZCwgcmVxLnF1ZXJ5KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiByZXMuc2VuZChyZXN1bHRzKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gRmhpckxvZ2ljLmhhbmRsZUVycm9yKGVyciwgbnVsbCwgcmVzKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvdXRlci5wb3N0KCcvJywgPFJlcXVlc3RIYW5kbGVyPiBjaGVja0p3dCwgKHJlcTogRXh0ZW5kZWRSZXF1ZXN0LCByZXMpID0+IHtcbiAgICAgICAgICAgIEZoaXJMb2dpYy5sb2cudHJhY2UoYENyZWF0aW5nIHJlc291cmNlIFN0cnVjdHVyZURlZmluaXRpb25gKTtcblxuICAgICAgICAgICAgY29uc3QgZmhpckxvZ2ljID0gbmV3IHRoaXMoJ1N0cnVjdHVyZURlZmluaXRpb24nLCByZXEuZmhpclNlcnZlckJhc2UsIHJlcS5maGlyU2VydmVyVmVyc2lvbik7XG4gICAgICAgICAgICBmaGlyTG9naWMuY3JlYXRlKHJlcS5ib2R5LCByZXEucXVlcnkpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHJlcy5zZW5kKHJlc3VsdHMpKVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiBGaGlyTG9naWMuaGFuZGxlRXJyb3IoZXJyLCBudWxsLCByZXMpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVyLnB1dCgnLzppZCcsIDxSZXF1ZXN0SGFuZGxlcj4gY2hlY2tKd3QsIChyZXE6IEV4dGVuZGVkUmVxdWVzdCwgcmVzKSA9PiB7XG4gICAgICAgICAgICBGaGlyTG9naWMubG9nLnRyYWNlKGBVcGRhdGluZyByZXNvdXJjZSBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7cmVxLnBhcmFtcy5pZH1gKTtcblxuICAgICAgICAgICAgY29uc3QgZmhpckxvZ2ljID0gbmV3IHRoaXMoJ1N0cnVjdHVyZURlZmluaXRpb24nLCByZXEuZmhpclNlcnZlckJhc2UsIHJlcS5maGlyU2VydmVyVmVyc2lvbik7XG4gICAgICAgICAgICBmaGlyTG9naWMudXBkYXRlKHJlcS5wYXJhbXMuaWQsIHJlcS5ib2R5LCByZXEucXVlcnkpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHJlcy5zZW5kKHJlc3VsdHMpKVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiBGaGlyTG9naWMuaGFuZGxlRXJyb3IoZXJyLCBudWxsLCByZXMpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVyLmRlbGV0ZSgnLzppZCcsIDxSZXF1ZXN0SGFuZGxlcj4gY2hlY2tKd3QsIChyZXE6IEV4dGVuZGVkUmVxdWVzdCwgcmVzKSA9PiB7XG4gICAgICAgICAgICBGaGlyTG9naWMubG9nLnRyYWNlKGBEZWxldGluZyByZXNvdXJjZSBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7cmVxLnBhcmFtcy5pZH1gKTtcblxuICAgICAgICAgICAgY29uc3QgZmhpckxvZ2ljID0gbmV3IHRoaXMoJ1N0cnVjdHVyZURlZmluaXRpb24nLCByZXEuZmhpclNlcnZlckJhc2UsIHJlcS5maGlyU2VydmVyVmVyc2lvbik7XG4gICAgICAgICAgICBmaGlyTG9naWMuZGVsZXRlKHJlcS5wYXJhbXMuaWQsIHJlcS5xdWVyeSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4gcmVzLnNlbmQocmVzdWx0cykpXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IEZoaXJMb2dpYy5oYW5kbGVFcnJvcihlcnIsIG51bGwsIHJlcykpO1xuICAgICAgICB9KTtcblxuICAgICAgICByb3V0ZXIuZ2V0KCcvYmFzZS86aWQnLCA8UmVxdWVzdEhhbmRsZXI+IEF1dGhIZWxwZXIuY2hlY2tKd3QsIDxSZXF1ZXN0SGFuZGxlcj4gKHJlcTogRXh0ZW5kZWRSZXF1ZXN0LCByZXMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgU3RydWN0dXJlRGVmaW5pdGlvbkNvbnRyb2xsZXIoJ1N0cnVjdHVyZURlZmluaXRpb24nLCByZXEuZmhpclNlcnZlckJhc2UsIHJlcS5maGlyU2VydmVyVmVyc2lvbik7XG4gICAgICAgICAgICBjb250cm9sbGVyLmdldEJhc2VTdHJ1Y3R1cmVEZWZpbml0aW9uKHJlcS5wYXJhbXMuaWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHJlcy5zZW5kKHJlc3VsdHMpKVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiBTdHJ1Y3R1cmVEZWZpbml0aW9uQ29udHJvbGxlci5oYW5kbGVFcnJvcihlcnIsIG51bGwsIHJlcykpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcm91dGVyO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHJlc291cmNlVHlwZTogc3RyaW5nLCBiYXNlVXJsOiBzdHJpbmcsIGZoaXJTZXJ2ZXJWZXJzaW9uOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIocmVzb3VyY2VUeXBlLCBiYXNlVXJsKTtcblxuICAgICAgICB0aGlzLmZoaXJTZXJ2ZXJWZXJzaW9uID0gZmhpclNlcnZlclZlcnNpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIHN0cnVjdHVyZSBkZWZpbml0aW9uIHRvIHRoZSBzcGVjaWZpZWQgaW1wbGVtZW50YXRpb24gZ3VpZGVcbiAgICAgKiBAcGFyYW0gc3RydWN0dXJlRGVmaW5pdGlvbiBUaGUgc3RydWN0dXJlIGRlZmluaXRpb24gdG8gYWRkIChtdXN0IGhhdmUgYW4gaWQpXG4gICAgICogQHBhcmFtIGltcGxlbWVudGF0aW9uR3VpZGVJZCBUaGUgaWQgb2YgdGhlIGltcGxlbWVudGF0aW9uIGd1aWRlIHRvIGFkZCB0aGUgc3RydWN0dXJlIGRlZmluaXRpb24gdG9cbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZFRvSW1wbGVtZW50YXRpb25HdWlkZShzdHJ1Y3R1cmVEZWZpbml0aW9uLCBpbXBsZW1lbnRhdGlvbkd1aWRlSWQpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IDxSZXF1ZXN0T3B0aW9ucz4ge1xuICAgICAgICAgICAgICAgIHVybDogRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsICdJbXBsZW1lbnRhdGlvbkd1aWRlJywgaW1wbGVtZW50YXRpb25HdWlkZUlkKSxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGpzb246IHRydWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJwKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLnRoZW4oKGltcGxlbWVudGF0aW9uR3VpZGU6IEZoaXIuSW1wbGVtZW50YXRpb25HdWlkZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5maGlyU2VydmVyVmVyc2lvbiAhPT0gJ3N0dTMnKSB7ICAgICAgICAvLyByNCtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHI0ID0gPEZoaXIuUjQuSW1wbGVtZW50YXRpb25HdWlkZT4gaW1wbGVtZW50YXRpb25HdWlkZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyNC5kZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcjQuZGVmaW5pdGlvbiA9IHsgcmVzb3VyY2U6IFtdIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcjQuZGVmaW5pdGlvbi5yZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI0LmRlZmluaXRpb24ucmVzb3VyY2UgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRSZXNvdXJjZSA9IF8uZmluZChyNC5kZWZpbml0aW9uLnJlc291cmNlLCAocmVzb3VyY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UucmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5yZWZlcmVuY2UucmVmZXJlbmNlID09PSBgU3RydWN0dXJlRGVmaW5pdGlvbi8ke3N0cnVjdHVyZURlZmluaXRpb24uaWR9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZFJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcjQuZGVmaW5pdGlvbi5yZXNvdXJjZS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U6IGBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7c3RydWN0dXJlRGVmaW5pdGlvbi5pZH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogc3RydWN0dXJlRGVmaW5pdGlvbi50aXRsZSB8fCBzdHJ1Y3R1cmVEZWZpbml0aW9uLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdHUzXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHUzID0gPEZoaXIuU1RVMy5JbXBsZW1lbnRhdGlvbkd1aWRlPiBpbXBsZW1lbnRhdGlvbkd1aWRlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXN0dTMucGFja2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0dTMucGFja2FnZSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZEluUGFja2FnZXMgPSBfLmZpbHRlcihzdHUzLnBhY2thZ2UsIChpZ1BhY2thZ2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5maWx0ZXIoaWdQYWNrYWdlLnJlc291cmNlLCAocmVzb3VyY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlLnNvdXJjZVJlZmVyZW5jZSAmJiByZXNvdXJjZS5zb3VyY2VSZWZlcmVuY2UucmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2Uuc291cmNlUmVmZXJlbmNlLnJlZmVyZW5jZSA9PT0gYFN0cnVjdHVyZURlZmluaXRpb24vJHtzdHJ1Y3R1cmVEZWZpbml0aW9uLmlkfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZEluUGFja2FnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3UmVzb3VyY2UgPSA8Rmhpci5TVFUzLkltcGxlbWVudGF0aW9uR3VpZGVQYWNrYWdlUmVzb3VyY2U+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc3RydWN0dXJlRGVmaW5pdGlvbi50aXRsZSB8fCBzdHJ1Y3R1cmVEZWZpbml0aW9uLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVJlZmVyZW5jZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlOiBgU3RydWN0dXJlRGVmaW5pdGlvbi8ke3N0cnVjdHVyZURlZmluaXRpb24uaWR9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHN0cnVjdHVyZURlZmluaXRpb24udGl0bGUgfHwgc3RydWN0dXJlRGVmaW5pdGlvbi5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0dTMucGFja2FnZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1My5wYWNrYWdlLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0RlZmF1bHQgUGFja2FnZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogW25ld1Jlc291cmNlXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXN0dTMucGFja2FnZVswXS5yZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1My5wYWNrYWdlWzBdLnJlc291cmNlID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHUzLnBhY2thZ2VbMF0ucmVzb3VyY2UucHVzaChuZXdSZXNvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5tZXRob2QgPSAnUFVUJztcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ib2R5ID0gaW1wbGVtZW50YXRpb25HdWlkZTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnAob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4gcmVzb2x2ZShyZXN1bHRzKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBzdHJ1Y3R1cmUgZGVmaW5pdGlvbiBmcm9tIHRoZSBzcGVjaWZpZWQgaW1wbGVtZW50YXRpb24gZ3VpZGVcbiAgICAgKiBAcGFyYW0gc3RydWN0dXJlRGVmaW5pdGlvbiBUaGUgc3RydWN0dXJlIGRlZmluaXRpb24gdG8gcmVtb3ZlIChtdXN0IGhhdmUgYW4gaWQpXG4gICAgICogQHBhcmFtIGltcGxlbWVudGF0aW9uR3VpZGVJZCBUaGUgaWQgb2YgdGhlIGltcGxlbWVudGF0aW9uIGd1aWRlIHRvIHJlbW92ZSB0aGUgc3RydWN0dXJlIGRlZmluaXRpb24gZnJvbVxuICAgICAqL1xuICAgIHByaXZhdGUgcmVtb3ZlRnJvbUltcGxlbWVudGF0aW9uR3VpZGUoc3RydWN0dXJlRGVmaW5pdGlvbiwgaW1wbGVtZW50YXRpb25HdWlkZUlkKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSA8UmVxdWVzdE9wdGlvbnM+IHtcbiAgICAgICAgICAgICAgICB1cmw6IEZoaXJIZWxwZXIuYnVpbGRVcmwodGhpcy5iYXNlVXJsLCAnSW1wbGVtZW50YXRpb25HdWlkZScsIGltcGxlbWVudGF0aW9uR3VpZGVJZCksXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBycChvcHRpb25zKVxuICAgICAgICAgICAgICAgIC50aGVuKChpbXBsZW1lbnRhdGlvbkd1aWRlOiBGaGlyLkltcGxlbWVudGF0aW9uR3VpZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZmhpclNlcnZlclZlcnNpb24gIT09ICdzdHUzJykgeyAgICAgICAgICAgICAgICAvLyByNCtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHI0ID0gPEZoaXIuUjQuSW1wbGVtZW50YXRpb25HdWlkZT4gaW1wbGVtZW50YXRpb25HdWlkZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyNC5kZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcjQuZGVmaW5pdGlvbiA9IHsgcmVzb3VyY2U6IFtdIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcjQuZGVmaW5pdGlvbi5yZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI0LmRlZmluaXRpb24ucmVzb3VyY2UgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRSZXNvdXJjZSA9IF8uZmluZChyNC5kZWZpbml0aW9uLnJlc291cmNlLCAocmVzb3VyY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UucmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5yZWZlcmVuY2UucmVmZXJlbmNlID09PSBgU3RydWN0dXJlRGVmaW5pdGlvbi8ke3N0cnVjdHVyZURlZmluaXRpb24uaWR9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kUmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHI0LmRlZmluaXRpb24ucmVzb3VyY2UuaW5kZXhPZihmb3VuZFJlc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uLnJlc291cmNlLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3R1M1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3R1MyA9IDxGaGlyLlNUVTMuSW1wbGVtZW50YXRpb25HdWlkZT4gaW1wbGVtZW50YXRpb25HdWlkZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHUzLnBhY2thZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHUzLnBhY2thZ2UgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHN0dTMucGFja2FnZSwgKGlnUGFja2FnZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kUmVzb3VyY2UgPSBfLmZpbmQoaWdQYWNrYWdlLnJlc291cmNlLCAocmVzb3VyY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlLnNvdXJjZVJlZmVyZW5jZSAmJiByZXNvdXJjZS5zb3VyY2VSZWZlcmVuY2UucmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2Uuc291cmNlUmVmZXJlbmNlLnJlZmVyZW5jZSA9PT0gYFN0cnVjdHVyZURlZmluaXRpb24vJHtzdHJ1Y3R1cmVEZWZpbml0aW9uLmlkfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZFJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gaWdQYWNrYWdlLnJlc291cmNlLmluZGV4T2YoZm91bmRSZXNvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnUGFja2FnZS5yZXNvdXJjZS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5tZXRob2QgPSAnUFVUJztcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ib2R5ID0gaW1wbGVtZW50YXRpb25HdWlkZTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnAob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4gcmVzb2x2ZShyZXN1bHRzKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNhdmVTdHJ1Y3R1cmVEZWZpbml0aW9uKGlkOiBzdHJpbmcsIHN0cnVjdHVyZURlZmluaXRpb246IEZoaXIuU3RydWN0dXJlRGVmaW5pdGlvbiwgb3B0aW9ucz86IFN0cnVjdHVyZURlZmluaXRpb25PcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXN0cnVjdHVyZURlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyA8UmVzdFJlamVjdGlvbj4geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdBIHN0cnVjdHVyZURlZmluaXRpb24gcHJvcGVydHkgaXMgcmVxdWlyZWQnIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc3RydWN0dXJlRGVmaW5pdGlvbi5pZCkge1xuICAgICAgICAgICAgICAgIHN0cnVjdHVyZURlZmluaXRpb24uaWQgPSBpZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHVwZGF0ZWRTdHJ1Y3R1cmVEZWZpbml0aW9uO1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlT3B0aW9ucyA9IDxSZXF1ZXN0T3B0aW9ucz4ge1xuICAgICAgICAgICAgICAgIHVybDogRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsIHRoaXMucmVzb3VyY2VUeXBlLCBpZCksXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgICAgIGJvZHk6IHN0cnVjdHVyZURlZmluaXRpb24sXG4gICAgICAgICAgICAgICAgcmVzb2x2ZVdpdGhGdWxsUmVzcG9uc2U6IHRydWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJwKHVwZGF0ZU9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSByZXN1bHRzLmhlYWRlcnMubG9jYXRpb24gfHwgcmVzdWx0cy5oZWFkZXJzWydjb250ZW50LWxvY2F0aW9uJ107XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGSElSIHNlcnZlciBkaWQgbm90IHJlc3BvbmQgd2l0aCBhIGxvY2F0aW9uIHRvIHRoZSBuZXdseSBjcmVhdGVkICR7dGhpcy5yZXNvdXJjZVR5cGV9YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBsb2NhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZFN0cnVjdHVyZURlZmluaXRpb24gPSByZXN1bHRzO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlnVXBkYXRlUHJvbWlzZXMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKG9wdGlvbnMuaW1wbGVtZW50YXRpb25HdWlkZXMsIChpbXBsZW1lbnRhdGlvbkd1aWRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUuaXNOZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdVcGRhdGVQcm9taXNlcy5wdXNoKHRoaXMuYWRkVG9JbXBsZW1lbnRhdGlvbkd1aWRlKHVwZGF0ZWRTdHJ1Y3R1cmVEZWZpbml0aW9uLCBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmlzUmVtb3ZlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ1VwZGF0ZVByb21pc2VzLnB1c2godGhpcy5yZW1vdmVGcm9tSW1wbGVtZW50YXRpb25HdWlkZSh1cGRhdGVkU3RydWN0dXJlRGVmaW5pdGlvbiwgaW1wbGVtZW50YXRpb25HdWlkZS5pZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGlnVXBkYXRlUHJvbWlzZXMpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzb2x2ZSh1cGRhdGVkU3RydWN0dXJlRGVmaW5pdGlvbikpXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEJhc2VTdHJ1Y3R1cmVEZWZpbml0aW9uKGlkOiBzdHJpbmcpOiBQcm9taXNlPEZoaXIuU3RydWN0dXJlRGVmaW5pdGlvbj4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29uZmlnQ29udHJvbGxlciA9IG5ldyBDb25maWdDb250cm9sbGVyKHRoaXMuYmFzZVVybCk7XG4gICAgICAgICAgICBjb25maWdDb250cm9sbGVyLmdldEZoaXJDYXBhYmlsaXRpZXMoKVxuICAgICAgICAgICAgICAgIC50aGVuKChjYXBhYmlsaXRpZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVibGlzaGVkRmhpclZlcnNpb24gPSBfLmZpbmQoZmhpckNvbmZpZy5wdWJsaXNoZWRWZXJzaW9ucywgKHB1Ymxpc2hlZFZlcnNpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZW12ZXIuc2F0aXNmaWVzKGNhcGFiaWxpdGllcy5maGlyVmVyc2lvbiwgcHVibGlzaGVkVmVyc2lvbi52ZXJzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwdWJsaXNoZWRGaGlyVmVyc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgPFJlc3RSZWplY3Rpb24+IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnVW5zdXBwb3J0ZWQgRkhJUiB2ZXJzaW9uICcgKyBjYXBhYmlsaXRpZXMuZmhpclZlcnNpb24gfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBycCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHB1Ymxpc2hlZEZoaXJWZXJzaW9uLnVybCArICcvJyArIGlkICsgJy5wcm9maWxlLmpzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb246IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoYmFzZVN0cnVjdHVyZURlZmluaXRpb24pID0+IHJlc29sdmUoYmFzZVN0cnVjdHVyZURlZmluaXRpb24pKVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcmVwYXJlU2VhcmNoUXVlcnkocXVlcnk/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc3VwZXIucHJlcGFyZVNlYXJjaFF1ZXJ5KHF1ZXJ5KVxuICAgICAgICAgICAgICAgIC50aGVuKChwcmVwYXJlZFF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmVwYXJlZFF1ZXJ5LmltcGxlbWVudGF0aW9uR3VpZGVJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlcGFyZWRRdWVyeVsnX2hhczpJbXBsZW1lbnRhdGlvbkd1aWRlOnJlc291cmNlOl9pZCddID0gcHJlcGFyZWRRdWVyeS5pbXBsZW1lbnRhdGlvbkd1aWRlSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgcHJlcGFyZWRRdWVyeS5pbXBsZW1lbnRhdGlvbkd1aWRlSWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHByZXBhcmVkUXVlcnkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldChpZDogc3RyaW5nLCBxdWVyeT86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBGaGlySGVscGVyLmJ1aWxkVXJsKHRoaXMuYmFzZVVybCwgdGhpcy5yZXNvdXJjZVR5cGUsIGlkLCBudWxsLCBxdWVyeSk7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGpzb246IHRydWUsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IHN0cnVjdHVyZURlZmluaXRpb247XG5cbiAgICAgICAgICAgIHJwKHJlcXVlc3RPcHRpb25zKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN0cnVjdHVyZURlZmluaXRpb24gPSByZXN1bHRzO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBycCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IEZoaXJIZWxwZXIuYnVpbGRVcmwodGhpcy5iYXNlVXJsLCAnSW1wbGVtZW50YXRpb25HdWlkZScsIG51bGwsIG51bGwsIHsgcmVzb3VyY2U6IGBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7aWR9YCB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzOiBGaGlyLkJ1bmRsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gcmVzdWx0cyA/IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcGxlbWVudGF0aW9uR3VpZGVzOiBfLm1hcChyZXN1bHRzICYmIHJlc3VsdHMuZW50cnkgPyByZXN1bHRzLmVudHJ5IDogW10sIChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICg8Rmhpci5JbXBsZW1lbnRhdGlvbkd1aWRlPiBlbnRyeS5yZXNvdXJjZSkubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGVudHJ5LnJlc291cmNlLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0gOiBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHN0cnVjdHVyZURlZmluaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZShkYXRhOiBTYXZlU3RydWN0dXJlRGVmaW5pdGlvblJlcXVlc3QsIHF1ZXJ5PzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZVN0cnVjdHVyZURlZmluaXRpb24obmFub2lkKDgpLCBkYXRhLnJlc291cmNlLCBkYXRhLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUoaWQ6IHN0cmluZywgZGF0YTogU2F2ZVN0cnVjdHVyZURlZmluaXRpb25SZXF1ZXN0LCBxdWVyeT86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNhdmVTdHJ1Y3R1cmVEZWZpbml0aW9uKGlkLCBkYXRhLnJlc291cmNlLCBkYXRhLm9wdGlvbnMpO1xuICAgIH1cbn0iXX0=