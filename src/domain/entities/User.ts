/**
 * User Entity - Пользователь системы
 * 
 * Представляет администраторов, рестораторов и кассиров
 */

/**
 * Типы ролей в системе
 */
export type UserRole = 'admin' | 'restaurant' | 'cashier' | 'guest';

/**
 * User энтити - определяет структуру пользователя
 */
export interface User {
  id: string;              // UUID пользователя
  email: string;           // Unique email адрес
  name: string;            // Full name
  role: UserRole;          // Роль в системе
  restaurantId?: string;   // Опционально: ID ресторана (для restaurant/cashier)
  isActive: boolean;       // Пользователь активен
  createdAt: Date;         // Дата создания
  updatedAt: Date;         // Дата последнего обновления
}
