import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
  requiredUserType?: 'student' | 'donor' | 'admin';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredUserType }) => {
  const { isAuthenticated, loading, profile } = useAuth();

  // Still loading authentication state
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying authentication...</p>
            <p className="text-sm text-gray-400 mt-2">This should only take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect to login or home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Right after checking if !isAuthenticated
if (!profile) {
  console.warn("Still waiting for profile...");
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    </div>
  );
}


  // If user type doesn't match
  if (requiredUserType && profile?.user_type !== requiredUserType) {
    console.warn(`Access denied: required ${requiredUserType}, got ${profile?.user_type}`);
    return <Navigate to="/" replace />;
  }

  // All checks passed — allow access
  console.log('Rendering children: user=', profile?.user_type);

  return children;
};

export default PrivateRoute;
