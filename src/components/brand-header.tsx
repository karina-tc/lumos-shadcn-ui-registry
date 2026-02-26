"use client";

import { useState } from "react";
import { Bell, ChevronDown, LogOut, PanelLeft, ScanFace, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

function SidenavToggle({ open, onClick }: { open: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative -ml-1 flex shrink-0 items-center pr-2"
    >
      {/* 24px circle */}
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-input bg-background transition-colors duration-150 hover:bg-[#e5e7eb]">
        <PanelLeft className="size-[14px] text-foreground" />
      </div>

      {/* Arrow indicator */}
      <span
        aria-hidden
        className={`pointer-events-none absolute left-[11px] top-2.5 size-2 text-foreground transition-all duration-200 ease-out ${
          open ? "left-[12px] rotate-180" : "left-[11px] rotate-0"
        }`}
      >
        <svg className="scale-70" width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 4h6M4.5 1.5L7 4l-2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}

interface BrandHeaderProps {
  title?: string;
  sidenavOpen?: boolean;
  onToggleSidenav?: () => void;
}

export function BrandHeader({ title, sidenavOpen = true, onToggleSidenav }: BrandHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="flex h-11 w-full shrink-0 items-center border-b border-border bg-background">

      {/* Logo section — 218px wide, right-bordered when sidenav open, matches sidenav width */}
      <div
        className={`flex h-11 shrink-0 items-center justify-start px-4 ${sidenavOpen ? "w-52" : "w-40"} transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) delay-[50ms]`}
      >
        <SidenavToggle open={sidenavOpen} onClick={onToggleSidenav} />
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
        <button className="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-input bg-background text-muted-foreground hover:bg-secondary">
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500 ring-1 ring-background" />
        </button>

        {/* User avatar — opens account menu */}
        <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="group flex size-7 overflow-hidden relative leading-none shrink-0 items-center justify-center rounded-full text-body-normal text-primary-foreground bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 hover:from-orange-400 hover:via-red-600 hover:to-fuchsia-500 transition-all duration-300 cursor-pointer !ring-none !outline-none"
              aria-label="Open account menu"
            >
              <span
                className={`leading-none inline-flex size-7 text-center items-center justify-center transition-all duration-300 ${userMenuOpen ? "scale-10 opacity-0" : "group-hover:scale-10 group-hover:opacity-0"}`}
              >
                A
              </span>
              <span
                className={`absolute inset-0 size-7 leading-none inline-flex text-center items-center justify-center transition-all duration-300 ${userMenuOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:opacity-100 group-hover:scale-100"}`}
              >
                <ScanFace className="size-4" />
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border-border p-0 shadow-lg">
            <div className="flex items-center gap-3 p-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
                A
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">Andrej Safundzic</p>
                <p className="truncate text-xs text-muted-foreground">andrej@lumos.com</p>
              </div>
            </div>
            <div className="p-1">
              {[
                { icon: UserCog, label: "Delegation Preferences" },
                { icon: Bell, label: "Notification Settings" },
              ].map(({ icon: Icon, label }) => (
                <DropdownMenuItem
                  key={label}
                  className="flex h-8 cursor-pointer items-center rounded-lg focus:bg-secondary focus:text-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="size-4" />
                  {label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                variant="destructive"
                className="flex h-8 cursor-pointer items-center rounded-lg focus:bg-destructive/10 focus:text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4" />
                Sign Out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Albus */}
        <Button variant="tertiary" className="-mr-5 px-3 h-7">Ask Albus</Button>

      </div>
    </header>
  );
}
