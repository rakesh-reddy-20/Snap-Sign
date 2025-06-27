import React, { useContext } from "react";
import { BrowserRouter as Router, Navigate, Outlet } from "react-router-dom";

import { UserContext } from "@/context/userContext";

const PrivateRoute = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Loading...</p>; // or a spinner

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
