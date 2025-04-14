import { ValidationError } from "./errors.ts";
import { SalesforceConnectionResponse } from "./api.types.ts";

/**
 * Validates a Salesforce connection response object
 * @throws {ValidationError} if validation fails
 */
export function validateSalesforceConnectionResponse(data: unknown): asserts data is SalesforceConnectionResponse {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Invalid response data', { data });
  }

  const response = data as Record<string, unknown>;

  // Validate required fields
  if (typeof response.id !== 'string' || !response.id) {
    throw new ValidationError('Invalid or missing id', { id: response.id });
  }

  if (typeof response.sf_org_id !== 'string' || !response.sf_org_id) {
    throw new ValidationError('Invalid or missing sf_org_id', { sf_org_id: response.sf_org_id });
  }

  if (typeof response.instance_url !== 'string' || !response.instance_url) {
    throw new ValidationError('Invalid or missing instance_url', { instance_url: response.instance_url });
  }

  // Validate instance_url format
  try {
    new URL(response.instance_url);
  } catch {
    throw new ValidationError('Invalid instance_url format', { instance_url: response.instance_url });
  }

  // Validate status
  if (
    typeof response.status !== 'string' ||
    !['active', 'inactive', 'needs_reauth'].includes(response.status)
  ) {
    throw new ValidationError('Invalid status', { status: response.status });
  }

  // Validate optional friendly_name if present
  if (
    response.friendly_name !== undefined &&
    (typeof response.friendly_name !== 'string' || !response.friendly_name)
  ) {
    throw new ValidationError('Invalid friendly_name', { friendly_name: response.friendly_name });
  }
}

/**
 * Helper function to validate an array of Salesforce connection responses
 * @throws {ValidationError} if validation fails
 */
export function validateSalesforceConnectionResponses(data: unknown): asserts data is SalesforceConnectionResponse[] {
  if (!Array.isArray(data)) {
    throw new ValidationError('Expected an array of connections', { data });
  }

  data.forEach((item, index) => {
    try {
      validateSalesforceConnectionResponse(item);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ValidationError(`Invalid connection at index ${index}`, {
          index,
          details: error.details
        });
      }
      throw error;
    }
  });
} 