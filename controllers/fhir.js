const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const _ = require('underscore');

router.use(checkJwt, (req, res) => {
    let url = req.fhirServerBase;

    if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
    }

    url += req.url;

    const headers = JSON.parse(JSON.stringify(req.headers));
    delete headers['authorization'];
    delete headers['fhirserver'];
    delete headers['host'];
    delete headers['origin'];
    delete headers['referer'];
    delete headers['user-agent'];
    delete headers['content-length'];

    const options = {
        url: url,
        method: req.method,
        headers: headers,
        body: req.body,
        json: true
    };

    try {
        const fhirRequest = request(options);

        fhirRequest.on('error', (err) => {
            console.log(err);
            res.status(500).send();
        });

        fhirRequest.pipe(res);
    } catch (ex) {
        console.log('Error executing FHIR request: ' + ex);
        res.status(500).send('Error executing FHIR request');
    }
});

module.exports = router;