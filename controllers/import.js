const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const _ = require('underscore');

router.post('/', checkJwt, (req, res) => {
    const resourceType = req.body.resourceType;

    function cb(err, results, data) {
        if (err) {
            console.log('An error occurred while importing the resource(s): ' + err);
            return res.status(500).send('An error occurred while importing the resource(s)');
        }

        res.send(data);
    }

    if (resourceType === 'Bundle') {
        const options = {
            method: 'POST',
            url: req.getFhirServerUrl(),
            body: req.body,
            json: true
        };
        request(options, cb);
    } else {
        const options = {
            method: 'POST',
            url: req.getFhirServerUrl(resourceType),
            body: req.body,
            json: true
        };

        request(options, cb);
    }
});

module.exports = router;