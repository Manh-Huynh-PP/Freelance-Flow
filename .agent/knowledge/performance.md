## [2025-05-22] Performance & useEffect Refactor
**Mode**: B (Feature) + A (Fix) | **Files**: read 12 / edited 8 / created 4

### Architecture decisions
- **Optimistic update pattern** (react-query `onMutate` + rollback `onError`) chosen over server-side caching because it provides instant UI feedback without infrastructure changes.
- **Diff-based setAppData** uses reference equality (`!==`) to detect changed collections — simple, zero-cost, no deep comparison needed.
- **`window.history.replaceState`** instead of `router.replace` for URL sync — avoids Next.js re-render cycle for URL-only changes.
- **Ref guards** (`useRef`) for `useEffect` deduplication — more reliable than dependency manipulation.

### Changes
1. **useWorkTimeData.ts**: Removed 3 useEffects (duplicate mount sync, dead empty effect), fixed merge effect with ref guard to prevent infinite loops.
2. **dashboard-context.tsx**: `derivedWorkTime` wrapped in `useMemo`, removed duplicate backup status effect, removed debug logs from `wrappedUpdateTask`.
3. **dashboard-content.tsx**: Removed render-time debug console.log.
4. **useAppData-supabase.ts**: Added optimistic update (onMutate/onError), added diff computation in `setAppData`, removed debug logs.
5. **supabase-data-service.ts**: Removed debug logs from `loadAppData` and `saveQuotes`.
6. **use-filter-logic.ts**: Init effect runs once (ref guard), URL sync uses `history.replaceState`.
7. **share page**: Removed trackView fire-and-forget.

### Gotchas
- `useWorkTimeData` `useState` initializer already reads localStorage — any `useEffect` doing the same is duplicate and causes a double-render.
- `sessions.length` in useEffect dependency creates feedback loop: effect changes sessions → length changes → effect runs again.
- `react-query` v3 `useMutation` `onMutate` must return context object for rollback — the `context` param in `onError` is typed as `unknown` by default.
- `window.history.replaceState` does NOT trigger Next.js `useSearchParams` re-read — this is the desired behavior for filter URL sync.

### Criteria passed
- [x] 41/41 new tests pass
- [x] TypeScript type check passes (no errors)
- [x] No breaking changes to existing features
- [ ] Manual verification pending (user must test dashboard load, CRUD, filters, share links)

---

## [2025-05-22] TaskDetailsDialog Refactor
**Mode**: C (Review) + A (Fix) | **Files**: read 1 / edited 1 / created 1

### Architecture decisions
- **useQuoteCalculations hook** extracted ~274 lines of calculation logic (calculateRowValue, totals, aggregations, grand total formula) into a dedicated hook for reusability and testability.
- **computeColumnAggregations** extracted as a pure function inside the hook — shared between main quote and collaborator quote aggregation to eliminate code duplication (DRY).
- **renderQuoteTable** kept inside component but wrapped with `useCallback` — full extraction to a separate component was deferred because it has 10+ closure dependencies making prop drilling more complex than beneficial.
- **getMilestonesFromQuote** moved to module scope since it's a pure function with no component state dependency.

### Changes
1. **TaskDetailsDialog.tsx** (2345→2072 lines, -273):
   - FIX-01: Line break between useEffect closing and useMemo declaration
   - FIX-02: Removed console.warn in language fallback (useMemo)
   - FIX-03: Removed unnecessary `T` dependency from calculationResults useMemo
   - FIX-04: Extracted `taskProjectId` for stable useMemo dependency (avoids `(task as any)?.projectId` in dep array)
   - FIX-05: Removed unused `DialogTrigger` import
   - FIX-06: Moved `getMilestonesFromQuote` to module scope
   - Replaced 280 lines of inline calculation with `useQuoteCalculations` hook
   - Wrapped `renderQuoteTable` with `useCallback`
   - Cleaned up 4 unused type/function imports

2. **useQuoteCalculations.ts** (NEW, 267 lines):
   - `calculateRowValue` — pure function, exported for reuse
   - `computeColumnAggregations` — shared aggregation logic
   - `useQuoteCalculations` hook — full calculation pipeline

### Gotchas
- `(task as any)?.projectId` in useMemo dependency array creates a new expression each render — always extract to a variable first.
- `T` (i18n translations) in useMemo deps but not used in body causes unnecessary recalculation of heavy computation on every language change.
- `renderQuoteTable` cannot be easily extracted because it closes over `setIsPriceEditOpen`, `setHideTimelineForExport`, `copyQuoteToClipboard`, `copyQuoteAsImage` etc. — too many parent states.

### Criteria passed
- [x] 41/41 tests pass
- [x] TypeScript type check passes
- [x] No breaking changes
- [ ] Manual verification pending
