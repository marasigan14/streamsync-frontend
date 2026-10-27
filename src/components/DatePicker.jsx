import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n) => String(n).padStart(2, "0");
const toKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`; // m is 0-based
const parseKey = (key) => {
  const [y, m, d] = String(key || "").split("-").map(Number);
  return y && m && d ? { y, m: m - 1, d } : null;
};

const formatLong = (key) => {
  const p = parseKey(key);
  if (!p) return "";
  return new Date(p.y, p.m, p.d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Calendar date picker. Values are "YYYY-MM-DD" strings (same as <input type="date">).
 *
 * <DatePicker value={startDate} onChange={setStartDate} min={todayPH()} placeholder="Select start date" />
 *
 * Days before `min` (and after `max`) are greyed out and can't be clicked,
 * so past dates can't be selected.
 */
const DatePicker = ({
  value,
  onChange,
  min,
  max,
  placeholder = "Select a date",
  clearable = false,
  rangeStart, // optional: highlights the days between rangeStart and value (for an end date)
}) => {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  const initial = parseKey(value) || parseKey(min) || (() => {
    const t = new Date();
    return { y: t.getFullYear(), m: t.getMonth(), d: t.getDate() };
  })();
  const [view, setView] = useState({ y: initial.y, m: initial.m });

  // When the picker opens, show the month of the chosen date (or the earliest allowed one).
  useEffect(() => {
    if (open) {
      const p = parseKey(value) || parseKey(min);
      if (p) setView({ y: p.y, m: p.m });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1).getDay();
    const days = new Date(view.y, view.m + 1, 0).getDate();
    const out = [];
    for (let i = 0; i < first; i++) out.push(null);
    for (let d = 1; d <= days; d++) out.push(toKey(view.y, view.m, d));
    while (out.length % 7) out.push(null);
    return out;
  }, [view]);

  const isDisabled = (key) => (min && key < min) || (max && key > max);

  const minP = parseKey(min);
  const maxP = parseKey(max);
  const canPrev = !minP || view.y > minP.y || (view.y === minP.y && view.m > minP.m);
  const canNext = !maxP || view.y < maxP.y || (view.y === maxP.y && view.m < maxP.m);

  const shift = (delta) =>
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const now = new Date();
  const todayKey = toKey(now.getFullYear(), now.getMonth(), now.getDate());
  const heading = new Date(view.y, view.m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const pick = (key) => {
    if (!key || isDisabled(key)) return;
    onChange(key);
    setOpen(false);
  };

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-3 bg-[#090b10] border rounded-xl px-4 py-3 text-sm text-left transition cursor-pointer ${
          open ? "border-red-600" : "border-[#1e2638] hover:border-neutral-600"
        }`}
      >
        <span className={value ? "text-white" : "text-neutral-600"}>{value ? formatLong(value) : placeholder}</span>
        <span className="flex items-center gap-2 shrink-0">
          {clearable && value && (
            <span
              role="button"
              tabIndex={0}
              title="Clear"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="text-neutral-500 hover:text-white"
            >
              <X size={14} />
            </span>
          )}
          <CalendarIcon size={16} className="text-red-500" />
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[300px] max-w-[calc(100vw-2rem)] bg-[#0e121a] border border-[#1b212f] rounded-2xl p-4 shadow-2xl shadow-black/60">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => shift(-1)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1b212f] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-black uppercase tracking-widest text-white">{heading}</span>
            <button
              type="button"
              disabled={!canNext}
              onClick={() => shift(1)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1b212f] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center text-[9px] font-bold uppercase tracking-wider text-neutral-500 py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((key, i) => {
              if (!key) return <div key={`e${i}`} />;
              const disabled = isDisabled(key);
              const selected = key === value;
              const inRange = rangeStart && value && key > rangeStart && key < value;
              const isRangeStart = rangeStart && key === rangeStart;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => pick(key)}
                  title={disabled ? "Past dates can't be booked" : formatLong(key)}
                  className={`h-9 rounded-lg text-xs font-bold transition ${
                    selected
                      ? "bg-red-600 text-white"
                      : disabled
                      ? "text-neutral-700 line-through cursor-not-allowed"
                      : isRangeStart
                      ? "bg-red-950/60 text-red-300 border border-red-800/60 cursor-pointer"
                      : inRange
                      ? "bg-red-950/30 text-neutral-200 cursor-pointer"
                      : key === todayKey
                      ? "border border-red-600/60 text-white hover:bg-[#1b212f] cursor-pointer"
                      : "text-neutral-200 hover:bg-[#1b212f] cursor-pointer"
                  }`}
                >
                  {Number(key.slice(8, 10))}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1b212f]">
            <span className="text-[10px] text-neutral-500">Past dates are unavailable</span>
            {!isDisabled(min || todayKey) && (
              <button
                type="button"
                onClick={() => pick(min && min > todayKey ? min : todayKey)}
                className="text-[10px] font-black uppercase tracking-wider text-red-500 hover:text-red-400 cursor-pointer"
              >
                {min && min > todayKey ? "Earliest" : "Today"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
