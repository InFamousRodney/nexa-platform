import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types.ts';

/**
 * Creates a Supabase client instance for database operations
 */
export function createDatabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not set');
  }

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
}

/**
 * Helper function to handle database errors
 */
export function handleDatabaseError(error: unknown): never {
  console.error('Database error:', error);
  throw new Error('Database operation failed');
} 