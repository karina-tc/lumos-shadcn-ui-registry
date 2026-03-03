# Lumos Design System Registry

A shadcn/ui registry serving the Lumos design system — tokens, components, blocks, and full-app pages. Deployed to Vercel, consumed by V0, shadcn CLI, and the downstream prototype repo.

## Commands

```
pnpm dev            # registry:build + next dev (Turbopack)
pnpm build          # registry:build + next build
pnpm lint           # biome check
pnpm lint:fix       # biome check --write
pnpm test           # vitest run
```

## How it works

`registry.json` is the source of truth. Every component, block, and theme is declared there.

```
registry.json  →  npx shadcn@latest build  →  public/r/*.json
```

The generated JSON files in `public/r/` are what V0 and consumers fetch. They're gitignored — regenerated on every build.

## File structure

```
registry.json                          # Master registry config
src/
  components/                          # Lumos custom components
    brand-header.tsx                   #   Top bar with logo, breadcrumb, user menu
    brand-sidebar.tsx                  #   Left nav with collapsible sections
    lumos-layout.tsx                   #   Shell combining header + sidebar
    lumos-button.tsx                   #   Orange primary, rounded-full variants
    lumos-badge.tsx                    #   Status pills (blue, green, red, etc.)
    lumos-card.tsx                     #   App tile card with box shadow
    lumos-symbol.tsx                   #   Lumos logo SVG
    albus-symbol.tsx                   #   Albus AI icon SVG
    page-header.tsx                    #   Page title + description + actions
    page-tabs.tsx                      #   Underline-style tab switcher
    albus-chat-input.tsx               #   Rich chat textarea with suggestions
    albus-mode-menu.tsx                #   Ask/Deep Research mode toggle
    albus-suggestions-panel.tsx        #   Animated suggestion panel
    albus-history-panel.tsx            #   Slide-in chat history sheet
    full-app-layout.tsx                #   Route-aware shell for full-app block (not used standalone)
    ui/                                #   shadcn primitives — DO NOT edit directly
  app/
    globals.css                        #   Lumos tokens + Roobert font faces
    demo/[name]/
      blocks/                          #   Full-page block demos
        full-app/                      #   Content-only pages for lumos-full-app block
        lumos-apps-index.tsx           #   Standalone block demos (with LumosLayout)
        ...
      components/                      #   Component demos
      ui/                              #   UI primitive demos
      index.tsx                        #   Demo registry — maps names to components
    (registry)/                        #   The browsing UI for the registry itself
  layouts/                             #   Layout files used as registry targets
  lib/
    registry.ts                        #   Helpers for reading registry.json
    utils.ts                           #   cn() utility
```

## Registry item types

| Type | What | Example |
|------|------|---------|
| `registry:theme` | CSS tokens + globals | `theme` |
| `registry:component` | Reusable component | `brand-header`, `page-tabs` |
| `registry:block` | Full page with data | `lumos-apps-index`, `lumos-full-app` |
| `registry:ui` | shadcn primitive override | `button`, `dialog` |

## Token system

Lumos has its own primitive color tokens in `globals.css` (neutral, blue, green, orange, purple, red, pink, teal, lemon). These map to shadcn semantic aliases:

| Lumos primitive | shadcn alias | Tailwind class |
|----------------|--------------|----------------|
| `--orange-500` | `--primary` | `bg-primary`, `text-primary` |
| `--neutral-50` | `--background` | `bg-background` |
| `--neutral-900` | `--foreground` | `text-foreground` |
| `--neutral-600` | `--muted-foreground` | `text-muted-foreground` |
| `--neutral-200` | `--border` | `border-border` |
| `--neutral-150` | `--muted` | `bg-muted` |
| `--neutral-100` | `--secondary` | `bg-secondary` |
| `--orange-100` | `--accent` | `bg-accent` |

Always use the Tailwind semantic classes (`bg-primary`, `text-muted-foreground`, `border-border`), never raw token variables.

## Adding a component

Use the `/add-component` skill, or manually:

1. Create `src/components/{name}.tsx`
2. Create demo at `src/app/demo/[name]/components/{name}.tsx`
3. Add demo export to `src/app/demo/[name]/index.tsx`
4. Add entry to `registry.json` with `registryDependencies`
5. Run `pnpm build` to verify

## Adding a block (page)

Use the `/add-block` skill, or manually:

1. Create the standalone block at `src/app/demo/[name]/blocks/{name}.tsx` (wraps content in `<LumosLayout>`)
2. Create a content-only version at `src/app/demo/[name]/blocks/full-app/{name}-page.tsx` (no LumosLayout wrapper)
3. Add standalone demo export to `src/app/demo/[name]/index.tsx`
4. Add both the standalone block and the full-app page file entry to `registry.json`
5. Add the new route to `full-app-layout.tsx` (routes array + navSections)
6. Run `pnpm build` to verify

## Naming conventions

- Blocks: `lumos-{section}-index` (e.g., `lumos-apps-index`)
- Components: descriptive kebab-case (e.g., `brand-header`, `page-tabs`)
- Files match their registry name (e.g., `brand-header.tsx` for `brand-header`)
- Full-app pages: `{section}-page.tsx` (e.g., `apps-page.tsx`, `analytics-page.tsx`)

## BrandSidebar navigation

The sidebar supports two modes:
- **Button mode** (default): nav items render as `<button>` — used in standalone block demos
- **Link mode**: when a nav item has `href`, it renders as `<a>` — used in the full-app block

SubItems accept either `string` (button mode) or `{ label: string; href?: string }` (link mode).

## The full-app block

`lumos-full-app` is a special registry block that installs a complete routed app:
- `root-layout.tsx` → `app/layout.tsx` (fonts + FullAppShell)
- 14 page files → `app/*/page.tsx` (content only, no layout wrapper)
- `full-app-layout.tsx` → `components/full-app-layout.tsx` (route-aware shell)

The FullAppShell uses `usePathname()` to determine which sidebar item is active and what title to show in the header.

## Downstream consumer

The `lumos-prototype` repo pulls components and themes from this registry. Changes here flow downstream when consumers run `npx shadcn@latest add` with `--overwrite`. Page files in the prototype are NOT overwritten by sync — they're prototypes that may have been customized.

## Validating the registry

Use the `/validate-registry` skill to check:
- Every file path in registry.json exists on disk
- Every registryDependency URL maps to a valid registry item
- Demo index entries match registry.json items
- No orphaned component files
- Build succeeds

## Importing from Figma

Use the `/import-figma-component` skill to convert a Figma component into a coded registry component. Requires Figma MCP server to be configured.

The skill reads Figma auto layout, variants, tokens, and properties, maps them to Tailwind/CVA patterns using the Lumos token system, and creates the component file, demo, and registry entry. See the skill for the full Figma-to-code translation guide.
