import React, { useState } from "react";
import { 
  DollarSign, 
  Calendar, 
  Box, 
  Users, 
  TrendingUp, 
  Activity, 
  BarChart2, 
  Zap,
  Download,
  X
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const Analytics = () => {
  // Modal state for "View Detailed Analysis"
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Data for Revenue & Bookings Line Chart
  const revenueBookingsData = [
    { month: "Jan", revenue: 100000, bookings: 5 },
    { month: "Feb", revenue: 140000, bookings: 7 },
    { month: "Mar", revenue: 180000, bookings: 10 },
    { month: "Apr", revenue: 160000, bookings: 8 },
    { month: "May", revenue: 200000, bookings: 12 },
    { month: "Jun", revenue: 0, bookings: 0 },
    { month: "Jul", revenue: 0, bookings: 0 },
  ];

  // Mock Data for ARIMA Forecast
  const arimaData = [
    { month: "Jan", actual: 100000, forecast: 100000 },
    { month: "Feb", actual: 140000, forecast: 135000 },
    { month: "Mar", actual: 180000, forecast: 175000 },
    { month: "Apr", actual: 160000, forecast: 165000 },
    { month: "May", actual: 200000, forecast: 195000 },
    { month: "Jun", actual: null, forecast: 210000 },
    { month: "Jul", actual: null, forecast: 225000 },
  ];

  // Equipment Utilization Data
  const equipData = [
    { name: "Cameras", inUse: 85, available: 15 },
    { name: "Audio", inUse: 70, available: 30 },
    { name: "Lighting", inUse: 65, available: 35 },
    { name: "Streaming", inUse: 90, available: 10 },
    { name: "Monitors", inUse: 75, available: 25 },
  ];

  // Payment Monitor Table Data
  const paymentData = [
    { event: "Tech Summit 2026", client: "TechCorp", amount: "₱100,000", status: "PAID", date: "2026-05-10" },
    { event: "Wedding Livestream", client: "Mario & Juan", amount: "₱45,000", status: "PENDING", date: "2026-05-12" },
    { event: "Corporate Meeting", client: "ABC Corp", amount: "₱75,000", status: "PAID", date: "2026-05-08" },
    { event: "Product Launch", client: "XYZ Inc", amount: "₱120,000", status: "OVERDUE", date: "2026-04-25" },
  ];

  const renderStatusBadge = (status) => {
    switch (status) {
      case "PAID":
        return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full border border-green-900/50 text-green-500 bg-green-950/20">{status}</span>;
      case "PENDING":
        return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full border border-yellow-900/50 text-yellow-500 bg-yellow-950/20">{status}</span>;
      case "OVERDUE":
        return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full border border-red-900/50 text-red-500 bg-red-950/20">{status}</span>;
      default:
        return null;
    }
  };

  const handleExportCSV = () => {
    const csvContent = "Event,Client,Amount,Status,Date\n" + 
      paymentData.map(p => `${p.event},${p.client},${p.amount},${p.status},${p.date}`).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "STREAMSYNC_Analytics_Report.csv";
    a.click();
  };

  return (
    <div className="w-full max-w-5xl font-sans text-white space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold uppercase tracking-wide">ANALYTICS DASHBOARD</h1>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 border border-red-900/50 hover:bg-red-950/30 text-red-500 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-colors"
        >
          <Download size={14} /> EXPORT REPORT
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={16} className="text-green-500" />
            <span className="text-[10px] text-green-500 font-bold flex items-center gap-1"><TrendingUp size={10} /> +18%</span>
          </div>
          <p className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mb-1">TOTAL REVENUE (YTD)</p>
          <p className="text-2xl font-black">₱810,000</p>
        </div>

        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Calendar size={16} className="text-red-500" />
            <span className="text-[10px] text-red-500 font-bold flex items-center gap-1"><TrendingUp size={10} /> +3</span>
          </div>
          <p className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mb-1">ACTIVE BOOKINGS</p>
          <p className="text-2xl font-black">13</p>
        </div>

        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Box size={16} className="text-blue-500" />
            <span className="text-[10px] text-blue-500 font-bold flex items-center gap-1"><TrendingUp size={10} /> +5%</span>
          </div>
          <p className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mb-1">EQUIPMENT UTILIZATION</p>
          <p className="text-2xl font-black">77%</p>
        </div>

        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Users size={16} className="text-yellow-500" />
            <span className="text-[10px] text-yellow-500 font-bold flex items-center gap-1"><TrendingUp size={10} /> +0.2</span>
          </div>
          <p className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mb-1">CLIENT SATISFACTION</p>
          <p className="text-2xl font-black">4.8/5</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Revenue & Bookings Chart */}
        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
          <h3 className="text-xs font-bold flex items-center gap-2 mb-6 uppercase tracking-wider">
            <BarChart2 size={14} className="text-red-600" /> REVENUE & BOOKINGS
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueBookingsData}>
                <CartesianGrid stroke="#262626" vertical={false} />
                <XAxis dataKey="month" stroke="#737373" tick={{ fontSize: 9 }} />
                <YAxis stroke="#737373" tick={{ fontSize: 8 }} tickFormatter={(val) => val.toLocaleString()} />
                <Tooltip contentStyle={{ backgroundColor: "#161616", borderColor: "#262626", fontSize: "11px" }} />
                <Line type="monotone" dataKey="revenue" stroke="#ff0000" strokeWidth={2} dot={{ fill: "#ff0000", r: 3 }} />
                <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={1.5} dot={{ fill: "#3b82f6", r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-[9px] font-bold">
            <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-0.5 bg-red-500"></div> Revenue (₱)</span>
            <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-0.5 bg-blue-500"></div> Bookings</span>
          </div>
        </div>

        {/* ARIMA Revenue Forecast Chart */}
        <div className="bg-[#111111] border border-red-900/30 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none rounded-xl"></div>
          <h3 className="text-xs font-bold flex items-center gap-2 mb-6 uppercase tracking-wider relative z-10">
            <Activity size={14} className="text-red-600" /> ARIMA REVENUE FORECAST
          </h3>
          <div className="h-48 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={arimaData}>
                <CartesianGrid stroke="#262626" vertical={false} />
                <XAxis dataKey="month" stroke="#737373" tick={{ fontSize: 9 }} />
                <YAxis stroke="#737373" tick={{ fontSize: 8 }} tickFormatter={(val) => val.toLocaleString()} />
                <Tooltip contentStyle={{ backgroundColor: "#161616", borderColor: "#262626", fontSize: "11px" }} />
                <Line type="monotone" dataKey="actual" stroke="#ff0000" strokeWidth={2} dot={{ fill: "#ff0000", r: 3 }} connectNulls={false} />
                <Line type="monotone" dataKey="forecast" stroke="#22c55e" strokeWidth={2} strokeDasharray="3 3" dot={{ fill: "#22c55e", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-6 mt-3 text-[9px] font-bold z-10 relative">
            <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-0.5 bg-red-500"></div> Actual</span>
            <span className="flex items-center gap-1 text-green-500"><div className="w-2 h-0.5 border-t border-dashed border-green-500"></div> Forecast</span>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/50 flex justify-between items-center text-[10px] font-bold uppercase relative z-10">
            <div>
              <p className="text-neutral-500 mb-1">PROJECTED REVENUE (JUN-JUL)</p>
              <p className="text-neutral-500">GROWTH TREND</p>
            </div>
            <div className="text-right">
              <p className="text-red-500 mb-1">₱425,000</p>
              <p className="text-green-500">+12.5% MoM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Utilization Bar Chart */}
      <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
        <h3 className="text-xs font-bold flex items-center gap-2 mb-6 uppercase tracking-wider">
          <Activity size={14} className="text-red-600" /> EQUIPMENT UTILIZATION
        </h3>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={equipData} barGap={4}>
              <CartesianGrid stroke="#262626" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#737373" tick={{ fontSize: 9 }} />
              <YAxis stroke="#737373" tick={{ fontSize: 9 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "#161616", borderColor: "#262626", fontSize: "11px" }} />
              <Bar dataKey="inUse" fill="#dc2626" radius={[2, 2, 0, 0]} />
              <Bar dataKey="available" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 mt-4 text-[9px] font-bold">
          <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-2 bg-red-600"></div> In Use (%)</span>
          <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-2 bg-blue-500"></div> Available (%)</span>
        </div>
      </div>

      {/* Payment Monitor Section */}
      <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
        <h3 className="text-xs font-bold flex items-center gap-2 mb-6 uppercase tracking-wider">
          <DollarSign size={14} className="text-red-600" /> PAYMENT MONITOR
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#161616] border border-neutral-800 rounded-xl p-4">
            <p className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mb-1">PAID</p>
            <p className="text-xl font-black text-green-500 mb-1">₱175,000</p>
            <p className="text-[8px] font-bold text-green-700 uppercase tracking-widest">2 PAYMENTS</p>
          </div>
          <div className="bg-[#161616] border border-neutral-800 rounded-xl p-4">
            <p className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mb-1">PENDING</p>
            <p className="text-xl font-black text-yellow-500 mb-1">₱45,000</p>
            <p className="text-[8px] font-bold text-yellow-700 uppercase tracking-widest">1 PAYMENT</p>
          </div>
          <div className="bg-[#161616] border border-neutral-800 rounded-xl p-4">
            <p className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mb-1">OVERDUE</p>
            <p className="text-xl font-black text-red-500 mb-1">₱120,000</p>
            <p className="text-[8px] font-bold text-red-700 uppercase tracking-widest">1 PAYMENT</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[9px] uppercase font-bold text-neutral-500 border-b border-neutral-800">
              <tr>
                <th className="pb-3">EVENT</th>
                <th className="pb-3">CLIENT</th>
                <th className="pb-3">AMOUNT</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {paymentData.map((row, idx) => (
                <tr key={idx} className="text-neutral-300 text-xs hover:bg-[#1a1a1a]">
                  <td className="py-4 font-semibold text-white">{row.event}</td>
                  <td className="py-4 text-neutral-400">{row.client}</td>
                  <td className="py-4 font-bold text-white">{row.amount}</td>
                  <td className="py-4">{renderStatusBadge(row.status)}</td>
                  <td className="py-4 text-neutral-500">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Powered Insights Banner */}
      <div className="bg-[#ff0000] rounded-xl p-6 shadow-xl shadow-red-900/20">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4 uppercase tracking-wider text-white">
          <Zap size={16} /> AI-POWERED INSIGHTS
        </h3>
        <ul className="space-y-3 mb-6 list-disc pl-5 text-xs text-white/90 leading-relaxed font-medium">
          <li>Camera equipment utilization is at 85% - consider acquiring 2 more units to meet summer event demand.</li>
          <li>Revenue forecast shows 12.5% monthly growth - on track to exceed Q2 targets by 5%.</li>
          <li>Wedding bookings peak in June-August. Allocate additional staff for Saturdays.</li>
        </ul>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black hover:bg-neutral-900 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-colors"
        >
          VIEW DETAILED ANALYSIS
        </button>
      </div>

      {/* Detailed Analysis Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl w-full max-w-lg p-6 relative text-white">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-md font-bold uppercase mb-4 flex items-center gap-2">
              <Zap size={18} className="text-red-600" /> Comprehensive Predictive Analysis
            </h3>
            <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
              <p>
                <strong>ARIMA Model Confidence Interval:</strong> Our model predicts a Q3 revenue velocity peaking at ₱425,000 based on standard linear regression combined with historical seasonal event spikes.
              </p>
              <p>
                <strong>Inventory Risk Score:</strong> High demand for 4K streaming kits during weekend slots could lead to a 15% booking rejection rate without additional unit acquisition.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Analytics;