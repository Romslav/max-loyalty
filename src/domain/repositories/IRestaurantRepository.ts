/**
 * IRestaurantRepository - интерфейс для доступа к данным ресторанов
 */

import type { Restaurant, RestaurantSettings, RestaurantStatistics, CreateRestaurantInput, UpdateRestaurantInput, RestaurantFilters } from '../entities';

export interface IRestaurantRepository {
  /**
   * Получить ресторан по ID
   */
  findById(id: string): Promise<Restaurant | null>;

  /**
   * Получить все рестораны с фильтрами
   */
  findAll(filters?: RestaurantFilters): Promise<Restaurant[]>;

  /**
   * Количество ресторанов
   */
  count(filters?: RestaurantFilters): Promise<number>;

  /**
   * Создать новый ресторан
   */
  create(input: CreateRestaurantInput): Promise<Restaurant>;

  /**
   * Обновить ресторан
   */
  update(id: string, input: UpdateRestaurantInput): Promise<Restaurant>;

  /**
   * Удалить ресторан
   */
  delete(id: string): Promise<void>;

  /**
   * Получить все рестораны администратора
   */
  findByAdminId(adminId: string): Promise<Restaurant[]>;

  /**
   * Получить настройки ресторана
   */
  getSettings(restaurantId: string): Promise<RestaurantSettings | null>;

  /**
   * Обновить настройки ресторана
   */
  updateSettings(restaurantId: string, settings: Partial<RestaurantSettings>): Promise<RestaurantSettings>;

  /**
   * Получить статистику ресторана
   */
  getStatistics(restaurantId: string): Promise<RestaurantStatistics | null>;
}
