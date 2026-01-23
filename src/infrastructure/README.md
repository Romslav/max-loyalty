# Infrastructure Layer

## Обзор

Оя директория содержит API клиент и service layer аппликации.

```
infrastructure/
├── api/
│  ├── config.ts           # API конфигурация и endpoints
│  ├── http-client.ts     # HTTP client с retry logic
│  ├── index.ts          # API layer exports
│  └── README.md         # API documentation
├── services/
│  ├── auth.service.ts   # Аутентификация
│  ├── points.service.ts # Баллы и награды
│  ├── user.service.ts   # Профиль пользователя
│  ├── index.ts          # Services exports
│  └── README.md         # Services documentation
├── index.ts           # Infrastructure exports
└── README.md          # Этот файл
```

## API Layer

### Конфигурация

```typescript
import { apiConfig, endpoints, HttpStatus } from '@/infrastructure';

// API config
const baseURL = apiConfig.baseURL;     // 'https://api.maxloyalty.com'
const timeout = apiConfig.timeout;     // 30000ms

// Endpoints
const loginUrl = endpoints.auth.login;   // '/auth/login'
const profileUrl = endpoints.user.profile; // '/user/profile'
```

### HTTP Client

HTTP client с автоматическим:
- Retry logic (3 попытки)
- Timeout handling
- Token injection
- Error handling
- Request/Response logging

```typescript
import { httpClient } from '@/infrastructure';

// GET
const response = await httpClient.get('/user/profile');
if (response.success) {
  console.log(response.data);
}

// POST
const result = await httpClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password',
});

// PUT
const updated = await httpClient.put('/user/profile', {
  fullName: 'New Name',
});

// DELETE
const deleted = await httpClient.delete('/rewards/:id');
```

## Service Layer

Каждый service энкапсулирует API жвацы для конкретного домена.

### AuthService

```typescript
import { authService } from '@/infrastructure';

// Login
await authService.login({
  email: 'user@example.com',
  password: 'password',
});

// Register
await authService.register({
  email: 'user@example.com',
  password: 'password',
  fullName: 'John Doe',
});

// Verify email
await authService.verifyEmail('verification-code');

// Refresh token
const { token } = await authService.refreshToken(refreshToken);

// Password reset
await authService.sendPasswordReset('user@example.com');
await authService.resetPassword(resetToken, 'new-password');
```

### PointsService

```typescript
import { pointsService } from '@/infrastructure';

// Get balance
const { data: balance } = await pointsService.getBalance();
console.log(balance.totalPoints);

// Get transactions
const { data: transactions } = await pointsService.getTransactions(20, 0);

// Get rewards
const { data: rewards } = await pointsService.getRewards();

// Redeem reward
const result = await pointsService.redeemReward('reward-id');

// Get statistics
const { data: stats } = await pointsService.getStatistics();

// Download CSV
const blob = await pointsService.downloadTransactionsCSV();
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'transactions.csv';
a.click();
```

### UserService

```typescript
import { userService } from '@/infrastructure';

// Get profile
const { data: profile } = await userService.getProfile();

// Update profile
await userService.updateProfile({
  fullName: 'New Name',
  phone: '+79991234567',
});

// Get settings
const { data: settings } = await userService.getSettings();

// Update settings
await userService.updateSettings({
  notifications: { email: true, push: false },
});

// Change password
await userService.changePassword('old-password', 'new-password');

// Get active sessions
const { data: sessions } = await userService.getActiveSessions();

// Terminate session
await userService.terminateSession('session-id');

// Upload avatar
const input = document.querySelector<HTMLInputElement>('input[type="file"]');
if (input.files) {
  const { url } = await userService.uploadAvatar(input.files[0]);
}

// Get activity log
const { data: activities } = await userService.getActivityLog();
```

## Антипаттерны

### Error Handling

```typescript
const response = await httpClient.get('/endpoint');

if (response.success) {
  console.log('Success:', response.data);
} else {
  console.error('Error:', response.error?.message);
  console.error('Code:', response.error?.code);
  console.error('Status:', response.statusCode);
}
```

### HTTP Status Codes

```typescript
import { HttpStatus } from '@/infrastructure';

if (statusCode === HttpStatus.UNAUTHORIZED) {
  // Handle unauthorized
} else if (statusCode === HttpStatus.NOT_FOUND) {
  // Handle not found
}
```

## Store Integration

### Обновление Store из Service

```typescript
import { useAuthStore } from '@/application';
import { authService } from '@/infrastructure';

const authStore = useAuthStore();

const login = async (email: string, password: string) => {
  authStore.setLoading(true);
  try {
    const { success, data } = await authService.login({ email, password });
    if (success && data) {
      authStore.setUser(data.user);
      authStore.setToken(data.token);
    }
  } catch (error) {
    authStore.setError((error as Error).message);
  } finally {
    authStore.setLoading(false);
  }
};
```

## Environment Variables

Настройка API базового URL:

```bash
# .env
VITE_API_BASE_URL=https://api.maxloyalty.com

# .env.development
VITE_API_BASE_URL=http://localhost:3000

# .env.production
VITE_API_BASE_URL=https://api.maxloyalty.com
```

## Type Safety

Все service методы полностью типизированы:

```typescript
interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
}

const { data } = await authService.login(...);
// data type: AuthResponse | undefined
```

## Mocking

Все services обеспечены mock data для разработки.
Просто используйте services как естественные API вызовы!
