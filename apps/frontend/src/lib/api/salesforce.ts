import { supabaseClient } from '../supabaseClient';
import { SalesforceConnection } from '../types';
import { getUrlParam } from '../utils';

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

export async function initiateSalesforceAuth(): Promise<{ authorizationUrl: string }> {
  const { data, error } = await supabaseClient.functions.invoke('sfdc-auth-initiate');

  if (error) {
    throw new Error(`Failed to initiate Salesforce authentication: ${error.message}`);
  }

  return data;
}

export type CallbackStatus = 'success' | 'error' | null;

export function checkCallbackStatus(): CallbackStatus {
  const status = getUrlParam('connect');
  
  if (status === 'success' || status === 'error') {
    return status;
  }
  
  return null;
} 