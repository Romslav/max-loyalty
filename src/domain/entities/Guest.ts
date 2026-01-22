/**
 * Guest Entity - информация о клиентах программы лояльности
 * 
 * Представляет клиента, участвующего в программе лояльности
 * Может быть зарегистрирован в нескольких ресторанах
 */

/**
 * Основная сущность Guest
 * Хранит информацию о клиенте программы лояльности
 */
export interface Guest {
  id: string;              // UUID клиента
  email: string;           // Email клиента
  phoneNumber: string;     // Номер телефона
  firstName: string;       // Имя
  lastName: string;        // Фамилия
  totalPoints: number;     // Общее количество баллов
  joinedAt: Date;          // Дата присоединения к программе
  lastVisitAt?: Date;      // Дата последнего визита
  lastOperationAt?: Date;  // Дата последней операции с баллами
  isActive: boolean;       // Активен ли гость
  restaurantIds: string[]; // Рестораны, где гость зарегистрирован
  createdAt: Date;         // Дата создания записи
  updatedAt: Date;         // Дата последнего обновления
}

/**
 * Статистика гостя
 * Кэшированные данные для быстрого доступа
 */
export interface GuestStatistics {
  totalVisits: number;       // Всего визитов
  totalSpent: number;        // Всего потрачено денег
  averageSpend: number;      // Средний чек
  pointsRedeemed: number;    // Использовано баллов
  pointsAvailable: number;   // Доступно баллов
  lastVisitDate?: Date;      // Дата последнего визита
  favoriteRestaurant?: string; // Любимый ресторан
}

/**
 * История операций гостя
 * Логирует каждую операцию с баллами
 */
export interface GuestOperationHistory {
  guestId: string;         // ID гостя
  operationId: string;     // ID операции
  restaurantId: string;    // ID ресторана
  operationType: 'earn' | 'redeem' | 'expire'; // Тип операции
  pointsAmount: number;    // Количество баллов
  description: string;     // Описание операции
  createdAt: Date;         // Дата операции
}

/**
 * Данные для создания нового гостя
 */
export interface CreateGuestInput {
  email: string;           // Email гостя
  phoneNumber: string;     // Номер телефона
  firstName: string;       // Имя
  lastName: string;        // Фамилия
  restaurantId: string;    // Ресторан, в котором регистрируется гость
  initialPoints?: number;  // Начальные бонусные баллы (опционально)
}

/**
 * Данные для обновления гостя
 */
export interface UpdateGuestInput {
  email?: string;          // Новый email
  phoneNumber?: string;    // Новый номер телефона
  firstName?: string;      // Новое имя
  lastName?: string;       // Новая фамилия
  isActive?: boolean;      // Статус активности
}

/**
 * Фильтры для поиска гостей
 */
export interface GuestFilters {
  restaurantId?: string;   // Фильтр по ресторану
  isActive?: boolean;      // Фильтр по активности
  search?: string;         // Поиск по email, имени или номеру телефона
  minPoints?: number;      // Минимум баллов
  maxPoints?: number;      // Максимум баллов
  joinedSince?: Date;      // Присоединился после даты
  page?: number;           // Номер страницы
  limit?: number;          // Количество элементов на странице
}

/**
 * Расширенная информация о госте со статистикой
 */
export interface GuestWithStatistics extends Guest {
  statistics: GuestStatistics; // Кэшированная статистика
}
