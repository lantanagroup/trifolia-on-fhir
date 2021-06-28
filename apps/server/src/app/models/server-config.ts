export interface IServerConfig {
  // This is the hostname that the server is hosted at (i.e. localhost)
  hostname?: string;
  // This is the port that the server is hosted at (i.e. 8080)
  port?: number;
  // Specify where the key and cert for the SSL certificates are to host the server at https:// natively through node
  https?: {
    keyPath: string;
    certPath: string;
  };
  supportUrl: string;
  googleAnalyticsCode?: string;
  javaLocation?: string;
  logFileName?: string;
  logLevel?: 'all' | 'trace' | 'warn' | 'error';
  maxLogSizeKB?: number;
  publishedIgsDirectory?: string;
  enableSecurity: boolean;
  maxRequestSizeMegabytes: number;
  latestIgPublisherPath?: string;
  bannerMessage?: string;
  maxAsyncQueueRequests: number;
  publishStatusPath?: string;

  // The configuration for mail server to use to send email
  // See nodemailer for all possible options
  mailTransport?: any;
  mailOptions?: {
    from: string;
    hostUrl: string;
    subjectPrefix?: string;
  };
}

export function createTestServerConfig(enableSecurity = false): IServerConfig {
  return {
    supportUrl: 'http://test.com/support',
    enableSecurity: enableSecurity,
    maxRequestSizeMegabytes: 50,
    maxAsyncQueueRequests: 10
  };
}
