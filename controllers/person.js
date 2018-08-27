const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const url = require('url');
const {URL, resolve} = require('url');
const _ = require('underscore');
var Q = require('q');

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

    const url = new URL(resolve(req.fhirServerBase, 'Person'));
    url.searchParams.set('identifier', system + '|' + identifier);

    request(url.toString(), { json: true }, (error, response, body) => {
        if (error) {
            console.log('Error occurred getting Person for user: ' + error);
            return deferred.reject(error);
        }

        if (body.total === 0) {
            return deferred.reject('No Person found for the authenticated user');
        }

        if (body.total > 1) {
            return deferred.reject('Expected a single Person resource to be found');
        }

        deferred.resolve(body.entry[0].resource);
    });

    return deferred.promise;
}

function updateMe(req, existingPerson) {
    const deferred = Q.defer();
    const person = req.body;

    if (!person || person.resourceType !== 'Person') {
        throw new Error('Expected there to be a Person resource in the body of the request');
    }

    const authUser = req.user.sub;
    let system = '';
    let identifier = authUser;

    if (authUser.startsWith('auth0|')) {
        system =  'https://auth0.com';
        identifier = authUser.substring(6);
    }

    if (!person.identifier) {
        person.identifier = [];
    }

    const foundIdentifier = _.find(person.identifier, (identifier) => identifier.system === system && identifier.value === identifier);

    if (!foundIdentifier) {
        person.identifier.push({
            system: system,
            value: identifier
        });
    }

    if (existingPerson && existingPerson.id) {
        person.id = existingPerson.id;
    }

    const personRequest = {
        url: req.getFhirServerUrl('Person', person.id),
        method: person.id ? 'PUT' : 'POST',
        body: person,
        json: true
    };

    request(personRequest, (err, response, body) => {
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
                deferred.resolve(person);
            }
        }
    });

    return deferred.promise;
}

router.get('/me', checkJwt, (req, res) => {
    getMe(req)
        .then((person) => {
            res.send(person);
        })
        .catch((err) => {
            if (typeof err === 'string') {
                if (err.indexOf('No Person found') === 0) {
                    return res.status(404).send(err.message);
                }

                return res.status(500).send(err);
            } else if (err.message) {
                return res.status(500).send(err.message);
            }
        });
});

router.post('/me', checkJwt, (req, res) => {
    getMe(req)  // attempt to get the existing person (if any) first
        .then((person) => {
            // Person already exists, pass it along to updateMe()
            updateMe(req, person)
                .then((updatedPerson) => {
                    res.send(updatedPerson);
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
            // Person does not already exist
            updateMe(req)
                .then((newPerson) => {
                    res.send(newPerson);
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