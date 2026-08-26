import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ProtectedRoute from "./components/ProtectedRoute";

// Page Imports
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import ClientDashboard from "./pages/client/ClientDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import AdminDashboard from './pages/admin/AdminDashboard';
import Home from "./pages/Home"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        
        {/* REMOVED THE DUPLICATE ADMIN ROUTE FROM HERE */}

        {/* Role-Based Protected Dashboards */}
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Landing Page Route */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;