import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConnectOrgButton } from '../ConnectOrgButton';
import { initiateSalesforceAuth } from '@/lib/api/salesforce';
import type { SFAuthError, SFAuthInitiateResponse } from '@/lib/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Mock the salesforce API module
vi.mock('@/lib/api/salesforce', () => ({
  initiateSalesforceAuth: vi.fn(),
}));

// Mock the toast hook
const mockToast = vi.fn();
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

function renderWithClient(queryClient: QueryClient, ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
      <Toaster />
    </QueryClientProvider>
  );
}

describe('ConnectOrgButton', () => {
  let queryClient: QueryClient;
  const mockLocation = { href: '' };

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    mockLocation.href = '';

    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    // Mock window.location
    Object.defineProperty(window, 'location', { value: mockLocation, writable: true });
  });

  it('renders correctly', () => {
    renderWithClient(queryClient, <ConnectOrgButton />);
    const button = screen.getByTestId('connect-org-button');
    expect(button).toHaveTextContent('Connect New Org');
    expect(button).not.toHaveAttribute('disabled');
  });

  it('shows loading state and button disabled correctly', async () => {
    // Create a Promise that never resolves to keep the loading state active
    const pendingPromise = new Promise<SFAuthInitiateResponse>(() => {});
    vi.mocked(initiateSalesforceAuth).mockReturnValue(pendingPromise);

    const user = userEvent.setup();
    renderWithClient(queryClient, <ConnectOrgButton />);
    
    // Get the button and click it
    const button = screen.getByTestId('connect-org-button');
    await user.click(button);

    // Wait for loading state to appear
    const spinner = await screen.findByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('disabled');
  });

  it('redirects to Salesforce on successful connection', async () => {
    const mockAuthUrl = 'https://mock.salesforce.com/oauth';
    const mockResponse: SFAuthInitiateResponse = {
      authorizationUrl: mockAuthUrl,
    };

    // Create a Promise that resolves after a delay to ensure loading state is visible
    const delayedPromise = new Promise<SFAuthInitiateResponse>((resolve) => {
      setTimeout(() => resolve(mockResponse), 100);
    });
    vi.mocked(initiateSalesforceAuth).mockReturnValue(delayedPromise);

    const user = userEvent.setup();
    renderWithClient(queryClient, <ConnectOrgButton />);
    const button = screen.getByTestId('connect-org-button');

    // Click the button
    await user.click(button);

    // Wait for loading state
    const spinner = await screen.findByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Wait for redirect
    await screen.findByText('Connect New Org');
    expect(mockLocation.href).toBe(mockAuthUrl);
    expect(button).not.toBeDisabled();
  });

  it('shows server error toast for invalid response', async () => {
    const error: SFAuthError = {
      errorCode: 'INVALID_RESPONSE',
      errorMessage: 'Authorization URL not received from server',
    };

    // Create a Promise that rejects after a delay
    const delayedPromise = new Promise<SFAuthInitiateResponse>((_, reject) => {
      setTimeout(() => reject(error), 100);
    });
    vi.mocked(initiateSalesforceAuth).mockReturnValue(delayedPromise);

    const user = userEvent.setup();
    renderWithClient(queryClient, <ConnectOrgButton />);
    const button = screen.getByTestId('connect-org-button');

    // Click the button
    await user.click(button);

    // Wait for loading state
    const spinner = await screen.findByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Wait for error state
    await screen.findByText('Connect New Org');
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Server Error',
      description: 'The server response was invalid. Please try again later.',
      variant: 'destructive',
    }));
    expect(button).not.toBeDisabled();
  });

  it('shows authentication error toast for Supabase errors', async () => {
    const error: SFAuthError = {
      errorCode: 'SUPABASE_ERROR',
      errorMessage: 'Invalid client configuration',
    };

    // Create a Promise that rejects after a delay
    const delayedPromise = new Promise<SFAuthInitiateResponse>((_, reject) => {
      setTimeout(() => reject(error), 100);
    });
    vi.mocked(initiateSalesforceAuth).mockReturnValue(delayedPromise);

    const user = userEvent.setup();
    renderWithClient(queryClient, <ConnectOrgButton />);
    const button = screen.getByTestId('connect-org-button');

    // Click the button
    await user.click(button);

    // Wait for loading state
    const spinner = await screen.findByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Wait for error state
    await screen.findByText('Connect New Org');
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Authentication Error',
      description: error.errorMessage,
      variant: 'destructive',
    }));
    expect(button).not.toBeDisabled();
  });

  it('shows connection error toast for unexpected errors', async () => {
    const error: SFAuthError = {
      errorCode: 'UNEXPECTED_ERROR',
      errorMessage: 'Network error occurred',
    };

    // Create a Promise that rejects after a delay
    const delayedPromise = new Promise<SFAuthInitiateResponse>((_, reject) => {
      setTimeout(() => reject(error), 100);
    });
    vi.mocked(initiateSalesforceAuth).mockReturnValue(delayedPromise);

    const user = userEvent.setup();
    renderWithClient(queryClient, <ConnectOrgButton />);
    const button = screen.getByTestId('connect-org-button');

    // Click the button
    await user.click(button);

    // Wait for loading state
    const spinner = await screen.findByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Wait for error state
    await screen.findByText('Connect New Org');
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Connection Error',
      description: error.errorMessage,
      variant: 'destructive',
    }));
    expect(button).not.toBeDisabled();
  });
});
