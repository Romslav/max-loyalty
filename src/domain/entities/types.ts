/**
 * Input/Output types for domain entities
 * 
 * Определяют входные данные для создания и обновления сущностей
 */

import type { UserRole } from './User';

// ============================================================================
// USER INPUT TYPES
// ============================================================================

/**
 * Входные данные для создания пользователя
 */
export interface CreateUserInput {
  email: string;           // Почта пользователя
  password: string;        // Пароль
  name: string;            // Ополненное имя
  role: UserRole;          // Роль
  restaurantId?: string;   // Опционально: ID ресторана
}

/**
 * Входные данные для обновления пользователя
 */
export interface UpdateUserInput {
  email?: string;          // Опционально
  name?: string;           // Опционально
  password?: string;       // Опционально
}

// ============================================================================
// GUEST INPUT TYPES
// ============================================================================

/**
 * Входные данные для создания гостя
 */
export interface CreateGuestInput {
  email: string;              // Почта гостя
  phoneNumber: string;        // Номер телефона
  firstName: string;          // Имя
  lastName: string;           // Фамилия
  restaurantId: string;       // ID ресторана
  initialPoints?: number;     // Опционально: Начальные баллы
}

/**
 * Входные данные для обновления гостя
 */
export interface UpdateGuestInput {
  email?: string;          // Опционально
  phoneNumber?: string;    // Опционально
  firstName?: string;      // Опционально
  lastName?: string;       // Опционально
}

// ============================================================================
// AUTH TYPES
// ============================================================================

/**
 * JWT Token data
 */
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
