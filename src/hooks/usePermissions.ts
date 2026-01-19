import { useAuthStore } from '../stores/authStore'

interface PermissionConfig {
  admin: string[]
  restaurant: string[]
  cashier: string[]
  guest: string[]
}

const PERMISSIONS: PermissionConfig = {
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
    'settings:read',
    'settings:write',
    'support:read',
    'support:write',
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
    'profile:read',
    'profile:write',
  ],
}

export const usePermissions = () => {
  const user = useAuthStore((state) => state.user)

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    // Admin has all permissions
    if (user.role === 'admin') return true

    // Check user's explicit permissions
    if (user.permissions && user.permissions.includes(permission)) {
      return true
    }

    // Check role-based permissions
    const rolePermissions = PERMISSIONS[user.role] || []
    return rolePermissions.includes(permission)
  }

  /**
   * Check if user has any of the provided permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => hasPermission(permission))
  }

  /**
   * Check if user has all of the provided permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => hasPermission(permission))
  }

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false

    if (Array.isArray(role)) {
      return role.includes(user.role)
    }

    return user.role === role
  }

  /**
   * Check if user is admin
   */
  const isAdmin = (): boolean => {
    return user?.role === 'admin'
  }

  /**
   * Check if user is restaurant owner
   */
  const isRestaurant = (): boolean => {
    return user?.role === 'restaurant'
  }

  /**
   * Check if user is cashier
   */
  const isCashier = (): boolean => {
    return user?.role === 'cashier'
  }

  /**
   * Check if user is guest
   */
  const isGuest = (): boolean => {
    return user?.role === 'guest'
  }

  /**
   * Get user's permissions based on role
   */
  const getUserPermissions = (): string[] => {
    if (!user) return []

    if (user.permissions) {
      return user.permissions
    }

    return PERMISSIONS[user.role] || []
  }

  return {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    isRestaurant,
    isCashier,
    isGuest,
    getUserPermissions,
  }
}
