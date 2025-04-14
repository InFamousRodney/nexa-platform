import { assertEquals, assertExists } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { createDatabaseClient } from "./database.ts";

Deno.test({
  name: "Supabase configuration test",
  async fn(t) {
    // Save current env
    const originalUrl = Deno.env.get('SUPABASE_URL');
    const originalServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const originalAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    await t.step("should throw error when SUPABASE_URL is missing", () => {
      Deno.env.delete('SUPABASE_URL');
      try {
        createDatabaseClient();
        throw new Error("Should have thrown error");
      } catch (error) {
        if (error instanceof Error) {
          assertEquals(error.message, "SUPABASE_URL is not set");
        } else {
          throw error;
        }
      }
    });

    await t.step("should throw error when SUPABASE_SERVICE_ROLE_KEY is missing", () => {
      Deno.env.set('SUPABASE_URL', 'http://example.com');
      Deno.env.delete('SUPABASE_SERVICE_ROLE_KEY');
      try {
        createDatabaseClient();
        throw new Error("Should have thrown error");
      } catch (error) {
        if (error instanceof Error) {
          assertEquals(error.message, "SUPABASE_SERVICE_ROLE_KEY is not set");
        } else {
          throw error;
        }
      }
    });

    await t.step("should create client when all env vars are set", () => {
      Deno.env.set('SUPABASE_URL', 'http://example.com');
      Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'test-key');
      const client = createDatabaseClient();
      assertExists(client);
    });

    // Restore original env
    if (originalUrl) Deno.env.set('SUPABASE_URL', originalUrl);
    if (originalServiceKey) Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', originalServiceKey);
    if (originalAnonKey) Deno.env.set('SUPABASE_ANON_KEY', originalAnonKey);
  },
  sanitizeOps: false,
  sanitizeResources: false,
}); 