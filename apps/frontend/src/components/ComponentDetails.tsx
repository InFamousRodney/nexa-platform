
import { Check, ExternalLink, FileJson, FileCode, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Demo component for when a node is selected in the graph
export function ComponentDetails() {
  // This would normally come from props or context
  const component = {
    name: "OpportunityController",
    type: "ApexClass",
    apiName: "OpportunityController",
    createdDate: "2023-02-15",
    lastModifiedDate: "2023-11-22",
    status: "Active",
    testCoverage: 78,
    references: [
      { type: "ApexClass", name: "OpportunityService", relationship: "calls" },
      { type: "CustomObject", name: "Opportunity", relationship: "queries" },
      { type: "CustomObject", name: "Quote", relationship: "queries" },
      { type: "VisualforcePage", name: "OpportunityDetail", relationship: "used by" },
    ],
    issues: [
      { severity: "warning", message: "SOQL query in loop detected - performance risk" },
    ]
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {component.name}
              <Badge variant="outline" className="ml-2 font-normal">
                {component.type}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              API Name: {component.apiName}
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 px-2 py-1 ${
                component.testCoverage >= 75 
                  ? "border-success text-success" 
                  : "border-warning text-warning"
              }`}
            >
              <Check className="h-3 w-3" />
              {component.testCoverage}% Coverage
            </Badge>
            
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 px-2 py-1 border-muted text-muted-foreground"
            >
              {component.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-3 grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="m-0 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm">{component.createdDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Modified</p>
                <p className="text-sm">{component.lastModifiedDate}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-xs text-muted-foreground mb-2">Summary</p>
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <span>Controller class with methods for Opportunity management</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileJson className="h-4 w-4 text-muted-foreground" />
                  <span>Interacts with Opportunity and Quote objects</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span>Used by OpportunityDetail Visualforce page</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span>Contains 1 performance issue</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="relationships" className="m-0">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Component Relationships</p>
              <div className="border rounded-md divide-y divide-border">
                {component.references.map((ref, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ref.name}</span>
                        <Badge variant="outline" className="text-xs font-normal">
                          {ref.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">{ref.relationship}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">View</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="issues" className="m-0">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Detected Issues</p>
              {component.issues.length > 0 ? (
                <div className="border rounded-md divide-y divide-border">
                  {component.issues.map((issue, i) => (
                    <div key={i} className="p-3 flex items-start gap-3">
                      {issue.severity === "warning" && <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />}
                      <div>
                        <p className="text-sm">{issue.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Best practice: Avoid SOQL queries inside loops to prevent governor limits
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No issues detected</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
