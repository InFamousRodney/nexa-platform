/**
 * API response types for the NEXA platform
 */

/**
 * Response type for Salesforce connections
 * Contains only the fields needed by the frontend
 */
export interface SalesforceConnectionResponse {
  id: string;
  sf_org_id: string;
  friendly_name?: string;
  instance_url: string;
  status: 'active' | 'inactive' | 'needs_reauth';
} 