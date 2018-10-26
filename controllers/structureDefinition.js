const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const _ = require('underscore');
const config = require('config');
const fhirConfig = config.get('fhir');
const semver = require('semver');
const {resolve} = require('url');
const log4js = require('log4js');
const Q = require('q');
const FhirHelper = require('../fhirHelper');
const rp = require('request-promise');

const thisResourceType = 'StructureDefinition';
const log = log4js.getLogger();

function saveAdditionalOptions(req, structureDefinition) {
    if (!req.body.options) {
        return Q.resolve();
    }

    function addToImplementationGuide(implementationGuideId) {
        const deferred = Q.defer();

        FhirHelper.getResource(req.fhirServerBase, 'ImplementationGuide', implementationGuideId)
            .then((implementationGuide) => {
                if (req.fhirServerVersion !== 'stu3') {         // r4
                    if (!implementationGuide.definition) {
                        implementationGuide.definition = { resource: [] };
                    }

                    if (!implementationGuide.definition.resource) {
                        implementationGuide.definition.resource = [];
                    }

                    const foundResource = _.find(implementationGuide.definition.resource, (resource) => {
                        if (resource.reference) {
                            return resource.reference.reference === `StructureDefinition/${structureDefinition.id}`;
                        }
                    });

                    if (!foundResource) {
                        implementationGuide.definition.resource.push({
                            reference: {
                                reference: `StructureDefinition/${structureDefinition.id}`,
                                name: structureDefinition.title || structureDefinition.name
                            }
                        });
                    }
                } else {                                        // stu3
                    if (!implementationGuide.package) {
                        implementationGuide.package = [];
                    }

                    const foundInPackages = _.filter(implementationGuide.package, (package) => {
                        return _.find(package.resource, (resource) => {
                            if (resource.sourceReference && resource.sourceReference.reference) {
                                return resource.sourceReference.reference === `StructureDefinition/${structureDefinition.id}`;
                            }
                        });
                    });

                    if (foundInPackages.length === 0) {
                        const newResource = {
                            name: structureDefinition.title || structureDefinition.name,
                            sourceReference: {
                                reference: `StructureDefinition/${structureDefinition.id}`,
                                display: structureDefinition.title || structureDefinition.name
                            }
                        };

                        if (implementationGuide.package.length === 0) {
                            implementationGuide.package.push({
                                name: 'Default Package',
                                resource: [newResource]
                            });
                        } else {
                            if (!implementationGuide.package[0].resource) {
                                implementationGuide.package[0].resource = [];
                            }

                            implementationGuide.package[0].resource.push(newResource);
                        }
                    }
                }

                FhirHelper.updateResource(req.fhirServerBase, 'ImplementationGuide', implementationGuideId, implementationGuide)
                    .then(deferred.resolve)
                    .catch(deferred.reject);
            })
            .catch(deferred.reject);

        return deferred.promise;
    };

    function removeFromImplementationGuide(implementationGuideId) {
        const deferred = Q.defer();

        FhirHelper.getResource(req.fhirServerBase, 'ImplementationGuide', implementationGuideId)
            .then((implementationGuide) => {
                if (req.fhirServerVersion !== 'stu3') {         // r4
                    if (!implementationGuide.definition) {
                        implementationGuide.definition = { resource: [] };
                    }

                    if (!implementationGuide.definition.resource) {
                        implementationGuide.definition.resource = [];
                    }

                    const foundResource = _.find(implementationGuide.definition.resource, (resource) => {
                        if (resource.reference) {
                            return resource.reference.reference === `StructureDefinition/${structureDefinition.id}`;
                        }
                    });

                    if (foundResource) {
                        const index = implementationGuide.definition.resource.indexOf(foundResource);
                        implementationGuide.definition.resource.splice(index, 1);
                    }
                } else {                                        // stu3
                    if (!implementationGuide.package) {
                        implementationGuide.package = [];
                    }

                    _.each(implementationGuide.package, (package) => {
                        const foundResource = _.find(package.resource, (resource) => {
                            if (resource.sourceReference && resource.sourceReference.reference) {
                                return resource.sourceReference.reference === `StructureDefinition/${structureDefinition.id}`;
                            }
                        });

                        if (foundResource) {
                            const index = package.resource.indexOf(foundResource);
                            package.resource.splice(index, 1);
                        }
                    });
                }

                FhirHelper.updateResource(req.fhirServerBase, 'ImplementationGuide', implementationGuideId, implementationGuide)
                    .then(deferred.resolve)
                    .catch(deferred.reject);
            })
            .catch(deferred.reject);

        return deferred.promise;
    }

    const promises = [];

    _.each(req.body.options.implementationGuidesBundle, (implementationGuide) => {
        if (implementationGuide.isNew) {
            promises.push(addToImplementationGuide(implementationGuide.id));
        } else {
            promises.push(removeFromImplementationGuide(implementationGuide.id));
        }
    });

    return Q.all(promises);
}

/**
 * Prepares a url to search for structure definitions based on the criteria specified in the request
 * @param req The express.js request
 * @return {Promise<string>} A promise that resolves with a string parameter representing the query that should be executed against the fhir server
 */
function prepareSearchUrl(req) {
    const queryParams = { _summary: true, _count: 10 };

    if (req.query.page && parseInt(req.query.page) != 1) {
        queryParams._getpagesoffset = (parseInt(req.query.page) - 1) * 10;
    }

    if (req.query.name) {
        queryParams['name:contains'] = req.query.name;
    }

    if (req.query.urlText) {
        queryParams.url = req.query.urlText;
    }

    if (!req.query.implementationGuideId) {
        const url = req.getFhirServerUrl(thisResourceType, null, null, queryParams);
        return Q.resolve(url);
    } else {
        // If an implementationGuideId is specified in the query, get the implementation guide first
        // and extract any package/resource references to StructureDefinitions from it, and populate the
        // queryParams with an _id=XX,YY,ZZ parameter
        const deferred = Q.defer();
        const igUrl = req.getFhirServerUrl('ImplementationGuide', req.query.implementationGuideId);

        // TODO: possibly change to _has:ImplementationGuide:resource:_id=ig.id

        log.debug('Preparing search url for structure definitions');

        request(igUrl, { json: true }, (error, results, implementationGuide) => {
            if (error) {
                return deferred.reject(error);
            }

            const referencedIds = [];

            _.each(implementationGuide.package, (package) => {
                _.each(package.resource, (resource) => {
                    if (resource.sourceReference && resource.sourceReference.reference) {
                        const parsedReference = FhirHelper.parseUrl(resource.sourceReference.reference);

                        if (parsedReference && parsedReference.resourceType === 'StructureDefinition') {
                            referencedIds.push(parsedReference.id);
                        }
                    }
                });
            });

            queryParams._id = referencedIds.join(',');

            const url = req.getFhirServerUrl(thisResourceType, null, null, queryParams);
            deferred.resolve(url);
        });

        return deferred.promise;
    }
}

router.get('/', checkJwt, (req, res) => {
    prepareSearchUrl(req)
        .then(function(url) {
            const options = {
                url: url,
                json: true,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            };

            log.debug('Searching structure definitions');

            request(options, (error, results, body) => {
                if (error) {
                    log.error('Error retrieving structure definitions from FHIR server: ' + error);
                    return res.status(500).send('Error retrieving structure definition from FHIR server');
                }

                if (body && body.resourceType === 'Bundle') {
                    const structureDefinitions = _.map(body.entry, (item) => {
                        var ret = {
                            id: item.resource.id,
                            name: item.resource.name,
                            title: item.resource.title,
                            type: item.resource.type,
                            url: item.resource.url,
                            experimental: item.resource.experimental
                        };

                        if (item.resource.contact && item.resource.contact.length > 0) {
                            ret.contact = _.map(item.resource.contact, (contact) => {
                                var foundUrl = _.find(contact.telecom, (telecom) => telecom.system === 'url');

                                if (contact.name) {
                                    return 'Name: ' + contact.name;
                                } else if (foundUrl) {
                                    return 'URL: ' + foundUrl.value;
                                } else {
                                    return '';
                                }
                            }).join(', ');
                        }

                        return ret;
                    });

                    res.send({
                        total: body.total,
                        pages: Math.ceil(body.total / 10),
                        items: structureDefinitions
                    });
                } else if (body && body.resourceType === 'OperationOutcome') {
                    log.error(body.text ? body.text.div : JSON.stringify(body));
                    res.status(500).send();
                }
            });
        })
        .catch(function(err) {
            log.error('Error retrieving structure definition from FHIR server: ' + err);
            res.status(500).send('Error retrieving structure definition from FHIR server');
        });
});

router.get('/:id', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl(thisResourceType, req.params.id);
    const igsUrl = req.getFhirServerUrl('ImplementationGuide', null, null, {
        _summary: true,
        resource: 'StructureDefinition/' + encodeURIComponent(req.params.id)
    });
    const fhirServerConfig = _.find(fhirConfig.servers, (server) => server.id === req.headers['fhirserver']);
    let structureDefinition;

    rp({ url: url, json: true })
        .then((results) => {
            structureDefinition = results;

            // TODO: Right now, HAPI R4 does not support the "resource" parameter on ImplementationGuide. Undo the "if" later.
            if (fhirServerConfig.version === 'stu3') {
                return rp({url: igsUrl, json: true});
            }
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

            res.send({
                resource: structureDefinition,
                options: options
            });
        })
        .catch((err) => {
            log.error('Error retrieving structure definition from FHIR server: ' + err);
            return res.status(500).send('Error retrieving structure definition from FHIR server');
        });
});

router.get('/base/:id', checkJwt, (req, res) => {
    const conformanceUrl = req.getFhirServerUrl('metadata');

    request(conformanceUrl, { json: true }, (error, results, conformance) => {
        const publishedFhirVersion = _.find(fhirConfig.publishedVersions, (publishedVersion) => {
            return semver.satisfies(conformance.fhirVersion, publishedVersion.version);
        });

        if (!publishedFhirVersion) {
            log.error('Unsupported FHIR version ' + conformance.fhirVersion);
            res.status(500).send('Unsupported FHIR version ' + conformance.fhirVersion);
        }

        const baseUrl = resolve(publishedFhirVersion.url, req.params.id.toLowerCase() + '.profile.json');

        request(baseUrl, { json: true }, (error, results, structureDefinition) => {
            res.send(structureDefinition);
        });
    });
});

/**
 * @param req Express.JS http request
 * @param req.body
 * @param req.body.resource The StructureDefinition resource
 * @param req.body.options The additional options for the StructureDefinition
 */
router.post('/', checkJwt, (req, res) => {
    const createUrl = req.getFhirServerUrl(thisResourceType);

    const options = {
        url: createUrl,
        method: 'POST',
        json: true,
        body: req.body.resource
    };

    request(options, (err, results, createBody) => {
        if (err) {
            log.error('Error from FHIR server while creating structure definition: ' + err);
            return res.status(500).send('Error from FHIR server while creating structure definition');
        }
        const location = results.headers.location || results.headers['content-location'];

        if (location) {
            request(location, (err, results, retrieveBody) => {
                if (err) {
                    log.error('Error from FHIR server while retrieving newly created structure definition: ' + err);
                    return res.status(500).send('Error from FHIR server while retrieving newly created structure definition');
                }

                saveAdditionalOptions(req, retrieveBody)
                    .then(() => {
                        res.send(retrieveBody);
                    })
                    .catch((err) => {
                        log.error(err);
                        res.status(500).send('An error occurred while saving additional options for the StructureDefinition');
                    });
            })
        } else {
            res.status(500).send('FHIR server did not respond with a location to the newly created structure definition');
        }
    });
});


/**
 * @param req Express.JS http request
 * @param req.body
 * @param req.body.resource The StructureDefinition resource
 * @param req.body.options The additional options for the StructureDefinition
 */
router.put('/:id', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl(thisResourceType, req.params.id);
    let structureDefinition = req.body.resource;

    FhirHelper.updateResource(req.fhirServerBase, 'StructureDefinition', req.params.id, structureDefinition)
        .then((response) => {
            return FhirHelper.getResource(req.fhirServerBase, 'StructureDefinition', req.params.id);
        })
        .then((updatedStructureDefinition) => {
            structureDefinition = updatedStructureDefinition;
            return saveAdditionalOptions(req, structureDefinition);
        })
        .then(() => {
            res.send(structureDefinition);
        })
        .catch((err) => {
            log.error('Error from FHIR server: ' + err);
            return res.status(500).send('Error from FHIR server');
        });
});

router.delete('/:id', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl(thisResourceType, req.params.id);

    const options = {
        url: url,
        method: 'DELETE'
    };

    request(options, (err, results, body) => {
        if (err) {
            log.error('Error from FHIR server while deleting structure definition: ' + err);
            return res.status(500).send('Error from FHIR server while deleting structure definition');
        }

        res.status(204).send();
    });
});

module.exports = router;