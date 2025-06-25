import { useState } from "react";
import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserProvider, { UserContext } from "./context/userContext";

import Navbar from "./components/layouts/Navbar";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import DashboardPage from "./pages/User/DashboardPage";
import About from "./pages/User/About";
import Uploads from "./pages/User/Uploads";

function App() {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/" element={<Navbar />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="about" element={<About />} />
              <Route path="uploads" element={<Uploads />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: "Roboto, sans-serif",
          },
        }}
      />
    </UserProvider>
  );
}

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user) {
    return <Navigate to={"/dashboard"} />;
  }
};
