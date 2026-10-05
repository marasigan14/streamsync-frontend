import React, { useState, useMemo, useEffect } from "react";
import {
  Download,
  CreditCard,
  Search,
  FileText,
  Check,
  Plus,
  Pencil,
  Clock,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { supabase } from "../../supabaseClient";

const API = import.meta.env.VITE_API_URL;

// fetch helper that sends the logged-in admin's token to FastAPI
const authFetch = async (path, options = {}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data.detail === "string" ? data.detail : "Request failed");
  }
  return data;
};

const peso = (n) =>
  `₱${Number(n || 0).toLocaleString("en-PH", { maximumFractionDigits: 2 })}`;

const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const AdminBilling = () => {
  const [activeTab, setActiveTab] = useState("client_payments");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Notification State
  const [toast, setToast] = useState(null);

  // Real billing data
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Modals
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: "verify" | "reject", inv }

  // Form States
  const [newRule, setNewRule] = useState({ name: "", desc: "", condition: "", value: "" });

  // Staff payroll (sample data, not connected to the database yet)
  const [staffPayroll, setStaffPayroll] = useState([
    { id: "PR-1001", name: "John Doe", role: "Camera Operator", period: "May 1 - May 15, 2026", events: 4, amount: "₱18,000", rawAmount: 18000, status: "Pending" },
    { id: "PR-1002", name: "Jane Smith", role: "Audio Engineer", period: "May 1 - May 15, 2026", events: 5, amount: "₱22,500", rawAmount: 22500, status: "Paid" },
    { id: "PR-1003", name: "Mike Johnson", role: "Technical Director", period: "May 1 - May 15, 2026", events: 3, amount: "₱25,000", rawAmount: 25000, status: "Pending" },
  ]);

  // Loyalty rules table (display only; the engine applies the built-in 10% rule)
  const [loyaltyRules, setLoyaltyRules] = useState([
    { name: "Loyalty Discount (3+ Bookings)", desc: "Automatically applies 10% discount on next booking after a client completes 3 confirmed bookings.", condition: "total_bookings >= 3", value: "10%", status: "Active" },
    { name: "Corporate Partner", desc: "Special discount for registered corporate partners.", condition: "client_type == corporate", value: "15%", status: "Inactive" },
  ]);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadBilling = async () => {
    try {
      const data = await authFetch("/admin/billing/overview");
      setInvoices(data.invoices || []);
      setSummary(data.summary || null);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBilling();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return invoices.filter(
      (inv) =>
        inv.client.toLowerCase().includes(q) ||
        inv.event.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q)
    );
  }, [invoices, searchQuery]);

  const filteredPayroll = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return staffPayroll.filter(
      (pr) =>
        pr.name.toLowerCase().includes(q) ||
        pr.role.toLowerCase().includes(q) ||
        pr.id.toLowerCase().includes(q)
    );
  }, [staffPayroll, searchQuery]);

  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [filteredInvoices, currentPage]);

  const paginatedPayroll = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPayroll.slice(start, start + itemsPerPage);
  }, [filteredPayroll, currentPage]);

  // Verify or reject the pending payment proof of an invoice
  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    const { type, inv } = confirmAction;
    setBusy(true);
    try {
      await authFetch(`/admin/billing/payments/${inv.pendingPaymentId}/${type}`, {
        method: "POST",
      });
      triggerToast(
        type === "verify"
          ? `Payment for ${inv.id} verified`
          : `Payment for ${inv.id} rejected`
      );
      await loadBilling();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      setConfirmAction(null);
    }
  };

  const handlePayStaff = (id) => {
    setStaffPayroll((prev) => prev.map((pr) => (pr.id === id ? { ...pr, status: "Paid" } : pr)));
    triggerToast(`Payout processed for ${id}!`);
  };

  const handleProcessAllPending = () => {
    setStaffPayroll((prev) => prev.map((pr) => ({ ...pr, status: "Paid" })));
    triggerToast("All pending payouts successfully processed!");
  };

  const handleExportCSV = () => {
    let rows = [];
    if (activeTab === "client_payments") {
      rows = [
        ["Invoice", "Client", "Event", "Date", "Total", "Paid", "Balance", "Status"],
        ...invoices.map((i) => [i.id, i.client, i.event, i.date, i.total, i.paid, i.balance, i.status]),
      ];
    } else if (activeTab === "staff_payroll") {
      rows = [
        ["ID", "Name", "Role", "Period", "Events", "Amount", "Status"],
        ...staffPayroll.map((p) => [p.id, p.name, p.role, p.period, p.events, p.rawAmount, p.status]),
      ];
    } else {
      rows = [
        ["Rule", "Condition", "Value", "Status"],
        ...loyaltyRules.map((r) => [r.name, r.condition, r.value, r.status]),
      ];
    }

    const csvData = rows.map((r) => r.map(csvCell).join(",")).join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `STREAMSYNC_${activeTab}_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    triggerToast("Report exported successfully!");
  };

  const handleAddRuleSubmit = (e) => {
    e.preventDefault();
    if (!newRule.name || !newRule.value) return;
    const ruleEntry = {
      name: newRule.name,
      desc: newRule.desc || "Custom discount rule.",
      condition: newRule.condition || "custom == true",
      value: newRule.value,
      status: "Active",
    };
    setLoyaltyRules([...loyaltyRules, ruleEntry]);
    setIsRuleModalOpen(false);
    setNewRule({ name: "", desc: "", condition: "", value: "" });
    triggerToast("New Loyalty Rule added!");
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-green-900/50 text-green-500 bg-green-950/20">{status}</span>;
      case "Partial":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-blue-900/50 text-blue-400 bg-blue-950/20">{status}</span>;
      case "Pending":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-yellow-900/50 text-yellow-500 bg-yellow-950/20">{status}</span>;
      case "Overdue":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-red-900/50 text-red-500 bg-red-950/20">{status}</span>;
      default:
        return null;
    }
  };

  const revenueChange = summary?.revenue_change_pct;

  return (
    <div className="w-full max-w-6xl font-sans relative">

      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-red-600 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-red-500 animate-bounce">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white mb-1 uppercase tracking-wide">
            <CreditCard size={24} className="text-red-600" /> BILLING & PAYMENTS
          </h1>
          <p className="text-sm text-neutral-400">Manage client invoices, staff payroll, and loyalty discounts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 border border-neutral-700 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors shrink-0"
          >
            <Download size={16} /> EXPORT REPORT
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-900/60 text-red-400 flex items-center gap-3 text-xs">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-neutral-800 mb-8">
        {[
          { id: "client_payments", label: "CLIENT PAYMENTS" },
          { id: "staff_payroll", label: "STAFF PAYROLL" },
          { id: "loyalty_discounts", label: "LOYALTY & DISCOUNTS" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`pb-4 text-xs font-bold tracking-wide border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-red-600 text-red-600"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CLIENT PAYMENTS */}
      {activeTab === "client_payments" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
              <DollarSign size={80} className="absolute -right-4 -bottom-4 text-green-900/20" />
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">TOTAL REVENUE (MTD)</p>
              <p className="text-3xl font-black text-white mb-1">{summary ? peso(summary.revenue_mtd) : "—"}</p>
              <p className={`text-xs flex items-center gap-1 ${revenueChange == null ? "text-neutral-500" : revenueChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                <CheckCircle2 size={12} />
                {revenueChange == null
                  ? "Verified payments this month"
                  : `${revenueChange >= 0 ? "+" : ""}${revenueChange}% from last month`}
              </p>
            </div>
            <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
              <Clock size={80} className="absolute -right-4 -bottom-4 text-yellow-900/20" />
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">PENDING INVOICES</p>
              <p className="text-3xl font-black text-white mb-1">{summary ? peso(summary.pending_amount) : "—"}</p>
              <p className="text-xs text-yellow-500 flex items-center gap-1">
                <Clock size={12} /> {summary ? summary.pending_count : 0} Waiting
              </p>
            </div>
            <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
              <AlertCircle size={80} className="absolute -right-4 -bottom-4 text-red-900/20" />
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">OVERDUE AMOUNT</p>
              <p className="text-3xl font-black text-white mb-1">{summary ? peso(summary.overdue_amount) : "—"}</p>
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {summary ? summary.overdue_count : 0} Overdue
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search invoices..."
                className="w-full bg-[#161616] border border-neutral-800 text-sm text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
            <div className="text-xs text-neutral-500 font-semibold">
              Showing {filteredInvoices.length} entries
            </div>
          </div>

          <div className="bg-[#161616] border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#111111] text-[10px] uppercase font-bold text-neutral-500 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4">INVOICE ID</th>
                  <th className="px-6 py-4">CLIENT & EVENT</th>
                  <th className="px-6 py-4">DATE ISSUED</th>
                  <th className="px-6 py-4">AMOUNT</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-neutral-500 text-xs uppercase font-bold">Loading invoices...</td>
                  </tr>
                ) : paginatedInvoices.length > 0 ? (
                  paginatedInvoices.map((inv) => (
                    <tr key={inv.id} className="text-neutral-300 hover:bg-[#1a1a1a]">
                      <td className="px-6 py-4 font-semibold text-white">{inv.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{inv.client}</span>
                          {inv.isLoyal && <span className="text-[8px] bg-red-950/40 text-red-500 border border-red-900/50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">LOYAL</span>}
                        </div>
                        <div className="text-xs text-neutral-500">{inv.event}</div>
                      </td>
                      <td className="px-6 py-4">{inv.date}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{peso(inv.total)}</div>
                        {inv.paid > 0 && inv.status !== "Paid" && (
                          <div className="text-[10px] text-neutral-500">Paid {peso(inv.paid)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {renderStatusBadge(inv.status)}
                        {inv.pendingPaymentId && (
                          <div className="text-[9px] font-bold uppercase tracking-wider text-yellow-500 mt-1">Proof awaiting review</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 text-neutral-400">
                          <button onClick={() => setSelectedInvoice(inv)} title="View Details" className="hover:text-white transition-colors">
                            <Eye size={16} />
                          </button>
                          {inv.pendingPaymentId && (
                            <>
                              <button onClick={() => setConfirmAction({ type: "verify", inv })} title="Verify payment" className="hover:text-green-500 transition-colors">
                                <Check size={16} className="text-green-600" />
                              </button>
                              <button onClick={() => setConfirmAction({ type: "reject", inv })} title="Reject payment" className="hover:text-red-500 transition-colors">
                                <X size={16} className="text-red-600" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-neutral-500 text-xs uppercase font-bold">No invoices found</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {filteredInvoices.length > itemsPerPage && (
              <div className="p-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span>Page {currentPage} of {Math.ceil(filteredInvoices.length / itemsPerPage)}</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="p-1.5 bg-[#111] hover:bg-neutral-800 rounded border border-neutral-800 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={currentPage === Math.ceil(filteredInvoices.length / itemsPerPage)}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="p-1.5 bg-[#111] hover:bg-neutral-800 rounded border border-neutral-800 disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAFF PAYROLL (sample data) */}
      {activeTab === "staff_payroll" && (
        <div className="space-y-6">
          <div className="p-3 rounded-xl bg-yellow-950/20 border border-yellow-900/40 text-yellow-500 text-[11px] font-semibold">
            Sample data: staff payroll is not connected to the database yet.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
              <DollarSign size={80} className="absolute -right-4 -bottom-4 text-blue-900/20" />
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">TOTAL PAYROLL (MTD)</p>
              <p className="text-3xl font-black text-white mb-1">
                {peso(staffPayroll.reduce((acc, curr) => acc + curr.rawAmount, 0))}
              </p>
              <p className="text-xs text-neutral-500 flex items-center gap-1">Period: May 1 - 15</p>
            </div>
            <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
              <Clock size={80} className="absolute -right-4 -bottom-4 text-yellow-900/20" />
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">PENDING PAYOUTS</p>
              <p className="text-3xl font-black text-white mb-1">
                {peso(staffPayroll.filter((p) => p.status === "Pending").reduce((acc, curr) => acc + curr.rawAmount, 0))}
              </p>
              <p className="text-xs text-yellow-500 flex items-center gap-1"><Clock size={12} /> {staffPayroll.filter((p) => p.status === "Pending").length} Staff waiting</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search staff..."
                className="w-full bg-[#161616] border border-neutral-800 text-sm text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
            <button
              onClick={handleProcessAllPending}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors"
            >
              PROCESS ALL PENDING
            </button>
          </div>

          <div className="bg-[#161616] border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#111111] text-[10px] uppercase font-bold text-neutral-500 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4">PAYROLL ID</th>
                  <th className="px-6 py-4">STAFF MEMBER</th>
                  <th className="px-6 py-4">PERIOD</th>
                  <th className="px-6 py-4">EVENTS</th>
                  <th className="px-6 py-4">AMOUNT</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {paginatedPayroll.length > 0 ? (
                  paginatedPayroll.map((pr) => (
                    <tr key={pr.id} className="text-neutral-300 hover:bg-[#1a1a1a]">
                      <td className="px-6 py-4 font-semibold text-white">{pr.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{pr.name}</div>
                        <div className="text-xs text-neutral-500">{pr.role}</div>
                      </td>
                      <td className="px-6 py-4 text-xs">{pr.period}</td>
                      <td className="px-6 py-4 text-xs">{pr.events} events</td>
                      <td className="px-6 py-4 font-bold text-white">{pr.amount}</td>
                      <td className="px-6 py-4">{renderStatusBadge(pr.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4 text-neutral-400">
                          <button onClick={() => setSelectedPayroll(pr)} title="View Summary" className="hover:text-white transition-colors">
                            <FileText size={16} />
                          </button>
                          {pr.status === "Pending" && (
                            <button
                              onClick={() => handlePayStaff(pr.id)}
                              className="bg-red-600/10 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-white px-3 py-1.5 text-[10px] font-bold rounded transition-colors"
                            >
                              PAY NOW
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-neutral-500 text-xs uppercase font-bold">No staff records found</td>
                  </tr>
                )}
              </tbody>
            </table>

            {filteredPayroll.length > itemsPerPage && (
              <div className="p-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span>Page {currentPage} of {Math.ceil(filteredPayroll.length / itemsPerPage)}</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="p-1.5 bg-[#111] hover:bg-neutral-800 rounded border border-neutral-800 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={currentPage === Math.ceil(filteredPayroll.length / itemsPerPage)}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="p-1.5 bg-[#111] hover:bg-neutral-800 rounded border border-neutral-800 disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOYALTY & DISCOUNTS */}
      {activeTab === "loyalty_discounts" && (
        <div className="space-y-6">
          <div className="bg-[#161616] border border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Discount & Loyalty Rules</h2>
                <p className="text-sm text-neutral-500">Manage automatic discounts applied to client bookings.</p>
              </div>
              <button
                onClick={() => setIsRuleModalOpen(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors"
              >
                <Plus size={16} /> ADD NEW RULE
              </button>
            </div>

            <table className="w-full text-left text-sm">
              <thead className="bg-[#111111] text-[10px] uppercase font-bold text-neutral-500 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 w-1/3">RULE NAME</th>
                  <th className="px-6 py-4">CONDITION</th>
                  <th className="px-6 py-4">VALUE</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {loyaltyRules.map((rule, idx) => (
                  <tr key={idx} className="text-neutral-300 hover:bg-[#1a1a1a]">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{rule.name}</div>
                      <div className="text-xs text-neutral-500 leading-tight mt-1">{rule.desc}</div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-[#111] text-blue-400 px-2 py-1 rounded border border-neutral-800">{rule.condition}</code>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{rule.value}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <span className={`w-2 h-2 rounded-full ${rule.status === "Active" ? "bg-green-500" : "bg-neutral-600"}`}></span>
                        <span className={rule.status === "Active" ? "text-green-500" : "text-neutral-500"}>{rule.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          const updated = [...loyaltyRules];
                          updated[idx] = {
                            ...updated[idx],
                            status: updated[idx].status === "Active" ? "Inactive" : "Active",
                          };
                          setLoyaltyRules(updated);
                          triggerToast(`Rule status updated to ${updated[idx].status}`);
                        }}
                        className="text-neutral-500 hover:text-white transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-br from-red-950/20 to-transparent border border-red-900/30 rounded-xl p-6 max-w-lg">
            <h3 className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 size={16} /> LOYALTY SYSTEM ACTIVE
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              The system automatically detects clients with <code className="text-xs text-blue-400">total_bookings &gt;= 3</code> and will apply the Active 10% Loyalty Discount to their next quotation.
            </p>
            <div className="flex items-center justify-between border-t border-red-900/20 pt-4 text-xs text-neutral-400">
              <span>Eligible Clients: <strong className="text-white">{summary ? summary.eligible_clients : "—"}</strong></span>
              <span>Total Discount Given: <strong className="text-white">{summary ? peso(summary.total_discount_given) : "—"}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ADD RULE MODAL */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsRuleModalOpen(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-4">Add Loyalty Rule</h2>
            <form onSubmit={handleAddRuleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Rule Name</label>
                <input
                  required
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g. VIP Partner Discount"
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Condition</label>
                <input
                  type="text"
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                  placeholder="total_bookings >= 5"
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Discount Value</label>
                <input
                  required
                  type="text"
                  value={newRule.value}
                  onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                  placeholder="20%"
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase py-3 rounded-lg tracking-wide transition-colors">
                Save Loyalty Rule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE DETAILS MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedInvoice(null)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-red-600" />
              <h3 className="text-md font-bold text-white uppercase">{selectedInvoice.id} Details</h3>
            </div>
            <div className="space-y-3 text-sm text-neutral-300">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Client</span>
                <span className="font-bold text-white">{selectedInvoice.client}</span>
              </div>
              {selectedInvoice.clientEmail && (
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span className="text-neutral-500">Email</span>
                  <span>{selectedInvoice.clientEmail}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Event</span>
                <span>{selectedInvoice.event}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Issued Date</span>
                <span>{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Total</span>
                <span className="font-bold text-white">{peso(selectedInvoice.total)}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Paid (verified)</span>
                <span>{peso(selectedInvoice.paid)}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Balance</span>
                <span>{peso(selectedInvoice.balance)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-neutral-500">Status</span>
                <span>{renderStatusBadge(selectedInvoice.status)}</span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Payments</p>
              {selectedInvoice.payments.length === 0 ? (
                <p className="text-xs text-neutral-500">No payments submitted yet.</p>
              ) : (
                <div className="space-y-2">
                  {selectedInvoice.payments.map((p) => (
                    <div key={p.id} className="bg-[#161616] border border-neutral-800 rounded-lg p-3 text-xs flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-white">{peso(p.amount)}</div>
                        <div className="text-neutral-500 capitalize">
                          {(p.method || "").replace("_", " ")}
                          {p.ref ? ` · Ref ${p.ref}` : ""}
                        </div>
                        {p.receipt_url && (
                          <a href={p.receipt_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                            View proof
                          </a>
                        )}
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
                          p.status === "verified"
                            ? "border-green-900/50 text-green-500 bg-green-950/20"
                            : p.status === "rejected"
                            ? "border-red-900/50 text-red-500 bg-red-950/20"
                            : "border-yellow-900/50 text-yellow-500 bg-yellow-950/20"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PAYROLL SUMMARY MODAL */}
      {selectedPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl w-full max-w-sm p-6 relative">
            <button onClick={() => setSelectedPayroll(null)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} className="text-red-600" />
              <h3 className="text-md font-bold text-white uppercase">{selectedPayroll.id} Summary</h3>
            </div>
            <div className="space-y-3 text-sm text-neutral-300">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Staff Member</span>
                <span className="font-bold text-white">{selectedPayroll.name}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Role</span>
                <span>{selectedPayroll.role}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Events Worked</span>
                <span>{selectedPayroll.events} Events</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Pay Period</span>
                <span>{selectedPayroll.period}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-neutral-500">Total Payout</span>
                <span className="font-bold text-white">{selectedPayroll.amount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERIFY / REJECT CONFIRMATION MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl w-full max-w-sm p-6 text-center">
            <h3 className="text-base font-bold text-white mb-2">
              {confirmAction.type === "verify" ? "Verify this payment?" : "Reject this payment?"}
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              {confirmAction.type === "verify"
                ? `This confirms the payment proof for ${confirmAction.inv.id}. If the booking is approved, it will be confirmed.`
                : `The payment proof for ${confirmAction.inv.id} will be marked as rejected, and the client will need to submit a new one.`}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleConfirmAction}
                disabled={busy}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wide transition disabled:opacity-50 ${
                  confirmAction.type === "verify" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {busy ? "Saving..." : confirmAction.type === "verify" ? "Yes, verify" : "Yes, reject"}
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                disabled={busy}
                className="px-5 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wide transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBilling;
