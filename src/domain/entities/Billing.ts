/**
 * Billing Entity - расчеты и счета между ресторанами и гостями
 */

export type BillingStatus = 'pending' | 'completed' | 'cancelled' | 'failed';
export type PaymentMethod = 'cash' | 'card' | 'points' | 'mixed';

export interface Billing {
  id: string;
  guestId: string;
  restaurantId: string;
  totalAmount: number; // Общая сумма счета
  subtotal: number; // Вычтенъ перед скидками
  discountAmount: number; // Общая скидка
  pointsUsed: number; // Количество баллов аспользованных для оплаты
  pointsEarned: number; // Количество начисленных баллов
  status: BillingStatus;
  paymentMethod: PaymentMethod;
  items: BillingItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Предмет счета
 */
export interface BillingItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number; // quantity * unitPrice
  notes?: string;
}

/**
 * Параметры для дисконта
 */
export interface DiscountInfo {
  discountId?: string;
  discountType: 'percentage' | 'fixed' | 'points';
  discountValue: number;
  appliedAt: Date;
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
  billingId: string;
  status: BillingStatus;
  totalAmount: number;
  pointsUsed: number;
  pointsEarned: number;
  newGuestBalance: number;
  createdAt: Date;
}

/**
 * Отчет по среднестам
 */
export interface BillingReport {
  restaurantId: string;
  periodStart: Date;
  periodEnd: Date;
  totalBillings: number;
  totalAmount: number;
  totalDiscounts: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  averageTransactionValue: number;
  paymentMethodBreakdown: Record<PaymentMethod, number>;
}

/**
 * Фильтры для поиска счетов
 */
export interface BillingFilters {
  guestId?: string;
  restaurantId?: string;
  status?: BillingStatus;
  paymentMethod?: PaymentMethod;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
