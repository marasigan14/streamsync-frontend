import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { supabase } from "../../supabaseClient";

/* ------------------------------------------------------------------
   CONFIG
------------------------------------------------------------------- */
// Same backend ManageBookings uses. Set VITE_API_URL in .env for deployment.
const API_URL = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000";

// Optional Supabase tables for the two cards that are not booking-based.
// If a table doesn't exist (or isn't readable), the card shows "—".
const OPTIONAL = {
  staff: {
    table: "staff",
    filterColumn: null, // e.g. "status"
    filterValues: [], //   e.g. ["active"]
  },
  equipment: {
    table: "equipment",
    // Equipment Alerts stays "—" until you tell it which column marks a problem
    filterColumn: null, // e.g. "status"
    filterValues: [], //   e.g. ["maintenance", "damaged"]
  },
};

const REVENUE_STATUSES = ["approved", "completed"];
const POLL_MS = 30000;

/* ------------------------------ helpers ------------------------------ */
const statusDisplay = {
  pending: { label: "Pending", color: "amber" },
  approved: { label: "Confirmed", color: "emerald" },
  declined: { label: "Rejected", color: "red" },
  cancelled: { label: "Cancelled", color: "red" },
  completed: { label: "Completed", color: "blue" },
};

const statusStyle = (color) => {
  if (color === "emerald") return "bg-[#0e241c] text-[#22c55e] border-[#144231]";
  if (color === "blue") return "bg-[#101e38] text-[#38bdf8] border-[#1a365d]";
  if (color === "red") return "bg-[#2a1313] text-[#ef4444] border-[#4a1c1c]";
  return "bg-[#2a1d13] text-[#f59e0b] border-[#482d18]";
};

const formatPeso = (n) => {
  if (n >= 1_000_000) return `₱${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `₱${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `₱${n.toLocaleString()}`;
};

const parseDate = (d) => (d ? new Date(d.length === 10 ? `${d}T00:00:00` : d) : null);

const formatDate = (d) => {
  const date = parseDate(d);
  return date && !isNaN(date)
    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "TBD";
};

const timeAgo = (iso) => {
  if (!iso) return "";
  const mins = Math.floor(Math.max(0, Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const shortId = (id) => {
  const s = String(id);
  return s.length > 8 ? `BK-${s.slice(0, 6).toUpperCase()}` : `BK-${s}`;
};

const countRows = async ({ table, filterColumn, filterValues }, requireFilter = false) => {
  if (requireFilter && !filterColumn) return null;
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filterColumn && filterValues.length) q = q.in(filterColumn, filterValues);
  const { count, error } = await q;
  return error ? null : count;
};

/* ------------------------------ component ------------------------------ */
const AdminOverview = ({ setActiveTab }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [staffCount, setStaffCount] = useState(null);
  const [equipmentAlerts, setEquipmentAlerts] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const loadOverview = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const [res, staff, equipment] = await Promise.all([
        fetch(`${API_URL}/bookings/`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }),
        countRows(OPTIONAL.staff),
        countRows(OPTIONAL.equipment, true),
      ]);

      if (!res.ok) throw new Error(`Bookings request failed (${res.status})`);
      const data = await res.json();

      setBookings(
        data.map((b) => ({
          id: b.id,
          client: b.client_name || "Unknown",
          event: b.event_name || "Untitled Event",
          eventDate: b.event_date || null,
          venue: b.venue || "Venue TBD",
          status: b.status || "pending",
          createdAt: b.created_at || null,
          total: Number(b.total_amount) || 0,
        }))
      );
      setStaffCount(staff);
      setEquipmentAlerts(equipment);
      setError("");
    } catch (err) {
      console.error("Overview load failed:", err);
      setError(
        err.message === "Failed to fetch"
          ? "Can't reach the backend. Is the FastAPI server running?"
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
    const poll = setInterval(loadOverview, POLL_MS);
    return () => clearInterval(poll);
  }, [loadOverview]);

  /* ----------------------- derived from real bookings ----------------------- */
  const now = new Date();
  const pending = bookings.filter((b) => b.status === "pending");

  const monthlyRevenue = bookings
    .filter((b) => {
      const d = parseDate(b.eventDate);
      return (
        REVENUE_STATUSES.includes(b.status) &&
        d &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, b) => sum + b.total, 0);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Alerts generated from live data (no extra table needed)
  const systemAlerts = [];
  if (pending.length > 0) {
    const oldest = pending.reduce((a, b) =>
      new Date(a.createdAt || 0) < new Date(b.createdAt || 0) ? a : b
    );
    systemAlerts.push({
      id: "pending",
      type: "Bookings",
      time: timeAgo(oldest.createdAt),
      Icon: AlertTriangle,
      color: "text-amber-500",
      message: `${pending.length} booking request${pending.length > 1 ? "s are" : " is"} waiting for review.`,
    });
  }
  const weekAhead = new Date(now.getTime() + 7 * 86400000);
  bookings
    .filter((b) => {
      const d = parseDate(b.eventDate);
      return b.status === "approved" && d && d >= new Date(now.toDateString()) && d <= weekAhead;
    })
    .sort((a, b) => parseDate(a.eventDate) - parseDate(b.eventDate))
    .slice(0, 3)
    .forEach((b) =>
      systemAlerts.push({
        id: `soon-${b.id}`,
        type: "Upcoming Event",
        time: formatDate(b.eventDate),
        Icon: AlertTriangle,
        color: "text-red-500",
        message: `${b.event} for ${b.client} at ${b.venue}.`,
      })
    );
  if (systemAlerts.length === 0) {
    systemAlerts.push({
      id: "clear",
      type: "System",
      time: "",
      Icon: CheckCircle2,
      color: "text-emerald-500",
      message: "No pending reviews or events in the next 7 days.",
    });
  }

  const show = (v) => (loading ? "–" : v ?? "—");

  const metricCards = [
    {
      label: ["Pending", "Bookings"],
      value: show(pending.length),
      icon: Clock,
      box: "bg-[#261f18] border-[#3f3020] text-amber-500",
    },
    {
      label: ["Active", "Staff"],
      value: show(staffCount),
      icon: Users,
      box: "bg-[#141b2b] border-[#202b45] text-blue-500",
    },
    {
      label: ["Monthly", "Revenue"],
      value: show(formatPeso(monthlyRevenue)),
      icon: DollarSign,
      box: "bg-[#122320] border-[#1b3a33] text-emerald-500",
    },
    {
      label: ["Equipment", "Alerts"],
      value: show(equipmentAlerts),
      icon: AlertTriangle,
      box: "bg-red-950/40 border-red-900/50 text-red-500",
    },
  ];

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
            Admin Dashboard
          </h1>
          <p className="text-xs text-neutral-400">System overview and critical alerts.</p>
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

      {error && (
        <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-xs text-red-400 flex items-center justify-between gap-4">
          <span>Couldn't load live data: {error}</span>
          <button
            type="button"
            onClick={loadOverview}
            className="font-bold text-red-500 hover:text-red-400 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map(({ label, value, icon: Icon, box }) => (
          <div
            key={label.join(" ")}
            className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-5 min-h-[110px]"
          >
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${box}`}>
              <Icon size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black leading-none text-white">{value}</h2>
              <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mt-1.5 leading-tight">
                {label[0]}
                <br />
                {label[1]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent bookings + system alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
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
                {!loading && recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                      No bookings yet.
                    </td>
                  </tr>
                )}
                {recentBookings.map((bkg) => {
                  const display = statusDisplay[bkg.status] || statusDisplay.pending;
                  return (
                    <tr key={bkg.id} className="hover:bg-[#121622] transition-colors">
                      <td className="py-4 font-mono text-[11px] text-neutral-400">
                        {shortId(bkg.id)}
                      </td>
                      <td className="py-4 font-bold text-white">{bkg.client}</td>
                      <td className="py-4 text-neutral-300">{bkg.event}</td>
                      <td className="py-4 text-neutral-400 font-mono text-[11px]">
                        {formatDate(bkg.eventDate)}
                      </td>
                      <td className="py-4 text-right">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border inline-block ${statusStyle(
                            display.color
                          )}`}
                        >
                          {display.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="xl:col-span-4 bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center gap-2 border-b border-[#1b212f] pb-4 mb-6">
              <Activity size={16} className="text-red-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                System Alerts
              </h3>
            </div>

            <div className="space-y-6">
              {systemAlerts.map(({ id, type, time, Icon, color, message }) => (
                <div key={id} className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">
                    <Icon size={16} className={color} />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white">{type}</h4>
                      <span className="text-[10px] text-neutral-500 font-mono">{time}</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
