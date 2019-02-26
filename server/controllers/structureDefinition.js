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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RydWN0dXJlRGVmaW5pdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0cnVjdHVyZURlZmluaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsbUNBQW1DO0FBQ25DLDRDQUE0QztBQUM1QyxzQ0FBc0M7QUFDdEMsaUNBQWlDO0FBQ2pDLGlDQUFpQztBQUNqQyxnQ0FBZ0M7QUFDaEMsNENBQTRDO0FBQzVDLDJDQUFzQztBQUd0QyxxQ0FBMEM7QUFFMUMsTUFBTSxVQUFVLEdBQWdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFlbkQsTUFBYSw2QkFBOEIsU0FBUSxxQkFBUztJQUdqRCxNQUFNLENBQUMsVUFBVTtRQUNwQixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQW1CLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBa0IsR0FBb0IsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN6RyxNQUFNLFVBQVUsR0FBRyxJQUFJLDZCQUE2QixDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDdkgsVUFBVSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2lCQUMvQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3BDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsNkJBQTZCLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNuRixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENB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SUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekUsQ0FBQztDQUNKO0FBcFVELHNFQW9VQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG5hbm9pZCBmcm9tICduYW5vaWQnO1xyXG5pbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgKiBhcyBBdXRoSGVscGVyIGZyb20gJy4uL2F1dGhIZWxwZXInO1xyXG5pbXBvcnQgKiBhcyBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xyXG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnY29uZmlnJztcclxuaW1wb3J0ICogYXMgc2VtdmVyIGZyb20gJ3NlbXZlcic7XHJcbmltcG9ydCAqIGFzIF8gZnJvbSAndW5kZXJzY29yZSc7XHJcbmltcG9ydCAqIGFzIEZoaXJIZWxwZXIgZnJvbSAnLi4vZmhpckhlbHBlcic7XHJcbmltcG9ydCB7RmhpckxvZ2ljfSBmcm9tICcuL2ZoaXJMb2dpYyc7XHJcbmltcG9ydCB7UmVxdWVzdEhhbmRsZXJ9IGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQge0V4dGVuZGVkUmVxdWVzdCwgRmhpciwgRmhpckNvbmZpZywgUmVxdWVzdE9wdGlvbnMsIFJlc3RSZWplY3Rpb259IGZyb20gJy4vbW9kZWxzJztcclxuaW1wb3J0IHtDb25maWdDb250cm9sbGVyfSBmcm9tICcuL2NvbmZpZyc7XHJcblxyXG5jb25zdCBmaGlyQ29uZmlnID0gPEZoaXJDb25maWc+IGNvbmZpZy5nZXQoJ2ZoaXInKTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU3RydWN0dXJlRGVmaW5pdGlvbk9wdGlvbnMge1xyXG4gICAgaW1wbGVtZW50YXRpb25HdWlkZXM6IFt7XHJcbiAgICAgICAgaWQ6IHN0cmluZztcclxuICAgICAgICBpc05ldzogYm9vbGVhbjtcclxuICAgICAgICBpc1JlbW92ZWQ6IGJvb2xlYW47XHJcbiAgICB9XTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTYXZlU3RydWN0dXJlRGVmaW5pdGlvblJlcXVlc3Qge1xyXG4gICAgb3B0aW9ucz86IFN0cnVjdHVyZURlZmluaXRpb25PcHRpb25zO1xyXG4gICAgcmVzb3VyY2U6IEZoaXIuU3RydWN0dXJlRGVmaW5pdGlvbjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN0cnVjdHVyZURlZmluaXRpb25Db250cm9sbGVyIGV4dGVuZHMgRmhpckxvZ2ljIHtcclxuICAgIHByaXZhdGUgZmhpclNlcnZlclZlcnNpb246IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXRSb3V0ZXMoKSB7XHJcbiAgICAgICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbiAgICAgICAgcm91dGVyLmdldCgnL2Jhc2UvOmlkJywgPFJlcXVlc3RIYW5kbGVyPiBBdXRoSGVscGVyLmNoZWNrSnd0LCA8UmVxdWVzdEhhbmRsZXI+IChyZXE6IEV4dGVuZGVkUmVxdWVzdCwgcmVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgU3RydWN0dXJlRGVmaW5pdGlvbkNvbnRyb2xsZXIoJ1N0cnVjdHVyZURlZmluaXRpb24nLCByZXEuZmhpclNlcnZlckJhc2UsIHJlcS5maGlyU2VydmVyVmVyc2lvbik7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ2V0QmFzZVN0cnVjdHVyZURlZmluaXRpb24ocmVxLnBhcmFtcy5pZClcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiByZXMuc2VuZChyZXN1bHRzKSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiBTdHJ1Y3R1cmVEZWZpbml0aW9uQ29udHJvbGxlci5oYW5kbGVFcnJvcihlcnIsIG51bGwsIHJlcykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdFJvdXRlcygnU3RydWN0dXJlRGVmaW5pdGlvbicsIHJvdXRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocmVzb3VyY2VUeXBlOiBzdHJpbmcsIGJhc2VVcmw6IHN0cmluZywgZmhpclNlcnZlclZlcnNpb246IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHJlc291cmNlVHlwZSwgYmFzZVVybCk7XHJcblxyXG4gICAgICAgIHRoaXMuZmhpclNlcnZlclZlcnNpb24gPSBmaGlyU2VydmVyVmVyc2lvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBzdHJ1Y3R1cmUgZGVmaW5pdGlvbiB0byB0aGUgc3BlY2lmaWVkIGltcGxlbWVudGF0aW9uIGd1aWRlXHJcbiAgICAgKiBAcGFyYW0gc3RydWN0dXJlRGVmaW5pdGlvbiBUaGUgc3RydWN0dXJlIGRlZmluaXRpb24gdG8gYWRkIChtdXN0IGhhdmUgYW4gaWQpXHJcbiAgICAgKiBAcGFyYW0gaW1wbGVtZW50YXRpb25HdWlkZUlkIFRoZSBpZCBvZiB0aGUgaW1wbGVtZW50YXRpb24gZ3VpZGUgdG8gYWRkIHRoZSBzdHJ1Y3R1cmUgZGVmaW5pdGlvbiB0b1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZFRvSW1wbGVtZW50YXRpb25HdWlkZShzdHJ1Y3R1cmVEZWZpbml0aW9uLCBpbXBsZW1lbnRhdGlvbkd1aWRlSWQpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSA8UmVxdWVzdE9wdGlvbnM+IHtcclxuICAgICAgICAgICAgICAgIHVybDogRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsICdJbXBsZW1lbnRhdGlvbkd1aWRlJywgaW1wbGVtZW50YXRpb25HdWlkZUlkKSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBycChvcHRpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGltcGxlbWVudGF0aW9uR3VpZGU6IEZoaXIuSW1wbGVtZW50YXRpb25HdWlkZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZoaXJTZXJ2ZXJWZXJzaW9uICE9PSAnc3R1MycpIHsgICAgICAgIC8vIHI0K1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByNCA9IDxGaGlyLlI0LkltcGxlbWVudGF0aW9uR3VpZGU+IGltcGxlbWVudGF0aW9uR3VpZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXI0LmRlZmluaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI0LmRlZmluaXRpb24gPSB7IHJlc291cmNlOiBbXSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXI0LmRlZmluaXRpb24ucmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI0LmRlZmluaXRpb24ucmVzb3VyY2UgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRSZXNvdXJjZSA9IF8uZmluZChyNC5kZWZpbml0aW9uLnJlc291cmNlLCAocmVzb3VyY2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZS5yZWZlcmVuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2UucmVmZXJlbmNlLnJlZmVyZW5jZSA9PT0gYFN0cnVjdHVyZURlZmluaXRpb24vJHtzdHJ1Y3R1cmVEZWZpbml0aW9uLmlkfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZFJlc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uLnJlc291cmNlLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U6IGBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7c3RydWN0dXJlRGVmaW5pdGlvbi5pZH1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBzdHJ1Y3R1cmVEZWZpbml0aW9uLnRpdGxlIHx8IHN0cnVjdHVyZURlZmluaXRpb24ubmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3R1M1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHUzID0gPEZoaXIuU1RVMy5JbXBsZW1lbnRhdGlvbkd1aWRlPiBpbXBsZW1lbnRhdGlvbkd1aWRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHUzLnBhY2thZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0dTMucGFja2FnZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZEluUGFja2FnZXMgPSBfLmZpbHRlcihzdHUzLnBhY2thZ2UsIChpZ1BhY2thZ2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLmZpbHRlcihpZ1BhY2thZ2UucmVzb3VyY2UsIChyZXNvdXJjZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZS5zb3VyY2VSZWZlcmVuY2UgJiYgcmVzb3VyY2Uuc291cmNlUmVmZXJlbmNlLnJlZmVyZW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2Uuc291cmNlUmVmZXJlbmNlLnJlZmVyZW5jZSA9PT0gYFN0cnVjdHVyZURlZmluaXRpb24vJHtzdHJ1Y3R1cmVEZWZpbml0aW9uLmlkfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkubGVuZ3RoID4gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmRJblBhY2thZ2VzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3UmVzb3VyY2UgPSA8Rmhpci5TVFUzLkltcGxlbWVudGF0aW9uR3VpZGVQYWNrYWdlUmVzb3VyY2U+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdHJ1Y3R1cmVEZWZpbml0aW9uLnRpdGxlIHx8IHN0cnVjdHVyZURlZmluaXRpb24ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VSZWZlcmVuY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlOiBgU3RydWN0dXJlRGVmaW5pdGlvbi8ke3N0cnVjdHVyZURlZmluaXRpb24uaWR9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogc3RydWN0dXJlRGVmaW5pdGlvbi50aXRsZSB8fCBzdHJ1Y3R1cmVEZWZpbml0aW9uLm5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHUzLnBhY2thZ2UubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1My5wYWNrYWdlLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnRGVmYXVsdCBQYWNrYWdlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IFtuZXdSZXNvdXJjZV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHUzLnBhY2thZ2VbMF0ucmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1My5wYWNrYWdlWzBdLnJlc291cmNlID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHUzLnBhY2thZ2VbMF0ucmVzb3VyY2UucHVzaChuZXdSZXNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubWV0aG9kID0gJ1BVVCc7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ib2R5ID0gaW1wbGVtZW50YXRpb25HdWlkZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJwKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiByZXNvbHZlKHJlc3VsdHMpKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIHN0cnVjdHVyZSBkZWZpbml0aW9uIGZyb20gdGhlIHNwZWNpZmllZCBpbXBsZW1lbnRhdGlvbiBndWlkZVxyXG4gICAgICogQHBhcmFtIHN0cnVjdHVyZURlZmluaXRpb24gVGhlIHN0cnVjdHVyZSBkZWZpbml0aW9uIHRvIHJlbW92ZSAobXVzdCBoYXZlIGFuIGlkKVxyXG4gICAgICogQHBhcmFtIGltcGxlbWVudGF0aW9uR3VpZGVJZCBUaGUgaWQgb2YgdGhlIGltcGxlbWVudGF0aW9uIGd1aWRlIHRvIHJlbW92ZSB0aGUgc3RydWN0dXJlIGRlZmluaXRpb24gZnJvbVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlbW92ZUZyb21JbXBsZW1lbnRhdGlvbkd1aWRlKHN0cnVjdHVyZURlZmluaXRpb24sIGltcGxlbWVudGF0aW9uR3VpZGVJZCk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IDxSZXF1ZXN0T3B0aW9ucz4ge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBGaGlySGVscGVyLmJ1aWxkVXJsKHRoaXMuYmFzZVVybCwgJ0ltcGxlbWVudGF0aW9uR3VpZGUnLCBpbXBsZW1lbnRhdGlvbkd1aWRlSWQpLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGpzb246IHRydWVcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJwKG9wdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoaW1wbGVtZW50YXRpb25HdWlkZTogRmhpci5JbXBsZW1lbnRhdGlvbkd1aWRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZmhpclNlcnZlclZlcnNpb24gIT09ICdzdHUzJykgeyAgICAgICAgICAgICAgICAvLyByNCtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcjQgPSA8Rmhpci5SNC5JbXBsZW1lbnRhdGlvbkd1aWRlPiBpbXBsZW1lbnRhdGlvbkd1aWRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyNC5kZWZpbml0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uID0geyByZXNvdXJjZTogW10gfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyNC5kZWZpbml0aW9uLnJlc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByNC5kZWZpbml0aW9uLnJlc291cmNlID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kUmVzb3VyY2UgPSBfLmZpbmQocjQuZGVmaW5pdGlvbi5yZXNvdXJjZSwgKHJlc291cmNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UucmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlLnJlZmVyZW5jZS5yZWZlcmVuY2UgPT09IGBTdHJ1Y3R1cmVEZWZpbml0aW9uLyR7c3RydWN0dXJlRGVmaW5pdGlvbi5pZH1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZFJlc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHI0LmRlZmluaXRpb24ucmVzb3VyY2UuaW5kZXhPZihmb3VuZFJlc291cmNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI0LmRlZmluaXRpb24ucmVzb3VyY2Uuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3R1M1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHUzID0gPEZoaXIuU1RVMy5JbXBsZW1lbnRhdGlvbkd1aWRlPiBpbXBsZW1lbnRhdGlvbkd1aWRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHUzLnBhY2thZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0dTMucGFja2FnZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goc3R1My5wYWNrYWdlLCAoaWdQYWNrYWdlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZFJlc291cmNlID0gXy5maW5kKGlnUGFja2FnZS5yZXNvdXJjZSwgKHJlc291cmNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlLnNvdXJjZVJlZmVyZW5jZSAmJiByZXNvdXJjZS5zb3VyY2VSZWZlcmVuY2UucmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5zb3VyY2VSZWZlcmVuY2UucmVmZXJlbmNlID09PSBgU3RydWN0dXJlRGVmaW5pdGlvbi8ke3N0cnVjdHVyZURlZmluaXRpb24uaWR9YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmRSZXNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gaWdQYWNrYWdlLnJlc291cmNlLmluZGV4T2YoZm91bmRSZXNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdQYWNrYWdlLnJlc291cmNlLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5tZXRob2QgPSAnUFVUJztcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmJvZHkgPSBpbXBsZW1lbnRhdGlvbkd1aWRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnAob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHJlc29sdmUocmVzdWx0cykpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2F2ZVN0cnVjdHVyZURlZmluaXRpb24oaWQ6IHN0cmluZywgc3RydWN0dXJlRGVmaW5pdGlvbjogRmhpci5TdHJ1Y3R1cmVEZWZpbml0aW9uLCBvcHRpb25zPzogU3RydWN0dXJlRGVmaW5pdGlvbk9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXN0cnVjdHVyZURlZmluaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIHRocm93IDxSZXN0UmVqZWN0aW9uPiB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ0Egc3RydWN0dXJlRGVmaW5pdGlvbiBwcm9wZXJ0eSBpcyByZXF1aXJlZCcgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFzdHJ1Y3R1cmVEZWZpbml0aW9uLmlkKSB7XHJcbiAgICAgICAgICAgICAgICBzdHJ1Y3R1cmVEZWZpbml0aW9uLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB1cGRhdGVkU3RydWN0dXJlRGVmaW5pdGlvbjtcclxuICAgICAgICAgICAgY29uc3QgdXBkYXRlT3B0aW9ucyA9IDxSZXF1ZXN0T3B0aW9ucz4ge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBGaGlySGVscGVyLmJ1aWxkVXJsKHRoaXMuYmFzZVVybCwgdGhpcy5yZXNvdXJjZVR5cGUsIGlkKSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYm9keTogc3RydWN0dXJlRGVmaW5pdGlvbixcclxuICAgICAgICAgICAgICAgIHJlc29sdmVXaXRoRnVsbFJlc3BvbnNlOiB0cnVlXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBycCh1cGRhdGVPcHRpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHJlc3VsdHMuaGVhZGVycy5sb2NhdGlvbiB8fCByZXN1bHRzLmhlYWRlcnNbJ2NvbnRlbnQtbG9jYXRpb24nXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFsb2NhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZISVIgc2VydmVyIGRpZCBub3QgcmVzcG9uZCB3aXRoIGEgbG9jYXRpb24gdG8gdGhlIG5ld2x5IGNyZWF0ZWQgJHt0aGlzLnJlc291cmNlVHlwZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBycCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogbG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb246IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRTdHJ1Y3R1cmVEZWZpbml0aW9uID0gcmVzdWx0cztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWdVcGRhdGVQcm9taXNlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2gob3B0aW9ucy5pbXBsZW1lbnRhdGlvbkd1aWRlcywgKGltcGxlbWVudGF0aW9uR3VpZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmlzTmV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdVcGRhdGVQcm9taXNlcy5wdXNoKHRoaXMuYWRkVG9JbXBsZW1lbnRhdGlvbkd1aWRlKHVwZGF0ZWRTdHJ1Y3R1cmVEZWZpbml0aW9uLCBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUuaXNSZW1vdmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdVcGRhdGVQcm9taXNlcy5wdXNoKHRoaXMucmVtb3ZlRnJvbUltcGxlbWVudGF0aW9uR3VpZGUodXBkYXRlZFN0cnVjdHVyZURlZmluaXRpb24sIGltcGxlbWVudGF0aW9uR3VpZGUuaWQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoaWdVcGRhdGVQcm9taXNlcyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzb2x2ZSh1cGRhdGVkU3RydWN0dXJlRGVmaW5pdGlvbikpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRCYXNlU3RydWN0dXJlRGVmaW5pdGlvbihpZDogc3RyaW5nKTogUHJvbWlzZTxGaGlyLlN0cnVjdHVyZURlZmluaXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb25maWdDb250cm9sbGVyID0gbmV3IENvbmZpZ0NvbnRyb2xsZXIodGhpcy5iYXNlVXJsKTtcclxuICAgICAgICAgICAgY29uZmlnQ29udHJvbGxlci5nZXRGaGlyQ2FwYWJpbGl0aWVzKClcclxuICAgICAgICAgICAgICAgIC50aGVuKChjYXBhYmlsaXRpZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdWJsaXNoZWRGaGlyVmVyc2lvbiA9IF8uZmluZChmaGlyQ29uZmlnLnB1Ymxpc2hlZFZlcnNpb25zLCAocHVibGlzaGVkVmVyc2lvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VtdmVyLnNhdGlzZmllcyhjYXBhYmlsaXRpZXMuZmhpclZlcnNpb24sIHB1Ymxpc2hlZFZlcnNpb24udmVyc2lvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcHVibGlzaGVkRmhpclZlcnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgPFJlc3RSZWplY3Rpb24+IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnVW5zdXBwb3J0ZWQgRkhJUiB2ZXJzaW9uICcgKyBjYXBhYmlsaXRpZXMuZmhpclZlcnNpb24gfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBycCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogcHVibGlzaGVkRmhpclZlcnNpb24udXJsICsgJy8nICsgaWQgKyAnLnByb2ZpbGUuanNvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb246IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYmFzZVN0cnVjdHVyZURlZmluaXRpb24pID0+IHJlc29sdmUoYmFzZVN0cnVjdHVyZURlZmluaXRpb24pKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJlcGFyZVNlYXJjaFF1ZXJ5KHF1ZXJ5PzogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBzdXBlci5wcmVwYXJlU2VhcmNoUXVlcnkocXVlcnkpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocHJlcGFyZWRRdWVyeSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmVwYXJlZFF1ZXJ5LmltcGxlbWVudGF0aW9uR3VpZGVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVwYXJlZFF1ZXJ5WydfaGFzOkltcGxlbWVudGF0aW9uR3VpZGU6cmVzb3VyY2U6X2lkJ10gPSBwcmVwYXJlZFF1ZXJ5LmltcGxlbWVudGF0aW9uR3VpZGVJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHByZXBhcmVkUXVlcnkuaW1wbGVtZW50YXRpb25HdWlkZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShwcmVwYXJlZFF1ZXJ5KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQoaWQ6IHN0cmluZywgcXVlcnk/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IEZoaXJIZWxwZXIuYnVpbGRVcmwodGhpcy5iYXNlVXJsLCB0aGlzLnJlc291cmNlVHlwZSwgaWQsIG51bGwsIHF1ZXJ5KTtcclxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgc3RydWN0dXJlRGVmaW5pdGlvbjtcclxuXHJcbiAgICAgICAgICAgIHJwKHJlcXVlc3RPcHRpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzdHJ1Y3R1cmVEZWZpbml0aW9uID0gcmVzdWx0cztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJwKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBGaGlySGVscGVyLmJ1aWxkVXJsKHRoaXMuYmFzZVVybCwgJ0ltcGxlbWVudGF0aW9uR3VpZGUnLCBudWxsLCBudWxsLCB7IHJlc291cmNlOiBgU3RydWN0dXJlRGVmaW5pdGlvbi8ke2lkfWAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb246IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHM6IEZoaXIuQnVuZGxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHJlc3VsdHMgPyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcGxlbWVudGF0aW9uR3VpZGVzOiBfLm1hcChyZXN1bHRzICYmIHJlc3VsdHMuZW50cnkgPyByZXN1bHRzLmVudHJ5IDogW10sIChlbnRyeSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAoPEZoaXIuSW1wbGVtZW50YXRpb25HdWlkZT4gZW50cnkucmVzb3VyY2UpLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGVudHJ5LnJlc291cmNlLmlkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0gOiBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHN0cnVjdHVyZURlZmluaXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoZGF0YTogU2F2ZVN0cnVjdHVyZURlZmluaXRpb25SZXF1ZXN0LCBxdWVyeT86IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZVN0cnVjdHVyZURlZmluaXRpb24obmFub2lkKDgpLCBkYXRhLnJlc291cmNlLCBkYXRhLm9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoaWQ6IHN0cmluZywgZGF0YTogU2F2ZVN0cnVjdHVyZURlZmluaXRpb25SZXF1ZXN0LCBxdWVyeT86IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZVN0cnVjdHVyZURlZmluaXRpb24oaWQsIGRhdGEucmVzb3VyY2UsIGRhdGEub3B0aW9ucyk7XHJcbiAgICB9XHJcbn0iXX0=