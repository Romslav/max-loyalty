import React from 'react'
import { usePermissions } from '../hooks/usePermissions'

interface CanAccessProps {
  children: React.ReactNode
  permission?: string | string[]
  role?: string | string[]
  fallback?: React.ReactNode
  requireAll?: boolean
}

export const CanAccess: React.FC<CanAccessProps> = ({
  children,
  permission,
  role,
  fallback,
  requireAll = false,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } =
    usePermissions()

  let hasAccess = true

  // Check role if provided
  if (role) {
    hasAccess = hasRole(role)
  }

  // Check permission if provided
  if (hasAccess && permission) {
    if (Array.isArray(permission)) {
      hasAccess = requireAll
        ? hasAllPermissions(permission)
        : hasAnyPermission(permission)
    } else {
      hasAccess = hasPermission(permission)
    }
  }

  return hasAccess ? <>{children}</> : fallback ? <>{fallback}</> : null
}
