import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { usePermissions, Permission, Role } from '../hooks/usePermissions'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: Role | Role[]
  requiredPermission?: Permission | Permission[]
  requiredAllPermissions?: boolean
}

/**
 * 🔐 ProtectedRoute
 * 
 * Компонент для защиты маршрутов по ролям и правам доступа.
 * 
 * Использование:
 * ```tsx
 * <ProtectedRoute requiredRole="admin">
 *   <AdminDashboard />
 * </ProtectedRoute>
 * 
 * <ProtectedRoute requiredPermission="billing:write">
 *   <BillingManagement />
 * </ProtectedRoute>
 * 
 * <ProtectedRoute 
 *   requiredPermission={['guest:read', 'guest:write']}
 *   requiredAllPermissions={true}
 * >
 *   <GuestEditor />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute = ({
  children,
  requiredRole,
  requiredPermission,
  requiredAllPermissions = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore((state) => ({
    isAuthenticated: !!state.user,
  }))
  const { hasRole, hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions()

  // ❌ Не авторизован
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  // 🔍 Проверяем роль
  if (requiredRole) {
    if (!hasRole(requiredRole)) {
      return <Navigate to="/" replace />
    }
  }

  // 🔍 Проверяем права доступа
  if (requiredPermission) {
    if (Array.isArray(requiredPermission)) {
      const hasAccess = requiredAllPermissions
        ? hasAllPermissions(requiredPermission)
        : hasAnyPermission(requiredPermission)

      if (!hasAccess) {
        return <Navigate to="/" replace />
      }
    } else {
      if (!hasPermission(requiredPermission)) {
        return <Navigate to="/" replace />
      }
    }
  }

  // ✅ Все проверки пройдены
  return <>{children}</>
}

export default ProtectedRoute
