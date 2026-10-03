import React, { useState, useEffect } from "react";
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
import { supabase } from "../../supabaseClient";

const API = import.meta.env.VITE_API_URL;
const DAYS_AHEAD = 7;

const SLOTS = [
  { key: "morn", label: "Morning", range: "(6am - 12pm)" },
  { key: "aft", label: "Afternoon", range: "(12pm - 6pm)" },
  { key: "eve", label: "Evening", range: "(6pm - 12am)" },
];

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

// fetch helper that sends the logged-in user's token to FastAPI
const authFetch = async (path, options = {}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data.detail === "string" ? data.detail : "Request failed");
  }
  return data;
};

// YYYY-MM-DD in the user's local timezone (avoids the UTC date-shift of toISOString)
const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Today + the next 6 days, all slots closed until loaded from the server
const buildWeek = () => {
  const today = new Date();
  return Array.from({ length: DAYS_AHEAD }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    return {
      key: toKey(d),
      day: d.toLocaleDateString("en-US", { weekday: "long" }),
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      morn: false,
      aft: false,
      eve: false,
      conflict: null,
    };
  });
};

// "2026-06-15" -> "Monday, June 15, 2026"
const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// "14:00:00" -> "2:00 PM"
const fmtTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

// Maps an API assignment row to what the cards render
const mapAssignment = (r) => ({
  id: r.id,
  title: (r.title || "").toUpperCase(),
  role: (r.role || "").toUpperCase(),
  status: r.status, // "pending" | "acknowledged"
  emergencyDeclared: !!r.emergency_declared,
  date: fmtDate(r.date),
  time: [fmtTime(r.start_time), fmtTime(r.end_time)].filter(Boolean).join(" - "),
  location: r.location,
  teamCount: r.team.length,
  team: r.team,
});

// ---------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------

const SchedulingManagement = () => {
  const [subTab, setSubTab] = useState("set_availability"); // "set_availability" | "my_assignments"

  // Availability state
  const [scheduleDays, setScheduleDays] = useState(buildWeek);
  const [loadingAvail, setLoadingAvail] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [availError, setAvailError] = useState("");

  // Assignments state
  const [assignments, setAssignments] = useState([]);
  const [loadingAsg, setLoadingAsg] = useState(true);
  const [asgError, setAsgError] = useState("");

  // Emergency modal state
  const [emergencyModalAssignment, setEmergencyModalAssignment] = useState(null);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [submittingEmergency, setSubmittingEmergency] = useState(false);

  // Load saved availability for the next 7 days
  useEffect(() => {
    const loadAvailability = async () => {
      const week = buildWeek();
      try {
        const rows = await authFetch(
          `/staff-portal/availability?start=${week[0].key}&days=${DAYS_AHEAD}`
        );
        const byDate = Object.fromEntries(rows.map((r) => [r.date, r]));
        setScheduleDays(
          week.map((d) => {
            const r = byDate[d.key];
            return r
              ? { ...d, morn: !!r.morning, aft: !!r.afternoon, eve: !!r.evening }
              : d;
          })
        );
      } catch (err) {
        setScheduleDays(week);
        setAvailError(err.message);
      } finally {
        setLoadingAvail(false);
      }
    };
    loadAvailability();
  }, []);

  // Load the staff member's upcoming assignments
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const rows = await authFetch("/staff-portal/assignments");
        setAssignments(rows.map(mapAssignment));
      } catch (err) {
        setAsgError(err.message);
      } finally {
        setLoadingAsg(false);
      }
    };
    loadAssignments();
  }, []);

  // Toggle availability slot
  const toggleSlot = (index, slotKey) => {
    if (scheduleDays[index].conflict) return; // ignore locked days
    setScheduleDays((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [slotKey]: !item[slotKey] } : item))
    );
  };

  const handleSaveAvailability = async () => {
    setSaving(true);
    setAvailError("");
    try {
      await authFetch("/staff-portal/availability", {
        method: "PUT",
        body: JSON.stringify({
          days: scheduleDays.map((d) => ({
            date: d.key,
            morning: d.morn,
            afternoon: d.aft,
            evening: d.eve,
          })),
        }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setAvailError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAcknowledge = async (id) => {
    setAsgError("");
    try {
      await authFetch(`/staff-portal/assignments/${id}/acknowledge`, { method: "PATCH" });
      setAssignments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "acknowledged" } : item))
      );
    } catch (err) {
      setAsgError(err.message);
    }
  };

  const closeEmergencyModal = () => {
    setEmergencyModalAssignment(null);
    setEmergencyReason("");
  };

  const handleConfirmEmergency = async () => {
    if (!emergencyModalAssignment) return;
    setSubmittingEmergency(true);
    setAsgError("");
    try {
      await authFetch(`/staff-portal/assignments/${emergencyModalAssignment.id}/emergency`, {
        method: "POST",
        body: JSON.stringify({ reason: emergencyReason }),
      });
      setAssignments((prev) =>
        prev.map((item) =>
          item.id === emergencyModalAssignment.id ? { ...item, emergencyDeclared: true } : item
        )
      );
      closeEmergencyModal();
    } catch (err) {
      setAsgError(err.message);
    } finally {
      setSubmittingEmergency(false);
    }
  };

  // Metrics
  const totalCount = assignments.length;
  const acknowledgedCount = assignments.filter((a) => a.status === "acknowledged").length;
  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const emergencyCount = assignments.filter((a) => a.emergencyDeclared).length;

  const tabClass = (active) =>
    `px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
      active
        ? "bg-red-600 text-white shadow-md shadow-red-950/50"
        : "text-neutral-400 hover:text-white"
    }`;

  const slotClass = (row, slotKey) =>
    `w-9 h-9 rounded-xl inline-flex items-center justify-center transition cursor-pointer ${
      row.conflict
        ? "bg-[#141824] text-neutral-600 cursor-not-allowed border border-[#1b212f]"
        : row[slotKey]
        ? "bg-red-600 text-white shadow-md shadow-red-950/40"
        : "bg-[#090b10] border border-[#1b212f] text-neutral-600 hover:text-white hover:border-neutral-600"
    }`;

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      {/* Header & tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-black uppercase tracking-wide text-white">
          Availability Manager
        </h1>

        <div className="flex bg-[#0f121a] border border-[#1b212f] rounded-2xl p-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSubTab("set_availability")}
            className={tabClass(subTab === "set_availability")}
          >
            Set Availability
          </button>
          <button
            type="button"
            onClick={() => setSubTab("my_assignments")}
            className={tabClass(subTab === "my_assignments")}
          >
            My Assignments
          </button>
        </div>
      </div>

      {/* Save toast */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-[#0b2419] border border-[#14532d] text-[#22c55e] flex items-center gap-3 text-xs animate-in fade-in duration-200">
          <CheckCircle2 size={16} />
          <span>Availability schedule saved successfully!</span>
        </div>
      )}

      {/* Error banners */}
      {availError && subTab === "set_availability" && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/60 text-red-400 flex items-center gap-3 text-xs">
          <AlertTriangle size={16} />
          <span>{availError}</span>
        </div>
      )}
      {asgError && subTab === "my_assignments" && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/60 text-red-400 flex items-center gap-3 text-xs">
          <AlertTriangle size={16} />
          <span>{asgError}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SET AVAILABILITY                                              */}
      {/* ============================================================ */}
      {subTab === "set_availability" && (
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
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
              disabled={saving || loadingAvail}
              className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest py-2.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-red-950/40 self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {loadingAvail ? (
            <p className="text-xs text-neutral-400 py-6 text-center">
              Loading your availability...
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider border-b border-[#1b212f]">
                    <th className="pb-3.5 pl-4">Date / Day</th>
                    {SLOTS.map((s) => (
                      <th key={s.key} className="pb-3.5 text-center">
                        {s.label}
                        <span className="text-[9px] text-neutral-600 block font-normal lowercase">
                          {s.range}
                        </span>
                      </th>
                    ))}
                    <th className="pb-3.5 text-right pr-4">Notes / Conflicts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141824]">
                  {scheduleDays.map((row, i) => (
                    <tr key={row.key} className="hover:bg-[#121622] transition-colors">
                      <td className="py-4 pl-4">
                        <p className="text-xs font-bold text-white">{row.day}</p>
                        <p className="text-[10px] text-neutral-500 font-mono">{row.date}</p>
                      </td>

                      {SLOTS.map((s) => (
                        <td key={s.key} className="py-4 text-center">
                          <button
                            type="button"
                            disabled={!!row.conflict}
                            onClick={() => toggleSlot(i, s.key)}
                            className={slotClass(row, s.key)}
                          >
                            {row.conflict ? <CalendarOff size={15} /> : <Calendar size={15} />}
                          </button>
                        </td>
                      ))}

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
          )}

          <div className="bg-[#090b10] border border-[#1b212f] p-4 rounded-xl flex items-start gap-3 text-xs text-neutral-400">
            <Info size={16} className="text-neutral-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Days with <span className="text-amber-500 font-bold">highlighted tags</span> indicate
              that you have an assigned shift that conflicts with updating your general
              availability. Please contact the Admin to reschedule.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MY ASSIGNMENTS                                                */}
      {/* ============================================================ */}
      {subTab === "my_assignments" && (
        <div className="space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">
                Upcoming
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

          {/* Assignment cards */}
          <div className="space-y-4">
            {loadingAsg ? (
              <p className="text-xs text-neutral-400 py-6 text-center">
                Loading your assignments...
              </p>
            ) : assignments.length === 0 ? (
              <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-10 text-center text-xs text-neutral-400">
                No upcoming assignments.
              </div>
            ) : (
              assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-7 space-y-6"
                >
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-white uppercase tracking-wider mb-2">
                        {asg.title}
                      </h3>
                      <span className="bg-red-950/40 border border-red-900/50 text-red-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded">
                        {asg.role}
                      </span>
                    </div>

                    {asg.status === "acknowledged" ? (
                      <span className="bg-red-950/30 text-red-500 border border-red-900/50 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded flex items-center gap-1.5 self-start">
                        <CheckSquare size={12} /> Acknowledged
                      </span>
                    ) : (
                      <span className="bg-amber-950/30 text-amber-500 border border-amber-900/50 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded flex items-center gap-1.5 self-start">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </div>

                  {/* Details */}
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

                  {/* Team */}
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

                  {/* Action button */}
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
              ))
            )}
          </div>
        </div>
      )}

      {/* Emergency modal */}
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
                onClick={closeEmergencyModal}
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
                onClick={closeEmergencyModal}
                className="px-4 py-2.5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEmergency}
                disabled={submittingEmergency}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-orange-950/50 disabled:opacity-50"
              >
                {submittingEmergency ? "Submitting..." : "Submit Emergency"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingManagement;
