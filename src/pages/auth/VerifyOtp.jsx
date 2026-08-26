import React, { useState, useEffect, useRef } from 'react';
import { Mail, ArrowLeft, RotateCw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';


const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve email passed from the Register page (or fallback)
  const email = location.state?.email || 'your email';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  // 15-minute countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle OTP input changes and auto-focus next input
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Digits only

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character typed
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  // Verify OTP with Supabase
  const handleVerify = async (e) => {
    e.preventDefault();
    const token = otp.join('');
    
    if (token.length < 6) {
      setErrorMessage('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'signup'
    });

    if (error) {
      setErrorMessage(error.message || 'Invalid or expired code.');
      setLoading(false);
    } else {
      // Verification successful -> redirect to Login or Dashboard
      navigate('/login', { state: { verified: true } });
    }
  };

  // Resend OTP handler
  const handleResend = async () => {
    if (resending || timeLeft > 14 * 60) return;
    setResending(true);
    setErrorMessage('');

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setTimeLeft(15 * 60);
      alert('A new verification code has been sent!');
    }
    setResending(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans relative">
      
      {/* --- LEFT SIDE: Branding and Image Collage --- */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/hero.png')" }} 
      >
        <div className="absolute inset-0 bg-black/70"></div>
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

      {/* --- RIGHT SIDE: OTP Verification Card --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 relative">
        <div className="w-full max-w-md bg-[#121212] p-8 md:p-10 rounded-3xl border border-neutral-800 shadow-2xl">
          
          {/* Back button */}
          <button 
            onClick={() => navigate('/register')}
            className="flex items-center text-xs text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to registration
          </button>

          {/* Header Icon & Title */}
          <div className="text-center flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-red-950/40 border border-red-800/50 flex items-center justify-center rounded-full mb-4">
              <Mail className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">VERIFY YOUR ACCOUNT</h2>
            <p className="text-neutral-400 text-xs">
              We've sent a 6-digit verification code to<br />
              <span className="text-neutral-200 font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            
            {/* 6 Digit Input Boxes */}
            <div>
              <p className="text-xs text-center text-neutral-400 mb-3">Enter Verification Code</p>
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-[#181818] border border-neutral-700 rounded-xl focus:border-red-600 focus:outline-none text-white transition-all"
                    required
                  />
                ))}
              </div>
            </div>

            {/* Timer and Resend */}
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Time remaining: <strong className="text-neutral-200">{formatTime(timeLeft)}</strong></span>
              <button 
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="flex items-center hover:text-white transition-colors"
              >
                <RotateCw className={`h-3 w-3 mr-1 ${resending ? 'animate-spin' : ''}`} /> Resend
              </button>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="text-xs text-center font-medium p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-400">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors text-sm tracking-wide disabled:opacity-50"
            >
              {loading ? 'VERIFYING...' : 'VERIFY ACCOUNT'}
            </button>

            <p className="text-[11px] text-center text-neutral-500">
              The verification code will expire in 15 minutes
            </p>
          </form>

        </div>
      </div>

    </div>
  );
};

export default VerifyOtp;