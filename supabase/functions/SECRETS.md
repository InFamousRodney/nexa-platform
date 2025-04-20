# Supabase Edge Functions Secrets Guide

## Overview
Edge Functions often require access to sensitive information like API keys and access tokens. Here's how to securely manage secrets in your Supabase Edge Functions.

## Local Development

### Using .env Files
For local development, create a `.env` file in your `supabase/functions` directory:

```bash
# .env
MY_SECRET_KEY=secret-value
MY_API_KEY=api-key-value
```

### Running Functions Locally
Use the `--env-file` flag to load environment variables:

```bash
supabase functions serve --env-file .env
```

## Production Deployment

### Setting Secrets via CLI
Use the Supabase CLI to set secrets:

```bash
# Set a single secret
supabase secrets set MY_SECRET_KEY=secret-value

# Set multiple secrets
supabase secrets set --env-file .env

# List all secrets
supabase secrets list
```

### Setting Secrets via Dashboard
1. Go to your project's Dashboard
2. Navigate to Settings > API
3. Find the "Environment Variables" section
4. Add your secrets

## Accessing Secrets in Code

### Using Deno.env
Access secrets in your Edge Functions:

```typescript
const mySecret = Deno.env.get('MY_SECRET_KEY')
if (!mySecret) throw new Error('MY_SECRET_KEY is not set')
```

### Best Practices for Secret Management

1. **Never Commit Secrets**
   - Add `.env` to your `.gitignore`
   - Never hardcode secrets in your code
   - Use environment variables for all sensitive data

2. **Secret Naming Conventions**
   - Use UPPER_SNAKE_CASE for secret names
   - Add descriptive prefixes (e.g., `STRIPE_`, `GITHUB_`)
   - Be consistent across your project

3. **Validation**
   ```typescript
   // Example of secret validation
   const requiredSecrets = [
     'API_KEY',
     'DATABASE_URL',
     'JWT_SECRET'
   ]

   for (const secret of requiredSecrets) {
     if (!Deno.env.get(secret)) {
       throw new Error(`Missing required secret: ${secret}`)
     }
   }
   ```

4. **Type Safety**
   ```typescript
   // Define environment variable interface
   interface Env {
     API_KEY: string
     DATABASE_URL: string
     JWT_SECRET: string
   }

   // Get typed environment variables
   function getEnvVars(): Env {
     const env = {
       API_KEY: Deno.env.get('API_KEY'),
       DATABASE_URL: Deno.env.get('DATABASE_URL'),
       JWT_SECRET: Deno.env.get('JWT_SECRET')
     }

     // Validate all values exist
     for (const [key, value] of Object.entries(env)) {
       if (!value) throw new Error(`Missing ${key}`)
     }

     return env as Env
   }
   ```

## Security Considerations

1. **Secret Rotation**
   - Regularly rotate secrets
   - Use different secrets for development and production
   - Implement secret versioning when possible

2. **Access Control**
   - Limit access to secret management
   - Use role-based access control
   - Audit secret access regularly

3. **Secret Values**
   - Use strong, random values
   - Avoid patterns that could reveal information
   - Use appropriate length and complexity

4. **Error Handling**
   ```typescript
   try {
     const secret = Deno.env.get('MY_SECRET')
     if (!secret) throw new Error('Secret not found')
     // Use secret
   } catch (error) {
     // Log error without exposing secret
     console.error('Error accessing secret:', error.message)
     throw new Error('Internal server error')
   }
   ```

## Local Development Tips

1. **Template .env File**
   - Create a `.env.example` file with dummy values
   - Document all required environment variables
   - Include in version control

2. **Development Overrides**
   - Use `.env.local` for local-only overrides
   - Keep different environments separate
   - Document override patterns

3. **Secret Validation**
   - Validate secrets on startup
   - Provide clear error messages
   - Include secret requirements in documentation
