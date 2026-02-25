# Lumos V0 Registry — Design Document
**Date:** 2026-02-25
**Status:** Approved

## Goal

Enable the Lumos design team to prototype in V0 using a custom registry so that generated mocks look visually consistent with the production application — correct colors, font, spacing, and page structure — without needing to manually configure styling every session.

## Approach

Keep the existing Next.js 15 + shadcn registry infrastructure intact. Tear out and rebuild all design content (tokens, components, layouts) to accurately reflect the production app at `/lumos/frontend`.

## What We Keep

- Next.js 15 + Turbopack app scaffolding
- shadcn registry system (`registry.json`, `/r/[name].json` routes, demo renderer)
- The 24 shadcn UI primitives (accordion, alert, avatar, badge, button, card, etc.)
- v0 integration buttons and registry UI chrome
- MCP / Cursor "add to" integration

## What We Tear Out and Rebuild

- `src/app/globals.css` — replaced entirely with accurate Lumos tokens
- All 7 existing custom components (brand-header, brand-sidebar, login, logo, hero, promo, product-grid) — wrong domain
- Existing registry.json theme entry — replaced with accurate Lumos theme

## Section 1: Token System

### Source of truth
`/lumos/frontend/src/index.css` — the production CSS variable file.

### Layer 1: Full Lumos Semantic Token Set (light mode only)

Carry over verbatim from production:

```
Neutral scale:      --neutral-50 through --neutral-1000
Color scales:       --blue-*, --green-*, --lemon-*, --orange-*, --purple-*,
                    --red-*, --teal-*, --yellow-*, --pink-*

Semantic groups:
  --background-container-primary/secondary/tertiary/accent/danger/success/warning/ai
  --background-action-primary (+ -hover, -pressed)/secondary/danger/success/accent
  --background-data-blue/purple/pink/teal/lemon (+ -hover variants)
  --foreground-primary/inverse/secondary/tertiary/danger/success/warning/accent/ai
  --border-primary/secondary/danger/success/warning/accent/ai
  --outline-default/inverse
```

### Layer 2: shadcn Bridge Aliases

Maps Lumos tokens to the variable names shadcn components and V0-generated code expect:

| shadcn var              | maps to                            |
|-------------------------|------------------------------------|
| `--background`          | `--background-container-primary`   |
| `--foreground`          | `--foreground-primary`             |
| `--primary`             | `--background-action-primary` (orange) |
| `--primary-foreground`  | white                              |
| `--secondary`           | `--background-container-secondary` |
| `--secondary-foreground`| `--foreground-primary`             |
| `--muted`               | `--background-container-tertiary`  |
| `--muted-foreground`    | `--foreground-secondary`           |
| `--accent`              | `--background-container-accent`    |
| `--accent-foreground`   | `--foreground-accent`              |
| `--destructive`         | `--background-action-danger`       |
| `--border`              | `--border-primary`                 |
| `--ring`                | `--outline-default`                |

Dark mode is explicitly out of scope for this phase.

## Section 2: Typography

### Font
- **Roobert** — source files at `/lumos/frontend/src/assets/fonts/`
- Copy 6 files to `/public/fonts/`: Regular, RegularItalic, Medium, MediumItalic, Bold, BoldItalic
- Declare via `@font-face` in `globals.css`
- Set as `--font-sans` and configure as `font-family: "Roobert"` on `<body>`

### Type Scale (Tailwind v4 `@theme` entries)
Matching production `typography.ts`:

| Token       | Size  | Weight    |
|-------------|-------|-----------|
| `text-h1`   | 48px  | 500 / 700 |
| `text-h2`   | 32px  | 500 / 700 |
| `text-h3`   | 24px  | 500 / 700 |
| `text-h4`   | 18px  | 500 / 700 |
| `text-h5`   | 16px  | 500 / 700 |
| `text-h6`   | 14px  | 500 / 700 |
| `text-body` | 14px  | 400 / 500 |
| `text-sm`   | 12px  | 400 / 500 |

## Section 3: Layout Blocks

### Approach
Use Playwright on `localhost:3000` (requires active auth session) to:
1. Capture a screenshot of the main navigation
2. Enumerate every nav destination linked from the admin sidebar
3. Navigate to each index and capture layout structure
4. Build one registry block per nav section

### Block structure (per block)
Each block is a full-page shell with:
- The standard 256px sidebar (Lumos logo area, nav links with active state, footer)
- Top header bar (page title left, action buttons right)
- Content area matching the real index layout (table, card grid, form, etc.)
- Realistic placeholder content (fake names, statuses, dates — no lorem ipsum)

### Block naming convention
`lumos-[section-name]-index` — e.g. `lumos-access-requests-index`, `lumos-users-index`

### Exact list
To be determined from Playwright nav crawl. Anticipated sections based on codebase patterns:
- Access Requests
- Users / People
- Apps / Integrations
- Groups / Roles
- Policies / Rules
- Settings (full-width, no sidebar)
- Possibly: Reports/Analytics, Workflows, Audit Log

## Section 4: Key Components

Three components only — chosen for maximum visual impact in prototypes.

### `lumos-button`
- Variants: `primary` (orange, white text), `secondary` (outlined), `danger` (red)
- Sizes: `md` (h-8, px-4), `sm` (h-6, px-3)
- Shape: `rounded-full` — this is the most distinctive Lumos UI trait
- Source reference: `/lumos/frontend/src/designSystem/ui/form/Button/Button.tsx`

### `lumos-badge`
- Status pill used in tables, lists, detail views
- Color variants map directly to `--background-data-*` tokens:
  blue, purple, pink, teal, lemon, orange, red, green
- Rounded-full, text-xs, px-2 py-0.5
- Source reference: Badge component in designSystem

### `lumos-card`
- App tile card with the `apptile` box shadow (`-6px 12px 32px -6px rgba(0,0,0,0.16)`)
- Hover shadow variant (`apptilehover`)
- Used in app catalog, integrations grid, dashboard
- Source reference: Card in `/lumos/frontend/src/designSystem/ui/dataDisplay/`

## Implementation Order

1. **Token foundation** — `globals.css`, font files, Tailwind v4 `@theme`
2. **Registry theme entry** — update `registry.json` theme with accurate tokens
3. **Playwright crawl** — enumerate nav sections, capture screenshots, document layout patterns
4. **Layout blocks** — one block per nav section
5. **Three components** — Button, Badge, Card
6. **Cleanup** — remove old custom components from registry.json and src/

## Out of Scope (this phase)

- Dark mode
- Full component library port
- Auth/access control for the registry
- Deployment to Vercel (that comes after the content is right)
