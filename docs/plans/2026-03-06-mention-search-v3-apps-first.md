# Mention Search V3 — A/B Usability Test Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build two distinct mention search UX approaches as side-by-side testable components, starting with apps only. Once both are working and we've tested usability, we pick a winner and extend to all object types.

**Architecture:** Two self-contained components (`albus-mention-search-v3a.tsx` and `albus-mention-search-v3b.tsx`) share an identical props interface and are toggled in `albus-chat-input.tsx` via a `mentionVariant: "a" | "b"` prop. Both output the same `MentionSelectResult` union, so the parent handler is identical for both. Apps-only for all milestones — other object types added only after a variant is chosen.

**Tech Stack:** React hooks, Fuse.js (already installed), `createPortal`, existing `albus-mention-data.ts`, Tailwind + Lumos token classes.

---

## The Two Variants

### Variant A — Tana-style Query Completion
Inspired by Tana's command palette. The menu shows **completions of what you're typing**. Each row is a structured query template — the typed prefix appears bold, the completion grayed. Selecting a template row inserts that text and the menu updates. Selecting an item or value resolves.

| User types | Menu shows |
|---|---|
| `@` | `apps →`, `apps with status: →`, `apps with category: →` |
| `@app` | **app**`s →`, **app**`s with status: →`, **app**`s with category: →` |
| `@aws` | **AWS** `(app)`, **AWS Production** `(app)`, **aws** `with status: →` |
| `@apps status` | `Approved`, `Blocklisted`, `Discovered`… (values for status) |

**Feel:** Teaches users the query grammar as they type. Fast for power users who know what they want.

---

### Variant B — Free Search + Category Drill-Down
Inspired by the Lumos FigJam mockups. Two views:

**View 1 — Category list** (always the entry point): shows all `#Category` rows. Typing a query highlights which categories have matches. The highlighted category shows its attribute filter hints inline to the right. User selects a category to drill into.

**View 2 — Item list** (after selecting a category): shows items filtered by the active category. **Tabs appear only for categories that have matches** — not all 7, just e.g. `Apps | Entitlements | Policies | Knowledge`. Each item row shows a **match reason** on the highlighted row explaining why it surfaced.

| User types | Menu shows |
|---|---|
| `@` | All `#Category` rows, `#Apps` highlighted with attr hints |
| `@aws` | Same list, `#Apps` highlighted (has matches), `name:, status:, owner:, category:, tags:` |
| Select `#Apps` | Item list · tabs: `Apps \| Entitlements \| Policies \| Knowledge` |
| Apps tab | `AWS [1242]` · `With domain: aws.prod.2828.com` on highlight |
| Entitlements tab | `Entitlement name` · `For app: AWS[1242]` on highlight |
| Policies tab | `Some Policy Name` · `Includes App: AWS[1242]` on highlight |
| Knowledge tab | Items matching by text show `With text: aws`; by tag show `With tag: @AWS` |

**Feel:** Discoverable — user never has to know category names upfront. The match reason metadata teaches the data model as you search. Great for cross-object exploration.

**Match reason logic (per category):**
```ts
type MatchReason =
  | { label: "With domain:"; value: string }        // app matched by domain/tag
  | { label: "For app:"; value: string }             // entitlement belongs to this app
  | { label: "Includes App:"; value: string }        // policy references this app
  | { label: "With text:"; value: string }           // knowledge body contains query
  | { label: "With tag:"; value: string }            // knowledge tagged with query
  | null;                                            // no reason to show (exact name match)
```

For our mock data, fabricate reasons:
- Apps → use the tag as a pseudo-domain: `With domain: {item.tag}.com`
- Entitlements → `For app: AWS[1242]` (hardcoded for aws-related items)
- Policies → `Includes App: AWS[1242]` (hardcoded for aws-related items)
- Reports/Knowledge → alternate between `With text: {query}` and `With tag: @{query}` by index

---

## Shared Interface

Both components export the same types so the parent wiring is identical:

```ts
// Shared result type — both variants output this
export interface MentionSelectResult {
  kind: "item" | "value";
  item?: MentionItem;     // for kind: "item" — insert this as a mention node
  tag?: string;           // for kind: "value" — constructed filter slug
  display?: string;       // for kind: "value" — human-readable label
}

// Shared ref interface for keyboard forwarding
export interface MentionSearchRef {
  handleKeyDown: (e: React.KeyboardEvent) => boolean; // true = consumed
}

// Shared props interface
interface MentionSearchProps {
  query: string;                          // raw text after @
  style: React.CSSProperties;            // fixed positioning from parent
  onSelect: (result: MentionSelectResult) => void;
}
```

---

## Phase 0 — Shared Setup (do this once before building either variant)

### Task 0: Extract `mentionText` in albus-chat-input.tsx

**Files:**
- Modify: `src/components/albus-chat-input.tsx`

The raw text after `@` (between the `@` trigger and the cursor) needs to be available as a variable. It's already implicitly computed inside `handleEditorChange` when building `parsedQuery`. Extract it:

In `handleEditorChange`, find where `parsedQuery` is derived. The text between the mention start and cursor is available as a Slate text node substring. Extract it as `mentionText: string` and store in state alongside `isMentionOpen`.

Add state: `const [mentionText, setMentionText] = useState("")`

When setting `isMentionOpen(true)`, also call `setMentionText(rawText)` where `rawText` is the string between `@` and cursor. When setting `isMentionOpen(false)`, call `setMentionText("")`.

Also add:
```tsx
const [mentionVariant] = useState<"a" | "b">("a"); // toggle to "b" to test variant B
```

**Step 1:** Add `mentionText` state and `mentionVariant` state to `albus-chat-input.tsx`
**Step 2:** Ensure `mentionText` is updated whenever the mention range updates
**Step 3:** Run `pnpm dev`, confirm no regressions — existing V1 menu still works
**Step 4:** Commit
```bash
git commit -m "feat(mention-v3): extract mentionText + mentionVariant toggle"
```

---

## Phase 1 — Variant A: Tana-Style Query Completion

### Task A1: Create albus-mention-search-v3a.tsx (static, milestone 1)

**Files:**
- Create: `src/components/albus-mention-search-v3a.tsx`

```tsx
"use client";

import {
  type MentionItem,
  mentionIndex,
  categoryAttributes,
  attributeValues,
} from "@/components/albus-mention-data";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Fuse from "fuse.js";

// ── Shared types (duplicated here for isolation; extract to shared file later) ──
export interface MentionSelectResult {
  kind: "item" | "value";
  item?: MentionItem;
  tag?: string;
  display?: string;
}

export interface MentionSearchRef {
  handleKeyDown: (e: React.KeyboardEvent) => boolean;
}

// ── Internal suggestion types ────────────────────────────────────────────────
type Suggestion =
  | { kind: "template"; display: string; boldLen: number; insertText: string }
  | { kind: "item"; item: MentionItem; boldQuery: string }
  | { kind: "value"; attrKey: string; attrLabel: string; value: string; boldQuery: string };

// ── App data ────────────────────────────────────────────────────────────────
const appItems = mentionIndex.filter((i) => i.objectType === "app");
const appFuse = new Fuse(appItems, {
  keys: [{ name: "name", weight: 2 }, { name: "tag", weight: 1 }],
  threshold: 0.4,
});

const APP_TEMPLATES = [
  { display: "apps",                  insertText: "apps " },
  { display: "apps with status:",     insertText: "apps with status: " },
  { display: "apps with category:",   insertText: "apps with category: " },
  { display: "apps with risk-level:", insertText: "apps with risk-level: " },
  { display: "apps with sources:",    insertText: "apps with sources: " },
];
const templateFuse = new Fuse(APP_TEMPLATES, { keys: ["display"], threshold: 0.4 });

// ── Suggestion generator ─────────────────────────────────────────────────────
function getSuggestions(query: string): Suggestion[] {
  const q = query.trim();

  if (!q) {
    return APP_TEMPLATES.map((t) => ({
      kind: "template", display: t.display, boldLen: 0, insertText: t.insertText,
    }));
  }

  const lower = q.toLowerCase();

  // "apps with {attr}: {value}" mode
  const attrMatch = lower.match(/^apps\s+(?:with\s+)?(\w[\w-]*)\s*:?\s*(.*)$/);
  if (attrMatch) {
    const [, attrHint, valueHint] = attrMatch;
    const attrs = categoryAttributes.app;
    const matchedAttr = attrs.find(
      (a) => a.key.startsWith(attrHint) || a.label.toLowerCase().startsWith(attrHint)
    );
    if (matchedAttr) {
      const allValues = attributeValues.app[matchedAttr.key] ?? [];
      const filtered = valueHint.trim()
        ? new Fuse(allValues, { threshold: 0.4 }).search(valueHint).map((r) => r.item)
        : allValues;
      return filtered.map((v) => ({
        kind: "value",
        attrKey: matchedAttr.key,
        attrLabel: matchedAttr.label,
        value: v,
        boldQuery: valueHint.trim(),
      }));
    }
  }

  // Query starts with "app" — show narrowed templates
  if (lower.startsWith("app")) {
    return APP_TEMPLATES
      .filter((t) => t.display.startsWith(lower) || lower === "apps")
      .map((t) => ({
        kind: "template",
        display: t.display,
        boldLen: Math.min(q.length, t.display.length),
        insertText: t.insertText,
      }));
  }

  // Free text — fuzzy match app names + surface templates
  const items = appFuse.search(q).slice(0, 6).map((r) => ({
    kind: "item" as const, item: r.item, boldQuery: q,
  }));
  const templates = templateFuse.search(q).slice(0, 2).map((r) => ({
    kind: "template" as const,
    display: r.item.display, boldLen: 0, insertText: r.item.insertText,
  }));
  return [...items, ...templates];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function boldMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
export const AlbusMentionSearchV3A = forwardRef<
  MentionSearchRef,
  { query: string; style: React.CSSProperties; onSelect: (r: MentionSelectResult) => void }
>(function AlbusMentionSearchV3A({ query, style, onSelect }, ref) {
  const [activeIndex, setActiveIndex] = useState(0);
  const suggestions = useMemo(() => getSuggestions(query), [query]);

  useEffect(() => { setActiveIndex(0); }, [suggestions.length]);

  function fireSelect(s: Suggestion) {
    if (s.kind === "item") {
      onSelect({ kind: "item", item: s.item });
    } else if (s.kind === "value") {
      const slug = s.value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      onSelect({
        kind: "value",
        tag: `apps-${s.attrKey}-${slug}`,
        display: `apps · ${s.attrLabel}: ${s.value}`,
      });
    }
    // "template" kind is handled by the parent inserting text — no onSelect call
  }

  useImperativeHandle(ref, () => ({
    handleKeyDown(e) {
      if (suggestions.length === 0) return false;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
        return true;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
        return true;
      }
      if (e.key === "Enter") {
        const s = suggestions[activeIndex];
        if (!s) return false;
        e.preventDefault();
        if (s.kind === "template") {
          // Signal parent to insert the template text
          onSelect({ kind: "item", item: undefined as never }); // parent checks insertText
          // Better: fire a dedicated callback; for now parent reads from activeIndex via ref
        } else {
          fireSelect(s);
        }
        return true;
      }
      return false;
    },
  }));

  if (suggestions.length === 0) return null;

  return createPortal(
    <div
      style={style}
      className="fixed z-50 w-80 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl"
    >
      {/* Header */}
      <div className="border-b border-neutral-100 px-3 py-2.5">
        <span className="text-[0.6875rem] font-medium text-neutral-400 uppercase tracking-wide">
          Reference:
        </span>
        {query ? (
          <span className="ml-1.5 font-mono text-[0.8125rem] font-semibold text-neutral-900">
            {query}
          </span>
        ) : (
          <span className="ml-1.5 text-[0.6875rem] text-neutral-400">search or type a query</span>
        )}
      </div>

      {/* Rows */}
      <ul className="py-1 max-h-64 overflow-y-auto">
        {suggestions.map((s, i) => {
          const isActive = i === activeIndex;
          const base = `flex cursor-pointer items-center justify-between gap-3 px-3 py-[7px] text-[0.8125rem] transition-colors ${
            isActive ? "bg-neutral-100" : "hover:bg-neutral-50"
          }`;

          if (s.kind === "template") {
            return (
              <li key={i} className={base} onMouseDown={(e) => { e.preventDefault(); /* parent handles template via mentionText update */ }}>
                <span className="text-neutral-900">
                  <strong className="font-semibold">{s.display.slice(0, s.boldLen)}</strong>
                  {s.display.slice(s.boldLen)}
                </span>
                <span className="shrink-0 text-neutral-400">→</span>
              </li>
            );
          }

          if (s.kind === "item") {
            return (
              <li key={i} className={base} onMouseDown={(e) => { e.preventDefault(); fireSelect(s); }}>
                <span className="flex-1 truncate text-neutral-900">
                  {boldMatch(s.item.name, s.boldQuery)}
                </span>
                <span className="shrink-0 text-[0.6875rem] text-neutral-300">app</span>
              </li>
            );
          }

          // value
          return (
            <li key={i} className={base} onMouseDown={(e) => { e.preventDefault(); fireSelect(s); }}>
              <span className="text-neutral-900">{boldMatch(s.value, s.boldQuery)}</span>
              <span className="shrink-0 text-[0.6875rem] text-neutral-400">{s.attrLabel}</span>
            </li>
          );
        })}
      </ul>

      {/* Footer hint */}
      <div className="border-t border-neutral-100 px-3 py-1.5 flex gap-3 text-[0.6875rem] text-neutral-400">
        <span>↑↓ navigate</span>
        <span>↵ select</span>
        <span>esc close</span>
      </div>
    </div>,
    document.body,
  );
});
```

**Step 1:** Create the file with the code above.
**Step 2:** Wire into `albus-chat-input.tsx` — when `mentionVariant === "a"`, render `<AlbusMentionSearchV3A>` instead of the old `<AlbusMentionSearch>`.
**Step 3:** Test — type `@`, see 5 template rows. Type `@aws`, see app items.
**Step 4:** Commit
```bash
git commit -m "feat(mention-v3a): milestone 1 — query completion menu"
```

### Task A2: Wire template selection (insertText) in parent

When the user presses Enter or clicks a template row, the parent needs to replace the mention text with `insertText`. The cleanest way: expose `getActiveInsertText(): string | null` on the ref, so the parent can call it from its `onKeyDown` before dispatching to the component.

```tsx
// On the ref, add:
getActiveInsertText(): string | null {
  const s = suggestions[activeIndex];
  return s?.kind === "template" ? s.insertText : null;
}

// In albus-chat-input.tsx onKeyDown:
if (e.key === "Enter" && isMentionOpen && mentionVariant === "a") {
  const insertText = mentionV3ARef.current?.getActiveInsertText();
  if (insertText && mentionRange) {
    e.preventDefault();
    Transforms.select(editor, mentionRange);
    Transforms.insertText(editor, insertText);
    return; // let Slate's onChange pick up the new text and re-render menu
  }
}
```

**Step 1:** Add `getActiveInsertText` to `MentionSearchRef` interface.
**Step 2:** Implement in V3A component.
**Step 3:** Wire in parent `onKeyDown`.
**Step 4:** Test — type `@`, arrow to `apps with status:`, press Enter → query updates to `apps with status: `, menu shows status values.
**Step 5:** Commit
```bash
git commit -m "feat(mention-v3a): milestone 2 — template selection + keyboard nav"
```

---

## Phase 2 — Variant B: Free Search + Category Drill-Down

### Task B1: Create albus-mention-search-v3b.tsx

**Files:**
- Create: `src/components/albus-mention-search-v3b.tsx`

**Two internal views:**
1. **Category list view** — always the entry point; all categories shown; top matching category highlighted with attr hints
2. **Item list view** — after selecting a category; tabs = only categories with matches; each row shows match reason on highlight

**Internal state:**
```tsx
const [view, setView] = useState<"categories" | "items">("categories");
const [activeTab, setActiveTab] = useState<string>("app"); // which tab is selected
const [activeIndex, setActiveIndex] = useState(0);         // row index within current view
```

**Category list view layout:**
```
┌─────────────────────────────────────────────────────────┐
│ search: "aws"                              (quoted)     │
│ Search                                    (gray label)  │
├─────────────────────────────────────────────────────────┤
│ #Apps [highlighted]    name:, status:, owner:, tags:   │
│ #Identities                                             │
│ #Policies                                               │
│ #Knowledge                                              │
│ #Entitlements                                           │
│ #Analytics Reports                                      │
│ #Access Reviews                                         │
└─────────────────────────────────────────────────────────┘
```

**Item list view layout:**
```
┌─────────────────────────────────────────────────────────┐
│ search:  aws  (bold)                                    │
│ [Apps]  Entitlements  Policies  Knowledge               │ ← only matching cats
├─────────────────────────────────────────────────────────┤
│ AWS [1242]          With domain: aws.prod.2828.com      │ ← reason on highlight
│ AWS [2782]                                              │
│ AWS [1992]                                              │
└─────────────────────────────────────────────────────────┘
```

**Mock match data for "aws" across categories (fabricated for the prototype):**
```ts
// In the component, define mock cross-category results for queries that fuzzy-match "aws":
const MOCK_MATCHED_CATEGORIES = (query: string) => {
  const q = query.toLowerCase();
  const hasAwsMatch = q.includes("aws") || q.includes("am") || appFuse.search(q).length > 0;
  return hasAwsMatch
    ? ["app", "entitlement", "policy", "reports"] // these tabs appear
    : ["app"]; // default — always show apps
};
```

For milestone 1 (apps only), the tabs always show only `Apps`. Other tabs are added in Phase 3 when extending to all object types.

```tsx
"use client";

import {
  type MentionItem,
  mentionIndex,
  categoryAttributes,
} from "@/components/albus-mention-data";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Fuse from "fuse.js";
import type { MentionSelectResult, MentionSearchRef } from "./albus-mention-search-v3a";

// ── Data ─────────────────────────────────────────────────────────────────────
const appItems = mentionIndex.filter((i) => i.objectType === "app");
const appFuse = new Fuse(appItems, {
  keys: [{ name: "name", weight: 2 }, { name: "tag", weight: 1 }],
  threshold: 0.4,
});

const APP_ATTR_HINTS = categoryAttributes.app.map((a) => `${a.key}:`).join("  ");

// All category rows (always shown in category list view)
const ALL_CATEGORIES = [
  { id: "app",            label: "Apps",             wired: true  },
  { id: "identity",       label: "Identities",       wired: false },
  { id: "policy",         label: "Policies",         wired: false },
  { id: "reports",        label: "Knowledge",        wired: false },
  { id: "entitlement",    label: "Entitlements",     wired: false },
  { id: "access-review",  label: "Analytics Reports",wired: false },
  { id: "access-request", label: "Access Reviews",   wired: false },
] as const;

// ── Match reason ──────────────────────────────────────────────────────────────
// Fabricated for prototype — real version would come from the backend
function getMatchReason(item: MentionItem, query: string): string | null {
  if (item.objectType === "app") {
    return `With domain: ${item.tag}.aws.com`;
  }
  return null;
}

// ── Tab derivation ────────────────────────────────────────────────────────────
// Only categories with matches appear as tabs.
// For M1 (apps only), always just ["app"].
// When extended to all types, each category's search returns hits and we include
// it in the tabs array only if hits > 0.
function getMatchingTabs(query: string): string[] {
  const appHits = query.trim()
    ? appFuse.search(query).length
    : appItems.length;
  const tabs: string[] = [];
  if (appHits > 0) tabs.push("app");
  // Future: add "identity", "policy", "reports", "entitlement" when wired
  return tabs.length > 0 ? tabs : ["app"];
}

const TAB_LABELS: Record<string, string> = {
  app: "Apps",
  identity: "Identities",
  policy: "Policies",
  reports: "Knowledge",
  entitlement: "Entitlements",
};

// ── Component ─────────────────────────────────────────────────────────────────
export const AlbusMentionSearchV3B = forwardRef<
  MentionSearchRef,
  { query: string; style: React.CSSProperties; onSelect: (r: MentionSelectResult) => void }
>(function AlbusMentionSearchV3B({ query, style, onSelect }, ref) {
  const [view, setView] = useState<"categories" | "items">("categories");
  const [activeTab, setActiveTab] = useState("app");
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset to category view when query changes significantly
  useEffect(() => {
    setView("categories");
    setActiveIndex(0);
  }, [query]);

  const matchedItems = useMemo(() => {
    if (!query.trim()) return appItems.slice(0, 8);
    return appFuse.search(query).map((r) => r.item);
  }, [query]);

  const matchingTabs = useMemo(() => getMatchingTabs(query), [query]);

  // Ensure activeTab is always valid
  useEffect(() => {
    if (!matchingTabs.includes(activeTab)) setActiveTab(matchingTabs[0] ?? "app");
  }, [matchingTabs, activeTab]);

  useImperativeHandle(ref, () => ({
    handleKeyDown(e) {
      if (view === "categories") {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, ALL_CATEGORIES.length - 1));
          return true;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          return true;
        }
        if (e.key === "Enter" || e.key === "ArrowRight") {
          const cat = ALL_CATEGORIES[activeIndex];
          if (cat?.wired) {
            e.preventDefault();
            setActiveTab(cat.id);
            setView("items");
            setActiveIndex(0);
            return true;
          }
        }
      }

      if (view === "items") {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, matchedItems.length - 1));
          return true;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          return true;
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setView("categories");
          setActiveIndex(0);
          return true;
        }
        if (e.key === "Enter") {
          const item = matchedItems[activeIndex];
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
      {/* ── Header ── */}
      <div className="px-3 py-2.5">
        <span className="text-[0.8125rem] text-neutral-500">search: </span>
        {query ? (
          <span className="font-semibold text-neutral-900">{query}</span>
        ) : (
          <span className="text-neutral-400 text-[0.8125rem]">…</span>
        )}
        <div className="text-[0.6875rem] text-neutral-400 mt-0.5">
          {view === "categories" ? "Search" : TAB_LABELS[activeTab] ?? "Results"}
        </div>
      </div>

      <div className="border-t border-neutral-100" />

      {/* ── Category list view ── */}
      {view === "categories" && (
        <ul className="py-1 max-h-64 overflow-y-auto">
          {ALL_CATEGORIES.map((cat, i) => {
            const isActive = i === activeIndex;
            const isApps = cat.id === "app";
            return (
              <li
                key={cat.id}
                className={`flex cursor-pointer items-center justify-between px-3 py-[7px] text-[0.8125rem] transition-colors ${
                  isActive ? "bg-neutral-100" : cat.wired ? "hover:bg-neutral-50" : "cursor-default"
                } ${!cat.wired ? "opacity-35" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (cat.wired) {
                    setActiveTab(cat.id);
                    setView("items");
                    setActiveIndex(0);
                  }
                }}
              >
                <span className={`font-medium ${isActive ? "text-neutral-900" : "text-neutral-700"}`}>
                  #{cat.label}
                </span>
                {/* Show attribute hints on the highlighted row that has matches */}
                {isActive && isApps && (
                  <span className="text-[0.6875rem] text-neutral-400 truncate ml-4">
                    {APP_ATTR_HINTS}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* ── Item list view ── */}
      {view === "items" && (
        <>
          {/* Tabs — only categories with matches */}
          <div className="flex gap-0 px-3 py-2 border-b border-neutral-100 overflow-x-auto">
            {matchingTabs.map((tabId) => (
              <button
                key={tabId}
                className={`mr-4 shrink-0 pb-0.5 text-[0.8125rem] transition-colors ${
                  activeTab === tabId
                    ? "font-semibold text-neutral-900 border-b-2 border-neutral-900"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
                onMouseDown={(e) => { e.preventDefault(); setActiveTab(tabId); setActiveIndex(0); }}
              >
                {TAB_LABELS[tabId] ?? tabId}
              </button>
            ))}
          </div>

          {/* Items */}
          <ul className="py-1 max-h-52 overflow-y-auto">
            {matchedItems.length === 0 && (
              <li className="px-3 py-3 text-[0.8125rem] text-neutral-400">No results</li>
            )}
            {matchedItems.map((item, i) => {
              const isActive = i === activeIndex;
              const reason = isActive ? getMatchReason(item, query) : null;
              return (
                <li
                  key={item.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-[7px] text-[0.8125rem] transition-colors ${
                    isActive ? "bg-neutral-100" : "hover:bg-neutral-50"
                  }`}
                  onMouseDown={(e) => { e.preventDefault(); onSelect({ kind: "item", item }); }}
                >
                  <span className="flex-1 truncate text-neutral-900">{item.name}</span>
                  {reason && (
                    <span className="shrink-0 text-[0.6875rem] text-neutral-400">{reason}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* ── Footer ── */}
      <div className="border-t border-neutral-100 px-3 py-1.5 flex gap-3 text-[0.6875rem] text-neutral-400">
        {view === "categories" ? (
          <><span>↑↓ navigate</span><span>→ open</span><span>↵ select</span></>
        ) : (
          <><span>↑↓ navigate</span><span>← back</span><span>↵ select</span></>
        )}
      </div>
    </div>,
    document.body,
  );
});
```

**Step 1:** Create the file with the code above.
**Step 2:** In `albus-chat-input.tsx`, when `mentionVariant === "b"`, render `<AlbusMentionSearchV3B>`.
**Step 3:** Test category view — type `@`, see all category rows, `#Apps` highlighted, attribute hints visible.
**Step 4:** Test item view — arrow to `#Apps`, press Enter → see item list, `@aws` search works.
**Step 5:** Commit
```bash
git commit -m "feat(mention-v3b): milestone 1+2 — category list + item drill-down"
```

---

## Phase 3 — Toggle Demo in UI

### Task C1: Add a visible variant toggle to the demo

So usability testing is easy, add a small toggle in the Albus chat demo (not in the component itself — in the demo page wrapper) that lets you switch between A and B without touching code.

**Files:**
- Modify: `src/app/demo/[name]/components/albus-chat-input.tsx` (the demo wrapper, NOT the component)

Add a `<select>` or two pill buttons above the chat input:
```tsx
<div className="flex gap-2 mb-2">
  <button onClick={() => setVariant("a")} className={variant === "a" ? "..." : "..."}>
    Variant A — Query Completion
  </button>
  <button onClick={() => setVariant("b")} className={variant === "b" ? "..." : "..."}>
    Variant B — Category Search
  </button>
</div>
```

Pass `variant` down to `AlbusChatInput` as a prop, or expose it via a URL param (`?variant=b`).

**Step 1:** Add variant toggle to demo wrapper.
**Step 2:** Verify switching between A and B works live without page refresh.
**Step 3:** Commit
```bash
git commit -m "feat(mention-v3): add variant toggle to demo for usability testing"
```

---

## Testing Checklist (run both variants against these scenarios)

| Scenario | Variant A behavior | Variant B behavior |
|---|---|---|
| Type `@` | 5 template rows | Category list, #Apps highlighted |
| Type `@app` | Templates narrow, bold prefix | Same category list |
| Type `@aws` | AWS, AWS Production, AWS Dev items | #Apps highlighted, enter → AWS items |
| Type `@apps status` | Status values listed | N/A (free search only in B) |
| Arrow down → Enter | Selects highlighted row | Navigates then selects |
| Escape | Closes menu | Closes menu |
| Select AWS | Inserts @aws mention chip | Inserts @aws mention chip |

---

## Notes

- The V1 `AlbusMentionSearch` is NOT removed during this work — all three coexist.
- `MentionSelectResult` and `MentionSearchRef` are defined in V3A and imported by V3B. Extract to a shared `albus-mention-types.ts` when both are stable.
- Other object types (identities, policies, etc.) are added to whichever variant wins the usability test.
- Run `pnpm test` after each phase — the parser unit tests are independent of the UI.
- The `entitlement` key is missing from `categoryCanonicalAlias` in `albus-chat-input.tsx` — fix that in Phase 0.
