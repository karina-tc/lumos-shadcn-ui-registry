"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface LumosHeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

export function BrandHeader({ title, actions }: LumosHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 w-full">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-4" />
      {title && (
        <h1 className="text-sm font-medium text-foreground">{title}</h1>
      )}
      {actions && (
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
