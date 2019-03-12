import {ConfigFhirServerModel} from './config-fhir-server-model';

export interface ConfigModel {
    version: string;
    supportUrl: string;
    fhirServers: ConfigFhirServerModel[];
    auth: {
        clientId: string;
        domain: string;
        scope: string;
    };
    github: {
        clientId: string;
    };
    nonEditableResources: {
        codeSystems: string[];
    };
}
