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

    const options = {
        method: req.method,
        url: url
    };

    const fhirRequest = request(options);

    if (req.method.toLowerCase() === 'post' || req.method.toLowerCase() === 'put' || req.method.toLowerCase() === 'patch') {
        req.pipe(fhirRequest);
    }

    fhirRequest.pipe(res);
});

module.exports = router;