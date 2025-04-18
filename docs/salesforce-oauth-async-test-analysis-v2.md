# Salesforce OAuth Async Test Analysis - Update

## Test Results After Changes

### Working Tests
1. ✅ `renders correctly` (23ms)
2. ✅ `shows loading state while connecting` (60ms)

### Still Failing Tests
All with same error: `TypeError: Expected container to be an Element, a Document or a DocumentFragment but got undefined`

1. `redirects to Salesforce on successful connection` (14ms)
2. `shows server error toast for invalid response` (10ms)
3. `shows authentication error toast for Supabase errors` (9ms)
4. `shows connection error toast for unexpected errors` (13ms)

## Analysis of Changes Made

### What We Changed
1. Added explicit timeouts to `waitFor` calls
2. Moved button state checks outside `waitFor` blocks
3. Added proper `await` statements
4. Added better test documentation
5. Improved error state handling

### Why Some Tests Work

The working tests succeed because:
1. The synchronous test doesn't need async handling
2. The loading state test works because it checks state immediately after click, before any promise resolution

### Why Others Still Fail

The failing tests share these characteristics:
1. They all involve waiting for a Promise to resolve/reject
2. They use `waitFor` to check post-resolution state
3. The error occurs at the exact same point: inside `waitFor`'s `checkContainerType`

## Key Observations

1. **Timing Pattern**
   ```typescript
   // This works (immediate check)
   await user.click(button);
   expect(button).toBeDisabled();
   
   // This fails (delayed check)
   await user.click(button);
   await waitFor(() => {
     expect(mockToast).toHaveBeenCalled();
   });
   ```

2. **Component Mounting**
   - The component seems to unmount before `waitFor` completes
   - This suggests React Query might be triggering a cleanup

3. **React Query Setup**
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
   - Current setup might not be preserving state long enough

## Potential Solutions to Investigate

1. **Test Environment Cleanup**
   ```typescript
   afterEach(() => {
     queryClient.clear();
   });
   ```
   - Add explicit cleanup to prevent state interference

2. **Container Reference**
   ```typescript
   const { container } = render(...);
   await waitFor(() => {...}, { container });
   ```
   - Pass container reference explicitly to `waitFor`

3. **Mutation Options**
   ```typescript
   const mutation = useMutation({
     mutationFn: initiateSalesforceAuth,
     gcTime: 0
   });
   ```
   - Adjust garbage collection settings

4. **Alternative Testing Approach**
   ```typescript
   // Instead of waitFor
   await act(async () => {
     await user.click(button);
     // Wait for mutation to complete
   });
   expect(mockToast).toHaveBeenCalled();
   ```
   - Use `act` for better control over React's test rendering

## Next Steps

1. Try passing explicit container to `waitFor`
2. If that fails, implement explicit cleanup in `afterEach`
3. Consider switching to `act` for async operations
4. Review React Query's documentation on testing mutations

## Questions for Review

1. Is the component unmounting prematurely?
2. Should we be using a different approach for testing mutations?
3. Are we handling the test cleanup correctly?
