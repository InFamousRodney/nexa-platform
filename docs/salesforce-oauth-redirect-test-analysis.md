# Salesforce OAuth Redirect Test Analysis

## Current Test Status

### Fixed Issues
- ✅ Container reference issues resolved by passing explicit container to `waitFor`
- ✅ All error state tests now pass
- ✅ Loading state test passes
- ✅ Initial render test passes

### Remaining Issue
One test still fails: `redirects to Salesforce on successful connection`

```typescript
Error: expect(element).toBeDisabled()

Received element is not disabled:
  <button
    class="inline-flex items-center justify-center text-sm font-medium..."
    data-testid="connect-org-button"
  />
```

## Test Implementation

```typescript
it('redirects to Salesforce on successful connection', async () => {
  const mockAuthUrl = 'https://salesforce.com/oauth';
  vi.mocked(initiateSalesforceAuth).mockResolvedValue({
    authorizationUrl: mockAuthUrl,
  });

  const user = userEvent.setup();
  const { container } = renderWithClient(queryClient, <ConnectOrgButton />);
  
  const button = screen.getByTestId('connect-org-button');
  await user.click(button);

  await waitFor(() => {
    expect(mockLocation.href).toBe(mockAuthUrl);
  }, { container });

  expect(button).toBeDisabled();
});
```

## Component Implementation

```typescript
const mutation = useMutation({
  mutationFn: initiateSalesforceAuth,
  onSuccess: (data) => {
    window.location.href = data.authorizationUrl;
  },
});

return (
  <Button
    onClick={() => mutation.mutate()}
    disabled={mutation.isPending}
    // ...
  >
    {mutation.isPending ? "Connecting..." : "Connect New Org"}
  </Button>
);
```

## Analysis

1. **Timing Issue**
   - The test expects the button to be disabled during redirect
   - But the mutation might complete before we check the button state
   - React Query's `isPending` state might be cleared too quickly

2. **State Management**
   - `isPending` is `true` during the API call
   - Once the API call succeeds, `isPending` becomes `false`
   - The redirect happens in `onSuccess`, after `isPending` is already `false`

3. **Test Expectations vs Reality**
   - Test assumes button stays disabled during redirect
   - Component only disables button during API call
   - This might be a misalignment in requirements

## Potential Solutions

1. **Update Test Expectations**
   ```typescript
   // Check button is enabled after successful mutation
   await waitFor(() => {
     expect(mockLocation.href).toBe(mockAuthUrl);
     expect(button).not.toBeDisabled();
   });
   ```

2. **Modify Component Behavior**
   ```typescript
   const [isRedirecting, setIsRedirecting] = useState(false);
   
   const mutation = useMutation({
     mutationFn: initiateSalesforceAuth,
     onSuccess: (data) => {
       setIsRedirecting(true);
       window.location.href = data.authorizationUrl;
     },
   });

   return (
     <Button
       disabled={mutation.isPending || isRedirecting}
       // ...
     >
   );
   ```

3. **Adjust Test Timing**
   ```typescript
   // Check state during mutation
   await waitFor(() => {
     expect(button).toBeDisabled();
   });
   
   // Then check redirect
   await waitFor(() => {
     expect(mockLocation.href).toBe(mockAuthUrl);
   });
   ```

## Questions for Review

1. **Component Behavior**
   - Should the button be disabled during redirect?
   - Is this a UX requirement or just a test assumption?

2. **Test Strategy**
   - Are we testing the right thing at the right time?
   - Should we split the assertions into separate stages?

3. **State Management**
   - Do we need additional state for the redirect phase?
   - Is React Query's `isPending` state sufficient?

## Recommendation

Based on UX best practices, we should:
1. Keep the button enabled after successful API call
2. Update the test to verify this behavior
3. Add visual feedback for the redirect if needed (e.g., toast message)

This aligns with common patterns where:
- Button is disabled only during API calls
- Success feedback is shown via toast/alert
- Page transitions happen with enabled UI
