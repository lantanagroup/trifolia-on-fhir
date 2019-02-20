import {Request} from 'express';
import {Server} from 'socket.io';

export interface UserInfo {
    sub: string;
}

export interface ExtendedRequest extends Request {
    fhirServerBase: string;
    fhirServerVersion: string;
    user?: UserInfo;
    body?: any;
    io: Server;
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

export interface FhirConfig {
    publishedGuides: string;
    latestPublisher: string;
    servers: [{
        id: string;
        name: string;
        short?: string;
    }];
    publishedVersions: [{
        version: string;
        url: string;
    }];
}

export interface ServerConfig {
    port: number;
    adminCode: string;
    supportUrl: string;
}

export interface RestRejection {
    statusCode: number;
    message: string;
}

export interface RequestOptions {
    url: string;
    method?: 'GET'|'PUT'|'POST'|'DELETE';
    json?: boolean;
    body?: any;
    resolveWithFullResponse?: boolean;
}

export interface ConnectionModel {
    socketId: string;
    userId?: string;
    email?: string;
    practitionerReference?: string;
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

    export interface Reference {
        reference?: string;
        display?: string;
    }

    export interface Bundle {
        total?: number;
        entry: [{
            fullUrl: string;
            resource?: DomainResource;
        }];
    }

    export interface ImplementationGuide extends DomainResource {
        name?: string;
    }

    export interface StructureDefinition extends DomainResource {
        url: string;
    }

    export interface CapabilityStatement extends DomainResource {
        fhirVersion: string;
    }

    export namespace STU3 {
        export interface ImplementationGuidePackageResource {
            example: boolean;
            name?: string;
            description?: string;
            acronym?: string;
            sourceUri?: string;
            sourceReference?: Fhir.Reference;
            exampleFor?: Fhir.Reference;
        }

        export interface ImplementationGuidePackage {
            name: string;
            description?: string;
            resource: ImplementationGuidePackageResource[];
        }

        export interface ImplementationGuide extends Fhir.ImplementationGuide {
            package?: Fhir.STU3.ImplementationGuidePackage[];
        }
    }

    export namespace R4 {
        export interface ImplementationGuideResource {
            reference: Fhir.Reference;
            fhirVersion?: string[]
            name?: string;
            description?: string;
            exampleBoolean?: boolean;
            exampleCanonical?: string;
        }

        export interface ImplementationGuide extends Fhir.ImplementationGuide {
            definition?: {
                resource: Fhir.R4.ImplementationGuideResource[];
            };
        }
    }
}
