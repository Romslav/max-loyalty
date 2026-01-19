# 🚀 MAX LOYALTY — ROADMAP ДО PRODUCTION

**Дата:** 19 января 2026  
**Статус:** Demo → Production Ready (v3.0.0 → v4.0.0)  
**GitHub:** [Romslav/max-loyalty](https://github.com/Romslav/max-loyalty)  
**Owner:** @Romslav  

---

## 📊 ТЕКУЩИЙ СТАТУС (SNAPSHOT)

### ✅ Что уже готово

```
ФРОНТЕНД:
✅ React 18 + TypeScript (отличный setup)
✅ Vite bundler (быстро)
✅ Zustand state management (простой и эффективный)
✅ React Router v6 (правильная маршрутизация)
✅ Tailwind CSS (хороший дизайн)
✅ 16 компонентов UI (Button, Input, Card, Modal и т.д.)
✅ 11/14 страниц готовы (78%)
✅ 4 Zustand stores
✅ 5 services
✅ Unit & E2E тесты (85%+ coverage)

✨ PHASE 2 - ЗАВЕРШЕНО:
✅ useQuery & useMutation hooks
✅ LoadingSpinner, ErrorAlert, EmptyState компоненты
✅ Pagination & SearchInput компоненты
✅ GuestsList.example.tsx (полный пример)
✅ PHASE2_API_INTEGRATION.md документация
✅ PR #3 создан и готов к интеграции

БЭК-ЭНД:
⏳ Node.js + Express + TypeScript (нужно создавать/проверять)
⏳ PostgreSQL + Prisma (нужна схема)
⏳ JWT Auth (нужна реализация)
⏳ WebSocket для real-time (нужно)
⏳ Telegram Bot API (нужно)
```

### ❌ Критические проблемы

```
БЕЗОПАСНОСТЬ:
❌ Нет реальной авторизации (mock token только)
❌ Нет JWT реализации
❌ Нет permission system (RBAC)
❌ Токен хранится в localStorage (уязвимость!)

ДАННЫЕ:
⏳ Инфраструктура API готова (Phase 2)
❌ Страницы еще не обновлены (в прогрессе)
❌ Нет валидации форм
❌ Нет обработки ошибок

ФУНКЦИОНАЛЬНОСТЬ:
❌ Нет real-time обновлений (WebSocket)
❌ Нет push notifications
❌ 5 страниц не закончены (placeholders)
❌ Нет логирования действий

ОПЕРАЦИИ:
❌ Нет офлайн-режима
❌ Нет синхронизации между точками
❌ Нет backup системы
```

---

## 🎯 ПЛАН ДЕЙСТВИЙ (INTERACTIVE CHECKLIST)

### ФАЗА 1: БЕЗОПАСНОСТЬ (Неделя 1-2) ⏱️

#### 📌 Step 1.1: JWT Авторизация
- **Что**: Реальная авторизация вместо mock
- **Время**: 8 часов (Day 1-2)
- **Кто**: Senior dev
- **Файлы создать**:
  - `src/services/authService.ts` — login, logout, refreshToken
  - `src/stores/authStore.ts` — переписать на реальные вызовы
  - `src/middleware/auth.ts` — interceptors для token
  - `src/hooks/useAuth.ts` — custom hook
  - `src/pages/auth/LoginPage.tsx` — NEW
  - `src/pages/auth/RegisterPage.tsx` — NEW

- **API endpoints** (backend):
  ```
  POST   /api/auth/login
  POST   /api/auth/register
  POST   /api/auth/refresh
  GET    /api/auth/me
  POST   /api/auth/logout
  ```

- **Packages**:
  ```bash
  npm install jsonwebtoken
  npm install axios
  npm install dotenv
  ```

- **Чек-лист**:
  - [ ] authService написан
  - [ ] authStore переписан
  - [ ] LoginPage работает
  - [ ] RegisterPage работает
  - [ ] Token сохраняется/загружается
  - [ ] Ошибки обрабатываются
  - [ ] Unit тесты написаны

---

#### 📌 Step 1.2: Protected Routes & RBAC
- **Что**: Защита маршрутов по ролям
- **Время**: 6 часов (Day 2-3)
- **Кто**: Senior dev
- **Компоненты создать**:
  - `src/components/ProtectedRoute.tsx`
  - `src/components/PublicRoute.tsx`
  - `src/components/CanAccess.tsx`
  - `src/hooks/usePermissions.ts`

- **Роли и permissions**:
  ```
  ROLES:
  - admin (все permissions)
  - restaurant (restaurant:*, guest:read)
  - cashier (guest:read, operations:write)
  - guest (guest:read, own data only)

  PERMISSIONS:
  - user:read, user:write, user:delete
  - restaurant:read, restaurant:write, restaurant:delete
  - guest:read, guest:write, guest:delete
  - analytics:read
  - billing:read, billing:write
  ```

- **Чек-лист**:
  - [ ] ProtectedRoute компонент работает
  - [ ] Роли корректно присваиваются
  - [ ] Permissions система работает
  - [ ] Admin видит все меню пункты
  - [ ] Restaurant видит только свои пункты
  - [ ] Cashier не может редактировать гостей
  - [ ] E2E тесты написаны

---

### ФАЗА 2: API И ДАННЫЕ (Неделя 2-3) ✅ ЗАВЕРШЕНО!

#### 📌 Step 2.1: Real API Integration ✅
- **Статус**: ЗАВЕРШЕНО
- **PR**: [#3 Phase 2 - Real API Integration & Data Management](https://github.com/Romslav/max-loyalty/pull/3)
- **Созданные файлы**:
  - ✅ `src/hooks/useQuery.ts` — Data fetching hook
  - ✅ `src/hooks/useMutation.ts` — Mutation hook
  - ✅ `src/components/LoadingSpinner.tsx` — Loading state
  - ✅ `src/components/ErrorAlert.tsx` — Error display
  - ✅ `src/components/EmptyState.tsx` — Empty state
  - ✅ `src/components/Pagination.tsx` — Pagination
  - ✅ `src/components/SearchInput.tsx` — Search with debounce
  - ✅ `src/pages/GuestsList.example.tsx` — Integration example
  - ✅ `docs/PHASE2_API_INTEGRATION.md` — Complete guide

- **Чек-лист**:
  - [x] useQuery написан
  - [x] useMutation написан
  - [x] Components созданы
  - [x] Example page готов
  - [x] Documentation готова
  - [x] PR создан

---

#### 📌 Step 2.2: Integrate Phase 2 Components into Pages ⏳ IN PROGRESS
- **Что**: Обновить все страницы с новыми hooks и компонентами
- **Время**: 8 часов (Day 5-6)
- **Кто**: Junior dev (supervised)
- **Страницы обновить**:
  - [ ] AdminDashboard.tsx
  - [ ] RestaurantsList.tsx
  - [ ] GuestsList.tsx
  - [ ] BillingManagement.tsx
  - [ ] AnalyticsPage.tsx
  - [ ] PointsOperations.tsx
  - [ ] ScanCard.tsx

- **Паттерн для каждой страницы**:
  ```typescript
  // 1. Replace mock data with useQuery
  const { data, loading, error, refetch } = useQuery(
    () => service.getData(page, limit),
    { retry: 3 }
  )

  // 2. Add loading state
  {loading && <LoadingSpinner />}

  // 3. Add error state
  {error && <ErrorAlert error={error} onRetry={refetch} />}

  // 4. Add empty state
  {!loading && !data?.length && <EmptyState />}

  // 5. Add pagination
  <Pagination currentPage={page} totalPages={totalPages} />

  // 6. Add search
  <SearchInput onSearch={(q) => setSearch(q)} />
  ```

- **Чек-лист**:
  - [ ] AdminDashboard обновлен
  - [ ] RestaurantsList обновлен
  - [ ] GuestsList обновлен
  - [ ] BillingManagement обновлен
  - [ ] AnalyticsPage обновлен
  - [ ] PointsOperations обновлен
  - [ ] ScanCard обновлен
  - [ ] Все страницы загружают данные
  - [ ] Loading/Error/Empty states работают

---

#### 📌 Step 2.3: Update Services with Real Endpoints ⏳ IN PROGRESS
- **Что**: Обновить services для работы с реальным API
- **Время**: 4 часа (Day 7)
- **Кто**: Junior dev
- **Services обновить**:
  - [ ] `src/services/guestService.ts`
  - [ ] `src/services/restaurantService.ts`
  - [ ] `src/services/operationService.ts`
  - [ ] `src/services/analyticsService.ts`
  - [ ] `src/services/billingService.ts`

- **API endpoints** (backend):
  ```
  GUESTS:
  GET    /api/guests?page=1&limit=10&search=...
  POST   /api/guests
  GET    /api/guests/:id
  PUT    /api/guests/:id
  DELETE /api/guests/:id
  GET    /api/guests/:id/history

  RESTAURANTS:
  GET    /api/restaurants?page=1&limit=10
  POST   /api/restaurants
  GET    /api/restaurants/:id
  PUT    /api/restaurants/:id
  DELETE /api/restaurants/:id

  OPERATIONS:
  GET    /api/operations?page=1&limit=10&guest_id=...
  POST   /api/operations
  GET    /api/operations/stats

  ANALYTICS:
  GET    /api/analytics/dashboard
  GET    /api/analytics/guests
  GET    /api/analytics/revenue

  BILLING:
  GET    /api/billing/invoices?page=1&limit=10
  POST   /api/billing/invoices
  PUT    /api/billing/invoices/:id/pay
  ```

- **Чек-лист**:
  - [ ] guestService обновлен
  - [ ] restaurantService обновлен
  - [ ] operationService обновлен
  - [ ] analyticsService обновлен
  - [ ] billingService обновлен
  - [ ] Все endpoints настроены
  - [ ] Error handling работает

---

### ФАЗА 3: ВАЛИДАЦИЯ И ОШИБКИ (Неделя 3) ⏳ NEXT UP

#### 📌 Step 3.1: Form Validation
- **Что**: Валидация всех форм через Zod + React Hook Form
- **Время**: 8 часов (Day 8-9)
- **Кто**: Senior dev
- **Packages**:
  ```bash
  npm install zod react-hook-form @hookform/resolvers
  ```

- **Schemas создать**:
  - `src/schemas/authSchema.ts`
  - `src/schemas/guestSchema.ts`
  - `src/schemas/restaurantSchema.ts`
  - `src/schemas/operationSchema.ts`

- **Формы обновить**:
  - LoginPage
  - RegisterPage
  - CreateGuestForm
  - EditGuestForm
  - CreateRestaurantForm
  - PointsOperationForm

- **Чек-лист**:
  - [ ] Zod schemas написаны
  - [ ] React Hook Form интегрирован
  - [ ] Все формы валидируют input
  - [ ] Error messages показываются
  - [ ] Submit disabled пока есть errors
  - [ ] Field-level errors работают
  - [ ] Unit тесты написаны

---

#### 📌 Step 3.2: Error Handling & Logging
- **Что**: Централизованная обработка ошибок + Sentry
- **Время**: 6 часов (Day 9-10)
- **Кто**: Senior dev
- **Packages**:
  ```bash
  npm install @sentry/react @sentry/tracing
  npm install react-hot-toast
  ```

- **Файлы создать**:
  - `src/services/errorService.ts`
  - `src/components/ErrorBoundary.tsx`
  - `src/middleware/errorHandler.ts`
  - `src/config/sentry.ts`
  - `src/utils/toast.ts`

- **Sentry setup**:
  ```typescript
  // src/config/sentry.ts
  import * as Sentry from '@sentry/react'

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0,
  })
  ```

- **API Error handling**:
  ```
  400 -> Validation error
  401 -> Auth error (redirect to login)
  403 -> Permission error
  404 -> Not found
  500 -> Server error
  ```

- **Notifications**:
  ```typescript
  showSuccess('Operation successful!')
  showError('Something went wrong', error)
  showInfo('Please wait...')
  showWarning('Are you sure?')
  ```

- **Чек-лист**:
  - [ ] Sentry интегрирован
  - [ ] Error Boundary работает
  - [ ] Toast notifications работают
  - [ ] Все API ошибки логируются
  - [ ] User видит friendly messages
  - [ ] Unit тесты написаны

---

#### 📌 Step 3.3: Logging System
- **Что**: Логирование всех действий пользователя
- **Время**: 4 часа (Day 10-11)
- **Кто**: Junior dev
- **Файлы создать**:
  - `src/services/loggerService.ts`
  - `src/utils/actionLogger.ts`

- **Что логировать**:
  ```
  - User login/logout
  - API calls (success/error)
  - Form submissions
  - Page views
  - User actions (create/edit/delete)
  ```

- **Чек-лист**:
  - [ ] Logger service написан
  - [ ] Логи отправляются в console (dev) или Sentry (prod)
  - [ ] Sensitive data не логируется
  - [ ] Performance логирования нормальная

---

### ФАЗА 4: НЕДОСТАЮЩИЕ СТРАНИЦЫ (Неделя 4) ⏳ UPCOMING

#### 📌 Step 4.1: Complete 5 Placeholder Pages
- **Что**: Завершить 5 незаконченных страниц
- **Время**: 8 часов (Day 12-13)
- **Кто**: Senior dev

##### 1️⃣ AuditLogs.tsx (Admin)
```typescript
// Должна содержать:
- Таблица логов: Date, User, Action, Resource, IP, Status
- Фильтры: Date range, User, Action, Resource
- Search по Action
- Pagination
- Export to CSV

// API:
GET /api/audit-logs?page=1&limit=50&filter=...
GET /api/audit-logs/export?format=csv
```

##### 2️⃣ SupportTickets.tsx (Admin)
```typescript
// Должна содержать:
- Таблица тикетов: ID, Title, Status, Priority, Created, Updated
- Статусы: Open, In Progress, Resolved, Closed
- Приоритеты: Low, Medium, High, Critical
- Детальный view каждого тикета
- Комментарии к тикету
- Закрытие/переоткрытие тикета

// API:
GET /api/support-tickets?status=...&priority=...
GET /api/support-tickets/:id
POST /api/support-tickets/:id/comments
PUT /api/support-tickets/:id/status
```

##### 3️⃣ SystemSettings.tsx (Admin)
```typescript
// Должна содержать:
- Email SMTP settings
- API keys management
- Webhook configuration
- Feature flags
- Backup settings

// API:
GET /api/settings
PUT /api/settings/:key
```

##### 4️⃣ PointsOperationForm.tsx (Cashier)
```typescript
// Должна содержать:
- Guest selection dropdown
- Points input field
- Operation type (Earn/Redeem)
- Description textarea
- Submit button

// API:
POST /api/operations
```

##### 5️⃣ GuestSettings.tsx (Guest)
```typescript
// Должна содержать:
- Profile info (name, email, phone)
- Password change form
- Notification preferences
- Delete account button

// API:
PUT /api/guests/:id
POST /api/guests/:id/change-password
PUT /api/guests/:id/preferences
DELETE /api/guests/:id
```

- **Чек-лист**:
  - [ ] AuditLogs страница готова
  - [ ] SupportTickets страница готова
  - [ ] SystemSettings страница готова
  - [ ] PointsOperationForm работает
  - [ ] GuestSettings работает
  - [ ] 17/17 страниц готовы (100%)

---

### ФАЗА 5: REAL-TIME И NOTIFICATIONS (Неделя 4-5) ⏳ UPCOMING

#### 📌 Step 5.1: WebSocket Real-Time
- **Что**: Real-time обновления через Socket.IO
- **Время**: 8 часов (Day 14-15)
- **Кто**: Senior dev
- **Packages**:
  ```bash
  npm install socket.io-client
  ```

- **Файлы создать**:
  - `src/services/realtimeService.ts`
  - `src/hooks/useRealtime.ts`

- **Events subscribe to**:
  ```
  - guests:updated
  - guests:created
  - operations:completed
  - restaurants:stats:updated
  - messages:new
  ```

- **Где использовать**:
  - AdminDashboard → auto-refresh stats
  - GuestsList → auto-update при новых гостях
  - RestaurantGuestsList → real-time updates
  - PointsOperations → live таблица

- **Чек-лист**:
  - [ ] Socket.IO подключение работает
  - [ ] Events подписываются
  - [ ] Data обновляется в real-time
  - [ ] Disconnect/reconnect обрабатывается

---

#### 📌 Step 5.2: Push Notifications
- **Что**: Desktop push notifications
- **Время**: 4 часа (Day 15-16)
- **Кто**: Junior dev

- **Notifications для**:
  ```
  - Новый гость создан
  - Операция завершена
  - Счет оплачен
  - Сообщение от поддержки
  ```

- **Чек-лист**:
  - [ ] Notifications работают
  - [ ] User может разрешить/запретить
  - [ ] Notifications правильные сообщения содержат

---

### ФАЗА 6: ТЕСТИРОВАНИЕ И ОПТИМИЗАЦИЯ (Неделя 5-6) ⏳ UPCOMING

#### 📌 Step 6.1: Unit Tests
- **Время**: 6 часов (Day 17-18)
- **Кто**: Junior dev
- **Написать тесты для**:
  - authService
  - guestService
  - validators
  - errorHandler
  - stores

- **Цель**: 90%+ coverage

---

#### 📌 Step 6.2: E2E Tests
- **Время**: 6 часов (Day 18-19)
- **Кто**: Junior dev
- **Написать тесты для**:
  - Login flow
  - Guest CRUD
  - Admin features
  - Permission checks

---

#### 📌 Step 6.3: Performance & Security
- **Время**: 8 часов (Day 19-21)
- **Кто**: Senior dev

**Performance checks**:
- [ ] Bundle size < 150KB (npm run build)
- [ ] Lighthouse score > 90
- [ ] Code splitting для pages
- [ ] Lazy loading где нужно
- [ ] Remove unused dependencies

**Security checks**:
- [ ] XSS vulnerabilities none
- [ ] CSRF protection есть
- [ ] Input sanitization работает
- [ ] No sensitive data в localStorage
- [ ] HTTPS required
- [ ] `npm audit` пройден
- [ ] env vars не exposed

---

## 📋 ИТОГОВЫЙ TIMELINE

```
НЕДЕЛЯ 1: БЕЗОПАСНОСТЬ (20 часов) ⏳ IN PROGRESS
├─ Day 1-2: JWT авторизация (8ч)
├─ Day 2-3: Protected routes (6ч)
└─ Day 3-4: RBAC (6ч)

НЕДЕЛЯ 2-3: API И ДАННЫЕ (20 часов) 🟢 PHASE 2 COMPLETE
├─ Day 4-5: API infrastructure ✅ (ЗАВЕРШЕНО)
├─ Day 5-6: Integrate components ⏳ (IN PROGRESS)
└─ Day 6-7: Update services (⏳ UPCOMING)

НЕДЕЛЯ 3-4: ВАЛИДАЦИЯ (18 часов) ⏳ NEXT UP
├─ Day 8-9: Form validation (8ч)
├─ Day 9-10: Error handling (6ч)
└─ Day 10-11: Logging (4ч)

НЕДЕЛЯ 4: СТРАНИЦЫ (8 часов) ⏳ UPCOMING
└─ Day 12-13: Complete placeholders (8ч)

НЕДЕЛЯ 4-5: REAL-TIME (12 часов) ⏳ UPCOMING
├─ Day 14-15: WebSocket (8ч)
└─ Day 15-16: Push notifications (4ч)

НЕДЕЛЯ 5-6: ТЕСТИРОВАНИЕ (16 часов) ⏳ UPCOMING
├─ Day 17-18: Unit tests (6ч)
├─ Day 18-19: E2E tests (6ч)
└─ Day 19-21: Performance & Security (4ч)

РЕЗЕРВ: 8 часов (bugfixes, feedback)

ИТОГО: ~90-100 часов = 2.5-3 недели
```

---

## 👥 TEAM STRUCTURE

```
Senior Developer (80 часов):
  ✅ Phase 1: JWT авторизация + RBAC (IN PROGRESS)
  ✅ Phase 2: API infrastructure (COMPLETE)
  ⏳ Phase 3: Form validation + Error handling
  ⏳ Phase 4: Complete pages
  ⏳ Phase 5: Real-time (WebSocket)
  ⏳ Phase 6: Performance & security

Junior Developer (40 часов):
  ⏳ Phase 2: Integrate components into pages
  ⏳ Phase 2: Update services
  ⏳ Phase 3: Logging
  ⏳ Phase 4: Complete pages
  ⏳ Phase 5: Push notifications
  ⏳ Phase 6: Unit & E2E tests
```

---

## 💰 BUDGET ESTIMATION

```
Senior Dev: 80ч @ $100-150/ч = $8,000-12,000
Junior Dev: 40ч @ $30-50/ч = $1,200-2,000
Backend Dev: 60ч (параллельно)
QA/Testing: 20ч

ИТОГО: $9,200-14,000 + backend dev
```

---

## ✅ SUCCESS CRITERIA (Definition of Done)

```
✅ 17/17 страниц готовы (100%)
✅ JWT авторизация работает
✅ Real API интеграция завершена
✅ RBAC permission system работает
✅ Все формы валидируют
✅ Error handling полный
✅ Real-time обновления работают
✅ Push notifications работают
✅ 90%+ test coverage
✅ Security audit пройден
✅ Performance оптимизирован
✅ Lighthouse score > 90
✅ 0 high severity vulnerabilities
✅ Документация обновлена
✅ Ready for production deployment! 🚀
```

---

## 🎯 NEXT STEPS (WHAT TO DO NOW?)

### ✅ Что только что сделали (Phase 2 Infra)
```
1. ✅ Создали useQuery & useMutation hooks
2. ✅ Создали Loading/Error/Empty компоненты
3. ✅ Создали Pagination & SearchInput
4. ✅ Создали полный пример (GuestsList.example.tsx)
5. ✅ Создали документацию (PHASE2_API_INTEGRATION.md)
6. ✅ Создали PR #3 для review
```

### 🔥 Приоритет: Phase 2 - Завершение (Days 5-7)
```
1. Интегрировать Phase 2 компоненты в AdminDashboard
2. Интегрировать в GuestsList
3. Интегрировать в RestaurantsList
4. Интегрировать в BillingManagement
5. Интегрировать в AnalyticsPage
6. Обновить все services
7. Tested и deployed
```

### ⏳ Потом: Phase 3 - Валидация (Days 8-11)
```
1. Установить Zod + React Hook Form
2. Создать schemas для всех форм
3. Обновить формы с валидацией
4. Добавить Sentry для error tracking
5. Добавить toast notifications
6. Логирование действий
```

### 🎯 Рекомендуемый порядок:
**Вариант 1: Быстро (3-4 дня)**
```
1. Phase 2 компоненты в 5 главных страниц
2. Обновить services
3. Тестировать
4. Deploy на staging
```

**Вариант 2: Правильно (2-3 недели)**
```
Следовать плану по фазам
Полная валидация, обработка ошибок
Тестирование каждой фазы
Security audit перед деплоем
```

---

**Ready to continue? Let's go! 🚀**
