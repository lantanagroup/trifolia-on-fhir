
export interface IAuthConfig {
  clientId: string;
  domain: string;
  scope?: string;
  secret: string;
  issuer: string;
  jwksUri: string;
  logoutUrl?: string;
}
