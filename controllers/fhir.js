const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const _ = require('underscore');
const log4js = require('log4js');
const log = log4js.getLogger();

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
    delete headers['cookie'];
    delete headers['connection'];

    headers['Cache-Control'] = 'no-cache';

    const options = {
        url: url,
        method: req.method,
        headers: headers
    };

    if (req.method !== 'GET' && req.method !== 'DELETE') {
        options.body = req.body;
    }

    try {
        const fhirRequest = request(options);

        fhirRequest.on('error', (err) => {
            log.error(err);
            res.status(500).send();
        });

        fhirRequest.pipe(res);
    } catch (ex) {
        log.error('Error executing FHIR request: ' + ex);
        res.status(500).send('Error executing FHIR request');
    }
});

module.exports = router;