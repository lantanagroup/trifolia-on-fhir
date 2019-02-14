import * as express from 'express';
import * as AuthHelper from '../authHelper';
import * as FhirHelper from '../fhirHelper';
import * as rp from 'request-promise';
import * as _ from 'underscore';
import * as nanoid from 'nanoid';
import {FhirLogic} from './fhirLogic';
import {ExtendedRequest, Fhir, RestRejection, UserInfo} from './models';
import {RequestHandler} from 'express';

export class PractitionerController extends FhirLogic {
    public static initRoutes() {
        const router = express.Router();

        router.get('/me', <RequestHandler> AuthHelper.checkJwt, <RequestHandler> (req: ExtendedRequest, res) => {
            const controller = new PractitionerController('Practitioner', req.fhirServerBase);
            controller.getMyPractitioner(req.user)
                .then((results) => res.send(results))
                .catch((err) => PractitionerController.handleError(err, null, res));
        });

        router.post('/me', <RequestHandler> AuthHelper.checkJwt, <RequestHandler> (req: ExtendedRequest, res) => {
            const controller = new PractitionerController('Practitioner', req.fhirServerBase);
            controller.updateMyPractitioner(req.user, <Fhir.Practitioner> req.body)
                .then((results) => res.send(results))
                .catch((err) => PractitionerController.handleError(err, null, res));
        });

        return super.initRoutes('Practitioner', router);
    }

    public updateMyPractitioner(userInfo: UserInfo, practitioner: Fhir.Practitioner): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getMyPractitioner(userInfo, true)
                .then((existingPractitioner) => {
                    const authUser = userInfo.sub;
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
                        return identifier.system === system && identifier.value === value;
                    });

                    if (!foundIdentifier) {
                        practitioner.identifier.push({
                            system: system,
                            value: value
                        });
                    }

                    if (existingPractitioner && existingPractitioner.id) {
                        practitioner.id = existingPractitioner.id;
                    } else {
                        practitioner.id = nanoid(8);
                    }

                    const practitionerRequest = {
                        url: FhirHelper.buildUrl(this.baseUrl, this.resourceType, practitioner.id),
                        method: 'PUT',
                        body: practitioner,
                        json: true,
                        resolveWithFullResponse: true
                    };

                    return rp(practitionerRequest);
                })
                .then((results) => {
                    const location = results.headers.location || results.headers['content-location'];

                    if (!location) {
                        throw new Error(`FHIR server did not respond with a location to the newly created ${this.resourceType}`);
                    }

                    return rp({
                        url: location,
                        method: 'GET',
                        json: true
                    });
                })
                .then((results) => resolve(results))
                .catch((err) => reject(err));
        });
    }

    public getMyPractitioner(userInfo: UserInfo, resolveIfNotFound = false): Promise<any> {
        return new Promise((resolve, reject) => {
            let system = '';
            let identifier = userInfo.sub;

            if (identifier.startsWith('auth0|')) {
                system =  'https://auth0.com';
                identifier = identifier.substring(6);
            }

            const url = FhirHelper.buildUrl(this.baseUrl, this.resourceType, null, null, { identifier: system + '|' + identifier });
            const options = {
                url: url,
                json: true,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            };

            rp(options)
                .then((bundle) => {
                    if (bundle.total === 0) {
                        if (!resolveIfNotFound) {
                            return reject(<RestRejection> {
                                statusCode: 404,
                                message: 'No practitioner was found associated with the authenticated user'
                            });
                        } else {
                            return resolve();
                        }
                    }

                    if (bundle.total > 1) {
                        PractitionerController.log.warn(`Expected a single ${this.resourceType} resource to be found with identifier ${system}|${identifier}`)
                    }

                    resolve(bundle.entry[0].resource);
                })
                .catch((err) => reject(err));
        });
    }
}
