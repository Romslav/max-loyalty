# Phase 1: Authentication & RBAC Implementation Guide

## Overview
This document covers the implementation of Phase 1 authentication system and role-based access control (RBAC).

## Architecture

### Components Created

#### Services
- **authService.ts** - JWT token management, login, register, token refresh
- **guestService.ts** - Guest CRUD operations
- **operationService.ts** - Points operations management
- **analyticsService.ts** - Business analytics
- **restaurantService.ts** - Restaurant management
- **billingService.ts** - Invoice and billing management

#### Stores
- **authStore.ts** - Zustand store for authentication state

#### Hooks
- **useAuth.ts** - Authentication hook
- **usePermissions.ts** - RBAC permission checking

#### Components
- **ProtectedRoute.tsx** - Route protection based on auth and permissions
- **PublicRoute.tsx** - Public page routing
- **CanAccess.tsx** - Conditional rendering based on permissions

#### Pages
- **LoginPage.tsx** - User login page
- **RegisterPage.tsx** - User registration page

#### Middleware
- **axiosInterceptor.ts** - Automatic token refresh and error handling

## Setup Instructions

### 1. Install Dependencies

```bash
npm install axios zustand
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local` and update:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Max Loyalty
VITE_APP_VERSION=4.0.0
```

### 3. Initialize Auth in App.tsx

```typescript
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
import { setupAxiosInterceptors } from './middleware/axiosInterceptor'

function App() {
  useEffect(() => {
    const { initializeAuth } = useAuthStore.getState()
    initializeAuth()
  }, [])

  return (
    // Your app routes
  )
}
```

### 4. Setup Router with Protected Routes

```typescript
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { AdminDashboard } from './pages/AdminDashboard'

const routes = [
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]
```

## Usage Examples

### Using useAuth Hook

```typescript
import { useAuth } from './hooks/useAuth'

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth()

  const handleLogin = async () => {
    await login({
      email: 'user@example.com',
      password: 'password123',
    })
  }

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin} disabled={isLoading}>
          Login
        </button>
      )}
    </div>
  )
}
```

### Using usePermissions Hook

```typescript
import { usePermissions } from './hooks/usePermissions'

function AdminFeature() {
  const { hasPermission, isAdmin } = usePermissions()

  if (!hasPermission('user:write')) {
    return <div>You don't have permission to access this feature</div>
  }

  return <div>Admin Feature</div>
}
```

### Using CanAccess Component

```typescript
import { CanAccess } from './components/CanAccess'

function Dashboard() {
  return (
    <div>
      <CanAccess permission="analytics:read">
        <AnalyticsSection />
      </CanAccess>

      <CanAccess role={['admin', 'restaurant']}>
        <SettingsSection />
      </CanAccess>

      <CanAccess
        permission={['user:read', 'user:write']}
        requireAll={true}
      >
        <UserManagement />
      </CanAccess>
    </div>
  )
}
```

## Role-Based Access Control (RBAC)

### Roles

#### Admin
- Full access to all features
- Can manage users, restaurants, guests, and billing
- Can view all analytics

**Permissions:**
- `user:*` (read, write, delete)
- `restaurant:*`
- `guest:*`
- `analytics:read`
- `billing:*`
- `audit:read`
- `settings:*`
- `support:*`

#### Restaurant Owner
- Can manage own restaurant
- Can manage guests and points
- Can view own analytics

**Permissions:**
- `restaurant:read`
- `guest:read`, `guest:write`
- `analytics:read`
- `billing:read`
- `operations:read`, `operations:write`

#### Cashier
- Can process points operations
- Can view guests and analytics

**Permissions:**
- `guest:read`
- `operations:read`, `operations:write`
- `analytics:read`

#### Guest
- Can view own profile
- Can view own points

**Permissions:**
- `guest:read`
- `profile:read`, `profile:write`

## Token Management

### Token Storage
- Access tokens: `localStorage` (short-lived, 1 hour)
- Refresh tokens: `localStorage` (long-lived, 7 days)
- User data: `localStorage` (cached)

### Token Refresh Flow
1. User logs in → receives access and refresh tokens
2. Axios interceptor checks token expiration on each request
3. If expired, automatically refresh using refresh token
4. If refresh fails, redirect to login

## API Endpoints Required

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new account
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout (optional)

### Guests
- `GET /api/guests` - List guests
- `POST /api/guests` - Create guest
- `GET /api/guests/:id` - Get guest
- `PUT /api/guests/:id` - Update guest
- `DELETE /api/guests/:id` - Delete guest
- `GET /api/guests/:id/history` - Get guest history

### Operations
- `GET /api/operations` - List operations
- `POST /api/operations` - Create operation
- `GET /api/operations/:id` - Get operation
- `GET /api/operations/stats` - Get statistics

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/guests` - Guest analytics
- `GET /api/analytics/revenue` - Revenue data
- `GET /api/analytics/points` - Points analytics
- `GET /api/analytics/export` - Export data

### Restaurants
- `GET /api/restaurants` - List restaurants
- `POST /api/restaurants` - Create restaurant
- `GET /api/restaurants/:id` - Get restaurant
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant
- `GET /api/restaurants/:id/guests` - Get restaurant guests

### Billing
- `GET /api/billing/invoices` - List invoices
- `POST /api/billing/invoices` - Create invoice
- `GET /api/billing/invoices/:id` - Get invoice
- `PUT /api/billing/invoices/:id/pay` - Mark as paid
- `POST /api/billing/invoices/:id/send` - Send invoice email
- `GET /api/billing/invoices/:id/pdf` - Download PDF

## Security Considerations

### JWT Token Security
- Tokens stored in localStorage (client-side)
- HTTPS recommended for production
- Short-lived access tokens (1 hour)
- Long-lived refresh tokens (7 days)

### RBAC Security
- Permissions checked on both frontend and backend
- Backend must validate permissions for every request
- Never trust client-side permission checks alone

### CSRF Protection
- Implement CSRF tokens on backend
- Use SameSite cookie attribute

### XSS Prevention
- Sanitize all user inputs
- Use React's built-in XSS protection
- Content Security Policy (CSP) headers

## Testing

### Run Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:coverage
```

## Next Steps

1. **Backend Implementation**
   - Implement JWT endpoints
   - Set up database schema
   - Implement permission checks

2. **Frontend Integration**
   - Replace mock data with API calls
   - Complete remaining pages
   - Add error handling

3. **Testing**
   - Write integration tests
   - Write E2E tests
   - Security testing

4. **Deployment**
   - Configure environment variables
   - Set up CI/CD pipeline
   - Production build and deployment

## Troubleshooting

### Token Refresh Issues
- Check refresh token expiration
- Verify backend refresh endpoint
- Clear localStorage and re-login

### Permission Denied Errors
- Verify user role in auth store
- Check permission configuration
- Review backend permission checks

### Login Fails
- Verify API URL in .env
- Check API endpoint implementation
- Review error messages in console

## References

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com/)
