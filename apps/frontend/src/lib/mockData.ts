/**
 * Mock data types and functions for frontend development
 */

export interface MockSalesforceConnection {
  id: string;
  sf_org_id: string;
  friendly_name?: string;
  instance_url: string;
  status: 'active' | 'inactive' | 'needs_reauth';
}

export const demoOrgs: MockSalesforceConnection[] = [
  {
    id: "c2e83f4a-6f4d-4a5b-9d8c-e2a34b56c78e",
    sf_org_id: "00D6g000004HIcuEAG",
    friendly_name: "Production",
    instance_url: "https://nexa-demo.my.salesforce.com",
    status: "active"
  },
  {
    id: "98a2f6c5-3e7b-42d1-b09a-f7e5d4c8b31a",
    sf_org_id: "00D6g000008HJdvEAG",
    friendly_name: "Developer Sandbox",
    instance_url: "https://nexa-dev-sandbox.cs68.my.salesforce.com",
    status: "active"
  },
  {
    id: "45b19d8e-7a2c-46f3-8e5b-9c1a2d3f4e5b",
    sf_org_id: "00D6g000012HIduEAG",
    instance_url: "https://nexa-integration.cs123.my.salesforce.com",
    status: "needs_reauth"
  }
];

/**
 * Simulates an API call to fetch Salesforce connections
 * @returns Promise that resolves to an array of MockSalesforceConnection objects
 */
export async function fetchMockSalesforceConnections(): Promise<MockSalesforceConnection[]> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(demoOrgs);
    }, 500);
  });
} 