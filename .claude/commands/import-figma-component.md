Import a Figma component into the registry as a coded React component.

**Requires:** Figma MCP server (for reading design files) must be configured.

Ask the user for:
1. **Figma component URL or frame reference** (e.g., a Figma link to the component)
2. **Component name** (kebab-case, e.g., `status-card`)
3. **Description** (one sentence)

Then do the following:

## 1. Read the Figma component

Use the Figma MCP tools to inspect the component. Extract:
- **Variants** (e.g., Primary, Secondary, Danger)
- **Properties** (text props, boolean props, instance swap slots)
- **Auto layout** rules (direction, spacing, padding, alignment)
- **Fill and stroke** tokens (colors, borders)
- **Corner radius** values
- **Typography** (font size, weight, line height)
- **Child structure** (layers, nesting)

## 2. Map Figma properties to code

Use this translation guide to convert Figma design properties to Tailwind/React patterns:

### Layout
| Figma | Code |
|-------|------|
| Auto layout direction=vertical | `flex flex-col` |
| Auto layout direction=horizontal | `flex flex-row` |
| Auto layout spacing=N | `gap-{N/4}` (8→gap-2, 12→gap-3, 16→gap-4, 24→gap-6) |
| Auto layout padding=N | `p-{N/4}` (or px/py/pt/pr/pb/pl for asymmetric) |
| Auto layout align=center | `items-center` |
| Auto layout justify=space-between | `justify-between` |
| Hug contents | No explicit width/height |
| Fill container | `flex-1` or `w-full` |

### Colors (Lumos token mapping)
| Figma token | Tailwind class |
|-------------|---------------|
| background/primary or neutral-50 | `bg-background` |
| background/secondary or neutral-100 | `bg-secondary` |
| background/muted or neutral-150 | `bg-muted` |
| background/action/primary or orange-600 | `bg-primary` |
| background/accent or orange-100 | `bg-accent` |
| text/primary or neutral-900 | `text-foreground` |
| text/secondary or neutral-600 | `text-muted-foreground` |
| text/on-primary or white | `text-primary-foreground` |
| border/default or neutral-200 | `border-border` |
| status/success or green-* | `text-green-700 bg-green-100` |
| status/danger or red-* | `text-red-700 bg-red-100` |
| status/warning or orange-* | `text-orange-700 bg-orange-100` |
| status/info or blue-* | `text-blue-700 bg-blue-100` |

### Radius
| Figma | Code |
|-------|------|
| 4 | `rounded` |
| 6 | `rounded-md` |
| 8 | `rounded-lg` |
| 12 | `rounded-xl` |
| 9999 | `rounded-full` |

### Typography
| Figma | Code |
|-------|------|
| 12px | `text-xs` |
| 14px (Roobert) | `text-sm` |
| 16px | `text-base` |
| 18px | `text-lg` |
| 20px | `text-xl` |
| 24px | `text-2xl` |
| Regular weight | `font-normal` |
| Medium weight | `font-medium` |
| Semi Bold weight | `font-semibold` |
| Bold weight | `font-bold` |

### Component properties → React patterns
| Figma property type | React pattern |
|---------------------|--------------|
| Variant property | CVA variant (via class-variance-authority) |
| Boolean property | Optional boolean prop with conditional render |
| Text property | String prop |
| Instance swap | `ReactNode` prop (slot pattern) |
| Number property | Number prop |

## 3. Show the mapping plan

Before writing code, show the user the proposed mapping:
```
Figma "StatusCard" → <StatusCard />

Variants:
  - "Type: Info" → variant="info"
  - "Type: Warning" → variant="warning"
  - "Type: Error" → variant="error"

Props:
  - Text "Title" → title: string
  - Text "Description" → description: string
  - Boolean "Show Icon" → showIcon?: boolean
  - Instance "Action" → action?: ReactNode

Layout: flex flex-col gap-3 p-4
Border: rounded-lg border-border
Background: bg-card
```

Ask the user to confirm or adjust the mapping before proceeding.

## 4. Create the component

After approval, create the component following the same process as `/add-component`:

1. Create `src/components/{name}.tsx`
   - Use CVA for variants if the Figma component has variants
   - Use Lumos semantic tokens (never raw CSS variables)
   - Import from `@/components/ui/` for any shadcn primitives
   - Follow existing component patterns in the repo

2. Create the demo at `src/app/demo/[name]/components/{name}.tsx`

3. Add to demo index at `src/app/demo/[name]/index.tsx`

4. Add to `registry.json` with correct registryDependencies

## 5. Visual comparison

If Playwright MCP is available:
1. Run `pnpm dev` if not already running
2. Navigate to the demo page for the new component
3. Take a screenshot of the rendered component
4. Show the user the screenshot alongside the Figma original
5. Ask if adjustments are needed

If Playwright is not available, tell the user to compare manually by viewing the demo at `localhost:3000/demo/{name}`.

## 6. Verify

Run `pnpm build` and confirm:
- No build errors
- The component JSON is generated at `public/r/{name}.json`

Report:
- What was created (files, registry entry)
- Any Figma properties that couldn't be mapped cleanly
- Suggestions for manual refinement
