"use client";

import { Bell, ChevronDown, PanelLeft } from "lucide-react";

interface BrandHeaderProps {
  title?: string;
}

export function BrandHeader({ title }: BrandHeaderProps) {
  return (
    <header className="flex h-11 w-full shrink-0 items-center border-b border-border bg-background">

      {/* Logo section — 218px wide, right-bordered, matches sidenav width */}
      <div className="flex h-11 w-52 shrink-0 items-center justify-start border-r border-border px-4">
        <button className="flex size-6 -ml-1 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground hover:bg-secondary">
          <PanelLeft className="h-3.5 w-3.5" />
        </button>
        <div className="flex items-center gap-1.5 ml-3 mb-1 mr-1">
          <img src="/lumos-symbol.svg" alt="" className="size-5 shrink-0" />
          <div className="text-h2 text-foreground mt-1">Lumos</div>
        </div>
        <button className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground">
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Breadcrumb — current page title */}
      <div className="flex flex-1 items-center gap-1.5 px-5">
        {title && (
          <>
            <span className="text-sm font-medium text-foreground">{title}</span>
            <span className="text-xs text-muted-foreground">/</span>
          </>
        )}
      </div>

      {/* Mode switcher */}
      <div className="flex h-6 items-center border-r border-border px-4">
        <button className="whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-foreground">
          View AppStore
        </button>
      </div>

      {/* Right — notifications, user, Albus */}
      <div className="flex h-full items-center gap-2 px-5">

        {/* Notification bell */}
        <button className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground hover:bg-secondary">
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500 ring-1 ring-background" />
        </button>

        {/* User avatar */}
        <div className="flex size-6  leading-none shrink-0 items-center justify-center rounded-full bg-primary text-body-medium text-primary-foreground">
          A
        </div>

        {/* Albus */}
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[20px] border-[1.4px] border-[#f83bf9] bg-background shadow-[0_0_4px_0_#fef0f0]">
          <img src="/lumos-symbol.svg" alt="Albus" className="h-3.5 w-3.5" />
        </div>

      </div>
    </header>
  );
}
