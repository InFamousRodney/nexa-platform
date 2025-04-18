import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { CallbackHandler } from './CallbackHandler';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { checkCallbackStatus } from '../lib/api/salesforce';
import { render } from '../test/test-utils';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  MemoryRouter: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
  QueryClient: vi.fn().mockImplementation(() => ({
    invalidateQueries: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('../lib/api/salesforce', () => ({
  checkCallbackStatus: vi.fn(),
}));

describe('CallbackHandler', () => {
  const mockNavigate = vi.fn();
  const mockInvalidateQueries = vi.fn();
  const mockQueryClient = {
    invalidateQueries: mockInvalidateQueries,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
  });

  it('should show success message and redirect on success', async () => {
    vi.mocked(checkCallbackStatus).mockReturnValue('success');

    const { getByText } = render(<CallbackHandler />);

    // Check for success message
    expect(getByText('Connection Successful!')).toBeInTheDocument();
    expect(getByText('Your Salesforce organization has been connected successfully.')).toBeInTheDocument();

    // Wait for redirect
    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['salesforce-connections'] });
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
    }, { timeout: 3000 });
  });

  it('should show error message and redirect on error', async () => {
    vi.mocked(checkCallbackStatus).mockReturnValue('error');

    const { getByText } = render(<CallbackHandler />);

    // Check for error message
    expect(getByText('Connection Failed')).toBeInTheDocument();
    expect(getByText('There was an error connecting your Salesforce organization.')).toBeInTheDocument();

    // Wait for redirect
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/settings?error=auth_failed');
    }, { timeout: 3000 });
  });

  it('should redirect to settings when no status is present', async () => {
    vi.mocked(checkCallbackStatus).mockReturnValue(null);

    render(<CallbackHandler />);

    // Wait for redirect
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
    }, { timeout: 3000 });
  });
}); 