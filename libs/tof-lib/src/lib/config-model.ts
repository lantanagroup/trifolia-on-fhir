import {ConfigFhirServerModel} from './config-fhir-server-model';

/**
 * This interface describes what config options are available to the client application.
 */
export interface ConfigModel {
  version: string;
  supportUrl: string;
  fhirServers: ConfigFhirServerModel[];
  enableSecurity: boolean;
  bannerMessage?: string;
  auth: {
    clientId: string;
    scope: string;
    issuer: string;
    logoutUrl?: string;
  };
  github: {
    clientId: string;
    authBase: string;
    apiBase: string;
  };
  nonEditableResources: {
    [resourceType: string]: string[];
  };
  announcementService: boolean;
}
