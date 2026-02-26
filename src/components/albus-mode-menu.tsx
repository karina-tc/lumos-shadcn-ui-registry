"use client";

import { forwardRef } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties } from "react";
import { MessageCircle, Lightbulb } from "lucide-react";

export type AlbusMode = "ask" | "deep-research";

const modes: {
  id: AlbusMode;
  label: string;
  description: string;
  Icon: typeof MessageCircle;
}[] = [
  { id: "ask", label: "Ask", description: "Quick conversational answers", Icon: MessageCircle },
  {
    id: "deep-research",
    label: "Deep Research",
    description: "Thorough, multi-step research",
    Icon: Lightbulb,
  },
];

export interface AlbusModeMenuProps {
  value: AlbusMode;
  onChange: (mode: AlbusMode) => void;
  onClose: () => void;
  style: CSSProperties;
}

export const AlbusModeMenu = forwardRef<HTMLDivElement, AlbusModeMenuProps>(
  function AlbusModeMenu({ value, onChange, onClose, style }, ref) {
    return createPortal(
      <div
        ref={ref}
        style={style}
        className="z-50 w-[260px] overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0px_2px_12px_0px_rgba(138,149,168,0.2)]"
      >
        <div className="flex flex-col p-1">
          {modes.map(({ id, label, description, Icon }) => (
            <button
              key={id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(id);
                onClose();
              }}
              className={`flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-secondary ${value === id ? "bg-secondary/30" : ""}`}
            >
              <div
                className={`flex size-6 shrink-0 items-center justify-center rounded-lg ${value === id ? "bg-[#fff0e9]" : "bg-muted"}`}
              >
                <Icon
                  className={`size-4 ${value === id ? "text-[#fe6519]" : "text-muted-foreground"}`}
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium leading-[1.4] text-foreground">{label}</span>
                <span className="text-xs leading-[1.4] text-muted-foreground">{description}</span>
                {id === "deep-research" && <span className="text-xs pt-1 leading-[1.4] text-muted-foreground/75">Used to 0/3 today</span>}
              </div>
            </button>
          ))}
        </div>
      </div>,
      document.body
    );
  }
);

export { modes as albusModes };
