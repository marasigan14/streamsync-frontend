import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  FileText,
  Check,
} from "lucide-react";

const ManageBookings = () => {
  const [subTab, setSubTab] = useState("requests"); // "requests" | "calendar" | "cancellations"
  const [expandedQuotes, setExpandedQuotes] = useState({
    "bkg-1": true,
    "bkg-2": false,
    "bkg-4": false,
  });

  // Calendar Dynamic Navigation State (defaults to June 2026: year 2026, month 5)
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 5, 1));

  const toggleQuote = (id) => {
    setExpandedQuotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // State for booking requests
  const [bookingRequests, setBookingRequests] = useState([
    {
      id: "bkg-1",
      title: "Tech Summit 2026",
      statusBadge: "Pencil Book",
      badgeColor: "amber",
      clientName: "John Doe",
      clientEmail: "johndoe@example.com",
      submittedDate: "June 10, 2026",
      date: "2026-06-15",
      time: "09:00 AM - 05:00 PM",
      venue: "SMX Convention Center",
      attendees: 500,
      services: ["Livestreaming", "Video Production"],
      equipment: ["Cameras (PTZ)", "Projector"],
      notes: "Needs backup generator",
      totalAmount: 98000,
      downpayment: 49000,
      actionType: "waiting_quote",
    },
    {
      id: "bkg-2",
      title: "Sarah & Mike Wedding",
      statusBadge: "Confirmed",
      badgeColor: "cyan",
      secondaryBadge: "Updated",
      clientName: "Sarah Smith",
      clientEmail: "sarahs@wedding.com",
      submittedDate: "May 10, 2026",
      date: "2026-06-25",
      time: "02:00 PM - 08:00 PM",
      venue: "Tagaytay Highlands",
      attendees: 150,
      services: ["Livestreaming", "Video Coverage"],
      equipment: ["Cameras (PTZ)"],
      notes: "Outdoor ceremony, please prepare for rain.",
      totalAmount: 50000,
      downpayment: 25000,
      paymentApproved: true,
      actionType: "invoice_sent",
      invoiceSentDate: "May 12",
    },
    {
      id: "bkg-3",
      title: "Summer Music Fest",
      statusBadge: "Rejected",
      badgeColor: "red",
      clientName: "Mark Johnson",
      clientEmail: "markj@musicfest.com",
      submittedDate: "May 15, 2026",
      date: "2026-07-10",
      time: "04:00 PM - 12:00 AM",
      venue: "Philippine Arena",
      attendees: 5000,
      services: ["Lights & Sounds", "Live Band"],
      equipment: ["Concert Rig", "LED Wall"],
      notes: "Stage requires 3 wireless roaming cameras.",
      actionType: "none",
      isRejected: true,
    },
    {
      id: "bkg-4",
      title: "Product Launch Webinar",
      statusBadge: "Pending Review",
      badgeColor: "orange",
      clientName: "Anna Cruz",
      clientEmail: "annac@example.ph",
      submittedDate: "June 12, 2026",
      date: "2026-08-10",
      time: "10:00 AM - 12:00 PM",
      venue: "Virtual (Streamed from BGC Office)",
      attendees: 100,
      services: ["Livestreaming", "Virtual Setup"],
      equipment: ["Webinar Kit", "2x Cameras", "Studio Mic Set"],
      notes: "Client still deciding on final guest list.",
      totalAmount: 38000,
      downpayment: 19000,
      actionType: "review_and_confirm",
    },
    {
      id: "bkg-5",
      title: "University Graduation Ceremony",
      statusBadge: "Pencil Book",
      badgeColor: "amber",
      clientName: "Carlos Reyes",
      clientEmail: "carlos@university.ph",
      submittedDate: "June 15, 2026",
      date: "2026-08-30",
      time: "08:00 AM - 12:00 PM",
      venue: "Araneta Coliseum",
      attendees: 3000,
      services: ["Livestreaming", "Multi-Camera Setup", "LED Wall"],
      equipment: ["Academic Rollout", "4x PTZ Cameras", "Switcher", "LED Controllers"],
      notes: "Tentative date - may change based on school calendar.",
      actionType: "tentative_waiting",
    },
    {
      id: "bkg-6",
      title: "Quarterly Sales Conference",
      statusBadge: "Confirmed",
      badgeColor: "cyan",
      clientName: "Lisa Tan",
      clientEmail: "lisa@company.com",
      submittedDate: "May 20, 2026",
      date: "2026-09-05",
      time: "01:00 PM - 05:00 PM",
      venue: "Marriott Hotel Manila",
      attendees: 300,
      services: ["Livestreaming", "Presentation Recording"],
      equipment: ["Corporate Standard", "2x Cameras", "Projector", "Audio System"],
      actionType: "invoice_fully_paid",
      invoicePaidDate: "June 02",
    },
  ]);

  // Calendar Scheduled Events database
  const calendarEvents = [
    { date: "2026-06-15", name: "Tech Summit 2026", time: "09:00 AM", theme: "amber" },
    { date: "2026-06-20", name: "Product Launch", time: "10:00 AM", theme: "orange" },
    { date: "2026-06-25", name: "Sarah & Mike Wedding", time: "02:00 PM", theme: "cyan" },
    { date: "2026-06-30", name: "University Grad", time: "08:00 AM", theme: "amber" },
    { date: "2026-07-10", name: "Summer Music Fest", time: "04:00 PM", theme: "orange" },
    { date: "2026-07-18", name: "Executive Townhall", time: "01:00 PM", theme: "cyan" },
    { date: "2026-08-10", name: "Product Launch Webinar", time: "10:00 AM", theme: "orange" },
    { date: "2026-08-30", name: "Graduation Ceremony", time: "08:00 AM", theme: "amber" },
    { date: "2026-09-05", name: "Quarterly Sales Con", time: "01:00 PM", theme: "cyan" },
  ];

  // Cancellation Logs
  const cancellationLogs = [
    {
      id: "CXL-001",
      client: "Juan dela Cruz",
      bkgId: "BKG-082",
      eventDate: "2026-06-25",
      timestamp: "2026-06-15 09:30 AM",
      reason: "Schedule conflict",
      refundAmount: "₱0",
      refundNote: "(Less than 15 days)",
      status: "REFUND PROCESSED",
      statusColor: "emerald",
    },
    {
      id: "CXL-002",
      client: "Maria Santos",
      bkgId: "BKG-064",
      eventDate: "2026-07-20",
      timestamp: "2026-06-10 02:15 PM",
      reason: "Downgraded to smaller venue",
      refundAmount: "₱12,500",
      refundNote: "(Full refund less 5%)",
      status: "REFUND PENDING",
      statusColor: "amber",
    },
    {
      id: "CXL-003",
      client: "XYZ Corp",
      bkgId: "BKG-045",
      eventDate: "2026-08-05",
      timestamp: "2026-06-05 11:45 AM",
      reason: "Event cancelled entirely",
      refundAmount: "₱50,000",
      refundNote: "(Full refund less 5%)",
      status: "REFUND PROCESSED",
      statusColor: "emerald",
    },
  ];

  const handleConfirmBooking = (id) => {
    setBookingRequests((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, statusBadge: "Confirmed", badgeColor: "cyan", actionType: "invoice_sent", invoiceSentDate: "Today" }
          : b
      )
    );
  };

  // Calendar Helpers
  const nextMonth = () => {
    setCurrentCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const renderCalendarDays = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday: 0, Monday: 1, ...
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // 1. Previous Month Days (Rendered with subtle inactive styling)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDateObj = new Date(year, month - 1, dayNum);
      const dateString = `${prevDateObj.getFullYear()}-${String(prevDateObj.getMonth() + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      const dayEvents = calendarEvents.filter((e) => e.date === dateString);

      cells.push({
        dayNum,
        isCurrentMonth: false,
        dateString,
        events: dayEvents,
        isToday: false,
      });
    }

    // 2. Current Month Days
    const today = new Date();
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = calendarEvents.filter((e) => e.date === dateString);
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day;

      cells.push({
        dayNum: day,
        isCurrentMonth: true,
        dateString,
        events: dayEvents,
        isToday,
      });
    }

    // 3. Next Month Days (Padding up to 35 or 42 grid cells)
    const remainingCells = 35 - cells.length > 0 ? 35 - cells.length : 42 - cells.length;
    for (let day = 1; day <= remainingCells; day++) {
      const nextDateObj = new Date(year, month + 1, day);
      const dateString = `${nextDateObj.getFullYear()}-${String(nextDateObj.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = calendarEvents.filter((e) => e.date === dateString);

      cells.push({
        dayNum: day,
        isCurrentMonth: false,
        dateString,
        events: dayEvents,
        isToday: false,
      });
    }

    return cells;
  };

  const monthYearHeading = currentCalendarDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-[#1b212f] text-xs font-black uppercase tracking-wider overflow-x-auto">
        <button
          type="button"
          onClick={() => setSubTab("requests")}
          className={`pb-3.5 transition cursor-pointer whitespace-nowrap ${
            subTab === "requests"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Booking Requests
        </button>

        <button
          type="button"
          onClick={() => setSubTab("calendar")}
          className={`pb-3.5 transition cursor-pointer whitespace-nowrap ${
            subTab === "calendar"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Calendar View
        </button>

        <button
          type="button"
          onClick={() => setSubTab("cancellations")}
          className={`pb-3.5 transition cursor-pointer whitespace-nowrap ${
            subTab === "cancellations"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Cancellation Logs
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. SUB-TAB: BOOKING REQUESTS                                    */}
      {/* ============================================================== */}
      {subTab === "requests" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                Pending Review
              </p>
              <h3 className="text-3xl font-black text-amber-500">1</h3>
            </div>
            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                Pencil Bookings
              </p>
              <h3 className="text-3xl font-black text-orange-400">2</h3>
            </div>
            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                Confirmed
              </p>
              <h3 className="text-3xl font-black text-cyan-400">2</h3>
            </div>
            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                Approved
              </p>
              <h3 className="text-3xl font-black text-emerald-500">0</h3>
            </div>
          </div>

          <div className="space-y-5">
            {bookingRequests.map((bkg) => {
              const isQuoteOpen = expandedQuotes[bkg.id];
              return (
                <div
                  key={bkg.id}
                  className={`bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 transition-all ${
                    bkg.isRejected ? "opacity-75 hover:opacity-100" : ""
                  } ${bkg.statusBadge === "Pending Review" ? "border-l-4 border-l-orange-500" : ""}`}
                >
                  <div className="flex-1 space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black uppercase text-white tracking-wide">
                          {bkg.title}
                        </h3>
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border ${
                            bkg.badgeColor === "amber"
                              ? "bg-amber-950/40 text-amber-500 border-amber-800/50"
                              : bkg.badgeColor === "cyan"
                              ? "bg-cyan-950/40 text-cyan-400 border-cyan-800/50"
                              : bkg.badgeColor === "orange"
                              ? "bg-orange-950/40 text-orange-400 border-orange-800/50"
                              : "bg-red-950/40 text-red-500 border-red-800/50"
                          }`}
                        >
                          {bkg.statusBadge}
                        </span>

                        {bkg.secondaryBadge && (
                          <span className="bg-purple-950/40 border border-purple-800/50 text-purple-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                            {bkg.secondaryBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400">
                        {bkg.clientName} • {bkg.clientEmail}
                      </p>
                      <p className="text-[10px] text-neutral-500 font-mono mt-1">
                        Submitted: {bkg.submittedDate}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
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
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          <Users size={12} className="text-red-500" /> Attendees
                        </p>
                        <p className="font-bold text-white">{bkg.attendees}</p>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5">
                          Services
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {bkg.services?.map((s, idx) => (
                            <span
                              key={idx}
                              className="border border-red-900/50 bg-[#090b10] text-red-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {bkg.equipment && (
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

                    {bkg.totalAmount && (
                      <div className="border border-[#1b212f] rounded-xl overflow-hidden bg-[#090b10]">
                        <div
                          onClick={() => toggleQuote(bkg.id)}
                          className="px-4 py-3 flex items-center justify-between border-b border-[#1b212f] cursor-pointer hover:bg-[#121622] transition"
                        >
                          <span className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                            <FileText size={14} className="text-red-500" /> Preliminary Quotation
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1">
                            {isQuoteOpen ? "Hide" : "Review & Adjust"}
                            {isQuoteOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                        </div>

                        {isQuoteOpen && (
                          <div className="p-4 space-y-2 text-xs bg-[#0b0e14]">
                            <div className="flex justify-between items-center text-neutral-400">
                              <span>Total Amount:</span>
                              <span className="font-mono font-bold text-white text-sm">
                                ₱{bkg.totalAmount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-cyan-400 font-bold">
                              <span>Downpayment (50%):</span>
                              <span className="font-mono text-sm">
                                ₱{bkg.downpayment.toLocaleString()}
                              </span>
                            </div>
                            {bkg.paymentApproved && (
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 pt-2 border-t border-[#181f2e] mt-2">
                                <CheckCircle2 size={13} />
                                <span>Payment Approved</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="w-full lg:w-64 shrink-0 flex flex-col justify-start gap-4">
                    {bkg.actionType === "waiting_quote" && (
                      <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-5 flex flex-col items-center justify-center text-center h-32">
                        <Clock size={22} className="text-amber-500 mb-2" />
                        <p className="text-xs font-bold text-amber-500 leading-snug">
                          Waiting for automated quote to clear
                        </p>
                      </div>
                    )}

                    {bkg.actionType === "invoice_sent" && (
                      <>
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-[#090b10] border border-[#1b212f] rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2 border border-cyan-500/20">
                            <Check size={18} />
                          </div>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed">
                            Automated Invoice Sent<br />{bkg.invoiceSentDate}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="w-full bg-transparent border border-red-900/50 hover:bg-red-950/30 text-red-500 text-xs font-bold tracking-wider py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Mail size={14} /> Send follow up email
                        </button>
                      </>
                    )}

                    {bkg.actionType === "review_and_confirm" && (
                      <>
                        <div className="bg-orange-950/20 border border-orange-900/40 rounded-xl p-5 flex flex-col items-center justify-center text-center h-32">
                          <AlertCircle size={22} className="text-orange-500 mb-2" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 leading-relaxed">
                            Review booking details and confirm
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleConfirmBooking(bkg.id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg shadow-red-950/40 cursor-pointer"
                        >
                          Confirm Booking
                        </button>
                      </>
                    )}

                    {bkg.actionType === "tentative_waiting" && (
                      <div className="border border-amber-900/40 bg-amber-950/10 rounded-xl p-5 flex flex-col items-center justify-center text-center h-32">
                        <Clock size={22} className="text-amber-500 mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 leading-relaxed">
                          Tentative booking - awaiting client confirmation
                        </p>
                      </div>
                    )}

                    {bkg.actionType === "invoice_fully_paid" && (
                      <>
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-[#090b10] border border-[#1b212f] rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2 border border-cyan-500/20">
                            <Check size={18} />
                          </div>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed">
                            Invoice fully paid<br />{bkg.invoicePaidDate}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="w-full bg-transparent border border-red-900/50 hover:bg-red-950/30 text-red-500 text-xs font-bold tracking-wider py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          View Event Dashboard
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SUB-TAB: CALENDAR VIEW (With Other Months Visible & Nav)     */}
      {/* ============================================================== */}
      {subTab === "calendar" && (
        <div className="space-y-6">
          <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black uppercase text-white tracking-wider">
                  Booking Calendar
                </h3>
                <p className="text-xs text-neutral-400">
                  Monthly view of all scheduled events.
                </p>
              </div>

              {/* Functional Month Switcher */}
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
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div> Confirmed
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Approved
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div> Pencil Book
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div> Pending
              </span>
            </div>

            {/* Dynamic Month Calendar Grid */}
            <div className="border border-[#1b212f] rounded-2xl overflow-hidden bg-[#090b10]">
              <div className="grid grid-cols-7 border-b border-[#1b212f] text-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest py-3 bg-[#0b0e14]">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              {/* Dynamic Grid Cells */}
              <div className="grid grid-cols-7 text-xs text-neutral-400">
                {renderCalendarDays().map((cell, index) => (
                  <div
                    key={index}
                    className={`min-h-[115px] border-r border-b border-[#1b212f] p-2.5 flex flex-col justify-between transition-colors ${
                      !cell.isCurrentMonth
                        ? "bg-[#06080c]/60 text-neutral-600"
                        : "bg-[#090b10] hover:bg-[#0d1017]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
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
                    </div>

                    {/* Rendered Event Chips */}
                    <div className="space-y-1 my-1">
                      {cell.events.map((evt, idx) => (
                        <div
                          key={idx}
                          className={`p-1.5 rounded-lg text-[9px] font-bold leading-tight border ${
                            evt.theme === "amber"
                              ? "bg-[#241a10] border-[#482d18] text-[#f59e0b]"
                              : evt.theme === "orange"
                              ? "bg-[#26150c] border-[#522212] text-orange-400"
                              : "bg-[#0b1f2e] border-[#164e63] text-cyan-400"
                          }`}
                        >
                          <p className="truncate">{evt.name}</p>
                          <span className="text-[8px] font-mono opacity-80">{evt.time}</span>
                        </div>
                      ))}
                    </div>

                    <div className="h-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. SUB-TAB: CANCELLATION LOGS                                   */}
      {/* ============================================================== */}
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

                    <td className="py-4 text-neutral-300">
                      {log.reason}
                    </td>

                    <td className="py-4">
                      <p className="font-bold font-mono text-red-500">{log.refundAmount}</p>
                      <p className="text-[10px] text-red-500/80">{log.refundNote}</p>
                    </td>

                    <td className="py-4 pr-6 text-right">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border inline-block ${
                          log.statusColor === "emerald"
                            ? "bg-[#0e241c] text-[#22c55e] border-[#144231]"
                            : "bg-[#2a1d13] text-[#f59e0b] border-[#482d18]"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;