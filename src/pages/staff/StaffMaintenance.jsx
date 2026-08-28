import React, { useState } from "react";
import { AlertTriangle, Calendar, Clock, CheckCircle2, Wrench, Search, Filter, ClipboardList, User as UserIcon } from "lucide-react";

const StaffMaintenance = () => {
  const [subTab, setSubTab] = useState("my_completed");

  return (
    <div className="max-w-6xl mx-auto animation-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-neutral-900 dark:text-white">Equipment Maintenance</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Your assigned maintenance tasks and repair history</p>
        </div>
        <button className="bg-[#ff0000] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-colors shrink-0">
          <AlertTriangle size={16} /> Flag Equipment Issue
        </button>
      </div>

      {/* Top Stat Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#121212] border border-red-900/30 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={20} className="text-red-600"/>
            <h2 className="text-3xl font-black text-white leading-none">1</h2>
          </div>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Flagged Issues</p>
        </div>
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={20} className="text-amber-500"/>
            <h2 className="text-3xl font-black text-white leading-none">2</h2>
          </div>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Scheduled</p>
        </div>
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-blue-500"/>
            <h2 className="text-3xl font-black text-white leading-none">0</h2>
          </div>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">In Progress</p>
        </div>
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 size={20} className="text-emerald-500"/>
            <h2 className="text-3xl font-black text-white leading-none">1</h2>
          </div>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Completed</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 md:p-10">
        
        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-neutral-800 mb-8 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setSubTab("action_queue")}
            className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 whitespace-nowrap ${subTab === "action_queue" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-white"}`}
          >
            <AlertTriangle size={14}/> Action Queue
          </button>
          <button 
            onClick={() => setSubTab("my_tasks")}
            className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 whitespace-nowrap ${subTab === "my_tasks" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-white"}`}
          >
            <Wrench size={14}/> My Tasks
          </button>
          <button 
            onClick={() => setSubTab("my_completed")}
            className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 whitespace-nowrap ${subTab === "my_completed" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-white"}`}
          >
            <CheckCircle2 size={14}/> My Completed
          </button>
          <button 
            onClick={() => setSubTab("logs")}
            className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 whitespace-nowrap ${subTab === "logs" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-white"}`}
          >
            <ClipboardList size={14}/> Maintenance Logs
          </button>
        </div>

        {/* Dynamic Search & Filters depending on Tab */}
        {(subTab === "action_queue" || subTab === "my_tasks") && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input type="text" placeholder="Search equipment..." className="w-full bg-black border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-red-600 focus:outline-none transition-colors" />
            </div>
            <button className="bg-transparent border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white text-xs font-bold tracking-wider py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0">
              <Filter size={16} /> Filter
            </button>
          </div>
        )}

        {subTab === "logs" && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input type="text" placeholder="Search maintenance logs..." className="w-full bg-black border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-red-600 focus:outline-none transition-colors" />
            </div>
          </div>
        )}

        {/* SUB-TAB: ACTION QUEUE */}
        {subTab === "action_queue" && (
          <div className="space-y-4 animation-fade-in">
            {/* Task 1 */}
            <div className="border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900/30 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">Cameras (Unit 3)</h3>
                    <span className="bg-red-950/40 text-red-500 border border-red-900/50 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">High Priority</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    <span className="flex items-center gap-1"><AlertTriangle size={12} className="text-orange-500"/> Post-Event Log</span>
                    <span>•</span>
                    <span className="text-blue-500">In Progress</span>
                  </div>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 self-start md:self-auto">
                  <CheckCircle2 size={14}/> Complete Work
                </button>
              </div>

              <div className="bg-black border border-neutral-800 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Reported Issue:</p>
                  <p className="text-sm text-neutral-300">Staff reported: Lens scratch / focus ring stuck</p>
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-1.5 hover:text-red-500 self-start md:self-auto">
                  <AlertTriangle size={12}/> View Evidence
                </button>
              </div>

              <div className="flex items-center gap-6 text-[10px] text-neutral-500">
                <span className="flex items-center gap-1.5"><Calendar size={12}/> 2026-06-05</span>
                <span className="flex items-center gap-1.5"><UserIcon size={12}/> Charles</span>
              </div>
            </div>

            {/* Task 2 */}
            <div className="border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900/30 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">Switcher (Unit 1)</h3>
                    <span className="bg-amber-950/40 text-amber-500 border border-amber-900/50 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Medium Priority</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    <span className="flex items-center gap-1 text-orange-500"><AlertTriangle size={12}/> Usage Threshold</span>
                    <span>•</span>
                    <span className="text-neutral-400">Scheduled</span>
                  </div>
                </div>
                <span className="text-[10px] italic text-neutral-500 self-start md:self-auto pt-2">Assigned to Victor</span>
              </div>

              <div className="bg-black border border-neutral-800 rounded-xl p-4 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Reported Issue:</p>
                <p className="text-sm text-neutral-300">Reached 10 deployments. Routine checkup required.</p>
              </div>

              <div className="flex items-center gap-6 text-[10px] text-neutral-500">
                <span className="flex items-center gap-1.5"><Calendar size={12}/> 2026-06-08</span>
                <span className="flex items-center gap-1.5"><UserIcon size={12}/> Victor</span>
              </div>
            </div>

            {/* Task 3 */}
            <div className="border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900/30 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">DM3 Audio Mixer</h3>
                    <span className="bg-amber-950/40 text-amber-500 border border-amber-900/50 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Medium Priority</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    <span className="flex items-center gap-1 text-orange-500"><AlertTriangle size={12}/> Usage Threshold</span>
                    <span>•</span>
                    <span className="text-amber-500">Awaiting Schedule</span>
                  </div>
                </div>
                <span className="text-[10px] italic text-neutral-500 self-start md:self-auto pt-2">Not yet assigned</span>
              </div>

              <div className="bg-black border border-neutral-800 rounded-xl p-4 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Reported Issue:</p>
                <p className="text-sm text-neutral-300">Reached 5 deployments. Audio calibration needed.</p>
              </div>
            </div>

            {/* Task 4 */}
            <div className="border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900/30 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">HDMI Cables (Set)</h3>
                    <span className="bg-blue-950/40 text-blue-400 border border-blue-900/50 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Low Priority</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    <span className="flex items-center gap-1 text-orange-500"><AlertTriangle size={12}/> Manual</span>
                    <span>•</span>
                    <span className="text-neutral-400">Scheduled</span>
                  </div>
                </div>
                <span className="text-[10px] italic text-neutral-500 self-start md:self-auto pt-2">Assigned to Maintenance Team</span>
              </div>

              <div className="bg-black border border-neutral-800 rounded-xl p-4 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Reported Issue:</p>
                <p className="text-sm text-neutral-300">Fraying on 3 cables reported previously.</p>
              </div>

              <div className="flex items-center gap-6 text-[10px] text-neutral-500">
                <span className="flex items-center gap-1.5"><Calendar size={12}/> 2026-06-10</span>
                <span className="flex items-center gap-1.5"><UserIcon size={12}/> Maintenance Team</span>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB: MY TASKS */}
        {subTab === "my_tasks" && (
          <div className="space-y-4 animation-fade-in">
            <div className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/20">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">Cameras (Unit 3)</h3>
                    <span className="bg-red-950/40 text-red-500 border border-red-900/50 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">High Priority</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    <span className="flex items-center gap-1"><AlertTriangle size={12} className="text-orange-500"/> Post-Event Log</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-blue-500"><Wrench size={10}/> Working on it</span>
                  </div>
                </div>
              </div>

              <div className="bg-black border border-neutral-800 rounded-xl p-4 md:p-6 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Issue Description:</p>
                  <p className="text-sm text-neutral-300 mb-2">Staff reported: Lens scratch / focus ring stuck</p>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-1.5 hover:text-red-500">
                    <AlertTriangle size={12}/> View Photo Evidence
                  </button>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider py-3 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 self-start md:self-auto shadow-lg shadow-emerald-900/20">
                  <CheckCircle2 size={16}/> Mark Complete
                </button>
              </div>

              <div className="flex items-center gap-6 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5 text-red-500"><Calendar size={12}/> Scheduled: 2026-06-05</span>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB: MY COMPLETED */}
        {subTab === "my_completed" && (
          <div className="space-y-4 animation-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b border-neutral-800 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    <th className="pb-4 font-bold">Equipment</th>
                    <th className="pb-4 font-bold">Completed Date</th>
                    <th className="pb-4 font-bold">Issue</th>
                    <th className="pb-4 font-bold">Resolution</th>
                    <th className="pb-4 font-bold">New Condition</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  <tr className="border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors">
                    <td className="py-4 font-bold text-white">Cameras (Unit 3)</td>
                    <td className="py-4 text-neutral-400">2026-06-05</td>
                    <td className="py-4 text-neutral-400">Post-Event Log</td>
                    <td className="py-4 text-neutral-400">Replaced the lens</td>
                    <td className="py-4">
                      <span className="bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">Excellent</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB: MAINTENANCE LOGS */}
        {subTab === "logs" && (
          <div className="space-y-4 animation-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b border-neutral-800 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    <th className="pb-4 font-bold">Equipment</th>
                    <th className="pb-4 font-bold">Trigger</th>
                    <th className="pb-4 font-bold">Resolution</th>
                    <th className="pb-4 font-bold">Technician</th>
                    <th className="pb-4 font-bold">New Condition</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  <tr className="border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors">
                    <td className="py-4 font-bold text-white">LED Bar (Unit 5)</td>
                    <td className="py-4 text-neutral-400">Post-Event Log</td>
                    <td className="py-4 text-neutral-400 max-w-[300px]">Replaced LED driver board. All color channels now functioning properly.</td>
                    <td className="py-4 text-neutral-400">Jose Reyes</td>
                    <td className="py-4">
                      <span className="border border-emerald-500 text-emerald-500 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">Good</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StaffMaintenance;