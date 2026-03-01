"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BrandHeader } from "@/components/brand-header";
import { BrandSidebar } from "@/components/brand-sidebar";

const BASE = "/preview";

const routes: { label: string; href: string; title: string }[] = [
  { label: "Apps", href: `${BASE}`, title: "Applications" },
  { label: "Identities", href: `${BASE}/identities`, title: "Identities" },
  { label: "Accounts", href: `${BASE}/accounts`, title: "Accounts" },
  { label: "Access Reviews", href: `${BASE}/access-reviews`, title: "Access Reviews" },
  { label: "Access Policies", href: `${BASE}/access-policies`, title: "Access Policies" },
  { label: "Ask Albus", href: `${BASE}/albus`, title: "Ask Albus" },
  { label: "Analytics", href: `${BASE}/analytics`, title: "Analytics" },
  { label: "Onboarding", href: `${BASE}/onboarding`, title: "Onboarding" },
  { label: "Offboarding", href: `${BASE}/offboarding`, title: "Offboarding" },
  { label: "Activity Log", href: `${BASE}/activity-log`, title: "Activity Log" },
  { label: "Integrations", href: `${BASE}/integrations`, title: "Integrations" },
  { label: "Tasks", href: `${BASE}/tasks`, title: "Tasks" },
  { label: "Settings", href: `${BASE}/settings`, title: "Settings" },
];

const navSections = [
  {
    title: "Products",
    items: [
      { label: "Ask Albus", href: `${BASE}/albus` },
      { label: "Analytics", href: `${BASE}/analytics` },
      { label: "Access Reviews", href: `${BASE}/access-reviews` },
      {
        label: "Employee Lifecycle",
        subItems: [
          { label: "Onboarding", href: `${BASE}/onboarding` },
          { label: "Offboarding", href: `${BASE}/offboarding` },
        ],
      },
    ],
  },
  {
    title: "Inventory",
    items: [
      { label: "Apps", href: `${BASE}` },
      { label: "Identities", href: `${BASE}/identities` },
      { label: "Accounts", href: `${BASE}/accounts` },
      { label: "Access Policies", href: `${BASE}/access-policies` },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Activity Log", href: `${BASE}/activity-log` },
      { label: "Integrations", href: `${BASE}/integrations` },
      { label: "Tasks", href: `${BASE}/tasks`, badge: 2 },
      { label: "Settings", href: `${BASE}/settings` },
    ],
  },
];

function getActiveItem(pathname: string): string | undefined {
  const exact = routes.find((r) => r.href === pathname);
  if (exact) return exact.label;
  const prefix = routes
    .filter((r) => r.href !== BASE && pathname.startsWith(r.href))
    .sort((a, b) => b.href.length - a.href.length);
  return prefix[0]?.label;
}

function getTitle(pathname: string): string {
  const active = routes.find((r) => r.href === pathname);
  if (active) return active.title;
  const prefix = routes
    .filter((r) => r.href !== BASE && pathname.startsWith(r.href))
    .sort((a, b) => b.href.length - a.href.length);
  return prefix[0]?.title ?? "";
}

export function PreviewShell({ children }: { children: ReactNode }) {
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
