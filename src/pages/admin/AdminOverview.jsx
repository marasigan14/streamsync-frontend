import React, { useState, useEffect } from "react";
import {
  Clock,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { supabase } from "../../supabaseClient";

const AdminOverview = ({ setActiveTab }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [metrics, setMetrics] = useState({
    pendingBookings: 12,
    activeStaff: 45,
    monthlyRevenue: "₱450K",
    equipmentAlerts: 3,
  });

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Recent Bookings Data matching image_e82561.jpg
  const recentBookings = [
    {
      id: "BK-2026-045",
      client: "Tech Corp Inc.",
      event: "Annual Conference",
      date: "Sep 10, 2026",
      status: "Pending",
      statusColor: "amber",
    },
    {
      id: "BK-2026-044",
      client: "Maria Santos",
      event: "Wedding Livestream",
      date: "Aug 25, 2026",
      status: "Confirmed",
      statusColor: "emerald",
    },
    {
      id: "BK-2026-043",
      client: "Global E-sports",
      event: "Gaming Tournament",
      date: "Aug 18, 2026",
      status: "In Progress",
      statusColor: "blue",
    },
  ];

  // System Alerts matching image_e82561.jpg
  const systemAlerts = [
    {
      id: 1,
      type: "Inventory",
      time: "2 hours ago",
      icon: AlertTriangle,
      iconColor: "text-amber-500",
      message: "Sony A7S III (Camera 3) needs scheduled maintenance.",
    },
    {
      id: 2,
      type: "Staff",
      time: "5 hours ago",
      icon: AlertTriangle,
      iconColor: "text-red-500",
      message: "2 staff members called in sick for tomorrow's event.",
    },
    {
      id: 3,
      type: "System",
      time: "1 day ago",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      message: "System backup completed successfully.",
    },
  ];

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
            Admin Dashboard
          </h1>
          <p className="text-xs text-neutral-400">
            System overview and critical alerts.
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 mb-0.5">
            Current Time
          </p>
          <p className="text-2xl font-black text-white font-mono tracking-tight">
            {formattedTime}
          </p>
        </div>
      </div>

      {/* 4 Upper Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pending Bookings */}
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-5 min-h-[110px]">
          <div className="w-14 h-14 rounded-2xl bg-[#261f18] border border-[#3f3020] text-amber-500 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black leading-none text-white">
              {metrics.pendingBookings}
            </h2>
            <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mt-1.5 leading-tight">
              Pending<br />Bookings
            </p>
          </div>
        </div>

        {/* Active Staff */}
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-5 min-h-[110px]">
          <div className="w-14 h-14 rounded-2xl bg-[#141b2b] border border-[#202b45] text-blue-500 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black leading-none text-white">
              {metrics.activeStaff}
            </h2>
            <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mt-1.5 leading-tight">
              Active<br />Staff
            </p>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-5 min-h-[110px]">
          <div className="w-14 h-14 rounded-2xl bg-[#122320] border border-[#1b3a33] text-emerald-500 flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black leading-none text-white">
              {metrics.monthlyRevenue}
            </h2>
            <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mt-1.5 leading-tight">
              Monthly<br />Revenue
            </p>
          </div>
        </div>

        {/* Equipment Alerts */}
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-5 min-h-[110px]">
          <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-900/50 text-red-500 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black leading-none text-white">
              {metrics.equipmentAlerts}
            </h2>
            <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mt-1.5 leading-tight">
              Equipment<br />Alerts
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Bookings + System Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Recent Bookings Table Card */}
        <div className="xl:col-span-8 bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1b212f] pb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Recent Bookings
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className="text-xs font-bold text-red-600 hover:text-red-500 transition cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[650px] text-xs">
              <thead>
                <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  <th className="pb-3.5">Booking ID</th>
                  <th className="pb-3.5">Client</th>
                  <th className="pb-3.5">Event</th>
                  <th className="pb-3.5">Date</th>
                  <th className="pb-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141824]">
                {recentBookings.map((bkg) => (
                  <tr key={bkg.id} className="hover:bg-[#121622] transition-colors">
                    <td className="py-4 font-mono text-[11px] text-neutral-400">
                      {bkg.id}
                    </td>

                    <td className="py-4 font-bold text-white">
                      {bkg.client}
                    </td>

                    <td className="py-4 text-neutral-300">
                      {bkg.event}
                    </td>

                    <td className="py-4 text-neutral-400 font-mono text-[11px]">
                      {bkg.date}
                    </td>

                    <td className="py-4 text-right">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border inline-block ${
                          bkg.statusColor === "emerald"
                            ? "bg-[#0e241c] text-[#22c55e] border-[#144231]"
                            : bkg.statusColor === "blue"
                            ? "bg-[#101e38] text-[#38bdf8] border-[#1a365d]"
                            : "bg-[#2a1d13] text-[#f59e0b] border-[#482d18]"
                        }`}
                      >
                        {bkg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: System Alerts & Quick Links Panel */}
        <div className="xl:col-span-4 bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center gap-2 border-b border-[#1b212f] pb-4 mb-6">
              <Activity size={16} className="text-red-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                System Alerts
              </h3>
            </div>

            {/* Alert List */}
            <div className="space-y-6">
              {systemAlerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <div key={alert.id} className="flex items-start gap-3.5">
                    <div className="mt-0.5 shrink-0">
                      <Icon size={16} className={alert.iconColor} />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-white">
                          {alert.type}
                        </h4>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {alert.time}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="border-t border-[#1b212f] pt-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3.5">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("staff")}
                className="w-full py-3 rounded-xl bg-[#090b10] hover:bg-[#141824] border border-[#1b212f] text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer text-center"
              >
                Assign Staff
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("inventory")}
                className="w-full py-3 rounded-xl bg-[#090b10] hover:bg-[#141824] border border-[#1b212f] text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer text-center"
              >
                Update Gear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;