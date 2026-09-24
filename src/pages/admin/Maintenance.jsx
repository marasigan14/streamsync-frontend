import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  Activity,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  Wrench,
  Plus,
  X,
} from "lucide-react";
import { supabase } from "../../supabaseClient";

const Maintenance = () => {
  // Tabs: 'action_queue', 'logs', 'arima'
  const [activeTab, setActiveTab] = useState("action_queue");
  const [searchQuery, setSearchQuery] = useState("");

  // Real maintenance logs, loaded from the FastAPI backend (FR-11).
  // Action Queue = reported/in_progress items; Logs = resolved items.
  // Both views are derived from this one real dataset.
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  // Report-issue modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [resolvingLog, setResolvingLog] = useState(null);
  const [resolveNotes, setResolveNotes] = useState("Resolved — checked and back in service.");
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [reportEquipmentId, setReportEquipmentId] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState("");

  // ARIMA Insights — still mock. FR-13 (predictive analytics) is being
  // handled separately; this tab is left as a UI mockup for now.
  const [arimaInsightsData, setArimaInsightsData] = useState([
    {
      id: 1,
      title: "Audio Equipment Fleet",
      priority: "HIGH PRIORITY",
      isHighPriority: true,
      icon: <TrendingUp size={18} className="text-blue-500" />,
      description:
        "Forecast shows a 45% spike in Live Event bookings in early July. Top-deployed audio mixers are nearing thresholds.",
      window: "June 20 - June 28",
      actionText: "ACTION REQUIRED",
      actionPrimary: true,
    },
    {
      id: 2,
      title: "Projector Units",
      priority: "MEDIUM PRIORITY",
      isHighPriority: false,
      icon: <Activity size={18} className="text-orange-500" />,
      description:
        "Steady deployment rate. 2 units are 3 deployments away from threshold. Minor corporate events peaking mid-August.",
      window: "Late July",
      actionText: "DISMISS",
      actionPrimary: false,
    },
  ]);

  const fetchMaintenanceLogs = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setMaintenanceLogs([]);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/maintenance-logs/", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!response.ok) {
        console.error("Failed to load maintenance logs:", await response.text());
        setMaintenanceLogs([]);
        return;
      }

      const data = await response.json();
      setMaintenanceLogs(data);
    } catch (err) {
      console.error(err);
      setMaintenanceLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipmentOptions = async () => {
    // Equipment list is read-only here, so a direct Supabase select is fine.
    const { data, error } = await supabase.from("equipment").select("id, name").order("name");
    if (!error && data) setEquipmentOptions(data);
  };

  useEffect(() => {
    fetchMaintenanceLogs();
    fetchEquipmentOptions();
  }, []);

  const updateLogStatus = async (logId, newStatus, resolutionNotes) => {
    setActioningId(logId);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const response = await fetch(`http://127.0.0.1:8000/maintenance-logs/${logId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          resolution_notes: resolutionNotes ?? null,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to update log");
      }

      await fetchMaintenanceLogs();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update maintenance log.");
    } finally {
      setActioningId(null);
    }
  };

  const handleStartWork = (log) => updateLogStatus(log.id, "in_progress");

  const handleMarkResolved = (log) => {
    setResolvingLog(log);
    setResolveNotes("Resolved — checked and back in service.");
  };

  const handleConfirmResolve = () => {
    if (!resolvingLog) return;
    updateLogStatus(resolvingLog.id, "resolved", resolveNotes);
    setResolvingLog(null);
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setReportError("");

    if (!reportEquipmentId || !reportDescription.trim()) {
      setReportError("Please select equipment and describe the issue.");
      return;
    }

    setReportSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const response = await fetch("http://127.0.0.1:8000/maintenance-logs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          equipment_id: parseInt(reportEquipmentId, 10),
          issue_description: reportDescription.trim(),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to report issue.");
      }

      setShowReportModal(false);
      setReportEquipmentId("");
      setReportDescription("");
      await fetchMaintenanceLogs();
    } catch (err) {
      setReportError(err.message || "Failed to report issue.");
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleDismissArima = (id) => {
    setArimaInsightsData((prev) => prev.filter((item) => item.id !== id));
  };

  // Derived views from the one real dataset
  const openLogs = maintenanceLogs.filter((l) => l.status !== "resolved");
  const resolvedLogs = maintenanceLogs.filter((l) => l.status === "resolved");

  const filteredQueue = openLogs.filter((l) => {
    const name = l.equipment?.name || "";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.issue_description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const reportedCount = maintenanceLogs.filter((l) => l.status === "reported").length;
  const inProgressCount = maintenanceLogs.filter((l) => l.status === "in_progress").length;

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      {/* Module Title Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
            Maintenance Module
          </h1>
          <p className="text-xs text-neutral-400">
            Equipment defect reporting, resolution tracking, and predictive maintenance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowReportModal(true)}
          className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer shadow-lg shadow-red-950/40 flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Report Issue</span>
        </button>
      </div>

      {/* Top Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-center text-red-500 shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <p className="text-3xl font-black text-white leading-none mb-1">{reportedCount}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Newly Reported
            </p>
          </div>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-center text-blue-500 shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-3xl font-black text-white leading-none mb-1">{inProgressCount}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              In Progress
            </p>
          </div>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="text-3xl font-black text-white leading-none mb-1">{resolvedLogs.length}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Resolved
            </p>
          </div>
        </div>

        {/* ARIMA Forecast Trigger Card (still mock — FR-13, separate scope) */}
        <div
          onClick={() => setActiveTab("arima")}
          className="bg-[#0f121a] border border-red-900/40 hover:border-red-600 rounded-2xl p-6 flex items-center justify-between cursor-pointer group transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-center text-red-500 shrink-0">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-3xl font-black text-white leading-none mb-1">{arimaInsightsData.length} Alerts</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                ARIMA Forecast
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-neutral-600 group-hover:text-red-500 transition-colors" />
        </div>
      </div>

      {/* Main Panel Box */}
      <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-[#1b212f] text-xs font-black uppercase tracking-wider overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("action_queue")}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "action_queue"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <AlertTriangle size={14} />
            <span>Action Queue</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "logs"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <CheckCircle size={14} />
            <span>Maintenance Logs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("arima")}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "arima"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Activity size={14} />
            <span>ARIMA Insights</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* SUB-TAB 1: ACTION QUEUE — real open (reported/in_progress) logs */}
        {/* ============================================================== */}
        {activeTab === "action_queue" && (
          <div className="space-y-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search equipment or issue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            {loading && <p className="text-neutral-500 text-sm">Loading...</p>}

            {!loading && filteredQueue.length === 0 && (
              <div className="bg-[#090b10] border border-[#1b212f] rounded-2xl p-8 text-center text-neutral-400 text-sm">
                No open issues right now.
              </div>
            )}

            <div className="space-y-4">
              {filteredQueue.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#090b10] border border-[#1b212f] rounded-2xl p-6 space-y-4 hover:border-neutral-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="text-sm font-black uppercase text-white tracking-wide">
                          {log.equipment?.name || "Unknown equipment"}
                        </h3>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                            log.status === "reported"
                              ? "bg-amber-950/40 text-amber-500 border-amber-800/50"
                              : "bg-blue-950/40 text-blue-400 border-blue-800/50"
                          }`}
                        >
                          {log.status === "reported" ? "REPORTED" : "IN PROGRESS"}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                        Reported by {log.reported_by_name || "Unknown"}
                        {log.reported_at ? ` • ${log.reported_at.split("T")[0]}` : ""}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {log.status === "reported" && (
                        <button
                          type="button"
                          disabled={actioningId === log.id}
                          onClick={() => handleStartWork(log)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer shadow-lg shadow-blue-950/50 flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Wrench size={14} />
                          <span>{actioningId === log.id ? "..." : "Start Work"}</span>
                        </button>
                      )}
                      {log.status === "in_progress" && (
                        <button
                          type="button"
                          disabled={actioningId === log.id}
                          onClick={() => handleMarkResolved(log)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <CheckCircle2 size={14} />
                          <span>{actioningId === log.id ? "..." : "Mark Resolved"}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#0f121a] border border-[#1b212f] rounded-xl p-4 text-xs">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-0.5">
                      Reported Issue:
                    </span>
                    <p className="text-neutral-300">{log.issue_description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 2: MAINTENANCE LOGS — real resolved logs                */}
        {/* ============================================================== */}
        {activeTab === "logs" && (
          <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
            {resolvedLogs.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 text-sm">
                No resolved logs yet.
              </div>
            ) : (
              <table className="w-full text-left min-w-[750px] text-xs">
                <thead>
                  <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-[#0b0e14]">
                    <th className="py-4 pl-6">Equipment</th>
                    <th className="py-4">Issue</th>
                    <th className="py-4">Resolution</th>
                    <th className="py-4">Reported By</th>
                    <th className="py-4 pr-6">Resolved At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141824]">
                  {resolvedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#121622] transition-colors">
                      <td className="py-4 pl-6 font-bold text-white">{log.equipment?.name || "Unknown"}</td>
                      <td className="py-4 text-neutral-400">{log.issue_description}</td>
                      <td className="py-4 text-neutral-300">{log.resolution_notes || "—"}</td>
                      <td className="py-4 text-neutral-300 font-medium">{log.reported_by_name || "Unknown"}</td>
                      <td className="py-4 pr-6 text-neutral-400 font-mono text-[11px]">
                        {log.resolved_at ? log.resolved_at.split("T")[0] : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 3: ARIMA INSIGHTS — still mock (FR-13, separate scope)  */}
        {/* ============================================================== */}
        {activeTab === "arima" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-950/40 via-[#151017] to-transparent border border-red-900/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute right-4 top-0 bottom-0 opacity-15 pointer-events-none w-72 flex items-center">
                <svg
                  viewBox="0 0 200 100"
                  className="w-full h-24 stroke-red-500 stroke-[2.5] fill-none"
                >
                  <path d="M0,50 L40,50 L55,15 L75,85 L90,40 L105,60 L120,50 L200,50" />
                </svg>
              </div>

              <div className="relative z-10 max-w-3xl space-y-2">
                <h2 className="flex items-center gap-2 text-xs font-black tracking-widest text-red-500 uppercase">
                  <TrendingUp size={15} />
                  <span>Predictive Maintenance Recommendations</span>
                </h2>
                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  The ARIMA module analyzes booking volumes and equipment deployment frequencies. It identifies upcoming peak periods and recommends preventive maintenance windows before breakdowns occur, ensuring 100% operational capacity when demand spikes.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {arimaInsightsData.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#090b10] border border-[#1b212f] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-neutral-700 transition"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-0.5 w-9 h-9 rounded-xl bg-[#141824] border border-[#1b212f] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="text-sm font-black text-white uppercase tracking-wide">
                          {item.title}
                        </h3>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                            item.isHighPriority
                              ? "bg-red-950/40 text-red-500 border-red-800/50"
                              : "bg-neutral-800 text-neutral-400 border-neutral-700"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-[#1b212f] pt-4 md:pt-0 md:pl-6">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-0.5 uppercase">
                        Recommended Window
                      </p>
                      <p className="text-xs font-black text-white">{item.window}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        item.actionPrimary
                          ? setActiveTab("action_queue")
                          : handleDismissArima(item.id)
                      }
                      className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer ${
                        item.actionPrimary
                          ? "bg-[#142340] text-blue-400 border border-blue-900/60 hover:bg-[#1b315b]"
                          : "bg-[#141824] text-neutral-400 hover:text-white border border-[#1b212f]"
                      }`}
                    >
                      {item.actionText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- MARK RESOLVED MODAL (replaces window.prompt, which some browser contexts block) --- */}
      {resolvingLog && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e121a] border border-[#20293d] rounded-2xl overflow-hidden shadow-2xl text-white font-['Montserrat',sans-serif]">
            <div className="p-5 border-b border-[#1b212f] flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Resolve: {resolvingLog.equipment?.name || "Equipment"}
              </h3>
              <button
                type="button"
                onClick={() => setResolvingLog(null)}
                className="w-8 h-8 rounded-full border border-neutral-700 bg-black/40 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setResolvingLog(null)}
                  className="w-1/2 py-3 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actioningId === resolvingLog.id}
                  onClick={handleConfirmResolve}
                  className="w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
                >
                  {actioningId === resolvingLog.id ? "Saving..." : "Confirm Resolved"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- REPORT ISSUE MODAL --- */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e121a] border border-[#20293d] rounded-2xl overflow-hidden shadow-2xl text-white font-['Montserrat',sans-serif]">
            <div className="p-5 border-b border-[#1b212f] flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Report Equipment Issue
              </h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="w-8 h-8 rounded-full border border-neutral-700 bg-black/40 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-5 space-y-4">
              {reportError && (
                <p className="text-xs text-red-500 font-bold">{reportError}</p>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Equipment
                </label>
                <select
                  value={reportEquipmentId}
                  onChange={(e) => setReportEquipmentId(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                >
                  <option value="">Select equipment...</option>
                  {equipmentOptions.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Issue Description
                </label>
                <textarea
                  rows={3}
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Describe the defect or concern..."
                  className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={reportSubmitting}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest transition cursor-pointer disabled:opacity-50"
              >
                {reportSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
