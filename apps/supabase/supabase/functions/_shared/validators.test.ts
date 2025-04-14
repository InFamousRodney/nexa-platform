import { assertEquals, assertThrows } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { validateSalesforceConnectionResponse, validateSalesforceConnectionResponses } from "./validators.ts";
import { ValidationError } from "./errors.ts";

Deno.test("validateSalesforceConnectionResponse - valid data", () => {
  const validData = {
    id: "123",
    sf_org_id: "00D123456789",
    friendly_name: "Test Org",
    instance_url: "https://test.salesforce.com",
    status: "active"
  };

  // Should not throw
  validateSalesforceConnectionResponse(validData);
});

Deno.test("validateSalesforceConnectionResponse - invalid data", () => {
  // Test null data
  assertThrows(
    () => validateSalesforceConnectionResponse(null),
    ValidationError,
    "Invalid response data"
  );

  // Test missing required fields
  assertThrows(
    () => validateSalesforceConnectionResponse({}),
    ValidationError,
    "Invalid or missing id"
  );

  // Test invalid instance_url
  assertThrows(
    () => validateSalesforceConnectionResponse({
      id: "123",
      sf_org_id: "00D123456789",
      instance_url: "not-a-url",
      status: "active"
    }),
    ValidationError,
    "Invalid instance_url format"
  );

  // Test invalid status
  assertThrows(
    () => validateSalesforceConnectionResponse({
      id: "123",
      sf_org_id: "00D123456789",
      instance_url: "https://test.salesforce.com",
      status: "invalid"
    }),
    ValidationError,
    "Invalid status"
  );

  // Test invalid friendly_name
  assertThrows(
    () => validateSalesforceConnectionResponse({
      id: "123",
      sf_org_id: "00D123456789",
      instance_url: "https://test.salesforce.com",
      status: "active",
      friendly_name: ""
    }),
    ValidationError,
    "Invalid friendly_name"
  );
});

Deno.test("validateSalesforceConnectionResponses - valid data", () => {
  const validData = [
    {
      id: "123",
      sf_org_id: "00D123456789",
      instance_url: "https://test1.salesforce.com",
      status: "active"
    },
    {
      id: "456",
      sf_org_id: "00D987654321",
      friendly_name: "Test Org",
      instance_url: "https://test2.salesforce.com",
      status: "inactive"
    }
  ];

  // Should not throw
  validateSalesforceConnectionResponses(validData);
});

Deno.test("validateSalesforceConnectionResponses - invalid data", () => {
  // Test non-array data
  assertThrows(
    () => validateSalesforceConnectionResponses({}),
    ValidationError,
    "Expected an array of connections"
  );

  // Test array with invalid item
  assertThrows(
    () => validateSalesforceConnectionResponses([
      {
        id: "123",
        sf_org_id: "00D123456789",
        instance_url: "https://test.salesforce.com",
        status: "active"
      },
      {
        id: "456",
        // Missing sf_org_id
        instance_url: "https://test2.salesforce.com",
        status: "active"
      }
    ]),
    ValidationError,
    "Invalid connection at index 1"
  );
}); 