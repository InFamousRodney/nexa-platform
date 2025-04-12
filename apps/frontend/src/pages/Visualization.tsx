import { SidebarLayout } from "@/components/Sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { GraphVisualizer } from "@/components/GraphVisualizer";
import { OrgSelector } from "@/components/OrgSelector";
import { SnapshotSelector } from "@/components/SnapshotSelector";

const Visualization = () => {
  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 h-screen flex flex-col">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Graph Visualization</h1>
            <p className="text-muted-foreground">Interactive metadata knowledge graph</p>
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
              <h3 className="text-lg font-medium mb-2">Graph Controls</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="layout" className="block text-sm mb-1">Layout Type</label>
                  <select id="layout" className="w-full px-2 py-1 rounded-md border border-input bg-background">
                    <option value="cose">Cose</option>
                    <option value="concentric">Concentric</option>
                    <option value="breadthfirst">Breadth First</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="nodeFilter" className="block text-sm mb-1">Node Type Filter</label>
                  <select id="nodeFilter" className="w-full px-2 py-1 rounded-md border border-input bg-background">
                    <option value="all">All Types</option>
                    <option value="objects">Objects</option>
                    <option value="fields">Fields</option>
                    <option value="flows">Flows</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="searchNode" className="block text-sm mb-1">Search Node</label>
                  <input id="searchNode" type="text" className="w-full px-2 py-1 rounded-md border border-input bg-background" placeholder="Enter API name..." />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - graph visualizer */}
          <div className="md:col-span-9 glass-card p-4 rounded-lg overflow-hidden">
            <GraphVisualizer />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Visualization;
