# Lumos Prototype Ecosystem — Implementation Plan

**Date:** 2026-02-28
**Status:** Draft

## Vision

Two repos, one shared language. The **registry repo** (this one) is the source of truth — tokens, components, blocks, pages. The **prototype repo** is the playground — a ready-to-go Next.js app where designers and PMs branch, prototype with Claude, push, and share Vercel preview links. Future phases connect Figma bidirectionally via MCP.

```
┌──────────────────────────────────────────────────────────┐
│                    Figma Design System                    │
│                  (future: Phase 6)                        │
└────────┬──────────────────────────────────┬───────────────┘
         │ /import-figma-component          │ /capture-to-figma
         ▼                                  │
┌────────────────────────────┐    ┌─────────┴───────────────┐
│   Registry Repo            │    │   Prototype Repo         │
│   (lumos-shadcn-ui-reg.)   │    │   (lumos-prototype)      │
│                            │    │                          │
│   Source of truth.         │───►│   Full routed app.       │
│   You maintain.            │    │   Everyone branches.     │
│   V0 + shadcn CLI serve.   │    │   Claude builds.         │
│                            │    │   Vercel previews.       │
│   Skills:                  │    │                          │
│   /add-component           │    │   Skills:                │
│   /add-block               │    │   /new-page              │
│   /validate-registry       │    │   /sync-registry         │
│                            │    │   /deploy-preview        │
└────────────────────────────┘    └──────────────────────────┘
```

---

## Phase 1 — `lumos-full-app` registry block

**Goal:** One `npx shadcn@latest add` command installs a full routed Lumos app with all 14 pages, shared layout, and working sidebar navigation.

### Architecture decision: shared layout vs per-page layout

**Chosen: Shared layout.** The sidebar and header live in `app/layout.tsx`, not inside each page. This means:
- No shell flicker on navigation
- Sidebar active state is route-aware via `usePathname()`
- Pages are just content — easier to create new ones
- Feels like a real app

### Route map

| Route | Page file | Sidebar item | Layout pattern |
|-------|-----------|-------------|----------------|
| `/` | `app/page.tsx` | Apps | Table with tabs, search, filter |
| `/identities` | `app/identities/page.tsx` | Identities | Table with avatars |
| `/accounts` | `app/accounts/page.tsx` | Accounts | Table with status tabs |
| `/access-reviews` | `app/access-reviews/page.tsx` | Access Reviews | Table with progress |
| `/access-policies` | `app/access-policies/page.tsx` | Access Policies | Table with rules |
| `/analytics` | `app/analytics/page.tsx` | Analytics | Dashboard cards + chart |
| `/integrations` | `app/integrations/page.tsx` | Integrations | Card grid |
| `/settings` | `app/settings/page.tsx` | Settings | Form with vertical nav |
| `/albus` | `app/albus/page.tsx` | Ask Albus | Chat landing |
| `/albus/chat` | `app/albus/chat/page.tsx` | Ask Albus | Chat thread |
| `/onboarding` | `app/onboarding/page.tsx` | Onboarding | Table |
| `/offboarding` | `app/offboarding/page.tsx` | Offboarding | Table |
| `/activity-log` | `app/activity-log/page.tsx` | Activity Log | Table |
| `/tasks` | `app/tasks/page.tsx` | Tasks | Table |

### Tasks

#### 1.1 — Update BrandSidebar to support navigation links

**File:** `src/components/brand-sidebar.tsx`

The `NavItem` interface already has an optional `href` field. Update the render logic:
- When `href` is present, render an `<a>` tag instead of a `<button>`
- Keep the existing styling logic unchanged
- Backward compatible — existing consumers without `href` continue to work
- Also update `subItems` from `string[]` to `{ label: string; href?: string }[]` for sub-route support

#### 1.2 — Create route-aware full-app layout

**New file:** `src/app/demo/[name]/blocks/full-app/full-app-layout.tsx`
**Target:** `app/layout.tsx`

This layout:
- Imports globals.css (Lumos tokens, Roobert font)
- Wraps content in `<html>` / `<body>` with font classes
- Uses a client component wrapper that renders BrandHeader + BrandSidebar
- Passes a `navSections` prop to BrandSidebar with `href` values for every route
- Uses `usePathname()` to determine which sidebar item is active
- Sets the BrandHeader `title` based on current route

The nav configuration maps sidebar labels to routes:
```ts
const routeMap: Record<string, { title: string; path: string }> = {
  "Apps": { title: "Applications", path: "/" },
  "Identities": { title: "Identities", path: "/identities" },
  "Accounts": { title: "Accounts", path: "/accounts" },
  "Access Reviews": { title: "Access Reviews", path: "/access-reviews" },
  "Access Policies": { title: "Access Policies", path: "/access-policies" },
  "Analytics": { title: "Analytics", path: "/analytics" },
  "Integrations": { title: "Integrations", path: "/integrations" },
  "Settings": { title: "Settings", path: "/settings" },
  "Ask Albus": { title: "Ask Albus", path: "/albus" },
  "Onboarding": { title: "Onboarding", path: "/onboarding" },
  "Offboarding": { title: "Offboarding", path: "/offboarding" },
  "Activity Log": { title: "Activity Log", path: "/activity-log" },
  "Tasks": { title: "Tasks", path: "/tasks" },
};
```

#### 1.3 — Create content-only page files

**New files:** 14 page files in `src/app/demo/[name]/blocks/full-app/`

Each page is derived from the existing block file but with the `<LumosLayout>` wrapper removed. The content is everything that was inside `<LumosLayout>`.

For example, `lumos-apps-index.tsx` currently:
```tsx
export default function LumosAppsIndex() {
  return (
    <LumosLayout title="Applications" activeItem="Apps">
      {/* ...content... */}
    </LumosLayout>
  );
}
```

Becomes `full-app/apps-page.tsx`:
```tsx
export default function AppsPage() {
  return (
    <>
      {/* ...content (no LumosLayout wrapper)... */}
    </>
  );
}
```

Files to create:
| Source block | New file | Target |
|-------------|----------|--------|
| `lumos-apps-index.tsx` | `full-app/apps-page.tsx` | `app/page.tsx` |
| `lumos-identities-index.tsx` | `full-app/identities-page.tsx` | `app/identities/page.tsx` |
| `lumos-accounts-index.tsx` | `full-app/accounts-page.tsx` | `app/accounts/page.tsx` |
| `lumos-access-reviews-index.tsx` | `full-app/access-reviews-page.tsx` | `app/access-reviews/page.tsx` |
| `lumos-access-policies-index.tsx` | `full-app/access-policies-page.tsx` | `app/access-policies/page.tsx` |
| `lumos-analytics-index.tsx` | `full-app/analytics-page.tsx` | `app/analytics/page.tsx` |
| `lumos-integrations-index.tsx` | `full-app/integrations-page.tsx` | `app/integrations/page.tsx` |
| `lumos-settings-index.tsx` | `full-app/settings-page.tsx` | `app/settings/page.tsx` |
| `lumos-albus-index.tsx` | `full-app/albus-page.tsx` | `app/albus/page.tsx` |
| `lumos-albus-chat.tsx` | `full-app/albus-chat-page.tsx` | `app/albus/chat/page.tsx` |
| `lumos-onboarding-index.tsx` | `full-app/onboarding-page.tsx` | `app/onboarding/page.tsx` |
| `lumos-offboarding-index.tsx` | `full-app/offboarding-page.tsx` | `app/offboarding/page.tsx` |
| `lumos-activity-log-index.tsx` | `full-app/activity-log-page.tsx` | `app/activity-log/page.tsx` |
| `lumos-tasks-index.tsx` | `full-app/tasks-page.tsx` | `app/tasks/page.tsx` |

#### 1.4 — Add `lumos-full-app` entry to registry.json

```json
{
  "name": "lumos-full-app",
  "type": "registry:block",
  "title": "Lumos Full App",
  "description": "Complete Lumos application with all 14 pages, shared layout, and working sidebar navigation. One command to install a full routed app skeleton.",
  "relatedComponents": ["brand-header", "brand-sidebar"],
  "registryDependencies": [
    "https://lumos-shadcn-ui-registry.vercel.app/r/theme.json",
    "https://lumos-shadcn-ui-registry.vercel.app/r/brand-header.json",
    "https://lumos-shadcn-ui-registry.vercel.app/r/brand-sidebar.json",
    "https://lumos-shadcn-ui-registry.vercel.app/r/page-header.json",
    "https://lumos-shadcn-ui-registry.vercel.app/r/page-tabs.json",
    "https://lumos-shadcn-ui-registry.vercel.app/r/albus-chat-input.json",
    "https://lumos-shadcn-ui-registry.vercel.app/r/albus-history-panel.json",
    "https://lumos-shadcn-ui-registry.vercel.app/r/albus-symbol.json",
    "https://lumos-shadcn-ui-registry.vercel.app/r/lumos-symbol.json"
  ],
  "files": [
    { "path": "src/app/demo/[name]/blocks/full-app/full-app-layout.tsx", "type": "registry:file", "target": "app/layout.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/apps-page.tsx", "type": "registry:page", "target": "app/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/identities-page.tsx", "type": "registry:page", "target": "app/identities/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/accounts-page.tsx", "type": "registry:page", "target": "app/accounts/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/access-reviews-page.tsx", "type": "registry:page", "target": "app/access-reviews/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/access-policies-page.tsx", "type": "registry:page", "target": "app/access-policies/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/analytics-page.tsx", "type": "registry:page", "target": "app/analytics/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/integrations-page.tsx", "type": "registry:page", "target": "app/integrations/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/settings-page.tsx", "type": "registry:page", "target": "app/settings/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/albus-page.tsx", "type": "registry:page", "target": "app/albus/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/albus-chat-page.tsx", "type": "registry:page", "target": "app/albus/chat/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/onboarding-page.tsx", "type": "registry:page", "target": "app/onboarding/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/offboarding-page.tsx", "type": "registry:page", "target": "app/offboarding/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/activity-log-page.tsx", "type": "registry:page", "target": "app/activity-log/page.tsx" },
    { "path": "src/app/demo/[name]/blocks/full-app/tasks-page.tsx", "type": "registry:page", "target": "app/tasks/page.tsx" }
  ]
}
```

#### 1.5 — Verify

- Run `pnpm build` (which runs `registry:build` then `next build`)
- Confirm `/r/lumos-full-app.json` is generated in `/public/r/`
- Confirm all existing blocks and components still build correctly

---

## Phase 2 — Registry CLAUDE.md + maintainer skills + tests

**Goal:** Give this repo a CLAUDE.md so Claude understands the architecture, skills so you can maintain it efficiently, and light tests to catch structural problems.

### 2.1 — CLAUDE.md

**New file:** `CLAUDE.md` (repo root)

Contents:
- **What this repo is:** A shadcn/ui registry serving Lumos design system components, blocks, and pages. Deployed to Vercel, consumed by V0, shadcn CLI, and MCP tools.
- **How it works:** `registry.json` is the source of truth. `npx shadcn@latest build` generates `/public/r/*.json` files at build time. These JSON files are what V0 and consumers fetch.
- **Key commands:** `pnpm dev`, `pnpm build`, `pnpm lint`
- **File structure:**
  - `registry.json` — master registry config (all items defined here)
  - `src/components/` — custom Lumos components (brand-header, brand-sidebar, lumos-button, etc.)
  - `src/components/ui/` — shadcn UI primitives (do not edit directly)
  - `src/app/demo/[name]/blocks/` — full-page block demos
  - `src/app/demo/[name]/components/` — component demos
  - `src/app/demo/[name]/ui/` — UI primitive demos
  - `src/layouts/` — layout files used as registry targets
  - `src/app/(registry)/` — the registry browsing UI itself
- **Adding a new component:** Use the `/add-component` skill
- **Adding a new block/page:** Use the `/add-block` skill
- **Validating the registry:** Use the `/validate-registry` skill
- **Token system:** Lumos semantic tokens in `globals.css` → shadcn bridge aliases → Tailwind utility classes. See `docs/plans/2026-02-25-lumos-v0-registry-design.md` for the mapping table.
- **How blocks work:** Each block is a `registry:block` in `registry.json` with `files` pointing to the source file and `target` specifying where the consumer should place it. Blocks can have `registryDependencies` that pull in other registry items.
- **Naming conventions:**
  - Blocks: `lumos-[section]-index` (e.g., `lumos-apps-index`)
  - Components: descriptive kebab-case (e.g., `brand-header`, `page-tabs`)
  - Files match their registry name (e.g., `brand-header.tsx` for `brand-header`)
- **Downstream consumer:** The `lumos-prototype` repo pulls from this registry. Changes here flow downstream when consumers run `/sync-registry`.

### 2.2 — `/add-component` skill

**New file:** `.claude/commands/add-component.md`

Prompt that instructs Claude to:
1. Ask for: component name, description, which shadcn primitives it builds on
2. Create the component file at `src/components/{name}.tsx`
3. Create a demo file at `src/app/demo/[name]/components/{name}.tsx`
4. Add the component to the demo index at `src/app/demo/[name]/index.tsx`
5. Add the entry to `registry.json` with correct `registryDependencies`
6. Run `pnpm build` to verify

### 2.3 — `/add-block` skill

**New file:** `.claude/commands/add-block.md`

Prompt that instructs Claude to:
1. Ask for: block name, description, layout pattern (table, dashboard, form, cards, chat)
2. Provide a starter template based on the layout pattern (using LumosLayout, PageHeader, etc.)
3. Create the block file at `src/app/demo/[name]/blocks/{name}.tsx`
4. Add to demo index
5. Add to `registry.json` with `registryDependencies` including theme, lumos-layout, page-header
6. Also create a corresponding content-only page in `full-app/` for the `lumos-full-app` block
7. Add the new page's route to the full-app layout's route map
8. Run `pnpm build` to verify

### 2.4 — `/validate-registry` skill

**New file:** `.claude/commands/validate-registry.md`

Prompt that instructs Claude to:
1. Read `registry.json`
2. For every item, verify the referenced file paths exist on disk
3. For every `registryDependencies` URL, verify a matching item name exists in the registry
4. For every block/component in the demo index, verify a matching registry.json entry exists
5. Check for orphaned files (files in `src/components/` not referenced by any registry item)
6. Run `pnpm build` and report any errors
7. Report results: pass/fail with details

### 2.5 — Structural tests

**New file:** `src/__tests__/registry-integrity.test.ts`

Using vitest (add as devDependency):
```ts
// Test: every registry.json file path exists on disk
// Test: every registry.json item has a unique name
// Test: every registryDependency URL contains a name that exists in registry.json
// Test: no duplicate file targets within a single item
// Test: demo index exports match registry.json item names
```

These are fast, no-render tests. They just validate structural integrity.

### 2.6 — Update package.json

Add to scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

Add vitest as devDependency.

---

## Phase 3 — Prototype repo scaffold

**Goal:** Create a new `lumos-prototype` repo that's a working Next.js app pre-loaded with all registry components and pages, ready for branching.

### 3.1 — Repo structure

```
lumos-prototype/
├── .claude/
│   ├── settings.json
│   └── commands/
│       ├── new-page.md
│       ├── sync-registry.md
│       └── deploy-preview.md
├── CLAUDE.md
├── GETTING-STARTED.md
├── docs/
│   └── ARCHITECTURE.md
├── app/
│   ├── globals.css              ← from registry theme
│   ├── layout.tsx               ← full-app layout (header + sidebar + nav)
│   ├── page.tsx                 ← apps index
│   ├── identities/page.tsx
│   ├── accounts/page.tsx
│   ├── access-reviews/page.tsx
│   ├── access-policies/page.tsx
│   ├── analytics/page.tsx
│   ├── integrations/page.tsx
│   ├── settings/page.tsx
│   ├── albus/
│   │   ├── page.tsx
│   │   └── chat/page.tsx
│   ├── onboarding/page.tsx
│   ├── offboarding/page.tsx
│   ├── activity-log/page.tsx
│   └── tasks/page.tsx
├── components/
│   ├── ui/                      ← shadcn primitives (from registry)
│   ├── brand-header.tsx
│   ├── brand-sidebar.tsx
│   ├── lumos-layout.tsx
│   ├── lumos-button.tsx
│   ├── lumos-badge.tsx
│   ├── lumos-card.tsx
│   ├── lumos-symbol.tsx
│   ├── albus-symbol.tsx
│   ├── page-header.tsx
│   ├── page-tabs.tsx
│   ├── albus-chat-input.tsx
│   ├── albus-history-panel.tsx
│   ├── albus-mode-menu.tsx
│   └── albus-suggestions-panel.tsx
├── lib/
│   └── utils.ts
├── hooks/
│   └── use-mobile.ts
├── public/
│   └── fonts/                   ← Roobert font files
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── next.config.ts
├── components.json              ← shadcn config pointing to registry
├── .gitignore
└── vercel.json
```

### 3.2 — Bootstrap method

Two options:

**Option A: Script-based** (recommended)
```bash
# 1. Create fresh Next.js app
npx create-next-app@latest lumos-prototype --typescript --tailwind --app --src-dir=false

# 2. Configure shadcn to use the Lumos registry
# (components.json already set up)

# 3. Install the full app block
npx shadcn@latest add "https://lumos-shadcn-ui-registry.vercel.app/r/lumos-full-app.json"

# 4. Copy fonts
# (included in setup script)
```

**Option B: Pre-built repo** (what we'll actually ship)
- The prototype repo is already set up with everything installed
- New users just clone, `pnpm install`, `pnpm dev`
- No need to run shadcn commands unless syncing updates

We go with **Option B** — the repo is ready to go out of the box.

### 3.3 — Vercel configuration

**New file:** `vercel.json`
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install"
}
```

Branch preview deployments are automatic on Vercel when connected to a GitHub repo. Every push to any branch generates a preview URL. No special config needed — just connect the repo to Vercel.

### 3.4 — Font handling

The Roobert font files need to be in `public/fonts/`. Options:
1. **Copy from registry repo** — include the 6 woff2 files in the prototype repo's `public/fonts/`
2. **Git LFS** — if the files are large, use LFS

Since woff2 files are small (~30-50KB each), just commit them directly. The `/sync-registry` skill should also update fonts when needed.

---

## Phase 4 — Prototype CLAUDE.md + skills + GETTING-STARTED.md

**Goal:** Give Claude the design system vocabulary and give humans a warm, non-scary onboarding doc.

### 4.1 — CLAUDE.md (for Claude)

**New file:** `CLAUDE.md` in prototype repo root

This is the most important file in the prototype repo. It teaches Claude how to build with the Lumos design system. Contents:

#### Project overview
"This is a Lumos prototype app built from the Lumos design system registry. It has all pages and components pre-installed. You modify and extend it to create prototypes."

#### Component vocabulary
For every component, document: name, what it is, when to use it, key props.

```
## Components

### LumosLayout
Full-page shell. Wraps content with BrandHeader (top bar) and BrandSidebar (left nav).
Props: `activeItem` (which sidebar item to highlight), `title` (shown in header breadcrumb)
Use: Only when building a standalone page outside the shared layout.

### PageHeader
Title bar at the top of page content. Has title, optional description, optional action buttons.
Props: `title`, `description?`, `actions?` (ReactNode for buttons)
Use: First thing inside every page's content area.

### PageTabs
Underline-style tabs for switching views within a page (e.g., "All Apps" / "Ignored Apps").
Props: `tabs` (string[]), `activeTab?`, `onTabChange?`
Use: Below PageHeader when a page has multiple views.

### BrandHeader
Top header bar with Lumos logo, sidenav toggle, breadcrumb, notifications, user menu.
Note: Already rendered by the layout — you don't need to add this to pages.

### BrandSidebar
Left navigation with collapsible sections (Products, Inventory, Workspace).
Note: Already rendered by the layout — you don't need to add this to pages.

### LumosButton
Styled button. Orange primary, rounded-full shape.
Variants: primary (orange), secondary (outlined), danger (red), ghost, accent
Sizes: md, sm

### LumosBadge
Status pill for tables and lists.
Variants: blue, purple, pink, teal, lemon, orange, success, danger, warning

### LumosCard
App tile card with distinctive box shadow.
Use: Integration cards, app catalog tiles, dashboard widgets.

### AlbusChatInput
Rich textarea for the Albus AI assistant.
Props: `value`, `onChange`, `placeholder`, `suggestions?`, `showModeSelector?`
```

#### Page patterns
"Every page follows one of these patterns:"
- **Table index** — PageHeader + optional PageTabs + data table (most pages)
- **Dashboard** — PageHeader + stat cards + charts + tables (Analytics)
- **Card grid** — PageHeader + grouped cards (Integrations)
- **Form** — PageHeader + vertical nav + form sections (Settings)
- **Chat** — Centered layout with AlbusChatInput (Albus)

#### Design tokens
"The color system uses Lumos semantic tokens. Key values:"
- Primary (orange): `bg-primary`, `text-primary`
- Muted backgrounds: `bg-muted`, `bg-secondary`
- Text hierarchy: `text-foreground` (primary), `text-muted-foreground` (secondary)
- Borders: `border-border`
- Status colors: green for success, red for danger, blue for info, orange for warning

#### Creating a new page
"To add a new page:"
1. Create `app/{route}/page.tsx`
2. Export a default component with your page content
3. Start with `<PageHeader title="..." />` at the top
4. Use existing components — don't build from scratch
5. Add the route to the sidebar navigation in `app/layout.tsx`

Or just use the `/new-page` skill.

#### What NOT to do
- Don't modify components in `components/ui/` — those are shadcn primitives
- Don't change the token values in `globals.css` — they match the production Lumos app
- Don't install additional UI libraries — use what's in the registry
- Don't add dark mode — it's out of scope for prototypes

#### Component vocabulary reference
"For shared terminology between design and code, see: https://component.gallery"

### 4.2 — `/new-page` skill

**New file:** `.claude/commands/new-page.md`

Prompt:
1. Ask: page title, route path, layout pattern (table/dashboard/cards/form/chat)
2. Create `app/{route}/page.tsx` using the selected pattern template
3. Add route to the sidebar navigation in `app/layout.tsx`
4. Templates:
   - **Table:** PageHeader + toolbar + table with sample columns/rows
   - **Dashboard:** PageHeader + stat cards grid + chart placeholder + table
   - **Cards:** PageHeader + card grid with sample data
   - **Form:** PageHeader + form sections with inputs
   - **Chat:** Centered AlbusChatInput layout

### 4.3 — `/sync-registry` skill

**New file:** `.claude/commands/sync-registry.md`

Prompt:
1. Run `npx shadcn@latest add "https://lumos-shadcn-ui-registry.vercel.app/r/theme.json" --overwrite` to update tokens
2. Run `npx shadcn@latest add` for each component that exists in the project's `components/` directory, using the registry URL, with `--overwrite`
3. List what was updated
4. Run `pnpm build` to verify nothing broke
5. If there are new components in the registry that aren't installed locally, list them and ask if the user wants to add any

Note: This skill does NOT update page files (those are prototypes that may have been modified). It only updates shared components and the theme.

### 4.4 — `/deploy-preview` skill

**New file:** `.claude/commands/deploy-preview.md`

Prompt:
1. Check current git status
2. If there are uncommitted changes, commit them with a descriptive message
3. Push the current branch to origin
4. If the Vercel project is connected, the preview URL follows the pattern: `https://{project}-{branch}-{org}.vercel.app`
5. Output the expected preview URL
6. Remind user: "Share this link with your team. Anyone with the URL can see your prototype."

### 4.5 — GETTING-STARTED.md (for humans)

**New file:** `GETTING-STARTED.md` in prototype repo root

Tone: Warm, brief, no jargon. Written for designers and PMs who may not have used a CLI before.

Structure:

#### What is this?
A starter app that already looks and works like Lumos. You describe what you want to change, and Claude builds it for you. Then you share a link so others can see it.

#### Before you start
You need two things installed:
- Node.js (ask engineering if you need help)
- Claude Code (link to install docs)

#### Your first prototype (step by step)
1. **Open your terminal** and go to this project folder
2. **Create a branch** for your prototype:
   ```
   git checkout -b my-prototype-name
   ```
3. **Start the app** to see what's already there:
   ```
   pnpm dev
   ```
   Open `localhost:3000` in your browser.
4. **Open Claude Code** in the same folder:
   ```
   claude
   ```
5. **Tell Claude what you want.** Some examples:
   - "Add a new page called Vendors with a table showing vendor name, contract value, and renewal date"
   - "Change the Analytics page to show a pie chart instead of a bar chart"
   - "Add a detail view when you click on an identity in the Identities page"
6. **See your changes** — they appear in the browser as Claude works
7. **Share it** — type `/deploy-preview` and Claude will give you a link

#### Useful words
When talking to Claude, these words map to specific things in the app:

| You say | Claude understands |
|---------|-------------------|
| "header" or "top bar" | The bar at the top with the Lumos logo and user menu |
| "sidebar" or "nav" | The left navigation panel |
| "page title" or "page heading" | The big title at the top of each page (PageHeader) |
| "tabs" | The underlined section switchers below the title |
| "table" | A data grid with rows and columns |
| "card" | A bordered box containing grouped information |
| "badge" or "status pill" | The small colored labels like "Approved" or "Pending" |
| "button" | An interactive element — describe the action it should do |
| "modal" or "dialog" | A popup overlay |
| "form" or "settings" | Input fields for entering information |

For a visual gallery of common UI patterns and their names: https://component.gallery

#### Tips
- Be specific about what you want: "a table with 5 columns: name, email, role, status, actions" is better than "a list of users"
- Reference existing pages: "Make it look like the Apps page but for Vendors"
- Claude knows all the components — you don't need to tell it how to build them, just what you want

#### Getting help
- Type `/help` in Claude Code for general help
- Ask Claude: "What pages and components are available?"
- Reach out to [your name/channel] if you get stuck

---

## Phase 5 — Architecture docs

**Goal:** Document the connection between repos so this knowledge doesn't die.

### 5.1 — Registry repo architecture doc

**New file:** `docs/ARCHITECTURE.md`

Contents:
- What the registry is and how it serves components
- The build pipeline: `registry.json` → `npx shadcn build` → `/public/r/*.json`
- How V0, MCP, and shadcn CLI consume the registry
- Token system: Lumos semantic → shadcn bridge → Tailwind
- The `lumos-full-app` block and how it creates a routed app
- How the prototype repo depends on this registry
- How to add/update/remove components and blocks
- How to verify changes (tests + build)

### 5.2 — Prototype repo architecture doc

**New file:** `docs/ARCHITECTURE.md`

Contents:
- What the prototype repo is and who it's for
- How it was bootstrapped from the registry
- The route structure and where to add new pages
- How `/sync-registry` keeps components up to date
- How Vercel previews work (push branch → get URL)
- What NOT to modify (components/ui, globals.css tokens)
- How to contribute changes back to the registry (talk to you)

---

## Phase 6 — Future: Figma MCP integration

**Status:** Documented for future implementation. Requires Figma MCP, Figma Console MCP, and Playwright MCP servers to be configured.

### 6.1 — `/import-figma-component` (registry repo)

**File:** `.claude/commands/import-figma-component.md`

Workflow:
1. User provides Figma component URL or frame reference
2. Figma Console MCP reads: variants, properties, auto layout rules, fill/stroke tokens
3. Claude maps Figma properties to shadcn/Tailwind patterns using translation guide
4. Claude shows the mapping plan for approval:
   - Figma variant "Primary" → CVA variant `primary`
   - Figma auto layout → `flex flex-col gap-2`
   - Figma fill `background/action/primary` → `bg-primary`
5. Creates the component file, adds to registry.json, creates demo
6. Playwright MCP renders the component in the demo app
7. User compares with Figma original

Translation guide (to include in CLAUDE.md or skill):
```
Figma auto layout direction=vertical    → flex flex-col
Figma auto layout direction=horizontal  → flex flex-row
Figma auto layout spacing=N             → gap-{N/4} (e.g., 8→gap-2, 16→gap-4)
Figma auto layout padding               → p-{N/4}
Figma fill=[token-name]                  → bg-{mapped-token} (via token mapping table)
Figma stroke=[token-name]               → border border-{mapped-token}
Figma corner radius=N                    → rounded-{mapped} (4→rounded, 8→rounded-lg, 9999→rounded-full)
Figma variant property                   → CVA variant
Figma boolean property                   → optional prop with conditional render
Figma instance swap property             → ReactNode prop
Figma text property                      → string prop
Figma number property                    → number prop
```

### 6.2 — `/capture-to-figma` (prototype repo)

**File:** `.claude/commands/capture-to-figma.md`

Workflow:
1. User provides the Vercel preview URL (or localhost)
2. Playwright MCP visits each route defined in the sidebar
3. Screenshots at desktop viewport (1440×900)
4. Optionally: multiple states per page (different tabs selected, modals open)
5. Figma MCP creates a new page in a designated Figma file
6. Adds frames with the screenshots, labeled by route name
7. Reports: "Captured 14 screens to Figma file [name]"

### 6.3 — `/figma-to-page` (prototype repo)

**File:** `.claude/commands/figma-to-page.md`

Workflow:
1. User provides a Figma frame URL
2. Figma Console MCP reads the frame's structure
3. Claude identifies which Lumos components map to the design (using CLAUDE.md vocabulary)
4. Creates the page using actual registry components (not pixel-perfect recreation)
5. Adds route to sidebar
6. Reports what components were used and any gaps

### 6.4 — `/sync-screens` (prototype repo)

**File:** `.claude/commands/sync-screens.md`

Workflow:
1. Playwright screenshots each route of the current prototype
2. Fetches the corresponding frames from the Figma file
3. Reports which pages have drifted (design ≠ code)
4. Suggests: "These 3 pages have changed since last capture. Run `/capture-to-figma` to update Figma."

---

## Implementation Order

| Order | Phase | What | Repo | Est. complexity |
|-------|-------|------|------|-----------------|
| 1 | 1.1 | Update BrandSidebar href support | Registry | Small |
| 2 | 1.2 | Create full-app layout | Registry | Medium |
| 3 | 1.3 | Create 14 content-only page files | Registry | Medium (repetitive) |
| 4 | 1.4 | Add lumos-full-app to registry.json | Registry | Small |
| 5 | 1.5 | Verify build | Registry | Small |
| 6 | 2.1 | CLAUDE.md for registry | Registry | Small |
| 7 | 2.2–2.4 | Maintainer skills (3 files) | Registry | Medium |
| 8 | 2.5–2.6 | Tests + vitest setup | Registry | Medium |
| 9 | 3.x | Scaffold prototype repo | Prototype | Medium |
| 10 | 4.1 | CLAUDE.md for prototype | Prototype | Medium |
| 11 | 4.2–4.4 | Prototype skills (3 files) | Prototype | Medium |
| 12 | 4.5 | GETTING-STARTED.md | Prototype | Small |
| 13 | 5.x | Architecture docs (2 files) | Both | Small |
| 14 | 6.x | Figma MCP skills | Both | Future |

---

## Open questions

1. **Prototype repo name/location:** Is `lumos-prototype` the right name? Where should it live (same GitHub org)?
2. **Vercel project:** Should I set up the Vercel project connection, or will you do that?
3. **Font licensing:** Can Roobert font files be committed to the prototype repo, or do they need to be pulled at build time?
4. **Auth:** Should the registry require an auth token (middleware.ts) for production, or stay open?
5. **Who maintains the prototype repo?** You, or does each team member have push access?
