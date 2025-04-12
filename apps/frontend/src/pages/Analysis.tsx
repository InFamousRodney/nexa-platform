
import { SidebarLayout } from "@/components/Sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AnalysisResults } from "@/components/AnalysisResults";
import { OrgSelector } from "@/components/OrgSelector";
import { SnapshotSelector } from "@/components/SnapshotSelector";

const Analysis = () => {
  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 h-screen flex flex-col">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analysis Results</h1>
            <p className="text-muted-foreground">View and manage analysis findings</p>
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
            
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Analysis Filters</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="showErrors" className="mr-2" defaultChecked />
                  <label htmlFor="showErrors">Show Errors</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="showWarnings" className="mr-2" defaultChecked />
                  <label htmlFor="showWarnings">Show Warnings</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="showInfo" className="mr-2" defaultChecked />
                  <label htmlFor="showInfo">Show Info</label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - analysis results */}
          <div className="md:col-span-9 glass-card p-4 rounded-lg overflow-hidden">
            <AnalysisResults />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Analysis;
