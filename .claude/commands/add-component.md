Add a new Lumos component to the registry.

Ask the user for:
1. **Component name** (kebab-case, e.g., `status-indicator`)
2. **Description** (one sentence)
3. **Which shadcn primitives it builds on** (if any — e.g., badge, button, dialog)

Then do the following steps:

## 1. Create the component file

Create `src/components/{name}.tsx`.

Follow existing patterns:
- Use `"use client"` only if the component has state or event handlers
- Import from `@/components/ui/` for shadcn primitives
- Import `cn` from `@/lib/utils` if combining class names
- Use Lumos semantic tokens (`bg-primary`, `text-muted-foreground`, `border-border`) — never raw CSS variables
- Export a named function component (not default export)
- Define a Props interface

## 2. Create the demo file

Create `src/app/demo/[name]/components/{name}.tsx`.

The demo file should export an object matching this shape:
```ts
export const componentName = {
  name: "{name}",
  components: {
    default: <YourComponent />,
    // optional: variant showcases
  },
};
```

Show the component in a realistic context with sample data. Look at existing demo files in `src/app/demo/[name]/components/` for examples.

## 3. Add to demo index

Edit `src/app/demo/[name]/index.tsx`:
- Add an import for the new demo
- Add it to the `demos` object with the key matching the registry name

## 4. Add to registry.json

Add an entry to the `items` array in `registry.json`:
```json
{
  "name": "{name}",
  "type": "registry:component",
  "title": "{Title Case Name}",
  "description": "{description}",
  "registryDependencies": [
    // shadcn primitives used (just the name, e.g., "badge")
    // Lumos registry deps use full URL: "https://lumos-shadcn-ui-registry.vercel.app/r/{dep}.json"
  ],
  "files": [
    {
      "path": "src/components/{name}.tsx",
      "type": "registry:component"
    }
  ]
}
```

If the component depends on other Lumos components (e.g., `lumos-button`), add them as full URL registryDependencies.

## 5. Verify

Run `pnpm build` and confirm:
- No build errors
- The new component appears in `public/r/{name}.json`
- The demo page renders (check `pnpm dev` if possible)

Report what was created and any issues.
