const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request').defaults({ json: true });
const config = require('config');
const _ = require('underscore');
const FhirHelper = require('../fhirHelper');
const log4js = require('log4js');
const log = log4js.getLogger();

const thisResourceType = 'Questionnaire';
const fhirConfig = config.get('fhir');

router.get('/', checkJwt, (req, res) => {
    const options = {
        url: req.getFhirServerUrl(thisResourceType, null, null, req.query),
        json: true,
        headers: {
            'Cache-Control': 'no-cache'
        }
    };

    request(options, (error, results, body) => {
        if (error) {
            log.error('Error retrieving audit events from FHIR server: ' + error);
            return res.status(500).send('Error retrieving audit events from FHIR server');
        }

        res.send(body);
    });
});

router.post('/', checkJwt, (req, res) => {
   const createUrl = req.getFhirServerUrl(thisResourceType);

   const options = {
       url: createUrl,
       method: 'POST',
       json: true,
       body: req.body
   };

   request(options, (err, results, createBody) => {
       if (err) {
           log.error('Error from FHIR server while creating questionnaire: ' + err);
           return res.status(500).send('Error from FHIR server while creating questionnaire');
       }

       const location = results.headers.location || results.headers['content-location'];

       if (location) {
           request(location, (err, results, retrieveBody) => {
               if (err) {
                   log.error('Error from FHIR server while retrieving newly created questionnaire: ' + err);
                   return res.status(500).send('Error from FHIR server while retrieving newly created questionnaire');
               }

               res.send(retrieveBody);
           })
       } else {
           res.status(500).send('FHIR server did not respond with a location to the newly created questionnaire');
       }
   });
});


router.put('/:id', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl(thisResourceType, req.params.id);

    const options = {
        url: url,
        method: 'PUT',
        json: true,
        body: req.body
    };

    request(options, (err, results, updateBody) => {
        if (err) {
            log.error('Error from FHIR server while updating questionnaire: ' + err);
            return res.status(500).send('Error from FHIR server while updating questionnaire');
        }

        const location = results.headers.location || results.headers['content-location'];

        if (location) {
            request(location, (err, results, retrieveBody) => {
                if (err) {
                    log.error('Error from FHIR server while retrieving recently updated questionnaire: ' + err);
                    return res.status(500).send('Error from FHIR server while retrieving recently updated questionnaire');
                }

                res.send(retrieveBody);
            })
        } else {
            res.status(500).send('FHIR server did not respond with a location to the recently updated questionnaire');
        }
    });
});

router.get('/:id', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl(thisResourceType, req.params.id);

    const options = {
        url: url,
        method: 'GET'
    };

    request(options, (err, results, body) => {
        if (err) {
            log.error('Error from FHIR server while retrieving questionnaire: ' + err);
            return res.status(500).send('Error from FHIR server while retrieving questionnaire');
        }

        res.send(body);
    });
});

router.get('/:id/expand', checkJwt, (req, res) => {
    const valueSetUrl = req.getFhirServerUrl(thisResourceType, req.params.id);

    const valueSetOptions = {
        url: valueSetUrl,
        method: 'GET'
    };

    request(valueSetOptions, (valueSetError, valueSetResults, valueSet) => {
        if (valueSetError) {
            log.error('Error from FHIR server while retrieving questionnaire: ' + valueSetError);
            return res.status(500).send('Error from FHIR server while retrieving questionnaire');
        }

        const terminologyServerBase = fhirConfig.terminologyServer ? fhirConfig.terminologyServer.baseUrl : null;
        let expandUrl = FhirHelper.buildUrl(terminologyServerBase, thisResourceType, null, '$expand');

        if (!expandUrl) {
            expandUrl = req.getFhirServerUrl(thisResourceType, null, '$expand');
        }

        const expandOptions = {
            url: expandUrl,
            method: 'POST',
            body: valueSet
        };

        request(expandOptions, (expandError, expandResults, expandedValueSet) => {
            if (expandError) {
                log.error('Error from FHIR server while expanding questionnaire: ' + expandError);
                return res.status(500).send('Error from FHIR server while expanding questionnaire');
            }

            res.send(expandedValueSet);
        });
    });
});

router.delete('/:id', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl(thisResourceType, req.params.id);

    const options = {
        url: url,
        method: 'DELETE'
    };

    request(options, (err, results, body) => {
        if (err) {
            log.error('Error from FHIR server while deleting questionnaire: ' + err);
            return res.status(500).send('Error from FHIR server while deleting questionnaire');
        }

        res.status(204).send();
    });
});

module.exports = router;