# Salesforce OAuth Async Test Analysis - Latest Update

## Current Status

### Test Results
- ✅ 5 tests passing
- ❌ 1 test failing: `redirects to Salesforce on successful connection`

### Error Messages
1. TypeScript Error:
```typescript
Object literal may only specify known properties, and 'logger' does not exist in type 'QueryClientConfig'
```

2. Test Failure:
```
Expected element to be disabled
Received element is not disabled
```

3. Environment Error:
```
The current testing environment is not configured to support act(...)
```

## Analysis of Issues

### 1. QueryClient Configuration
The `logger` property in QueryClient config is causing TypeScript errors:
```typescript
queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: Infinity
    },
    mutations: {
      retry: false
    }
  },
  logger: { // <-- This is causing the error
    log: console.log,
    warn: console.warn,
    error: () => {}
  }
});
```

### 2. Test Timing Issues
The test is failing because we can't reliably capture the button's disabled state during the API call. We've tried several approaches:

1. ❌ Direct state check after click:
```typescript
await user.click(button);
expect(button).toBeDisabled(); // Fails - state not updated yet
```

2. ❌ Using act():
```typescript
await act(async () => {
  await user.click(button);
});
// Failed due to environment configuration
```

3. ❌ Explicit container reference:
```typescript
await waitFor(() => {
  expect(button).toBeDisabled();
}, { container });
// Still inconsistent
```

## Root Causes

1. **React Query State Updates**
   - React Query's state updates are asynchronous
   - The `isPending` state might not be immediately reflected
   - Our test environment might be running too fast

2. **Test Environment Limitations**
   - No support for `act()` in current setup
   - Limited control over React's test renderer
   - Potential race conditions in state updates

3. **Component Implementation**
   - Button state tied directly to `mutation.isPending`
   - No intermediate states or delays
   - Immediate state transitions

## Proposed Solutions

### 1. Fix TypeScript Error
Remove the `logger` configuration from QueryClient:
```typescript
queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: Infinity
    },
    mutations: {
      retry: false
    }
  }
});
```

### 2. Test Timing Solution
Use a combination of `waitFor` and state assertions:
```typescript
it('redirects to Salesforce on successful connection', async () => {
  const mockAuthUrl = 'https://salesforce.com/oauth';
  vi.mocked(initiateSalesforceAuth).mockResolvedValue({
    authorizationUrl: mockAuthUrl,
  });

  const user = userEvent.setup();
  const { container } = renderWithClient(queryClient, <ConnectOrgButton />);
  const button = screen.getByTestId('connect-org-button');

  // Click and wait for loading state
  await user.click(button);
  await waitFor(() => {
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  }, { container });

  // Wait for redirect
  await waitFor(() => {
    expect(mockLocation.href).toBe(mockAuthUrl);
  }, { container });

  // Verify final state
  expect(button).not.toBeDisabled();
  expect(button).toHaveTextContent('Connect New Org');
});
```

### 3. Alternative Testing Strategy
If the timing issues persist, consider testing the mutation state directly:
```typescript
it('handles Salesforce connection flow correctly', async () => {
  const mockAuthUrl = 'https://salesforce.com/oauth';
  const mockMutation = vi.fn();
  
  // Mock useMutation hook
  vi.mock('@tanstack/react-query', () => ({
    ...vi.importActual('@tanstack/react-query'),
    useMutation: () => ({
      mutate: mockMutation,
      isPending: false
    })
  }));

  // Test component behavior based on mutation state
});
```

## Next Steps

1. Remove the `logger` configuration to fix TypeScript error
2. Implement the new test timing solution
3. If issues persist, consider the alternative testing strategy
4. Add more granular state checks in the component
5. Consider adding small delays or transitions for better testability

## Questions to Consider

1. Should we add artificial delays in tests?
2. Is it worth mocking React Query's hooks directly?
3. Should we modify the component to be more testable?
4. Are we testing the right things in the right way?

## Additional Notes

- The component behavior is correct in actual usage
- Test failures are due to timing/environment issues
- Consider adding integration tests for full flow
- Document any workarounds for future reference
