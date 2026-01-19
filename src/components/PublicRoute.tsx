import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface PublicRouteProps {
  children: React.ReactNode
}

/**
 * 🌐 PublicRoute
 * 
 * Компонент для страниц, доступных только неавторизованным пользователям.
 * Авторизованные пользователи перенаправляются на главную страницу.
 * 
 * Использование:
 * ```tsx
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 * 
 * <PublicRoute>
 *   <RegisterPage />
 * </PublicRoute>
 * ```
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated } = useAuthStore((state) => ({
    isAuthenticated: !!state.user,
  }))

  // ✅ Авторизованный пользователь → на главную
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // 🌐 Неавторизованный → показываем страницу
  return <>{children}</>
}

export default PublicRoute
