import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";

const MyBookings = () => {
  return (
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
  );
};

export default MyBookings;