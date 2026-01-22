# Phase 3: Presentation Layer (Vue Components + State Management) - Architecture Guide

## Overview

Фаза 3 фокусируется на создании Presentation Layer с использованием **Vue 3 Composition API** и **Pinia State Management**.

### Слои архитектуры

```
┌─────────────────────────────────────┐
│   Presentation Layer (Phase 3)      │  ← YOU ARE HERE
│   ├── Vue Components                │  Smart & Dumb Components
│   ├── Pinia Stores                  │  State Management
│   ├── Composables                   │  Reusable Composition Logic
│   ├── Views                         │  Page Components
│   └── Layouts                       │  Layout Components
│   ↓ Uses                            │
├─────────────────────────────────────┤
│  Application Layer (Phase 2) ✅     │  Use Cases, Services, Validators
│   ↓ Uses                            │
├─────────────────────────────────────┤
│   Domain Layer (Phase 1) ✅         │  Entities, Repository Interfaces
│   ↓ Uses                            │
├─────────────────────────────────────┤
│  Infrastructure Layer (Phase 1) ✅  │  HTTP Client, Repositories
│                                     │
└─────────────────────────────────────┘
```

## Структура проекта Phase 3

```
src/presentation/
├── components/
│   ├── common/
│   │   ├── AppButton.vue             # Переиспользуемая кнопка
│   │   ├── AppInput.vue              # Переиспользуемый input
│   │   ├── AppCard.vue               # Переиспользуемая карточка
│   │   ├── AppModal.vue              # Модальное окно
│   │   ├── AppLoader.vue             # Загрузчик
│   │   ├── AppAlert.vue              # Алерты/Уведомления
│   │   └── index.ts                  # Экспорты
│   │
│   ├── auth/
│   │   ├── LoginForm.vue             # Форма входа
│   │   ├── RegisterForm.vue          # Форма регистрации
│   │   └── index.ts
│   │
│   ├── user/
│   │   ├── UserProfile.vue           # Профиль пользователя
│   │   ├── UserSettings.vue          # Настройки пользователя
│   │   ├── UserList.vue              # Список пользователей
│   │   └── index.ts
│   │
│   ├── guest/
│   │   ├── GuestCard.vue             # Карточка гостя
│   │   ├── GuestProfile.vue          # Профиль гостя
│   │   ├── GuestList.vue             # Список гостей
│   │   ├── GuestStatistics.vue       # Статистика гостя
│   │   ├── PointsEarner.vue          # Заработок баллов
│   │   ├── PointsRedeemer.vue        # Трата баллов
│   │   └── index.ts
│   │
│   └── index.ts                      # Главный экспорт
│
├── views/
│   ├── AuthView.vue                  # Страница аутентификации
│   ├── DashboardView.vue             # Главная панель
│   ├── UsersView.vue                 # Страница пользователей
│   ├── GuestView.vue                 # Страница гостей
│   ├── SettingsView.vue              # Страница настроек
│   ├── NotFoundView.vue              # 404 страница
│   └── index.ts
│
├── layouts/
│   ├── AppLayout.vue                 # Основной лейаут
│   ├── AuthLayout.vue                # Лейаут для аутентификации
│   └── index.ts
│
├── stores/
│   ├── auth/
│   │   ├── authStore.ts              # Auth Pinia store
│   │   ├── types.ts                  # Types для auth
│   │   └── index.ts
│   │
│   ├── user/
│   │   ├── userStore.ts              # User Pinia store
│   │   ├── types.ts                  # Types для user
│   │   └── index.ts
│   │
│   ├── guest/
│   │   ├── guestStore.ts             # Guest Pinia store
│   │   ├── types.ts                  # Types для guest
│   │   └── index.ts
│   │
│   └── index.ts                      # Главный экспорт
│
├── composables/
│   ├── useAuth.ts                    # Auth composable
│   ├── useUser.ts                    # User composable
│   ├── useGuest.ts                   # Guest composable
│   ├── useFetch.ts                   # Fetch composable
│   ├── useForm.ts                    # Form composable
│   ├── useNotification.ts            # Notification composable
│   └── index.ts
│
└── index.ts                          # Главный экспорт Presentation Layer
```

## Ключевые концепции

### 1. Vue Components

**Smart Components** (Pages/Containers)
- Подключены к Pinia stores
- Обрабатывают бизнес-логику
- Управляют состоянием
- Обрабатывают ошибки

```vue
<template>
  <div class="user-page">
    <UserProfile v-if="user" :user="user" @update="updateUser" />
    <AppLoader v-else />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/presentation/stores';
import { computed, onMounted } from 'vue';

const userStore = useUserStore();
const user = computed(() => userStore.currentUser);

onMounted(async () => {
  await userStore.fetchUser();
});
</script>
```

**Dumb Components** (Presentational)
- Получают данные через props
- Испускают события (emit)
- Не знают о логике приложения
- Полностью переиспользуемые

```vue
<template>
  <div class="user-profile">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
    <button @click="$emit('update')">Update</button>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/domain/entities';

defineProps<{
  user: User;
}>();

defineEmits<{
  update: [];
}>();
</script>
```

### 2. Pinia Stores

```typescript
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { container } from '@/infrastructure';
import type { User } from '@/domain/entities';

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!currentUser.value);

  // Actions
  async function fetchUser(userId: string) {
    loading.value = true;
    error.value = null;

    try {
      const result = await container.getUserUseCase.execute(userId);
      currentUser.value = result;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    currentUser,
    loading,
    error,
    isAuthenticated,
    fetchUser,
  };
});
```

### 3. Composables

```typescript
import { ref, reactive, computed } from 'vue';
import { useUserStore } from '@/presentation/stores';

export function useAuth() {
  const userStore = useUserStore();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function login(email: string, password: string) {
    isLoading.value = true;
    error.value = null;

    try {
      await userStore.login({ email, password });
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  const isAuthenticated = computed(() => userStore.isAuthenticated);

  return {
    isLoading,
    error,
    isAuthenticated,
    login,
  };
}
```

### 4. Диаграмма взаимодействия

```
User Interaction
    ↓
Vue Component
    ↓ (dispatch action)
Pinia Store
    ↓ (call use case)
Use Case (Application Layer)
    ↓ (validate input)
Validator
    ↓ (repository method)
Repository (Infrastructure Layer)
    ↓ (HTTP request)
Backend API
    ↓ (HTTP response)
Repository
    ↓ (return data)
Use Case
    ↓ (update state)
Pinia Store
    ↓ (reactive update)
Vue Component
    ↓ (render)
UI
```

## Best Practices

### Component Organization

✅ **ПРАВИЛЬНО**
```vue
<!-- SmartComponent.vue -->
<template>
  <DumbComponent :data="data" @action="handleAction" />
</template>

<script setup>
const store = useStore();
const handleAction = async () => {
  await store.doSomething();
};
</script>
```

❌ **НЕПРАВИЛЬНО**
```vue
<!-- BadComponent.vue -->
<template>
  <!-- Напрямую обращаемся к API в компоненте -->
</template>

<script setup>
const handleAction = async () => {
  const response = await fetch(...);
  // ...
};
</script>
```

### Error Handling

```typescript
// ✅ ПРАВИЛЬНО
const { isAppError } = await tryCatch(async () => {
  await userStore.login(credentials);
});

if (isAppError) {
  showNotification('Login failed', 'error');
}

// ❌ НЕПРАВИЛЬНО
try {
  await userStore.login(credentials);
} catch (e) {
  console.log(e); // Не обрабатываем в UI
}
```

### Prop Validation

```typescript
// ✅ ПРАВИЛЬНО
defineProps<{
  user: User;        // Required
  isLoading?: boolean; // Optional
}>();

// ❌ НЕПРАВИЛЬНО
defineProps({
  user: [Object, String], // Not type-safe
  data: Object,           // Not specific
});
```

## Типизация Components

```typescript
// common/AppButton.vue
export interface AppButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export interface AppButtonEmits {
  click: [];
}

// auth/LoginForm.vue
export interface LoginFormProps {
  isLoading?: boolean;
}

export interface LoginFormEmits {
  login: [credentials: LoginCredentials];
}
```

## State Management Flow

### Auth Store Example

```typescript
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const hasPermission = (role: UserRole) => user.value?.role === role;

  // Actions
  async function login(email: string, password: string) {
    isLoading.value = true;
    try {
      const result = await container.loginUseCase.execute({
        email,
        password,
      });

      user.value = result.user;
      accessToken.value = result.accessToken;
      refreshToken.value = result.refreshToken;

      // Save to localStorage
      localStorage.setItem('auth_token', result.accessToken);
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('auth_token');
  }

  function hydrate(token: string) {
    // Восстановить состояние из localStorage
    accessToken.value = token;
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    isAuthenticated,
    hasPermission,
    login,
    logout,
    hydrate,
  };
});
```

## Router Integration

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/presentation/stores';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth',
      component: () => import('@/presentation/views/AuthView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      component: () => import('@/presentation/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      component: () => import('@/presentation/views/UsersView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth');
  } else if (to.meta.role && !authStore.hasPermission(to.meta.role)) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
```

## Testing Strategy

### Component Testing

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppButton from '@/presentation/components/common/AppButton.vue';

describe('AppButton', () => {
  it('renders button with text', () => {
    const wrapper = mount(AppButton, {
      slots: {
        default: 'Click me',
      },
    });
    expect(wrapper.text()).toContain('Click me');
  });

  it('emits click event', async () => {
    const wrapper = mount(AppButton);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
```

### Store Testing

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/presentation/stores';

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('sets user on login', async () => {
    const store = useAuthStore();
    // Mock useCase
    await store.login('test@example.com', 'password');
    expect(store.isAuthenticated).toBe(true);
  });
});
```

## Performance Optimization

### Lazy Loading Components

```typescript
const UserProfile = defineAsyncComponent(() =>
  import('@/presentation/components/user/UserProfile.vue')
);
```

### Memoization with Computed

```typescript
const expensiveComputation = computed(() => {
  // This only runs when dependencies change
  return largeArray.filter(...).map(...).sort(...);
});
```

### Virtual Scrolling for Large Lists

```vue
<template>
  <virtual-scroller :items="users" :item-size="50">
    <template #default="{ item }">
      <UserCard :user="item" />
    </template>
  </virtual-scroller>
</template>
```

## Что будет дальше (Phase 4)

- [ ] Testing (Unit + Integration + E2E)
- [ ] Performance Optimization
- [ ] Accessibility (a11y)
- [ ] Mobile Responsiveness
- [ ] PWA Features

## Следующие шаги (Phase 3 реализация)

- [ ] Common Components (Button, Input, Card, Modal, etc)
- [ ] Auth Components (LoginForm, RegisterForm)
- [ ] User Components (Profile, Settings, List)
- [ ] Guest Components (Card, Profile, Statistics)
- [ ] Pinia Stores (Auth, User, Guest)
- [ ] Composables (useAuth, useUser, useGuest, etc)
- [ ] Views/Pages (Auth, Dashboard, Users, Guests)
- [ ] Router Configuration
- [ ] Layout Components
- [ ] Comprehensive Testing

---

**Status**: Phase 3 - Starting 🚀
**Previous Status**: Phase 2 - Complete ✅
