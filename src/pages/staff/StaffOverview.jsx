import React from "react";
import { Calendar, Clock, CheckSquare, QrCode, MapPin, AlertCircle, ChevronRight } from "lucide-react";

const StaffOverview = ({ setActiveTab }) => {
  return (
    <div className="max-w-6xl mx-auto animation-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-wide mb-2 text-neutral-900 dark:text-white">Staff Overview</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Welcome back, Joash. Here's your schedule and tasks.</p>
        </div>
        <button className="bg-[#ff0000] hover:bg-red-700 text-white font-bold text-sm tracking-wider py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-colors">
          <QrCode size={18} /> Scan Check-in QR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
          <Calendar size={80} className="absolute -bottom-4 -right-4 text-neutral-100 dark:text-neutral-800/50" />
          <p className="text-xs font-bold text-neutral-500 mb-1 relative z-10">Upcoming Events</p>
          <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-2 relative z-10">4</h2>
          <p className="text-[10px] font-bold text-red-500 relative z-10">Next event in 5 days</p>
        </div>

        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
          <Clock size={80} className="absolute -bottom-4 -right-4 text-neutral-100 dark:text-neutral-800/50" />
          <p className="text-xs font-bold text-neutral-500 mb-1 relative z-10">Hours Logged</p>
          <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-2 relative z-10">128.5</h2>
          <p className="text-[10px] font-bold text-emerald-500 relative z-10">+12.5 hrs this week</p>
        </div>

        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
          <CheckSquare size={80} className="absolute -bottom-4 -right-4 text-neutral-100 dark:text-neutral-800/50" />
          <p className="text-xs font-bold text-neutral-500 mb-1 relative z-10">Pending Tasks</p>
          <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-2 relative z-10">2</h2>
          <p className="text-[10px] font-bold text-amber-500 relative z-10">1 high priority task</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold tracking-widest text-neutral-900 dark:text-white">Next Deployment</h3>
            <span className="bg-red-500/10 text-red-600 border border-red-500/20 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Upcoming</span>
          </div>

          <h2 className="text-xl font-black text-neutral-900 dark:text-white mb-6">Tech Innovators Summit 2026</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center shrink-0">
                <Calendar size={18} className="text-neutral-500 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 mb-1">Date</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">2026-05-25</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-neutral-500 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 mb-1">Location</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">SMX Convention Center,<br/>Manila</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-neutral-500 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 mb-1">Time</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">08:00 AM - 05:00 PM</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center shrink-0">
                <AlertCircle size={18} className="text-neutral-500 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 mb-1">Assigned Role</p>
                <p className="text-sm font-bold text-red-600">Camera Operator</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-blue-900/40 hover:bg-blue-900/60 text-blue-400 border border-blue-900/50 font-bold text-xs py-3 rounded-xl transition-colors">
              View Equipment Checklist
            </button>
            <button className="flex-1 bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 font-bold text-xs py-3 rounded-xl transition-colors">
              Contact Event Manager
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => setActiveTab("scheduling")} className="w-full flex items-center justify-between p-4 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-red-600/50 transition-colors group">
                <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
                  <Calendar size={16} />
                  <span className="text-xs font-bold">Update Availability</span>
                </div>
                <ChevronRight size={16} className="text-neutral-500 group-hover:text-red-600 transition-colors" />
              </button>
              <button onClick={() => setActiveTab("maintenance")} className="w-full flex items-center justify-between p-4 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-red-600/50 transition-colors group">
                <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
                  <CheckSquare size={16} />
                  <span className="text-xs font-bold">Equipment Checklist</span>
                </div>
                <ChevronRight size={16} className="text-neutral-500 group-hover:text-red-600 transition-colors" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">Tasks</h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-neutral-700 bg-black accent-red-600 focus:ring-red-600 focus:ring-offset-neutral-900" />
                <div>
                  <p className="text-xs text-neutral-300 group-hover:text-white transition-colors">Equipment check for Wedding coverage</p>
                  <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-1">High Priority</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded border-neutral-700 bg-black accent-red-600 focus:ring-red-600 focus:ring-offset-neutral-900" />
                <div>
                  <p className="text-xs text-neutral-500 line-through">Submit availability for June</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-neutral-700 bg-black accent-red-600 focus:ring-red-600 focus:ring-offset-neutral-900" />
                <div>
                  <p className="text-xs text-neutral-300 group-hover:text-white transition-colors">Review new multi-cam setup guide</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffOverview;