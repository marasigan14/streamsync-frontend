import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  Eye,
  CreditCard,
  Building2,
  FileText,
  Info,
  X,
  QrCode,
  Upload,
  Heart,
  TrendingUp,
  History,
} from "lucide-react";

const BillingPayments = () => {
  const [subTab, setSubTab] = useState("overview"); // "overview" | "make-payment" | "history"
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payModalBooking, setPayModalBooking] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("gcash");
  const [refNumber, setRefNumber] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [submittedProof, setSubmittedProof] = useState(false);

  // Invoices & Bookings Mock Data matching your screenshots
  const bookingsInvoices = [
    {
      id: "INV-2026-001",
      bkgId: "BKG-001",
      title: "Tech Summit 2026",
      date: "2026-06-15",
      location: "SMX Convention Center",
      totalInvoice: 98000,
      downpayment: 49000,
      downpaymentStatus: "verifying", // 'verified' | 'verifying' | 'not-paid'
      balance: 49000,
      balanceStatus: "not-paid",
      isFullyPaid: false,
    },
    {
      id: "INV-2026-002",
      bkgId: "BKG-002",
      title: "Sarah & Mike Wedding",
      date: "2026-06-25",
      location: "Tagaytay Highlands",
      totalInvoice: 50000,
      downpayment: 25000,
      downpaymentStatus: "verified",
      balance: 25000,
      balanceStatus: "verified",
      isFullyPaid: true,
    },
    {
      id: "INV-2026-003",
      bkgId: "BKG-003",
      title: "Product Launch Webinar",
      date: "2026-06-20",
      location: "Virtual (BGC Office)",
      totalInvoice: 20000,
      downpayment: 10000,
      downpaymentStatus: "not-paid",
      balance: 10000,
      balanceStatus: "not-paid",
      isFullyPaid: false,
    },
  ];

  // Transaction History Table Data
  const transactionHistory = [
    {
      id: "TXN-101",
      date: "May 25, 2026",
      event: "Sarah & Mike Wedding",
      bkgId: "BKG-002",
      type: "Downpayment",
      method: "GCash",
      reference: "GCSH123456789",
      amount: 25000,
      status: "Verified",
    },
    {
      id: "TXN-102",
      date: "Jun 20, 2026",
      event: "Sarah & Mike Wedding",
      bkgId: "BKG-002",
      type: "Balance",
      method: "Bank Transfer",
      reference: "BD0987654321",
      amount: 25000,
      status: "Verified",
    },
    {
      id: "TXN-103",
      date: "Jun 6, 2026",
      event: "Tech Summit 2026",
      bkgId: "BKG-001",
      type: "Downpayment",
      method: "Maya",
      reference: "MAYA456123789",
      amount: 49000,
      status: "Verifying",
    },
  ];

  // Status Badge Component
  const renderStatusBadge = (status) => {
    switch (status) {
      case "verified":
      case "Verified":
        return (
          <span className="inline-flex items-center gap-1 bg-[#0b2419] text-[#22c55e] border border-[#14532d] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            ✓ Verified
          </span>
        );
      case "verifying":
      case "Verifying":
        return (
          <span className="inline-flex items-center gap-1 bg-[#2b2111] text-[#f59e0b] border border-[#78350f] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            <Clock size={10} /> Verifying
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-[#1a1c23] text-neutral-400 border border-neutral-700/60 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Not Paid
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-7 font-['Montserrat',sans-serif]">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-black tracking-wide uppercase text-white mb-1">
          Billing & Payments
        </h1>
        <p className="text-xs text-neutral-400">
          Manage invoices, payments, and transaction history
        </p>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Paid */}
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex flex-col justify-between min-h-[115px]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-950/70 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 size={15} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Total Paid
              </p>
              <h2 className="text-2xl font-black text-white leading-tight">
                ₱50,000
              </h2>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 font-medium mt-3">
            All verified payments
          </p>
        </div>

        {/* Pending Verification */}
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex flex-col justify-between min-h-[115px]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-amber-950/70 border border-amber-600/50 flex items-center justify-center text-amber-400 shrink-0">
              <Clock size={15} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Pending Verification
              </p>
              <h2 className="text-2xl font-black text-white leading-tight">
                ₱49,000
              </h2>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 font-medium mt-3">
            Being verified by admin
          </p>
        </div>

        {/* Balance Due */}
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex flex-col justify-between min-h-[115px]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-red-950/70 border border-red-600/50 flex items-center justify-center text-red-500 shrink-0">
              <DollarSign size={15} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Balance Due
              </p>
              <h2 className="text-2xl font-black text-white leading-tight">
                ₱59,000
              </h2>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 font-medium mt-3">
            Upcoming event balances
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-[#1b212f] text-xs font-black uppercase tracking-wider">
        <button
          onClick={() => setSubTab("overview")}
          className={`flex items-center gap-2 pb-3.5 transition-colors cursor-pointer ${
            subTab === "overview"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <TrendingUp size={14} />
          <span>Payment Overview</span>
        </button>

        <button
          onClick={() => setSubTab("make-payment")}
          className={`flex items-center gap-2 pb-3.5 transition-colors cursor-pointer ${
            subTab === "make-payment"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <CreditCard size={14} />
          <span>Make Payment</span>
        </button>

        <button
          onClick={() => setSubTab("history")}
          className={`flex items-center gap-2 pb-3.5 transition-colors cursor-pointer ${
            subTab === "history"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <History size={14} />
          <span>Transaction History</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. SUB-TAB: PAYMENT OVERVIEW                               */}
      {/* ========================================================= */}
      {subTab === "overview" && (
        <div className="space-y-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            Your Bookings & Invoices
          </h3>

          <div className="space-y-4">
            {bookingsInvoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 space-y-5"
              >
                {/* Header row: Event Title + Tags & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-black text-white uppercase tracking-wide">
                      {inv.title}
                    </h4>
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

                    {!inv.isFullyPaid && inv.downpaymentStatus === "not-paid" && (
                      <button
                        onClick={() => {
                          setPayModalBooking(inv);
                          setSubmittedProof(false);
                          setRefNumber("");
                        }}
                        className="flex items-center gap-1 bg-[#ff0000] hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider py-2 px-4 rounded-xl transition cursor-pointer shadow-md shadow-red-950/40"
                      >
                        <span>$ Pay Downpayment</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Pricing Table Grid */}
                <div className="border-t border-[#1a2130] pt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Total Invoice:</span>
                    <span className="font-mono font-black text-white text-sm">
                      ₱{inv.totalInvoice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">Downpayment (50%):</span>
                      {renderStatusBadge(inv.downpaymentStatus)}
                    </div>
                    <span className="font-mono font-bold text-neutral-300">
                      ₱{inv.downpayment.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">Balance Due (50%):</span>
                      {renderStatusBadge(inv.balanceStatus)}
                    </div>
                    <span className="font-mono font-bold text-neutral-300">
                      ₱{inv.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SUB-TAB: MAKE PAYMENT                                   */}
      {/* ========================================================= */}
      {subTab === "make-payment" && (
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Make a Payment
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select a booking and payment method to proceed
            </p>
          </div>

          {/* Section: Bookings with Pending Payments */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Bookings with Pending Payments
            </p>

            {/* Pending Booking 1 */}
            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wide">
                  Tech Summit 2026
                </h4>
                <div className="flex items-center gap-4 text-xs text-neutral-400 mt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-neutral-500" /> 2026-06-15
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-neutral-500" /> SMX Convention Center
                  </span>
                </div>
              </div>
              <span className="text-xs text-amber-500 font-bold bg-amber-950/30 border border-amber-900/40 px-3 py-1 rounded-full self-start sm:self-auto">
                Payment Under Review
              </span>
            </div>

            {/* Pending Booking 2 */}
            <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wide">
                  Product Launch Webinar
                </h4>
                <div className="flex items-center gap-4 text-xs text-neutral-400 mt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-neutral-500" /> 2026-06-20
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-neutral-500" /> Virtual (BGC Office)
                  </span>
                </div>
                <div className="mt-2.5">
                  <span className="bg-[#091b29] text-[#38bdf8] border border-[#0369a1] text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                    Downpayment Due ₱10,000
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setPayModalBooking(bookingsInvoices[2]);
                  setSubmittedProof(false);
                  setRefNumber("");
                }}
                className="flex items-center gap-1.5 bg-[#ff0000] hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer shadow-md shadow-red-950/40 self-start sm:self-auto"
              >
                <span>$ Pay Downpayment</span>
              </button>
            </div>
          </div>

          {/* Section: Available Payment Methods */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Available Payment Methods
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* GCash */}
              <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-500">💙</span>
                    <h5 className="text-sm font-black text-white">GCash</h5>
                  </div>
                  <p className="text-[10px] text-neutral-400">Instant Transfer</p>

                  <div className="space-y-1 mt-4 text-[11px]">
                    <div className="flex justify-between text-neutral-400">
                      <span>Account Name:</span>
                      <span className="text-white font-bold">Livestream Manila</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Number:</span>
                      <span className="text-white font-mono font-bold">0993 674 2673</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center pt-2">
                  <div className="w-24 h-24 bg-white rounded-lg p-1.5 flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=09936742673-GCASH"
                      alt="GCash QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1.5">
                    QR Code Available
                  </span>
                </div>
              </div>

              {/* Maya */}
              <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-emerald-500">💚</span>
                    <h5 className="text-sm font-black text-white">Maya</h5>
                  </div>
                  <p className="text-[10px] text-neutral-400">Instant Transfer</p>

                  <div className="space-y-1 mt-4 text-[11px]">
                    <div className="flex justify-between text-neutral-400">
                      <span>Account Name:</span>
                      <span className="text-white font-bold">Livestream Manila</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Number:</span>
                      <span className="text-white font-mono font-bold">0993 674 2673</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center pt-2">
                  <div className="w-24 h-24 bg-white rounded-lg p-1.5 flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=09936742673-MAYA"
                      alt="Maya QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1.5">
                    QR Code Available
                  </span>
                </div>
              </div>

              {/* BDO Bank */}
              <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span>🏦</span>
                    <h5 className="text-sm font-black text-white">BDO Bank</h5>
                  </div>
                  <p className="text-[10px] text-neutral-400">Instant Transfer</p>

                  <div className="space-y-1 mt-4 text-[11px]">
                    <div className="flex justify-between text-neutral-400">
                      <span>Account Name:</span>
                      <span className="text-white font-bold">Livestream Manila Events</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Number:</span>
                      <span className="text-white font-mono font-bold">0040 8888 8012</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center pt-2">
                  <div className="w-24 h-24 bg-white rounded-lg p-1.5 flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=004088888012-BDO"
                      alt="BDO QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1.5">
                    QR Code Available
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Payment Verification Note Box */}
            <div className="bg-[#0a121e] border border-[#162a42] rounded-2xl p-4 flex items-start gap-3 text-neutral-400 text-xs">
              <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-0.5">Payment Verification</p>
                <p className="text-[11px] leading-relaxed">
                  After making a payment, upload your receipt for verification. Our team will verify your payment within 24 hours and send you a confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SUB-TAB: TRANSACTION HISTORY                            */}
      {/* ========================================================= */}
      {subTab === "history" && (
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Payment History
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              All your payment transactions
            </p>
          </div>

          {/* Table Container */}
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
                {transactionHistory.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#121622] transition-colors">
                    <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">
                      {txn.date}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-bold text-white">{txn.event}</p>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {txn.bkgId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {txn.type === "Downpayment" ? (
                        <span className="bg-[#0b1f2e] text-[#38bdf8] border border-[#0369a1] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Downpayment
                        </span>
                      ) : (
                        <span className="bg-[#211233] text-[#c084fc] border border-[#7e22ce] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Balance
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">
                      {txn.method}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-neutral-400 whitespace-nowrap">
                      {txn.reference}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      ₱{txn.amount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderStatusBadge(txn.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VIEW INVOICE                                       */}
      {/* ========================================================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0e121a] border border-[#20293d] rounded-2xl overflow-hidden shadow-2xl text-white font-['Montserrat',sans-serif] animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#1b212f] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                  Invoice {selectedInvoice.id}
                </span>
                <h3 className="text-base font-black uppercase text-white mt-0.5">
                  {selectedInvoice.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full border border-neutral-700 bg-black/40 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body */}
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
                  <span className="font-mono font-bold text-white">₱{selectedInvoice.totalInvoice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">50% Downpayment:</span>
                  <span className="font-mono font-bold text-white">₱{selectedInvoice.downpayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">50% Remaining Balance:</span>
                  <span className="font-mono font-bold text-white">₱{selectedInvoice.balance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
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
      {/* MODAL: PAY DOWNPAYMENT POPUP                              */}
      {/* ========================================================= */}
      {payModalBooking && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0e121a] border border-[#20293d] rounded-2xl overflow-hidden shadow-2xl text-white font-['Montserrat',sans-serif] animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-[#1b212f] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest block">
                  Secure Checkout
                </span>
                <h3 className="text-base font-black uppercase text-white mt-0.5">
                  Pay Downpayment — {payModalBooking.title}
                </h3>
              </div>
              <button
                onClick={() => setPayModalBooking(null)}
                className="w-8 h-8 rounded-full border border-neutral-700 bg-black/40 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {submittedProof ? (
                <div className="p-5 text-center bg-[#0b2419] border border-[#14532d] rounded-xl text-[#22c55e] space-y-2">
                  <CheckCircle2 size={28} className="mx-auto" />
                  <p className="font-bold text-sm">Payment Proof Submitted!</p>
                  <p className="text-xs text-neutral-300">
                    Our team will verify your transaction reference within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  {/* Select Payment Method Tabs */}
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

                  {/* QR Box */}
                  <div className="p-4 bg-[#090b10] border border-[#1b212f] rounded-xl flex items-center gap-4">
                    <div className="w-24 h-24 bg-white rounded-lg p-1 flex items-center justify-center shrink-0">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedMethod}-PAYMENT`}
                        alt="QR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="text-neutral-400">Amount Due:</p>
                      <p className="text-lg font-black text-white font-mono">
                        ₱{payModalBooking.downpayment.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        Scan with your banking app or send to 0993 674 2673
                      </p>
                    </div>
                  </div>

                  {/* Reference input & upload */}
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
                        Attach Screenshot (Optional)
                      </label>
                      <label className="flex items-center gap-2 px-3.5 py-2.5 bg-[#090b10] border border-dashed border-[#1b212f] rounded-xl cursor-pointer hover:border-neutral-600 text-xs text-neutral-400">
                        <Upload size={14} className="text-red-500" />
                        <span className="truncate">
                          {proofFile ? proofFile.name : "Choose receipt image..."}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setProofFile(e.target.files[0] || null)}
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-[#1b212f] flex justify-end gap-2 bg-[#090b10]">
              <button
                onClick={() => setPayModalBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white uppercase cursor-pointer"
              >
                Close
              </button>
              {!submittedProof && (
                <button
                  disabled={!refNumber && !proofFile}
                  onClick={() => setSubmittedProof(true)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-40 shadow-md shadow-red-950/40"
                >
                  Submit Proof
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