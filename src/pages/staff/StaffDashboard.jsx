import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
  Sun, Moon, LogOut, LayoutDashboard, Calendar, Wrench, Package,
  CheckCircle2, Clock, AlertTriangle, MessageSquare, ShieldCheck, UserCheck, Plus
} from "lucide-react";

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
    { id: "overview", label: "OVERVIEW", icon: LayoutDashboard },
    { id: "availability", label: "AVAILABILITY MANAGER", icon: Calendar },
    { id: "inventory", label: "INVENTORY & GEAR", icon: Package },
    { id: "maintenance", label: "MAINTENANCE LOGS", icon: Wrench },
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
                <Icon size={16} className={isActive ? "text-white" : "text-neutral-500"} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full relative">
        <header className="h-20 bg-white dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-900 flex items-center justify-between px-8 transition-colors duration-300 shrink-0">
          <div className="flex-1"></div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-neutral-500 dark:text-neutral-400 hover:text-white transition">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="flex items-center gap-3 text-right border-l border-neutral-800 pl-6">
              <div>
                <p className="text-sm font-bold text-white leading-none">Staff Operator</p>
                <p className="text-[10px] text-neutral-400 mt-1">Broadcast Tech Unit</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-red-950 flex items-center justify-center text-red-500 font-bold text-xs border border-red-900">
                SO
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
                <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-white">Staff Command Center</h1>
                <p className="text-sm text-neutral-400">Monitor active streaming deployments, gear health, and personal scheduling.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0"><UserCheck size={24}/></div>
                  <div>
                    <h2 className="text-3xl font-black text-white leading-none mb-1">3</h2>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Assigned Events Today</p>
                  </div>
                </div>
                <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0"><AlertTriangle size={24}/></div>
                  <div>
                    <h2 className="text-3xl font-black text-white leading-none mb-1">2</h2>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Gear Requiring Check</p>
                  </div>
                </div>
                <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0"><ShieldCheck size={24}/></div>
                  <div>
                    <h2 className="text-3xl font-black text-white leading-none mb-1">100%</h2>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">System Operational</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "availability" && <div className="text-neutral-400">Availability Manager calendar interface goes here...</div>}
          {activeTab === "inventory" && <div className="text-neutral-400">Inventory & Gear tracking list goes here...</div>}
          {activeTab === "maintenance" && <div className="text-neutral-400">Maintenance & Repair ticketing system goes here...</div>}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;