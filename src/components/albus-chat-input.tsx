"use client";

import { useState, useRef, useEffect, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, ChevronDown, Plus } from "lucide-react";
import { AlbusModeMenu, albusModes, type AlbusMode } from "@/components/albus-mode-menu";
import {
  AlbusSuggestionsPanel,
  type SuggestionsPosition,
} from "@/components/albus-suggestions-panel";
import { Button } from "@/components/ui/button";

export type { SuggestionsPosition };

export interface AlbusChatInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  suggestionsPosition?: SuggestionsPosition;
  showModeSelector?: boolean;
  onSend?: () => void;
  className?: string;
}

export function AlbusChatInput({
  value,
  onChange,
  placeholder = "Ask me anything",
  suggestions = [],
  suggestionsPosition = "top",
  showModeSelector = false,
  onSend,
  className,
}: AlbusChatInputProps) {
  const [focused, setFocused] = useState(false);
  const [mode, setMode] = useState<AlbusMode>("ask");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const [suggestionsStyle, setSuggestionsStyle] = useState<CSSProperties>({});
  const [suggestionsRevealed, setSuggestionsRevealed] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused && suggestions.length > 0) {
      const id = requestAnimationFrame(() => setSuggestionsRevealed(true));
      return () => cancelAnimationFrame(id);
    } else {
      setSuggestionsRevealed(false);
    }
  }, [focused, suggestions.length]);

  useEffect(() => {
    if (value.trim() === "") {
      setSuggestionsVisible(true);
      return;
    }
    const id = setTimeout(() => setSuggestionsVisible(false), 1000);
    return () => clearTimeout(id);
  }, [value]);

  const handleFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setFocused(true);
    setSuggestionsVisible(true);
    if (suggestions.length > 0 && inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect();
      const gap = -12;
      setSuggestionsStyle(
        suggestionsPosition === "top"
          ? {
              position: "fixed",
              bottom: window.innerHeight - rect.top + gap,
              left: rect.left,
              width: rect.width,
            }
          : {
              position: "fixed",
              top: rect.bottom + gap,
              left: rect.left,
              width: rect.width,
            }
      );
    }
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => setFocused(false), 150);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!menuContainerRef.current?.contains(target) && !menuDropdownRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const currentMode = albusModes.find((m) => m.id === mode)!;
  const resolvedPlaceholder =
    showModeSelector && mode === "deep-research"
      ? "What would you like me to investigate?"
      : placeholder;

  return (
    <div ref={inputContainerRef} className={`relative w-full ${className ?? ""}`}>
      <div className="w-full rounded-[20px] bg-[#eff1f3]">
        <div
          className="rounded-2xl p-[2px] transition-all duration-300"
          style={
            focused
              ? {
                  backgroundImage:
                    "linear-gradient(-74deg, rgba(249,250,250,0) 0%, rgba(254,101,25,0.75) 22%, rgba(248,59,249,0.19) 50%, rgba(248,59,249,0.19) 70%, rgba(249,250,250,0) 99%), linear-gradient(90deg, #f6f7f8 0%, #f6f7f8 100%)",
                }
              : { background: "#f6f7f8" }
          }
        >
          <div className="flex h-[120px] min-h-[120px] flex-col justify-between overflow-hidden rounded-[12px] border border-[#eff1f3] bg-white p-3 shadow-[0px_6px_8px_-8px_#d3d6de]">
            <div className="w-full py-1">
              <textarea
                placeholder={resolvedPlaceholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend?.();
                  }
                }}
                rows={2}
                className="w-full resize-none bg-transparent text-sm leading-[1.4] text-foreground placeholder:text-[#79829c] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-2">
                <Button variant="tertiary" size="icon" className="size-7 rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                {showModeSelector && (
                  <div ref={menuContainerRef} className="relative pr-3 border-r border-[#eff1f3]">
                    <Button
                      variant="tertiary"
                      className="gap-1 px-2 h-7"
                      onClick={() => {
                        if (!menuOpen && menuContainerRef.current) {
                          const rect = menuContainerRef.current.getBoundingClientRect();
                          setMenuStyle({
                            position: "fixed",
                            bottom: window.innerHeight - rect.top + 8,
                            right: window.innerWidth - rect.right,
                          });
                        }
                        setMenuOpen((o) => !o);
                      }}
                    >
                      <currentMode.Icon className="h-4 w-4" />
                      {currentMode.label}
                      <ChevronDown
                        className={`h-[18px] w-[18px] transition-transform duration-150 ${menuOpen ? "rotate-180" : ""}`}
                      />
                    </Button>
                  </div>
                )}
                <Button
                  variant="tertiary"
                  size="icon"
                  disabled={!value}
                  className="size-7 rounded-full"
                  onClick={onSend}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && focused && suggestionsVisible && (
        <AlbusSuggestionsPanel
          suggestions={suggestions}
          position={suggestionsPosition}
          style={suggestionsStyle}
          revealed={suggestionsRevealed}
          onSelect={(s) => {
            onChange(s);
            setFocused(false);
          }}
        />
      )}

      {showModeSelector && menuOpen && (
        <AlbusModeMenu
          ref={menuDropdownRef}
          value={mode}
          onChange={setMode}
          onClose={() => setMenuOpen(false)}
          style={menuStyle}
        />
      )}
    </div>
  );
}
