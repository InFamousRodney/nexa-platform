import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAppStore } from '../stores/useAppStore';
import { fetchSalesforceConnections, initiateSalesforceAuth } from '../lib/api/salesforce';
import { SalesforceConnection } from '../lib/types';
import { useNavigate } from 'react-router-dom';

export function OrgSelector() {
  const [selectedOrg, setSelectedOrg] = useState<SalesforceConnection | null>(null);
  const { selectedOrgId, setSelectedOrgId } = useAppStore();
  const navigate = useNavigate();

  const { data: connections, isLoading, error } = useQuery({
    queryKey: ['salesforce-connections'],
    queryFn: fetchSalesforceConnections,
  });

  const initiateAuthMutation = useMutation({
    mutationFn: initiateSalesforceAuth,
    onSuccess: (data) => {
      // Redirect to Salesforce authorization URL
      window.location.href = data.authorizationUrl;
    },
    onError: (error) => {
      console.error('Failed to initiate Salesforce authentication:', error);
    },
  });

  useEffect(() => {
    if (connections && selectedOrgId) {
      const org = connections.find(conn => conn.id === selectedOrgId);
      setSelectedOrg(org || null);
    }
  }, [connections, selectedOrgId]);

  const handleOrgSelect = (org: SalesforceConnection) => {
    setSelectedOrg(org);
    setSelectedOrgId(org.id);
  };

  const handleConnectNewOrg = () => {
    initiateAuthMutation.mutate();
  };

  if (isLoading) {
    return <div>Loading organizations...</div>;
  }

  if (error) {
    return <div>Error loading organizations: {error.message}</div>;
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Selected Organization</h3>
          {selectedOrg ? (
            <p className="text-sm text-gray-500">{selectedOrg.name}</p>
          ) : (
            <p className="text-sm text-gray-500">No organization selected</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleConnectNewOrg}
            disabled={initiateAuthMutation.isPending}
          >
            {initiateAuthMutation.isPending ? 'Connecting...' : 'Connect New Org'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Select Organization</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {connections?.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleOrgSelect(org)}
                >
                  {org.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
