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
    layouts/
    lib/
  spells/                  # NEW: Spells directory
    {spell-name}/
      src/
        pages/
          index.tsx
          example-page.tsx
      package.json         # Shared with registry dependencies
      README.md
      CLAUDE.md            # Optional: spell-specific instructions
    ...
  registry.json
  CLAUDE.md               # Plan-creation skill documented here
  package.json
  docs/superpowers/plans/ # Plans for each spell created
```

## Spell Architecture

### Minimal Spell (`spells/{spell-name}/`)

Each spell is a Next.js project with:

- **`package.json`** — Installs dependencies (shared with registry). No separate build step for components; spells import directly from parent.

```json
{
  "name": "@lumos/spell-{spell-name}",
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^19",
    "next": "^15",
    "class-variance-authority": "^0.7",
    "clsx": "^2"
  }
}
```

- **`src/pages/*.tsx`** — Page files that import registry components.

```tsx
// pages/index.tsx
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

- **`README.md`** — What this spell does, what pages it includes.

- **`CLAUDE.md`** (optional) — Spell-specific instructions for future Claude sessions working on this spell.

### Import Resolution

Spells use `tsconfig.json` path aliases that resolve to the parent registry:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["../../src/*"]
    }
  }
}
```

This allows `import { LumosButton } from '@/components/lumos-button'` to pull from `registry/src/components/lumos-button.tsx`.

## Plan-Creation Skill Workflow

When a user asks Claude to create a new spell:

### Step 1: Gather Input (3 Questions)

- **Q1:** What feature/area does this spell prototype? (e.g., "access reviews", "analytics dashboard")
- **Q2:** What's the spell name? (e.g., "access-review-prototype")
- **Q3:** What pages should it include? (e.g., "home, rules, dashboard, users")

### Step 2: Generate Spell Folder

Create `spells/{spell-name}/` with:
- `package.json` (minimal, shared deps with registry)
- `tsconfig.json` (path aliases pointing to registry)
- `next.config.js` (minimal Next.js config)
- `src/pages/index.tsx` (home page)
- `src/pages/{page-name}.tsx` for each requested page
- `README.md` (auto-generated description)

### Step 3: Generate Page Content

For each page:
- Import `LumosLayout` and essential primitives (`PageHeader`, `LumosButton`, `LumosCard`)
- Create a basic page structure with the spell name and page title
- Use Lumos design tokens (Tailwind semantic classes: `bg-primary`, `text-muted-foreground`, etc.)

Example generated page:

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

Spells are independent but co-located:

- **Registry build** (`pnpm build`) generates components, blocks, themes as usual. No impact on spells.
- **Spell build** (`cd spells/{spell-name} && pnpm build`) generates a Next.js build that statically imports registry components.
- **Testing**: Both registry and spell builds must pass independently.

A spell can be:
- Developed locally: `pnpm dev`
- Built as a static export: `pnpm build && pnpm start`
- Deployed standalone if needed (not required for MVP)

## Success Criteria

A spell is "complete" when:
- All page files render without errors
- Registry component imports resolve correctly
- Design tokens (Tailwind classes) apply visually
- `pnpm build` succeeds (no TypeScript or bundling errors)
- Pages are editable by users (boilerplate is clear)

## Testing Strategy

- **Registry tests** run on any code change in `src/`
- **Spell tests** run on code changes in `spells/`
- New spells are tested by:
  1. Running `pnpm build` in the spell folder (validates TypeScript + imports)
  2. Running `pnpm dev` locally and checking pages render
  3. Verifying design tokens apply (colors, spacing, typography)

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
