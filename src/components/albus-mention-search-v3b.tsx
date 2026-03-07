"use client";

import {
  type AttributeDef,
  type MentionItem,
  type MentionObjectType,
  categoryAttributes,
  groupLabels,
  matchCategory,
  mentionIndex,
} from "@/components/albus-mention-data";
import {
  type MentionSearchRef,
  type MentionSelectResult,
} from "@/components/albus-mention-search-v3a";
import Fuse from "fuse.js";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

// Re-export shared types so callers can import from either V3A or V3B
export type { MentionSearchRef, MentionSelectResult };

// ── Per-type Fuse instances ────────────────────────────────────────────────────
const FUZE_OPTS = {
  keys: [{ name: "name", weight: 2 }, { name: "tag", weight: 1 }],
  threshold: 0.4,
};
const ALL_TYPES: MentionObjectType[] = [
  "app", "identity", "policy", "entitlement", "reports", "access-review", "access-request",
];
const fuseByType = Object.fromEntries(
  ALL_TYPES.map((t) => [t, new Fuse(mentionIndex.filter((i) => i.objectType === t), FUZE_OPTS)]),
) as Record<MentionObjectType, Fuse<MentionItem>>;

const defaultsByType = Object.fromEntries(
  ALL_TYPES.map((t) => [t, mentionIndex.filter((i) => i.objectType === t).slice(0, 6)]),
) as Record<MentionObjectType, MentionItem[]>;

function searchType(type: MentionObjectType, q: string): MentionItem[] {
  return q.trim() ? fuseByType[type].search(q, { limit: 8 }).map((r) => r.item) : defaultsByType[type];
}

// ── Attribute fuzzy search ────────────────────────────────────────────────────
const attrFuseByType = Object.fromEntries(
  ALL_TYPES.map((t) => [
    t,
    new Fuse(categoryAttributes[t] ?? [], { keys: ["label", "key"], threshold: 0.4 }),
  ]),
) as Record<MentionObjectType, Fuse<AttributeDef>>;

function matchAttrs(type: MentionObjectType, q: string): AttributeDef[] {
  if (!q.trim()) return categoryAttributes[type] ?? [];
  return attrFuseByType[type].search(q).map((r) => r.item);
}

// ── Smart query parser ────────────────────────────────────────────────────────
// "apps aws"  → category=app, itemQuery="aws"
// "apps cate" → category=app, itemQuery="cate" (+ attr hints for "cate")
// "apps "     → category=app, itemQuery="" (trailing space triggers category mode)
// "aws"       → cross-type search
type ParsedQuery =
  | { mode: "empty" }
  | { mode: "category"; category: MentionObjectType; itemQuery: string }
  | { mode: "search"; query: string };

function parseQuery(raw: string): ParsedQuery {
  if (!raw.trim()) return { mode: "empty" };
  // Any space after first word = potential category mode
  if (/\s/.test(raw)) {
    const firstSpace = raw.indexOf(" ");
    const firstWord = raw.slice(0, firstSpace);
    const rest = raw.slice(firstSpace + 1);
    const cat = matchCategory(firstWord);
    if (cat) return { mode: "category", category: cat, itemQuery: rest.trim() };
  }
  return { mode: "search", query: raw.trim() };
}

// ── User-facing type labels (for onInsertText) ────────────────────────────────
const TYPE_USER_LABELS: Record<MentionObjectType, string> = {
  app: "apps",
  identity: "identities",
  policy: "policies",
  entitlement: "entitlements",
  reports: "reports",
  "access-review": "reviews",
  "access-request": "requests",
};

// ── Match reason — contextual tag per type ────────────────────────────────────
function getMatchReason(item: MentionItem): string {
  switch (item.objectType) {
    case "app":            return `@${item.tag}`;
    case "identity":       return "identity";
    case "policy":         return "policy";
    case "entitlement":    return "entitlement";
    case "reports":        return "document";
    case "access-review":  return "review";
    case "access-request": return "request";
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export const AlbusMentionSearchV3B = forwardRef<
  MentionSearchRef,
  {
    query: string;
    style: React.CSSProperties;
    onSelect: (r: MentionSelectResult) => void;
    onInsertText: (text: string) => void;
  }
>(function AlbusMentionSearchV3B({ query, style, onSelect, onInsertText }, ref) {
  const [activeTab, setActiveTab] = useState<MentionObjectType>("app");
  const [activeIndex, setActiveIndex] = useState(0);

  const parsed = useMemo(() => parseQuery(query), [query]);

  // Tabs + items per tab derived from parsed query
  const { tabs, itemsByTab, attrHints } = useMemo(() => {
    if (parsed.mode === "empty") {
      return { tabs: ALL_TYPES, itemsByTab: defaultsByType as Record<MentionObjectType, MentionItem[]>, attrHints: [] };
    }
    if (parsed.mode === "category") {
      const items = searchType(parsed.category, parsed.itemQuery);
      const hints = matchAttrs(parsed.category, parsed.itemQuery);
      return {
        tabs: [parsed.category] as MentionObjectType[],
        itemsByTab: { [parsed.category]: items } as Record<MentionObjectType, MentionItem[]>,
        attrHints: hints,
      };
    }
    // search mode — collect all types with hits
    const tabs: MentionObjectType[] = [];
    const itemsByTab: Partial<Record<MentionObjectType, MentionItem[]>> = {};
    for (const type of ALL_TYPES) {
      const hits = searchType(type, parsed.query);
      if (hits.length > 0) { tabs.push(type); itemsByTab[type] = hits; }
    }
    return { tabs, itemsByTab: itemsByTab as Record<MentionObjectType, MentionItem[]>, attrHints: [] };
  }, [parsed]);

  const activeItems = itemsByTab[activeTab] ?? [];

  // Keep activeTab valid when tabs change
  useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeTab)) setActiveTab(tabs[0]);
  }, [tabs, activeTab]);

  // Reset selection index when query or tab changes
  useEffect(() => { setActiveIndex(0); }, [query, activeTab]);

  const showCategoryList = parsed.mode === "empty";
  const totalNav = showCategoryList ? ALL_TYPES.length : activeItems.length;

  useImperativeHandle(ref, () => ({
    handleKeyDown(e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, totalNav - 1));
        return true;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return true;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (!showCategoryList && tabs.length > 1) {
          e.preventDefault();
          const ci = tabs.indexOf(activeTab);
          const next = e.key === "ArrowRight" ? Math.min(ci + 1, tabs.length - 1) : Math.max(ci - 1, 0);
          setActiveTab(tabs[next]);
          return true;
        }
      }
      if (e.key === "Enter") {
        if (!showCategoryList) {
          const item = activeItems[activeIndex];
          if (item) { e.preventDefault(); onSelect({ kind: "item", item }); return true; }
        }
      }
      return false;
    },
    getActiveInsertText: () => null,
  }));

  return createPortal(
    <div
      style={style}
      className="fixed z-50 w-80 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl"
    >
      {/* ── Category browse — empty query ── */}
      {showCategoryList && (
        <ul className="max-h-72 overflow-y-auto py-1">
          {ALL_TYPES.map((type, i) => {
            const isActive = i === activeIndex;
            const attrs = categoryAttributes[type] ?? [];
            return (
              <li
                key={type}
                className={`flex cursor-pointer items-center justify-between px-3 py-[7px] text-[0.8125rem] transition-colors ${
                  isActive ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onInsertText(`@${TYPE_USER_LABELS[type]} `);
                  setActiveIndex(0);
                }}
              >
                <span className="font-medium text-neutral-900">
                  #{groupLabels[type]}
                </span>
                {isActive && attrs.length > 0 ? (
                  <span className="ml-3 truncate text-[0.6875rem] text-neutral-400">
                    {attrs.slice(0, 3).map((a) => `${a.key}:`).join("  ")}
                  </span>
                ) : (
                  <span className="shrink-0 text-neutral-300">→</span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* ── Results — query has text ── */}
      {!showCategoryList && (
        <>
          {/* Tabs */}
          {tabs.length > 1 && (
            <div className="flex overflow-x-auto border-b border-neutral-100 px-3 pt-2 pb-0">
              {tabs.map((type) => (
                <button
                  key={type}
                  className={`mr-4 shrink-0 pb-2 text-[0.8125rem] transition-colors ${
                    activeTab === type
                      ? "border-b-2 border-neutral-900 font-semibold text-neutral-900"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                  onMouseDown={(e) => { e.preventDefault(); setActiveTab(type); setActiveIndex(0); }}
                >
                  {groupLabels[type]}
                  {tabs.length > 1 && (
                    <span className="ml-1 text-[0.625rem] text-neutral-400">
                      ({(itemsByTab[type] ?? []).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Attribute hints — shown in category mode when itemQuery matches attrs */}
          {attrHints.length > 0 && (
            <div className="border-b border-neutral-100 px-3 py-1.5">
              <div className="mb-1 text-[0.625rem] font-medium uppercase tracking-wide text-neutral-400">
                Filter by
              </div>
              <div className="flex flex-wrap gap-1.5">
                {attrHints.map((attr) => (
                  <span
                    key={attr.key}
                    className="rounded-md bg-neutral-100 px-2 py-0.5 text-[0.75rem] text-neutral-700"
                  >
                    {attr.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {activeItems.length === 0 && (
              <li className="px-3 py-3 text-[0.8125rem] text-neutral-400">No results</li>
            )}
            {activeItems.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <li
                  key={item.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-[7px] text-[0.8125rem] transition-colors ${
                    isActive ? "bg-neutral-100" : "hover:bg-neutral-50"
                  }`}
                  onMouseDown={(e) => { e.preventDefault(); onSelect({ kind: "item", item }); }}
                >
                  <span className="flex-1 truncate text-neutral-900">{item.name}</span>
                  {isActive && (
                    <span className="shrink-0 text-[0.6875rem] text-neutral-400">
                      {getMatchReason(item)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* ── Footer ── */}
      <div className="flex gap-3 border-t border-neutral-100 px-3 py-1.5 text-[0.6875rem] text-neutral-400">
        <span>↑↓ navigate</span>
        {!showCategoryList && tabs.length > 1 && <span>←→ switch type</span>}
        <span>↵ select</span>
      </div>
    </div>,
    document.body,
  );
});
