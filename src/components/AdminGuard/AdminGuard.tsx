import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAdminAuthStore from 'stores/use-admin-auth-store';

interface AdminGuardProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * AdminGuard protects admin routes by checking if the user is logged in
 * AND if they have the required roles for a specific module.
 */
const AdminGuard: React.FC<AdminGuardProps> = ({ children, allowedRoles }) => {
  const { user } = useAdminAuthStore();

  // 1. Not logged in at all -> send to admin dashboard (which redirects to signin if user is null)
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // 2. Check roles if allowedRoles is provided
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = user.roles.some(role => allowedRoles.includes(role.code));
    
    if (!hasPermission) {
      // Unauthorized -> Redirect back to admin dashboard
      // TODO: Could add a toast notification or a specific "Access Denied" page
      return <Navigate to="/admin" replace />;
    }
  }

  // 3. All checks pass -> render children or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default AdminGuard;
