"use client";

import {
  type MentionItem,
  type MentionObjectType,
  attributeValues,
  categoryAttributes,
  groupLabels,
  mentionIndex,
  searchMentions,
} from "@/components/albus-mention-data";
import Fuse from "fuse.js";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

// ── Shared exported types (V3B imports from here) ────────────────────────────
export interface MentionSelectResult {
  kind: "item" | "value";
  item?: MentionItem;
  tag?: string;
  display?: string;
  objectType?: MentionObjectType;
}

export interface MentionSearchRef {
  handleKeyDown: (e: React.KeyboardEvent) => boolean;
  getActiveInsertText: () => string | null;
}

// ── Type definitions ──────────────────────────────────────────────────────────
// userLabel = what the user types after @; insertText always includes @ so
// dropdown stays open after template injection (replaces @query with @completion)
const TYPE_DEFS = [
  { typeKey: "app" as const,            userLabel: "apps",         displayLabel: "Apps" },
  { typeKey: "identity" as const,       userLabel: "identities",   displayLabel: "Identities" },
  { typeKey: "policy" as const,         userLabel: "policies",     displayLabel: "Policies" },
  { typeKey: "entitlement" as const,    userLabel: "entitlements", displayLabel: "Entitlements" },
  { typeKey: "reports" as const,        userLabel: "reports",      displayLabel: "Reports" },
  { typeKey: "access-review" as const,  userLabel: "reviews",      displayLabel: "Access Reviews" },
  { typeKey: "access-request" as const, userLabel: "requests",     displayLabel: "Access Requests" },
] as const;

type TypeDef = (typeof TYPE_DEFS)[number];

// Sort by label length descending for greedy prefix matching
const SORTED_TYPES = [...TYPE_DEFS].sort((a, b) => b.userLabel.length - a.userLabel.length);

// ── Per-type Fuse instances ────────────────────────────────────────────────────
const fuseByType = Object.fromEntries(
  TYPE_DEFS.map((td) => [
    td.typeKey,
    new Fuse(mentionIndex.filter((i) => i.objectType === td.typeKey), {
      keys: [{ name: "name", weight: 2 }, { name: "tag", weight: 1 }],
      threshold: 0.4,
    }),
  ]),
) as Record<MentionObjectType, Fuse<MentionItem>>;

// ── Per-type templates ────────────────────────────────────────────────────────
function makeTemplates(td: TypeDef) {
  return [
    { display: td.userLabel, insertText: `@${td.userLabel} ` },
    ...(categoryAttributes[td.typeKey] ?? []).map((a) => ({
      display: `${td.userLabel} with ${a.key}:`,
      insertText: `@${td.userLabel} with ${a.key}: `,
    })),
  ];
}

// ── Internal suggestion type ──────────────────────────────────────────────────
type Suggestion =
  | { kind: "category"; typeKey: MentionObjectType; insertText: string }
  | { kind: "template"; typeKey: MentionObjectType; display: string; boldLen: number; insertText: string }
  | { kind: "item"; item: MentionItem; boldQuery: string }
  | { kind: "value"; typeKey: MentionObjectType; attrKey: string; attrLabel: string; value: string; boldQuery: string };

// ── Suggestion generator ──────────────────────────────────────────────────────
function getSuggestions(query: string): Suggestion[] {
  const q = query.trim();

  // Empty → category browse
  if (!q) {
    return TYPE_DEFS.map((td) => ({
      kind: "category" as const,
      typeKey: td.typeKey,
      insertText: `@${td.userLabel} `,
    }));
  }

  const lower = q.toLowerCase();

  // Try to match a full type prefix (longest label first to avoid ambiguity)
  for (const td of SORTED_TYPES) {
    if (!lower.startsWith(td.userLabel)) continue;
    const rest = lower.slice(td.userLabel.length).trimStart();

    // "{type} with {attr}: {value}" → value completions
    const withMatch = rest.match(/^with\s+(\w[\w-]*)\s*:?\s*(.*)$/);
    if (withMatch) {
      const [, attrHint, valueHint] = withMatch;
      const matchedAttr = (categoryAttributes[td.typeKey] ?? []).find(
        (a) => a.key.startsWith(attrHint) || a.label.toLowerCase().startsWith(attrHint),
      );
      if (matchedAttr) {
        const allValues = attributeValues[td.typeKey]?.[matchedAttr.key] ?? [];
        const filtered = valueHint.trim()
          ? new Fuse(allValues, { threshold: 0.4 }).search(valueHint).map((r) => r.item)
          : allValues;
        return filtered.map((v) => ({
          kind: "value" as const,
          typeKey: td.typeKey,
          attrKey: matchedAttr.key,
          attrLabel: matchedAttr.label,
          value: v,
          boldQuery: valueHint.trim(),
        }));
      }
    }

    // "{type} {text}" without "with" → item search + matching attr templates
    if (rest && !rest.startsWith("with")) {
      const items = fuseByType[td.typeKey].search(rest, { limit: 5 }).map((r) => ({
        kind: "item" as const,
        item: r.item,
        boldQuery: rest,
      }));
      const attrTemplates = (categoryAttributes[td.typeKey] ?? [])
        .filter((a) => a.key.includes(rest) || a.label.toLowerCase().includes(rest))
        .map((a) => ({
          kind: "template" as const,
          typeKey: td.typeKey,
          display: `${td.userLabel} with ${a.key}:`,
          boldLen: td.userLabel.length,
          insertText: `@${td.userLabel} with ${a.key}: `,
        }));
      return [...items.slice(0, 4), ...attrTemplates.slice(0, 3)];
    }

    // Just the type label (or starts with it) → show its templates
    return makeTemplates(td).map((t) => ({
      kind: "template" as const,
      typeKey: td.typeKey,
      display: t.display,
      boldLen: Math.min(q.length, t.display.length),
      insertText: t.insertText,
    }));
  }

  // Partial prefix → user is mid-typing a type name; show matching templates
  const partialMatches = TYPE_DEFS.filter((td) => td.userLabel.startsWith(lower));
  if (partialMatches.length > 0) {
    return partialMatches.flatMap((td) =>
      makeTemplates(td)
        .slice(0, 3)
        .map((t) => ({
          kind: "template" as const,
          typeKey: td.typeKey,
          display: t.display,
          boldLen: Math.min(q.length, t.display.length),
          insertText: t.insertText,
        })),
    );
  }

  // Free-text cross-type search
  const groups = searchMentions(lower);
  return groups
    .flatMap((g) => g.items.slice(0, 3).map((item) => ({ kind: "item" as const, item, boldQuery: lower })))
    .slice(0, 8);
}

// ── Bold match helper ─────────────────────────────────────────────────────────
function BoldMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export const AlbusMentionSearchV3A = forwardRef<
  MentionSearchRef,
  {
    query: string;
    style: React.CSSProperties;
    onSelect: (r: MentionSelectResult) => void;
    onInsertText: (text: string) => void;
  }
>(function AlbusMentionSearchV3A({ query, style, onSelect, onInsertText }, ref) {
  const [activeIndex, setActiveIndex] = useState(0);
  const suggestions = useMemo(() => getSuggestions(query), [query]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  function fireSelect(s: Suggestion) {
    if (s.kind === "category" || s.kind === "template") {
      onInsertText(s.insertText);
    } else if (s.kind === "item") {
      onSelect({ kind: "item", item: s.item });
    } else {
      const slug = s.value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const td = TYPE_DEFS.find((t) => t.typeKey === s.typeKey)!;
      onSelect({
        kind: "value",
        objectType: s.typeKey,
        tag: `${td.userLabel}-${s.attrKey}-${slug}`,
        display: `${td.displayLabel} · ${s.attrLabel}: ${s.value}`,
      });
    }
  }

  useImperativeHandle(ref, () => ({
    handleKeyDown(e) {
      if (suggestions.length === 0) return false;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        return true;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return true;
      }
      if (e.key === "Enter") {
        const s = suggestions[activeIndex];
        if (s) { e.preventDefault(); fireSelect(s); return true; }
      }
      return false;
    },
    getActiveInsertText() {
      const s = suggestions[activeIndex];
      return s?.kind === "template" || s?.kind === "category" ? s.insertText : null;
    },
  }));

  if (suggestions.length === 0) return null;

  // Derive header label from first suggestion
  const first = suggestions[0];
  const headerSub =
    first?.kind === "category" ? "Start with a type" :
    first?.kind === "value"    ? `${groupLabels[first.typeKey]} · ${first.attrLabel}` :
    first?.kind === "template" ? `${groupLabels[first.typeKey]} query` :
                                 "Search all types";
  const isInsertMode = first?.kind === "category" || first?.kind === "template";

  return createPortal(
    <div
      style={style}
      className="fixed z-50 w-80 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl"
    >
      {/* Header */}
      <div className="border-b border-neutral-100 px-3 py-2.5">
        <div className="text-[0.6875rem] font-medium uppercase tracking-wide text-neutral-400">
          {headerSub}
        </div>
        <div className="mt-0.5 font-mono text-[0.8125rem] font-semibold text-neutral-900">
          {query ? `@${query}` : <span className="font-normal text-neutral-400">@type to compose</span>}
        </div>
      </div>

      {/* Rows */}
      <ul className="max-h-64 overflow-y-auto py-1">
        {suggestions.map((s, i) => {
          const isActive = i === activeIndex;
          const row = `flex cursor-pointer items-center justify-between gap-3 px-3 py-[7px] text-[0.8125rem] transition-colors ${
            isActive ? "bg-neutral-100" : "hover:bg-neutral-50"
          }`;

          if (s.kind === "category") {
            const attrs = categoryAttributes[s.typeKey] ?? [];
            return (
              <li key={s.typeKey} className={row} onMouseDown={(e) => { e.preventDefault(); fireSelect(s); }}>
                <span className="font-medium text-neutral-900">
                  #{groupLabels[s.typeKey]}
                </span>
                {isActive && attrs.length > 0 ? (
                  <span className="truncate text-[0.6875rem] text-neutral-400">
                    {attrs.slice(0, 3).map((a) => `${a.key}:`).join("  ")}
                  </span>
                ) : (
                  <span className="shrink-0 text-neutral-300">→</span>
                )}
              </li>
            );
          }

          if (s.kind === "template") {
            return (
              <li key={`${s.typeKey}-${s.display}`} className={row} onMouseDown={(e) => { e.preventDefault(); fireSelect(s); }}>
                <span className="text-neutral-900">
                  <strong className="font-semibold">{s.display.slice(0, s.boldLen)}</strong>
                  <span className="text-neutral-500">{s.display.slice(s.boldLen)}</span>
                </span>
                <span className="shrink-0 text-neutral-300">→</span>
              </li>
            );
          }

          if (s.kind === "item") {
            return (
              <li key={s.item.id} className={row} onMouseDown={(e) => { e.preventDefault(); fireSelect(s); }}>
                <span className="flex-1 truncate text-neutral-900">
                  <BoldMatch text={s.item.name} query={s.boldQuery} />
                </span>
                <span className="shrink-0 text-[0.6875rem] text-neutral-300">
                  {groupLabels[s.item.objectType]}
                </span>
              </li>
            );
          }

          // value row
          return (
            <li key={s.value} className={row} onMouseDown={(e) => { e.preventDefault(); fireSelect(s); }}>
              <span className="text-neutral-900">
                <BoldMatch text={s.value} query={s.boldQuery} />
              </span>
              <span className="shrink-0 text-[0.6875rem] text-neutral-400">{s.attrLabel}</span>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="flex gap-3 border-t border-neutral-100 px-3 py-1.5 text-[0.6875rem] text-neutral-400">
        <span>↑↓ navigate</span>
        <span>↵ {isInsertMode ? "insert" : "select"}</span>
        <span>esc dismiss</span>
      </div>
    </div>,
    document.body,
  );
});
