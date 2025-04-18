import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { ConnectOrgButton } from '@/components/settings/ConnectOrgButton';

const MESSAGES = {
  SUCCESS_TITLE: 'Organization Connected',
  SUCCESS_DESCRIPTION: 'Your Salesforce organization has been successfully connected.',
  ERROR_TITLE: 'Connection Failed',
};

export const Settings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const status = searchParams.get('status');
    const error = searchParams.get('error');
    const orgId = searchParams.get('org_id');

    if (status) {
      if (status === 'success') {
        toast({
          title: MESSAGES.SUCCESS_TITLE,
          description: MESSAGES.SUCCESS_DESCRIPTION,
        });

        // Invalidate the Salesforce organizations query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['salesforce-orgs'] });
      } else if (status === 'error') {
        toast({
          title: MESSAGES.ERROR_TITLE,
          description: error || 'An unknown error occurred.',
          variant: 'destructive',
        });
      }

      // Remove URL parameters while preserving the tab parameter
      const tab = searchParams.get('tab');
      if (tab) {
        navigate(`${location.pathname}?tab=${tab}`, { replace: true });
      } else {
        navigate(location.pathname, { replace: true });
      }
    }
  }, []); // Run only on mount

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Connections Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Salesforce Connections</h2>
        <ConnectOrgButton />
        {/* TODO: Add OrganizationsList component to show connected orgs */}
      </div>
    </div>
  );
};

export default Settings;
