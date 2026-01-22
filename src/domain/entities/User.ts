/**
 * User Entity - основная сущность пользователя в системе
 */

export type UserRole = 'admin' | 'restaurant' | 'cashier' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  restaurantId?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Credentials для входа
 */
export interface UserCredentials {
  email: string;
  password: string;
}

/**
 * JWT токены для аутентификации
 */
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // в секундах
  tokenType: 'Bearer';
}

/**
 * Payload JWT токена
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/**
 * Данные для создания нового пользователя
 */
export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  restaurantId?: string;
}

/**
 * Данные для обновления пользователя
 */
export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  restaurantId?: string;
}

/**
 * Фильтры для поиска пользователей
 */
export interface UserFilters {
  role?: UserRole;
  restaurantId?: string;
  isActive?: boolean;
  search?: string; // поиск по email или name
  page?: number;
  limit?: number;
}
