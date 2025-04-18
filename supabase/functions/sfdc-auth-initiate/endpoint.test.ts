import { assertEquals, assertStringIncludes, assert } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { handleRequest } from "./index.ts";
import {
  setupEnv,
  clearEnv,
  restoreEnv,
  mockUser,
  mockSupabaseClient,
  mockSupabaseAdminClient,
  mockErrorClient,
  mockErrorAdminClient
} from "./test-setup.ts";

// Import constants from index.ts
import { ENV_VARS, CONSTANTS } from "./index.ts";

// Set up environment before importing modules
console.log("\n=== Test Suite Setup ===");
setupEnv();

// Mock the entire supabase-js module
const mockSupabaseJs = {
  createClient: (url: string, key: string, options?: any) => {
    console.log("\n=== createClient Called ===");
    console.log("URL:", url);
    console.log("Key:", key?.substring(0, 10) + "...");
    console.log("Options:", JSON.stringify(options, null, 2));

    // Return error client for invalid token tests
    if (options?.global?.headers?.Authorization === "Bearer invalid-token") {
      console.log("Using error client (invalid token)");
      return mockErrorClient;
    }

    // Return error admin client for database error tests
    if (key === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') && 
        options?.global?.headers?.Authorization === "Bearer db-error-token") {
      console.log("Using error admin client");
      return mockErrorAdminClient;
    }

    // Return admin client for service role key
    if (key === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
      console.log("Using admin client");
      return mockSupabaseAdminClient;
    }

    // Return regular client by default
    console.log("Using regular client");
    return mockSupabaseClient;
  }
};

// Mock the module import
console.log("Setting up Supabase module mock");
// @ts-ignore - We know what we're doing
globalThis.importMap = {
  imports: {
    'https://esm.sh/@supabase/supabase-js@2.38.4': mockSupabaseJs
  }
};

// Cleanup function
function cleanup() {
  console.log("\n=== Test Cleanup ===");
  restoreEnv();
  // @ts-ignore - We know what we're doing
  delete globalThis.importMap;
  console.log("Test environment cleaned up");
}

const mockValidUser = {
  id: "test-user-id",
  email: "test@example.com",
};

const createMockClient = (serviceRoleKey: string, mockUser = mockValidUser) => {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: mockUser }, error: null }),
    },
    from: () => ({
      insert: () => Promise.resolve({ error: null }),
    }),
  };
};

const createErrorMockClient = (serviceRoleKey: string) => {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: "Invalid token" } }),
    },
    from: () => ({
      insert: () => Promise.resolve({ error: null }),
    }),
  };
};

const createDbErrorMockClient = (serviceRoleKey: string) => {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: mockValidUser }, error: null }),
    },
    from: () => ({
      insert: () => Promise.resolve({ error: { message: "Database error" } }),
    }),
  };
};

// Mock createClient function for successful flow
const createSuccessClient = (url: string, key: string, options?: any) => {
  console.log("\n=== Mock createClient Called (Success) ===");
  console.log("URL:", url);
  console.log("Key:", key?.substring(0, 10) + "...");
  console.log("Options:", JSON.stringify(options, null, 2));

  if (key === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
    console.log("Using admin client");
    return mockSupabaseAdminClient;
  }
  console.log("Using regular client");
  return mockSupabaseClient;
};

// Mock createClient function for invalid token
const createErrorClient = (url: string, key: string, options?: any) => {
  console.log("\n=== Mock createClient Called (Error) ===");
  console.log("URL:", url);
  console.log("Key:", key?.substring(0, 10) + "...");
  console.log("Options:", JSON.stringify(options, null, 2));

  if (key === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
    console.log("Using admin client");
    return mockSupabaseAdminClient;
  }
  console.log("Using error client");
  return mockErrorClient;
};

// Mock createClient function for database error
const createDbErrorClient = (url: string, key: string, options?: any) => {
  console.log("\n=== Mock createClient Called (DB Error) ===");
  console.log("URL:", url);
  console.log("Key:", key?.substring(0, 10) + "...");
  console.log("Options:", JSON.stringify(options, null, 2));

  if (key === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
    console.log("Using error admin client");
    return mockErrorAdminClient;
  }
  console.log("Using regular client");
  return mockSupabaseClient;
};

// Update the mock admin client's insert method
const mockAdminClient = {
  from: (table: string) => ({
    insert: async (data: any) => {
      console.log('=== Mock Admin Client: insert() Called ===');
      console.log('Insert data:', data);
      
      // Verify that code_verifier is encrypted and has an IV
      if (data.code_verifier && !data.code_verifier_iv) {
        throw new Error('code_verifier_iv is required when code_verifier is encrypted');
      }
      
      return {
        data: null,
        error: null
      };
    }
  })
};

// Update the error mock client
const mockErrorAdminClient = {
  from: (table: string) => ({
    insert: async (data: any) => {
      console.log('  --> Mock admin insert error simulation');
      return {
        data: null,
        error: { message: 'Database error', code: 'DB_ERROR' }
      };
    }
  })
};

Deno.test("sfdc-auth-initiate endpoint - successful flow", async () => {
  console.log("\n=== Starting Successful Flow Test ===\n");
  
  // Setup environment with all required variables
  await setupEnv();

  try {
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { 
        "Authorization": "Bearer valid-token",
        "Content-Type": "application/json"
      },
    });

    console.log("\nMaking request...");
    const response = await handleRequest(request, createSuccessClient);
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    assertEquals(response.status, 200, "Expected 200 status code for successful flow");
    assertStringIncludes(data.authorizationUrl, "https://login.salesforce.com/services/oauth2/authorize");
  } finally {
    await restoreEnv();
  }
});

Deno.test("sfdc-auth-initiate endpoint - invalid token", async () => {
  console.log("\n=== Starting Invalid Token Test ===");
  
  // Setup environment with all required variables
  await setupEnv();
  
  try {
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { 
        "Authorization": "Bearer invalid-token",
        "Content-Type": "application/json"
      },
    });

    console.log("\nMaking request...");
    const response = await handleRequest(request, createErrorClient);
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    assertEquals(response.status, 401, "Expected 401 status code for invalid token");
    assertEquals(data.error, "Invalid or expired token");
  } finally {
    await restoreEnv();
  }
});

Deno.test("sfdc-auth-initiate endpoint - database insert failure", async () => {
  console.log("\n=== Starting Database Error Test ===");
  
  // Setup environment with all required variables
  await setupEnv();
  
  try {
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { 
        "Authorization": "Bearer valid-token",
        "Content-Type": "application/json"
      },
    });

    console.log("\nMaking request...");
    const response = await handleRequest(request, createDbErrorClient);
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    assertEquals(response.status, 500, "Expected 500 status code for database error");
    assertEquals(data.error, "Failed to store OAuth state");
  } finally {
    await restoreEnv();
  }
});

Deno.test("sfdc-auth-initiate endpoint - wrong HTTP method", async () => {
  console.log("\n=== Test: Wrong HTTP Method ===");
  
  // Setup environment with all required variables
  await setupEnv();
  
  try {
    const request = new Request("http://localhost", {
      method: "GET",
      headers: { 
        "Authorization": "Bearer valid-token",
        "Content-Type": "application/json"
      },
    });

    const response = await handleRequest(request);
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    assertEquals(response.status, 405, "Expected 405 status code for wrong HTTP method");
    assertEquals(data.error, "Method not allowed");
  } finally {
    await restoreEnv();
  }
});

Deno.test("sfdc-auth-initiate endpoint - missing authorization header", async () => {
  console.log("\n=== Test: Missing Authorization Header ===");
  
  // Setup environment with all required variables
  await setupEnv();
  
  try {
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
    });

    const response = await handleRequest(request);
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    assertEquals(response.status, 401, "Expected 401 status code for missing auth header");
    assertEquals(data.error, "No authorization header");
  } finally {
    await restoreEnv();
  }
});

Deno.test("sfdc-auth-initiate endpoint", async (t) => {
  let originalEnv: { [key: string]: string } = {};

  // --- Setup & Teardown Helpers ---
  const setup = () => {
    // Capture original env before setting test vars
    originalEnv = { ...Deno.env.toObject() };
    // Set all required env vars for the tests
    Deno.env.set('SALESFORCE_CLIENT_ID', 'test_client_id');
    Deno.env.set('SALESFORCE_CLIENT_SECRET', 'test_secret');
    Deno.env.set('SALESFORCE_REDIRECT_URI', 'https://test.com/callback');
    Deno.env.set('SUPABASE_URL', 'https://test.supabase.co');
    Deno.env.set('SUPABASE_ANON_KEY', 'test_anon_key');
    Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'test_service_key');
    // Generate a valid encryption key (32 bytes, base64 encoded)
    const key = crypto.getRandomValues(new Uint8Array(32));
    const keyBase64 = btoa(String.fromCharCode(...key));
    Deno.env.set('TOKEN_ENCRYPTION_KEY', keyBase64);
    console.log("+++ SETUP: Environment variables set for test step.");
  };

  const teardown = () => {
    // Restore original createClient
    // @ts-ignore - We know what we're doing
    delete globalThis.importMap;

    // Restore environment variables carefully
    const currentEnv = Deno.env.toObject();
    for (const key in currentEnv) {
      if (!(key in originalEnv)) {
        Deno.env.delete(key);
      }
    }
    for (const [key, value] of Object.entries(originalEnv)) {
      Deno.env.set(key, value);
    }
    console.log("--- TEARDOWN: Mocks and environment variables restored.");
  };

  // --- Test: Non-POST Method ---
  await t.step("should return 405 for non-POST requests", async () => {
    setup();
    const req = new Request('http://localhost:8000', { method: 'GET' });
    const res = await handleRequest(req);
    assertEquals(res.status, 405);
    await res.body?.cancel();
    teardown();
  });

  // --- Test: Missing Auth Header ---
  await t.step("should return 401 for missing authorization header", async () => {
    setup();
    const req = new Request('http://localhost:8000', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await handleRequest(req);
    assertEquals(res.status, 401);
    const body = await res.json();
    assertEquals(body.error, 'No authorization header');
    teardown();
  });

  // --- Test: Successful Flow ---
  await t.step("should return valid authorization URL for valid request", async () => {
    setup();

    console.log("\n=== Starting Successful Flow Test ===");
    console.log("Environment variables:");
    console.log("SUPABASE_ANON_KEY:", Deno.env.get('SUPABASE_ANON_KEY')?.substring(0, 5) + "...");
    console.log("SUPABASE_SERVICE_ROLE_KEY:", Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.substring(0, 5) + "...");

    // Create mock createClient function
    const mockCreateClient = (url: string, key: string, options?: any) => {
      console.log("\n>>> Mock createClient called:");
      console.log("URL:", url);
      console.log("Key:", key.substring(0, 5) + "...");
      console.log("Options:", JSON.stringify(options, null, 2));

      // Mock Admin Client (called with service key)
      if (key === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
        console.log("\n  --> Mocking ADMIN client");
        return {
          from: (table: string) => {
            console.log("  --> Mock ADMIN from() called with table:", table);
            assertEquals(table, 'oauth_states');
            return {
              insert: (data: any) => {
                console.log("  --> Mock ADMIN insert() called with data:", JSON.stringify(data, null, 2));
                assert(data.state, "Insert data missing state");
                assert(data.code_verifier, "Insert data missing code_verifier");
                assert(data.user_id === 'mock_user_id', "Insert data has wrong user_id");
                return Promise.resolve({ error: null });
              },
            };
          },
        };
      }
      // Mock User Auth Client (called with anon key)
      else if (key === Deno.env.get('SUPABASE_ANON_KEY')) {
        console.log("\n  --> Checking auth client conditions:");
        console.log("  Key matches ANON_KEY:", key === Deno.env.get('SUPABASE_ANON_KEY'));
        console.log("  Has options:", !!options);
        console.log("  Has global headers:", !!options?.global?.headers);
        console.log("  Auth header:", options?.global?.headers?.Authorization);
        
        console.log("\n  --> Mocking USER AUTH client");
        return {
          auth: {
            getUser: async () => {
              console.log("  --> Mock USER AUTH getUser() called (SUCCESS mock)");
              const result = { data: { user: { id: 'mock_user_id' } }, error: null };
              console.log("  --> Returning:", JSON.stringify(result, null, 2));
              return result;
            },
          },
        };
      }

      // Fallback if called unexpectedly
      console.error("\n!!! Mock createClient called with unexpected arguments !!!");
      console.error("Key provided:", key);
      console.error("Expected ANON_KEY:", Deno.env.get('SUPABASE_ANON_KEY'));
      console.error("Expected SERVICE_KEY:", Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
      throw new Error("Unexpected call to createClient in mock");
    };

    const req = new Request('http://localhost:8000', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer valid_token',
        'Content-Type': 'application/json'
      },
    });

    console.log("\n>>> Calling handleRequest for successful flow...");
    const res = await handleRequest(req, mockCreateClient);
    console.log(`<<< handleRequest returned status: ${res.status}`);

    // If error, log the response body
    if (res.status !== 200) {
      const bodyText = await res.text();
      console.error("<<< Error response body:", bodyText);
      assertEquals(res.status, 200, `Expected 200 status but got ${res.status}. Response: ${bodyText}`);
    }

    // Parse and verify success response
    const body = await res.json();
    console.log("<<< Success response body:", JSON.stringify(body, null, 2));
    assert(body.authorizationUrl, "Response body missing authorizationUrl");
    assertStringIncludes(body.authorizationUrl, 'https://login.salesforce.com');
    assertStringIncludes(body.authorizationUrl, `client_id=${Deno.env.get('SALESFORCE_CLIENT_ID')}`);
    assertStringIncludes(body.authorizationUrl, 'code_challenge=');
    assertStringIncludes(body.authorizationUrl, 'state=');

    teardown();
  });

  // --- Test: Invalid Token ---
  await t.step("should return 401 for invalid token", async () => {
    setup();
    
    // Create mock createClient function
    const mockCreateClient = (url: string, key: string, options?: any) => {
      if (key === Deno.env.get('SUPABASE_ANON_KEY')) {
        console.log("  --> Mocking USER AUTH client for INVALID token test");
        return {
          auth: {
            getUser: async () => {
              console.log("  --> Mock USER AUTH getUser() called (FAILURE mock)");
              return { data: { user: null }, error: { message: "Invalid token", status: 401 } };
            },
          },
        };
      }
      throw new Error("Unexpected call to createClient in invalid token test");
    };

    const req = new Request('http://localhost:8000', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer invalid_token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(">>> Calling handleRequest for invalid token...");
    const res = await handleRequest(req, mockCreateClient);
    console.log(`<<< handleRequest returned status: ${res.status}`);
    assertEquals(res.status, 401);
    const body = await res.json();
    assertEquals(body.error, 'Invalid or expired token');
    teardown();
  });

  // --- Test: Database Insert Failure ---
  await t.step("should return 500 for database insert failure", async () => {
    setup();
    
    // Create mock createClient function
    const mockCreateClient = (url: string, key: string, options?: any) => {
      if (key === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
        console.log("  --> Mocking ADMIN client for DB FAILURE test");
        return {
          from: (table: string) => ({
            insert: async (data: any) => {
              console.log("  --> Mock ADMIN insert() called (FAILURE mock)");
              return { error: { message: "DB Write Failed", code: "XYZ" } };
            },
          }),
        };
      }
      else if (key === Deno.env.get('SUPABASE_ANON_KEY')) {
        console.log("  --> Mocking USER AUTH client for DB FAILURE test (should succeed)");
        return { 
          auth: { 
            getUser: async () => ({ data: { user: { id: 'mock_user_id' } }, error: null }) 
          } 
        };
      }
      throw new Error("Unexpected call to createClient in DB failure test");
    };

    const req = new Request('http://localhost:8000', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer valid_token_for_db_fail',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(">>> Calling handleRequest for DB failure...");
    const res = await handleRequest(req, mockCreateClient);
    console.log(`<<< handleRequest returned status: ${res.status}`);
    assertEquals(res.status, 500);
    const body = await res.json();
    assertEquals(body.error, 'Failed to store OAuth state');
    teardown();
  });

  // --- Test: Missing Environment Variables ---
  await t.step("should return 400 for missing environment variables", async () => {
    setup();
    // Clear specific environment variables
    Deno.env.delete('SALESFORCE_CLIENT_ID');
    Deno.env.delete('SALESFORCE_CLIENT_SECRET');
    
    const req = new Request('http://localhost:8000', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer valid_token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(">>> Calling handleRequest with missing env vars...");
    const res = await handleRequest(req);
    console.log(`<<< handleRequest returned status: ${res.status}`);
    assertEquals(res.status, 400);
    const body = await res.json();
    assertEquals(
      body.error,
      "Missing required environment variables: SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET"
    );
    teardown();
  });
}); 