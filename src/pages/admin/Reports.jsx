import React, { useCallback, useEffect, useState } from "react";
import { FileText, FileSpreadsheet, Download, Printer, RefreshCw } from "lucide-react";
import { apiFetch, apiDownload, peso, todayPH } from "../../lib/api";

const REPORTS = [
  { id: "sales-billing", label: "Sales & Billing" },
  { id: "equipment-condition", label: "Equipment Condition" },
  { id: "frequently-damaged", label: "Frequently Damaged" },
  { id: "most-demanded", label: "Most-Demanded Equipment" },
  { id: "busiest-months", label: "Busiest Booking Months" },
];

const PERIODS = [
  { id: "quarterly", label: "Quarterly" },
  { id: "yearly", label: "Yearly" },
  { id: "current_year", label: "Current Year" },
  { id: "custom", label: "Custom Range" },
];

const THIS_YEAR = Number(todayPH().slice(0, 4));
const THIS_QUARTER = Math.floor((Number(todayPH().slice(5, 7)) - 1) / 3) + 1;
const YEARS = Array.from({ length: 8 }, (_, i) => THIS_YEAR - i);

const fmt = (value, type) => {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "money") return peso(value);
  if (type === "number" && typeof value === "number") return value.toLocaleString("en-PH");
  return String(value);
};

const escapeHtml = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const control =
  "bg-[#090b10] border border-[#1b212f] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600";

const Reports = () => {
  const [report, setReport] = useState(REPORTS[0].id);
  const [period, setPeriod] = useState("current_year");
  const [year, setYear] = useState(THIS_YEAR);
  const [quarter, setQuarter] = useState(THIS_QUARTER);
  const [start, setStart] = useState(`${THIS_YEAR}-01-01`);
  const [end, setEnd] = useState(todayPH());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState("");

  const query = useCallback(() => {
    const p = new URLSearchParams({ period });
    if (period === "quarterly") {
      p.set("year", year);
      p.set("quarter", quarter);
    }
    if (period === "yearly") p.set("year", year);
    if (period === "custom") {
      p.set("start", start);
      p.set("end", end);
    }
    return p.toString();
  }, [period, year, quarter, start, end]);

  const load = useCallback(async () => {
    if (period === "custom" && (!start || !end || end < start)) {
      setError("Choose a start date and an end date after it.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setData(await apiFetch(`/reports/${report}?${query()}`));
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [report, query, period, start, end]);

  useEffect(() => {
    load();
  }, [load]);

  const exportAs = async (format) => {
    setExporting(format);
    setError("");
    try {
      await apiDownload(`/reports/${report}/export?format=${format}&${query()}`, `${report}.${format}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting("");
    }
  };

  // Print-friendly view: a plain black-on-white table in a new window.
  const printReport = () => {
    if (!data) return;
    const win = window.open("", "_blank");
    if (!win) {
      setError("Allow pop-ups for this site to print the report.");
      return;
    }
    const head = data.columns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("");
    const rows = data.rows
      .map(
        (r) =>
          `<tr>${data.columns
            .map(
              (c) =>
                `<td class="${c.type === "money" || c.type === "number" ? "num" : ""}">${escapeHtml(
                  fmt(r[c.key], c.type)
                )}</td>`
            )
            .join("")}</tr>`
      )
      .join("");
    const summary = data.summary
      .map((s) => `<div><span>${escapeHtml(s.label)}</span><strong>${escapeHtml(fmt(s.value, s.type))}</strong></div>`)
      .join("");
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(data.title)}</title>
      <style>
        body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:24px;font-size:12px}
        h1{font-size:20px;margin:0 0 4px} .meta{color:#555;margin-bottom:16px}
        .summary{display:flex;flex-wrap:wrap;gap:8px 24px;margin-bottom:16px}
        .summary div{display:flex;gap:8px} .summary span{color:#555}
        table{width:100%;border-collapse:collapse} th,td{border:1px solid #bbb;padding:5px 6px;text-align:left}
        th{background:#eee} td.num{text-align:right} tr:nth-child(even) td{background:#fafafa}
        .notes{margin-top:12px;color:#555;font-style:italic}
        @page{size:${data.columns.length > 6 ? "landscape" : "portrait"};margin:12mm}
      </style></head><body>
      <h1>${escapeHtml(data.title)}</h1>
      <div class="meta">Livestream Manila — StreamSync · Period: ${escapeHtml(data.period_label)} · Generated ${escapeHtml(
      data.generated_at
    )}</div>
      <div class="summary">${summary}</div>
      <table><thead><tr>${head}</tr></thead><tbody>${rows || `<tr><td colspan="${data.columns.length}">No records in this period.</td></tr>`}</tbody></table>
      ${data.notes ? `<p class="notes">${escapeHtml(data.notes)}</p>` : ""}
      <script>window.onload=function(){window.print()}<\/script>
      </body></html>`);
    win.document.close();
  };

  const tabClass = (active) =>
    `pb-3.5 transition cursor-pointer whitespace-nowrap ${
      active ? "text-red-600 border-b-2 border-red-600" : "text-neutral-400 hover:text-white"
    }`;
  const exportBtn =
    "flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#1b212f] bg-[#090b10] text-[11px] font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:border-neutral-600 transition cursor-pointer disabled:opacity-40";

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">Reports</h1>
        <p className="text-xs text-neutral-400">
          Sales, equipment and booking reports for any period. Export as PDF, Excel or CSV, or print.
        </p>
      </div>

      <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6">
        {/* Report picker */}
        <div className="flex items-center gap-8 border-b border-[#1b212f] text-xs font-black uppercase tracking-wider overflow-x-auto">
          {REPORTS.map((r) => (
            <button key={r.id} type="button" onClick={() => setReport(r.id)} className={tabClass(report === r.id)}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Period + export */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Period</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className={`${control} cursor-pointer`}>
                {PERIODS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {(period === "quarterly" || period === "yearly") && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Year</label>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={`${control} cursor-pointer`}>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {period === "quarterly" && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Quarter</label>
                <select
                  value={quarter}
                  onChange={(e) => setQuarter(Number(e.target.value))}
                  className={`${control} cursor-pointer`}
                >
                  <option value={1}>Q1 (Jan–Mar)</option>
                  <option value={2}>Q2 (Apr–Jun)</option>
                  <option value={3}>Q3 (Jul–Sep)</option>
                  <option value={4}>Q4 (Oct–Dec)</option>
                </select>
              </div>
            )}

            {period === "custom" && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">From</label>
                  <input type="date" value={start} max={end} onChange={(e) => setStart(e.target.value)} className={control} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">To</label>
                  <input type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} className={control} />
                </div>
              </>
            )}

            <button type="button" onClick={load} className={exportBtn} title="Refresh">
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={!data || !!exporting} onClick={() => exportAs("pdf")} className={exportBtn}>
              <FileText size={13} /> {exporting === "pdf" ? "..." : "PDF"}
            </button>
            <button type="button" disabled={!data || !!exporting} onClick={() => exportAs("xlsx")} className={exportBtn}>
              <FileSpreadsheet size={13} /> {exporting === "xlsx" ? "..." : "Excel"}
            </button>
            <button type="button" disabled={!data || !!exporting} onClick={() => exportAs("csv")} className={exportBtn}>
              <Download size={13} /> {exporting === "csv" ? "..." : "CSV"}
            </button>
            <button type="button" disabled={!data} onClick={printReport} className={exportBtn}>
              <Printer size={13} /> Print
            </button>
          </div>
        </div>

        {error && <p className="text-xs font-bold text-red-500">{error}</p>}
        {loading && !data && <p className="text-xs text-neutral-500">Building report...</p>}

        {data && (
          <div className={`space-y-5 transition-opacity ${loading ? "opacity-50" : ""}`}>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wide">{data.title}</h2>
              <p className="text-[11px] text-neutral-500 font-mono">
                {data.period_label} · generated {data.generated_at}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {data.summary.map((s) => (
                <div key={s.label} className="bg-[#090b10] border border-[#1b212f] rounded-xl p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1">{s.label}</p>
                  <p className="text-lg font-black text-white break-words">{fmt(s.value, s.type)}</p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-[#0b0e14]">
                    {data.columns.map((c, i) => (
                      <th
                        key={c.key}
                        className={`py-3.5 ${i === 0 ? "pl-5" : ""} ${i === data.columns.length - 1 ? "pr-5" : ""} ${
                          c.type === "money" || c.type === "number" ? "text-right pr-4" : ""
                        }`}
                      >
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141824]">
                  {data.rows.length === 0 && (
                    <tr>
                      <td colSpan={data.columns.length} className="py-8 text-center text-neutral-500">
                        No records in this period.
                      </td>
                    </tr>
                  )}
                  {data.rows.map((r, ri) => (
                    <tr key={ri} className="hover:bg-[#121622] transition-colors">
                      {data.columns.map((c, i) => (
                        <td
                          key={c.key}
                          className={`py-3 ${i === 0 ? "pl-5 font-bold text-white" : "text-neutral-300"} ${
                            i === data.columns.length - 1 ? "pr-5" : ""
                          } ${c.type === "money" || c.type === "number" ? "text-right pr-4 font-mono" : ""} ${
                            r[c.key] === "FREQUENTLY DAMAGED" ? "text-orange-400 font-black text-[10px]" : ""
                          }`}
                        >
                          {fmt(r[c.key], c.type)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.notes && <p className="text-[11px] text-neutral-500 italic">{data.notes}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
