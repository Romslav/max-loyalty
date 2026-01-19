import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { logger } from '../services/loggerService'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'restaurant' | 'cashier' | 'guest'
  requiredPermissions?: string[]
}

/**
 * ProtectedRoute component
 * Ensures user is authenticated and has required role/permissions
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermissions = [],
}) => {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    logger.warn('Unauthenticated access attempt')
    return <Navigate to="/login" replace />
  }

  // Check role requirement
  if (requiredRole && user.role !== requiredRole) {
    logger.warn('Insufficient role for access', {
      userRole: user.role,
      requiredRole,
    })
    return <Navigate to="/unauthorized" replace />
  }

  // Check permissions requirement
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((perm) =>
      user.permissions.includes(perm)
    )

    if (!hasAllPermissions) {
      logger.warn('Insufficient permissions for access', {
        userPermissions: user.permissions,
        requiredPermissions,
      })
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
