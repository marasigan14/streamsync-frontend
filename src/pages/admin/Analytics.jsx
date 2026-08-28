import React from "react";
import { 
  DollarSign, 
  Calendar, 
  Box, 
  Users, 
  TrendingUp, 
  Activity, 
  BarChart2, 
  Zap,
  Download
} from "lucide-react";

const Analytics = () => {
  // Mock Data for Payments Table
  const paymentData = [
    { event: "Tech Summit 2026", client: "TechCorp", amount: "₱100,000", status: "PAID", date: "2026-05-10" },
    { event: "Wedding Livestream", client: "Mario & Juan", amount: "₱45,000", status: "PENDING", date: "2026-05-12" },
    { event: "Corporate Meeting", client: "ABC Corp", amount: "₱75,000", status: "PAID", date: "2026-05-08" },
    { event: "Product Launch", client: "XYZ Inc", amount: "₱120,000", status: "OVERDUE", date: "2026-04-25" },
  ];

  // Equipment Utilization Data for Bar Chart
  const equipData = [
    { name: "Cameras", use: 85, avail: 15 },
    { name: "Audio", use: 70, avail: 30 },
    { name: "Lighting", use: 65, avail: 35 },
    { name: "Streaming", use: 90, avail: 10 },
    { name: "Monitors", use: 75, avail: 25 },
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

  return (
    <div className="w-full max-w-5xl font-sans text-white space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold uppercase tracking-wide">ANALYTICS DASHBOARD</h1>
        <button className="flex items-center gap-2 border border-red-900/50 hover:bg-red-950/30 text-red-500 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-colors">
          EXPORT REPORT
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={16} className="text-green-500" />
            <span className="text-[10px] text-green-500 font-bold flex items-center gap-1"><TrendingUp size={10} /> +18%</span>
          </div>
          <p className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mb-1">TOTAL REVENUE (YTD)</p>
          <p className="text-2xl font-black">₱810,000</p>
        </div>
        {/* Card 2 */}
        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Calendar size={16} className="text-red-500" />
            <span className="text-[10px] text-red-500 font-bold flex items-center gap-1"><TrendingUp size={10} /> +3</span>
          </div>
          <p className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mb-1">ACTIVE BOOKINGS</p>
          <p className="text-2xl font-black">13</p>
        </div>
        {/* Card 3 */}
        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Box size={16} className="text-blue-500" />
            <span className="text-[10px] text-blue-500 font-bold flex items-center gap-1"><TrendingUp size={10} /> +5%</span>
          </div>
          <p className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mb-1">EQUIPMENT UTILIZATION</p>
          <p className="text-2xl font-black">77%</p>
        </div>
        {/* Card 4 */}
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
          <div className="relative h-48 w-full border-l border-b border-neutral-800 flex items-end justify-between pb-6 pl-2">
            {/* Y-Axis Labels */}
            <div className="absolute left-[-40px] h-full flex flex-col justify-between text-[8px] text-neutral-600 pb-6 pt-1">
              <span>200,000</span>
              <span>150,000</span>
              <span>100,000</span>
              <span>50,000</span>
              <span>0</span>
            </div>
            {/* Grid Lines */}
            <div className="absolute inset-0 border-b border-neutral-800/50 bottom-12"></div>
            <div className="absolute inset-0 border-b border-neutral-800/50 bottom-24"></div>
            <div className="absolute inset-0 border-b border-neutral-800/50 bottom-36"></div>
            
            {/* SVG Lines - Approximating the visual */}
            <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* Blue Line (Bookings - flat near bottom) */}
              <polyline points="0,90 15,90 30,90 45,90 60,90 75,90 90,90" fill="none" stroke="#3b82f6" strokeWidth="1" />
              {/* Red Line (Revenue) */}
              <polyline points="0,50 15,30 30,20 45,25 60,10 75,90 90,90" fill="none" stroke="#ff0000" strokeWidth="1.5" />
              {/* Data points (Red) */}
              <circle cx="0" cy="50" r="1.5" fill="#ff0000" />
              <circle cx="15" cy="30" r="1.5" fill="#ff0000" />
              <circle cx="30" cy="20" r="1.5" fill="#ff0000" />
              <circle cx="45" cy="25" r="1.5" fill="#ff0000" />
              <circle cx="60" cy="10" r="1.5" fill="#ff0000" />
              <circle cx="75" cy="90" r="1.5" fill="#ff0000" />
              <circle cx="90" cy="90" r="1.5" fill="#ff0000" />
            </svg>
            
            {/* X-Axis Labels */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-[9px] text-neutral-500 pt-2 px-2">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-[9px] font-bold">
            <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-0.5 bg-red-500"></div> Revenue (₱)</span>
            <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-0.5 bg-blue-500"></div> Bookings</span>
          </div>
        </div>

        {/* ARIMA Revenue Forecast Chart */}
        <div className="bg-[#111111] border border-red-900/30 rounded-xl p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none rounded-xl"></div>
          <h3 className="text-xs font-bold flex items-center gap-2 mb-6 uppercase tracking-wider relative z-10">
            <Activity size={14} className="text-red-600" /> ARIMA REVENUE FORECAST
          </h3>
          <div className="relative h-48 w-full border-l border-b border-neutral-800 flex items-end justify-between pb-6 pl-2 z-10">
            {/* Y-Axis Labels */}
            <div className="absolute left-[-40px] h-full flex flex-col justify-between text-[8px] text-neutral-600 pb-6 pt-1">
              <span>200,000</span>
              <span>150,000</span>
              <span>100,000</span>
              <span>50,000</span>
              <span>0</span>
            </div>
            
            {/* SVG Lines */}
            <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* Green Dotted Line (Forecast) */}
              <polyline points="0,50 15,35 30,25 45,30 60,15 75,10 90,5" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3,3" />
              {/* Red Line (Actual) */}
              <polyline points="0,52 15,40 30,22 45,35 60,12 75,90 90,90" fill="none" stroke="#ff0000" strokeWidth="1.5" />
              
              {/* Data points (Green) */}
              <circle cx="15" cy="35" r="1.5" fill="#22c55e" />
              <circle cx="30" cy="25" r="1.5" fill="#22c55e" />
              <circle cx="45" cy="30" r="1.5" fill="#22c55e" />
              <circle cx="60" cy="15" r="1.5" fill="#22c55e" />
              <circle cx="75" cy="10" r="1.5" fill="#22c55e" />
              <circle cx="90" cy="5" r="1.5" fill="#22c55e" />
            </svg>

            {/* X-Axis Labels */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-[9px] text-neutral-500 pt-2 px-2">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
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
        
        <div className="relative h-48 w-full border-l border-b border-neutral-800 flex items-end justify-around pb-6 pl-8 pr-4">
           {/* Y-Axis Labels */}
           <div className="absolute left-[-10px] h-[calc(100%-24px)] flex flex-col justify-between text-[9px] text-neutral-600 pb-1">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
            
            {/* Grid Lines */}
            <div className="absolute inset-0 border-b border-neutral-800/30 bottom-12 left-8 border-dashed"></div>
            <div className="absolute inset-0 border-b border-neutral-800/30 bottom-24 left-8 border-dashed"></div>
            <div className="absolute inset-0 border-b border-neutral-800/30 bottom-36 left-8 border-dashed"></div>

            {/* Bars */}
            {equipData.map((item, idx) => (
              <div key={idx} className="flex items-end gap-1 h-full z-10 pb-0.5">
                <div className="w-8 md:w-12 bg-red-600 rounded-t-sm" style={{ height: `${item.use}%` }}></div>
                <div className="w-8 md:w-12 bg-blue-500 rounded-t-sm" style={{ height: `${item.avail}%` }}></div>
              </div>
            ))}

            {/* X-Axis Labels */}
            <div className="absolute bottom-0 left-8 right-4 flex justify-around text-[9px] text-neutral-500 pt-2">
              {equipData.map(item => <span key={item.name} className="w-16 text-center">{item.name}</span>)}
            </div>
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
                <tr key={idx} className="text-neutral-300 text-xs">
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
        <button className="bg-black hover:bg-neutral-900 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-colors">
          VIEW DETAILED ANALYSIS
        </button>
      </div>

    </div>
  );
};

export default Analytics;