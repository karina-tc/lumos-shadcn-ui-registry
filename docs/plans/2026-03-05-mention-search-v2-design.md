# @Mention Search v2 — Design Doc

**Date:** 2026-03-05
**Status:** Approved
**Scope:** `albus-chat-input.tsx`, `albus-mention-search.tsx`, `albus-mention-data.ts`, `albus-mention-element.tsx`

---

## Problem

The current @mention system (v1) uses a single-word regex trigger and flat fuzzy search. Two issues:

1. Typing `@apps` or `@policies` runs a fuzzy search that returns noisy results instead of navigating to the category submenu.
2. There is no structured path-based reference mechanism — users can't express filter queries like "all approved apps" or "Okta's admin-role entitlement" through the mention system.

## Goal

Build a reference mechanism analogous to SQL or object addressing. Two reference types:

- **Instance reference** — `@Okta` — points to a specific known object (like a primary key)
- **Filter reference** — `@approved-apps` — points to a set of objects matching a query expression

The `@` trigger is the entry point for both. The user either types freely (instance search) or follows a scoped path (filter/attribute expression).

---

## Two Modes

### Mode 1 — Free search (existing, one fix)

The user types `@okta`, `@polic`, `@access`. Cross-object fuzzy search runs and returns grouped results (APPS, KNOWLEDGE, POLICIES, etc.). This already works well.

**One fix needed:** when the query closely matches a category name (`@apps`, `@policies`, `@identities`, `@entitlements`, `@knowledge`, `@reviews`, `@requests`), the system should enter Mode 2 for that category rather than returning fuzzy results.

### Mode 2 — Scoped path search (new)

Triggered by:
- A category-name query (`@apps` detected via fuzzy match on category aliases)
- An explicit colon (`@apps:`)

The user navigates a 1–3 level path: `category → attribute → value`. Selecting a value inserts a resolved mention pill and closes the menu.

---

## Path State Machine

```
@                           →  free search (cross-object)
@apps                       →  auto-scope: apps submenu
@apps:                      →  explicit scope: apps submenu; pill "@apps: search"
@apps: stat                 →  attribute filter: status attribute; pill "@apps-status: search"
@apps: status approved      →  value selected: insert; pill "@approved-apps"

@knowledge:                 →  knowledge submenu; pill "@knowledge: search"
@knowledge: access          →  filters entries matching "access"; pill "@knowledge: access"
@knowledge: access requests →  filtered entries; select → "@[entry-name]"

@okta (free)                →  APPS: Okta + KNOWLEDGE: Okta guide; select → "@Okta"
```

**The colon `:` is the scoping operator.** Without it, the system is in free-search mode. With it, the user is constructing a path expression.

---

## Pill Display States

| Query state | Pill displays |
|---|---|
| `@` | `@search` |
| `@okta` (free) | `@okta` (live query text) |
| Select Okta (free) | `@Okta` — terminal, closes menu |
| `@apps:` | `@apps: search` |
| `@apps: status` | `@apps-status: search` |
| Select "approved" | `@approved-apps` — terminal, closes menu |
| `@knowledge:` | `@knowledge: search` |
| Select knowledge entry | `@[entry-tag]` — terminal, closes menu |

**Pill simplification rule:** the middle attribute key is dropped. `apps + status + approved` → `approved-apps`. The full expression is stored as data on the mention node; the pill only shows the meaningful parts.

---

## Instance Selection — Terminal by Design

When the user selects a specific instance (e.g. Okta from free search or from `@apps:` submenu), that reference is complete and the menu closes. `@Okta` = a reference to the Okta app object.

If the user wants to reference a specific entitlement *within* Okta, that is a separate, deeper reference expressed from the start via the scoped path:
```
@entitlements: okta: admin-role  →  @okta-admin-role
```

This keeps selection terminal and consistent. It also maps cleanly to the SQL analogy:
- `@Okta` = `WHERE app = 'okta'`
- `@approved-apps` = `WHERE app.status = 'approved'`
- `@okta-admin-role` = `WHERE app = 'okta' AND entitlement = 'admin-role'`

---

## Enriched Category Submenu

When in a category scope (e.g. Apps), the submenu renders three sections:

```
┌─────────────────────────────────────┐
│ ← Back  |  Apps                     │
├─────────────────────────────────────┤
│ SEARCH BY APP NAME                  │
│   AWS              @aws             │
│   Google Workspace @google-workspace│
│   Okta             @okta            │
├─────────────────────────────────────┤
│ ATTRIBUTES                          │
│   Category   Criticality   Status   │
│   Tags                              │
├─────────────────────────────────────┤
│ PROPERTIES                          │
│   Entitlements                      │
└─────────────────────────────────────┘
```

- **Search by name** — 3 popular/common items per category, keyboard navigable
- **Attributes** — filterable fields that have enumerable values; clicking enters attribute drill-down
- **Properties** — nested object types (entitlements under apps); clicking enters property drill-down

### Attribute drill-down (Apps → Status)

```
┌─────────────────────────────────────┐
│ ← Back  |  Apps › Status            │
├─────────────────────────────────────┤
│   Approved                          │
│   Blacklisted                       │
│   Deprecated                        │
│   Discovered                        │
│   In Review                         │
│   Needs Review                      │
└─────────────────────────────────────┘
```

Selecting a value inserts the mention and closes the menu.

---

## Data Model Changes

### New types in `albus-mention-data.ts`

```ts
interface AttributeDef {
  key: string;
  label: string;
  section: "attribute" | "property";
}
```

### `categoryAttributes` — per object type

| Object | Attributes | Properties |
|---|---|---|
| app | category, business-criticality, status, tags | entitlements |
| identity | department, role, status | — |
| policy | type, status, enforcement | — |
| knowledge | type, author, tags | — |
| entitlement | app, type, risk-level | — |
| access-review | status, reviewer, scope | — |
| access-request | status, requester, app | — |

### `attributeValues` — per object type + attribute key

App status values: `approved`, `blacklisted`, `deprecated`, `discovered`, `in review`, `needs review`

### `popularItemIds` — 3 items per category shown in "Search by name"

Apps: AWS, Google Workspace, Okta
Identities: Employees, Engineers, Contractors
Policies: Access policy, MFA policy, Password policy
Knowledge: Contractor access policy, Birthright rules, Risk matrix
Entitlements: Admin role, Editor, Read-only
Access Reviews: Q1 2025, Annual compliance, Contractor review
Access Requests: Pending approvals, My requests, Open requests

### `matchCategory(query)` — fuzzy match on category name aliases

Uses Fuse.js with threshold 0.25. Maps aliases like "apps", "app", "applications" → `"app"`.

---

## Mention Node — Extended

The `MentionElementData` type gains optional fields for path-based references:

```ts
interface MentionElementData {
  type: "mention";
  tag: string;           // display slug in pill (e.g. "approved-apps")
  name: string;          // human-readable (e.g. "Approved Apps")
  itemId: string;
  objectType: MentionObjectType;
  attribute?: string;    // e.g. "status" (for filter mentions)
  value?: string;        // e.g. "approved" (for filter mentions)
  children: [{ text: "" }];
}
```

---

## Regex Change

Current: `/@(\w*)$/` — captures only word characters after `@`.

New: `/@([^@\n]*)$/` — captures everything from `@` to cursor including colons, spaces, and hyphens. This enables path queries like `@apps: status approved`.

The query parser then interprets the raw string:

```ts
function parseMentionQuery(raw: string): MentionQueryState {
  // "@apps: status approved"
  // → { mode: "scoped", category: "app", attribute: "status", value: "approved" }
  // "@okta"
  // → { mode: "free", query: "okta" }
}
```

---

## Component Architecture

`AlbusMentionSearch` becomes fully controlled — no internal state. The parent (`AlbusChatInput`) owns all mention navigation state and passes it down.

### New state in `AlbusChatInput`

```ts
const [mentionTarget, setMentionTarget]           // Range | null
const [mentionQuery, setMentionQuery]             // raw string after @
const [parsedQuery, setParsedQuery]               // MentionQueryState
const [selectedCategory, setSelectedCategory]     // MentionObjectType | null
const [selectedAttribute, setSelectedAttribute]   // AttributeDef | null
const [categoryAutoMatched, setCategoryAutoMatched] // bool — suppress back-nav loop
```

### New props on `AlbusMentionSearch`

```ts
expandedCategory: MentionObjectType | null
expandedAttribute: AttributeDef | null
onCategoryBack: () => void
onAttributeSelect: (attr: AttributeDef) => void
onAttributeBack: () => void
onAttributeValueSelect: (value: string) => void
```

---

## What Is Out of Scope (This Iteration)

- More than 3 levels deep (e.g. `@apps: okta: entitlements: admin-role`) — will be addressed after v2 ships and usage patterns are observed
- Custom/free-text tag support (user-defined buckets) — deferred
- Analytics/dashboard object type — deferred
- Accounts object type — excluded per Alyssa's guidance
- Showing counts or cardinality next to filter results
