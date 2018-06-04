const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const _ = require('underscore');

router.get('/', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl('AuditEvent', null, null, req.query);

    request(url, { json: true }, (error, results, body) => {
        if (error) {
            console.log('Error retrieving audit events from FHIR server: ' + error);
            return res.status(500).send('Error retrieving audit events from FHIR server');
        }

        res.send(body);
    });
});

router.post('/', checkJwt, (req, res) => {
   const url = req.getFhirServerUrl('AuditEvent');

   const options = {
       url: url,
       method: 'POST',
       json: true,
       body: req.body
   };

   request(options, function(err, results, body) {
       if (err) {
           console.log('Error from FHRI server while creating audit event: ' + err);
           return res.status(500).send('Error from FHIR server while creating audit event');
       }

       res.send(body);
   });
});

router.get('/:id', checkJwt, (req, res) => {
    res.send({});
});

module.exports = router;