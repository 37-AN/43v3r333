
import React, { useEffect, useState } from "react";
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
import WorkflowCard from "@/components/dashboard/WorkflowCard";
import AgentCard from "@/components/dashboard/AgentCard";
import ActivityLog from "@/components/dashboard/ActivityLog";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkflows, Workflow as WorkflowType } from "@/services/workflowService";
import { fetchAgents, Agent as AgentType } from "@/services/agentService";
import { fetchLogs, LogEntry } from "@/services/logsService";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  // Fetch workflows from Supabase
  const { 
    data: workflows = [], 
    isLoading: isLoadingWorkflows,
    error: workflowError
  } = useQuery({
    queryKey: ['workflows'],
    queryFn: fetchWorkflows
  });

  // Fetch agents from Supabase
  const { 
    data: agents = [], 
    isLoading: isLoadingAgents,
    error: agentError
  } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents
  });

  // Fetch logs from Supabase
  const { 
    data: logs = [], 
    isLoading: isLoadingLogs,
    error: logsError
  } = useQuery({
    queryKey: ['logs'],
    queryFn: () => fetchLogs(10)
  });

  // Show errors if any
  useEffect(() => {
    if (workflowError) {
      toast.error("Failed to load workflows");
    }
    if (agentError) {
      toast.error("Failed to load agents");
    }
    if (logsError) {
      toast.error("Failed to load activity logs");
    }
  }, [workflowError, agentError, logsError]);

  // Calculate metrics for dashboard
  const activeAgents = agents.filter(a => a.status === 'online').length;
  const totalAgents = agents.length;
  const totalWorkflows = workflows.length;
  const workflowsExecutedToday = workflows.filter(w => w.last_run && new Date(w.last_run).toDateString() === new Date().toDateString()).length;
  const pendingTasks = 5; // Mock data for now

  return (
    <DashboardLayout>
      <div className="grid-status-card mb-8">
        <StatusCard 
          title="Active Agents" 
          value={`${activeAgents}/${totalAgents}`} 
          icon={<Bot className="h-5 w-5" />}
          trend={{ value: 5, positive: true }}
          loading={isLoadingAgents}
        />
        <StatusCard 
          title="Workflows Executed" 
          value={String(workflowsExecutedToday)} 
          icon={<Workflow className="h-5 w-5" />}
          trend={{ value: 12, positive: true }}
          loading={isLoadingWorkflows}
        />
        <StatusCard 
          title="Average Response Time" 
          value="1.8s" 
          icon={<LineChart className="h-5 w-5" />}
          trend={{ value: 8, positive: true }}
        />
        <StatusCard 
          title="Tasks Pending" 
          value={String(pendingTasks)} 
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
            {isLoadingWorkflows ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm h-[200px] animate-pulse">
                  <div className="p-6 h-full bg-secondary/20"></div>
                </div>
              ))
            ) : workflows.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No workflows found</h3>
                <p className="text-muted-foreground">Create a new workflow to get started.</p>
              </div>
            ) : (
              workflows.slice(0, 4).map((workflow) => (
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
        </div>
        
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Activity Log</h2>
          </div>
          <ActivityLog 
            logs={logs.map(log => ({
              id: log.id,
              timestamp: log.timestamp,
              message: log.message,
              source: log.source,
              level: log.level
            }))}
            isLoading={isLoadingLogs}
          />
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
          {isLoadingAgents ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm h-[250px] animate-pulse">
                <div className="p-6 h-full bg-secondary/20"></div>
              </div>
            ))
          ) : agents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No agents found</h3>
              <p className="text-muted-foreground">Create a new agent to get started.</p>
            </div>
          ) : (
            agents.map((agent) => (
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

export default Dashboard;
