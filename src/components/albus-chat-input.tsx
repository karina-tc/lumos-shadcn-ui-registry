"use client";

import {
  type AttributeDef,
  type GroupedResults,
  type MentionItem,
  type MentionObjectType,
  attributeValues,
  getPopularItems,
  groupLabels,
  searchMentions,
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
import { AlbusMentionSearch } from "@/components/albus-mention-search";
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
  const [selectedCategory, setSelectedCategory] =
    useState<MentionObjectType | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeDef | null>(null);
  const [categoryAutoMatched, setCategoryAutoMatched] = useState(false);
  const [parsedQuery, setParsedQuery] = useState<MentionQueryState>({ mode: "free", query: "" });
  const mentionRef = useRef<HTMLDivElement>(null);

  const pillLabel = buildPillLabel(parsedQuery);

  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Track plain text state for suggestions visibility & send button
  const [plainText, setPlainText] = useState("");

  // Sync external value → editor (only for controlled clear / suggestion fill)
  const lastExternalValue = useRef(value);
  useEffect(() => {
    if (value !== undefined && value !== lastExternalValue.current) {
      lastExternalValue.current = value;
      if (value === "") {
        Transforms.delete(editor, {
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        });
        const point = { path: [0, 0], offset: 0 };
        Transforms.select(editor, { anchor: point, focus: point });
        setPlainText("");
      } else if (value.length > 0) {
        Transforms.delete(editor, {
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        });
        Transforms.insertText(editor, value, { at: Editor.start(editor, []) });
        setPlainText(value);
      }
    }
  }, [value, editor]);

  // Mention groups — search results or category items
  const mentionGroups: GroupedResults[] = useMemo(() => {
    if (selectedCategory) {
      // When browsing an attribute's values, mentionGroups is empty (values are plain strings, not MentionItems)
      if (selectedAttribute) return [];
      // In category browse mode — return only popular items for keyboard nav
      const popular = getPopularItems(selectedCategory);
      return popular.length > 0
        ? [{ type: selectedCategory, label: groupLabels[selectedCategory], items: popular }]
        : [];
    }
    if (mentionQuery) return searchMentions(mentionQuery);
    return [];
  }, [selectedCategory, selectedAttribute, mentionQuery]);

  const flatMentionItems = useMemo(
    () => mentionGroups.flatMap((g) => g.items),
    [mentionGroups],
  );

  // Attribute values for keyboard navigation when in attribute drill-down view
  const currentAttributeValues = useMemo(() => {
    if (!selectedCategory || !selectedAttribute) return [];
    return (attributeValues[selectedCategory]?.[selectedAttribute.key]) ?? [];
  }, [selectedCategory, selectedAttribute]);

  // Position the mention search dropdown anchored to the pill
  useEffect(() => {
    if (!mentionTarget) return;
    const position = () => {
      const pill = document.querySelector("[data-mention-pill]");
      if (pill) {
        const rect = pill.getBoundingClientRect();
        setMentionStyle({
          position: "fixed",
          top: rect.bottom + 6,
          left: rect.left,
        });
        return;
      }
      // Fallback to DOMRange
      try {
        const domRange = ReactEditor.toDOMRange(editor, mentionTarget);
        const rect = domRange.getBoundingClientRect();
        setMentionStyle({
          position: "fixed",
          top: rect.bottom + 6,
          left: rect.left,
        });
      } catch {
        // range may become stale
      }
    };
    // RAF to wait for decoration render
    const id = requestAnimationFrame(position);
    return () => cancelAnimationFrame(id);
  }, [editor, mentionTarget, mentionQuery]);

  // Insert a mention node
  const insertMention = useCallback(
    (item: MentionItem) => {
      if (mentionTarget) {
        Transforms.select(editor, mentionTarget);
      }
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
      setSelectedCategory(null);
      ReactEditor.focus(editor);
    },
    [editor, mentionTarget],
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
        const beforeText = beforeRange
          ? Editor.string(editor, beforeRange)
          : "";
        const atMatch = beforeText.match(/@([^@\n]*)$/);

        // Also check from line start for just "@"
        const lineStart = Editor.before(editor, start, { unit: "line" });
        const lineRange = lineStart
          ? Editor.range(editor, lineStart, start)
          : null;
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
            setMentionIndex(0);

            const parsed = parseMentionQuery(query);
            setParsedQuery(parsed);

            if (parsed.mode === "scoped") {
              if (!selectedCategory || selectedCategory !== parsed.category) {
                setSelectedCategory(parsed.category);
                setCategoryAutoMatched(true);
                setSelectedAttribute(null);
              }
              return;
            }

            // Free mode — clear category if it was auto-matched from a previous query
            if (categoryAutoMatched) {
              setSelectedCategory(null);
              setSelectedAttribute(null);
              setCategoryAutoMatched(false);
            }
            return;
          }
        }
      }
      setMentionTarget(null);
      setSelectedCategory(null);
      setSelectedAttribute(null);
      setCategoryAutoMatched(false);
    },
    [editor, onChange, selectedCategory],
  );

  // Decorate: highlight the @query range with a gray pill
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

  // Render leaf: gray pill for active mention search
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
            {(() => {
              if (parsedQuery.mode === "scoped") {
                const showColon = !mentionQuery.includes(":");
                const hint = showColon ? ": search" : " search";
                return (
                  <span
                    contentEditable={false}
                    className="pointer-events-none ml-0.5 select-none text-neutral-400 text-sm"
                  >
                    {hint}
                  </span>
                );
              }
              if (mentionQuery === "") {
                return (
                  <span
                    contentEditable={false}
                    className="pointer-events-none ml-0.5 select-none text-neutral-400 text-sm"
                  >
                    Search...
                  </span>
                );
              }
              return null;
            })()}
          </span>
        );
      }
      return <span {...attributes}>{children}</span>;
    },
    [mentionQuery, parsedQuery],
  );

  // Render elements
  const renderElement = useCallback((props: RenderElementProps) => {
    const el = props.element as unknown as CustomElement;
    if (el.type === "mention") {
      return <AlbusMentionElement {...props} />;
    }
    return <p {...props.attributes}>{props.children}</p>;
  }, []);

  const handleCategorySelect = useCallback(
    (category: MentionObjectType) => {
      setSelectedCategory(category);
      setSelectedAttribute(null);
      setCategoryAutoMatched(false);
      setMentionIndex(0);
    },
    [],
  );

  const handleCategoryBack = useCallback(() => {
    setSelectedCategory(null);
    setSelectedAttribute(null);
    if (categoryAutoMatched) {
      setMentionTarget(null);
      ReactEditor.focus(editor);
    }
    setCategoryAutoMatched(false);
  }, [categoryAutoMatched, editor]);

  const handleAttributeSelect = useCallback((attr: AttributeDef) => {
    setSelectedAttribute(attr);
    setMentionIndex(0);
  }, []);

  const handleAttributeBack = useCallback(() => {
    setSelectedAttribute(null);
    setMentionIndex(0);
  }, []);

  const handleAttributeValueSelect = useCallback(
    (value: string) => {
      if (!selectedCategory || !selectedAttribute || !mentionTarget) return;
      const tag = buildMentionTag(selectedCategory, value);
      const mention: MentionElementData = {
        type: "mention",
        tag,
        name: buildPillLabel({
          mode: "scoped",
          category: selectedCategory,
          attribute: selectedAttribute.key,
          value,
          rawAttributeQuery: `${selectedAttribute.key} ${value}`,
        }).replace(/^@/, ""),
        itemId: `filter-${selectedCategory}-${selectedAttribute.key}-${value.toLowerCase().replace(/\s+/g, "-")}`,
        objectType: selectedCategory,
        filterAttribute: selectedAttribute.key,
        filterValue: value,
        children: [{ text: "" }],
      };
      Transforms.select(editor, mentionTarget);
      Transforms.insertNodes(editor, mention);
      Transforms.move(editor);
      Transforms.insertText(editor, " ");
      setMentionTarget(null);
      setSelectedCategory(null);
      setSelectedAttribute(null);
      setCategoryAutoMatched(false);
      ReactEditor.focus(editor);
    },
    [selectedCategory, selectedAttribute, mentionTarget, editor],
  );

  // Keyboard handler for mention nav + send
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Attribute value list keyboard navigation
      if (mentionTarget && selectedAttribute && currentAttributeValues.length > 0) {
        switch (event.key) {
          case "ArrowDown": {
            event.preventDefault();
            setMentionIndex((prev) =>
              prev >= currentAttributeValues.length - 1 ? 0 : prev + 1,
            );
            return;
          }
          case "ArrowUp": {
            event.preventDefault();
            setMentionIndex((prev) =>
              prev <= 0 ? currentAttributeValues.length - 1 : prev - 1,
            );
            return;
          }
          case "Enter": {
            event.preventDefault();
            handleAttributeValueSelect(currentAttributeValues[mentionIndex]);
            return;
          }
          case "Escape": {
            event.preventDefault();
            setSelectedAttribute(null);
            setMentionIndex(0);
            return;
          }
        }
      }

      // Mention menu navigation
      if (mentionTarget && flatMentionItems.length > 0) {
        switch (event.key) {
          case "ArrowDown": {
            event.preventDefault();
            setMentionIndex((prev) =>
              prev >= flatMentionItems.length - 1 ? 0 : prev + 1,
            );
            return;
          }
          case "ArrowUp": {
            event.preventDefault();
            setMentionIndex((prev) =>
              prev <= 0 ? flatMentionItems.length - 1 : prev - 1,
            );
            return;
          }
          case "Enter": {
            event.preventDefault();
            insertMention(flatMentionItems[mentionIndex]);
            return;
          }
          case "Escape": {
            event.preventDefault();
            setMentionTarget(null);
            setSelectedCategory(null);
            return;
          }
        }
      }

      // When mention menu is open with no results (default view), Escape closes
      if (mentionTarget && event.key === "Escape") {
        event.preventDefault();
        setMentionTarget(null);
        setSelectedCategory(null);
        return;
      }

      // Send on Enter (without Shift)
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (plainText.trim()) {
          onSend?.(editor.children);
        }
      }
    },
    [
      mentionTarget,
      selectedAttribute,
      currentAttributeValues,
      handleAttributeValueSelect,
      flatMentionItems,
      mentionIndex,
      insertMention,
      plainText,
      onSend,
      editor,
    ],
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
    if (plainText.trim() === "") {
      setSuggestionsVisible(true);
      return;
    }
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
            },
      );
    }
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => {
      setFocused(false);
      setMentionTarget(null);
      setSelectedCategory(null);
      setSelectedAttribute(null);
      setCategoryAutoMatched(false);
    }, 150);
  };

  // Mode menu outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as globalThis.Node;
      if (
        !menuContainerRef.current?.contains(target) &&
        !menuDropdownRef.current?.contains(target)
      ) {
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
    if (plainText.trim()) {
      onSend?.(editor.children);
    }
  }, [plainText, onSend, editor]);

  return (
    <div
      ref={inputContainerRef}
      className={`relative w-full ${className ?? ""}`}
    >
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
            <div className="w-full flex-1 overflow-y-auto py-1">
              <Slate
                editor={editor}
                initialValue={makeEmptyValue()}
                onChange={handleEditorChange}
              >
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
                  aria-activedescendant={
                    mentionTarget ? `mention-option-${mentionIndex}` : undefined
                  }
                  aria-controls={mentionTarget ? "mention-search" : undefined}
                />
              </Slate>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="tertiary"
                  size="icon"
                  className="size-7 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                {showModeSelector && (
                  <div
                    ref={menuContainerRef}
                    className="relative border-[#eff1f3] border-r pr-3"
                  >
                    <Button
                      variant="tertiary"
                      className="h-7 gap-1 px-2"
                      onClick={() => {
                        if (!menuOpen && menuContainerRef.current) {
                          const rect =
                            menuContainerRef.current.getBoundingClientRect();
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

      {/* Mention search menu */}
      {mentionTarget && (
        <AlbusMentionSearch
          ref={mentionRef}
          groups={mentionGroups}
          activeIndex={mentionIndex}
          style={mentionStyle}
          hasQuery={parsedQuery.mode === "free" && mentionQuery.length > 0}
          expandedCategory={selectedCategory}
          expandedAttribute={selectedAttribute}
          onSelect={insertMention}
          onCategorySelect={handleCategorySelect}
          onCategoryBack={handleCategoryBack}
          onAttributeSelect={handleAttributeSelect}
          onAttributeBack={handleAttributeBack}
          onAttributeValueSelect={handleAttributeValueSelect}
        />
      )}

      {/* Suggestions panel */}
      {suggestions.length > 0 &&
        focused &&
        suggestionsVisible &&
        !mentionTarget && (
          <AlbusSuggestionsPanel
            suggestions={suggestions}
            position={suggestionsPosition}
            style={suggestionsStyle}
            revealed={suggestionsRevealed}
            onSelect={(s) => {
              Transforms.delete(editor, {
                at: {
                  anchor: Editor.start(editor, []),
                  focus: Editor.end(editor, []),
                },
              });
              Transforms.insertText(editor, s, {
                at: Editor.start(editor, []),
              });
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
