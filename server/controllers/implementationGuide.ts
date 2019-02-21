import * as express from 'express';
import {FhirLogic} from './fhirLogic';
import * as rp from 'request-promise';
import * as config from 'config';
import * as log4js from 'log4js';
import * as _ from 'underscore';
import {checkJwt} from '../authHelper';
import {ExtendedRequest} from './models';
import {RequestHandler} from 'express';

const fhirConfig = config.get('fhir');
const log = log4js.getLogger();

interface PublishedGuidesModel {
    guides: [{
        name: string;
        'npm-name': string;
        editions: [{
            url: string;
            version: string;
        }]
    }];
}

export class ImplementationGuideLogic extends FhirLogic {
    static resourceType = 'ImplementationGuide';

    public static initRoutes() {
        const router = express.Router();

        router.get('/published', <RequestHandler> checkJwt, (req: ExtendedRequest, res) => {
            log.trace(`Getting list of published implementation guides`);

            const fhirLogic = new ImplementationGuideLogic('ImplementationGuide', req.fhirServerBase);
            fhirLogic.getPublishedGuides()
                .then((results) => res.send(results))
                .catch((err) => this.handleError(err, null, res));
        });

        return super.initRoutes('ImplementationGuide', router);
    }

    public getPublishedGuides(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!fhirConfig.publishedGuides) {
                throw new Error('Server is not configured with a publishedGuides property');
            }

            rp(fhirConfig.publishedGuides, { json: true })
                .then((results: PublishedGuidesModel) => {
                    const guides = [];

                    _.each(results.guides, (guide) => {
                        _.each(guide.editions, (edition) => {
                            guides.push({
                                name: guide.name,
                                url: edition.url,
                                version: edition['ig-version'],
                                'npm-name': guide['npm-name']
                            });
                        });
                    });

                    resolve(guides);
                })
                .catch((err) => reject(err));
        });
    }

    public search(query?: any): Promise<any> {
        return super.search(query);
    }
}
