const express = require('express');
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const _ = require('underscore');
const Q = require('q');
const log4js = require('log4js');
const PhinVadsImporter = require('../import/phinVadsImporter');
const ExcelValueSetImporter = require('../import/excelValueSetImporter');

const router = express.Router();
const log = log4js.getLogger();

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

/** EXCEL VALUESET **/
router.post('/excelValueSet', (req, res) => {
    const importer = new ExcelValueSetImporter();
    importer.import(req.body)
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            log.error(err);
            res.status(500).send(err);
        });
});

/** PHIN VADS **/
router.get('/phinVads', (req, res) => {
    const importer = new PhinVadsImporter();
    importer.search(req.query.searchText)
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            log.error(err);
            res.status(500).send(err);
        });
});

router.post('/phinVads', (req, res) => {
    res.send('todo');
});

/** VSAC **/
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

/** FHIR Transaction Bundles **/
router.post('/', checkJwt, (req, res) => {
    importResource(req.body, req.getFhirServerUrl)
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            log.error('An error occurred while importing the resource(s): ' + err);
            res.status(500).send(err);
        });
});

module.exports = router;