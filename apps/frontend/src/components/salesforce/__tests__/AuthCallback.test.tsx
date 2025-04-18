import { render, screen, waitFor } from '@testing-library/react';
import { AuthCallback } from '../AuthCallback';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { MESSAGES } from '../types';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the hooks
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('AuthCallback', () => {
  const mockNavigate = vi.fn();
  const mockToast = vi.fn();
  const mockSetSearchParams = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useToast as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ toast: mockToast });
  });

  describe('Initial Render', () => {
    it('shows loading state with correct ARIA attributes on mount', () => {
      (useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
        new URLSearchParams({}),
        mockSetSearchParams,
      ]);

      render(<AuthCallback />);

      // Assert initial loading state
      const container = screen.getByRole('alert');
      expect(container).toHaveAttribute('aria-busy', 'true');
      expect(container).toHaveAttribute('aria-live', 'polite');
      
      // Assert loading content
      expect(screen.getByText(MESSAGES.LOADING_TITLE)).toBeInTheDocument();
      expect(screen.getByText(MESSAGES.LOADING_DESCRIPTION)).toBeInTheDocument();
      expect(screen.getByLabelText(MESSAGES.LOADING_DESCRIPTION)).toBeInTheDocument();
      
      // Assert loading spinner
      expect(screen.getByTestId('loading-spinner')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Parameter Validation', () => {
    it('handles invalid status parameter', async () => {
      const searchParams = new URLSearchParams({ status: 'invalid' });
      (useSearchParams as unknown as ReturnType<typeof vi.fn>)
        .mockReturnValue([searchParams, mockSetSearchParams]);

      render(<AuthCallback />);

      // Only wait for and verify side effects
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: MESSAGES.ERROR_TITLE,
          description: 'Invalid status parameter',
          variant: 'destructive',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/settings?tab=connections');
      });
    });

    it('truncates long error messages', async () => {
      const longError = 'a'.repeat(150);
      const searchParams = new URLSearchParams({
        status: 'error',
        error: longError,
      });
      (useSearchParams as unknown as ReturnType<typeof vi.fn>)
        .mockReturnValue([searchParams, mockSetSearchParams]);

      render(<AuthCallback />);

      // Only verify the toast message truncation
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: MESSAGES.ERROR_TITLE,
          description: 'a'.repeat(100),
          variant: 'destructive',
        });
      });
    });
  });

  describe('Success Flow', () => {
    it('handles successful connection with org_id', async () => {
      const searchParams = new URLSearchParams({
        status: 'success',
        org_id: 'test-org-id',
      });
      (useSearchParams as unknown as ReturnType<typeof vi.fn>)
        .mockReturnValue([searchParams, mockSetSearchParams]);

      render(<AuthCallback />);

      // Only wait for and verify side effects
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: MESSAGES.SUCCESS_TITLE,
          description: MESSAGES.SUCCESS_DESCRIPTION,
        });
        expect(mockNavigate).toHaveBeenCalledWith('/settings?tab=connections');
      });
    });
  });

  describe('Error Flow', () => {
    it('handles connection error with message', async () => {
      const searchParams = new URLSearchParams({
        status: 'error',
        error: 'Authentication failed',
      });
      (useSearchParams as unknown as ReturnType<typeof vi.fn>)
        .mockReturnValue([searchParams, mockSetSearchParams]);

      render(<AuthCallback />);

      // Only wait for and verify side effects
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: MESSAGES.ERROR_TITLE,
          description: 'Authentication failed',
          variant: 'destructive',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/settings?tab=connections');
      });
    });
  });

  describe('Error Boundary', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('catches runtime errors and shows fallback UI', async () => {
      (useSearchParams as unknown as ReturnType<typeof vi.fn>)
        .mockImplementation(() => {
          throw new Error('Test error');
        });

      render(<AuthCallback />);

      // Only wait for and verify error handling side effects
      await waitFor(() => {
        expect(screen.getByText('Error Processing Callback')).toBeInTheDocument();
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Unexpected Error',
          description: 'An error occurred while processing the callback. Please try again.',
          variant: 'destructive',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/settings?tab=connections');
      });
    });
  });
});
