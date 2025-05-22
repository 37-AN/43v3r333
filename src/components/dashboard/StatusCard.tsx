
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const statusCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm p-6 transition-all",
  {
    variants: {
      variant: {
        default: "border-border",
        success: "border-green-500/50 bg-green-500/10",
        warning: "border-yellow-500/50 bg-yellow-500/10",
        danger: "border-red-500/50 bg-red-500/10",
        info: "border-blue-500/50 bg-blue-500/10",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface StatusCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusCardVariants> {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  loading?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  className,
  variant,
  size,
  title,
  value,
  icon,
  trend,
  loading = false,
  ...props
}) => {
  return (
    <div
      className={cn(statusCardVariants({ variant, size }), className)}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <h3 className="text-sm font-medium leading-none text-muted-foreground">
            {title}
          </h3>
          <div className="flex items-center">
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-muted-foreground" />
                <span className="text-2xl font-bold">...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold">{value}</div>
            )}
          </div>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      {trend && !loading && (
        <div className="mt-4 flex items-center text-xs">
          <span
            className={cn(
              "flex items-center font-medium",
              trend.positive ? "text-green-500" : "text-red-500"
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}%
          </span>
          <span className="ml-1.5 text-muted-foreground">from previous period</span>
        </div>
      )}
    </div>
  );
};

export default StatusCard;
