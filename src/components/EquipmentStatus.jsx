import React from "react";
import { AlertTriangle } from "lucide-react";

const REASON_STYLE = {
  damaged: "bg-red-950/40 text-red-400 border-red-800/50",
  under_repair: "bg-amber-950/40 text-amber-400 border-amber-800/50",
  lost: "bg-neutral-900/60 text-neutral-300 border-neutral-700/50",
};

/** Maps a row from GET /equipment to what the inventory tables show. */
export const toInventoryRow = (item) => {
  const total = item.total_quantity ?? 0;
  const available = item.available_quantity ?? 0;
  const usable = item.usable_quantity ?? total;
  return {
    id: item.id,
    name: item.name,
    category: (item.equipment_categories?.name || item.category?.name || "Uncategorized").toUpperCase(),
    total,
    available,
    usable,
    deployed: Math.max(0, usable - available),
    unavailable: item.unavailable_quantity ?? 0,
    reasons: item.unavailable_reasons || [],
    availabilityStatus: item.availability_status || (usable > 0 ? "Available" : "Unavailable"),
    damagedQty: item.damaged_qty ?? 0,
    underRepairQty: item.under_repair_qty ?? 0,
    lostQty: item.lost_qty ?? 0,
    damageCount: item.damage_count ?? 0,
    frequentlyDamaged: !!item.frequently_damaged,
    lastCheck: (item.last_maintained_at || item.updated_at || "").slice(0, 10) || "—",
  };
};

/** "3 / 5 on hand" + Available / Unavailable with the reasons. */
export const AvailabilityCell = ({ row }) => (
  <div className="space-y-1">
    <span className="flex items-center gap-1.5 font-mono font-bold text-neutral-300">
      <span className={`w-2 h-2 rounded-full ${row.available === 0 ? "bg-red-500" : "bg-emerald-500"}`}></span>
      <span>
        {row.available}/{row.total}
      </span>
      <span className="text-[9px] text-neutral-500 font-sans font-normal">on hand</span>
    </span>
    {row.deployed > 0 && <p className="text-[10px] text-blue-400">{row.deployed} out at events</p>}
  </div>
);

export const StatusCell = ({ row }) => (
  <div className="flex flex-col items-start gap-1">
    <span
      className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${
        row.availabilityStatus === "Unavailable"
          ? "bg-red-950/40 text-red-400 border-red-800/50"
          : "bg-emerald-950/40 text-emerald-400 border-emerald-800/50"
      }`}
    >
      {row.availabilityStatus}
    </span>
    {row.reasons.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {row.reasons.map((r) => (
          <span
            key={r.key}
            className={`text-[9px] font-bold px-2 py-0.5 rounded border ${REASON_STYLE[r.key] || REASON_STYLE.lost}`}
            title={`${r.qty} unit(s) ${r.reason.toLowerCase()}`}
          >
            {r.qty} {r.reason}
          </span>
        ))}
      </div>
    )}
    {row.frequentlyDamaged && <FrequentDamageBadge count={row.damageCount} />}
  </div>
);

export const FrequentDamageBadge = ({ count }) => (
  <span
    className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border bg-orange-950/40 text-orange-400 border-orange-800/50"
    title={`${count} damaged unit(s) reported in the last 12 months`}
  >
    <AlertTriangle size={10} /> Frequently damaged ({count})
  </span>
);
