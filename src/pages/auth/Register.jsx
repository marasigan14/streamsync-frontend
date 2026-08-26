import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { User, Mail, Phone, Building, Check, X, Eye, EyeOff, FileText, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';


const RegisterPage = () => {
  const navigate = useNavigate();
  
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
  
  // 2. States for toggles and modals (NEW)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 3. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Check if terms are agreed to (NEW)
    if (!agreeTerms) {
      setMessage("You must agree to the Terms & Conditions.");
      return;
    }

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
      setLoading(false);
      return;
    }

    // THIS IS THE MAGIC FIX FOR TC-M01-004
    // If user exists, Supabase returns an empty identities array instead of an error
    if (data?.user?.identities && data.user.identities.length === 0) {
      setMessage("An account with this email address already exists. Please log in or use a different email.");
      setLoading(false);
      return; // This stops the redirect!
    }

    // Only navigate if it's a truly new account
    navigate('/verify-otp', { state: { email: formData.email } });
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans relative">
      
      {/* --- LEFT SIDE: Branding and Image Collage --- */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
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

              {/* Main Pass Field with Eye Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password" 
                    className="w-full px-4 py-3 pr-10 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-sm text-white placeholder-neutral-600" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-white focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Dynamic Password Feedback (Appears when typing) */}
                {formData.password && (
                  <div className="mt-3 p-3 bg-[#0a0a0a] rounded-xl border border-neutral-800/50 space-y-2">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-2">Password Requirements</p>
                    {[
                      { label: 'At least 6 characters', valid: formData.password.length >= 6 },
                      { label: 'Uppercase & lowercase letters', valid: /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) },
                      { label: 'At least one number', valid: /[0-9]/.test(formData.password) },
                      { label: 'At least one symbol (e.g., @$!%*)', valid: /[^A-Za-z0-9]/.test(formData.password) }
                    ].map((req, i) => (
                      <div key={i} className={`flex items-center text-[11px] font-medium transition-colors duration-300 ${req.valid ? 'text-green-500' : 'text-neutral-500'}`}>
                        {req.valid ? <Check className="w-3.5 h-3.5 mr-2" /> : <X className="w-3.5 h-3.5 mr-2" />}
                        {req.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password Field with Eye Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password" 
                    className="w-full px-4 py-3 pr-10 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 transition-colors text-sm text-white placeholder-neutral-600" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-white focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Dynamic Match Feedback */}
                {formData.confirmPassword && (
                  <div className={`mt-3 flex items-center text-xs font-medium ${formData.password === formData.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                    {formData.password === formData.confirmPassword ? (
                      <><Check className="w-4 h-4 mr-1.5" /> Passwords match</>
                    ) : (
                      <><X className="w-4 h-4 mr-1.5" /> Passwords do not match</>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Conditions connected to Modal */}
            <div className="flex items-start space-x-3 bg-black border border-neutral-800 p-4 rounded-xl mt-2">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 bg-black border-neutral-700 rounded accent-red-600" 
              />
              <div className="text-xs text-neutral-400 leading-tight">
                <span>I agree to the </span>
                <button type="button" onClick={() => setShowTermsModal(true)} className="text-red-600 hover:underline">Terms & Conditions</button>
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
            <Link to="/login" className="text-red-600 hover:text-red-500 font-medium transition-colors">Sign In</Link>
          </div>

        </div>
      </div>

      {/* --- TERMS & CONDITIONS MODAL --- */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <FileText className="text-red-600 w-6 h-6" />
                <h2 className="text-xl font-bold tracking-wide">TERMS & CONDITIONS</h2>
              </div>
              <button onClick={() => setShowTermsModal(false)} className="text-neutral-500 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-300">
              
              <div className="bg-[#1e293b]/20 border border-[#334155] text-[#94a3b8] p-4 rounded-xl">
                Welcome to <span className="font-bold text-white">StreamSync</span> - Livestream Manila's booking platform. Please read these terms carefully before creating your account.
              </div>

              {/* Payment Terms */}
              <div className="border border-neutral-800 bg-[#0a0a0a] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="text-red-600 w-5 h-5" />
                  <h3 className="text-red-600 font-black uppercase tracking-widest text-base">Payment Terms</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-white mb-2">1. Quotation System</h4>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                      <li>Upon booking submission, our system generates an automated provisional quotation based on selected services, equipment, event duration, and location.</li>
                      <li>Location-based surcharges apply for travel and equipment transport (Zone 1-5 across Metro Manila and nearby provinces).</li>
                      <li>All quotations are subject to admin review and may be adjusted for special circumstances (crew allowances, complex venue setup, etc.).</li>
                      <li>The final invoice amount will be locked by admin before payment collection begins.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-2">2. Downpayment Requirement</h4>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                      <li><span className="text-[#38bdf8] font-semibold">50% downpayment</span> is required for all <span className="font-bold text-white">Livestream and Lights & Sounds</span> services.</li>
                      <li>Downpayment secures your booking slot and initiates equipment reservation and staff allocation.</li>
                      <li>The downpayment must be paid within 48 hours of quotation approval, or the booking may be cancelled.</li>
                      <li>Payment methods: Bank transfer, GCash, PayMaya, credit/debit card.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-2">3. Balance Payment</h4>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                      <li>The remaining <span className="font-bold text-white">50% balance</span> must be paid <span className="font-bold text-white">on or before the event date</span>.</li>
                      <li>For events with balance unpaid by the event day, Livestream Manila reserves the right to withhold services until full payment is received.</li>
                      <li>Post-event invoices may include additional charges for overtime, extra staff, or equipment not included in the original quotation.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-2">4. Loyalty Discount</h4>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                      <li>Clients with 3 or more completed bookings automatically receive a <span className="text-[#c084fc] font-bold">10% loyalty discount</span> on the total invoice.</li>
                      <li>The discount is applied automatically at quotation generation and reflected in the downpayment and balance amounts.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Booking Options */}
              <div className="border border-neutral-800 bg-[#0a0a0a] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="text-red-600 w-5 h-5" />
                  <h3 className="text-red-600 font-black uppercase tracking-widest text-base">Booking Submission Options</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-white">Submit Booking Request</h4>
                    <p className="text-neutral-400 mt-1">Full booking submission with equipment and staff availability check. Pending admin review and quotation approval.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-500">Pencil Book</h4>
                    <p className="text-neutral-400 mt-1">Tentative reservation without full commitment. Ideal for clients still finalizing event details. Can be edited and finalized later from "My Bookings". Once finalized, the system auto-confirms if resources are available.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Save as Draft</h4>
                    <p className="text-neutral-400 mt-1">Save your booking form progress without submitting. Drafts can be edited and submitted at any time from "My Bookings".</p>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="border border-neutral-800 bg-[#0a0a0a] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <X className="text-red-600 w-5 h-5" />
                  <h3 className="text-red-600 font-black uppercase tracking-widest text-base">Cancellation & Refund Policy</h3>
                </div>
                <p className="text-neutral-400 mb-4">The following cancellation policy governs all confirmed bookings. By creating an account, you acknowledge and agree to these terms:</p>
                
                <ol className="list-decimal pl-5 space-y-3 text-neutral-400 mb-6">
                  <li><span className="font-bold text-white">More than 30 days before the event:</span> Full refund of downpayment, less a 5% processing fee which covers administrative and payment gateway charges already incurred.</li>
                  <li><span className="font-bold text-white">15 to 30 days before the event:</span> 50% of the downpayment is retained by Livestream Manila to cover the opportunity cost of the reserved booking slot and the equipment and staff pre-allocation that has already been initiated.</li>
                  <li><span className="font-bold text-white">Less than 15 days before the event:</span> The downpayment is <span className="text-red-500 font-bold">non-refundable</span>. By this point, equipment has been reserved, staff have been scheduled, and alternative bookings for the same date cannot reasonably be secured.</li>
                </ol>

                <div className="border border-red-900/50 bg-red-950/20 rounded-xl p-4 mb-4">
                  <h4 className="font-bold text-red-500 mb-1">No-Show Policy</h4>
                  <p className="text-neutral-300">If a client does not cancel in advance and does not attend the event ("no-show"), the full downpayment is retained and marked as <span className="text-red-500 font-bold">Forfeited</span>. The client will be flagged in the system and may be required to pay an additional security deposit for future bookings.</p>
                </div>
                
                <p className="italic text-neutral-500 text-xs">* Staff time is a billable resource. When a confirmed booking is cancelled, the loss is not limited to equipment reservation. Staff operators have allocated their schedule — often turning down other engagements to ensure availability for your event.</p>
              </div>

              {/* Force Majeure */}
              <div className="border border-neutral-800 bg-[#0a0a0a] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="text-red-600 w-5 h-5" />
                  <h3 className="text-red-600 font-black uppercase tracking-widest text-base">Force Majeure & Rescheduling</h3>
                </div>
                <p className="text-neutral-400 mb-3">If Livestream Manila must cancel a confirmed booking due to circumstances beyond our control (severe weather, natural disasters, government-mandated lockdowns, or unresolvable equipment failure), the following applies:</p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li>Client receives a <span className="text-[#22c55e] font-bold">full refund</span> of the downpayment within 5 business days.</li>
                  <li>Client is offered <span className="text-[#38bdf8] font-bold">rebooking priority</span> for their preferred rescheduled date with no additional charges.</li>
                  <li>Livestream Manila will make every reasonable effort to provide alternative solutions or backup equipment when possible.</li>
                </ul>
              </div>

              {/* Account Responsibilities */}
              <div className="border border-neutral-800 bg-[#0a0a0a] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="text-red-600 w-5 h-5" />
                  <h3 className="text-red-600 font-black uppercase tracking-widest text-base">Account Responsibilities</h3>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                  <li>All bookings made through your account are your responsibility, even if made by someone else using your credentials.</li>
                  <li>Provide accurate contact information (email and phone) as this will be used for booking confirmations, quotations, and payment notifications.</li>
                  <li>Notify us immediately if you suspect unauthorized access to your account.</li>
                </ul>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-800 flex items-center justify-between bg-[#0a0a0a] rounded-b-2xl">
              <span className="text-xs text-neutral-500">Last updated: June 7, 2026 • Livestream Manila</span>
              <button 
                onClick={() => {
                  setAgreeTerms(true);
                  setShowTermsModal(false);
                }} 
                className="bg-[#ff0000] hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> I AGREE TO TERMS
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default RegisterPage;