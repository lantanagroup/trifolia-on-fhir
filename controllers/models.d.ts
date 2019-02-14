import {Request} from 'express';

export interface ExtendedRequest extends Request {
    fhirServerBase: string;
    ioConnections: any[];
}

export interface IOConnection {
    id: string;
    practitioner?: {
        id: string;
        name: [{
            given: string[];
            family: string;
        }]
    };
    userProfile?: {
        user_id: string;
        email: string;
    };
}
