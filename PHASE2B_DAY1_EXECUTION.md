# 🚀 PHASE 2B - DAY 1 EXECUTION GUIDE

**Date:** January 19, 2026  
**Goal:** Integrate AdminDashboard + GuestsList with real API  
**Time:** 6 hours  
**Tasks:** 2 pages  
**Status:** READY TO EXECUTE

---

## 📋 TODAY'S MISSION

```
✅ BEFORE (Current State):
├─ AdminDashboard.tsx → Uses mock data (hardcoded arrays)
├─ GuestsList.tsx → Uses mock data (hardcoded arrays)
└─ Services → guestService.ts, analyticsService.ts

🎯 AFTER (Target State):
├─ AdminDashboard.tsx → Uses useQuery (real data)
│  ├─ Stats from /api/analytics/dashboard
│  ├─ LoadingSpinner while loading
│  ├─ ErrorAlert on error
│  └─ Auto-refresh every 30s
├─ GuestsList.tsx → Uses useQuery + Pagination + SearchInput
│  ├─ Data from /api/guests?page=1&limit=20
│  ├─ Pagination controls
│  ├─ Search functionality
│  ├─ LoadingSpinner
│  ├─ ErrorAlert
│  └─ EmptyState
└─ Services → Real endpoints configured

✅ DELIVERABLES:
- 2 pages fully integrated
- All components working
- API calls tested in DevTools
- Ready for deploy
```

---

## 🎬 START HERE: 5-Minute Setup

### Step 0: Environment Check
```bash
# 1. Navigate to project
cd max-loyalty

# 2. Verify Phase 2A infrastructure exists
ls -la src/hooks/useQuery.ts          # ✅ Should exist
ls -la src/hooks/useMutation.ts       # ✅ Should exist
ls -la src/components/LoadingSpinner.tsx
ls -la src/components/ErrorAlert.tsx
ls -la src/components/EmptyState.tsx
ls -la src/components/Pagination.tsx
ls -la src/components/SearchInput.tsx

# 3. Start dev server
npm run dev

# 4. Open http://localhost:5173
# Expected: App loads, no errors
```

### Step 1: Check Current AdminDashboard
```bash
# Open src/pages/AdminDashboard.tsx
# Look for: const mockStats = [...] or const stats = [...]
# This is what you'll replace
```

---

## 🔧 TASK 1: AdminDashboard Integration (2-3 hours)

### 1.1 Current State Analysis

**Open:** `src/pages/AdminDashboard.tsx`

Find this pattern (BEFORE):
```typescript
const AdminDashboard = () => {
  const [stats] = useState([
    { label: 'Total Guests', value: 1234 },
    { label: 'Total Points', value: 45678 },
    // ... more mock data
  ])

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <div className="text-gray-600">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### 1.2 Replace with Real API

**Update to (AFTER):**
```typescript
import { useQuery } from '../hooks/useQuery'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { analyticsService } from '../services/analyticsService'

const AdminDashboard = () => {
  // ✅ Replace useState with useQuery
  const { data: stats, loading, error, refetch } = useQuery(
    () => analyticsService.getDashboard(),
    {
      retryCount: 3,
      retryDelay: 1000,
      refreshInterval: 30000, // Auto-refresh every 30s
    }
  )

  // ✅ Handle loading state
  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  // ✅ Handle error state
  if (error) {
    return (
      <ErrorAlert
        error={error}
        onRetry={refetch}
      />
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Refresh
        </button>
      </div>

      {/* ✅ Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat) => (
          <Card key={stat.label}>
            <div className="text-gray-600">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </Card>
        ))}
      </div>

      {/* Additional dashboard sections below */}
    </div>
  )
}

export default AdminDashboard
```

### 1.3 Update Analytics Service

**Open:** `src/services/analyticsService.ts`

Find this (BEFORE):
```typescript
const mockData = {
  dashboard: [
    { label: 'Total Guests', value: 1234 },
    // ...
  ]
}

export const analyticsService = {
  getDashboard: () => Promise.resolve(mockData.dashboard),
}
```

Replace with (AFTER):
```typescript
import { apiClient } from './apiClient'

export const analyticsService = {
  // ✅ Real API call instead of mock
  getDashboard: async () => {
    const response = await apiClient.get('/analytics/dashboard')
    return response.data
  },

  getGuestAnalytics: async (filters?: object) => {
    const response = await apiClient.get('/analytics/guests', { params: filters })
    return response.data
  },

  getRevenueAnalytics: async (dateRange?: { from: string; to: string }) => {
    const response = await apiClient.get('/analytics/revenue', { params: dateRange })
    return response.data
  },
}
```

### 1.4 Checklist: AdminDashboard Done ✅

- [ ] Imported `useQuery` hook
- [ ] Imported `LoadingSpinner`, `ErrorAlert` components
- [ ] Replaced `useState` with `useQuery` call
- [ ] Added error and loading states
- [ ] Added refresh button with `refetch` function
- [ ] Updated `analyticsService.getDashboard()` to use real API
- [ ] Verified in browser: Page loads, shows stats or error
- [ ] DevTools Network tab: See `/api/analytics/dashboard` call
- [ ] Auto-refresh works (check Network tab after 30s)

---

## 🔧 TASK 2: GuestsList Integration (3-4 hours)

### 2.1 Current State Analysis

**Open:** `src/pages/GuestsList.tsx`

Find this pattern (BEFORE):
```typescript
const GuestsList = () => {
  const [guests] = useState([
    { id: 1, name: 'John', email: 'john@example.com', points: 100 },
    // ... mock data
  ])
  const [page, setPage] = useState(1)

  return (
    <div>
      <h1>Guests</h1>
      <table>
        <tbody>
          {guests.map(guest => (
            <tr key={guest.id}>
              <td>{guest.name}</td>
              <td>{guest.email}</td>
              <td>{guest.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* No pagination */}
    </div>
  )
}
```

### 2.2 Reference: Complete Example

**See:** `src/pages/GuestsList.example.tsx` (Already created in Phase 2A)

This file has the COMPLETE working pattern. Copy from it!

### 2.3 Replace with Real API + Pagination + Search

**Update to (AFTER):**
```typescript
import { useState } from 'react'
import { useQuery } from '../hooks/useQuery'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { EmptyState } from '../components/EmptyState'
import { Pagination } from '../components/Pagination'
import { SearchInput } from '../components/SearchInput'
import { guestService } from '../services/guestService'

interface QueryParams {
  page: number
  limit: number
  search?: string
}

const GuestsList = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [limit] = useState(20)

  // ✅ Build query params
  const queryParams: QueryParams = {
    page,
    limit,
    ...(search && { search }),
  }

  // ✅ Fetch data with useQuery
  const { data, loading, error, refetch } = useQuery(
    () => guestService.getGuests(queryParams),
    {
      retryCount: 3,
      retryDelay: 1000,
      dependencies: [page, search, limit], // ⚠️ Important: refetch when params change
    }
  )

  // ✅ Handle loading
  if (loading) {
    return <LoadingSpinner text="Loading guests..." />
  }

  // ✅ Handle error
  if (error) {
    return (
      <ErrorAlert
        error={error}
        onRetry={refetch}
      />
    )
  }

  // ✅ Handle empty state
  if (!data?.guests || data.guests.length === 0) {
    return (
      <EmptyState
        title="No guests yet"
        description="Create your first guest to get started"
        action={() => {/* navigate to create */}}
        buttonLabel="Create Guest"
      />
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Guests</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Guest
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchInput
          placeholder="Search by name, email..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Points</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.guests.map((guest) => (
              <tr key={guest.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{guest.name}</td>
                <td className="px-6 py-4 text-sm">{guest.email}</td>
                <td className="px-6 py-4 text-sm">{guest.phone}</td>
                <td className="px-6 py-4 text-sm font-semibold">{guest.points}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    {guest.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <button className="text-blue-500 hover:text-blue-700 mr-4">
                    Edit
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Info */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {data.guests.length} of {data.total} guests
      </div>
    </div>
  )
}

export default GuestsList
```

### 2.4 Update Guest Service

**Open:** `src/services/guestService.ts`

Find this (BEFORE):
```typescript
const mockGuests = [
  { id: 1, name: 'John', email: 'john@example.com', points: 100 },
  // ...
]

export const guestService = {
  getGuests: () => Promise.resolve(mockGuests),
}
```

Replace with (AFTER):
```typescript
import { apiClient } from './apiClient'

interface GetGuestsParams {
  page?: number
  limit?: number
  search?: string
}

interface GuestsResponse {
  guests: Array<{
    id: string
    name: string
    email: string
    phone: string
    points: number
    status: string
    createdAt: string
  }>
  total: number
  page: number
  limit: number
  totalPages: number
}

export const guestService = {
  // ✅ Real API call with pagination & search
  getGuests: async (params?: GetGuestsParams): Promise<GuestsResponse> => {
    const response = await apiClient.get('/guests', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        ...(params?.search && { search: params.search }),
      },
    })
    return response.data
  },

  getGuest: async (id: string) => {
    const response = await apiClient.get(`/guests/${id}`)
    return response.data
  },

  createGuest: async (data: object) => {
    const response = await apiClient.post('/guests', data)
    return response.data
  },

  updateGuest: async (id: string, data: object) => {
    const response = await apiClient.put(`/guests/${id}`, data)
    return response.data
  },

  deleteGuest: async (id: string) => {
    await apiClient.delete(`/guests/${id}`)
  },

  getGuestHistory: async (id: string) => {
    const response = await apiClient.get(`/guests/${id}/history`)
    return response.data
  },
}
```

### 2.5 Checklist: GuestsList Done ✅

- [ ] Imported `useQuery`, `useState`
- [ ] Imported all UI components (LoadingSpinner, ErrorAlert, EmptyState, Pagination, SearchInput)
- [ ] Added state for `page`, `search`, `limit`
- [ ] Built `queryParams` object
- [ ] Called `useQuery` with proper `dependencies` array
- [ ] Added loading state handling
- [ ] Added error state handling
- [ ] Added empty state handling
- [ ] Rendered table with guest data
- [ ] Added Pagination component
- [ ] Added SearchInput component
- [ ] Updated `guestService.getGuests()` to call real API
- [ ] Verified pagination works: Change page, see new data
- [ ] Verified search works: Type something, see filtered results
- [ ] Verified loading spinner shows while fetching
- [ ] DevTools Network: See correct `/api/guests?page=1&limit=20&search=...` calls

---

## 🧪 TESTING: Verify Everything Works

### Test 1: AdminDashboard
```
1. Go to http://localhost:5173/admin/dashboard
2. See: LoadingSpinner briefly appears
3. See: Stats cards with real data load
4. See: Network tab shows /api/analytics/dashboard call
5. Click "Refresh" button
6. See: Data reloads
7. Wait 30 seconds
8. See: Auto-refresh happens (check Network tab)
```

### Test 2: GuestsList
```
1. Go to http://localhost:5173/guests
2. See: LoadingSpinner briefly appears
3. See: Table with guests loads
4. See: Pagination controls at bottom
5. Type in search box
6. See: Table updates with filtered results
7. Click page 2
8. See: Different guests load
9. Network tab shows correct params: ?page=2&limit=20&search=...
```

### Test 3: Error Handling
```
1. In browser DevTools, set Network throttling to "Offline"
2. Refresh AdminDashboard page
3. See: ErrorAlert appears with retry button
4. Set throttling back to "Online"
5. Click "Retry" button
6. See: Data loads successfully
```

---

## 🛠️ Common Issues & Fixes

### Issue 1: "Cannot find module useQuery"
**Fix:** Make sure Phase 2A infrastructure exists:
```bash
ls src/hooks/useQuery.ts
ls src/hooks/useMutation.ts
```

If missing, refer back to Phase 2A documentation.

### Issue 2: API calls return 404
**Symptom:** Network tab shows red errors
**Fix:** Verify backend is running:
```bash
# In another terminal, check backend
curl http://localhost:3000/api/guests
# Should return data (not 404)
```

### Issue 3: CORS errors
**Symptom:** Browser console shows "blocked by CORS"
**Fix:** Backend needs CORS headers:
```typescript
// In backend: app.use(cors())
// Or configure specific origin:
app.use(cors({ origin: 'http://localhost:5173' }))
```

### Issue 4: Data not showing in table
**Symptom:** Table renders but empty
**Fix:** Check API response structure:
```typescript
// In browser console:
// Go to Network tab → Click API call → Response tab
// Verify response has structure:
// { guests: [...], total: X, totalPages: Y }
```

### Issue 5: Search not working
**Symptom:** Type in search box, nothing changes
**Fix:** Make sure `dependencies` array includes `search`:
```typescript
const { data } = useQuery(
  () => guestService.getGuests(queryParams),
  {
    dependencies: [page, search, limit], // ✅ Must include search
  }
)
```

---

## 📊 Progress Checklist

```
✅ Day 1 (Today): AdminDashboard + GuestsList
  ├─ [ ] AdminDashboard integrated (2-3 hours)
  │  ├─ [ ] useQuery integrated
  │  ├─ [ ] Loading spinner works
  │  ├─ [ ] Error handling works
  │  ├─ [ ] Refresh button works
  │  └─ [ ] Auto-refresh works
  │
  └─ [ ] GuestsList integrated (3-4 hours)
     ├─ [ ] useQuery + pagination working
     ├─ [ ] Search functionality working
     ├─ [ ] Loading spinner works
     ├─ [ ] Error handling works
     ├─ [ ] Empty state works
     └─ [ ] All tests pass

📊 Next:
  → Day 2 (Tomorrow): RestaurantsList + BillingManagement + AnalyticsPage (6 hours)
  → Day 3: PointsOperations + ScanCard + Deploy (8 hours)
```

---

## 🚀 When Complete

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: Integrate AdminDashboard + GuestsList with real API (Phase 2B Day 1)"
   git push origin main
   ```

2. **Create PR comment:**
   - Link to this guide
   - Screenshot of working pages
   - Test results

3. **Ready for next day!**

---

## 📞 Help Resources

- **Phase 2A Docs:** [PHASE2_API_INTEGRATION.md](./docs/PHASE2_API_INTEGRATION.md)
- **Example:** [GuestsList.example.tsx](./src/pages/GuestsList.example.tsx)
- **useQuery Reference:** Check `src/hooks/useQuery.ts`
- **API Reference:** Check `src/services/apiClient.ts`

---

**Good luck! You got this! 💪**

After completing, move to [PHASE2B_DAY2_EXECUTION.md](./PHASE2B_DAY2_EXECUTION.md)
