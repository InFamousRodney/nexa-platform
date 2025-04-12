
import { SidebarLayout } from "@/components/Sidebar";
import { OrgSelector } from "@/components/OrgSelector";
import { PipelineControl } from "@/components/PipelineControl";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AiAssistant } from "@/components/AiAssistant";

const Dashboard = () => {
  return (
    <SidebarLayout>
      <div className="p-3 md:p-4 h-screen flex flex-col overflow-hidden">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Overview of your Salesforce metadata analysis</p>
          </div>
          <SidebarTrigger />
        </header>
        
        <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
          {/* Left column - controls */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 overflow-auto">
            <div className="glass-card p-3 rounded-lg">
              <OrgSelector />
            </div>
            
            <div className="glass-card p-3 rounded-lg">
              <PipelineControl />
            </div>
            
            <div className="glass-card p-3 rounded-lg flex-1 overflow-hidden">
              <div className="h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-3">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Total Snapshots</p>
                    <p className="text-xl font-bold">3</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Connected Orgs</p>
                    <p className="text-xl font-bold">1</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Analysis Runs</p>
                    <p className="text-xl font-bold">7</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Issues Found</p>
                    <p className="text-xl font-bold">12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - AI Assistant */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 overflow-auto">
            <div className="glass-card p-3 rounded-lg flex-1 overflow-hidden">
              <AiAssistant />
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
