import {BaseController} from './controller';
import {RequestHandler} from 'express';
import {ExtendedRequest} from './models';
import {checkJwt} from '../authHelper';
import * as express from 'express';
import {Bundle, DomainResource} from '../../src/app/models/stu3/fhir';
import * as PhinVadsImporter from '../import/phinVadsImporter';
import * as rp from 'request-promise';
import * as FhirHelper from '../fhirHelper';

interface SearchPhinVadsRequest extends ExtendedRequest {
    query: {
        searchText: string;
    };
}

interface ImportPhinVadsRequest extends ExtendedRequest {
    params: {
        id: string;
    };
}

interface ImportVsacRequest extends ExtendedRequest {
    headers: {
        fhirserver: string;
        vsacauthorization: string;
    };
    params: {
        resourceType: string;
        id: string;
    };
}

export class ImportController extends BaseController {
    private baseUrl: string;
    readonly vsacBaseUrl = 'https://cts.nlm.nih.gov/fhir/';

    constructor(baseUrl: string) {
        super();
        this.baseUrl = baseUrl;
    }

    public static initRoutes() {
        const router = express.Router();

        router.get('/phinVads', <RequestHandler> checkJwt, (req: SearchPhinVadsRequest, res) => {
            const controller = new ImportController(req.fhirServerBase);
            controller.searchPhinVadsValueSet(req.query.searchText)
                .then((results) => res.send(results))
                .catch((err) => this.handleError(err, null, res));
        });

        router.post('/phinVads', <RequestHandler> checkJwt, (req: ImportPhinVadsRequest, res) => {
            const controller = new ImportController(req.fhirServerBase);
            controller.importPhinVadsValueSet(req.params.id)
                .then((results) => res.send(results))
                .catch((err) => this.handleError(err, null, res));
        });

        router.get('/vsac/:resourceType/:id', <RequestHandler> checkJwt, (req: ImportVsacRequest, res) => {
            const controller = new ImportController(req.fhirServerBase);
            controller.importVsacValueSet(req.headers.vsacauthorization, req.params.resourceType, req.params.id)
                .then((results) => res.send(results))
                .catch((err) => this.handleError(err, null, res));
        });

        router.post('/', <RequestHandler> checkJwt, (req: ExtendedRequest, res) => {
            const controller = new ImportController(req.fhirServerBase);
            controller.importResource(req.body)
                .then((results) => res.send(results))
                .catch((err) => this.handleError(err, null, res));
        });

        return router;
    }

    public searchPhinVadsValueSet(searchText: string) {
        const importer = new PhinVadsImporter();
        return importer.search(searchText);
    }

    public importPhinVadsValueSet(id: string) {
        const importer = new PhinVadsImporter();
        return importer.import(id);
    }

    public importVsacValueSet(vsacAuthorization: string, resourceType: string, id: string) {
        const options = {
            method: 'GET',
            url: `${this.vsacBaseUrl}${resourceType}/${id}`,
            headers: {
                'Authorization': vsacAuthorization,
                'Accept': 'application/json'
            },
            json: true,
            resolveWithFullResponse: true
        };

        return new Promise((resolve, reject) => {
            rp(options)
                .then((results) => {
                    if (results.statusCode !== 200) {
                        return reject(results.body);
                    }

                    return this.importResource(results.body);
                })
                .then((results) => resolve(results))
                .catch((err) => reject(err));
        });
    }

    public importResource(resource: DomainResource) {
        const resourceType = resource.resourceType;

        const bundle = <Bundle> resource;
        let options;

        if (resource.resourceType === 'Bundle' && bundle.type === 'transaction') {
            options = {
                method: 'POST',
                url: this.baseUrl + (this.baseUrl.endsWith('/') ? '' : '/'),
                body: resource,
                json: true
            };
        } else {
            options = {
                method: resource.id ? 'PUT' : 'POST',
                url: FhirHelper.buildUrl(this.baseUrl, resourceType, resource.id),
                body: resource,
                json: true
            };
        }

        return rp(options);
    }
}