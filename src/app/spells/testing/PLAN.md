# Access Reviews Analytics Dashboard

## Goal
Build an admin dashboard that displays apps with pending access requests, showing key metrics, a filterable list, and actions to manage requests.

## Approach
- **Layout**: LumosLayout shell with header and main content
- **Sections**:
  1. Key metrics cards (total pending, urgent, apps affected)
  2. Searchable/filterable table of apps with pending requests
  3. Quick-action buttons to review or approve requests

## File Structure
```
src/app/spells/testing/
  page.tsx                    # Main dashboard page
  components/
    metrics-cards.tsx         # KPI cards (total pending, etc.)
    requests-table.tsx        # Filterable table of pending requests
    request-actions.tsx       # Action buttons for requests
```

## Implementation Tasks
1. ✅ Create page.tsx with LumosLayout + PageHeader
2. ✅ Add metrics cards showing key stats
3. ✅ Build filterable table with mock data (app name, pending count, recent requestor, actions)
4. ✅ Add status badges and semantic colors
5. ✅ Test responsive layout on mobile/desktop
6. ✅ Commit and verify build

## Design Decisions
- Use `LumosLayout` for consistent app shell
- Use `LumosCard` for metrics
- Use `LumosBadge` for status indicators
- Use Roobert typography, Lumos color tokens
- Mock data with 5-8 apps at various stages
