# Phase 1: Domain Layer + Repositories - Architecture Guide

## Overview

Фаза 1 фокусируется на создании базовой архитектуры приложения с чистым разделением слоев:

1. **Domain Layer** - Бизнес-логика и сущности
2. **Repository Pattern** - Абстракция для доступа к данным
3. **Infrastructure Layer** - HTTP клиент и реализации репозиториев
4. **Dependency Injection** - Управление зависимостями

---

## Структура проекта

```
src/
├── domain/
│   ├── entities/            # Бизнес-сущности
│   │   ├── User.ts
│   │   ├── Guest.ts
│   │   ├── Restaurant.ts
│   │   ├── Operation.ts
│   │   ├── Billing.ts
│   │   └── index.ts
│   └── repositories/        # Интерфейсы репозиториев
│       ├── IUserRepository.ts
│       ├── IGuestRepository.ts
│       ├── IRestaurantRepository.ts
│       ├── IOperationRepository.ts
│       ├── IBillingRepository.ts
│       └── index.ts
│
└── infrastructure/
    ├── http/                # HTTP клиент
    │   ├── HttpClient.ts
    │   └── index.ts
    ├── dtos/                # Data Transfer Objects
    │   ├── UserDto.ts
    │   ├── GuestDto.ts
    │   └── index.ts
    ├── repositories/        # Реализации репозиториев
    │   ├── HttpUserRepository.ts
    │   ├── HttpGuestRepository.ts
    │   └── index.ts
    ├── di/                  # Dependency Injection
    │   ├── Container.ts
    │   └── index.ts
    └── index.ts
```

---

## Принципы архитектуры

### 1. Domain-Driven Design (DDD)

- **Entities** описывают основные объекты бизнес-логики
- **Repositories** - абстракция для доступа к данным
- Бизнес-логика полностью независима от способа хранения и получения данных

### 2. Dependency Inversion Principle (DIP)

```typescript
// ❌ НЕПРАВИЛЬНО - прямая зависимость
const repository = new HttpUserRepository();

// ✅ ПРАВИЛЬНО - зависимость через интерфейс
const repository: IUserRepository = container.userRepository;
```

### 3. Repository Pattern

- Каждая сущность имеет свой интерфейс репозитория
- Реализация может меняться без изменения кода, использующего репозиторий
- Позволяет легко тестировать код с mock-репозиториями

### 4. HTTP Client Centralization

- Единый `HttpClient` для всех API запросов
- Автоматическое добавление авторизации
- Единая обработка ошибок
- Автоматический рефреш токена (TODO)

### 5. DTOs (Data Transfer Objects)

- Отделяют внутреннее представление от API
- Содержат mapper функции для конвертации
- Позволяют изменять внутреннюю структуру без влияния на API

---

## Как использовать

### Получение доступа к репозиториям

```typescript
import { container } from '@/infrastructure';

// В компоненте
const users = await container.userRepository.findAll();
const guest = await container.guestRepository.findById('guest-id');
```

### Создание новой сущности

1. Создать тип в `src/domain/entities/YourEntity.ts`
2. Создать интерфейс в `src/domain/repositories/IYourRepository.ts`
3. Создать DTO в `src/infrastructure/dtos/YourDto.ts`
4. Создать реализацию в `src/infrastructure/repositories/HttpYourRepository.ts`
5. Добавить в контейнер в `src/infrastructure/di/Container.ts`
6. Добавить в экспорты

---

## Следующие шаги (Phase 2)

- ✅ Domain Layer
- ✅ Repository Pattern
- ✅ HTTP Client
- ✅ DTOs
- ✅ DI Container
- ⏳ **Phase 2**: Use Cases / Services Layer
- ⏳ **Phase 3**: Vue Components + State Management
- ⏳ **Phase 4**: Error Handling & Validation
- ⏳ **Phase 5**: Testing

---

## API Endpoints Reference

### Users
- `GET /api/users` - Получить всех пользователей
- `GET /api/users/:id` - Получить пользователя по ID
- `GET /api/users/email/:email` - Получить пользователя по email
- `POST /api/users` - Создать пользователя
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя

### Guests
- `GET /api/guests` - Получить всех клиентов
- `GET /api/guests/:id` - Получить клиента по ID
- `GET /api/guests/email/:email` - Получить клиента по email
- `GET /api/guests/phone/:phoneNumber` - Получить клиента по номеру телефона
- `POST /api/guests` - Создать клиента
- `PUT /api/guests/:id` - Обновить клиента
- `DELETE /api/guests/:id` - Удалить клиента
- `GET /api/guests/:id/statistics` - Получить статистику клиента

---

## Notes

- Все операции асинхронные (async/await)
- Обработка ошибок должна быть реализована на уровне компонентов
- DTOs содержат mapper функции для конвертации Date объектов
