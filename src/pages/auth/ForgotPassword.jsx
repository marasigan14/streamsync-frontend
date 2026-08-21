import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  // State to handle switching between the input form and the success message
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans text-white">
      
      <div className="w-full max-w-md bg-neutral-950 p-8 md:p-12 rounded-2xl border border-neutral-800 shadow-2xl flex flex-col items-center">
        
        {/* LSM Logo Placeholder */}
        <div className="w-14 h-14 bg-black flex items-center justify-center rounded-lg border border-neutral-700 mb-6">
          <span className="text-red-600 font-bold text-2xl">L</span>
        </div>

        <h2 className="text-2xl font-bold mb-2">RESET PASSWORD</h2>
        <p className="text-neutral-400 text-sm text-center mb-8">
          {isSubmitted 
            ? "Check your email for reset instructions" 
            : "Enter your email to receive a password reset link"
          }
        </p>

        {!isSubmitted ? (
          /* Form View (Matches image_0b54ea.png) */
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-600" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-white placeholder-neutral-600"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors duration-200 tracking-wide"
            >
              SEND RESET LINK
            </button>
          </form>
        ) : (
          /* Success View (Matches image_0b5508.png) */
          <div className="w-full border border-green-600/50 bg-green-900/10 p-5 rounded-xl text-center">
            <p className="text-green-400 text-sm leading-relaxed">
              If an account exists with<br/>
              <strong className="text-white">{email}</strong>, you will<br/>
              receive a password reset link shortly.
            </p>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="mt-8">
          <a href="/login" className="flex items-center text-red-600 hover:text-red-500 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </a>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;