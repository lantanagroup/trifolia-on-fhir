const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const url = require('url');
const {URL, resolve} = require('url');

router.get('/', checkJwt, (req, res) => {
    res.send([]);
});

router.get('/me', checkJwt, (req, res) => {
    const authUser = req.user.sub;
    let system = '';
    let identifier = authUser;

    if (authUser.startsWith('auth0|')) {
        system =  'https://auth0.com';
        identifier = authUser.substring(6);
    }

    const url = new URL(resolve(req.fhirServerBase, 'Person'));
    url.searchParams.set('identifier', system + '|' + identifier);

    request(url.toString(), { json: true }, (error, response, body) => {
        if (error) {
            console.log('Error occurred getting Person for user: ' + error);
            return res.status(500).send('FHIR server returned error retrieving Person for your session');
        }

        if (body.total !== 1) {
            return res.status(500).send('Expected a single Person resource to be found');
        }

        res.send(body.entry[0].resource);
    });
});

module.exports = router;