
import { useState } from "react";
import { SidebarLayout } from "@/components/Sidebar";
import { OrgSelector } from "@/components/OrgSelector";
import { PipelineControl } from "@/components/PipelineControl";
import { GraphVisualizer } from "@/components/GraphVisualizer";
import { AnalysisResults } from "@/components/AnalysisResults";
import { AiAssistant } from "@/components/AiAssistant";
import { ComponentDetails } from "@/components/ComponentDetails";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SnapshotSelector } from "@/components/SnapshotSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"details" | "analysis">("analysis");
  
  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 h-screen flex flex-col">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Metadata Nexus</h1>
            <p className="text-muted-foreground">Salesforce metadata analysis and impact assessment</p>
          </div>
          <SidebarTrigger />
        </header>
        
        <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Left column - controls and AI */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-hidden">
            <div className="glass-card p-4 rounded-lg">
              <OrgSelector />
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <PipelineControl />
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <SnapshotSelector />
            </div>
            
            <div className="glass-card p-4 rounded-lg flex-1 overflow-hidden">
              <AiAssistant />
            </div>
          </div>
          
          {/* Middle and right columns - graph and details/results */}
          <div className="col-span-12 lg:col-span-9 grid grid-cols-1 lg:grid-rows-2 gap-6 overflow-hidden">
            {/* Graph visualization */}
            <div className="glass-card p-4 rounded-lg lg:row-span-1 overflow-hidden">
              <GraphVisualizer />
            </div>
            
            {/* Details area - switching between component details and analysis results */}
            <div className="glass-card p-4 rounded-lg lg:row-span-1 overflow-hidden">
              <Tabs 
                defaultValue="analysis" 
                value={activeTab} 
                onValueChange={(value) => setActiveTab(value as "details" | "analysis")}
                className="h-full flex flex-col"
              >
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="analysis">Analysis Results</TabsTrigger>
                    <TabsTrigger value="details">Component Details</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1 overflow-auto">
                  <TabsContent value="analysis" className="h-full">
                    <AnalysisResults />
                  </TabsContent>
                  
                  <TabsContent value="details" className="h-full">
                    <ComponentDetails />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Index;
