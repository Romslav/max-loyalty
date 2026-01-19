# Max Loyalty - Authentication Setup Guide

## 🎯 What's Been Implemented (Day 1)

### Core Authentication System
- ✅ JWT token-based authentication
- ✅ Refresh token mechanism
- ✅ Auto-refresh on 401 Unauthorized
- ✅ Protected routes with role-based access control (RBAC)
- ✅ Persistent authentication (localStorage)

### Services Created
```
src/services/
├── authService.ts          # Main auth service (JWT login, register, refresh)
├── apiClient.ts            # Axios with JWT interceptors
└── mockAuthService.ts      # Mock auth for development (NO BACKEND NEEDED)
```

### Components & Hooks
```
src/components/
└── ProtectedRoute.tsx      # Route protection with role checking

src/hooks/
└── useAuth.ts              # React hook for auth state

src/pages/
├── LoginPage.tsx           # Email/password login
├── RegisterPage.tsx        # Account registration with role selection
└── DashboardPage.tsx       # Protected dashboard page

src/stores/
└── authStore.ts            # Zustand auth state management

src/router/
└── index.tsx               # Router config with protected routes
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd max-loyalty
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

### 3. Login with Test Accounts

**Default test accounts available:**

🔐 **Admin Account**
- Email: `admin@test.com`
- Password: `admin123`

🏪 **Restaurant Manager**
- Email: `restaurant@test.com`
- Password: `restaurant123`

💳 **Cashier Account**
- Email: `cashier@test.com`
- Password: `cashier123`

👥 **Guest Account**
- Email: `guest@test.com`
- Password: `guest123`

### 4. Or Register New Account
Use the registration form to create any account with any role.

## 🔄 How It Works

### Authentication Flow
```
LoginPage
  ↓
  → useAuth() hook
    ↓
    → authStore.login()
      ↓
      → authService.login() [calls API]
        ↓
        → apiClient sends request to /api/auth/login
          ↓
          → Success: Store token in localStorage
            Navigate to /dashboard
          ↓
          → Error: Show error message
```

### Protected Routes
```
Router checks ProtectedRoute
  ↓
  → Is user authenticated?
    ✅ YES → Render page (Outlet)
    ❌ NO → Redirect to /login
  ↓
  → Check required role?
    ✅ YES → Role matches? → Render page
    ❌ NO → Show "Access Denied"
```

### Token Refresh
```
API Request with expired token (401)
  ↓
  → apiClient interceptor detects 401
    ↓
    → Call refreshToken endpoint
      ↓
      → Success: Update token → Retry original request
      ↓
      → Error: Clear auth → Redirect to /login
```

## 📝 Environment Variables

Create `.env.local` file in project root:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Max Loyalty
VITE_APP_VERSION=4.0.0
```

## 🔗 API Endpoints (Backend Requirements)

When you have backend ready, implement these endpoints:

### POST `/api/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin" | "restaurant" | "cashier" | "guest",
    "restaurantId": "optional-for-staff"
  }
}
```

### POST `/api/auth/register`
**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "guest"
}
```

**Response:** Same as login

### POST `/api/auth/refresh`
**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "token": "new_token...",
  "refreshToken": "new_refresh_token..."
}
```

### GET `/api/auth/me`
**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin",
  "restaurantId": "optional"
}
```

## 🛠️ Development Notes

### Using Mock API
Currently using `mockAuthService` for development.

**To switch to real backend API:**
1. Update `src/services/authService.ts` API_URL
2. Implement backend endpoints (see above)
3. Remove mock data from `mockAuthService.ts`

### Token Storage
⚠️ **Important:** Tokens are stored in `localStorage`. For production:
- Consider using httpOnly cookies
- Implement proper CSRF protection
- Add token encryption

### Role-Based Access
Available roles:
- `admin` - Full platform access
- `restaurant` - Restaurant owner/manager
- `cashier` - Point of sale operations
- `guest` - Customer app access

To protect routes by role:
```tsx
<Route element={<ProtectedRoute requiredRole="admin" />}>
  <Route path="/admin" element={<AdminPanel />} />
</Route>

// Or multiple roles:
<Route element={<ProtectedRoute requiredRole={['admin', 'restaurant']} />}>
  <Route path="/settings" element={<Settings />} />
</Route>
```

## 📚 Next Steps

**Day 2:** API Integration
- Real API client setup
- Mock → Real API transition
- Error handling improvements

**Day 3:** RBAC & Permissions
- Permission-based component rendering
- Audit logging
- Activity tracking

**Roadmap:** See `PRODUCTION_DEPLOYMENT_PLAN.md`

## 🐛 Troubleshooting

### "Token not persisting"
- Check localStorage in DevTools (F12 → Application tab)
- Verify `initializeAuth()` is called in App.tsx

### "401 Unauthorized loop"
- Check refresh token expiration
- Verify API returns correct token format
- Check apiClient interceptor logic

### "ProtectedRoute not working"
- Verify Outlet usage in router
- Check useAuth hook initialization
- Look at console for auth state logs

## 📞 Support

For issues or questions, check:
- GitHub issues
- Commit messages for implementation details
- PRODUCTION_DEPLOYMENT_PLAN.md for roadmap
