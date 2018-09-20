const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const rp = require('request-promise');
const _ = require('underscore');
const log4js = require('log4js');
const log = log4js.getLogger();

router.get('/change-id', checkJwt, (req, res) => {
    const resourceType = req.query.resourceType;
    const originalId = req.query.originalId;
    const newId = req.query.newId;
    const currentOptions = {
        url: req.getFhirServerUrl(resourceType, originalId),
        method: 'GET',
        json: true
    };

    log.trace(`Request to chaneg id for resource ${req.query.resourceType}/${req.query.originalId} to ${req.query.newId}`);

    // Get the current state of the resource
    rp(currentOptions)
        .then((resource) => {
            if (!resource || !resource.id) {
                throw new Error(`No resource found for ${resourceType} with id ${originalId}`);
            }

            // Change the id of the resource
            resource.id = newId;

            const createOptions = {
                url: req.getFhirServerUrl(resourceType, newId),
                method: 'PUT',
                json: true,
                body: resource
            };

            log.trace('Sending PUT request to FHIR server with the new resource ID');

            // Create the new resource with the new id
            return rp(createOptions);
        })
        .then((results) => {
            const deleteOptions = {
                url: req.getFhirServerUrl(resourceType, originalId),
                method: 'DELETE',
                json: true
            };

            log.trace('Sending DELETE request to FHIR server for original resource');

            // Delete the original resource with the original id
            return rp(deleteOptions);
        })
        .then((results) => {
            log.trace(`Successfully changed the id of ${resourceType}/${originalId} to ${resourceType}/${newId}`);
            res.send(`Successfully changed the id of ${resourceType}/${originalId} to ${resourceType}/${newId}`);
        })
        .catch((err) => {
            log.error('Error change the id of the resource: ' + err);
            res.status(500).send(req.getErrorMessage(err));
        });
});

module.exports = router;