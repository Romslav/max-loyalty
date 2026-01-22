/**
 * Billing Entity - счета и расчеты
 * 
 * Представляет счет за покупку с информацией о скидках и использованных баллах
 */

export type BillingStatus = 'pending' | 'completed' | 'cancelled' | 'failed';
export type PaymentMethod = 'cash' | 'card' | 'points' | 'mixed';

/**
 * Основная сущность Billing
 */
export interface Billing {
  id: string;              // UUID счета
  guestId: string;         // ID клиента
  restaurantId: string;    // ID ресторана
  totalAmount: number;     // Итоговая сумма
  subtotal: number;        // Сумма до скидок
  discountAmount: number;  // Общая скидка
  pointsUsed: number;      // Используемые баллы (конвертированы в деньги)
  pointsEarned: number;    // Заработанные баллы
  status: BillingStatus;   // Статус счета
  paymentMethod: PaymentMethod; // Способ оплаты
  items: BillingItem[];    // Товары/услуги
  notes?: string;          // Примечания
  createdAt: Date;         // Дата создания
  updatedAt: Date;         // Дата последнего обновления
}

/**
 * Предмет счета
 */
export interface BillingItem {
  id: string;              // ID товара
  name: string;            // Название
  quantity: number;        // Количество
  unitPrice: number;       // Цена за единицу
  totalPrice: number;      // Общая стоимость (quantity * unitPrice)
  notes?: string;          // Примечания
}

/**
 * Информация о скидке
 */
export interface DiscountInfo {
  discountId?: string;     // ID скидки
  discountType: 'percentage' | 'fixed' | 'points'; // Тип скидки
  discountValue: number;   // Размер скидки
  appliedAt: Date;         // Когда применена
}

/**
 * Данные для создания счета
 */
export interface CreateBillingInput {
  guestId: string;
  restaurantId: string;
  items: BillingItem[];
  discounts?: DiscountInfo[];
  paymentMethod: PaymentMethod;
  pointsToUse?: number;
  notes?: string;
}

/**
 * Ответ после оформления счета
 */
export interface BillingResponse {
  billingId: string;       // ID счета
  status: BillingStatus;   // Статус
  totalAmount: number;     // Итог
  pointsUsed: number;      // Используемые баллы
  pointsEarned: number;    // Заработанные баллы
  newGuestBalance: number; // Новый баланс гостя
  createdAt: Date;         // Дата создания
}

/**
 * Отчет по счетам
 */
export interface BillingReport {
  restaurantId: string;
  periodStart: Date;
  periodEnd: Date;
  totalBillings: number;   // Всего счетов
  totalAmount: number;     // Общая сумма
  totalDiscounts: number;  // Общие скидки
  totalPointsIssued: number; // Выданные баллы
  totalPointsRedeemed: number; // Использованные баллы
  averageTransactionValue: number; // Средняя стоимость
  paymentMethodBreakdown: Record<PaymentMethod, number>; // Распределение по способам оплаты
}

/**
 * Фильтры для поиска счетов
 */
export interface BillingFilters {
  guestId?: string;        // Фильтр по клиенту
  restaurantId?: string;   // Фильтр по ресторану
  status?: BillingStatus;  // Фильтр по статусу
  paymentMethod?: PaymentMethod; // Фильтр по способу оплаты
  startDate?: Date;        // Начало периода
  endDate?: Date;          // Конец периода
  page?: number;           // Номер страницы
  limit?: number;          // Количество на странице
}
