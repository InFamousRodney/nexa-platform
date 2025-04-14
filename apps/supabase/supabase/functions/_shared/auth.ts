import { createClient } from '@supabase/supabase-js';
import { AuthenticationError } from './errors.ts';

/**
 * Authentication middleware for Edge Functions
 * Verifies the JWT token and adds the user to the request
 */
export async function authenticateRequest(req: Request): Promise<{ userId: string }> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    throw new AuthenticationError('Missing authorization header');
  }

  const jwt = authHeader.replace('Bearer ', '');
  
  if (!jwt) {
    throw new AuthenticationError('Invalid authorization header format');
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    const { data: { user }, error } = await supabase.auth.getUser(jwt);

    if (error || !user) {
      throw new AuthenticationError('Invalid token');
    }

    return { userId: user.id };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError('Authentication failed', { error });
  }
} 