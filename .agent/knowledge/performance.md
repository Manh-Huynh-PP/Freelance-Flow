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
