
export interface IAuthConfig {
  clientId: string;
  domain: string;
  scope?: string;
  secret: string;
  issuer: string;
  userInfoUrl: string;
}
