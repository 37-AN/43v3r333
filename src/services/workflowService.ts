
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type WorkflowStatus = "active" | "idle" | "error" | "completed";
export type TriggerType = "scheduled" | "event" | "manual";

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  status: WorkflowStatus;
  trigger_type: TriggerType;
  cron_schedule: string | null;
  event_trigger: string | null;
  n8n_workflow_id: string | null;
  config: Record<string, any> | null;
  last_run: string | null;
  next_run: string | null;
  created_at: string;
  updated_at: string;
}

// Type for creating a new workflow - requires the minimal fields needed by Supabase
export interface NewWorkflow {
  name: string;
  trigger_type: TriggerType;
  description?: string | null;
  category?: string | null;
  status?: WorkflowStatus;
  cron_schedule?: string | null;
  event_trigger?: string | null;
  n8n_workflow_id?: string | null;
  config?: Record<string, any> | null;
  last_run?: string | null;
  next_run?: string | null;
}

export const fetchWorkflows = async () => {
  try {
    const { data, error } = await supabase
      .from("workflows")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }
    return data as Workflow[];
  } catch (error: any) {
    toast.error(`Failed to fetch workflows: ${error.message}`);
    return [];
  }
};

export const fetchWorkflowsByCategory = async (category: string) => {
  try {
    const { data, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("category", category)
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }
    return data as Workflow[];
  } catch (error: any) {
    toast.error(`Failed to fetch workflows: ${error.message}`);
    return [];
  }
};

export const createWorkflow = async (workflow: NewWorkflow) => {
  try {
    const { data, error } = await supabase
      .from("workflows")
      .insert(workflow)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    toast.success("Workflow created successfully");
    return data as Workflow;
  } catch (error: any) {
    toast.error(`Failed to create workflow: ${error.message}`);
    throw error;
  }
};

export const updateWorkflow = async (id: string, updates: Partial<Workflow>) => {
  try {
    const { data, error } = await supabase
      .from("workflows")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    toast.success("Workflow updated successfully");
    return data as Workflow;
  } catch (error: any) {
    toast.error(`Failed to update workflow: ${error.message}`);
    throw error;
  }
};

export const deleteWorkflow = async (id: string) => {
  try {
    const { error } = await supabase
      .from("workflows")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    
    toast.success("Workflow deleted successfully");
    return true;
  } catch (error: any) {
    toast.error(`Failed to delete workflow: ${error.message}`);
    throw error;
  }
};
