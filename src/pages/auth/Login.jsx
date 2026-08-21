import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, CheckCircle2, MessageSquare } from 'lucide-react';


const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // <-- ADD THIS LINE

  const isVerified = location.state?.verified;
  return (
    <div className="flex min-h-screen bg-black text-white font-sans relative">
      
      {/* --- LEFT SIDE: Branding and Image Collage (Visible on lg+ screens) --- */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        // Ensure you have a 'hero.png' in your assets folder
        style={{ backgroundImage: "url('/src/assets/hero.png')" }} 
      >
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Branding Elements (Matches bottom-left of image) */}
        <div className="absolute bottom-12 left-12 z-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-2">
            Stream<span className="text-red-600">Sync</span>
          </h1>
          <p className="text-neutral-400 tracking-widest text-sm uppercase">
            A Livestream Manila<br />Integrated System
          </p>
          <div className="h-1 w-12 bg-red-600 mt-4"></div>
        </div>
      </div>

      {/* --- RIGHT SIDE: Login Form (Modal Card) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        
        {/* The Dark Form Card */}
        <div className="w-full max-w-lg bg-neutral-950 p-10 md:p-12 rounded-3xl border border-neutral-800 shadow-2xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold mb-1">WELCOME BACK</h2>
            <p className="text-neutral-400 text-sm">Sign in to your account to continue</p>
          </div>

          {/* <-- ADD THIS GREEN SUCCESS BANNER --> */}
          {isVerified && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-[#0a2e16] border border-[#166534] rounded-xl text-[#22c55e]">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                Account verified successfully! You can now sign in.
              </p>
            </div>
          )}
          {/* <------------------------------------> */}

          <form className="space-y-6">
            
            {/* Email Input Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-600" />
                </div>
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-3.5 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-white placeholder-neutral-600"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-600" />
                </div>
                <input
                  type="password"
                  className="w-full pl-12 pr-4 py-3.5 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-white placeholder-neutral-600"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Actions: Remember Me & Forgot Password (Red link) */}
            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center space-x-2 cursor-pointer text-neutral-400 hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 bg-black border-neutral-800 rounded accent-red-600 focus:ring-red-600 focus:ring-offset-neutral-950"
                />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="text-red-600 hover:text-red-500 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button (Solid Red) */}
            <button
              type="submit"
              className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 mt-6 tracking-wide"
            >
              SIGN IN
            </button>

          </form>

          {/* Registration Link (Red link) */}
          <div className="mt-10 text-center text-sm text-neutral-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-600 hover:text-red-500 font-medium transition-colors">
              Register now
            </Link>
          </div>

        </div>
      </div>

      {/* Floating Chat Button (Fixed position) */}
      <button className="fixed bottom-8 right-8 bg-[#ff0000] hover:bg-red-700 text-white p-4 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all z-50">
        <MessageSquare size={24} />
      </button>

    </div>
  );
};

export default LoginPage;