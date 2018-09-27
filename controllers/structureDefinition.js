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
const log = log4js.getLogger();
const Q = require('q');
const FhirHelper = require('../fhirHelper');

const thisResourceType = 'StructureDefinition';

/**
 * Prepares a url to search for structure definitions based on the criteria specified in the request
 * @param req The express.js request
 * @return {Promise<string>} A promise that resolves with a string parameter representing the query that should be executed against the fhir server
 */
function prepareSearchUrl(req) {
    var queryParams = { _summary: true, _count: 10 };

    if (req.query.page && parseInt(req.query.page) != 1) {
        queryParams._getpagesoffset = (parseInt(req.query.page) - 1) * 10;
    }

    if (req.query.contentText) {
        queryParams._content = req.query.contentText;
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
            request(url, { json: true }, (error, results, body) => {
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

    request(url, { json: true }, (error, results, body) => {
        if (error) {
            log.error('Error retrieving structure definition from FHIR server: ' + error);
            return res.status(500).send('Error retrieving structure definition from FHIR server');
        }

        res.send(body);
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

router.post('/', checkJwt, (req, res) => {
    const createUrl = req.getFhirServerUrl(thisResourceType);

    const options = {
        url: createUrl,
        method: 'POST',
        json: true,
        body: req.body
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

                res.send(retrieveBody);
            })
        } else {
            res.status(500).send('FHIR server did not respond with a location to the newly created structure definition');
        }
    });
});


router.put('/:id', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl(thisResourceType, req.params.id);

    const options = {
        url: url,
        method: 'PUT',
        json: true,
        body: req.body
    };

    request(options, (err, results, updateBody) => {
        if (err) {
            log.error('Error from FHIR server while updating structure definition: ' + err);
            return res.status(500).send('Error from FHIR server while updating structure definition');
        }

        const location = results.headers.location || results.headers['content-location'];

        if (location) {
            request(location, (err, results, retrieveBody) => {
                if (err) {
                    log.error('Error from FHIR server while retrieving recently updated structure definition: ' + err);
                    return res.status(500).send('Error from FHIR server while retrieving recently updated structure definition');
                }

                res.send(retrieveBody);
            })
        } else {
            res.status(500).send('FHIR server did not respond with a location to the recently updated structure definition');
        }
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