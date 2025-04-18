import { assertEquals, assertStringIncludes, assert } from "https://deno.land/std@0.168.0/testing/asserts.ts";
// Import the function to test
import { handleRequest } from "./index.ts";
// Import the Supabase library namespace for mocking
import * as supabaseJs from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// --- Test Suite ---
Deno.test("sfdc-auth-initiate endpoint", async (t) => {

  // Store original implementations to restore later
  const originalCreateClient = supabaseJs.createClient;
  let originalEnv: { [key: string]: string } = {};

  // --- Setup & Teardown Helpers ---
  const setup = () => {
    // Capture original env before setting test vars
    originalEnv = { ...Deno.env.toObject() };
    // Set ONLY the env vars needed for the tests below
    Deno.env.set('SALESFORCE_CLIENT_ID', 'test_client_id');
    Deno.env.set('SALESFORCE_CLIENT_SECRET', 'test_secret'); // Needed by handler check
    Deno.env.set('SUPABASE_URL', 'https://test.supabase.co');
    Deno.env.set('SUPABASE_ANON_KEY', 'test_anon_key');
    Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'test_service_key');
    console.log("+++ SETUP: Environment variables set for test step.");
  };

  const teardown = () => {
    // Restore mocks
    (supabaseJs as any).createClient = originalCreateClient;

    // Restore environment variables carefully
    const currentEnv = Deno.env.toObject();
    for (const key in currentEnv) {
      if (!(key in originalEnv)) {
        Deno.env.delete(key); // Remove keys added by the test
      }
    }
    for (const [key, value] of Object.entries(originalEnv)) {
      Deno.env.set(key, value); // Restore original values
    }
    console.log("--- TEARDOWN: Mocks and environment variables restored.");
  };

  // --- Test: Non-POST Method ---
  await t.step("should return 405 for non-POST requests", async () => {
      setup(); // Setup env vars needed by handler's initial check
      const req = new Request('http://localhost:8000', { method: 'GET' });
      const res = await handleRequest(req);
      assertEquals(res.status, 405);
      await res.body?.cancel(); // Consume body
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
    setup(); // Set env vars

    // Mock createClient to return specific mocks based on key/options
    (supabaseJs as any).createClient = (url: string, key: string, options: any) => {
      console.log(`>>> Mock createClient called with key: ${key.substring(0, 15)}...`); // Log key hint

      // Mock Admin Client (called with service key)
      if (key === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
        console.log("  --> Mocking ADMIN client");
        return {
          from: (table: string) => {
            console.log(`  --> Mock ADMIN from('${table}') called`);
            assertEquals(table, 'oauth_states');
            return {
              insert: (data: any) => {
                console.log("  --> Mock ADMIN insert() called (SUCCESS mock)");
                assert(data.state, "Insert data missing state");
                assert(data.code_verifier, "Insert data missing code_verifier");
                assert(data.user_id === 'mock_user_id', "Insert data has wrong user_id");
                return Promise.resolve({ error: null }); // SUCCESS
              },
            };
          },
        };
      }
      // Mock User Auth Client (called with anon key and auth header)
      else if (key === Deno.env.get('SUPABASE_ANON_KEY') && options?.global?.headers?.Authorization) {
         console.log("  --> Mocking USER AUTH client");
         return {
           auth: {
             getUser: () => {
               console.log("  --> Mock USER AUTH getUser() called (SUCCESS mock)");
               return Promise.resolve({ data: { user: { id: 'mock_user_id' } }, error: null }); // SUCCESS
             },
           },
         };
      }
      // Fallback if called unexpectedly
      console.error("!!! Mock createClient called with unexpected arguments !!!");
      throw new Error("Unexpected call to createClient in mock");
    };

    // Create request and call handler
    const req = new Request('http://localhost:8000', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer valid_token' },
    });
    console.log(">>> Calling handleRequest for successful flow...");
    const res = await handleRequest(req);
    console.log(`<<< handleRequest returned status: ${res.status}`);

    // Assertions
    assertEquals(res.status, 200);
    if (res.status === 200) {
      const body = await res.json();
      console.log("<<< Success response body:", body);
      assert(body.authorizationUrl, "Response body missing authorizationUrl");
      assertStringIncludes(body.authorizationUrl, 'https://login.salesforce.com');
      assertStringIncludes(body.authorizationUrl, `client_id=${Deno.env.get('SALESFORCE_CLIENT_ID')}`);
      assertStringIncludes(body.authorizationUrl, 'code_challenge=');
      assertStringIncludes(body.authorizationUrl, 'state=');
    } else {
       const bodyText = await res.text();
       console.error("<<< Error response body:", bodyText);
    }

    teardown(); // Restore originals
  });

  // --- Test: Invalid Token ---
  await t.step("should return 401 for invalid token", async () => {
     setup();
     (supabaseJs as any).createClient = (url: string, key: string, options: any) => {
         if (key === Deno.env.get('SUPABASE_ANON_KEY') && options?.global?.headers?.Authorization) {
             console.log("  --> Mocking USER AUTH client for INVALID token test");
             return {
                 auth: {
                     getUser: () => {
                         console.log("  --> Mock USER AUTH getUser() called (FAILURE mock)");
                         return Promise.resolve({ data: { user: null }, error: { message: "Invalid token", status: 401 } }); // FAILURE
                     },
                 },
             };
         }
         // Don't expect other calls for this test path
          console.error("!!! Mock createClient called unexpectedly in invalid token test !!!");
          throw new Error("Unexpected call to createClient in mock");
     };

     const req = new Request('http://localhost:8000', {
       method: 'POST',
       headers: { 'Authorization': 'Bearer invalid_token' }
     });
     console.log(">>> Calling handleRequest for invalid token...");
     const res = await handleRequest(req);
     console.log(`<<< handleRequest returned status: ${res.status}`);
     assertEquals(res.status, 401);
     const body = await res.json();
     assertEquals(body.error, 'Invalid or expired token');
     teardown();
   });

  // --- Test: Database Insert Failure ---
  await t.step("should return 500 for database insert failure", async () => {
     setup();
     (supabaseJs as any).createClient = (url: string, key: string, options: any) => {
        if (key === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
             console.log("  --> Mocking ADMIN client for DB FAILURE test");
             return {
                 from: (table: string) => ({
                     insert: (data: any) => {
                         console.log("  --> Mock ADMIN insert() called (FAILURE mock)");
                         return Promise.resolve({ error: { message: "DB Write Failed", code: "XYZ" } }); // FAILURE
                     },
                 }),
             };
        }
        else if (key === Deno.env.get('SUPABASE_ANON_KEY') && options?.global?.headers?.Authorization) {
             console.log("  --> Mocking USER AUTH client for DB FAILURE test (should succeed)");
             return { auth: { getUser: () => Promise.resolve({ data: { user: { id: 'mock_user_id' } }, error: null }) } }; // SUCCESS User Auth
        }
        console.error("!!! Mock createClient called unexpectedly in DB failure test !!!");
        throw new Error("Unexpected call to createClient in mock");
     };

     const req = new Request('http://localhost:8000', {
       method: 'POST',
       headers: { 'Authorization': 'Bearer valid_token_for_db_fail' }
     });
     console.log(">>> Calling handleRequest for DB failure...");
     const res = await handleRequest(req);
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
       headers: { 'Authorization': 'Bearer valid_token' }
     });
     console.log(">>> Calling handleRequest with missing env vars...");
     const res = await handleRequest(req);
     console.log(`<<< handleRequest returned status: ${res.status}`);
     assertEquals(res.status, 400);
     const body = await res.json();
     assertEquals(body.error, 'Missing required environment variables');
     teardown();
   });
}); 