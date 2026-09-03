import React, { useState } from "react";
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
} from "lucide-react";

const StaffOverview = ({ setActiveTab, staffName }) => {
  // Check-In Modal Flow: "qr" | "checklist" | "success" | null
  const [modalStep, setModalStep] = useState(null);

  // Equipment list for verification
  const initialEquipment = [
    { id: 1, name: "Sony FX3 Camera", tag: "Camera", sn: "SN-FX3-901", qty: "x1", checked: false },
    { id: 2, name: "OBSBOT Tail Air Camera", tag: "Camera", sn: "SN-OBS-007", qty: "x2", checked: false },
    { id: 3, name: "Tricaster TC1 System", tag: "Production", sn: "SN-TC1-003", qty: "x1", checked: false },
    { id: 4, name: "Tricaster Controller", tag: "Production", sn: "SN-TCC-002", qty: "x1", checked: false },
    { id: 5, name: "ROE 4K Monitor", tag: "Monitor", sn: "SN-MON-918", qty: "x3", checked: false },
    { id: 6, name: "Comms Headset", tag: "Comms", sn: "SN-COH-815", qty: "x4", checked: false },
    { id: 7, name: "Camera Stand / Tripod", tag: "Support", sn: "SN-TRP-008", qty: "x3", checked: false },
    { id: 8, name: "Extension Cord (20m)", tag: "Cable", sn: "SN-CBL-102", qty: "x5", checked: false },
    { id: 9, name: "Wireless Transmitter HDMI", tag: "Video", sn: "SN-WTR-404", qty: "x2", checked: false },
    { id: 10, name: "Audio Snake 8-Channel", tag: "Audio", sn: "SN-ASN-201", qty: "x1", checked: false },
  ];

  const [equipmentList, setEquipmentList] = useState(initialEquipment);

  const toggleItem = (id) => {
    setEquipmentList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = equipmentList.filter((item) => item.checked).length;
  const isAllChecked = checkedCount === equipmentList.length;

  const handleCheckAllToggle = () => {
    const nextState = !isAllChecked;
    setEquipmentList((prev) => prev.map((item) => ({ ...item, checked: nextState })));
  };

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif]">
      {/* Title + Check-In QR Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
            Staff Overview
          </h1>
          <p className="text-xs text-neutral-400">
            Welcome back, {staffName || "Staff"}. Here's your schedule and tasks.
          </p>
        </div>

        {/* Scan Check-in QR button (Triggers modal) */}
        <button
          type="button"
          onClick={() => setModalStep("qr")}
          className="bg-[#ff0000] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition cursor-pointer"
        >
          <QrCode size={17} />
          <span>Scan Check-in QR</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <Calendar size={84} className="absolute -bottom-4 -right-4 text-[#161c2b] pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1">
              Upcoming Events
            </p>
            <h2 className="text-3xl font-black text-white leading-none">4</h2>
          </div>
          <p className="text-[10px] font-bold text-red-500 mt-3 relative z-10">
            Next event in 5 days
          </p>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <Clock size={84} className="absolute -bottom-4 -right-4 text-[#161c2b] pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1">
              Hours Logged
            </p>
            <h2 className="text-3xl font-black text-white leading-none">128.5</h2>
          </div>
          <p className="text-[10px] font-bold text-emerald-500 mt-3 relative z-10">
            +12.5 hrs this week
          </p>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <CheckSquare size={84} className="absolute -bottom-4 -right-4 text-[#161c2b] pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1">
              Pending Tasks
            </p>
            <h2 className="text-3xl font-black text-white leading-none">2</h2>
          </div>
          <p className="text-[10px] font-bold text-amber-500 mt-3 relative z-10">
            1 high priority task
          </p>
        </div>
      </div>

      {/* Main Grid: Deployment + Actions & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Next Deployment Card */}
        <div className="lg:col-span-8 bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1b212f] pb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Next Deployment
            </h3>
            <span className="bg-red-950/40 text-red-500 border border-red-800/50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Upcoming
            </span>
          </div>

          <div>
            <h2 className="text-xl font-black uppercase text-white mb-6">
              Tech Innovators Summit 2026
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-3.5 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#141824] border border-[#1b212f] flex items-center justify-center shrink-0 text-neutral-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">Date</p>
                  <p className="text-sm font-bold text-white">2026-05-25</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#141824] border border-[#1b212f] flex items-center justify-center shrink-0 text-neutral-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">Location</p>
                  <p className="text-sm font-bold text-white leading-snug">
                    SMX Convention Center, Manila
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#141824] border border-[#1b212f] flex items-center justify-center shrink-0 text-neutral-400">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">Time</p>
                  <p className="text-sm font-bold text-white">08:00 AM - 05:00 PM</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#141824] border border-[#1b212f] flex items-center justify-center shrink-0 text-red-500">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">Assigned Role</p>
                  <p className="text-sm font-bold text-red-500">Camera Operator</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalStep("checklist")}
              className="flex-1 bg-[#142340] hover:bg-[#1b315b] text-blue-400 border border-blue-900/60 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
            >
              View Equipment Checklist
            </button>
            <button
              type="button"
              className="flex-1 bg-[#0b0e14] hover:bg-neutral-800 text-neutral-300 border border-[#1b212f] font-bold text-xs py-3 rounded-xl transition cursor-pointer"
            >
              Contact Event Manager
            </button>
          </div>
        </div>

        {/* Right Side: Quick Actions + Tasks */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
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
                onClick={() => setModalStep("checklist")}
                className="w-full flex items-center justify-between p-4 bg-[#0b0e14] border border-[#1b212f] rounded-xl hover:border-red-600/50 transition group cursor-pointer"
              >
                <div className="flex items-center gap-3 text-neutral-300">
                  <CheckSquare size={16} className="text-neutral-500 group-hover:text-red-500 transition" />
                  <span className="text-xs font-bold">Equipment Checklist</span>
                </div>
                <ChevronRight size={16} className="text-neutral-500 group-hover:text-red-500 transition" />
              </button>
            </div>
          </div>

          {/* Tasks Card */}
          <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Tasks
            </h3>
            <div className="space-y-3.5 text-xs">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded bg-[#0b0e14] border-neutral-700 accent-red-600 cursor-pointer"
                />
                <div>
                  <p className="text-neutral-300 group-hover:text-white transition leading-snug">
                    Equipment check for Wedding coverage
                  </p>
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-0.5 block">
                    High Priority
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 w-4 h-4 rounded bg-[#0b0e14] border-neutral-700 accent-red-600 cursor-pointer"
                />
                <div>
                  <p className="text-neutral-500 line-through leading-snug">
                    Submit availability for June
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded bg-[#0b0e14] border-neutral-700 accent-red-600 cursor-pointer"
                />
                <div>
                  <p className="text-neutral-300 group-hover:text-white transition leading-snug">
                    Review new multi-cam setup guide
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CHECK-IN MULTI-STEP MODAL (Matching Screenshots)               */}
      {/* ============================================================== */}
      {modalStep && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c0e14] border border-[#1b212f] rounded-2xl overflow-hidden shadow-2xl text-white font-['Montserrat',sans-serif] animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
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
                  onClick={() => setModalStep(null)}
                  className="w-7 h-7 rounded-full bg-[#161c28] text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* STEP 1: QR CODE DISPLAY */}
            {modalStep === "qr" && (
              <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* QR Card */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-48 h-48 bg-white rounded-2xl p-2 flex items-center justify-center shadow-lg relative">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=LM-2026-0521-TECHINNOVATORS"
                        alt="Checkin QR"
                        className="w-full h-full object-contain"
                      />
                      <div className="w-4 h-4 bg-red-600 rounded-full absolute border-2 border-white"></div>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400 font-bold mt-2">
                      LM-2026-0521
                    </span>
                    <span className="text-[9px] text-neutral-500 uppercase">
                      Scan to verify check-in
                    </span>

                    {/* Staff Badge Pill */}
                    <div className="mt-3 text-center">
                      <p className="text-[11px] text-neutral-400">👤 Staff</p>
                      <p className="text-xs font-bold text-white">{staffName || "Alex Reyes"}</p>
                      <span className="text-[10px] text-red-500 font-mono font-bold">
                        STF-0042
                      </span>
                    </div>
                  </div>

                  {/* Right Event Meta */}
                  <div className="flex-1 w-full space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">
                        Event
                      </span>
                      <h4 className="text-base font-black uppercase text-white">
                        Tech Innovators Summit 2026
                      </h4>
                      <p className="text-neutral-400 text-xs">TechPH Corp.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-[#090b10] border border-[#181f2e] rounded-xl p-3">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase block">
                          Date
                        </span>
                        <p className="font-bold text-white">May 25, 2026</p>
                      </div>

                      <div className="bg-[#090b10] border border-[#181f2e] rounded-xl p-3">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase block">
                          Time
                        </span>
                        <p className="font-bold text-white">08:00 AM - 05:00 PM</p>
                      </div>
                    </div>

                    <div className="bg-[#090b10] border border-[#181f2e] rounded-xl p-3">
                      <span className="text-[9px] font-bold text-neutral-500 uppercase block">
                        Venue
                      </span>
                      <p className="font-bold text-white">SMX Convention Center, Pasay</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#090b10] border border-[#181f2e] rounded-xl p-3">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase block">
                          Package
                        </span>
                        <p className="font-bold text-white truncate">Full Livestream Package</p>
                      </div>

                      <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-3">
                        <span className="text-[9px] font-bold text-red-500 uppercase block">
                          Role
                        </span>
                        <p className="font-bold text-red-400">Camera Operator</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <button
                  type="button"
                  onClick={() => setModalStep("checklist")}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
                >
                  <span>Proceed to Equipment Checklist</span>
                </button>
              </div>
            )}

            {/* STEP 2: EQUIPMENT CHECKLIST */}
            {modalStep === "checklist" && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#181f2e]">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Equipment Checklist
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      Tech Innovators Summit 2026
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-neutral-300">
                      {checkedCount}/{equipmentList.length} verified
                    </span>
                    <button
                      type="button"
                      onClick={handleCheckAllToggle}
                      className="text-xs font-bold text-red-500 hover:text-red-400 transition cursor-pointer"
                    >
                      {isAllChecked ? "Uncheck All" : "Check All"}
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-[#141824] rounded-full overflow-hidden -mt-2">
                  <div
                    className="h-full bg-red-600 transition-all duration-300"
                    style={{ width: `${(checkedCount / equipmentList.length) * 100}%` }}
                  ></div>
                </div>

                {/* Scrollable list */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {equipmentList.map((eq) => (
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
                            <span className="text-[9px] font-bold text-neutral-400 bg-neutral-800 px-1.5 py-0.2 rounded">
                              {eq.tag}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-500">{eq.sn}</span>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-neutral-400">{eq.qty}</span>
                    </div>
                  ))}
                </div>

                {/* Modal Footer Controls */}
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
                    disabled={!isAllChecked}
                    onClick={() => setModalStep("success")}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 ${
                      isAllChecked
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-950/50"
                        : "bg-[#141926] text-neutral-500 cursor-not-allowed border border-[#1b212f]"
                    }`}
                  >
                    {isAllChecked ? (
                      <span>Confirm Check-In</span>
                    ) : (
                      <span>Verify all {equipmentList.length} items to continue</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS CHECKED-IN SCREEN */}
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

                {/* Event Tags */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[10px]">
                  <span className="bg-[#141926] border border-[#20293d] px-3 py-1 rounded-full text-neutral-300">
                    Tech Innovators Summit 2026
                  </span>
                  <span className="bg-[#141926] border border-[#20293d] px-3 py-1 rounded-full text-neutral-300">
                    Camera Operator
                  </span>
                  <span className="bg-[#0b2419] border border-[#14532d] px-3 py-1 rounded-full text-emerald-400 font-bold">
                    10 items verified
                  </span>
                  <span className="bg-[#141926] border border-[#20293d] px-3 py-1 rounded-full text-red-500 font-mono font-bold">
                    STF-0042
                  </span>
                </div>

                {/* Check-in Record Table Box */}
                <div className="bg-[#090b10] border border-[#181f2e] rounded-xl p-4 text-xs space-y-2 text-left max-w-md mx-auto">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">
                    Check-in Record
                  </span>
                  <div className="flex justify-between text-neutral-400">
                    <span>Event ID</span>
                    <span className="font-mono font-bold text-white">LM-2026-0521</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Time</span>
                    <span className="font-bold text-white">05:23 PM</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Equipment</span>
                    <span className="font-bold text-emerald-400">10/10 verified</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 pt-4 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={() => setModalStep(null)}
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