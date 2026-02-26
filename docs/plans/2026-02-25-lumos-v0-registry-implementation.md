# Lumos V0 Registry Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the lumos-shadcn-ui-registry content (tokens, fonts, layout components, nav blocks, 3 key components) so that V0 prototypes immediately look like the production Lumos app.

**Architecture:** Keep the existing Next.js 15 + shadcn registry infrastructure. Tear out all design content (globals.css, custom components, blocks) and rebuild from the production app's token system at `/Users/karina.tovar/Desktop/lumos/frontend/src/index.css`. Add Roobert font, accurate semantic tokens, and one layout block per admin nav section captured via Playwright on localhost:3000.

**Tech Stack:** Next.js 15, Tailwind CSS v4 (CSS-first config), shadcn/ui registry system, Roobert font (woff2), Playwright MCP for nav crawl

---

## Task 1: Rebuild globals.css with the full Lumos token system

**Files:**
- Modify: `src/app/globals.css` (full replacement)

This is the most important task. The file has three sections:
1. Tailwind imports + font-face declarations
2. `:root` with ALL Lumos primitive + semantic CSS vars (light mode only)
3. `@theme inline {}` mapping everything to Tailwind utility classes

**Step 1: Replace globals.css entirely**

```css
@import "tailwindcss";
@import "tw-animate-css";

/* ─── Roobert font ─────────────────────────────────────────────── */
@font-face {
  font-family: "Roobert";
  font-weight: 400;
  font-style: normal;
  src: url("/fonts/Roobert-Regular.woff2") format("woff2");
}
@font-face {
  font-family: "Roobert";
  font-weight: 400;
  font-style: italic;
  src: url("/fonts/Roobert-RegularItalic.woff2") format("woff2");
}
@font-face {
  font-family: "Roobert";
  font-weight: 500;
  font-style: normal;
  src: url("/fonts/Roobert-Medium.woff2") format("woff2");
}
@font-face {
  font-family: "Roobert";
  font-weight: 500;
  font-style: italic;
  src: url("/fonts/Roobert-MediumItalic.woff2") format("woff2");
}
@font-face {
  font-family: "Roobert";
  font-weight: 700;
  font-style: normal;
  src: url("/fonts/Roobert-Bold.woff2") format("woff2");
}
@font-face {
  font-family: "Roobert";
  font-weight: 700;
  font-style: italic;
  src: url("/fonts/Roobert-BoldItalic.woff2") format("woff2");
}

/* ─── Lumos primitive tokens ───────────────────────────────────── */
:root {
  /* Neutral */
  --neutral-50: 0 0% 100%;
  --neutral-100: 210 13% 97%;
  --neutral-150: 210 14% 95%;
  --neutral-200: 220 13% 91%;
  --neutral-250: 222 15% 87%;
  --neutral-300: 222 15% 83%;
  --neutral-400: 222 15% 74%;
  --neutral-500: 225 15% 54%;
  --neutral-600: 225 20% 42%;
  --neutral-700: 225 20% 35%;
  --neutral-800: 225 20% 27%;
  --neutral-900: 223 21% 20%;
  --neutral-1000: 225 18% 4%;

  /* Blue */
  --blue-100: 215 100% 95%;
  --blue-200: 216 100% 90%;
  --blue-300: 215 100% 80%;
  --blue-400: 215 100% 65%;
  --blue-500: 215 90% 47%;
  --blue-600: 215 90% 38%;
  --blue-700: 215 86% 30%;
  --blue-800: 216 84% 20%;
  --blue-900: 215 84% 10%;

  /* Green */
  --green-50: 149 76% 94%;
  --green-100: 149 76% 90%;
  --green-200: 155 65% 80%;
  --green-300: 155 60% 60%;
  --green-400: 155 60% 45%;
  --green-500: 155 60% 35%;
  --green-600: 155 61% 25%;
  --green-700: 155 61% 15%;
  --green-800: 155 70% 12%;
  --green-900: 156 77% 7%;

  /* Lemon */
  --lemon-100: 84 88% 90%;
  --lemon-200: 84 61% 80%;
  --lemon-300: 84 50% 55%;
  --lemon-400: 84 60% 40%;
  --lemon-500: 85 56% 30%;
  --lemon-600: 84 50% 25%;
  --lemon-700: 85 45% 20%;
  --lemon-800: 84 35% 15%;
  --lemon-900: 84 29% 10%;

  /* Orange */
  --orange-100: 19 100% 96%;
  --orange-200: 20 100% 87%;
  --orange-300: 20 100% 79%;
  --orange-400: 20 100% 63%;
  --orange-500: 20 99% 55%;
  --orange-600: 20 99% 40%;
  --orange-700: 20 95% 25%;
  --orange-800: 20 80% 16%;
  --orange-900: 14 76% 10%;

  /* Purple */
  --purple-100: 252 100% 96%;
  --purple-200: 251 90% 92%;
  --purple-300: 250 84% 85%;
  --purple-400: 249 70% 73%;
  --purple-500: 250 50% 60%;
  --purple-600: 250 50% 50%;
  --purple-700: 250 60% 35%;
  --purple-800: 250 61% 23%;
  --purple-900: 250 65% 16%;

  /* Red */
  --red-100: 0 88% 97%;
  --red-200: 0 85% 87%;
  --red-300: 0 75% 80%;
  --red-400: 0 70% 66%;
  --red-500: 0 65% 50%;
  --red-600: 0 70% 40%;
  --red-700: 0 75% 25%;
  --red-800: 0 75% 17%;
  --red-900: 5 76% 10%;

  /* Teal */
  --teal-100: 195 100% 95%;
  --teal-200: 196 88% 90%;
  --teal-300: 195 70% 75%;
  --teal-400: 195 55% 50%;
  --teal-500: 195 65% 40%;
  --teal-600: 196 84% 25%;
  --teal-700: 195 76% 18%;
  --teal-800: 197 74% 12%;
  --teal-900: 196 80% 8%;

  /* Yellow */
  --yellow-100: 50 94% 94%;
  --yellow-200: 48 84% 80%;
  --yellow-300: 46 85% 68%;
  --yellow-400: 47 85% 48%;
  --yellow-500: 47 90% 39%;
  --yellow-600: 47 95% 29%;
  --yellow-700: 47 84% 20%;
  --yellow-800: 47 91% 13%;
  --yellow-900: 47 89% 7%;

  /* Pink */
  --pink-100: 322 100% 96%;
  --pink-200: 323 92% 90%;
  --pink-300: 323 84% 80%;
  --pink-400: 323 65% 65%;
  --pink-500: 322 55% 55%;
  --pink-600: 324 65% 38%;
  --pink-700: 324 65% 25%;
  --pink-800: 324 65% 18%;
  --pink-900: 325 64% 12%;

  --ai-pink: 322 92% 61%;

  /* ─── Semantic tokens (light mode) ─────────────────────────── */
  --background-container-primary: var(--neutral-50);
  --background-container-secondary: var(--neutral-100);
  --background-container-tertiary: var(--neutral-150);
  --background-container-accent: var(--orange-100);
  --background-container-danger: var(--red-100);
  --background-container-success: var(--green-50);
  --background-container-warning: var(--yellow-100);
  --background-container-ai: var(--ai-pink);

  --background-action-primary: var(--orange-500);
  --background-action-primary-hover: var(--orange-600);
  --background-action-primary-pressed: var(--orange-700);
  --background-action-secondary: var(--neutral-100);
  --background-action-secondary-hover: var(--neutral-200);
  --background-action-secondary-pressed: var(--neutral-250);
  --background-action-danger: var(--red-100);
  --background-action-danger-hover: var(--red-200);
  --background-action-danger-pressed: var(--red-300);
  --background-action-success: var(--green-100);
  --background-action-success-hover: var(--green-200);
  --background-action-success-pressed: var(--green-300);
  --background-action-accent: var(--orange-100);
  --background-action-accent-hover: var(--orange-200);
  --background-action-accent-pressed: var(--orange-300);
  --background-action-unselected: var(--neutral-400);

  --background-data-blue: var(--blue-100);
  --background-data-purple: var(--purple-100);
  --background-data-pink: var(--pink-100);
  --background-data-teal: var(--teal-100);
  --background-data-lemon: var(--lemon-100);
  --background-data-blue-hover: var(--blue-200);
  --background-data-purple-hover: var(--purple-200);
  --background-data-pink-hover: var(--pink-200);
  --background-data-teal-hover: var(--teal-200);
  --background-data-lemon-hover: var(--lemon-200);

  --foreground-primary: var(--neutral-900);
  --foreground-inverse: var(--neutral-50);
  --foreground-secondary: var(--neutral-600);
  --foreground-tertiary: var(--neutral-500);
  --foreground-accent: var(--orange-600);
  --foreground-danger: var(--red-600);
  --foreground-success: var(--green-700);
  --foreground-warning: var(--yellow-700);
  --foreground-ai: var(--ai-pink);
  --foreground-data-blue: var(--blue-600);
  --foreground-data-purple: var(--purple-600);
  --foreground-data-pink: var(--pink-600);
  --foreground-data-teal: var(--teal-600);
  --foreground-data-lemon: var(--lemon-600);
  --foreground-art-success: var(--green-500);
  --foreground-art-danger: var(--red-500);
  --foreground-art-warning: var(--yellow-500);
  --foreground-art-neutral: var(--neutral-500);
  --foreground-art-information: var(--blue-500);

  --border-primary: var(--neutral-200);
  --border-primary-inputs: var(--neutral-250);
  --border-secondary: var(--neutral-150);
  --border-danger: var(--red-500);
  --border-success: var(--green-500);
  --border-warning: var(--yellow-500);
  --border-accent: var(--orange-500);
  --border-active: var(--orange-500);
  --border-ai: var(--ai-pink);
  --border-data-blue: var(--blue-500);
  --border-data-purple: var(--purple-500);
  --border-data-pink: var(--pink-500);
  --border-data-teal: var(--teal-500);
  --border-data-lemon: var(--lemon-500);

  --outline-default: var(--orange-500);
  --outline-inverse: var(--neutral-900);

  /* ─── shadcn bridge aliases ─────────────────────────────────── */
  /* These make V0-generated components automatically use Lumos colors */
  --background: var(--neutral-50);
  --foreground: var(--neutral-900);
  --card: var(--neutral-50);
  --card-foreground: var(--neutral-900);
  --popover: var(--neutral-50);
  --popover-foreground: var(--neutral-900);
  --primary: var(--orange-500);
  --primary-foreground: var(--neutral-50);
  --secondary: var(--neutral-100);
  --secondary-foreground: var(--neutral-900);
  --muted: var(--neutral-150);
  --muted-foreground: var(--neutral-600);
  --accent: var(--orange-100);
  --accent-foreground: var(--orange-600);
  --destructive: var(--red-500);
  --destructive-foreground: var(--neutral-50);
  --border: var(--neutral-200);
  --input: var(--neutral-250);
  --ring: var(--orange-500);
  --radius: 0.5rem;

  /* Chart colors mapped to Lumos data palette */
  --chart-1: var(--blue-500);
  --chart-2: var(--purple-500);
  --chart-3: var(--pink-500);
  --chart-4: var(--teal-500);
  --chart-5: var(--lemon-300);

  /* Sidebar tokens */
  --sidebar: var(--neutral-100);
  --sidebar-foreground: var(--neutral-900);
  --sidebar-primary: var(--orange-500);
  --sidebar-primary-foreground: var(--neutral-50);
  --sidebar-accent: var(--orange-100);
  --sidebar-accent-foreground: var(--orange-600);
  --sidebar-border: var(--neutral-200);
  --sidebar-ring: var(--orange-500);
}

/* ─── Tailwind v4 theme mapping ─────────────────────────────────── */
/* Maps CSS vars to Tailwind utility classes */
@theme inline {
  /* shadcn standard */
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-chart-1: hsl(var(--chart-1));
  --color-chart-2: hsl(var(--chart-2));
  --color-chart-3: hsl(var(--chart-3));
  --color-chart-4: hsl(var(--chart-4));
  --color-chart-5: hsl(var(--chart-5));
  --color-sidebar: hsl(var(--sidebar));
  --color-sidebar-foreground: hsl(var(--sidebar-foreground));
  --color-sidebar-primary: hsl(var(--sidebar-primary));
  --color-sidebar-primary-foreground: hsl(var(--sidebar-primary-foreground));
  --color-sidebar-accent: hsl(var(--sidebar-accent));
  --color-sidebar-accent-foreground: hsl(var(--sidebar-accent-foreground));
  --color-sidebar-border: hsl(var(--sidebar-border));
  --color-sidebar-ring: hsl(var(--sidebar-ring));

  /* Lumos semantic — background */
  --color-background-container-primary: hsl(var(--background-container-primary));
  --color-background-container-secondary: hsl(var(--background-container-secondary));
  --color-background-container-tertiary: hsl(var(--background-container-tertiary));
  --color-background-container-accent: hsl(var(--background-container-accent));
  --color-background-container-danger: hsl(var(--background-container-danger));
  --color-background-container-success: hsl(var(--background-container-success));
  --color-background-container-warning: hsl(var(--background-container-warning));
  --color-background-action-primary: hsl(var(--background-action-primary));
  --color-background-action-primary-hover: hsl(var(--background-action-primary-hover));
  --color-background-action-primary-pressed: hsl(var(--background-action-primary-pressed));
  --color-background-action-secondary: hsl(var(--background-action-secondary));
  --color-background-action-secondary-hover: hsl(var(--background-action-secondary-hover));
  --color-background-action-secondary-pressed: hsl(var(--background-action-secondary-pressed));
  --color-background-action-danger: hsl(var(--background-action-danger));
  --color-background-action-danger-hover: hsl(var(--background-action-danger-hover));
  --color-background-action-accent: hsl(var(--background-action-accent));
  --color-background-action-accent-hover: hsl(var(--background-action-accent-hover));
  --color-background-data-blue: hsl(var(--background-data-blue));
  --color-background-data-purple: hsl(var(--background-data-purple));
  --color-background-data-pink: hsl(var(--background-data-pink));
  --color-background-data-teal: hsl(var(--background-data-teal));
  --color-background-data-lemon: hsl(var(--background-data-lemon));

  /* Lumos semantic — foreground */
  --color-foreground-primary: hsl(var(--foreground-primary));
  --color-foreground-inverse: hsl(var(--foreground-inverse));
  --color-foreground-secondary: hsl(var(--foreground-secondary));
  --color-foreground-tertiary: hsl(var(--foreground-tertiary));
  --color-foreground-accent: hsl(var(--foreground-accent));
  --color-foreground-danger: hsl(var(--foreground-danger));
  --color-foreground-success: hsl(var(--foreground-success));
  --color-foreground-warning: hsl(var(--foreground-warning));
  --color-foreground-ai: hsl(var(--foreground-ai));
  --color-foreground-data-blue: hsl(var(--foreground-data-blue));
  --color-foreground-data-purple: hsl(var(--foreground-data-purple));
  --color-foreground-data-pink: hsl(var(--foreground-data-pink));
  --color-foreground-data-teal: hsl(var(--foreground-data-teal));
  --color-foreground-data-lemon: hsl(var(--foreground-data-lemon));
  --color-foreground-art-success: hsl(var(--foreground-art-success));
  --color-foreground-art-danger: hsl(var(--foreground-art-danger));
  --color-foreground-art-warning: hsl(var(--foreground-art-warning));
  --color-foreground-art-neutral: hsl(var(--foreground-art-neutral));
  --color-foreground-art-information: hsl(var(--foreground-art-information));

  /* Lumos semantic — border */
  --color-border-primary: hsl(var(--border-primary));
  --color-border-primary-inputs: hsl(var(--border-primary-inputs));
  --color-border-secondary: hsl(var(--border-secondary));
  --color-border-danger: hsl(var(--border-danger));
  --color-border-success: hsl(var(--border-success));
  --color-border-warning: hsl(var(--border-warning));
  --color-border-accent: hsl(var(--border-accent));
  --color-border-active: hsl(var(--border-active));
  --color-border-data-blue: hsl(var(--border-data-blue));
  --color-border-data-purple: hsl(var(--border-data-purple));
  --color-border-data-pink: hsl(var(--border-data-pink));
  --color-border-data-teal: hsl(var(--border-data-teal));
  --color-border-data-lemon: hsl(var(--border-data-lemon));

  /* Lumos semantic — outline */
  --color-outline-default: hsl(var(--outline-default));
  --color-outline-inverse: hsl(var(--outline-inverse));

  /* Typography */
  --font-sans: "Roobert", system-ui, sans-serif;

  /* Radius */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-border, currentColor);
  }
  body {
    font-family: "Roobert", system-ui, sans-serif;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
}
```

**Step 2: Verify the dev server starts without CSS errors**

```bash
cd /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry
pnpm dev
```

Expected: Server starts on port 3001 (or next available). No PostCSS errors in terminal. Open http://localhost:3001 — the registry UI should render with Roobert font and orange primary color.

If you see "Cannot find module" for tw-animate-css, run: `pnpm add tw-animate-css`

**Step 3: Commit**

```bash
cd /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry
git add src/app/globals.css
git commit -m "tokens: rebuild globals.css with full Lumos token system (light mode)"
```

---

## Task 2: Copy Roobert font files

**Files:**
- Create: `public/fonts/Roobert-Regular.woff2` (copy from lumos repo)
- Create: `public/fonts/Roobert-RegularItalic.woff2`
- Create: `public/fonts/Roobert-Medium.woff2`
- Create: `public/fonts/Roobert-MediumItalic.woff2`
- Create: `public/fonts/Roobert-Bold.woff2`
- Create: `public/fonts/Roobert-BoldItalic.woff2`

**Step 1: Create the fonts directory and copy files**

```bash
mkdir -p /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry/public/fonts

cp /Users/karina.tovar/Desktop/lumos/frontend/src/assets/fonts/Roobert-Regular.woff2 \
   /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry/public/fonts/

cp /Users/karina.tovar/Desktop/lumos/frontend/src/assets/fonts/Roobert-RegularItalic.woff2 \
   /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry/public/fonts/

cp /Users/karina.tovar/Desktop/lumos/frontend/src/assets/fonts/Roobert-Medium.woff2 \
   /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry/public/fonts/

cp /Users/karina.tovar/Desktop/lumos/frontend/src/assets/fonts/Roobert-MediumItalic.woff2 \
   /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry/public/fonts/

cp /Users/karina.tovar/Desktop/lumos/frontend/src/assets/fonts/Roobert-Bold.woff2 \
   /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry/public/fonts/

cp /Users/karina.tovar/Desktop/lumos/frontend/src/assets/fonts/Roobert-BoldItalic.woff2 \
   /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry/public/fonts/
```

**Step 2: Verify fonts load**

Open http://localhost:3001 in a browser. The text should render in Roobert (rounded, slightly geometric letterforms). Compare to the production app at localhost:3000 — the font should match.

**Step 3: Commit**

```bash
cd /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry
git add public/fonts/
git commit -m "typography: add Roobert font files to public/fonts"
```

---

## Task 3: Update registry.json theme entry with accurate token values

The `registry.json` theme entry `cssVars.light` is what gets injected when someone installs the theme via V0. Update it to use the precise Lumos values.

**Files:**
- Modify: `registry.json` — the first item in the `items` array (the `"name": "theme"` entry)

**Step 1: Replace the cssVars.light section**

Find the `"name": "theme"` entry. Replace the `"cssVars"` object with:

```json
"cssVars": {
  "light": {
    "background": "0 0% 100%",
    "foreground": "223 21% 20%",
    "card": "0 0% 100%",
    "card-foreground": "223 21% 20%",
    "popover": "0 0% 100%",
    "popover-foreground": "223 21% 20%",
    "primary": "20 99% 55%",
    "primary-foreground": "0 0% 100%",
    "secondary": "210 13% 97%",
    "secondary-foreground": "223 21% 20%",
    "muted": "210 14% 95%",
    "muted-foreground": "225 20% 42%",
    "accent": "19 100% 96%",
    "accent-foreground": "20 99% 40%",
    "destructive": "0 65% 50%",
    "destructive-foreground": "0 0% 100%",
    "border": "220 13% 91%",
    "input": "222 15% 87%",
    "ring": "20 99% 55%",
    "chart-1": "215 90% 47%",
    "chart-2": "250 50% 60%",
    "chart-3": "322 55% 55%",
    "chart-4": "195 65% 40%",
    "chart-5": "84 50% 55%",
    "sidebar": "210 13% 97%",
    "sidebar-foreground": "223 21% 20%",
    "sidebar-primary": "20 99% 55%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-accent": "19 100% 96%",
    "sidebar-accent-foreground": "20 99% 40%",
    "sidebar-border": "220 13% 91%",
    "sidebar-ring": "20 99% 55%",
    "radius": "0.5rem"
  }
}
```

Also update the theme title and description:
```json
"title": "Lumos Design System",
"description": "Lumos production design tokens — light mode. Orange primary, Roobert font, full semantic color system."
```

Remove the `"dark"` key entirely from `cssVars` (dark mode is out of scope).

**Step 2: Rebuild the registry**

```bash
cd /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry
pnpm registry:build
```

Expected: Runs without errors. The `/r/theme.json` route should now serve the updated token values.

**Step 3: Commit**

```bash
git add registry.json
git commit -m "tokens: update registry.json theme entry with accurate Lumos production values"
```

---

## Task 4: Replace brand-header with accurate Lumos header

The existing `brand-header.tsx` is generic. Replace it with a component that matches the production PageHeader pattern: flex row, border-bottom, logo left, breadcrumb/title center-left, actions right.

**Files:**
- Modify: `src/components/brand-header.tsx` (full replacement)

**Step 1: Replace brand-header.tsx**

```tsx
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface LumosHeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

export function BrandHeader({ title, actions }: LumosHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 w-full">
      <SidebarTrigger className="-ml-1 text-foreground-secondary hover:text-foreground-primary" />
      <Separator orientation="vertical" className="h-4" />
      {title && (
        <h1 className="text-sm font-medium text-foreground-primary">{title}</h1>
      )}
      {actions && (
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
```

**Step 2: Verify**

With `pnpm dev` running, open http://localhost:3001/demo/dashboard. The header should show a sidebar toggle and a clean border-bottom. Colors should be neutral, not generic blue/gray.

**Step 3: Commit**

```bash
git add src/components/brand-header.tsx
git commit -m "layout: replace brand-header with accurate Lumos header pattern"
```

---

## Task 5: Replace brand-sidebar with accurate Lumos sidebar

The existing `brand-sidebar.tsx` is generic. Replace with one that matches the production 256px sidebar: logo area top, nav links with active state, footer section.

**Files:**
- Modify: `src/components/brand-sidebar.tsx` (full replacement)

**Step 1: Replace brand-sidebar.tsx**

```tsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Placeholder nav items — replace with real nav in each block
interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BrandSidebarProps {
  navItems?: NavItem[];
  footerItems?: NavItem[];
}

const defaultNav: NavItem[] = [
  { label: "Home", href: "#" },
  { label: "Apps", href: "#" },
  { label: "Users", href: "#" },
  { label: "Groups", href: "#" },
  { label: "Requests", href: "#", active: true },
  { label: "Policies", href: "#" },
];

export function BrandSidebar({
  navItems = defaultNav,
  footerItems = [],
}: BrandSidebarProps) {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar w-64">
      <SidebarHeader className="px-4 py-3">
        {/* Lumos wordmark placeholder */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-sm bg-primary" />
          <span className="text-sm font-semibold text-sidebar-foreground">Lumos</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    className="text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  >
                    <a href={item.href}>{item.label}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {footerItems.length > 0 && (
        <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
          <SidebarMenu>
            {footerItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild className="text-sm text-sidebar-foreground">
                  <a href={item.href}>{item.label}</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
```

**Step 2: Update shell-layout.tsx to use the components correctly**

Open `src/app/demo/[name]/blocks/shell-layout.tsx`. It should already import BrandHeader and BrandSidebar correctly. Verify the layout wraps children properly:

```tsx
import React, { type ReactNode } from "react";
import { BrandHeader } from "@/components/brand-header";
import { BrandSidebar } from "@/components/brand-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>      <SidebarInset>
        <BrandHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 bg-background-container-secondary min-h-screen">
          <BrandSidebar />
          <div class="flex-1">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

**Step 3: Verify visually**

Open http://localhost:3001/demo/dashboard. You should see:
- A 256px sidebar on the left with Lumos orange accent on active items
- A slim header bar at top with sidebar toggle
- A slightly gray content area (`--neutral-100` background)

**Step 4: Commit**

```bash
git add src/components/brand-sidebar.tsx src/app/demo/[name]/blocks/shell-layout.tsx
git commit -m "layout: replace brand-sidebar with accurate Lumos sidebar pattern"
```

---

## Task 6: Remove old wrong custom components from registry.json

The old components (login, logo, hero, promo, product-grid) are wrong domain. Remove them from registry.json and delete the files.

**Files:**
- Modify: `registry.json` — remove entries for: login, logo, hero, promo, product-grid
- Delete: `src/components/login.tsx`, `src/components/logo.tsx`, `src/components/hero.tsx`, `src/components/promo.tsx`, `src/components/product-grid.tsx`

**Step 1: Delete component files**

```bash
cd /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry
rm src/components/login.tsx
rm src/components/logo.tsx
rm src/components/hero.tsx
rm src/components/promo.tsx
rm src/components/product-grid.tsx
```

**Step 2: Remove their registry.json entries**

In `registry.json`, find and delete the entire objects for:
- `"name": "login"`
- `"name": "logo"`
- `"name": "hero"`
- `"name": "promo"`
- `"name": "product-grid"`

Also update the `blank`, `dashboard`, and `store` block entries — remove any `registryDependencies` that reference the deleted components.

**Step 3: Remove the store block** (it's a product store, not a Lumos pattern)

Delete the `"name": "store"` block entry from registry.json and its files:
```bash
rm src/app/demo/[name]/blocks/store.tsx
rm src/app/demo/[name]/blocks/store-page.tsx
```

**Step 4: Rebuild registry**

```bash
pnpm registry:build
```

Expected: No errors. The removed components should no longer appear at `/r/*.json`.

**Step 5: Commit**

```bash
git add -u
git add registry.json
git commit -m "cleanup: remove wrong custom components (login, logo, hero, promo, product-grid, store)"
```

---

## Task 7: Playwright nav crawl — enumerate all admin sections

Use Playwright MCP to navigate localhost:3000 (must be logged in) and document all nav sections to build blocks from.

**Step 1: Navigate to the app and take a full screenshot of the sidebar**

Using Playwright MCP tools:
1. Navigate to `http://localhost:3000`
2. Wait for the app to fully load (no more "Loading..." heading)
3. Take a screenshot of the full sidebar
4. Take an accessibility snapshot to get all nav link labels and hrefs

**Step 2: Document every nav item**

For each nav item visible in the sidebar:
- Note the label (e.g. "Access Requests")
- Note the URL path (e.g. `/access-requests`)
- Navigate to it
- Take a screenshot
- Note the layout pattern: does it have a table? card grid? form? header with filters?

**Step 3: Create a nav inventory file**

Save findings to `docs/nav-inventory.md`:

```markdown
# Lumos Admin Nav Inventory
Date: 2026-02-25

| Section | URL Path | Layout Pattern | Notes |
|---------|----------|----------------|-------|
| ...     | ...      | ...            | ...   |
```

**Step 4: Commit the inventory**

```bash
git add docs/nav-inventory.md
git commit -m "docs: add nav inventory from Playwright crawl"
```

---

## Task 8: Build layout blocks (one per nav section)

Repeat this task for EACH section in the nav inventory from Task 7.

The pattern for each block:

### Sub-task: Create [Section Name] block

**Files:**
- Create: `src/app/demo/[name]/blocks/lumos-[section]-index.tsx`
- Modify: `registry.json` — add block entry

**Step 1: Create the page component**

Examine the screenshot from Task 7 for this section. Build a faithful HTML structure using only Tailwind utility classes and shadcn primitives. Use realistic fake data (real-looking names, dates, status values).

Template for a table-based index page:

```tsx
export default function LumosAccessRequestsIndex() {
  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Access Requests</h1>
          <p className="text-sm text-muted-foreground">
            Manage and review access requests from your team
          </p>
        </div>
        <button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          New Request
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <input
          placeholder="Search requests..."
          className="h-8 w-64 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
          Status
        </button>
        <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
          Requester
        </button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Requester</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">App</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Requested</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Sarah Chen", app: "Salesforce", date: "Feb 24, 2026", status: "Pending", statusColor: "bg-yellow-100 text-yellow-700" },
              { name: "Marcus Williams", app: "GitHub", date: "Feb 23, 2026", status: "Approved", statusColor: "bg-green-100 text-green-700" },
              { name: "Priya Patel", app: "Figma", date: "Feb 22, 2026", status: "Pending", statusColor: "bg-yellow-100 text-yellow-700" },
              { name: "Jordan Kim", app: "AWS", date: "Feb 21, 2026", status: "Rejected", statusColor: "bg-red-100 text-red-700" },
              { name: "Alex Rivera", app: "Jira", date: "Feb 20, 2026", status: "Approved", statusColor: "bg-green-100 text-green-700" },
            ].map((row) => (
              <tr key={row.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.app}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${row.statusColor}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-sm text-muted-foreground hover:text-foreground">Review →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

Adapt this template for each section based on the actual layout pattern (card grid, form, settings panel, etc.).

**Step 2: Add registry.json block entry**

Add to the `items` array in `registry.json`:

```json
{
  "name": "lumos-[section]-index",
  "type": "registry:block",
  "title": "Lumos [Section Name]",
  "description": "Lumos [Section Name] index page with sidebar shell",
  "registryDependencies": [
    "https://lumos-shadcn-ui-registry.vercel.app/r/brand-header.json",
    "https://lumos-shadcn-ui-registry.vercel.app/r/brand-sidebar.json",
    "https://lumos-shadcn-ui-registry.vercel.app/r/theme.json"
  ],
  "files": [
    {
      "path": "src/app/demo/[name]/blocks/shell-layout.tsx",
      "type": "registry:file",
      "target": "app/layout.tsx"
    },
    {
      "path": "src/app/demo/[name]/blocks/lumos-[section]-index.tsx",
      "type": "registry:page",
      "target": "app/page.tsx"
    }
  ]
}
```

**Step 3: Rebuild registry and verify**

```bash
pnpm registry:build
```

Open http://localhost:3001/demo/lumos-[section]-index — verify the block renders with the correct shell and content.

**Step 4: Commit after every 2-3 blocks**

```bash
git add src/app/demo/[name]/blocks/lumos-*.tsx registry.json
git commit -m "blocks: add Lumos [section] index blocks"
```

---

## Task 9: Add lumos-button component

**Files:**
- Create: `src/components/lumos-button.tsx`
- Modify: `registry.json` — add component entry

**Step 1: Create lumos-button.tsx**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent px-4 py-1 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/85 active:bg-primary/70",
        secondary:
          "border-input bg-secondary text-foreground hover:bg-secondary/80 active:bg-secondary/60",
        danger:
          "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 active:bg-destructive/30",
        ghost:
          "bg-transparent text-foreground hover:bg-secondary active:bg-secondary/80",
        accent:
          "border-border-accent bg-accent text-accent-foreground hover:bg-accent/80",
      },
      size: {
        md: "h-8 px-4 text-sm",
        sm: "h-6 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface LumosButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const LumosButton = React.forwardRef<HTMLButtonElement, LumosButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
LumosButton.displayName = "LumosButton";

export { LumosButton, buttonVariants };
```

**Step 2: Add registry.json entry**

```json
{
  "name": "lumos-button",
  "type": "registry:component",
  "title": "Lumos Button",
  "description": "Lumos button with orange primary, rounded-full shape, and semantic variants",
  "dependencies": ["class-variance-authority"],
  "files": [
    {
      "path": "src/components/lumos-button.tsx",
      "type": "registry:component"
    }
  ]
}
```

**Step 3: Verify**

Open http://localhost:3001/registry/lumos-button — should show the component preview.

**Step 4: Commit**

```bash
git add src/components/lumos-button.tsx registry.json
git commit -m "component: add lumos-button with orange primary and rounded-full shape"
```

---

## Task 10: Add lumos-badge component

**Files:**
- Create: `src/components/lumos-badge.tsx`
- Modify: `registry.json` — add component entry

**Step 1: Create lumos-badge.tsx**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default:   "bg-secondary text-foreground",
        blue:      "bg-[hsl(var(--background-data-blue))] text-[hsl(var(--foreground-data-blue))]",
        purple:    "bg-[hsl(var(--background-data-purple))] text-[hsl(var(--foreground-data-purple))]",
        pink:      "bg-[hsl(var(--background-data-pink))] text-[hsl(var(--foreground-data-pink))]",
        teal:      "bg-[hsl(var(--background-data-teal))] text-[hsl(var(--foreground-data-teal))]",
        lemon:     "bg-[hsl(var(--background-data-lemon))] text-[hsl(var(--foreground-data-lemon))]",
        orange:    "bg-accent text-accent-foreground",
        success:   "bg-[hsl(var(--background-container-success))] text-[hsl(var(--foreground-success))]",
        danger:    "bg-[hsl(var(--background-container-danger))] text-[hsl(var(--foreground-danger))]",
        warning:   "bg-[hsl(var(--background-container-warning))] text-[hsl(var(--foreground-warning))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface LumosBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function LumosBadge({ className, variant, ...props }: LumosBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { LumosBadge, badgeVariants };
```

**Step 2: Add registry.json entry**

```json
{
  "name": "lumos-badge",
  "type": "registry:component",
  "title": "Lumos Badge",
  "description": "Status/data badge using the Lumos data color palette (blue, purple, pink, teal, lemon, orange, success, danger, warning)",
  "dependencies": ["class-variance-authority"],
  "files": [
    {
      "path": "src/components/lumos-badge.tsx",
      "type": "registry:component"
    }
  ]
}
```

**Step 3: Commit**

```bash
git add src/components/lumos-badge.tsx registry.json
git commit -m "component: add lumos-badge with full data color palette"
```

---

## Task 11: Add lumos-card component

**Files:**
- Create: `src/components/lumos-card.tsx`
- Modify: `registry.json` — add component entry

**Step 1: Create lumos-card.tsx**

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

// App tile card — matches production "apptile" shadow pattern
function LumosCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 transition-shadow",
        "shadow-[−6px_12px_32px_−6px_rgba(0,0,0,0.16)]",
        "hover:shadow-[−6px_12px_40px_−6px_rgba(0,0,0,0.24)]",
        className
      )}
      {...props}
    />
  );
}

function LumosCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 pb-3", className)} {...props} />;
}

function LumosCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm font-semibold text-foreground", className)} {...props} />;
}

function LumosCardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-muted-foreground", className)} {...props} />;
}

function LumosCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-0", className)} {...props} />;
}

export {
  LumosCard,
  LumosCardHeader,
  LumosCardTitle,
  LumosCardDescription,
  LumosCardContent,
};
```

**Step 2: Add registry.json entry**

```json
{
  "name": "lumos-card",
  "type": "registry:component",
  "title": "Lumos Card",
  "description": "App tile card with the Lumos apptile box shadow (used in app catalog, integrations, dashboards)",
  "files": [
    {
      "path": "src/components/lumos-card.tsx",
      "type": "registry:component"
    }
  ]
}
```

**Step 3: Commit**

```bash
git add src/components/lumos-card.tsx registry.json
git commit -m "component: add lumos-card with apptile shadow pattern"
```

---

## Task 12: Final registry build + smoke test

**Step 1: Run full registry build**

```bash
cd /Users/karina.tovar/Desktop/lumos-shadcn-ui-registry
pnpm registry:build
```

Expected: Exits 0. No errors.

**Step 2: Start dev server**

```bash
pnpm dev
```

**Step 3: Smoke test each block**

Open each of the following and verify they render correctly (no missing styles, correct font, correct colors):
- http://localhost:3001 (registry home)
- http://localhost:3001/demo/dashboard
- http://localhost:3001/demo/lumos-[first-section]-index
- http://localhost:3001/registry/lumos-button
- http://localhost:3001/registry/lumos-badge
- http://localhost:3001/registry/lumos-card

**Step 4: Verify font is Roobert**

In Chrome DevTools: Elements → select any text → Computed tab → font-family should show "Roobert".

**Step 5: Final commit**

```bash
git add .
git commit -m "registry: final build verification — all blocks and components building cleanly"
```

---

## Reference: Key file locations

| What | Path |
|------|------|
| CSS tokens | `src/app/globals.css` |
| Roobert fonts | `public/fonts/*.woff2` |
| Registry manifest | `registry.json` |
| Shell layout | `src/app/demo/[name]/blocks/shell-layout.tsx` |
| Sidebar component | `src/components/brand-sidebar.tsx` |
| Header component | `src/components/brand-header.tsx` |
| Block pages | `src/app/demo/[name]/blocks/lumos-*.tsx` |
| Custom components | `src/components/lumos-*.tsx` |
| Production tokens source | `/Users/karina.tovar/Desktop/lumos/frontend/src/index.css` |
| Production button source | `/Users/karina.tovar/Desktop/lumos/frontend/src/designSystem/ui/form/Button/Button.tsx` |

## Notes for the implementer

- The registry dev server runs on a different port than localhost:3000 (Lumos prod app). Keep both running simultaneously so you can compare visually.
- Tailwind v4 uses CSS-first config — there is no `tailwind.config.ts`. All theme customization happens in `globals.css` via `@theme inline {}`.
- When adding new blocks, the `"path"` in registry.json files must match the actual file path in the repo. The `"target"` is where it gets installed in the consumer's project.
- `pnpm registry:build` must be run after any change to `registry.json` or component files for the `/r/*.json` routes to update.
- Do not add Co-Authored-By to commit messages (per Lumos CLAUDE.md convention).
