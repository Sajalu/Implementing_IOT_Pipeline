// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if user is logged in and has admin role
  const userString = localStorage.getItem('user');
  if (!userString) {
    // Not logged in, redirect to home
    return <Navigate to="/" replace />;
  }
  
  try {
    const user = JSON.parse(userString);
    if (user.role !== 'admin') {
      // Not an admin, redirect to home
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    // Invalid user data
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and is an admin
  return <>{children}</>;
};

export default ProtectedRoute;
