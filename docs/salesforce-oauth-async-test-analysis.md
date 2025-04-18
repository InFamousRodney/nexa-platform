# Salesforce OAuth Async Test Analysis

## Current Test Status

### Passing Tests
1. ✅ `renders correctly`
   - Synchronous test
   - Simple button presence check
   - No async operations

2. ✅ `shows loading state while connecting`
   - First async test
   - Uses `isPending` state
   - Button disabled state works
   - Loading spinner appears

### Failing Tests
All remaining async tests fail with the same error:

```typescript
TypeError: Expected container to be an Element, a Document or a DocumentFragment but got undefined.
```

#### Failed Test Cases:
1. `redirects to Salesforce on successful connection`
2. `shows server error toast for invalid response`
3. `shows authentication error toast for Supabase errors`
4. `shows connection error toast for unexpected errors`

## Error Analysis

### Error Stack Trace Pattern
```typescript
❯ checkContainerType node_modules/@testing-library+dom/dist/helpers.js:61:11
❯ waitFor node_modules/@testing-library+dom/dist/wait-for.js:36:10
```

### Key Observations
1. Error occurs specifically in `waitFor` calls
2. Container becomes undefined during async operations
3. Error happens after React Query mutations complete
4. Only affects tests that need to wait for state updates

## Current Implementation

### Test Setup
```typescript
function renderWithClient(queryClient: QueryClient, ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
      <Toaster />
    </QueryClientProvider>
  );
}
```

### Async Test Pattern
```typescript
await waitFor(() => {
  expect(mockToast).toHaveBeenCalledWith(/*...*/);
  expect(button).not.toBeDisabled();
});
```

## Potential Issues

1. **React Query Cleanup**
   - QueryClient might be cleaning up too early
   - Mutation cache could be cleared before assertions

2. **Component Unmounting**
   - Component might unmount during async operations
   - React Testing Library cleanup timing issues

3. **Test Environment**
   - Possible race condition between:
     - React Query state updates
     - Component re-renders
     - Testing Library cleanup

## Questions for Review

1. **Container Lifecycle**
   - Why does the container become undefined?
   - Is it related to React Query's cache management?

2. **Async Timing**
   - Why do sync tests and the loading test pass?
   - What's different about the mutation completion tests?

3. **State Management**
   - Is React Query properly maintaining state during tests?
   - Are we properly waiting for all state updates?

## Next Steps to Investigate

1. **Query Client Configuration**
   ```typescript
   const queryClient = new QueryClient({
     defaultOptions: {
       queries: { retry: false, gcTime: Infinity },
       mutations: { retry: false }
     }
   });
   ```
   - Are these settings appropriate for testing?
   - Should we adjust garbage collection timing?

2. **Test Cleanup**
   ```typescript
   beforeEach(() => {
     queryClient = new QueryClient();
     // Should we add cleanup logic here?
   });
   ```

3. **Async Utilities**
   - Consider alternative approaches to `waitFor`
   - Investigate React Query's test utilities
   - Review Testing Library's async utilities
