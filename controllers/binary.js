const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request').defaults({ json: true });
const _ = require('underscore');
const fhirHelper = require('../fhirHelper');
const log4js = require('log4js');
const log = log4js.getLogger();

const thisResourceType = 'Binary';

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
   const createUrl = req.getFhirServerUrl(thisResourceType);

   const options = {
       url: createUrl,
       method: 'POST',
       json: true,
       body: req.body
   };

   request(options, (err, results, createBody) => {
       if (err) {
           log.error('Error from FHIR server while creating binary: ' + err);
           return res.status(500).send('Error from FHIR server while creating binary');
       }

       const location = results.headers.location || results.headers['content-location'];

       if (location) {
           const parsedLocation = fhirHelper.parseUrl(location, req.fhirServerBase);

           request(location, (err, results, retrieveBody) => {
               if (err) {
                   log.error('Error from FHIR server while retrieving newly created binary: ' + err);
                   return res.status(500).send('Error from FHIR server while retrieving newly created binary');
               }

               // Server may not include the id in the Binary retrieve response
               if (!retrieveBody.id && parsedLocation && parsedLocation.id) {
                   retrieveBody.id = parsedLocation.id;
               }

               res.send(retrieveBody);
           });
       } else {
           res.status(500).send('FHIR server did not respond with a location to the newly created binary');
       }
   });
});


router.put('/:id', checkJwt, (req, res) => {
    const url = req.getFhirServerUrl(thisResourceType, req.params.id);

    const options = {
        url: url,
        method: 'PUT',
        body: req.body
    };

    request(options, (err, results, updateBody) => {
        if (err) {
            log.error('Error from FHIR server while updating binary: ' + err);
            return res.status(500).send('Error from FHIR server while updating binary');
        }

        const location = results.headers.location || results.headers['content-location'];

        if (location) {
            request(location, (err, results, retrieveBody) => {
                if (err) {
                    log.error('Error from FHIR server while retrieving recently updated binary: ' + err);
                    return res.status(500).send('Error from FHIR server while retrieving recently updated binary');
                }

                // Need to add the id to Binary because for some reason Binary resources from HAPI do not always return with an id
                retrieveBody.id = req.params.id;

                res.send(retrieveBody);
            })
        } else {
            res.status(500).send('FHIR server did not respond with a location to the recently updated binary');
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
            log.error('Error from FHIR server while retrieving binary: ' + err);
            return res.status(500).send('Error from FHIR server while retrieving binary');
        }

        // Need to add the id to Binary because for some reason Binary resources from HAPI do not always return with an id
        body.id = req.params.id;

        res.send(body);
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
            log.error('Error from FHIR server while deleting binary: ' + err);
            return res.status(500).send('Error from FHIR server while deleting binary');
        }

        res.status(204).send();
    });
});

module.exports = router;