# Spell Development Workflow

## ⚡ READ THIS FIRST

When you open this folder in Claude Code, follow these steps **exactly**:

1. **Ask clarifying questions** — understand what needs to be built
   - What is the main purpose?
   - Who is the user?
   - What are the key features?
   - Any constraints or preferences?

2. **Write a plan** — create `PLAN.md` in this directory with:
   - Goal and approach
   - File structure
   - Step-by-step implementation tasks
   - Testing strategy

3. **Execute the plan** — implement each task, test, commit

Do not skip to option selection. Do not mention other projects. Focus on **this spell only**.

---

## Available Components

All Lumos components available via `@/components/*`:
- `LumosLayout` — full app shell with header + sidebar
- `PageHeader` — page title + description
- `LumosButton`, `LumosCard`, `LumosBadge` — UI components
- shadcn/ui primitives via `@/components/ui/*`

## Page location

Edit: `src/app/spells/$SPELL_NAME/page.tsx`

Refresh localhost:3000/spells/$SPELL_NAME to see changes.
