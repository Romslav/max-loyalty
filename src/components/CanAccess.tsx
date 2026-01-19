import { usePermissions, Permission, Role } from '../hooks/usePermissions'

interface CanAccessProps {
  children: React.ReactNode
  permission?: Permission | Permission[]
  role?: Role | Role[]
  fallback?: React.ReactNode
  requireAll?: boolean
}

/**
 * 🔍 CanAccess
 * 
 * Компонент для условного рендеринга гелементов на основе прав доступа.
 * 
 * Использование:
 * ```tsx
 * {/* Показать кнопку делета, если есть право */}
 * <CanAccess permission="guest:delete">
 *   <button onClick={handleDelete}>🗑️ Удалить</button>
 * </CanAccess>
 *
 * {/* Кнопка доступна только для админов */}
 * <CanAccess role="admin">
 *   <button>🔈️ Панель админа</button>
 * </CanAccess>
 *
 * {/* При отсутствии прав показывать fallback */}
 * <CanAccess 
 *   permission="billing:write"
 *   fallback={<span>🔐 Нет прав</span>}
 * >
 *   <button>📋 Оптимизировать счет</button>
 * </CanAccess>
 * ```
 */
export const CanAccess = ({
  children,
  permission,
  role,
  fallback,
  requireAll = false,
}: CanAccessProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } =
    usePermissions()

  let hasAccess = true

  // 🔍 Проверяем права
  if (permission) {
    if (Array.isArray(permission)) {
      hasAccess = requireAll
        ? hasAllPermissions(permission)
        : hasAnyPermission(permission)
    } else {
      hasAccess = hasPermission(permission)
    }
  }

  // 🔍 Проверяем роль
  if (role && hasAccess) {
    hasAccess = hasRole(role)
  }

  return hasAccess ? <>{children}</> : fallback || null
}

export default CanAccess
