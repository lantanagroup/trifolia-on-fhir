const express = require('express');
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const Q = require('q');
const log4js = require('log4js');
const PhinVadsImporter = require('../import/phinVadsImporter');
const ExcelValueSetImporter = require('../import/excelValueSetImporter');

const router = express.Router();
const log = log4js.getLogger();

/**
 * Imports a FHIR resource. If the resource is a Bundle, it is treated as a transaction
 * and POST'd to the FHIR server as a transaction. Otherwise, it is treated as an
 * indivdiual resource and POST'd or PUT'd to the FHIR server according to the resource's type.
 * @param resource
 * @param getFhirServerUrl
 * @return {Q.Promise<any>}
 */
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

/**
 * Imports a value set in excel (XLSX) format
 * @param req
 * @param req.body The XLSX binary contents
 * @param res
 */
function importExcelValueSet(req, res) {
    const importer = new ExcelValueSetImporter();
    importer.import(req.body)
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            log.error(err);
            res.status(500).send(err);
        });
}

/**
 * Gets a list of value sets matching the criteria (search text) from PHIN VADS
 * @param req
 * @param req.query.searchText The criteria used to search PHIN VADS
 * @param res
 */
function getPhinVadsValueSet(req, res) {
    const importer = new PhinVadsImporter();
    importer.search(req.query.searchText)
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            log.error(err);
            res.status(500).send(err);
        });
}

/**
 * Imports a value set from PHIN VADS
 * @param req
 * @param res
 */
function importPhinVads(req, res) {
    res.send('todo');
}

/**
 * Gets a value set from VSAC
 * @param req
 * @parma req.headers
 * @param req.headers.vsacauthorization The authenticated token for the user accessing VSAC
 * @param req.params
 * @param req.params.resourceType The type of resource to retrieve from VSAC
 * @parma req.params.id {string} The id of the resource to retrieve from VSAC
 * @param res
 */
function getVsacResource(req, res) {
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
}

/**
 * Imports a transaction Bundle
 * @param req
 * @param req.body The resource to import (Bundle, Composition, ImplementationGuide, StructureDefinition, etc)
 * @param res
 */
function importTransaction(req, res) {
    importResource(req.body, req.getFhirServerUrl)
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            log.error('An error occurred while importing the resource(s): ' + err);
            res.status(500).send(err);
        });
}

router.post('/excelValueSet', checkJwt, importExcelValueSet);
router.get('/phinVads', checkJwt, getPhinVadsValueSet);
router.post('/phinVads', checkJwt, importPhinVads);
router.get('/vsac/:resourceType/:id', checkJwt, getVsacResource);
router.post('/', checkJwt, importTransaction);

module.exports = router;