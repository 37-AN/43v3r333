
import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export type LogLevel = "info" | "warning" | "error" | "success";

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  source: string;
  level: LogLevel;
}

interface ActivityLogProps {
  logs: LogEntry[];
  className?: string;
  isLoading?: boolean;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs, className, isLoading = false }) => {
  const getLevelStyles = (level: LogLevel) => {
    switch (level) {
      case "info":
        return "bg-blue-500/10 border-blue-500/30 text-blue-500";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-500";
      case "error":
        return "bg-red-500/10 border-red-500/30 text-red-500";
      case "success":
        return "bg-green-500/10 border-green-500/30 text-green-500";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-medium">Activity Log</h3>
        </div>
        <div className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-medium">Activity Log</h3>
      </div>
      <div className="p-0 overflow-auto max-h-[400px]">
        {logs.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No activity logs available</div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map((log) => (
              <div key={log.id} className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  <div className={cn("px-2 py-0.5 text-xs font-medium rounded", getLevelStyles(log.level))}>
                    {log.level}
                  </div>
                </div>
                <p className="text-sm">{log.message}</p>
                <div className="mt-1 text-xs text-muted-foreground">
                  Source: {log.source}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
