import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchMockSalesforceConnections, MockSalesforceConnection } from "@/lib/mockData";
import { useAppStore } from "@/stores/useAppStore";
import { useEffect, useState } from "react";

export function OrgSelector() {
  // Get store values and actions
  const { selectedOrgId, setSelectedOrgId } = useAppStore();
  
  // Local state for select value
  const [localSelectedValue, setLocalSelectedValue] = useState<string | null>(selectedOrgId);
  
  // Fetch Salesforce connections
  const { 
    data: connections, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['salesforceConnections'],
    queryFn: fetchMockSalesforceConnections,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Keep local state in sync with store
  useEffect(() => {
    setLocalSelectedValue(selectedOrgId);
  }, [selectedOrgId]);

  // Auto-select first organization if none is selected
  useEffect(() => {
    if (connections?.length && !selectedOrgId) {
      setSelectedOrgId(connections[0].id);
    }
  }, [connections, selectedOrgId, setSelectedOrgId]);

  // Handle selection change
  const handleValueChange = (value: string) => {
    setLocalSelectedValue(value);
    setSelectedOrgId(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Salesforce Organization</h3>
      </div>
      
      <Select 
        value={localSelectedValue || undefined} 
        onValueChange={handleValueChange}
        disabled={isLoading || isError}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={
            isLoading ? "Loading organizations..." : 
            isError ? "Error loading organizations" : 
            "Select an organization"
          } />
        </SelectTrigger>
        <SelectContent>
          {isLoading && (
            <SelectItem value="loading" disabled>
              Loading organizations...
            </SelectItem>
          )}
          
          {isError && (
            <SelectItem value="error" disabled>
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Error loading organizations</span>
              </div>
            </SelectItem>
          )}
          
          {connections?.map((org: MockSalesforceConnection) => (
            <SelectItem key={org.id} value={org.id}>
              {org.friendly_name || org.sf_org_id}
              {org.status !== 'active' && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({org.status})
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button size="sm" variant="outline" className="w-full gap-1">
        <PlusCircle className="h-4 w-4" />
        Connect New Org
      </Button>
    </div>
  );
}
