import * as FhirHelper from '../fhirHelper';
import * as log4js from 'log4js';
import {Response} from 'express';

export interface GenericResponse {
    status?: number;
    contentType?: string;
    contentDisposition?: string;
    content: any;
}

export class BaseController {
    protected static log = log4js.getLogger();

    protected static handleResponse(res: Response, actual: GenericResponse) {
        if (actual.contentType) {
            res.contentType(actual.contentType);
        }

        if (actual.contentDisposition) {
            res.setHeader('Content-Disposition', actual.contentDisposition);
        }

        res.status(actual.status || 200).send(actual.content);
    }

    protected static handleError(err, body?, res?, defaultMessage = 'An unknown error occurred') {
        const msg = FhirHelper.getErrorString(err, body, defaultMessage);

        this.log.error(msg);

        if (res) {
            if (err && err.statusCode) {
                res.status(err.statusCode);
            } else {
                res.status(500);
            }

            res.send(msg);
        }
    }
}