export interface IServerConfig {
  hostname?: string;
  port?: number;
  https?: {
    keyPath: string;
    certPath: string;
  };
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
  maxAsyncQueueRequests: number;
}

export function createTestServerConfig(enableSecurity = false): IServerConfig {
  return {
    supportUrl: 'http://test.com/support',
    enableSecurity: enableSecurity,
    maxRequestSizeMegabytes: 50,
    maxAsyncQueueRequests: 10
  };
}
