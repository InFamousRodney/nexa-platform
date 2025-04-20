# Supabase Edge Functions Troubleshooting Guide

## Common Issues and Solutions

### 1. Function Not Found

#### Symptoms
- 404 Not Found errors
- "Function not found" messages
- Unable to access function URL

#### Solutions
1. **Check Function Name**
   ```bash
   # List all functions
   supabase functions list
   ```

2. **Verify Deployment**
   ```bash
   # Deploy function again
   supabase functions deploy your-function
   ```

3. **Check URL Format**
   - Correct: `https://<project>.functions.supabase.co/your-function`
   - Incorrect: `https://<project>.functions.supabase.co/functions/your-function`

### 2. Import Errors

#### Symptoms
- "Cannot find module" errors
- Import resolution failures
- TypeScript type errors

#### Solutions
1. **Check Import Map**
   ```json
   {
     "imports": {
       "@supabase/supabase-js": "https://esm.sh/@supabase/supabase-js@2.38.4",
       "std/": "https://deno.land/std@0.208.0/"
     }
   }
   ```

2. **Use Correct Import Syntax**
   ```typescript
   // Correct
   import { createClient } from '@supabase/supabase-js'
   
   // Also correct for Edge Functions
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
   ```

3. **Update Dependencies**
   - Use specific versions
   - Check compatibility
   - Update import map

### 3. Authentication Issues

#### Symptoms
- 401 Unauthorized errors
- JWT validation failures
- "Missing Authorization header"

#### Solutions
1. **Check JWT Configuration**
   ```typescript
   // Verify JWT in request
   const authHeader = req.headers.get('Authorization')
   if (!authHeader) {
     return new Response('No auth header', { status: 401 })
   }
   ```

2. **Debug JWT Token**
   ```typescript
   // Log token details (development only)
   console.log('Auth header:', authHeader)
   console.log('Token:', authHeader.replace('Bearer ', ''))
   ```

3. **Test Locally**
   ```bash
   # Disable JWT verification for local testing
   supabase functions serve --no-verify-jwt
   ```

### 4. Environment Variables

#### Symptoms
- "Environment variable not found"
- Undefined configuration values
- Function fails in production

#### Solutions
1. **Check Local Environment**
   ```bash
   # Serve with env file
   supabase functions serve --env-file .env
   ```

2. **Verify Production Settings**
   ```bash
   # List secrets
   supabase secrets list

   # Set missing secrets
   supabase secrets set MY_SECRET=value
   ```

3. **Debug Environment**
   ```typescript
   // Log available variables
   console.log('Environment:', {
     SUPABASE_URL: Deno.env.get('SUPABASE_URL'),
     // Don't log sensitive values in production
     HAS_SECRET: !!Deno.env.get('MY_SECRET')
   })
   ```

### 5. Performance Issues

#### Symptoms
- Slow response times
- Timeouts
- High memory usage

#### Solutions
1. **Enable Debug Logging**
   ```typescript
   console.time('operation')
   // Your code here
   console.timeEnd('operation')
   ```

2. **Optimize Database Queries**
   ```typescript
   // Use select() to limit returned fields
   const { data } = await supabase
     .from('table')
     .select('id, name')  // Only needed fields
     .limit(10)           // Limit results
   ```

3. **Check Cold Starts**
   - Use global variables carefully
   - Initialize expensive operations once
   - Consider caching strategies

### 6. CORS Issues

#### Symptoms
- Browser CORS errors
- Options requests failing
- Cross-origin requests blocked

#### Solutions
1. **Configure CORS Headers**
   ```typescript
   const corsHeaders = {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Methods': 'POST, OPTIONS',
     'Access-Control-Allow-Headers': '*'
   }

   // Handle OPTIONS
   if (req.method === 'OPTIONS') {
     return new Response('ok', { headers: corsHeaders })
   }
   ```

2. **Test CORS Configuration**
   ```bash
   # Test OPTIONS request
   curl -X OPTIONS -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     https://your-function-url
   ```

### 7. Deployment Issues

#### Symptoms
- Failed deployments
- Function not updating
- Version mismatches

#### Solutions
1. **Check Deployment Logs**
   ```bash
   supabase functions deploy your-function --debug
   ```

2. **Verify Project Configuration**
   ```bash
   # Link to correct project
   supabase link --project-ref your-project-ref
   ```

3. **Clean and Redeploy**
   ```bash
   # Remove function
   supabase functions delete your-function

   # Redeploy
   supabase functions deploy your-function
   ```

## Debug Tools and Techniques

### 1. Local Development
```bash
# Serve with debug output
supabase functions serve --debug

# Watch for changes
supabase functions serve --watch

# Disable JWT verification
supabase functions serve --no-verify-jwt
```

### 2. Logging
```typescript
// Structured logging
console.log('Debug:', {
  event: 'request_received',
  method: req.method,
  path: req.url,
  headers: Object.fromEntries(req.headers)
})

// Performance logging
const start = performance.now()
try {
  // Your code
} finally {
  console.log(`Duration: ${performance.now() - start}ms`)
}
```

### 3. Error Handling
```typescript
try {
  // Your code
} catch (error) {
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    cause: error.cause
  })
  
  return new Response(
    JSON.stringify({ error: 'Internal server error' }),
    { status: 500 }
  )
}
```

## Best Practices for Prevention

1. **Version Control**
   - Use specific dependency versions
   - Document required environment variables
   - Include example configurations

2. **Testing**
   - Write unit tests
   - Test locally before deployment
   - Use staging environment

3. **Monitoring**
   - Implement proper logging
   - Monitor function performance
   - Set up alerts for failures

4. **Documentation**
   - Document function requirements
   - Keep troubleshooting guides updated
   - Include example requests/responses
