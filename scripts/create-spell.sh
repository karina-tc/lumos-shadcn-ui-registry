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

# Check if spell already exists
if [ -d "$SPELL_DIR" ]; then
  echo "❌ Spell '$SPELL_NAME' already exists at $SPELL_DIR"
  exit 1
fi

echo "🪄 Creating new spell: $SPELL_NAME..."
echo ""

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
echo "To start building:"
echo "  cd $SPELL_DIR"
echo "  pnpm dev"
echo ""
echo "Then open localhost:3001 and ask Claude to help build your spell!"
