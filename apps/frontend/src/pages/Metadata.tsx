
import { SidebarLayout } from "@/components/Sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ComponentDetails } from "@/components/ComponentDetails";
import { OrgSelector } from "@/components/OrgSelector";
import { SnapshotSelector } from "@/components/SnapshotSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Metadata = () => {
  const [activeTab, setActiveTab] = useState<"objects" | "fields" | "components">("objects");
  
  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 h-screen flex flex-col">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Metadata Explorer</h1>
            <p className="text-muted-foreground">Browse and search Salesforce metadata components</p>
          </div>
          <SidebarTrigger />
        </header>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden">
          {/* Left column - selectors */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <div className="glass-card p-4 rounded-lg">
              <OrgSelector />
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <SnapshotSelector />
            </div>
          </div>
          
          {/* Right column - metadata explorer */}
          <div className="md:col-span-9 glass-card p-4 rounded-lg overflow-hidden">
            <Tabs 
              defaultValue="objects" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "objects" | "fields" | "components")}
              className="h-full flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="objects">Objects</TabsTrigger>
                  <TabsTrigger value="fields">Fields</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                </TabsList>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search metadata..."
                    className="h-8 px-3 py-1 text-sm rounded-md border border-input bg-background"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                <TabsContent value="objects" className="h-full">
                  <div className="h-full flex flex-col">
                    <p className="text-muted-foreground mb-4">Select a snapshot to view available objects</p>
                    <div className="flex-1">
                      {/* Object list would go here */}
                      <p className="text-center text-muted-foreground mt-8">No snapshot selected</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="fields" className="h-full">
                  <div className="h-full flex flex-col">
                    <p className="text-muted-foreground mb-4">Select an object to view its fields</p>
                    <div className="flex-1">
                      {/* Field list would go here */}
                      <p className="text-center text-muted-foreground mt-8">No object selected</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="components" className="h-full">
                  <ComponentDetails />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Metadata;
