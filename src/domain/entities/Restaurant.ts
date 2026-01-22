/**
 * Restaurant Entity - информация о ресторанах
 * 
 * Представляет ресторан, участвующий в программе лояльности
 * Каждый ресторан имеет свои настройки и пользователей
 */

/**
 * Основная сущность Restaurant
 */
export interface Restaurant {
  id: string;              // UUID ресторана
  name: string;            // Название ресторана
  description?: string;    // Описание
  email: string;           // Email ресторана
  phoneNumber: string;     // Номер телефона
  address: string;         // Адрес
  city: string;            // Город
  country: string;         // Страна
  postalCode: string;      // Почтовый индекс
  latitude?: number;       // Широта для карты
  longitude?: number;      // Долгота для карты
  adminId: string;         // ID администратора ресторана
  logo?: string;           // URL логотипа
  website?: string;        // Веб-сайт
  isActive: boolean;       // Активен ли ресторан
  pointsPerDollar: number; // Количество баллов за 1 доллар
  maxPointsPerTransaction?: number; // Максимум баллов за одну трансакцию
  createdAt: Date;         // Дата создания
  updatedAt: Date;         // Дата последнего обновления
}

/**
 * Параметры ресторана
 */
export interface RestaurantSettings {
  restaurantId: string;           // ID ресторана
  pointsExpirationDays: number;   // Дней до истечения баллов
  minimumPointsToRedeem: number;  // Минимальная сумма баллов для начисления
  notifyOnReward: boolean;        // Отправлять уведомления гостям
  enableAutoRedemption: boolean;  // Автоматическое начисление баллов
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Статистика ресторана
 */
export interface RestaurantStatistics {
  totalGuests: number;       // Всего клиентов
  totalPoints: number;       // Всего выдано баллов
  totalRedeemed: number;     // Всего выкуплено баллов
  dailyTransactions: number; // Транзакций в день
  averageTransactionValue: number; // Средняя стоимость транзакции
  monthlyRevenue: number;    // Ежемесячный доход
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
  isActive?: boolean;      // Активны ли
  search?: string;         // Поиск по названию или городу
  city?: string;           // Фильтр по городу
  country?: string;        // Фильтр по стране
  page?: number;           // Номер страницы
  limit?: number;          // Количество на странице
}

/**
 * Расширенная информация о ресторане со статистикой
 */
export interface RestaurantWithStatistics extends Restaurant {
  statistics: RestaurantStatistics;
  settings?: RestaurantSettings;
}
