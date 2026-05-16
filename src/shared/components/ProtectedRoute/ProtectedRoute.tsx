import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/useAuth';
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Pass the attempted URL so login can redirect back after success
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}