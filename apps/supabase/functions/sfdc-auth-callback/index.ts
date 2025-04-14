import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { encryptData } from '../_shared/security.ts'

// Required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SALESFORCE_CLIENT_ID',
  'SALESFORCE_CLIENT_SECRET',
  'TOKEN_ENCRYPTION_KEY',
  'FRONTEND_URL'
]

interface OAuthState {
  id: string
  user_id: string
  state: string
  code_verifier: string
  created_at: string
  expires_at: string
}

interface SalesforceTokenResponse {
  access_token: string
  refresh_token: string
  instance_url: string
  id: string
  token_type: string
  issued_at: string
  signature: string
}

interface SalesforceIds {
  sf_org_id: string
  sf_user_id: string
}

// Helper function to parse Salesforce ID URL
function parseSalesforceIdUrl(idUrl: string): SalesforceIds {
  console.log('[Parse] Parsing Salesforce ID URL:', { idUrl })
  try {
    const url = new URL(idUrl)
    const pathParts = url.pathname.split('/')
    const sf_org_id = pathParts[pathParts.length - 2]
    const sf_user_id = pathParts[pathParts.length - 1]
    
    if (!sf_org_id || !sf_user_id) {
      console.error('[Parse] Invalid Salesforce ID URL format:', { pathParts })
      throw new Error('Invalid Salesforce ID URL format')
    }
    
    console.log('[Parse] Successfully parsed Salesforce IDs:', { sf_org_id, sf_user_id })
    return { sf_org_id, sf_user_id }
  } catch (error) {
    console.error('[Parse] Failed to parse Salesforce ID URL:', { error: error.message, idUrl })
    throw new Error(`Failed to parse Salesforce ID URL: ${error.message}`)
  }
}

// Helper function to initialize Supabase admin client
function getSupabaseAdmin(): SupabaseClient {
  console.log('[Supabase] Initializing admin client')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Helper function to exchange code for tokens
async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<SalesforceTokenResponse> {
  console.log('[Token Exchange] Initiating token exchange', {
    hasCode: Boolean(code),
    hasCodeVerifier: Boolean(codeVerifier),
    redirectUri
  })

  const clientId = Deno.env.get('SALESFORCE_CLIENT_ID')!
  const clientSecret = Deno.env.get('SALESFORCE_CLIENT_SECRET')!

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier
  })

  try {
    const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Token Exchange] Failed', {
        status: response.status,
        statusText: response.statusText,
        response: errorText
      })
      throw new Error(`Salesforce token exchange failed: ${response.statusText}`)
    }

    const tokenData = await response.json()
    console.log('[Token Exchange] Success', {
      hasAccessToken: Boolean(tokenData.access_token),
      hasRefreshToken: Boolean(tokenData.refresh_token),
      instanceUrl: tokenData.instance_url,
      id: tokenData.id
    })

    return tokenData
  } catch (error) {
    console.error('[Token Exchange] Error during token exchange:', {
      error: error.message,
      stack: error.stack
    })
    throw error
  }
}

// Helper function to store connection
async function storeConnection(
  supabase: SupabaseClient,
  userId: string,
  tokenData: SalesforceTokenResponse,
  sfIds: SalesforceIds
): Promise<void> {
  console.log('[Storage] Starting connection storage', {
    userId,
    orgId: sfIds.sf_org_id,
    instanceUrl: tokenData.instance_url
  })

  try {
    const encryptedAccessToken = await encryptData(tokenData.access_token)
    const encryptedRefreshToken = await encryptData(tokenData.refresh_token)
    console.log('[Storage] Tokens encrypted successfully')

    const { error } = await supabase
      .from('salesforce_connections')
      .insert({
        user_id: userId,
        sf_org_id: sfIds.sf_org_id,
        sf_user_id: sfIds.sf_user_id,
        instance_url: tokenData.instance_url,
        encrypted_access_token: encryptedAccessToken,
        encrypted_refresh_token: encryptedRefreshToken,
        status: 'active'
      })

    if (error) {
      console.error('[Storage] Failed to store connection', {
        error: error.message,
        code: error.code,
        details: error.details
      })
      throw new Error(`Failed to store connection: ${error.message}`)
    }

    console.log('[Storage] Successfully stored connection')
  } catch (error) {
    console.error('[Storage] Error during connection storage:', {
      error: error.message,
      stack: error.stack
    })
    throw error
  }
}

// Main handler function
export async function handler(req: Request, customSupabase?: SupabaseClient): Promise<Response> {
  console.log('[Handler] Starting OAuth callback processing', {
    method: req.method,
    url: req.url
  })

  try {
    // Validate environment variables
    console.log('[Handler] Validating environment variables')
    for (const envVar of requiredEnvVars) {
      if (!Deno.env.get(envVar)) {
        console.error('[Handler] Missing required environment variable:', envVar)
        throw new Error(`Missing required environment variable: ${envVar}`)
      }
    }
    console.log('[Handler] Environment validation complete')

    // Handle CORS
    if (req.method === 'OPTIONS') {
      console.log('[Handler] Handling CORS preflight request')
      return new Response('ok', { headers: corsHeaders })
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
      console.error('[Handler] Invalid method', { method: req.method })
      return new Response('Method not allowed', { status: 405 })
    }

    // Parse query parameters
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    console.log('[Handler] Parsed query parameters', {
      hasCode: Boolean(code),
      hasState: Boolean(state)
    })

    if (!code || !state) {
      throw new Error('Missing required parameters: code and state')
    }

    // Initialize Supabase admin client
    const supabase = customSupabase || getSupabaseAdmin()

    // Validate state
    console.log('[Handler] Validating state', { state })
    const { data: stateData, error: stateError } = await supabase
      .from('oauth_states')
      .select('user_id, code_verifier, expires_at')
      .eq('state', state)
      .single()

    if (stateError || !stateData) {
      console.error('[Handler] State validation failed', {
        error: stateError?.message,
        hasStateData: Boolean(stateData)
      })
      throw new Error('Invalid or missing state')
    }

    if (new Date(stateData.expires_at) < new Date()) {
      console.error('[Handler] State expired', {
        expiresAt: stateData.expires_at,
        now: new Date().toISOString()
      })
      throw new Error('Expired state')
    }

    console.log('[Handler] State validated successfully', {
      userId: stateData.user_id,
      expiresAt: stateData.expires_at
    })

    // Exchange code for tokens
    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/sfdc-auth-callback`
    const tokenData = await exchangeCodeForTokens(
      code,
      stateData.code_verifier,
      redirectUri
    )

    // Parse Salesforce IDs
    const sfIds = parseSalesforceIdUrl(tokenData.id)

    // Store connection
    await storeConnection(supabase, stateData.user_id, tokenData, sfIds)

    // Cleanup state
    console.log('[Handler] Cleaning up OAuth state', { state })
    const { error: cleanupError } = await supabase
      .from('oauth_states')
      .delete()
      .eq('state', state)

    if (cleanupError) {
      console.error('[Handler] Failed to cleanup state', {
        error: cleanupError.message
      })
      // Don't throw here, as the main operation was successful
    }

    // Success redirect
    const frontendUrl = Deno.env.get('FRONTEND_URL')!
    const successUrl = `${frontendUrl}/settings?connect=success`
    console.log('[Handler] Redirecting to success URL', { successUrl })
    return Response.redirect(successUrl, 302)

  } catch (error) {
    console.error('[Handler] Error:', {
      error: error.message,
      stack: error.stack
    })
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'location': `${Deno.env.get('FRONTEND_URL')}/settings?connect=error`
      }
    })
  }
}

// Only start the server if this file is run directly
if (import.meta.main) {
  serve(handler)
} 