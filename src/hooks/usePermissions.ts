import { useAuthStore } from '../stores/authStore'

export type Permission =
  | 'user:read'
  | 'user:write'
  | 'user:delete'
  | 'restaurant:read'
  | 'restaurant:write'
  | 'restaurant:delete'
  | 'guest:read'
  | 'guest:write'
  | 'guest:delete'
  | 'analytics:read'
  | 'billing:read'
  | 'billing:write'
  | 'operations:read'
  | 'operations:write'
  | 'audit:read'
  | 'support:read'
  | 'support:write'
  | 'settings:read'
  | 'settings:write'

export type Role = 'admin' | 'restaurant' | 'cashier' | 'guest'

interface PermissionMap {
  [key in Role]: Permission[]
}

// 📋 Матрица прав доступа по ролям
const ROLE_PERMISSIONS: PermissionMap = {
  admin: [
    // Пользователи
    'user:read',
    'user:write',
    'user:delete',
    // Рестораны
    'restaurant:read',
    'restaurant:write',
    'restaurant:delete',
    // Гости
    'guest:read',
    'guest:write',
    'guest:delete',
    // Аналитика
    'analytics:read',
    // Биллинг
    'billing:read',
    'billing:write',
    // Операции
    'operations:read',
    'operations:write',
    // Аудит
    'audit:read',
    // Поддержка
    'support:read',
    'support:write',
    // Настройки
    'settings:read',
    'settings:write',
  ],
  restaurant: [
    // Только свои рестораны
    'restaurant:read',
    'restaurant:write',
    // Гости (чтение только)
    'guest:read',
    // Аналитика
    'analytics:read',
    // Биллинг
    'billing:read',
    'billing:write',
    // Операции
    'operations:read',
    'operations:write',
    // Поддержка
    'support:read',
  ],
  cashier: [
    // Гости (чтение)
    'guest:read',
    // Операции (запись)
    'operations:read',
    'operations:write',
  ],
  guest: [
    // Только свои данные
    'guest:read',
    // Только чтение своих операций
    'operations:read',
  ],
}

// 🗺️ Маршруты по ролям
export const ROLE_ROUTES: Record<Role, string[]> = {
  admin: [
    '/',
    '/guests',
    '/restaurants',
    '/billing',
    '/analytics',
    '/operations',
    '/audit-logs',
    '/support-tickets',
    '/settings',
    '/profile',
  ],
  restaurant: [
    '/',
    '/guests',
    '/billing',
    '/analytics',
    '/operations',
    '/support',
    '/profile',
  ],
  cashier: [
    '/',
    '/guests',
    '/operations',
    '/profile',
  ],
  guest: [
    '/',
    '/profile',
    '/my-operations',
  ],
}

export const usePermissions = () => {
  const user = useAuthStore((state) => state.user)

  /**
   * 🔍 Проверить одно разрешение
   */
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false

    const rolePermissions = ROLE_PERMISSIONS[user.role]
    return rolePermissions.includes(permission)
  }

  /**
   * 🔍 Проверить все разрешения из списка
   */
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission))
  }

  /**
   * 🔍 Проверить хотя бы одно разрешение из списка
   */
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission))
  }

  /**
   * 🔓 Проверить роль
   */
  const hasRole = (role: Role | Role[]): boolean => {
    if (!user) return false

    if (Array.isArray(role)) {
      return role.includes(user.role)
    }

    return user.role === role
  }

  /**
   * 🛣️ Получить доступные маршруты
   */
  const getAvailableRoutes = (): string[] => {
    if (!user) return []
    return ROLE_ROUTES[user.role] || []
  }

  /**
   * 🔐 Проверить доступ к маршруту
   */
  const canAccessRoute = (route: string): boolean => {
    const availableRoutes = getAvailableRoutes()
    // Проверяем точное совпадение или начало маршрута
    return availableRoutes.some(
      (r) => r === route || route.startsWith(r + '/')
    )
  }

  /**
   * 📊 Получить все разрешения пользователя
   */
  const getPermissions = (): Permission[] => {
    if (!user) return []
    return ROLE_PERMISSIONS[user.role] || []
  }

  return {
    user,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    getAvailableRoutes,
    canAccessRoute,
    getPermissions,
  }
}
