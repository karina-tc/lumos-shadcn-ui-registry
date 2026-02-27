"use client";

import { useState } from "react";
import { LumosLayout } from "@/components/lumos-layout";
import { AlbusSymbol } from "@/components/albus-symbol";
import { AlbusChatInput } from "@/components/albus-chat-input";
import { AlbusHistoryPanel } from "@/components/albus-history-panel";
import { Plus, Bookmark, History } from "lucide-react";
import { Button } from "@/components/ui/button";

const recentHistoryItems = [
  { id: "1", title: "Manage NetSuite SoD Access", detail: "2 days ago", isActive: true },
  { id: "2", title: "Spend & Usage Review of Loom" },
  { id: "3", title: "Defining Design Team Birthright Access" },
  { id: "4", title: "Recent Company Movers" },
  { id: "5", title: "Report on All Service Accounts" },
];

const bookmarkedHistoryItems = [
  { id: "b1", title: "Vendor Cost vs Usage", detail: "2 days ago" },
  { id: "b2", title: "Policy Patterns" },
  { id: "b3", title: "Engineering Access" },
  { id: "b4", title: "Recent Company Movers" },
  { id: "b5", title: "Report on All Service Accounts" },
];

const suggestedPrompts = [
  "Who has access to Salesforce?",
  "Show me inactive user accounts",
  "What apps have unused licenses?",
  "Summarize Jamie Torres's onboarding",
  "Which users have admin access?",
  "Flag accounts inactive 30+ days",
];

const inactiveApps = [
  { app: "Salesforce", inactive: 12, lastActive: "30+ days ago" },
  { app: "Zoom", inactive: 9, lastActive: "60+ days ago" },
  { app: "Notion", inactive: 8, lastActive: "45+ days ago" },
  { app: "Figma", inactive: 7, lastActive: "22 days ago" },
  { app: "Slack", inactive: 6, lastActive: "35+ days ago" },
  { app: "GitHub", inactive: 5, lastActive: "90+ days ago" },
];

export default function LumosAlbusChat() {
  const [inputValue, setInputValue] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <LumosLayout activeItem="Ask Albus" title="Ask Albus">
      <div className="flex h-full flex-col">
        {/* Page header */}
        <header className="shrink-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-7 rounded-full"><Plus /></Button>
            <h3 className="text-foreground-secondary">Thread Title Here</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-7 rounded-full"><Bookmark /></Button>
            <Button
              variant="ghost"
              size="default"
              className="h-7 !pl-2"
              onClick={() => setHistoryOpen(true)}
            >
              <History className="size-4" /> History
            </Button>
          </div>
        </header>

        {/* Messages — scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {/* User message */}
            <div className="flex item-start gap-4 justify-end">
              <div className="max-w-lg rounded-2xl rounded-tr-sm bg-secondary px-4 py-3 text-sm">
                Which apps have inactive users?
              </div>
              <div className="mt-1 flex items-center justify-center gap-2 size-7 leading-none text-center rounded-full bg-primary text-primary-foreground">
               <span className="text-base">A</span>
              </div>
            </div>

            {/* Albus response */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[20px] border-[1.4px] border-[#f83bf9] bg-background shadow-[0_0_6px_0_#fce7fd]">
                <AlbusSymbol className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="py-2 text-sm text-foreground">
                  I found <strong>47 inactive users</strong> across 6 apps. Here's the breakdown:
                </div>
                <div className="w-full max-w-xl overflow-hidden rounded-lg border border-border bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">App</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Inactive Users</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Last Active</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {inactiveApps.map((row) => (
                        <tr key={row.app} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-4 py-2.5 font-medium text-foreground">{row.app}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{row.inactive}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{row.lastActive}</td>
                          <td className="px-4 py-2.5">
                            <button className="text-xs font-medium text-primary hover:underline">Start review</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="py-2 text-sm text-foreground">
                  Would you like to start an access review for any of these apps, or revoke access for users inactive
                  longer than 60 days?
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat input — same component as albus index, fixed at bottom */}
        <div className="shrink-0 p-4">
          <div className="mx-auto max-w-3xl">
            <AlbusChatInput
              value={inputValue}
              onChange={setInputValue}
              placeholder="Ask Albus anything about your users, apps, or access..."
              suggestions={suggestedPrompts}
              showModeSelector={false}
            />
          </div>
        </div>
      </div>

      <AlbusHistoryPanel
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        recentItems={recentHistoryItems}
        bookmarkedItems={bookmarkedHistoryItems}
      />
    </LumosLayout>
  );
}
