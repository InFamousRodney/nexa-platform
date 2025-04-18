# Settings Page Implementation

## Overview
The Settings page has been enhanced to handle Salesforce OAuth callback parameters and provide user feedback through toast notifications. This implementation ensures users receive appropriate feedback after connecting or attempting to connect their Salesforce organization.

## Implementation Details

### URL Parameter Handling
The Settings component now handles the following URL parameters:
- `status`: Indicates the result of the OAuth flow ("success" or "error")
- `error`: Contains error message when status is "error"
- `org_id`: Contains the Salesforce organization ID on successful connection
- `tab`: Determines which tab should be active

### Key Features

#### 1. Toast Notifications
- **Success Case:**
  ```typescript
  toast({
    title: "Connection Successful",
    description: `Successfully connected Salesforce organization: ${orgId}`,
  });
  ```
- **Error Case:**
  ```typescript
  toast({
    title: "Connection Failed",
    description: error,
    variant: "destructive",
  });
  ```

#### 2. Query Invalidation
On successful connection, the organizations query is invalidated to refresh the data:
```typescript
queryClient.invalidateQueries({ queryKey: ["organizations"] });
```

#### 3. URL Parameter Cleanup
Parameters are cleared after processing to maintain a clean URL:
```typescript
navigate("/settings", { replace: true });
```

## Testing Implementation

### Test Setup
The test suite uses Vitest and React Testing Library. Key mocks include:

```typescript
// Toast Mock
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Navigation Mock
vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Query Client Mock
vi.mock('@tanstack/react-query', async () => ({
  ...await vi.importActual('@tanstack/react-query'),
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

// Browser API Mock
const mockMatchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));
```

### Test Cases

1. **Successful Connection**
   ```typescript
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
   ```

2. **Failed Connection**
   ```typescript
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
   ```

3. **No Callback Parameters**
   ```typescript
   it('does not show toast or invalidate queries without callback params', () => {
     const route = '/settings';
     renderSettingsPage(route);

     expect(mockToast).not.toHaveBeenCalled();
     expect(mockInvalidateQueries).not.toHaveBeenCalled();
     expect(mockNavigate).not.toHaveBeenCalled();
   });
   ```

## Test Coverage
The tests verify:
- Toast notifications are shown with correct content
- Query invalidation occurs only on successful connection
- URL parameters are cleared after processing
- No side effects occur without callback parameters

## Dependencies
- @tanstack/react-query
- react-router-dom
- @testing-library/react
- vitest
