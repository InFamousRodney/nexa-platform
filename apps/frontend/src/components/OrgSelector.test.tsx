import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/react';
import { OrgSelector } from './OrgSelector';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '../stores/useAppStore';
import { initiateSalesforceAuth, fetchSalesforceConnections } from '../lib/api/salesforce';
import { render } from '../test/test-utils';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  QueryClient: vi.fn().mockImplementation(() => ({
    invalidateQueries: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('../stores/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

vi.mock('../lib/api/salesforce', () => ({
  initiateSalesforceAuth: vi.fn(),
  fetchSalesforceConnections: vi.fn().mockReturnValue([
    { id: '1', name: 'Org 1' },
    { id: '2', name: 'Org 2' },
  ]),
}));

// Mock Radix UI components
vi.mock('@radix-ui/react-dropdown-menu', () => {
  const Root = ({ children }: { children: React.ReactNode }) => children;
  const Trigger = ({ children }: { children: React.ReactNode }) => children;
  const Content = ({ children }: { children: React.ReactNode }) => children;
  const Item = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <div onClick={onClick}>{children}</div>
  );
  
  return {
    Root,
    Trigger,
    Content,
    Item,
    Group: Root,
    Portal: Root,
    Sub: Root,
    SubTrigger: Trigger,
    SubContent: Content,
    RadioGroup: Root,
    RadioItem: Item,
    CheckboxItem: Item,
    Label: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Separator: () => <div />,
  };
});

describe('OrgSelector', () => {
  const mockConnections = [
    { id: '1', name: 'Org 1' },
    { id: '2', name: 'Org 2' },
  ];

  const mockSetSelectedOrgId = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppStore).mockReturnValue({
      selectedOrgId: null,
      setSelectedOrgId: mockSetSelectedOrgId,
    });
    vi.mocked(useQuery).mockReturnValue({
      data: mockConnections,
      isLoading: false,
      error: null,
    });
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('should render loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const { getByText } = render(<OrgSelector />);
    expect(getByText('Loading organizations...')).toBeDefined();
  });

  it('should render error state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Test error'),
    });

    const { getByText } = render(<OrgSelector />);
    expect(getByText('Error loading organizations: Test error')).toBeDefined();
  });

  it('should render organizations list', () => {
    const { getByText } = render(<OrgSelector />);
    expect(getByText('Selected Organization')).toBeDefined();
    expect(getByText('No organization selected')).toBeDefined();
    expect(getByText('Connect New Org')).toBeDefined();
    expect(getByText('Select Organization')).toBeDefined();
  });

  it('should handle organization selection', () => {
    const { getByText } = render(<OrgSelector />);
    
    // Click on an organization
    fireEvent.click(getByText('Org 1'));
    
    expect(mockSetSelectedOrgId).toHaveBeenCalledWith('1');
  });

  it('should handle Connect New Org button click', async () => {
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    const { getByText } = render(<OrgSelector />);
    
    fireEvent.click(getByText('Connect New Org'));
    
    expect(mockMutate).toHaveBeenCalled();
  });

  it('should show loading state during OAuth initiation', () => {
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    });

    const { getByText } = render(<OrgSelector />);
    expect(getByText('Connecting...')).toBeDefined();
  });
}); 