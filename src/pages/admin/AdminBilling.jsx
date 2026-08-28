import React, { useState } from "react";
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
  DollarSign
} from "lucide-react";

const AdminBilling = () => {
  const [activeTab, setActiveTab] = useState("client_payments");

  const clientPayments = [
    { id: "INV-2026-001", client: "Acme Corp", isLoyal: true, event: "Annual Conference", date: "2026-05-10", amount: "₱120,000", status: "Paid" },
    { id: "INV-2026-002", client: "TechStart Inc", isLoyal: false, event: "Product Launch", date: "2026-05-14", amount: "₱45,000", status: "Pending" },
    { id: "INV-2026-003", client: "Global Enterprises", isLoyal: false, event: "Virtual Townhall", date: "2026-04-20", amount: "₱85,000", status: "Overdue" },
  ];

  const staffPayroll = [
    { id: "PR-1001", name: "John Doe", role: "Camera Operator", period: "May 1 - May 15, 2026", events: 4, amount: "₱18,000", status: "Pending" },
    { id: "PR-1002", name: "Jane Smith", role: "Audio Engineer", period: "May 1 - May 15, 2026", events: 5, amount: "₱22,500", status: "Paid" },
    { id: "PR-1003", name: "Mike Johnson", role: "Technical Director", period: "May 1 - May 15, 2026", events: 3, amount: "₱25,000", status: "Pending" },
  ];

  const loyaltyRules = [
    { name: "Loyalty Discount (3+ Bookings)", desc: "Automatically applies 10% discount on next booking after a client completes 3 confirmed bookings.", condition: "total_bookings >= 3", value: "10%", status: "Active" },
    { name: "Corporate Partner", desc: "Special discount for registered corporate partners.", condition: "client_type == corporate", value: "15%", status: "Inactive" },
  ];

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
    <div className="w-full max-w-6xl font-sans">
      
      {/* Header */}
      <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white mb-1 uppercase tracking-wide">
            <CreditCard size={24} className="text-red-600" /> BILLING & PAYMENTS
          </h1>
          <p className="text-sm text-neutral-400">Manage client invoices and staff payroll</p>
        </div>
        <button className="flex items-center gap-2 border border-neutral-700 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors shrink-0">
          <Download size={16} /> EXPORT REPORT
        </button>
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
            onClick={() => setActiveTab(tab.id)}
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

      {/* Tab Content: CLIENT PAYMENTS */}
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
              <p className="text-xs text-yellow-500 flex items-center gap-1"><Clock size={12} /> 4 Invoices waiting</p>
            </div>
            <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
              <AlertCircle size={80} className="absolute -right-4 -bottom-4 text-red-900/20" />
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">OVERDUE AMOUNT</p>
              <p className="text-3xl font-black text-white mb-1">₱85,000</p>
              <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> 1 Invoice overdue</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <input type="text" placeholder="Search invoices..." className="w-full bg-[#161616] border border-neutral-800 text-sm text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-neutral-600" />
            </div>
            <button className="flex items-center gap-2 border border-neutral-700 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors">
              <Filter size={16} /> FILTER
            </button>
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
                {clientPayments.map((inv, idx) => (
                  <tr key={idx} className="text-neutral-300 hover:bg-[#1a1a1a]">
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
                        <button className="hover:text-white transition-colors"><FileText size={16} /></button>
                        {inv.status !== "Paid" && <button className="hover:text-green-500 transition-colors"><Check size={16} className="text-green-600" /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: STAFF PAYROLL */}
      {activeTab === "staff_payroll" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
              <DollarSign size={80} className="absolute -right-4 -bottom-4 text-blue-900/20" />
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">TOTAL PAYROLL (MTD)</p>
              <p className="text-3xl font-black text-white mb-1">₱65,500</p>
              <p className="text-xs text-neutral-500 flex items-center gap-1">For the period of May 1 - 15</p>
            </div>
            <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
              <Clock size={80} className="absolute -right-4 -bottom-4 text-yellow-900/20" />
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">PENDING PAYOUTS</p>
              <p className="text-3xl font-black text-white mb-1">₱43,000</p>
              <p className="text-xs text-yellow-500 flex items-center gap-1"><Clock size={12} /> 2 Staff waiting</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <input type="text" placeholder="Search staff..." className="w-full bg-[#161616] border border-neutral-800 text-sm text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-neutral-600" />
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors">
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
                {staffPayroll.map((pr, idx) => (
                  <tr key={idx} className="text-neutral-300 hover:bg-[#1a1a1a]">
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
                        <button className="hover:text-white transition-colors"><FileText size={16} /></button>
                        {pr.status === "Pending" && (
                          <button className="bg-red-600/10 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-white px-3 py-1.5 text-[10px] font-bold rounded transition-colors">
                            PAY NOW
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: LOYALTY & DISCOUNTS */}
      {activeTab === "loyalty_discounts" && (
        <div className="space-y-6">
          <div className="bg-[#161616] border border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Discount & Loyalty Rules</h2>
                <p className="text-sm text-neutral-500">Manage automatic discounts applied to client bookings.</p>
              </div>
              <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors">
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
                      <button className="text-neutral-500 hover:text-white transition-colors"><Pencil size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Loyalty Alert Box */}
          <div className="bg-gradient-to-br from-red-950/20 to-transparent border border-red-900/30 rounded-xl p-6 max-w-lg">
            <h3 className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 size={16} /> LOYALTY SYSTEM ACTIVE
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              The system automatically detects clients with <code className="text-xs text-blue-400">total_bookings {">="} 3</code> and will apply the Active 10% Loyalty Discount to their next quotation.
            </p>
            <div className="flex items-center justify-between border-t border-red-900/20 pt-4 text-xs text-neutral-400">
              <span>Eligible Clients: <strong className="text-white">24</strong></span>
              <span>Total Discount Given: <strong className="text-white">₱125,000</strong></span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBilling;