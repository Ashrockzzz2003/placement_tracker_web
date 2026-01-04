# Issue #36 - Architecture & Component Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLACEMENT TRACKER WEB APP                    │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
            ┌───────▼────────┐ ┌──▼─────────┐ ┌▼──────────────┐
            │ Admin Panel    │ │Manager Panel│ │Student Panel★ │
            └─────┬──────────┘ └──┬─────────┘ └┬──────────────┘
                  │               │            │
        ┌─────────┘               │            │
        │                    ┌────┘            │
        │                    │                 │
        │              ┌─────▼──────┐    ┌────▼────────────┐
        │              │ Placements │    │ New Page ★      │
        │              │  Dashboard │    │ /placements     │
        │              └─────┬──────┘    └────┬────────────┘
        │                    │                │
        │     ┌──────────────┼────────────────┤
        │     │              │                │
        ▼     ▼              ▼                ▼
   ┌─────────────────────────────────────────────────┐
   │       SHARED REUSABLE COMPONENTS ★★★           │
   ├─────────────────────────────────────────────────┤
   │                                                 │
   │  ┌──────────────────┐  ┌──────────────────┐   │
   │  │ PlacementTable   │  │ PlacementCard    │   │
   │  │  ✓ Responsive    │  │  ✓ Grid Layout   │   │
   │  │  ✓ Sortable      │  │  ✓ Visual Cards  │   │
   │  │  ✓ Dark Mode     │  │  ✓ Dark Mode     │   │
   │  └──────────────────┘  └──────────────────┘   │
   │                                                 │
   │  ┌──────────────────┐                          │
   │  │ PlacementStats   │                          │
   │  │  ✓ Statistics    │                          │
   │  │  ✓ Responsive    │                          │
   │  │  ✓ Dark Mode     │                          │
   │  └──────────────────┘                          │
   │                                                 │
   └─────────────────────────────────────────────────┘
        │              │              │
        │ Used by      │ Used by      │ Used by
        ▼              ▼              ▼
   Admin View     Manager View   ★Student View
```

---

## Component Dependency Graph

```
PlacementStats.js
  ├─ React
  ├─ useMemo hook
  └─ TailwindCSS (dark mode)

PlacementTable.js
  ├─ React
  └─ TailwindCSS (dark mode, responsive)

PlacementCard.js
  ├─ React
  └─ TailwindCSS (dark mode)

StudentPlacements Page ★NEW
  ├─ React hooks (useState, useEffect)
  ├─ PrimeReact
  │  ├─ Dropdown
  │  ├─ InputText
  │  └─ Toast
  ├─ DarkModeToggle (existing)
  ├─ PlacementTable (new)
  ├─ PlacementCard (new)
  ├─ PlacementStats (new)
  └─ TailwindCSS

StudentDashboard (Modified) ★UPDATED
  ├─ DarkModeToggle (existing)
  └─ Link to /dashboard/student/placements ★NEW
```

---

## Data Flow Diagram

```
┌──────────────────┐
│ Student Opens    │
│ Dashboard        │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Click "View Peer Placements" Button   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Navigate to                          │
│ /dashboard/student/placements        │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Fetch GET_ALL_PLACEMENTS_URL         │
│ (with Bearer token auth)             │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Placements Data Received             │
│ [{placement1}, {placement2}, ...]    │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Display PlacementStats               │
│ (total, avg CTC, max CTC, rate)      │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ User Applies Filters                       │
│ - Search by name/company/roll no          │
│ - Filter by company dropdown              │
│ - Filter by batch dropdown                │
│ - Toggle view mode (table/card)           │
└────────┬───────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ Data Filtered in Client                    │
│ (search + company filter + batch filter)   │
└────────┬───────────────────────────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌────────┐  ┌────────┐
│ Table  │  │ Card   │
│ View   │  │ View   │
│        │  │        │
│PlaceTable│PlaceCard│
└────────┘  └────────┘
```

---

## File Structure

```
placement_tracker_web/
│
├─ app/
│  └─ dashboard/
│     └─ student/
│        ├─ page.js ★MODIFIED
│        │  └─ Added "View Peer Placements" button
│        │
│        └─ placements/ ★NEW FOLDER
│           └─ page.js ★NEW FILE (350+ lines)
│              Features:
│              • Statistics overview
│              • Advanced filtering
│              • Table/card view toggle
│              • Dark mode support
│              • Error handling
│
├─ util/
│  ├─ PlacementTable.js ★NEW (150 lines)
│  │  • Reusable table component
│  │  • Student details toggle
│  │  • Responsive & dark mode
│  │
│  ├─ PlacementCard.js ★NEW (95 lines)
│  │  • Reusable card component
│  │  • Visual display of placements
│  │  • Status badges
│  │
│  ├─ PlacementStats.js ★NEW (130 lines)
│  │  • Statistics display component
│  │  • Avg CTC, total, max CTC, rate
│  │  • Responsive grid
│  │
│  ├─ DarkModeContext.js (existing)
│  └─ DarkModeToggle.js (existing)
│
└─ Documentation/
   ├─ ISSUE_36_COMPLETION.md
   ├─ ISSUE_36_QUICK_GUIDE.md
   ├─ ISSUE_36_MASTER_SUMMARY.md
   └─ ISSUE_36_IMPLEMENTATION_SUMMARY.md
```

---

## Component State Management

```
StudentPlacements Component
│
├─ State Variables:
│  ├─ placements[] ─────────────────── All placements from API
│  ├─ filteredPlacements[] ─────────── After applying filters
│  ├─ loading (boolean) ──────────── Loading state
│  ├─ searchQuery (string) ───────── Current search text
│  ├─ selectedCompany (string) ───── Selected company filter
│  ├─ selectedBatch (string) ────── Selected batch filter
│  ├─ viewMode (string) ─────────── "table" or "card"
│  ├─ companies[] ────────────────── Dropdown options
│  └─ batches[] ───────────────────── Dropdown options
│
├─ Effects:
│  ├─ useEffect (mount) ─────────── Fetch placements from API
│  └─ useEffect (filters) ─────────── Apply filters when changed
│
└─ Renders:
   ├─ Navigation bar with DarkModeToggle
   ├─ PlacementStats (above filters)
   ├─ Filter section (search, dropdowns, clear)
   ├─ View mode toggle (table/card)
   └─ Conditional rendering:
      ├─ Loading spinner (if loading)
      ├─ Empty state (if no results)
      ├─ PlacementTable (if table view)
      └─ PlacementCard grid (if card view)
```

---

## Interaction Flow

```
START
  │
  ├─ Student Dashboard
  │   │
  │   └─ User clicks "View Peer Placements"
  │      │
  │      └─ Route to /dashboard/student/placements
  │
  ├─ StudentPlacements Page Loads
  │   │
  │   ├─ Show loading spinner
  │   │
  │   └─ Fetch GET_ALL_PLACEMENTS_URL
  │      │
  │      ├─ Success: Load placements
  │      │  │
  │      │  ├─ Calculate statistics
  │      │  ├─ Populate company dropdown
  │      │  ├─ Populate batch dropdown
  │      │  └─ Render PlacementStats
  │      │
  │      └─ Error: Show toast notification
  │
  ├─ User Interacts with Filters
  │   │
  │   ├─ Type in search box
  │   │  └─ Filter placements real-time
  │   │
  │   ├─ Select company from dropdown
  │   │  └─ Filter placements
  │   │
  │   ├─ Select batch from dropdown
  │   │  └─ Filter placements
  │   │
  │   └─ Click "Clear Filters"
  │      └─ Reset all filters
  │
  ├─ User Selects View Mode
  │   │
  │   ├─ Click "Table" button
  │   │  └─ Render PlacementTable component
  │   │
  │   └─ Click "Card" button
  │      └─ Render PlacementCard grid
  │
  ├─ User Toggles Dark Mode
  │   │
  │   └─ DarkModeToggle updates theme
  │      └─ All components update instantly
  │
  └─ END (User leaves page)
```

---

## Integration Points with Existing Code

### 1. With DarkModeContext
```javascript
// DarkModeContext provides:
- useDarkMode() hook
- toggleDarkMode() function
- System preference detection
- localStorage persistence

// Used by:
- StudentPlacements page (via DarkModeToggle)
- PlacementTable, PlacementCard, PlacementStats
- All TailwindCSS dark: classes
```

### 2. With PrimeReact Components
```javascript
// Used in StudentPlacements page:
- Dropdown (company filter, batch filter)
- InputText (search box)
- Toast (error notifications)

// Styled for dark mode in globals.css
```

### 3. With TailwindCSS
```javascript
// All components use:
- Utility classes for styling
- dark: prefix for dark mode
- Responsive prefixes (sm:, md:, lg:)
- Grid system for layouts
```

### 4. With Existing API
```javascript
// Fetches from:
GET_ALL_PLACEMENTS_URL
  ├─ Method: GET
  ├─ Headers: Authorization: Bearer {token}
  └─ Returns: Array of placements

// Used by:
- StudentPlacements page
- Can be used by any role for their views
```

---

## Scaling & Future Enhancements

```
Current Architecture ✅
├─ PlacementTable (reusable)
├─ PlacementCard (reusable)
├─ PlacementStats (reusable)
└─ StudentPlacements page (specific)

Future Enhancements
├─ CompanyAnalytics page
│  └─ Uses: PlacementTable, PlacementStats, ComparisonCharts
│
├─ DepartmentAnalytics page
│  └─ Uses: PlacementTable, PlacementStats
│
├─ BatchComparison page
│  └─ Uses: PlacementStats, ComparisonCharts
│
└─ ExportReports feature
   └─ Uses: PlacementTable (data source)

All future features will reuse existing components! ✨
```

---

## Performance Considerations

```
Component Rendering
├─ PlacementTable
│  ├─ Virtual scrolling (for large datasets)
│  └─ Memo optimization (for re-renders)
│
├─ PlacementCard
│  ├─ Grid layout (CSS Grid performance)
│  └─ Each card is self-contained
│
└─ PlacementStats
   └─ useMemo (calculations only when data changes)

StudentPlacements Page
├─ useEffect (dependency array optimized)
├─ Filter calculations (client-side, fast)
└─ No unnecessary re-renders
```

---

## Summary

### Component Architecture ✨
- 3 reusable components (PlacementTable, PlacementCard, PlacementStats)
- 1 new feature page (StudentPlacements)
- 1 dashboard update (added navigation)
- All connected via shared data structure

### Data Flow 🔄
- Fetch placements once
- Filter client-side (fast)
- Display via reusable components
- Toggle views instantly
- Dark mode applied everywhere

### Integration 🔗
- Works with existing DarkModeContext
- Uses existing PrimeReact components
- Follows TailwindCSS conventions
- Integrates with existing API
- Maintains project architecture

### Reusability 🎯
- Components are role-agnostic
- Accept generic placement data
- Can be used in multiple pages
- Future features will leverage them

**Result**: Clean, maintainable, scalable code that serves current needs and future enhancements! 🚀

