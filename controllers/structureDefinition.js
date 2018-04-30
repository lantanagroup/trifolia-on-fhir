const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const _ = require('underscore');
const config = require('config');
const fhirConfig = config.get('fhir');
const semver = require('semver');
const {resolve} = require('url');

router.get('/', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl('StructureDefinition');

    request(url, { json: true }, (error, results, body) => {
        if (error) {
            console.log('Error retrieving structure definitions from FHIR server: ' + error);
            return res.status(500).send('Error retrieving structure definition from FHIR server');
        }

        const structureDefinitions = _.map(body.entry, (item) => {
            return {
                id: item.resource.id,
                name: item.resource.name,
                type: 'something'
            };
        });

        res.send(structureDefinitions);
    });
});

router.get('/:id', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl('StructureDefinition', req.params.id);

    request(url, { json: true }, (error, results, body) => {
        if (error) {
            console.log('Error retrieving structure definition from FHIR server: ' + error);
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
            console.log('Unsupported FHIR version ' + conformance.fhirVersion);
            res.status(500).send('Unsupported FHIR version ' + conformance.fhirVersion);
        }

        const baseUrl = resolve(publishedFhirVersion.url, req.params.id.toLowerCase() + '.profile.json');

        request(baseUrl, { json: true }, (error, results, structureDefinition) => {
            res.send(structureDefinition);
        });
    });
});

module.exports = router;