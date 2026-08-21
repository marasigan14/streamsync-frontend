import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VerifyOtp from './pages/auth/VerifyOtp';

//import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';

// Import your page components
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ForgotPasswordPage from './pages/auth/ForgotPassword';

// If you have the LandingPage ready, you can import it too:
// import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        
        {/* Default Route (Can be your Landing Page later) */}
        <Route path="/" element={<LoginPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;