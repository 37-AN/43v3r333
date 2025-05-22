
import React from "react";
import { Bot, Cpu, ActivitySquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type AgentStatus = "online" | "offline" | "busy" | "error";

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  model: string;
  status: AgentStatus;
  lastAction?: string;
  cpuUsage?: number;
  memoryUsage?: number;
}

const AgentCard: React.FC<AgentCardProps> = ({
  id,
  name,
  description,
  model,
  status,
  lastAction,
  cpuUsage = 0,
  memoryUsage = 0,
}) => {
  const getStatusDetails = () => {
    switch (status) {
      case "online":
        return {
          icon: <Bot className="h-5 w-5" />,
          color: "text-green-500",
          bgColor: "bg-green-500",
          text: "Online",
        };
      case "offline":
        return {
          icon: <Bot className="h-5 w-5" />,
          color: "text-gray-400",
          bgColor: "bg-gray-400",
          text: "Offline",
        };
      case "busy":
        return {
          icon: <Loader2 className="h-5 w-5 animate-spin" />,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500",
          text: "Processing",
        };
      case "error":
        return {
          icon: <Bot className="h-5 w-5" />,
          color: "text-red-500",
          bgColor: "bg-red-500",
          text: "Error",
        };
      default:
        return {
          icon: <Bot className="h-5 w-5" />,
          color: "text-gray-400",
          bgColor: "bg-gray-400",
          text: "Unknown",
        };
    }
  };

  const statusDetails = getStatusDetails();

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn("h-2 w-2 rounded-full", statusDetails.bgColor)} />
              <h3 className="font-medium">{name}</h3>
            </div>
            <span className="text-xs text-muted-foreground">{model}</span>
          </div>
          <div className={cn("p-2 rounded-full", statusDetails.color)}>
            {statusDetails.icon}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        {status !== "offline" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
                <span>CPU</span>
              </div>
              <span className="font-medium">{cpuUsage}%</span>
            </div>
            <Progress value={cpuUsage} className="h-1" />
            
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <ActivitySquare className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Memory</span>
              </div>
              <span className="font-medium">{memoryUsage}%</span>
            </div>
            <Progress value={memoryUsage} className="h-1" />
          </div>
        )}
      </div>
      
      <div className="px-6 py-3 bg-secondary/50 border-t border-border flex justify-between items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs truncate text-muted-foreground max-w-[180px]">
                {lastAction || "No recent actions"}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{lastAction || "No recent actions"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button variant="outline" size="sm">
          {status === "offline" ? "Start" : "Manage"}
        </Button>
      </div>
    </div>
  );
};

export default AgentCard;
