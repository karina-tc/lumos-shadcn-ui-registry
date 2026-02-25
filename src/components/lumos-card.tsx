import * as React from "react";
import { cn } from "@/lib/utils";

function LumosCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 transition-shadow",
        "[box-shadow:-6px_12px_32px_-6px_rgba(0,0,0,0.16)]",
        "hover:[box-shadow:-6px_12px_40px_-6px_rgba(0,0,0,0.24)]",
        className
      )}
      {...props}
    />
  );
}

function LumosCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 pb-3", className)} {...props} />;
}

function LumosCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm font-semibold text-foreground", className)} {...props} />;
}

function LumosCardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-muted-foreground", className)} {...props} />;
}

function LumosCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-0", className)} {...props} />;
}

export {
  LumosCard,
  LumosCardHeader,
  LumosCardTitle,
  LumosCardDescription,
  LumosCardContent,
};
