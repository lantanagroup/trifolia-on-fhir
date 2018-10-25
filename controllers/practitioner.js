const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const url = require('url');
const {URL, resolve} = require('url');
const _ = require('underscore');
var Q = require('q');
const log4js = require('log4js');
const log = log4js.getLogger();

const thisResourceType = 'Practitioner';

router.get('/', checkJwt, (req, res) => {
    res.send([]);
});

function getMe(req) {
    const deferred = Q.defer();
    const authUser = req.user.sub;
    let system = '';
    let identifier = authUser;

    if (authUser.startsWith('auth0|')) {
        system =  'https://auth0.com';
        identifier = authUser.substring(6);
    }

    const url = new URL(resolve(req.fhirServerBase, thisResourceType));
    url.searchParams.set('identifier', system + '|' + identifier);

    const options = {
        url: url.toString(),
        json: true,
        headers: {
            'Cache-Control': 'no-cache'
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            log.error(`Error occurred getting ${thisResourceType} for user: ` + error);
            return deferred.reject(error);
        }

        if (body.total === 0) {
            return deferred.reject(`No ${thisResourceType} found for the authenticated user`);
        }

        if (body.total > 1) {
            return deferred.reject(`Expected a single ${thisResourceType} resource to be found`);
        }

        deferred.resolve(body.entry[0].resource);
    });

    return deferred.promise;
}

function updateMe(req, existingPractitioner) {
    const deferred = Q.defer();
    const practitioner = req.body;

    if (!practitioner || practitioner.resourceType !== thisResourceType) {
        throw new Error(`Expected there to be a ${thisResourceType} resource in the body of the request`);
    }

    const authUser = req.user.sub;
    let system = '';
    let value = authUser;

    if (authUser.startsWith('auth0|')) {
        system =  'https://auth0.com';
        value = authUser.substring(6);
    }

    if (!practitioner.identifier) {
        practitioner.identifier = [];
    }

    const foundIdentifier = _.find(practitioner.identifier, (identifier) => {
        return identifier.system === system && identifier.value === value
    });

    if (!foundIdentifier) {
        practitioner.identifier.push({
            system: system,
            value: value
        });
    }

    if (existingPractitioner && existingPractitioner.id) {
        practitioner.id = existingPractitioner.id;
    }

    const practitionerRequest = {
        url: req.getFhirServerUrl(thisResourceType, practitioner.id),
        method: practitioner.id ? 'PUT' : 'POST',
        body: practitioner,
        json: true
    };

    request(practitionerRequest, (err, response, body) => {
        if (err) {
            return deferred.reject(err);
        } else {
            if (response.headers['content-location']) {
                request(response.headers['content-location'], { json: true }, (err, response, body) => {
                    if (err) {
                        return deferred.reject(err);
                    } else {
                        deferred.resolve(body);
                    }
                });
            } else {
                deferred.resolve(practitioner);
            }
        }
    });

    return deferred.promise;
}

router.get('/me', checkJwt, (req, res) => {
    getMe(req)
        .then((practitioner) => {
            res.send(practitioner);
        })
        .catch((err) => {
            if (typeof err === 'string') {
                if (err.indexOf(`No ${thisResourceType} found`) === 0) {
                    return res.status(404).send(err.message);
                }

                return res.status(500).send(err);
            } else if (err.message) {
                return res.status(500).send(err.message);
            }
        });
});

router.post('/me', checkJwt, (req, res) => {
    getMe(req)  // attempt to get the existing practitioner (if any) first
        .then((practitioner) => {
            // already exists, pass it along to updateMe()
            updateMe(req, practitioner)
                .then((updatedPractitioner) => {
                    res.send(updatedPractitioner);
                })
                .catch((err) => {
                    if (typeof err === 'string') {
                        return res.status(500).send(err);
                    } else if (err.message) {
                        return res.status(500).send(err.message);
                    }
                });
        })
        .catch((err) => {
            // does not already exist
            updateMe(req)
                .then((newPractitioner) => {
                    res.send(newPractitioner);
                })
                .catch((err) => {
                    if (typeof err === 'string') {
                        return res.status(500).send(err);
                    } else if (err.message) {
                        return res.status(500).send(err.message);
                    }
                });
        });
});

module.exports = router;