
import React, { useEffect, useState } from "react";
import { 
  Bot, 
  Workflow, 
  LineChart, 
  GanttChart,
  SparkleIcon,
  Loader,
  Cpu,
  Database,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusCard from "@/components/dashboard/StatusCard";
import WorkflowCard from "@/components/dashboard/WorkflowCard";
import AgentCard from "@/components/dashboard/AgentCard";
import ActivityLog from "@/components/dashboard/ActivityLog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWorkflows, Workflow as WorkflowType } from "@/services/workflowService";
import { fetchAgents, Agent as AgentType } from "@/services/agentService";
import { fetchLogs, LogEntry, createLogEntry } from "@/services/logsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [systemHealth, setSystemHealth] = useState<{
    operational: boolean;
    apiLatency: number;
    cpuUsage: number;
    databaseConnected: boolean;
  }>({
    operational: true,
    apiLatency: 42,
    cpuUsage: 45,
    databaseConnected: true
  });

  // Fetch workflows from Supabase
  const { 
    data: workflows = [], 
    isLoading: isLoadingWorkflows,
    error: workflowError,
    refetch: refetchWorkflows
  } = useQuery({
    queryKey: ['workflows'],
    queryFn: fetchWorkflows
  });

  // Fetch agents from Supabase
  const { 
    data: agents = [], 
    isLoading: isLoadingAgents,
    error: agentError,
    refetch: refetchAgents
  } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents
  });

  // Fetch logs from Supabase
  const { 
    data: logs = [], 
    isLoading: isLoadingLogs,
    error: logsError,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['logs'],
    queryFn: () => fetchLogs(10)
  });

  // Setup real-time subscription for new logs
  useEffect(() => {
    const channel = supabase
      .channel('system-logs-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_logs'
        },
        (payload) => {
          // Invalidate logs query to refresh the data
          queryClient.invalidateQueries({ queryKey: ['logs'] });
          
          // Show toast for important events
          if (payload.new.level === 'error') {
            toast.error(payload.new.message, {
              description: `Source: ${payload.new.source}`,
            });
          } else if (payload.new.level === 'warning') {
            toast.warning(payload.new.message, {
              description: `Source: ${payload.new.source}`,
            });
          }
        }
      )
      .subscribe();
      
    // Simulate system activity
    const systemActivityInterval = setInterval(() => {
      const actions = [
        { action: "generateLog", probability: 0.3 },
        { action: "updateSystemHealth", probability: 0.1 },
      ];
      
      const randomValue = Math.random();
      let cumulativeProbability = 0;
      
      for (const { action, probability } of actions) {
        cumulativeProbability += probability;
        if (randomValue <= cumulativeProbability) {
          if (action === "generateLog") {
            generateRandomLogEntry();
          } else if (action === "updateSystemHealth") {
            updateSystemHealth();
          }
          break;
        }
      }
    }, 15000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(systemActivityInterval);
    };
  }, [queryClient]);

  // Generate random log entry for simulation
  const generateRandomLogEntry = async () => {
    const levels: ("info" | "warning" | "error" | "success")[] = ["info", "warning", "error", "success"];
    const sources = ["Agent Manager", "Workflow Engine", "Integration Service", "System Monitor", "Database Service"];
    const weightedLevels = [...Array(7).fill("info"), ...Array(2).fill("warning"), "error", ...Array(2).fill("success")];
    
    const messages = {
      info: [
        "Agent status update received",
        "Workflow execution started",
        "New integration connection established",
        "System health check completed",
        "User configuration updated"
      ],
      warning: [
        "High memory usage detected",
        "Slow database query detected",
        "API rate limit approaching threshold",
        "Agent response time degraded",
        "Workflow execution taking longer than expected"
      ],
      error: [
        "Failed to connect to external service",
        "Workflow execution failed",
        "Database query error",
        "Agent initialization error",
        "Integration authentication failed"
      ],
      success: [
        "Workflow executed successfully",
        "Agent task completed",
        "Database backup completed",
        "System update installed",
        "Integration synchronized successfully"
      ]
    };
    
    const level = weightedLevels[Math.floor(Math.random() * weightedLevels.length)] as "info" | "warning" | "error" | "success";
    const source = sources[Math.floor(Math.random() * sources.length)];
    const message = messages[level][Math.floor(Math.random() * messages[level].length)];
    
    // Randomly associate with workflow or agent
    let agentId = undefined;
    let workflowId = undefined;
    
    if (agents.length > 0 && Math.random() > 0.5) {
      agentId = agents[Math.floor(Math.random() * agents.length)].id;
    } else if (workflows.length > 0) {
      workflowId = workflows[Math.floor(Math.random() * workflows.length)].id;
    }
    
    try {
      await createLogEntry({
        level,
        source,
        message,
        details: { timestamp: new Date().toISOString() },
        agent_id: agentId,
        workflow_id: workflowId,
        task_id: null
      });
    } catch (error) {
      console.error("Error creating log entry:", error);
    }
  };
  
  // Simulate system health updates
  const updateSystemHealth = () => {
    setSystemHealth(prev => ({
      operational: Math.random() > 0.05 ? true : false,
      apiLatency: Math.floor(Math.random() * 100) + 20,
      cpuUsage: Math.floor(Math.min(Math.max(prev.cpuUsage + (Math.random() * 20 - 10), 15), 85)),
      databaseConnected: Math.random() > 0.02 ? true : false,
    }));
    
    setLastUpdated(new Date());
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      await Promise.all([
        refetchWorkflows(),
        refetchAgents(),
        refetchLogs()
      ]);
      
      updateSystemHealth();
      toast.success("Dashboard data refreshed");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  // Show errors if any
  useEffect(() => {
    if (workflowError) {
      toast.error(`Failed to load workflows: ${(workflowError as Error).message}`);
    }
    if (agentError) {
      toast.error(`Failed to load agents: ${(agentError as Error).message}`);
    }
    if (logsError) {
      toast.error(`Failed to load activity logs: ${(logsError as Error).message}`);
    }
  }, [workflowError, agentError, logsError]);

  // Calculate metrics for dashboard
  const activeAgents = agents.filter(a => a.status === 'online' || a.status === 'busy').length;
  const totalAgents = agents.length;
  const activeWorkflows = workflows.filter(w => w.status === 'active').length;
  const totalWorkflows = workflows.length;
  const workflowsExecutedToday = workflows.filter(w => w.last_run && new Date(w.last_run).toDateString() === new Date().toDateString()).length;
  
  // Calculate pending tasks based on active agents and workflows
  const pendingTasks = Math.floor(activeAgents * 1.5) + Math.floor(activeWorkflows * 2.5);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button 
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="grid-status-card mb-8">
        <StatusCard 
          title="Active Agents" 
          value={`${activeAgents}/${totalAgents}`} 
          icon={<Bot className="h-5 w-5" />}
          trend={{ value: activeAgents > 0 ? Math.floor((activeAgents / totalAgents) * 100) : 0, positive: true }}
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
          value={`${systemHealth.apiLatency}ms`}
          icon={<LineChart className="h-5 w-5" />}
          trend={{ value: systemHealth.apiLatency < 50 ? 8 : -8, positive: systemHealth.apiLatency < 50 }}
        />
        <StatusCard 
          title="Tasks Pending" 
          value={String(pendingTasks)} 
          icon={<GanttChart className="h-5 w-5" />}
          trend={{ value: pendingTasks < 10 ? 4 : -4, positive: pendingTasks < 10 }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Workflows</h2>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/workflows'}>
              View all
            </Button>
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
                  id={workflow.id}
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
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Activity Log</h2>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/monitoring'}>
              View all
            </Button>
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
            value={systemHealth.operational ? "Operational" : "Degraded"}
            icon={systemHealth.operational ? 
              <CheckCircle className="h-5 w-5 text-green-500" /> : 
              <AlertCircle className="h-5 w-5 text-yellow-500" />}
            variant={systemHealth.operational ? "success" : "warning"}
          />
          <StatusCard
            title="API Latency"
            value={`${systemHealth.apiLatency}ms`}
            icon={<Clock className="h-5 w-5" />}
            variant={systemHealth.apiLatency < 50 ? "success" : systemHealth.apiLatency < 100 ? "info" : "warning"}
          />
          <StatusCard
            title="CPU Usage"
            value={`${systemHealth.cpuUsage}%`}
            icon={<Cpu className="h-5 w-5" />}
            variant={systemHealth.cpuUsage < 50 ? "success" : systemHealth.cpuUsage < 80 ? "info" : "warning"}
          />
          <StatusCard
            title="Database Status"
            value={systemHealth.databaseConnected ? "Connected" : "Error"}
            icon={<Database className="h-5 w-5" />}
            variant={systemHealth.databaseConnected ? "success" : "error"}
          />
        </div>
      </div>
      
      <div>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">AI Agents</h2>
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/agents'}>
            View all
          </Button>
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
            agents.slice(0, 3).map((agent) => (
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
