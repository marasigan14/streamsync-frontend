import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Boxes,
  Wrench,
  Briefcase,
  Users,
  CreditCard,
  BarChart3,
  UserCog,
  Bot,
} from "lucide-react";
import logoImage from "../../assets/livestream-logo.png";

// Admin Subcomponents
import AdminOverview from "./AdminOverview";
import ManageBookings from "./ManageBookings";
import Inventory from "./Inventory";
import Maintenance from "./Maintenance";
import Services from "./Services";
import StaffDeployment from "./StaffDeployment";
import AdminBilling from "./AdminBilling";
import Analytics from "./Analytics";
import UserAccounts from "./UserAccounts";
import ChatbotConfig from "./ChatbotConfig";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Authenticated Admin User Details
  const [adminData, setAdminData] = useState({
    fullName: "Administrator",
    email: "admin@livestreammanila.ph",
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const meta = user.user_metadata || {};
        const name = meta.full_name || meta.name || "Administrator";
        setAdminData({
          fullName: name,
          email: user.email || "admin@livestreammanila.ph",
        });
      }
    };
    fetchAdmin();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navItems = [
    { id: "overview", label: "OVERVIEW", icon: LayoutDashboard },
    { id: "bookings", label: "MANAGE BOOKINGS", icon: CalendarDays },
    { id: "inventory", label: "INVENTORY", icon: Boxes },
    { id: "maintenance", label: "MAINTENANCE", icon: Wrench },
    { id: "services", label: "SERVICES", icon: Briefcase },
    { id: "staff", label: "STAFF DEPLOYMENT", icon: Users },
    { id: "billing", label: "BILLING & PAYMENTS", icon: CreditCard },
    { id: "analytics", label: "ANALYTICS", icon: BarChart3 },
    { id: "users", label: "USER ACCOUNTS", icon: UserCog },
    { id: "chatbot", label: "CHATBOT CONFIG", icon: Bot },
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
            Admin Portal
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

          {/* Admin Info Pill */}
          <div className="text-right">
            <p className="text-xs font-bold leading-tight text-white capitalize">
              {adminData.fullName}
            </p>
            <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
              {adminData.email}
            </p>
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
        <aside className="w-64 shrink-0 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#ff0000] text-white shadow-lg shadow-red-600/30"
                    : "bg-[#0f121a]/80 text-neutral-400 hover:text-white hover:bg-[#151924] border border-[#1b212f]"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Scrollable Content */}
        <main className="flex-1">
          {activeTab === "overview" && <AdminOverview setActiveTab={setActiveTab} />}
          {activeTab === "bookings" && <ManageBookings />}
          {activeTab === "inventory" && <Inventory />}
          {activeTab === "maintenance" && <Maintenance />}
          {activeTab === "services" && <Services />}
          {activeTab === "staff" && <StaffDeployment />}
          {activeTab === "billing" && <AdminBilling />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "users" && <UserAccounts />}
          {activeTab === "chatbot" && <ChatbotConfig />}
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
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

export default AdminDashboard;