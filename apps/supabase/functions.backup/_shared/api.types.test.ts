import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { SalesforceConnectionResponse } from "./api.types.ts";

Deno.test("SalesforceConnectionResponse type validation", () => {
  // Valid response object
  const validResponse: SalesforceConnectionResponse = {
    id: "123",
    sf_org_id: "00D123456789",
    friendly_name: "Test Org",
    instance_url: "https://test.salesforce.com",
    status: "active"
  };

  // Should not throw type errors
  assertEquals(typeof validResponse.id, "string");
  assertEquals(typeof validResponse.sf_org_id, "string");
  assertEquals(typeof validResponse.instance_url, "string");
  assertEquals(typeof validResponse.status, "string");
  
  // Optional field
  assertEquals(typeof validResponse.friendly_name, "string");

  // Status should be one of the allowed values
  const validStatuses = ["active", "inactive", "needs_reauth"];
  assertEquals(validStatuses.includes(validResponse.status), true);
}); 