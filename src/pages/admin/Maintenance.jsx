import React, { useState } from "react";
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  Activity,
  ChevronRight
} from "lucide-react";

const Maintenance = () => {
  // Tabs: 'queue', 'logs', 'arima'
  const [activeTab, setActiveTab] = useState("arima");

  // Mock Data
  const logsData = [
    {
      id: 1,
      equipment: "Cameras (Unit 3)",
      trigger: "Post-Event Log",
      resolution: "The lens is replaced",
      technician: "AVPro Services",
      condition: "EXCELLENT",
    }
  ];

  const arimaInsightsData = [
    {
      id: 1,
      title: "Audio Equipment Fleet",
      priority: "HIGH PRIORITY",
      isHighPriority: true,
      icon: <TrendingUp size={20} className="text-blue-500" />,
      description: "Forecast shows a 45% spike in Live Event bookings in early July. Top-deployed audio mixers are nearing thresholds.",
      window: "June 20 - June 28",
      actionText: "ACTION REQUIRED",
      actionPrimary: true
    },
    {
      id: 2,
      title: "Projector Units",
      priority: "MEDIUM PRIORITY",
      isHighPriority: false,
      icon: <Activity size={20} className="text-orange-500" />,
      description: "Steady deployment rate. 2 units are 3 deployments away from threshold. Minor corporate events peaking mid-August.",
      window: "Late July",
      actionText: "DISMISS",
      actionPrimary: false
    }
  ];

  return (
    <div className="w-full max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1 uppercase tracking-wide">
          Maintenance Module
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Dual-Trigger Equipment Flagging & ARIMA Predictive Maintenance
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Card 1 */}
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-red-950/30 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white leading-none mb-1">2</p>
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider">FLAGGED ISSUES</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-yellow-950/30 flex items-center justify-center">
            <Calendar size={20} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white leading-none mb-1">1</p>
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider">SCHEDULED</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-blue-950/30 flex items-center justify-center">
            <Clock size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white leading-none mb-1">1</p>
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider">IN PROGRESS</p>
          </div>
        </div>

        {/* Card 4 - Highlighted */}
        <div className="bg-white dark:bg-[#111111] border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.05)] rounded-xl p-5 flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-red-600/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-900 dark:text-white leading-none mb-1">2 Alerts</p>
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider">ARIMA FORECAST</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-neutral-600 group-hover:text-red-500 transition-colors" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 min-h-[400px]">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-neutral-200 dark:border-neutral-800 mb-6">
          <button 
            onClick={() => setActiveTab("queue")}
            className={`pb-4 flex items-center gap-2 text-xs font-bold tracking-wide border-b-2 transition-colors ${activeTab === "queue" ? "border-red-600 text-red-600" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            <AlertTriangle size={14} /> ACTION QUEUE
          </button>
          
          <button 
            onClick={() => setActiveTab("logs")}
            className={`pb-4 flex items-center gap-2 text-xs font-bold tracking-wide border-b-2 transition-colors ${activeTab === "logs" ? "border-red-600 text-red-600" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            <CheckCircle size={14} /> MAINTENANCE LOGS
          </button>
          
          <button 
            onClick={() => setActiveTab("arima")}
            className={`pb-4 flex items-center gap-2 text-xs font-bold tracking-wide border-b-2 transition-colors ${activeTab === "arima" ? "border-red-600 text-red-600" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            <Activity size={14} /> ARIMA INSIGHTS
          </button>
        </div>

        {/* Tab Content: Logs */}
        {activeTab === "logs" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="text-[10px] uppercase font-bold text-neutral-500 border-b border-neutral-800">
                <tr>
                  <th className="pb-3 font-bold">EQUIPMENT</th>
                  <th className="pb-3 font-bold">TRIGGER</th>
                  <th className="pb-3 font-bold">RESOLUTION</th>
                  <th className="pb-3 font-bold">TECHNICIAN</th>
                  <th className="pb-3 font-bold">NEW CONDITION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {logsData.map((log) => (
                  <tr key={log.id} className="text-neutral-300">
                    <td className="py-4 font-semibold text-white">{log.equipment}</td>
                    <td className="py-4">{log.trigger}</td>
                    <td className="py-4">{log.resolution}</td>
                    <td className="py-4">{log.technician}</td>
                    <td className="py-4">
                      <span className="text-[10px] font-bold px-2 py-1 rounded border border-green-900/50 text-green-500 bg-green-950/20">
                        {log.condition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: ARIMA Insights */}
        {activeTab === "arima" && (
          <div className="space-y-4">
            
            {/* Intro Banner */}
            <div className="bg-gradient-to-r from-red-950/30 to-transparent border border-red-900/30 rounded-xl p-6 relative overflow-hidden">
              {/* Background accent line graphic (simulated) */}
              <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none w-64">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-red-500 stroke-[2] fill-none">
                  <path d="M0,50 L20,50 L35,20 L65,80 L80,50 L100,50" />
                </svg>
              </div>
              
              <h2 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                <TrendingUp size={16} className="text-red-500" />
                PREDICTIVE MAINTENANCE RECOMMENDATIONS
              </h2>
              <p className="text-sm text-neutral-400 max-w-3xl leading-relaxed">
                The ARIMA module analyzes booking volumes and equipment deployment frequencies. It identifies upcoming peak periods and recommends preventive maintenance windows before breakdowns occur, ensuring 100% operational capacity when demand spikes.
              </p>
            </div>

            {/* Insight Cards */}
            <div className="space-y-4 pt-2">
              {arimaInsightsData.map((item) => (
                <div key={item.id} className="bg-[#161616] border border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1 w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 border border-neutral-800">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-white text-base">{item.title}</h3>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          item.isHighPriority 
                            ? "border-red-900/50 text-red-500 bg-red-950/20" 
                            : "border-neutral-700 text-neutral-400 bg-neutral-800"
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-6">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-1 uppercase">Recommended Window</p>
                      <p className="font-bold text-white">{item.window}</p>
                    </div>
                    <button className={`ml-4 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                      item.actionPrimary
                        ? "bg-[#1d283a] text-blue-400 hover:bg-[#25344c]"
                        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    }`}>
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