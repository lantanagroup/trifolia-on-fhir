export interface IServerConfig {
  port?: number;
  adminCode: string;
  supportUrl: string;
  googleAnalyticsCode?: string;
  javaLocation?: string;
  logFileName?: string;
  logLevel?: 'all'|'warn'|'error';
}
