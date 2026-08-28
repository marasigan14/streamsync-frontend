import React, { useState } from "react";
import { 
  CheckCircle2, Clock, AlertCircle, TrendingUp, CreditCard, 
  ReceiptText, Calendar, MapPin, Eye, CircleDollarSign, QrCode, UploadCloud 
} from "lucide-react";

const ClientBilling = () => {
  const [billingTab, setBillingTab] = useState("overview");
  const [paymentMethod, setPaymentMethod] = useState("gcash");

  return (
    <div className="max-w-5xl mx-auto animation-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-neutral-900 dark:text-white">Billing & Payments</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage invoices, payments, and transaction history</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-start gap-4 shadow-sm dark:shadow-none transition-colors">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Paid</p>
            <p className="text-2xl font-black text-neutral-900 dark:text-white mb-2">₱50,000</p>
            <p className="text-xs font-bold text-emerald-500">All verified payments</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-start gap-4 shadow-sm dark:shadow-none transition-colors">
          <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 shrink-0">
            <Clock size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Pending Verification</p>
            <p className="text-2xl font-black text-neutral-900 dark:text-white mb-2">₱49,000</p>
            <p className="text-xs font-bold text-amber-500">Being verified by admin</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-start gap-4 shadow-sm dark:shadow-none transition-colors">
          <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 shrink-0">
            <AlertCircle size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Balance Due</p>
            <p className="text-2xl font-black text-neutral-900 dark:text-white mb-2">₱59,000</p>
            <p className="text-xs font-bold text-red-500">Upcoming event balances</p>
          </div>
        </div>
      </div>

      {/* Billing Sub-Navigation */}
      <div className="flex items-center gap-8 border-b border-neutral-200 dark:border-neutral-800 mb-8 px-2 overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setBillingTab("overview")}
          className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${billingTab === "overview" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          <TrendingUp size={16} /> Payment Overview
        </button>
        <button 
          onClick={() => setBillingTab("make_payment")}
          className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${billingTab === "make_payment" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          <CreditCard size={16} /> Make Payment
        </button>
        <button 
          onClick={() => setBillingTab("history")}
          className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${billingTab === "history" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          <ReceiptText size={16} /> Transaction History
        </button>
      </div>

      {/* SUB-TAB: PAYMENT OVERVIEW */}
      {billingTab === "overview" && (
        <div className="animation-fade-in">
          <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-900 dark:text-white mb-6">Your Bookings & Invoices</h3>
          <div className="space-y-6">
            {/* Invoice 1 */}
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Tech Summit 2026</h4>
                  <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1"><Calendar size={12}/> 2026-06-15</span>
                    <span className="flex items-center gap-1"><MapPin size={12}/> SMX Convention Center</span>
                  </div>
                </div>
                <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 self-start md:self-auto">
                  <Eye size={14}/> View Invoice
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                  <span>Total Invoice:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">₱98,000</span>
                </div>
                <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                  <div className="flex items-center gap-3">
                    <span>Downpayment (50%):</span>
                    <span className="bg-amber-500/20 text-amber-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1"><Clock size={10}/> Verifying</span>
                  </div>
                  <span className="font-bold">₱49,000</span>
                </div>
                <div className="flex justify-between items-center text-neutral-500">
                  <div className="flex items-center gap-3">
                    <span>Balance Due (50%):</span>
                    <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Not Paid</span>
                  </div>
                  <span className="font-bold text-neutral-900 dark:text-white">₱49,000</span>
                </div>
              </div>
            </div>

            {/* Invoice 2 */}
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-start gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Sarah & Mike Wedding</h4>
                    <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1"><Calendar size={12}/> 2026-06-25</span>
                      <span className="flex items-center gap-1"><MapPin size={12}/> Tagaytay Highlands</span>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mt-1">Fully Paid</span>
                </div>
                <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 self-start md:self-auto">
                  <Eye size={14}/> View Invoice
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                  <span>Total Invoice:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">₱50,000</span>
                </div>
                <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                  <div className="flex items-center gap-3">
                    <span>Downpayment (50%):</span>
                    <span className="bg-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={10}/> Verified</span>
                  </div>
                  <span className="font-bold">₱25,000</span>
                </div>
                <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                  <div className="flex items-center gap-3">
                    <span>Balance Due (50%):</span>
                    <span className="bg-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={10}/> Verified</span>
                  </div>
                  <span className="font-bold">₱25,000</span>
                </div>
              </div>
            </div>

            {/* Invoice 3 */}
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Product Launch Webinar</h4>
                  <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1"><Calendar size={12}/> 2026-06-20</span>
                    <span className="flex items-center gap-1"><MapPin size={12}/> Virtual (BGC Office)</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 self-start md:self-auto w-full md:w-auto">
                  <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Eye size={14}/> View Invoice
                  </button>
                  <button onClick={() => setBillingTab("make_payment")} className="bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/20">
                    <CircleDollarSign size={14}/> Pay Downpayment
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                  <span>Total Invoice:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">₱20,000</span>
                </div>
                <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                  <div className="flex items-center gap-3">
                    <span>Downpayment (50%):</span>
                    <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Not Paid</span>
                  </div>
                  <span className="font-bold">₱10,000</span>
                </div>
                <div className="flex justify-between items-center text-neutral-500">
                  <div className="flex items-center gap-3">
                    <span>Balance Due (50%):</span>
                    <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Not Paid</span>
                  </div>
                  <span className="font-bold text-neutral-900 dark:text-white">₱10,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: MAKE PAYMENT */}
      {billingTab === "make_payment" && (
        <div className="animation-fade-in max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-950/30 text-red-600 rounded-lg flex items-center justify-center">
              <QrCode size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-widest uppercase text-neutral-900 dark:text-white">Downpayment Methods</h3>
              <p className="text-xs text-neutral-500">Pay your downpayment to secure your booking date. QR codes are linked to Livestream Manila's official accounts.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={() => setPaymentMethod("gcash")} 
              className={`flex-1 py-4 font-bold text-xs uppercase tracking-widest rounded-xl border transition-all ${paymentMethod === "gcash" ? "bg-[#ff0000] border-red-600 text-white shadow-lg shadow-red-900/20" : "bg-white dark:bg-[#121212] border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-600"}`}
            >
              GCash
            </button>
            <button 
              onClick={() => setPaymentMethod("maya")} 
              className={`flex-1 py-4 font-bold text-xs uppercase tracking-widest rounded-xl border transition-all ${paymentMethod === "maya" ? "bg-[#ff0000] border-red-600 text-white shadow-lg shadow-red-900/20" : "bg-white dark:bg-[#121212] border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-600"}`}
            >
              Maya
            </button>
            <button 
              onClick={() => setPaymentMethod("bdo")} 
              className={`flex-1 py-4 font-bold text-xs uppercase tracking-widest rounded-xl border transition-all ${paymentMethod === "bdo" ? "bg-[#ff0000] border-red-600 text-white shadow-lg shadow-red-900/20" : "bg-white dark:bg-[#121212] border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-600"}`}
            >
              BDO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white dark:bg-white rounded-2xl p-6 flex flex-col items-center justify-center border-4 shadow-xl"
                 style={{ borderColor: paymentMethod === 'maya' ? '#10b981' : paymentMethod === 'bdo' ? '#dc2626' : '#2563eb' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${paymentMethod.toUpperCase()}-Payment-LivestreamManila`} 
                alt={`${paymentMethod} QR`} 
                className="w-48 h-48 mb-4 mix-blend-multiply" 
              />
              <p className={`font-black uppercase tracking-widest text-sm ${paymentMethod === 'maya' ? 'text-emerald-500' : paymentMethod === 'bdo' ? 'text-red-600' : 'text-blue-600'}`}>
                {paymentMethod}
              </p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Scan to pay</p>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Account Name</p>
                  <p className="text-sm font-black text-neutral-900 dark:text-white">
                    {paymentMethod === 'bdo' ? 'Livestream Manila Events' : 'Livestream Manila'}
                  </p>
                </div>
                <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                    {paymentMethod === 'bdo' ? 'Account Number' : 'Mobile Number'}
                  </p>
                  <p className="text-lg font-black text-neutral-900 dark:text-white tracking-widest">
                    {paymentMethod === 'bdo' ? '0040 8888 8012' : '0993 674 2673'}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">How to pay</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {paymentMethod === 'bdo' 
                    ? "Transfer via BDO Online or branch. Account type: Savings. Include your booking ID in the remarks." 
                    : `Open ${paymentMethod === 'maya' ? 'Maya' : 'GCash'} → Pay → scan QR or enter mobile number. Add your booking name as payment note.`}
                </p>
              </div>

              <div className="border border-red-200 dark:border-red-900/30 rounded-xl p-6 relative overflow-hidden bg-red-50/50 dark:bg-transparent">
                <div className="absolute inset-0 bg-red-600/5 mix-blend-overlay pointer-events-none"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-4 relative z-10">Downpayment Minimums</p>
                <div className="grid grid-cols-3 gap-3 relative z-10">
                  <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-center">
                    <p className="text-sm font-black text-neutral-900 dark:text-white">₱2,000</p>
                    <p className="text-[8px] font-bold uppercase text-neutral-500 tracking-widest mt-1">Livestream</p>
                  </div>
                  <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-center">
                    <p className="text-sm font-black text-neutral-900 dark:text-white">₱500</p>
                    <p className="text-[8px] font-bold uppercase text-neutral-500 tracking-widest mt-1">Projector</p>
                  </div>
                  <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-center">
                    <p className="text-sm font-black text-neutral-900 dark:text-white">₱1,500</p>
                    <p className="text-[8px] font-bold uppercase text-neutral-500 tracking-widest mt-1">Lights & Sounds</p>
                  </div>
                </div>
                <p className="text-[9px] text-neutral-500 mt-4 relative z-10">Downpayment is non-refundable once confirmed. Balance is due on the day of the event.</p>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-6">After Paying — Submit Proof</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-900 dark:text-white">Reference / Transaction No.</label>
                <input type="text" placeholder="e.g. 1234567890" className="w-full bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors placeholder-neutral-400 dark:placeholder-neutral-600" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-900 dark:text-white">Upload Payment Screenshot</label>
                <div className="w-full bg-transparent border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-red-600 dark:hover:border-red-600 rounded-xl px-4 py-3 flex items-center justify-center gap-2 cursor-pointer transition-colors text-neutral-500 dark:text-neutral-400">
                  <UploadCloud size={16} />
                  <span className="text-sm font-bold">Choose File</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-blue-900 hover:bg-blue-800 text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl transition-colors">
              Submit Proof of Payment
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB: TRANSACTION HISTORY */}
      {billingTab === "history" && (
        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 animation-fade-in overflow-hidden">
          <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-900 dark:text-white mb-2">Payment History</h3>
          <p className="text-xs text-neutral-500 mb-8">All your payment transactions</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] uppercase tracking-widest text-neutral-500">
                  <th className="pb-4 font-bold">Date</th>
                  <th className="pb-4 font-bold">Event</th>
                  <th className="pb-4 font-bold">Type</th>
                  <th className="pb-4 font-bold">Method</th>
                  <th className="pb-4 font-bold">Reference</th>
                  <th className="pb-4 font-bold">Amount</th>
                  <th className="pb-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {/* Row 1 */}
                <tr className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="py-4 text-neutral-600 dark:text-neutral-400">May 25,<br/>2026</td>
                  <td className="py-4">
                    <p className="font-bold text-neutral-900 dark:text-white">Sarah & Mike Wedding</p>
                    <p className="text-[10px] text-neutral-500">BKG-002</p>
                  </td>
                  <td className="py-4"><span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold">Downpayment</span></td>
                  <td className="py-4 text-neutral-600 dark:text-neutral-400">GCash</td>
                  <td className="py-4 text-neutral-600 dark:text-neutral-400 font-mono text-[10px]">GCSH123456789</td>
                  <td className="py-4 font-bold text-neutral-900 dark:text-white">₱25,000</td>
                  <td className="py-4"><span className="flex items-center gap-1.5 text-emerald-500 font-bold"><CheckCircle2 size={12}/> Verified</span></td>
                </tr>

                {/* Row 2 */}
                <tr className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="py-4 text-neutral-600 dark:text-neutral-400">Jun 20,<br/>2026</td>
                  <td className="py-4">
                    <p className="font-bold text-neutral-900 dark:text-white">Sarah & Mike Wedding</p>
                    <p className="text-[10px] text-neutral-500">BKG-002</p>
                  </td>
                  <td className="py-4"><span className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-[10px] font-bold">Balance</span></td>
                  <td className="py-4 text-neutral-600 dark:text-neutral-400">Bank Transfer</td>
                  <td className="py-4 text-neutral-600 dark:text-neutral-400 font-mono text-[10px]">BD0987654321</td>
                  <td className="py-4 font-bold text-neutral-900 dark:text-white">₱25,000</td>
                  <td className="py-4"><span className="flex items-center gap-1.5 text-emerald-500 font-bold"><CheckCircle2 size={12}/> Verified</span></td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="py-4 text-neutral-600 dark:text-neutral-400">Jun 6,<br/>2026</td>
                  <td className="py-4">
                    <p className="font-bold text-neutral-900 dark:text-white">Tech Summit 2026</p>
                    <p className="text-[10px] text-neutral-500">BKG-001</p>
                  </td>
                  <td className="py-4"><span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold">Downpayment</span></td>
                  <td className="py-4 text-neutral-600 dark:text-neutral-400">Maya</td>
                  <td className="py-4 text-neutral-600 dark:text-neutral-400 font-mono text-[10px]">MAYA456123789</td>
                  <td className="py-4 font-bold text-neutral-900 dark:text-white">₱49,000</td>
                  <td className="py-4"><span className="flex items-center gap-1.5 text-amber-500 font-bold"><Clock size={12}/> Verifying</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientBilling;