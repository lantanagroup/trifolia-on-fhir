export interface IServerConfig {
  hostname?: string;
  port?: number;
  adminCode: string;
  supportUrl: string;
  googleAnalyticsCode?: string;
  javaLocation?: string;
  logFileName?: string;
  logLevel?: 'all'|'trace'|'warn'|'error';
  maxLogSizeKB?: number;
  publishedIgsDirectory?: string;
  enableSecurity: boolean;
  maxRequestSizeMegabytes: number;
  latestIgPublisherPath?: string;
  bannerMessage?: string;
}

export function createTestServerConfig(adminCode: string, enableSecurity = false): IServerConfig {
  return {
    adminCode: adminCode,
    supportUrl: 'http://test.com/support',
    enableSecurity: enableSecurity,
    maxRequestSizeMegabytes: 50
  };
}
