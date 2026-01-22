/**
 * IOperationRepository - интерфейс для доступа к операциям с баллами
 */

import type { Operation, CreateOperationInput, OperationFilters } from '../entities';

export interface IOperationRepository {
  /**
   * Получить операцию по ID
   */
  findById(id: string): Promise<Operation | null>;

  /**
   * Получить все операции с фильтрами
   */
  findAll(filters?: OperationFilters): Promise<Operation[]>;

  /**
   * Количество операций
   */
  count(filters?: OperationFilters): Promise<number>;

  /**
   * Создать новую операцию
   */
  create(input: CreateOperationInput): Promise<Operation>;

  /**
   * Обновить операцию
   */
  update(id: string, data: Partial<Operation>): Promise<Operation>;

  /**
   * Удалить операцию
   */
  delete(id: string): Promise<void>;

  /**
   * Получить все операции клиента
   */
  findByGuestId(guestId: string, filters?: OperationFilters): Promise<Operation[]>;

  /**
   * Получить все операции ресторана
   */
  findByRestaurantId(restaurantId: string, filters?: OperationFilters): Promise<Operation[]>;

  /**
   * Получить все операции клиента в ресторане
   */
  findByGuestAndRestaurant(guestId: string, restaurantId: string, filters?: OperationFilters): Promise<Operation[]>;
}
