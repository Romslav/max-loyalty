/**
 * User Entity - основная сущность пользователя в системе
 * 
 * Представляет пользователя системы (администратор, менеджер ресторана, кассир)
 * Не содержит пароль хеша или других чувствительных данных
 */

export type UserRole = 'admin' | 'restaurant' | 'cashier' | 'guest';

/**
 * Основная сущность User
 * Хранит основную информацию о пользователе
 */
export interface User {
  id: string;              // UUID пользователя
  email: string;           // Уникальный email
  name: string;            // ФИ или имя пользователя
  role: UserRole;          // Роль в системе
  restaurantId?: string;   // ID ресторана (если роль restaurant/cashier)
  isActive: boolean;       // Активен ли пользователь
  lastLoginAt?: Date;      // Последний вход в систему
  createdAt: Date;         // Дата создания
  updatedAt: Date;         // Дата последнего обновления
}

/**
 * Credentials для входа в систему
 */
export interface UserCredentials {
  email: string;
  password: string;
}

/**
 * JWT токены для аутентификации
 */
export interface AuthToken {
  accessToken: string;     // Access token для API запросов
  refreshToken: string;    // Refresh token для обновления access token
  expiresIn: number;       // Время жизни access token в секундах
  tokenType: 'Bearer';     // Тип токена (всегда Bearer)
}

/**
 * Payload JWT токена
 * Содержит основную информацию о пользователе внутри токена
 */
export interface JWTPayload {
  userId: string;          // ID пользователя
  email: string;           // Email пользователя
  role: UserRole;          // Роль пользователя
  iat: number;             // Issued at (временная метка создания)
  exp: number;             // Expiration (временная метка истечения)
}

/**
 * Данные для создания нового пользователя
 */
export interface CreateUserInput {
  email: string;           // Уникальный email
  name: string;            // ФИ пользователя
  password: string;        // Пароль (будет захеширован на сервере)
  role: UserRole;          // Роль в системе
  restaurantId?: string;   // ID ресторана (обязателен для restaurant/cashier)
}

/**
 * Данные для обновления пользователя
 */
export interface UpdateUserInput {
  name?: string;           // Новое имя
  email?: string;          // Новый email
  password?: string;       // Новый пароль
  isActive?: boolean;      // Активность
  restaurantId?: string;   // Связанный ресторан
}

/**
 * Фильтры для поиска пользователей
 */
export interface UserFilters {
  role?: UserRole;         // Фильтр по роли
  restaurantId?: string;   // Фильтр по ресторану
  isActive?: boolean;      // Фильтр по активности
  search?: string;         // Поиск по email или name
  page?: number;           // Номер страницы (для пагинации)
  limit?: number;          // Количество элементов на странице
}
