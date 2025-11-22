
import AddInquiry from "./components/AddInquiry";
import Inquiries from "./components/Inquiries";
import Navbar from "./components/Navbar";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import Register from "./components/Register";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper to check if current user has a specific role
function requireRole(role) {
  const userRole = localStorage.getItem("role");
  return userRole === role;
}

// Protect routes that only admin should access
function PrivateAdmin({ children }) {
  return requireRole("ROLE_ADMIN") ? children : <Navigate to="/login" />;
}

// Protect routes that require any authenticated user (admin or customer)
function PrivateAuth({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div>
      {/* BrowserRouter must wrap entire app to enable routing */}
      <BrowserRouter>
        {/* Common navbar visible on all pages */}
        <Navbar />

        {/* Route definitions */}
        <Routes>
          {/* Public routes (no login required) */}
          <Route path="/login" caseSensitive={false} element={<Login />} />
          <Route path="/register" caseSensitive={false} element={<Register />} />

          {/* Authenticated routes (user or admin) */}
          <Route
            path="/"
            element={
              <PrivateAuth>
                <Inquiries />
              </PrivateAuth>
            }
          />
          <Route
            path="/inquiries"
            element={
              <PrivateAuth>
                <Inquiries />
              </PrivateAuth>
            }
          />
          <Route
            path="/add-inquiry"
            element={
              <PrivateAuth>
                <AddInquiry />
              </PrivateAuth>
            }
          />
          <Route
            path="/update-inquiry/:id"
            element={
              <PrivateAuth>
                <AddInquiry />
              </PrivateAuth>
            }
          />

          {/* Admin-only routes: Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <PrivateAdmin>
                <AdminDashboard />
              </PrivateAdmin>
            }
          />

          {/* Fallback route: redirect unknown paths to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>

        {/* Toast container for showing notifications */}
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
