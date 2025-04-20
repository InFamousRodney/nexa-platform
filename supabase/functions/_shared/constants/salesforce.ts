export const SALESFORCE = {
  AUTH_URL: 'https://login.salesforce.com/services/oauth2/authorize',
  TOKEN_URL: 'https://login.salesforce.com/services/oauth2/token',
  SCOPES: ['api', 'id', 'openid', 'refresh_token'],
  STATE_EXPIRY_MINUTES: 10,
  OAUTH_STATES_TABLE: 'oauth_states'
} as const;

export const ENV_VARS = {
  SFDC_CLIENT_ID: 'SFDC_CLIENT_ID',
  SFDC_CLIENT_SECRET: 'SFDC_CLIENT_SECRET',
  PUBLIC_URL: 'PUBLIC_URL',
  SUPABASE_URL: 'SUPABASE_URL',
  SUPABASE_ANON_KEY: 'SUPABASE_ANON_KEY',
  SUPABASE_SERVICE_ROLE_KEY: 'SUPABASE_SERVICE_ROLE_KEY',
  TOKEN_ENCRYPTION_KEY: 'TOKEN_ENCRYPTION_KEY'
} as const;
