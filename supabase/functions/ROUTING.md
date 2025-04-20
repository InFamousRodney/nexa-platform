# Supabase Edge Functions Routing Guide

## Overview
Learn how to implement routing in your Supabase Edge Functions to handle different HTTP methods and paths.

## Basic Routing

### Simple Router
```typescript
// index.ts
Deno.serve(async (req) => {
  const { pathname } = new URL(req.url)
  
  // Basic routing based on path
  switch (pathname) {
    case '/':
      return new Response('Home')
    case '/about':
      return new Response('About')
    default:
      return new Response('Not Found', { status: 404 })
  }
})
```

### Method-based Routing
```typescript
// index.ts
Deno.serve(async (req) => {
  const { pathname } = new URL(req.url)
  
  // Route based on HTTP method and path
  switch (`${req.method} ${pathname}`) {
    case 'GET /users':
      return handleGetUsers(req)
    case 'POST /users':
      return handleCreateUser(req)
    case 'PUT /users':
      return handleUpdateUser(req)
    default:
      return new Response('Not Found', { status: 404 })
  }
})
```

## Advanced Routing

### Router Class Implementation
```typescript
// router.ts
type Handler = (req: Request) => Promise<Response>
type Route = {
  pattern: URLPattern
  handler: Handler
}

export class Router {
  private routes: Map<string, Route[]> = new Map()

  add(method: string, pattern: string, handler: Handler) {
    const routes = this.routes.get(method) || []
    routes.push({
      pattern: new URLPattern({ pathname: pattern }),
      handler
    })
    this.routes.set(method, routes)
  }

  async handle(req: Request): Promise<Response> {
    const method = req.method
    const url = new URL(req.url)
    
    const routes = this.routes.get(method) || []
    
    for (const route of routes) {
      const match = route.pattern.exec(url)
      if (match) {
        return route.handler(req)
      }
    }
    
    return new Response('Not Found', { status: 404 })
  }
}
```

### Using the Router
```typescript
// index.ts
import { Router } from './router.ts'

const router = new Router()

// Define routes
router.add('GET', '/users', handleGetUsers)
router.add('POST', '/users', handleCreateUser)
router.add('GET', '/users/:id', handleGetUser)

// Serve with router
Deno.serve((req) => router.handle(req))
```

## Path Parameters

### Using URL Patterns
```typescript
// index.ts
const userPattern = new URLPattern({ pathname: '/users/:id' })

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const match = userPattern.exec(url)
  
  if (match) {
    const userId = match.pathname.groups.id
    return new Response(`User ID: ${userId}`)
  }
  
  return new Response('Not Found', { status: 404 })
})
```

### Dynamic Routes
```typescript
// router.ts
type RouteParams = Record<string, string>

class Router {
  add(method: string, pattern: string, handler: (req: Request, params: RouteParams) => Promise<Response>) {
    // Implementation
  }
  
  async handle(req: Request): Promise<Response> {
    const match = this.findMatch(req)
    if (match) {
      const { handler, params } = match
      return handler(req, params)
    }
    return new Response('Not Found', { status: 404 })
  }
}

// Usage
router.add('GET', '/users/:id/posts/:postId', async (req, params) => {
  const { id, postId } = params
  return new Response(`User ${id}, Post ${postId}`)
})
```

## Query Parameters

### Handling Query Parameters
```typescript
// utils.ts
export function getQueryParams(url: URL): Record<string, string> {
  const params: Record<string, string> = {}
  url.searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

// Usage
Deno.serve(async (req) => {
  const url = new URL(req.url)
  const params = getQueryParams(url)
  
  // Access query parameters
  const { page, limit } = params
  return new Response(`Page: ${page}, Limit: ${limit}`)
})
```

## Middleware Support

### Middleware Implementation
```typescript
// middleware.ts
type Middleware = (
  req: Request,
  next: () => Promise<Response>
) => Promise<Response>

class Router {
  private middleware: Middleware[] = []

  use(middleware: Middleware) {
    this.middleware.push(middleware)
  }

  async handle(req: Request): Promise<Response> {
    let index = 0
    
    const next = async (): Promise<Response> => {
      if (index < this.middleware.length) {
        const middleware = this.middleware[index++]
        return middleware(req, next)
      }
      return this.processRoute(req)
    }
    
    return next()
  }
}
```

### Using Middleware
```typescript
// Example middleware
const loggerMiddleware: Middleware = async (req, next) => {
  console.log(`${req.method} ${req.url}`)
  const start = Date.now()
  const response = await next()
  const duration = Date.now() - start
  console.log(`Completed in ${duration}ms`)
  return response
}

const authMiddleware: Middleware = async (req, next) => {
  const token = req.headers.get('Authorization')
  if (!token) {
    return new Response('Unauthorized', { status: 401 })
  }
  return next()
}

// Apply middleware
router.use(loggerMiddleware)
router.use(authMiddleware)
```

## Error Handling

### Global Error Handler
```typescript
// error-handler.ts
class Router {
  private errorHandler: (error: Error) => Promise<Response> = async (error) => {
    console.error(error)
    return new Response('Internal Server Error', { status: 500 })
  }

  setErrorHandler(handler: (error: Error) => Promise<Response>) {
    this.errorHandler = handler
  }

  async handle(req: Request): Promise<Response> {
    try {
      return await this.processRoute(req)
    } catch (error) {
      return this.errorHandler(error)
    }
  }
}

// Usage
router.setErrorHandler(async (error) => {
  if (error instanceof ValidationError) {
    return new Response(error.message, { status: 400 })
  }
  return new Response('Server Error', { status: 500 })
})
```

## Best Practices

1. **Route Organization**
   - Group related routes
   - Use consistent naming conventions
   - Separate route logic from handlers

2. **Type Safety**
   ```typescript
   // Define route parameters type
   type UserRouteParams = {
     id: string
     action?: string
   }

   // Type-safe handler
   async function handleUser(
     req: Request,
     params: UserRouteParams
   ): Promise<Response> {
     // Implementation
   }
   ```

3. **Response Helpers**
   ```typescript
   // response-helpers.ts
   export function json(data: unknown, status = 200): Response {
     return new Response(JSON.stringify(data), {
       status,
       headers: {
         'Content-Type': 'application/json'
       }
     })
   }

   export function text(content: string, status = 200): Response {
     return new Response(content, { status })
   }
   ```

4. **CORS Handling**
   ```typescript
   const corsMiddleware: Middleware = async (req, next) => {
     if (req.method === 'OPTIONS') {
       return new Response(null, {
         headers: {
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
           'Access-Control-Allow-Headers': '*'
         }
       })
     }
     const response = await next()
     response.headers.set('Access-Control-Allow-Origin', '*')
     return response
   }
   ```

5. **Route Documentation**
   ```typescript
   interface RouteDefinition {
     path: string
     method: string
     description: string
     params?: Record<string, string>
     responses: Record<number, string>
   }

   const routes: RouteDefinition[] = [
     {
       path: '/users/:id',
       method: 'GET',
       description: 'Get user by ID',
       params: {
         id: 'User ID'
       },
       responses: {
         200: 'User found',
         404: 'User not found'
       }
     }
   ]
   ```
