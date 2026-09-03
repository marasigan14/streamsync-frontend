import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
  Sun,
  Moon,
  LogOut,
  Home,
  CalendarDays,
  ClipboardList,
  Wrench,
} from "lucide-react";
import logoImage from "../../assets/livestream-logo.png";

import StaffOverview from "./StaffOverview";
import SchedulingManagement from "./SchedulingManagement";
import EquipmentChecklist from "./EquipmentChecklist";
import StaffMaintenance from "./StaffMaintenance";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Dynamic logged-in staff user state
  const [staffData, setStaffData] = useState({
    fullName: "Staff Member",
    email: "staff@livestreammanila.ph",
    initials: "SM",
  });

  useEffect(() => {
    const fetchStaffProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const metadata = user.user_metadata || {};
        let fullName =
          metadata.full_name ||
          metadata.name ||
          (metadata.first_name
            ? `${metadata.first_name} ${metadata.last_name || ""}`.trim()
            : "");

        if (!fullName) {
          const { data: dbUser } = await supabase
            .from("users")
            .select("full_name, first_name, last_name")
            .eq("id", user.id)
            .maybeSingle();

          if (dbUser) {
            fullName =
              dbUser.full_name ||
              `${dbUser.first_name || ""} ${dbUser.last_name || ""}`.trim();
          }
        }

        if (!fullName) {
          fullName = user.email ? user.email.split("@")[0] : "Staff Member";
        }

        let initials = "SM";
        const parts = fullName.trim().split(" ").filter(Boolean);
        if (parts.length >= 2) {
          initials = `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        } else if (parts[0]) {
          initials = parts[0].slice(0, 2).toUpperCase();
        }

        setStaffData({
          fullName,
          email: user.email || "staff@livestreammanila.ph",
          initials,
        });
      }
    };

    fetchStaffProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navItems = [
    { id: "overview", label: "OVERVIEW", icon: Home },
    { id: "scheduling", label: "AVAILABILITY MANAGER", icon: CalendarDays },
    { id: "inventory", label: "INVENTORY", icon: ClipboardList },
    { id: "maintenance", label: "MAINTENANCE", icon: Wrench },
  ];

  return (
    <div className="min-h-screen font-['Montserrat',sans-serif] bg-[#090b10] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="w-full bg-[#090b10] px-8 py-4 flex items-center justify-between border-b border-neutral-900 sticky top-0 z-40">
        <div className="flex items-center gap-3.5">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-neutral-700 text-sm">|</span>
          <span className="text-xs font-bold text-neutral-400 tracking-[0.16em] uppercase">
            Staff Portal
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-neutral-400 hover:text-white transition cursor-pointer"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3.5">
            <div className="text-right">
              <p className="text-xs font-bold leading-tight text-white capitalize">
                {staffData.fullName}
              </p>
              <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                {staffData.email}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#141823] border border-neutral-800 flex items-center justify-center font-bold text-xs text-red-500 shadow-inner">
              {staffData.initials}
            </div>
          </div>

          {/* Logout Trigger */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-500 transition cursor-pointer"
          >
            <LogOut size={15} />
            <span>LOGOUT</span>
          </button>
        </div>
      </header>

      {/* Red Accent Separator */}
      <div className="h-[1.5px] w-full bg-red-600"></div>

      {/* Main Dashboard Layout */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto px-8 py-8 gap-8">
        {/* Left Sidebar */}
        <aside className="w-60 shrink-0 space-y-2.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#ff0000] text-white shadow-lg shadow-red-600/30"
                    : "bg-[#0f121a]/80 text-neutral-400 hover:text-white hover:bg-[#151924] border border-[#1b212f]"
                }`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Content */}
        <main className="flex-1">
          {activeTab === "overview" && (
            <StaffOverview
              setActiveTab={setActiveTab}
              staffName={staffData.fullName}
            />
          )}
          {activeTab === "scheduling" && <SchedulingManagement />}
          {activeTab === "inventory" && <EquipmentChecklist />}
          {activeTab === "maintenance" && <StaffMaintenance />}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-black border-2 border-red-600/80 rounded-2xl p-7 text-center shadow-[0_0_25px_rgba(255,0,0,0.25)] animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-white mb-6">
              Are you sure you want to log-out?
            </h3>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleLogout}
                className="w-24 py-2.5 rounded-xl bg-[#4b5563] hover:bg-[#374151] text-white text-sm font-semibold transition cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-24 py-2.5 rounded-xl bg-[#4b5563] hover:bg-[#374151] text-white text-sm font-semibold transition cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;