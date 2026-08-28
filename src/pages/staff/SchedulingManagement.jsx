import React, { useState } from "react";
import { Calendar, CalendarOff, AlertTriangle, Clock, MapPin, Users, CheckSquare } from "lucide-react";

const SchedulingManagement = () => {
  const [subTab, setSubTab] = useState("set_availability");

  const scheduleDays = [
    { day: "Monday", date: "Jun 12", morn: true, aft: true, eve: false, note: "" },
    { day: "Tuesday", date: "Jun 13", morn: false, aft: true, eve: true, note: "" },
    { day: "Wednesday", date: "Jun 14", morn: true, aft: true, eve: true, note: "" },
    { day: "Thursday", date: "Jun 15", morn: false, aft: false, eve: false, conflict: "TECH SUMMIT" },
    { day: "Friday", date: "Jun 16", morn: true, aft: false, eve: true, note: "" },
    { day: "Saturday", date: "Jun 17", morn: false, aft: false, eve: false, note: "" },
    { day: "Sunday", date: "Jun 18", morn: false, aft: false, eve: false, conflict: "CORPORATE WEBINAR" },
  ];

  return (
    <div className="max-w-5xl mx-auto animation-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-black tracking-wide uppercase text-neutral-900 dark:text-white">Availability Manager</h1>
        <div className="flex bg-[#121212] border border-neutral-800 rounded-lg p-1">
          <button 
            onClick={() => setSubTab("set_availability")}
            className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${subTab === "set_availability" ? "bg-[#ff0000] text-white" : "text-neutral-500 hover:text-white"}`}
          >
            Set Availability
          </button>
          <button 
            onClick={() => setSubTab("my_assignments")}
            className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${subTab === "my_assignments" ? "bg-[#ff0000] text-white" : "text-neutral-500 hover:text-white"}`}
          >
            My Assignments
          </button>
        </div>
      </div>

      {subTab === "set_availability" && (
        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-800">
            <div>
              <h2 className="text-lg font-bold text-white tracking-widest uppercase mb-1">Next 7 Days</h2>
              <p className="text-xs text-neutral-500">Select your available time slots for upcoming shifts.</p>
            </div>
            <button className="bg-[#ff0000] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-full transition-colors self-start sm:self-auto">
              Save Changes
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800">
                  <th className="pb-4 pl-4">Date / Day</th>
                  <th className="pb-4 text-center">Morning<br/><span className="text-[8px] font-normal lowercase">(6AM - 12PM)</span></th>
                  <th className="pb-4 text-center">Afternoon<br/><span className="text-[8px] font-normal lowercase">(12PM - 6PM)</span></th>
                  <th className="pb-4 text-center">Evening<br/><span className="text-[8px] font-normal lowercase">(6PM - 12AM)</span></th>
                  <th className="pb-4 text-right pr-4">Notes / Conflicts</th>
                </tr>
              </thead>
              <tbody>
                {scheduleDays.map((row, i) => (
                  <tr key={i} className="border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors">
                    <td className="py-4 pl-4">
                      <p className="text-sm font-bold text-white">{row.day}</p>
                      <p className="text-[10px] text-neutral-500">{row.date}</p>
                    </td>
                    <td className="py-4 text-center">
                      <button className={`p-2 rounded-lg inline-flex items-center justify-center transition-colors ${row.conflict ? 'bg-neutral-900/50 text-neutral-700 cursor-not-allowed' : row.morn ? 'bg-red-600 text-white' : 'border border-neutral-800 text-neutral-700 hover:border-neutral-600'}`}>
                        {row.conflict ? <CalendarOff size={16}/> : <Calendar size={16}/>}
                      </button>
                    </td>
                    <td className="py-4 text-center">
                      <button className={`p-2 rounded-lg inline-flex items-center justify-center transition-colors ${row.conflict ? 'bg-neutral-900/50 text-neutral-700 cursor-not-allowed' : row.aft ? 'bg-red-600 text-white' : 'border border-neutral-800 text-neutral-700 hover:border-neutral-600'}`}>
                        {row.conflict ? <CalendarOff size={16}/> : <Calendar size={16}/>}
                      </button>
                    </td>
                    <td className="py-4 text-center">
                      <button className={`p-2 rounded-lg inline-flex items-center justify-center transition-colors ${row.conflict ? 'bg-neutral-900/50 text-neutral-700 cursor-not-allowed' : row.eve ? 'bg-red-600 text-white' : 'border border-neutral-800 text-neutral-700 hover:border-neutral-600'}`}>
                        {row.conflict ? <CalendarOff size={16}/> : <Calendar size={16}/>}
                      </button>
                    </td>
                    <td className="py-4 text-right pr-4">
                      {row.conflict ? (
                        <span className="text-[9px] font-bold text-amber-500 border border-amber-900/50 bg-amber-950/20 px-2 py-1 rounded uppercase tracking-wider">{row.conflict}</span>
                      ) : (
                        <span className="text-neutral-700">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle size={16} className="text-neutral-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Days with <span className="text-amber-500 font-bold">highlighted tags</span> indicate that you have an assigned shift that conflicts with updating your general availability. Please contact the Admin to reschedule.
            </p>
          </div>
        </div>
      )}

      {subTab === "my_assignments" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">This Week</p>
              <h3 className="text-3xl font-black text-white mb-1">3</h3>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Assignments</p>
            </div>
            <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">Acknowledged</p>
              <h3 className="text-3xl font-black text-white mb-1">2</h3>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Active</p>
            </div>
            <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 border-t-4 border-t-amber-500">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-2">Pending</p>
              <h3 className="text-3xl font-black text-white mb-1">1</h3>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Need Action</p>
            </div>
            <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 border-t-4 border-t-orange-600">
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-2 flex items-center gap-1"><AlertTriangle size={10}/> Emergency</p>
              <h3 className="text-3xl font-black text-white mb-1">0</h3>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Backup Assigned</p>
            </div>
          </div>

          {/* Assignment 1 */}
          <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 border-b border-neutral-800 pb-6">
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-2">Tech Summit 2026</h3>
                <span className="bg-red-950/40 border border-red-900/50 text-red-500 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Camera Operator</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 border border-red-900/50 bg-red-950/20 px-3 py-1.5 rounded flex items-center gap-1.5 self-start">
                <CheckSquare size={12}/> Acknowledged
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-red-600" />
                  <span className="text-sm text-neutral-300">Monday, June 15, 2026</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-red-600" />
                  <span className="text-sm text-neutral-300">SMX Convention Center</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-red-600" />
                  <span className="text-sm text-neutral-300">09:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-red-600" />
                  <span className="text-sm text-neutral-300">3 team members</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Team:</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Charles</span>
                <span className="bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Geneth</span>
                <span className="bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Victor</span>
              </div>
            </div>

            <button className="w-full bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-600/30 text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              <AlertTriangle size={14}/> Declare Emergency
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingManagement;