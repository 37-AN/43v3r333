
import React from "react";
import { LineChart, Download, RefreshCcw, ChevronDown, AlertCircle } from "lucide-react";
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
import ActivityLog from "@/components/dashboard/ActivityLog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: '00:00', value: 2, memory: 45 },
  { time: '03:00', value: 3, memory: 43 },
  { time: '06:00', value: 5, memory: 47 },
  { time: '09:00', value: 15, memory: 52 },
  { time: '12:00', value: 12, memory: 58 },
  { time: '15:00', value: 8, memory: 51 },
  { time: '18:00', value: 20, memory: 60 },
  { time: '21:00', value: 25, memory: 65 },
  { time: '24:00', value: 15, memory: 55 },
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
  {
    id: "log-6",
    timestamp: "2023-05-22 10:05:22",
    message: "Database backup complete - 235MB stored in S3",
    source: "Database Service",
    level: "info" as const,
  },
  {
    id: "log-7",
    timestamp: "2023-05-22 09:45:11",
    message: "New Discord message processed and assigned to workflow",
    source: "Discord Integration",
    level: "info" as const,
  },
  {
    id: "log-8",
    timestamp: "2023-05-22 09:32:45",
    message: "Agent 'Content Writer' restarted successfully",
    source: "Agent Manager",
    level: "success" as const,
  },
  {
    id: "log-9",
    timestamp: "2023-05-22 09:15:30",
    message: "Slow query detected in PostgreSQL - took 3.2s to complete",
    source: "Database Monitor",
    level: "warning" as const,
  },
  {
    id: "log-10",
    timestamp: "2023-05-22 08:45:17",
    message: "Daily system health check completed",
    source: "System Monitor",
    level: "info" as const,
  },
];

const MonitoringPage: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState("24h");
  const [search, setSearch] = React.useState("");
  const [source, setSource] = React.useState("all");
  const [level, setLevel] = React.useState("all");
  
  const filteredLogs = sampleLogs.filter(log => {
    const matchesSearch = search === "" || 
                         log.message.toLowerCase().includes(search.toLowerCase()) || 
                         log.source.toLowerCase().includes(search.toLowerCase());
    const matchesSource = source === "all" || log.source === source;
    const matchesLevel = level === "all" || log.level === level;
    
    return matchesSearch && matchesSource && matchesLevel;
  });
  
  const sources = ["all", ...Array.from(new Set(sampleLogs.map(log => log.source)))];
  const levels = ["all", ...Array.from(new Set(sampleLogs.map(log => log.level)))];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">System Metrics</h2>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="6h">Last 6 Hours</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">CPU Usage</h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <LineChart className="h-3 w-3 mr-1" />
                  Avg: 12.5%
                </div>
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      domain={[0, 'dataMax + 10']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E293B', 
                        borderColor: '#334155',
                        borderRadius: '0.375rem',
                      }}
                      itemStyle={{ color: '#E2E8F0' }}
                      labelStyle={{ color: '#94A3B8' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2563EB" 
                      fill="#2563EB20"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Memory Usage</h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <LineChart className="h-3 w-3 mr-1" />
                  Avg: 52.8%
                </div>
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E293B', 
                        borderColor: '#334155',
                        borderRadius: '0.375rem',
                      }}
                      itemStyle={{ color: '#E2E8F0' }}
                      labelStyle={{ color: '#94A3B8' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="memory" 
                      stroke="#10B981" 
                      fill="#10B98120"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">System Logs</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((src) => (
                    <SelectItem key={src} value={src}>
                      {src === "all" ? "All Sources" : src}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl === "all" ? "All Levels" : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <ActivityLog logs={filteredLogs} />
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {sampleLogs.length} logs
            </div>
            <Button variant="outline" size="sm">
              Load More
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-500">System Alert</h3>
              <p className="mt-1">
                Memory usage has been consistently high over the past 24 hours.
                Consider optimizing or scaling your resources to prevent performance issues.
              </p>
              <Button variant="outline" size="sm" className="mt-2 bg-card border-border hover:bg-secondary">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MonitoringPage;
