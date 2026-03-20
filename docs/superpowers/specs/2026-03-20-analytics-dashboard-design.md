# Access Reviews Analytics Dashboard Design

**Date:** 2026-03-20
**Status:** Approved
**Location:** Analytics > Access Reviews Dashboard

## Overview

A new analytics dashboard page for the Lumos Analytics section that provides executive-level visibility into access review metrics, status breakdowns, and trends. This replaces/extends the current analytics experience with a focused, card-based layout that tells a complete story about access review workflows.

## Goals

- Provide at-a-glance summary of total access reviews and their status
- Show trends and patterns over time (30-day view)
- Enable quick drill-down into status breakdown and completion metrics
- Follow existing Lumos design patterns and component library

## Architecture

### Page Layout

```
┌─────────────────────────────────────────────┐
│ PageHeader: "Access Reviews Analytics"      │
│                                             │
│ ┌─────────────┬─────────────┬─────────────┐ │
│ │   Total     │  Pending    │  Approved   │ │
│ │    150      │     32      │     98      │ │
│ │  (stat box) │ (stat box)  │ (stat box)  │ │
│ └─────────────┴─────────────┴─────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ LumosCard: "Access Review Status Report"    │
│                                             │
│ ┌──────────────────┬──────────────────────┐ │
│ │ Donut Chart      │ Quick Stats:         │ │
│ │ (Status Pie)     │ • Total: 150         │ │
│ │                  │ • Avg Days: 3.2      │ │
│ │                  │ • Completion: 92%    │ │
│ └──────────────────┴──────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Trend Line: Reviews Submitted (30 days) │ │
│ │ [chart showing daily/weekly breakdown]  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Recent Reviews Table:                   │ │
│ │ Date | Reviewer | Status | Time to Done │ │
│ │ ...  | ...      | ...    | ...          │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Components Used

- **`PageHeader`** — Main page title
- **Stat boxes** — Three cards showing Total, Pending, Approved (custom or badge-like styling)
- **`LumosCard`** — Main report card container
- **Donut/Pie Chart** — Status breakdown (using recharts or similar)
- **Trend Line Chart** — 30-day submission trend (using recharts or similar)
- **Data Table** — Last 5-10 reviews with inline status badges
- **`LumosBadge`** — Status indicators (Approved = green, Pending = blue, Denied = red)

### Data Structure

The page will display:

#### Summary Stats (Header)
- Total Reviews: integer count
- Pending: integer count
- Approved: integer count

#### Status Breakdown (Donut Chart)
- Approved: count + percentage
- Pending: count + percentage
- Denied: count + percentage
- Other: count + percentage

#### Quick Stats (Side panel)
- Total Reviews
- Avg Days to Complete
- Completion Rate (%)

#### Trend Data (Line Chart)
- 30-day view of reviews submitted (by day or week)
- X-axis: dates
- Y-axis: review count

#### Recent Reviews Table
- Columns: Date, Reviewer Name, Status, Time to Complete (days)
- Rows: Last 5-10 records
- Status shown as `LumosBadge` with color coding

## Color Coding

- **Approved**: Green (`--green-500` / Tailwind `bg-green-500`)
- **Pending**: Blue (`--blue-500` / Tailwind `bg-blue-500`)
- **Denied**: Red (`--red-500` / Tailwind `bg-red-500`)
- **In Progress**: Orange accent (`--orange-100` / Tailwind `bg-accent`)

## Implementation Notes

1. **Mock Data**: For initial build, use hardcoded mock data for charts and table. Data fetching can be added later.
2. **Responsive**: Layout should stack on mobile (stat boxes in single column, chart + stats side-by-side on desktop).
3. **Chart Library**: Use recharts (already in dependencies) for donut and line charts.
4. **Table Pagination**: Start with simple 10-row view, no pagination needed initially.
5. **Accessibility**: All charts should have alt text and keyboard navigation. Badges should have semantic color + text labels.

## Success Criteria

- ✅ Dashboard displays all metrics without errors
- ✅ Charts render correctly on desktop and mobile
- ✅ Status badges color-code correctly
- ✅ Table displays recent reviews with readable layout
- ✅ Page integrates into Analytics section navigation
- ✅ Follows Lumos design system and component patterns

## Future Enhancements

- Date range picker to view custom time windows
- Filter/search within recent reviews table
- Export data as CSV
- Drill-down into specific status categories
- Real-time data updates via API
