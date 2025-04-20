# Supabase Edge Functions Authentication Guide

## Overview
Edge Functions work seamlessly with Supabase Auth. This guide explains how to handle authentication and access user context in your Edge Functions.

## Setting Up Auth Context

### Basic Setup
Initialize the Supabase client with auth context from the request:

```typescript
import { createClient } from '@supabase/supabase-js'

Deno.serve(async (req: Request) => {
  // Initialize the Supabase client
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  // Get the session or user object
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabaseClient.auth.getUser(token)

  if (error) throw error

  return new Response(JSON.stringify({ user }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
```

### With Database Queries
After setting the auth context, database queries will respect Row Level Security (RLS):

```typescript
Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  // Set auth context
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')
  const { data: userData } = await supabaseClient.auth.getUser(token)

  // Query with RLS applied
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')

  return new Response(JSON.stringify({ data }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
```

## Best Practices

### 1. Error Handling
Always handle authentication errors gracefully:

```typescript
try {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'No authorization header' }),
      { status: 401 }
    )
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabaseClient.auth.getUser(token)

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid token' }),
      { status: 401 }
    )
  }
} catch (error) {
  return new Response(
    JSON.stringify({ error: 'Server error' }),
    { status: 500 }
  )
}
```

### 2. Type Safety
Use TypeScript types for better type safety:

```typescript
import { User, SupabaseClient } from '@supabase/supabase-js'

interface AuthenticatedRequest extends Request {
  user: User
}

async function requireAuth(
  req: Request,
  supabaseClient: SupabaseClient
): Promise<AuthenticatedRequest> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    throw new Error('No authorization header')
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabaseClient.auth.getUser(token)

  if (error || !user) {
    throw new Error('Invalid token')
  }

  return Object.assign(req, { user })
}
```

### 3. Middleware Pattern
Create reusable authentication middleware:

```typescript
async function authMiddleware(
  req: Request,
  supabaseClient: SupabaseClient
): Promise<Response | null> {
  try {
    await requireAuth(req, supabaseClient)
    return null // Continue to handler
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Usage in handler
Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  // Check auth first
  const authError = await authMiddleware(req, supabaseClient)
  if (authError) return authError

  // Continue with authenticated request...
})
```

## Security Considerations

1. **Token Validation**
   - Always validate tokens server-side
   - Check token expiration
   - Verify token signature

2. **Error Messages**
   - Don't expose sensitive information in errors
   - Use generic error messages for auth failures
   - Log detailed errors server-side only

3. **Headers**
   - Use HTTPS only
   - Set appropriate security headers
   - Validate origin for CORS requests

4. **Row Level Security**
   - Implement RLS policies for all tables
   - Test RLS policies thoroughly
   - Use least privilege principle

## Testing

### Mock Authentication
Example of testing with mock auth:

```typescript
// test.ts
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com'
}

const mockSupabaseClient = {
  auth: {
    getUser: async () => ({
      data: { user: mockUser },
      error: null
    })
  }
}

// Test your function with mock client
const response = await yourFunction(mockRequest, mockSupabaseClient)
assertEquals(response.status, 200)
```

### Integration Testing
Test with real tokens:

```typescript
// Get test token
const { data: { session }, error } = await supabase.auth.signIn({
  email: 'test@example.com',
  password: 'test-password'
})

// Use token in test
const response = await fetch('http://localhost:54321/functions/v1/your-function', {
  headers: {
    Authorization: `Bearer ${session?.access_token}`
  }
})
```
