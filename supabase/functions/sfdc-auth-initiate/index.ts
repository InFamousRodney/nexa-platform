import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { generateRandomString } from './_shared/helpers.ts';
import { encryptData } from './_shared/security.ts';

// Constants for environment variable names
export const ENV_VARS = {
  SALESFORCE_CLIENT_ID: 'SALESFORCE_CLIENT_ID',
  SALESFORCE_CLIENT_SECRET: 'SALESFORCE_CLIENT_SECRET',
  SALESFORCE_REDIRECT_URI: 'SALESFORCE_REDIRECT_URI',
  SUPABASE_URL: 'API_EXTERNAL_URL',
  SUPABASE_ANON_KEY: 'API_ANON_KEY',
  SUPABASE_SERVICE_ROLE_KEY: 'API_SERVICE_KEY',
  TOKEN_ENCRYPTION_KEY: 'TOKEN_ENCRYPTION_KEY'
} as const;

// Constants for other values
export const CONSTANTS = {
  OAUTH_STATES_TABLE: 'oauth_states',
  SALESFORCE_AUTH_URL: 'https://login.salesforce.com/services/oauth2/authorize',
  STATE_EXPIRY_MINUTES: 10,
  SCOPES: 'api refresh_token'
} as const;

// Main request handler
export async function handleRequest(req: Request, customCreateClient = createClient): Promise<Response> {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const SALESFORCE_CLIENT_ID = Deno.env.get('SALESFORCE_CLIENT_ID');
    const SALESFORCE_CLIENT_SECRET = Deno.env.get('SALESFORCE_CLIENT_SECRET');
    const SUPABASE_URL = Deno.env.get('API_EXTERNAL_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('API_ANON_KEY');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('API_SERVICE_KEY');
    const SALESFORCE_REDIRECT_URI = Deno.env.get('SALESFORCE_REDIRECT_URI');

    // Validate environment variables
    const missingVars = Object.values(ENV_VARS).filter(
      (envVar) => !Deno.env.get(envVar)
    );

    if (missingVars.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Missing required environment variables: ${missingVars.join(', ')}`
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');

    // Initialize Supabase client for user authentication
    const supabaseClient = customCreateClient(
      SUPABASE_URL ?? '',
      SUPABASE_ANON_KEY ?? '',
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );

    // Validate JWT and get user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase Admin client (using Service Role Key for elevated privileges)
    const supabaseAdminClient = customCreateClient(
      SUPABASE_URL ?? '',
      SUPABASE_SERVICE_ROLE_KEY ?? ''
    );

    // Generate PKCE parameters
    const codeVerifier = generateRandomString(128);
    const state = generateRandomString(32);

    // Encrypt the code_verifier before storing
    const encryptedVerifier = await encryptData(codeVerifier);

    // Insert into database
    const { error: insertError } = await supabaseAdminClient
      .from(CONSTANTS.OAUTH_STATES_TABLE)
      .insert({
        state,
        code_verifier: encryptedVerifier.ciphertext,
        code_verifier_iv: encryptedVerifier.iv,
        user_id: user.id,
        expires_at: new Date(Date.now() + CONSTANTS.STATE_EXPIRY_MINUTES * 60 * 1000).toISOString()
      });

    if (insertError) {
      console.error('Database error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store OAuth state' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Build authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: Deno.env.get(ENV_VARS.SALESFORCE_CLIENT_ID)!,
      redirect_uri: Deno.env.get(ENV_VARS.SALESFORCE_REDIRECT_URI)!,
      scope: CONSTANTS.SCOPES,
      state,
      code_challenge: await generateCodeChallenge(codeVerifier),
      code_challenge_method: 'S256'
    });

    const authorizationUrl = `${CONSTANTS.SALESFORCE_AUTH_URL}?${params.toString()}`;

    return new Response(
      JSON.stringify({ authorizationUrl }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Helper function to generate a random string
function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Helper function to calculate SHA-256 hash
async function sha256(message: string): Promise<Uint8Array> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return new Uint8Array(hashBuffer);
}

// Helper function to base64url encode
function base64urlEncode(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Helper function to generate code challenge
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const hash = await sha256(codeVerifier);
  return base64urlEncode(hash);
}

// Only start the server if this file is being run directly
if (import.meta.main) {
  serve(handleRequest);
}
