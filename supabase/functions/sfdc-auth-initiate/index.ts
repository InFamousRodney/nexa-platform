/// <reference types="https://deno.land/std@0.208.0/http/server.ts" />

import { serve } from "std/http/server.ts";
import { type SupabaseClient } from "@supabase/supabase-js";
import { corsHeaders } from "@/shared/cors";
import { generateRandomString } from "@/shared/utils/crypto.ts";
import { encryptData } from "@/shared/security.ts";
import { SALESFORCE, ENV_VARS } from "@/shared/constants/salesforce.ts";
import { createSupabaseClient, requireAuth } from "@/shared/utils/supabase.ts";

export async function handleRequest(req: Request, customClient?: SupabaseClient): Promise<Response> {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Check auth first
    const authError = await requireAuth(req);
    if (authError) {
      return authError;
    }

    // Get or create Supabase client
    const supabase = customClient ?? createSupabaseClient(req, { useServiceRole: true });

    // Define core OAuth parameters
    const redirectUri = `${Deno.env.get(ENV_VARS.PUBLIC_URL)}/sfdc-auth-callback`;
    const oauthStateParam = generateRandomString(32);
    const codeVerifier = generateRandomString(128);

    // Generate code challenge from the code verifier
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Create data to encrypt (only the essential secret data)
    const dataToEncrypt = {
      codeVerifier
    };

    // Encrypt sensitive data
    const encryptedDataBlob = await encryptData(JSON.stringify(dataToEncrypt));

    // Store state in database for validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user?.id) {
      throw new Error("User not found");
    }

    const now = new Date();
    const { error: storeError } = await supabase
      .from("oauth_states")
      .insert([
        {
          state: oauthStateParam,
          encrypted_data: encryptedDataBlob,
          user_id: user.id,
          created_at: now.toISOString(),
          expires_at: new Date(now.getTime() + SALESFORCE.STATE_EXPIRY_MINUTES * 60 * 1000).toISOString(),
        },
      ]);

    if (storeError) {
      console.error("Error storing state:", storeError);
      throw new Error("Failed to store OAuth state");
    }

    // Build authorization URL with the simple state parameter
    const authUrl = new URL(SALESFORCE.AUTH_URL);
    authUrl.searchParams.set("client_id", Deno.env.get(ENV_VARS.SFDC_CLIENT_ID) ?? "");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("state", oauthStateParam);
    authUrl.searchParams.set("code_challenge", codeChallenge);
    authUrl.searchParams.set("code_challenge_method", "S256");
    authUrl.searchParams.set("scope", SALESFORCE.SCOPES.join(" "));

    return new Response(
      JSON.stringify({ url: authUrl.toString() }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Helper function to generate code challenge
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(hash));
}

// Helper function to base64url encode
function base64UrlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Export the handler directly
export const handler = (req: Request): Promise<Response> => handleRequest(req);

// Start server if this file is run directly
if (import.meta.main) {
  serve(handler);
}
