"use client";

import {
  type AttributeDef,
  type MentionItem,
  type MentionObjectType,
  filterAttributeValues,
  groupLabels,
} from "@/components/albus-mention-data";
import {
  type MentionQueryState,
  buildMentionTag,
  buildPillLabel,
  parseMentionQuery,
} from "@/components/albus-mention-parser";
import {
  AlbusMentionElement,
  type MentionElementData,
} from "@/components/albus-mention-element";
import {
  AlbusMentionSearch,
  type NavItem,
  computeNavItems,
} from "@/components/albus-mention-search";
import {
  AlbusMentionSearchV3A,
  type MentionSearchRef,
  type MentionSelectResult,
} from "@/components/albus-mention-search-v3a";
import { AlbusMentionSearchV3B } from "@/components/albus-mention-search-v3b";
import {
  type AlbusMode,
  AlbusModeMenu,
  albusModes,
} from "@/components/albus-mode-menu";
import {
  AlbusSuggestionsPanel,
  type SuggestionsPosition,
} from "@/components/albus-suggestions-panel";
import { Button } from "@/components/ui/button";
import { ArrowUp, ChevronDown, Plus } from "lucide-react";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type BaseEditor,
  type Descendant,
  Editor,
  type Node,
  type Path,
  Range,
  type Element as SlateElement,
  Text,
  Transforms,
  createEditor,
} from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  ReactEditor,
  type RenderElementProps,
  type RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";

export type { SuggestionsPosition };

// Canonical alias to type into the editor when entering a folder by keyboard
const categoryCanonicalAlias: Record<MentionObjectType, string> = {
  app: "apps",
  identity: "identities",
  policy: "policies",
  entitlement: "entitlements",
  reports: "reports",
  "access-review": "reviews",
  "access-request": "requests",
};

// ---------------------------------------------------------------------------
// Slate custom types
// ---------------------------------------------------------------------------
type ParagraphElement = { type: "paragraph"; children: Descendant[] };
type CustomElement = ParagraphElement | MentionElementData;
type CustomText = { text: string; mentionSearch?: boolean };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function withMentions(editor: Editor) {
  const { isInline, isVoid, markableVoid } = editor;
  editor.isInline = (element: SlateElement) =>
    (element as unknown as MentionElementData).type === "mention" ||
    isInline(element);
  editor.isVoid = (element: SlateElement) =>
    (element as unknown as MentionElementData).type === "mention" ||
    isVoid(element);
  editor.markableVoid = (element: SlateElement) =>
    (element as unknown as MentionElementData).type === "mention" ||
    markableVoid(element);
  return editor;
}

function serializeToPlainText(nodes: Descendant[]): string {
  return nodes
    .map((n) => {
      if ("text" in n) return n.text;
      const el = n as unknown as CustomElement;
      if (el.type === "mention") return `@${(el as MentionElementData).tag}`;
      return serializeToPlainText((el as ParagraphElement).children);
    })
    .join("");
}

function makeEmptyValue(): Descendant[] {
  return [{ type: "paragraph", children: [{ text: "" }] }];
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface AlbusChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  suggestionsPosition?: SuggestionsPosition;
  showModeSelector?: boolean;
  onSend?: (value: Descendant[]) => void;
  className?: string;
}

const MENU_HEIGHT = 180;
const MENU_GAP = 6;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
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
  const editor = useMemo(
    () => withMentions(withHistory(withReact(createEditor()))),
    [],
  );
  const [focused, setFocused] = useState(false);
  const [mode, setMode] = useState<AlbusMode>("ask");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const [suggestionsStyle, setSuggestionsStyle] = useState<CSSProperties>({});
  const [suggestionsRevealed, setSuggestionsRevealed] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);

  // Mention search state
  const [mentionTarget, setMentionTarget] = useState<Range | null>(null);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionStyle, setMentionStyle] = useState<CSSProperties>({});
  const [parsedQuery, setParsedQuery] = useState<MentionQueryState>({ mode: "initial" });
  const mentionRef = useRef<HTMLDivElement>(null);
  const [mentionText, setMentionText] = useState("");
  const [mentionVariant, setMentionVariant] = useState<"v1" | "v3a" | "v3b">("v3a");
  const mentionV3ARef = useRef<MentionSearchRef>(null);
  const mentionV3BRef = useRef<MentionSearchRef>(null);

  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const [plainText, setPlainText] = useState("");

  // Flat navigable items — single source of truth for keyboard nav
  const navItems: NavItem[] = useMemo(() => computeNavItems(parsedQuery), [parsedQuery]);

  // Sync external value → editor
  const lastExternalValue = useRef(value);
  useEffect(() => {
    if (value !== undefined && value !== lastExternalValue.current) {
      lastExternalValue.current = value;
      if (value === "") {
        Transforms.delete(editor, {
          at: { anchor: Editor.start(editor, []), focus: Editor.end(editor, []) },
        });
        const point = { path: [0, 0], offset: 0 };
        Transforms.select(editor, { anchor: point, focus: point });
        setPlainText("");
      } else if (value.length > 0) {
        Transforms.delete(editor, {
          at: { anchor: Editor.start(editor, []), focus: Editor.end(editor, []) },
        });
        Transforms.insertText(editor, value, { at: Editor.start(editor, []) });
        setPlainText(value);
      }
    }
  }, [value, editor]);

  // Smart positioning: above or below the pill depending on space
  useEffect(() => {
    if (!mentionTarget) return;
    const position = () => {
      const pill = document.querySelector("[data-mention-pill]");
      const anchor = pill ?? (() => {
        try { return ReactEditor.toDOMRange(editor, mentionTarget); } catch { return null; }
      })();
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow >= MENU_HEIGHT + MENU_GAP) {
        setMentionStyle({ position: "fixed", top: rect.bottom + MENU_GAP, left: rect.left });
      } else {
        setMentionStyle({ position: "fixed", bottom: window.innerHeight - rect.top + MENU_GAP, left: rect.left });
      }
    };
    const id = requestAnimationFrame(position);
    return () => cancelAnimationFrame(id);
  }, [editor, mentionTarget, mentionQuery]);

  // Insert a mention item
  const insertMention = useCallback(
    (item: MentionItem) => {
      if (mentionTarget) Transforms.select(editor, mentionTarget);
      const mention: MentionElementData = {
        type: "mention",
        tag: item.tag,
        name: item.name,
        itemId: item.id,
        objectType: item.objectType,
        children: [{ text: "" }],
      };
      Transforms.insertNodes(editor, mention);
      Transforms.move(editor);
      Transforms.insertText(editor, " ");
      setMentionTarget(null);
      ReactEditor.focus(editor);
    },
    [editor, mentionTarget],
  );

  const handleV3Select = useCallback(
    (result: MentionSelectResult) => {
      if (result.kind === "item" && result.item) {
        insertMention(result.item);
      } else if (result.kind === "value" && result.tag && result.display) {
        insertMention({
          id: result.tag,
          name: result.display,
          tag: result.tag,
          objectType: result.objectType ?? "app",
        });
      }
    },
    [insertMention],
  );

  const handleV3InsertText = useCallback(
    (text: string) => {
      if (!mentionTarget) return;
      Transforms.select(editor, mentionTarget);
      Transforms.insertText(editor, text);
      ReactEditor.focus(editor);
    },
    [editor, mentionTarget],
  );

  // Enter a folder — append canonical alias to query in editor
  const handleFolderEnter = useCallback(
    (category: MentionObjectType) => {
      const alias = categoryCanonicalAlias[category];
      Transforms.insertText(editor, alias + " ");
      ReactEditor.focus(editor);
    },
    [editor],
  );

  // Click an attribute row — append attr key to current query
  const handleAttributeClick = useCallback(
    (attr: AttributeDef) => {
      if (!mentionTarget) return;
      const endPoint = Range.end(mentionTarget);
      Transforms.select(editor, { anchor: endPoint, focus: endPoint });
      Transforms.insertText(editor, ` ${attr.key}`);
      ReactEditor.focus(editor);
    },
    [editor, mentionTarget],
  );

  // Insert a filter mention (category + attribute + value)
  const handleAttributeValueSelect = useCallback(
    (category: MentionObjectType, attribute: AttributeDef, value: string) => {
      if (!mentionTarget) return;
      const tag = buildMentionTag(category, value);
      const mention: MentionElementData = {
        type: "mention",
        tag,
        name: buildPillLabel({ mode: "attribute", category, attribute, valueQuery: value }).replace(/^@/, ""),
        itemId: `filter-${category}-${attribute.key}-${value.toLowerCase().replace(/\s+/g, "-")}`,
        objectType: category,
        filterAttribute: attribute.key,
        filterValue: value,
        children: [{ text: "" }],
      };
      Transforms.select(editor, mentionTarget);
      Transforms.insertNodes(editor, mention);
      Transforms.move(editor);
      Transforms.insertText(editor, " ");
      setMentionTarget(null);
      ReactEditor.focus(editor);
    },
    [mentionTarget, editor],
  );

  // Handle editor change — detect @ trigger
  const handleEditorChange = useCallback(
    (newValue: Descendant[]) => {
      const txt = serializeToPlainText(newValue);
      setPlainText(txt);
      lastExternalValue.current = txt;
      onChange?.(txt);

      const { selection } = editor;
      if (selection && Range.isCollapsed(selection)) {
        const [start] = Range.edges(selection);
        const wordBefore = Editor.before(editor, start, { unit: "word" });
        const before = wordBefore && Editor.before(editor, wordBefore);
        const beforeRange = before
          ? Editor.range(editor, before, start)
          : wordBefore
            ? Editor.range(editor, wordBefore, start)
            : null;
        const beforeText = beforeRange ? Editor.string(editor, beforeRange) : "";
        const atMatch = beforeText.match(/@([^@\n]*)$/);

        const lineStart = Editor.before(editor, start, { unit: "line" });
        const lineRange = lineStart ? Editor.range(editor, lineStart, start) : null;
        const lineText = lineRange ? Editor.string(editor, lineRange) : "";
        const lineAtMatch = lineText.match(/@([^@\n]*)$/);

        const match = atMatch || lineAtMatch;
        if (match) {
          const query = match[1] || "";
          const matchOffset = match.index ?? 0;
          const sourceRange = atMatch ? beforeRange : lineRange;
          if (sourceRange) {
            const rangeStart = {
              ...sourceRange.anchor,
              offset: sourceRange.anchor.offset + matchOffset,
            };
            const newTarget = Editor.range(editor, rangeStart, start);
            setMentionTarget(newTarget);
            setMentionQuery(query);
            setMentionText(query);
            setMentionIndex(0);
            setParsedQuery(parseMentionQuery(query));
            return;
          }
        }
      }
      setMentionTarget(null);
      setMentionText("");
      setParsedQuery({ mode: "initial" });
    },
    [editor, onChange],
  );

  // Decorate: highlight the full @query range with a gray pill
  const decorate = useCallback(
    ([node, path]: [Node, Path]) => {
      if (!mentionTarget || !Text.isText(node)) return [];
      const nodeRange = Editor.range(editor, path);
      const intersection = Range.intersection(mentionTarget, nodeRange);
      if (!intersection) return [];
      return [{ ...intersection, mentionSearch: true }];
    },
    [mentionTarget, editor],
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => {
      const { attributes, children, leaf } = props;
      if (leaf.mentionSearch) {
        return (
          <span
            {...attributes}
            data-mention-pill=""
            className="inline-flex items-baseline rounded-md bg-neutral-100 px-1 py-[1px] text-neutral-700"
          >
            {children}
            {mentionQuery === "" && (
              <span
                contentEditable={false}
                className="pointer-events-none ml-0.5 select-none text-neutral-400 text-sm"
              >
                Search...
              </span>
            )}
          </span>
        );
      }
      return <span {...attributes}>{children}</span>;
    },
    [mentionQuery],
  );

  const renderElement = useCallback((props: RenderElementProps) => {
    const el = props.element as unknown as CustomElement;
    if (el.type === "mention") return <AlbusMentionElement {...props} />;
    return <p {...props.attributes}>{props.children}</p>;
  }, []);

  // Activate the navItem at the current activeIndex
  const activateCurrentItem = useCallback(() => {
    const nav = navItems[mentionIndex];
    if (!nav) return;
    switch (nav.kind) {
      case "folder":
        handleFolderEnter(nav.category);
        break;
      case "mention":
        insertMention(nav.item);
        break;
      case "attr":
        handleAttributeClick(nav.attr);
        break;
      case "value":
        handleAttributeValueSelect(nav.category, nav.attr, nav.value);
        break;
    }
  }, [navItems, mentionIndex, handleFolderEnter, insertMention, handleAttributeClick, handleAttributeValueSelect]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Forward to V3A if active
      if (mentionTarget && mentionVariant === "v3a" && mentionV3ARef.current?.handleKeyDown(event)) {
        return;
      }
      if (mentionTarget && mentionVariant === "v3b" && mentionV3BRef.current?.handleKeyDown(event)) {
        return;
      }

      if (mentionTarget) {
        switch (event.key) {
          case "ArrowDown": {
            event.preventDefault();
            setMentionIndex((prev) => (prev >= navItems.length - 1 ? 0 : prev + 1));
            return;
          }
          case "ArrowUp": {
            event.preventDefault();
            setMentionIndex((prev) => (prev <= 0 ? navItems.length - 1 : prev - 1));
            return;
          }
          case "ArrowRight": {
            // Open a folder (initial mode) or enter an attribute (category mode)
            const nav = navItems[mentionIndex];
            if (nav?.kind === "folder" || nav?.kind === "attr") {
              event.preventDefault();
              activateCurrentItem();
            }
            return;
          }
          case "ArrowLeft": {
            // Go back one step: delete the last space-separated token from the query
            if (parsedQuery.mode === "category" || parsedQuery.mode === "attribute") {
              event.preventDefault();
              Editor.deleteBackward(editor, { unit: "word" });
              // Also delete any trailing space left by deleteBackward
              const { selection } = editor;
              if (selection) {
                const [start] = Range.edges(selection);
                const charBefore = Editor.before(editor, start, { unit: "character" });
                if (charBefore) {
                  const charRange = Editor.range(editor, charBefore, start);
                  const char = Editor.string(editor, charRange);
                  if (char === " ") Editor.deleteBackward(editor, { unit: "character" });
                }
              }
              ReactEditor.focus(editor);
            }
            return;
          }
          case "Enter": {
            event.preventDefault();
            activateCurrentItem();
            return;
          }
          case "Escape": {
            event.preventDefault();
            Transforms.delete(editor, { at: mentionTarget });
            setMentionTarget(null);
            setParsedQuery({ mode: "initial" });
            return;
          }
        }
      }

      // Send on Enter (without Shift)
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (plainText.trim()) onSend?.(editor.children);
      }
    },
    [mentionTarget, mentionVariant, navItems, mentionIndex, parsedQuery, activateCurrentItem, editor, plainText, onSend],
  );

  // Suggestions
  useEffect(() => {
    if (focused && suggestions.length > 0) {
      const id = requestAnimationFrame(() => setSuggestionsRevealed(true));
      return () => cancelAnimationFrame(id);
    }
    setSuggestionsRevealed(false);
  }, [focused, suggestions.length]);

  useEffect(() => {
    if (plainText.trim() === "") { setSuggestionsVisible(true); return; }
    const id = setTimeout(() => setSuggestionsVisible(false), 1000);
    return () => clearTimeout(id);
  }, [plainText]);

  const handleFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setFocused(true);
    setSuggestionsVisible(true);
    if (suggestions.length > 0 && inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect();
      const gap = -12;
      setSuggestionsStyle(
        suggestionsPosition === "top"
          ? { position: "fixed", bottom: window.innerHeight - rect.top + gap, left: rect.left, width: rect.width }
          : { position: "fixed", top: rect.bottom + gap, left: rect.left, width: rect.width },
      );
    }
  };

  const handleBlur = () => {
    const targetAtBlur = mentionTarget;
    blurTimeout.current = setTimeout(() => {
      if (targetAtBlur) {
        try { Transforms.delete(editor, { at: targetAtBlur }); } catch { /* range may be stale */ }
      }
      setFocused(false);
      setMentionTarget(null);
      setParsedQuery({ mode: "initial" });
    }, 150);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as globalThis.Node;
      if (!menuContainerRef.current?.contains(target) && !menuDropdownRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const currentMode = albusModes.find((m) => m.id === mode) ?? albusModes[0];
  const resolvedPlaceholder =
    showModeSelector && mode === "deep-research"
      ? "What would you like me to investigate?"
      : placeholder;

  const handleSend = useCallback(() => {
    if (plainText.trim()) onSend?.(editor.children);
  }, [plainText, onSend, editor]);

  return (
    <div ref={inputContainerRef} className={`relative w-full ${className ?? ""}`}>
      <div className="w-full rounded-[20px] bg-[#eff1f3]">
        <div
          className="rounded-2xl p-[2px] transition-all duration-300"
          style={
            focused
              ? { backgroundImage: "linear-gradient(-74deg, rgba(249,250,250,0) 0%, rgba(254,101,25,0.75) 22%, rgba(248,59,249,0.19) 50%, rgba(248,59,249,0.19) 70%, rgba(249,250,250,0) 99%), linear-gradient(90deg, #f6f7f8 0%, #f6f7f8 100%)" }
              : { background: "#f6f7f8" }
          }
        >
          <div className="flex h-[120px] min-h-[120px] flex-col justify-between overflow-hidden rounded-[12px] border border-[#eff1f3] bg-white p-3 shadow-[0px_6px_8px_-8px_#d3d6de]">
            <div className="w-full flex-1 overflow-y-auto py-1">
              <Slate editor={editor} initialValue={makeEmptyValue()} onChange={handleEditorChange}>
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  decorate={decorate}
                  placeholder={resolvedPlaceholder}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="[&_[data-slate-placeholder]]:!text-[#79829c] [&_[data-slate-placeholder]]:!opacity-100 h-full w-full resize-none bg-transparent text-foreground text-sm leading-[1.4] outline-none"
                  aria-expanded={!!mentionTarget}
                  aria-activedescendant={mentionTarget ? `mention-option-${mentionIndex}` : undefined}
                  aria-controls={mentionTarget ? "mention-search" : undefined}
                />
              </Slate>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-2">
                <Button variant="tertiary" size="icon" className="size-7 rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="flex items-center rounded-full border border-neutral-200 bg-neutral-50 p-0.5 text-[0.625rem] font-medium">
                  {(["v1", "v3a", "v3b"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMentionVariant(v)}
                      className={`rounded-full px-2 py-0.5 transition-colors ${
                        mentionVariant === v
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-400 hover:text-neutral-600"
                      }`}
                    >
                      {v === "v1" ? "v1" : v === "v3a" ? "A" : "B"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {showModeSelector && (
                  <div ref={menuContainerRef} className="relative border-[#eff1f3] border-r pr-3">
                    <Button
                      variant="tertiary"
                      className="h-7 gap-1 px-2"
                      onClick={() => {
                        if (!menuOpen && menuContainerRef.current) {
                          const rect = menuContainerRef.current.getBoundingClientRect();
                          setMenuStyle({ position: "fixed", bottom: window.innerHeight - rect.top + 8, right: window.innerWidth - rect.right });
                        }
                        setMenuOpen((o) => !o);
                      }}
                    >
                      <currentMode.Icon className="h-4 w-4" />
                      {currentMode.label}
                      <ChevronDown className={`h-[18px] w-[18px] transition-transform duration-150 ${menuOpen ? "rotate-180" : ""}`} />
                    </Button>
                  </div>
                )}
                <Button
                  variant="tertiary"
                  size="icon"
                  disabled={!plainText.trim()}
                  className="size-7 rounded-full"
                  onClick={handleSend}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {mentionTarget && mentionVariant === "v3a" && (
        <AlbusMentionSearchV3A
          ref={mentionV3ARef}
          query={mentionText}
          style={mentionStyle}
          onSelect={handleV3Select}
          onInsertText={handleV3InsertText}
        />
      )}
      {mentionTarget && mentionVariant === "v3b" && (
        <AlbusMentionSearchV3B
          ref={mentionV3BRef}
          query={mentionText}
          style={mentionStyle}
          onSelect={handleV3Select}
          onInsertText={handleV3InsertText}
        />
      )}
      {mentionTarget && mentionVariant === "v1" && (
        <AlbusMentionSearch
          ref={mentionRef}
          parsedQuery={parsedQuery}
          activeIndex={mentionIndex}
          style={mentionStyle}
          onSelect={insertMention}
          onAttributeValueSelect={handleAttributeValueSelect}
          onAttributeClick={handleAttributeClick}
        />
      )}

      {suggestions.length > 0 && focused && suggestionsVisible && !mentionTarget && (
        <AlbusSuggestionsPanel
          suggestions={suggestions}
          position={suggestionsPosition}
          style={suggestionsStyle}
          revealed={suggestionsRevealed}
          onSelect={(s) => {
            Transforms.delete(editor, {
              at: { anchor: Editor.start(editor, []), focus: Editor.end(editor, []) },
            });
            Transforms.insertText(editor, s, { at: Editor.start(editor, []) });
            setPlainText(s);
            onChange?.(s);
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
