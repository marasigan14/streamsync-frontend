import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { supabase } from "../../supabaseClient";

// Assets with identical paths as Login.jsx
import heroImage from "../../assets/hero.png";
import logoImage from "../../assets/livestream-logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage(
          "A password reset link has been sent to your email address. Please check your inbox."
        );
        setEmail("");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans relative">
      {/* --- LEFT SIDE: Branding and Hero Image --- */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Top-Left Logo */}
        <div className="absolute top-12 left-12 z-10">
          <img
            src={logoImage}
            alt="Livestream Manila Logo"
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* Bottom-Left Branding */}
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

      {/* --- RIGHT SIDE: Reset Password Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md bg-[#12141a] p-8 md:p-10 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col items-center">
          
          {/* Central Logo */}
          <div className="mb-6">
            <img
              src={logoImage}
              alt="Logo"
              className="w-16 h-16 object-contain mx-auto"
            />
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black uppercase tracking-wider mb-2 text-white">
              Reset Password
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm">
              Enter your email to receive a password reset link
            </p>
          </div>

          {/* Success Notification */}
          {successMessage && (
            <div className="w-full mb-6 flex items-start gap-3 p-4 bg-[#0a2e16] border border-[#166534] rounded-xl text-[#22c55e] text-xs md:text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="font-medium">{successMessage}</p>
            </div>
          )}

          {/* Error Notification */}
          {errorMessage && (
            <div className="w-full mb-6 flex items-start gap-3 p-4 bg-red-950/40 border border-red-800 rounded-xl text-red-500 text-xs md:text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="font-medium">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="w-full space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-neutral-500" />
                </div>
                <input
                  value={email}
                  type="email"
                  required
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0c10] border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-white placeholder-neutral-600 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff0000] hover:bg-red-700 text-white text-xs font-extrabold py-3.5 px-6 rounded-xl transition-all duration-200 uppercase tracking-widest disabled:opacity-50 cursor-pointer shadow-lg shadow-red-950/40 mt-2"
            >
              {loading ? "SENDING LINK..." : "SEND RESET LINK"}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-xs text-red-600 hover:text-red-500 font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Chat Icon */}
      <button className="fixed bottom-8 right-8 bg-[#ff0000] hover:bg-red-700 text-white p-4 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all z-50 cursor-pointer">
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

export default ForgotPassword;