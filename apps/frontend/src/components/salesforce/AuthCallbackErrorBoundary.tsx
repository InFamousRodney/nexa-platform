import { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class AuthCallbackErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AuthCallback Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <AuthCallbackError />;
    }

    return this.props.children;
  }
}

function AuthCallbackError() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: 'Unexpected Error',
      description: 'An error occurred while processing the callback. Please try again.',
      variant: 'destructive'
    });
    navigate('/settings?tab=connections');
  }, [navigate, toast]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-destructive">Error Processing Callback</h2>
        <p className="text-muted-foreground">Redirecting to settings...</p>
      </div>
    </div>
  );
}
