
import { useState } from "react";
import { Calendar, Clock, FileJson } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

type SnapshotStatus = "COMPLETED" | "FAILED" | "IN_PROGRESS";

interface Snapshot {
  id: string;
  createdAt: string;
  status: SnapshotStatus;
  orgId: string;
  componentCount?: number;
  relationshipCount?: number;
}

// Demo snapshots for UI development
const demoSnapshots: Snapshot[] = [
  { 
    id: "snap-001", 
    createdAt: "2025-04-08T14:30:00Z", 
    status: "COMPLETED", 
    orgId: "1",
    componentCount: 345,
    relationshipCount: 1203
  },
  { 
    id: "snap-002", 
    createdAt: "2025-04-07T10:15:00Z", 
    status: "COMPLETED", 
    orgId: "1",
    componentCount: 342,
    relationshipCount: 1187
  },
  { 
    id: "snap-003", 
    createdAt: "2025-04-05T16:45:00Z", 
    status: "FAILED", 
    orgId: "1" 
  },
  { 
    id: "snap-004", 
    createdAt: "2025-04-08T09:20:00Z", 
    status: "IN_PROGRESS", 
    orgId: "1" 
  }
];

export function SnapshotSelector() {
  const [selectedSnapshot, setSelectedSnapshot] = useState<string>("snap-001");
  
  // Filter snapshots by currently selected org (would come from context/props in real app)
  const currentOrgId = "1"; // This would be dynamic in a real app
  const filteredSnapshots = demoSnapshots.filter(snap => snap.orgId === currentOrgId);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getStatusBadge = (status: SnapshotStatus) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="outline" className="bg-success/20 text-success border-success">Completed</Badge>;
      case "FAILED":
        return <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive">Failed</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="outline" className="bg-warning/20 text-warning border-warning animate-pulse">In Progress</Badge>;
      default:
        return null;
    }
  };
  
  const currentSnapshot = filteredSnapshots.find(snap => snap.id === selectedSnapshot);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Metadata Snapshots</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                History
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View all snapshot history</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Select value={selectedSnapshot} onValueChange={setSelectedSnapshot}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a snapshot" />
        </SelectTrigger>
        <SelectContent>
          {filteredSnapshots.map((snapshot) => (
            <SelectItem 
              key={snapshot.id} 
              value={snapshot.id}
              disabled={snapshot.status !== "COMPLETED"}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="truncate">Snapshot {snapshot.id.slice(-3)}</span>
                {getStatusBadge(snapshot.status)}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {currentSnapshot && currentSnapshot.status === "COMPLETED" && (
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(currentSnapshot.createdAt)}</span>
          </div>
          
          {currentSnapshot.componentCount && currentSnapshot.relationshipCount && (
            <div className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              <span>{currentSnapshot.componentCount} components, {currentSnapshot.relationshipCount} relationships</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
