
import React, { useState } from "react";
import { PlusCircle, Search, FileJson, MoreVertical, Play, Pause } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWorkflows, Workflow, updateWorkflow, deleteWorkflow } from "@/services/workflowService";
import CreateWorkflowDialog from "@/components/workflows/CreateWorkflowDialog";
import WorkflowCard from "@/components/dashboard/WorkflowCard";
import { toast } from "sonner";

const categoriesMap: Record<string, string> = {
  "content": "Content Management",
  "finance": "Finance & Accounting",
  "development": "Development & CI/CD",
  "support": "Customer Support",
  "infrastructure": "Infrastructure",
  "uncategorized": "Uncategorized"
};

const WorkflowsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch workflows from Supabase
  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: fetchWorkflows
  });
  
  // Mutation for toggling workflow status
  const { mutate: toggleStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'idle' }) => 
      updateWorkflow(id, { status: status === 'active' ? 'idle' : 'active' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  // Mutation for deleting workflow
  const { mutate: removeWorkflow } = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success("Workflow deleted successfully");
    },
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

  const handleToggleStatus = (workflow: Workflow) => {
    toggleStatus({ id: workflow.id, status: workflow.status as 'active' | 'idle' });
  };

  const handleDeleteWorkflow = (id: string) => {
    if (confirm("Are you sure you want to delete this workflow? This action cannot be undone.")) {
      removeWorkflow(id);
    }
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
            
            <Button 
              className="sm:ml-2" 
              variant="default"
              onClick={() => setCreateDialogOpen(true)}
            >
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
                  {category === "all" ? "All Categories" : categoriesMap[category] || category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {getCategories().map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWorkflows.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <h3 className="text-xl font-semibold mb-2">No workflows found</h3>
                      <p className="text-muted-foreground">Try adjusting your filters or create a new workflow.</p>
                    </div>
                  ) : (
                    filteredWorkflows.map((workflow) => (
                      <div key={workflow.id} className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow transition-shadow">
                        <div className="p-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">{workflow.name}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleToggleStatus(workflow)}>
                                  {workflow.status === 'active' ? (
                                    <>
                                      <Pause className="h-4 w-4 mr-2" />
                                      <span>Pause Workflow</span>
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-4 w-4 mr-2" />
                                      <span>Activate Workflow</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-500 focus:text-red-500"
                                  onClick={() => handleDeleteWorkflow(workflow.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{workflow.description}</p>
                          <WorkflowCard 
                            name=""
                            description=""
                            status={workflow.status}
                            lastRun={workflow.last_run ? new Date(workflow.last_run).toLocaleString() : undefined}
                            nextRun={workflow.next_run ? new Date(workflow.next_run).toLocaleString() : undefined}
                            showHeader={false}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
      
      <CreateWorkflowDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </DashboardLayout>
  );
};

export default WorkflowsPage;
