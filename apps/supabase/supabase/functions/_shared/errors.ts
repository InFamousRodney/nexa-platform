/**
 * Custom error classes for the NEXA platform
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(400, 'VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(401, 'AUTHENTICATION_ERROR', message, details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(403, 'AUTHORIZATION_ERROR', message, details);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(404, 'NOT_FOUND', message, details);
    this.name = 'NotFoundError';
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(500, 'INTERNAL_SERVER_ERROR', message, details);
    this.name = 'InternalServerError';
  }
}

/**
 * Helper function to create a standardized error response
 */
export function createErrorResponse(error: Error): Response {
  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      }),
      {
        status: error.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Handle unexpected errors
  const isDevelopment = Deno.env.get('DENO_ENV') === 'development';
  return new Response(
    JSON.stringify({
      error: {
        code: 'UNEXPECTED_ERROR',
        message: 'An unexpected error occurred',
        details: isDevelopment ? error.message : undefined
      }
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  );
} 