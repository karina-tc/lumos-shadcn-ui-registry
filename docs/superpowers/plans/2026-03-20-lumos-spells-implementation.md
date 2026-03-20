# Lumos Spells Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Lumos Spells MVP into the registry repo as `registry/spells/lumos-spells/` with the new simplified architecture (App Router, direct component imports from parent registry, no git submodule).

**Architecture:** Spells live as standalone Next.js projects in the registry repo. Each spell imports components from the parent registry via `tsconfig.json` path aliases (`@/*` → `../../src/*`). Plan-creation skill scaffolds new spells by generating folders, pages, and configs. No complex synchronization needed.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind CSS 4.1, TypeScript

---

## Task 1: Create Spell Directory Structure

**Files:**
- Create: `spells/lumos-spells/src/app/layout.tsx`
- Create: `spells/lumos-spells/src/app/page.tsx`
- Create: `spells/lumos-spells/package.json`
- Create: `spells/lumos-spells/tsconfig.json`
- Create: `spells/lumos-spells/next.config.js`
- Create: `spells/lumos-spells/README.md`

### Step 1: Create spell directory

```bash
mkdir -p spells/lumos-spells/src/app
```

### Step 2: Create root layout with globals.css import

Create `spells/lumos-spells/src/app/layout.tsx`:

```tsx
import '@/app/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lumos Spells',
  description: 'Prototypes built with Lumos components',
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

### Step 3: Create home page

Create `spells/lumos-spells/src/app/page.tsx`:

```tsx
import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';
import { LumosButton } from '@/components/lumos-button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <LumosLayout>
      <PageHeader
        title="Lumos Spells"
        description="Prototype app built with Lumos components"
      />
      <div className="p-6 space-y-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Welcome</h2>
          <p className="text-sm text-muted-foreground mt-2">
            This is a Lumos spell — a prototype built with components from the registry.
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold">Getting Started</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Add pages to src/app/ and import Lumos components to build your prototype.
          </p>
        </Card>
      </div>
    </LumosLayout>
  );
}
```

### Step 4: Create package.json

Create `spells/lumos-spells/package.json`:

```json
{
  "name": "@lumos/spell-lumos-spells",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
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

### Step 5: Create tsconfig.json

Create `spells/lumos-spells/tsconfig.json`:

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

### Step 6: Create next.config.js

Create `spells/lumos-spells/next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

### Step 7: Create README.md

Create `spells/lumos-spells/README.md`:

```markdown
# Lumos Spells

A prototype app built with Lumos components.

## Development

```bash
pnpm install
pnpm dev
```

Navigate to http://localhost:3001.

## Building

```bash
pnpm build
pnpm start
```

## Adding Pages

Create new files in `src/app/` using the App Router pattern:

- `src/app/about/page.tsx` → `/about` route
- `src/app/dashboard/page.tsx` → `/dashboard` route

Import Lumos components from the parent registry:

```tsx
import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';
```

Design tokens (colors, spacing) are automatically imported via `globals.css`.
```

### Step 8: Commit

```bash
git add spells/lumos-spells/
git commit -m "spell: add lumos-spells to registry/spells/"
```

---

## Task 2: Create Additional Pages from MVP

**Files:**
- Create: `spells/lumos-spells/src/app/[existing-pages]/page.tsx` (for each page from MVP)

The existing MVP has pages like home, apps, identities, access-reviews, etc. These get migrated to the new structure.

### Step 1: Identify pages in existing MVP

From the context, the MVP has at least these pages:
- home
- apps
- identities
- access-reviews
- accounts
- analytics
- integrations
- settings
- albus
- onboarding
- offboarding
- activity-log
- tasks
- access-policies

### Step 2: Create directory for each page

```bash
mkdir -p spells/lumos-spells/src/app/{apps,identities,access-reviews,accounts,analytics,integrations,settings,albus,onboarding,offboarding,activity-log,tasks,access-policies}
```

### Step 3: Create page files

For each page, create `src/app/{page-name}/page.tsx` with basic structure.

Example: `spells/lumos-spells/src/app/apps/page.tsx`:

```tsx
import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';

export default function AppsPage() {
  return (
    <LumosLayout>
      <PageHeader
        title="Apps"
        description="Manage connected applications"
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

Repeat for: identities, access-reviews, accounts, analytics, integrations, settings, albus, onboarding, offboarding, activity-log, tasks, access-policies.

### Step 4: Commit all pages

```bash
git add spells/lumos-spells/src/app/*/page.tsx
git commit -m "spell: add page files for all sections"
```

---

## Task 3: Test Spell Build

**Files:**
- No new files; testing existing setup

### Step 1: Install spell dependencies

```bash
cd spells/lumos-spells
pnpm install
```

Expected: No errors, node_modules created.

### Step 2: Run TypeScript check

```bash
pnpm build
```

Expected: Build succeeds, `.next/` directory created with no TypeScript errors.

### Step 3: Run dev server

```bash
pnpm dev
```

Expected: Server starts on `http://localhost:3001`, can navigate to pages without errors.

### Step 4: Verify design tokens apply

Open browser to `http://localhost:3001`:
- Check that text is visible (not transparent)
- Check that Lumos colors apply (orange for primary, neutral for backgrounds)
- Check that spacing is consistent

### Step 5: Stop dev server and commit

```bash
# Ctrl+C to stop
cd ../..
git add -A
git commit -m "spell: verify build and dev server work"
```

---

## Task 4: Remove Git Submodule

**Files:**
- Delete: `.gitmodules`
- Modify: `spells/` references in any config

### Step 1: Remove .gitmodules

```bash
rm .gitmodules
```

### Step 2: Remove submodule reference from git config

```bash
git config --file=.git/config --remove-section submodule.registry
```

### Step 3: Remove submodule directory (if it exists)

If a `registry/` subdirectory was created by the submodule, remove it:

```bash
rm -rf registry  # Only if this is the git submodule copy
```

Note: This is ONLY if the old MVP setup had the registry as a submodule here. If not, skip.

### Step 4: Commit

```bash
git add .gitmodules .git/config
git commit -m "chore: remove registry git submodule"
```

---

## Task 5: Update Registry Documentation

**Files:**
- Modify: `CLAUDE.md` (add plan-creation skill documentation)

### Step 1: Read current CLAUDE.md

See what's there and where to add spell-creation instructions.

### Step 2: Add section to CLAUDE.md

Add to the end or appropriate section:

```markdown
## Creating a Spell

Spells are lightweight prototypes using Lumos components. Ask Claude to create one:

> "Create a spell for [feature area]"

Claude will:
1. Ask 3 questions (feature, name, pages)
2. Generate `spells/{spell-name}/` with Next.js app structure
3. Create pages importing from parent registry components
4. Git add → commit → create feature branch

You can then edit pages and iterate. All Lumos components are available via `@/components/*` imports.

To develop locally:
```bash
cd spells/{spell-name}
pnpm install
pnpm dev
```

See `docs/superpowers/specs/2026-03-20-lumos-spells-design.md` for architecture details.
```

### Step 3: Commit

```bash
git add CLAUDE.md
git commit -m "docs: add spell-creation instructions"
```

---

## Task 6: Verify Registry Still Builds

**Files:**
- No new files; verification step

### Step 1: Build registry (parent)

From repo root:

```bash
pnpm build
```

Expected: Registry builds successfully, `public/r/*.json` files generated.

### Step 2: Check registry.json

```bash
cat registry.json | head -20
```

Verify it still has all entries and is valid JSON.

### Step 3: Verify spell still builds

```bash
cd spells/lumos-spells
pnpm build
```

Expected: Build succeeds with no errors.

### Step 4: Clean up and commit

```bash
cd ../..
git add -A
git commit -m "spell: verify registry and spell build independently"
```

---

## Task 7: Final Testing & Cleanup

**Files:**
- No new files; integration testing

### Step 1: Start dev servers in parallel

Terminal 1 (registry):
```bash
pnpm dev
```

Terminal 2 (spell):
```bash
cd spells/lumos-spells
pnpm dev
```

### Step 2: Test spell pages

Open `http://localhost:3001` and:
- Click through all pages (home, apps, identities, etc.)
- Verify no 404 errors
- Verify components render (buttons, cards, headers visible)
- Verify Lumos styling applies (colors, spacing)

### Step 3: Test component imports

Pick one page and verify component import works:
- Inspect element in browser dev tools
- Confirm `LumosLayout` renders correctly
- Confirm `LumosButton` has correct styling

### Step 4: Stop servers and commit

```bash
# Stop both servers (Ctrl+C in each terminal)
git status  # Should show clean working tree
git log --oneline -5  # Verify recent commits
```

### Step 5: Final commit

```bash
git commit --allow-empty -m "spell: implementation complete and verified"
```

---

## Files Summary

**Created:**
- `spells/lumos-spells/src/app/layout.tsx` — Root layout
- `spells/lumos-spells/src/app/page.tsx` — Home page
- `spells/lumos-spells/src/app/{page-name}/page.tsx` — 13 additional pages
- `spells/lumos-spells/package.json` — Dependencies and scripts
- `spells/lumos-spells/tsconfig.json` — Path aliases
- `spells/lumos-spells/next.config.js` — Next.js config
- `spells/lumos-spells/README.md` — Spell documentation

**Deleted:**
- `.gitmodules` — Git submodule config

**Modified:**
- `CLAUDE.md` — Added spell-creation instructions

**Total commits:** 7 (one per task)

---

## Success Criteria

- ✅ Spell directory created at `registry/spells/lumos-spells/`
- ✅ All pages (home + 13 sections) render without errors
- ✅ Components import from parent registry resolve correctly
- ✅ Design tokens (Lumos colors, spacing) apply visually
- ✅ `pnpm build` succeeds for spell
- ✅ `pnpm dev` server runs at localhost:3001
- ✅ Registry still builds independently
- ✅ Git submodule removed
- ✅ CLAUDE.md documents spell creation
