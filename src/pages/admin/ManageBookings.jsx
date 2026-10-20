import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Check,
  X,
  Archive,
  Download,
  AlertTriangle,
} from "lucide-react";
import { apiFetch, apiDownload } from "../../lib/api";
import Pagination from "../../components/Pagination";

const PAGE_SIZE = 8;

/* ------------------------------------------------------------------
   CONFIG & HELPERS
------------------------------------------------------------------- */

// booking_status enum -> badge label + color
const STATUS_DISPLAY = {
  pending: { label: "Pending Review", color: "orange" },
  approved: { label: "Confirmed", color: "cyan" },
  declined: { label: "Rejected", color: "red" },
  cancelled: { label: "Cancelled", color: "red" },
  completed: { label: "Completed", color: "emerald" },
};

const BADGE_STYLES = {
  orange: "bg-orange-950/40 text-orange-400 border-orange-800/50",
  cyan: "bg-cyan-950/40 text-cyan-400 border-cyan-800/50",
  emerald: "bg-emerald-950/40 text-emerald-400 border-emerald-800/50",
  red: "bg-red-950/40 text-red-500 border-red-800/50",
};

// Only these statuses appear on the calendar
const CALENDAR_THEME = {
  pending: "orange",
  approved: "cyan",
  completed: "emerald",
};

const CHIP_STYLES = {
  orange: "bg-[#26150c] border-[#522212] text-orange-400",
  cyan: "bg-[#0b1f2e] border-[#164e63] text-cyan-400",
  emerald: "bg-[#0e241c] border-[#144231] text-[#22c55e]",
};

const REFUND_BADGE_STYLES = {
  processed: "bg-[#0e241c] text-[#22c55e] border-[#144231]",
  pending: "bg-[#2a1d13] text-[#f59e0b] border-[#482d18]",
  not_applicable: "bg-neutral-900/60 text-neutral-400 border-neutral-700/50",
};

const SOURCE_LABEL = {
  client: "Cancelled by client",
  admin: "Cancelled by admin",
  auto_no_downpayment: "Auto-cancelled: no downpayment",
};

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Confirmed" },
  { id: "completed", label: "Completed" },
  { id: "declined,cancelled", label: "Rejected / Cancelled" },
];

const MAX_CHIPS_PER_DAY = 2;


const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const formatClock = (t) => {
  if (!t) return "All Day";
  const [h, m] = t.split(":");
  const hour = Number(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

const formatPeso = (amount) =>
  `₱${Number(amount).toLocaleString("en-PH", { maximumFractionDigits: 2 })}`;

const formatTimestamp = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });
};

/* ------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------- */
const ManageBookings = () => {
  const [subTab, setSubTab] = useState("requests"); // "requests" | "calendar" | "cancellations"
  const [expandedQuotes, setExpandedQuotes] = useState({});

  const [currentCalendarDate, setCurrentCalendarDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [bookingRequests, setBookingRequests] = useState([]); // one page (Booking Requests tab)
  const [calendarBookings, setCalendarBookings] = useState([]); // every booking (Calendar tab)
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionErrorId, setActionErrorId] = useState(null);
  const [actionErrorText, setActionErrorText] = useState("");
  const [actioningId, setActioningId] = useState(null);
  const [warnings, setWarnings] = useState({}); // bookingId -> [equipment warning]

  // Cancel modal
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelClientRequested, setCancelClientRequested] = useState(false);

  // Cancellation logs (real data from booking_cancellations)
  const [cancellations, setCancellations] = useState([]);
  const [cancelLimit, setCancelLimit] = useState(3);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const toggleQuote = (id) =>
    setExpandedQuotes((prev) => ({ ...prev, [id]: !prev[id] }));

  /* ----------------------------- data ----------------------------- */
  const toRow = (b) => ({
    id: b.id,
    title: b.event_name || "Untitled Event",
    eventType: b.event_type || "event",
    status: b.status || "pending",
    clientName: b.client_name || "Unknown",
    clientEmail: b.client_email || "",
    submittedDate: b.created_at ? b.created_at.split("T")[0] : "Recent",
    date: b.event_date || "TBD",
    startTime: b.start_time || null,
    time: b.start_time && b.end_time ? `${b.start_time} - ${b.end_time}` : "All Day",
    venue: b.venue || "Venue TBD",
    distanceKm: b.distance_km,
    transportFee: b.transport_fee || 0,
    notes: b.notes || "",
    equipment: Array.isArray(b.booking_equipment)
      ? b.booking_equipment.map((be) => be.equipment?.name).filter(Boolean)
      : [],
    totalAmount: b.total_amount || 0,
    archived: !!b.is_archived,
  });

  const fetchAdminBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String((page - 1) * PAGE_SIZE),
        status: statusFilter,
        archived: String(showArchived),
      });
      const data = await apiFetch(`/bookings/?${params}`);
      setBookingRequests(data.items.map(toRow));
      setTotal(data.total);
      setCounts(data.counts || {});
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setBookingRequests([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, showArchived]);

  const fetchCalendar = useCallback(async () => {
    try {
      const data = await apiFetch("/bookings/");
      setCalendarBookings(data.map(toRow));
    } catch (err) {
      console.error("Failed to load calendar bookings:", err);
    }
  }, []);

  const fetchCancellations = useCallback(async () => {
    setCancelLoading(true);
    setCancelError("");
    try {
      const data = await apiFetch("/bookings/cancellations");
      setCancellations(data.items || []);
      setCancelLimit(data.cancellation_limit || 3);
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminBookings();
  }, [fetchAdminBookings]);

  useEffect(() => {
    if (subTab === "calendar") fetchCalendar();
    if (subTab === "cancellations") fetchCancellations();
  }, [subTab, fetchCalendar, fetchCancellations]);

  // Back to page 1 when the filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter, showArchived]);

  const fail = (id, err) => {
    console.error(err);
    setActionErrorId(id);
    setActionErrorText(err.message || "Failed to update — try again.");
  };

  const updateBookingStatus = async (id, newStatus, extra = "") => {
    setActioningId(id);
    setActionErrorId(null);
    try {
      const updated = await apiFetch(`/bookings/${id}?status=${newStatus}${extra}`, { method: "PATCH" });
      if (updated.equipment_warnings?.length) {
        setWarnings((prev) => ({ ...prev, [id]: updated.equipment_warnings }));
      }
      setBookingRequests((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
      fetchAdminBookings();
    } catch (err) {
      fail(id, err);
    } finally {
      setActioningId(null);
    }
  };

  const handleApprove = (id) => updateBookingStatus(id, "approved");
  const handleDecline = (id) => updateBookingStatus(id, "declined");
  const handleComplete = (id) => updateBookingStatus(id, "completed");

  const openCancel = (bkg) => {
    setCancelTarget(bkg);
    setCancelReason("");
    setCancelClientRequested(false);
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    const extra =
      `&reason=${encodeURIComponent(cancelReason.trim() || "Cancelled by admin")}` +
      `&client_requested=${cancelClientRequested}`;
    const id = cancelTarget.id;
    setCancelTarget(null);
    await updateBookingStatus(id, "cancelled", extra);
  };

  const handleArchive = async (id, archived) => {
    setActioningId(id);
    setActionErrorId(null);
    try {
      await apiFetch(`/bookings/${id}/archive`, { method: "PATCH", body: { archived } });
      fetchAdminBookings();
    } catch (err) {
      fail(id, err);
    } finally {
      setActioningId(null);
    }
  };

  const handleContract = async (id) => {
    try {
      await apiDownload(`/bookings/${id}/contract`, `StreamSync-Contract-BK-${id}.pdf`);
    } catch (err) {
      fail(id, err);
    }
  };

  const markRefund = async (cancellationId, refundStatus) => {
    try {
      await apiFetch(`/bookings/cancellations/${cancellationId}/refund`, {
        method: "PATCH",
        body: { refund_status: refundStatus },
      });
      fetchCancellations();
    } catch (err) {
      setCancelError(err.message);
    }
  };

  /* --------------------------- calendar --------------------------- */
  const eventsByDate = useMemo(() => {
    const map = {};
    calendarBookings
      .filter(
        (b) => CALENDAR_THEME[b.status] && /^\d{4}-\d{2}-\d{2}$/.test(b.date)
      )
      .forEach((b) => {
        (map[b.date] ||= []).push({
          name: b.title,
          start: b.startTime || "",
          time: formatClock(b.startTime),
          theme: CALENDAR_THEME[b.status],
        });
      });
    Object.values(map).forEach((list) =>
      list.sort((a, b) => a.start.localeCompare(b.start))
    );
    return map;
  }, [calendarBookings]);

  const nextMonth = () =>
    setCurrentCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  const prevMonth = () =>
    setCurrentCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const goToToday = () => {
    const d = new Date();
    setCurrentCalendarDate(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const calendarCells = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
    const todayKey = dateKey(new Date());

    // Day 1 minus leading offset gives the first visible cell; JS Date rolls over months
    return Array.from({ length: totalCells }, (_, i) => {
      const d = new Date(year, month, i - firstDayIndex + 1);
      const key = dateKey(d);
      return {
        key,
        dayNum: d.getDate(),
        isCurrentMonth: d.getMonth() === month,
        isToday: key === todayKey,
        events: eventsByDate[key] || [],
      };
    });
  }, [currentCalendarDate, eventsByDate]);

  const monthYearHeading = currentCalendarDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  /* ------------------------- cancellations ------------------------- */
  const cancellationLogs = useMemo(
    () =>
      cancellations.map((c) => ({
        rowId: c.id,
        id: `CXL-${String(c.id).padStart(4, "0")}`,
        client: c.client_name,
        clientCount: c.client_cancellation_count,
        clientBlacklisted: c.client_blacklisted,
        bkgId: `BK-${c.booking_id}`,
        event: c.event_name || "",
        eventDate: c.event_date || "—",
        timestamp: formatTimestamp(c.cancelled_at),
        source: SOURCE_LABEL[c.source] || c.source,
        by: c.cancelled_by_name,
        reason: c.reason || "No reason provided",
        counts: c.counts_toward_policy,
        daysBefore: c.days_before_event,
        paid: formatPeso(c.amount_paid || 0),
        refundAmount: formatPeso(c.refund_amount || 0),
        statusKey: c.refund_status,
        statusLabel:
          c.refund_status === "processed"
            ? "REFUND PROCESSED"
            : c.refund_status === "pending"
            ? "REFUND PENDING"
            : "NO REFUND DUE",
      })),
    [cancellations]
  );

  /* --------------------------- summary --------------------------- */
  // Counts come from the backend (every booking, not just this page)
  const countBy = (...statuses) => statuses.reduce((sum, st) => sum + (counts[st] || 0), 0);

  const summaryCards = [
    { label: "Pending Review", value: countBy("pending"), color: "text-amber-500" },
    { label: "Confirmed", value: countBy("approved"), color: "text-cyan-400" },
    { label: "Completed", value: countBy("completed"), color: "text-emerald-500" },
    {
      label: "Rejected / Cancelled",
      value: countBy("declined", "cancelled"),
      color: "text-red-500",
    },
  ];

  const tabs = [
    { id: "requests", label: "Booking Requests" },
    { id: "calendar", label: "Calendar View" },
    { id: "cancellations", label: "Cancellation Logs" },
  ];

  /* ----------------------------- render ----------------------------- */
  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
          Manage Bookings
        </h1>
        <p className="text-xs text-neutral-400">
          Review, approve, or reject booking requests from clients.
        </p>
      </div>

      {/* Sub-navigation */}
      <div className="flex items-center gap-8 border-b border-[#1b212f] text-xs font-black uppercase tracking-wider overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubTab(tab.id)}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap ${
              subTab === tab.id
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================ REQUESTS ============================ */}
      {subTab === "requests" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                  {card.label}
                </p>
                <h3 className={`text-3xl font-black ${card.color}`}>{card.value}</h3>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3.5 py-2 rounded-lg border text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                    statusFilter === f.id
                      ? "bg-red-600 border-red-600 text-white"
                      : "bg-[#090b10] border-[#1b212f] text-neutral-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-[11px] text-neutral-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="accent-red-600"
              />
              Show archived bookings
            </label>
          </div>

          {loading && <p className="text-neutral-500 text-sm">Loading bookings...</p>}

          {!loading && bookingRequests.length === 0 && (
            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-8 text-center text-neutral-400 text-sm">
              {showArchived ? "No archived bookings." : "No booking requests in this view."}
            </div>
          )}

          <div className="space-y-5">
            {bookingRequests.map((bkg) => {
              const isQuoteOpen = expandedQuotes[bkg.id];
              const display = STATUS_DISPLAY[bkg.status] || STATUS_DISPLAY.pending;
              const isRejectedLook =
                bkg.status === "declined" || bkg.status === "cancelled";
              const isBusy = actioningId === bkg.id;

              return (
                <div
                  key={bkg.id}
                  className={`bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 transition-all ${
                    isRejectedLook ? "opacity-75 hover:opacity-100" : ""
                  } ${bkg.status === "pending" ? "border-l-4 border-l-orange-500" : ""}`}
                >
                  <div className="flex-1 space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black uppercase text-white tracking-wide">
                          {bkg.title}
                        </h3>
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border ${BADGE_STYLES[display.color]}`}
                        >
                          {display.label}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        {bkg.clientName}
                        {bkg.clientEmail && ` • ${bkg.clientEmail}`}
                      </p>
                      <p className="text-[10px] text-neutral-500 font-mono mt-1">
                        Submitted: {bkg.submittedDate}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          <Calendar size={12} className="text-red-500" /> Date
                        </p>
                        <p className="font-bold text-white">{bkg.date}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          <Clock size={12} className="text-red-500" /> Time
                        </p>
                        <p className="font-bold text-white leading-tight">{bkg.time}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          <MapPin size={12} className="text-red-500" /> Venue
                        </p>
                        <p className="font-bold text-white leading-tight">{bkg.venue}</p>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {bkg.equipment.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5">
                            Equipment Needed
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {bkg.equipment.map((eq, idx) => (
                              <span
                                key={idx}
                                className="border border-blue-900/50 bg-[#090b10] text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded"
                              >
                                {eq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {bkg.notes && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5">
                            Notes
                          </p>
                          <div className="bg-[#090b10] border border-[#1b212f] rounded-xl p-3 text-xs text-neutral-300">
                            {bkg.notes}
                          </div>
                        </div>
                      )}
                    </div>

                    {warnings[bkg.id]?.length > 0 && (
                      <div className="border border-amber-800/50 bg-amber-950/20 rounded-xl p-3 text-xs text-amber-400 space-y-1">
                        <p className="font-black uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                          <AlertTriangle size={12} /> Equipment check
                        </p>
                        {warnings[bkg.id].map((w, i) => (
                          <p key={i}>{w}</p>
                        ))}
                      </div>
                    )}

                    {bkg.totalAmount > 0 && (
                      <div className="border border-[#1b212f] rounded-xl overflow-hidden bg-[#090b10]">
                        <div
                          onClick={() => toggleQuote(bkg.id)}
                          className="px-4 py-3 flex items-center justify-between border-b border-[#1b212f] cursor-pointer hover:bg-[#121622] transition"
                        >
                          <span className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                            <FileText size={14} className="text-red-500" /> Quotation
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1">
                            {isQuoteOpen ? "Hide" : "View"}
                            {isQuoteOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                        </div>

                        {isQuoteOpen && (
                          <div className="p-4 space-y-2 text-xs bg-[#0b0e14]">
                            {bkg.transportFee > 0 && (
                              <div className="flex justify-between items-center text-neutral-400">
                                <span>
                                  Transport fee{bkg.distanceKm ? ` (${bkg.distanceKm} km)` : ""}:
                                </span>
                                <span className="font-mono text-neutral-300">{formatPeso(bkg.transportFee)}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center text-neutral-400">
                              <span>Total Amount:</span>
                              <span className="font-mono font-bold text-white text-sm">
                                {formatPeso(bkg.totalAmount)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="w-full lg:w-64 shrink-0 flex flex-col justify-start gap-3">
                    {actionErrorId === bkg.id && (
                      <p className="text-[10px] text-red-500 font-bold">
                        {actionErrorText || "Failed to update — try again."}
                      </p>
                    )}

                    {bkg.status === "pending" && (
                      <>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleApprove(bkg.id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg shadow-red-950/40 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Check size={15} />
                          {isBusy ? "Saving..." : "Approve Booking"}
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDecline(bkg.id)}
                          className="w-full bg-transparent border border-red-900/50 hover:bg-red-950/30 text-red-500 text-xs font-bold tracking-wider py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <X size={14} /> Decline
                        </button>
                      </>
                    )}

                    {bkg.status === "approved" && (
                      <>
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-[#090b10] border border-[#1b212f] rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2 border border-cyan-500/20">
                            <Check size={18} />
                          </div>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed">
                            Confirmed
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleComplete(bkg.id)}
                          className="w-full bg-transparent border border-emerald-900/50 hover:bg-emerald-950/30 text-emerald-400 text-xs font-bold tracking-wider py-3 rounded-xl transition cursor-pointer disabled:opacity-50"
                        >
                          {isBusy ? "Saving..." : "Mark Completed"}
                        </button>
                      </>
                    )}

                    {(bkg.status === "pending" || bkg.status === "approved") && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => openCancel(bkg)}
                        className="w-full bg-transparent border border-[#1b212f] hover:border-red-900/60 text-neutral-400 hover:text-red-400 text-[11px] font-bold tracking-wider py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {bkg.status === "completed" && (
                      <div className="flex flex-col items-center justify-center text-center p-4 bg-[#090b10] border border-[#1b212f] rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2 border border-emerald-500/20">
                          <CheckCircle2 size={18} />
                        </div>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed">
                          Event Completed
                        </p>
                      </div>
                    )}

                    {isRejectedLook && (
                      <div className="border border-red-900/40 bg-red-950/10 rounded-xl p-5 flex flex-col items-center justify-center text-center h-32">
                        <AlertCircle size={22} className="text-red-500 mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 leading-relaxed">
                          {bkg.status === "cancelled" ? "Cancelled" : "Declined"}
                        </p>
                      </div>
                    )}

                    {bkg.status !== "pending" && bkg.status !== "declined" && (
                      <button
                        type="button"
                        onClick={() => handleContract(bkg.id)}
                        className="w-full bg-transparent border border-[#1b212f] hover:border-neutral-600 text-neutral-400 hover:text-white text-[11px] font-bold tracking-wider py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Download size={13} /> Contract PDF
                      </button>
                    )}

                    {(bkg.archived || ["completed", "declined", "cancelled"].includes(bkg.status)) && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleArchive(bkg.id, !bkg.archived)}
                        className="w-full bg-transparent border border-[#1b212f] hover:border-neutral-600 text-neutral-500 hover:text-white text-[11px] font-bold tracking-wider py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Archive size={13} /> {bkg.archived ? "Restore from Archive" : "Archive"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onChange={setPage} label="bookings" />
        </div>
      )}

      {/* ============================ CALENDAR ============================ */}
      {subTab === "calendar" && (
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black uppercase text-white tracking-wider">
                Booking Calendar
              </h3>
              <p className="text-xs text-neutral-400">
                Pending, confirmed, and completed events by date.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={prevMonth}
                className="px-3 py-1.5 bg-[#090b10] border border-[#1b212f] hover:border-neutral-600 rounded-lg text-xs font-mono transition cursor-pointer"
              >
                ← Prev
              </button>
              <span className="text-sm font-black uppercase tracking-wider text-white min-w-[130px] text-center">
                {monthYearHeading}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="px-3 py-1.5 bg-[#090b10] border border-[#1b212f] hover:border-neutral-600 rounded-lg text-xs font-mono transition cursor-pointer"
              >
                Next →
              </button>
              <button
                type="button"
                onClick={goToToday}
                className="px-3 py-1.5 bg-[#090b10] border border-[#1b212f] hover:border-neutral-600 rounded-lg text-xs font-mono transition cursor-pointer"
              >
                Today
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Confirmed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> Pending
            </span>
          </div>

          <div className="border border-[#1b212f] rounded-2xl overflow-hidden bg-[#090b10]">
            <div className="grid grid-cols-7 border-b border-[#1b212f] text-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest py-3 bg-[#0b0e14]">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 text-xs text-neutral-400">
              {calendarCells.map((cell) => (
                <div
                  key={cell.key}
                  className={`min-h-[115px] border-r border-b border-[#1b212f] p-2.5 flex flex-col gap-1 transition-colors ${
                    cell.isCurrentMonth
                      ? "bg-[#090b10] hover:bg-[#0d1017]"
                      : "bg-[#06080c]/60 text-neutral-600"
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-bold ${
                      cell.isToday
                        ? "text-red-500"
                        : cell.isCurrentMonth
                        ? "text-white"
                        : "text-neutral-600"
                    }`}
                  >
                    {cell.isToday ? `${cell.dayNum} TODAY` : cell.dayNum}
                  </span>

                  <div className="space-y-1">
                    {cell.events.slice(0, MAX_CHIPS_PER_DAY).map((evt, idx) => (
                      <div
                        key={idx}
                        className={`p-1.5 rounded-lg text-[9px] font-bold leading-tight border ${CHIP_STYLES[evt.theme]}`}
                      >
                        <p className="truncate">{evt.name}</p>
                        <span className="text-[8px] font-mono opacity-80">{evt.time}</span>
                      </div>
                    ))}
                    {cell.events.length > MAX_CHIPS_PER_DAY && (
                      <p className="text-[9px] font-bold text-neutral-500">
                        +{cell.events.length - MAX_CHIPS_PER_DAY} more
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================== CANCELLATIONS ========================== */}
      {subTab === "cancellations" && (
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-base font-black uppercase tracking-wide text-white">
              Cancellation History & Logs
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Every cancellation is recorded with its timestamp, who cancelled, and the refund computed from the
              verified amount paid. Counted cancellations add to the client's total; at {cancelLimit} the client is
              blacklisted from new bookings.
            </p>
          </div>

          {cancelError && <p className="text-xs font-bold text-red-500">{cancelError}</p>}
          {cancelLoading && <p className="text-neutral-500 text-sm">Loading cancellations...</p>}

          {!cancelLoading && cancellationLogs.length === 0 && (
            <div className="border border-[#1b212f] rounded-2xl bg-[#090b10] p-8 text-center text-neutral-400 text-sm">
              No cancellations recorded.
            </div>
          )}

          {cancellationLogs.length > 0 && (
            <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
              <table className="w-full text-left min-w-[1050px] text-xs">
                <thead>
                  <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-[#0b0e14]">
                    <th className="py-4 pl-6">Cancellation ID</th>
                    <th className="py-4">Booking Info</th>
                    <th className="py-4">Timestamp</th>
                    <th className="py-4">Source / Reason</th>
                    <th className="py-4">Client Policy</th>
                    <th className="py-4">Computed Refund</th>
                    <th className="py-4 pr-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141824]">
                  {cancellationLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#121622] transition-colors align-top">
                      <td className="py-4 pl-6 font-mono font-bold text-white text-[11px]">{log.id}</td>
                      <td className="py-4">
                        <p className="font-bold text-white">{log.client}</p>
                        <p className="text-[10px] text-neutral-500 font-mono">
                          {log.bkgId} • {log.event} • Event: {log.eventDate}
                        </p>
                      </td>
                      <td className="py-4 text-neutral-400 font-mono text-[11px]">
                        {log.timestamp}
                        {log.daysBefore !== null && log.daysBefore !== undefined && (
                          <p className="text-[10px] text-neutral-500">{log.daysBefore} day(s) before event</p>
                        )}
                      </td>
                      <td className="py-4 text-neutral-300 max-w-xs">
                        <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                          {log.source}
                          {log.by ? ` • ${log.by}` : ""}
                        </p>
                        <p>{log.reason}</p>
                      </td>
                      <td className="py-4">
                        {log.counts ? (
                          <p className="text-[11px] text-neutral-300">
                            Counted • client total {log.clientCount}/{cancelLimit}
                          </p>
                        ) : (
                          <p className="text-[11px] text-neutral-500">Not counted</p>
                        )}
                        {log.clientBlacklisted && (
                          <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border bg-red-950/40 text-red-400 border-red-800/50">
                            Blacklisted
                          </span>
                        )}
                      </td>
                      <td className="py-4">
                        <p className="font-bold font-mono text-red-500">{log.refundAmount}</p>
                        <p className="text-[10px] text-neutral-500">Paid: {log.paid}</p>
                      </td>
                      <td className="py-4 pr-6 text-right space-y-2">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border inline-block ${
                            REFUND_BADGE_STYLES[log.statusKey] || REFUND_BADGE_STYLES.not_applicable
                          }`}
                        >
                          {log.statusLabel}
                        </span>
                        {log.statusKey === "pending" && (
                          <button
                            type="button"
                            onClick={() => markRefund(log.rowId, "processed")}
                            className="block ml-auto text-[10px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                          >
                            Mark refund processed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============================ CANCEL MODAL ============================ */}
      {cancelTarget && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e121a] border border-[#1b212f] rounded-2xl p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider">Cancel Booking</h3>
              <button type="button" onClick={() => setCancelTarget(null)} className="text-neutral-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              {cancelTarget.title} • {cancelTarget.clientName} • {cancelTarget.date}
            </p>
            <textarea
              rows={3}
              placeholder="Reason for cancelling (shown in the Cancellation Logs)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 resize-none"
            />
            <label className="flex items-start gap-2 text-[11px] text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={cancelClientRequested}
                onChange={(e) => setCancelClientRequested(e.target.checked)}
                className="accent-red-600 mt-0.5"
              />
              <span>
                The client asked for this cancellation (counts toward their {cancelLimit}-cancellation limit). Leave
                unticked if Livestream Manila is cancelling.
              </span>
            </label>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
