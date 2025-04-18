import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { CallbackParams, MESSAGES } from './types';
import { AuthCallbackErrorBoundary } from './AuthCallbackErrorBoundary';

function AuthCallbackContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isLoading = true; // Always show loading state since component unmounts before state changes

  useEffect(() => {
    const params: Partial<CallbackParams> = {
      status: searchParams.get('status') as CallbackParams['status'],
      error: searchParams.get('error') || undefined,
      org_id: searchParams.get('org_id') || undefined
    };

    // Validate status parameter
    if (params.status && !['success', 'error'].includes(params.status)) {
      params.status = 'error';
      params.error = 'Invalid status parameter';
    }

    // Process the callback
    if (params.status === 'success') {
      toast({
        title: MESSAGES.SUCCESS_TITLE,
        description: MESSAGES.SUCCESS_DESCRIPTION,
      });
      navigate('/settings?tab=connections');
    } else if (params.error) {
      toast({
        title: MESSAGES.ERROR_TITLE,
        description: params.error.slice(0, 100),
        variant: 'destructive',
      });
      navigate('/settings?tab=connections');
    } else {
      navigate('/settings');
    }
  }, [searchParams, navigate, toast]);

  return (
    <div 
      className="h-screen flex items-center justify-center"
      role="alert"
      aria-busy={isLoading}
      aria-live="polite"
    >
      <div className="text-center">
        <div className="flex flex-col items-center gap-4">
          {isLoading && (
            <Loader2 
              data-testid="loading-spinner"
              className="h-8 w-8 animate-spin" 
              aria-hidden="true"
            />
          )}
          <h2 className="text-xl font-semibold">
            {MESSAGES.LOADING_TITLE}
          </h2>
          <p 
            className="text-muted-foreground"
            aria-label={MESSAGES.LOADING_DESCRIPTION}
          >
            {MESSAGES.LOADING_DESCRIPTION}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthCallback() {
  return (
    <AuthCallbackErrorBoundary>
      <AuthCallbackContent />
    </AuthCallbackErrorBoundary>
  );
}
