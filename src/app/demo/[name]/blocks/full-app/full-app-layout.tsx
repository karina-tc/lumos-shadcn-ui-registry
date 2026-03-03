"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BrandHeader } from "@/components/brand-header";
import { BrandSidebar } from "@/components/brand-sidebar";

const routes: { label: string; href: string; title: string }[] = [
  { label: "Apps", href: "/", title: "Applications" },
  { label: "Identities", href: "/identities", title: "Identities" },
  { label: "Accounts", href: "/accounts", title: "Accounts" },
  { label: "Access Reviews", href: "/access-reviews", title: "Access Reviews" },
  { label: "Access Policies", href: "/access-policies", title: "Access Policies" },
  { label: "Ask Albus", href: "/albus", title: "Ask Albus" },
  { label: "Analytics", href: "/analytics", title: "Analytics" },
  { label: "Onboarding", href: "/onboarding", title: "Onboarding" },
  { label: "Offboarding", href: "/offboarding", title: "Offboarding" },
  { label: "Activity Log", href: "/activity-log", title: "Activity Log" },
  { label: "Integrations", href: "/integrations", title: "Integrations" },
  { label: "Tasks", href: "/tasks", title: "Tasks" },
  { label: "Settings", href: "/settings", title: "Settings" },
];

const navSections = [
  {
    title: "Products",
    items: [
      { label: "Ask Albus", href: "/albus" },
      { label: "Analytics", href: "/analytics" },
      { label: "Access Reviews", href: "/access-reviews" },
      {
        label: "Employee Lifecycle",
        subItems: [
          { label: "Onboarding", href: "/onboarding" },
          { label: "Offboarding", href: "/offboarding" },
        ],
      },
    ],
  },
  {
    title: "Inventory",
    items: [
      { label: "Apps", href: "/" },
      { label: "Identities", href: "/identities" },
      { label: "Accounts", href: "/accounts" },
      { label: "Access Policies", href: "/access-policies" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Activity Log", href: "/activity-log" },
      { label: "Integrations", href: "/integrations" },
      { label: "Tasks", href: "/tasks", badge: 2 },
      { label: "Settings", href: "/settings" },
    ],
  },
];

function getActiveItem(pathname: string): string | undefined {
  // Exact match first, then prefix match for nested routes like /albus/chat
  const exact = routes.find((r) => r.href === pathname);
  if (exact) return exact.label;
  const prefix = routes
    .filter((r) => r.href !== "/" && pathname.startsWith(r.href))
    .sort((a, b) => b.href.length - a.href.length);
  return prefix[0]?.label;
}

function getTitle(pathname: string): string {
  const active = routes.find((r) => r.href === pathname);
  if (active) return active.title;
  const prefix = routes
    .filter((r) => r.href !== "/" && pathname.startsWith(r.href))
    .sort((a, b) => b.href.length - a.href.length);
  return prefix[0]?.title ?? "";
}

export function FullAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidenavOpen, setSidenavOpen] = useState(true);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <BrandHeader
        title={getTitle(pathname)}
        sidenavOpen={sidenavOpen}
        onToggleSidenav={() => setSidenavOpen((o) => !o)}
      />
      <div className="flex flex-1 overflow-hidden">
        <BrandSidebar
          navSections={navSections}
          activeItem={getActiveItem(pathname)}
          open={sidenavOpen}
        />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
