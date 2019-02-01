const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const log4js = require('log4js');
const log = log4js.getLogger();

const thisResourceType = 'AuditEvent';

router.get('/', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl(thisResourceType, null, null, req.query);

    request(url, { json: true }, (error, results, body) => {
        if (error) {
            log.error('Error retrieving audit events from FHIR server: ' + error);
            return res.status(500).send('Error retrieving audit events from FHIR server');
        }

        res.send(body);
    });
});

router.post('/', checkJwt, (req, res) => {
   const url = req.getFhirServerUrl(thisResourceType);

   const options = {
       url: url,
       method: 'POST',
       json: true,
       body: req.body
   };

   request(options, function(err, results, body) {
       if (err) {
           log.error('Error from FHIR server while creating audit event: ' + err);
           return res.status(500).send('Error from FHIR server while creating audit event');
       }

       res.send(body);
   });
});

router.get('/:id', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl(thisResourceType, req.params.id);

    const options = {
        url: url,
        method: 'GET'
    };

    request(options, function(err, results, body) {
        if (err) {
            log.error('Error from FHIR server while retrieving binary: ' + err);
            return res.status(500).send('Error from FHIR server while retrieving binary');
        }

        res.send(body);
    });
});

module.exports = router;