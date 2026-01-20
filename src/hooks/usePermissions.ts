import { useCallback } from 'react';
import { useStore } from '@/stores/useStore';

type Role = 'admin' | 'restaurant' | 'cashier' | 'guest';
type Permission = string;

interface RolePermissions {
  admin: Permission[];
  restaurant: Permission[];
  cashier: Permission[];
  guest: Permission[];
}

// Define permissions for each role
const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    'view_dashboard',
    'manage_restaurants',
    'manage_guests',
    'manage_users',
    'view_analytics',
    'view_audit_logs',
    'manage_support_tickets',
    'manage_system_settings',
    'manage_billing',
    'export_data',
    'delete_data',
  ],
  restaurant: [
    'view_dashboard',
    'manage_staff',
    'view_guests',
    'view_orders',
    'manage_menu',
    'view_analytics',
    'manage_loyalty_program',
    'export_reports',
  ],
  cashier: [
    'scan_cards',
    'process_payments',
    'view_customer_info',
    'issue_cards',
    'apply_discounts',
  ],
  guest: [
    'view_profile',
    'view_card',
    'view_history',
    'manage_preferences',
  ],
};

export const usePermissions = () => {
  const { user } = useStore();

  const userRole = user?.role as Role;
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];

  /**
   * Проверить, есть ли у пользователя конкретное разрешение
   */
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      return userPermissions.includes(permission);
    },
    [user, userPermissions]
  );

  /**
   * Проверить, есть ли у пользователя одно из разрешений (OR)
   */
  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      if (!user) return false;
      return permissions.some((permission) => userPermissions.includes(permission));
    },
    [user, userPermissions]
  );

  /**
   * Проверить, есть ли у пользователя все разрешения (AND)
   */
  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      if (!user) return false;
      return permissions.every((permission) => userPermissions.includes(permission));
    },
    [user, userPermissions]
  );

  /**
   * Проверить, есть ли у пользователя определенная роль
   */
  const hasRole = useCallback(
    (role: Role | Role[]): boolean => {
      if (!user || !userRole) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(userRole);
    },
    [user, userRole]
  );

  /**
   * Проверить, может ли пользователь выполнить действие над сущностью
   */
  const canPerformAction = useCallback(
    (action: string, entityOwner?: string): boolean => {
      if (!user) return false;

      // Admin может делать всё
      if (userRole === 'admin') return true;

      // Пользователь может редактировать только свои данные
      if (entityOwner && entityOwner !== user.id && userRole !== 'admin') {
        return false;
      }

      return userPermissions.includes(action);
    },
    [user, userRole, userPermissions]
  );

  /**
   * Получить все разрешения текущего пользователя
   */
  const getAllPermissions = useCallback(
    (): Permission[] => {
      return userPermissions;
    },
    [userPermissions]
  );

  /**
   * Проверить, является ли пользователь администратором
   */
  const isAdmin = useCallback((): boolean => {
    return userRole === 'admin';
  }, [userRole]);

  /**
   * Проверить, может ли пользователь доступить к маршруту
   */
  const canAccessRoute = useCallback(
    (requiredRole: Role | Role[]): boolean => {
      if (!user) return false;
      return hasRole(requiredRole);
    },
    [user, hasRole]
  );

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    canPerformAction,
    getAllPermissions,
    isAdmin,
    canAccessRoute,
    userRole,
    userPermissions,
  };
};
