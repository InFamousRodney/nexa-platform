import { encode as base64Encode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

// Mock Supabase client for user authentication
export const mockSupabaseClient = {
  auth: {
    getUser: async (token?: string) => {
      console.log("\n=== Mock getUser Called ===");
      console.log("Token received:", token);
      console.log("Returning successful user response");
      
      return {
        data: {
          user: {
            id: "mock-user-id",
            email: "test@example.com"
          }
        },
        error: null
      };
    }
  }
};

// Mock Supabase error client for testing invalid tokens
export const mockErrorClient = {
  auth: {
    getUser: async (token?: string) => {
      console.log("\n=== Mock getUser Called (Error Client) ===");
      console.log("Token received:", token);
      console.log("Returning error response");
      
      return {
        data: { user: null },
        error: { message: "Invalid token", status: 401 }
      };
    }
  }
};

// Mock Supabase admin client for database operations
export const mockSupabaseAdminClient = {
  from: (table: string) => {
    console.log("\n=== Mock Admin Client: from() Called ===");
    console.log("Table:", table);
    
    return {
      insert: async (data: any) => {
        console.log("=== Mock Admin Client: insert() Called ===");
        console.log("Insert data:", JSON.stringify(data, null, 2));
        
        // Validate required fields
        if (!data.state || !data.code_verifier || !data.user_id || !data.expires_at) {
          console.error("Missing required fields in insert data");
          return { error: { message: "Missing required fields" } };
        }
        
        console.log("Insert successful");
        return { error: null };
      }
    };
  }
};

// Mock Supabase admin client that simulates database errors
export const mockErrorAdminClient = {
  from: (table: string) => {
    console.log(`  --> Mock error admin from('${table}') called`);
    return {
      insert: async (data: any) => {
        console.log("  --> Mock admin insert error simulation");
        return { error: { message: "Database error", code: "DB_ERROR" } };
      }
    };
  }
};

// Store original environment
const originalEnv = { ...Deno.env.toObject() };

// Generate a valid 32-byte encryption key
function generateValidKey(): string {
  const key = crypto.getRandomValues(new Uint8Array(32)); // 256-bit key for AES-256-GCM
  return base64Encode(key);
}

// Default environment variables for testing
const DEFAULT_ENV = {
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_ANON_KEY: 'test_anon_key',
  SUPABASE_SERVICE_ROLE_KEY: 'test_service_role_key',
  SALESFORCE_CLIENT_ID: 'test_client_id',
  SALESFORCE_CLIENT_SECRET: 'test_client_secret',
  SALESFORCE_REDIRECT_URI: 'https://test.com/callback',
  TOKEN_ENCRYPTION_KEY: generateValidKey() // Use a proper encryption key
};

// Setup environment variables for testing
export async function setupEnv(customEnv: Record<string, string> = {}) {
  console.log('\n=== Setting up test environment ===\n');
  
  // Clear existing environment variables
  await clearEnv();
  
  // Set default environment variables
  for (const [key, value] of Object.entries(DEFAULT_ENV)) {
    Deno.env.set(key, value);
  }
  
  // Override with custom values if provided
  for (const [key, value] of Object.entries(customEnv)) {
    Deno.env.set(key, value);
  }
  
  console.log('Environment setup complete');
}

// Clear all environment variables
export function clearEnv() {
  console.log("\n=== Clearing environment variables ===");
  const currentEnv = Deno.env.toObject();
  for (const key of Object.keys(currentEnv)) {
    console.log(`Clearing ${key}`);
    Deno.env.delete(key);
  }
  console.log("Environment cleared");
}

// Restore original environment
export function restoreEnv() {
  console.log("\n=== Restoring original environment ===");
  clearEnv();
  for (const [key, value] of Object.entries(originalEnv)) {
    console.log(`Restoring ${key}`);
    Deno.env.set(key, value);
  }
  console.log("Original environment restored");
}

// Mock user data
export const mockUser = {
  id: "mock-user-id",
  email: "test@example.com"
}; 