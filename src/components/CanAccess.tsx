import { ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface CanAccessProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Component to conditionally render content based on permissions
 * Usage:
 *   <CanAccess permission="user:write">
 *     <Button>Delete User</Button>
 *   </CanAccess>
 *
 *   <CanAccess permissions={['admin', 'moderator']} fallback={<p>No access</p>}>
 *     <AdminPanel />
 *   </CanAccess>
 */
export const CanAccess: React.FC<CanAccessProps> = ({
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    return <>{fallback}</> || null;
  }

  return <>{children}</>;
};