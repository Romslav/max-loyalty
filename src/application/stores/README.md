# Stores - Pinia State Management

## Обзор

Эта директория содержит все Pinia stores для аппликации MAX Loyalty.

## Файлы

```
stores/
├── index.ts              # Скроет и экспортирует все stores
├── config.ts             # Конфигурация Pinia
├── useAuthStore.ts      # Управление аутентификациею
├── usePointsStore.ts    # Управление баллами и наградами
├── useUIStore.ts        # Управление состоянием UI
└── README.md            # Этот файл
```

## Stores

### useAuthStore

Правление аутентификациею и пользователем.

#### State
- `user` - Текущий пользователь
- `token` - JWT токен
- `refreshToken` - Обновляемый токен
- `isLoading` - Лоадинг
- `error` - Ошибка

#### Computed
- `isAuthenticated` - Определить восмти
- `emailVerified` - Ки email верифицирован
- `isAdmin` - Пользователь админ
- `isPremium` - Премиум член

#### Actions
- `login(email, password)` - Вход
- `logout()` - Выэсод
- `setUser(user)` - Остановить пользователя
- `setToken(token)` - Остановить токен

#### Пример
```typescript
import { useAuthStore } from '@/application';

const authStore = useAuthStore();

if (authStore.isAuthenticated) {
  console.log('User:', authStore.user);
}

await authStore.login('user@example.com', 'password');
```

### usePointsStore

Управление баллами, наградами и переводом.

#### State
- `totalPoints` - Всего баллов
- `currentLevel` - Текущий уровень
- `transactions` - Переводы
- `rewards` - Каталог наград
- `isLoading` - Лоадинг
- `error` - Ошибка

#### Computed
- `progressToNextLevel` - Прогресс к следующему уровню (%)
- `earnedPoints` - Полученные баллы
- `spentPoints` - Тратенные баллы
- `availableRewards` - Награды для обмена

#### Actions
- `addPoints(amount, description)` - Начислить баллы
- `spendPoints(amount, description)` - Написать баллы
- `redeemReward(rewardId)` - Обменять награду
- `setLevel(level)` - Остановить уровень

#### Пример
```typescript
import { usePointsStore } from '@/application';

const pointsStore = usePointsStore();

await pointsStore.addPoints(100, 'Покупка');
await pointsStore.redeemReward('r-1');

console.log(pointsStore.progressToNextLevel);
```

### useUIStore

Управление состоянием UI, темой и уведомлениями.

#### State
- `theme` - Тнема (light/dark/auto)
- `sidebarOpen` - Открыта ыбд
- `mobileMenuOpen` - Мобильное меню открыто
- `notifications` - Поток уведомлений
- `isLoading` - Глобальная загрузка
- `confirmDialog` - Диалог подтверждения

#### Actions
- `setTheme(theme)` - Остановить тему
- `toggleTheme()` - Перключить тему
- `toggleSidebar()` - Перключить боковую панель
- `toggleMobileMenu()` - Перключить мобильное меню
- `addNotification(type, message, options)` - Добавить уведомление
- `removeNotification(id)` - Удалить уведомление
- `showSuccess/Error/Warning/Info()` - Показать относительные уведомления
- `showConfirm()` - Показать диалог подтверждения

#### Пример
```typescript
import { useUIStore } from '@/application';

const uiStore = useUIStore();

// Уведомления
uiStore.showSuccess('Высохранено!');
uiStore.showError('Ошибка!');

// Тема
uiStore.toggleTheme();

// Меню
uiStore.toggleSidebar();

// Подтверждение
uiStore.showConfirm(
  'Удалить?',
  'Вы уверены?',
  () => console.log('Confirmed')
);
```

## Архитектура

Все stores используют Pinia Composition API стиль:

```typescript
defineStore('storeName', () => {
  // State
  const state = ref(initialValue);
  
  // Computed
  const computed = computed(() => {
    return state.value + 1;
  });
  
  // Actions
  const action = async () => {
    // async logic
  };
  
  return {
    state,
    computed,
    action,
  };
});
```

## Локальное хранилище

Auth store автоматически синхронизирует токены с localStorage:

```typescript
// Автоматически сохраняется
authStore.setToken('token');

// Автоматически загружается у старте
const token = localStorage.getItem('token');
```

## Persist Plugin

Для персистенции стообъектов рекомендуется использовать `pinia-plugin-persistedstate`:

```typescript
import persist from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(persist);
```
