const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const _ = require('underscore');

router.get('/', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl('ImplementationGuide');

    request(url, { json: true }, (error, results, body) => {
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
    const url = req.getFhirServerUrl('ImplementationGuide', req.params.id);

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
        url: req.getFhirServerUrl('ImplementationGuide'),
        method: 'POST',
        json: true,
        body: req.body
    };

    request(options, (error, results, body) => {
        if (error) {
            console.log('Error from FHIR server while creating implementation guide: ' + error);
            return res.send(500).send('Error from FHIR server while creating implementation guide: ' + error);
        }

        request(results.headers.location, (error, results, body) => {
            if (error) {
                console.log('Error from FHIR server while retrieving created implementation guide: ' + error);
                return res.send(500).send('Error from FHIR server while retrieving created implementation guide: ' + error);
            }

            res.send(body);
        });
    });
});

router.delete('/:id', checkJwt, (req, res) => {
    const options = {
        url: req.getFhirServerUrl('ImplementationGuide', req.params.id),
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
    const options = {
        url: req.getFhirServerUrl('ImplementationGuide', req.params.id),
        method: 'PUT',
        json: true,
        body: req.body
    };

    request(options, (error, results, body) => {
        if (error) {
            console.log('Error from FHIR server while creating implementation guide: ' + error);
            return res.send(500).send('Error from FHIR server while creating implementation guide: ' + error);
        }

        res.send(req.body);
    });
});

module.exports = router;