import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../../supabaseClient";
import heroImage from "../../assets/hero.png";
import logoImage from "../../assets/livestream-logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check if recovery session exists from the email link hash
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setErrorMessage("Recovery session not found or link has expired. Please request a new reset link.");
      }
    });
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      setSuccessMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans relative">
      {/* Left Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute top-12 left-12 z-10">
          <img src={logoImage} alt="Logo" className="w-12 h-12 object-contain" />
        </div>
        <div className="absolute bottom-12 left-12 z-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-2">
            Stream<span className="text-red-600">Sync</span>
          </h1>
          <p className="text-neutral-400 tracking-widest text-sm uppercase">
            A Livestream Manila
            <br />
            Integrated System
          </p>
          <div className="h-1 w-12 bg-red-600 mt-4"></div>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md bg-[#12141a] p-8 md:p-10 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col items-center">
          <div className="mb-6">
            <img src={logoImage} alt="Logo" className="w-16 h-16 object-contain mx-auto" />
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black uppercase tracking-wider mb-2 text-white">
              Set New Password
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm">
              Please enter and confirm your new account password
            </p>
          </div>

          {successMessage && (
            <div className="w-full mb-6 flex items-start gap-3 p-4 bg-[#0a2e16] border border-[#166534] rounded-xl text-[#22c55e] text-xs md:text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="font-medium">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="w-full mb-6 flex items-start gap-3 p-4 bg-red-950/40 border border-red-800 rounded-xl text-red-500 text-xs md:text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="font-medium">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="w-full space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400 block">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-neutral-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-[#0a0c10] border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-white placeholder-neutral-600 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400 block">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-neutral-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0c10] border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-white placeholder-neutral-600 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff0000] hover:bg-red-700 text-white text-xs font-extrabold py-3.5 px-6 rounded-xl transition-all duration-200 uppercase tracking-widest disabled:opacity-50 cursor-pointer shadow-lg shadow-red-950/40 mt-3"
            >
              {loading ? "SAVING..." : "UPDATE PASSWORD"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-xs text-red-600 hover:text-red-500 font-semibold transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;