import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { apiFetch } from "../../lib/api";
import Pagination from "../../components/Pagination";
import LostItemsPanel from "../../components/LostItemsPanel";
import { toInventoryRow, AvailabilityCell, StatusCell } from "../../components/EquipmentStatus";
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  RotateCcw,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------
   CONFIG & HELPERS
------------------------------------------------------------------- */
const API_URL = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000";

const CONDITION_BADGE_STYLES = {
  GOOD: "bg-emerald-950/40 text-emerald-400 border-emerald-800/50",
  FAIR: "bg-amber-950/40 text-amber-400 border-amber-800/50",
  POOR: "bg-red-950/40 text-red-500 border-red-800/50",
};

// Equipment category -> calendar color + label
const LIGHTS_AND_SOUNDS = { dot: "bg-purple-500", tag: "bg-purple-600", label: "Lights & Sounds" };
const CATEGORY_THEME = {
  LIVESTREAM: { dot: "bg-red-600", tag: "bg-red-600", label: "Livestream" },
  PROJECTOR: { dot: "bg-blue-500", tag: "bg-blue-600", label: "Projector" },
  AUDIO: LIGHTS_AND_SOUNDS,
  LIGHTING: LIGHTS_AND_SOUNDS,
};
const DEFAULT_THEME = { dot: "bg-neutral-500", tag: "bg-neutral-600", label: "Other" };

// Bookings that reserve equipment on the calendar
const CALENDAR_STATUSES = ["pending", "approved"];

const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const formatLogDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { date: "—", time: "" };
  return {
    date: dateKey(d),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
};

const PAGE_SIZE = 10;

const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Not logged in");
  return { Authorization: `Bearer ${session.access_token}` };
};

/* ------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------- */
const Inventory = () => {
  const [subTab, setSubTab] = useState("inventory"); // "inventory" | "condition_logs" | "lost_items" | "booking_calendar"

  // Search & filter
  const [inventorySearch, setInventorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [logSearch, setLogSearch] = useState("");

  // Modals
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [qrModalItem, setQrModalItem] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);

  // New equipment form
  const [newEqName, setNewEqName] = useState("");
  const [newEqCategory, setNewEqCategory] = useState("LIVESTREAM");
  const [newEqQtyTotal, setNewEqQtyTotal] = useState("1");
  const [eqFormError, setEqFormError] = useState("");
  const [savingEq, setSavingEq] = useState(false);

  // Mark units unavailable (damaged / under repair / lost)
  const [statusModalItem, setStatusModalItem] = useState(null);
  const [statusForm, setStatusForm] = useState({ damaged_qty: 0, under_repair_qty: 0, lost_qty: 0, remarks: "" });
  const [statusError, setStatusError] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  // New condition log form (the staff name comes from the login, not the form)
  const [newLogItem, setNewLogItem] = useState("");
  const [newLogCondition, setNewLogCondition] = useState("good");
  const [newLogComment, setNewLogComment] = useState("");
  const [savingLog, setSavingLog] = useState(false);
  const [logFormError, setLogFormError] = useState("");

  // Data
  const [inventoryList, setInventoryList] = useState([]); // every item (calendar, dropdowns)
  const [pageRows, setPageRows] = useState([]); // one page of the Inventory table
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryTotal, setInventoryTotal] = useState(0);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const refreshInventory = () => setReloadKey((k) => k + 1);
  const [logsList, setLogsList] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState(false);
  const [calendarBookings, setCalendarBookings] = useState([]);

  const [calendarDate, setCalendarDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  /* ----------------------------- inventory ----------------------------- */
  // Full list: used by the booking calendar colours and the dropdowns.
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await apiFetch("/equipment", { auth: false });
        setInventoryList(data.map(toInventoryRow));
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      }
    };
    const fetchSummary = async () => {
      try {
        setSummary(await apiFetch("/equipment/summary", { auth: false }));
      } catch (error) {
        console.error("Failed to fetch inventory summary:", error);
      }
    };
    fetchAll();
    fetchSummary();
  }, [reloadKey]);

  // One page of the table (server-side: limit / offset + search + category).
  useEffect(() => {
    const timer = setTimeout(async () => {
      setInventoryLoading(true);
      try {
        const params = new URLSearchParams({
          limit: String(PAGE_SIZE),
          offset: String((inventoryPage - 1) * PAGE_SIZE),
        });
        if (inventorySearch.trim()) params.set("search", inventorySearch.trim());
        if (selectedCategory !== "All") params.set("category", selectedCategory);
        const data = await apiFetch(`/equipment?${params}`, { auth: false });
        setPageRows(data.items.map(toInventoryRow));
        setInventoryTotal(data.total);
      } catch (error) {
        console.error("Failed to fetch inventory page:", error);
        setPageRows([]);
        setInventoryTotal(0);
      } finally {
        setInventoryLoading(false);
      }
    }, 250); // small delay so typing in the search box doesn't send a request per key
    return () => clearTimeout(timer);
  }, [inventoryPage, inventorySearch, selectedCategory, reloadKey]);

  // Back to page 1 whenever the filters change
  useEffect(() => {
    setInventoryPage(1);
  }, [inventorySearch, selectedCategory]);

  // Summary cards (counted in units, across every item)
  const stats = {
    total: summary?.total ?? 0,
    available: summary?.available ?? 0,
    deployed: summary?.deployed ?? 0,
    unavailable: summary?.unavailable ?? 0,
  };

  const handleAddEquipmentSubmit = async (e) => {
    e.preventDefault();
    if (!newEqName.trim()) return;
    setSavingEq(true);
    setEqFormError("");
    try {
      await apiFetch("/equipment", {
        method: "POST",
        body: {
          name: newEqName.trim(),
          category_name: newEqCategory,
          total_quantity: Math.max(1, Number(newEqQtyTotal) || 1),
        },
      });
      setShowAddEquipmentModal(false);
      setNewEqName("");
      setNewEqQtyTotal("1");
      refreshInventory();
    } catch (err) {
      setEqFormError(err.message);
    } finally {
      setSavingEq(false);
    }
  };

  const openStatusModal = (item) => {
    setStatusModalItem(item);
    setStatusError("");
    setStatusForm({
      damaged_qty: item.damagedQty,
      under_repair_qty: item.underRepairQty,
      lost_qty: item.lostQty,
      remarks: "",
    });
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!statusModalItem) return;
    setSavingStatus(true);
    setStatusError("");
    try {
      await apiFetch(`/equipment/${statusModalItem.id}/unavailable`, {
        method: "PATCH",
        body: {
          damaged_qty: Number(statusForm.damaged_qty) || 0,
          under_repair_qty: Number(statusForm.under_repair_qty) || 0,
          lost_qty: Number(statusForm.lost_qty) || 0,
          remarks: statusForm.remarks.trim(),
        },
      });
      setStatusModalItem(null);
      refreshInventory();
      fetchLogs();
    } catch (err) {
      setStatusError(err.message);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleViewQr = async (item) => {
    setQrModalItem(item);
    setQrCodeImage(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/equipment/${item.id}/qrcode`, { headers });
      const data = await response.json();
      setQrCodeImage(data.qrcode_base64);
    } catch (error) {
      console.error("Failed to fetch QR code:", error);
    }
  };


  /* --------------------------- condition logs --------------------------- */
  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    setLogsError(false);

    try {
      const data = await apiFetch("/condition-logs?limit=500");
      setLogsList(data.items.map(toLogRow));
    } catch (error) {
      console.error("Failed to load condition logs:", error);
      setLogsError(true);
      setLogsList([]);
    }
    setLogsLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleAddLogSubmit = async (e) => {
    e.preventDefault();
    if (!newLogItem) return;

    setSavingLog(true);
    setLogFormError("");

    try {
      // The backend fills in the staff name from the login token.
      await apiFetch("/condition-logs", {
        method: "POST",
        body: {
          equipment_id: Number(newLogItem),
          condition: newLogCondition,
          comment: newLogComment.trim() || "Inspection complete.",
        },
      });
    } catch (error) {
      console.error("Failed to save condition log:", error);
      setLogFormError(error.message || "Could not save the log. Please try again.");
      setSavingLog(false);
      return;
    }
    setSavingLog(false);

    await fetchLogs();
    setShowAddLogModal(false);
    setNewLogItem("");
    setNewLogCondition("good");
    setNewLogComment("");
  };

  const filteredLogs = logsList.filter(
    (l) =>
      l.item.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.staff.toLowerCase().includes(logSearch.toLowerCase())
  );

  /* --------------------------- booking calendar --------------------------- */
  useEffect(() => {
    const fetchCalendarBookings = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}/bookings/`, { headers });

        if (!response.ok) {
          console.error("Failed to load bookings:", await response.text());
          return;
        }

        const data = await response.json();
        setCalendarBookings(
          data.map((b) => ({
            id: b.id,
            name: b.event_name || "Untitled Event",
            client: b.client_name || "Unknown",
            status: b.status || "pending",
            date: b.event_date || "",
            equipment: Array.isArray(b.booking_equipment)
              ? b.booking_equipment.map((be) => be.equipment?.name).filter(Boolean)
              : [],
          }))
        );
      } catch (error) {
        console.error("Failed to load bookings:", error);
      }
    };

    fetchCalendarBookings();
  }, []);

  // Equipment name -> category, so each booking can be colored by what it reserves
  const categoryByName = useMemo(() => {
    const map = {};
    inventoryList.forEach((i) => {
      map[i.name] = i.category;
    });
    return map;
  }, [inventoryList]);

  const scheduledBookings = useMemo(
    () =>
      calendarBookings
        .filter((b) => CALENDAR_STATUSES.includes(b.status) && /^\d{4}-\d{2}-\d{2}$/.test(b.date))
        .map((b) => {
          const category = b.equipment.map((n) => categoryByName[n]).find(Boolean);
          return { ...b, theme: CATEGORY_THEME[category] || DEFAULT_THEME };
        })
        .sort((a, b) => a.date.localeCompare(b.date)),
    [calendarBookings, categoryByName]
  );

  const eventsByDate = useMemo(() => {
    const map = {};
    scheduledBookings.forEach((b) => {
      (map[b.date] ||= []).push(b);
    });
    return map;
  }, [scheduledBookings]);

  const nextMonth = () =>
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const prevMonth = () =>
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  const calendarCells = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;

    // JS Date rolls over months, so day (i - firstDayIndex + 1) covers the overflow days too
    return Array.from({ length: totalCells }, (_, i) => {
      const d = new Date(year, month, i - firstDayIndex + 1);
      const key = dateKey(d);
      return {
        key,
        dayNum: d.getDate(),
        isCurrentMonth: d.getMonth() === month,
        events: eventsByDate[key] || [],
      };
    });
  }, [calendarDate, eventsByDate]);

  const monthPrefix = dateKey(calendarDate).slice(0, 7); // "YYYY-MM"
  const bookingsThisMonth = scheduledBookings.filter((b) => b.date.startsWith(monthPrefix));

  const monthHeading = calendarDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  /* ----------------------------- render ----------------------------- */
  const tabs = [
    { id: "inventory", label: "Inventory" },
    { id: "condition_logs", label: "Condition Logs" },
    { id: "lost_items", label: "Lost / Missing" },
    { id: "booking_calendar", label: "Booking Calendar" },
  ];

  const summaryCards = [
    { label: "Total Items", value: stats.total, labelColor: "text-neutral-400", valueColor: "text-white" },
    { label: "Available", value: stats.available, labelColor: "text-emerald-500", valueColor: "text-emerald-400" },
    { label: "Deployed", value: stats.deployed, labelColor: "text-blue-500", valueColor: "text-blue-400" },
    { label: "Unavailable", value: stats.unavailable, labelColor: "text-red-500", valueColor: "text-red-400" },
  ];

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-10 space-y-6">
        <h1 className="text-2xl font-black uppercase tracking-wide text-white">
          Equipment Inventory
        </h1>

        {/* Sub-navigation */}
        <div className="flex items-center gap-8 border-b border-[#1b212f] text-xs font-black uppercase tracking-wider overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`pb-3.5 transition cursor-pointer whitespace-nowrap ${
                subTab === tab.id
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================ INVENTORY ============================ */}
        {subTab === "inventory" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {summaryCards.map((card) => (
                <div key={card.label} className="bg-[#0b0e14] border border-[#1b212f] rounded-xl p-5">
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${card.labelColor}`}>
                    {card.label}
                  </p>
                  <h3 className={`text-3xl font-black ${card.valueColor}`}>{card.value}</h3>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-48 bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-neutral-300 focus:outline-none focus:border-red-600 cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="LIVESTREAM">Livestream</option>
                <option value="PROJECTOR">Projector</option>
                <option value="AUDIO">Audio</option>
                <option value="LIGHTING">Lighting</option>
                <option value="CABLE">Cables</option>
              </select>

              <button
                type="button"
                onClick={() => setShowAddEquipmentModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-red-950/40 shrink-0"
              >
                <Plus size={16} />
                <span>Add Equipment</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
              <table className="w-full text-left min-w-[840px] text-xs">
                <thead>
                  <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-[#0b0e14]">
                    <th className="py-4 pl-6">Equipment</th>
                    <th className="py-4">Category</th>
                    <th className="py-4">On Hand</th>
                    <th className="py-4">Status</th>
                    <th className="py-4">Last Inspection</th>
                    <th className="py-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141824]">
                  {inventoryLoading && pageRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-500">
                        Loading inventory...
                      </td>
                    </tr>
                  )}
                  {!inventoryLoading && pageRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-500">
                        No equipment found.
                      </td>
                    </tr>
                  )}
                  {pageRows.map((item) => (
                    <tr key={item.id} className="hover:bg-[#121622] transition-colors align-top">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <span className="text-red-500 font-bold">☵</span>
                          <span className="font-bold text-white">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="bg-[#141824] border border-[#1e2638] text-neutral-300 text-[9px] font-black uppercase px-2.5 py-0.5 rounded">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4">
                        <AvailabilityCell row={item} />
                      </td>
                      <td className="py-4">
                        <StatusCell row={item} />
                      </td>
                      <td className="py-4 font-mono text-neutral-400 text-[11px]">{item.lastCheck}</td>
                      <td className="py-4 pr-6 text-right whitespace-nowrap space-x-4">
                        <button
                          type="button"
                          onClick={() => openStatusModal(item)}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
                        >
                          Set Unavailable
                        </button>
                        <button
                          type="button"
                          onClick={() => handleViewQr(item)}
                          className="text-[11px] font-bold text-neutral-400 hover:text-white transition cursor-pointer"
                        >
                          View QR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={inventoryPage}
              pageSize={PAGE_SIZE}
              total={inventoryTotal}
              onChange={setInventoryPage}
              label="items"
            />
          </div>
        )}

        {/* ========================== CONDITION LOGS ========================== */}
        {subTab === "condition_logs" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search by item or staff..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="button"
                onClick={() => setLogSearch("")}
                className="w-12 h-11 bg-[#090b10] border border-[#1b212f] rounded-xl flex items-center justify-center hover:border-neutral-600 transition cursor-pointer shrink-0"
                title="Reset search"
              >
                <RotateCcw size={15} className="text-neutral-400" />
              </button>

              <button
                type="button"
                onClick={() => setShowAddLogModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-red-950/40 shrink-0"
              >
                <Plus size={16} />
                <span>Add Log Entry</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 py-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[11px]">
                  Condition reports submitted by staff from the Inventory page are automatically synced here.
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">
                {filteredLogs.length} from staff
              </span>
            </div>

            {logsLoading && <p className="text-neutral-500 text-sm">Loading condition logs...</p>}

            {logsError && (
              <div className="border border-red-900/40 bg-red-950/10 rounded-2xl p-6 text-center text-red-500 text-sm">
                Could not load condition logs. Make sure the backend is running and you are logged in as admin.
              </div>
            )}

            {!logsLoading && !logsError && filteredLogs.length === 0 && (
              <div className="border border-[#1b212f] rounded-2xl bg-[#090b10] p-8 text-center text-neutral-400 text-sm">
                No condition logs yet.
              </div>
            )}

            {filteredLogs.length > 0 && (
              <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
                <table className="w-full text-left min-w-[800px] text-xs">
                  <thead>
                    <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-[#0b0e14]">
                      <th className="py-4 pl-6">Item</th>
                      <th className="py-4">Condition</th>
                      <th className="py-4">Comment</th>
                      <th className="py-4">Staff</th>
                      <th className="py-4 pr-6">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141824]">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#121622] transition-colors">
                        <td className="py-4 pl-6 font-bold text-white">{log.item}</td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                              CONDITION_BADGE_STYLES[log.condition] || CONDITION_BADGE_STYLES.FAIR
                            }`}
                          >
                            {log.condition}
                          </span>
                        </td>
                        <td className="py-4 text-neutral-400 max-w-sm truncate">{log.comment}</td>
                        <td className="py-4 text-neutral-300">
                          <div className="flex items-center gap-1.5">
                            <User size={13} className="text-neutral-500" />
                            <span>{log.staff}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-6 font-mono text-[11px] text-neutral-500">
                          <div className="flex items-center gap-1">
                            <Clock size={11} />
                            <span>
                              {log.date} {log.time}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================== LOST / MISSING ========================== */}
        {subTab === "lost_items" && (
          <LostItemsPanel equipment={inventoryList} isAdmin onChanged={refreshInventory} />
        )}

        {/* ========================= BOOKING CALENDAR ========================= */}
        {subTab === "booking_calendar" && (
          <div className="border border-[#1b212f] rounded-2xl bg-[#090b10] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#1b212f]">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 text-neutral-500 hover:text-white transition cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-widest">
                <CalendarIcon size={18} className="text-red-600" />
                {monthHeading.toUpperCase()}
              </h2>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 text-neutral-500 hover:text-white transition cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 border-b border-[#1b212f] text-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest py-3 bg-[#0b0e14]">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 text-xs text-neutral-400">
              {calendarCells.map((cell) => (
                <div
                  key={cell.key}
                  className={`min-h-[110px] border-r border-b border-[#1b212f] p-2.5 flex flex-col gap-1 transition-colors ${
                    cell.isCurrentMonth
                      ? "bg-[#090b10] hover:bg-[#0d1017]"
                      : "bg-[#06080c]/60 text-neutral-600"
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-bold ${
                      cell.isCurrentMonth ? "text-white" : "text-neutral-600"
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  <div className="space-y-1">
                    {cell.events.map((evt) => (
                      <div key={evt.id} className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${evt.theme.dot} shrink-0`}></div>
                        <span className="text-[8px] text-neutral-300 truncate leading-none">
                          {evt.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-[#1b212f] space-y-6">
              <div className="flex flex-wrap items-center gap-6 text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span> Livestream
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Projector
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Lights & Sounds
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-500"></span> Other
                </span>
              </div>

              <div className="border border-[#1b212f] rounded-2xl overflow-hidden bg-[#0b0e14]">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 p-4 border-b border-[#1b212f] flex items-center gap-2 bg-[#090b10]">
                  <CalendarIcon size={14} className="text-red-600" />
                  Upcoming bookings in {monthHeading}
                </h3>

                {bookingsThisMonth.length === 0 ? (
                  <p className="p-6 text-center text-sm text-neutral-500">
                    No pending or confirmed bookings this month.
                  </p>
                ) : (
                  <div className="divide-y divide-[#141824]">
                    {bookingsThisMonth.map((bkg) => (
                      <div
                        key={bkg.id}
                        className="p-4 flex items-center justify-between hover:bg-[#121622] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${bkg.theme.dot}`}></div>
                          <div>
                            <p className="text-xs font-bold text-white">{bkg.name}</p>
                            <p className="text-[10px] text-neutral-500">{bkg.client}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span
                            className={`${bkg.theme.tag} text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded`}
                          >
                            {bkg.theme.label}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">{bkg.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================== MODAL: ADD EQUIPMENT ========================== */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddEquipmentSubmit}
            className="w-full max-w-md bg-[#0e121a] border border-[#1b212f] rounded-2xl p-6 space-y-4 shadow-2xl text-white"
          >
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Add New Equipment
              </h3>
              <button
                type="button"
                onClick={() => setShowAddEquipmentModal(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Equipment Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sony FX6 Cinema Camera"
                value={newEqName}
                onChange={(e) => setNewEqName(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-xs text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={newEqCategory}
                  onChange={(e) => setNewEqCategory(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-3 py-2.5 text-xs text-neutral-300 focus:border-red-600 focus:outline-none"
                >
                  <option value="LIVESTREAM">Livestream</option>
                  <option value="PROJECTOR">Projector</option>
                  <option value="AUDIO">Audio</option>
                  <option value="LIGHTING">Lighting</option>
                  <option value="CABLE">Cables</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Total Units
                </label>
                <input
                  type="number"
                  min="1"
                  value={newEqQtyTotal}
                  onChange={(e) => setNewEqQtyTotal(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-3 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            <p className="text-[10px] text-neutral-500">
              New units start as available. Use "Set Unavailable" in the table to mark damaged, under-repair or lost units.
            </p>

            {eqFormError && <p className="text-[11px] font-bold text-red-500">{eqFormError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddEquipmentModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEq}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-red-950/50 disabled:opacity-50"
              >
                {savingEq ? "Saving..." : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================== MODAL: ADD CONDITION LOG ======================== */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddLogSubmit}
            className="w-full max-w-md bg-[#0e121a] border border-[#1b212f] rounded-2xl p-6 space-y-4 shadow-2xl text-white"
          >
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                New Condition Log
              </h3>
              <button
                type="button"
                onClick={() => setShowAddLogModal(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Item Name *
              </label>
              <select
                required
                value={newLogItem}
                onChange={(e) => setNewLogItem(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-red-600 cursor-pointer"
              >
                <option value="">Select equipment...</option>
                {inventoryList.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-neutral-500 mt-1.5">
                Logged under your account automatically.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Condition
              </label>
              <select
                value={newLogCondition}
                onChange={(e) => setNewLogCondition(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 cursor-pointer"
              >
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor / Needs Repair</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Comment
              </label>
              <textarea
                rows={3}
                placeholder="Describe the condition or findings..."
                value={newLogComment}
                onChange={(e) => setNewLogComment(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 resize-none"
              />
            </div>

            {logFormError && <p className="text-[11px] font-bold text-red-500">{logFormError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddLogModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingLog}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-red-950/50 disabled:opacity-50"
              >
                {savingLog ? "Saving..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL: SET UNAVAILABLE UNITS ==================== */}
      {statusModalItem && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleStatusSubmit}
            className="w-full max-w-md bg-[#0e121a] border border-[#1b212f] rounded-2xl p-6 space-y-4 shadow-2xl text-white"
          >
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Unavailable Units — {statusModalItem.name}
              </h3>
              <button
                type="button"
                onClick={() => setStatusModalItem(null)}
                className="text-neutral-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              {statusModalItem.total} unit(s) in total, {statusModalItem.available} on hand. Units you mark here
              are taken off the shelf and can't be booked. Repairs are normally tracked from the Maintenance page
              and lost items from the Lost / Missing tab; use this to correct the counts.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["damaged_qty", "Damaged"],
                ["under_repair_qty", "Under Repair"],
                ["lost_qty", "Lost"],
              ].map(([key, text]) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    {text}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={statusModalItem.total}
                    value={statusForm[key]}
                    onChange={(e) => setStatusForm({ ...statusForm, [key]: e.target.value })}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-3 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Remarks *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Why the count changed..."
                value={statusForm.remarks}
                onChange={(e) => setStatusForm({ ...statusForm, remarks: e.target.value })}
                className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 resize-none"
              />
            </div>
            {statusError && <p className="text-[11px] font-bold text-red-500">{statusError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStatusModalItem(null)}
                className="px-4 py-2.5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingStatus}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition disabled:opacity-50"
              >
                {savingStatus ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================ MODAL: VIEW QR ============================ */}
      {qrModalItem && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0e121a] border border-[#1b212f] rounded-2xl p-6 space-y-4 shadow-2xl text-white text-center">
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                {qrModalItem.name}
              </h3>
              <button
                type="button"
                onClick={() => setQrModalItem(null)}
                className="text-neutral-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {qrCodeImage ? (
              <img
                src={qrCodeImage}
                alt={`QR code for ${qrModalItem.name}`}
                className="mx-auto w-48 h-48"
              />
            ) : (
              <p className="text-xs text-neutral-500 py-12">Loading QR code...</p>
            )}

            <p className="text-[10px] text-neutral-500">
              Attach this to the physical item for scan-based checkout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Maps a condition_logs row from Supabase to what the table renders
const toLogRow = (row) => {
  const { date, time } = formatLogDate(row.created_at);
  return {
    id: row.id,
    item: row.equipment_name || "Unknown item",
    condition: String(row.condition || "fair").toUpperCase(),
    comment: row.comment || "",
    staff: row.staff_name || "Unknown",
    date,
    time,
  };
};

export default Inventory;
