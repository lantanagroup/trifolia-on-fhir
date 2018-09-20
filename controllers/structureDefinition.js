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

const thisResourceType = 'StructureDefinition';

router.get('/', checkJwt, (req, res) => {
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

    const url = req.getFhirServerUrl(thisResourceType, null, null, queryParams);

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