
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type AgentStatus = "online" | "offline" | "busy" | "error";
export type AgentType = "content" | "code" | "data" | "support" | "finance";

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  model: string;
  type: AgentType;
  status: AgentStatus;
  capabilities: string[];
  config: Record<string, any> | null;
  last_action: string | null;
  cpu_usage: number | null;
  memory_usage: number | null;
  created_at: string;
  updated_at: string;
}

// Type for creating a new agent - requires the minimal fields needed by Supabase
export interface NewAgent {
  name: string;
  model: string;
  type: AgentType;
  capabilities: string[];
  description?: string | null;
  status?: AgentStatus;
  config?: Record<string, any> | null;
  last_action?: string | null;
  cpu_usage?: number | null;
  memory_usage?: number | null;
}

export const fetchAgents = async () => {
  try {
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }
    return data as Agent[];
  } catch (error: any) {
    toast.error(`Failed to fetch agents: ${error.message}`);
    return [];
  }
};

export const fetchAgentById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }
    
    return data as Agent;
  } catch (error: any) {
    toast.error(`Failed to fetch agent: ${error.message}`);
    throw error;
  }
};

export const createAgent = async (agent: NewAgent) => {
  try {
    const { data, error } = await supabase
      .from("agents")
      .insert(agent)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    toast.success("Agent created successfully");
    return data as Agent;
  } catch (error: any) {
    toast.error(`Failed to create agent: ${error.message}`);
    throw error;
  }
};

export const updateAgent = async (id: string, updates: Partial<Agent>) => {
  try {
    const { data, error } = await supabase
      .from("agents")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    toast.success("Agent updated successfully");
    return data as Agent;
  } catch (error: any) {
    toast.error(`Failed to update agent: ${error.message}`);
    throw error;
  }
};

export const deleteAgent = async (id: string) => {
  try {
    const { error } = await supabase
      .from("agents")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    
    return true;
  } catch (error: any) {
    toast.error(`Failed to delete agent: ${error.message}`);
    throw error;
  }
};

export const toggleAgentStatus = async (id: string, currentStatus: AgentStatus) => {
  // Toggle between online and offline
  const newStatus: AgentStatus = currentStatus === "online" ? "offline" : "online";
  
  try {
    const { data, error } = await supabase
      .from("agents")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    toast.success(`Agent ${newStatus === "online" ? "started" : "stopped"} successfully`);
    return data as Agent;
  } catch (error: any) {
    toast.error(`Failed to update agent status: ${error.message}`);
    throw error;
  }
};
