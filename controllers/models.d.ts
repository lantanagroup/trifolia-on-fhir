import {Request} from 'express';

export interface UserInfo {
    sub: string;
}

export interface ExtendedRequest extends Request {
    fhirServerBase: string;
    ioConnections: any[];
    user?: UserInfo;
    body?: any;
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

export interface FhirConfig {
    servers: [{
        id: string;
        name: string;
    }];
}

export interface RestRejection {
    statusCode: number;
    message: string;
}

export namespace Fhir {
    export interface DomainResource {
        id?: string;
    }

    export interface Practitioner extends DomainResource {
        identifier?: Identifier[];
    }

    export interface Identifier {
        value?: string;
        system?: string;
    }
}
