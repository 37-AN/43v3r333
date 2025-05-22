
import React, { useState } from "react";
import { PlusCircle, Search, FileJson } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WorkflowCard from "@/components/dashboard/WorkflowCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkflows, Workflow } from "@/services/workflowService";

const categoriesMap: Record<string, string> = {
  "content": "Content Management",
  "finance": "Finance & Accounting",
  "development": "Development & CI/CD",
  "support": "Customer Support",
  "infrastructure": "Infrastructure",
};

const WorkflowsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentTab, setCurrentTab] = useState<string>("all");

  // Fetch workflows from Supabase
  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: fetchWorkflows
  });
  
  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (workflow.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter;
    const matchesCategory = currentTab === "all" || workflow.category === currentTab;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  const getCategories = () => {
    const categories = ["all", ...Array.from(new Set(workflows.map((workflow) => workflow.category || "uncategorized")))];
    return categories;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="sm:ml-2" variant="default">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
            
            <Button className="sm:ml-2" variant="outline">
              <FileJson className="h-4 w-4 mr-2" />
              Import n8n
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm h-[200px] animate-pulse">
                <div className="p-6 h-full bg-secondary/20"></div>
              </div>
            ))}
          </div>
        ) : (
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-6 w-full sm:w-auto overflow-x-auto">
              {getCategories().map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category === "all" ? "All Categories" : category === "uncategorized" ? "Uncategorized" : categoriesMap[category] || category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {getCategories().map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid-workflow">
                  {filteredWorkflows.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <h3 className="text-xl font-semibold mb-2">No workflows found</h3>
                      <p className="text-muted-foreground">Try adjusting your filters or create a new workflow.</p>
                    </div>
                  ) : (
                    filteredWorkflows.map((workflow) => (
                      <WorkflowCard 
                        key={workflow.id}
                        name={workflow.name}
                        description={workflow.description || ''}
                        status={workflow.status}
                        lastRun={workflow.last_run ? new Date(workflow.last_run).toLocaleString() : undefined}
                        nextRun={workflow.next_run ? new Date(workflow.next_run).toLocaleString() : undefined}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkflowsPage;
