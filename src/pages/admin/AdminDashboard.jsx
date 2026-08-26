import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
  Sun, Moon, LogOut, LayoutDashboard, CalendarCheck, Package,
  Wrench, Briefcase, Users, CreditCard, BarChart, Shield,
  Bot, ArrowUpRight
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // --- AUTOMATED AUDIT LOG FUNCTION ---
  const insertTestLog = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.log("No user logged in to attribute this log to.");
        return;
      }

      const { data, error } = await supabase
        .from('activity_logs')
        .insert([
          { 
            user_id: user.id, 
            event_message: 'TEST_LOG: Admin dashboard initialized and verified successfully.' 
          }
        ]);

      if (error) {
        console.error('Error inserting log:', error.message);
      } else {
        console.log('Successfully inserted test log!', data);
      }
    } catch (err) {
      console.error("Crash prevented during logging:", err);
    }
  };

  // Trigger log insertion on dashboard load
  useEffect(() => {
    insertTestLog();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navItems = [
    { id: "overview", label: "OVERVIEW", icon: LayoutDashboard },
    { id: "bookings", label: "MANAGE BOOKINGS", icon: CalendarCheck },
    { id: "inventory", label: "INVENTORY", icon: Package },
    { id: "maintenance", label: "MAINTENANCE", icon: Wrench },
    { id: "services", label: "SERVICES", icon: Briefcase },
    { id: "deployment", label: "STAFF DEPLOYMENT", icon: Users },
    { id: "billing", label: "BILLING & PAYMENTS", icon: CreditCard },
    { id: "analytics", label: "ANALYTICS", icon: BarChart },
    { id: "users", label: "USER ACCOUNTS", icon: Shield },
    { id: "chatbot", label: "CHATBOT CONFIG", icon: Bot },
  ];

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-black text-neutral-900 dark:text-white font-sans overflow-hidden transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-[#0a0a0a] border-r border-neutral-200 dark:border-neutral-900 flex flex-col transition-colors duration-300">
        <div className="h-20 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-900">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-black text-sm tracking-tighter text-white">
              LM
            </div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-500 dark:text-neutral-400">| ADMIN CONTROL</span>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  isActive 
                    ? "bg-[#ff0000] text-white shadow-lg shadow-red-900/20" 
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {/* Fallback to prevent crash if Icon is missing */}
                {Icon && <Icon size={16} className={isActive ? "text-white" : "text-neutral-500"} />}
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full relative">
        <header className="h-20 bg-white dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-900 flex items-center justify-between px-8 transition-colors duration-300 shrink-0">
          <div className="flex-1 text-xs font-bold uppercase tracking-widest text-red-600">
            System Admin Panel • StreamSync Core
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-neutral-400 hover:text-white transition">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="flex items-center gap-3 text-right border-l border-neutral-800 pl-6">
              <div>
                <p className="text-sm font-bold text-white leading-none">Joash Marasigan</p>
                <p className="text-[10px] text-red-500 mt-1">Super Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                JM
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-950/30 px-4 py-2 rounded-lg hover:bg-red-900/40 transition">
              <LogOut size={14} /> LOGOUT
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="max-w-6xl mx-auto animation-fade-in">
              <div className="mb-10">
                <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-white">Executive Overview</h1>
                <p className="text-sm text-neutral-400">Real-time enterprise metrics for Livestream Manila operations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Revenue (YTD)</p>
                  <p className="text-2xl font-black text-white">₱1,450,000</p>
                  <span className="text-[10px] text-emerald-500 font-bold mt-2 inline-flex items-center gap-1">+18% from last month <ArrowUpRight size={12}/></span>
                </div>
                <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Active Bookings</p>
                  <p className="text-2xl font-black text-red-600">14</p>
                  <span className="text-[10px] text-neutral-400 mt-2 block">Requires admin review</span>
                </div>
                <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Staff Deployed</p>
                  <p className="text-2xl font-black text-white">8 Units</p>
                  <span className="text-[10px] text-emerald-500 font-bold mt-2 block">Fully staffed today</span>
                </div>
                <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Pending Approvals</p>
                  <p className="text-2xl font-black text-amber-500">5</p>
                  <span className="text-[10px] text-amber-500 mt-2 block">Action required</span>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC MODULE PLACEHOLDERS */}
          {activeTab === "bookings" && <div className="text-neutral-400">Manage Bookings Approval & Quotation Engine goes here...</div>}
          {activeTab === "inventory" && <div className="text-neutral-400">Inventory Stock Management goes here...</div>}
          {activeTab === "maintenance" && <div className="text-neutral-400">Equipment Maintenance logs goes here...</div>}
          {activeTab === "services" && <div className="text-neutral-400">Livestream Packages & Pricing Configuration goes here...</div>}
          {activeTab === "deployment" && <div className="text-neutral-400">Staff Deployment & Event Scheduling goes here...</div>}
          {activeTab === "billing" && <div className="text-neutral-400">Billing, Invoices & Receipt Verification goes here...</div>}
          {activeTab === "analytics" && <div className="text-neutral-400">System Analytics & Financial Reporting goes here...</div>}
          {activeTab === "users" && <div className="text-neutral-400">User Accounts & Role Management goes here...</div>}
          {activeTab === "chatbot" && <div className="text-neutral-400">AI Chatbot Training & FAQ Configuration goes here...</div>}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;