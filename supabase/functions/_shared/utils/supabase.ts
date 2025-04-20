import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'

interface ClientOptions {
  useServiceRole?: boolean
  customHeaders?: Record<string, string>
}

export function createSupabaseClient(req: Request, options: ClientOptions = {}): SupabaseClient {
  const { useServiceRole = false, customHeaders = {} } = options

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL')
  }

  const supabaseKey = useServiceRole
    ? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    : Deno.env.get('SUPABASE_ANON_KEY')

  if (!supabaseKey) {
    throw new Error(
      useServiceRole
        ? 'Missing SUPABASE_SERVICE_ROLE_KEY'
        : 'Missing SUPABASE_ANON_KEY'
    )
  }

  // Get auth header from request
  const authHeader = req.headers.get('Authorization')

  // Create client with proper configuration
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        ...customHeaders,
        ...(!useServiceRole && authHeader ? { Authorization: authHeader } : {})
      }
    }
  })
}

export async function getUserFromRequest(req: Request): Promise<{
  user: User | null
  error: Error | null
}> {
  try {
    const client = createSupabaseClient(req)
    const {
      data: { user },
      error
    } = await client.auth.getUser()

    if (error) {
      return { user: null, error }
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error: error as Error }
  }
}

export function requireAuth(req: Request): Promise<Response | null> {
  const authHeader = req.headers.get('Authorization')
  
  if (!authHeader) {
    return Promise.resolve(
      new Response(
        JSON.stringify({
          error: 'Missing Authorization header'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    )
  }

  return Promise.resolve(null)
}
