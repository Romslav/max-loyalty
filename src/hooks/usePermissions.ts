import { useMemo } from 'react'
import { useAuth } from './useAuth'

type UserRole = 'admin' | 'restaurant' | 'cashier' | 'guest'

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'user:read',
    'user:write',
    'user:delete',
    'restaurant:read',
    'restaurant:write',
    'restaurant:delete',
    'guest:read',
    'guest:write',
    'guest:delete',
    'analytics:read',
    'billing:read',
    'billing:write',
    'audit:read',
    'support:write',
    'settings:write',
  ],
  restaurant: [
    'restaurant:read',
    'guest:read',
    'guest:write',
    'analytics:read',
    'billing:read',
    'operations:read',
    'operations:write',
  ],
  cashier: [
    'guest:read',
    'operations:read',
    'operations:write',
    'analytics:read',
  ],
  guest: [
    'guest:read',
    'operations:read',
  ],
}

export interface PermissionResult {
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  hasRole: (role: UserRole) => boolean
  canAccess: (requiredRole?: UserRole, requiredPermissions?: string[]) => boolean
  userRole: UserRole | null
  userPermissions: string[]
}

/**
 * Hook for permission and role checking
 * Integrates with auth context
 */
export const usePermissions = (): PermissionResult => {
  const { user } = useAuth()

  return useMemo(() => {
    const userRole = user?.role as UserRole | null
    const userPermissions = user?.permissions || []

    return {
      /**
       * Check if user has specific permission
       */
      hasPermission: (permission: string): boolean => {
        return userPermissions.includes(permission)
      },

      /**
       * Check if user has ANY of the permissions
       */
      hasAnyPermission: (permissions: string[]): boolean => {
        return permissions.some((perm) => userPermissions.includes(perm))
      },

      /**
       * Check if user has ALL of the permissions
       */
      hasAllPermissions: (permissions: string[]): boolean => {
        return permissions.every((perm) => userPermissions.includes(perm))
      },

      /**
       * Check if user has specific role
       */
      hasRole: (role: UserRole): boolean => {
        return userRole === role
      },

      /**
       * Check if user can access resource
       */
      canAccess: (requiredRole?: UserRole, requiredPermissions?: string[]): boolean => {
        if (!userRole) return false

        // Check role requirement
        if (requiredRole && userRole !== requiredRole) {
          return false
        }

        // Check permissions requirement
        if (requiredPermissions && requiredPermissions.length > 0) {
          return requiredPermissions.every((perm) => userPermissions.includes(perm))
        }

        return true
      },

      userRole,
      userPermissions,
    }
  }, [user?.permissions, user?.role])
}

export default usePermissions
