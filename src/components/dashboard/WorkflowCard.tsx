
import React from "react";
import { Clock, PlayCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type WorkflowStatus = "active" | "idle" | "error" | "completed";

interface WorkflowCardProps {
  name: string;
  description: string;
  status: WorkflowStatus;
  lastRun?: string;
  nextRun?: string;
  showHeader?: boolean;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  name,
  description,
  status,
  lastRun,
  nextRun,
  showHeader = true,
}) => {
  const getStatusDetails = () => {
    switch (status) {
      case "active":
        return {
          icon: <PlayCircle className="h-5 w-5 text-green-500" />,
          text: "Active",
          className: "bg-green-500/10 text-green-500",
        };
      case "idle":
        return {
          icon: <Clock className="h-5 w-5 text-blue-500" />,
          text: "Idle",
          className: "bg-blue-500/10 text-blue-500",
        };
      case "error":
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          text: "Error",
          className: "bg-red-500/10 text-red-500",
        };
      case "completed":
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-purple-500" />,
          text: "Completed",
          className: "bg-purple-500/10 text-purple-500",
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          text: "Unknown",
          className: "bg-gray-500/10 text-gray-500",
        };
    }
  };

  const statusDetails = getStatusDetails();

  return (
    <>
      {showHeader && (
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{name}</h3>
            <div className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1", statusDetails.className)}>
              {statusDetails.icon}
              {statusDetails.text}
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
      )}
      {!showHeader && (
        <div className="flex justify-end mt-4 mb-2">
          <div className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1", statusDetails.className)}>
            {statusDetails.icon}
            {statusDetails.text}
          </div>
        </div>
      )}
      <div className="px-6 py-4 bg-secondary/50 border-t border-border rounded-b-lg">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Last run:</span>
            <div className="font-medium mt-0.5">{lastRun || "Never"}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Next run:</span>
            <div className="font-medium mt-0.5">{nextRun || "Not scheduled"}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowCard;
