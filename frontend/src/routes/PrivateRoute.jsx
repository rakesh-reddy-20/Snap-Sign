import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "@/context/userContext";
import { Loader2 } from "lucide-react";

const PrivateRoute = () => {
  const { user, loading } = useContext(UserContext);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  if (loading || (user && !showContent)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
          <span className="text-gray-600 font-medium">Logging In...</span>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
