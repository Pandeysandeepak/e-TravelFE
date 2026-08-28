import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath =
      user?.role === 'ADMIN'
        ? '/admin'
        : user?.role === 'OWNER'
        ? '/owner'
        : '/user';

    return <Navigate to={redirectPath} replace />;
  }

  return children;
}