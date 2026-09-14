import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!token && !storedUser) {
    return <Navigate to="/login" replace />;
  }

  let parsedUser: { id?: number; role?: string } | null = null;
  if (storedUser) {
    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      parsedUser = null;
    }
  }

  if (storedUser && !parsedUser?.id) {
    return <Navigate to="/login" replace />;
  }

  let userRole = localStorage.getItem('role') || '';

  if (!userRole && parsedUser) {
    userRole = parsedUser.role || '';
  }

  const normalizedRole = userRole.toLowerCase().trim();

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase().trim());
    if (!normalizedAllowed.includes(normalizedRole)) {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;