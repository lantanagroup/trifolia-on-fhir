import {ConfigFhirServerModel} from './config-fhir-server-model';

export class AuthConfigModel {
    public clientId: string;
    public domain: string;
    public scope: string;
}

export class ConfigModel {
    public fhirServers: ConfigFhirServerModel[];
    public auth: AuthConfigModel;
}
