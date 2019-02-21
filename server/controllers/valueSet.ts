import * as express from 'express';
import * as rp from 'request-promise';
import * as FhirHelper from '../fhirHelper';
import * as config from 'config';
import {FhirLogic} from './fhirLogic';
import {ExtendedRequest} from './models';
import {ExpandOptions} from '../../src/app/models/stu3/expandOptions';

const fhirConfig = config.get('fhir');

interface ExpandRequest extends ExtendedRequest {
    params: {
        id: string;
    };
    body: ExpandOptions;
}

export class ValueSetController extends FhirLogic {
    public static initRoutes() {
        const router = express.Router();

        router.post('/:id/expand', (req: ExpandRequest, res) => {
            const controller = new ValueSetController('ValueSet', req.fhirServerBase);
            controller.getExpanded(req.params.id, req.body)
                .then((results) => res.send(results))
                .catch((err) => ValueSetController.handleError(err, null, res));
        });

        return super.initRoutes('ValueSet', router);
    }

    public getExpanded(id: string, options?: ExpandOptions) {
        return new Promise((resolve, reject) => {
            ValueSetController.log.trace(`Beginning request to expand value set ${id}`);

            const getOptions = {
                url: FhirHelper.buildUrl(this.baseUrl, 'ValueSet', id),
                method: 'GET',
                json: true
            };

            ValueSetController.log.debug(`Expand operation is requesting value set content for ${id}`);

            rp(getOptions)
                .then((valueSet) => {
                    ValueSetController.log.trace('Retrieved value set content for expand');

                    const expandOptions = {
                        url: FhirHelper.buildUrl(fhirConfig.terminologyServer || this.baseUrl, 'ValueSet', null, '$expand', options),
                        method: 'POST',
                        json: true,
                        body: valueSet
                    };

                    ValueSetController.log.debug(`Asking the FHIR server to expand value set ${id}`);
                    return rp(expandOptions);
                })
                .then((expandedValueSet) => {
                    ValueSetController.log.trace('FHIR server responded with expanded value set');

                    resolve(expandedValueSet);
                })
                .catch((err) => reject(err));
        });
    }
}