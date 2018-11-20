const express = require('express');
const checkJwt = require('../authHelper').checkJwt;
const config = require('config');
const _ = require('underscore');
const request = require('request');
const log4js = require('log4js');

const fhirConfig = config.get('fhir');
const authConfig = config.get('auth');
const githubConfig = config.get('github');
const router = express.Router();
const log = log4js.getLogger();

router.get('/', (req, res) => {
    const retConfig = {
        fhirServers: _.map(fhirConfig.servers, (server) => ({ id: server.id, name: server.name })),
        auth: {
            clientId: authConfig.clientId,
            scope: authConfig.scope,
            domain: authConfig.domain
        },
        github: {
            clientId: githubConfig.clientId
        }
    };

    res.send(retConfig);
});

router.get('/fhir', (req, res) => {
    const url = req.getFhirServerUrl('metadata');

    request(url, { json: true }, (error, results, body) => {
        if (error) {
            log.error('Error retrieving metadata from FHIR server: ' + error);
            return res.status(500).send('Error retrieving metadata from FHIR server');
        }

        res.send(body);
    });
});

module.exports = router;