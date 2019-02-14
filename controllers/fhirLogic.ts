import * as express from 'express';
import * as FhirHelper from '../fhirHelper.js';
import {checkJwt} from '../authHelper.js';
import * as rp from 'request-promise';
import {ExtendedRequest} from './models';
import {RequestHandler} from 'express';
import * as nanoid from 'nanoid';
import {BaseController} from './controller';

export class FhirLogic extends BaseController {
    readonly resourceType: string;
    readonly baseUrl: string;

    public static initRoutes<T extends FhirLogic>(this: new (resourceType: string, baseUrl: string) => T, resourceType: string, preRouter?: any) {
        const router = preRouter || express.Router();

        router.get('/', <RequestHandler> checkJwt, (req: ExtendedRequest, res) => {
            FhirLogic.log.trace(`Searching for resource ${resourceType}`);

            const fhirLogic = new this(resourceType, req.fhirServerBase);
            fhirLogic.search(req.query)
                .then((results) => res.send(results))
                .catch((err) => FhirLogic.handleError(err, null, res));
        });

        router.get('/:id', <RequestHandler> checkJwt, (req: ExtendedRequest, res) => {
            FhirLogic.log.trace(`Retrieving resource ${resourceType}/${req.params.id}`);

            const fhirLogic = new this(resourceType, req.fhirServerBase);
            fhirLogic.get(req.params.id, req.query)
                .then((results) => res.send(results))
                .catch((err) => FhirLogic.handleError(err, null, res));
        });

        router.post('/', <RequestHandler> checkJwt, (req: ExtendedRequest, res) => {
            FhirLogic.log.trace(`Creating resource ${resourceType}`);

            const fhirLogic = new this(resourceType, req.fhirServerBase);
            fhirLogic.create(req.body, req.query)
                .then((results) => res.send(results))
                .catch((err) => FhirLogic.handleError(err, null, res));
        });

        router.put('/:id', <RequestHandler> checkJwt, (req: ExtendedRequest, res) => {
            FhirLogic.log.trace(`Updating resource ${resourceType}/${req.params.id}`);

            const fhirLogic = new this(resourceType, req.fhirServerBase);
            fhirLogic.update(req.params.id, req.body, req.query)
                .then((results) => res.send(results))
                .catch((err) => FhirLogic.handleError(err, null, res));
        });

        router.delete('/:id', <RequestHandler> checkJwt, (req: ExtendedRequest, res) => {
            FhirLogic.log.trace(`Deleting resource ${resourceType}/${req.params.id}`);

            const fhirLogic = new this(resourceType, req.fhirServerBase);
            fhirLogic.delete(req.params.id, req.query)
                .then((results) => res.send(results))
                .catch((err) => FhirLogic.handleError(err, null, res));
        });

        return router;
    }

    constructor(resourceType: string, baseUrl: string) {
        super();

        this.resourceType = resourceType;
        this.baseUrl = baseUrl;
    }

    public search(query?: any): Promise<any> {
        query = query || {};
        query['_summary'] = true;
        query['_count'] = 10;

        if (query.name) {
            query['name:contains'] = query.name;
            delete query.name;
        }

        if (query.page) {
            if (parseInt(query.page) !== 1) {
                query._getpagesoffset = (parseInt(query.page) - 1) * 10;
            }

            delete query.page;
        }

        const url = FhirHelper.buildUrl(this.baseUrl, this.resourceType, null, null, query);
        const options = {
            url: url,
            method: 'GET',
            json: true,
            headers: {
                'Cache-Control': 'no-cache'
            }
        };
        return rp(options);
    }

    public get(id: string, query?: any): Promise<any> {
        const url = FhirHelper.buildUrl(this.baseUrl, this.resourceType, id, null, query);
        const options = {
            url: url,
            method: 'GET',
            json: true,
            headers: {
                'Cache-Control': 'no-cache'
            }
        };
        return rp(options);
    }

    public create(data: any, query?: any): Promise<any> {
        if (!data.id) {
            data.id = nanoid(8);
        }

        return new Promise((resolve, reject) => {
            const existsOptions = {
                url: FhirHelper.buildUrl(this.baseUrl, this.resourceType, data.id, null, { _summary: true }),
                method: 'GET',
                json: true
            };

            // Make sure the resource doesn't already exist with the same id
            rp(existsOptions)
                .then(() => {
                    FhirLogic.log.error(`Attempted to create a ${this.resourceType} with an id of ${data.id} when it already exists`);
                    reject(`A ${this.resourceType} already exists with the id ${data.id}`);
                })
                .catch((existsErr) => {
                    if (existsErr.statusCode !== 404) {
                        const msg = `An unexpected error code ${existsErr.statusCode} was returned when checking if a ${this.resourceType} already exists with the id ${data.id}`;
                        FhirLogic.log.error(msg);
                        return reject(msg);
                    }

                    const url = FhirHelper.buildUrl(this.baseUrl, this.resourceType, data.id);
                    const createOptions = {
                        url: url,
                        method: 'PUT',
                        json: true,
                        body: data,
                        resolveWithFullResponse: true
                    };

                    // Create the resource
                    rp(createOptions)
                        .then((results) => {
                            const location = results.headers.location || results.headers['content-location'];

                            if (location) {
                                const getOptions = {
                                    url: location,
                                    method: 'GET',
                                    json: true
                                };

                                // Get the saved version of the resource (with a unique id)
                                return rp(getOptions);
                            } else {
                                throw new Error(`FHIR server did not respond with a location to the newly created ${this.resourceType}`);
                            }
                        })
                        .then((newImplementationGuide) => resolve(newImplementationGuide))
                        .catch((err) => reject(err));
                });
        });
    }

    public update(id: string, data: any, query?: any): Promise<any> {
        const url = FhirHelper.buildUrl(this.baseUrl, this.resourceType, id, null, query);
        const options = {
            url: url,
            method: 'PUT',
            json: true,
            body: data
        };
        return rp(options);
    }

    public delete(id: string, query?: any): Promise<any> {
        const url = FhirHelper.buildUrl(this.baseUrl, this.resourceType, id, null, query);
        const options = {
            url: url,
            method: 'DELETE',
            json: true
        };
        return rp(options);
    }
}