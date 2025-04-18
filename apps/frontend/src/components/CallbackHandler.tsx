import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { checkCallbackStatus } from '../lib/api/salesforce';
import { Card } from './ui/card';
import { Button } from './ui/button';

export function CallbackHandler() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const status = checkCallbackStatus();

  useEffect(() => {
    if (status === 'success') {
      // Invalidate the connections query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['salesforce-connections'] });
      
      // Redirect to settings page after a short delay
      const timer = setTimeout(() => {
        navigate('/settings');
      }, 2000);

      return () => clearTimeout(timer);
    } else if (status === 'error') {
      // Redirect to settings page with error after a short delay
      const timer = setTimeout(() => {
        navigate('/settings?error=auth_failed');
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // No status found, redirect to settings
      navigate('/settings');
    }
  }, [status, navigate, queryClient]);

  return (
    <Card className="p-8 max-w-md mx-auto mt-8">
      <div className="text-center">
        {status === 'success' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Connection Successful!</h2>
            <p className="text-gray-600 mb-4">Your Salesforce organization has been connected successfully.</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Connection Failed</h2>
            <p className="text-gray-600 mb-4">There was an error connecting your Salesforce organization.</p>
          </>
        )}
        <Button
          variant="outline"
          onClick={() => navigate('/settings')}
        >
          Go to Settings
        </Button>
      </div>
    </Card>
  );
} 