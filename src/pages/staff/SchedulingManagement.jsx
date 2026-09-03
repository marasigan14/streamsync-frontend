import React, { useState } from "react";
import {
  Calendar,
  CalendarOff,
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  CheckSquare,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";

const SchedulingManagement = () => {
  const [subTab, setSubTab] = useState("set_availability"); // "set_availability" | "my_assignments"
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [emergencyModalAssignment, setEmergencyModalAssignment] = useState(null);
  const [emergencyReason, setEmergencyReason] = useState("");

  // 7-day schedule grid state
  const [scheduleDays, setScheduleDays] = useState([
    { day: "Monday", date: "Jun 12", morn: true, aft: true, eve: false, conflict: null },
    { day: "Tuesday", date: "Jun 13", morn: false, aft: true, eve: true, conflict: null },
    { day: "Wednesday", date: "Jun 14", morn: true, aft: true, eve: true, conflict: null },
    { day: "Thursday", date: "Jun 15", morn: false, aft: false, eve: false, conflict: "TECH SUMMIT" },
    { day: "Friday", date: "Jun 16", morn: true, aft: false, eve: true, conflict: null },
    { day: "Saturday", date: "Jun 17", morn: false, aft: false, eve: false, conflict: null },
    { day: "Sunday", date: "Jun 18", morn: false, aft: false, eve: false, conflict: "CORPORATE WEBINAR" },
  ]);

  // Assignments state matching image_e74f43.jpg
  const [assignments, setAssignments] = useState([
    {
      id: "asg-1",
      title: "TECH SUMMIT 2026",
      role: "CAMERA OPERATOR",
      status: "acknowledged", // "acknowledged" | "pending"
      date: "Monday, June 15, 2026",
      time: "09:00 AM - 6:00 PM",
      location: "SMX Convention Center",
      teamCount: 3,
      team: ["JOHN DOE", "JANE SMITH", "MIKE JOHNSON"],
    },
    {
      id: "asg-2",
      title: "CORPORATE WEBINAR",
      role: "TECHNICAL DIRECTOR",
      status: "acknowledged",
      date: "Thursday, June 18, 2026",
      time: "2:00 PM - 4:00 PM",
      location: "Virtual",
      teamCount: 2,
      team: ["YOU", "SARAH LEE"],
    },
    {
      id: "asg-3",
      title: "PRODUCT LAUNCH",
      role: "AUDIO ENGINEER",
      status: "pending",
      date: "Monday, June 22, 2026",
      time: "7:00 PM - 11:00 PM",
      location: "BGC Arts Center",
      teamCount: 3,
      team: ["YOU", "CARLOS REYES", "ANNA CRUZ"],
    },
  ]);

  // Toggle availability slot
  const toggleSlot = (index, slotKey) => {
    if (scheduleDays[index].conflict) return; // Ignore locked days
    setScheduleDays((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [slotKey]: !item[slotKey] } : item
      )
    );
  };

  const handleSaveAvailability = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Acknowledge Assignment Handler
  const handleAcknowledge = (id) => {
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "acknowledged" } : item
      )
    );
  };

  // Submit Emergency Declaration
  const handleConfirmEmergency = () => {
    if (!emergencyModalAssignment) return;
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === emergencyModalAssignment.id
          ? { ...item, emergencyDeclared: true }
          : item
      )
    );
    setEmergencyModalAssignment(null);
    setEmergencyReason("");
  };

  // Metric computations
  const totalCount = assignments.length;
  const acknowledgedCount = assignments.filter((a) => a.status === "acknowledged").length;
  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const emergencyCount = assignments.filter((a) => a.emergencyDeclared).length;

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-white">
            Availability Manager
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0f121a] border border-[#1b212f] rounded-2xl p-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSubTab("set_availability")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              subTab === "set_availability"
                ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Set Availability
          </button>
          <button
            type="button"
            onClick={() => setSubTab("my_assignments")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              subTab === "my_assignments"
                ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            My Assignments
          </button>
        </div>
      </div>

      {/* Save Toast Notification */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-[#0b2419] border border-[#14532d] text-[#22c55e] flex items-center gap-3 text-xs animate-in fade-in duration-200">
          <CheckCircle2 size={16} />
          <span>Availability schedule saved successfully!</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. SUB-TAB: SET AVAILABILITY (Image e74f24.jpg)                 */}
      {/* ============================================================== */}
      {subTab === "set_availability" && (
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b212f] pb-5">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Next 7 Days
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Select your available time slots for upcoming shifts.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveAvailability}
              className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest py-2.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-red-950/40 self-start sm:self-auto"
            >
              Save Changes
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider border-b border-[#1b212f]">
                  <th className="pb-3.5 pl-4">Date / Day</th>
                  <th className="pb-3.5 text-center">
                    Morning
                    <span className="text-[9px] text-neutral-600 block font-normal lowercase">
                      (6am - 12pm)
                    </span>
                  </th>
                  <th className="pb-3.5 text-center">
                    Afternoon
                    <span className="text-[9px] text-neutral-600 block font-normal lowercase">
                      (12pm - 6pm)
                    </span>
                  </th>
                  <th className="pb-3.5 text-center">
                    Evening
                    <span className="text-[9px] text-neutral-600 block font-normal lowercase">
                      (6pm - 12am)
                    </span>
                  </th>
                  <th className="pb-3.5 text-right pr-4">Notes / Conflicts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141824]">
                {scheduleDays.map((row, i) => (
                  <tr key={i} className="hover:bg-[#121622] transition-colors">
                    <td className="py-4 pl-4">
                      <p className="text-xs font-bold text-white">{row.day}</p>
                      <p className="text-[10px] text-neutral-500 font-mono">{row.date}</p>
                    </td>

                    {/* Morning */}
                    <td className="py-4 text-center">
                      <button
                        type="button"
                        disabled={!!row.conflict}
                        onClick={() => toggleSlot(i, "morn")}
                        className={`w-9 h-9 rounded-xl inline-flex items-center justify-center transition cursor-pointer ${
                          row.conflict
                            ? "bg-[#141824] text-neutral-600 cursor-not-allowed border border-[#1b212f]"
                            : row.morn
                            ? "bg-red-600 text-white shadow-md shadow-red-950/40"
                            : "bg-[#090b10] border border-[#1b212f] text-neutral-600 hover:text-white hover:border-neutral-600"
                        }`}
                      >
                        {row.conflict ? <CalendarOff size={15} /> : <Calendar size={15} />}
                      </button>
                    </td>

                    {/* Afternoon */}
                    <td className="py-4 text-center">
                      <button
                        type="button"
                        disabled={!!row.conflict}
                        onClick={() => toggleSlot(i, "aft")}
                        className={`w-9 h-9 rounded-xl inline-flex items-center justify-center transition cursor-pointer ${
                          row.conflict
                            ? "bg-[#141824] text-neutral-600 cursor-not-allowed border border-[#1b212f]"
                            : row.aft
                            ? "bg-red-600 text-white shadow-md shadow-red-950/40"
                            : "bg-[#090b10] border border-[#1b212f] text-neutral-600 hover:text-white hover:border-neutral-600"
                        }`}
                      >
                        {row.conflict ? <CalendarOff size={15} /> : <Calendar size={15} />}
                      </button>
                    </td>

                    {/* Evening */}
                    <td className="py-4 text-center">
                      <button
                        type="button"
                        disabled={!!row.conflict}
                        onClick={() => toggleSlot(i, "eve")}
                        className={`w-9 h-9 rounded-xl inline-flex items-center justify-center transition cursor-pointer ${
                          row.conflict
                            ? "bg-[#141824] text-neutral-600 cursor-not-allowed border border-[#1b212f]"
                            : row.eve
                            ? "bg-red-600 text-white shadow-md shadow-red-950/40"
                            : "bg-[#090b10] border border-[#1b212f] text-neutral-600 hover:text-white hover:border-neutral-600"
                        }`}
                      >
                        {row.conflict ? <CalendarOff size={15} /> : <Calendar size={15} />}
                      </button>
                    </td>

                    {/* Notes / Conflicts */}
                    <td className="py-4 text-right pr-4">
                      {row.conflict ? (
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-950/30 border border-amber-800/40 px-3 py-1 rounded-md">
                          {row.conflict}
                        </span>
                      ) : (
                        <span className="text-neutral-600 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Info Banner */}
          <div className="bg-[#090b10] border border-[#1b212f] p-4 rounded-xl flex items-start gap-3 text-xs text-neutral-400">
            <Info size={16} className="text-neutral-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Days with <span className="text-amber-500 font-bold">highlighted tags</span> indicate that you have an assigned shift that conflicts with updating your general availability. Please contact the Admin to reschedule.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SUB-TAB: MY ASSIGNMENTS (Image e74f43.jpg)                   */}
      {/* ============================================================== */}
      {subTab === "my_assignments" && (
        <div className="space-y-6">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">
                This Week
              </p>
              <h3 className="text-3xl font-black text-white">{totalCount}</h3>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">
                Assignments
              </p>
            </div>

            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">
                Acknowledged
              </p>
              <h3 className="text-3xl font-black text-white">{acknowledgedCount}</h3>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">
                Active
              </p>
            </div>

            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">
                Pending
              </p>
              <h3 className="text-3xl font-black text-white">{pendingCount}</h3>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">
                Need Action
              </p>
            </div>

            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1 flex items-center gap-1">
                <AlertTriangle size={12} /> Emergency
              </p>
              <h3 className="text-3xl font-black text-white">{emergencyCount}</h3>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">
                Backup Assigned
              </p>
            </div>
          </div>

          {/* Assignment Cards Stack */}
          <div className="space-y-4">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-7 space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-wider mb-2">
                      {asg.title}
                    </h3>
                    <span className="bg-red-950/40 border border-red-900/50 text-red-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded">
                      {asg.role}
                    </span>
                  </div>

                  <div>
                    {asg.status === "acknowledged" ? (
                      <span className="bg-red-950/30 text-red-500 border border-red-900/50 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded flex items-center gap-1.5">
                        <CheckSquare size={12} /> Acknowledged
                      </span>
                    ) : (
                      <span className="bg-amber-950/30 text-amber-500 border border-amber-900/50 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded flex items-center gap-1.5">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Details 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs text-neutral-300">
                  <div className="flex items-center gap-3">
                    <Calendar size={15} className="text-red-500 shrink-0" />
                    <span>{asg.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock size={15} className="text-red-500 shrink-0" />
                    <span>{asg.time}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={15} className="text-red-500 shrink-0" />
                    <span>{asg.location}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users size={15} className="text-red-500 shrink-0" />
                    <span>{asg.teamCount} team members</span>
                  </div>
                </div>

                {/* Team Members List */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                    Team:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {asg.team.map((member, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                          member === "YOU"
                            ? "bg-red-600 text-white border-red-500"
                            : "bg-[#0b0e14] border-[#1b212f] text-neutral-400"
                        }`}
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button: Declare Emergency or Acknowledge */}
                <div>
                  {asg.status === "pending" ? (
                    <button
                      type="button"
                      onClick={() => handleAcknowledge(asg.id)}
                      className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest transition cursor-pointer shadow-lg shadow-red-950/40"
                    >
                      Acknowledge Assignment
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={asg.emergencyDeclared}
                      onClick={() => setEmergencyModalAssignment(asg)}
                      className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 ${
                        asg.emergencyDeclared
                          ? "bg-neutral-900 text-neutral-500 border border-neutral-800 cursor-not-allowed"
                          : "bg-[#211612] hover:bg-[#2d1e18] text-orange-500 border border-orange-700/40"
                      }`}
                    >
                      <AlertTriangle size={14} />
                      <span>
                        {asg.emergencyDeclared
                          ? "Emergency Reported (Backup Alerted)"
                          : "Declare Emergency"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Declaration Dialog Modal */}
      {emergencyModalAssignment && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e121a] border border-orange-600/50 rounded-2xl p-6 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <div className="flex items-center gap-2 text-orange-500 font-black text-sm uppercase">
                <AlertTriangle size={18} />
                <span>Declare Emergency</span>
              </div>
              <button
                type="button"
                onClick={() => setEmergencyModalAssignment(null)}
                className="text-neutral-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Declaring an emergency for{" "}
              <strong className="text-white">{emergencyModalAssignment.title}</strong> will
              immediately notify the Admin and production dispatch to assign a backup crew member.
            </p>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Reason / Note for Dispatch
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Medical emergency, urgent travel, equipment transit issue..."
                value={emergencyReason}
                onChange={(e) => setEmergencyReason(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl p-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEmergencyModalAssignment(null)}
                className="px-4 py-2.5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEmergency}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-orange-950/50"
              >
                Submit Emergency
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingManagement;