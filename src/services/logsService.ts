
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

export const createLogEntry = async (logEntry: Omit<LogEntry, "id" | "timestamp">) => {
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
