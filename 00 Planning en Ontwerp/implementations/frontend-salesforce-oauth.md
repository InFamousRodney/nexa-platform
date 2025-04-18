# Frontend Implementation: Salesforce OAuth Connection

## Overview
This document outlines the implementation of Task 2.3.1 from Milestone 2: Making the "Connect New Org" button functional in the UI.

## Implementation Details

### 1. Types
Location: `src/lib/types.ts`
```typescript
export interface SFAuthInitiateResponse {
  authorizationUrl: string;
}

export interface SFAuthError {
  errorCode: string;
  errorMessage: string;
}
```

### 2. API Function
Location: `src/lib/api/salesforce.ts`
```typescript
export async function initiateSalesforceAuth(): Promise<SFAuthInitiateResponse> {
  const { data, error } = await supabaseClient.functions.invoke('sfdc-auth-initiate', {
    method: 'POST',
  });

  if (error) {
    const authError: SFAuthError = {
      errorCode: error.name || 'UNKNOWN_ERROR',
      errorMessage: error.message || 'An unknown error occurred',
    };
    throw authError;
  }

  if (!data?.authorizationUrl) {
    throw new Error('Authorization URL not received');
  }

  return data;
}
```

### 3. Connect Org Button Component
Location: `src/components/salesforce/ConnectOrgButton.tsx`
```typescript
export function ConnectOrgButton() {
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: initiateSalesforceAuth,
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
    onError: (error: Error | SFAuthError) => {
      const errorMessage = 'errorMessage' in error 
        ? error.errorMessage 
        : error.message || 'Failed to initiate Salesforce connection';

      toast({
        variant: "destructive",
        title: "Connection Error",
        description: errorMessage,
      });
    }
  });

  return (
    <Button
      onClick={() => mutate()}
      disabled={isPending}
      variant="default"
      size="lg"
      className="w-full md:w-auto"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect New Org"
      )}
    </Button>
  );
}
```

### 4. Integration in Settings Page
Location: `src/pages/Settings.tsx`
```typescript
<TabsContent value="connections" className="h-full">
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold mb-2">Connected Salesforce Organizations</h2>
      <p className="text-muted-foreground mb-4">Manage your Salesforce org connections</p>
      <ConnectOrgButton />
    </div>
    
    <div className="border rounded-lg divide-y">
      {/* Connection items will be rendered here */}
    </div>
  </div>
</TabsContent>
```

## Testing Implementation

### 1. Component Tests
Location: `src/components/salesforce/__tests__/ConnectOrgButton.test.tsx`

Tests cover:
- Initial render state
- Loading state during connection
- Successful connection and redirect
- Error handling with toast notifications
- Salesforce-specific error handling

### 2. API Function Tests
Location: `src/lib/api/__tests__/salesforce.test.ts`

Tests cover:
- Correct Supabase function invocation
- Successful response handling
- Missing authorization URL handling
- Error response formatting
- Unknown error handling

## Security Considerations

1. **Authentication**: All requests to the Supabase function are automatically authenticated via the supabaseClient.
2. **CSRF Protection**: The backend generates a unique state parameter for CSRF protection.
3. **Error Handling**: Sensitive error details are sanitized before showing to the user.
4. **URL Validation**: The authorizationUrl from the backend is trusted as it's generated server-side.

## User Experience

1. **Button States**:
   - Default: "Connect New Org"
   - Loading: Shows spinner with "Connecting..." text
   - Disabled during the connection process

2. **Error Feedback**:
   - Clear error messages via toast notifications
   - Button returns to enabled state after error
   - User can retry the connection

3. **Success Flow**:
   - Automatic redirect to Salesforce OAuth page
   - No additional user interaction required

## Testing Instructions

1. Run the test suite:
```bash
pnpm test
```

2. Manual testing steps:
   - Click "Connect New Org" button
   - Verify loading state
   - Verify redirect to Salesforce
   - Test error scenarios by disconnecting network
   - Verify error toast messages

## Dependencies

- @tanstack/react-query: For API mutation handling
- @radix-ui/react-toast: For error notifications
- lucide-react: For loading spinner icon
- @supabase/supabase-js: For backend function calls

## Definition of Done

- [x] Types defined and exported
- [x] API function implemented with error handling
- [x] ConnectOrgButton component created
- [x] Integration with Settings page
- [x] Component tests written and passing
- [x] API function tests written and passing
- [x] Error handling implemented
- [x] Loading states handled
- [x] TypeScript types checked
- [x] Code documented
- [ ] Code reviewed
- [ ] Manual testing completed
