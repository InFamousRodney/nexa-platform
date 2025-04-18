import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Settings } from './Settings';
import { vi } from 'vitest';

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockToast = vi.fn();
const mockNavigate = vi.fn();
const mockInvalidateQueries = vi.fn();

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: mockInvalidateQueries,
    }),
  };
});

const renderSettingsPage = (initialRoute: string) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="*" element={<Settings />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Settings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows success toast and invalidates org list query on success callback params', async () => {
    const route = '/settings?status=success&tab=connections&org_id=test-org-id';
    renderSettingsPage(route);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: expect.any(String),
        description: expect.stringContaining('test-org-id'),
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['organizations'] });
      expect(mockNavigate).toHaveBeenCalledWith('/settings', { replace: true });
    });
  });

  it('shows error toast on error callback params', async () => {
    const route = '/settings?status=error&error=Auth%20Failed&tab=connections';
    renderSettingsPage(route);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: expect.any(String),
        description: expect.stringContaining('Auth Failed'),
        variant: 'destructive',
      });
      expect(mockInvalidateQueries).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/settings', { replace: true });
    });
  });

  it('does not show toast or invalidate queries without callback params', () => {
    const route = '/settings';
    renderSettingsPage(route);

    expect(mockToast).not.toHaveBeenCalled();
    expect(mockInvalidateQueries).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
