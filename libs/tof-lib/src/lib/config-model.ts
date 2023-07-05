

/**
 * This interface describes what config options are available to the client application.
 */
export interface ConfigModel {
  version: string;
  supportUrl: string;
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
  termsOfUse: string;
  privacyPolicy: string;
  googleAnalyticsCode?: string;
}
