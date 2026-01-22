/**
 * Guest Entity - информация о клиентах программы лояльности
 */

export interface Guest {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  totalPoints: number;
  joinedAt: Date;
  lastVisitAt?: Date;
  lastOperationAt?: Date;
  isActive: boolean;
  restaurantIds: string[]; // Рестораны где гость зарегистрирован
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Статистика гостя
 */
export interface GuestStatistics {
  totalVisits: number;
  totalSpent: number;
  averageSpend: number;
  pointsRedeemed: number;
  pointsAvailable: number;
  lastVisitDate?: Date;
  favoriteRestaurant?: string;
}

/**
 * История операций гостя
 */
export interface GuestOperationHistory {
  guestId: string;
  operationId: string;
  restaurantId: string;
  operationType: 'earn' | 'redeem' | 'expire';
  pointsAmount: number;
  description: string;
  createdAt: Date;
}

/**
 * Данные для создания нового гостя
 */
export interface CreateGuestInput {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  restaurantId: string; // Ресторан где регистрируется
  initialPoints?: number; // Начальные бонусные баллы
}

/**
 * Данные для обновления гостя
 */
export interface UpdateGuestInput {
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

/**
 * Фильтры для поиска гостей
 */
export interface GuestFilters {
  restaurantId?: string;
  isActive?: boolean;
  search?: string; // поиск по email, имени или номеру телефона
  minPoints?: number;
  maxPoints?: number;
  joinedSince?: Date;
  page?: number;
  limit?: number;
}

/**
 * Расширенная информация о госте с статистикой
 */
export interface GuestWithStatistics extends Guest {
  statistics: GuestStatistics;
}
