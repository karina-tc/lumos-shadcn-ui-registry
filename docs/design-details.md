# Lumos Design Details

Brand-aware guide for building Lumos interfaces. Always follow these rules.

## Do NOT Add Drop Shadows

Lumos uses the `shadow-app-tile` system for cards only. No other shadows. No depth effects without reason. If you're about to add `box-shadow`, stop and use the card system or don't add it.

## Typography

Always use **Roobert**. Never Inter, never system fonts.

| Role | HTML | Size | Weight | Tailwind Class |
|------|------|------|--------|----------------|
| Heading 1 | `<h1>` | 24px | 500 | `text-h1` |
| Heading 2 | `<h2>` | 18px | 500 | `text-h2` |
| Heading 3 | `<h3>` | 16px | 500 | `text-h3` |
| Body (normal) | `<p>` | 14px | 400 | `text-body-normal` |
| Body (medium) | `<p>` | 14px | 500 | `text-body-medium` |
| Body (bold) | `<p>` | 14px | 700 | `text-body-bold` |
| Caption | `<p>` | 12px | 400 | `text-subtext` |

**Always use semantic HTML for headings** — never `<div>` or `<span>` for heading-level text. The Tailwind class sets visual style; the element carries semantic meaning for screen readers and document outline.

```tsx
// ✅ Correct
<h1 className="text-h1">Page title</h1>
<h2 className="text-h2">Section heading</h2>
<p className="text-body-normal">Body copy</p>

// ❌ Wrong — loses semantic meaning
<div className="text-h1">Page title</div>
```

## Colors

Use **semantic token classes only** — never hard-code hex values or raw CSS variables.

| Use | Tailwind Class | Value |
|-----|----------------|-------|
| Primary action | `bg-primary` / `text-primary` | #FE5019 (orange) |
| Primary text | `text-foreground` | neutral-900 |
| Secondary text | `text-muted-foreground` | neutral-600 |
| Borders (dividers) | `border-border` | neutral-150 |
| Borders (errors) | `border-destructive` | red-500 |
| Backgrounds | `bg-background` | white |
| Nested backgrounds | `bg-secondary` | neutral-100 |

## Spacing

All spacing must be a multiple of **4px**. Use Tailwind `gap` on containers, never scattered `margin` on children.

| Context | Size | Tailwind | Use for |
|---------|------|----------|---------|
| Tight | 4–8px | `gap-1` – `gap-2` | Icon-to-label, badge padding |
| Small | 12–16px | `gap-3` – `gap-4` | Component padding, related fields |
| Medium | 20–24px | `gap-5` – `gap-6` | Button padding, card spacing |
| Large | 32–48px | `gap-8` – `gap-12` | Section spacing |
| XL | 64–80px | `gap-16` – `gap-20` | Page-level layout |

**Spacing as signal:** Tighter spacing = items belong together. Looser spacing = items are separate.

```tsx
// ✅ Tight gap signals icon and label are a unit
<div className="flex items-center gap-1.5">
  <Search size={16} />
  <span>Search</span>
</div>

// ✅ Larger gap separates distinct form fields
<div className="flex flex-col gap-4">
  <input />
  <input />
</div>
```

## Borders & Radius

Use the correct radius for each context:

| Context | Value | Tailwind |
|---------|-------|----------|
| Buttons | 999px | `rounded-full` |
| Inputs | 8px | `rounded-lg` |
| Cards, panels, modals | 12px | `rounded-xl` |
| Tooltips, small popovers | 6px | `rounded-md` |

**Nested radius rule:** When a rounded element sits inside another, the inner radius must be smaller.

Formula: `inner radius = outer radius − padding`

```tsx
// ✅ Outer card is rounded-xl (12px), inner content at rounded-lg (8px)
<div className="rounded-xl p-1">
  <div className="rounded-lg p-4">
    Content
  </div>
</div>

// ❌ Same radius on both — corners look flat inside
<div className="rounded-xl p-1">
  <div className="rounded-xl p-4">
    Content
  </div>
</div>
```

## Shadows

Only use the Lumos shadow system. No other shadows.

| Utility | Value | Use |
|---------|-------|-----|
| `shadow-app-tile` | `-6px 12px 32px -6px rgba(0,0,0,0.16)` | Cards, elevated surfaces |
| `shadow-app-tile-hover` | `-6px 12px 40px -6px rgba(0,0,0,0.24)` | Hovered cards |

**No raw `box-shadow` values.** If you're not using `shadow-app-tile` or `shadow-app-tile-hover`, don't add a shadow.

## Visual Hierarchy

Clear hierarchy prevents confusion. Users must know what matters most.

### One primary CTA per view

Every view has exactly one primary action (orange `bg-primary`). If two buttons both use orange, neither dominates. Demote the secondary one.

```tsx
// ✅ Clear hierarchy
<button className="bg-primary">Save changes</button>
<button className="bg-secondary">Cancel</button>

// ❌ Two primaries compete
<button className="bg-primary">Save</button>
<button className="bg-primary">Discard</button>
```

### Adjacent heading levels must be clearly distinct

Avoid heading levels that differ by only one property (1–2px size OR one weight step). Levels need both size AND weight contrast.

```tsx
// ✅ Clearly distinct — size + weight both differ
<h2 className="text-h2">Section title</h2>       {/* 18px, 500 */}
<p className="text-body-normal">Description</p>   {/* 14px, 400 */}

// ❌ Too close — users won't feel the hierarchy
<p className="text-[15px] font-medium">Almost a heading</p>
<p className="text-[14px] font-medium">Body that looks the same</p>
```

### Supporting text uses secondary foreground

Metadata, timestamps, helper text, and labels use `text-muted-foreground` — not `text-foreground`. If everything is the same color, nothing reads as primary.

```tsx
// ✅ Supporting text is demoted
<h3 className="text-h3">User Account</h3>
<p className="text-muted-foreground text-sm">Last active 2 hours ago</p>

// ❌ Everything is primary — no hierarchy
<h3 className="text-h3">User Account</h3>
<p className="text-foreground text-sm">Last active 2 hours ago</p>
```

## What NOT to Do

- ❌ Never add drop shadows (unless using `shadow-app-tile`)
- ❌ Never use Inter, Roboto, or system-ui — Roobert only
- ❌ Never hard-code hex values — use semantic token classes
- ❌ Never use `<div>` or `<span>` for heading-level text — use `<h1>` / `<h2>` / `<h3>`
- ❌ Never justify body text — left-align only
- ❌ Never make adjacent heading levels visually ambiguous
- ❌ Never use `text-foreground` for labels/metadata — use `text-muted-foreground`
- ❌ Never place two orange primary buttons side by side
- ❌ Never use arbitrary spacing like `p-[13px]` — multiples of 4px only
- ❌ Never mix margin on children with gap on parent — pick one

## Quick Reference

| Element | Rule |
|---------|------|
| Shadows | Only `shadow-app-tile` / `shadow-app-tile-hover`. No others. |
| Headings | Semantic HTML (`<h1>`, `<h2>`, `<h3>`). Never divs. |
| Typography | Roobert only. Different levels must differ in size AND weight. |
| Colors | Semantic classes only. No hex values in components. |
| Spacing | Multiples of 4px. Use `gap` on containers. |
| Radius | Buttons `rounded-full`, inputs `rounded-lg`, cards `rounded-xl`. |
| Hierarchy | One primary CTA. Secondary text uses `text-muted-foreground`. |
