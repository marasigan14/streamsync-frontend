import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  CheckCircle2,
  MessageSquare,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import heroImage from "../../assets/hero.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [successMessage, setSuccessMessage] = useState(
    location.state?.verified ? "Account verified successfully! You can now sign in." : ""
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-hide the success banner after 5 seconds and clear router state
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        window.history.replaceState({}, document.title);
      }, 5000); // 5 seconds duration
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // 1. Authenticate with Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (authError) {
      setErrorMessage(authError.message);
      setLoading(false);
      return;
    }

    const userId = authData.user.id;

    // 2. CHECK METADATA FIRST (This is where Admin/Staff/Client roles are safely stored!)
    let userRole = (
      authData.user.user_metadata?.role || "client"
    ).toLowerCase();

    // 3. If not in metadata, check the public users table as a backup
    if (!userRole) {
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      if (userData) {
        userRole = userData.role;
      }
    }

    const normalizedRole = (userRole || "client").toLowerCase();
    console.log("DEBUG: Normalized role is ->", normalizedRole);

    // Route based on the role found
    if (normalizedRole === "admin") {
      navigate("/admin/dashboard");
    } else if (normalizedRole === "staff") {
      navigate("/staff/dashboard");
    } else {
      console.log("DEBUG: Forcing hard redirect to /client-main");
      // Forces a clean window load to prevent router/history loop back to dashboard
      window.location.href = "/client-main";
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans relative">
      {/* --- LEFT SIDE: Branding and Image Collage --- */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
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

      {/* --- RIGHT SIDE: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-lg bg-neutral-950 p-10 md:p-12 rounded-3xl border border-neutral-800 shadow-2xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold mb-1">WELCOME BACK</h2>
            <p className="text-neutral-400 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {/* GREEN SUCCESS BANNER WITH 5-SECOND TIMED DISMISSAL */}
          {successMessage && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-[#0a2e16] border border-[#166534] rounded-xl text-[#22c55e] transition-opacity duration-500">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                {successMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message Display */}
            {errorMessage && (
              <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-red-500 text-sm text-center">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-600" />
                </div>
                <input
                  value={email}
                  type="email"
                  className="w-full pl-12 pr-4 py-3.5 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-white placeholder-neutral-600"
                  placeholder="Enter your email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-600" />
                </div>
                <input
                  value={password}
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3.5 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-white placeholder-neutral-600"
                  placeholder="Enter your password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center space-x-2 cursor-pointer text-neutral-400 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-black border-neutral-800 rounded accent-red-600 focus:ring-red-600 focus:ring-offset-neutral-950"
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-red-600 hover:text-red-500 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 mt-6 tracking-wide disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-neutral-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-red-600 hover:text-red-500 font-medium transition-colors"
            >
              Register now
            </Link>
          </div>
        </div>
      </div>

      <button className="fixed bottom-8 right-8 bg-[#ff0000] hover:bg-red-700 text-white p-4 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all z-50">
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

export default LoginPage;