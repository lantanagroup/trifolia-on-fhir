const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const rp = require('request-promise');
const _ = require('underscore');

router.get('/change-id', checkJwt, (req, res) => {
    const resourceType = req.query.resourceType;
    const originalId = req.query.originalId;
    const newId = req.query.newId;
    const currentOptions = {
        url: req.getFhirServerUrl(resourceType, originalId),
        method: 'GET',
        json: true
    };

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

            // Create the new resource with the new id
            return rp(createOptions);
        })
        .then((results) => {
            const deleteOptions = {
                url: req.getFhirServerUrl(resourceType, originalId),
                method: 'DELETE',
                json: true
            };

            // Delete the original resource with the original id
            return rp(deleteOptions);
        })
        .then((results) => {
            res.send(`Successfully changed the id of ${resourceType}/${originalId} to ${resourceType}/${newId}`);
        })
        .catch((err) => {
            res.status(500).send(req.getErrorMessage(err));
        });
});

module.exports = router;