
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // You could render a loading spinner here
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page or dashboard based on role
    if (user.role === Role.ADMIN) {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.role === Role.DOCTOR) {
      return <Navigate to="/doctor/dashboard" />;
    } else if (user.role === Role.STAFF) {
      return <Navigate to="/staff/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
