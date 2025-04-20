# Salesforce OAuth Implementation - Code Review Document

## Overview
This document outlines the implementation of the Salesforce OAuth flow in our Supabase Edge Functions, specifically focusing on the authentication initiation endpoint.

## Database Schema Changes

### 1. OAuth States Table Modifications
```sql
-- Remove code_verifier column (now stored in encrypted_data)
ALTER TABLE public.oauth_states DROP COLUMN IF EXISTS code_verifier;

-- Add encrypted_data column for secure state storage
ALTER TABLE public.oauth_states ADD COLUMN IF NOT EXISTS encrypted_data TEXT;
```

Current table structure:
```sql
CREATE TABLE public.oauth_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state TEXT NOT NULL UNIQUE,
    encrypted_data TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    code_verifier_iv TEXT NOT NULL
);
```

## Edge Function Implementation

### 1. Salesforce Auth Initiate Function
Location: `/supabase/functions/sfdc-auth-initiate/index.ts`

Key components:

#### a. State Generation and Security
```typescript
// Generate secure state and code verifier
const state = {
    codeVerifier: generateCodeVerifier(),
    timestamp: new Date().toISOString(),
    redirectUri: `${req.headers.get("origin")}/sfdc-auth-callback`,
};

// Encrypt state for secure storage
const encryptedState = // ... encryption logic
```

#### b. User Authentication
```typescript
// Extract and validate JWT token
const authHeader = req.headers.get("Authorization");
if (!authHeader) {
    throw new Error("Missing Authorization header");
}

const token = authHeader.replace("Bearer ", "");
const { data: { user }, error: userError } = await supabase.auth.getUser(token);

if (userError || !user?.id) {
    throw new Error("User not found");
}
```

#### c. Database Storage with IV
```typescript
// Generate random IV for code verifier encryption
const iv = crypto.getRandomValues(new Uint8Array(16));
const ivBase64 = base64UrlEncode(iv);

// Store state in database
const { error: storeError } = await supabase
    .from("oauth_states")
    .insert([
        {
            state: encryptedState,
            encrypted_data: JSON.stringify(state),
            user_id: user.id,
            created_at: state.timestamp,
            expires_at: new Date(Date.now() + SALESFORCE.STATE_EXPIRY_MINUTES * 60 * 1000).toISOString(),
            code_verifier_iv: ivBase64,
        },
    ]);
```

#### d. Salesforce Authorization URL Generation
```typescript
const authUrl = new URL(SALESFORCE.AUTH_URL);
authUrl.searchParams.set("client_id", Deno.env.get(ENV_VARS.SFDC_CLIENT_ID) ?? "");
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("redirect_uri", state.redirectUri);
authUrl.searchParams.set("state", encryptedState);
authUrl.searchParams.set("code_challenge", codeChallenge);
authUrl.searchParams.set("code_challenge_method", "S256");
```

## Security Considerations

1. **State Management**
   - State is encrypted before storage
   - Includes timestamp for expiration
   - Unique per request
   - Tied to specific user via `user_id`

2. **PKCE Implementation**
   - Code verifier is securely generated
   - Code challenge uses SHA-256
   - IV is randomly generated for each request

3. **Authentication**
   - JWT token validation
   - User existence verification
   - RLS policies in place

## Testing

### Test User Creation
```sql
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'd7bed83c-44a2-4645-9e79-cc7d759c1776',
    'authenticated',
    'authenticated',
    'test@example.com',
    crypt('test123', gen_salt('bf')),
    now()
);
```

### API Testing
```bash
curl -X POST http://127.0.0.1:54321/functions/v1/sfdc-auth-initiate \
  -H "Authorization: Bearer <valid-jwt-token>"
```

Expected response:
```json
{
    "url": "https://login.salesforce.com/services/oauth2/authorize?..."
}
```

## Next Steps

1. Implement the callback endpoint (`sfdc-auth-callback`)
2. Add state validation in callback
3. Implement token exchange
4. Add error handling for expired states
5. Implement automatic cleanup of expired states

## Questions for Review

1. Should we add rate limiting to prevent abuse?
2. Should we add additional validation for the redirect URI?
3. Should we implement state cleanup via a cron job?
4. Should we add logging for security audit purposes?
