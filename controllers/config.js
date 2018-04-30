const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const config = require('config');
const _ = require('underscore');
const fhirConfig = config.get('fhir');
const request = require('request');

router.get('/', (req, res) => {
    const retConfig = {
        fhirServers: _.map(fhirConfig.servers, (server) => ({ id: server.id, name: server.name }))
    };

    res.send(retConfig);
});

router.get('/fhir', (req, res) => {
    const url = req.getFhirServerUrl('metadata');

    request(url, { json: true }, (error, results, body) => {
        if (error) {
            console.log('Error retrieving metadata from FHIR server: ' + error);
            return res.status(500).send('Error retrieving metadata from FHIR server');
        }

        res.send(body);
    });
});

module.exports = router;