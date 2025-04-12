
import { useState } from "react";
import { 
  Button,
  buttonVariants
} from "@/components/ui/button";
import { Search, ZoomIn, ZoomOut, LayoutGrid, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { FileJson } from "lucide-react";

type GraphState = "empty" | "loading" | "ready" | "error";

export function GraphVisualizer() {
  const [graphState, setGraphState] = useState<GraphState>("empty");
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // In a real app, would trigger graph search/highlighting
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Metadata Knowledge Graph</h3>
        
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search components..." 
              className="pl-9 h-9 w-[180px] md:w-[220px]"
              disabled={graphState === "empty"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" disabled={graphState === "empty"}>
                  <Filter className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only md:ml-2">Filters</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter graph components</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" disabled={graphState === "empty"}>
                  <LayoutGrid className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only md:ml-2">Layout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change graph layout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="flex-1 rounded-md border border-border overflow-hidden bg-secondary/30 relative">
        {graphState === "empty" && (
          <div className="graph-placeholder">
            <div className="rounded-full bg-muted p-5 mb-4">
              <FileJson className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No metadata snapshot loaded</h3>
            <p className="text-center max-w-md">
              Connect to a Salesforce org and import a metadata snapshot to visualize your org's metadata structure
            </p>
          </div>
        )}
        
        {graphState === "ready" && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="secondary" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Zoom in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="secondary" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Zoom out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Separator className="my-1" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="secondary">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Export graph</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
