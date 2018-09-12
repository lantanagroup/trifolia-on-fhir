const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const _ = require('underscore');
const Q = require('q');

function importResource(resource, getFhirServerUrl) {
    if (!resource) {
        return Q.reject('No resource specified');
    }

    const resourceType = resource.resourceType;
    const deferred = Q.defer();

    function cb(err, results, data) {
        if (err) {
            return deferred.reject(err);
        }

        deferred.resolve(data);
    }

    if (resourceType === 'Bundle') {
        const options = {
            method: 'POST',
            url: getFhirServerUrl(),
            body: resource,
            json: true
        };
        request(options, cb);
    } else {
        const options = {
            method: resource.id ? 'PUT' : 'POST',
            url: getFhirServerUrl(resourceType, resource.id),
            body: resource,
            json: true
        };

        request(options, cb);
    }

    return deferred.promise;
}

router.get('/vsac/:resourceType/:id', checkJwt, (req, res) => {
    const vsacAuthorization = req.headers['vsacauthorization'];
    const resourceType = req.params.resourceType;
    const id = req.params.id;

    const options = {
        method: 'GET',
        url: `https://cts.nlm.nih.gov/fhir/${resourceType}/${id}`,
        headers: {
            'Authorization': vsacAuthorization,
            'Accept': 'application/json'
        },
        json: true
    };

    request(options, (err, results, data) => {
        if (err) {
            return res.status(500).send(data);
        }

        if (results.statusCode !== 200) {
            if (!data) {
                return res.status(results.statusCode).send({
                    resourceType: 'OperationOutcome',
                    text: {
                        status: 'generated',
                        div: '<div>VSAC did not respond correctly. Please ensure your username and password are correct.</div>'
                    }
                });
            } else {
                return res.status(results.statusCode).send(data);
            }
        }

        importResource(data, req.getFhirServerUrl)
            .then((results) => {
                res.send(results);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
    })
});

router.post('/', checkJwt, (req, res) => {
    importResource(req.body, req.getFhirServerUrl)
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            console.log('An error occurred while importing the resource(s): ' + err);
            res.status(500).send(err);
        });
});

module.exports = router;