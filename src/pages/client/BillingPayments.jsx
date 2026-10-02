import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  Eye,
  CreditCard,
  Info,
  X,
  Upload,
  TrendingUp,
  History,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { supabase } from "../../supabaseClient"; // adjust if this file lives elsewhere

const API_URL = "http://127.0.0.1:8000";
const DOWNPAYMENT_RATE = 0.5; // manuscript: 50% downpayment (projector flat fee still to be decided)
const ACTIVE_BOOKING_STATUSES = ["pending", "approved", "ongoing"];
const PAYABLE_BOOKING_STATUSES = ["approved", "ongoing"]; // per the manuscript, pay only after approval

const paymentDetails = {
  gcash: {
    label: "GCash",
    emoji: "💙",
    accountName: "Livestream Manila",
    accountNumber: "0993 674 2673",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=09936742673-GCASH-LIVESTREAMMANILA",
  },
  maya: {
    label: "Maya",
    emoji: "💚",
    accountName: "Livestream Manila",
    accountNumber: "0993 674 2673",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=09936742673-MAYA-LIVESTREAMMANILA",
  },
  bdo: {
    label: "BDO Bank",
    emoji: "🏦",
    accountName: "Livestream Manila Events",
    accountNumber: "0040 8888 8012",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=004088888012-BDO-LIVESTREAMMANILA",
  },
};

const METHOD_LABELS = { gcash: "GCash", maya: "Maya", bdo: "BDO", cash: "Cash", other: "Other" };

const peso = (n) =>
  `₱${Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
    : "—";

// Describes the 48-hour downpayment window set when the admin approves a booking.
const describeDeadline = (iso) => {
  if (!iso) return null;
  // The backend stores UTC without a timezone suffix; treat it as UTC.
  const due = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? iso : `${iso}Z`);
  if (isNaN(due.getTime())) return null;

  const msLeft = due.getTime() - Date.now();
  const when = due.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  if (msLeft <= 0) return { overdue: true, text: `Payment window ended ${when}` };

  const hours = Math.floor(msLeft / 3600000);
  const mins = Math.floor((msLeft % 3600000) / 60000);
  const left = hours >= 1 ? `${hours}h ${mins}m left` : `${mins}m left`;
  return { overdue: false, text: `Pay by ${when} (${left})` };
};

const authHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
};

// ---------------------------------------------------------------- badges

const StatusBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  if (s === "verified") {
    return (
      <span className="inline-flex items-center gap-1 bg-[#0b2419] text-[#22c55e] border border-[#14532d] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
        ✓ Verified
      </span>
    );
  }
  if (s === "verifying") {
    return (
      <span className="inline-flex items-center gap-1 bg-[#2b2111] text-[#f59e0b] border border-[#78350f] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
        <Clock size={10} /> Verifying
      </span>
    );
  }
  if (s === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 bg-[#2a1215] text-[#f87171] border border-[#7f1d1d] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
        <XCircle size={10} /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-[#1a1c23] text-neutral-400 border border-neutral-700/60 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
      Not Paid
    </span>
  );
};

const BookingChip = ({ status }) => {
  const map = {
    pending: ["Awaiting Review", "text-amber-400 border-amber-900/50 bg-amber-950/30"],
    approved: ["Approved", "text-emerald-400 border-emerald-900/50 bg-emerald-950/30"],
    ongoing: ["Ongoing", "text-sky-400 border-sky-900/50 bg-sky-950/30"],
    completed: ["Completed", "text-neutral-300 border-neutral-700 bg-neutral-900"],
    cancelled: ["Cancelled", "text-neutral-500 border-neutral-800 bg-neutral-900"],
    declined: ["Declined", "text-red-400 border-red-900/50 bg-red-950/30"],
  };
  const [label, cls] = map[status] || [status, "text-neutral-400 border-neutral-700 bg-neutral-900"];
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
};

// ---------------------------------------------------------------- component

const BillingPayments = () => {
  const [subTab, setSubTab] = useState("overview"); // "overview" | "make-payment" | "history"
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Pay modal
  const [payModal, setPayModal] = useState(null); // { row, type, amount }
  const [selectedMethod, setSelectedMethod] = useState("gcash");
  const [refNumber, setRefNumber] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [payError, setPayError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedProof, setSubmittedProof] = useState(false);

  // ------------------------------------------------------------ data

  const load = useCallback(async () => {
    try {
      const headers = await authHeaders();
      const [bRes, pRes] = await Promise.all([
        fetch(`${API_URL}/bookings/mine`, { headers }),
        fetch(`${API_URL}/payments/mine`, { headers }),
      ]);
      if (!bRes.ok || !pRes.ok) throw new Error("Could not load your billing information.");
      setBookings(await bRes.json());
      setPayments(await pRes.json());
      setError("");
    } catch (e) {
      setError(e.message || "Could not load your billing information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    // When the admin verifies or rejects a proof, this page updates by itself.
    const channel = supabase
      .channel("client-payments-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, () => load())
      .subscribe();

    // Booking changes (admin approval, auto-cancel after 48h) aren't pushed in realtime,
    // so refresh every 30s and whenever the tab becomes visible again.
    const interval = setInterval(load, 30000);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  // ------------------------------------------------------------ derived billing

  const { rows, stats } = useMemo(() => {
    const byBooking = {};
    payments.forEach((p) => {
      if (!byBooking[p.booking_id]) byBooking[p.booking_id] = [];
      byBooking[p.booking_id].push(p);
    });

    const rows = bookings
      .map((b) => {
        const total = Number(b.total_amount || 0);
        const list = (byBooking[b.id] || []).slice().sort(
          (x, y) => new Date(y.submitted_at) - new Date(x.submitted_at)
        );

        const statusOf = (type) => {
          const l = list.filter((p) => p.payment_type === type);
          if (l.some((p) => p.proof_status === "verified")) return "verified";
          if (l.some((p) => p.proof_status === "submitted")) return "verifying";
          if (l.length && l[0].proof_status === "rejected") return "rejected";
          return "not-paid";
        };

        const rejectionOf = (type) => {
          const l = list.filter((p) => p.payment_type === type);
          return l.length && l[0].proof_status === "rejected" ? l[0].rejection_reason : null;
        };

        const verifiedOf = (type) =>
          list
            .filter((p) => p.payment_type === type && p.proof_status === "verified")
            .reduce((s, p) => s + Number(p.amount_paid || 0), 0);

        const verifiedSum = list
          .filter((p) => p.proof_status === "verified" && p.payment_type !== "refund")
          .reduce((s, p) => s + Number(p.amount_paid || 0), 0);

        const downpaymentStatus = statusOf("downpayment");
        const balanceStatus = statusOf("balance");

        const expectedDown = Math.round(total * DOWNPAYMENT_RATE * 100) / 100;
        const downpaymentAmount = downpaymentStatus === "verified" ? verifiedOf("downpayment") : expectedDown;
        const balanceAmount = Math.max(0, total - downpaymentAmount);

        const active = ACTIVE_BOOKING_STATUSES.includes(b.status);
        const canPay = PAYABLE_BOOKING_STATUSES.includes(b.status);
        const awaitingApproval = b.status === "pending";
        const isFullyPaid = total > 0 && verifiedSum >= total - 0.01;

        let nextPayment = null;
        if (canPay && total > 0 && !isFullyPaid) {
          if (downpaymentStatus === "not-paid" || downpaymentStatus === "rejected") {
            nextPayment = {
              type: "downpayment",
              amount: downpaymentAmount,
              label: downpaymentStatus === "rejected" ? "Resubmit Downpayment" : "Pay Downpayment",
            };
          } else if (
            downpaymentStatus === "verified" &&
            (balanceStatus === "not-paid" || balanceStatus === "rejected")
          ) {
            nextPayment = {
              type: "balance",
              amount: balanceAmount,
              label: balanceStatus === "rejected" ? "Resubmit Balance" : "Pay Balance",
            };
          }
        }

        return {
          id: b.id,
          title: b.event_name,
          date: b.event_date,
          location: b.venue || "—",
          status: b.status,
          paymentDueAt: b.payment_due_at,
          awaitingApproval,
          total,
          active,
          isFullyPaid,
          verifiedSum,
          remaining: Math.max(0, total - verifiedSum),
          downpaymentAmount,
          balanceAmount,
          downpaymentStatus,
          balanceStatus,
          downpaymentRejection: rejectionOf("downpayment"),
          balanceRejection: rejectionOf("balance"),
          underReview: downpaymentStatus === "verifying" || balanceStatus === "verifying",
          nextPayment,
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const rowById = {};
    rows.forEach((r) => (rowById[r.id] = r));

    const totalPaid = payments
      .filter((p) => p.proof_status === "verified" && p.payment_type !== "refund")
      .reduce((s, p) => s + Number(p.amount_paid || 0), 0);

    const pendingVerification = payments
      .filter((p) => p.proof_status === "submitted")
      .reduce((s, p) => {
        const r = rowById[p.booking_id];
        if (!r) return s;
        return s + (p.payment_type === "balance" ? r.balanceAmount : r.downpaymentAmount);
      }, 0);

    const balanceDue = rows.filter((r) => r.active).reduce((s, r) => s + r.remaining, 0);

    return { rows, stats: { totalPaid, pendingVerification, balanceDue } };
  }, [bookings, payments]);

  const rowById = useMemo(() => {
    const m = {};
    rows.forEach((r) => (m[r.id] = r));
    return m;
  }, [rows]);

  // ------------------------------------------------------------ pay modal

  const openPayModal = (row) => {
    if (!row.nextPayment) return;
    setPayModal({ row, type: row.nextPayment.type, amount: row.nextPayment.amount });
    setSelectedMethod("gcash");
    setRefNumber("");
    setProofFile(null);
    setFileError("");
    setPayError("");
    setSubmittedProof(false);
  };

  const closePayModal = () => {
    setPayModal(null);
    setSubmitting(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    if (file && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFileError("Please choose a JPG, PNG, or WEBP image.");
      setProofFile(null);
      e.target.value = "";
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setFileError("Image is too large. Maximum size is 5 MB.");
      setProofFile(null);
      e.target.value = "";
      return;
    }
    setFileError("");
    setProofFile(file);
  };

  const submitProof = async () => {
    setPayError("");
    if (!refNumber.trim() && !proofFile) {
      setPayError("Add a reference number or a screenshot.");
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("method", selectedMethod);
      form.append("payment_type", payModal.type);
      if (refNumber.trim()) form.append("reference_no", refNumber.trim());
      if (proofFile) form.append("file", proofFile);

      const res = await fetch(`${API_URL}/payments/${payModal.row.id}/proof`, {
        method: "POST",
        headers: await authHeaders(), // no Content-Type: the browser sets the multipart boundary
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Could not submit your proof.");
      }

      setSubmittedProof(true);
      await load();
    } catch (e) {
      setPayError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------------------------------------ render

  return (
    <div className="w-full space-y-7 font-['Montserrat',sans-serif]">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-black tracking-wide uppercase text-white mb-1">Billing & Payments</h1>
        <p className="text-xs text-neutral-400">Manage invoices, payments, and transaction history</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-600/60 text-red-400 flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </span>
          <button onClick={load} className="font-bold underline cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex flex-col justify-between min-h-[115px]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-950/70 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 size={15} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Total Paid</p>
              <h2 className="text-2xl font-black text-white leading-tight">{peso(stats.totalPaid)}</h2>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 font-medium mt-3">All verified payments</p>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex flex-col justify-between min-h-[115px]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-amber-950/70 border border-amber-600/50 flex items-center justify-center text-amber-400 shrink-0">
              <Clock size={15} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Pending Verification</p>
              <h2 className="text-2xl font-black text-white leading-tight">{peso(stats.pendingVerification)}</h2>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 font-medium mt-3">Being verified by admin</p>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex flex-col justify-between min-h-[115px]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-red-950/70 border border-red-600/50 flex items-center justify-center text-red-500 shrink-0">
              <DollarSign size={15} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Balance Due</p>
              <h2 className="text-2xl font-black text-white leading-tight">{peso(stats.balanceDue)}</h2>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 font-medium mt-3">Upcoming event balances</p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-[#1b212f] text-xs font-black uppercase tracking-wider">
        {[
          { key: "overview", label: "Payment Overview", icon: <TrendingUp size={14} /> },
          { key: "make-payment", label: "Make Payment", icon: <CreditCard size={14} /> },
          { key: "history", label: "Transaction History", icon: <History size={14} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`flex items-center gap-2 pb-3.5 transition-colors cursor-pointer ${
              subTab === t.key
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {loading && <p className="text-xs text-neutral-500">Loading your billing information...</p>}

      {/* ========================================================= */}
      {/* 1. PAYMENT OVERVIEW                                        */}
      {/* ========================================================= */}
      {!loading && subTab === "overview" && (
        <div className="space-y-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-white">Your Bookings & Invoices</h3>

          {rows.length === 0 && (
            <div className="p-8 rounded-2xl bg-[#0f121a] border border-[#1b212f] text-center text-xs text-neutral-500">
              You don't have any bookings yet. Once you book a service, your invoice will appear here.
            </div>
          )}

          <div className="space-y-4">
            {rows.map((inv) => (
              <div key={inv.id} className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-base font-black text-white uppercase tracking-wide">{inv.title}</h4>
                      <BookingChip status={inv.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-400 mt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-neutral-500" />
                        {inv.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-neutral-500" />
                        {inv.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    {inv.isFullyPaid && (
                      <span className="bg-[#0e241c] text-[#22c55e] border border-[#14532d] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        Fully Paid
                      </span>
                    )}

                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="flex items-center gap-1.5 bg-[#172033] hover:bg-[#202c45] border border-[#273552] text-neutral-200 text-xs font-bold py-2 px-4 rounded-xl transition cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>View Invoice</span>
                    </button>

                    {inv.nextPayment && (
                      <button
                        onClick={() => openPayModal(inv)}
                        className="flex items-center gap-1 bg-[#ff0000] hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider py-2 px-4 rounded-xl transition cursor-pointer shadow-md shadow-red-950/40"
                      >
                        <span>{inv.nextPayment.label}</span>
                      </button>
                    )}
                  </div>
                </div>

                {inv.awaitingApproval && (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/40 text-xs text-amber-300 flex items-start gap-2">
                    <Clock size={14} className="shrink-0 mt-0.5" />
                    <p>
                      Payment opens once our team approves your booking. You'll have 48 hours after approval to
                      pay the downpayment.
                    </p>
                  </div>
                )}

                {inv.status === "approved" &&
                  inv.nextPayment?.type === "downpayment" &&
                  (() => {
                    const d = describeDeadline(inv.paymentDueAt);
                    if (!d) return null;
                    return (
                      <div
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                          d.overdue
                            ? "bg-red-950/40 border-red-800/50 text-red-300"
                            : "bg-sky-950/30 border-sky-900/50 text-sky-300"
                        }`}
                      >
                        <Clock size={14} className="shrink-0 mt-0.5" />
                        <p>
                          <span className="font-bold">{d.text}.</span>{" "}
                          {d.overdue
                            ? "This booking may be released shortly if no downpayment is received."
                            : "If the downpayment isn't received by then, the booking is released and the equipment becomes available to other clients."}
                        </p>
                      </div>
                    );
                  })()}

                {(inv.downpaymentRejection || inv.balanceRejection) && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-300 flex items-start gap-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <p>
                      <span className="font-bold">Your payment proof was rejected:</span>{" "}
                      {inv.downpaymentRejection || inv.balanceRejection}. Please upload a new proof.
                    </p>
                  </div>
                )}

                {inv.status === "cancelled" && !inv.isFullyPaid && inv.verifiedSum === 0 && (
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
                    This booking was cancelled or released, so no payment is needed.
                  </div>
                )}

                <div className="border-t border-[#1a2130] pt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Total Invoice:</span>
                    <span className="font-mono font-black text-white text-sm">
                      {inv.total > 0 ? peso(inv.total) : "Quote pending"}
                    </span>
                  </div>

                  {inv.total > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-400">Downpayment (50%):</span>
                          <StatusBadge status={inv.downpaymentStatus} />
                        </div>
                        <span className="font-mono font-bold text-neutral-300">{peso(inv.downpaymentAmount)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-400">Balance Due (50%):</span>
                          <StatusBadge status={inv.balanceStatus} />
                        </div>
                        <span className="font-mono font-bold text-neutral-300">{peso(inv.balanceAmount)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MAKE PAYMENT                                            */}
      {/* ========================================================= */}
      {!loading && subTab === "make-payment" && (
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Make a Payment</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Select a booking and payment method to proceed</p>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Bookings with Pending Payments
            </p>

            {rows.filter((r) => r.nextPayment || r.underReview).length === 0 && (
              <div className="p-6 rounded-2xl bg-[#0f121a] border border-[#1b212f] text-center text-xs text-neutral-500">
                You have no pending payments right now.
              </div>
            )}

            {rows
              .filter((r) => r.nextPayment || r.underReview)
              .map((r) => (
                <div
                  key={r.id}
                  className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wide">{r.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-neutral-400 mt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-neutral-500" /> {r.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-neutral-500" /> {r.location}
                      </span>
                    </div>
                    {r.nextPayment && (
                      <div className="mt-2.5">
                        <span className="bg-[#091b29] text-[#38bdf8] border border-[#0369a1] text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                          {r.nextPayment.type === "balance" ? "Balance" : "Downpayment"} Due{" "}
                          {peso(r.nextPayment.amount)}
                        </span>
                      </div>
                    )}
                  </div>

                  {r.nextPayment ? (
                    <button
                      onClick={() => openPayModal(r)}
                      className="flex items-center gap-1.5 bg-[#ff0000] hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer shadow-md shadow-red-950/40 self-start sm:self-auto"
                    >
                      <span>{r.nextPayment.label}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-amber-500 font-bold bg-amber-950/30 border border-amber-900/40 px-3 py-1 rounded-full self-start sm:self-auto">
                      Payment Under Review
                    </span>
                  )}
                </div>
              ))}
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Available Payment Methods
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(paymentDetails).map(([key, d]) => (
                <div
                  key={key}
                  className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{d.emoji}</span>
                      <h5 className="text-sm font-black text-white">{d.label}</h5>
                    </div>
                    <p className="text-[10px] text-neutral-400">Instant Transfer</p>

                    <div className="space-y-1 mt-4 text-[11px]">
                      <div className="flex justify-between text-neutral-400">
                        <span>Account Name:</span>
                        <span className="text-white font-bold">{d.accountName}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Number:</span>
                        <span className="text-white font-mono font-bold">{d.accountNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center pt-2">
                    <div className="w-24 h-24 bg-white rounded-lg p-1.5 flex items-center justify-center">
                      <img src={d.qrCode} alt={`${d.label} QR`} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-1.5">QR Code Available</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0a121e] border border-[#162a42] rounded-2xl p-4 flex items-start gap-3 text-neutral-400 text-xs">
              <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-0.5">Payment Verification</p>
                <p className="text-[11px] leading-relaxed">
                  After making a payment, upload your receipt for verification. Our team will verify your payment
                  within 24 hours and send you a confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TRANSACTION HISTORY                                     */}
      {/* ========================================================= */}
      {!loading && subTab === "history" && (
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Payment History</h3>
            <p className="text-xs text-neutral-400 mt-0.5">All your payment transactions</p>
          </div>

          {payments.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-6">No payments submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161c28]">
                  {payments.map((txn) => {
                    const row = rowById[txn.booking_id];
                    const verified = txn.proof_status === "verified";
                    const expected = row
                      ? txn.payment_type === "balance"
                        ? row.balanceAmount
                        : row.downpaymentAmount
                      : 0;
                    const status =
                      txn.proof_status === "submitted"
                        ? "verifying"
                        : txn.proof_status === "verified"
                        ? "verified"
                        : "rejected";

                    return (
                      <tr key={txn.id} className="hover:bg-[#121622] transition-colors">
                        <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">
                          {formatDate(txn.submitted_at)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-bold text-white">{row ? row.title : "—"}</p>
                          <span className="text-[10px] text-neutral-500 font-mono">BKG-{txn.booking_id}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {txn.payment_type === "downpayment" ? (
                            <span className="bg-[#0b1f2e] text-[#38bdf8] border border-[#0369a1] text-[10px] font-bold px-2 py-0.5 rounded-md">
                              Downpayment
                            </span>
                          ) : (
                            <span className="bg-[#211233] text-[#c084fc] border border-[#7e22ce] text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {txn.payment_type === "refund" ? "Refund" : "Balance"}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">
                          {METHOD_LABELS[txn.method] || txn.method || "—"}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-400 whitespace-nowrap">
                          {txn.reference_no || "—"}
                        </td>
                        <td
                          className={`py-3.5 px-4 font-mono whitespace-nowrap ${
                            verified ? "font-bold text-white" : "text-neutral-500"
                          }`}
                          title={verified ? "" : "Expected amount, pending verification"}
                        >
                          {verified ? peso(txn.amount_paid) : expected > 0 ? `~${peso(expected)}` : "—"}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={status} />
                          {txn.proof_status === "rejected" && txn.rejection_reason && (
                            <p className="text-[10px] text-red-400 mt-1 max-w-[200px] whitespace-normal">
                              {txn.rejection_reason}
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VIEW INVOICE                                       */}
      {/* ========================================================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0e121a] border border-[#20293d] rounded-2xl overflow-hidden shadow-2xl text-white font-['Montserrat',sans-serif]">
            <div className="p-6 border-b border-[#1b212f] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                  Invoice INV-{selectedInvoice.id}
                </span>
                <h3 className="text-base font-black uppercase text-white mt-0.5">{selectedInvoice.title}</h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full border border-neutral-700 bg-black/40 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#090b10] border border-[#1b212f] rounded-xl">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Date</span>
                  <span className="font-bold text-white">{selectedInvoice.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Location</span>
                  <span className="font-bold text-white truncate block">{selectedInvoice.location}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-[#1b212f] pt-4">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Project Invoice:</span>
                  <span className="font-mono font-bold text-white">
                    {selectedInvoice.total > 0 ? peso(selectedInvoice.total) : "Quote pending"}
                  </span>
                </div>
                {selectedInvoice.total > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">50% Downpayment:</span>
                      <span className="flex items-center gap-2">
                        <StatusBadge status={selectedInvoice.downpaymentStatus} />
                        <span className="font-mono font-bold text-white">
                          {peso(selectedInvoice.downpaymentAmount)}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">50% Remaining Balance:</span>
                      <span className="flex items-center gap-2">
                        <StatusBadge status={selectedInvoice.balanceStatus} />
                        <span className="font-mono font-bold text-white">
                          {peso(selectedInvoice.balanceAmount)}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#1b212f] pt-2">
                      <span className="text-neutral-400">Total verified paid:</span>
                      <span className="font-mono font-bold text-emerald-400">{peso(selectedInvoice.verifiedSum)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-[#1b212f] flex justify-end bg-[#090b10]">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PAY (downpayment or balance)                       */}
      {/* ========================================================= */}
      {payModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0e121a] border border-[#20293d] rounded-2xl overflow-hidden shadow-2xl text-white font-['Montserrat',sans-serif]">
            <div className="p-6 border-b border-[#1b212f] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest block">
                  Secure Checkout
                </span>
                <h3 className="text-base font-black uppercase text-white mt-0.5">
                  {payModal.type === "balance" ? "Pay Balance" : "Pay Downpayment"} — {payModal.row.title}
                </h3>
              </div>
              <button
                onClick={closePayModal}
                className="w-8 h-8 rounded-full border border-neutral-700 bg-black/40 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
              {submittedProof ? (
                <div className="p-5 text-center bg-[#0b2419] border border-[#14532d] rounded-xl text-[#22c55e] space-y-2">
                  <CheckCircle2 size={28} className="mx-auto" />
                  <p className="font-bold text-sm">Payment Proof Submitted!</p>
                  <p className="text-xs text-neutral-300">
                    Our team will verify your payment within 24 hours. This page updates automatically once it's
                    reviewed.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {["gcash", "maya", "bdo"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedMethod(m)}
                        className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                          selectedMethod === m
                            ? "bg-red-600 text-white shadow-md shadow-red-950/40"
                            : "bg-[#090b10] border border-[#1b212f] text-neutral-400 hover:text-white"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-[#090b10] border border-[#1b212f] rounded-xl flex items-center gap-4">
                    <div className="w-24 h-24 bg-white rounded-lg p-1 flex items-center justify-center shrink-0">
                      <img
                        src={paymentDetails[selectedMethod].qrCode}
                        alt={`${selectedMethod} QR`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="text-neutral-400">Amount Due:</p>
                      <p className="text-lg font-black text-white font-mono">{peso(payModal.amount)}</p>
                      <p className="text-[10px] text-neutral-500">
                        Scan with your banking app or send to {paymentDetails[selectedMethod].accountNumber}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                        Reference Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1002948123"
                        value={refNumber}
                        onChange={(e) => setRefNumber(e.target.value)}
                        className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                        Attach Screenshot (Recommended)
                      </label>
                      <label className="flex items-center gap-2 px-3.5 py-2.5 bg-[#090b10] border border-dashed border-[#1b212f] rounded-xl cursor-pointer hover:border-neutral-600 text-xs text-neutral-400">
                        <Upload size={14} className="text-red-500" />
                        <span className="truncate">{proofFile ? proofFile.name : "Choose receipt image..."}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                      {fileError && <p className="text-[11px] text-red-400 mt-1">{fileError}</p>}
                    </div>
                  </div>

                  {payError && (
                    <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/50 text-xs text-red-400">
                      {payError}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-4 border-t border-[#1b212f] flex justify-end gap-2 bg-[#090b10]">
              <button
                onClick={closePayModal}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white uppercase cursor-pointer"
              >
                Close
              </button>
              {!submittedProof && (
                <button
                  disabled={submitting || (!refNumber.trim() && !proofFile)}
                  onClick={submitProof}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-red-950/40"
                >
                  {submitting ? "Submitting..." : "Submit Proof"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPayments;
