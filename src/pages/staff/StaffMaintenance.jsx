import React, { useState } from "react";
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

const StaffMaintenance = () => {
  const [subTab, setSubTab] = useState("action_queue"); // "action_queue" | "my_tasks" | "my_completed" | "logs"
  const [searchQuery, setSearchQuery] = useState("");

  // Modal & Toast States
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flaggedToast, setFlaggedToast] = useState(false);
  const [flagItemName, setFlagItemName] = useState("");
  const [flagPriority, setFlagPriority] = useState("high");
  const [flagIssue, setFlagIssue] = useState("");

  // Active Tasks in Queue
  const [actionQueue, setActionQueue] = useState([
    {
      id: "task-1",
      equipment: "Cameras (Unit 3)",
      priority: "HIGH PRIORITY",
      priorityColor: "red",
      source: "POST-EVENT LOG",
      status: "IN PROGRESS",
      reportedIssue: "Staff reported: Lens scratch / focus ring stuck",
      date: "2026-06-05",
      staff: "Juan dela Cruz",
      assignedToMe: true,
    },
    {
      id: "task-2",
      equipment: "Switcher (Unit 1)",
      priority: "MEDIUM PRIORITY",
      priorityColor: "amber",
      source: "USAGE THRESHOLD",
      status: "SCHEDULED",
      reportedIssue: "Reached 10 deployments. Routine checkup required.",
      date: "2026-06-08",
      staff: "Jose Reyes",
      assignedText: "Assigned to Jose Reyes",
      assignedToMe: false,
    },
    {
      id: "task-3",
      equipment: "DM3 Audio Mixer",
      priority: "MEDIUM PRIORITY",
      priorityColor: "amber",
      source: "USAGE THRESHOLD",
      status: "AWAITING SCHEDULE",
      reportedIssue: "Reached 5 deployments. Audio calibration needed.",
      date: "2026-06-10",
      staff: "System",
      assignedText: "Not yet assigned",
      assignedToMe: false,
    },
    {
      id: "task-4",
      equipment: "HDMI Cables (Set)",
      priority: "LOW PRIORITY",
      priorityColor: "blue",
      source: "MANUAL",
      status: "SCHEDULED",
      reportedIssue: "Fraying on 3 cables reported previously.",
      date: "2026-06-10",
      staff: "Maintenance Team",
      assignedText: "Assigned to Maintenance Team",
      assignedToMe: false,
    },
  ]);

  // Completed Items
  const [completedList, setCompletedList] = useState([
    {
      id: "comp-1",
      equipment: "Cameras (Unit 3)",
      date: "2026-06-05",
      issue: "Post-Event Log",
      resolution: "Replaced the lens",
      condition: "EXCELLENT",
    },
  ]);

  // Maintenance Logs
  const [maintenanceLogs] = useState([
    {
      id: "log-1",
      equipment: "LED Bar (Unit 5)",
      trigger: "Post-Event log",
      resolution: "Replaced LED driver board. All color channels now functioning properly.",
      technician: "Jose Reyes",
      condition: "GOOD",
    },
  ]);

  // Complete work handler
  const handleMarkComplete = (task) => {
    setActionQueue((prev) => prev.filter((t) => t.id !== task.id));
    setCompletedList((prev) => [
      {
        id: `comp-${Date.now()}`,
        equipment: task.equipment,
        date: new Date().toISOString().split("T")[0],
        issue: task.source,
        resolution: "Repair completed and verified operational.",
        condition: "EXCELLENT",
      },
      ...prev,
    ]);
  };

  // Submit flag equipment form
  const handleFlagSubmit = (e) => {
    e.preventDefault();
    if (!flagItemName.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      equipment: flagItemName.trim(),
      priority: flagPriority === "high" ? "HIGH PRIORITY" : "MEDIUM PRIORITY",
      priorityColor: flagPriority === "high" ? "red" : "amber",
      source: "STAFF REPORT",
      status: "AWAITING SCHEDULE",
      reportedIssue: flagIssue.trim() || "Staff reported maintenance check needed.",
      date: new Date().toISOString().split("T")[0],
      staff: "Staff Member",
      assignedText: "Pending Admin Assignment",
      assignedToMe: false,
    };

    setActionQueue((prev) => [newTask, ...prev]);
    setShowFlagModal(false);
    setFlagItemName("");
    setFlagIssue("");

    // Show toast
    setFlaggedToast(true);
    setTimeout(() => setFlaggedToast(false), 4500);
  };

  // Metric Computations
  const flaggedCount = actionQueue.length;
  const inProgressCount = actionQueue.filter((t) => t.status === "IN PROGRESS").length;
  const scheduledCount = actionQueue.filter((t) => t.status === "SCHEDULED" || t.status === "AWAITING SCHEDULE").length;
  const completedCount = completedList.length;

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      {/* Toast Notification (Matching image_e7bc04.png) */}
      {flaggedToast && (
        <div className="fixed top-8 right-8 z-[200] bg-[#eefbf3] border border-[#a7f3d0] text-[#065f46] rounded-2xl p-5 shadow-2xl flex items-start gap-3.5 max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-6 h-6 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Check size={14} strokeWidth={3} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#064e3b] leading-tight">
              Equipment flagged for maintenance
            </h4>
            <p className="text-xs text-[#047857] mt-1 leading-relaxed">
              Admin will review and schedule the repair.
            </p>
          </div>
        </div>
      )}

      {/* Title & Top Flag Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-white">
            Equipment Maintenance
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Your assigned maintenance tasks and repair history
          </p>
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

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-500 shrink-0">
              <AlertTriangle size={16} />
            </div>
            <h2 className="text-3xl font-black text-white">{flaggedCount}</h2>
          </div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 mt-2">
            Flagged Issues
          </p>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-500 shrink-0">
              <Calendar size={16} />
            </div>
            <h2 className="text-3xl font-black text-white">{scheduledCount}</h2>
          </div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 mt-2">
            Scheduled
          </p>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-center text-blue-500 shrink-0">
              <Clock size={16} />
            </div>
            <h2 className="text-3xl font-black text-white">{inProgressCount}</h2>
          </div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 mt-2">
            In Progress
          </p>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-500 shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <h2 className="text-3xl font-black text-white">{completedCount}</h2>
          </div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 mt-2">
            Completed
          </p>
        </div>
      </div>

      {/* Main Panel Box */}
      <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-[#1b212f] text-xs font-black uppercase tracking-wider overflow-x-auto">
          <button
            type="button"
            onClick={() => setSubTab("action_queue")}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              subTab === "action_queue"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <AlertTriangle size={14} />
            <span>Action Queue</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("my_tasks")}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              subTab === "my_tasks"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Wrench size={14} />
            <span>My Tasks</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("my_completed")}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              subTab === "my_completed"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <CheckCircle2 size={14} />
            <span>My Completed</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("logs")}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              subTab === "logs"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <ClipboardList size={14} />
            <span>Maintenance Logs</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        {(subTab === "action_queue" || subTab === "my_tasks") && (
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
              />
            </div>
            <button
              type="button"
              className="bg-[#090b10] border border-[#1b212f] hover:border-neutral-600 text-neutral-300 text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition cursor-pointer"
            >
              <Filter size={15} />
              <span>Filter</span>
            </button>
          </div>
        )}

        {subTab === "logs" && (
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search maintenance logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 1: ACTION QUEUE (Image e7bba7.jpg)                      */}
        {/* ============================================================== */}
        {subTab === "action_queue" && (
          <div className="space-y-4">
            {actionQueue.map((item) => (
              <div
                key={item.id}
                className="bg-[#090b10] border border-[#1b212f] rounded-2xl p-6 space-y-4 hover:border-neutral-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <h3 className="text-sm font-black uppercase text-white tracking-wide">
                        {item.equipment}
                      </h3>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                          item.priorityColor === "red"
                            ? "bg-red-950/40 text-red-500 border-red-800/50"
                            : item.priorityColor === "amber"
                            ? "bg-amber-950/40 text-amber-500 border-amber-800/50"
                            : "bg-blue-950/40 text-blue-400 border-blue-800/50"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      <span className="flex items-center gap-1 text-orange-500">
                        <AlertTriangle size={11} /> {item.source}
                      </span>
                      <span>•</span>
                      <span className={item.status === "IN PROGRESS" ? "text-blue-500" : "text-neutral-400"}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {item.status === "IN PROGRESS" ? (
                    <button
                      type="button"
                      onClick={() => handleMarkComplete(item)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40 self-start sm:self-auto"
                    >
                      <CheckCircle2 size={14} />
                      <span>Complete Work</span>
                    </button>
                  ) : (
                    <span className="text-[11px] italic text-neutral-500 pt-1">
                      {item.assignedText}
                    </span>
                  )}
                </div>

                {/* Reported Issue Box */}
                <div className="bg-[#0f121a] border border-[#1b212f] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-0.5">
                      Reported Issue:
                    </span>
                    <p className="text-neutral-300">{item.reportedIssue}</p>
                  </div>

                  {item.priorityColor === "red" && (
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 self-start sm:self-auto"
                    >
                      <AlertTriangle size={12} />
                      <span>View Evidence</span>
                    </button>
                  )}
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center gap-5 text-[11px] text-neutral-500 font-mono pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-neutral-600" /> {item.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UserIcon size={13} className="text-neutral-600" /> {item.staff}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 2: MY TASKS (Image e7bbc1.jpg)                          */}
        {/* ============================================================== */}
        {subTab === "my_tasks" && (
          <div className="space-y-4">
            {actionQueue
              .filter((t) => t.assignedToMe)
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-[#090b10] border border-[#1b212f] rounded-2xl p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="text-sm font-black uppercase text-white tracking-wide">
                          {task.equipment}
                        </h3>
                        <span className="bg-red-950/40 text-red-500 border border-red-800/50 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                        <span className="flex items-center gap-1 text-orange-500">
                          <AlertTriangle size={11} /> {task.source}
                        </span>
                        <span>•</span>
                        <span className="text-blue-500 font-bold uppercase">Working on it</span>
                      </div>
                    </div>
                  </div>

                  {/* Task Card details */}
                  <div className="bg-[#0f121a] border border-[#1b212f] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-0.5">
                        Issue Description:
                      </span>
                      <p className="text-xs text-neutral-300 mb-2">
                        {task.reportedIssue}
                      </p>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
                      >
                        <AlertTriangle size={12} />
                        <span>View Photo Evidence</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMarkComplete(task)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 self-start sm:self-auto shrink-0"
                    >
                      <CheckCircle2 size={15} />
                      <span>Mark Complete</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-red-500 font-bold uppercase tracking-widest pt-1">
                    <Calendar size={12} />
                    <span>Scheduled: {task.date}</span>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 3: MY COMPLETED (Image e7bbc8.jpg)                      */}
        {/* ============================================================== */}
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
                {completedList.map((comp) => (
                  <tr key={comp.id} className="hover:bg-[#121622] transition-colors">
                    <td className="py-4 pl-6 font-bold text-white">{comp.equipment}</td>
                    <td className="py-4 text-neutral-400 font-mono text-[11px]">
                      {comp.date}
                    </td>
                    <td className="py-4 text-neutral-400">{comp.issue}</td>
                    <td className="py-4 text-neutral-300">{comp.resolution}</td>
                    <td className="py-4 pr-6">
                      <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                        {comp.condition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 4: MAINTENANCE LOGS (Image e7bbe3.jpg)                  */}
        {/* ============================================================== */}
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
                {maintenanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#121622] transition-colors">
                    <td className="py-4 pl-6 font-bold text-white">{log.equipment}</td>
                    <td className="py-4 text-neutral-400">{log.trigger}</td>
                    <td className="py-4 text-neutral-300 max-w-sm leading-snug">
                      {log.resolution}
                    </td>
                    <td className="py-4 text-neutral-300 font-medium">{log.technician}</td>
                    <td className="py-4 pr-6">
                      <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                        {log.condition}
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
                Equipment Unit / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cameras (Unit 3)"
                value={flagItemName}
                onChange={(e) => setFlagItemName(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-xs text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={flagPriority}
                onChange={(e) => setFlagPriority(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-xs text-neutral-300 focus:border-red-600 focus:outline-none"
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
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg shadow-red-950/50"
              >
                Submit Issue
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StaffMaintenance;