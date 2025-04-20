# Salesforce Connected App Setup Guide

## Prerequisites
- Salesforce Developer Account or Production Org with admin access
- Access to Nexa Platform repository

## Step-by-Step Setup

### 1. Create Connected App

1. Log in to your Salesforce org
2. Go to Setup
3. In the Quick Find box, search for "App Manager"
4. Click "New Connected App" button
5. Fill in the basic information:
   - Connected App Name: `Nexa Platform`
   - API Name: `Nexa_Platform`
   - Contact Email: Your team's contact email

### 2. Essential OAuth Configuration

1. Enable OAuth Settings:
   - Enable OAuth Settings: ✓ (Check this box)
   - Callback URL: `http://localhost:54321/functions/v1/sfdc-auth-callback`
   - Enable PKCE: ✓ (Check this box) - Required for enhanced security

2. Selected OAuth Scopes:
   - `api` (Required: Access to Salesforce APIs, including Metadata and Tooling APIs)
   - `id` (Required: Access to identity service for user/org identification)
   - `openid` (Required: Standard OpenID Connect flow for identification)
   - `refresh_token` (Required: For maintaining persistent access)

3. Configure OAuth Policies:
   - Require Proof Key for Code Exchange (PKCE): ✓ (Check this box)
   - Require Secret for Web Server Flow: ✓ (Check this box)
   - Require Secret for Refresh Token Flow: ✓ (Check this box)
   - All other OAuth policies: ✗ (Leave unchecked)

### 3. Optional/Skip Sections

1. Web App Settings:
   - Start URL: Leave empty (not needed for external OAuth flow)
   - Enable SAML: ✗ (Not using SAML)

2. Custom Connected App Handler:
   - Skip entirely (no custom Apex needed)

3. Mobile App Settings:
   - Skip entirely (NEXA is a web application)

4. Canvas App Settings:
   - Skip entirely (NEXA runs externally)

### 4. Save and Get Credentials

1. Click "Save"
2. Wait for Salesforce to create the app (this may take a few minutes)
3. Once created, click "Continue"
4. Note down the following credentials (store these securely!):
   - Consumer Key (this will be your `SALESFORCE_CLIENT_ID`)
   - Consumer Secret (this will be your `SALESFORCE_CLIENT_SECRET`)

### 5. Additional Configuration

1. IP Relaxation:
   - Go to "Manage Connected App"
   - Set "IP Relaxation" to "Relax IP restrictions"
   - Set "Refresh Token Policy" to "Refresh token is valid until revoked"

## Security Notes

- Store credentials securely in environment variables
- Never commit credentials to version control
- Use different Connected Apps for development and production
- For production, update the Callback URL to your production URL

## Next Steps

1. Create a `.env` file in your local development environment
2. Add the credentials:
   ```
   SALESFORCE_CLIENT_ID=<your_consumer_key>
   SALESFORCE_CLIENT_SECRET=<your_consumer_secret>
   SALESFORCE_REDIRECT_URI=http://localhost:54321/functions/v1/sfdc-auth-callback
   TOKEN_ENCRYPTION_KEY=<generate_32_byte_key>
   ```

## Troubleshooting

Common issues:
1. Invalid callback URL: Make sure it exactly matches what's configured
2. OAuth scope issues: Verify all required scopes are selected
3. IP restrictions: Check IP Relaxation settings if getting IP-related errors
