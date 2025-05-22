
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type LogLevel = "info" | "warning" | "error" | "success";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details: Record<string, any> | null;
  workflow_id: string | null;
  agent_id: string | null;
  task_id: string | null;
}

export type NewLogEntry = Omit<LogEntry, "id" | "timestamp">;

export const fetchLogs = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from("system_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }
    return data as LogEntry[];
  } catch (error: any) {
    toast.error(`Failed to fetch logs: ${error.message}`);
    return [];
  }
};

export const fetchLogsByLevel = async (level: LogLevel, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from("system_logs")
      .select("*")
      .eq("level", level)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }
    return data as LogEntry[];
  } catch (error: any) {
    toast.error(`Failed to fetch logs: ${error.message}`);
    return [];
  }
};

export const createLogEntry = async (logEntry: NewLogEntry) => {
  try {
    const { data, error } = await supabase
      .from("system_logs")
      .insert(logEntry)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return data as LogEntry;
  } catch (error: any) {
    console.error(`Failed to create log entry: ${error.message}`);
    // Don't show toast for log creation failures to avoid infinite loops
    throw error;
  }
};

export const fetchLogsBySource = async (source: string, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from("system_logs")
      .select("*")
      .eq("source", source)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }
    return data as LogEntry[];
  } catch (error: any) {
    toast.error(`Failed to fetch logs: ${error.message}`);
    return [];
  }
};

export const fetchLogsByWorkflow = async (workflowId: string, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from("system_logs")
      .select("*")
      .eq("workflow_id", workflowId)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }
    return data as LogEntry[];
  } catch (error: any) {
    toast.error(`Failed to fetch logs: ${error.message}`);
    return [];
  }
};

export const fetchLogsByAgent = async (agentId: string, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from("system_logs")
      .select("*")
      .eq("agent_id", agentId)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }
    return data as LogEntry[];
  } catch (error: any) {
    toast.error(`Failed to fetch logs: ${error.message}`);
    return [];
  }
};

export const clearLogs = async () => {
  try {
    // In a real app, you might archive logs instead of deleting them
    const { error } = await supabase
      .from("system_logs")
      .delete()
      .lt("timestamp", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Older than 30 days

    if (error) {
      throw error;
    }
    
    toast.success("Old logs cleared successfully");
    return true;
  } catch (error: any) {
    toast.error(`Failed to clear logs: ${error.message}`);
    return false;
  }
};
