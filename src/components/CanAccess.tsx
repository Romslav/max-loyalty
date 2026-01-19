import React from 'react'
import { usePermissions } from '../hooks/usePermissions'

interface CanAccessProps {
  permission?: string | string[]
  role?: string | string[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

/**
 * CanAccess component
 * Conditionally renders content based on user permissions or role
 * 
 * Usage:
 * <CanAccess permission="user:write">
 *   <button>Edit User</button>
 * </CanAccess>
 * 
 * <CanAccess role="admin" fallback={<p>Admin only</p>}>
 *   <AdminPanel />
 * </CanAccess>
 * 
 * <CanAccess permission={["user:read", "user:write"]}>
 *   <UserManagement />
 * </CanAccess>
 */
export const CanAccess: React.FC<CanAccessProps> = ({
  permission,
  role,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasRole } = usePermissions()

  let hasAccess = true

  // Check permissions (if provided)
  if (permission) {
    if (Array.isArray(permission)) {
      // User needs ALL permissions
      hasAccess = permission.every(p => hasPermission(p))
    } else {
      hasAccess = hasPermission(permission)
    }
  }

  // Check role (if provided) - in addition to permissions
  if (role && hasAccess) {
    if (Array.isArray(role)) {
      // User needs to have ANY of the roles
      hasAccess = role.some(r => hasRole(r))
    } else {
      hasAccess = hasRole(role)
    }
  }

  // If access denied, show fallback or nothing
  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default CanAccess
