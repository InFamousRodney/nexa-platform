import { supabaseClient } from '../supabaseClient';
import { SalesforceConnection } from '../types';

export async function fetchSalesforceConnections(): Promise<SalesforceConnection[]> {
  const { data, error } = await supabaseClient
    .from('connections')
    .select('*');

  if (error) {
    throw new Error(`Failed to fetch Salesforce connections: ${error.message}`);
  }

  return data || [];
}

export async function createSalesforceConnection(connection: Omit<SalesforceConnection, 'id'>): Promise<SalesforceConnection> {
  const { data, error } = await supabaseClient
    .from('connections')
    .insert(connection)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create Salesforce connection: ${error.message}`);
  }

  return data;
}

export async function updateSalesforceConnection(id: string, updates: Partial<SalesforceConnection>): Promise<SalesforceConnection> {
  const { data, error } = await supabaseClient
    .from('connections')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update Salesforce connection: ${error.message}`);
  }

  return data;
}

export async function deleteSalesforceConnection(id: string): Promise<void> {
  const { error } = await supabaseClient
    .from('connections')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete Salesforce connection: ${error.message}`);
  }
} 