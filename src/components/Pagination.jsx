import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Page numbers with "..." gaps: 1 2 3 ... 10, or 1 ... 4 5 6 ... 10
const pageList = (page, pages) => {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set([1, pages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((p) => set.add(p));
  if (page >= pages - 2) [pages - 3, pages - 2, pages - 1].forEach((p) => set.add(p));
  const sorted = [...set].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
};

/**
 * <Pagination page={1} pageSize={10} total={57} onChange={setPage} />
 * page is 1-based. Hidden when everything fits on one page.
 */
const Pagination = ({ page, pageSize, total, onChange, label = "items" }) => {
  const pages = Math.max(1, Math.ceil((total || 0) / pageSize));
  if (!total || pages <= 1) {
    return total ? (
      <p className="text-[10px] text-neutral-500 font-mono">
        Showing {total} {label}
      </p>
    ) : null;
  }
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const btn =
    "min-w-[34px] h-[34px] px-2 rounded-lg border text-[11px] font-bold transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-[10px] text-neutral-500 font-mono">
        Showing {from}–{to} of {total} {label}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={`${btn} border-[#1b212f] bg-[#090b10] text-neutral-400 hover:text-white`}
        >
          <ChevronLeft size={14} className="mx-auto" />
        </button>
        {pageList(page, pages).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-1 text-neutral-600 text-xs">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`${btn} ${
                p === page
                  ? "bg-red-600 border-red-600 text-white"
                  : "border-[#1b212f] bg-[#090b10] text-neutral-400 hover:text-white"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className={`${btn} border-[#1b212f] bg-[#090b10] text-neutral-400 hover:text-white`}
        >
          <ChevronRight size={14} className="mx-auto" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
