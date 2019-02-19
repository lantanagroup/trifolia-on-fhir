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
const fhirConfig = config.get('fhir');
class StructureDefinitionController extends fhirLogic_1.FhirLogic {
    static initRoutes() {
        const router = express.Router();
        router.get('/base/:id', AuthHelper.checkJwt, (req, res) => {
            const controller = new StructureDefinitionController('StructureDefinition', req.fhirServerBase, req.fhirServerVersion);
            controller.getBaseStructureDefinition(req.params.id)
                .then((results) => res.send(results))
                .catch((err) => StructureDefinitionController.handleError(err, null, res));
        });
        return super.initRoutes('StructureDefinition', router);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RydWN0dXJlRGVmaW5pdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0cnVjdHVyZURlZmluaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsbUNBQW1DO0FBQ25DLDRDQUE0QztBQUM1QyxzQ0FBc0M7QUFDdEMsaUNBQWlDO0FBQ2pDLGlDQUFpQztBQUNqQyxnQ0FBZ0M7QUFDaEMsNENBQTRDO0FBQzVDLDJDQUFzQztBQUd0QyxxQ0FBMEM7QUFFMUMsTUFBTSxVQUFVLEdBQWdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFlbkQsbUNBQTJDLFNBQVEscUJBQVM7SUFHakQsTUFBTSxDQUFDLFVBQVU7UUFDcEIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWhDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFtQixVQUFVLENBQUMsUUFBUSxFQUFFLENBQWtCLEdBQW9CLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDekcsTUFBTSxVQUFVLEdBQUcsSUFBSSw2QkFBNkIsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3ZILFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztpQkFDL0MsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNwQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLDZCQUE2QixDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkYsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENB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Q0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pFLENBQUM7Q0FDSjtBQXBVRCxzRUFvVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBuYW5vaWQgZnJvbSAnbmFub2lkJztcclxuaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0ICogYXMgQXV0aEhlbHBlciBmcm9tICcuLi9hdXRoSGVscGVyJztcclxuaW1wb3J0ICogYXMgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcclxuaW1wb3J0ICogYXMgY29uZmlnIGZyb20gJ2NvbmZpZyc7XHJcbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInO1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xyXG5pbXBvcnQgKiBhcyBGaGlySGVscGVyIGZyb20gJy4uL2ZoaXJIZWxwZXInO1xyXG5pbXBvcnQge0ZoaXJMb2dpY30gZnJvbSAnLi9maGlyTG9naWMnO1xyXG5pbXBvcnQge1JlcXVlc3RIYW5kbGVyfSBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHtFeHRlbmRlZFJlcXVlc3QsIEZoaXIsIEZoaXJDb25maWcsIFJlcXVlc3RPcHRpb25zLCBSZXN0UmVqZWN0aW9ufSBmcm9tICcuL21vZGVscyc7XHJcbmltcG9ydCB7Q29uZmlnQ29udHJvbGxlcn0gZnJvbSAnLi9jb25maWcnO1xyXG5cclxuY29uc3QgZmhpckNvbmZpZyA9IDxGaGlyQ29uZmlnPiBjb25maWcuZ2V0KCdmaGlyJyk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0cnVjdHVyZURlZmluaXRpb25PcHRpb25zIHtcclxuICAgIGltcGxlbWVudGF0aW9uR3VpZGVzOiBbe1xyXG4gICAgICAgIGlkOiBzdHJpbmc7XHJcbiAgICAgICAgaXNOZXc6IGJvb2xlYW47XHJcbiAgICAgICAgaXNSZW1vdmVkOiBib29sZWFuO1xyXG4gICAgfV07XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2F2ZVN0cnVjdHVyZURlZmluaXRpb25SZXF1ZXN0IHtcclxuICAgIG9wdGlvbnM/OiBTdHJ1Y3R1cmVEZWZpbml0aW9uT3B0aW9ucztcclxuICAgIHJlc291cmNlOiBGaGlyLlN0cnVjdHVyZURlZmluaXRpb247XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdHJ1Y3R1cmVEZWZpbml0aW9uQ29udHJvbGxlciBleHRlbmRzIEZoaXJMb2dpYyB7XHJcbiAgICBwcml2YXRlIGZoaXJTZXJ2ZXJWZXJzaW9uOiBzdHJpbmc7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0Um91dGVzKCkge1xyXG4gICAgICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG4gICAgICAgIHJvdXRlci5nZXQoJy9iYXNlLzppZCcsIDxSZXF1ZXN0SGFuZGxlcj4gQXV0aEhlbHBlci5jaGVja0p3dCwgPFJlcXVlc3RIYW5kbGVyPiAocmVxOiBFeHRlbmRlZFJlcXVlc3QsIHJlcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IFN0cnVjdHVyZURlZmluaXRpb25Db250cm9sbGVyKCdTdHJ1Y3R1cmVEZWZpbml0aW9uJywgcmVxLmZoaXJTZXJ2ZXJCYXNlLCByZXEuZmhpclNlcnZlclZlcnNpb24pO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdldEJhc2VTdHJ1Y3R1cmVEZWZpbml0aW9uKHJlcS5wYXJhbXMuaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4gcmVzLnNlbmQocmVzdWx0cykpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gU3RydWN0dXJlRGVmaW5pdGlvbkNvbnRyb2xsZXIuaGFuZGxlRXJyb3IoZXJyLCBudWxsLCByZXMpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXRSb3V0ZXMoJ1N0cnVjdHVyZURlZmluaXRpb24nLCByb3V0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJlc291cmNlVHlwZTogc3RyaW5nLCBiYXNlVXJsOiBzdHJpbmcsIGZoaXJTZXJ2ZXJWZXJzaW9uOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihyZXNvdXJjZVR5cGUsIGJhc2VVcmwpO1xyXG5cclxuICAgICAgICB0aGlzLmZoaXJTZXJ2ZXJWZXJzaW9uID0gZmhpclNlcnZlclZlcnNpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgc3RydWN0dXJlIGRlZmluaXRpb24gdG8gdGhlIHNwZWNpZmllZCBpbXBsZW1lbnRhdGlvbiBndWlkZVxyXG4gICAgICogQHBhcmFtIHN0cnVjdHVyZURlZmluaXRpb24gVGhlIHN0cnVjdHVyZSBkZWZpbml0aW9uIHRvIGFkZCAobXVzdCBoYXZlIGFuIGlkKVxyXG4gICAgICogQHBhcmFtIGltcGxlbWVudGF0aW9uR3VpZGVJZCBUaGUgaWQgb2YgdGhlIGltcGxlbWVudGF0aW9uIGd1aWRlIHRvIGFkZCB0aGUgc3RydWN0dXJlIGRlZmluaXRpb24gdG9cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGRUb0ltcGxlbWVudGF0aW9uR3VpZGUoc3RydWN0dXJlRGVmaW5pdGlvbiwgaW1wbGVtZW50YXRpb25HdWlkZUlkKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gPFJlcXVlc3RPcHRpb25zPiB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IEZoaXJIZWxwZXIuYnVpbGRVcmwodGhpcy5iYXNlVXJsLCAnSW1wbGVtZW50YXRpb25HdWlkZScsIGltcGxlbWVudGF0aW9uR3VpZGVJZCksXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAganNvbjogdHJ1ZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcnAob3B0aW9ucylcclxuICAgICAgICAgICAgICAgIC50aGVuKChpbXBsZW1lbnRhdGlvbkd1aWRlOiBGaGlyLkltcGxlbWVudGF0aW9uR3VpZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5maGlyU2VydmVyVmVyc2lvbiAhPT0gJ3N0dTMnKSB7ICAgICAgICAvLyByNCtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcjQgPSA8Rmhpci5SNC5JbXBsZW1lbnRhdGlvbkd1aWRlPiBpbXBsZW1lbnRhdGlvbkd1aWRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyNC5kZWZpbml0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uID0geyByZXNvdXJjZTogW10gfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyNC5kZWZpbml0aW9uLnJlc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uLnJlc291cmNlID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kUmVzb3VyY2UgPSBfLmZpbmQocjQuZGVmaW5pdGlvbi5yZXNvdXJjZSwgKHJlc291cmNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UucmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlLnJlZmVyZW5jZS5yZWZlcmVuY2UgPT09IGBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7c3RydWN0dXJlRGVmaW5pdGlvbi5pZH1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZm91bmRSZXNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcjQuZGVmaW5pdGlvbi5yZXNvdXJjZS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlOiBgU3RydWN0dXJlRGVmaW5pdGlvbi8ke3N0cnVjdHVyZURlZmluaXRpb24uaWR9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogc3RydWN0dXJlRGVmaW5pdGlvbi50aXRsZSB8fCBzdHJ1Y3R1cmVEZWZpbml0aW9uLm5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0dTNcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3R1MyA9IDxGaGlyLlNUVTMuSW1wbGVtZW50YXRpb25HdWlkZT4gaW1wbGVtZW50YXRpb25HdWlkZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3R1My5wYWNrYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHUzLnBhY2thZ2UgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRJblBhY2thZ2VzID0gXy5maWx0ZXIoc3R1My5wYWNrYWdlLCAoaWdQYWNrYWdlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5maWx0ZXIoaWdQYWNrYWdlLnJlc291cmNlLCAocmVzb3VyY2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2Uuc291cmNlUmVmZXJlbmNlICYmIHJlc291cmNlLnNvdXJjZVJlZmVyZW5jZS5yZWZlcmVuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlLnNvdXJjZVJlZmVyZW5jZS5yZWZlcmVuY2UgPT09IGBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7c3RydWN0dXJlRGVmaW5pdGlvbi5pZH1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kSW5QYWNrYWdlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Jlc291cmNlID0gPEZoaXIuU1RVMy5JbXBsZW1lbnRhdGlvbkd1aWRlUGFja2FnZVJlc291cmNlPiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc3RydWN0dXJlRGVmaW5pdGlvbi50aXRsZSB8fCBzdHJ1Y3R1cmVEZWZpbml0aW9uLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlUmVmZXJlbmNlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZTogYFN0cnVjdHVyZURlZmluaXRpb24vJHtzdHJ1Y3R1cmVEZWZpbml0aW9uLmlkfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHN0cnVjdHVyZURlZmluaXRpb24udGl0bGUgfHwgc3RydWN0dXJlRGVmaW5pdGlvbi5uYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3R1My5wYWNrYWdlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0dTMucGFja2FnZS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0RlZmF1bHQgUGFja2FnZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiBbbmV3UmVzb3VyY2VdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3R1My5wYWNrYWdlWzBdLnJlc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0dTMucGFja2FnZVswXS5yZXNvdXJjZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1My5wYWNrYWdlWzBdLnJlc291cmNlLnB1c2gobmV3UmVzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm1ldGhvZCA9ICdQVVQnO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuYm9keSA9IGltcGxlbWVudGF0aW9uR3VpZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBycChvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4gcmVzb2x2ZShyZXN1bHRzKSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBzdHJ1Y3R1cmUgZGVmaW5pdGlvbiBmcm9tIHRoZSBzcGVjaWZpZWQgaW1wbGVtZW50YXRpb24gZ3VpZGVcclxuICAgICAqIEBwYXJhbSBzdHJ1Y3R1cmVEZWZpbml0aW9uIFRoZSBzdHJ1Y3R1cmUgZGVmaW5pdGlvbiB0byByZW1vdmUgKG11c3QgaGF2ZSBhbiBpZClcclxuICAgICAqIEBwYXJhbSBpbXBsZW1lbnRhdGlvbkd1aWRlSWQgVGhlIGlkIG9mIHRoZSBpbXBsZW1lbnRhdGlvbiBndWlkZSB0byByZW1vdmUgdGhlIHN0cnVjdHVyZSBkZWZpbml0aW9uIGZyb21cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZW1vdmVGcm9tSW1wbGVtZW50YXRpb25HdWlkZShzdHJ1Y3R1cmVEZWZpbml0aW9uLCBpbXBsZW1lbnRhdGlvbkd1aWRlSWQpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSA8UmVxdWVzdE9wdGlvbnM+IHtcclxuICAgICAgICAgICAgICAgIHVybDogRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsICdJbXBsZW1lbnRhdGlvbkd1aWRlJywgaW1wbGVtZW50YXRpb25HdWlkZUlkKSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBycChvcHRpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGltcGxlbWVudGF0aW9uR3VpZGU6IEZoaXIuSW1wbGVtZW50YXRpb25HdWlkZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZoaXJTZXJ2ZXJWZXJzaW9uICE9PSAnc3R1MycpIHsgICAgICAgICAgICAgICAgLy8gcjQrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHI0ID0gPEZoaXIuUjQuSW1wbGVtZW50YXRpb25HdWlkZT4gaW1wbGVtZW50YXRpb25HdWlkZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcjQuZGVmaW5pdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcjQuZGVmaW5pdGlvbiA9IHsgcmVzb3VyY2U6IFtdIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcjQuZGVmaW5pdGlvbi5yZXNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcjQuZGVmaW5pdGlvbi5yZXNvdXJjZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZFJlc291cmNlID0gXy5maW5kKHI0LmRlZmluaXRpb24ucmVzb3VyY2UsIChyZXNvdXJjZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlLnJlZmVyZW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5yZWZlcmVuY2UucmVmZXJlbmNlID09PSBgU3RydWN0dXJlRGVmaW5pdGlvbi8ke3N0cnVjdHVyZURlZmluaXRpb24uaWR9YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmRSZXNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSByNC5kZWZpbml0aW9uLnJlc291cmNlLmluZGV4T2YoZm91bmRSZXNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uLnJlc291cmNlLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0dTNcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3R1MyA9IDxGaGlyLlNUVTMuSW1wbGVtZW50YXRpb25HdWlkZT4gaW1wbGVtZW50YXRpb25HdWlkZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3R1My5wYWNrYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHUzLnBhY2thZ2UgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHN0dTMucGFja2FnZSwgKGlnUGFja2FnZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRSZXNvdXJjZSA9IF8uZmluZChpZ1BhY2thZ2UucmVzb3VyY2UsIChyZXNvdXJjZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZS5zb3VyY2VSZWZlcmVuY2UgJiYgcmVzb3VyY2Uuc291cmNlUmVmZXJlbmNlLnJlZmVyZW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2Uuc291cmNlUmVmZXJlbmNlLnJlZmVyZW5jZSA9PT0gYFN0cnVjdHVyZURlZmluaXRpb24vJHtzdHJ1Y3R1cmVEZWZpbml0aW9uLmlkfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kUmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGlnUGFja2FnZS5yZXNvdXJjZS5pbmRleE9mKGZvdW5kUmVzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnUGFja2FnZS5yZXNvdXJjZS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubWV0aG9kID0gJ1BVVCc7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ib2R5ID0gaW1wbGVtZW50YXRpb25HdWlkZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJwKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiByZXNvbHZlKHJlc3VsdHMpKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNhdmVTdHJ1Y3R1cmVEZWZpbml0aW9uKGlkOiBzdHJpbmcsIHN0cnVjdHVyZURlZmluaXRpb246IEZoaXIuU3RydWN0dXJlRGVmaW5pdGlvbiwgb3B0aW9ucz86IFN0cnVjdHVyZURlZmluaXRpb25PcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFzdHJ1Y3R1cmVEZWZpbml0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyA8UmVzdFJlamVjdGlvbj4geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdBIHN0cnVjdHVyZURlZmluaXRpb24gcHJvcGVydHkgaXMgcmVxdWlyZWQnIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghc3RydWN0dXJlRGVmaW5pdGlvbi5pZCkge1xyXG4gICAgICAgICAgICAgICAgc3RydWN0dXJlRGVmaW5pdGlvbi5pZCA9IGlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdXBkYXRlZFN0cnVjdHVyZURlZmluaXRpb247XHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZU9wdGlvbnMgPSA8UmVxdWVzdE9wdGlvbnM+IHtcclxuICAgICAgICAgICAgICAgIHVybDogRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsIHRoaXMucmVzb3VyY2VUeXBlLCBpZCksXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICAgICAganNvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IHN0cnVjdHVyZURlZmluaXRpb24sXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlV2l0aEZ1bGxSZXNwb25zZTogdHJ1ZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcnAodXBkYXRlT3B0aW9ucylcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSByZXN1bHRzLmhlYWRlcnMubG9jYXRpb24gfHwgcmVzdWx0cy5oZWFkZXJzWydjb250ZW50LWxvY2F0aW9uJ107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGSElSIHNlcnZlciBkaWQgbm90IHJlc3BvbmQgd2l0aCBhIGxvY2F0aW9uIHRvIHRoZSBuZXdseSBjcmVhdGVkICR7dGhpcy5yZXNvdXJjZVR5cGV9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkU3RydWN0dXJlRGVmaW5pdGlvbiA9IHJlc3VsdHM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlnVXBkYXRlUHJvbWlzZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKG9wdGlvbnMuaW1wbGVtZW50YXRpb25HdWlkZXMsIChpbXBsZW1lbnRhdGlvbkd1aWRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5pc05ldykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnVXBkYXRlUHJvbWlzZXMucHVzaCh0aGlzLmFkZFRvSW1wbGVtZW50YXRpb25HdWlkZSh1cGRhdGVkU3RydWN0dXJlRGVmaW5pdGlvbiwgaW1wbGVtZW50YXRpb25HdWlkZS5pZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmlzUmVtb3ZlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnVXBkYXRlUHJvbWlzZXMucHVzaCh0aGlzLnJlbW92ZUZyb21JbXBsZW1lbnRhdGlvbkd1aWRlKHVwZGF0ZWRTdHJ1Y3R1cmVEZWZpbml0aW9uLCBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGlnVXBkYXRlUHJvbWlzZXMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHJlc29sdmUodXBkYXRlZFN0cnVjdHVyZURlZmluaXRpb24pKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QmFzZVN0cnVjdHVyZURlZmluaXRpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8Rmhpci5TdHJ1Y3R1cmVEZWZpbml0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29uZmlnQ29udHJvbGxlciA9IG5ldyBDb25maWdDb250cm9sbGVyKHRoaXMuYmFzZVVybCk7XHJcbiAgICAgICAgICAgIGNvbmZpZ0NvbnRyb2xsZXIuZ2V0RmhpckNhcGFiaWxpdGllcygpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoY2FwYWJpbGl0aWVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVibGlzaGVkRmhpclZlcnNpb24gPSBfLmZpbmQoZmhpckNvbmZpZy5wdWJsaXNoZWRWZXJzaW9ucywgKHB1Ymxpc2hlZFZlcnNpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbXZlci5zYXRpc2ZpZXMoY2FwYWJpbGl0aWVzLmZoaXJWZXJzaW9uLCBwdWJsaXNoZWRWZXJzaW9uLnZlcnNpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXB1Ymxpc2hlZEZoaXJWZXJzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IDxSZXN0UmVqZWN0aW9uPiB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ1Vuc3VwcG9ydGVkIEZISVIgdmVyc2lvbiAnICsgY2FwYWJpbGl0aWVzLmZoaXJWZXJzaW9uIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHB1Ymxpc2hlZEZoaXJWZXJzaW9uLnVybCArICcvJyArIGlkICsgJy5wcm9maWxlLmpzb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGJhc2VTdHJ1Y3R1cmVEZWZpbml0aW9uKSA9PiByZXNvbHZlKGJhc2VTdHJ1Y3R1cmVEZWZpbml0aW9uKSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByZXBhcmVTZWFyY2hRdWVyeShxdWVyeT86IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgc3VwZXIucHJlcGFyZVNlYXJjaFF1ZXJ5KHF1ZXJ5KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHByZXBhcmVkUXVlcnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJlcGFyZWRRdWVyeS5pbXBsZW1lbnRhdGlvbkd1aWRlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlcGFyZWRRdWVyeVsnX2hhczpJbXBsZW1lbnRhdGlvbkd1aWRlOnJlc291cmNlOl9pZCddID0gcHJlcGFyZWRRdWVyeS5pbXBsZW1lbnRhdGlvbkd1aWRlSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBwcmVwYXJlZFF1ZXJ5LmltcGxlbWVudGF0aW9uR3VpZGVJZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocHJlcGFyZWRRdWVyeSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0KGlkOiBzdHJpbmcsIHF1ZXJ5PzogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBGaGlySGVscGVyLmJ1aWxkVXJsKHRoaXMuYmFzZVVybCwgdGhpcy5yZXNvdXJjZVR5cGUsIGlkLCBudWxsLCBxdWVyeSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAganNvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IHN0cnVjdHVyZURlZmluaXRpb247XHJcblxyXG4gICAgICAgICAgICBycChyZXF1ZXN0T3B0aW9ucylcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RydWN0dXJlRGVmaW5pdGlvbiA9IHJlc3VsdHM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBycCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsICdJbXBsZW1lbnRhdGlvbkd1aWRlJywgbnVsbCwgbnVsbCwgeyByZXNvdXJjZTogYFN0cnVjdHVyZURlZmluaXRpb24vJHtpZH1gIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzOiBGaGlyLkJ1bmRsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSByZXN1bHRzID8ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBsZW1lbnRhdGlvbkd1aWRlczogXy5tYXAocmVzdWx0cyAmJiByZXN1bHRzLmVudHJ5ID8gcmVzdWx0cy5lbnRyeSA6IFtdLCAoZW50cnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogKDxGaGlyLkltcGxlbWVudGF0aW9uR3VpZGU+IGVudHJ5LnJlc291cmNlKS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBlbnRyeS5yZXNvdXJjZS5pZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9IDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiBzdHJ1Y3R1cmVEZWZpbml0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKGRhdGE6IFNhdmVTdHJ1Y3R1cmVEZWZpbml0aW9uUmVxdWVzdCwgcXVlcnk/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNhdmVTdHJ1Y3R1cmVEZWZpbml0aW9uKG5hbm9pZCg4KSwgZGF0YS5yZXNvdXJjZSwgZGF0YS5vcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGlkOiBzdHJpbmcsIGRhdGE6IFNhdmVTdHJ1Y3R1cmVEZWZpbml0aW9uUmVxdWVzdCwgcXVlcnk/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNhdmVTdHJ1Y3R1cmVEZWZpbml0aW9uKGlkLCBkYXRhLnJlc291cmNlLCBkYXRhLm9wdGlvbnMpO1xyXG4gICAgfVxyXG59Il19