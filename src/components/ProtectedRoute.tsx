import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { usePermissions } from '../hooks/usePermissions'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string | string[]
  requiredPermission?: string | string[]
  fallback?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallback,
}) => {
  const { isAuthenticated } = useAuthStore()
  const { hasRole, hasPermission, hasAnyPermission } = usePermissions()

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check role if required
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback ? <>{fallback}</> : <Navigate to="/unauthorized" replace />
  }

  // Check permission if required (support both single and multiple permissions)
  if (requiredPermission) {
    const hasAccess = Array.isArray(requiredPermission)
      ? hasAnyPermission(requiredPermission)
      : hasPermission(requiredPermission)

    if (!hasAccess) {
      return fallback ? <>{fallback}</> : <Navigate to="/unauthorized" replace />
    }
  }

  return <>{children}</>
}
