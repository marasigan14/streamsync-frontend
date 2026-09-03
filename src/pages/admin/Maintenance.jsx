import React, { useState } from "react";
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
} from "lucide-react";

const Maintenance = () => {
  // Tabs: 'action_queue', 'logs', 'arima'
  const [activeTab, setActiveTab] = useState("action_queue");
  const [searchQuery, setSearchQuery] = useState("");

  // Action Queue Dataset matching image_e84781.jpg
  const [actionQueue, setActionQueue] = useState([
    {
      id: "q-1",
      equipment: "Switcher (Unit 1)",
      priority: "MEDIUM PRIORITY",
      priorityColor: "amber",
      trigger: "USAGE THRESHOLD",
      subStatus: "DUE FOR INSPECTION / REPAIR",
      subStatusColor: "amber",
      reportedIssue: "Reached 10 deployments. Routine checkup required.",
      actionType: "schedule_repair",
      date: null,
      technician: null,
    },
    {
      id: "q-2",
      equipment: "DM3 Audio Mixer",
      priority: "MEDIUM PRIORITY",
      priorityColor: "amber",
      trigger: "USAGE THRESHOLD",
      subStatus: "DUE FOR INSPECTION / REPAIR",
      subStatusColor: "amber",
      reportedIssue: "Reached 5 deployments. Audio calibration needed.",
      actionType: "schedule_repair",
      date: null,
      technician: null,
    },
    {
      id: "q-3",
      equipment: "LED Bar (Unit 5)",
      priority: "HIGH PRIORITY",
      priorityColor: "red",
      trigger: "POST-EVENT LOG",
      subStatus: "IN-PROGRESS",
      subStatusColor: "blue",
      reportedIssue: "RGB color channel 2 not responding.",
      hasEvidence: true,
      actionType: "complete_work",
      date: "2026-06-06",
      technician: "Jose Reyes",
    },
    {
      id: "q-4",
      equipment: "HDMI Cables (Set)",
      priority: "LOW PRIORITY",
      priorityColor: "blue",
      trigger: "MANUAL",
      subStatus: "SCHEDULED",
      subStatusColor: "neutral",
      reportedIssue: "Fraying on 3 cables reported previously.",
      actionType: "start_maintenance",
      date: "2026-06-10",
      technician: "Maintenance Team",
    },
  ]);

  // Logs Dataset matching image_e84788.jpg
  const [logsData, setLogsData] = useState([
    {
      id: 1,
      equipment: "Cameras (Unit 3)",
      trigger: "Post-Event Log",
      resolution: "The lens is replaced",
      technician: "AVPro Services",
      condition: "EXCELLENT",
    },
  ]);

  // ARIMA Insights Dataset matching image_e8991e.jpg
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

  // Action Button Handlers
  const handleScheduleRepair = (id) => {
    setActionQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              subStatus: "SCHEDULED",
              subStatusColor: "neutral",
              actionType: "start_maintenance",
              date: "2026-06-12",
              technician: "Jose Reyes",
            }
          : item
      )
    );
  };

  const handleStartMaintenance = (id) => {
    setActionQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              subStatus: "IN-PROGRESS",
              subStatusColor: "blue",
              actionType: "complete_work",
            }
          : item
      )
    );
  };

  const handleCompleteWork = (task) => {
    setActionQueue((prev) => prev.filter((item) => item.id !== task.id));
    setLogsData((prev) => [
      {
        id: Date.now(),
        equipment: task.equipment,
        trigger: task.trigger,
        resolution: "Maintenance complete. Bench tested and certified.",
        technician: task.technician || "Internal Maintenance Team",
        condition: "EXCELLENT",
      },
      ...prev,
    ]);
  };

  const handleDismissArima = (id) => {
    setArimaInsightsData((prev) => prev.filter((item) => item.id !== id));
  };

  // Filter queue
  const filteredQueue = actionQueue.filter((item) =>
    item.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.reportedIssue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      {/* Module Title Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
          Maintenance Module
        </h1>
        <p className="text-xs text-neutral-400">
          Dual-Trigger Equipment Flagging & ARIMA Predictive Maintenance
        </p>
      </div>

      {/* Top 4 Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Flagged Issues */}
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-center text-red-500 shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <p className="text-3xl font-black text-white leading-none mb-1">2</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Flagged Issues
            </p>
          </div>
        </div>

        {/* Scheduled */}
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-800/50 flex items-center justify-center text-amber-500 shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-3xl font-black text-white leading-none mb-1">1</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Scheduled
            </p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-center text-blue-500 shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-3xl font-black text-white leading-none mb-1">1</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              In Progress
            </p>
          </div>
        </div>

        {/* ARIMA Forecast Trigger Card */}
        <div
          onClick={() => setActiveTab("arima")}
          className="bg-[#0f121a] border border-red-900/40 hover:border-red-600 rounded-2xl p-6 flex items-center justify-between cursor-pointer group transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-center text-red-500 shrink-0">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-3xl font-black text-white leading-none mb-1">2 Alerts</p>
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
        {/* SUB-TAB 1: ACTION QUEUE (Image e84781.jpg)                      */}
        {/* ============================================================== */}
        {activeTab === "action_queue" && (
          <div className="space-y-6">
            {/* Search & Filter Toolbar */}
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

            {/* Queue Cards */}
            <div className="space-y-4">
              {filteredQueue.map((item) => (
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
                          <AlertTriangle size={11} /> {item.trigger}
                        </span>
                        <span>•</span>
                        <span
                          className={
                            item.subStatusColor === "blue"
                              ? "text-blue-500 font-black"
                              : item.subStatusColor === "amber"
                              ? "text-amber-500"
                              : "text-neutral-400"
                          }
                        >
                          {item.subStatus}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div>
                      {item.actionType === "schedule_repair" && (
                        <button
                          type="button"
                          onClick={() => handleScheduleRepair(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer shadow-lg shadow-red-950/50 flex items-center gap-2"
                        >
                          <Calendar size={14} />
                          <span>Schedule Repair</span>
                        </button>
                      )}

                      {item.actionType === "complete_work" && (
                        <button
                          type="button"
                          onClick={() => handleCompleteWork(item)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={14} />
                          <span>Complete Work</span>
                        </button>
                      )}

                      {item.actionType === "start_maintenance" && (
                        <button
                          type="button"
                          onClick={() => handleStartMaintenance(item.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer shadow-lg shadow-blue-950/50 flex items-center gap-1.5"
                        >
                          <Wrench size={14} />
                          <span>Start Maintenance</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reported Issue Sub-Box */}
                  <div className="bg-[#0f121a] border border-[#1b212f] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-0.5">
                        Reported Issue:
                      </span>
                      <p className="text-neutral-300">{item.reportedIssue}</p>
                    </div>

                    {item.hasEvidence && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
                      >
                        <AlertTriangle size={12} />
                        <span>View Evidence</span>
                      </button>
                    )}
                  </div>

                  {/* Date and Assigned Crew Metadata */}
                  {item.date && (
                    <div className="flex items-center gap-5 text-[11px] text-neutral-500 font-mono pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-neutral-600" /> {item.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        👤 {item.technician}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 2: MAINTENANCE LOGS (Image e84788.jpg)                  */}
        {/* ============================================================== */}
        {activeTab === "logs" && (
          <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
            <table className="w-full text-left min-w-[750px] text-xs">
              <thead>
                <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-[#0b0e14]">
                  <th className="py-4 pl-6">Equipment</th>
                  <th className="py-4">Trigger</th>
                  <th className="py-4">Resolution</th>
                  <th className="py-4">Technician</th>
                  <th className="py-4 pr-6">New Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141824]">
                {logsData.map((log) => (
                  <tr key={log.id} className="hover:bg-[#121622] transition-colors">
                    <td className="py-4 pl-6 font-bold text-white">{log.equipment}</td>
                    <td className="py-4 text-neutral-400">{log.trigger}</td>
                    <td className="py-4 text-neutral-300">{log.resolution}</td>
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

        {/* ============================================================== */}
        {/* SUB-TAB 3: ARIMA INSIGHTS (Image e8991e.jpg)                    */}
        {/* ============================================================== */}
        {activeTab === "arima" && (
          <div className="space-y-6">
            {/* Introductory Gradient Banner */}
            <div className="bg-gradient-to-r from-red-950/40 via-[#151017] to-transparent border border-red-900/30 rounded-2xl p-6 relative overflow-hidden">
              {/* Subtle ECG / Waveform Accent graphic in background */}
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

            {/* ARIMA Forecast Recommendation Cards */}
            <div className="space-y-4">
              {arimaInsightsData.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#090b10] border border-[#1b212f] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-neutral-700 transition"
                >
                  {/* Left Column: Icon & Description */}
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

                  {/* Right Column: Window & Action Button */}
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
    </div>
  );
};

export default Maintenance;