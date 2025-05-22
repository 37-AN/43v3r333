
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAgent, NewAgent, AgentType } from "@/services/agentService";

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const modelOptions = [
  { value: "LLama 3 70B", label: "LLama 3 (70B)" },
  { value: "LLama 3 8B", label: "LLama 3 (8B)" },
  { value: "Mistral Medium", label: "Mistral (Medium)" },
  { value: "Mistral Large", label: "Mistral (Large)" },
  { value: "Claude 3 Opus", label: "Claude 3 (Opus)" },
  { value: "Claude 3 Sonnet", label: "Claude 3 (Sonnet)" },
  { value: "GPT-4o", label: "GPT-4o" },
];

const capabilityOptions = [
  { id: "writing", label: "Content Writing" },
  { id: "summarization", label: "Text Summarization" },
  { id: "translation", label: "Translation" },
  { id: "code_review", label: "Code Review" },
  { id: "bug_identification", label: "Bug Identification" },
  { id: "testing", label: "Testing" },
  { id: "data_analysis", label: "Data Analysis" },
  { id: "visualization", label: "Data Visualization" },
  { id: "forecasting", label: "Forecasting" },
];

const CreateAgentDialog: React.FC<CreateAgentDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewAgent>({
    defaultValues: {
      name: "",
      description: "",
      model: "LLama 3 70B",
      type: "content",
      capabilities: [],
    }
  });

  const { mutate } = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      reset();
      setSelectedCapabilities([]);
      onOpenChange(false);
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("Error creating agent:", error);
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: Omit<NewAgent, 'capabilities'> & { capabilities?: string[] }) => {
    setIsSubmitting(true);
    const newAgent: NewAgent = {
      ...data,
      capabilities: selectedCapabilities,
    };
    mutate(newAgent);
  };

  const handleCapabilityToggle = (capability: string, checked: boolean) => {
    if (checked) {
      setSelectedCapabilities([...selectedCapabilities, capability]);
    } else {
      setSelectedCapabilities(selectedCapabilities.filter(c => c !== capability));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New AI Agent</DialogTitle>
          <DialogDescription>
            Create a new AI agent with specific capabilities and model.
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
                {...register("name", { required: "Agent name is required" })}
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
              <Label htmlFor="model" className="text-right">
                AI Model
              </Label>
              <Select 
                onValueChange={(value) => register("model").onChange({ target: { value } })}
                defaultValue="LLama 3 70B"
              >
                <SelectTrigger id="model" className="col-span-3">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Agent Type
              </Label>
              <Select 
                onValueChange={(value: AgentType) => register("type").onChange({ target: { value } })}
                defaultValue="content"
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Capabilities
              </Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {capabilityOptions.map((capability) => (
                  <div key={capability.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={capability.id} 
                      checked={selectedCapabilities.includes(capability.id)}
                      onCheckedChange={(checked) => handleCapabilityToggle(capability.id, checked as boolean)}
                    />
                    <Label htmlFor={capability.id} className="cursor-pointer">
                      {capability.label}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedCapabilities.length === 0 && (
                <p className="text-red-500 text-xs col-start-2 col-span-3">
                  At least one capability is required
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || selectedCapabilities.length === 0}
            >
              {isSubmitting ? "Creating..." : "Create Agent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAgentDialog;
