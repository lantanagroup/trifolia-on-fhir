import {ConfigFhirServerModel} from './config-fhir-server-model';

export interface ConfigModel {
  version: string;
  supportUrl: string;
  fhirServers: ConfigFhirServerModel[];
  enableSecurity: boolean;
  auth: {
    clientId: string;
    domain: string;
    scope: string;
    issuer: string;
  };
  github: {
    clientId: string;
  };
  nonEditableResources: {
    [resourceType: string]: string[];
  };
}
