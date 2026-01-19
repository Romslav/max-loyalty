# Phase 2: Real API Integration & Data Management

## Overview
Phase 2 focuses on replacing mock data with real API integration, adding pagination, search, and proper loading/error states.

## Architecture

### New Hooks

#### useQuery
Hook for fetching data with built-in loading, error, retry, and polling support.

```typescript
const { data, loading, error, refetch, isRefetching } = useQuery(
  async () => {
    const response = await guestService.getGuests(page, limit)
    return response.data
  },
  {
    enabled: true,
    retry: 3,
    refetchInterval: 30000, // Poll every 30 seconds
  }
)
```

**Features:**
- Automatic error retry with exponential backoff
- Optional polling/refetch interval
- Refetch on demand
- Automatic loading state management

#### useMutation
Hook for handling create/update/delete operations.

```typescript
const { mutate, data, loading, error, reset } = useMutation(
  async (newGuest) => {
    return await guestService.createGuest(newGuest)
  },
  {
    onSuccess: (data) => {
      console.log('Success:', data)
      refetch() // Re-fetch data
    },
    onError: (error) => {
      console.error('Error:', error)
    },
  }
)

// Use it
await mutate({ name: 'John', email: 'john@example.com' })
```

**Features:**
- Automatic loading state
- Error handling
- Success/error/finally callbacks
- Reset state on demand

### New Components

#### LoadingSpinner
Display loading state.

```typescript
<LoadingSpinner size="md" message="Loading guests..." />
```

#### ErrorAlert
Display errors with retry option.

```typescript
<ErrorAlert
  error={error}
  onRetry={refetch}
  onDismiss={() => setError(null)}
/>
```

#### EmptyState
Display when no data available.

```typescript
<EmptyState
  title="No guests found"
  message="Start by adding your first guest"
  action={{
    label: 'Add Guest',
    onClick: () => navigate('/add-guest'),
  }}
/>
```

#### Pagination
Handle pagination for large datasets.

```typescript
<Pagination
  currentPage={page}
  totalPages={Math.ceil(total / limit)}
  onPageChange={(newPage) => setPage(newPage)}
  isLoading={loading}
/>
```

#### SearchInput
Search with debounce.

```typescript
<SearchInput
  placeholder="Search guests..."
  debounceMs={300}
  onSearch={(query) => {
    setSearch(query)
    setPage(1) // Reset to first page
  }}
/>
```

## Implementation Pattern

### Step-by-Step Guide

1. **Replace mock data with API call:**

```typescript
// Before
const [guests, setGuests] = useState(mockGuestData)

// After
const { data: guests, loading, error, refetch } = useQuery(
  async () => {
    const response = await guestService.getGuests(page, limit, search)
    return response.data
  }
)
```

2. **Add loading state:**

```typescript
{loading && <LoadingSpinner message="Loading..." />}
{!loading && guests && <Table data={guests} />}
```

3. **Add error state:**

```typescript
<ErrorAlert error={error} onRetry={refetch} />
```

4. **Add empty state:**

```typescript
{!loading && (!guests || guests.length === 0) && (
  <EmptyState title="No data" />
)}
```

5. **Add pagination:**

```typescript
const [page, setPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

6. **Add search:**

```typescript
const [search, setSearch] = useState('')

<SearchInput
  onSearch={(query) => {
    setSearch(query)
    setPage(1)
  }}
/>
```

## Pages to Update

### Priority 1 (Critical)
- [ ] AdminDashboard.tsx
- [ ] GuestsList.tsx
- [ ] RestaurantsList.tsx
- [ ] AnalyticsPage.tsx

### Priority 2 (Important)
- [ ] BillingManagement.tsx
- [ ] PointsOperations.tsx
- [ ] RestaurantGuestsList.tsx

### Priority 3 (Nice-to-have)
- [ ] ScanCard.tsx
- [ ] OperationsList.tsx

## Example Integration

See `src/pages/GuestsList.example.tsx` for a complete example of how to integrate:
- useQuery hook
- useMutation hook
- LoadingSpinner component
- ErrorAlert component
- EmptyState component
- Pagination component
- SearchInput component

## API Response Format

All services follow this response format:

```typescript
// List endpoints
{
  data: [...items],
  total: 100,
  page: 1,
  limit: 10
}

// Single endpoints
{
  data: {...item}
}

// Error responses
{
  message: "Error description",
  code: "ERROR_CODE",
  details: {...}
}
```

## Error Handling

All services handle errors:

```typescript
try {
  const response = await guestService.getGuests()
  return response.data
} catch (error) {
  // Error is automatically caught by useQuery
  // Retry logic with exponential backoff kicks in
  throw error
}
```

## Performance Tips

1. **Use pagination for large datasets:**
   - Fetch only what's needed
   - Reduce network bandwidth
   - Faster initial load

2. **Debounce search:**
   - SearchInput has 300ms debounce by default
   - Prevents excessive API calls
   - Better user experience

3. **Conditional data fetching:**
   - Use `enabled` option in useQuery
   - Only fetch when needed
   - Save network requests

4. **Smart refetching:**
   - Use `refetch()` after mutations
   - Update cache automatically
   - Keep UI in sync

## Accessibility

All components include:
- Proper focus management
- Keyboard navigation
- ARIA labels
- Color contrast

## Testing

### Testing useQuery
```typescript
it('should fetch and display data', async () => {
  const { result } = renderHook(() =>
    useQuery(async () => [{ id: 1, name: 'Test' }])
  )

  await waitFor(() => {
    expect(result.current.data).toEqual([{ id: 1, name: 'Test' }])
  })
})
```

### Testing useMutation
```typescript
it('should handle mutation', async () => {
  const { result } = renderHook(() =>
    useMutation(async (data) => ({ id: 1, ...data }))
  )

  await act(async () => {
    await result.current.mutate({ name: 'Test' })
  })

  expect(result.current.data).toEqual({ id: 1, name: 'Test' })
})
```

## Troubleshooting

### "Infinite loop of requests"
- Check `enabled` option in useQuery
- Verify dependencies are correct
- Don't pass new function on every render

### "Data not updating after mutation"
- Call `refetch()` after successful mutation
- Check mutation response format
- Verify API endpoint returns updated data

### "Pagination not working"
- Ensure `total` is returned from API
- Calculate `totalPages` correctly: `Math.ceil(total / limit)`
- Reset page to 1 on search

### "Search not debouncing"
- Default debounce is 300ms
- Override with `debounceMs` prop
- Verify `onSearch` is called after delay

## Next Steps

1. Update all pages with real API integration
2. Add form validation (Phase 3)
3. Implement error handling and logging (Phase 3)
4. Add real-time features (Phase 5)
5. Performance optimization and testing (Phase 6)

## References

- [useQuery Hook](../src/hooks/useQuery.ts)
- [useMutation Hook](../src/hooks/useMutation.ts)
- [GuestsList Example](../src/pages/GuestsList.example.tsx)
- [API Services](../src/services/)
