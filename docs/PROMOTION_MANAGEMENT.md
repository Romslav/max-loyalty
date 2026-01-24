# 🎯 Promotion Management System

Полная система управления промоакциями для loyalist-платформы. Поддерживает создание, управление, валидацию и применение промокодов.

## 📋 Содержание

1. [Обзор](#обзор)
2. [Архитектура](#архитектура)
3. [Компоненты](#компоненты)
4. [Use Cases](#use-cases)
5. [API](#api)
6. [Примеры использования](#примеры-использования)
7. [Тестирование](#тестирование)

## 🎯 Обзор

Система промоакций обеспечивает:

- ✅ **Создание промокодов** - Поддержка различных типов скидок
- ✅ **Управление промоциями** - CRUD операции, статусы, расписания
- ✅ **Валидация кодов** - Проверка условий применения
- ✅ **Применение скидок** - Расчет и учет использования
- ✅ **Аналитика** - Статистика по использованию
- ✅ **Многоуровневость** - Разная применяемость по уровням гостей

## 🏗️ Архитектура

### Domain Layer
```
PromotionType: PERCENTAGE | FIXED_AMOUNT | TIER_BASED | POINTS_MULTIPLIER
PromotionStatus: DRAFT | ACTIVE | SCHEDULED | PAUSED | EXPIRED | ARCHIVED
PromotionScope: single_use | per_guest | unlimited
```

### Application Layer
- `CreatePromotionUseCase` - Создание новых промокодов
- `ValidatePromotionCodeUseCase` - Валидация применимости кода
- `ApplyPromotionUseCase` - Применение скидки к заказу
- `UpdatePromotionUseCase` - Обновление параметров
- `DeletePromotionUseCase` - Удаление архивирование

### UI Layer
- `PromotionForm` - Форма создания/редактирования
- `PromotionCard` - Карточка промоакции
- `PromotionStats` - Статистика и аналитика
- `PromotionManagementPage` - Главная страница управления

## 📦 Компоненты

### Promotion Entity
```typescript
interface Promotion {
  id: string
  code: string
  name: string
  description: string
  discount: DiscountConfig
  rules: PromotionRules
  status: PromotionStatus
  usage: PromotionUsage
  createdAt: Date
  updatedAt: Date
  createdBy: string
}
```

### Discount Config
```typescript
interface DiscountConfig {
  type: PromotionType // PERCENTAGE | FIXED_AMOUNT | TIER_BASED | POINTS_MULTIPLIER
  value: number
  maxDiscount?: number // Максимальная скидка
  minPurchase?: number // Минимальная покупка
  maxUsesPerGuest?: number // Макс использований на гостя
  applicableTiers: string[] // Применяемые уровни
}
```

### Promotion Rules
```typescript
interface PromotionRules {
  scope: 'single_use' | 'per_guest' | 'unlimited'
  startDate: Date
  endDate: Date
  maxUsage: number
  currentUsage: number
  requiresBirthday?: boolean // Требует день рождения
  requiresReferral?: boolean // Требует рефераля
  excludedCategories?: string[]
  applicableMenuItems?: string[]
}
```

## 🔄 Use Cases

### CreatePromotionUseCase

Создание новой промоакции с полной валидацией.

```typescript
const useCase = new CreatePromotionUseCase(repository)
const result = await useCase.execute({
  name: 'Summer Sale',
  description: 'Get 20% off',
  discountType: PromotionType.PERCENTAGE,
  discountValue: 20,
  applicableTiers: ['gold', 'platinum'],
  startDate: new Date('2026-06-01'),
  endDate: new Date('2026-08-31'),
  maxUsage: 1000,
  scope: 'unlimited',
  createdBy: 'admin-id'
})
```

### ValidatePromotionCodeUseCase

Проверка возможности применить промокод.

```typescript
const useCase = new ValidatePromotionCodeUseCase(repository)
const result = await useCase.execute({
  code: 'SUMMER20',
  guestId: 'guest-123',
  guestTier: 'gold',
  guestPoints: 500,
  orderAmount: 100
})

if (result.isValid) {
  console.log(`Discount: $${result.promotion?.discount}`)
}
```

### ApplyPromotionUseCase

Применение скидки к заказу.

```typescript
const useCase = new ApplyPromotionUseCase(repository)
const result = await useCase.execute({
  code: 'SUMMER20',
  guestId: 'guest-123',
  guestTier: 'gold',
  orderAmount: 100,
  orderId: 'order-123'
})

console.log(`Final amount: $${result.finalOrderAmount}`)
console.log(`Points earned: ${result.pointsEarned}`)
```

## 📡 API

### Repository Interface

```typescript
interface IPromotionRepository {
  // CRUD
  create(promotion: Promotion): Promise<Promotion>
  getById(id: string): Promise<Promotion | null>
  update(id: string, updates: Partial<any>): Promise<Promotion>
  delete(id: string): Promise<boolean>
  
  // Search
  getByCode(code: string): Promise<Promotion | null>
  getByStatus(status: PromotionStatus): Promise<Promotion[]>
  getActive(): Promise<Promotion[]>
  search(query: string): Promise<Promotion[]>
  
  // Analytics
  getStatistics(id: string): Promise<PromotionStats>
  getTopByUsage(limit: number): Promise<Promotion[]>
  
  // Pagination
  getPaginated(page: number, limit: number, filters?: any): Promise<{
    items: Promotion[]
    total: number
    page: number
    limit: number
  }>
}
```

## 🔧 Примеры использования

### Пример 1: Создание промоакции

```typescript
import CreatePromotionUseCase from '@/application/use-cases/promotion/CreatePromotionUseCase'
import PromotionRepository from '@/infrastructure/repositories/PromotionRepository'

const repository = new PromotionRepository(db)
const createUseCase = new CreatePromotionUseCase(repository)

try {
  const result = await createUseCase.execute({
    name: 'Birthday Special',
    description: 'Special offer for birthdays',
    discountType: PromotionType.FIXED_AMOUNT,
    discountValue: 25,
    applicableTiers: ['all'],
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxUsage: 5000,
    scope: 'per_guest',
    requiresBirthday: true,
    createdBy: 'admin-123'
  })
  console.log(`Created promotion: ${result.code}`)
} catch (error) {
  console.error('Failed to create promotion:', error)
}
```

### Пример 2: Валидация кода при чекауте

```typescript
const validateUseCase = new ValidatePromotionCodeUseCase(repository)

const validation = await validateUseCase.execute({
  code: userEnteredCode,
  guestId: guest.id,
  guestTier: guest.tier,
  guestPoints: guest.points,
  orderAmount: cartTotal
})

if (validation.isValid) {
  // Показать скидку
  displayDiscount(validation.promotion)
} else {
  // Показать ошибку
  showError(validation.error)
  
  // Показать подсказки
  if (validation.warnings) {
    showWarnings(validation.warnings)
  }
}
```

### Пример 3: Применение скидки

```typescript
const applyUseCase = new ApplyPromotionUseCase(repository)

const result = await applyUseCase.execute({
  code: promotionCode,
  guestId: guest.id,
  guestTier: guest.tier,
  orderAmount: cartTotal,
  orderId: order.id
})

// Обновить итоги заказа
order.discount = result.discountAmount
order.total = result.finalOrderAmount
order.pointsEarned = result.pointsEarned

await order.save()
```

## 🧪 Тестирование

### Unit Tests

```bash
npm test -- tests/domain/entities/promotion.test.ts
npm test -- tests/application/use-cases/promotion.usecases.test.ts
```

### Test Coverage

- ✅ Promotion Entity Business Logic
- ✅ Discount Calculations
- ✅ Tier-based Eligibility
- ✅ Usage Tracking
- ✅ Date Validation
- ✅ Scope Rules (single_use, per_guest, unlimited)
- ✅ Use Case Execution
- ✅ Error Handling

### Пример теста

```typescript
test('should calculate percentage discount correctly', () => {
  const promotion = new Promotion(...)
  const discount = promotion.calculateDiscount(100, 'gold')
  expect(discount).toBe(20) // 20% of 100
})

test('should reject if tier not applicable', async () => {
  const useCase = new ValidatePromotionCodeUseCase(repository)
  const result = await useCase.execute({
    code: 'SUMMER20',
    guestId: 'guest-123',
    guestTier: 'bronze',
    guestPoints: 100,
    orderAmount: 100
  })
  expect(result.isValid).toBe(false)
})
```

## 📊 Статистика

Система отслеживает:

- 📈 Общее количество использований
- 💰 Общая сумма скидок
- 👥 Количество уникальных гостей
- 🎯 Использование по уровням
- ⏱️ Средняя стоимость заказа
- 📊 Процент конверсии

## 🔐 Безопасность

- ✅ Валидация всех входящих данных
- ✅ Проверка прав доступа (admin only)
- ✅ Аудит всех операций
- ✅ Защита от дублирования кодов
- ✅ Ограничение использования
- ✅ Временные ограничения

## 📝 Лучшие практики

1. **Всегда валидируйте код перед применением**
   ```typescript
   const validation = await validateUseCase.execute(...)
   if (!validation.isValid) throw new Error(validation.error)
   ```

2. **Используйте транзакции при применении**
   ```typescript
   await db.transaction(async (trx) => {
     await applyUseCase.execute(...)
     await order.save(trx)
   })
   ```

3. **Мониторьте использование**
   ```typescript
   const stats = await repository.getStatistics(promotionId)
   if (stats.usageRate > 0.9) alert('Promotion almost used up')
   ```

## 🚀 Дальнейшее развитие

- [ ] Правила комбинирования промокодов
- [ ] Автоматизированные кампании
- [ ] A/B тестирование
- [ ] Прогноз ROI
- [ ] Интеграция с маркетингом
- [ ] Экспорт отчетов

---

**Версия:** 1.0.0  
**Статус:** Production Ready  
**Последнее обновление:** 2026-01-24
