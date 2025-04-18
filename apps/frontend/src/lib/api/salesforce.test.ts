import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabaseClient } from '../supabaseClient';
import { initiateSalesforceAuth, checkCallbackStatus } from './salesforce';
import { getUrlParam } from '../utils';

// Mock dependencies
vi.mock('../supabaseClient', () => ({
  supabaseClient: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

vi.mock('../utils', () => ({
  getUrlParam: vi.fn(),
}));

describe('Salesforce API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initiateSalesforceAuth', () => {
    it('should return authorization URL on success', async () => {
      const mockData = { authorizationUrl: 'https://salesforce.com/auth' };
      vi.mocked(supabaseClient.functions.invoke).mockResolvedValueOnce({ data: mockData, error: null });

      const result = await initiateSalesforceAuth();
      expect(result).toEqual(mockData);
      expect(supabaseClient.functions.invoke).toHaveBeenCalledWith('sfdc-auth-initiate');
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('API Error');
      vi.mocked(supabaseClient.functions.invoke).mockResolvedValueOnce({ data: null, error: mockError });

      await expect(initiateSalesforceAuth()).rejects.toThrow('Failed to initiate Salesforce authentication: API Error');
    });
  });

  describe('checkCallbackStatus', () => {
    it('should return success when connect=success is in URL', () => {
      vi.mocked(getUrlParam).mockReturnValueOnce('success');

      const result = checkCallbackStatus();
      expect(result).toBe('success');
    });

    it('should return error when connect=error is in URL', () => {
      vi.mocked(getUrlParam).mockReturnValueOnce('error');

      const result = checkCallbackStatus();
      expect(result).toBe('error');
    });

    it('should return null when no connect parameter is present', () => {
      vi.mocked(getUrlParam).mockReturnValueOnce(null);

      const result = checkCallbackStatus();
      expect(result).toBeNull();
    });
  });
}); 