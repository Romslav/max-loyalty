# 🚀 PHASE 2B - DAY 2 EXECUTION GUIDE

**Date:** January 20, 2026  
**Goal:** Integrate 3 more pages with real API  
**Time:** 6 hours  
**Tasks:** RestaurantsList + BillingManagement + AnalyticsPage  
**Status:** TODAY AFTER DAY 1 ✅

---

## 📋 TODAY'S MISSION

```
✅ BEFORE (Current State):
├─ RestaurantsList.tsx → Mock data
├─ BillingManagement.tsx → Mock data
└─ AnalyticsPage.tsx → Mock data

🎯 AFTER (Target State):
├─ RestaurantsList.tsx → useQuery + Pagination + Search
├─ BillingManagement.tsx → useQuery + Pagination + Search
└─ AnalyticsPage.tsx → Multiple useQuery calls

✅ DELIVERABLES:
- 3 pages fully integrated
- All API calls working
- All services updated
- Ready for Day 3
```

---

## 🎬 QUICK START: Copy-Paste Pattern from Day 1

Yesterday (Day 1), you learned the pattern:
```typescript
const { data, loading, error, refetch } = useQuery(
  () => serviceFunction(params),
  { retryCount: 3, dependencies: [page, search] }
)

if (loading) return <LoadingSpinner />
if (error) return <ErrorAlert onRetry={refetch} />
if (!data?.items?.length) return <EmptyState />

// Render table + pagination + search
```

**Today: Apply same pattern to 3 pages.** Same code structure, different data.

---

## 🔧 TASK 1: RestaurantsList Integration (1.5 hours)

### 1.1 File to Update
`src/pages/RestaurantsList.tsx`

### 1.2 Copy This Pattern

```typescript
import { useState } from 'react'
import { useQuery } from '../hooks/useQuery'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { EmptyState } from '../components/EmptyState'
import { Pagination } from '../components/Pagination'
import { SearchInput } from '../components/SearchInput'
import { restaurantService } from '../services/restaurantService'

const RestaurantsList = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [limit] = useState(20)

  const { data, loading, error, refetch } = useQuery(
    () => restaurantService.getRestaurants({ page, limit, search }),
    { retryCount: 3, dependencies: [page, search, limit] }
  )

  if (loading) return <LoadingSpinner text="Loading restaurants..." />
  if (error) return <ErrorAlert error={error} onRetry={refetch} />
  if (!data?.restaurants?.length) return <EmptyState />

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Restaurants</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Add Restaurant</button>
      </div>

      <div className="mb-6">
        <SearchInput
          placeholder="Search restaurants..."
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Owner</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Guests</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.restaurants.map((restaurant) => (
              <tr key={restaurant.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{restaurant.name}</td>
                <td className="px-6 py-4 text-sm">{restaurant.owner}</td>
                <td className="px-6 py-4 text-sm">{restaurant.email}</td>
                <td className="px-6 py-4 text-sm">{restaurant.guestCount}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    {restaurant.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <button className="text-blue-500 hover:text-blue-700 mr-4">Edit</button>
                  <button className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {data.restaurants.length} of {data.total} restaurants
      </div>
    </div>
  )
}

export default RestaurantsList
```

### 1.3 Update Service: restaurantService.ts

```typescript
import { apiClient } from './apiClient'

export const restaurantService = {
  getRestaurants: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await apiClient.get('/restaurants', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        ...(params?.search && { search: params.search }),
      },
    })
    return response.data
  },

  getRestaurant: async (id: string) => {
    const response = await apiClient.get(`/restaurants/${id}`)
    return response.data
  },

  createRestaurant: async (data: object) => {
    const response = await apiClient.post('/restaurants', data)
    return response.data
  },

  updateRestaurant: async (id: string, data: object) => {
    const response = await apiClient.put(`/restaurants/${id}`, data)
    return response.data
  },

  deleteRestaurant: async (id: string) => {
    await apiClient.delete(`/restaurants/${id}`)
  },
}
```

### 1.4 Checklist: RestaurantsList Done ✅

- [ ] Page loads with LoadingSpinner
- [ ] Data displays in table
- [ ] Pagination works
- [ ] Search works
- [ ] Error handling works
- [ ] Service updated with real API

---

## 🔧 TASK 2: BillingManagement Integration (2 hours)

### 2.1 File to Update
`src/pages/BillingManagement.tsx`

### 2.2 Copy This Pattern

```typescript
import { useState } from 'react'
import { useQuery } from '../hooks/useQuery'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { EmptyState } from '../components/EmptyState'
import { Pagination } from '../components/Pagination'
import { SearchInput } from '../components/SearchInput'
import { billingService } from '../services/billingService'

const BillingManagement = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [limit] = useState(20)
  const [status, setStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all')

  const { data, loading, error, refetch } = useQuery(
    () => billingService.getInvoices({ page, limit, search, status: status !== 'all' ? status : undefined }),
    { retryCount: 3, dependencies: [page, search, limit, status] }
  )

  if (loading) return <LoadingSpinner text="Loading invoices..." />
  if (error) return <ErrorAlert error={error} onRetry={refetch} />
  if (!data?.invoices?.length) return <EmptyState />

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Billing</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Create Invoice</button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <SearchInput
          placeholder="Search invoices..."
          value={search}
          onChange={setSearch}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="px-4 py-2 border rounded"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Invoice ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Restaurant</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Due Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{invoice.id}</td>
                <td className="px-6 py-4 text-sm">{invoice.restaurantName}</td>
                <td className="px-6 py-4 text-sm font-semibold">${invoice.amount}</td>
                <td className="px-6 py-4 text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(invoice.status)}`}>
                    {invoice.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <button className="text-blue-500 hover:text-blue-700 mr-4">View</button>
                  {invoice.status === 'pending' && (
                    <button className="text-green-500 hover:text-green-700">Pay</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {data.invoices.length} of {data.total} invoices
      </div>
    </div>
  )
}

export default BillingManagement
```

### 2.3 Update Service: billingService.ts

```typescript
import { apiClient } from './apiClient'

export const billingService = {
  getInvoices: async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const response = await apiClient.get('/billing/invoices', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        ...(params?.search && { search: params.search }),
        ...(params?.status && { status: params.status }),
      },
    })
    return response.data
  },

  getInvoice: async (id: string) => {
    const response = await apiClient.get(`/billing/invoices/${id}`)
    return response.data
  },

  createInvoice: async (data: object) => {
    const response = await apiClient.post('/billing/invoices', data)
    return response.data
  },

  payInvoice: async (id: string) => {
    const response = await apiClient.put(`/billing/invoices/${id}/pay`, {})
    return response.data
  },

  updateInvoice: async (id: string, data: object) => {
    const response = await apiClient.put(`/billing/invoices/${id}`, data)
    return response.data
  },

  deleteInvoice: async (id: string) => {
    await apiClient.delete(`/billing/invoices/${id}`)
  },
}
```

### 2.4 Checklist: BillingManagement Done ✅

- [ ] Page loads with LoadingSpinner
- [ ] Data displays in table
- [ ] Pagination works
- [ ] Search works
- [ ] Status filter works
- [ ] Error handling works
- [ ] Service updated with real API

---

## 🔧 TASK 3: AnalyticsPage Integration (2.5 hours)

### 3.1 File to Update
`src/pages/AnalyticsPage.tsx`

### 3.2 Key Difference: Multiple useQuery Calls

**Unlike previous pages, AnalyticsPage needs to fetch multiple datasets:**

```typescript
const { data: guestStats } = useQuery(() => analyticsService.getGuestAnalytics())
const { data: revenueStats } = useQuery(() => analyticsService.getRevenueAnalytics())
const { data: trendData } = useQuery(() => analyticsService.getTrends())
```

### 3.3 Copy This Pattern

```typescript
import { useQuery } from '../hooks/useQuery'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { analyticsService } from '../services/analyticsService'

const AnalyticsPage = () => {
  // ✅ Multiple data sources
  const { data: guestStats, loading: loadingGuests, error: errorGuests, refetch: refetchGuests } = useQuery(
    () => analyticsService.getGuestAnalytics()
  )

  const { data: revenueStats, loading: loadingRevenue, error: errorRevenue, refetch: refetchRevenue } = useQuery(
    () => analyticsService.getRevenueAnalytics()
  )

  const { data: operationStats, loading: loadingOps, error: errorOps, refetch: refetchOps } = useQuery(
    () => analyticsService.getOperationStats()
  )

  // ✅ Check if any loading
  const loading = loadingGuests || loadingRevenue || loadingOps
  const hasError = errorGuests || errorRevenue || errorOps

  if (loading) return <LoadingSpinner text="Loading analytics..." />
  if (hasError) return <ErrorAlert error={hasError} onRetry={() => { refetchGuests(); refetchRevenue(); refetchOps() }} />

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* Guest Analytics Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Guest Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guestStats?.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm">{stat.label}</div>
              <div className="text-3xl font-bold mt-2">{stat.value}</div>
              <div className="text-green-600 text-sm mt-2">↑ {stat.change}% from last month</div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Analytics Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Revenue Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {revenueStats?.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm">{stat.label}</div>
              <div className="text-3xl font-bold mt-2">${stat.value}</div>
              <div className="text-green-600 text-sm mt-2">↑ {stat.change}% from last month</div>
            </div>
          ))}
        </div>
      </div>

      {/* Operations Analytics Section */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Operations Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {operationStats?.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm">{stat.label}</div>
              <div className="text-3xl font-bold mt-2">{stat.value}</div>
              <div className="text-green-600 text-sm mt-2">↑ {stat.change}% from last month</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
```

### 3.4 Update Service: analyticsService.ts (Add Missing Methods)

```typescript
import { apiClient } from './apiClient'

export const analyticsService = {
  getDashboard: async () => {
    const response = await apiClient.get('/analytics/dashboard')
    return response.data
  },

  getGuestAnalytics: async () => {
    const response = await apiClient.get('/analytics/guests')
    return response.data
  },

  getRevenueAnalytics: async () => {
    const response = await apiClient.get('/analytics/revenue')
    return response.data
  },

  getOperationStats: async () => {
    const response = await apiClient.get('/analytics/operations')
    return response.data
  },

  getTrends: async () => {
    const response = await apiClient.get('/analytics/trends')
    return response.data
  },
}
```

### 3.5 Checklist: AnalyticsPage Done ✅

- [ ] Page loads with LoadingSpinner
- [ ] Guest analytics section displays
- [ ] Revenue analytics section displays
- [ ] Operations analytics section displays
- [ ] All useQuery calls work
- [ ] Error handling works for all datasets
- [ ] Refetch works for all datasets
- [ ] Service updated with real API

---

## 🧪 TESTING: Verify All 3 Pages

### Quick Test Checklist
```
🔍 RestaurantsList
  [ ] Load page
  [ ] See LoadingSpinner
  [ ] See table with data
  [ ] Search works
  [ ] Pagination works
  [ ] No console errors

🔍 BillingManagement
  [ ] Load page
  [ ] See LoadingSpinner
  [ ] See table with invoices
  [ ] Search works
  [ ] Status filter works
  [ ] Pagination works
  [ ] No console errors

🔍 AnalyticsPage
  [ ] Load page
  [ ] See LoadingSpinner
  [ ] See all 3 analytics sections
  [ ] All data displays correctly
  [ ] No console errors
```

---

## 📊 Progress Summary

```
✅ Day 1 (Yesterday): AdminDashboard + GuestsList - COMPLETE
✅ Day 2 (Today): RestaurantsList + BillingManagement + AnalyticsPage - IN PROGRESS
  ├─ [ ] RestaurantsList (1.5h)
  ├─ [ ] BillingManagement (2h)
  └─ [ ] AnalyticsPage (2.5h)

📊 Next:
  → Day 3: PointsOperations + ScanCard + Deploy (8 hours)
```

---

## 🚀 When Complete

1. **Commit:**
   ```bash
   git add .
   git commit -m "feat: Integrate RestaurantsList + BillingManagement + AnalyticsPage (Phase 2B Day 2)"
   git push origin main
   ```

2. **Test all 3 pages in browser**

3. **Ready for Day 3!**

---

**You're halfway through Phase 2B! Keep going! 💪**

Next: [PHASE2B_DAY3_EXECUTION.md](./PHASE2B_DAY3_EXECUTION.md)
