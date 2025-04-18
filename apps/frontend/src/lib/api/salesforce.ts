import { supabaseClient } from '../supabaseClient';
import { SalesforceConnection, SFAuthInitiateResponse, SFAuthError } from '../types';
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

export async function initiateSalesforceAuth(): Promise<SFAuthInitiateResponse> {
  try {
    const { data, error } = await supabaseClient.functions.invoke('sfdc-auth-initiate', {
      method: 'POST',
    });

    if (error) {
      throw {
        errorCode: error.name || 'SUPABASE_ERROR',
        errorMessage: error.message || 'Failed to initiate Salesforce authorization',
      } satisfies SFAuthError;
    }

    if (!data?.authorizationUrl) {
      throw {
        errorCode: 'INVALID_RESPONSE',
        errorMessage: 'Authorization URL not received from server',
      } satisfies SFAuthError;
    }

    return data;
  } catch (error) {
    // If it's already an SFAuthError, rethrow it
    if (typeof error === 'object' && error !== null && 'errorCode' in error && 'errorMessage' in error) {
      throw error;
    }

    // Otherwise, wrap it in an SFAuthError
    throw {
      errorCode: 'UNEXPECTED_ERROR',
      errorMessage: error instanceof Error ? error.message : 'An unexpected error occurred',
    } satisfies SFAuthError;
  }
}

export type CallbackStatus = 'success' | 'error' | null;

export function checkCallbackStatus(): CallbackStatus {
  const status = getUrlParam('connect');
  
  if (status === 'success' || status === 'error') {
    return status;
  }
  
  return null;
}