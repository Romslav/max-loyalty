# 🚀 PHASE 2B - DAY 3 EXECUTION GUIDE

**Date:** January 21, 2026  
**Goal:** Complete API integration + Deploy to Staging  
**Time:** 8 hours  
**Tasks:** PointsOperations + ScanCard + Deploy  
**Status:** FINAL DAY OF PHASE 2B

---

## 📋 TODAY'S MISSION

```
✅ BEFORE (Current State):
├─ PointsOperations.tsx → Mock form
├─ ScanCard.tsx → Mock scanning
└─ Deployed: Nowhere

🎯 AFTER (Target State):
├─ PointsOperations.tsx → useMutation for creating operations
├─ ScanCard.tsx → useQuery + useMutation for card scanning
└─ Deployed: Staging environment 🚀

✅ DELIVERABLES:
- 2 pages with forms working
- useMutation integrated
- All 7 pages in Phase 2B working
- Deployed to staging
- PR ready for review
```

---

## 🎬 QUICK START: Difference Today

**Days 1-2:** Used `useQuery` for data fetching (GET)  
**Day 3:** Uses `useMutation` for actions (POST/PUT/DELETE)

**Pattern difference:**
```typescript
// Yesterday (useQuery):
const { data, loading, error } = useQuery(() => service.getX())

// Today (useMutation):
const { mutate, loading, error } = useMutation((data) => service.createX(data))

// Usage:
const handleSubmit = async (formData) => {
  await mutate(formData)
  // Handle success
}
```

---

## 🔧 TASK 1: PointsOperations Integration (2 hours)

### 1.1 File to Update
`src/pages/PointsOperations.tsx`

### 1.2 Copy This Pattern

```typescript
import { useState } from 'react'
import { useQuery } from '../hooks/useQuery'
import { useMutation } from '../hooks/useMutation'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { guestService } from '../services/guestService'
import { operationService } from '../services/operationService'

const PointsOperations = () => {
  const [guestId, setGuestId] = useState('')
  const [points, setPoints] = useState('')
  const [operationType, setOperationType] = useState<'earn' | 'redeem'>('earn')
  const [description, setDescription] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // ✅ Fetch guests for dropdown
  const { data: guestsData, loading: loadingGuests } = useQuery(
    () => guestService.getGuests({ limit: 100 })
  )

  // ✅ Mutation for creating operation
  const { mutate: createOperation, loading: creatingOperation, error: operationError } = useMutation(
    async (formData: {
      guestId: string
      points: number
      type: string
      description: string
    }) => {
      const response = await operationService.createOperation(formData)
      return response
    }
  )

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!guestId || !points) {
      alert('Please fill all fields')
      return
    }

    try {
      await createOperation({
        guestId,
        points: parseInt(points),
        type: operationType,
        description,
      })

      // ✅ Success
      setSuccessMessage('Operation created successfully!')
      setGuestId('')
      setPoints('')
      setDescription('')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Operation failed:', error)
    }
  }

  if (loadingGuests) return <LoadingSpinner text="Loading guests..." />

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Points Operation</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded">
          ✅ {successMessage}
        </div>
      )}

      {/* Error */}
      {operationError && <ErrorAlert error={operationError} />}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        {/* Guest Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Guest</label>
          <select
            value={guestId}
            onChange={(e) => setGuestId(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a guest...</option>
            {guestsData?.guests?.map((guest: any) => (
              <option key={guest.id} value={guest.id}>
                {guest.name} ({guest.email})
              </option>
            ))}
          </select>
        </div>

        {/* Operation Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Operation Type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="earn"
                checked={operationType === 'earn'}
                onChange={(e) => setOperationType(e.target.value as any)}
                className="mr-2"
              />
              🎆 Earn Points
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="redeem"
                checked={operationType === 'redeem'}
                onChange={(e) => setOperationType(e.target.value as any)}
                className="mr-2"
              />
              🎁 Redeem Points
            </label>
          </div>
        </div>

        {/* Points Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Points</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            required
            placeholder="Enter number of points"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a note for this operation..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={creatingOperation}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {creatingOperation ? 'Creating...' : 'Create Operation'}
        </button>
      </form>
    </div>
  )
}

export default PointsOperations
```

### 1.3 Update Service: operationService.ts

```typescript
import { apiClient } from './apiClient'

export const operationService = {
  getOperations: async (params?: { page?: number; limit?: number; guestId?: string }) => {
    const response = await apiClient.get('/operations', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        ...(params?.guestId && { guestId: params.guestId }),
      },
    })
    return response.data
  },

  getOperation: async (id: string) => {
    const response = await apiClient.get(`/operations/${id}`)
    return response.data
  },

  // ✅ Create operation - useMutation
  createOperation: async (data: { guestId: string; points: number; type: string; description: string }) => {
    const response = await apiClient.post('/operations', data)
    return response.data
  },

  getStats: async () => {
    const response = await apiClient.get('/operations/stats')
    return response.data
  },
}
```

### 1.4 Checklist: PointsOperations Done ✅

- [ ] Form loads with guest dropdown
- [ ] Guest dropdown populated
- [ ] Operation type selection works
- [ ] Points input works
- [ ] Submit creates operation
- [ ] Success message shows
- [ ] Form clears on success
- [ ] Error handling works
- [ ] Service updated with real API

---

## 🔧 TASK 2: ScanCard Integration (2.5 hours)

### 2.1 File to Update
`src/pages/ScanCard.tsx`

### 2.2 Copy This Pattern

```typescript
import { useState } from 'react'
import { useQuery } from '../hooks/useQuery'
import { useMutation } from '../hooks/useMutation'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { guestService } from '../services/guestService'
import { operationService } from '../services/operationService'

const ScanCard = () => {
  const [cardNumber, setCardNumber] = useState('')
  const [scannedGuest, setScannedGuest] = useState<any>(null)
  const [points, setPoints] = useState('')
  const [operationType, setOperationType] = useState<'earn' | 'redeem'>('earn')
  const [successMessage, setSuccessMessage] = useState('')

  // ✅ Mutation for scanning card
  const { mutate: scanCard, loading: scanning, error: scanError } = useMutation(
    async (cardNum: string) => {
      const response = await guestService.getGuestByCard(cardNum)
      return response
    }
  )

  // ✅ Mutation for recording operation
  const { mutate: recordOperation, loading: recording, error: recordError } = useMutation(
    async (data: { guestId: string; points: number; type: string }) => {
      const response = await operationService.createOperation(data)
      return response
    }
  )

  // Handle card scan
  const handleScanCard = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cardNumber) {
      alert('Please enter card number')
      return
    }

    try {
      const guest = await scanCard(cardNumber)
      setScannedGuest(guest)
    } catch (error) {
      console.error('Scan failed:', error)
      setScannedGuest(null)
    }
  }

  // Handle operation submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!scannedGuest || !points) {
      alert('Please scan card and enter points')
      return
    }

    try {
      await recordOperation({
        guestId: scannedGuest.id,
        points: parseInt(points),
        type: operationType,
      })

      // ✅ Success
      setSuccessMessage(
        `🎉 ${operationType === 'earn' ? '+' : '-'}${points} points for ${scannedGuest.name}`
      )
      setCardNumber('')
      setPoints('')
      setScannedGuest(null)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Operation failed:', error)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Card Scanning</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded text-center">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scan Card Section */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold mb-6">Scan Card</h2>

          {scanError && <ErrorAlert error={scanError} />}

          <form onSubmit={handleScanCard} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Scan card or enter number..."
                autoFocus
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={scanning}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium"
            >
              {scanning ? 'Scanning...' : '🔍 Scan Card'}
            </button>
          </form>

          {/* Guest Info */}
          {scannedGuest && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="text-sm text-gray-600">Scanned Guest</div>
              <div className="text-lg font-bold mt-1">{scannedGuest.name}</div>
              <div className="text-sm text-gray-600 mt-1">{scannedGuest.email}</div>
              <div className="text-lg font-bold text-blue-600 mt-2">🎪 Points: {scannedGuest.points}</div>
            </div>
          )}
        </div>

        {/* Operation Section */}
        {scannedGuest && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-semibold mb-6">Record Operation</h2>

            {recordError && <ErrorAlert error={recordError} />}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Operation Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Operation Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="earn"
                      checked={operationType === 'earn'}
                      onChange={(e) => setOperationType(e.target.value as any)}
                      className="mr-2"
                    />
                    🎆 Earn
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="redeem"
                      checked={operationType === 'redeem'}
                      onChange={(e) => setOperationType(e.target.value as any)}
                      className="mr-2"
                    />
                    🎁 Redeem
                  </label>
                </div>
              </div>

              {/* Points Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Points</label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  placeholder="Enter points..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={recording}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 font-medium"
              >
                {recording ? 'Processing...' : '✅ Record Operation'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScanCard
```

### 2.3 Update Guest Service (Add Missing Method)

```typescript
// Add to guestService.ts:

export const guestService = {
  // ... existing methods ...

  // ✅ New: Scan card
  getGuestByCard: async (cardNumber: string) => {
    const response = await apiClient.get(`/guests/card/${cardNumber}`)
    return response.data
  },
}
```

### 2.4 Checklist: ScanCard Done ✅

- [ ] Card scan form works
- [ ] Guest info displays after scan
- [ ] Operation type selection works
- [ ] Points input works
- [ ] Record operation creates entry
- [ ] Success message shows
- [ ] Form resets on success
- [ ] Error handling works
- [ ] Service updated

---

## 🚀 TASK 3: Deploy to Staging (3 hours)

### 3.1 Verify All 7 Pages Work Locally

```bash
# 1. Run dev server
npm run dev

# 2. Test each page (go to http://localhost:5173):
# Day 1:
❌ http://localhost:5173/admin/dashboard        (AdminDashboard)
❌ http://localhost:5173/guests                 (GuestsList)
# Day 2:
❌ http://localhost:5173/restaurants            (RestaurantsList)
❌ http://localhost:5173/billing                (BillingManagement)
❌ http://localhost:5173/analytics              (AnalyticsPage)
# Day 3:
❌ http://localhost:5173/points-operations      (PointsOperations)
❌ http://localhost:5173/scan-card              (ScanCard)

# Each page should:
# ✅ Load successfully
# ✅ Show LoadingSpinner briefly
# ✅ Display real data (or EmptyState)
# ✅ Have working controls (pagination, search, filters)
# ✅ Show no console errors
```

### 3.2 Build for Production

```bash
# 1. Create production build
npm run build

# Expected output:
# ✅ dist/index.html
# ✅ dist/assets/*.js
# ✅ dist/assets/*.css
# Bundle size should be < 150KB

# 2. Preview build locally
npm run preview

# Visit http://localhost:5000
# Verify all pages still work
```

### 3.3 Commit & Create PR

```bash
# 1. Commit all changes
git add .
git commit -m "feat: Complete Phase 2B - Integrate all 7 pages with real API (AdminDashboard, GuestsList, RestaurantsList, BillingManagement, AnalyticsPage, PointsOperations, ScanCard)"

# 2. Push to main
git push origin main

# 3. Create Release tag
git tag v3.1.0-phase2b
git push origin v3.1.0-phase2b
```

### 3.4 Deploy to Staging

```bash
# Deploy options (choose one based on your setup):

# Option A: Vercel
vercel --prod

# Option B: Netlify
netlify deploy --prod

# Option C: Docker
docker build -t max-loyalty:v3.1.0 .
docker push your-registry/max-loyalty:v3.1.0

# Option D: Manual (SSH to server)
scp -r dist/* user@staging.example.com:/var/www/html/

# Verify deployment
curl https://staging.example.com
```

### 3.5 Deployment Checklist

```
✅ Pre-Deployment:
  [ ] All tests pass locally
  [ ] No console errors
  [ ] All 7 pages work
  [ ] Build size < 150KB

✅ Deployment:
  [ ] Build created (npm run build)
  [ ] Files uploaded/deployed
  [ ] Staging URL accessible
  [ ] All pages load
  [ ] API calls work
  [ ] No 404 errors

✅ Post-Deployment:
  [ ] Browser DevTools: No errors
  [ ] Network tab: All API calls 200 OK
  [ ] Lighthouse score run
  [ ] Mobile responsive check
  [ ] All features tested on staging
```

---

## 🧪 FINAL TESTING CHECKLIST

```
🔍 All 7 Pages Functional:
  ✅ Day 1:
    [ ] AdminDashboard loads data, auto-refreshes
    [ ] GuestsList pagination, search work
  ✅ Day 2:
    [ ] RestaurantsList pagination, search work
    [ ] BillingManagement filters, pagination work
    [ ] AnalyticsPage all sections display
  ✅ Day 3:
    [ ] PointsOperations form submits successfully
    [ ] ScanCard card scanning works

🔍 API Integration:
  [ ] All requests to real backend
  [ ] No mock data used
  [ ] Error handling works
  [ ] Loading states show
  [ ] Empty states show when needed

🔍 Deployment:
  [ ] Build successful
  [ ] Deployed to staging
  [ ] All pages accessible via URL
  [ ] No 404 errors
  [ ] API calls work on staging
```

---

## 📊 Final Progress

```
✅ Phase 2A: Infrastructure - COMPLETE (Jan 19)
  ├─ useQuery hook
  ├─ useMutation hook
  ├─ 5 UI components
  └─ Documentation

✅ Phase 2B: API Integration - COMPLETE (Jan 21)
  ├─ Day 1: AdminDashboard + GuestsList
  ├─ Day 2: RestaurantsList + BillingManagement + AnalyticsPage
  ├─ Day 3: PointsOperations + ScanCard + Deploy
  └─ 7 Pages fully integrated
  └─ Deployed to staging

🎯 Next:
  → Phase 3: Validation + Error Handling (Days 8-11)
  → Phase 4: Complete 5 pages (Days 12-13)
  → Phase 5: Real-time + Notifications (Days 14-16)
  → Phase 6: Tests + Performance (Days 17-21)
  → Production Ready: Feb 10 🚀
```

---

## 🚀 COMPLETION CHECKLIST

- [ ] All 7 pages working locally
- [ ] useMutation integrated (PointsOperations, ScanCard)
- [ ] All services updated with real API
- [ ] Build created successfully
- [ ] Deployed to staging
- [ ] Staging URL accessible
- [ ] All API calls working
- [ ] PR created with screenshots
- [ ] Ready for Phase 3

---

## 📞 Summary

**Phase 2B Complete!** 🎉

```
✅ AdminDashboard - useQuery + auto-refresh
✅ GuestsList - useQuery + Pagination + SearchInput
✅ RestaurantsList - useQuery + Pagination + SearchInput
✅ BillingManagement - useQuery + Pagination + Filters
✅ AnalyticsPage - Multiple useQuery calls
✅ PointsOperations - useMutation form
✅ ScanCard - useQuery + useMutation
✅ Deployed to Staging
✅ Production Ready Components: 7/7 (100%)
```

**Time Investment:** 20 hours  
**Code Quality:** Production-ready  
**Ready for:** Phase 3 (Validation + Error Handling)  

Let's celebrate and move to Phase 3! 🚀

Next: Read [ROADMAP.md](./ROADMAP.md) for Phase 3 planning.
