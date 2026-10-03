import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import {
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle2,
  Wrench,
  Search,
  Filter,
  ClipboardList,
  User as UserIcon,
  X,
  Check,
} from "lucide-react";

// ------------------------------------------------------------------
// TABLE: maintenance_logs
// existing: id, equipment_id, reported_by, issue_description,
//           status (reported | in_progress | resolved),
//           reported_at, resolved_at, resolution_notes
// added by the SQL migration: priority, source, assigned_to,
//           scheduled_date, evidence_url, resolved_by, new_condition
// ------------------------------------------------------------------
const PRIORITY = {
  high: { label: "HIGH PRIORITY", color: "red" },
  medium: { label: "MEDIUM PRIORITY", color: "amber" },
  low: { label: "LOW PRIORITY", color: "blue" },
};

const SOURCE_LABEL = {
  post_event: "POST-EVENT LOG",
  usage_threshold: "USAGE THRESHOLD",
  manual: "MANUAL",
  staff_report: "STAFF REPORT",
};

const conditionClass = (c) =>
  c === "EXCELLENT" || c === "GOOD"
    ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/50"
    : c === "FAIR"
    ? "bg-amber-950/40 text-amber-400 border-amber-800/50"
    : c === "POOR"
    ? "bg-red-950/40 text-red-400 border-red-800/50"
    : "bg-neutral-900 text-neutral-500 border-neutral-800";

const StaffMaintenance = () => {
  const [subTab, setSubTab] = useState("action_queue"); // "action_queue" | "my_tasks" | "my_completed" | "logs"
  const [searchQuery, setSearchQuery] = useState("");

  // Data
  const [rows, setRows] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // Flag modal & toast
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flaggedToast, setFlaggedToast] = useState(false);
  const [flagEquipmentId, setFlagEquipmentId] = useState("");
  const [flagPriority, setFlagPriority] = useState("high");
  const [flagIssue, setFlagIssue] = useState("");

  // Complete-work modal
  const [completeTask, setCompleteTask] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [newCondition, setNewCondition] = useState("excellent");

  // ================================================================
  // Load everything
  // ================================================================
  const loadData = async () => {
    setError(null);

    const { data: authData } = await supabase.auth.getUser();
    setMe(authData?.user?.id || null);

    const [logsRes, eqRes, usersRes] = await Promise.all([
      supabase.from("maintenance_logs").select("*").order("reported_at", { ascending: false }),
      supabase.from("equipment").select("id, name").order("name"),
      supabase.from("users").select("id, name"),
    ]);

    if (logsRes.error) {
      console.error("Failed to load maintenance logs:", logsRes.error);
      setError(logsRes.error.message);
      setLoading(false);
      return;
    }

    const eqMap = Object.fromEntries((eqRes.data || []).map((e) => [e.id, e.name]));
    const userMap = Object.fromEntries((usersRes.data || []).map((u) => [u.id, u.name]));
    setEquipmentList(eqRes.data || []);

    setRows(
      (logsRes.data || []).map((r) => ({
        id: r.id,
        equipment: eqMap[r.equipment_id] || `Equipment #${r.equipment_id}`,
        priority: r.priority || "medium",
        source: r.source || "manual",
        dbStatus: r.status, // reported | in_progress | resolved
        assignedTo: r.assigned_to || null,
        assignedName: userMap[r.assigned_to] || null,
        reportedBy: userMap[r.reported_by] || "Unknown",
        issue: r.issue_description || "—",
        reportedDate: (r.reported_at || "").slice(0, 10),
        scheduledDate: r.scheduled_date || null,
        resolvedDate: (r.resolved_at || "").slice(0, 10),
        resolvedBy: r.resolved_by || null,
        technician: userMap[r.resolved_by] || userMap[r.assigned_to] || "—",
        resolution: r.resolution_notes || "—",
        newCondition: (r.new_condition || "").toUpperCase(),
        evidenceUrl: r.evidence_url || null,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================================================================
  // Actions
  // ================================================================
  const displayStatus = (r) =>
    r.dbStatus === "in_progress" ? "IN PROGRESS" : r.assignedTo ? "SCHEDULED" : "AWAITING SCHEDULE";

  const startWork = async (row) => {
    setBusy(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("maintenance_logs")
      .update({ status: "in_progress" })
      .eq("id", row.id)
      .select();
    setBusy(false);

    if (err || !data || data.length === 0) {
      setError(err?.message || "Could not start this task. Check that it is assigned to you.");
      return;
    }
    await loadData();
  };

  const openComplete = (row) => {
    setCompleteTask(row);
    setResolutionNotes("");
    setNewCondition("excellent");
  };

  const submitComplete = async (e) => {
    e.preventDefault();
    if (!completeTask || !resolutionNotes.trim()) return;

    setBusy(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("maintenance_logs")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
        resolved_by: me,
        resolution_notes: resolutionNotes.trim(),
        new_condition: newCondition,
      })
      .eq("id", completeTask.id)
      .select();
    setBusy(false);

    if (err || !data || data.length === 0) {
      setError(err?.message || "Could not complete this task. Check that it is assigned to you.");
      return;
    }
    setCompleteTask(null);
    await loadData();
  };

  const handleFlagSubmit = async (e) => {
    e.preventDefault();
    if (!flagEquipmentId) return;

    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from("maintenance_logs").insert({
      equipment_id: parseInt(flagEquipmentId, 10),
      issue_description: flagIssue.trim() || "Staff reported maintenance check needed.",
      priority: flagPriority,
      source: "staff_report",
      status: "reported",
      reported_by: me,
    });
    setBusy(false);

    if (err) {
      console.error("Failed to flag equipment:", err);
      setError(err.message);
      return;
    }

    setShowFlagModal(false);
    setFlagEquipmentId("");
    setFlagIssue("");
    setFlagPriority("high");
    await loadData();

    setFlaggedToast(true);
    setTimeout(() => setFlaggedToast(false), 4500);
  };

  // ================================================================
  // Derived lists & metrics
  // ================================================================
  const matches = (r) =>
    r.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.issue.toLowerCase().includes(searchQuery.toLowerCase());

  const openRows = rows.filter((r) => r.dbStatus !== "resolved");
  const resolvedRows = rows.filter((r) => r.dbStatus === "resolved");
  const myTasks = openRows.filter((r) => r.assignedTo && r.assignedTo === me);
  const myCompleted = resolvedRows.filter((r) => r.resolvedBy === me || r.assignedTo === me);

  const flaggedCount = openRows.length;
  const inProgressCount = openRows.filter((r) => r.dbStatus === "in_progress").length;
  const scheduledCount = openRows.filter((r) => r.dbStatus === "reported").length;
  const completedCount = myCompleted.length;

  // ================================================================
  // Task card (shared by Action Queue and My Tasks)
  // ================================================================
  const renderTask = (item) => {
    const p = PRIORITY[item.priority] || PRIORITY.medium;
    const status = displayStatus(item);
    const mine = item.assignedTo && item.assignedTo === me;

    return (
      <div
        key={item.id}
        className="bg-[#090b10] border border-[#1b212f] rounded-2xl p-6 space-y-4 hover:border-neutral-700 transition"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <h3 className="text-sm font-black uppercase text-white tracking-wide">{item.equipment}</h3>
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                  p.color === "red"
                    ? "bg-red-950/40 text-red-500 border-red-800/50"
                    : p.color === "amber"
                    ? "bg-amber-950/40 text-amber-500 border-amber-800/50"
                    : "bg-blue-950/40 text-blue-400 border-blue-800/50"
                }`}
              >
                {p.label}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <span className="flex items-center gap-1 text-orange-500">
                <AlertTriangle size={11} /> {SOURCE_LABEL[item.source] || item.source}
              </span>
              <span>•</span>
              <span className={status === "IN PROGRESS" ? "text-blue-500" : "text-neutral-400"}>{status}</span>
            </div>
          </div>

          {/* Actions */}
          {mine && item.dbStatus === "in_progress" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => openComplete(item)}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40 self-start sm:self-auto"
            >
              <CheckCircle2 size={14} />
              <span>Complete Work</span>
            </button>
          ) : mine && item.dbStatus === "reported" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => startWork(item)}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-950/40 self-start sm:self-auto"
            >
              <Wrench size={14} />
              <span>Start Work</span>
            </button>
          ) : (
            <span className="text-[11px] italic text-neutral-500 pt-1">
              {item.assignedName ? `Assigned to ${item.assignedName}` : "Not yet assigned"}
            </span>
          )}
        </div>

        {/* Reported Issue Box */}
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-0.5">
              Reported Issue:
            </span>
            <p className="text-neutral-300">{item.issue}</p>
          </div>

          {item.evidenceUrl && (
            <a
              href={item.evidenceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-red-500 hover:text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 self-start sm:self-auto"
            >
              <AlertTriangle size={12} />
              <span>View Evidence</span>
            </a>
          )}
        </div>

        {/* Footer Metadata */}
        <div className="flex items-center gap-5 text-[11px] text-neutral-500 font-mono pt-1">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-neutral-600" />
            {item.scheduledDate ? `Scheduled ${item.scheduledDate}` : item.reportedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <UserIcon size={13} className="text-neutral-600" /> {item.reportedBy}
          </span>
        </div>
      </div>
    );
  };

  const tabClass = (tab) =>
    `pb-3.5 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
      subTab === tab ? "text-red-600 border-b-2 border-red-600" : "text-neutral-400 hover:text-white"
    }`;

  const statCard = (icon, bg, count, label) => (
    <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex flex-col justify-between min-h-[110px]">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>{icon}</div>
        <h2 className="text-3xl font-black text-white">{count}</h2>
      </div>
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 mt-2">{label}</p>
    </div>
  );

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      {/* Toast Notification */}
      {flaggedToast && (
        <div className="fixed top-8 right-8 z-[200] bg-[#eefbf3] border border-[#a7f3d0] text-[#065f46] rounded-2xl p-5 shadow-2xl flex items-start gap-3.5 max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-6 h-6 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Check size={14} strokeWidth={3} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#064e3b] leading-tight">Equipment flagged for maintenance</h4>
            <p className="text-xs text-[#047857] mt-1 leading-relaxed">Admin will review and schedule the repair.</p>
          </div>
        </div>
      )}

      {/* Title & Top Flag Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-white">Equipment Maintenance</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Your assigned maintenance tasks and repair history</p>
        </div>

        <button
          type="button"
          onClick={() => setShowFlagModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <AlertTriangle size={15} />
          <span>Flag Equipment Issue</span>
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3">{error}</p>
      )}

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCard(<AlertTriangle size={16} className="text-red-500" />, "bg-red-950/40 border-red-800/40", flaggedCount, "Flagged Issues")}
        {statCard(<Calendar size={16} className="text-amber-500" />, "bg-amber-950/40 border-amber-800/40", scheduledCount, "Scheduled")}
        {statCard(<Clock size={16} className="text-blue-500" />, "bg-blue-950/40 border-blue-800/40", inProgressCount, "In Progress")}
        {statCard(<CheckCircle2 size={16} className="text-emerald-500" />, "bg-emerald-950/40 border-emerald-800/40", completedCount, "Completed")}
      </div>

      {/* Main Panel Box */}
      <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-[#1b212f] text-xs font-black uppercase tracking-wider overflow-x-auto">
          <button type="button" onClick={() => setSubTab("action_queue")} className={tabClass("action_queue")}>
            <AlertTriangle size={14} />
            <span>Action Queue</span>
          </button>
          <button type="button" onClick={() => setSubTab("my_tasks")} className={tabClass("my_tasks")}>
            <Wrench size={14} />
            <span>My Tasks</span>
          </button>
          <button type="button" onClick={() => setSubTab("my_completed")} className={tabClass("my_completed")}>
            <CheckCircle2 size={14} />
            <span>My Completed</span>
          </button>
          <button type="button" onClick={() => setSubTab("logs")} className={tabClass("logs")}>
            <ClipboardList size={14} />
            <span>Maintenance Logs</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder={subTab === "logs" ? "Search maintenance logs..." : "Search equipment..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
            />
          </div>
          {(subTab === "action_queue" || subTab === "my_tasks") && (
            <button
              type="button"
              className="bg-[#090b10] border border-[#1b212f] hover:border-neutral-600 text-neutral-300 text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition cursor-pointer"
            >
              <Filter size={15} />
              <span>Filter</span>
            </button>
          )}
        </div>

        {loading && <p className="text-xs text-neutral-500">Loading maintenance data...</p>}

        {/* ACTION QUEUE */}
        {subTab === "action_queue" && (
          <div className="space-y-4">
            {!loading && openRows.filter(matches).length === 0 && (
              <p className="text-xs text-neutral-500">No open maintenance issues.</p>
            )}
            {openRows.filter(matches).map(renderTask)}
          </div>
        )}

        {/* MY TASKS */}
        {subTab === "my_tasks" && (
          <div className="space-y-4">
            {!loading && myTasks.filter(matches).length === 0 && (
              <p className="text-xs text-neutral-500">No tasks are assigned to you right now.</p>
            )}
            {myTasks.filter(matches).map(renderTask)}
          </div>
        )}

        {/* MY COMPLETED */}
        {subTab === "my_completed" && (
          <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
            <table className="w-full text-left min-w-[780px] text-xs">
              <thead>
                <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-[#0b0e14]">
                  <th className="py-4 pl-6">Equipment</th>
                  <th className="py-4">Completed Date</th>
                  <th className="py-4">Issue</th>
                  <th className="py-4">Resolution</th>
                  <th className="py-4 pr-6">New Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141824]">
                {!loading && myCompleted.filter(matches).length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                      You haven't completed any repairs yet.
                    </td>
                  </tr>
                )}
                {myCompleted.filter(matches).map((comp) => (
                  <tr key={comp.id} className="hover:bg-[#121622] transition-colors">
                    <td className="py-4 pl-6 font-bold text-white">{comp.equipment}</td>
                    <td className="py-4 text-neutral-400 font-mono text-[11px]">{comp.resolvedDate}</td>
                    <td className="py-4 text-neutral-400 max-w-xs truncate">{comp.issue}</td>
                    <td className="py-4 text-neutral-300">{comp.resolution}</td>
                    <td className="py-4 pr-6">
                      <span
                        className={`border text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${conditionClass(
                          comp.newCondition
                        )}`}
                      >
                        {comp.newCondition || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MAINTENANCE LOGS */}
        {subTab === "logs" && (
          <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
            <table className="w-full text-left min-w-[800px] text-xs">
              <thead>
                <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-[#0b0e14]">
                  <th className="py-4 pl-6">Equipment</th>
                  <th className="py-4">Trigger</th>
                  <th className="py-4">Resolution</th>
                  <th className="py-4">Technician</th>
                  <th className="py-4 pr-6">New Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141824]">
                {!loading && resolvedRows.filter(matches).length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                      No completed maintenance yet.
                    </td>
                  </tr>
                )}
                {resolvedRows.filter(matches).map((log) => (
                  <tr key={log.id} className="hover:bg-[#121622] transition-colors">
                    <td className="py-4 pl-6 font-bold text-white">{log.equipment}</td>
                    <td className="py-4 text-neutral-400">{SOURCE_LABEL[log.source] || log.source}</td>
                    <td className="py-4 text-neutral-300 max-w-sm leading-snug">{log.resolution}</td>
                    <td className="py-4 text-neutral-300 font-medium">{log.technician}</td>
                    <td className="py-4 pr-6">
                      <span
                        className={`border text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${conditionClass(
                          log.newCondition
                        )}`}
                      >
                        {log.newCondition || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Flag Equipment Issue Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleFlagSubmit}
            className="w-full max-w-md bg-[#0e121a] border border-red-600/50 rounded-2xl p-6 space-y-4 shadow-2xl text-white animate-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <div className="flex items-center gap-2 text-red-500 font-black text-sm uppercase">
                <AlertTriangle size={18} />
                <span>Flag Equipment Issue</span>
              </div>
              <button
                type="button"
                onClick={() => setShowFlagModal(false)}
                className="text-neutral-500 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Equipment *
              </label>
              <select
                required
                value={flagEquipmentId}
                onChange={(e) => setFlagEquipmentId(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-xs text-white focus:border-red-600 focus:outline-none cursor-pointer"
              >
                <option value="">Select equipment...</option>
                {equipmentList.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={flagPriority}
                onChange={(e) => setFlagPriority(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-xs text-neutral-300 focus:border-red-600 focus:outline-none cursor-pointer"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Observed Issue / Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Lens scratch / focus ring stuck during event ingress..."
                value={flagIssue}
                onChange={(e) => setFlagIssue(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl p-3 text-xs text-white focus:border-red-600 focus:outline-none resize-none placeholder:text-neutral-600"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFlagModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg shadow-red-950/50"
              >
                Submit Issue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Complete Work Modal */}
      {completeTask && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={submitComplete}
            className="w-full max-w-md bg-[#0e121a] border border-emerald-600/50 rounded-2xl p-6 space-y-4 shadow-2xl text-white animate-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <div className="flex items-center gap-2 text-emerald-500 font-black text-sm uppercase">
                <CheckCircle2 size={18} />
                <span>Complete Work</span>
              </div>
              <button
                type="button"
                onClick={() => setCompleteTask(null)}
                className="text-neutral-500 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              <span className="font-bold text-white">{completeTask.equipment}</span>: {completeTask.issue}
            </p>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                What was done *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Replaced the lens and recalibrated autofocus."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl p-3 text-xs text-white focus:border-emerald-600 focus:outline-none resize-none placeholder:text-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                New condition
              </label>
              <select
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-xs text-neutral-300 focus:border-emerald-600 focus:outline-none cursor-pointer"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCompleteTask(null)}
                className="px-4 py-2.5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                Mark Complete
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StaffMaintenance;
