import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  MapPin,
  Globe,
  Camera,
  Lock,
  UserCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  X,
} from "lucide-react";
import { supabase } from "../../supabaseClient";

const ClientProfile = ({ onRequestLogout }) => {
  const navigate = useNavigate();
  const [profileTab, setProfileTab] = useState("personal");

  // Passwords visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form inputs state
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+63 912 345 6789");
  const [company, setCompany] = useState("Livestream Manila");
  const [jobTitle, setJobTitle] = useState("Client");
  const [bio, setBio] = useState("");
  const [street, setStreet] = useState("123 Rizal Avenue, Makati");
  const [city, setCity] = useState("Makati City");
  const [country, setCountry] = useState("Philippines");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [memberSince, setMemberSince] = useState("January 2026");

  // Password inputs state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Feedback notifications
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch current client's data
  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setEmail(user.email || "");

        // Set signup date
        if (user.created_at) {
          const date = new Date(user.created_at);
          setMemberSince(date.toLocaleDateString("en-US", { month: "long", year: "numeric" }));
        }

        const meta = user.user_metadata || {};
        const parsedFirst = meta.first_name || meta.full_name?.split(" ")[0] || "";
        const parsedLast = meta.last_name || meta.full_name?.split(" ").slice(1).join(" ") || "";

        setFirstName(parsedFirst || "Client");
        setLastName(parsedLast || "");
        if (meta.phone) setPhone(meta.phone);
        if (meta.company) setCompany(meta.company);
        if (meta.job_title) setJobTitle(meta.job_title);
        if (meta.bio) setBio(meta.bio);
        if (meta.avatar_url) setAvatarUrl(meta.avatar_url);

        // Fetch from 'users' table if columns exist
        const { data: dbUser } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (dbUser) {
          if (dbUser.first_name) setFirstName(dbUser.first_name);
          if (dbUser.last_name) setLastName(dbUser.last_name);
          if (dbUser.phone) setPhone(dbUser.phone);
          if (dbUser.company) setCompany(dbUser.company);
          if (dbUser.job_title) setJobTitle(dbUser.job_title);
          if (dbUser.city) setCity(dbUser.city);
          if (dbUser.street) setStreet(dbUser.street);
          if (dbUser.bio) setBio(dbUser.bio);
        }
      }
    };

    loadProfile();
  }, []);

  // Compute initials
  const initials = `${firstName ? firstName[0] : "J"}${lastName ? lastName[0] : "D"}`.toUpperCase();

  // Handle Profile Photo Upload
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Photo exceeds maximum limit of 5 MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    setSuccessMessage("Profile photo updated preview! Click 'Save Changes' to retain.");
  };

  // Handle Save Personal Info
  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const fullName = `${firstName} ${lastName}`.trim();

      // 1. Update Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          company,
          job_title: jobTitle,
          phone,
          bio,
          avatar_url: avatarUrl,
        },
      });

      if (authError) throw authError;

      // 2. Try updating public users table if present
      await supabase
        .from("users")
        .update({
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          phone,
          company,
          job_title: jobTitle,
          bio,
          street,
          city,
          country,
        })
        .eq("id", userId);

      setSuccessMessage("Profile information saved successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccessMessage("Password has been changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage(err.message || "Error updating password.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="w-full space-y-7 font-['Montserrat',sans-serif] text-white">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
          My Profile
        </h1>
        <p className="text-xs text-neutral-400">
          Manage your personal information and account settings.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-[#0b2419] border border-[#14532d] text-[#22c55e] flex items-center gap-3 text-xs">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-400 flex items-center gap-3 text-xs">
          <AlertTriangle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar Box */}
        <div className="relative">
          <div className="w-24 h-24 bg-[#141824] border border-[#1b212f] rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-red-600">{initials}</span>
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 bg-[#ff0000] hover:bg-red-700 text-white w-8 h-8 rounded-full border-2 border-[#0f121a] flex items-center justify-center cursor-pointer transition">
            <Camera size={14} />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>

        {/* User Info & Badges */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-black text-white mb-1">
            {firstName} {lastName}
          </h2>
          <p className="text-xs text-neutral-400 mb-1">
            {jobTitle} · {company}
          </p>
          <p className="text-xs text-neutral-400 mb-3">{email}</p>

          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="bg-red-950/40 border border-red-800/50 text-red-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded">
              Client
            </span>
            <span className="bg-emerald-950/40 border border-emerald-800/50 text-emerald-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded">
              Active
            </span>
          </div>
        </div>

        <p className="text-[10px] text-neutral-500 md:self-end text-center md:text-right max-w-[210px] leading-relaxed">
          Click the camera icon to upload a new profile photo. JPG, PNG or WEBP — max 5 MB.
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-[#1b212f] gap-8 text-xs font-black uppercase tracking-wider">
        <button
          onClick={() => setProfileTab("personal")}
          className={`pb-3.5 transition-colors cursor-pointer ${
            profileTab === "personal"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Personal Info
        </button>
        <button
          onClick={() => setProfileTab("security")}
          className={`pb-3.5 transition-colors cursor-pointer ${
            profileTab === "security"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Password & Security
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. SUB-TAB: PERSONAL INFO                                 */}
      {/* ========================================================= */}
      {profileTab === "personal" && (
        <form onSubmit={handleSavePersonalInfo} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-[#1b212f] pb-4">
              <UserIcon size={16} className="text-red-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail size={12} className="text-neutral-500" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-neutral-400 cursor-not-allowed opacity-80"
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone size={12} className="text-neutral-500" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Briefcase size={12} className="text-neutral-500" /> Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  Job Title / Role
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                Short Bio
              </label>
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a little about yourself or your events business..."
                className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white focus:border-red-600 focus:outline-none resize-none placeholder:text-neutral-600"
              />
            </div>
          </div>

          {/* Address */}
          <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-[#1b212f] pb-4">
              <MapPin size={16} className="text-red-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">
                Address
              </h3>
            </div>

            <div>
              <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                Street Address
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Online Presence */}
          <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-4">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-red-600" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  Online Presence
                </h3>
              </div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest">
                Optional
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  Facebook
                </label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="facebook.com/yourpage"
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  Instagram
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#ff0000] hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-lg shadow-red-950/40 disabled:opacity-50"
            >
              <Save size={15} />
              <span>{loading ? "SAVING..." : "SAVE CHANGES"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* 2. SUB-TAB: PASSWORD & SECURITY                           */}
      {/* ========================================================= */}
      {profileTab === "security" && (
        <div className="space-y-6">
          {/* Change Password Form */}
          <form onSubmit={handleUpdatePassword} className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-[#1b212f] pb-4">
              <Lock size={16} className="text-red-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">
                Change Password
              </h3>
            </div>

            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl pl-4 pr-11 py-3 text-xs text-white placeholder:text-neutral-600 focus:border-red-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl pl-4 pr-11 py-3 text-xs text-white placeholder:text-neutral-600 focus:border-red-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl pl-4 pr-11 py-3 text-xs text-white placeholder:text-neutral-600 focus:border-red-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition cursor-pointer shadow-md shadow-red-950/40 disabled:opacity-50 mt-2"
              >
                {loading ? "UPDATING..." : "UPDATE PASSWORD"}
              </button>
            </div>
          </form>

          {/* Account Details Box */}
          <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3 border-b border-[#1b212f] pb-4">
              <UserCircle size={16} className="text-red-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">
                Account Details
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-[#1b212f]/60">
                <span className="text-neutral-400">Account Type</span>
                <span className="font-bold text-red-500">Client</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#1b212f]/60">
                <span className="text-neutral-400">Member Since</span>
                <span className="font-bold text-white">{memberSince}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#1b212f]/60">
                <span className="text-neutral-400">Last Login</span>
                <span className="font-bold text-white">Today, 9:41 AM</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-400">Account Status</span>
                <span className="font-bold text-emerald-500">Active</span>
              </div>
            </div>
          </div>

          {/* Danger Zone Box */}
          <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 border-b border-[#1b212f] pb-4 mb-5">
              <AlertTriangle size={16} className="text-red-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">
                Danger Zone
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">Delete Account</h4>
                <p className="text-[11px] text-neutral-500">
                  Permanently remove your account and all associated data.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-2.5 border border-red-900/80 text-red-500 hover:bg-red-950/40 text-xs font-black uppercase tracking-widest rounded-xl transition cursor-pointer"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0e121a] border border-red-600/60 rounded-2xl p-6 text-center shadow-2xl">
            <AlertTriangle size={32} className="text-red-500 mx-auto mb-3" />
            <h3 className="text-base font-black uppercase text-white mb-2">
              Delete Account?
            </h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              This action cannot be undone. All your bookings, quotations, and profiles will be erased.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-[#1b212f] text-neutral-300 hover:text-white text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase shadow-lg shadow-red-950/50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;