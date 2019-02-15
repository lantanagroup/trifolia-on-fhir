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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RydWN0dXJlRGVmaW5pdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0cnVjdHVyZURlZmluaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsbUNBQW1DO0FBQ25DLDRDQUE0QztBQUM1QyxzQ0FBc0M7QUFDdEMsaUNBQWlDO0FBQ2pDLGlDQUFpQztBQUNqQyxnQ0FBZ0M7QUFDaEMsNENBQTRDO0FBQzVDLDJDQUFzQztBQUd0QyxxQ0FBMEM7QUFFMUMsTUFBTSxVQUFVLEdBQWdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFlbkQsbUNBQTJDLFNBQVEscUJBQVM7SUFHakQsTUFBTSxDQUFDLFVBQVU7UUFDcEIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWhDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFtQixVQUFVLENBQUMsUUFBUSxFQUFFLENBQWtCLEdBQW9CLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDekcsTUFBTSxVQUFVLEdBQUcsSUFBSSw2QkFBNkIsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3ZILFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztpQkFDL0MsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNwQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLDZCQUE2QixDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkYsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENB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Q0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pFLENBQUM7Q0FDSjtBQXBVRCxzRUFvVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBuYW5vaWQgZnJvbSAnbmFub2lkJztcbmltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgKiBhcyBBdXRoSGVscGVyIGZyb20gJy4uL2F1dGhIZWxwZXInO1xuaW1wb3J0ICogYXMgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcbmltcG9ydCAqIGFzIGNvbmZpZyBmcm9tICdjb25maWcnO1xuaW1wb3J0ICogYXMgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0ICogYXMgRmhpckhlbHBlciBmcm9tICcuLi9maGlySGVscGVyJztcbmltcG9ydCB7RmhpckxvZ2ljfSBmcm9tICcuL2ZoaXJMb2dpYyc7XG5pbXBvcnQge1JlcXVlc3RIYW5kbGVyfSBmcm9tICdleHByZXNzJztcbmltcG9ydCB7RXh0ZW5kZWRSZXF1ZXN0LCBGaGlyLCBGaGlyQ29uZmlnLCBSZXF1ZXN0T3B0aW9ucywgUmVzdFJlamVjdGlvbn0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHtDb25maWdDb250cm9sbGVyfSBmcm9tICcuL2NvbmZpZyc7XG5cbmNvbnN0IGZoaXJDb25maWcgPSA8RmhpckNvbmZpZz4gY29uZmlnLmdldCgnZmhpcicpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0cnVjdHVyZURlZmluaXRpb25PcHRpb25zIHtcbiAgICBpbXBsZW1lbnRhdGlvbkd1aWRlczogW3tcbiAgICAgICAgaWQ6IHN0cmluZztcbiAgICAgICAgaXNOZXc6IGJvb2xlYW47XG4gICAgICAgIGlzUmVtb3ZlZDogYm9vbGVhbjtcbiAgICB9XTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTYXZlU3RydWN0dXJlRGVmaW5pdGlvblJlcXVlc3Qge1xuICAgIG9wdGlvbnM/OiBTdHJ1Y3R1cmVEZWZpbml0aW9uT3B0aW9ucztcbiAgICByZXNvdXJjZTogRmhpci5TdHJ1Y3R1cmVEZWZpbml0aW9uO1xufVxuXG5leHBvcnQgY2xhc3MgU3RydWN0dXJlRGVmaW5pdGlvbkNvbnRyb2xsZXIgZXh0ZW5kcyBGaGlyTG9naWMge1xuICAgIHByaXZhdGUgZmhpclNlcnZlclZlcnNpb246IHN0cmluZztcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdFJvdXRlcygpIHtcbiAgICAgICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxuICAgICAgICByb3V0ZXIuZ2V0KCcvYmFzZS86aWQnLCA8UmVxdWVzdEhhbmRsZXI+IEF1dGhIZWxwZXIuY2hlY2tKd3QsIDxSZXF1ZXN0SGFuZGxlcj4gKHJlcTogRXh0ZW5kZWRSZXF1ZXN0LCByZXMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgU3RydWN0dXJlRGVmaW5pdGlvbkNvbnRyb2xsZXIoJ1N0cnVjdHVyZURlZmluaXRpb24nLCByZXEuZmhpclNlcnZlckJhc2UsIHJlcS5maGlyU2VydmVyVmVyc2lvbik7XG4gICAgICAgICAgICBjb250cm9sbGVyLmdldEJhc2VTdHJ1Y3R1cmVEZWZpbml0aW9uKHJlcS5wYXJhbXMuaWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHJlcy5zZW5kKHJlc3VsdHMpKVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiBTdHJ1Y3R1cmVEZWZpbml0aW9uQ29udHJvbGxlci5oYW5kbGVFcnJvcihlcnIsIG51bGwsIHJlcykpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdFJvdXRlcygnU3RydWN0dXJlRGVmaW5pdGlvbicsIHJvdXRlcik7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocmVzb3VyY2VUeXBlOiBzdHJpbmcsIGJhc2VVcmw6IHN0cmluZywgZmhpclNlcnZlclZlcnNpb246IHN0cmluZykge1xuICAgICAgICBzdXBlcihyZXNvdXJjZVR5cGUsIGJhc2VVcmwpO1xuXG4gICAgICAgIHRoaXMuZmhpclNlcnZlclZlcnNpb24gPSBmaGlyU2VydmVyVmVyc2lvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgc3RydWN0dXJlIGRlZmluaXRpb24gdG8gdGhlIHNwZWNpZmllZCBpbXBsZW1lbnRhdGlvbiBndWlkZVxuICAgICAqIEBwYXJhbSBzdHJ1Y3R1cmVEZWZpbml0aW9uIFRoZSBzdHJ1Y3R1cmUgZGVmaW5pdGlvbiB0byBhZGQgKG11c3QgaGF2ZSBhbiBpZClcbiAgICAgKiBAcGFyYW0gaW1wbGVtZW50YXRpb25HdWlkZUlkIFRoZSBpZCBvZiB0aGUgaW1wbGVtZW50YXRpb24gZ3VpZGUgdG8gYWRkIHRoZSBzdHJ1Y3R1cmUgZGVmaW5pdGlvbiB0b1xuICAgICAqL1xuICAgIHByaXZhdGUgYWRkVG9JbXBsZW1lbnRhdGlvbkd1aWRlKHN0cnVjdHVyZURlZmluaXRpb24sIGltcGxlbWVudGF0aW9uR3VpZGVJZCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gPFJlcXVlc3RPcHRpb25zPiB7XG4gICAgICAgICAgICAgICAgdXJsOiBGaGlySGVscGVyLmJ1aWxkVXJsKHRoaXMuYmFzZVVybCwgJ0ltcGxlbWVudGF0aW9uR3VpZGUnLCBpbXBsZW1lbnRhdGlvbkd1aWRlSWQpLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAganNvbjogdHJ1ZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcnAob3B0aW9ucylcbiAgICAgICAgICAgICAgICAudGhlbigoaW1wbGVtZW50YXRpb25HdWlkZTogRmhpci5JbXBsZW1lbnRhdGlvbkd1aWRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZoaXJTZXJ2ZXJWZXJzaW9uICE9PSAnc3R1MycpIHsgICAgICAgIC8vIHI0K1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcjQgPSA8Rmhpci5SNC5JbXBsZW1lbnRhdGlvbkd1aWRlPiBpbXBsZW1lbnRhdGlvbkd1aWRlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXI0LmRlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uID0geyByZXNvdXJjZTogW10gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyNC5kZWZpbml0aW9uLnJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcjQuZGVmaW5pdGlvbi5yZXNvdXJjZSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZFJlc291cmNlID0gXy5maW5kKHI0LmRlZmluaXRpb24ucmVzb3VyY2UsIChyZXNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZS5yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlLnJlZmVyZW5jZS5yZWZlcmVuY2UgPT09IGBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7c3RydWN0dXJlRGVmaW5pdGlvbi5pZH1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kUmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uLnJlc291cmNlLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZTogYFN0cnVjdHVyZURlZmluaXRpb24vJHtzdHJ1Y3R1cmVEZWZpbml0aW9uLmlkfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBzdHJ1Y3R1cmVEZWZpbml0aW9uLnRpdGxlIHx8IHN0cnVjdHVyZURlZmluaXRpb24ubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0dTNcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0dTMgPSA8Rmhpci5TVFUzLkltcGxlbWVudGF0aW9uR3VpZGU+IGltcGxlbWVudGF0aW9uR3VpZGU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3R1My5wYWNrYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1My5wYWNrYWdlID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kSW5QYWNrYWdlcyA9IF8uZmlsdGVyKHN0dTMucGFja2FnZSwgKGlnUGFja2FnZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLmZpbHRlcihpZ1BhY2thZ2UucmVzb3VyY2UsIChyZXNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2Uuc291cmNlUmVmZXJlbmNlICYmIHJlc291cmNlLnNvdXJjZVJlZmVyZW5jZS5yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5zb3VyY2VSZWZlcmVuY2UucmVmZXJlbmNlID09PSBgU3RydWN0dXJlRGVmaW5pdGlvbi8ke3N0cnVjdHVyZURlZmluaXRpb24uaWR9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kSW5QYWNrYWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdSZXNvdXJjZSA9IDxGaGlyLlNUVTMuSW1wbGVtZW50YXRpb25HdWlkZVBhY2thZ2VSZXNvdXJjZT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdHJ1Y3R1cmVEZWZpbml0aW9uLnRpdGxlIHx8IHN0cnVjdHVyZURlZmluaXRpb24ubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlUmVmZXJlbmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U6IGBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7c3RydWN0dXJlRGVmaW5pdGlvbi5pZH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogc3RydWN0dXJlRGVmaW5pdGlvbi50aXRsZSB8fCBzdHJ1Y3R1cmVEZWZpbml0aW9uLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3R1My5wYWNrYWdlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHUzLnBhY2thZ2UucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnRGVmYXVsdCBQYWNrYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiBbbmV3UmVzb3VyY2VdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3R1My5wYWNrYWdlWzBdLnJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHUzLnBhY2thZ2VbMF0ucmVzb3VyY2UgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0dTMucGFja2FnZVswXS5yZXNvdXJjZS5wdXNoKG5ld1Jlc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm1ldGhvZCA9ICdQVVQnO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmJvZHkgPSBpbXBsZW1lbnRhdGlvbkd1aWRlO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBycChvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiByZXNvbHZlKHJlc3VsdHMpKVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIHN0cnVjdHVyZSBkZWZpbml0aW9uIGZyb20gdGhlIHNwZWNpZmllZCBpbXBsZW1lbnRhdGlvbiBndWlkZVxuICAgICAqIEBwYXJhbSBzdHJ1Y3R1cmVEZWZpbml0aW9uIFRoZSBzdHJ1Y3R1cmUgZGVmaW5pdGlvbiB0byByZW1vdmUgKG11c3QgaGF2ZSBhbiBpZClcbiAgICAgKiBAcGFyYW0gaW1wbGVtZW50YXRpb25HdWlkZUlkIFRoZSBpZCBvZiB0aGUgaW1wbGVtZW50YXRpb24gZ3VpZGUgdG8gcmVtb3ZlIHRoZSBzdHJ1Y3R1cmUgZGVmaW5pdGlvbiBmcm9tXG4gICAgICovXG4gICAgcHJpdmF0ZSByZW1vdmVGcm9tSW1wbGVtZW50YXRpb25HdWlkZShzdHJ1Y3R1cmVEZWZpbml0aW9uLCBpbXBsZW1lbnRhdGlvbkd1aWRlSWQpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IDxSZXF1ZXN0T3B0aW9ucz4ge1xuICAgICAgICAgICAgICAgIHVybDogRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsICdJbXBsZW1lbnRhdGlvbkd1aWRlJywgaW1wbGVtZW50YXRpb25HdWlkZUlkKSxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGpzb246IHRydWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJwKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLnRoZW4oKGltcGxlbWVudGF0aW9uR3VpZGU6IEZoaXIuSW1wbGVtZW50YXRpb25HdWlkZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5maGlyU2VydmVyVmVyc2lvbiAhPT0gJ3N0dTMnKSB7ICAgICAgICAgICAgICAgIC8vIHI0K1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcjQgPSA8Rmhpci5SNC5JbXBsZW1lbnRhdGlvbkd1aWRlPiBpbXBsZW1lbnRhdGlvbkd1aWRlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXI0LmRlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uID0geyByZXNvdXJjZTogW10gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyNC5kZWZpbml0aW9uLnJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcjQuZGVmaW5pdGlvbi5yZXNvdXJjZSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZFJlc291cmNlID0gXy5maW5kKHI0LmRlZmluaXRpb24ucmVzb3VyY2UsIChyZXNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZS5yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlLnJlZmVyZW5jZS5yZWZlcmVuY2UgPT09IGBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7c3RydWN0dXJlRGVmaW5pdGlvbi5pZH1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmRSZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcjQuZGVmaW5pdGlvbi5yZXNvdXJjZS5pbmRleE9mKGZvdW5kUmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI0LmRlZmluaXRpb24ucmVzb3VyY2Uuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdHUzXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHUzID0gPEZoaXIuU1RVMy5JbXBsZW1lbnRhdGlvbkd1aWRlPiBpbXBsZW1lbnRhdGlvbkd1aWRlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXN0dTMucGFja2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0dTMucGFja2FnZSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goc3R1My5wYWNrYWdlLCAoaWdQYWNrYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRSZXNvdXJjZSA9IF8uZmluZChpZ1BhY2thZ2UucmVzb3VyY2UsIChyZXNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2Uuc291cmNlUmVmZXJlbmNlICYmIHJlc291cmNlLnNvdXJjZVJlZmVyZW5jZS5yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5zb3VyY2VSZWZlcmVuY2UucmVmZXJlbmNlID09PSBgU3RydWN0dXJlRGVmaW5pdGlvbi8ke3N0cnVjdHVyZURlZmluaXRpb24uaWR9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kUmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBpZ1BhY2thZ2UucmVzb3VyY2UuaW5kZXhPZihmb3VuZFJlc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdQYWNrYWdlLnJlc291cmNlLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm1ldGhvZCA9ICdQVVQnO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmJvZHkgPSBpbXBsZW1lbnRhdGlvbkd1aWRlO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBycChvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiByZXNvbHZlKHJlc3VsdHMpKVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2F2ZVN0cnVjdHVyZURlZmluaXRpb24oaWQ6IHN0cmluZywgc3RydWN0dXJlRGVmaW5pdGlvbjogRmhpci5TdHJ1Y3R1cmVEZWZpbml0aW9uLCBvcHRpb25zPzogU3RydWN0dXJlRGVmaW5pdGlvbk9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmICghc3RydWN0dXJlRGVmaW5pdGlvbikge1xuICAgICAgICAgICAgICAgIHRocm93IDxSZXN0UmVqZWN0aW9uPiB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ0Egc3RydWN0dXJlRGVmaW5pdGlvbiBwcm9wZXJ0eSBpcyByZXF1aXJlZCcgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFzdHJ1Y3R1cmVEZWZpbml0aW9uLmlkKSB7XG4gICAgICAgICAgICAgICAgc3RydWN0dXJlRGVmaW5pdGlvbi5pZCA9IGlkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdXBkYXRlZFN0cnVjdHVyZURlZmluaXRpb247XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVPcHRpb25zID0gPFJlcXVlc3RPcHRpb25zPiB7XG4gICAgICAgICAgICAgICAgdXJsOiBGaGlySGVscGVyLmJ1aWxkVXJsKHRoaXMuYmFzZVVybCwgdGhpcy5yZXNvdXJjZVR5cGUsIGlkKSxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgICAgIGpzb246IHRydWUsXG4gICAgICAgICAgICAgICAgYm9keTogc3RydWN0dXJlRGVmaW5pdGlvbixcbiAgICAgICAgICAgICAgICByZXNvbHZlV2l0aEZ1bGxSZXNwb25zZTogdHJ1ZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcnAodXBkYXRlT3B0aW9ucylcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHJlc3VsdHMuaGVhZGVycy5sb2NhdGlvbiB8fCByZXN1bHRzLmhlYWRlcnNbJ2NvbnRlbnQtbG9jYXRpb24nXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZISVIgc2VydmVyIGRpZCBub3QgcmVzcG9uZCB3aXRoIGEgbG9jYXRpb24gdG8gdGhlIG5ld2x5IGNyZWF0ZWQgJHt0aGlzLnJlc291cmNlVHlwZX1gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBycCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGxvY2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb246IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkU3RydWN0dXJlRGVmaW5pdGlvbiA9IHJlc3VsdHM7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWdVcGRhdGVQcm9taXNlcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2gob3B0aW9ucy5pbXBsZW1lbnRhdGlvbkd1aWRlcywgKGltcGxlbWVudGF0aW9uR3VpZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5pc05ldykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ1VwZGF0ZVByb21pc2VzLnB1c2godGhpcy5hZGRUb0ltcGxlbWVudGF0aW9uR3VpZGUodXBkYXRlZFN0cnVjdHVyZURlZmluaXRpb24sIGltcGxlbWVudGF0aW9uR3VpZGUuaWQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUuaXNSZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnVXBkYXRlUHJvbWlzZXMucHVzaCh0aGlzLnJlbW92ZUZyb21JbXBsZW1lbnRhdGlvbkd1aWRlKHVwZGF0ZWRTdHJ1Y3R1cmVEZWZpbml0aW9uLCBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoaWdVcGRhdGVQcm9taXNlcyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiByZXNvbHZlKHVwZGF0ZWRTdHJ1Y3R1cmVEZWZpbml0aW9uKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0QmFzZVN0cnVjdHVyZURlZmluaXRpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8Rmhpci5TdHJ1Y3R1cmVEZWZpbml0aW9uPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb25maWdDb250cm9sbGVyID0gbmV3IENvbmZpZ0NvbnRyb2xsZXIodGhpcy5iYXNlVXJsKTtcbiAgICAgICAgICAgIGNvbmZpZ0NvbnRyb2xsZXIuZ2V0RmhpckNhcGFiaWxpdGllcygpXG4gICAgICAgICAgICAgICAgLnRoZW4oKGNhcGFiaWxpdGllcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdWJsaXNoZWRGaGlyVmVyc2lvbiA9IF8uZmluZChmaGlyQ29uZmlnLnB1Ymxpc2hlZFZlcnNpb25zLCAocHVibGlzaGVkVmVyc2lvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbXZlci5zYXRpc2ZpZXMoY2FwYWJpbGl0aWVzLmZoaXJWZXJzaW9uLCBwdWJsaXNoZWRWZXJzaW9uLnZlcnNpb24pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXB1Ymxpc2hlZEZoaXJWZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyA8UmVzdFJlamVjdGlvbj4geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdVbnN1cHBvcnRlZCBGSElSIHZlcnNpb24gJyArIGNhcGFiaWxpdGllcy5maGlyVmVyc2lvbiB9O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogcHVibGlzaGVkRmhpclZlcnNpb24udXJsICsgJy8nICsgaWQgKyAnLnByb2ZpbGUuanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICAgICAganNvbjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChiYXNlU3RydWN0dXJlRGVmaW5pdGlvbikgPT4gcmVzb2x2ZShiYXNlU3RydWN0dXJlRGVmaW5pdGlvbikpXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByZXBhcmVTZWFyY2hRdWVyeShxdWVyeT86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzdXBlci5wcmVwYXJlU2VhcmNoUXVlcnkocXVlcnkpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHByZXBhcmVkUXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXBhcmVkUXVlcnkuaW1wbGVtZW50YXRpb25HdWlkZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVwYXJlZFF1ZXJ5WydfaGFzOkltcGxlbWVudGF0aW9uR3VpZGU6cmVzb3VyY2U6X2lkJ10gPSBwcmVwYXJlZFF1ZXJ5LmltcGxlbWVudGF0aW9uR3VpZGVJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBwcmVwYXJlZFF1ZXJ5LmltcGxlbWVudGF0aW9uR3VpZGVJZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocHJlcGFyZWRRdWVyeSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0KGlkOiBzdHJpbmcsIHF1ZXJ5PzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IEZoaXJIZWxwZXIuYnVpbGRVcmwodGhpcy5iYXNlVXJsLCB0aGlzLnJlc291cmNlVHlwZSwgaWQsIG51bGwsIHF1ZXJ5KTtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAganNvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgc3RydWN0dXJlRGVmaW5pdGlvbjtcblxuICAgICAgICAgICAgcnAocmVxdWVzdE9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RydWN0dXJlRGVmaW5pdGlvbiA9IHJlc3VsdHM7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsICdJbXBsZW1lbnRhdGlvbkd1aWRlJywgbnVsbCwgbnVsbCwgeyByZXNvdXJjZTogYFN0cnVjdHVyZURlZmluaXRpb24vJHtpZH1gIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHM6IEZoaXIuQnVuZGxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSByZXN1bHRzID8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb25HdWlkZXM6IF8ubWFwKHJlc3VsdHMgJiYgcmVzdWx0cy5lbnRyeSA/IHJlc3VsdHMuZW50cnkgOiBbXSwgKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogKDxGaGlyLkltcGxlbWVudGF0aW9uR3VpZGU+IGVudHJ5LnJlc291cmNlKS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZW50cnkucmVzb3VyY2UuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSA6IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogc3RydWN0dXJlRGVmaW5pdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlKGRhdGE6IFNhdmVTdHJ1Y3R1cmVEZWZpbml0aW9uUmVxdWVzdCwgcXVlcnk/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zYXZlU3RydWN0dXJlRGVmaW5pdGlvbihuYW5vaWQoOCksIGRhdGEucmVzb3VyY2UsIGRhdGEub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZShpZDogc3RyaW5nLCBkYXRhOiBTYXZlU3RydWN0dXJlRGVmaW5pdGlvblJlcXVlc3QsIHF1ZXJ5PzogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZVN0cnVjdHVyZURlZmluaXRpb24oaWQsIGRhdGEucmVzb3VyY2UsIGRhdGEub3B0aW9ucyk7XG4gICAgfVxufSJdfQ==