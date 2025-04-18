export interface SalesforceConnection {
  id: string;
  name: string;
  org_id: string;
  access_token: string;
  refresh_token: string;
  instance_url: string;
  created_at: string;
  updated_at: string;
}

export interface SFAuthInitiateResponse {
  authorizationUrl: string;
}

export interface SFAuthError {
  errorCode: string;
  errorMessage: string;
}