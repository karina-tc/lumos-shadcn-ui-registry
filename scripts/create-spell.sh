#!/bin/bash

# Create a new Lumos spell from the template

if [ -z "$1" ]; then
  echo "Usage: ./scripts/create-spell.sh <spell-name>"
  echo ""
  echo "Example: ./scripts/create-spell.sh my-dashboard"
  exit 1
fi

SPELL_NAME=$1
SPELL_DIR="spells/$SPELL_NAME"
BRANCH_NAME="spell/$SPELL_NAME"

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

# Copy template
cp -r spells/lumos-spells "$SPELL_DIR"

# Update package.json name
echo "📦 Updating package.json..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/@lumos\/spell-lumos-spells/@lumos\/spell-$SPELL_NAME/g" "$SPELL_DIR/package.json"
else
  # Linux
  sed -i "s/@lumos\/spell-lumos-spells/@lumos\/spell-$SPELL_NAME/g" "$SPELL_DIR/package.json"
fi

# Install dependencies
echo "📥 Installing dependencies..."
cd "$SPELL_DIR"
pnpm install

echo ""
echo "✅ Spell '$SPELL_NAME' created successfully!"
echo ""
echo "Branch: $BRANCH_NAME"
echo "Location: $SPELL_DIR"
echo ""
echo "To start building:"
echo "  cd $SPELL_DIR"
echo "  pnpm dev"
echo ""
echo "Then open localhost:3000 and ask Claude to help build your spell!"
