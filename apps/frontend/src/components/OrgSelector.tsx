import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAppStore } from '../stores/useAppStore';
import { fetchSalesforceConnections } from '../lib/api/salesforce';
import { SalesforceConnection } from '../lib/types';

export function OrgSelector() {
  const [selectedOrg, setSelectedOrg] = useState<SalesforceConnection | null>(null);
  const { selectedOrgId, setSelectedOrgId } = useAppStore();

  const { data: connections, isLoading, error } = useQuery({
    queryKey: ['salesforce-connections'],
    queryFn: fetchSalesforceConnections,
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
    </Card>
  );
}
