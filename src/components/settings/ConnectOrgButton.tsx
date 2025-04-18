import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

interface AuthInitiateResponse {
  authorizationUrl: string;
}

interface AuthInitiateError {
  error: string;
  details?: string;
}

export const ConnectOrgButton: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = useSupabaseClient();
  const user = useUser();

  const mutation = useMutation<AuthInitiateResponse, Error, void>({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated.');
      setErrorMessage(null);
      const { data, error } = await supabase.functions.invoke<AuthInitiateResponse>('sfdc-auth-initiate', { method: 'POST' });
      if (error) {
        let errorMsg = error.message;
        try {
          const errorContext = error.context;
          if (errorContext) {
            if (typeof errorContext === 'object' && 'error' in errorContext) {
              errorMsg = errorContext.error;
            } else if (errorContext instanceof Response) {
              const json = await errorContext.json();
              if (json && json.error) errorMsg = json.error;
            }
          }
        } catch {}
        throw new Error(errorMsg);
      }
      if (!data || !data.authorizationUrl) {
        throw new Error('Authorization URL not received from server.');
      }
      return data;
    },
    onSuccess: (data) => {
      console.log('Redirecting to:', data.authorizationUrl);
      window.location.href = data.authorizationUrl;
    },
    onError: (error: Error) => {
      console.error('ConnectOrgButton error:', error);
      setErrorMessage(error.message);
    },
  });

  const handleConnectClick = () => {
    mutation.mutate();
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleConnectClick}
        disabled={mutation.isLoading}
        aria-busy={mutation.isLoading}
      >
        {mutation.isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
          </>
        ) : (
          'Connect New Salesforce Org'
        )}
      </Button>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}; 