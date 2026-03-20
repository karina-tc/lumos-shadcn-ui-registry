# Lumos Spells Simplified Architecture

**Goal:** Move Spells into the registry repo as a subdirectory, eliminating git submodule complexity and enabling seamless component access.

**Architecture:** Spells lives at `registry/spells/` — each spell is a minimal Next.js project that imports components from the parent registry. Plan-creation skill scaffolds new spells by generating folders, pages, and imports.

**Tech Stack:** Next.js, React, Tailwind CSS (same as registry), TypeScript

---

## File Structure

```
registry/
  src/
    components/            # Lumos components (brand-header, lumos-button, etc.)
    app/
      globals.css          # Lumos design tokens imported by spells
    layouts/
    lib/
  spells/                  # NEW: Spells directory
    {spell-name}/
      src/
        app/
          page.tsx         # Home page (Next.js App Router)
          [page-name]/
            page.tsx       # Additional pages
      package.json
      tsconfig.json
      next.config.js
      README.md
      CLAUDE.md            # Optional: spell-specific instructions
    ...
  registry.json
  CLAUDE.md               # Plan-creation skill documented here
  pnpm-workspace.yaml     # Registry uses pnpm workspaces
  package.json
  docs/superpowers/plans/ # Plans for each spell created
```

## Spell Architecture

### Minimal Spell (`spells/{spell-name}/`)

Each spell is a Next.js project using the App Router. Required files:

- **`package.json`** — Installs dependencies. Spells are standalone projects (not workspace packages); they build independently.

```json
{
  "name": "@lumos/spell-{spell-name}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^19",
    "next": "^15",
    "tailwindcss": "^4.1.11",
    "@tailwindcss/postcss": "^4.1.11",
    "class-variance-authority": "^0.7",
    "clsx": "^2"
  },
  "devDependencies": {
    "postcss": "^8.5.6",
    "typescript": "^5.6",
    "@types/node": "^20",
    "@types/react": "^19"
  }
}
```

- **`tsconfig.json`** — Path aliases resolve to parent registry components and assets.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["../../src/*"]
    },
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "moduleResolution": "bundler"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

- **`next.config.js`** — Minimal Next.js configuration.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

- **`src/app/layout.tsx`** — Root layout that imports Lumos tokens.

```tsx
import '@/app/globals.css';  // Lumos design tokens from parent registry
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lumos Spell',
  description: 'Prototype built with Lumos components',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- **`src/app/page.tsx`** — Home page using App Router pattern.

```tsx
import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';
import { LumosButton } from '@/components/lumos-button';

export default function Home() {
  return (
    <LumosLayout>
      <PageHeader
        title="Spell: Access Review Prototype"
        description="Manage access reviews"
      />
      <div className="p-6">
        <LumosButton>Create Review</LumosButton>
      </div>
    </LumosLayout>
  );
}
```

- **`src/app/{page-name}/page.tsx`** — Additional pages (e.g., `src/app/rules/page.tsx`).

- **`README.md`** — What this spell does, what pages it includes.

- **`CLAUDE.md`** (optional) — Spell-specific instructions for future Claude sessions.

### Import Resolution

The `tsconfig.json` path alias `@/*` resolves to `../../src/*`, allowing imports like:

```tsx
import { LumosLayout } from '@/components/lumos-layout';
import '@/app/globals.css';  // Lumos design tokens
```

This pulls components and tokens from the parent registry at `registry/src/`.

## Plan-Creation Skill Workflow

When a user asks Claude to create a new spell:

### Step 1: Gather Input (3 Questions)

- **Q1:** What feature/area does this spell prototype? (e.g., "access reviews", "analytics dashboard")
- **Q2:** What's the spell name? (e.g., "access-review-prototype")
- **Q3:** What pages should it include? (e.g., "home, rules, dashboard, users")

### Step 2: Generate Spell Folder

Create `spells/{spell-name}/` with:
- `package.json` (dependencies and scripts as documented above)
- `tsconfig.json` (path aliases: `@/*` → `../../src/*`)
- `next.config.js` (minimal, empty config)
- `src/app/layout.tsx` (root layout importing `globals.css` from parent registry)
- `src/app/page.tsx` (home page)
- `src/app/{page-name}/page.tsx` for each requested page
- `README.md` (auto-generated description)

### Step 3: Generate Page Content

For each page:
- Import `LumosLayout` and essential primitives (`PageHeader`, `LumosButton`, `LumosCard`)
- Create a basic page structure with the spell name and page title
- Use Lumos design tokens (Tailwind semantic classes: `bg-primary`, `text-muted-foreground`, `border-border`, etc.)
- Follow the pattern: `src/app/{page-name}/page.tsx` for non-home pages

Example generated home page (`src/app/page.tsx`):

```tsx
import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';
import { LumosButton } from '@/components/lumos-button';

export default function Home() {
  return (
    <LumosLayout>
      <PageHeader
        title="Access Review Prototype"
        description="Manage access reviews"
      />
      <div className="p-6">
        <LumosButton>Create Review</LumosButton>
      </div>
    </LumosLayout>
  );
}
```

Example generated additional page (`src/app/rules/page.tsx`):

```tsx
import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';

export default function RulesPage() {
  return (
    <LumosLayout>
      <PageHeader
        title="Rules"
        description="Define access review rules"
      />
      <div className="p-6 space-y-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Coming Soon</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Build out this page with your specific requirements.
          </p>
        </Card>
      </div>
    </LumosLayout>
  );
}
```

### Step 4: Create Branch & Commit

- Create a new git branch: `spell/{spell-name}`
- Git add all files: `git add spells/{spell-name}/`
- Commit with message: `spell: add {spell-name} prototype`
- Remain in the branch for user to edit/iterate

## Integration with Registry Build

Spells are standalone Next.js projects co-located in the registry repo. They are **not** workspace packages; each spell builds independently.

### Build Workflow

**Registry build** (`pnpm build` from repo root):
- Generates registry components, blocks, themes in `public/r/`
- Does NOT affect spells
- Spells are independent and build separately

**Spell build**:
```bash
cd spells/{spell-name}
pnpm install              # Install spell's dependencies
pnpm dev                  # Develop locally (port 3001)
pnpm build && pnpm start  # Build and serve
```

Spells resolve imports via `tsconfig.json` path aliases pointing to the parent registry (`../../src/*`). This works because:
1. Spell's `src/app/layout.tsx` imports `@/app/globals.css` (resolves to `registry/src/app/globals.css`)
2. Page files import components like `@/components/lumos-button` (resolves to `registry/src/components/lumos-button.tsx`)

### Monorepo Setup

The registry uses `pnpm-workspace.yaml` to manage the root package and registry components. **Spells are not workspace packages**; they are standalone directories that can build independently with their own `node_modules/`.

To prevent confusion:
- Root `pnpm install` installs registry dependencies only
- Each spell has its own `package.json` and must be installed separately: `cd spells/{spell-name} && pnpm install`

## Success Criteria

A spell is "complete" when:
- All page files render without errors
- Registry component imports resolve correctly
- Design tokens (Tailwind classes) apply visually
- `pnpm build` succeeds (no TypeScript or bundling errors)
- Pages are editable by users (boilerplate is clear)

## Testing Strategy

### Registry Tests
- Run via `pnpm test` from repo root
- Test registry components, blocks, utilities
- Use vitest (configured in `vitest.config.ts`)
- Must pass before any registry changes are merged

### Spell Testing

New spells are validated by:

1. **TypeScript compilation** — `cd spells/{spell-name} && pnpm build`
   - Validates all imports resolve correctly
   - Catches missing components or typos in imports
   - Confirms `tsconfig.json` paths are correct

2. **Local development** — `pnpm dev`
   - Start dev server: `pnpm dev`
   - Navigate to each page and verify it renders
   - Check that design tokens apply (colors, spacing, fonts visible)

3. **Build validation** — `pnpm build`
   - Confirms Next.js build succeeds
   - Validates all pages and routes compile

Spells do not have their own vitest configuration; they are prototypes focused on visual/functional correctness rather than unit tests. Quality assurance is done via manual review and dev server testing.

## Error Handling

- If `tsconfig.json` path alias is misconfigured, imports fail at build time with clear error
- If a spell page imports a component that doesn't exist in registry, TypeScript error at build time
- If design tokens aren't available, Tailwind errors at build time

All errors are caught before deployment.

## Future Extensibility

This design supports future enhancements:
- Spell CLI tool: `lumos-spell create {name}` scaffolds interactively
- Spell templates: preset page structures (form-heavy, dashboard, etc.)
- Spell publishing: deploy a spell to a registry URL for reuse
- Spell library: curated collection of well-built spells

But the MVP is: manual creation via plan-creation skill, develop locally, iterate in branches.

## Moving Existing Work

The existing Spells MVP (`mvp-implementation` branch) will be moved into `registry/spells/`:

1. Move spell-manifest.json, .claude/instructions.md, spells/ directory → `registry/spells/`
2. Remove `.gitmodules` (no git submodule)
3. Update package.json to use parent registry imports
4. Close the old Spells repo PR; work continues here

All existing work (7 completed tasks, tests, documentation) is preserved and now lives in the registry repo.
