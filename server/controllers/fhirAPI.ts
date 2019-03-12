import {BaseController} from './controller';
import * as express from 'express';
import {RequestHandler} from 'express';
import {checkJwt} from '../authHelper';
import {ExtendedRequest, RestRejection} from './models';
import * as request from 'request';
import * as rp from 'request-promise';
import * as FhirHelper from '../fhirHelper';

interface ProxyResponse {
    status: number;
    body: any;
    contentType?: string;
}

interface ChangeIdRequest extends ExtendedRequest {
    params: {
        resourceType: string;
        id: string;
    };
    query: {
        newId: string;
    };
}

/**
 * This controller is responsible for acting as a proxy to the underlying FHIR server's API.
 * It enforces additional logic (potentially), such as authentication, auditing, and custom operations.
 */
export class FhirAPIController extends BaseController {

    private baseUrl: string;

    constructor(baseUrl) {
        super();
        this.baseUrl = baseUrl;
    }

    public static initRoutes() {
        const router = express.Router();

        router.post('/:resourceType/:id/([\$])change-id', <RequestHandler> checkJwt, (req: ChangeIdRequest, res) => {
            const controller = new FhirAPIController(req.fhirServerBase);
            controller.changeId(req.params.resourceType, req.params.id, req.query.newId)
                .then((results) => res.send(results))
                .catch((err) => res.status(500).send(err));
        });

        router.use(<RequestHandler> checkJwt, <RequestHandler> (req: ExtendedRequest, res) => {
            const controller = new FhirAPIController(req.fhirServerBase);
            controller.proxy(req.method, req.url, req.headers, req.query, req.body)
                .then((results: ProxyResponse) => {
                    if (results.contentType) {
                        res.contentType(results.contentType);
                    }

                    res.status(results.status).send(results.body);
                })
                .catch((err) => res.status(500).send(err));
        });

        return router;
    }

    public proxy(method: string, url: string, headers: any, query: any, body: any): Promise<any> {
        let proxyUrl = this.baseUrl;

        if (proxyUrl.endsWith('/')) {
            proxyUrl = proxyUrl.substring(0, proxyUrl.length - 1);
        }

        proxyUrl += url;

        const proxyHeaders = JSON.parse(JSON.stringify(headers));
        delete proxyHeaders['authorization'];
        delete proxyHeaders['fhirserver'];
        delete proxyHeaders['host'];
        delete proxyHeaders['origin'];
        delete proxyHeaders['referer'];
        delete proxyHeaders['user-agent'];
        delete proxyHeaders['content-length'];
        delete proxyHeaders['cookie'];
        delete proxyHeaders['connection'];

        proxyHeaders['Cache-Control'] = 'no-cache';

        const options = {
            url: proxyUrl,
            method: method,
            headers: proxyHeaders,
            body: undefined,
            encoding: 'utf8',
            gzip: false,
            json: false
        };

        if (method !== 'GET' && method !== 'DELETE') {
            options.body = body;
            options.json = typeof body === 'object';
        }

        if (proxyHeaders['accept-encoding'] && proxyHeaders['accept-encoding'].indexOf('gzip') >= 0) {
            options.gzip = true;
        }

        return new Promise<ProxyResponse>((resolve, reject) => {
            request(options, (err, response, responseBody) => {
                resolve({
                    status: response.statusCode,
                    body: responseBody,
                    contentType: response.headers ? response.headers['content-type'] : undefined
                });
            });
        });
    }

    public changeId(resourceType: string, currentId: string, newId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!newId) {
                return reject(<RestRejection> { statusCode: 400, message: 'You must specify a "newId" to change the id of the resource' });
            }

            const currentOptions = {
                url: FhirHelper.buildUrl(this.baseUrl, resourceType, currentId),
                method: 'GET',
                json: true
            };

            FhirAPIController.log.trace(`Request to change id for resource ${resourceType}/${currentId} to ${newId}`);

            // Get the current state of the resource
            rp(currentOptions)
                .then((resource) => {
                    if (!resource || !resource.id) {
                        throw new Error(`No resource found for ${resourceType} with id ${currentId}`);
                    }

                    // Change the id of the resource
                    resource.id = newId;

                    const createOptions = {
                        url: FhirHelper.buildUrl(this.baseUrl, resourceType, newId),
                        method: 'PUT',
                        json: true,
                        body: resource
                    };

                    FhirAPIController.log.trace('Sending PUT request to FHIR server with the new resource ID');

                    // Create the new resource with the new id
                    return rp(createOptions);
                })
                .then(() => {
                    const deleteOptions = {
                        url: FhirHelper.buildUrl(this.baseUrl, resourceType, currentId),
                        method: 'DELETE',
                        json: true
                    };

                    FhirAPIController.log.trace('Sending DELETE request to FHIR server for original resource');

                    // Delete the original resource with the original id
                    return rp(deleteOptions);
                })
                .then(() => {
                    FhirAPIController.log.trace(`Successfully changed the id of ${resourceType}/${currentId} to ${resourceType}/${newId}`);
                    resolve(`Successfully changed the id of ${resourceType}/${currentId} to ${resourceType}/${newId}`);
                })
                .catch((err) => reject(err));
        });
    }
}