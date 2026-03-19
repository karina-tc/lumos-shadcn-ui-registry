"use client";

import React, { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandHeader } from "@/components/brand-header";
import { BrandSidebar } from "@/components/brand-sidebar";

const routes: Array<{ path: string; title: string }> = [
  { path: "/", title: "Ask Albus" },
  { path: "/identities", title: "Identities" },
  { path: "/apps", title: "Apps" },
  { path: "/accounts", title: "Accounts" },
  { path: "/access-reviews", title: "Access Reviews" },
  { path: "/onboarding", title: "Onboarding" },
  { path: "/offboarding", title: "Offboarding" },
  { path: "/activity-log", title: "Activity Log" },
  { path: "/tasks", title: "Tasks" },
  { path: "/access-policies", title: "Access Policies" },
  { path: "/analytics", title: "Analytics" },
  { path: "/integrations", title: "Integrations" },
  { path: "/settings", title: "Settings" },
];

export function FullAppShell({ children }: { children: ReactNode }) {
  const [sidenavOpen, setSidenavOpen] = useState(true);
  const pathname = usePathname();

  const currentRoute = routes.find((r) => r.path === pathname);
  const title = currentRoute?.title || "";

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <BrandHeader
        title={title}
        sidenavOpen={sidenavOpen}
        onToggleSidenav={() => setSidenavOpen((o) => !o)}
      />
      <div className="flex flex-1 overflow-hidden">
        <BrandSidebar open={sidenavOpen} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
