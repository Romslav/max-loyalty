/**
 * Restaurant Entity - информация о ресторанах
 */

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  adminId: string; // Администратор ресторана
  logo?: string; // URL логотипа
  website?: string;
  isActive: boolean;
  pointsPerDollar: number; // Количество баллов за 1 доллар
  maxPointsPerTransaction?: number; // Максимум баллов за одну трансакцию
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Параметры ресторана
 */
export interface RestaurantSettings {
  restaurantId: string;
  pointsExpirationDays: number; // Даъ в днях до истечения баллов
  minimumPointsToRedeem: number; // Минимальная сумма баллов для начисления
  notifyOnReward: boolean; // Отправлять уведомления гостям
  enableAutoRedemption: boolean; // Автоматически санитарные баллы
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Статистика ресторана
 */
export interface RestaurantStatistics {
  totalGuests: number;
  totalPoints: number; // Всего выдано баллов
  totalRedeemed: number; // Всего выкуплено баллов
  dailyTransactions: number;
  averageTransactionValue: number;
  monthlyRevenue: number;
}

/**
 * Данные для создания нового ресторана
 */
export interface CreateRestaurantInput {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  pointsPerDollar: number;
  adminId: string;
  description?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Данные для обновления ресторана
 */
export interface UpdateRestaurantInput {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  pointsPerDollar?: number;
  isActive?: boolean;
  description?: string;
  website?: string;
}

/**
 * Фильтры для поиска ресторанов
 */
export interface RestaurantFilters {
  isActive?: boolean;
  search?: string; // поиск по имени или городу
  city?: string;
  country?: string;
  page?: number;
  limit?: number;
}

/**
 * Расширенная информация о ресторане с статистикой
 */
export interface RestaurantWithStatistics extends Restaurant {
  statistics: RestaurantStatistics;
  settings?: RestaurantSettings;
}
