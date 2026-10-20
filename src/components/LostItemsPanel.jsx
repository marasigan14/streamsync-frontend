import React, { useCallback, useEffect, useState } from "react";
import { Plus, X, Search } from "lucide-react";
import { apiFetch, todayPH } from "../lib/api";

const STATUS_STYLE = {
  missing: "bg-red-950/40 text-red-400 border-red-800/50",
  found: "bg-emerald-950/40 text-emerald-400 border-emerald-800/50",
  written_off: "bg-neutral-900/60 text-neutral-400 border-neutral-700/50",
};
const STATUS_LABEL = { missing: "Missing", found: "Found", written_off: "Written off" };

const input =
  "w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600";
const label = "block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5";

/**
 * Lost / Missing equipment log. Used as a tab in the Staff Equipment page
 * and the admin Inventory page. `equipment` = [{id, name, available}].
 */
const LostItemsPanel = ({ equipment = [], isAdmin = false, onChanged }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ equipment_id: "", quantity: 1, lost_date: todayPH(), remarks: "" });
  const [resolving, setResolving] = useState(null); // {row, status}
  const [resolveNotes, setResolveNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await apiFetch("/lost-items"));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.equipment_id || !form.remarks.trim()) return;
    setBusy(true);
    setError("");
    try {
      await apiFetch("/lost-items", {
        method: "POST",
        body: {
          equipment_id: Number(form.equipment_id),
          quantity: Number(form.quantity) || 1,
          lost_date: form.lost_date,
          remarks: form.remarks.trim(),
        },
      });
      setShowForm(false);
      setForm({ equipment_id: "", quantity: 1, lost_date: todayPH(), remarks: "" });
      await load();
      onChanged?.();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setBusy(false);
    }
  };

  const resolve = async () => {
    if (!resolving) return;
    setBusy(true);
    setError("");
    try {
      await apiFetch(`/lost-items/${resolving.row.id}`, {
        method: "PATCH",
        body: { status: resolving.status, resolution_notes: resolveNotes.trim() || null },
      });
      setResolving(null);
      setResolveNotes("");
      await load();
      onChanged?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const selected = equipment.find((e) => String(e.id) === String(form.equipment_id));
  const shown = rows.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      (r.equipment_name.toLowerCase().includes(search.toLowerCase()) ||
        (r.reported_by_name || "").toLowerCase().includes(search.toLowerCase()))
  );
  const missingUnits = rows.filter((r) => r.status === "missing").reduce((a, r) => a + (r.quantity || 1), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by item or staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${input} pl-11`}
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${input} sm:w-44 cursor-pointer`}>
          <option value="all">All records</option>
          <option value="missing">Missing</option>
          <option value="found">Found</option>
          <option value="written_off">Written off</option>
        </select>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-red-950/40 shrink-0"
        >
          <Plus size={16} /> Report Lost Item
        </button>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-neutral-400">
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        {missingUnits} unit(s) currently missing. Reported units are taken out of available stock until found.
      </div>

      {showForm && (
        <form onSubmit={submit} className="border border-[#1b212f] rounded-2xl p-6 bg-[#090b10] space-y-5">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">Report Lost / Missing Equipment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className={label}>Equipment *</label>
              <select
                required
                value={form.equipment_id}
                onChange={(e) => setForm({ ...form, equipment_id: e.target.value })}
                className={`${input} cursor-pointer`}
              >
                <option value="">Select equipment...</option>
                {equipment.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.available} on hand)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Quantity *</label>
              <input
                type="number"
                min="1"
                max={selected?.available || undefined}
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className={input}
              />
            </div>
            <div>
              <label className={label}>Date lost *</label>
              <input
                type="date"
                required
                max={todayPH()}
                value={form.lost_date}
                onChange={(e) => setForm({ ...form, lost_date: e.target.value })}
                className={input}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Reported by</label>
              <p className="text-xs text-neutral-400 py-3">Filled in automatically from your login.</p>
            </div>
          </div>
          <div>
            <label className={label}>Remarks *</label>
            <textarea
              rows={3}
              required
              placeholder="Where and when it was last seen, which event, who had it..."
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              className={`${input} resize-none`}
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-[#1b212f] pt-5">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="bg-red-600 hover:bg-red-700 text-white px-7 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs transition cursor-pointer disabled:opacity-50"
            >
              {busy ? "Saving..." : "Submit Report"}
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
      {loading && <p className="text-xs text-neutral-500">Loading lost item records...</p>}

      <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
        <table className="w-full text-left min-w-[900px] text-xs">
          <thead>
            <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-[#0b0e14]">
              <th className="py-4 pl-6">Equipment</th>
              <th className="py-4">Qty</th>
              <th className="py-4">Date lost</th>
              <th className="py-4">Reported by</th>
              <th className="py-4">Remarks</th>
              <th className="py-4">Status</th>
              <th className="py-4 pr-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141824]">
            {!loading && shown.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-500">
                  No lost or missing equipment recorded.
                </td>
              </tr>
            )}
            {shown.map((r) => (
              <tr key={r.id} className="hover:bg-[#121622] transition-colors align-top">
                <td className="py-4 pl-6 font-bold text-white">{r.equipment_name}</td>
                <td className="py-4 font-mono text-neutral-300">{r.quantity}</td>
                <td className="py-4 font-mono text-neutral-400">{r.lost_date}</td>
                <td className="py-4 text-neutral-300">{r.reported_by_name}</td>
                <td className="py-4 text-neutral-400 max-w-xs">
                  <p>{r.remarks}</p>
                  {r.resolution_notes && (
                    <p className="text-[10px] text-neutral-500 mt-1">
                      Resolution: {r.resolution_notes}
                      {r.resolved_by_name ? ` — ${r.resolved_by_name}` : ""}
                    </p>
                  )}
                </td>
                <td className="py-4">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${STATUS_STYLE[r.status]}`}>
                    {STATUS_LABEL[r.status] || r.status}
                  </span>
                  {r.resolved_at && (
                    <p className="text-[10px] text-neutral-500 font-mono mt-1">{r.resolved_at.slice(0, 10)}</p>
                  )}
                </td>
                <td className="py-4 pr-6 text-right space-x-3 whitespace-nowrap">
                  {r.status === "missing" && (
                    <>
                      <button
                        type="button"
                        onClick={() => setResolving({ row: r, status: "found" })}
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                      >
                        Mark Found
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => setResolving({ row: r, status: "written_off" })}
                          className="text-[11px] font-bold text-neutral-400 hover:text-white cursor-pointer"
                        >
                          Write Off
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {resolving && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e121a] border border-[#1b212f] rounded-2xl p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider">
                {resolving.status === "found" ? "Mark as Found" : "Write Off Lost Units"}
              </h3>
              <button type="button" onClick={() => setResolving(null)} className="text-neutral-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              {resolving.status === "found"
                ? `${resolving.row.quantity} unit(s) of ${resolving.row.equipment_name} will go back to available stock.`
                : `${resolving.row.quantity} unit(s) of ${resolving.row.equipment_name} will be removed from the total inventory for good.`}
            </p>
            <textarea
              rows={3}
              placeholder="Notes (where it was found, approval for write-off...)"
              value={resolveNotes}
              onChange={(e) => setResolveNotes(e.target.value)}
              className={`${input} resize-none`}
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setResolving(null)}
                className="px-4 py-2.5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={resolve}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider disabled:opacity-50"
              >
                {busy ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostItemsPanel;
