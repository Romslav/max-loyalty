# Authentication Flow & Token Management

## Overview

Complete authentication system with:
- useAuth composable for auth operations
- Token manager for token lifecycle
- Auth interceptor for automatic token injection
- Auth guards for route protection
- Session manager for idle timeout

## useAuth Composable

### Setup

```typescript
import { useAuth } from '@/presentation/composables';

const {
  isAuthenticated,
  user,
  isEmailVerified,
  isAdmin,
  isPremium,
  login,
  register,
  logout,
  refreshToken,
  verifyEmail,
  sendPasswordReset,
  resetPassword,
  updateProfile,
} = useAuth();
```

### Methods

#### Login

```typescript
const success = await auth.login('user@example.com', 'password123');
if (success) {
  console.log('User logged in');
}
```

#### Register

```typescript
const success = await auth.register(
  'newuser@example.com',
  'password123',
  'John Doe'
);
if (success) {
  console.log('Check email for verification');
}
```

#### Logout

```typescript
await auth.logout();
console.log('Logged out');
```

#### Email Verification

```typescript
const success = await auth.verifyEmail('verification-code-123');
```

#### Password Reset

```typescript
// Step 1: Send reset email
await auth.sendPasswordReset('user@example.com');

// Step 2: Reset with token from email
const success = await auth.resetPassword(
  'reset-token-from-email',
  'newpassword123'
);
```

#### Profile Update

```typescript
const success = await auth.updateProfile({
  fullName: 'Jane Doe',
  phone: '+1234567890',
});
```

#### Refresh Token

```typescript
const success = await auth.refreshToken();
```

### Computed Properties

```typescript
// Check if user is logged in
if (auth.isAuthenticated.value) {
  console.log('User is authenticated');
}

// Get current user
console.log(auth.user.value);
// {
//   id: 'user-123',
//   email: 'user@example.com',
//   fullName: 'John Doe',
//   role: 'user',
//   emailVerified: true,
//   createdAt: '2026-01-23T...',
// }

// Check roles
if (auth.isAdmin.value) {
  // Admin-only features
}

if (auth.isPremium.value) {
  // Premium features
}

if (auth.isEmailVerified.value) {
  // Email verified features
}
```

## Token Manager

### Storage & Retrieval

```typescript
import { tokenManager } from '@/infrastructure/services/token-manager';

// Set tokens
tokenManager.setTokens({
  access: 'access-token-...',
  refresh: 'refresh-token-...',
  expiresIn: 3600, // seconds
});

// Get tokens
const accessToken = tokenManager.getAccessToken();
const refreshToken = tokenManager.getRefreshToken();
const authHeader = tokenManager.getAuthHeader(); // "Bearer token-..."
```

### Checking Expiry

```typescript
if (tokenManager.isValid()) {
  // Token exists and not expired
}

if (tokenManager.isExpired()) {
  // Token has expired, need refresh
}

if (tokenManager.hasToken()) {
  // Token exists (may be expired)
}
```

### Token Decoding

```typescript
const token = tokenManager.getAccessToken();
const decoded = tokenManager.decodeToken(token);
// {
//   sub: 'user-123',
//   email: 'user@example.com',
//   role: 'user',
//   exp: 1642944000,
//   iat: 1642940400,
// }
```

### Clear Tokens

```typescript
tokenManager.clearTokens();
```

## Auth Interceptor

Automatically adds authorization header to all requests and handles token refresh on 401.

### Setup in main.ts

```typescript
import { authInterceptor } from '@/infrastructure/interceptors/auth-interceptor';

// Setup for fetch API
authInterceptor.setupFetchInterceptor();

// Or setup for axios
import axios from 'axios';
const axiosInstance = axios.create();
authInterceptor.setupAxiosInterceptor(axiosInstance);
```

### How it works

1. **Request:** Adds `Authorization: Bearer token` header
2. **Response 401:** Attempts to refresh token
3. **Success:** Retries original request with new token
4. **Failure:** Redirects to login

## Auth Guards

### Protected Routes

```typescript
import { AuthGuard } from '@/infrastructure/guards/auth-guard';

const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: AuthGuard.create(),
  },
  {
    path: '/admin',
    component: AdminPanel,
    beforeEnter: AuthGuard.createAdminGuard(),
  },
  {
    path: '/premium',
    component: PremiumFeatures,
    beforeEnter: AuthGuard.createPremiumGuard(),
  },
];
```

### Guest Routes

```typescript
{
  path: '/login',
  component: LoginPage,
  beforeEnter: AuthGuard.createGuestGuard(), // Redirects to /dashboard if logged in
}
```

### Email Verification

```typescript
{
  path: '/verify-email',
  component: VerifyEmailPage,
  beforeEnter: AuthGuard.createEmailVerificationGuard(),
}
```

### Custom Guards

```typescript
{
  path: '/special',
  component: SpecialPage,
  beforeEnter: AuthGuard.createCustomGuard(
    (authStore) => authStore.user.role === 'special'
  ),
}
```

## Session Manager

### Setup

```typescript
import { sessionManager } from '@/infrastructure/services/session-manager';

// Start session monitoring
sessionManager.start();

// Listen for session warning
window.addEventListener('session:warning', (event) => {
  const { timeRemaining } = event.detail;
  showWarning(`Session expires in ${timeRemaining / 1000 / 60} minutes`);
});

// Listen for session timeout
window.addEventListener('session:timeout', () => {
  showError('Session expired. Please log in again.');
});
```

### Configuration

```typescript
const customSessionManager = new SessionManager({
  idleTimeout: 20 * 60 * 1000, // 20 minutes
  warningTimeout: 15 * 60 * 1000, // 15 minutes (warning at this time)
  persistenceKey: 'custom_session_key',
});
```

### Methods

```typescript
// Manual activity ping (keeps session alive)
sessionManager.ping();

// Get elapsed idle time
const elapsed = sessionManager.getElapsedIdleTime(); // milliseconds

// Get remaining time before timeout
const remaining = sessionManager.getRemainingTime(); // milliseconds

// End session
sessionManager.end();
```

## Complete Login Flow Example

```vue
<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit" :disabled="isLoading">
        Login
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/presentation/composables';
import { useRouter } from './useRouter';

const email = ref('');
const password = ref('');
const router = useRouter();
const auth = useAuth();

const handleLogin = async () => {
  const success = await auth.login(email.value, password.value);
  if (success) {
    // useAuth already handles redirect to /dashboard
    // Start session monitoring
    const { sessionManager } = await import(
      '@/infrastructure/services/session-manager'
    );
    sessionManager.start();
  }
};

const isLoading = ref(false);
</script>
```

## Complete Protected Route Example

```vue
<template>
  <div class="dashboard">
    <header>
      <h1>Welcome, {{ auth.user?.fullName }}</h1>
      <button @click="handleLogout">Logout</button>
    </header>

    <div class="content">
      <p v-if="auth.isEmailVerified">Email verified ✓</p>
      <p v-if="auth.isAdmin">Admin access ✓</p>
      <p v-if="auth.isPremium">Premium member ✓</p>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/presentation/composables';
import { sessionManager } from '@/infrastructure/services/session-manager';

const auth = useAuth();

const handleLogout = async () => {
  sessionManager.end();
  await auth.logout();
};
</script>
```

## OAuth/Social Login (Future)

Structure is prepared for OAuth integration:

```typescript
// Will be added
const loginWithGoogle = async () => {};
const loginWithGithub = async () => {};
const linkSocialAccount = async () => {};
```

## Security Best Practices

✅ Tokens stored in localStorage (can upgrade to secure cookies)
✅ Automatic token refresh at 80% of expiry
✅ Session timeout with user warning
✅ Automatic interceptor for token injection
✅ Protected routes with guards
✅ Email verification required
✅ Password reset flow secure
✅ Admin role checks
✅ Premium feature access control
✅ Idle activity monitoring

## Troubleshooting

### Token expires immediately
- Check token expiry time in response
- Verify system clock is correct

### Session timeout too aggressive
- Adjust `idleTimeout` and `warningTimeout` in SessionManager
- Increase timeout if legitimate idle periods expected

### Auth guard redirects to login unexpectedly
- Check if token is being stored correctly
- Verify interceptor is setup
- Check localStorage in DevTools

### Interceptor not working
- Ensure `setupFetchInterceptor()` or `setupAxiosInterceptor()` called
- Check if running before app initialization
- Look for console errors during setup
