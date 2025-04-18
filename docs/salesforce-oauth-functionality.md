# Salesforce OAuth Callback Functionality

## Overview
This document describes the enhanced functionality of the Salesforce OAuth callback implementation for the NEXA Platform. The implementation handles the redirect from Salesforce after the OAuth flow, with improved error handling, accessibility, and type safety.

## Core Components

### 1. AuthCallback Component
Main component responsible for handling the OAuth callback flow.

#### URL Parameters
```typescript
interface CallbackParams {
  status: 'success' | 'error';  // Required: Indicates callback result
  error?: string;              // Optional: Error message if status is 'error'
  org_id?: string;            // Optional: Connected org ID on success
}
```

#### Example URLs
- Success: `/auth/callback/salesforce?status=success&org_id=00D...`
- Error: `/auth/callback/salesforce?status=error&error=Authentication%20failed`

### 2. Error Boundary
Provides fallback UI and error handling for runtime errors.

```typescript
<AuthCallbackErrorBoundary>
  <AuthCallbackContent />
</AuthCallbackErrorBoundary>
```

## Features

### 1. Parameter Validation
- Validates status parameter ('success' | 'error')
- Converts invalid status to 'error'
- Truncates error messages to 100 characters
- Example:
  ```typescript
  if (params.status && !['success', 'error'].includes(params.status)) {
    params.status = 'error';
    params.error = 'Invalid status parameter';
  }
  ```

### 2. Error Handling
- Runtime error catching via ErrorBoundary
- Parameter validation errors
- Network errors
- Invalid state handling
- Automatic navigation on error
- User-friendly error messages

### 3. Accessibility Features
```typescript
// Loading State
<div 
  role="alert"
  aria-busy={isLoading}
  aria-live="polite"
>
  {/* Content */}
</div>

// Loading Spinner
<Loader2 
  className="h-8 w-8 animate-spin" 
  aria-hidden="true"
/>

// Dynamic Text
<p 
  className="text-muted-foreground"
  aria-label={isLoading ? MESSAGES.LOADING_DESCRIPTION : MESSAGES.COMPLETE_DESCRIPTION}
>
  {/* Content */}
</p>
```

### 4. Navigation Flow
1. Success Path:
   - Validates parameters
   - Shows success toast
   - Navigates to settings with connections tab
   
2. Error Path:
   - Shows error toast
   - Truncates long error messages
   - Navigates to settings
   
3. Invalid Path:
   - Converts to error state
   - Shows generic error
   - Navigates to default settings

### 5. Toast Notifications
```typescript
interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}
```

Example usage:
```typescript
toast({
  title: MESSAGES.SUCCESS_TITLE,
  description: MESSAGES.SUCCESS_DESCRIPTION,
});
```

## Testing

### Manual Testing Steps

1. Success Flow:
   ```
   http://localhost:3000/auth/callback/salesforce?status=success&org_id=test123
   ```
   - Expect success toast
   - Expect navigation to settings
   - Expect connections tab active

2. Error Flow:
   ```
   http://localhost:3000/auth/callback/salesforce?status=error&error=Auth%20failed
   ```
   - Expect error toast
   - Expect error message in toast
   - Expect navigation to settings

3. Invalid Flow:
   ```
   http://localhost:3000/auth/callback/salesforce?status=invalid
   ```
   - Expect error toast
   - Expect "Invalid status parameter" message
   - Expect navigation to settings

4. Missing Parameters:
   ```
   http://localhost:3000/auth/callback/salesforce
   ```
   - Expect navigation to default settings

5. Error Boundary:
   - Trigger runtime error
   - Expect fallback UI
   - Expect navigation to settings
   - Expect error toast

### Automated Tests
See `AuthCallback.test.tsx` for comprehensive test coverage of all scenarios.

## Usage Examples

### Basic Implementation
```typescript
import { AuthCallback } from '@/components/salesforce/AuthCallback';

// In your router
<Route path="/auth/callback/salesforce" element={<AuthCallback />} />
```

### Error Boundary Usage
```typescript
import { AuthCallbackErrorBoundary } from '@/components/salesforce/AuthCallbackErrorBoundary';

// Wrap any component that might throw
<AuthCallbackErrorBoundary>
  <YourComponent />
</AuthCallbackErrorBoundary>
```

## Security Considerations

1. Parameter Validation
   - All parameters are validated
   - Invalid input is handled gracefully
   - Long messages are truncated

2. Navigation Safety
   - Only predefined routes
   - No dynamic navigation paths
   - Protected by error boundary

3. Error Handling
   - All errors are caught
   - User-friendly messages
   - No sensitive information exposed

## Accessibility Compliance

1. ARIA Attributes
   - `aria-busy` for loading states
   - `aria-live` for dynamic content
   - `aria-hidden` for decorative elements

2. Screen Reader Support
   - Meaningful labels
   - Status announcements
   - Clear error messages

3. Keyboard Navigation
   - No keyboard traps
   - Proper focus management
   - Clear focus indicators
