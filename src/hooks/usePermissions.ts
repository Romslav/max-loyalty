import { useAuthStore } from '../stores/authStore';

const ROLE_PERMISSIONS: Record<string, string[]> = {
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
    'analytics:write',
    'billing:read',
    'billing:write',
    'settings:read',
    'settings:write',
  ],
  restaurant: [
    'restaurant:read',
    'guest:read',
    'guest:write',
    'guest:delete',
    'operations:read',
    'operations:write',
    'analytics:read',
    'billing:read',
  ],
  cashier: [
    'guest:read',
    'operations:read',
    'operations:write',
  ],
  guest: [
    'guest:read',
  ],
};

/**
 * Hook to check permissions based on user role
 * Returns functions to check if user has specific permissions or roles
 */
export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => hasRole(role));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    userRole: user?.role,
    userPermissions: user ? ROLE_PERMISSIONS[user.role] || [] : [],
  };
};