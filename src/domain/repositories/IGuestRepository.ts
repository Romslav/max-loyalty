/**
 * IGuestRepository - интерфейс для доступа к данным клиентов
 */

import type { Guest, GuestStatistics, CreateGuestInput, UpdateGuestInput, GuestFilters } from '../entities';

export interface IGuestRepository {
  /**
   * Получить клиента по ID
   */
  findById(id: string): Promise<Guest | null>;

  /**
   * Получить клиента по email
   */
  findByEmail(email: string): Promise<Guest | null>;

  /**
   * Получить клиента по номеру телефона
   */
  findByPhoneNumber(phoneNumber: string): Promise<Guest | null>;

  /**
   * Получить всех клиентов с фильтрами
   */
  findAll(filters?: GuestFilters): Promise<Guest[]>;

  /**
   * Количество клиентов
   */
  count(filters?: GuestFilters): Promise<number>;

  /**
   * Создать нового клиента
   */
  create(input: CreateGuestInput): Promise<Guest>;

  /**
   * Обновить клиента
   */
  update(id: string, input: UpdateGuestInput): Promise<Guest>;

  /**
   * Удалить клиента
   */
  delete(id: string): Promise<void>;

  /**
   * Найти всех клиентов ресторана
   */
  findByRestaurantId(restaurantId: string, filters?: GuestFilters): Promise<Guest[]>;

  /**
   * Получить статистику клиента
   */
  getStatistics(guestId: string): Promise<GuestStatistics | null>;
}
