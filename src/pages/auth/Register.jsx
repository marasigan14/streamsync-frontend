import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- ADD THIS LINE
import { User, Mail, Phone, Building } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const RegisterPage = () => {
  const navigate = useNavigate(); // <-- ADD THIS LINE
  // 1. Setup state for our form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    role: 'Client',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    setMessage('');

    // Send data to Supabase
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          company: formData.company,
          role: formData.role
        }
      }
    });

    if (error) {
      setMessage(error.message);
    } else {
      // <-- REPLACE THE OLD SUCCESS MESSAGE WITH THIS:
      navigate('/verify-otp', { state: { email: formData.email } });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans relative">
      
      {/* --- LEFT SIDE: Branding and Image Collage --- */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        // Ensure you have a 'hero.png' in your assets folder
        style={{ backgroundImage: "url('/src/assets/hero.png')" }} 
      >
        <div className="absolute inset-0 bg-black/60"></div>
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

      {/* --- RIGHT SIDE: Registration Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 relative">
        
        <div className="w-full max-w-2xl bg-neutral-950 p-8 md:p-10 rounded-3xl border border-neutral-800 shadow-2xl">
          
          <div className="mb-8 text-center flex flex-col items-center">
            {/* LSM Logo Placeholder */}
            <div className="w-12 h-12 bg-black flex items-center justify-center rounded border border-neutral-700 mb-4">
              <span className="text-red-600 font-bold text-xl">L</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">CREATE ACCOUNT</h2>
            <p className="text-neutral-400 text-sm">Join Livestream Manila today</p>
          </div>

          {/* Form hooked up to handleRegister */}
          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Grid for First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">First Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-neutral-500" />
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Juan" 
                    className="w-full pl-11 pr-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-sm text-white placeholder-neutral-600" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Last Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-neutral-500" />
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Dela Cruz" 
                    className="w-full pl-11 pr-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-sm text-white placeholder-neutral-600" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">Active Email Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-neutral-500" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juandelacruz@example.com" 
                  className="w-full pl-11 pr-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-sm text-white placeholder-neutral-600" 
                  required 
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">Active Phone Number <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 h-4 w-4 text-neutral-500" />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+63 912 345 6789" 
                  className="w-full pl-11 pr-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-sm text-white placeholder-neutral-600" 
                  required 
                />
              </div>
            </div>

            {/* Grid for Company & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Company <span className="text-neutral-500">(Optional)</span></label>
                <div className="relative">
                  <Building className="absolute left-4 top-3.5 h-4 w-4 text-neutral-500" />
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your Company" 
                    className="w-full pl-11 pr-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-sm text-white placeholder-neutral-600" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Role <span className="text-neutral-500">(Optional)</span></label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-neutral-500" />
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-sm text-neutral-400 appearance-none"
                  >
                    <option value="Client">Client</option>
                    <option value="Event Manager">Event Manager</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid for Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Password <span className="text-red-500">*</span></label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password" 
                  className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-sm text-white placeholder-neutral-600" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Confirm Password <span className="text-red-500">*</span></label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password" 
                  className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-sm text-white placeholder-neutral-600" 
                  required 
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 bg-black border border-neutral-800 p-4 rounded-xl mt-2">
              <input type="checkbox" className="mt-1 w-4 h-4 bg-black border-neutral-700 rounded accent-red-600" required />
              <div className="text-xs text-neutral-400 leading-tight">
                <span>I agree to the </span>
                <a href="#" className="text-red-600 hover:underline">Terms & Conditions</a>
                <span> of Livestream Manila</span>
                <p className="mt-1 text-neutral-600 text-[10px]">Including payment terms, cancellation policy, and booking rules</p>
              </div>
            </div>

            {/* Dynamic Message Box */}
            {message && (
              <div className={`text-sm text-center font-medium p-3 rounded-xl border ${message.includes('Success') ? 'bg-green-900/20 border-green-600/50 text-green-400' : 'bg-red-900/20 border-red-600/50 text-red-500'}`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 mt-4 text-sm tracking-wide disabled:opacity-50"
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>

          </form>

          {/* Login Link */}
          <div className="mt-8 text-center text-xs text-neutral-400">
            Already have an account?{' '}
            <a href="/login" className="text-red-600 hover:text-red-500 font-medium transition-colors">Sign In</a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;