# Salesforce OAuth Callback Implementation Plan

## Overview

Task 2.3.2 requires handling the redirect back from Salesforce after the OAuth flow. The backend (`sfdc-auth-callback` Edge Function) will redirect to our frontend with either a success or error status.

## Implementation Strategy

### 1. Route Configuration

```typescript
// Add to router configuration
{
  path: '/auth/callback/salesforce',
  element: <AuthCallback />
}
```

**Rationale:**
- Dedicated route for handling OAuth callbacks
- Keeps authentication logic isolated from main application flow
- Easy to maintain and test independently

### 2. AuthCallback Component

**Component Workload:**
- Primary responsibility is URL parameter parsing and navigation
- Loading state will be brief (typically < 500ms) as no async operations are performed
- Main complexity is in proper error handling and state transfer

**State Transfer Mechanism (Option A: URL Parameters)**
We'll use URL parameters for state transfer because:
- Simple and stateless
- Works with browser refresh/navigation
- No need for global state management
- Clear flow in browser history

```typescript
interface CallbackParams {
  status?: 'success' | 'error';
  error?: string; // Contains error code or short identifier (long messages truncated)
  org_id?: string; // Identifier of the connected Salesforce org
}

// Example success URL:
// /settings?status=success&org_id=00D...

// Example error URL:
// /settings?status=error&error=AUTH_FAILED
```

**Key Features:**
- Use React Router's `useSearchParams` for URL parameter handling
- Implement minimal loading state (progress indicator)
- Use toast notifications for user feedback
- Redirect to settings page with correct tab and parameters

### 3. Settings Page Enhancement

**URL Parameter Handling:**
```typescript
function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const status = searchParams.get('status');
    const orgId = searchParams.get('org_id');
    
    if (status === 'success') {
      // Clear URL parameters but maintain the current path
      navigate(location.pathname, { replace: true });
      
      // Invalidate and refetch org list
      queryClient.invalidateQueries(['salesforce', 'orgs']);
    }
  }, [searchParams]);
}
```

**Org List Refresh Mechanism:**
- Use React Query's `queryClient.invalidateQueries()` to trigger a refresh
- Query key structure: `['salesforce', 'orgs']`
- Invalidation occurs after successful connection detection
- Automatic background refresh without UI interruption

**Required Changes:**
1. Accept and process URL parameters for active tab
2. Handle connection success/error state
3. Implement org list refresh via React Query
4. Clear URL parameters after processing

## Error Handling Strategy

1. **Expected Errors:**
   - Authentication failures (`AUTH_FAILED`)
   - User cancellation (`USER_CANCELLED`)
   - Invalid state parameter (`INVALID_STATE`)
   - Timeout errors (`TIMEOUT`)

2. **Error Display:**
   - Use toast notifications for immediate feedback
   - Show error details in UI when appropriate
   - Clear error state on route change
   - Truncate long error messages in URL (max 100 chars)

## Testing Plan

### 1. Unit Tests: `AuthCallback.test.tsx`

```typescript
describe('AuthCallback', () => {
  it('redirects to settings with success toast on successful connection', async () => {
    // Mock URL params: ?status=success&org_id=123
    // Expect:
    // - Navigation to /settings
    // - Success toast shown
    // - Correct parameters in URL
  });

  it('redirects to settings with error toast on failed connection', async () => {
    // Mock URL params: ?status=error&error=AUTH_FAILED
    // Expect:
    // - Navigation to /settings
    // - Error toast shown
    // - Error preserved in URL
  });

  it('shows loading state while processing', () => {
    // Verify loading UI appears briefly
    // Ensure progress indicator is visible
  });

  it('handles missing status parameter gracefully', async () => {
    // Mock empty URL params
    // Expect default navigation
  });
});
```

### 2. Integration Tests: `Settings.test.tsx`

```typescript
describe('Settings with OAuth callback', () => {
  it('shows connections tab when redirected from successful auth', async () => {
    // Mock successful auth redirect
    // Verify:
    // - Connections tab is active
    // - URL params are cleared
    // - Query invalidation is triggered
  });

  it('refreshes org list after successful connection', async () => {
    // Mock successful connection
    // Verify:
    // - React Query invalidation called
    // - New org appears in list
    // - Loading states handled correctly
  });

  it('preserves error message when showing connections tab', async () => {
    // Mock error redirect
    // Verify error message display
  });
});
```

### 3. E2E Tests (Cypress)

```typescript
describe('Salesforce OAuth Flow', () => {
  it('completes full OAuth flow successfully', () => {
    // Test complete flow:
    // 1. Click connect button
    // 2. Mock Salesforce redirect
    // 3. Verify success handling
    // 4. Check org list update
  });

  it('handles authentication errors gracefully', () => {
    // Test error flow:
    // 1. Click connect button
    // 2. Mock Salesforce error
    // 3. Verify error handling
    // 4. Check error display
  });
});
```

## Implementation Steps

1. **Phase 1: Basic Route & Component**
   - Set up route configuration
   - Create AuthCallback component with loading state
   - Implement URL parameter handling

2. **Phase 2: Navigation & State**
   - Add toast notifications
   - Implement navigation logic with URL parameters
   - Set up Settings page parameter handling

3. **Phase 3: Error Handling**
   - Implement comprehensive error handling
   - Add error states to UI
   - Create error boundary
   - Add URL parameter cleaning

4. **Phase 4: Testing**
   - Write unit tests
   - Add integration tests
   - Create E2E test scenarios

## Success Criteria

1. **Functional Requirements:**
   - Successfully handles Salesforce callback
   - Shows appropriate loading states
   - Provides clear user feedback
   - Redirects to correct location
   - Properly refreshes org list

2. **Non-Functional Requirements:**
   - Completes navigation within 500ms
   - Error messages are clear and actionable
   - Works across all supported browsers
   - Maintains type safety
   - Handles URL parameter limits

3. **Test Coverage:**
   - All success paths tested
   - All error paths tested
   - Edge cases covered
   - Integration with Settings page verified
   - React Query invalidation tested

## Future Enhancements

1. **Analytics & Monitoring**
   - Add telemetry for OAuth success/failure rates
   - Track common error patterns
   - Monitor performance metrics

2. **UX Improvements**
   - Add progress indicator for OAuth flow
   - Improve error message clarity
   - Add retry functionality for failed attempts
   - Consider toast auto-dismiss timing

3. **Security Enhancements**
   - Add additional validation checks
   - Implement rate limiting
   - Add security headers
   - Consider alternative state transfer methods for sensitive data
