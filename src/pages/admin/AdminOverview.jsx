import React, { useState, useEffect } from "react";
import { 
  Clock, Users, DollarSign, AlertTriangle, 
  AlertCircle, CheckCircle2, ChevronRight 
} from "lucide-react";

const AdminOverview = ({ setActiveTab }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock updater
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="max-w-7xl mx-auto animation-fade-in">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-neutral-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">System overview and critical alerts.</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Current Time</p>
          <p className="text-xl font-bold text-neutral-900 dark:text-white tracking-wider">{formattedTime}</p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        
        {/* Metric 1: Pending Bookings */}
        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-center gap-5 transition-colors">
          <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-neutral-900 dark:text-white leading-none mb-1">12</h2>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-tight">Pending<br/>Bookings</p>
          </div>
        </div>

        {/* Metric 2: Active Staff */}
        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-center gap-5 transition-colors">
          <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-neutral-900 dark:text-white leading-none mb-1">45</h2>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-tight">Active<br/>Staff</p>
          </div>
        </div>

        {/* Metric 3: Monthly Revenue */}
        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-center gap-5 transition-colors">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-neutral-900 dark:text-white leading-none mb-1">₱450K</h2>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-tight">Monthly<br/>Revenue</p>
          </div>
        </div>

        {/* Metric 4: Equipment Alerts */}
        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-center gap-5 transition-colors">
          <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-neutral-900 dark:text-white leading-none mb-1">3</h2>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-tight">Equipment<br/>Alerts</p>
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Bookings */}
        <div className="xl:col-span-2 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-900 dark:text-white">Recent Bookings</h3>
            <button 
              onClick={() => setActiveTab("bookings")}
              className="text-xs font-bold text-red-600 hover:text-red-500 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] uppercase tracking-widest text-neutral-500">
                  <th className="pb-4 font-bold">Booking ID</th>
                  <th className="pb-4 font-bold">Client</th>
                  <th className="pb-4 font-bold">Event</th>
                  <th className="pb-4 font-bold">Date</th>
                  <th className="pb-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                
                <tr className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="py-4 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">BK-2026-<br/>045</td>
                  <td className="py-4 font-bold text-neutral-900 dark:text-white">Tech Corp Inc.</td>
                  <td className="py-4 text-neutral-600 dark:text-neutral-400 text-xs">Annual Conference</td>
                  <td className="py-4 text-neutral-600 dark:text-neutral-400 text-xs">Sep 10, 2026</td>
                  <td className="py-4 text-right">
                    <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block">
                      Pending
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="py-4 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">BK-2026-<br/>044</td>
                  <td className="py-4 font-bold text-neutral-900 dark:text-white">Maria Santos</td>
                  <td className="py-4 text-neutral-600 dark:text-neutral-400 text-xs">Wedding Livestream</td>
                  <td className="py-4 text-neutral-600 dark:text-neutral-400 text-xs">Aug 25, 2026</td>
                  <td className="py-4 text-right">
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block">
                      Confirmed
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="py-4 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">BK-2026-<br/>043</td>
                  <td className="py-4 font-bold text-neutral-900 dark:text-white">Global E-<br/>sports</td>
                  <td className="py-4 text-neutral-600 dark:text-neutral-400 text-xs">Gaming Tournament</td>
                  <td className="py-4 text-neutral-600 dark:text-neutral-400 text-xs">Aug 18, 2026</td>
                  <td className="py-4 text-right">
                    <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block">
                      In Progress
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: System Alerts & Quick Links */}
        <div className="space-y-6">
          
          {/* System Alerts */}
          <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors h-full flex flex-col">
            <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              System Alerts
            </h3>

            <div className="space-y-6 flex-1">
              
              {/* Alert 1 */}
              <div className="flex gap-4">
                <div className="mt-1">
                  <AlertTriangle size={16} className="text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Inventory</h4>
                    <span className="text-[10px] text-neutral-500">2 hours ago</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Sony A7S III (Camera 3) needs scheduled maintenance.
                  </p>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="flex gap-4">
                <div className="mt-1">
                  <AlertTriangle size={16} className="text-red-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Staff</h4>
                    <span className="text-[10px] text-neutral-500">5 hours ago</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    2 staff members called in sick for tomorrow's event.
                  </p>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="flex gap-4">
                <div className="mt-1">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">System</h4>
                    <span className="text-[10px] text-neutral-500">1 day ago</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    System backup completed successfully.
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Links Footer inside Alerts Box */}
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">Quick Links</h4>
              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveTab("staff")}
                  className="flex-1 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-300 text-xs font-bold py-2.5 rounded-lg transition-colors"
                >
                  Assign Staff
                </button>
                <button 
                  onClick={() => setActiveTab("inventory")}
                  className="flex-1 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-300 text-xs font-bold py-2.5 rounded-lg transition-colors"
                >
                  Update Gear
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverview;