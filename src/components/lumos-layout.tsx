"use client";

import { useState, type ReactNode } from "react";
import { BrandHeader } from "@/components/brand-header";
import { BrandSidebar } from "@/components/brand-sidebar";

interface LumosLayoutProps {
  children: ReactNode;
  activeItem?: string;
  title?: string;
}

export function LumosLayout({ children, activeItem, title }: LumosLayoutProps) {
  const [sidenavOpen, setSidenavOpen] = useState(true);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <BrandHeader title={title} sidenavOpen={sidenavOpen} onToggleSidenav={() => setSidenavOpen((o) => !o)} />
      <div className="flex flex-1 overflow-hidden">
        <BrandSidebar activeItem={activeItem} open={sidenavOpen} />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
