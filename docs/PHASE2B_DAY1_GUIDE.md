# 🚀 PHASE 2B DAY 1 — IMPLEMENTATION GUIDE

**Date**: January 19, 2026  
**Target**: Replace mock data → Real API in AdminDashboard + GuestsList  
**Timeline**: 6 hours  
**Status**: ✅ Code templates ready

---

## 📋 WHAT GETS CREATED TODAY

```
✅ AdminDashboard.tsx    - Real API integration with useQuery
✅ GuestsList.tsx        - Pagination + Search + Real API
✅ useQuery.ts           - Production-ready hook (retry/refresh/deps)
✅ useRefresh.ts         - Auto-refresh interval hook
✅ analyticsService.ts   - API calls for dashboard data
✅ guestService.ts       - API calls for guest list data
✅ Pagination.tsx        - Page navigation component
✅ SearchInput.tsx       - Debounced search component
```

---

## 🔥 IMPLEMENTATION STEPS

### STEP 1: Create Supporting Components (30 min)

**Already done:**
- ✅ `src/components/Pagination.tsx` — pagination logic
- ✅ `src/components/SearchInput.tsx` — search with debounce

**Check these exist:**
```bash
# In your project, verify these are present:
ls -la src/components/
```

Expected: `LoadingSpinner.tsx`, `ErrorAlert.tsx`, `Card.tsx`, `EmptyState.tsx`

If missing, create them:

```typescript
// src/components/LoadingSpinner.tsx
export const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="text-4xl mb-4">⏳</div>
    <p className="text-gray-600">{text}</p>
  </div>
)

// src/components/ErrorAlert.tsx
export const ErrorAlert = ({ error, title, onRetry }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <h3 className="font-semibold text-red-900">{title}</h3>
    <p className="text-red-700 text-sm mt-1">{error?.message}</p>
    <button onClick={onRetry} className="mt-3 px-4 py-2 bg-red-600 text-white rounded">
      Try Again
    </button>
  </div>
)

// src/components/EmptyState.tsx
export const EmptyState = ({ title, description, buttonLabel, action }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="text-6xl mb-4">🎯</div>
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    <p className="text-gray-600 mt-2 max-w-md text-center">{description}</p>
    <button onClick={action} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg">
      {buttonLabel}
    </button>
  </div>
)

// src/components/Card.tsx
export const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
)
```

---

### STEP 2: Create Hooks (20 min)

**Already done:**
- ✅ `src/hooks/useQuery.ts` — Main data-fetching hook with retry/refresh
- ✅ `src/hooks/useRefresh.ts` — Auto-refresh interval

**Verify they exist:**
```bash
ls -la src/hooks/useQuery.ts src/hooks/useRefresh.ts
```

---

### STEP 3: Create API Client (if not exists) (10 min)

```typescript
// src/config/apiClient.ts
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

### STEP 4: Create Services (10 min)

**Already done:**
- ✅ `src/services/analyticsService.ts` — Dashboard data
- ✅ `src/services/guestService.ts` — Guest list with pagination

**Verify they exist:**
```bash
ls -la src/services/analyticsService.ts src/services/guestService.ts
```

---

### STEP 5: Update Pages (1.5 hours)

**Already done:**
- ✅ `src/pages/AdminDashboard.tsx` — With useQuery integration
- ✅ `src/pages/GuestsList.tsx` — With pagination + search

**Verify they exist:**
```bash
ls -la src/pages/AdminDashboard.tsx src/pages/GuestsList.tsx
```

---

### STEP 6: Setup .env (5 min)

```bash
# .env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Max Loyalty
VITE_APP_VERSION=4.0.0
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id  # Optional
```

---

## 🧪 TESTING CHECKLIST

### Phase 1: Local Testing

```bash
# Start dev server
npm run dev

# Visit pages in browser
http://localhost:5173/admin/dashboard
http://localhost:5173/guests
```

### Phase 2: Verify Components Load

- [ ] AdminDashboard shows loading spinner initially
- [ ] After 2-3 seconds, stats cards appear
- [ ] Refresh button works
- [ ] Auto-refresh happens every 30 seconds (check console logs)
- [ ] GuestsList shows loading spinner initially
- [ ] After 2-3 seconds, guest table appears
- [ ] Search box is present
- [ ] Pagination buttons are present

### Phase 3: Test Error Handling

```bash
# Simulate API failure:
# Comment out the API call and throw error instead

// In guestService.ts:
throw new Error('API temporarily unavailable')
```

- [ ] Error alert shows with retry button
- [ ] Retry button calls the request again
- [ ] Error message is user-friendly

### Phase 4: Test Pagination

- [ ] Click page number → data changes
- [ ] Previous/Next buttons work
- [ ] Current page is highlighted
- [ ] Cannot click outside valid page range
- [ ] URL params update (optional, depends on routing)

### Phase 5: Test Search

- [ ] Type in search box
- [ ] After 500ms delay, request fires
- [ ] Table updates with filtered results
- [ ] Clear button (×) clears search
- [ ] Pagination resets to page 1

### Phase 6: Test Auto-Refresh

```bash
# Open browser dev tools → Console
# Watch for logs like:
# ✅ Dashboard stats loaded: [...]
# Should appear every 30 seconds
```

- [ ] Dashboard auto-refreshes every 30 seconds
- [ ] Console logs show refresh happening
- [ ] No errors in console
- [ ] Page doesn't flicker on refresh

---

## 🚨 COMMON ISSUES & FIXES

### Issue 1: "Cannot find module 'apiClient'"

**Fix:**
```bash
# Check file exists:
ls -la src/config/apiClient.ts

# If not, create it from Step 3 above
```

### Issue 2: "useQuery is not defined"

**Fix:**
```bash
# Check hook exists:
ls -la src/hooks/useQuery.ts

# Import it correctly:
import { useQuery } from '../hooks/useQuery'
```

### Issue 3: "API returns 404 or 500"

**Check:**
```bash
# 1. Is backend running?
ps aux | grep node  # or your backend process

# 2. Is .env set correctly?
cat .env

# 3. Check browser dev tools → Network tab
# Click request → see actual URL and response
```

### Issue 4: "Data never loads (stuck on spinner)"

**Debug:**
```typescript
// In browser console:
const mockResponse = { guests: [...], total: 10, page: 1, limit: 20, totalPages: 1 }
// See if this structure matches your API response
```

**Fix:**
- Check API endpoint returns correct structure
- Check `guestService.ts` parseResponse logic
- Check Network tab in dev tools for actual response

### Issue 5: "Search/Pagination not working"

**Debug:**
```typescript
// In GuestsList.tsx, add console.logs:
console.log('Search value:', search)
console.log('Current page:', page)
console.log('Query params:', queryParams)

// Check if useQuery dependencies include page and search
// dependencies: [page, search, limit]
```

---

## 📊 WHAT THE FLOW LOOKS LIKE

```
User visits /admin/dashboard
        ↓
   Component renders
        ↓
   useQuery starts fetch
        ↓
   Show LoadingSpinner
        ↓
   analyticsService.getDashboard() called
        ↓
   API returns { stats: [...] }
        ↓
   Hide spinner, render stats cards
        ↓
   Every 30 seconds: auto-refresh
        ↓
   User clicks Refresh button → immediate refetch
        ↓
   User navigates away → cleanup intervals
```

---

## ✅ SUCCESS CRITERIA

```
✓ AdminDashboard loads without errors
✓ Stats cards display with real data
✓ Auto-refresh works (check console)
✓ GuestsList loads without errors
✓ Guest table displays with pagination
✓ Search filters guests
✓ Pagination navigates between pages
✓ Error handling shows friendly messages
✓ No console errors
✓ No TypeScript errors (npm run type-check)
```

---

## 🎯 NEXT: COMMIT & PUSH

```bash
# Verify all files are created
git status

# Stage changes
git add -A

# Commit
git commit -m "feat: Phase 2B Day 1 - Real API integration (AdminDashboard + GuestsList)"

# Push
git push origin main
```

---

## 📝 TIME BREAKDOWN

```
Step 1: Components         - 30 min (mostly already done)
Step 2: Hooks             - 20 min (✅ done)
Step 3: API Client        - 10 min (if needed)
Step 4: Services          - 10 min (✅ done)
Step 5: Pages             - 90 min (✅ done)
Step 6: .env              - 5 min
Step 7: Testing           - 30-45 min
Step 8: Bug fixes         - 15-30 min (if needed)

TOTAL: 4.5-5.5 hours ✅
```

---

## 🎓 WHAT YOU LEARNED

```
✅ useQuery hook pattern (retry/refresh/deps)
✅ Real API integration with services
✅ Pagination logic and component
✅ Debounced search
✅ Error handling in React
✅ Loading states and empty states
✅ Auto-refresh patterns
✅ TypeScript types for API responses
```

---

## 🚀 READY FOR DAY 2?

Once this is working, we'll do:
- **Day 2**: RestaurantsList + BillingManagement + AnalyticsPage (same pattern)

**Good luck! 💪**

