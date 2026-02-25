import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-secondary text-foreground",
        blue: "bg-[hsl(var(--background-data-blue))] text-[hsl(var(--foreground-data-blue))]",
        purple: "bg-[hsl(var(--background-data-purple))] text-[hsl(var(--foreground-data-purple))]",
        pink: "bg-[hsl(var(--background-data-pink))] text-[hsl(var(--foreground-data-pink))]",
        teal: "bg-[hsl(var(--background-data-teal))] text-[hsl(var(--foreground-data-teal))]",
        lemon: "bg-[hsl(var(--background-data-lemon))] text-[hsl(var(--foreground-data-lemon))]",
        orange: "bg-accent text-accent-foreground",
        success: "bg-[hsl(var(--background-container-success))] text-[hsl(var(--foreground-success))]",
        danger: "bg-[hsl(var(--background-container-danger))] text-[hsl(var(--foreground-danger))]",
        warning: "bg-[hsl(var(--background-container-warning))] text-[hsl(var(--foreground-warning))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface LumosBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function LumosBadge({ className, variant, ...props }: LumosBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { LumosBadge, badgeVariants };
