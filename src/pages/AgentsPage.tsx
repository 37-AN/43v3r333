
import React, { useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AgentCard from "@/components/dashboard/AgentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchAgents, Agent } from "@/services/agentService";

const AgentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  
  // Fetch agents from Supabase
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents
  });
  
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (agent.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    const matchesModel = modelFilter === "all" || agent.model === modelFilter;
    
    return matchesSearch && matchesStatus && matchesModel;
  });
  
  const models = ["all", ...Array.from(new Set(agents.map((agent) => agent.model)))];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model === "all" ? "All Models" : model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button className="sm:ml-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Agent
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm h-[250px] animate-pulse">
                <div className="p-6 h-full bg-secondary/20"></div>
              </div>
            ))
          ) : filteredAgents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No agents found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or create a new agent.</p>
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <AgentCard 
                key={agent.id}
                id={agent.id}
                name={agent.name}
                description={agent.description || ''}
                model={agent.model}
                status={agent.status}
                lastAction={agent.last_action || undefined}
                cpuUsage={agent.cpu_usage || 0}
                memoryUsage={agent.memory_usage || 0}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;
