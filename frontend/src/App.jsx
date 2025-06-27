import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserProvider from "./context/userContext";

import Navbar from "./components/layouts/Navbar";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import DashboardPage from "./pages/User/DashboardPage";
import About from "./pages/User/About";
import Uploads from "./pages/User/Uploads";
import PrivateRoute from "./routes/PrivateRoute"; // 👈 Import this

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />

          {/* Protected Routes (wrap with PrivateRoute) */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Navbar />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="about" element={<About />} />
              <Route path="uploads" element={<Uploads />} />
            </Route>
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>

      <Toaster
        position="top-right"
        toastOptions={{
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
