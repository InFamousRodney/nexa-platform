/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="deno.ns" />

import { assertEquals } from "std/testing/asserts.ts"
import { createClient, SupabaseClient } from "@supabase/supabase-js"

// Mock data
const mockStateData = {
  id: 'test-state-id',
  user_id: 'test-user-id',
  state: 'test-state',
  code_verifier: 'test-code-verifier',
  created_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 3600000).toISOString()
}

const mockTokenData = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  instance_url: 'https://test.salesforce.com',
  id: 'https://login.salesforce.com/id/00D123456789/005123456789',
  token_type: 'Bearer',
  issued_at: Date.now().toString(),
  signature: 'test-signature'
}

// Mock environment variables
const mockEnvVars = {
  'SUPABASE_URL': 'https://test.supabase.co',
  'SUPABASE_SERVICE_ROLE_KEY': 'test-service-role-key',
  'SALESFORCE_CLIENT_ID': 'test-client-id',
  'SALESFORCE_CLIENT_SECRET': 'test-client-secret',
  'TOKEN_ENCRYPTION_KEY': '12345678901234567890123456789012', // 32 bytes for AES-256-GCM
  'FRONTEND_URL': 'http://localhost:3000'
}

// Create mock Supabase client
const createMockSupabase = (overrides = {}) => ({
  from: (table: string) => ({
    insert: async (data: any) => {
      if (table === 'sfdc_connections') {
        if (data.error_case) {
          return { error: new Error('Database error') };
        }
        return { error: null, data: [{ id: 'test-connection-id' }] };
      }
      return { error: null };
    },
    select: () => ({
      eq: (column: string, value: string) => ({
        single: async () => {
          if (table === 'oauth_states' && column === 'state') {
            if (value === 'expired-state') {
              return {
                data: {
                  user_id: 'test-user-id',
                  code_verifier: 'test-code-verifier',
                  expires_at: '2025-04-14T21:13:25.114Z'
                },
                error: null
              };
            }
            if (value === 'test-state') {
              return {
                data: {
                  user_id: 'test-user-id',
                  code_verifier: 'test-code-verifier',
                  expires_at: '2025-04-14T23:13:25.114Z'
                },
                error: null
              };
            }
          }
          return { data: null, error: new Error('State not found') };
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: string) => {
        if (table === 'oauth_states' && column === 'state' && (value === 'test-state' || value === 'expired-state')) {
          return Promise.resolve({ error: null });
        }
        return Promise.resolve({ error: new Error('Failed to delete state') });
      }
    })
  })
} as unknown as SupabaseClient)

// Test setup function
const setupTest = () => {
  // Store original state
  const originalEnv = Deno.env.toObject()
  const originalFetch = globalThis.fetch

  // Set mock environment variables
  for (const [key, value] of Object.entries(mockEnvVars)) {
    Deno.env.set(key, value)
  }

  // Mock fetch implementation
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString()
    const body = init?.body ? new URLSearchParams(init.body.toString()) : new URLSearchParams()
    
    if (url.includes('login.salesforce.com/services/oauth2/token')) {
      if (body.get('code') === 'error-code') {
        return new Response(JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid authorization code' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      return new Response(JSON.stringify(mockTokenData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return originalFetch(input, init)
  }

  // Return cleanup function
  return () => {
    // Restore original fetch
    globalThis.fetch = originalFetch
    
    // Restore original environment
    for (const key of Object.keys(Deno.env.toObject())) {
      Deno.env.delete(key)
    }
    for (const [key, value] of Object.entries(originalEnv)) {
      Deno.env.set(key, value)
    }
  }
}

// Import handler after environment setup
const { handler } = await import("./index.ts")

Deno.test("Callback Handler Tests", async (t) => {
  const cleanup = setupTest()

  try {
    // Test 1: Successful flow
    await t.step("should handle successful OAuth flow", async () => {
      const req = new Request(
        `http://localhost:8000/sfdc-auth-callback?code=test-code&state=${mockStateData.state}`
      )
      
      const response = await handler(req, createMockSupabase())
      
      assertEquals(response.status, 302)
      assertEquals(
        response.headers.get('location'),
        'http://localhost:3000/settings?connect=success'
      )
    })

    // Test 2: Missing parameters
    await t.step("should handle missing parameters", async () => {
      const req = new Request('http://localhost:8000/sfdc-auth-callback')
      
      const response = await handler(req, createMockSupabase())
      
      assertEquals(response.status, 302)
      assertEquals(
        response.headers.get('location'),
        'http://localhost:3000/settings?connect=error'
      )
    })

    // Test 3: Invalid state
    await t.step("should handle invalid state", async () => {
      const req = new Request(
        'http://localhost:8000/sfdc-auth-callback?code=test-code&state=invalid-state'
      )
      
      const mockSupabaseWithError = createMockSupabase({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('State not found') })
          })
        })
      })
      
      const response = await handler(req, mockSupabaseWithError)
      
      assertEquals(response.status, 302)
      assertEquals(
        response.headers.get('location'),
        'http://localhost:3000/settings?connect=error'
      )
    })

    // Test 4: Expired state
    await t.step("should handle expired state", async () => {
      const req = new Request('http://localhost:8000/sfdc-auth-callback?code=test-code&state=expired-state')
      
      const response = await handler(req, createMockSupabase())
      
      assertEquals(response.status, 302)
      assertEquals(
        response.headers.get('location'),
        'http://localhost:3000/settings?connect=error'
      )
    })

    // Test 5: Salesforce token exchange failure
    await t.step("should handle Salesforce token exchange failure", async () => {
      const req = new Request('http://localhost:8000/sfdc-auth-callback?code=error-code&state=test-state')
      
      const response = await handler(req, createMockSupabase())
      
      assertEquals(response.status, 302)
      assertEquals(
        response.headers.get('location'),
        'http://localhost:3000/settings?connect=error'
      )
    })

    // Test 6: Database storage failure
    await t.step("should handle database storage failure", async () => {
      // Mock Supabase client for database error
      const mockSupabaseClient = {
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { code_verifier: "test-verifier", expires_at: "2025-04-14T23:21:18.816Z", user_id: "test-user" } })
            })
          }),
          delete: () => ({
            eq: () => Promise.resolve()
          }),
          insert: () => Promise.reject(new Error("Database error during connection storage"))
        })
      };

      const url = new URL("https://example.com/callback");
      url.searchParams.set("code", "test-code");
      url.searchParams.set("state", "test-state");

      const request = new Request(url, {
        method: "GET"
      });

      const response = await handler(request, mockSupabaseClient);
      assertEquals(response.status, 302);
      assertEquals(response.headers.get("location"), "http://localhost:3000/settings?connect=error");
    });
  } finally {
    cleanup()
  }
}) 