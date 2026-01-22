/**
 * Operation Entity - операции с баллами для программы лояльности
 */

export type OperationType = 'earn' | 'redeem' | 'expire' | 'adjust' | 'refund';

export interface Operation {
  id: string;
  guestId: string;
  restaurantId: string;
  operationType: OperationType;
  pointsAmount: number; // Положительная выдая, отрицательная списывают
  description: string;
  metadata?: Record<string, any>; // Дополнительная информация
  referenceId?: string; // ID документа (торговли, иска, итд)
  performedBy: string; // ID усера который совершил операцию
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Данные для создания операции
 */
export interface CreateOperationInput {
  guestId: string;
  restaurantId: string;
  operationType: OperationType;
  pointsAmount: number;
  description: string;
  performedBy: string; // ID кассира или админа
  metadata?: Record<string, any>;
  referenceId?: string;
}

/**
 * Ответ от API фор сохранения операции
 */
export interface OperationResponse {
  id: string;
  guestId: string;
  restaurantId: string;
  operationType: OperationType;
  pointsAmount: number;
  previousBalance: number;
  newBalance: number;
  description: string;
  createdAt: Date;
}

/**
 * Операция дисконта - когда гость редимирует баллы
 */
export interface RedeemOperation extends Operation {
  discountId?: string; // ID дисконта или рыдемпции
  discountValue: number; // Стоимость дисконта
  billId?: string; // ID счета на который снижен банк
}

/**
 * Операция выдачи баллов - запись куплю с суммой
 */
export interface EarnOperation extends Operation {
  billId: string; // ID счета для выдачи баллов
  billAmount: number; // Сумма счета
}

/**
 * Фильтры для поиска операций
 */
export interface OperationFilters {
  guestId?: string;
  restaurantId?: string;
  operationType?: OperationType;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
