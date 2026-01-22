/**
 * IBillingRepository - интерфейс для доступа к счетам и расчетам
 */

import type { Billing, CreateBillingInput, BillingFilters, BillingReport } from '../entities';

export interface IBillingRepository {
  /**
   * Получить счет по ID
   */
  findById(id: string): Promise<Billing | null>;

  /**
   * Получить все счета с фильтрами
   */
  findAll(filters?: BillingFilters): Promise<Billing[]>;

  /**
   * Количество счетов
   */
  count(filters?: BillingFilters): Promise<number>;

  /**
   * Создать новый счет
   */
  create(input: CreateBillingInput): Promise<Billing>;

  /**
   * Обновить счет
   */
  update(id: string, data: Partial<Billing>): Promise<Billing>;

  /**
   * Получить все счета клиента
   */
  findByGuestId(guestId: string, filters?: BillingFilters): Promise<Billing[]>;

  /**
   * Получить все счета ресторана
   */
  findByRestaurantId(restaurantId: string, filters?: BillingFilters): Promise<Billing[]>;

  /**
   * Получить отчет по расчетам
   */
  getReport(restaurantId: string, startDate: Date, endDate: Date): Promise<BillingReport>;
}
