
import React from "react";
import { 
  Bot, 
  Workflow, 
  LineChart, 
  GanttChart,
  SparkleIcon,
  Loader,
  Cpu,
  Database
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusCard from "@/components/dashboard/StatusCard";
import WorkflowCard, { WorkflowStatus } from "@/components/dashboard/WorkflowCard";
import AgentCard, { AgentStatus } from "@/components/dashboard/AgentCard";
import ActivityLog from "@/components/dashboard/ActivityLog";

// Placeholder sample data
const sampleWorkflows = [
  {
    id: "workflow-1",
    name: "Content Generation",
    description: "Generates blog content from Discord ideas",
    status: "active" as WorkflowStatus,
    lastRun: "Today, 10:45 AM",
    nextRun: "Today, 4:00 PM",
  },
  {
    id: "workflow-2",
    name: "Financial Analysis",
    description: "Daily sales data analysis and reporting",
    status: "completed" as WorkflowStatus,
    lastRun: "Today, 9:00 AM", 
    nextRun: "Tomorrow, 9:00 AM",
  },
  {
    id: "workflow-3",
    name: "Code Review",
    description: "Automated PR reviews on GitHub repositories",
    status: "idle" as WorkflowStatus,
    lastRun: "Yesterday, 5:30 PM",
    nextRun: "On PR creation",
  },
  {
    id: "workflow-4",
    name: "Customer Support",
    description: "Handles customer queries and generates responses",
    status: "error" as WorkflowStatus,
    lastRun: "Today, 11:23 AM",
    nextRun: "Manual restart required",
  },
];

const sampleAgents = [
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
];

const sampleLogs = [
  {
    id: "log-1",
    timestamp: "2023-05-22 12:01:23",
    message: "Content generation workflow completed successfully",
    source: "n8n Workflow",
    level: "success" as const,
  },
  {
    id: "log-2",
    timestamp: "2023-05-22 11:45:16",
    message: "Code Reviewer agent started PR analysis",
    source: "Agent Manager",
    level: "info" as const,
  },
  {
    id: "log-3",
    timestamp: "2023-05-22 11:30:05",
    message: "GitHub integration detected new PR #143",
    source: "Integration Service",
    level: "info" as const,
  },
  {
    id: "log-4",
    timestamp: "2023-05-22 11:23:55",
    message: "Customer Support agent failed to process query",
    source: "Agent Manager",
    level: "error" as const,
  },
  {
    id: "log-5",
    timestamp: "2023-05-22 10:15:30",
    message: "Memory usage exceeds 70% for Data Analysis agent",
    source: "System Monitor",
    level: "warning" as const,
  },
];

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="grid-status-card mb-8">
        <StatusCard 
          title="Active Agents" 
          value="2/3" 
          icon={<Bot className="h-5 w-5" />}
          trend={{ value: 5, positive: true }}
        />
        <StatusCard 
          title="Workflows Executed" 
          value="24" 
          icon={<Workflow className="h-5 w-5" />}
          trend={{ value: 12, positive: true }}
        />
        <StatusCard 
          title="Average Response Time" 
          value="1.8s" 
          icon={<LineChart className="h-5 w-5" />}
          trend={{ value: 8, positive: true }}
        />
        <StatusCard 
          title="Tasks Pending" 
          value="5" 
          icon={<GanttChart className="h-5 w-5" />}
          trend={{ value: 2, positive: false }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Workflows</h2>
          </div>
          <div className="grid-workflow">
            {sampleWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} {...workflow} />
            ))}
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Activity Log</h2>
          </div>
          <ActivityLog logs={sampleLogs} />
        </div>
      </div>
      
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">System Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            title="System Status"
            value="Operational"
            icon={<SparkleIcon className="h-5 w-5" />}
            variant="success"
          />
          <StatusCard
            title="API Latency"
            value="42ms"
            icon={<Loader className="h-5 w-5" />}
            variant="info"
          />
          <StatusCard
            title="CPU Usage"
            value="45%"
            icon={<Cpu className="h-5 w-5" />}
            variant="info"
          />
          <StatusCard
            title="Database Status"
            value="Connected"
            icon={<Database className="h-5 w-5" />}
            variant="success"
          />
        </div>
      </div>
      
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">AI Agents</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleAgents.map((agent) => (
            <AgentCard key={agent.id} {...agent} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
