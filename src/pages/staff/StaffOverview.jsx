import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckSquare,
  QrCode,
  MapPin,
  AlertCircle,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "../../supabaseClient";

const API = import.meta.env.VITE_API_URL;

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
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

// "2026-05-25" -> "May 25, 2026"
const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
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

const fmtRange = (start, end) => [fmtTime(start), fmtTime(end)].filter(Boolean).join(" - ");

const fmtClock = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";

const nextEventText = (days) => {
  if (days === null || days === undefined) return "No upcoming events";
  if (days === 0) return "Next event is today";
  return `Next event in ${days} day${days === 1 ? "" : "s"}`;
};

const MetricCard = ({ icon: Icon, label, value, note, noteClass }) => (
  <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
    <Icon size={84} className="absolute -bottom-4 -right-4 text-[#161c2b] pointer-events-none" />
    <div className="relative z-10">
      <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <h2 className="text-3xl font-black text-white leading-none">{value}</h2>
    </div>
    <p className={`text-[10px] font-bold mt-3 relative z-10 ${noteClass}`}>{note}</p>
  </div>
);

const DetailTile = ({ icon: Icon, label, value, iconClass = "text-neutral-400", valueClass = "text-white" }) => (
  <div className="flex gap-3.5 items-start">
    <div
      className={`w-10 h-10 rounded-xl bg-[#141824] border border-[#1b212f] flex items-center justify-center shrink-0 ${iconClass}`}
    >
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">{label}</p>
      <p className={`text-sm font-bold leading-snug ${valueClass}`}>{value}</p>
    </div>
  </div>
);

// ---------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------
const StaffOverview = ({ setActiveTab, staffName }) => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check-in modal flow: "qr" | "checklist" | "success" | null
  const [modalStep, setModalStep] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInError, setCheckInError] = useState("");
  const [checkedInAt, setCheckedInAt] = useState(null);
  const [qrText, setQrText] = useState("");
  const [qrError, setQrError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await authFetch("/staff-portal/overview");
        setOverview(data);
        setCheckedInAt(data.next?.checked_in_at || null);
        setEquipmentList(
          (data.next?.equipment || []).map((e) => ({
            id: e.id,
            name: e.name,
            tag: e.tag,
            sn: e.sn,
            qty: `x${e.qty}`,
            checked: false,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const next = overview?.next || null;
  const tasks = overview?.tasks || [];
  const highPriorityCount = tasks.filter((t) => t.high_priority).length;

  // Fetch a fresh signed QR token every time the QR step is shown
  useEffect(() => {
    if (modalStep !== "qr" || !next) return;
    let cancelled = false;
    setQrText("");
    setQrError("");
    authFetch(`/staff-portal/assignments/${next.assignment_id}/qr-token`)
      .then((res) => {
        if (!cancelled) setQrText(res.text);
      })
      .catch((err) => {
        if (!cancelled) setQrError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [modalStep, next?.assignment_id]);

  const toggleItem = (id) => {
    setEquipmentList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = equipmentList.filter((item) => item.checked).length;
  const isAllChecked = checkedCount === equipmentList.length;
  const progress = equipmentList.length ? (checkedCount / equipmentList.length) * 100 : 100;

  const handleCheckAllToggle = () => {
    const nextState = !isAllChecked;
    setEquipmentList((prev) => prev.map((item) => ({ ...item, checked: nextState })));
  };

  const closeModal = () => {
    setModalStep(null);
    setCheckInError("");
  };

  const handleConfirmCheckIn = async () => {
    if (!next) return;
    setCheckingIn(true);
    setCheckInError("");
    try {
      const res = await authFetch(`/staff-portal/assignments/${next.assignment_id}/check-in`, {
        method: "POST",
        body: JSON.stringify({ equipment_ids: equipmentList.map((e) => e.id) }),
      });
      setCheckedInAt(res.checked_in_at);
      setModalStep("success");
    } catch (err) {
      setCheckInError(err.message);
    } finally {
      setCheckingIn(false);
    }
  };

  const openModal = (step) => {
    if (next) setModalStep(step);
  };

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif]">
      {/* Title + Check-In QR button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
            Staff Overview
          </h1>
          <p className="text-xs text-neutral-400">
            Welcome back, {staffName || "Staff"}. Here's your schedule and tasks.
          </p>
        </div>

        <button
          type="button"
          disabled={!next}
          onClick={() => openModal("qr")}
          className="bg-[#ff0000] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <QrCode size={17} />
          <span>Scan Check-in QR</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/60 text-red-400 flex items-center gap-3 text-xs">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          icon={Calendar}
          label="Upcoming Events"
          value={loading ? "-" : overview?.upcoming_count ?? 0}
          note={loading ? "Loading..." : nextEventText(overview?.next_in_days)}
          noteClass="text-red-500"
        />
        <MetricCard
          icon={Clock}
          label="Hours Logged"
          value={loading ? "-" : overview?.hours_total ?? 0}
          note={loading ? "Loading..." : `+${overview?.hours_week ?? 0} hrs this week`}
          noteClass="text-emerald-500"
        />
        <MetricCard
          icon={CheckSquare}
          label="Pending Tasks"
          value={loading ? "-" : tasks.length}
          note={
            loading
              ? "Loading..."
              : highPriorityCount > 0
              ? `${highPriorityCount} high priority task${highPriorityCount === 1 ? "" : "s"}`
              : tasks.length > 0
              ? "No high priority tasks"
              : "All caught up"
          }
          noteClass="text-amber-500"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Next Deployment */}
        <div className="lg:col-span-8 bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1b212f] pb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Next Deployment
            </h3>
            {next && (
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  checkedInAt
                    ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/50"
                    : "bg-red-950/40 text-red-500 border-red-800/50"
                }`}
              >
                {checkedInAt ? "Checked In" : "Upcoming"}
              </span>
            )}
          </div>

          {loading ? (
            <p className="text-xs text-neutral-400 py-6 text-center">Loading your schedule...</p>
          ) : !next ? (
            <p className="text-xs text-neutral-400 py-6 text-center">
              No upcoming deployments assigned to you.
            </p>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-black uppercase text-white mb-6">{next.title}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <DetailTile icon={Calendar} label="Date" value={fmtDate(next.date)} />
                  <DetailTile icon={MapPin} label="Location" value={next.venue} />
                  <DetailTile
                    icon={Clock}
                    label="Time"
                    value={fmtRange(next.start_time, next.end_time)}
                  />
                  <DetailTile
                    icon={AlertCircle}
                    label="Assigned Role"
                    value={next.role}
                    iconClass="text-red-500"
                    valueClass="text-red-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openModal("checklist")}
                  className="flex-1 bg-[#142340] hover:bg-[#1b315b] text-blue-400 border border-blue-900/60 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
                >
                  View Equipment Checklist
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right side: Quick Actions + Tasks */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setActiveTab("scheduling")}
                className="w-full flex items-center justify-between p-4 bg-[#0b0e14] border border-[#1b212f] rounded-xl hover:border-red-600/50 transition group cursor-pointer"
              >
                <div className="flex items-center gap-3 text-neutral-300">
                  <Calendar size={16} className="text-neutral-500 group-hover:text-red-500 transition" />
                  <span className="text-xs font-bold">Update Availability</span>
                </div>
                <ChevronRight size={16} className="text-neutral-500 group-hover:text-red-500 transition" />
              </button>

              <button
                type="button"
                disabled={!next}
                onClick={() => openModal("checklist")}
                className="w-full flex items-center justify-between p-4 bg-[#0b0e14] border border-[#1b212f] rounded-xl hover:border-red-600/50 transition group cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3 text-neutral-300">
                  <CheckSquare size={16} className="text-neutral-500 group-hover:text-red-500 transition" />
                  <span className="text-xs font-bold">Equipment Checklist</span>
                </div>
                <ChevronRight size={16} className="text-neutral-500 group-hover:text-red-500 transition" />
              </button>
            </div>
          </div>

          <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">Tasks</h3>
            {loading ? (
              <p className="text-xs text-neutral-500">Loading...</p>
            ) : tasks.length === 0 ? (
              <p className="text-xs text-neutral-500">No pending tasks. You're all caught up.</p>
            ) : (
              <div className="space-y-3.5 text-xs">
                {tasks.map((t) => (
                  <button
                    key={t.assignment_id}
                    type="button"
                    onClick={() => setActiveTab("scheduling")}
                    className="w-full flex items-start gap-3 text-left group cursor-pointer"
                  >
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <p className="text-neutral-300 group-hover:text-white transition leading-snug">
                        {t.title}
                      </p>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">
                        {fmtDate(t.date)}
                      </span>
                      {t.high_priority && (
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-0.5 block">
                          High Priority
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CHECK-IN MODAL                                                  */}
      {/* ============================================================== */}
      {modalStep && next && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c0e14] border border-[#1b212f] rounded-2xl overflow-hidden shadow-2xl text-white font-['Montserrat',sans-serif] animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="p-5 bg-[#090b10] border-b border-[#181f2e] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-950/50 border border-red-800/60 text-red-500 flex items-center justify-center">
                  <QrCode size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    Check-in QR Code
                  </h3>
                  <p className="text-[10px] text-neutral-400">
                    Present this code at the event entrance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-7 h-7 rounded-full bg-[#161c28] text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* STEP 1: QR */}
            {modalStep === "qr" && (
              <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-56 h-56 bg-white rounded-2xl p-2 flex items-center justify-center shadow-lg relative">
                      {qrText ? (
                        <QRCodeSVG value={qrText} size={208} level="M" />
                      ) : qrError ? (
                        <p className="text-[10px] text-red-600 text-center px-2">{qrError}</p>
                      ) : (
                        <p className="text-[10px] text-neutral-500">Generating...</p>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400 font-bold mt-2">
                      {next.event_code}
                    </span>
                    <span className="text-[9px] text-neutral-500 uppercase">
                      Scan to verify check-in
                    </span>

                    <div className="mt-3 text-center">
                      <p className="text-[11px] text-neutral-400">👤 Staff</p>
                      <p className="text-xs font-bold text-white">{staffName || "Staff"}</p>
                      <span className="text-[10px] text-red-500 font-mono font-bold">
                        {overview.staff_code}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">
                        Event
                      </span>
                      <h4 className="text-base font-black uppercase text-white">{next.title}</h4>
                      <p className="text-neutral-400 text-xs">{next.client_name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-[#090b10] border border-[#181f2e] rounded-xl p-3">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase block">Date</span>
                        <p className="font-bold text-white">{fmtDate(next.date)}</p>
                      </div>
                      <div className="bg-[#090b10] border border-[#181f2e] rounded-xl p-3">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase block">Time</span>
                        <p className="font-bold text-white">{fmtRange(next.start_time, next.end_time)}</p>
                      </div>
                    </div>

                    <div className="bg-[#090b10] border border-[#181f2e] rounded-xl p-3">
                      <span className="text-[9px] font-bold text-neutral-500 uppercase block">Venue</span>
                      <p className="font-bold text-white">{next.venue}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#090b10] border border-[#181f2e] rounded-xl p-3">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase block">
                          Event Type
                        </span>
                        <p className="font-bold text-white truncate">{next.event_type || "-"}</p>
                      </div>
                      <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-3">
                        <span className="text-[9px] font-bold text-red-500 uppercase block">Role</span>
                        <p className="font-bold text-red-400">{next.role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalStep("checklist")}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
                >
                  <span>Proceed to Equipment Checklist</span>
                </button>
              </div>
            )}

            {/* STEP 2: CHECKLIST */}
            {modalStep === "checklist" && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#181f2e]">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Equipment Checklist
                    </h4>
                    <p className="text-[10px] text-neutral-400">{next.title}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-neutral-300">
                      {checkedCount}/{equipmentList.length} verified
                    </span>
                    {equipmentList.length > 0 && (
                      <button
                        type="button"
                        onClick={handleCheckAllToggle}
                        className="text-xs font-bold text-red-500 hover:text-red-400 transition cursor-pointer"
                      >
                        {isAllChecked ? "Uncheck All" : "Check All"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full h-1 bg-[#141824] rounded-full overflow-hidden -mt-2">
                  <div
                    className="h-full bg-red-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {equipmentList.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-6">
                      No equipment is attached to this booking.
                    </p>
                  ) : (
                    equipmentList.map((eq) => (
                      <div
                        key={eq.id}
                        onClick={() => toggleItem(eq.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          eq.checked
                            ? "bg-[#0b2419] border-[#14532d]"
                            : "bg-[#090b10] border-[#181f2e] hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                              eq.checked
                                ? "bg-emerald-600 border-emerald-500 text-white"
                                : "border-neutral-700 bg-transparent"
                            }`}
                          >
                            {eq.checked && <Check size={13} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{eq.name}</span>
                              <span className="text-[9px] font-bold text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                                {eq.tag}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-500">{eq.sn}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-neutral-400">{eq.qty}</span>
                      </div>
                    ))
                  )}
                </div>

                {checkInError && (
                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/60 text-red-400 flex items-center gap-2 text-xs">
                    <AlertTriangle size={14} />
                    <span>{checkInError}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalStep("qr")}
                    className="py-3 px-5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase transition cursor-pointer"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    disabled={!isAllChecked || checkingIn}
                    onClick={handleConfirmCheckIn}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2 ${
                      isAllChecked && !checkingIn
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-950/50 cursor-pointer"
                        : "bg-[#141926] text-neutral-500 cursor-not-allowed border border-[#1b212f]"
                    }`}
                  >
                    {checkingIn ? (
                      <span>Checking in...</span>
                    ) : isAllChecked ? (
                      <span>{checkedInAt ? "Check In Again" : "Confirm Check-In"}</span>
                    ) : (
                      <span>Verify all {equipmentList.length} items to continue</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS */}
            {modalStep === "success" && (
              <div className="p-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(34,197,94,0.3)] animate-in zoom-in duration-200">
                  <Check size={32} />
                </div>

                <div>
                  <h3 className="text-xl font-black uppercase tracking-wider text-white">
                    Checked In!
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    You have successfully checked in for this event.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[10px]">
                  <span className="bg-[#141926] border border-[#20293d] px-3 py-1 rounded-full text-neutral-300">
                    {next.title}
                  </span>
                  <span className="bg-[#141926] border border-[#20293d] px-3 py-1 rounded-full text-neutral-300">
                    {next.role}
                  </span>
                  <span className="bg-[#0b2419] border border-[#14532d] px-3 py-1 rounded-full text-emerald-400 font-bold">
                    {equipmentList.length} items verified
                  </span>
                  <span className="bg-[#141926] border border-[#20293d] px-3 py-1 rounded-full text-red-500 font-mono font-bold">
                    {overview.staff_code}
                  </span>
                </div>

                <div className="bg-[#090b10] border border-[#181f2e] rounded-xl p-4 text-xs space-y-2 text-left max-w-md mx-auto">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">
                    Check-in Record
                  </span>
                  <div className="flex justify-between text-neutral-400">
                    <span>Event ID</span>
                    <span className="font-mono font-bold text-white">{next.event_code}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Time</span>
                    <span className="font-bold text-white">{fmtClock(checkedInAt)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Equipment</span>
                    <span className="font-bold text-emerald-400">
                      {equipmentList.length}/{equipmentList.length} verified
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalStep("checklist")}
                    className="flex-1 py-3 rounded-xl border border-[#1b212f] hover:border-neutral-600 text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    View Checklist
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffOverview;
