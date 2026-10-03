import React, { useState, useEffect, useRef } from 'react';
import { Phone, ArrowLeft, RotateCw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import heroImage from '../../assets/hero.png';

const API = import.meta.env.VITE_API_URL;

// Calls the FastAPI OTP endpoints (/otp/send, /otp/verify)
const callOtp = async (path, body) => {
  const res = await fetch(`${API}/otp/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.detail === 'string' ? data.detail : 'Request failed. Please try again.'
    );
  }
  return data;
};

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Email and phone passed from the Register page
  const email = location.state?.email || '';
  const phone = location.state?.phone || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  // If the page was opened/refreshed without a phone, go back to registration
  useEffect(() => {
    if (!phone) navigate('/register', { replace: true });
  }, [phone, navigate]);

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

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const token = otp.join('');

    if (token.length < 6) {
      setErrorMessage('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await callOtp('verify', { phone, code: token });
      navigate('/verify-email', { state: { email } });
    } catch (err) {
      setErrorMessage(err.message);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    setErrorMessage('');

    try {
      await callOtp('send', { phone });
      setTimeLeft(5 * 60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      alert('A new verification code has been sent to your phone!');
    } catch (err) {
      setErrorMessage(err.message);
    }
    setResending(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans relative">
      {/* --- LEFT SIDE: Branding --- */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
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
          <button
            onClick={() => navigate('/register')}
            className="flex items-center text-xs text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to registration
          </button>

          <div className="text-center flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-red-950/40 border border-red-800/50 flex items-center justify-center rounded-full mb-4">
              <Phone className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">VERIFY YOUR PHONE</h2>
            <p className="text-neutral-400 text-xs mt-2">
              We've sent a 6-digit SMS verification code to<br />
              <span className="text-neutral-200 font-medium text-sm mt-1 block">{phone}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <p className="text-xs text-center text-neutral-400 mb-3">Enter SMS Code</p>
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

            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>
                Time remaining: <strong className="text-neutral-200">{formatTime(timeLeft)}</strong>
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="flex items-center hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`h-3 w-3 mr-1 ${resending ? 'animate-spin' : ''}`} /> Resend
              </button>
            </div>

            {errorMessage && (
              <div className="text-xs text-center font-medium p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-400">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors text-sm tracking-wide disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'VERIFYING...' : 'VERIFY PHONE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;