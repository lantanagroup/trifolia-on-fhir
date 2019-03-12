import {Request} from 'express';
import {Server} from 'socket.io';
import {Fhir} from 'fhir/fhir';

export interface UserInfo {
    sub: string;
}

export interface ExtendedRequest extends Request {
    fhir: Fhir;
    fhirServerBase: string;
    fhirServerVersion: string;
    user?: UserInfo;
    body: any;
    io: Server;
    ioConnections: any[];
    headers: {
        fhirserver: string
    };
    url: string;
    method: string;
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

export interface FhirConfigServer {
    id: string;
    name: string;
    uri: string;
    version: string;
    short?: string;
}

export interface FhirConfig {
    publishedGuides: string;
    latestPublisher: string;
    servers: FhirConfigServer[];
    publishedVersions: [{
        version: string;
        url: string;
    }];
    nonEditableResources: {
        codeSystems: string[];
    };
}

export interface AuthConfig {
    clientId: string;
    domain: string;
    scope: string;
    secret: string;
    issuer: string;
    userInfoUrl: string;
}

export interface GithubConfig {
    clientId: string;
    secret: string;
}

export interface ServerConfig {
    port: number;
    adminCode: string;
    supportUrl: string;
    javaLocation?: string;
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

export interface FhirControlDependency {
    location: string;
    name: string;
    version: string;
}

export interface FhirControl {
    tool: string;
    source: string;
    'npm-name': string;
    license: string;
    paths: {
        qa: string;
        temp: string;
        output: string;
        txCache: string;
        specification: string;
        pages: string[];
        resources: string[];
    };
    version?: string;
    pages: string[];
    'extension-domains': string[];
    'allowed-domains': string[];
    'sct-edition': string;
    canonicalBase: string;
    defaults?: {
        [key: string]: {
            'template-base'?: string;
            'template-mappings'?: string;
            'template-defns'?: string;
            'template-format'?: string;
            content?: boolean;
            script?: boolean;
            profiles?: boolean;
        };
    };
    dependencyList?: FhirControlDependency[];
    resources?: {
        [key: string]: {
            base?: string;
            defns?: string;
        };
    };
}

export namespace Fhir {
    export interface Extension {
        url: string;
    }

    export interface DomainResource {
        resourceType: string;
        extension?: Extension[];
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
            fhirVersion?: string[];
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