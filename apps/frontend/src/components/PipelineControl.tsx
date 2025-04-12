
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, Check, Database, FileJson, RefreshCcw } from "lucide-react";
import { useState } from "react";

type PipelineStep = "idle" | "fetching" | "building" | "analyzing" | "complete" | "error";

export function PipelineControl() {
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStep>("idle");
  const [lastSnapshot, setLastSnapshot] = useState<string | null>("2023-04-08 15:30");

  const startPipeline = () => {
    setPipelineStatus("fetching");
    
    // Simulate pipeline progress
    setTimeout(() => {
      setPipelineStatus("building");
      setTimeout(() => {
        setPipelineStatus("analyzing");
        setTimeout(() => {
          setPipelineStatus("complete");
          setLastSnapshot(new Date().toLocaleString());
        }, 2000);
      }, 2000);
    }, 2000);
  };

  const getStatusBadge = () => {
    switch (pipelineStatus) {
      case "idle":
        return <span className="status-badge status-idle">Idle</span>;
      case "fetching":
      case "building":
      case "analyzing":
        return <span className="status-badge status-running animate-pulse-opacity">{capitalize(pipelineStatus)}...</span>;
      case "complete":
        return <span className="status-badge status-complete">Complete</span>;
      case "error":
        return <span className="status-badge status-error">Error</span>;
      default:
        return null;
    }
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const isRunning = ["fetching", "building", "analyzing"].includes(pipelineStatus);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Metadata Pipeline</h3>
        {getStatusBadge()}
      </div>
      
      <div className="space-y-6">
        <div className={`pipeline-step ${pipelineStatus === "fetching" ? "pipeline-step-active" : ""} ${["building", "analyzing", "complete"].includes(pipelineStatus) ? "pipeline-step-complete" : ""}`}>
          <div className="pipeline-icon">
            {["building", "analyzing", "complete"].includes(pipelineStatus) ? <Check className="h-3 w-3" /> : <Database className="h-3 w-3" />}
          </div>
          <div>
            <p className="font-medium">Fetch Metadata</p>
            <p className="text-xs text-muted-foreground">Retrieve org metadata via Salesforce API</p>
          </div>
        </div>
        
        <div className={`pipeline-step ${pipelineStatus === "building" ? "pipeline-step-active" : ""} ${["analyzing", "complete"].includes(pipelineStatus) ? "pipeline-step-complete" : ""}`}>
          <div className="pipeline-icon">
            {["analyzing", "complete"].includes(pipelineStatus) ? <Check className="h-3 w-3" /> : <FileJson className="h-3 w-3" />}
          </div>
          <div>
            <p className="font-medium">Build Knowledge Graph</p>
            <p className="text-xs text-muted-foreground">Parse and structure metadata relations</p>
          </div>
        </div>
        
        <div className={`pipeline-step ${pipelineStatus === "analyzing" ? "pipeline-step-active" : ""} ${["complete"].includes(pipelineStatus) ? "pipeline-step-complete" : ""}`}>
          <div className="pipeline-icon">
            {["complete"].includes(pipelineStatus) ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
          </div>
          <div>
            <p className="font-medium">Analyze Snapshot</p>
            <p className="text-xs text-muted-foreground">Run automated analysis on metadata</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button 
          className="w-full gap-2" 
          onClick={startPipeline} 
          disabled={isRunning}
        >
          <RefreshCcw className={`h-4 w-4 ${isRunning ? "animate-spin" : ""}`} />
          Run Pipeline
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <p>Last snapshot: {lastSnapshot || "None"}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view snapshot history</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
