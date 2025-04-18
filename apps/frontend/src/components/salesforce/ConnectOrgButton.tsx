import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import { initiateSalesforceAuth } from "@/lib/api/salesforce";
import type { SFAuthError } from '@/lib/types';

export function ConnectOrgButton() {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: initiateSalesforceAuth,
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
    onError: (error: SFAuthError) => {
      const toastConfig = (() => {
        switch (error.errorCode) {
          case 'INVALID_RESPONSE':
            return {
              title: 'Server Error',
              description: 'The server response was invalid. Please try again later.',
              variant: 'destructive' as const,
            };
          case 'SUPABASE_ERROR':
            return {
              title: 'Authentication Error',
              description: error.errorMessage,
              variant: 'destructive' as const,
            };
          case 'UNEXPECTED_ERROR':
          default:
            return {
              title: 'Connection Error',
              description: error.errorMessage,
              variant: 'destructive' as const,
            };
        }
      })();

      toast(toastConfig);
    },
  });

  return (
    <Button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      variant="default"
      size="lg"
      className="w-full md:w-auto"
      data-testid="connect-org-button"
    >
      {mutation.isPending ? (
        <>
          <Loader2 
            className="mr-2 h-4 w-4 animate-spin"
            data-testid="loading-spinner"
            aria-hidden="true"
          />
          <span>Connecting...</span>
        </>
      ) : (
        "Connect New Org"
      )}
    </Button>
  );
}
