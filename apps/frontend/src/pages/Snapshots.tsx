
import { SidebarLayout } from "@/components/Sidebar";
import { SnapshotSelector } from "@/components/SnapshotSelector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PipelineControl } from "@/components/PipelineControl";
import { OrgSelector } from "@/components/OrgSelector";

const Snapshots = () => {
  return (
    <SidebarLayout>
      <div className="p-3 md:p-4 h-screen flex flex-col overflow-hidden">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Snapshots</h1>
            <p className="text-sm text-muted-foreground">Manage your Salesforce metadata snapshots</p>
          </div>
          <SidebarTrigger />
        </header>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-auto">
          {/* Controls */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="glass-card p-3 rounded-lg">
              <OrgSelector />
            </div>
            
            <div className="glass-card p-3 rounded-lg">
              <PipelineControl />
            </div>
          </div>
          
          {/* Main snapshot list */}
          <div className="md:col-span-8 glass-card p-3 rounded-lg overflow-auto">
            <h2 className="text-lg font-semibold mb-3">Available Snapshots</h2>
            <SnapshotSelector />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Snapshots;
