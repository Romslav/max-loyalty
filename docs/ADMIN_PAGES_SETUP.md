# Настройка новых Admin страниц

## 📋 Что было создано

В репозиторий добавлены три новые admin страницы с полной функциональностью:

### 1. **AuditLogs.tsx** (`/admin/audit`)
**Система логирования действий администратора**

**Функционал:**
- ✅ Просмотр всех логов действий в системе
- ✅ Фильтрация по дате (от и до)
- ✅ Фильтрация по действию (CREATE, UPDATE, DELETE, LOGIN, EXPORT)
- ✅ Фильтрация по статусу (success/failed)
- ✅ Пагинация
- ✅ Просмотр детальной информации о каждом логе
- ✅ Экспорт логов в CSV

**API endpoints:**
```
GET    /admin/audit-logs              - Получить логи
GET    /admin/audit-logs/export       - Экспортировать в CSV
```

**Интерфейсы логов:**
```typescript
interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;              // CREATE, UPDATE, DELETE, LOGIN, EXPORT
  entityType: string;          // User, Restaurant, Guest, etc.
  entityId: string;
  changes: Record<string, unknown>; // Что было изменено
  timestamp: string;           // ISO 8601
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
}
```

---

### 2. **SupportTickets.tsx** (`/admin/support`)
**Управление тикетами поддержки**

**Функционал:**
- ✅ Список всех тикетов поддержки
- ✅ Фильтрация по статусу (open, in_progress, resolved, closed)
- ✅ Фильтрация по приоритету (low, medium, high, urgent)
- ✅ Поиск по теме и клиенту
- ✅ Назначение тикета сотруднику
- ✅ Изменение статуса тикета
- ✅ Просмотр конвертации с клиентом
- ✅ Отправка ответных сообщений
- ✅ Информация о клиенте (email, телефон)

**API endpoints:**
```
GET    /admin/support-tickets                 - Получить тикеты
GET    /admin/support-tickets/:id             - Получить тикет
PATCH  /admin/support-tickets/:id/status      - Обновить статус
PATCH  /admin/support-tickets/:id/assign      - Назначить тикет
POST   /admin/support-tickets/:id/messages    - Отправить сообщение
GET    /admin/staff-members                   - Получить сотрудников
```

**Интерфейсы:**
```typescript
type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

interface SupportTicket {
  id: string;
  number: number;              // Номер тикета для удобства
  subject: string;
  description: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  category: string;
  messages: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
```

---

### 3. **SystemSettings.tsx** (`/admin/settings`)
**Системные настройки**

**Функционал:**
- ✅ Управление глобальными параметрами системы
- ✅ Категоризация настроек (Общие, Уведомления, Безопасность, Производительность)
- ✅ Различные типы параметров (string, number, boolean, json)
- ✅ Автоматическое отслеживание изменений
- ✅ Скрытие чувствительных данных (пароли, токены)
- ✅ Восстановление значений по умолчанию
- ✅ Сохранение групп изменений

**API endpoints:**
```
GET    /admin/system-settings                   - Получить все настройки
PATCH  /admin/system-settings                   - Обновить настройки
POST   /admin/system-settings/restore-defaults  - Восстановить по умолчанию
```

**Интерфейсы:**
```typescript
interface SystemSetting {
  key: string;                 // Уникальный идентификатор
  value: any;                  // Текущее значение
  type: 'string' | 'number' | 'boolean' | 'json';
  label: string;               // Отображаемое имя
  description: string;         // Описание параметра
  category: string;            // general, notifications, security, performance
}
```

**Примеры параметров:**
```
general:
  - app_name: "MAX Loyalty"
  - app_version: "1.0.0"
  - timezone: "Europe/Moscow"
  - currency: "RUB"

notifications:
  - email_notifications_enabled: true
  - sms_notifications_enabled: false
  - notification_retry_attempts: 3
  - notification_timeout_ms: 5000

security:
  - session_timeout_minutes: 30
  - password_min_length: 8
  - enable_two_factor: true
  - max_login_attempts: 5
  - jwt_secret: "***hidden***"

performance:
  - cache_enabled: true
  - cache_ttl_minutes: 60
  - api_rate_limit: 1000
  - db_connection_pool_size: 20
```

---

## 🚀 Интеграция с маршрутизацией

Все маршруты уже добавлены в `/src/router/router.tsx`:

```typescript
// Audit Logs
<Route
  path="/admin/audit"
  element={
    <MainLayout>
      <AuditLogs />
    </MainLayout>
  }
/>

// Support Tickets
<Route
  path="/admin/support"
  element={
    <MainLayout>
      <SupportTickets />
    </MainLayout>
  }
/>

// System Settings
<Route
  path="/admin/settings"
  element={
    <MainLayout>
      <SystemSettings />
    </MainLayout>
  }
/>
```

---

## 📦 Импорт компонентов

**Способ 1: Из barrel export**
```typescript
import { AuditLogs, SupportTickets, SystemSettings } from '@/pages/admin';
```

**Способ 2: Прямой импорт**
```typescript
import { AuditLogs } from '@/pages/admin/AuditLogs';
import { SupportTickets } from '@/pages/admin/SupportTickets';
import { SystemSettings } from '@/pages/admin/SystemSettings';
```

---

## 🔌 Необходимые зависимости

Все компоненты используют уже установленные пакеты:

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.x",
  "date-fns": "^2.x",
  "lucide-react": "^0.x",
  "react-hot-toast": "^2.x"
}
```

---

## 🧪 Проверка кода

**TypeScript проверка:**
```bash
npm run type-check
```

**ESLint:**
```bash
npm run lint
```

**Исправление ошибок:**
```bash
npm run lint -- --fix
```

---

## 🎯 Следующие шаги

### День 1 - Завершение компонентов ✅
- ✅ AuditLogs.tsx создана
- ✅ SupportTickets.tsx создана
- ✅ SystemSettings.tsx создана
- ✅ Маршруты добавлены
- ⏳ Создать 6 кастомных хуков

### День 2 - Тестирование
- [ ] Unit тесты для сервисов (90% покрытие)
- [ ] Integration тесты для компонентов
- [ ] E2E тесты для критичных потоков

### День 3 - Безопасность
- [ ] Zod валидация для всех форм
- [ ] XSS защита
- [ ] CSRF защита
- [ ] Аудит безопасности

### День 4 - Production
- [ ] Production build
- [ ] Docker configuration
- [ ] Sentry setup
- [ ] Развертывание

---

## 🔧 Backend интеграция

### Обязательные API endpoints

Бэкенд должен предоставить следующие endpoints для полной функциональности:

#### Audit Logs
```typescript
GET /admin/audit-logs
  Query params:
    - from: ISO 8601 datetime
    - to: ISO 8601 datetime
    - action?: string (CREATE, UPDATE, DELETE, LOGIN, EXPORT)
    - status?: 'success' | 'failed'
    - page?: number (default: 1)
    - pageSize?: number (default: 20)
  Response:
    {
      logs: AuditLog[],
      total: number
    }

GET /admin/audit-logs/export
  Query params:
    - from: ISO 8601 datetime
    - to: ISO 8601 datetime
    - format: 'csv' | 'json'
  Response: File blob (CSV or JSON)
```

#### Support Tickets
```typescript
GET /admin/support-tickets
  Query params:
    - status?: string
    - priority?: string
    - assignedTo?: string
    - search?: string
  Response: SupportTicket[]

GET /admin/support-tickets/:id
  Response: SupportTicket

PATCH /admin/support-tickets/:id/status
  Body: { status: TicketStatus }
  Response: SupportTicket

PATCH /admin/support-tickets/:id/assign
  Body: { assignedTo: string }
  Response: SupportTicket

POST /admin/support-tickets/:id/messages
  Body: { content: string }
  Response: { id: string, created: boolean }

GET /admin/staff-members
  Response: Array<{ id: string, name: string }>
```

#### System Settings
```typescript
GET /admin/system-settings
  Response: SystemSetting[]

PATCH /admin/system-settings
  Body: Record<string, any>
  Response: { success: boolean, message: string }

POST /admin/system-settings/restore-defaults
  Response: { success: boolean, message: string }
```

---

## 📚 Файловая структура

```
src/
├── pages/
│   └── admin/
│       ├── index.ts                    (Barrel export)
│       ├── AdminDashboard.tsx          (Существующий)
│       ├── AuditLogs.tsx               (✨ Новый)
│       ├── SupportTickets.tsx          (✨ Новый)
│       ├── SystemSettings.tsx          (✨ Новый)
│       ├── AnalyticsPage.tsx
│       ├── BillingManagement.tsx
│       ├── GuestsList.tsx
│       └── RestaurantsList.tsx
├── router/
│   └── router.tsx                      (Обновлен)
└── services/
    └── api.ts                          (Используется)
```

---

## 📝 Коммиты

Сделаны следующие коммиты в main:

1. `feat: Add AuditLogs admin page with filtering and export`
2. `feat: Add SupportTickets admin page with assignment and priority management`
3. `feat: Add SystemSettings admin page with configuration management`
4. `feat: Add routes for AuditLogs, SupportTickets, and SystemSettings admin pages`
5. `feat: Add barrel export for admin pages`
6. `docs: Add setup guide for new admin pages`

---

## 🎓 Что дальше?

### Следующий этап: Кастомные хуки

Вам нужно создать 6 переиспользуемых хуков:

1. **useAuth.ts** - Обертка для аутентификации
2. **usePermissions.ts** - Проверка прав доступа
3. **useRealtime.ts** - Обертка для Socket.IO
4. **useNotification.ts** - Система уведомлений
5. **useAsync.ts** - Асинхронная загрузка данных
6. **useLocalStorage.ts** - Синхронизация с localStorage

Скажите, когда готовы создавать хуки!
