
import { useState } from "react";
import { Search, AlertTriangle, AlertCircle, Info, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Severity = "error" | "warning" | "info";

interface AnalysisIssue {
  id: string;
  severity: Severity;
  componentType: string;
  componentName: string;
  description: string;
  analysisType: string;
}

// Demo data for UI development
const demoIssues: AnalysisIssue[] = [
  {
    id: "issue-001",
    severity: "error",
    componentType: "ApexClass",
    componentName: "OpportunityController",
    description: "References non-existent field: Opportunity.CustomerPriority__c",
    analysisType: "reference_integrity"
  },
  {
    id: "issue-002",
    severity: "warning",
    componentType: "ApexClass",
    componentName: "OpportunityController",
    description: "SOQL query in loop detected - performance risk",
    analysisType: "performance"
  },
  {
    id: "issue-003",
    severity: "warning",
    componentType: "Flow",
    componentName: "Opportunity_Update_Status",
    description: "Flow references field that requires extra permissions: Opportunity.Internal_Status__c",
    analysisType: "security"
  },
  {
    id: "issue-004",
    severity: "info",
    componentType: "CustomField",
    componentName: "Account.NumberOfEmployees",
    description: "Field used in 5 Apex classes and 3 Flows",
    analysisType: "dependency"
  },
  {
    id: "issue-005",
    severity: "error",
    componentType: "Workflow",
    componentName: "Account.Update_Related_Contacts",
    description: "References deleted field: Contact.AccountRefID__c",
    analysisType: "reference_integrity"
  }
];

export function AnalysisResults() {
  const [searchText, setSearchText] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  const getSeverityIcon = (severity: Severity) => {
    switch (severity) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info":
        return <Info className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };
  
  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case "error":
        return <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive">Error</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-warning/20 text-warning border-warning">Warning</Badge>;
      case "info":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">Info</Badge>;
      default:
        return null;
    }
  };
  
  const filteredIssues = demoIssues.filter(issue => {
    // Apply search filter
    if (searchText && !issue.componentName.toLowerCase().includes(searchText.toLowerCase()) &&
        !issue.description.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    // Apply severity filter
    if (severityFilter !== "all" && issue.severity !== severityFilter) {
      return false;
    }
    
    // Apply type filter
    if (typeFilter !== "all" && issue.analysisType !== typeFilter) {
      return false;
    }
    
    return true;
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  
  const uniqueAnalysisTypes = Array.from(new Set(demoIssues.map(issue => issue.analysisType)));
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Analysis Results</h3>
        <Badge variant="secondary" className="text-xs">Snapshot snap-001</Badge>
      </div>
      
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..." 
            className="pl-9"
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
        
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="error">Errors</SelectItem>
            <SelectItem value="warning">Warnings</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Analysis Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueAnalysisTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-2 pt-2">
          {filteredIssues.length > 0 ? (
            <div className="border rounded-md divide-y divide-border">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="p-3 flex items-start gap-3">
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{issue.componentName}</span>
                          <Badge variant="outline" className="text-xs font-normal">
                            {issue.componentType}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {issue.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(issue.severity)}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View in graph</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p>No issues found matching your filters</p>
              {(searchText || severityFilter !== "all" || typeFilter !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSearchText("");
                    setSeverityFilter("all");
                    setTypeFilter("all");
                  }}
                  className="mt-2"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="stats" className="p-4 border rounded-md space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-destructive/10 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-destructive">{demoIssues.filter(i => i.severity === "error").length}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div className="bg-warning/10 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-warning">{demoIssues.filter(i => i.severity === "warning").length}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="bg-muted p-4 rounded-md text-center">
              <div className="text-2xl font-bold">{demoIssues.filter(i => i.severity === "info").length}</div>
              <div className="text-sm text-muted-foreground">Infos</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Issues by Component Type</h4>
            <div className="border rounded-md divide-y divide-border">
              {Array.from(new Set(demoIssues.map(i => i.componentType))).map(type => (
                <div key={type} className="p-3 flex justify-between items-center">
                  <span>{type}</span>
                  <Badge variant="secondary">
                    {demoIssues.filter(i => i.componentType === type).length}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
