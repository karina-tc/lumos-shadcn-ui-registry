"use client";

import type {
  GroupedResults,
  MentionItem,
} from "@/components/albus-mention-data";
import { type CSSProperties, forwardRef } from "react";
import { createPortal } from "react-dom";

export interface AlbusMentionSearchProps {
  groups: GroupedResults[];
  activeIndex: number;
  style: CSSProperties;
  onSelect: (item: MentionItem) => void;
}

export const AlbusMentionSearch = forwardRef<
  HTMLDivElement,
  AlbusMentionSearchProps
>(function AlbusMentionSearch({ groups, activeIndex, style, onSelect }, ref) {
  if (typeof window === "undefined") return null;

  const flatItems = groups.flatMap((g) => g.items);
  const hasResults = flatItems.length > 0;

  let runningIndex = 0;

  return createPortal(
    <div
      ref={ref}
      aria-label="Mention search results"
      style={style}
      tabIndex={-1}
      className="z-50 max-h-96 min-w-[320px] overflow-y-auto rounded-xl border border-border bg-white shadow-lg"
    >
      {!hasResults && (
        <div className="px-4 py-3 text-muted-foreground text-sm">
          No results
        </div>
      )}
      {groups.map((group) => {
        const groupStartIndex = runningIndex;
        const groupEl = (
          <div key={group.type}>
            <div className="sticky top-0 bg-muted/60 px-3 py-1.5 font-semibold text-[0.6875rem] text-muted-foreground uppercase tracking-wider">
              {group.label}
            </div>
            {group.items.map((item, i) => {
              const itemIndex = groupStartIndex + i;
              const isActive = itemIndex === activeIndex;
              return (
                <div
                  key={item.id}
                  data-mention-option=""
                  aria-selected={isActive}
                  id={`mention-option-${itemIndex}`}
                  className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-900"
                      : "text-foreground hover:bg-blue-50/50"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(item);
                  }}
                >
                  <span className="text-sm" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate font-medium">
                    {item.name}
                  </span>
                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground">
                    {group.label.slice(0, -1)}
                  </span>
                </div>
              );
            })}
          </div>
        );
        runningIndex += group.items.length;
        return groupEl;
      })}
    </div>,
    document.body,
  );
});
