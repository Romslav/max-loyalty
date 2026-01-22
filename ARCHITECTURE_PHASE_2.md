# Phase 2: Application Layer (Use Cases + Services) - Architecture Guide

## Overview

Фаза 2 фокусируется на создании Application Layer с использованием **Use Case Pattern** и **Services**.

### Слои архитектуры

```
┌─────────────────────────────────────┐
│   Presentation Layer (Phase 3)      │  Vue Components, State Management
│   ↓ Uses                            │
├─────────────────────────────────────┤
│  Application Layer (Phase 2) ← YOU ARE HERE
│  ├── Use Cases                      │  Бизнес-логика
│  ├── Services                       │  Дополнительные операции
│  ├── Validators                     │  Валидация входных данных
│  ├── Error Handling                 │  Централизованная обработка ошибок
│  └── DTOs                           │  Request/Response модели
│   ↓ Uses                            │
├─────────────────────────────────────┤
│   Domain Layer (Phase 1)            │  Entities, Repository Interfaces
│   ↓ Uses                            │
├─────────────────────────────────────┤
│  Infrastructure Layer (Phase 1)     │  HTTP Client, Repositories
│                                     │
└─────────────────────────────────────┘
```

## Структура проекта Phase 2

```
src/application/
├── errors/
│   ├── AppError.ts             # Базовый класс для всех ошибок
│   ├── ValidationError.ts       # Ошибки валидации
│   ├── AuthenticationError.ts   # Ошибки аутентификации
│   ├── AuthorizationError.ts    # Ошибки авторизации
│   ├── NotFoundError.ts         # Ошибки когда ресурс не найден
│   ├── BusinessLogicError.ts    # Ошибки бизнес-логики
│   └── index.ts                 # Экспорты
│
├── validators/
│   ├── EmailValidator.ts        # Валидация email
│   ├── PasswordValidator.ts     # Валидация пароля
│   ├── PhoneValidator.ts        # Валидация номера телефона
│   ├── UserValidator.ts         # Валидация User данных
│   ├── GuestValidator.ts        # Валидация Guest данных
│   └── index.ts                 # Экспорты
│
├── use-cases/
│   ├── user/
│   │   ├── LoginUseCase.ts      # Вход пользователя
│   │   ├── GetUserUseCase.ts    # Получить информацию о пользователе
│   │   ├── RegisterUseCase.ts   # TODO: Регистрация нового пользователя
│   │   ├── UpdateUserUseCase.ts # TODO: Обновить пользователя
│   │   └── index.ts
│   │
│   ├── guest/
│   │   ├── CreateGuestUseCase.ts        # Создать нового гостя
│   │   ├── GetGuestUseCase.ts           # Получить информацию о госте
│   │   ├── GetGuestStatisticsUseCase.ts # TODO: Получить статистику гостя
│   │   ├── EarnPointsUseCase.ts         # TODO: Заработать баллы
│   │   ├── RedeemPointsUseCase.ts       # TODO: Потратить баллы
│   │   └── index.ts
│   │
│   ├── operation/
│   │   ├── GetOperationHistoryUseCase.ts # TODO: История операций
│   │   └── index.ts
│   │
│   └── index.ts                 # Главный экспорт всех use cases
│
└── index.ts                     # Главный экспорт Application Layer
```

## Ключевые концепции

### 1. Use Case Pattern

Каждый use case представляет **одну бизнес-операцию**:

```typescript
// ✅ ПРАВИЛЬНО
const result = await loginUseCase.execute({
  email: 'user@example.com',
  password: 'password123'
});
// Returns: { user, accessToken, refreshToken }
```

### 2. Входные данные (Input)

```typescript
export interface LoginRequest {
  email: string;
  password: string;
}

export class LoginUseCase {
  async execute(request: LoginRequest): Promise<LoginResponse>
}
```

### 3. Выходные данные (Output)

```typescript
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

### 4. Error Handling

```typescript
// Все ошибки наследуются от AppError
try {
  await loginUseCase.execute(request);
} catch (error) {
  if (isAppError(error)) {
    console.log(error.code);        // ErrorCode
    console.log(error.message);     // Сообщение об ошибке
    console.log(error.statusCode);  // HTTP статус код
    console.log(error.details);     // Дополнительные данные
  }
}
```

### 5. Validation Flow

```
Request Input
    ↓
Validation Errors?
    ↓ YES → ValidationError ✗
    ↓ NO
Business Logic
    ↓
Business Logic Errors?
    ↓ YES → BusinessLogicError ✗
    ↓ NO
Return Response
    ↓
Success ✓
```

## Как использовать Use Cases

### Пример 1: Вход пользователя

```typescript
import { container } from '@/infrastructure';

// Выполнить use case
try {
  const result = await container.loginUseCase.execute({
    email: 'admin@example.com',
    password: 'SecurePassword123'
  });

  console.log('User:', result.user);
  console.log('Token:', result.accessToken);
} catch (error) {
  if (isAppError(error)) {
    console.error(error.message);
  }
}
```

### Пример 2: Создание нового гостя

```typescript
import { container } from '@/infrastructure';

try {
  const newGuest = await container.createGuestUseCase.execute({
    email: 'john@example.com',
    phoneNumber: '+79991234567',
    firstName: 'John',
    lastName: 'Doe',
    restaurantId: 'rest-123',
    initialPoints: 100
  });

  console.log('Guest created:', newGuest);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.details);
  } else if (error instanceof BusinessLogicError) {
    console.error('Business logic error:', error.message);
  }
}
```

## Типы ошибок

### ValidationError (400)

Ошибки валидации входных данных:

```typescript
throw ValidationError.missingField('email');
throw ValidationError.invalidEmail('invalid');
throw ValidationError.invalidPassword('too weak');
throw ValidationError.multipleErrors([
  { field: 'email', message: 'Invalid email' },
  { field: 'password', message: 'Password too short' }
]);
```

### AuthenticationError (401)

Ошибки аутентификации:

```typescript
throw AuthenticationError.invalidCredentials();
throw AuthenticationError.userNotFound();
throw AuthenticationError.tokenExpired();
throw AuthenticationError.userInactive();
```

### AuthorizationError (403)

Ошибки авторизации:

```typescript
throw AuthorizationError.insufficientPermissions();
throw AuthorizationError.requiresRole('admin');
throw AuthorizationError.forbidden();
```

### NotFoundError (404)

Ошибки когда ресурс не найден:

```typescript
throw NotFoundError.userNotFound(userId);
throw NotFoundError.guestNotFound(guestId);
throw NotFoundError.restaurantNotFound(restaurantId);
```

### BusinessLogicError (400)

Ошибки бизнес-логики:

```typescript
throw BusinessLogicError.insufficientPoints(required, available);
throw BusinessLogicError.pointsExpired();
throw BusinessLogicError.operationFailed('Reason');
throw BusinessLogicError.conflict('Resource already exists');
```

## Validators

### Email Validator

```typescript
import { validateEmail, normalizeEmail } from '@/application';

validateEmail('user@example.com');  // OK
validateEmail('invalid');            // Throws ValidationError

const normalized = normalizeEmail('USER@EXAMPLE.COM');
// Returns: 'user@example.com'
```

### Password Validator

```typescript
import { validatePassword } from '@/application';

validatePassword('SecurePassword123');  // OK
validatePassword('weak');                // Throws ValidationError

validatePassword('custom', {
  minLength: 12,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: true
});
```

### Phone Validator

```typescript
import { validatePhoneNumber, normalizePhoneNumber } from '@/application';

validatePhoneNumber('+79991234567');  // OK
validatePhoneNumber('invalid');        // Throws ValidationError

const normalized = normalizePhoneNumber('+7 (999) 123-45-67');
// Returns: '+79991234567'
```

## DI Container интеграция

### Использование

```typescript
import { container } from '@/infrastructure';

// All use cases available via container
container.loginUseCase
container.getUserUseCase
container.createGuestUseCase
container.getGuestUseCase
// ... more
```

### Добавление нового use case

1. Создать файл `src/application/use-cases/[feature]/[Name]UseCase.ts`
2. Создать класс use case
3. Добавить getter в `src/infrastructure/di/Container.ts`

```typescript
private _myUseCase: MyUseCase | null = null;

get myUseCase(): MyUseCase {
  if (!this._myUseCase) {
    this._myUseCase = new MyUseCase(this.someRepository);
  }
  return this._myUseCase;
}
```

## SOLID Principles

### Single Responsibility
- Каждый use case = одна задача
- Каждый validator = один тип валидации
- Каждая ошибка = один тип проблемы

### Open/Closed
- Легко добавить новый use case
- Легко добавить новый error type
- Легко добавить новый validator

### Liskov Substitution
- Все ошибки наследуются от AppError
- Могут быть обработаны единообразно

### Interface Segregation
- Валидаторы имеют узкий функционал
- Use cases используют только нужные repositories

### Dependency Inversion
- Use cases зависят от интерфейсов repositories
- Не от конкретных реализаций
- Легко подменить mock для тестирования

## Что будет дальше (Phase 3)

- [ ] Vue Components
- [ ] State Management (Pinia)
- [ ] Component Integration
- [ ] Testing (Jest + Vitest)

## Следующие шаги (Phase 2 продолжение)

- [x] Error Handling
- [x] Validators
- [x] First Use Cases (Login, GetUser, CreateGuest, GetGuest)
- [ ] Complete all User Use Cases (Register, Update)
- [ ] Complete all Guest Use Cases (Earn Points, Redeem Points, Statistics)
- [ ] Services Layer (AuthService, UserService, etc)
- [ ] Request/Response DTOs
- [ ] Comprehensive documentation

---

**Status**: Phase 2 - In Progress 🚀
