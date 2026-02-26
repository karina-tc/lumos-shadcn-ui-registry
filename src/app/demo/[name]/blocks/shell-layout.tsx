import React, { type ReactNode } from "react";
import { BrandHeader } from "@/components/brand-header";
import { BrandSidebar } from "@/components/brand-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarInset>
        <BrandHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 bg-background min-h-screen">
          <BrandSidebar />
          <div className="flex-1">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
