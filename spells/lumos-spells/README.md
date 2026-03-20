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
