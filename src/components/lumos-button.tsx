import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/85 active:bg-primary/70",
        secondary:
          "border-input bg-secondary text-foreground hover:bg-secondary/80 active:bg-secondary/60",
        danger:
          "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 active:bg-destructive/30",
        ghost:
          "bg-transparent text-foreground hover:bg-secondary active:bg-secondary/80",
        accent:
          "border-border bg-accent text-accent-foreground hover:bg-accent/80",
      },
      size: {
        md: "h-8 px-4 text-sm",
        sm: "h-6 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface LumosButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const LumosButton = React.forwardRef<HTMLButtonElement, LumosButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
LumosButton.displayName = "LumosButton";

export { LumosButton, buttonVariants };
