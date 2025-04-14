import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import {
  ApiError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  InternalServerError,
  createErrorResponse
} from "./errors.ts";

Deno.test("Custom error classes", () => {
  // Test ApiError
  const apiError = new ApiError(400, "TEST_ERROR", "Test message", { field: "value" });
  assertEquals(apiError.status, 400);
  assertEquals(apiError.code, "TEST_ERROR");
  assertEquals(apiError.message, "Test message");
  assertEquals(apiError.details, { field: "value" });

  // Test ValidationError
  const validationError = new ValidationError("Invalid input");
  assertEquals(validationError.status, 400);
  assertEquals(validationError.code, "VALIDATION_ERROR");

  // Test AuthenticationError
  const authError = new AuthenticationError("Not authenticated");
  assertEquals(authError.status, 401);
  assertEquals(authError.code, "AUTHENTICATION_ERROR");

  // Test AuthorizationError
  const authzError = new AuthorizationError("Not authorized");
  assertEquals(authzError.status, 403);
  assertEquals(authzError.code, "AUTHORIZATION_ERROR");

  // Test NotFoundError
  const notFoundError = new NotFoundError("Resource not found");
  assertEquals(notFoundError.status, 404);
  assertEquals(notFoundError.code, "NOT_FOUND");

  // Test InternalServerError
  const serverError = new InternalServerError("Server error");
  assertEquals(serverError.status, 500);
  assertEquals(serverError.code, "INTERNAL_SERVER_ERROR");
});

Deno.test("Error response creation", async () => {
  // Test with ApiError
  const apiError = new ApiError(400, "TEST_ERROR", "Test message", { field: "value" });
  const apiResponse = createErrorResponse(apiError);
  assertEquals(apiResponse.status, 400);
  const apiBody = await apiResponse.json();
  assertEquals(apiBody.error.code, "TEST_ERROR");
  assertEquals(apiBody.error.message, "Test message");
  assertEquals(apiBody.error.details, { field: "value" });

  // Test with unexpected error
  const unexpectedError = new Error("Unexpected error");
  const unexpectedResponse = createErrorResponse(unexpectedError);
  assertEquals(unexpectedResponse.status, 500);
  const unexpectedBody = await unexpectedResponse.json();
  assertEquals(unexpectedBody.error.code, "UNEXPECTED_ERROR");
  assertEquals(unexpectedBody.error.message, "An unexpected error occurred");
}); 