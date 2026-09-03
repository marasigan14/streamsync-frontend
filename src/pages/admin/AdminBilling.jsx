import React, { useState, useMemo } from "react";
import { 
  Download, 
  CreditCard, 
  Search, 
  Filter, 
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
  Eye
} from "lucide-react";

const AdminBilling = () => {
  const [activeTab, setActiveTab] = useState("client_payments");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Notification State
  const [toast, setToast] = useState(null);

  // Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  // Form States
  const [newInvoice, setNewInvoice] = useState({ client: "", event: "", amount: "", date: "" });
  const [newRule, setNewRule] = useState({ name: "", desc: "", condition: "", value: "" });

  // Data States
  const [clientPayments, setClientPayments] = useState([
    { id: "INV-2026-001", client: "Acme Corp", isLoyal: true, event: "Annual Conference", date: "2026-05-10", amount: "₱120,000", rawAmount: 120000, status: "Paid" },
    { id: "INV-2026-002", client: "TechStart Inc", isLoyal: false, event: "Product Launch", date: "2026-05-14", amount: "₱45,000", rawAmount: 45000, status: "Pending" },
    { id: "INV-2026-003", client: "Global Enterprises", isLoyal: false, event: "Virtual Townhall", date: "2026-04-20", amount: "₱85,000", rawAmount: 85000, status: "Overdue" },
  ]);

  const [staffPayroll, setStaffPayroll] = useState([
    { id: "PR-1001", name: "John Doe", role: "Camera Operator", period: "May 1 - May 15, 2026", events: 4, amount: "₱18,000", rawAmount: 18000, status: "Pending" },
    { id: "PR-1002", name: "Jane Smith", role: "Audio Engineer", period: "May 1 - May 15, 2026", events: 5, amount: "₱22,500", rawAmount: 22500, status: "Paid" },
    { id: "PR-1003", name: "Mike Johnson", role: "Technical Director", period: "May 1 - May 15, 2026", events: 3, amount: "₱25,000", rawAmount: 25000, status: "Pending" },
  ]);

  const [loyaltyRules, setLoyaltyRules] = useState([
    { name: "Loyalty Discount (3+ Bookings)", desc: "Automatically applies 10% discount on next booking after a client completes 3 confirmed bookings.", condition: "total_bookings >= 3", value: "10%", status: "Active" },
    { name: "Corporate Partner", desc: "Special discount for registered corporate partners.", condition: "client_type == corporate", value: "15%", status: "Inactive" },
  ]);

  // Helper: Trigger Toast Notification
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Search Logic & Pagination Reset
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Filtered Client Payments
  const filteredInvoices = useMemo(() => {
    return clientPayments.filter(inv => 
      inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clientPayments, searchQuery]);

  // Filtered Payroll
  const filteredPayroll = useMemo(() => {
    return staffPayroll.filter(pr => 
      pr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [staffPayroll, searchQuery]);

  // Paginated Collections
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [filteredInvoices, currentPage]);

  const paginatedPayroll = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPayroll.slice(start, start + itemsPerPage);
  }, [filteredPayroll, currentPage]);

  // Actions
  const handleMarkAsPaid = (id) => {
    setClientPayments(prev => prev.map(inv => inv.id === id ? { ...inv, status: "Paid" } : inv));
    triggerToast(`Invoice ${id} marked as Paid!`);
  };

  const handlePayStaff = (id) => {
    setStaffPayroll(prev => prev.map(pr => pr.id === id ? { ...pr, status: "Paid" } : pr));
    triggerToast(`Payout processed for ${id}!`);
  };

  const handleProcessAllPending = () => {
    setStaffPayroll(prev => prev.map(pr => ({ ...pr, status: "Paid" })));
    triggerToast("All pending payouts successfully processed!");
  };

  const handleExportCSV = () => {
    let csvData = "";
    if (activeTab === "client_payments") {
      csvData = "ID,Client,Event,Date,Amount,Status\n" + 
        clientPayments.map(i => `${i.id},${i.client},${i.event},${i.date},${i.amount},${i.status}`).join("\n");
    } else if (activeTab === "staff_payroll") {
      csvData = "ID,Name,Role,Period,Events,Amount,Status\n" + 
        staffPayroll.map(p => `${p.id},${p.name},${p.role},${p.period},${p.events},${p.amount},${p.status}`).join("\n");
    } else {
      csvData = "Rule,Condition,Value,Status\n" + 
        loyaltyRules.map(r => `${r.name},${r.condition},${r.value},${r.status}`).join("\n");
    }

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `STREAMSYNC_${activeTab}_export.csv`;
    a.click();
    triggerToast("Report exported successfully!");
  };

  const handleAddInvoiceSubmit = (e) => {
    e.preventDefault();
    if (!newInvoice.client || !newInvoice.amount) return;
    const formattedAmount = `₱${Number(newInvoice.amount).toLocaleString()}`;
    const newEntry = {
      id: `INV-2026-00${clientPayments.length + 1}`,
      client: newInvoice.client,
      isLoyal: false,
      event: newInvoice.event || "General Service",
      date: newInvoice.date || new Date().toISOString().split("T")[0],
      amount: formattedAmount,
      rawAmount: Number(newInvoice.amount),
      status: "Pending"
    };
    setClientPayments([newEntry, ...clientPayments]);
    setIsInvoiceModalOpen(false);
    setNewInvoice({ client: "", event: "", amount: "", date: "" });
    triggerToast(`Created Invoice ${newEntry.id}`);
  };

  const handleAddRuleSubmit = (e) => {
    e.preventDefault();
    if (!newRule.name || !newRule.value) return;
    const ruleEntry = {
      name: newRule.name,
      desc: newRule.desc || "Custom discount rule.",
      condition: newRule.condition || "custom == true",
      value: newRule.value,
      status: "Active"
    };
    setLoyaltyRules([...loyaltyRules, ruleEntry]);
    setIsRuleModalOpen(false);
    setNewRule({ name: "", desc: "", condition: "", value: "" });
    triggerToast("New Loyalty Rule added!");
  };

  const renderStatusBadge = (status) => {
    switch(status) {
      case "Paid":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-green-900/50 text-green-500 bg-green-950/20">{status}</span>;
      case "Pending":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-yellow-900/50 text-yellow-500 bg-yellow-950/20">{status}</span>;
      case "Overdue":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-red-900/50 text-red-500 bg-red-950/20">{status}</span>;
      default:
        return null;
    }
  };

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
          {activeTab === "client_payments" && (
            <button 
              onClick={() => setIsInvoiceModalOpen(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors shrink-0"
            >
              <Plus size={16} /> NEW INVOICE
            </button>
          )}
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 border border-neutral-700 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors shrink-0"
          >
            <Download size={16} /> EXPORT REPORT
          </button>
        </div>
      </div>

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
              <p className="text-3xl font-black text-white mb-1">₱345,000</p>
              <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 size={12} /> +12% from last month</p>
            </div>
            <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
              <Clock size={80} className="absolute -right-4 -bottom-4 text-yellow-900/20" />
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">PENDING INVOICES</p>
              <p className="text-3xl font-black text-white mb-1">₱120,500</p>
              <p className="text-xs text-yellow-500 flex items-center gap-1"><Clock size={12} /> {clientPayments.filter(i => i.status === "Pending").length} Waiting</p>
            </div>
            <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
              <AlertCircle size={80} className="absolute -right-4 -bottom-4 text-red-900/20" />
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">OVERDUE AMOUNT</p>
              <p className="text-3xl font-black text-white mb-1">₱85,000</p>
              <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {clientPayments.filter(i => i.status === "Overdue").length} Overdue</p>
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
                {paginatedInvoices.length > 0 ? (
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
                      <td className="px-6 py-4 font-bold text-white">{inv.amount}</td>
                      <td className="px-6 py-4">{renderStatusBadge(inv.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 text-neutral-400">
                          <button onClick={() => setSelectedInvoice(inv)} title="View Details" className="hover:text-white transition-colors">
                            <Eye size={16} />
                          </button>
                          {inv.status !== "Paid" && (
                            <button onClick={() => handleMarkAsPaid(inv.id)} title="Mark as Paid" className="hover:text-green-500 transition-colors">
                              <Check size={16} className="text-green-600" />
                            </button>
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
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-1.5 bg-[#111] hover:bg-neutral-800 rounded border border-neutral-800 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    disabled={currentPage === Math.ceil(filteredInvoices.length / itemsPerPage)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
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

      {/* STAFF PAYROLL */}
      {activeTab === "staff_payroll" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
              <DollarSign size={80} className="absolute -right-4 -bottom-4 text-blue-900/20" />
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">TOTAL PAYROLL (MTD)</p>
              <p className="text-3xl font-black text-white mb-1">₱65,500</p>
              <p className="text-xs text-neutral-500 flex items-center gap-1">Period: May 1 - 15</p>
            </div>
            <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
              <Clock size={80} className="absolute -right-4 -bottom-4 text-yellow-900/20" />
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">PENDING PAYOUTS</p>
              <p className="text-3xl font-black text-white mb-1">
                ₱{staffPayroll.filter(p => p.status === "Pending").reduce((acc, curr) => acc + curr.rawAmount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-yellow-500 flex items-center gap-1"><Clock size={12} /> {staffPayroll.filter(p => p.status === "Pending").length} Staff waiting</p>
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

            {/* Pagination Controls */}
            {filteredPayroll.length > itemsPerPage && (
              <div className="p-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span>Page {currentPage} of {Math.ceil(filteredPayroll.length / itemsPerPage)}</span>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-1.5 bg-[#111] hover:bg-neutral-800 rounded border border-neutral-800 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    disabled={currentPage === Math.ceil(filteredPayroll.length / itemsPerPage)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
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
                          updated[idx].status = updated[idx].status === "Active" ? "Inactive" : "Active";
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
              <span>Eligible Clients: <strong className="text-white">24</strong></span>
              <span>Total Discount Given: <strong className="text-white">₱125,000</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsInvoiceModalOpen(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-4">Create New Invoice</h2>
            <form onSubmit={handleAddInvoiceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Client Name</label>
                <input 
                  required
                  type="text" 
                  value={newInvoice.client}
                  onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
                  placeholder="e.g. Nexus Media" 
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Event Title</label>
                <input 
                  type="text" 
                  value={newInvoice.event}
                  onChange={(e) => setNewInvoice({ ...newInvoice, event: e.target.value })}
                  placeholder="e.g. Esports Live Stream" 
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Amount (PHP ₱)</label>
                <input 
                  required
                  type="number" 
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  placeholder="50000" 
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase py-3 rounded-lg tracking-wide transition-colors">
                Generate Invoice
              </button>
            </form>
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

      {/* INVOICE DETAILS POPOVER / MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl w-full max-w-sm p-6 relative">
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
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Event</span>
                <span>{selectedInvoice.event}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Issued Date</span>
                <span>{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500">Amount</span>
                <span className="font-bold text-white">{selectedInvoice.amount}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-neutral-500">Status</span>
                <span>{renderStatusBadge(selectedInvoice.status)}</span>
              </div>
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

    </div>
  );
};

export default AdminBilling;