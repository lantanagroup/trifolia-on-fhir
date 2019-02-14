import {Request} from 'express';

export interface ExtendedRequest extends Request {
    fhirServerBase: string;
}