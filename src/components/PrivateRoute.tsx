import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
  requiredUserType?: "student" | "donor" | "admin";
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredUserType,
}) => {
  const { isAuthenticated, loading, profile } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Auth loading timeout reached in PrivateRoute");
        setTimeoutReached(true);
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [loading]);

  // Wait for loading state to finish or timeout
  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-slate-50 to-white">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
          <p className="text-sm text-gray-400 mt-2">This should only take a moment</p>
        </div>
      </div>
    );
  }

  if (timeoutReached && loading) {
    console.error("Authentication timeout - redirecting to home");
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated) {
    console.warn("User not authenticated, redirecting to home");
    return <Navigate to="/" replace />;
  }

  if (requiredUserType && profile?.user_type !== requiredUserType) {
    console.warn(
      `Access denied. Required: ${requiredUserType}, Found: ${profile?.user_type}`
    );
    return <Navigate to="/" replace />;
  }

  console.log("Rendering children: user=", profile?.user_type);
  return children;
};

export default PrivateRoute;
