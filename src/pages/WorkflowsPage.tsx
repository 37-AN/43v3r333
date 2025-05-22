
import React from "react";
import { PlusCircle, Search, Filter, FileJson } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WorkflowCard, { WorkflowStatus } from "@/components/dashboard/WorkflowCard";
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

// Sample workflow data
const allWorkflows = [
  {
    id: "workflow-1",
    name: "Content Generation",
    description: "Generates blog content from Discord ideas",
    status: "active" as WorkflowStatus,
    lastRun: "Today, 10:45 AM",
    nextRun: "Today, 4:00 PM",
    category: "content",
  },
  {
    id: "workflow-2",
    name: "Financial Analysis",
    description: "Daily sales data analysis and reporting",
    status: "completed" as WorkflowStatus,
    lastRun: "Today, 9:00 AM", 
    nextRun: "Tomorrow, 9:00 AM",
    category: "finance",
  },
  {
    id: "workflow-3",
    name: "Code Review",
    description: "Automated PR reviews on GitHub repositories",
    status: "idle" as WorkflowStatus,
    lastRun: "Yesterday, 5:30 PM",
    nextRun: "On PR creation",
    category: "development",
  },
  {
    id: "workflow-4",
    name: "Customer Support",
    description: "Handles customer queries and generates responses",
    status: "error" as WorkflowStatus,
    lastRun: "Today, 11:23 AM",
    nextRun: "Manual restart required",
    category: "support",
  },
  {
    id: "workflow-5",
    name: "Social Media Posting",
    description: "Schedules and posts content to social media platforms",
    status: "active" as WorkflowStatus,
    lastRun: "Today, 8:30 AM",
    nextRun: "Today, 2:30 PM",
    category: "content",
  },
  {
    id: "workflow-6",
    name: "Invoice Processing",
    description: "Processes incoming invoices and updates accounting system",
    status: "idle" as WorkflowStatus,
    lastRun: "Yesterday, 2:15 PM",
    nextRun: "On invoice receipt",
    category: "finance",
  },
  {
    id: "workflow-7",
    name: "Database Backup",
    description: "Creates automated backups of PostgreSQL and MSSQL databases",
    status: "completed" as WorkflowStatus,
    lastRun: "Today, 3:00 AM",
    nextRun: "Tomorrow, 3:00 AM",
    category: "infrastructure",
  },
  {
    id: "workflow-8",
    name: "Error Report Analysis",
    description: "Analyzes error logs and generates reports",
    status: "active" as WorkflowStatus,
    lastRun: "Today, 7:15 AM",
    nextRun: "Every 6 hours",
    category: "development",
  },
];

const categoriesMap: Record<string, string> = {
  "content": "Content Management",
  "finance": "Finance & Accounting",
  "development": "Development & CI/CD",
  "support": "Customer Support",
  "infrastructure": "Infrastructure",
};

const WorkflowsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [currentTab, setCurrentTab] = React.useState<string>("all");
  
  const filteredWorkflows = allWorkflows.filter((workflow) => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter;
    const matchesCategory = currentTab === "all" || workflow.category === currentTab;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  const getCategories = () => {
    const categories = ["all", ...Array.from(new Set(allWorkflows.map((workflow) => workflow.category)))];
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
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-6 w-full sm:w-auto">
            {getCategories().map((category) => (
              <TabsTrigger key={category} value={category}>
                {category === "all" ? "All Categories" : categoriesMap[category]}
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
                    <WorkflowCard key={workflow.id} {...workflow} />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WorkflowsPage;
