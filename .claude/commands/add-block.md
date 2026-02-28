Add a new Lumos block (full page) to the registry.

Ask the user for:
1. **Block name** (e.g., `lumos-vendors-index`)
2. **Page title** (e.g., "Vendors")
3. **Description** (one sentence)
4. **Layout pattern** — one of:
   - **table** — PageHeader + optional PageTabs + filter bar + data table (most common)
   - **dashboard** — PageHeader + stat cards + charts + tables
   - **cards** — PageHeader + grouped card grid
   - **form** — PageHeader + vertical nav + form sections
   - **chat** — Centered input with suggestions
5. **Sidebar item name** (which nav item should be active, e.g., "Vendors")
6. **Route path** for the full-app (e.g., `/vendors`)

Then do the following steps:

## 1. Create the standalone block

Create `src/app/demo/[name]/blocks/{block-name}.tsx`.

Use `<LumosLayout>` as the outer wrapper with `title` and `activeItem` props. Use the appropriate layout pattern template:

### Table pattern
```tsx
import { LumosLayout } from "@/components/lumos-layout";
import { PageHeader } from "@/components/page-header";

export default function PageName() {
  const data = [/* sample rows */];

  return (
    <LumosLayout title="Page Title" activeItem="Sidebar Item">
      <main className="flex-1 overflow-auto bg-background p-6">
        <div className="flex flex-col gap-4">
          <PageHeader title="Page Title" actions={<><button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">Action</button></>} />
          {/* Filter bar */}
          <div className="flex items-center gap-2">
            <input placeholder="Search..." className="h-8 w-64 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          {/* Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">{/* thead + tbody */}</table>
          </div>
        </div>
      </main>
    </LumosLayout>
  );
}
```

For other patterns, refer to existing blocks:
- **dashboard**: `lumos-analytics-index.tsx`
- **cards**: `lumos-integrations-index.tsx`
- **form**: `lumos-settings-index.tsx`
- **chat**: `lumos-albus-index.tsx`

Include realistic sample data (6-8 rows for tables, 4-6 cards, etc.).

## 2. Create the content-only full-app page

Create `src/app/demo/[name]/blocks/full-app/{section}-page.tsx`.

This is the same content as step 1 but WITHOUT the `<LumosLayout>` wrapper. The shared layout handles the shell.

For table/dashboard/form/cards patterns, wrap content in `<main className="flex-1 overflow-auto bg-background p-6">`.
For chat patterns, use `<div className="flex h-full items-center justify-center p-5">`.

## 3. Add to demo index

Edit `src/app/demo/[name]/blocks/lumos-demos.ts` (or wherever standalone blocks are exported) to add the new block export.

Edit `src/app/demo/[name]/index.tsx` to import and register it in the `demos` object.

## 4. Add to registry.json

Add the standalone block entry:
```json
{
  "name": "{block-name}",
  "type": "registry:block",
  "title": "{Title}",
  "description": "{description}",
  "relatedComponents": ["brand-header", "brand-sidebar"],
  "registryDependencies": [
    "https://lumos-shadcn-ui-registry.vercel.app/r/theme.json",
    "https://lumos-shadcn-ui-registry.vercel.app/r/lumos-layout.json",
    "https://lumos-shadcn-ui-registry.vercel.app/r/page-header.json"
  ],
  "files": [
    { "path": "src/app/demo/[name]/blocks/{block-name}.tsx", "type": "registry:page", "target": "app/page.tsx" }
  ]
}
```

Add the full-app page file to the existing `lumos-full-app` block's `files` array:
```json
{ "path": "src/app/demo/[name]/blocks/full-app/{section}-page.tsx", "type": "registry:page", "target": "app/{route}/page.tsx" }
```

## 5. Update the full-app layout

Edit `src/app/demo/[name]/blocks/full-app/full-app-layout.tsx`:

1. Add to the `routes` array:
```ts
{ label: "{Sidebar Item}", href: "/{route}", title: "{Page Title}" },
```

2. Add to the appropriate section in `navSections` (Products, Inventory, or Workspace):
```ts
{ label: "{Sidebar Item}", href: "/{route}" },
```

## 6. Verify

Run `pnpm build` and confirm:
- No build errors
- `public/r/{block-name}.json` exists
- `public/r/lumos-full-app.json` includes the new page file
- The standalone demo renders correctly

Report what was created.
