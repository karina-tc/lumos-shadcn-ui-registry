#!/bin/bash

# Create a new Lumos spell route in the registry

if [ -z "$1" ]; then
  echo "Usage: ./scripts/create-spell.sh <spell-name>"
  echo ""
  echo "Example: ./scripts/create-spell.sh my-dashboard"
  exit 1
fi

SPELL_NAME=$1
SPELL_DIR="src/app/spells/$SPELL_NAME"

# Get GitHub username from remote
GITHUB_URL=$(git config --get remote.origin.url)
GITHUB_USERNAME=$(echo "$GITHUB_URL" | sed -E 's|.*[:/]([^/]+)/.*|\1|')

BRANCH_NAME="$GITHUB_USERNAME/$SPELL_NAME"

# Check if spell already exists
if [ -d "$SPELL_DIR" ]; then
  echo "❌ Spell '$SPELL_NAME' already exists at $SPELL_DIR"
  exit 1
fi

# Check if branch already exists
if git rev-parse --verify "$BRANCH_NAME" > /dev/null 2>&1; then
  echo "❌ Branch '$BRANCH_NAME' already exists"
  exit 1
fi

echo "🪄 Creating new spell: $SPELL_NAME..."
echo ""

# Create and checkout branch
echo "🌿 Creating branch: $BRANCH_NAME..."
git checkout -b "$BRANCH_NAME"

# Create spell directory
mkdir -p "$SPELL_DIR"

# Create spell page with blank template
cat > "$SPELL_DIR/page.tsx" << 'EOF'
import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';

export default function SpellPage() {
  return (
    <LumosLayout>
      <div className="p-6">
        <PageHeader
          title="Your Magic Awaits..."
          description="Build your spell here"
        />
      </div>
    </LumosLayout>
  );
}
EOF

# Create CLAUDE.md to guide spell development workflow
cat > "$SPELL_DIR/CLAUDE.md" << 'EOF'
# Spell Development Workflow

## When you're ready to build:

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

## Available

All Lumos components available via `@/components/*`:
- `LumosLayout` — full app shell with header + sidebar
- `PageHeader` — page title + description
- `LumosButton`, `LumosCard`, `LumosBadge` — UI components
- shadcn/ui primitives via `@/components/ui/*`

## Page location

Edit: `src/app/spells/$SPELL_NAME/page.tsx`

Refresh localhost:3000/spells/$SPELL_NAME to see changes.
EOF

echo ""
echo "✅ Spell '$SPELL_NAME' created successfully!"
echo ""
echo "Branch: $BRANCH_NAME"
echo "Location: $SPELL_DIR/page.tsx"
echo ""
echo "Registry is already running on localhost:3000"
echo "Open the spell at: localhost:3000/spells/$SPELL_NAME"
echo ""
echo "Then open the registry directory in Claude Code and ask it to help build your spell!"
