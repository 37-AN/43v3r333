
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkflow, NewWorkflow, TriggerType } from "@/services/workflowService";

interface CreateWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateWorkflowDialog: React.FC<CreateWorkflowDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [triggerType, setTriggerType] = useState<TriggerType>("manual");
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewWorkflow>({
    defaultValues: {
      name: "",
      description: "",
      trigger_type: "manual",
      category: "uncategorized",
    }
  });

  const { mutate } = useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      reset();
      onOpenChange(false);
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("Error creating workflow:", error);
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: NewWorkflow) => {
    setIsSubmitting(true);
    mutate(data);
  };

  const handleTriggerTypeChange = (value: TriggerType) => {
    setTriggerType(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Create a new automation workflow. Configure how it triggers and what it does.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                {...register("name", { required: "Workflow name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs col-start-2 col-span-3">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3 resize-none"
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select 
                onValueChange={(value) => register("category").onChange({ target: { value } })}
                defaultValue="uncategorized"
              >
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">Content Management</SelectItem>
                  <SelectItem value="finance">Finance & Accounting</SelectItem>
                  <SelectItem value="development">Development & CI/CD</SelectItem>
                  <SelectItem value="support">Customer Support</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="uncategorized">Uncategorized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trigger_type" className="text-right">
                Trigger Type
              </Label>
              <Select 
                onValueChange={(value: TriggerType) => {
                  handleTriggerTypeChange(value);
                  register("trigger_type").onChange({ target: { value } });
                }}
                defaultValue="manual"
              >
                <SelectTrigger id="trigger_type" className="col-span-3">
                  <SelectValue placeholder="How will this workflow trigger?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Trigger</SelectItem>
                  <SelectItem value="scheduled">Schedule (Cron)</SelectItem>
                  <SelectItem value="event">Event Based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {triggerType === "scheduled" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cron_schedule" className="text-right">
                  Cron Schedule
                </Label>
                <Input
                  id="cron_schedule"
                  className="col-span-3"
                  placeholder="0 12 * * *"
                  {...register("cron_schedule", {
                    required: triggerType === "scheduled" ? "Cron schedule is required for scheduled workflows" : false
                  })}
                />
                {errors.cron_schedule && (
                  <p className="text-red-500 text-xs col-start-2 col-span-3">
                    {errors.cron_schedule.message}
                  </p>
                )}
              </div>
            )}

            {triggerType === "event" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event_trigger" className="text-right">
                  Event Trigger
                </Label>
                <Input
                  id="event_trigger"
                  className="col-span-3"
                  placeholder="github.pull_request.created"
                  {...register("event_trigger", {
                    required: triggerType === "event" ? "Event trigger is required for event-based workflows" : false
                  })}
                />
                {errors.event_trigger && (
                  <p className="text-red-500 text-xs col-start-2 col-span-3">
                    {errors.event_trigger.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Workflow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkflowDialog;
