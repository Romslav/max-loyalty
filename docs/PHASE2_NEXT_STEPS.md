# 🔥 Phase 2 - Next Steps & Execution Plan

**Last Updated:** January 19, 2026  
**Status:** Phase 2 Infrastructure ✅ COMPLETE → Integration 🔄 IN PROGRESS  
**Timeline:** Days 5-7 (3 days)  
**Owner:** @Romslav  

---

## 🚂 Current Status

### ✅ What's Done
- [x] useQuery hook - Data fetching with retry
- [x] useMutation hook - Create/update/delete operations
- [x] LoadingSpinner, ErrorAlert, EmptyState components
- [x] Pagination & SearchInput components
- [x] GuestsList.example.tsx - Complete integration example
- [x] PHASE2_API_INTEGRATION.md - Full documentation
- [x] PR #3 - Ready for review

### 🕊 What's Next (Priority Order)
1. Integrate Phase 2 components into 7 main pages
2. Update services with proper API endpoints
3. Test all pages with real data
4. Deploy to staging
5. Start Phase 3 (Validation & Error Handling)

---

## 💲 Implementation Plan

### Option 1: 🚀 Quick Path (3 days) - Recommended

Focus on highest-impact pages first.

**Day 5:** AdminDashboard + GuestsList (6 hours)
```bash
# 1. Copy pattern from GuestsList.example.tsx
# 2. Update AdminDashboard.tsx
#    - Replace mock dashboard data with useQuery
#    - Add LoadingSpinner while loading
#    - Add ErrorAlert on error
#    - Add EmptyState if no data
#
# 3. Update GuestsList.tsx
#    - Replace mock guests with useQuery
#    - Add Pagination component
#    - Add SearchInput component
#    - Add useMutation for create/edit
#    - Add ErrorAlert for mutations
```

**Day 6:** RestaurantsList + BillingManagement (6 hours)
```bash
# 4. Update RestaurantsList.tsx
#    - useQuery for restaurants list
#    - Pagination support
#    - SearchInput for filtering
#    - useMutation for create/edit
#
# 5. Update BillingManagement.tsx
#    - useQuery for invoices
#    - Pagination
#    - useMutation for payment
#    - ErrorAlert with retry
```

**Day 7:** AnalyticsPage + Remaining Pages (6 hours)
```bash
# 6. Update AnalyticsPage.tsx
#    - useQuery for analytics data
#    - LoadingSpinner while loading
#    - Multiple data sources with Promise.all()
#
# 7. Update PointsOperations.tsx + ScanCard.tsx
#    - useMutation for operations
#    - ErrorAlert for failures
#    - Success toast notifications
#
# 8. Testing all pages
#    - Verify loading states
#    - Verify error handling
#    - Verify pagination works
#    - Verify search filters work
```

### Option 2: 🟃 Marathon Path (1 day) - If feeling fast

Integrate everything in one focused session.
```bash
Time: 8 hours (Day 5 morning to evening)

# All 7 pages simultaneously using parallel work
# Or do batches of similar pages
# Then batch test all pages
```

### Option 3: 🚃 Thorough Path (5 days) - If want perfection

Do 2 pages per day with full testing.
```bash
Day 5:  AdminDashboard + GuestsList + full E2E tests
Day 6:  RestaurantsList + BillingManagement + full E2E tests
Day 7:  AnalyticsPage + PointsOperations + ScanCard + full E2E tests
Day 8:  Complete Phase 2 testing + staging deployment
Day 9:  Monitoring + fixes + Phase 3 start
```

---

## 💳 Integration Checklist

### AdminDashboard.tsx
```typescript
// [ ] Replace mock data with useQuery
const { data: stats, loading, error } = useQuery(
  () => analyticsService.getDashboard(),
  { refetchInterval: 30000 } // Auto-refresh every 30s
)

// [ ] Add loading state
{loading && <LoadingSpinner message="Loading dashboard..." />}

// [ ] Add error state
{error && <ErrorAlert error={error} onRetry={refetch} />}

// [ ] Add empty state
{!loading && !stats && <EmptyState title="No data" />}

// [ ] Add real data rendering
{stats && <Dashboard stats={stats} />}
```

### GuestsList.tsx
```typescript
// [ ] State for pagination and search
const [page, setPage] = useState(1)
const [search, setSearch] = useState('')
const limit = 10

// [ ] Fetch with pagination
const { data, loading, error, refetch, isRefetching } = useQuery(
  () => guestService.getGuests(page, limit, search),
  { retry: 3 }
)

// [ ] Extract pagination info
const guests = data?.data || []
const total = data?.total || 0
const totalPages = Math.ceil(total / limit)

// [ ] Add SearchInput
<SearchInput
  placeholder="Search guests..."
  onSearch={(query) => {
    setSearch(query)
    setPage(1) // Reset to first page
  }}
/>

// [ ] Add Table with data
<GuestsTable guests={guests} />

// [ ] Add Pagination
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  isLoading={isRefetching}
/>

// [ ] Add useMutation for create/edit
const { mutate: createGuest, loading: creating } = useMutation(
  (data) => guestService.createGuest(data),
  {
    onSuccess: () => {
      showSuccess('Guest created!')
      refetch() // Refresh list
    },
    onError: (error) => {
      showError('Failed to create guest', error)
    },
  }
)
```

### RestaurantsList.tsx
```typescript
// [ ] Similar pattern as GuestsList
// [ ] Add pagination
// [ ] Add search
// [ ] Add create/edit mutations
// [ ] Add error handling
```

### BillingManagement.tsx
```typescript
// [ ] useQuery for invoices list
// [ ] Pagination
// [ ] useMutation for payment
// [ ] ErrorAlert with retry
// [ ] Success notification
```

### AnalyticsPage.tsx
```typescript
// [ ] Multiple data sources
const { data: dashboard } = useQuery(() => analyticsService.getDashboard())
const { data: guests } = useQuery(() => analyticsService.getGuestStats())
const { data: revenue } = useQuery(() => analyticsService.getRevenueStats())

// [ ] Combine loading states
const loading = loading1 || loading2 || loading3

// [ ] Render all data
```

### PointsOperations.tsx
```typescript
// [ ] Form with guest selection
// [ ] useMutation for POST operation
// [ ] ErrorAlert on failure
// [ ] Success toast on success
// [ ] Refetch operations list after mutation
```

### ScanCard.tsx
```typescript
// [ ] useQuery for guest data
// [ ] useMutation for scan operation
// [ ] Real-time response
// [ ] Error handling
```

---

## 💳 Service Updates

### guestService.ts
```typescript
// [ ] Add pagination support
export const getGuests = async (page: number, limit: number, search?: string) => {
  const response = await api.get('/guests', {
    params: { page, limit, search }
  })
  return response.data // { data: [...], total: 100 }
}

// [ ] Add create/update/delete
export const createGuest = async (data: CreateGuestDTO) => {
  return api.post('/guests', data)
}

export const updateGuest = async (id: string, data: UpdateGuestDTO) => {
  return api.put(`/guests/${id}`, data)
}

export const deleteGuest = async (id: string) => {
  return api.delete(`/guests/${id}`)
}
```

### restaurantService.ts
```typescript
// [ ] Add all CRUD operations
// [ ] Add pagination
// [ ] Add search filtering
```

### operationService.ts
```typescript
// [ ] Add getOperations with pagination
// [ ] Add createOperation
// [ ] Add getStats
```

### analyticsService.ts
```typescript
// [ ] Add getDashboard
// [ ] Add getGuestStats
// [ ] Add getRevenueStats
```

### billingService.ts
```typescript
// [ ] Add getInvoices with pagination
// [ ] Add createInvoice
// [ ] Add payInvoice
```

---

## 💳 Testing Checklist

### For Each Page
- [ ] Page loads without errors
- [ ] Loading spinner shows while fetching
- [ ] Data displays correctly
- [ ] Pagination works (if applicable)
- [ ] Search filters work (if applicable)
- [ ] Empty state shows when no data
- [ ] Error state shows on API failure
- [ ] Retry button works on error
- [ ] Create/edit/delete mutations work
- [ ] Success toast shows on mutation success
- [ ] Error toast shows on mutation failure
- [ ] Page refresh works (F5)
- [ ] No console errors

### API Error Scenarios
- [ ] Test with network error
- [ ] Test with 401 (auth error)
- [ ] Test with 403 (permission error)
- [ ] Test with 404 (not found)
- [ ] Test with 500 (server error)
- [ ] Test with slow connection (throttle in DevTools)
- [ ] Test with offline mode

---

## 💳 Performance Tips

1. **Pagination reduces load:**
   - Fetch only 10-20 items per page
   - Reduces initial load time
   - Saves bandwidth

2. **Search debouncing:**
   - Prevents excessive API calls
   - SearchInput has 300ms debounce built-in
   - Only sends request after user stops typing

3. **Conditional refetch:**
   - Only refetch when needed
   - Use `refetch()` after mutations
   - Use `refetchInterval` for real-time updates

4. **Loading state UX:**
   - Show spinner while loading
   - Disable buttons while loading
   - Show skeleton screens for better UX

---

## 💳 Common Issues & Solutions

### Issue: "Infinite loop of API requests"
**Solution:** Check useQuery dependencies, ensure service functions are stable

### Issue: "Data not updating after mutation"
**Solution:** Call `refetch()` in mutation `onSuccess` callback

### Issue: "Pagination shows wrong total pages"
**Solution:** Verify `total` is returned from API, calculate correctly: `Math.ceil(total / limit)`

### Issue: "Search not working"
**Solution:** Reset page to 1 when search changes: `setPage(1)` in onSearch

### Issue: "Loading spinner shows forever"
**Solution:** Verify API endpoint is correct, check Network tab for failures

---

## 💳 Success Criteria

- [ ] All 7 pages integrated with Phase 2 components
- [ ] All pages load real data from API
- [ ] Pagination works on all list pages
- [ ] Search works on applicable pages
- [ ] Loading/error/empty states display correctly
- [ ] Create/edit/delete operations work
- [ ] No console errors or warnings
- [ ] Pages respond well to network errors
- [ ] All tests pass (85%+ coverage)
- [ ] Staging deployment successful

---

## 💳 Phase 3 Readiness

Once Phase 2 is complete, we'll move to Phase 3:

### Phase 3: Form Validation & Error Handling
- Zod schema validation for all forms
- React Hook Form integration
- Sentry error tracking
- Centralized error handling
- Toast notifications
- Action logging

**Issue:** [#4 - Form Validation & Error Handling](https://github.com/Romslav/max-loyalty/issues/4)

---

## 💳 Resources

- **Phase 2 Documentation:** [PHASE2_API_INTEGRATION.md](PHASE2_API_INTEGRATION.md)
- **Example Implementation:** `src/pages/GuestsList.example.tsx`
- **PR #3:** [Real API Integration & Data Management](https://github.com/Romslav/max-loyalty/pull/3)
- **Hooks Documentation:** `src/hooks/useQuery.ts`, `src/hooks/useMutation.ts`

---

## 💳 Quick Start

```bash
# 1. Open GuestsList.example.tsx
# 2. Copy the pattern
# 3. Apply to AdminDashboard.tsx
# 4. Update for your page's data
# 5. Test
# 6. Repeat for other pages
```

---

**Let's finish Phase 2! 🚀**
