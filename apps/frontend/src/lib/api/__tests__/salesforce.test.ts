import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initiateSalesforceAuth } from '../salesforce';
import { supabaseClient } from '../../supabaseClient';
import type { SFAuthError } from '../../types';

// Mock Supabase client
vi.mock('../../supabaseClient', () => ({
  supabaseClient: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('salesforce API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initiateSalesforceAuth', () => {
    it('calls Supabase function and returns authorization URL on success', async () => {
      const mockAuthUrl = 'https://salesforce.com/oauth';
      const mockData = { authorizationUrl: mockAuthUrl };
      const mockResponse = {
        data: mockData,
        error: null,
      } as const;
      vi.mocked(supabaseClient.functions.invoke).mockResolvedValue(mockResponse);

      const result = await initiateSalesforceAuth();

      expect(result).toEqual(mockData);
      expect(supabaseClient.functions.invoke).toHaveBeenCalledWith('sfdc-auth-initiate', {
        method: 'POST',
      });
    });

    it('throws SFAuthError with INVALID_RESPONSE when authorization URL is missing', async () => {
      const mockResponse = {
        data: {},
        error: null,
      } as const;
      vi.mocked(supabaseClient.functions.invoke).mockResolvedValue(mockResponse);

      await expect(initiateSalesforceAuth()).rejects.toEqual({
        errorCode: 'INVALID_RESPONSE',
        errorMessage: 'Authorization URL not received from server',
      } satisfies SFAuthError);
    });

    it('throws SFAuthError when Supabase returns an error', async () => {
      const mockResponse = {
        data: null,
        error: {
          name: 'AuthError',
          message: 'Invalid client configuration',
        },
      } as const;
      vi.mocked(supabaseClient.functions.invoke).mockResolvedValue(mockResponse);

      await expect(initiateSalesforceAuth()).rejects.toEqual({
        errorCode: 'AuthError',
        errorMessage: 'Invalid client configuration',
      } satisfies SFAuthError);
    });

    it('throws SFAuthError with SUPABASE_ERROR for unnamed errors', async () => {
      const mockResponse = {
        data: null,
        error: {
          message: 'Something went wrong',
        },
      } as const;
      vi.mocked(supabaseClient.functions.invoke).mockResolvedValue(mockResponse);

      await expect(initiateSalesforceAuth()).rejects.toEqual({
        errorCode: 'SUPABASE_ERROR',
        errorMessage: 'Something went wrong',
      } satisfies SFAuthError);
    });

    it('throws SFAuthError with UNEXPECTED_ERROR for network errors', async () => {
      const networkError = new Error('Network error');
      vi.mocked(supabaseClient.functions.invoke).mockRejectedValue(networkError);

      await expect(initiateSalesforceAuth()).rejects.toEqual({
        errorCode: 'UNEXPECTED_ERROR',
        errorMessage: 'Network error',
      } satisfies SFAuthError);
    });
  });
});
