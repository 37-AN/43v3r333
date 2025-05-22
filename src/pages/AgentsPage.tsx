
import React from "react";
import { PlusCircle, Search } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AgentCard, { AgentStatus } from "@/components/dashboard/AgentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for agents
const allAgents = [
  {
    id: "agent-1",
    name: "Content Writer",
    description: "Creates blog posts and social media content",
    model: "LLama 3 70B",
    status: "online" as AgentStatus,
    lastAction: "Generated blog post: '10 ways to improve productivity'",
    cpuUsage: 32,
    memoryUsage: 45,
  },
  {
    id: "agent-2",
    name: "Code Reviewer",
    description: "Reviews code commits and provides feedback",
    model: "Mistral Medium",
    status: "busy" as AgentStatus,
    lastAction: "Reviewing PR #143: 'Fix authentication flow'",
    cpuUsage: 78,
    memoryUsage: 65,
  },
  {
    id: "agent-3",
    name: "Data Analyst",
    description: "Analyzes metrics and generates reports",
    model: "LLama 3 8B",
    status: "offline" as AgentStatus,
    lastAction: "Generated monthly financial report",
    cpuUsage: 0,
    memoryUsage: 0,
  },
  {
    id: "agent-4",
    name: "Customer Support",
    description: "Handles customer queries and generates responses",
    model: "LLama 3 8B",
    status: "online" as AgentStatus,
    lastAction: "Responded to customer query about pricing",
    cpuUsage: 24,
    memoryUsage: 38,
  },
  {
    id: "agent-5",
    name: "Finance Assistant",
    description: "Processes financial data and generates reports",
    model: "Mistral Large",
    status: "error" as AgentStatus,
    lastAction: "Failed to connect to QuickBooks API",
    cpuUsage: 12,
    memoryUsage: 25,
  },
  {
    id: "agent-6",
    name: "Sales Analyzer",
    description: "Analyzes sales data and provides insights",
    model: "Vicuna 13B",
    status: "offline" as AgentStatus,
    lastAction: "Generated quarterly sales report",
    cpuUsage: 0,
    memoryUsage: 0,
  },
];

const AgentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [modelFilter, setModelFilter] = React.useState<string>("all");
  
  const filteredAgents = allAgents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    const matchesModel = modelFilter === "all" || agent.model === modelFilter;
    
    return matchesSearch && matchesStatus && matchesModel;
  });
  
  const models = ["all", ...Array.from(new Set(allAgents.map((agent) => agent.model)))];

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
          {filteredAgents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No agents found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or create a new agent.</p>
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <AgentCard key={agent.id} {...agent} />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;
