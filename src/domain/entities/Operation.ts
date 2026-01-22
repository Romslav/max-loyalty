/**
 * Operation Entity - операции с баллами для программы лояльности
 * 
 * Представляет любую операцию, которая изменяет баланс баллов клиента
 */

export type OperationType = 'earn' | 'redeem' | 'expire' | 'adjust' | 'refund';

/**
 * Основная сущность Operation
 */
export interface Operation {
  id: string;              // UUID операции
  guestId: string;         // ID клиента
  restaurantId: string;    // ID ресторана
  operationType: OperationType; // Тип операции
  pointsAmount: number;    // Количество баллов (положительное или отрицательное)
  description: string;     // Описание операции
  metadata?: Record<string, any>; // Дополнительные данные
  referenceId?: string;    // ID документа (счета, заказа и т.д.)
  performedBy: string;     // ID пользователя, совершившего операцию
  createdAt: Date;         // Дата операции
  updatedAt: Date;         // Дата последнего обновления
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
  performedBy: string;
  metadata?: Record<string, any>;
  referenceId?: string;
}

/**
 * Ответ от API после создания операции
 */
export interface OperationResponse {
  id: string;              // ID созданной операции
  guestId: string;
  restaurantId: string;
  operationType: OperationType;
  pointsAmount: number;
  previousBalance: number; // Баланс до операции
  newBalance: number;      // Баланс после операции
  description: string;
  createdAt: Date;
}

/**
 * Операция дисконта - когда гость редимирует баллы
 */
export interface RedeemOperation extends Operation {
  discountId?: string;     // ID скидки
  discountValue: number;   // Стоимость скидки
  billId?: string;         // ID счета
}

/**
 * Операция выдачи баллов - при покупке
 */
export interface EarnOperation extends Operation {
  billId: string;          // ID счета/заказа
  billAmount: number;      // Сумма счета
}

/**
 * Фильтры для поиска операций
 */
export interface OperationFilters {
  guestId?: string;        // Фильтр по клиенту
  restaurantId?: string;   // Фильтр по ресторану
  operationType?: OperationType; // Фильтр по типу
  startDate?: Date;        // Начало периода
  endDate?: Date;          // Конец периода
  page?: number;           // Номер страницы
  limit?: number;          // Количество на странице
}
