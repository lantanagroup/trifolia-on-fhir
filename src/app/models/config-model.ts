import {ConfigFhirServerModel} from './config-fhir-server-model';

export class AuthConfigModel {
    clientId: string;
    domain: string;
    scope: string;
}

export class GithubConfigModel {
    clientId: string;
}

export class ConfigModel {
    public version: string;
    public supportUrl: string;
    public fhirServers: ConfigFhirServerModel[];
    public auth: AuthConfigModel;
    public github: GithubConfigModel;
}
