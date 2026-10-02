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
} from "lucide-react";
import { supabase } from "../../supabaseClient";

/* ------------------------------------------------------------------
   CONFIG & HELPERS
------------------------------------------------------------------- */
const API_URL = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000";

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
};

const MAX_CHIPS_PER_DAY = 2;

// Refund policy
const NO_REFUND_WITHIN_DAYS = 15;
const REFUND_FEE_RATE = 0.05;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

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

const shortId = (id) => String(id).slice(0, 6).toUpperCase();

/**
 * Refund rule:
 *  - cancelled fewer than 15 days before the event -> no refund
 *  - otherwise -> full refund less 5%
 */
const computeRefund = (total, eventDate, cancelledAt) => {
  const days = Math.floor(
    (new Date(eventDate) - new Date(cancelledAt)) / MS_PER_DAY
  );

  if (Number.isNaN(days)) {
    return { amount: 0, note: "(Date unavailable)" };
  }
  if (days < NO_REFUND_WITHIN_DAYS) {
    return { amount: 0, note: `(Less than ${NO_REFUND_WITHIN_DAYS} days)` };
  }
  return {
    amount: total * (1 - REFUND_FEE_RATE),
    note: `(Full refund less ${REFUND_FEE_RATE * 100}%)`,
  };
};

const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Not logged in");
  return { Authorization: `Bearer ${session.access_token}` };
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

  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionErrorId, setActionErrorId] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const toggleQuote = (id) =>
    setExpandedQuotes((prev) => ({ ...prev, [id]: !prev[id] }));

  /* ----------------------------- data ----------------------------- */
  const fetchAdminBookings = useCallback(async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/bookings/`, { headers });

      if (!response.ok) {
        console.error("Failed to load bookings:", await response.text());
        setBookingRequests([]);
        return;
      }

      const data = await response.json();

      setBookingRequests(
        data.map((b) => ({
          id: b.id,
          title: b.event_name || "Untitled Event",
          eventType: b.event_type || "event",
          status: b.status || "pending",
          clientName: b.client_name || "Unknown",
          clientEmail: b.client_email || "",
          submittedDate: b.created_at ? b.created_at.split("T")[0] : "Recent",
          date: b.event_date || "TBD",
          startTime: b.start_time || null,
          time:
            b.start_time && b.end_time
              ? `${b.start_time} - ${b.end_time}`
              : "All Day",
          venue: b.venue || "Venue TBD",
          notes: b.notes || "",
          equipment: Array.isArray(b.booking_equipment)
            ? b.booking_equipment.map((be) => be.equipment?.name).filter(Boolean)
            : [],
          totalAmount: b.total_amount || 0,

          // Cancellation details (adjust these keys to match your backend)
          cancelledAt: b.cancelled_at || b.updated_at || null,
          cancelReason: b.cancellation_reason || "No reason provided",
          refundStatus: b.refund_status || "pending", // "pending" | "processed"
        }))
      );
    } catch (err) {
      console.error(err);
      setBookingRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminBookings();
  }, [fetchAdminBookings]);

  const updateBookingStatus = async (id, newStatus) => {
    setActioningId(id);
    setActionErrorId(null);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${API_URL}/bookings/${id}?status=${newStatus}`,
        { method: "PATCH", headers }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to update booking");
      }

      setBookingRequests((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error(err);
      setActionErrorId(id);
    } finally {
      setActioningId(null);
    }
  };

  const handleApprove = (id) => updateBookingStatus(id, "approved");
  const handleDecline = (id) => updateBookingStatus(id, "declined");
  const handleComplete = (id) => updateBookingStatus(id, "completed");

  /* --------------------------- calendar --------------------------- */
  const eventsByDate = useMemo(() => {
    const map = {};
    bookingRequests
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
  }, [bookingRequests]);

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
      bookingRequests
        .filter((b) => b.status === "cancelled")
        .sort((a, b) => new Date(b.cancelledAt || 0) - new Date(a.cancelledAt || 0))
        .map((b) => {
          const refund = computeRefund(b.totalAmount, b.date, b.cancelledAt);
          const isProcessed = b.refundStatus === "processed";

          return {
            id: `CXL-${shortId(b.id)}`,
            client: b.clientName,
            bkgId: `BKG-${shortId(b.id)}`,
            eventDate: b.date,
            timestamp: formatTimestamp(b.cancelledAt),
            reason: b.cancelReason,
            refundAmount: formatPeso(refund.amount),
            refundNote: refund.note,
            statusLabel: isProcessed ? "REFUND PROCESSED" : "REFUND PENDING",
            statusKey: isProcessed ? "processed" : "pending",
          };
        }),
    [bookingRequests]
  );

  /* --------------------------- summary --------------------------- */
  const countBy = (...statuses) =>
    bookingRequests.filter((b) => statuses.includes(b.status)).length;

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

          {loading && <p className="text-neutral-500 text-sm">Loading bookings...</p>}

          {!loading && bookingRequests.length === 0 && (
            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-8 text-center text-neutral-400 text-sm">
              No booking requests yet.
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
                        Failed to update — try again.
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
                  </div>
                </div>
              );
            })}
          </div>
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
              All cancellations are permanently recorded with timestamps and automated refund computation rules.
            </p>
          </div>

          {loading && <p className="text-neutral-500 text-sm">Loading cancellations...</p>}

          {!loading && cancellationLogs.length === 0 && (
            <div className="border border-[#1b212f] rounded-2xl bg-[#090b10] p-8 text-center text-neutral-400 text-sm">
              No cancellations recorded.
            </div>
          )}

          {cancellationLogs.length > 0 && (
            <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
              <table className="w-full text-left min-w-[850px] text-xs">
                <thead>
                  <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-[#0b0e14]">
                    <th className="py-4 pl-6">Cancellation ID</th>
                    <th className="py-4">Booking Info</th>
                    <th className="py-4">Timestamp</th>
                    <th className="py-4">Reason / Remarks</th>
                    <th className="py-4">Computed Refund</th>
                    <th className="py-4 pr-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141824]">
                  {cancellationLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#121622] transition-colors">
                      <td className="py-4 pl-6 font-mono font-bold text-white text-[11px]">
                        {log.id}
                      </td>
                      <td className="py-4">
                        <p className="font-bold text-white">{log.client}</p>
                        <p className="text-[10px] text-neutral-500 font-mono">
                          {log.bkgId} • Event: {log.eventDate}
                        </p>
                      </td>
                      <td className="py-4 text-neutral-400 font-mono text-[11px]">
                        {log.timestamp}
                      </td>
                      <td className="py-4 text-neutral-300">{log.reason}</td>
                      <td className="py-4">
                        <p className="font-bold font-mono text-red-500">{log.refundAmount}</p>
                        <p className="text-[10px] text-red-500/80">{log.refundNote}</p>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border inline-block ${REFUND_BADGE_STYLES[log.statusKey]}`}
                        >
                          {log.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
