export interface SalesforceOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface SalesforceAuthState {
  codeVerifier: string;
  redirectUri: string;
  timestamp: string;
  state?: string;
}

export interface SalesforceTokenResponse {
  access_token: string;
  refresh_token: string;
  instance_url: string;
  id: string;
  token_type: string;
  scope: string;
  issued_at: string;
}
