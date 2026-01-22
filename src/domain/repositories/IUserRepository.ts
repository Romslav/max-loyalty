/**
 * IUserRepository - интерфейс для доступа к данным пользователей
 * Реализует Repository Pattern для абстракции доступа к данным
 */

import type { User, CreateUserInput, UpdateUserInput, UserFilters } from '../entities';

export interface IUserRepository {
  /**
   * Получить пользователя по ID
   * @param id - ID пользователя
   * @returns Пользователь или null если не найден
   */
  findById(id: string): Promise<User | null>;

  /**
   * Получить пользователя по email
   * @param email - Email пользователя
   * @returns Пользователь или null если не найден
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Получить всех пользователей с фильтрами и пагинацией
   * @param filters - Фильтры поиска
   * @returns Массив пользователей
   */
  findAll(filters?: UserFilters): Promise<User[]>;

  /**
   * Получить количество пользователей
   * @param filters - Фильтры поиска
   * @returns Количество пользователей
   */
  count(filters?: UserFilters): Promise<number>;

  /**
   * Создать нового пользователя
   * @param input - Данные для создания
   * @returns Созданный пользователь
   */
  create(input: CreateUserInput): Promise<User>;

  /**
   * Обновить пользователя
   * @param id - ID пользователя
   * @param input - Данные для обновления
   * @returns Обновленный пользователь
   */
  update(id: string, input: UpdateUserInput): Promise<User>;

  /**
   * Удалить пользователя
   * @param id - ID пользователя
   */
  delete(id: string): Promise<void>;

  /**
   * Проверить существует ли пользователь по email
   * @param email - Email для проверки
   * @returns true если существует, false иначе
   */
  existsByEmail(email: string): Promise<boolean>;
}
