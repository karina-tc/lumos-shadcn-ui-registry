# Lumos Design System Registry

A production design system registry built with Next.js, shadcn/ui, and Tailwind CSS. Serves components, tokens, blocks, and full-app layouts for Lumos prototypes and applications.

**Live:** https://lumos-shadcn-ui-registry.vercel.app

## Overview

The Lumos registry provides:

- **Design Tokens** — Orange primary, neutral color palette, Roobert font, semantic colors
- **Components** — Brand header, sidebar, buttons, badges, page headers, chat UI
- **Blocks** — Full-page templates (apps, identities, analytics, etc.)
- **Spells** — Blank prototype templates with pre-configured Lumos layout

## Running Locally

```bash
pnpm install
pnpm dev
```

Registry runs on localhost:3000.

## Commands

```bash
pnpm dev            # Start dev server (Turbopack)
pnpm build          # Build + generate registry JSON
pnpm lint           # Lint with Biome
pnpm lint:fix       # Auto-fix linting issues
pnpm test           # Run tests (vitest)
```

## Getting Started

### View the Registry

Open localhost:3000 to browse components, blocks, and tokens. Each item shows interactive examples and can be opened in v0.

### Access the Spell Template

Blank canvas to build your prototype: localhost:3000/spells/project

The template includes the full Lumos app layout (header + sidebar) with a blank content area. Perfect for rapid prototyping.

### Create a Spell (Standalone App)

Spells are standalone Next.js projects that import components from the registry:

```bash
# Branch off your work
git checkout -b spell/your-feature

# Copy the template
cp -r spells/lumos-spells spells/your-spell-name

# Customize
cd spells/your-spell-name
pnpm install
pnpm dev
```

Navigate to localhost:3001 and build. All Lumos components available via `@/components/*` imports.

## Architecture

### Registry Structure

```
registry.json                  # Master config for all items
src/
  components/
    lumos-layout.tsx          # App shell (header + sidebar)
    brand-header.tsx          # Top navigation
    brand-sidebar.tsx         # Left sidebar nav
    page-header.tsx           # Page title + description
    lumos-button.tsx          # Primary action button
    albus-*.tsx               # AI chat components
    ui/                       # shadcn primitives
  app/
    globals.css               # Design tokens + fonts
    (registry)/               # Registry UI
    spells/project/           # Spell template route
    demo/[name]/              # Component/block demos
```

### Design Tokens

Lumos uses primitive color tokens in `globals.css` that map to shadcn semantic aliases:

| Primitive | Alias | Tailwind |
|-----------|-------|----------|
| `--orange-500` | `--primary` | `bg-primary`, `text-primary` |
| `--neutral-900` | `--foreground` | `text-foreground` |
| `--neutral-200` | `--border` | `border-border` |

Always use Tailwind semantic classes, never raw token variables.

## Registry Items

Items are declared in `registry.json` and generated to `public/r/*.json` on build:

- **`registry:theme`** — Design tokens + CSS variables
- **`registry:component`** — Reusable components (brand-header, lumos-button, etc.)
- **`registry:block`** — Full pages with layout (lumos-apps-index, etc.)
- **`registry:ui`** — shadcn primitive overrides

## Integration

### V0 Integration

Every component has an "Open in v0" button. Clicking it opens v0 with:
- Pre-loaded theme tokens from this registry
- Theme colors and design system applied
- Ability to generate variations using Lumos components

### MCP (Model Context Protocol)

Use this registry with AI IDEs (Cursor, Windsurf, Claude):

```json
{
  "mcpServers": {
    "lumos-registry": {
      "command": "npx",
      "args": ["shadcn-ui@latest", "registry-mcp", "https://lumos-shadcn-ui-registry.vercel.app"]
    }
  }
}
```

The registry exposes `public/r/registry.json` with all items in shadcn format.

## Development

### Adding a Component

```bash
1. Create src/components/{name}.tsx
2. Create demo at src/app/demo/[name]/components/{name}.tsx
3. Add export to src/app/demo/[name]/index.tsx
4. Add entry to registry.json with dependencies
5. pnpm build to verify
```

### Adding a Block (Full Page)

```bash
1. Create standalone block at src/app/demo/[name]/blocks/{name}.tsx
2. Create content-only version at src/app/demo/[name]/blocks/full-app/{name}-page.tsx
3. Add exports to src/app/demo/[name]/index.tsx
4. Add entries to registry.json
5. Add route to full-app-layout.tsx
6. pnpm build to verify
```

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkarina-tc%2Flumos-shadcn-ui-registry)

Environment variables (optional):
- `REGISTRY_AUTH_TOKEN` — Protect `/r/*` routes with token auth

## Resources

- [shadcn/ui Registry Docs](https://ui.shadcn.com/docs/registry)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- Lumos Design Spec — `docs/superpowers/specs/2026-03-20-lumos-spells-design.md`

## License

MIT
