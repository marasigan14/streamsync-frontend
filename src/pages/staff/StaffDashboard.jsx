import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Sun, Moon, LogOut, Home, CalendarDays, ClipboardList, Wrench } from "lucide-react";

import StaffOverview from "./StaffOverview";
import SchedulingManagement from "./SchedulingManagement";
import EquipmentChecklist from "./EquipmentChecklist";
import StaffMaintenance from "./StaffMaintenance";

const StaffDashboard = () => {
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
    <div className="flex h-screen bg-neutral-100 dark:bg-black text-neutral-900 dark:text-white font-sans overflow-hidden transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-[#0a0a0a] border-r border-neutral-200 dark:border-neutral-900 flex flex-col transition-colors duration-300">
        <div className="h-20 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-900">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-black text-sm tracking-tighter text-white">
              LM
            </div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-500 dark:text-neutral-400">| STAFF PORTAL</span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  isActive 
                    ? "bg-[#ff0000] text-white shadow-lg shadow-red-900/20" 
                    : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Icon size={16} className={isActive ? "text-white" : "text-neutral-500 dark:text-neutral-500"} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-900 flex items-center justify-between px-8 transition-colors duration-300 shrink-0">
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="flex items-center gap-3 text-right border-l border-neutral-200 dark:border-neutral-800 pl-6">
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white leading-none">Joash Marasigan</p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">staff@livestreammanila.ph</p>
              </div>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition">
              <LogOut size={14} /> LOGOUT
            </button>
          </div>
        </header>

        {/* Scrollable Content View */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
          {activeTab === "overview" && <StaffOverview setActiveTab={setActiveTab} />}
          {activeTab === "scheduling" && <SchedulingManagement />}
          {activeTab === "inventory" && <EquipmentChecklist />}
          {activeTab === "maintenance" && <StaffMaintenance />}
        </div>

      </main>
    </div>
  );
};

export default StaffDashboard;