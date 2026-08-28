import React from "react";
import { 
  CalendarDays, CheckCircle2, Clock, ArrowRight, 
  Calendar, Video, FileText, CalendarPlus, CreditCard 
} from "lucide-react";

const ClientOverview = ({ setActiveTab }) => {
  return (
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
  );
};

export default ClientOverview;