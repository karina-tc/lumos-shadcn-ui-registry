"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  active?: boolean;
  badge?: number;
  subItems?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const defaultNav: NavSection[] = [
  {
    title: "Products",
    items: [
      { label: "Ask Albus" },
      { label: "Identity Intelligence" },
      { label: "Analytics" },
      { label: "AppStore" },
      { label: "Access Reviews" },
      { label: "Employee Lifecycle", subItems: ["Onboarding", "Movers", "Offboarding"] },
    ],
  },
  {
    title: "Inventory",
    items: [
      { label: "Apps" },
      { label: "Identities" },
      { label: "Accounts" },
      { label: "Access Policies" },
      { label: "Vendors", subItems: ["Managed Agreements", "Spend Records", "Found Documents"] },
      { label: "Knowledge Hub" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Activity Log" },
      { label: "Integrations" },
      { label: "Tasks", badge: 2 },
      { label: "Settings" },
    ],
  },
];

interface BrandSidebarProps {
  navSections?: NavSection[];
  activeItem?: string;
  open?: boolean;
}

export function BrandSidebar({ navSections = defaultNav, activeItem, open = true }: BrandSidebarProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (label: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  return (
    <div className={`flex h-full shrink-0 flex-col bg-sidebar overflow-y-auto overflow-x-hidden transition-[width] duration-300 ease-in-out ${open ? "w-52" : "w-0 border-r-0"}`}>
      <div className="flex flex-col gap-5 pt-6 pb-2 px-0">
        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col">
            <div className="px-4 pb-1">
              <p className="text-xs text-muted-foreground">{section.title}</p>
            </div>

            {section.items.map((item) => (
              <div key={item.label}>
                <div className="px-1 py-0.5">
                  <button
                    className={`w-full h-8 rounded-2xl px-3 flex items-center gap-2 text-sm transition-colors hover:bg-muted ${
                      item.active || item.label === activeItem
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground"
                    }`}
                    onClick={() => item.subItems && toggle(item.label)}
                  >
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge != null && (
                      <span className="bg-muted text-muted-foreground text-xs rounded-2xl px-1.5 py-0.5 min-w-[1.25rem] text-center">
                        {item.badge}
                      </span>
                    )}
                    {item.subItems && (
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                          expanded.has(item.label) ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                </div>

                {item.subItems && expanded.has(item.label) && (
                  <div className="flex flex-col pl-4">
                    {item.subItems.map((sub) => (
                      <div key={sub} className="py-0.5 border-l border-sidebar-border">
                        <button className="w-full h-8 flex items-center gap-2 text-sm text-sidebar-foreground hover:bg-muted transition-colors">
                          <span className="w-5 shrink-0" />
                          <span className="flex-1 text-left truncate">{sub}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
