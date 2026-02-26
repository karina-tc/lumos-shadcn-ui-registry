"use client";

import { Bookmark, History, MoreHorizontal, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  title: string;
  detail?: string;
  isActive?: boolean;
}

export interface AlbusHistoryPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recentItems?: HistoryItem[];
  bookmarkedItems?: HistoryItem[];
  onSelectItem?: (item: HistoryItem) => void;
  className?: string;
}

function HistoryListItem({
  item,
  onSelect,
  onMenuClick,
}: {
  item: HistoryItem;
  onSelect?: () => void;
  onMenuClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className={cn(
        "flex h-10 cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50",
        item.isActive && "relative"
      )}
      onClick={onSelect}
    >
      {item.isActive && (
        <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-[1.4] text-foreground">
          {item.title}
        </p>
        {item.detail && (
          <p className="truncate text-xs leading-[1.4] text-muted-foreground">
            {item.detail}
          </p>
        )}
      </div>
      <Button
        variant="secondary"
        size="icon"
        className="size-6 shrink-0 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onMenuClick?.(e);
        }}
      >
        <MoreHorizontal className="size-4" />
      </Button>
    </div>
  );
}

function Section({
  icon: Icon,
  label,
  items,
  onSelectItem,
  onMenuClick,
}: {
  icon: typeof History;
  label: string;
  items: HistoryItem[];
  onSelectItem?: (item: HistoryItem) => void;
  onMenuClick?: (item: HistoryItem, e: React.MouseEvent) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-6 items-center gap-1 px-2">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-sm font-medium leading-[1.4] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => (
          <HistoryListItem
            key={item.id}
            item={item}
            onSelect={() => onSelectItem?.(item)}
            onMenuClick={(e) => onMenuClick?.(item, e)}
          />
        ))}
      </div>
    </div>
  );
}

export function AlbusHistoryPanel({
  open,
  onOpenChange,
  recentItems = [],
  bookmarkedItems = [],
  onSelectItem,
  className,
}: AlbusHistoryPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "flex w-[340px] max-w-[340px] flex-col gap-0 border-border p-0 shadow-[2px_2px_20px_0_rgba(138,149,168,0.1)]",
          className
        )}
      >
        <SheetHeader className="flex flex-row items-center justify-between gap-3 border-b border-border px-6 py-5">
          <SheetTitle className="text-lg font-medium leading-[1.5] text-foreground">
            History
          </SheetTitle>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-3 pb-4 pt-0.5">
          <div className="shrink-0 px-2 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by topic"
                className="h-8 rounded-full border-border pl-9 pr-3 text-sm"
              />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
            {recentItems.length > 0 && (
              <Section
                icon={History}
                label="Recent"
                items={recentItems}
                onSelectItem={onSelectItem}
              />
            )}

            {bookmarkedItems.length > 0 && (
              <>
                <div className="shrink-0 border-t border-border" />
                <Section
                  icon={Bookmark}
                  label="Bookmarked"
                  items={bookmarkedItems}
                  onSelectItem={onSelectItem}
                />
                <button
                  type="button"
                  className="self-start px-2 py-2 text-xs font-medium leading-[1.4] text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  View More
                </button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
