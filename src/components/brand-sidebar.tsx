"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BrandSidebarProps {
  navItems?: NavItem[];
  footerItems?: NavItem[];
}

const defaultNav: NavItem[] = [
  { label: "Home", href: "#" },
  { label: "Apps", href: "#" },
  { label: "Users", href: "#" },
  { label: "Groups", href: "#" },
  { label: "Requests", href: "#", active: true },
  { label: "Policies", href: "#" },
];

export function BrandSidebar({
  navItems = defaultNav,
  footerItems = [],
}: BrandSidebarProps) {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar w-64">
      <SidebarHeader className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-sm bg-primary" />
          <span className="text-sm font-semibold text-sidebar-foreground">Lumos</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    className="text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  >
                    <a href={item.href}>{item.label}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {footerItems.length > 0 && (
        <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
          <SidebarMenu>
            {footerItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild className="text-sm text-sidebar-foreground">
                  <a href={item.href}>{item.label}</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
