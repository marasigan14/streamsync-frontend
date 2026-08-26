import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
  Sun, Moon, LogOut, LayoutDashboard, CalendarPlus, CalendarDays,
  CreditCard, User as UserIcon, Calendar, CheckCircle2, Clock,
  FileText, ArrowRight, MessageSquare, Video, MapPin, Mail, AlertCircle,
  TrendingUp, ReceiptText, Eye, CircleDollarSign, Info, UploadCloud, QrCode,
  Camera, Briefcase, Globe, Lock, Save
} from "lucide-react";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [billingTab, setBillingTab] = useState("overview");
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [profileTab, setProfileTab] = useState("personal");

  // Handle Dark Mode Toggle
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

  // Sidebar Navigation Links
  const navItems = [
    { id: "overview", label: "OVERVIEW", icon: LayoutDashboard },
    { id: "book", label: "BOOK SERVICE", icon: CalendarPlus },
    { id: "bookings", label: "MY BOOKINGS", icon: FileText },
    { id: "billing", label: "BILLING & PAYMENTS", icon: CreditCard },
    { id: "profile", label: "MY PROFILE", icon: UserIcon },
  ];

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-black text-neutral-900 dark:text-white font-sans overflow-hidden transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-[#0a0a0a] border-r border-neutral-200 dark:border-neutral-900 flex flex-col transition-colors duration-300">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-900">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-black text-sm tracking-tighter text-white">
              LM
            </div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-500 dark:text-neutral-400">| CLIENT PORTAL</span>
          </div>
        </div>

        {/* Navigation */}
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
          <div className="flex-1"></div> {/* Spacer */}
          
          <div className="flex items-center gap-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="flex items-center gap-3 text-right border-l border-neutral-200 dark:border-neutral-800 pl-6">
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white leading-none">Joash Marasigan</p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">joash@streamsync.com</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-red-950 flex items-center justify-center text-red-500 font-bold text-xs border border-red-900">
                JM
              </div>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition">
              <LogOut size={14} /> LOGOUT
            </button>
          </div>
        </header>

        {/* Scrollable Content View */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          
          {/* OVERVIEW TAB CONTENT */}
          {activeTab === "overview" && (
            <div className="max-w-6xl mx-auto animation-fade-in">
              
              {/* Welcome Header */}
              <div className="mb-10">
                <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-neutral-900 dark:text-white">Welcome Back, Joash</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Here's an overview of your events and account activity.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-center gap-5 shadow-sm dark:shadow-none transition-colors">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                    <CalendarDays size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-neutral-900 dark:text-white leading-none mb-1">2</h2>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Active Bookings</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-center gap-5 shadow-sm dark:shadow-none transition-colors">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-neutral-900 dark:text-white leading-none mb-1">5</h2>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Past Events</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-center gap-5 shadow-sm dark:shadow-none transition-colors">
                  <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-neutral-900 dark:text-white leading-none mb-1">1</h2>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Pending Quotes</p>
                  </div>
                </div>
              </div>

              {/* Bottom Row Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Recent Bookings */}
                <div className="lg:col-span-3 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm dark:shadow-none transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-900 dark:text-white">Recent Bookings</h3>
                    <button onClick={() => setActiveTab("bookings")} className="text-xs font-bold text-red-600 flex items-center gap-1 hover:text-red-500 transition">
                      View All <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Booking Item 1 */}
                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-neutral-900 dark:text-white text-base">Corporate Webinar 2026</h4>
                          <p className="text-[10px] text-neutral-500 mt-1">BK-2026-001</p>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Confirmed
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                        <span className="flex items-center gap-1.5"><Calendar size={14}/> Aug 15, 2026</span>
                        <span className="flex items-center gap-1.5"><Video size={14}/> Webinar</span>
                      </div>
                    </div>

                    {/* Booking Item 2 */}
                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-neutral-900 dark:text-white text-base">Annual Product Launch</h4>
                          <p className="text-[10px] text-neutral-500 mt-1">BK-2026-002</p>
                        </div>
                        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Pending
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                        <span className="flex items-center gap-1.5"><Calendar size={14}/> Oct 05, 2026</span>
                        <span className="flex items-center gap-1.5"><Video size={14}/> Live Stream</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-2 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm dark:shadow-none transition-colors">
                  <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-neutral-900 dark:text-white">Quick Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button onClick={() => setActiveTab("bookings")} className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 p-6 rounded-xl flex flex-col items-center justify-center text-center hover:border-red-600/50 transition group">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center text-red-600 mb-3 group-hover:scale-110 transition-transform">
                        <FileText size={18} />
                      </div>
                      <span className="text-sm font-bold text-neutral-900 dark:text-white mb-1">My Bookings</span>
                      <span className="text-[10px] text-neutral-500 leading-tight">View and manage events</span>
                    </button>

                    <button onClick={() => setActiveTab("book")} className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 p-6 rounded-xl flex flex-col items-center justify-center text-center hover:border-red-600/50 transition group">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center text-red-600 mb-3 group-hover:scale-110 transition-transform">
                        <CalendarPlus size={18} />
                      </div>
                      <span className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Book Now</span>
                      <span className="text-[10px] text-neutral-500 leading-tight">Schedule your next livestream</span>
                    </button>
                  </div>

                  <button onClick={() => setActiveTab("billing")} className="w-full bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 p-6 rounded-xl flex flex-col items-center justify-center text-center hover:border-red-600/50 transition group">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center text-red-600 mb-3 group-hover:scale-110 transition-transform">
                      <CreditCard size={18} />
                    </div>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Billing & Payments</span>
                    <span className="text-[10px] text-neutral-500 leading-tight">Manage invoices and pay online</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* MY BOOKINGS TAB CONTENT */}
          {activeTab === "bookings" && (
            <div className="max-w-4xl mx-auto animation-fade-in">
              
              <div className="mb-8">
                <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-neutral-900 dark:text-white">My Bookings</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Track and manage your livestream service bookings</p>
              </div>

              {/* Status Guide */}
              <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-900 p-6 rounded-2xl mb-8">
                <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-4">Booking Status Guide</p>
                <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-600"></div> Confirmed</span>
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Pending</span>
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Pencil Book</span>
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-neutral-500"></div> Draft</span>
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Completed</span>
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-neutral-800"></div> Cancelled</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Bookings</p>
                  <p className="text-2xl font-black text-neutral-900 dark:text-white">4</p>
                </div>
                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 border-l-4 border-l-red-600">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Confirmed</p>
                  <p className="text-2xl font-black text-red-600">1</p>
                </div>
                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 border-l-4 border-l-orange-500">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Pencil / Pending</p>
                  <p className="text-2xl font-black text-orange-500">1</p>
                </div>
                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 border-l-4 border-l-neutral-500">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Drafts</p>
                  <p className="text-2xl font-black text-neutral-400">1</p>
                </div>
              </div>

              {/* Booking List */}
              <div className="space-y-6">
                
                {/* Card 1: Confirmed */}
                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">Annual Company Conference</h3>
                      <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-neutral-200 dark:border-neutral-700">Conference</span>
                    </div>
                    <span className="bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-900/50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start">
                      Confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12}/> Date</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">2026-06-15</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12}/> Time</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">09:00 AM - 6:00 PM</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin size={12}/> Location</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">SMX Convention Center</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><span className="text-red-600 font-bold">$</span> Budget</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">₱100,000+</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] border border-neutral-300 dark:border-neutral-700 rounded px-3 py-1 text-neutral-600 dark:text-neutral-400">LIVE EVENT STREAMING</span>
                      <span className="text-[10px] border border-neutral-300 dark:border-neutral-700 rounded px-3 py-1 text-neutral-600 dark:text-neutral-400">VIDEO PRODUCTION</span>
                      <span className="text-[10px] border border-neutral-300 dark:border-neutral-700 rounded px-3 py-1 text-neutral-600 dark:text-neutral-400">AUDIO ENGINEERING</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800 gap-4">
                    <p className="text-xs text-neutral-500">Submitted: 2026-05-10</p>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button className="flex-1 md:flex-none bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors">
                        Edit Package
                      </button>
                      <button className="flex-1 md:flex-none bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 2: Pencil Book */}
                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">Product Launch Webinar</h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-neutral-200 dark:border-neutral-700">Webinar</span>
                        <span className="bg-orange-500/10 text-orange-600 dark:text-orange-500 border border-orange-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Tentative Hold</span>
                      </div>
                    </div>
                    <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-500 border border-orange-200 dark:border-orange-900/50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start">
                      Pencil Book
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12}/> Date</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">2026-07-20</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12}/> Time</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">2:00 PM - 4:00 PM</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin size={12}/> Location</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">Virtual</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><span className="text-red-600 font-bold">$</span> Budget</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">₱25,000 - ₱50,000</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] border border-neutral-300 dark:border-neutral-700 rounded px-3 py-1 text-neutral-600 dark:text-neutral-400">WEBINAR PRODUCTION</span>
                      <span className="text-[10px] border border-neutral-300 dark:border-neutral-700 rounded px-3 py-1 text-neutral-600 dark:text-neutral-400">VIRTUAL EVENTS</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800 gap-4">
                    <p className="text-xs text-neutral-500">Submitted: 2026-05-14</p>
                    <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
                      <button className="bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors">
                        View Details
                      </button>
                      <button className="bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors">
                        Edit Details
                      </button>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors">
                        Finalize & Submit
                      </button>
                      <button className="bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 3: Draft */}
                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 opacity-70 hover:opacity-100 transition-opacity">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">Marketing Workshop</h3>
                      <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-neutral-200 dark:border-neutral-700">Seminar</span>
                    </div>
                    <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start">
                      Draft
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12}/> Date</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">2026-08-10</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12}/> Time</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">9:00 AM - 12:00 PM</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin size={12}/> Location</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">BGC Office</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><span className="text-red-600 font-bold">$</span> Budget</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">₱10,000 - ₱25,000</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800 gap-4">
                    <p className="text-xs text-neutral-500">Last Saved: 2026-05-20</p>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button className="flex-1 md:flex-none bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 md:flex-none bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors">
                        Edit Draft
                      </button>
                      <button className="flex-1 md:flex-none bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Need Help Box */}
              <div className="mt-12 bg-[#ff0000] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-red-900/20">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Need Help?</h3>
                  <p className="text-sm text-red-100">Have questions about your booking or need to make changes? Our team is here to help you every step of the way.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none bg-white text-red-600 hover:bg-neutral-100 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-lg transition">Contact Support</button>
                  <button className="flex-1 md:flex-none bg-red-800 text-white hover:bg-red-900 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-lg transition">View FAQs</button>
                </div>
              </div>

            </div>
          )}

          {/* PLACEHOLDERS FOR REMAINING TABS */}
          {/* BOOK SERVICE TAB CONTENT */}
          {activeTab === "book" && (
            <div className="max-w-4xl mx-auto animation-fade-in">
              <div className="mb-8">
                <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-neutral-900 dark:text-white">Book a Service</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Fill out your event details to generate an automated quotation.</p>
              </div>

              <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm dark:shadow-none transition-colors">
                <form className="space-y-8">
                  
                  {/* Event Details */}
                  <div>
                    <h3 className="text-xs font-bold tracking-widest uppercase text-red-600 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">Event Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Event Name</label>
                        <input type="text" placeholder="e.g. Annual Company Conference" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Event Type</label>
                        <select className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors appearance-none">
                          <option>Corporate</option>
                          <option>Webinar</option>
                          <option>Wedding</option>
                          <option>Concert / Festival</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Schedule & Location */}
                  <div>
                    <h3 className="text-xs font-bold tracking-widest uppercase text-red-600 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">Schedule & Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Date</label>
                        <input type="date" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-500 focus:border-red-600 focus:outline-none transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Start Time</label>
                        <input type="time" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-500 focus:border-red-600 focus:outline-none transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">End Time</label>
                        <input type="time" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-500 focus:border-red-600 focus:outline-none transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Venue / Location</label>
                      <input type="text" placeholder="e.g. SMX Convention Center" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                    </div>
                  </div>

                  {/* Services Needed */}
                  <div>
                    <h3 className="text-xs font-bold tracking-widest uppercase text-red-600 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">Services Needed</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["Livestreaming", "Video Production", "Audio Engineering", "Lights & Sounds", "Projector Rental", "LED Wall", "Virtual Event Setup", "Content Creation"].map((service, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl cursor-pointer hover:border-red-600/50 transition-colors">
                          <input type="checkbox" className="w-4 h-4 accent-red-600 bg-neutral-50 dark:bg-black border-neutral-300 dark:border-neutral-700 rounded" />
                          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="button" className="bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-4 px-10 rounded-xl transition-colors shadow-lg shadow-red-900/20">
                      Generate Automated Quotation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* BILLING & PAYMENTS TAB CONTENT */}
          {activeTab === "billing" && (
            <div className="max-w-5xl mx-auto animation-fade-in">
              
              <div className="mb-8">
                <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-neutral-900 dark:text-white">Billing & Payments</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage invoices, payments, and transaction history</p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-start gap-4 shadow-sm dark:shadow-none transition-colors">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Paid</p>
                    <p className="text-2xl font-black text-neutral-900 dark:text-white mb-2">₱50,000</p>
                    <p className="text-xs font-bold text-emerald-500">All verified payments</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-start gap-4 shadow-sm dark:shadow-none transition-colors">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Pending Verification</p>
                    <p className="text-2xl font-black text-neutral-900 dark:text-white mb-2">₱49,000</p>
                    <p className="text-xs font-bold text-amber-500">Being verified by admin</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-start gap-4 shadow-sm dark:shadow-none transition-colors">
                  <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Balance Due</p>
                    <p className="text-2xl font-black text-neutral-900 dark:text-white mb-2">₱59,000</p>
                    <p className="text-xs font-bold text-red-500">Upcoming event balances</p>
                  </div>
                </div>
              </div>

              {/* Billing Sub-Navigation */}
              <div className="flex items-center gap-8 border-b border-neutral-200 dark:border-neutral-800 mb-8 px-2 overflow-x-auto hide-scrollbar">
                <button 
                  onClick={() => setBillingTab("overview")}
                  className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${billingTab === "overview" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
                >
                  <TrendingUp size={16} /> Payment Overview
                </button>
                <button 
                  onClick={() => setBillingTab("make_payment")}
                  className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${billingTab === "make_payment" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
                >
                  <CreditCard size={16} /> Make Payment
                </button>
                <button 
                  onClick={() => setBillingTab("history")}
                  className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${billingTab === "history" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
                >
                  <ReceiptText size={16} /> Transaction History
                </button>
              </div>

              {/* SUB-TAB: PAYMENT OVERVIEW */}
              {billingTab === "overview" && (
                <div className="animation-fade-in">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-900 dark:text-white mb-6">Your Bookings & Invoices</h3>
                  <div className="space-y-6">
                    
                    {/* Invoice 1 */}
                    <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                        <div>
                          <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Tech Summit 2026</h4>
                          <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                            <span className="flex items-center gap-1"><Calendar size={12}/> 2026-06-15</span>
                            <span className="flex items-center gap-1"><MapPin size={12}/> SMX Convention Center</span>
                          </div>
                        </div>
                        <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 self-start md:self-auto">
                          <Eye size={14}/> View Invoice
                        </button>
                      </div>

                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                          <span>Total Invoice:</span>
                          <span className="font-bold text-neutral-900 dark:text-white">₱98,000</span>
                        </div>
                        <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                          <div className="flex items-center gap-3">
                            <span>Downpayment (50%):</span>
                            <span className="bg-amber-500/20 text-amber-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1"><Clock size={10}/> Verifying</span>
                          </div>
                          <span className="font-bold">₱49,000</span>
                        </div>
                        <div className="flex justify-between items-center text-neutral-500">
                          <div className="flex items-center gap-3">
                            <span>Balance Due (50%):</span>
                            <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Not Paid</span>
                          </div>
                          <span className="font-bold text-neutral-900 dark:text-white">₱49,000</span>
                        </div>
                      </div>
                    </div>

                    {/* Invoice 2 */}
                    <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-start gap-4">
                          <div>
                            <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Sarah & Mike Wedding</h4>
                            <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                              <span className="flex items-center gap-1"><Calendar size={12}/> 2026-06-25</span>
                              <span className="flex items-center gap-1"><MapPin size={12}/> Tagaytay Highlands</span>
                            </div>
                          </div>
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mt-1">Fully Paid</span>
                        </div>
                        <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 self-start md:self-auto">
                          <Eye size={14}/> View Invoice
                        </button>
                      </div>

                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                          <span>Total Invoice:</span>
                          <span className="font-bold text-neutral-900 dark:text-white">₱50,000</span>
                        </div>
                        <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                          <div className="flex items-center gap-3">
                            <span>Downpayment (50%):</span>
                            <span className="bg-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={10}/> Verified</span>
                          </div>
                          <span className="font-bold">₱25,000</span>
                        </div>
                        <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                          <div className="flex items-center gap-3">
                            <span>Balance Due (50%):</span>
                            <span className="bg-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={10}/> Verified</span>
                          </div>
                          <span className="font-bold">₱25,000</span>
                        </div>
                      </div>
                    </div>

                    {/* Invoice 3 */}
                    <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                        <div>
                          <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Product Launch Webinar</h4>
                          <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                            <span className="flex items-center gap-1"><Calendar size={12}/> 2026-06-20</span>
                            <span className="flex items-center gap-1"><MapPin size={12}/> Virtual (BGC Office)</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 self-start md:self-auto w-full md:w-auto">
                          <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <Eye size={14}/> View Invoice
                          </button>
                          <button onClick={() => setBillingTab("make_payment")} className="bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/20">
                            <CircleDollarSign size={14}/> Pay Downpayment
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                          <span>Total Invoice:</span>
                          <span className="font-bold text-neutral-900 dark:text-white">₱20,000</span>
                        </div>
                        <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                          <div className="flex items-center gap-3">
                            <span>Downpayment (50%):</span>
                            <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Not Paid</span>
                          </div>
                          <span className="font-bold">₱10,000</span>
                        </div>
                        <div className="flex justify-between items-center text-neutral-500">
                          <div className="flex items-center gap-3">
                            <span>Balance Due (50%):</span>
                            <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Not Paid</span>
                          </div>
                          <span className="font-bold text-neutral-900 dark:text-white">₱10,000</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* SUB-TAB: MAKE PAYMENT (DOWNPAYMENT METHODS) */}
              {billingTab === "make_payment" && (
                <div className="animation-fade-in max-w-4xl">
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-950/30 text-red-600 rounded-lg flex items-center justify-center">
                      <QrCode size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-widest uppercase text-neutral-900 dark:text-white">Downpayment Methods</h3>
                      <p className="text-xs text-neutral-500">Pay your downpayment to secure your booking date. QR codes are linked to Livestream Manila's official accounts.</p>
                    </div>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button 
                      onClick={() => setPaymentMethod("gcash")} 
                      className={`flex-1 py-4 font-bold text-xs uppercase tracking-widest rounded-xl border transition-all ${paymentMethod === "gcash" ? "bg-[#ff0000] border-red-600 text-white shadow-lg shadow-red-900/20" : "bg-white dark:bg-[#121212] border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-600"}`}
                    >
                      GCash
                    </button>
                    <button 
                      onClick={() => setPaymentMethod("maya")} 
                      className={`flex-1 py-4 font-bold text-xs uppercase tracking-widest rounded-xl border transition-all ${paymentMethod === "maya" ? "bg-[#ff0000] border-red-600 text-white shadow-lg shadow-red-900/20" : "bg-white dark:bg-[#121212] border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-600"}`}
                    >
                      Maya
                    </button>
                    <button 
                      onClick={() => setPaymentMethod("bdo")} 
                      className={`flex-1 py-4 font-bold text-xs uppercase tracking-widest rounded-xl border transition-all ${paymentMethod === "bdo" ? "bg-[#ff0000] border-red-600 text-white shadow-lg shadow-red-900/20" : "bg-white dark:bg-[#121212] border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-600"}`}
                    >
                      BDO
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    
                    {/* Dynamic QR Code Box */}
                    <div className="bg-white dark:bg-white rounded-2xl p-6 flex flex-col items-center justify-center border-4 shadow-xl"
                         style={{ borderColor: paymentMethod === 'maya' ? '#10b981' : paymentMethod === 'bdo' ? '#dc2626' : '#2563eb' }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${paymentMethod.toUpperCase()}-Payment-LivestreamManila`} 
                        alt={`${paymentMethod} QR`} 
                        className="w-48 h-48 mb-4 mix-blend-multiply" 
                      />
                      <p className={`font-black uppercase tracking-widest text-sm ${paymentMethod === 'maya' ? 'text-emerald-500' : paymentMethod === 'bdo' ? 'text-red-600' : 'text-blue-600'}`}>
                        {paymentMethod}
                      </p>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Scan to pay</p>
                    </div>

                    {/* Account Details & Instructions */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Account Name</p>
                          <p className="text-sm font-black text-neutral-900 dark:text-white">
                            {paymentMethod === 'bdo' ? 'Livestream Manila Events' : 'Livestream Manila'}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                            {paymentMethod === 'bdo' ? 'Account Number' : 'Mobile Number'}
                          </p>
                          <p className="text-lg font-black text-neutral-900 dark:text-white tracking-widest">
                            {paymentMethod === 'bdo' ? '0040 8888 8012' : '0993 674 2673'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">How to pay</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                          {paymentMethod === 'bdo' 
                            ? "Transfer via BDO Online or branch. Account type: Savings. Include your booking ID in the remarks." 
                            : `Open ${paymentMethod === 'maya' ? 'Maya' : 'GCash'} → Pay → scan QR or enter mobile number. Add your booking name as payment note.`}
                        </p>
                      </div>

                      <div className="border border-red-200 dark:border-red-900/30 rounded-xl p-6 relative overflow-hidden bg-red-50/50 dark:bg-transparent">
                        <div className="absolute inset-0 bg-red-600/5 mix-blend-overlay pointer-events-none"></div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-4 relative z-10">Downpayment Minimums</p>
                        <div className="grid grid-cols-3 gap-3 relative z-10">
                          <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-center">
                            <p className="text-sm font-black text-neutral-900 dark:text-white">₱2,000</p>
                            <p className="text-[8px] font-bold uppercase text-neutral-500 tracking-widest mt-1">Livestream</p>
                          </div>
                          <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-center">
                            <p className="text-sm font-black text-neutral-900 dark:text-white">₱500</p>
                            <p className="text-[8px] font-bold uppercase text-neutral-500 tracking-widest mt-1">Projector</p>
                          </div>
                          <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-center">
                            <p className="text-sm font-black text-neutral-900 dark:text-white">₱1,500</p>
                            <p className="text-[8px] font-bold uppercase text-neutral-500 tracking-widest mt-1">Lights & Sounds</p>
                          </div>
                        </div>
                        <p className="text-[9px] text-neutral-500 mt-4 relative z-10">Downpayment is non-refundable once confirmed. Balance is due on the day of the event.</p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Form */}
                  <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-6">After Paying — Submit Proof</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-900 dark:text-white">Reference / Transaction No.</label>
                        <input type="text" placeholder="e.g. 1234567890" className="w-full bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors placeholder-neutral-400 dark:placeholder-neutral-600" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-900 dark:text-white">Upload Payment Screenshot</label>
                        <div className="w-full bg-transparent border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-red-600 dark:hover:border-red-600 rounded-xl px-4 py-3 flex items-center justify-center gap-2 cursor-pointer transition-colors text-neutral-500 dark:text-neutral-400">
                          <UploadCloud size={16} />
                          <span className="text-sm font-bold">Choose File</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-blue-900 hover:bg-blue-800 text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl transition-colors">
                      Submit Proof of Payment
                    </button>
                  </div>

                </div>
              )}

              {/* SUB-TAB: TRANSACTION HISTORY */}
              {billingTab === "history" && (
                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 animation-fade-in overflow-hidden">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-900 dark:text-white mb-2">Payment History</h3>
                  <p className="text-xs text-neutral-500 mb-8">All your payment transactions</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] uppercase tracking-widest text-neutral-500">
                          <th className="pb-4 font-bold">Date</th>
                          <th className="pb-4 font-bold">Event</th>
                          <th className="pb-4 font-bold">Type</th>
                          <th className="pb-4 font-bold">Method</th>
                          <th className="pb-4 font-bold">Reference</th>
                          <th className="pb-4 font-bold">Amount</th>
                          <th className="pb-4 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {/* Row 1 */}
                        <tr className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                          <td className="py-4 text-neutral-600 dark:text-neutral-400">May 25,<br/>2026</td>
                          <td className="py-4">
                            <p className="font-bold text-neutral-900 dark:text-white">Sarah & Mike Wedding</p>
                            <p className="text-[10px] text-neutral-500">BKG-002</p>
                          </td>
                          <td className="py-4"><span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold">Downpayment</span></td>
                          <td className="py-4 text-neutral-600 dark:text-neutral-400">GCash</td>
                          <td className="py-4 text-neutral-600 dark:text-neutral-400 font-mono text-[10px]">GCSH123456789</td>
                          <td className="py-4 font-bold text-neutral-900 dark:text-white">₱25,000</td>
                          <td className="py-4"><span className="flex items-center gap-1.5 text-emerald-500 font-bold"><CheckCircle2 size={12}/> Verified</span></td>
                        </tr>

                        {/* Row 2 */}
                        <tr className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                          <td className="py-4 text-neutral-600 dark:text-neutral-400">Jun 20,<br/>2026</td>
                          <td className="py-4">
                            <p className="font-bold text-neutral-900 dark:text-white">Sarah & Mike Wedding</p>
                            <p className="text-[10px] text-neutral-500">BKG-002</p>
                          </td>
                          <td className="py-4"><span className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-[10px] font-bold">Balance</span></td>
                          <td className="py-4 text-neutral-600 dark:text-neutral-400">Bank Transfer</td>
                          <td className="py-4 text-neutral-600 dark:text-neutral-400 font-mono text-[10px]">BD0987654321</td>
                          <td className="py-4 font-bold text-neutral-900 dark:text-white">₱25,000</td>
                          <td className="py-4"><span className="flex items-center gap-1.5 text-emerald-500 font-bold"><CheckCircle2 size={12}/> Verified</span></td>
                        </tr>

                        {/* Row 3 */}
                        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                          <td className="py-4 text-neutral-600 dark:text-neutral-400">Jun 6,<br/>2026</td>
                          <td className="py-4">
                            <p className="font-bold text-neutral-900 dark:text-white">Tech Summit 2026</p>
                            <p className="text-[10px] text-neutral-500">BKG-001</p>
                          </td>
                          <td className="py-4"><span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold">Downpayment</span></td>
                          <td className="py-4 text-neutral-600 dark:text-neutral-400">Maya</td>
                          <td className="py-4 text-neutral-600 dark:text-neutral-400 font-mono text-[10px]">MAYA456123789</td>
                          <td className="py-4 font-bold text-neutral-900 dark:text-white">₱49,000</td>
                          <td className="py-4"><span className="flex items-center gap-1.5 text-amber-500 font-bold"><Clock size={12}/> Verifying</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}
          {/* MY PROFILE TAB CONTENT */}
          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto animation-fade-in relative pb-20">
              
              <div className="mb-8">
                <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-neutral-900 dark:text-white">My Profile</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage your personal information and account settings.</p>
              </div>

              {/* Profile Header Card */}
              <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 transition-colors shadow-sm dark:shadow-none">
                
                {/* Avatar with Camera Badge */}
                <div className="relative">
                  <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-center shadow-inner">
                    <span className="text-3xl font-black text-red-600">JM</span>
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-[#ff0000] text-white p-2 rounded-lg border-2 border-white dark:border-[#121212] hover:bg-red-700 transition-colors">
                    <Camera size={14} />
                  </button>
                </div>

                {/* User Info & Badges */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl font-black text-neutral-900 dark:text-white mb-1">Joash G. Marasigan</h2>
                  <p className="text-xs text-neutral-500 mb-1">BSIT 3-1N Student - PUP Manila</p>
                  <p className="text-xs text-neutral-400 mb-4">joash@streamsync.com</p>
                  
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="bg-red-500/10 border border-red-500/20 text-red-600 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Client</span>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Active</span>
                  </div>
                </div>

                <p className="text-[9px] text-neutral-400 md:self-end text-center md:text-right max-w-[200px]">
                  Click the camera icon to upload a new profile photo. JPG, PNG or WEBP — max 5 MB.
                </p>
              </div>

              {/* Profile Sub-Navigation */}
              <div className="flex items-center gap-8 border-b border-neutral-200 dark:border-neutral-800 mb-8 px-2">
                <button 
                  onClick={() => setProfileTab("personal")}
                  className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider transition-colors ${profileTab === "personal" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
                >
                  Personal Info
                </button>
                <button 
                  onClick={() => setProfileTab("security")}
                  className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider transition-colors ${profileTab === "security" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
                >
                  Password & Security
                </button>
              </div>

              {/* SUB-TAB: PERSONAL INFO */}
              {profileTab === "personal" && (
                <div className="animation-fade-in space-y-6">
                  
                  {/* Basic Information */}
                  <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
                    <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-white mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                      <UserIcon size={16} className="text-red-600"/> Basic Information
                    </h3>
                    
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">First Name</label>
                          <input type="text" defaultValue="Joash G." className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Last Name</label>
                          <input type="text" defaultValue="Marasigan" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1"><Mail size={12}/> Email Address</label>
                          <input type="email" defaultValue="joash@streamsync.com" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1"><Phone size={12}/> Phone Number</label>
                          <input type="tel" defaultValue="+63 912 345 6789" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1"><Briefcase size={12}/> Company / Organization</label>
                          <input type="text" defaultValue="PUP Manila" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Job Title / Role</label>
                          <input type="text" defaultValue="BSIT 3-1N Student" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Short Bio</label>
                        <textarea rows="3" placeholder="Tell us a little about yourself or your events business..." className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors resize-none"></textarea>
                      </div>
                    </form>
                  </div>

                  {/* Address */}
                  <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
                    <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-white mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                      <MapPin size={16} className="text-red-600"/> Address
                    </h3>
                    
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Street Address</label>
                        <input type="text" defaultValue="123 Rizal Avenue, Makati" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">City</label>
                          <input type="text" defaultValue="Makati City" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Country</label>
                          <input type="text" defaultValue="Philippines" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Online Presence */}
                  <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
                    <div className="flex items-center justify-between mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                      <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-white">
                        <Globe size={16} className="text-red-600"/> Online Presence
                      </h3>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Optional</span>
                    </div>
                    
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1"><Globe size={12}/> Website</label>
                          <input type="url" placeholder="https://yourwebsite.com" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Facebook</label>
                          <input type="text" placeholder="facebook.com/yourpage" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Instagram</label>
                          <input type="text" placeholder="@yourhandle" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Save Changes Floating Action */}
                  <div className="flex justify-end mt-8">
                    <button className="bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-3.5 px-8 rounded-xl transition-colors shadow-lg shadow-red-900/20 flex items-center gap-2">
                      <Save size={16} /> Save Changes
                    </button>
                  </div>

                </div>
              )}

              {/* SUB-TAB: PASSWORD & SECURITY */}
              {profileTab === "security" && (
                <div className="animation-fade-in space-y-6">
                  
                  {/* Change Password */}
                  <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
                    <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-white mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                      <Lock size={16} className="text-red-600"/> Change Password
                    </h3>
                    
                    <form className="space-y-6 max-w-lg">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Current Password</label>
                        <div className="relative">
                          <input type="password" placeholder="Enter current password" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">New Password</label>
                        <div className="relative">
                          <input type="password" placeholder="At least 8 characters" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Confirm New Password</label>
                        <div className="relative">
                          <input type="password" placeholder="Repeat new password" className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" />
                          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>

                      <button type="button" className="bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-3.5 px-8 rounded-xl transition-colors w-full sm:w-auto mt-2">
                        Update Password
                      </button>
                    </form>
                  </div>

                  {/* Account Details */}
                  <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
                    <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-white mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                      <UserIcon size={16} className="text-red-600"/> Account Details
                    </h3>
                    
                    <div className="space-y-0">
                      <div className="flex justify-between items-center py-4 border-b border-neutral-100 dark:border-neutral-800/50">
                        <span className="text-sm text-neutral-500">Account Type</span>
                        <span className="text-sm font-bold text-red-600">Client</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-neutral-100 dark:border-neutral-800/50">
                        <span className="text-sm text-neutral-500">Member Since</span>
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">January 2026</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-neutral-100 dark:border-neutral-800/50">
                        <span className="text-sm text-neutral-500">Last Login</span>
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">Today, 9:41 AM</span>
                      </div>
                      <div className="flex justify-between items-center pt-4">
                        <span className="text-sm text-neutral-500">Account Status</span>
                        <span className="text-sm font-bold text-emerald-500">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-transparent rounded-2xl p-6 md:p-8 transition-colors">
                    <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-red-600 mb-4 border-b border-red-200 dark:border-red-900/30 pb-4">
                      <AlertCircle size={16} /> Danger Zone
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Delete Account</h4>
                        <p className="text-xs text-neutral-500 mt-1">Permanently remove your account and all associated data.</p>
                      </div>
                      <button className="bg-transparent hover:bg-red-600 text-red-600 hover:text-white border border-red-600 text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors self-start sm:self-auto">
                        Delete
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>

        {/* Floating Chat Button (Scoped to Main Area) */}
        <button className="absolute bottom-8 right-8 bg-[#ff0000] hover:bg-red-700 text-white p-4 rounded-full shadow-lg z-50 transition-colors">
          <MessageSquare size={24} />
        </button>

      </main>
    </div>
  );
};

export default ClientDashboard;