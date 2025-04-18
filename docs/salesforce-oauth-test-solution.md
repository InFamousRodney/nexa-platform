# Salesforce OAuth Test Solution (Milestone 2.3.1)

## Problem Overview

The goal was to implement the `ConnectOrgButton` component using React Query's `useMutation` hook to initiate the Salesforce OAuth flow. The component needed to handle three states:
1. Initial state (button enabled)
2. Loading state (button disabled, spinner visible)
3. Final state (success redirect or error toast)

Key testing challenges:
- Difficulty reliably detecting the loading state (`isPending`) in success/error scenarios
- Loading spinner not being found due to rapid state transitions
- Inconsistent button disabled state assertions
- Initial async test failures due to improper state handling

## Solution Implementation

### 1. Loading State Test

We created a dedicated test for the loading state using a never-resolving Promise. This approach ensures the component remains in the loading state indefinitely, making it perfect for testing spinner visibility and button disabled state:

```typescript
it('shows loading state and button disabled correctly', async () => {
  // Create a Promise that never resolves to keep loading state active
  const pendingPromise = new Promise<SFAuthInitiateResponse>(() => {});
  vi.mocked(initiateSalesforceAuth).mockReturnValue(pendingPromise);

  const user = userEvent.setup();
  renderWithClient(queryClient, <ConnectOrgButton />);
  
  const button = screen.getByTestId('connect-org-button');
  await user.click(button);

  // Use findByTestId to wait for loading state
  const spinner = await screen.findByTestId('loading-spinner');
  expect(spinner).toBeInTheDocument();
  expect(screen.getByText('Connecting...')).toBeInTheDocument();
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute('disabled');
});
```

### 2. Success/Error Test Cases

For success and error cases, we introduced artificial delays in the mock implementations to ensure the loading state is observable during testing. This was necessary because React Query's state transitions happen too quickly to test reliably otherwise:

```typescript
it('redirects to Salesforce on successful connection', async () => {
  const mockResponse: SFAuthInitiateResponse = {
    authorizationUrl: 'https://mock.salesforce.com/oauth',
  };

  // Add 100ms delay to ensure loading state is testable
  const delayedPromise = new Promise<SFAuthInitiateResponse>((resolve) => {
    setTimeout(() => resolve(mockResponse), 100);
  });
  vi.mocked(initiateSalesforceAuth).mockReturnValue(delayedPromise);

  // Test implementation...
  await user.click(button);
  
  // Test all states in sequence
  const spinner = await screen.findByTestId('loading-spinner');
  expect(spinner).toBeInTheDocument();
  
  await screen.findByText('Connect New Org');
  expect(mockLocation.href).toBe(mockResponse.authorizationUrl);
});
```

### 3. Async Assertion Improvements

We replaced potentially unreliable `waitFor` checks with more deterministic `findBy*` methods:

```typescript
// Before (less reliable)
await waitFor(() => {
  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
});

// After (more reliable)
const spinner = await screen.findByTestId('loading-spinner');
expect(spinner).toBeInTheDocument();
```

This change makes the tests more reliable by:
- Explicitly waiting for elements to appear
- Providing better error messages on failure
- Reducing test flakiness

### 4. TypeScript Integration

Added proper typing for all Promises and responses to catch type-related issues early:

```typescript
import type { SFAuthError, SFAuthInitiateResponse } from '@/lib/types';

// Properly typed promises
const pendingPromise = new Promise<SFAuthInitiateResponse>(() => {});
const delayedPromise = new Promise<SFAuthInitiateResponse>((resolve) => {
  setTimeout(() => resolve(mockResponse), 100);
});
```

## Key Insights

1. **React Query State Management**
   - State updates are asynchronous and can transition quickly
   - Testing intermediate states requires careful timing control
   - Using never-resolving promises is effective for testing loading states

2. **Async Testing Strategies**
   - Prefer `findBy*` over `waitFor` for more reliable tests
   - Test each state transition explicitly
   - Use artificial delays judiciously when testing intermediate states

3. **Type Safety Benefits**
   - Proper typing catches integration issues early
   - Makes test maintenance easier
   - Improves code documentation

## Results

All tests now pass successfully with reliable state transition testing:
```bash
✓ src/components/salesforce/__tests__/ConnectOrgButton.test.tsx (6 tests) 521ms
```

## Future Improvements

1. **Test Coverage**
   - Add network timeout simulation tests
   - Test rapid button click handling
   - Add concurrent request tests
   - Test error recovery scenarios

2. **Performance Optimization**
   - Investigate alternatives to `setTimeout` for more reliable timing
   - Add response time threshold tests
   - Monitor memory usage during state transitions

3. **Error Handling**
   - Expand error case coverage
   - Add validation for error message formatting
   - Test error state recovery flows

4. **Refactoring Opportunities**
   - Consider extracting common test setup
   - Create reusable test utilities for async state testing
   - Implement custom test matchers for common assertions
