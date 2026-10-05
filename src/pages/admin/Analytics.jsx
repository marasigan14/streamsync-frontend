import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  DollarSign, Calendar, Box, Users, TrendingUp, Activity,
  BarChart2, Zap, Download, X, RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, ComposedChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { supabase } from "../../supabaseClient";

// The ARIMA forecast now comes from the main FastAPI backend (/analytics/forecast),
// so no separate Python service or API key is needed.
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const HISTORY_MONTHS_SHOWN = 12;

const Analytics = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Live ARIMA data ---
  const [forecast, setForecast]           = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [arimaLoading, setArimaLoading]   = useState(true);
  const [arimaError, setArimaError]       = useState(null);
  const [recomputing, setRecomputing]     = useState(false);

  const fetchForecast = useCallback(async (force = false) => {
    setArimaError(null);
    if (force) setRecomputing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const res = await fetch(`${API_URL}/analytics/forecast${force ? "/refresh" : ""}`, {
        method: force ? "POST" : "GET",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.detail || `HTTP ${res.status}`);
      setForecast(json);
    } catch (err) {
      setArimaError(err.message === "Failed to fetch" ? "Cannot reach the backend" : err.message);
    } finally {
      setArimaLoading(false);
      setRecomputing(false);
    }
  }, []);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  // New successful bookings trigger a background refit on the server; poll until it's done.
  useEffect(() => {
    if (!forecast?.refreshing) return;
    const timer = setTimeout(() => fetchForecast(), 10000);
    return () => clearTimeout(timer);
  }, [forecast, fetchForecast]);

  const series = useMemo(
    () => forecast?.series?.find((s) => s.group === selectedGroup) || forecast?.series?.[0] || null,
    [forecast, selectedGroup]
  );

  // History (actual) + forecast with an 80% range band. The last actual month also gets a
  // forecast value so the dashed line starts where the solid one ends.
  const arimaData = useMemo(() => {
    if (!series) return [];
    const history = series.history.slice(-HISTORY_MONTHS_SHOWN);
    return [
      ...history.map((h, i) => ({
        month: h.period,
        actual: h.value,
        forecast: i === history.length - 1 ? h.value : null,
        range: null,
        booked: null,
      })),
      ...series.forecast.map((f) => ({
        month: f.period,
        actual: null,
        forecast: f.predicted,
        range: [f.lower, f.upper],
        booked: f.booked || null,
      })),
    ];
  }, [series]);

  const arimaMeta = useMemo(() => {
    if (!series) return { projected: 0, yoy: null, peak: null };
    const projected = series.forecast.reduce((sum, f) => sum + f.predicted, 0);
    const hist = Object.fromEntries(series.history.map((h) => [h.period, h.value]));
    const lastYear = series.forecast.map((f) => hist[`${Number(f.period.slice(0, 4)) - 1}${f.period.slice(4)}`]);
    const lastYearSum = lastYear.every((v) => v !== undefined) ? lastYear.reduce((a, b) => a + b, 0) : 0;
    const yoy = lastYearSum > 0 ? ((projected - lastYearSum) / lastYearSum) * 100 : null;
    const peak = series.forecast.reduce((best, f) => (f.predicted > best.predicted ? f : best), series.forecast[0]);
    return { projected, yoy, peak };
  }, [series]);

  const quarterly = forecast?.series?.[0]?.quarterly || null;
  const headlineAcc = forecast?.accuracy || null;
  const formatQuarter = (val) => val.replace("-", " ");

  const accuracyText = (s) => {
    if (!s?.accuracy || s.accuracy.mape == null) return "n/a";
    return `${s.accuracy.mape.toFixed(1)}%`;
  };

  // --- Live revenue & bookings + equipment utilization (from /analytics in the backend) ---
  const [revenueBookings, setRevenueBookings] = useState(null);
  const [revenueError, setRevenueError]       = useState(null);
  const [equipment, setEquipment]             = useState(null);
  const [equipError, setEquipError]           = useState(null);
  const [equipView, setEquipView]             = useState("historical"); // "historical" (dataset) or "live" (stock)

  useEffect(() => {
    const load = async (path, setData, setError) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not logged in");
        const res = await fetch(`${API_URL}${path}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.detail || `HTTP ${res.status}`);
        setData(json);
      } catch (err) {
        setError(err.message === "Failed to fetch" ? "Cannot reach the backend" : err.message);
      }
    };
    load("/analytics/revenue-bookings?months=12", setRevenueBookings, setRevenueError);
    load("/analytics/equipment-utilization", setEquipment, setEquipError);
  }, []);

  const revenueBookingsData = revenueBookings?.months || [];

  const liveEquip = equipment?.live || null;
  const histEquip = equipment?.historical || null;

  const equipData = (liveEquip?.categories || []).map((c) => ({
    name: c.name,
    inUse: c.in_use_pct,
    available: c.available_pct,
    unavailable: c.unavailable_pct,
    units: c.total_units,
  }));
  const hasUnavailable = equipData.some((d) => d.unavailable > 0);

  const histData = (histEquip?.categories || []).map((c) => ({
    name: c.name,
    share: c.share_pct,
    events: c.events,
    units: c.units,
    avgUnits: c.avg_units_per_event,
  }));

  const formatPeso = (val) =>
    val >= 1000000 ? `₱${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `₱${Math.round(val / 1000)}k` : `₱${val}`;

  const paymentData = [
    { event: "Tech Summit 2026",    client: "TechCorp",    amount: "₱100,000", status: "PAID",     date: "2026-05-10" },
    { event: "Wedding Livestream",  client: "Mario & Juan",amount: "₱45,000",  status: "PENDING",  date: "2026-05-12" },
    { event: "Corporate Meeting",   client: "ABC Corp",    amount: "₱75,000",  status: "PAID",     date: "2026-05-08" },
    { event: "Product Launch",      client: "XYZ Inc",     amount: "₱120,000", status: "OVERDUE",  date: "2026-04-25" },
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

  // Pretty-print "2026-10" as "Oct '26"
  const formatMonth = (val) => {
    const [year, month] = val.split("-");
    const names = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${names[parseInt(month)]} '${year.slice(2)}`;
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
            {!revenueBookings && !revenueError && <span className="text-[8px] text-yellow-500 normal-case">(loading...)</span>}
            {revenueError && <span className="text-[8px] text-red-500 normal-case">(error: {revenueError})</span>}
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueBookingsData}>
                <CartesianGrid stroke="#262626" vertical={false} />
                <XAxis dataKey="period" stroke="#737373" tick={{ fontSize: 9 }} tickFormatter={formatMonth} />
                {/* Two axes: revenue is in pesos, bookings are small counts */}
                <YAxis yAxisId="revenue" stroke="#737373" tick={{ fontSize: 8 }} tickFormatter={formatPeso} width={45} />
                <YAxis yAxisId="bookings" orientation="right" stroke="#3b82f6" tick={{ fontSize: 8 }} allowDecimals={false} width={25} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#161616", borderColor: "#262626", fontSize: "11px" }}
                  labelFormatter={formatMonth}
                  formatter={(value, name) => (name.includes("revenue") ? [`₱${Number(value).toLocaleString()}`, name] : [value, name])}
                />
                <Line yAxisId="revenue" type="monotone" dataKey="estimated_revenue" name="Estimated revenue" stroke="#ff0000" strokeWidth={2} strokeDasharray="4 3" dot={{ fill: "#ff0000", r: 3 }} />
                <Line yAxisId="revenue" type="monotone" dataKey="actual_revenue" name="Actual revenue (paid)" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} />
                <Line yAxisId="bookings" type="monotone" dataKey="bookings" name="Bookings" stroke="#3b82f6" strokeWidth={1.5} dot={{ fill: "#3b82f6", r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-3 text-[9px] font-bold flex-wrap">
            <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-0.5 border-t border-dashed border-red-500"></div> Estimated revenue</span>
            <span className="flex items-center gap-1 text-green-500"><div className="w-2 h-0.5 bg-green-500"></div> Actual revenue (paid)</span>
            <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-0.5 bg-blue-500"></div> Bookings</span>
          </div>

          {/* Summary below the chart */}
          {revenueBookings && (() => {
            const t = revenueBookings.totals;
            const peso = (v) => `₱${Math.round(v).toLocaleString()}`;
            return (
              <div className="mt-4 pt-3 border-t border-neutral-800/50">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#161616] border border-neutral-800 rounded-lg p-3">
                    <p className="text-[9px] font-bold uppercase text-neutral-500">Revenue (last 12 mo)</p>
                    <p className="text-base font-black text-white">{peso(t.revenue)}</p>
                    <p className="text-[9px] text-neutral-500">
                      {peso(t.estimated_revenue)} estimated · {peso(t.actual_revenue)} paid
                    </p>
                  </div>
                  <div className="bg-[#161616] border border-neutral-800 rounded-lg p-3">
                    <p className="text-[9px] font-bold uppercase text-neutral-500">Bookings (last 12 mo)</p>
                    <p className="text-base font-black text-white">{t.bookings}</p>
                    <p className="text-[9px] text-neutral-500">
                      {t.dataset_bookings} dataset · {t.system_bookings} StreamSync · ~{t.avg_bookings_per_month}/month
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-1 mt-3 text-[10px] font-bold uppercase">
                  <p className="text-neutral-500">Avg revenue per booking</p>
                  <p className="text-right text-white">{peso(t.avg_revenue_per_booking)}</p>
                  <p className="text-neutral-500">Highest-revenue month</p>
                  <p className="text-right text-red-500">{formatMonth(t.best_revenue_month.period)} ({peso(t.best_revenue_month.revenue)})</p>
                  <p className="text-neutral-500">Busiest month</p>
                  <p className="text-right text-blue-400">{formatMonth(t.best_bookings_month.period)} ({t.best_bookings_month.bookings} bookings)</p>
                </div>
                <details className="mt-3 text-[9px] text-neutral-500">
                  <summary className="cursor-pointer text-yellow-500 font-bold">
                    Estimated revenue uses placeholder market rates — see rate card
                  </summary>
                  <p className="mt-2">{revenueBookings.rules.estimated_revenue}</p>
                  {revenueBookings.rate_card.length > 0 && (
                    <div className="overflow-x-auto mt-2">
                      <table className="w-full text-left">
                        <thead className="uppercase text-neutral-600">
                          <tr>
                            <th className="pb-1">Category</th>
                            <th className="pb-1">Small</th>
                            <th className="pb-1">Standard</th>
                            <th className="pb-1">Large</th>
                          </tr>
                        </thead>
                        <tbody>
                          {revenueBookings.rate_card.map((r) => (
                            <tr key={r.category} className="text-neutral-400">
                              <td className="py-0.5">{r.category}</td>
                              <td>{peso(r.small)} <span className="text-neutral-600">(≤{r.small_max_items})</span></td>
                              <td>{peso(r.standard)}</td>
                              <td>{peso(r.large)} <span className="text-neutral-600">(≥{r.large_min_items})</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="mt-1 text-neutral-600">Numbers in brackets are item counts per event for that category.</p>
                    </div>
                  )}
                </details>
              </div>
            );
          })()}
        </div>

        {/* ARIMA Live Forecast Chart */}
        <div className="bg-[#111111] border border-red-900/30 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none rounded-xl"></div>
          <div className="flex items-center justify-between gap-2 mb-6 relative z-10">
            <h3 className="text-xs font-bold flex items-center gap-2 uppercase tracking-wider">
              <Activity size={14} className="text-red-600" /> ARIMA LIVE FORECAST
              {arimaLoading && <span className="text-[8px] text-yellow-500 normal-case">(fitting model...)</span>}
              {forecast?.refreshing && <span className="text-[8px] text-yellow-500 normal-case">(updating with new bookings...)</span>}
              {arimaError && <span className="text-[8px] text-red-500 normal-case">(error: {arimaError})</span>}
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                disabled={!forecast}
                className="bg-[#161616] border border-neutral-800 rounded-md text-[10px] px-2 py-1 text-neutral-300 focus:outline-none"
              >
                {(forecast?.series || [{ group: "all", label: "All events" }]).map((s) => (
                  <option key={s.group} value={s.group}>{s.label}</option>
                ))}
              </select>
              <button
                onClick={() => fetchForecast(true)}
                disabled={recomputing || arimaLoading}
                title="Refit the model now"
                className="text-neutral-500 hover:text-white disabled:opacity-40"
              >
                <RefreshCw size={13} className={recomputing ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
          <div className="h-48 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={arimaData}>
                <CartesianGrid stroke="#262626" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#737373" 
                  tick={{ fontSize: 9 }}
                  tickFormatter={formatMonth}
                />
                <YAxis stroke="#737373" tick={{ fontSize: 8 }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#161616", borderColor: "#262626", fontSize: "11px" }}
                  labelFormatter={formatMonth}
                  formatter={(value, name) => [Array.isArray(value) ? `${value[0]}–${value[1]}` : value, name]}
                />
                <Area type="monotone" dataKey="range" name="80% range" stroke="none" fill="#22c55e" fillOpacity={0.12} connectNulls={false} />
                <Bar dataKey="booked" name="Already confirmed" fill="#3b82f6" barSize={8} radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="#ff0000" strokeWidth={2} dot={{ fill: "#ff0000", r: 2 }} connectNulls={false} />
                <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#22c55e" strokeWidth={2} strokeDasharray="3 3" dot={{ fill: "#22c55e", r: 2 }} connectNulls={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 mt-3 text-[9px] font-bold z-10 relative flex-wrap">
            <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-0.5 bg-red-500"></div> Actual bookings</span>
            <span className="flex items-center gap-1 text-green-500"><div className="w-2 h-0.5 border-t border-dashed border-green-500"></div> ARIMA forecast</span>
            <span className="flex items-center gap-1 text-green-700"><div className="w-2 h-2 bg-green-500/20"></div> 80% range</span>
            <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-2 bg-blue-500"></div> Already confirmed</span>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/50 grid grid-cols-2 gap-y-1 text-[10px] font-bold uppercase relative z-10">
            <p className="text-neutral-500">PROJECTED (NEXT 6 MO)</p>
            <p className="text-red-500 text-right">
              {arimaLoading || !series ? "..." : `${arimaMeta.projected} bookings`}
            </p>
            <p className="text-neutral-500">VS SAME MONTHS LAST YEAR</p>
            <p className={`text-right ${arimaMeta.yoy == null ? "text-neutral-500" : arimaMeta.yoy >= 0 ? "text-green-500" : "text-red-500"}`}>
              {arimaLoading || !series ? "..." : arimaMeta.yoy == null ? "n/a" : `${arimaMeta.yoy >= 0 ? "+" : ""}${arimaMeta.yoy.toFixed(1)}%`}
            </p>
            <p className="text-neutral-500">PEAK MONTH</p>
            <p className="text-yellow-500 text-right">
              {arimaLoading || !arimaMeta.peak ? "..." : `${formatMonth(arimaMeta.peak.period)} (~${arimaMeta.peak.predicted})`}
            </p>
            {quarterly && (
              <>
                <p className="text-neutral-500">NEXT QUARTER</p>
                <p className="text-neutral-300 text-right">
                  {`${formatQuarter(quarterly.forecast[0].period)}: ~${quarterly.forecast[0].predicted} (${quarterly.forecast[0].lower}–${quarterly.forecast[0].upper})`}
                </p>
              </>
            )}
            <p className="text-neutral-500">ACCURACY ({headlineAcc?.headline_metric || "back-test"} MAPE)</p>
            <p className={`text-right ${headlineAcc?.meets_target ? "text-green-500" : "text-yellow-500"}`}>
              {arimaLoading || headlineAcc?.headline_mape == null
                ? "..."
                : `${headlineAcc.headline_mape.toFixed(1)}% (target < ${headlineAcc.target}%)`}
            </p>
          </div>
        </div>
      </div>

      {/* Equipment Utilization Bar Chart */}
      <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
        <h3 className="text-xs font-bold flex items-center gap-2 mb-6 uppercase tracking-wider">
          <Activity size={14} className="text-red-600" /> EQUIPMENT UTILIZATION
          {!equipment && !equipError && <span className="text-[8px] text-yellow-500 normal-case">(loading...)</span>}
          {equipError && <span className="text-[8px] text-red-500 normal-case">(error: {equipError})</span>}
          <span className="ml-auto flex gap-1 normal-case">
            {[["historical", "Historical demand"], ["live", "Live stock"]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setEquipView(key)}
                className={`px-2 py-1 rounded-md text-[9px] font-bold border ${
                  equipView === key ? "border-red-700 text-white bg-red-950/40" : "border-neutral-800 text-neutral-500 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </span>
        </h3>

        {equipView === "historical" ? (
          <>
            {equipment && !histEquip ? (
              <p className="h-48 flex items-center justify-center text-xs text-neutral-500">Dataset file not found in the backend's data/ folder.</p>
            ) : (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histData}>
                    <CartesianGrid stroke="#262626" vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#737373" tick={{ fontSize: 9 }} />
                    <YAxis stroke="#737373" tick={{ fontSize: 9 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#161616", borderColor: "#262626", fontSize: "11px" }}
                      formatter={(value, name, props) => [
                        `${value}% of events (${props.payload.events} events, ${props.payload.units} units, ~${props.payload.avgUnits} per event)`,
                        "Used in",
                      ]}
                    />
                    <Bar dataKey="share" name="Used in" fill="#dc2626" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className="text-[9px] text-neutral-500 text-center mt-4">
              {histEquip
                ? `Share of the ${histEquip.total_events} events in the last ${histEquip.months} months (quotation dataset) that used each equipment category.`
                : "Loading..."}
            </p>
          </>
        ) : (
        <>
        {liveEquip && (
          <p className="text-[9px] text-neutral-400 mb-2">
            Overall: {liveEquip.overall.utilization_pct}% in use ({liveEquip.overall.in_use_units}/{liveEquip.overall.total_units} units)
          </p>
        )}
        {equipment && equipData.length === 0 ? (
          <p className="h-48 flex items-center justify-center text-xs text-neutral-500">No equipment recorded yet.</p>
        ) : (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={equipData} barGap={4}>
                <CartesianGrid stroke="#262626" vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#737373" tick={{ fontSize: 9 }} />
                <YAxis stroke="#737373" tick={{ fontSize: 9 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#161616", borderColor: "#262626", fontSize: "11px" }}
                  formatter={(value, name) => [`${value}%`, name]}
                  labelFormatter={(label, payload) => `${label} (${payload?.[0]?.payload?.units ?? 0} units)`}
                />
                <Bar dataKey="inUse" name="In use" fill="#dc2626" radius={[2, 2, 0, 0]} />
                <Bar dataKey="available" name="Available" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                {hasUnavailable && <Bar dataKey="unavailable" name="Maintenance / damaged" fill="#737373" radius={[2, 2, 0, 0]} />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="flex justify-center gap-6 mt-4 text-[9px] font-bold">
          <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-2 bg-red-600"></div> In Use (%)</span>
          <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-2 bg-blue-500"></div> Available (%)</span>
          {hasUnavailable && <span className="flex items-center gap-1 text-neutral-400"><div className="w-2 h-2 bg-neutral-500"></div> Maintenance / Damaged (%)</span>}
        </div>
        </>
        )}
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

      {/* AI Powered Insights Banner — live from the ARIMA model */}
      <div className="bg-[#ff0000] rounded-xl p-6 shadow-xl shadow-red-900/20">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4 uppercase tracking-wider text-white">
          <Zap size={16} /> AI-POWERED INSIGHTS (LIVE FROM ARIMA)
        </h3>
        <ul className="space-y-3 mb-6 list-disc pl-5 text-xs text-white/90 leading-relaxed font-medium">
          {arimaLoading && <li>Fitting the ARIMA model on historical and recorded bookings...</li>}
          {!arimaLoading && forecast?.insights?.map((text, i) => <li key={i}>{text}</li>)}
          {arimaError && (
            <li className="text-yellow-200">
              ⚠️ Could not load the forecast ({arimaError}). Make sure the backend is running (uvicorn app.main:app --reload).
            </li>
          )}
        </ul>
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={!forecast}
          className="bg-black hover:bg-neutral-900 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-colors"
        >
          VIEW DETAILED ANALYSIS
        </button>
      </div>

      {/* Detailed Analysis Modal */}
      {isModalOpen && forecast && series && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative text-white">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-md font-bold uppercase mb-1 flex items-center gap-2">
              <Zap size={18} className="text-red-600" /> Comprehensive Predictive Analysis
            </h3>
            <p className="text-[10px] text-neutral-500 mb-5">
              Generated {new Date(forecast.generated_at).toLocaleString()} · {series.label}
            </p>

            <div className="space-y-6 text-xs text-neutral-300 leading-relaxed">
              <p><strong className="text-white">Summary:</strong> {forecast.headline}</p>

              {/* Monthly forecast table */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Monthly forecast ({series.label})</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[9px] uppercase font-bold text-neutral-500 border-b border-neutral-800">
                      <tr>
                        <th className="pb-2">Month</th>
                        <th className="pb-2">Forecast</th>
                        <th className="pb-2">80% range</th>
                        <th className="pb-2">Already confirmed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {series.forecast.map((f) => (
                        <tr key={f.period}>
                          <td className="py-2 font-semibold text-white">{formatMonth(f.period)}</td>
                          <td className="py-2">{f.predicted}</td>
                          <td className="py-2 text-neutral-500">{f.lower}–{f.upper}</td>
                          <td className="py-2 text-blue-400">{f.booked}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Demand by event type */}
              {forecast.series.length > 1 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Expected demand by event type (next 6 months)</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-[9px] uppercase font-bold text-neutral-500 border-b border-neutral-800">
                        <tr>
                          <th className="pb-2">Event type</th>
                          <th className="pb-2">Forecast</th>
                          <th className="pb-2">Model</th>
                          <th className="pb-2">MAPE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {forecast.series.filter((s) => s.group !== "all").map((s) => (
                          <tr key={s.group}>
                            <td className="py-2 font-semibold text-white">{s.label}</td>
                            <td className="py-2">{s.forecast.reduce((a, f) => a + f.predicted, 0)}</td>
                            <td className="py-2 text-neutral-500">{s.model.name}</td>
                            <td className="py-2 text-neutral-500">{accuracyText(s)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Quarterly forecast + rolling back-test */}
              {quarterly && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Quarterly forecast (all events) · {quarterly.model.name}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {quarterly.forecast.map((f) => (
                      <div key={f.period} className="bg-[#161616] border border-neutral-800 rounded-lg p-3">
                        <p className="text-[9px] font-bold uppercase text-neutral-500">{formatQuarter(f.period)}</p>
                        <p className="text-lg font-black text-white">~{f.predicted} events</p>
                        <p className="text-[9px] text-neutral-500">likely {f.lower}–{f.upper} · {f.booked} already confirmed</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Rolling back-test ({quarterly.accuracy.tests} tests, average MAPE {quarterly.accuracy.mape?.toFixed(1)}%)
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-[9px] uppercase font-bold text-neutral-500 border-b border-neutral-800">
                        <tr>
                          <th className="pb-2">Trained on</th>
                          <th className="pb-2">Actual (next 2 quarters)</th>
                          <th className="pb-2">Predicted</th>
                          <th className="pb-2">MAPE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {quarterly.accuracy.test_details.map((t) => (
                          <tr key={t.train_size}>
                            <td className="py-2 text-neutral-400">first {t.train_size} quarters</td>
                            <td className="py-2">{t.actual.join(", ")}</td>
                            <td className="py-2">{t.predicted.join(", ")}</td>
                            <td className={`py-2 ${t.mape < 15 ? "text-green-500" : "text-yellow-500"}`}>{t.mape.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Benchmark: ARIMA vs simple methods on the same back-test */}
              {quarterly?.baselines?.methods?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Benchmark: ARIMA vs simple methods (same {quarterly.accuracy.tests} tests)
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-[9px] uppercase font-bold text-neutral-500 border-b border-neutral-800">
                        <tr>
                          <th className="pb-2">Rank</th>
                          <th className="pb-2">Method</th>
                          <th className="pb-2">Average MAPE</th>
                          <th className="pb-2">Per test</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {[...quarterly.baselines.methods]
                          .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
                          .map((m) => (
                            <tr key={m.name} className={m.is_arima ? "bg-red-950/20" : ""}>
                              <td className="py-2 font-bold text-neutral-400">{m.rank ?? "–"}</td>
                              <td className="py-2">
                                <p className={`font-semibold ${m.is_arima ? "text-red-400" : "text-white"}`}>{m.name}</p>
                                <p className="text-[9px] text-neutral-500">{m.description}</p>
                              </td>
                              <td className={`py-2 font-bold ${m.mape != null && m.mape < 15 ? "text-green-500" : "text-yellow-500"}`}>
                                {m.mape != null ? `${m.mape.toFixed(1)}%` : "n/a"}
                              </td>
                              <td className="py-2 text-[9px] text-neutral-500">
                                {m.test_mapes.map((v) => `${Math.round(v)}%`).join(" · ")}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[9px] text-neutral-500 mt-2">
                    Every method is scored on the same cut-off points and the same quarters, so the averages are directly comparable.
                    {quarterly.baselines.arima_rank === 1
                      ? " ARIMA is the most accurate method on these tests."
                      : ` ARIMA ranks ${quarterly.baselines.arima_rank} of ${quarterly.baselines.methods.length}; it also provides seasonal peaks, likely ranges and per-event-type forecasts that the simple methods do not.`}
                  </p>
                </div>
              )}

              {/* Equipment demand outlook */}
              {forecast.equipment_outlook?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Equipment demand outlook (peak month: {formatMonth(forecast.summary.peak_period)})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {forecast.equipment_outlook.map((e) => (
                      <div key={e.category} className="bg-[#161616] border border-neutral-800 rounded-lg p-3">
                        <p className="text-[9px] font-bold uppercase text-neutral-500">{e.category}</p>
                        <p className="text-lg font-black text-white">~{e.expected_events_peak}</p>
                        <p className="text-[9px] text-neutral-500">events in peak month · used in {e.share}% of events</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Model details */}
              <div className="bg-[#161616] border border-neutral-800 rounded-lg p-4 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Model details</p>
                <p><strong className="text-white">Model:</strong> {series.model.name}, selected automatically by lowest AIC ({series.model.aic})</p>
                <p>
                  <strong className="text-white">Accuracy:</strong> {headlineAcc?.method}.{" "}
                  {headlineAcc?.quarterly_mape != null && <>Quarterly MAPE {headlineAcc.quarterly_mape.toFixed(1)}%; </>}
                  month-by-month MAPE {accuracyText(forecast.series[0])}. Target MAPE &lt; {headlineAcc?.target}% on the{" "}
                  {headlineAcc?.headline_metric} measure ({headlineAcc?.meets_target ? "met" : "not met"}).
                </p>
                <p>
                  <strong className="text-white">Training data:</strong> {forecast.sources.history_start} to {forecast.sources.history_end} ·{" "}
                  {forecast.sources.dataset_events} dataset events + {forecast.sources.system_events} StreamSync bookings
                </p>
                <p className="text-neutral-500">{forecast.sources.rule}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Analytics;
