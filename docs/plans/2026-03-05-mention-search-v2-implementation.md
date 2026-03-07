# @Mention Search v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the Albus @mention system from single-word fuzzy search to a two-mode reference engine: free cross-object search + colon-scoped path expressions.

**Architecture:** Introduce a `parseMentionQuery` function that interprets the raw string after `@` and returns a typed state (`free | scoped`). The mention regex is widened to capture multi-token paths. `AlbusMentionSearch` becomes fully controlled — category/attribute state lives in `AlbusChatInput` and is passed down as props.

**Tech Stack:** Slate.js (rich text editor), Fuse.js (fuzzy search), React portals, Vitest (tests)

**Design doc:** `docs/plans/2026-03-05-mention-search-v2-design.md`

---

## Task 1: Extend the data layer

**Files:**
- Modify: `src/components/albus-mention-data.ts`

### Step 1: Add `AttributeDef` type and `categoryAttributes`

Add after the existing `GroupedResults` interface (~line 314):

```ts
export interface AttributeDef {
  key: string;
  label: string;
  section: "attribute" | "property";
}

export const categoryAttributes: Record<MentionObjectType, AttributeDef[]> = {
  app: [
    { key: "category", label: "Category", section: "attribute" },
    { key: "business-criticality", label: "Criticality", section: "attribute" },
    { key: "status", label: "Status", section: "attribute" },
    { key: "tags", label: "Tags", section: "attribute" },
    { key: "entitlements", label: "Entitlements", section: "property" },
  ],
  identity: [
    { key: "department", label: "Department", section: "attribute" },
    { key: "role", label: "Role", section: "attribute" },
    { key: "status", label: "Status", section: "attribute" },
  ],
  policy: [
    { key: "type", label: "Type", section: "attribute" },
    { key: "status", label: "Status", section: "attribute" },
    { key: "enforcement", label: "Enforcement", section: "attribute" },
  ],
  knowledge: [
    { key: "type", label: "Type", section: "attribute" },
    { key: "author", label: "Author", section: "attribute" },
    { key: "tags", label: "Tags", section: "attribute" },
  ],
  entitlement: [
    { key: "app", label: "App", section: "attribute" },
    { key: "type", label: "Type", section: "attribute" },
    { key: "risk-level", label: "Risk Level", section: "attribute" },
  ],
  "access-review": [
    { key: "status", label: "Status", section: "attribute" },
    { key: "reviewer", label: "Reviewer", section: "attribute" },
    { key: "scope", label: "Scope", section: "attribute" },
  ],
  "access-request": [
    { key: "status", label: "Status", section: "attribute" },
    { key: "requester", label: "Requester", section: "attribute" },
    { key: "app", label: "App", section: "attribute" },
  ],
};
```

### Step 2: Add `attributeValues`

```ts
export const attributeValues: Partial<Record<MentionObjectType, Record<string, string[]>>> = {
  app: {
    category: ["HR", "Finance", "Engineering", "IT", "Security", "Sales", "Marketing"],
    "business-criticality": ["Critical", "High", "Medium", "Low"],
    status: ["Approved", "Blacklisted", "Deprecated", "Discovered", "In Review", "Needs Review"],
    tags: ["SOC2", "HIPAA", "PCI", "Internal", "External", "Cloud"],
    entitlements: ["Admin role", "Read-only", "Editor", "Viewer", "Super admin", "Billing admin"],
  },
  identity: {
    department: ["Engineering", "Design", "Sales", "Marketing", "Finance", "HR", "Legal"],
    role: ["Admin", "Member", "Viewer", "Owner"],
    status: ["Active", "Inactive", "Pending", "Suspended"],
  },
  policy: {
    type: ["Access", "Password", "MFA", "Data Classification", "Acceptable Use"],
    status: ["Active", "Inactive", "Draft"],
    enforcement: ["Strict", "Advisory", "Disabled"],
  },
  knowledge: {
    type: ["Policy", "Playbook", "Guide", "Checklist", "Matrix"],
    author: ["Lumos", "Admin", "Custom"],
    tags: ["Compliance", "Security", "Onboarding", "Risk", "Access"],
  },
  entitlement: {
    app: ["Okta", "Salesforce", "GitHub", "AWS", "Google Workspace"],
    type: ["Role", "Group", "Permission"],
    "risk-level": ["Critical", "High", "Medium", "Low"],
  },
  "access-review": {
    status: ["Active", "Completed", "Draft", "Overdue"],
    reviewer: ["Admin", "Manager", "Owner"],
    scope: ["All Users", "Contractors", "Employees", "Vendors"],
  },
  "access-request": {
    status: ["Pending", "Approved", "Rejected", "Expired"],
    requester: ["Employee", "Contractor", "Any"],
    app: ["Okta", "Salesforce", "GitHub", "AWS"],
  },
};
```

### Step 3: Add `popularItemIds` and `getPopularItems`

```ts
export const popularItemIds: Record<MentionObjectType, string[]> = {
  app: ["app-aws", "app-google-workspace", "app-okta"],
  identity: ["id-employees", "id-engineers", "id-contractors"],
  policy: ["pol-access-policy", "pol-mfa-policy", "pol-password-policy"],
  knowledge: ["kb-contractor-access-policy", "kb-birthright-rules", "kb-risk-matrix"],
  entitlement: ["ent-admin-role", "ent-editor", "ent-read-only"],
  "access-review": ["ar-q1-review", "ar-annual-compliance", "ar-contractor-review"],
  "access-request": ["areq-pending", "areq-my-requests", "areq-open-requests"],
};

export function getPopularItems(category: MentionObjectType): MentionItem[] {
  const ids = popularItemIds[category] ?? [];
  return ids
    .map((id) => mentionIndex.find((item) => item.id === id))
    .filter((item): item is MentionItem => item !== undefined);
}
```

### Step 4: Add `matchCategory`

Add after the existing `fuse` declaration:

```ts
const categoryAliasData: Array<{ label: string; type: MentionObjectType }> = [
  { label: "apps", type: "app" },
  { label: "app", type: "app" },
  { label: "applications", type: "app" },
  { label: "identities", type: "identity" },
  { label: "identity", type: "identity" },
  { label: "users", type: "identity" },
  { label: "people", type: "identity" },
  { label: "policies", type: "policy" },
  { label: "policy", type: "policy" },
  { label: "knowledge", type: "knowledge" },
  { label: "docs", type: "knowledge" },
  { label: "entitlements", type: "entitlement" },
  { label: "entitlement", type: "entitlement" },
  { label: "permissions", type: "entitlement" },
  { label: "reviews", type: "access-review" },
  { label: "access reviews", type: "access-review" },
  { label: "requests", type: "access-request" },
  { label: "access requests", type: "access-request" },
];

const categoryFuse = new Fuse(categoryAliasData, {
  keys: ["label"],
  threshold: 0.25,
});

export function matchCategory(query: string): MentionObjectType | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const results = categoryFuse.search(q);
  return results[0]?.item.type ?? null;
}
```

### Step 5: Commit

```bash
git add src/components/albus-mention-data.ts
git commit -m "feat: add attribute defs, attribute values, popular items, and matchCategory to mention data"
```

---

## Task 2: Create the query parser

**Files:**
- Create: `src/components/albus-mention-parser.ts`
- Create: `src/__tests__/albus-mention-parser.test.ts`

### Step 1: Write the failing tests

Create `src/__tests__/albus-mention-parser.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { parseMentionQuery } from "@/components/albus-mention-parser";

describe("parseMentionQuery", () => {
  it("returns free mode for a simple word", () => {
    expect(parseMentionQuery("okta")).toEqual({
      mode: "free",
      query: "okta",
    });
  });

  it("returns free mode for empty string", () => {
    expect(parseMentionQuery("")).toEqual({
      mode: "free",
      query: "",
    });
  });

  it("detects scoped mode from category match", () => {
    const result = parseMentionQuery("apps");
    expect(result.mode).toBe("scoped");
    if (result.mode === "scoped") {
      expect(result.category).toBe("app");
      expect(result.attribute).toBeNull();
      expect(result.value).toBeNull();
    }
  });

  it("detects scoped mode from explicit colon", () => {
    const result = parseMentionQuery("apps:");
    expect(result.mode).toBe("scoped");
    if (result.mode === "scoped") {
      expect(result.category).toBe("app");
      expect(result.attribute).toBeNull();
      expect(result.value).toBeNull();
    }
  });

  it("parses category + attribute", () => {
    const result = parseMentionQuery("apps: status");
    expect(result.mode).toBe("scoped");
    if (result.mode === "scoped") {
      expect(result.category).toBe("app");
      expect(result.attribute).toBe("status");
      expect(result.value).toBeNull();
    }
  });

  it("parses category + attribute + value", () => {
    const result = parseMentionQuery("apps: status approved");
    expect(result.mode).toBe("scoped");
    if (result.mode === "scoped") {
      expect(result.category).toBe("app");
      expect(result.attribute).toBe("status");
      expect(result.value).toBe("approved");
    }
  });

  it("parses knowledge + multi-word attribute query", () => {
    const result = parseMentionQuery("knowledge: access requests");
    expect(result.mode).toBe("scoped");
    if (result.mode === "scoped") {
      expect(result.category).toBe("knowledge");
      expect(result.attribute).toBe("access requests");
    }
  });

  it("stays free mode for non-category word", () => {
    expect(parseMentionQuery("cloudflare")).toEqual({
      mode: "free",
      query: "cloudflare",
    });
  });
});
```

### Step 2: Run tests to verify they fail

```bash
pnpm test -- --reporter=verbose 2>&1 | grep -A5 "albus-mention-parser"
```

Expected: FAIL — `albus-mention-parser` module not found.

### Step 3: Create the parser

Create `src/components/albus-mention-parser.ts`:

```ts
import { matchCategory, type MentionObjectType } from "@/components/albus-mention-data";

export type MentionQueryState =
  | { mode: "free"; query: string }
  | {
      mode: "scoped";
      category: MentionObjectType;
      attribute: string | null;
      value: string | null;
      rawAttributeQuery: string; // partial text after the colon, unresolved
    };

/**
 * Parses the raw text after the @ trigger into a typed query state.
 *
 * Rules:
 * - If raw contains ":" → scoped mode. Left of ":" is the category hint,
 *   right of ":" is split on first word boundary into attribute + value.
 * - If raw matches a category name (via matchCategory) → scoped mode.
 * - Otherwise → free search mode.
 *
 * Examples:
 *   "okta"                  → { mode: "free", query: "okta" }
 *   "apps"                  → { mode: "scoped", category: "app", attribute: null, value: null }
 *   "apps:"                 → { mode: "scoped", category: "app", attribute: null, value: null }
 *   "apps: status"          → { mode: "scoped", category: "app", attribute: "status", value: null }
 *   "apps: status approved" → { mode: "scoped", category: "app", attribute: "status", value: "approved" }
 */
export function parseMentionQuery(raw: string): MentionQueryState {
  const trimmed = raw.trim();

  // Colon-scoped: "apps: status approved"
  const colonIdx = trimmed.indexOf(":");
  if (colonIdx !== -1) {
    const categoryHint = trimmed.slice(0, colonIdx).trim();
    const rest = trimmed.slice(colonIdx + 1).trim();
    const category = matchCategory(categoryHint);
    if (category) {
      const parts = rest.split(/\s+/).filter(Boolean);
      const attribute = parts.length > 0 ? parts[0] : null;
      const value = parts.length > 1 ? parts.slice(1).join(" ") : null;
      return {
        mode: "scoped",
        category,
        attribute,
        value,
        rawAttributeQuery: rest,
      };
    }
  }

  // Category name match (no colon): "apps" → scoped
  if (trimmed.length > 0) {
    const category = matchCategory(trimmed);
    if (category) {
      return {
        mode: "scoped",
        category,
        attribute: null,
        value: null,
        rawAttributeQuery: "",
      };
    }
  }

  // Free search
  return { mode: "free", query: trimmed };
}

/**
 * Builds the pill display text for the current scoped query state.
 *
 * Examples:
 *   scoped, app, null, null     → "@apps: search"
 *   scoped, app, "status", null → "@apps-status: search"
 *   scoped, app, "status", "approved" → "@approved-apps" (terminal)
 */
export function buildPillLabel(state: MentionQueryState): string {
  if (state.mode === "free") {
    return state.query ? `@${state.query}` : "@search";
  }
  const { category, attribute, value } = state;
  const catLabel = category.replace("-", " ");

  if (value) {
    // Terminal: "@approved-apps"
    return `@${value.toLowerCase().replace(/\s+/g, "-")}-${catLabel.replace(/\s+/g, "-")}`;
  }
  if (attribute) {
    return `@${catLabel}-${attribute}: search`;
  }
  return `@${catLabel}: search`;
}

/**
 * Builds the mention tag for insertion (used as the pill slug after selection).
 */
export function buildMentionTag(
  category: MentionObjectType,
  attribute: string,
  value: string,
): string {
  return `${value.toLowerCase().replace(/\s+/g, "-")}-${category.replace("-", "")}`;
}
```

### Step 4: Run tests to verify they pass

```bash
pnpm test -- --reporter=verbose 2>&1 | grep -E "(PASS|FAIL|✓|×)" | head -20
```

Expected: all `albus-mention-parser` tests PASS.

### Step 5: Commit

```bash
git add src/components/albus-mention-parser.ts src/__tests__/albus-mention-parser.test.ts
git commit -m "feat: add parseMentionQuery and buildPillLabel for structured path expressions"
```

---

## Task 3: Refactor `AlbusMentionSearch` to controlled component

**Files:**
- Modify: `src/components/albus-mention-search.tsx`

The component currently manages `expandedCategory` internally. This task makes it fully controlled and adds the attribute drill-down view.

### Step 1: Update the props interface

Replace the current `AlbusMentionSearchProps` with:

```ts
import {
  type AttributeDef,
  type GroupedResults,
  type MentionItem,
  type MentionObjectType,
  attributeValues,
  categoryAttributes,
  getPopularItems,
  groupLabels,
  groupOrder,
} from "@/components/albus-mention-data";

export interface AlbusMentionSearchProps {
  /** Grouped search results — used in free search mode */
  groups: GroupedResults[];
  /** Index of active item for keyboard navigation */
  activeIndex: number;
  /** Fixed positioning style */
  style: CSSProperties;
  /** Whether query is in free-search mode (has a non-category query) */
  hasQuery: boolean;
  /** Category currently being browsed (controlled by parent) */
  expandedCategory: MentionObjectType | null;
  /** Attribute currently being browsed within a category (controlled by parent) */
  expandedAttribute: AttributeDef | null;
  /** Pill label text shown in the editor decoration */
  pillLabel: string;
  /** Callback when an item row is selected */
  onSelect: (item: MentionItem) => void;
  /** Callback when a category is selected from the default list */
  onCategorySelect: (category: MentionObjectType) => void;
  /** Callback when Back is pressed from a category view */
  onCategoryBack: () => void;
  /** Callback when an attribute chip is clicked */
  onAttributeSelect: (attr: AttributeDef) => void;
  /** Callback when Back is pressed from an attribute value view */
  onAttributeBack: () => void;
  /** Callback when an attribute value is selected (terminal) */
  onAttributeValueSelect: (value: string) => void;
}
```

### Step 2: Remove internal state and rewrite the component body

Remove the `useState<MentionObjectType | null>(null)` for `expandedCategory` and the `useEffect` / `handleCategoryClick` that managed it.

The component now derives everything from props. Four views:

```
showDefaultView      = !hasQuery && !expandedCategory
showCategoryItems    = !hasQuery && expandedCategory && !expandedAttribute
showAttributeValues  = !hasQuery && expandedCategory && expandedAttribute
showSearchResults    = hasQuery
```

### Step 3: Implement the category view with two sections

Replace the `showCategoryItems` block with:

```tsx
{showCategoryItems && (() => {
  const popular = getPopularItems(expandedCategory!);
  const attrs = categoryAttributes[expandedCategory!] ?? [];
  const attrSection = attrs.filter((a) => a.section === "attribute");
  const propSection = attrs.filter((a) => a.section === "property");
  let runningIndex = 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-1.5 border-neutral-100 border-b px-3 py-2">
        <button
          type="button"
          className="flex items-center gap-1 text-[0.6875rem] text-neutral-400 transition-colors hover:text-neutral-600"
          onMouseDown={(e) => { e.preventDefault(); onCategoryBack(); }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
            <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <span className="text-neutral-300">|</span>
        <span className="font-medium text-[0.6875rem] text-neutral-600">
          {groupLabels[expandedCategory!]}
        </span>
      </div>

      <div className="max-h-72 overflow-y-auto">
        {/* Popular items section */}
        {popular.length > 0 && (
          <div>
            <div className="px-3 pt-2 pb-1 font-medium text-[0.6875rem] text-neutral-400 uppercase tracking-wider">
              Search by {groupLabels[expandedCategory!].toLowerCase().replace(/s$/, "")} name
            </div>
            {popular.map((item) => {
              const idx = runningIndex++;
              return (
                <MentionRow
                  key={item.id}
                  item={item}
                  isActive={idx === activeIndex}
                  itemIndex={idx}
                  onSelect={onSelect}
                />
              );
            })}
          </div>
        )}

        {/* Attributes section */}
        {attrSection.length > 0 && (
          <div>
            <div className="px-3 pt-2 pb-1 font-medium text-[0.6875rem] text-neutral-400 uppercase tracking-wider">
              Attributes
            </div>
            <div className="flex flex-wrap gap-1.5 px-3 pb-2">
              {attrSection.map((attr) => (
                <button
                  key={attr.key}
                  type="button"
                  className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[0.75rem] text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-100"
                  onMouseDown={(e) => { e.preventDefault(); onAttributeSelect(attr); }}
                >
                  {attr.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Properties section */}
        {propSection.length > 0 && (
          <div>
            <div className="px-3 pt-2 pb-1 font-medium text-[0.6875rem] text-neutral-400 uppercase tracking-wider">
              Properties
            </div>
            <div className="flex flex-wrap gap-1.5 px-3 pb-2">
              {propSection.map((attr) => (
                <button
                  key={attr.key}
                  type="button"
                  className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[0.75rem] text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-100"
                  onMouseDown={(e) => { e.preventDefault(); onAttributeSelect(attr); }}
                >
                  {attr.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
})()}
```

### Step 4: Add the attribute values view

Add a new `showAttributeValues` block:

```tsx
{showAttributeValues && (() => {
  const values = attributeValues[expandedCategory!]?.[expandedAttribute!.key] ?? [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-1.5 border-neutral-100 border-b px-3 py-2">
        <button
          type="button"
          className="flex items-center gap-1 text-[0.6875rem] text-neutral-400 transition-colors hover:text-neutral-600"
          onMouseDown={(e) => { e.preventDefault(); onAttributeBack(); }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
            <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <span className="text-neutral-300">|</span>
        <span className="font-medium text-[0.6875rem] text-neutral-600">
          {groupLabels[expandedCategory!]} › {expandedAttribute!.label}
        </span>
      </div>

      <div className="max-h-64 overflow-y-auto py-1">
        {values.length === 0 && (
          <div className="px-3 py-2 text-[0.8125rem] text-neutral-400">No values</div>
        )}
        {values.map((value, i) => (
          <div
            key={value}
            className={`flex cursor-pointer items-center px-3 py-[7px] text-[0.8125rem] transition-colors ${
              i === activeIndex
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-700 hover:bg-neutral-50"
            }`}
            onMouseDown={(e) => { e.preventDefault(); onAttributeValueSelect(value); }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
})()}
```

### Step 5: Commit

```bash
git add src/components/albus-mention-search.tsx
git commit -m "refactor: make AlbusMentionSearch fully controlled, add attribute drill-down view"
```

---

## Task 4: Update `AlbusChatInput` — regex + state + integration

**Files:**
- Modify: `src/components/albus-chat-input.tsx`

### Step 1: Add new imports

At the top of the file, add:

```ts
import {
  type AttributeDef,
} from "@/components/albus-mention-data";
import {
  type MentionQueryState,
  buildMentionTag,
  buildPillLabel,
  parseMentionQuery,
} from "@/components/albus-mention-parser";
```

### Step 2: Add new state variables

Inside the `AlbusChatInput` component, after the existing mention state:

```ts
const [selectedAttribute, setSelectedAttribute] = useState<AttributeDef | null>(null);
const [categoryAutoMatched, setCategoryAutoMatched] = useState(false);
const [parsedQuery, setParsedQuery] = useState<MentionQueryState>({ mode: "free", query: "" });
```

### Step 3: Change the mention detection regex

In `handleEditorChange`, find the regex section and replace both `atMatch` and `lineAtMatch` patterns.

Current regex (two places):
```ts
const atMatch = beforeText.match(/@(\w*)$/);
// ...
const lineAtMatch = lineText.match(/@(\w*)$/);
```

Replace with:
```ts
// Capture everything after @ including colons and spaces — supports path expressions
const atMatch = beforeText.match(/@([^@\n]*)$/);
// ...
const lineAtMatch = lineText.match(/@([^@\n]*)$/);
```

### Step 4: Parse the query and detect category auto-match

In `handleEditorChange`, after setting `setMentionQuery(query)`:

```ts
const parsed = parseMentionQuery(query);
setParsedQuery(parsed);

if (parsed.mode === "scoped") {
  // Auto-navigate to category if not already there
  if (!selectedCategory || selectedCategory !== parsed.category) {
    setSelectedCategory(parsed.category);
    setCategoryAutoMatched(true);
    setSelectedAttribute(null);
  }
  // If attribute is resolved in the path, navigate to it
  if (parsed.attribute && selectedCategory === parsed.category) {
    const attrs = categoryAttributes[parsed.category] ?? [];
    const matchedAttr = attrs.find(
      (a) => a.key === parsed.attribute || a.label.toLowerCase() === parsed.attribute?.toLowerCase()
    );
    if (matchedAttr && selectedAttribute?.key !== matchedAttr.key) {
      setSelectedAttribute(matchedAttr);
    }
  }
  setMentionIndex(0);
  return;
}

// Free mode — clear category if it was auto-matched
if (categoryAutoMatched) {
  setSelectedCategory(null);
  setSelectedAttribute(null);
  setCategoryAutoMatched(false);
}
```

### Step 5: Add the resolved category computation

Above the `mentionGroups` useMemo, add:

```ts
const resolvedCategory = selectedCategory;
const pillLabel = buildPillLabel(parsedQuery);
```

### Step 6: Update `mentionGroups` to use popular items in category view

```ts
const mentionGroups: GroupedResults[] = useMemo(() => {
  if (parsedQuery.mode === "scoped" && resolvedCategory) {
    // In attribute value view — not a GroupedResults concern, handled by component
    if (selectedAttribute) return [];
    // In category view — return popular items for keyboard navigation
    const popular = getPopularItems(resolvedCategory);
    return popular.length > 0
      ? [{ type: resolvedCategory, label: groupLabels[resolvedCategory], items: popular }]
      : [];
  }
  if (mentionQuery) return searchMentions(mentionQuery);
  return [];
}, [parsedQuery, resolvedCategory, selectedAttribute, mentionQuery]);
```

Also add `getPopularItems` and `groupLabels` to the import from `albus-mention-data`.

### Step 7: Add new callbacks

```ts
const handleCategoryBack = useCallback(() => {
  setSelectedCategory(null);
  setSelectedAttribute(null);
  setCategoryAutoMatched(false);
  if (categoryAutoMatched) {
    // Close dropdown entirely if we auto-matched
    setMentionTarget(null);
  }
}, [categoryAutoMatched]);

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
    if (!resolvedCategory || !selectedAttribute) return;
    const tag = buildMentionTag(resolvedCategory, selectedAttribute.key, value);
    const name = buildPillLabel({
      mode: "scoped",
      category: resolvedCategory,
      attribute: selectedAttribute.key,
      value,
      rawAttributeQuery: `${selectedAttribute.key} ${value}`,
    }).replace(/^@/, "");
    const mention: MentionElementData = {
      type: "mention",
      tag,
      name,
      itemId: `filter-${resolvedCategory}-${selectedAttribute.key}-${value.toLowerCase().replace(/\s+/g, "-")}`,
      objectType: resolvedCategory,
      children: [{ text: "" }],
    };
    if (mentionTarget) Transforms.select(editor, mentionTarget);
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
    Transforms.insertText(editor, " ");
    setMentionTarget(null);
    setSelectedCategory(null);
    setSelectedAttribute(null);
    setCategoryAutoMatched(false);
    ReactEditor.focus(editor);
  },
  [resolvedCategory, selectedAttribute, mentionTarget, editor],
);
```

### Step 8: Update `handleBlur` to also clear new state

In the `handleBlur` function's timeout, add:

```ts
setSelectedAttribute(null);
setCategoryAutoMatched(false);
```

### Step 9: Update `AlbusMentionSearch` JSX to pass new props

Replace the `<AlbusMentionSearch ... />` with:

```tsx
{mentionTarget && (
  <AlbusMentionSearch
    ref={mentionRef}
    groups={mentionGroups}
    activeIndex={mentionIndex}
    style={mentionStyle}
    hasQuery={parsedQuery.mode === "free" && mentionQuery.length > 0}
    expandedCategory={resolvedCategory}
    expandedAttribute={selectedAttribute}
    pillLabel={pillLabel}
    onSelect={insertMention}
    onCategorySelect={handleCategorySelect}
    onCategoryBack={handleCategoryBack}
    onAttributeSelect={handleAttributeSelect}
    onAttributeBack={handleAttributeBack}
    onAttributeValueSelect={handleAttributeValueSelect}
  />
)}
```

### Step 10: Update pill decoration label

In `renderLeaf`, the ghost text hint currently shows "Search...". Update it to use the pill label:

```tsx
{mentionQuery === "" && (
  <span contentEditable={false} className="pointer-events-none ml-0.5 select-none text-neutral-400 text-sm">
    Search...
  </span>
)}
```

This stays as-is for the `@` open state. The pill label (`@apps: search`) is shown as the decoration text when in scoped mode. To do this, change the ghost text condition to show the pill context:

```tsx
{/* Ghost hint: show pill label context when in scoped mode */}
{parsedQuery.mode === "scoped" && mentionQuery.length > 0 && (
  <span contentEditable={false} className="pointer-events-none ml-1 select-none text-neutral-400 text-xs">
    {pillLabel.replace(`@${mentionQuery}`, "").trim() || "search"}
  </span>
)}
```

### Step 11: Commit

```bash
git add src/components/albus-chat-input.tsx
git commit -m "feat: wire up v2 mention state machine — regex extension, parser integration, attribute callbacks"
```

---

## Task 5: Smoke test + build verification

### Step 1: Run tests

```bash
pnpm test
```

Expected: all tests pass.

### Step 2: Run build

```bash
pnpm build 2>&1 | tail -20
```

Expected: build completes without TypeScript errors.

### Step 3: Run dev server and manually verify these flows

```bash
pnpm dev
```

Open `http://localhost:3000` and navigate to the Albus chat input demo.

**Verify:**
- [ ] `@` → default category list appears
- [ ] `@apps` → auto-navigates to Apps category submenu (popular items + attributes + properties)
- [ ] `@policies` → auto-navigates to Policies category submenu
- [ ] `@okta` → free search results grouped: APPS (Okta), KNOWLEDGE (Okta guide)
- [ ] `@polic` → free search results: POLICIES + KNOWLEDGE
- [ ] In Apps submenu: clicking "Status" attribute → shows status values (Approved, Blacklisted, etc.)
- [ ] Selecting "Approved" from status values → inserts `@approved-app` pill, menu closes
- [ ] Back button in attribute view → returns to category view
- [ ] Back button in category view → returns to default list
- [ ] Keyboard Enter on a popular item in category view → inserts mention

### Step 4: Commit any fixes found during smoke test

```bash
git add -p  # stage only intentional fixes
git commit -m "fix: address issues found during mention v2 smoke testing"
```

---

## Task 6: Update `MentionElementData` type (optional cleanup)

The attribute value mentions store `objectType` which is sufficient. However, for future filtering/display use, it helps to tag filter mentions explicitly.

**Files:**
- Modify: `src/components/albus-mention-element.tsx`

### Step 1: Add optional fields to `MentionElementData`

```ts
export interface MentionElementData {
  type: "mention";
  tag: string;
  name: string;
  itemId: string;
  objectType: MentionObjectType;
  // For filter/attribute mentions:
  filterAttribute?: string;  // e.g. "status"
  filterValue?: string;      // e.g. "approved"
  children: [{ text: "" }];
}
```

### Step 2: Pass these in `handleAttributeValueSelect` in `albus-chat-input.tsx`

Add `filterAttribute: selectedAttribute.key` and `filterValue: value` to the mention object constructed in that callback.

### Step 3: Commit

```bash
git add src/components/albus-mention-element.tsx src/components/albus-chat-input.tsx
git commit -m "feat: tag filter mentions with filterAttribute and filterValue for downstream use"
```
