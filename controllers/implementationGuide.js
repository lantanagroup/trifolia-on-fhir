const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const _ = require('underscore');
const config = require('config');
const rp = require('request-promise');

const fhirConfig = config.get('fhir');
const thisResourceType = 'ImplementationGuide';

router.get('/published', checkJwt, (req, res) => {
    if (!fhirConfig.publishedGuides) {
        return res.status(500).send('Server is not configured with a publishedGuides property');
    }

    rp(fhirConfig.publishedGuides, { json: true })
        .then((results) => {
            const guides = [];

            _.each(results.guides, (guide) => {
                _.each(guide.editions, (edition) => {
                    guides.push({
                        name: guide.name,
                        url: edition.url,
                        version: edition['ig-version'],
                        'npm-name': guide['npm-name']
                    });
                });
            });

            res.send(guides);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

router.get('/', checkJwt, (req, res) => {
    const options = {
        url: req.getFhirServerUrl(thisResourceType, null, null, req.query),
        json: true,
        headers: {
            'Cache-Control': 'no-cache'
        }
    };

    request(options, (error, results, body) => {
        if (error) {
            console.log('Error retrieving implementation guides from FHIR server: ' + error);
            return res.status(500).send('Error retrieving implementation guides from FHIR server');
        }

        const implementationGuides = _.map(body.entry, (item) => {
            return {
                id: item.resource.id,
                name: item.resource.name,
                experimental: item.resource.experimental,
                description: item.resource.description
            };
        });

        res.send(implementationGuides);
    });
});

router.get('/:id', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl(thisResourceType, req.params.id);

    request(url, { json: true }, (error, results, body) => {
        if (error) {
            console.log('Error retrieving implementatoin guide from FHIR server: ' + error);
            return res.status(500).send('Error retrieving implementation guide from FHIR server');
        }

        res.send(body);
    });
});

router.post('/', checkJwt, (req, res) => {
    const options = {
        url: req.getFhirServerUrl(thisResourceType),
        method: 'POST',
        json: true,
        body: req.body
    };

    request(options, (error, results, body) => {
        if (error) {
            console.log('Error from FHIR server while creating implementation guide: ' + error);
            return res.send(500).send('Error from FHIR server while creating implementation guide: ' + error);
        }

        const location = results.headers.location || results.headers['content-location'];

        if (location) {
            request(location, (error, results, body) => {
                if (error) {
                    console.log('Error from FHIR server while retrieving created implementation guide: ' + error);
                    return res.send(500).send('Error from FHIR server while retrieving created implementation guide: ' + error);
                }

                res.send(body);
            });
        } else {
            res.status(500).send('FHIR server did not respond with a location to the newly created implementation guide');
        }
    });
});

router.delete('/:id', checkJwt, (req, res) => {
    const options = {
        url: req.getFhirServerUrl(thisResourceType, req.params.id),
        method: 'DELETE'
    };

    request(options, (error, results, body) => {
        if (error) {
            console.log('Error from FHIR server while creating implementation guide: ' + error);
            return res.send(500).send('Error from FHIR server while creating implementation guide: ' + error);
        }

        res.status(204).send();
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
            console.log('Error from FHIR server while updating implementation guide: ' + err);
            return res.status(500).send('Error from FHIR server while updating implementation guide');
        }

        const location = results.headers.location || results.headers['content-location'];

        if (location) {
            request(location, (err, results, retrieveBody) => {
                if (err) {
                    console.log('Error from FHIR server while retrieving recently updated implementation guide: ' + err);
                    return res.status(500).send('Error from FHIR server while retrieving recently updated implementation guide');
                }

                res.send(retrieveBody);
            })
        } else {
            res.status(500).send('FHIR server did not respond with a location to the recently updated implementation guide');
        }
    });
});

module.exports = router;