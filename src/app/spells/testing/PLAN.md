# Access Reviews Analytics Dashboard — Spell Plan

## Goal
Build a clean, functional analytics dashboard for IM admins to monitor and manage access reviews. Focus on key metrics, trends, and recent review activity.

## Approach
- Display core KPIs: pending count, completion rate, status breakdown
- Show 30-day trend with a simple line chart
- Provide filters (date range, status) for focused analysis
- List recent reviews with status and assignee
- Use Lumos design tokens and components for consistency
- Keep it data-focused and scannable

## File Structure
```
src/app/spells/testing/
├── page.tsx                 # Main dashboard page
├── PLAN.md                  # This file
└── (existing files)
```

## Implementation Tasks

### Task 1: Set up page structure
- Import LumosLayout, PageHeader, and UI components
- Create filter controls (date range, status dropdown)
- Build layout grid for KPI cards

### Task 2: Add KPI cards
- Pending reviews count
- Completion rate (%)
- Reviews by status: Approved / Denied / Pending
- Use LumosCard for consistent styling

### Task 3: Add trend chart
- 30-day review count trend (mock data)
- Simple line chart showing daily submissions
- Use shadcn/ui Chart if available, or basic SVG

### Task 4: Add recent reviews table
- Columns: Review ID, User, Access Type, Status, Assignee, Date
- Status badges (approved=green, denied=red, pending=yellow)
- Sortable/filterable rows with mock data

### Task 5: Polish & test
- Ensure responsive layout
- Verify all Lumos tokens are used
- Test on localhost:3000/spells/testing
- Commit with clear message

## Testing Strategy
- Visual inspection on localhost
- Verify responsive behavior (desktop)
- Check that filters update displayed data
- Confirm all components render correctly
