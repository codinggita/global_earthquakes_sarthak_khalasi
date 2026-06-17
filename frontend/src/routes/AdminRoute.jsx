import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Route guard: requires admin role.
 * Redirects non-admins to /dashboard.
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
