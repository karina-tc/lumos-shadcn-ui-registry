"use client";

import { createPortal } from "react-dom";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";

export type SuggestionsPosition = "top" | "bottom";

export interface AlbusSuggestionsPanelProps {
  suggestions: string[];
  position: SuggestionsPosition;
  style: CSSProperties;
  revealed: boolean;
  onSelect: (suggestion: string) => void;
}

export function AlbusSuggestionsPanel({
  suggestions,
  position,
  style,
  revealed,
  onSelect,
}: AlbusSuggestionsPanelProps) {
  return createPortal(
    <div className="z-50 overflow-hidden" style={style}>
      <div
        className={`mx-px py-2 border-2 border-border/50 bg-white shadow-[0px_2px_12px_-4px_rgba(138,149,168,0.2)] transition-transform duration-200 ease-out ${
          position === "top"
            ? "origin-bottom rounded-t-2xl border-b-0"
            : "origin-top rounded-b-2xl border-t-0"
        } ${revealed ? "scale-y-100" : "scale-y-0"}`}
      >
        {suggestions.map((s) => (
          <Button
            key={s}
            variant="ghost"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(s)}
            className="h-auto w-full justify-start rounded-lg px-4 py-2 text-left text-sm leading-[1.4] text-muted-foreground whitespace-normal"
          >
            {s}
          </Button>
        ))}
      </div>
    </div>,
    document.body
  );
}
