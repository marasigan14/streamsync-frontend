import React, { useState } from "react";
import { 
  User as UserIcon, MapPin, Globe, Camera, Lock, UserCircle, 
  AlertTriangle, Eye, EyeOff, Save, Mail, Phone, Briefcase 
} from "lucide-react";

const ClientProfile = () => {
  const [profileTab, setProfileTab] = useState("personal");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="max-w-4xl mx-auto animation-fade-in relative pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-neutral-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage your personal information and account settings.</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 transition-colors shadow-sm dark:shadow-none">
        {/* Avatar with Camera Badge */}
        <div className="relative">
          <div className="w-24 h-24 bg-neutral-100 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-center shadow-inner">
            <span className="text-3xl font-black text-red-600">JM</span>
          </div>
          <button className="absolute -bottom-2 -right-2 bg-[#ff0000] text-white w-8 h-8 rounded-full border-2 border-white dark:border-[#121212] flex items-center justify-center hover:bg-red-700 transition-colors">
            <Camera size={14} />
          </button>
        </div>

        {/* User Info & Badges */}
        <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">Joash G. Marasigan</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">BSIT 3-1N Student · PUP Manila</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">joash@streamsync.com</p>
          
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Client</span>
            <span className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Active</span>
          </div>
        </div>

        <p className="text-[10px] text-neutral-400 md:self-end text-center md:text-right max-w-[200px] mt-4 md:mt-0">
          Click the camera icon to upload a new profile photo. JPG, PNG or WEBP — max 5 MB.
        </p>
      </div>

      {/* Profile Sub-Navigation Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-8">
        <button 
          onClick={() => setProfileTab("personal")}
          className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-colors ${profileTab === "personal" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"}`}
        >
          Personal Info
        </button>
        <button 
          onClick={() => setProfileTab("security")}
          className={`pb-4 px-6 text-sm font-bold uppercase tracking-widest transition-colors ${profileTab === "security" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"}`}
        >
          Password & Security
        </button>
      </div>

      {/* SUB-TAB: PERSONAL INFO */}
      {profileTab === "personal" && (
        <div className="animation-fade-in space-y-6">
          <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
            <div className="flex items-center gap-3 mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <UserIcon size={18} className="text-red-600" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">First Name</label>
                <input type="text" defaultValue="Joash G." className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">Last Name</label>
                <input type="text" defaultValue="Marasigan" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2 flex items-center gap-1"><Mail size={12}/> Email Address</label>
                <input type="email" defaultValue="joash@streamsync.com" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2 flex items-center gap-1"><Phone size={12}/> Phone Number</label>
                <input type="tel" defaultValue="+63 912 345 6789" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2 flex items-center gap-1"><Briefcase size={12}/> Company / Organization</label>
                <input type="text" defaultValue="PUP Manila" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">Job Title / Role</label>
                <input type="text" defaultValue="BSIT 3-1N Student" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">Short Bio</label>
              <textarea rows="3" placeholder="Tell us a little about yourself or your events business..." className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors resize-none"></textarea>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
            <div className="flex items-center gap-3 mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <MapPin size={18} className="text-red-600" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Address</h3>
            </div>
            
            <div className="mb-6">
              <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">Street Address</label>
              <input type="text" defaultValue="123 Rizal Avenue, Makati" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">City</label>
                <input type="text" defaultValue="Makati City" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">Country</label>
                <input type="text" defaultValue="Philippines" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
              </div>
            </div>
          </div>

          {/* Online Presence */}
          <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
            <div className="flex items-center justify-between mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-red-600" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Online Presence</h3>
              </div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Optional</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">Website</label>
                <input type="url" placeholder="https://yourwebsite.com" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">Facebook</label>
                <input type="text" placeholder="facebook.com/yourpage" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">Instagram</label>
                <input type="text" placeholder="@yourhandle" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button className="bg-[#ff0000] hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20">
              <Save size={18} />
              SAVE CHANGES
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB: PASSWORD & SECURITY */}
      {profileTab === "security" && (
        <div className="animation-fade-in space-y-6">
          {/* Change Password */}
          <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
            <div className="flex items-center gap-3 mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <Lock size={18} className="text-red-600" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Change Password</h3>
            </div>
            
            <div className="max-w-md space-y-6">
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    placeholder="Enter current password" 
                    className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl pl-4 pr-12 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" 
                  />
                  <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white">
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    placeholder="At least 8 characters" 
                    className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl pl-4 pr-12 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" 
                  />
                  <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white">
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold tracking-widest uppercase mb-2">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Repeat new password" 
                    className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl pl-4 pr-12 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" 
                  />
                  <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-2">
                UPDATE PASSWORD
              </button>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <UserCircle size={18} className="text-red-600" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Account Details</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800/50">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Account Type</span>
                <span className="text-sm font-bold text-red-600">Client</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800/50">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Member Since</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">August 2026</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800/50">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Last Login</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">Today, 9:41 AM</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Account Status</span>
                <span className="text-sm font-bold text-emerald-500">Active</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50/50 dark:bg-[#121212] border border-red-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-red-200 dark:border-neutral-800 pb-4">
              <AlertTriangle size={18} className="text-red-600" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Danger Zone</h3>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Delete Account</h4>
                <p className="text-[11px] text-neutral-500">Permanently remove your account and all associated data.</p>
              </div>
              <button className="px-6 py-2.5 border border-red-600 dark:border-red-900 text-red-600 hover:bg-red-100 dark:hover:bg-red-950/30 text-sm font-bold rounded-lg transition-colors whitespace-nowrap">
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;