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
    res.send({});
});

module.exports = router;