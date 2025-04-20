# Supabase Edge Functions Testing Guide

## Overview
This guide covers how to write and run unit tests for your Supabase Edge Functions using Deno's built-in testing framework.

## Basic Test Setup

### Test File Structure
Create a test file alongside your function:

```plaintext
functions/
  ├── your-function/
  │   ├── index.ts
  │   └── index.test.ts
  └── another-function/
      ├── index.ts
      └── index.test.ts
```

### Basic Test Example
```typescript
// index.test.ts
import { assertEquals } from 'https://deno.land/std@0.208.0/testing/asserts.ts'
import { handler } from './index.ts'

Deno.test('handler returns 200', async () => {
  const req = new Request('http://localhost')
  const res = await handler(req)
  assertEquals(res.status, 200)
})
```

## Testing Best Practices

### 1. Mock External Dependencies
Create mock objects for external services:

```typescript
// test-utils.ts
export const mockSupabaseClient = {
  from: (table: string) => ({
    select: () => ({
      data: [{ id: 1, name: 'Test' }],
      error: null
    })
  }),
  auth: {
    getUser: () => ({
      data: { user: { id: 'test-user' } },
      error: null
    })
  }
}

// index.test.ts
import { mockSupabaseClient } from './test-utils.ts'

Deno.test('database query succeeds', async () => {
  const req = new Request('http://localhost')
  const res = await handler(req, mockSupabaseClient)
  assertEquals(res.status, 200)
})
```

### 2. Environment Variables
Handle environment variables in tests:

```typescript
// test-setup.ts
export function setupTestEnv() {
  const env = {
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-key',
    API_KEY: 'test-api-key'
  }

  // Save original env
  const originalEnv = { ...Deno.env.toObject() }

  // Set test env
  Object.entries(env).forEach(([key, value]) => {
    Deno.env.set(key, value)
  })

  return () => {
    // Cleanup function
    Deno.env.set(originalEnv)
  }
}

// index.test.ts
import { setupTestEnv } from './test-setup.ts'

Deno.test('handler uses env vars', async () => {
  const cleanup = setupTestEnv()
  try {
    const req = new Request('http://localhost')
    const res = await handler(req)
    assertEquals(res.status, 200)
  } finally {
    cleanup()
  }
})
```

### 3. Request Helpers
Create helpers for common request patterns:

```typescript
// test-utils.ts
export function createTestRequest(options: {
  method?: string
  headers?: Record<string, string>
  body?: unknown
} = {}) {
  const {
    method = 'GET',
    headers = {},
    body
  } = options

  return new Request('http://localhost', {
    method,
    headers: new Headers(headers),
    body: body ? JSON.stringify(body) : null
  })
}

// index.test.ts
Deno.test('POST request with body', async () => {
  const req = createTestRequest({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { name: 'Test' }
  })
  const res = await handler(req)
  assertEquals(res.status, 200)
})
```

### 4. Response Assertions
Create custom assertions for responses:

```typescript
// test-utils.ts
export async function assertResponse(
  res: Response,
  options: {
    status?: number
    body?: unknown
    headers?: Record<string, string>
  }
) {
  const { status = 200, body, headers = {} } = options

  assertEquals(res.status, status)
  
  if (body) {
    const json = await res.json()
    assertEquals(json, body)
  }

  Object.entries(headers).forEach(([key, value]) => {
    assertEquals(res.headers.get(key), value)
  })
}

// index.test.ts
Deno.test('response format', async () => {
  const req = createTestRequest()
  const res = await handler(req)
  
  await assertResponse(res, {
    status: 200,
    body: { message: 'Success' },
    headers: {
      'Content-Type': 'application/json'
    }
  })
})
```

## Testing Authentication

### Mock Auth Context
```typescript
// test-utils.ts
export function createAuthRequest(token: string) {
  return createTestRequest({
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const mockAuthContext = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'authenticated'
  }
}

// index.test.ts
Deno.test('authenticated request', async () => {
  const req = createAuthRequest('test-token')
  const res = await handler(req)
  assertEquals(res.status, 200)
})
```

## Integration Testing

### Setup Test Database
```typescript
// test-setup.ts
export async function setupTestDb() {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Create test data
  await supabase
    .from('test_table')
    .insert([
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' }
    ])

  return async () => {
    // Cleanup
    await supabase
      .from('test_table')
      .delete()
      .match({ id: 'in', values: [1, 2] })
  }
}
```

### Running Tests
```bash
# Run all tests
deno test --allow-env --allow-net

# Run specific test file
deno test --allow-env --allow-net path/to/test.ts

# Run tests with watch mode
deno test --allow-env --allow-net --watch
```

## Test Coverage

### Setup Coverage
```bash
# Run tests with coverage
deno test --coverage=coverage

# Generate coverage report
deno coverage coverage
```

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: denoland/setup-deno@v1
      - name: Run tests
        run: deno test --allow-env --allow-net
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

## Tips and Tricks

1. **Isolate Tests**
   - Use unique test data
   - Clean up after each test
   - Don't rely on test order

2. **Mock Time-based Operations**
   ```typescript
   const now = new Date('2025-01-01')
   const realDate = Date
   Date = class extends realDate {
     constructor() {
       super()
       return now
     }
   } as DateConstructor
   ```

3. **Debug Tests**
   ```typescript
   // Add --inspect-brk flag for debugging
   deno test --inspect-brk path/to/test.ts
   ```

4. **Performance Testing**
   ```typescript
   Deno.test('performance', async () => {
     const start = performance.now()
     await handler(req)
     const end = performance.now()
     assert(end - start < 100) // Should complete within 100ms
   })
   ```
