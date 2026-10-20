import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  RotateCcw,
  ScanLine,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { apiFetch } from "../../lib/api";
import Pagination from "../../components/Pagination";
import LostItemsPanel from "../../components/LostItemsPanel";
import { toInventoryRow, AvailabilityCell, StatusCell } from "../../components/EquipmentStatus";

const API_URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 10;

// ------------------------------------------------------------------
// TABLE: equipment
// columns: id, category_id, name, qr_code, status (enum), total_quantity,
//          available_quantity, last_maintained_at, ...
// category_id is a foreign key; the category name is joined in loadInventory().
// ------------------------------------------------------------------
const EquipmentChecklist = () => {
  const [subTab, setSubTab] = useState("inventory"); // "inventory" | "condition_logs" | "lost_items" | "booking_calendar" | "scan_equipment"
  const [showAddLog, setShowAddLog] = useState(false);

  // Filters
  const [inventorySearch, setInventorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [logSearch, setLogSearch] = useState("");

  // Form State for Condition Logs
  const [newEquipmentId, setNewEquipmentId] = useState("");
  const [newCondition, setNewCondition] = useState("good");
  const [newComment, setNewComment] = useState("");

  // FR-10 Scan Equipment State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); // { equipment_name, action, new_available_quantity } or { error }
  const [scannedEquipmentId, setScannedEquipmentId] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // ================================================================
  // Inventory (from the backend: quantity-based status)
  // ================================================================
  const [inventoryList, setInventoryList] = useState([]); // every item (dropdowns, scan names)
  const [pageRows, setPageRows] = useState([]); // one page of the table
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryTotal, setInventoryTotal] = useState(0);
  const [summary, setSummary] = useState(null);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Called after a scan / lost report so every count refreshes.
  const loadInventory = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    (async () => {
      try {
        const [all, sum] = await Promise.all([
          apiFetch("/equipment", { auth: false }),
          apiFetch("/equipment/summary", { auth: false }),
        ]);
        setInventoryList(all.map(toInventoryRow));
        setSummary(sum);
      } catch (error) {
        console.error("Failed to load inventory:", error);
        setInventoryError(error.message);
      }
    })();
  }, [reloadKey]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setInventoryLoading(true);
      setInventoryError(null);
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
        console.error("Failed to load inventory:", error);
        setInventoryError(error.message);
        setPageRows([]);
      } finally {
        setInventoryLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [inventoryPage, inventorySearch, selectedCategory, reloadKey]);

  useEffect(() => {
    setInventoryPage(1);
  }, [inventorySearch, selectedCategory]);

  // ================================================================
  // Condition Logs (live from Supabase: equipment_condition_logs)
  // ================================================================
  const [logsList, setLogsList] = useState([]);
  const [logsError, setLogsError] = useState(null);

  const loadLogs = async () => {
    setLogsError(null);
    let data;
    try {
      data = (await apiFetch("/condition-logs?limit=500")).items;
    } catch (error) {
      console.error("Failed to load condition logs:", error);
      setLogsError(error.message);
      return;
    }

    setLogsList(
      (data || []).map((row) => {
        const d = new Date(row.created_at);
        return {
          id: row.id,
          item: row.equipment_name || "Unknown item",
          condition: (row.condition || "").toUpperCase(),
          comment: row.comment || "—",
          staff: row.staff_name || "Unknown",
          date: d.toLocaleDateString("en-CA"),
          time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
        };
      })
    );
  };

  const handleAddLogSubmit = async (e) => {
    e.preventDefault();
    if (!newEquipmentId) return;

    // The staff member is taken from the login token on the server, not from this form.
    try {
      await apiFetch("/condition-logs", {
        method: "POST",
        body: {
          equipment_id: parseInt(newEquipmentId, 10),
          condition: newCondition,
          comment: newComment.trim() || "Inspection complete.",
        },
      });
    } catch (error) {
      console.error("Failed to save condition log:", error);
      setLogsError(error.message);
      return;
    }

    setShowAddLog(false);
    setNewEquipmentId("");
    setNewCondition("good");
    setNewComment("");
    await loadLogs();
  };

  // ================================================================
  // Booking Calendar (live from Supabase: bookings)
  // ================================================================
  const [calMonth, setCalMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [bookings, setBookings] = useState([]);
  const [bookingsError, setBookingsError] = useState(null);

  const pad = (n) => String(n).padStart(2, "0");

  const bookingTypeStyle = (eventType) => {
    const u = String(eventType || "").toUpperCase();
    if (u.includes("LIVE")) return { type: "Livestream", color: "bg-red-600", tagBg: "bg-red-600" };
    if (u.includes("PROJ")) return { type: "Projector", color: "bg-blue-500", tagBg: "bg-blue-600" };
    return { type: "Lights & Sounds", color: "bg-purple-500", tagBg: "bg-purple-600" };
  };

  const loadBookings = async (monthDate) => {
    setBookingsError(null);
    const y = monthDate.getFullYear();
    const m = monthDate.getMonth();
    const start = `${y}-${pad(m + 1)}-01`;
    const end = `${y}-${pad(m + 1)}-${pad(new Date(y, m + 1, 0).getDate())}`;

    const { data, error } = await supabase
      .from("bookings")
      .select("id, event_name, event_type, status, event_date, venue")
      .gte("event_date", start)
      .lte("event_date", end)
      .order("event_date");

    if (error) {
      console.error("Failed to load bookings:", error);
      setBookingsError(error.message);
      setBookings([]);
      return;
    }

    setBookings(
      (data || [])
        // hide cancelled / rejected bookings
        .filter((b) => !/CANCEL|REJECT|DECLIN/.test(String(b.status || "").toUpperCase()))
        .map((b) => ({
          id: b.id,
          name: b.event_name,
          client: b.venue || "—",
          date: b.event_date,
          day: parseInt(b.event_date.slice(8, 10), 10),
          ...bookingTypeStyle(b.event_type),
        }))
    );
  };

  useEffect(() => {
    loadBookings(calMonth);
  }, [calMonth]);

  const upcomingBookings = bookings;
  const monthLabel = calMonth
    .toLocaleDateString("en-US", { month: "long", year: "numeric" })
    .toUpperCase();
  const firstWeekday = calMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  // ================================================================
  // Recent scans (live from Supabase: equipment_scan_logs)
  // ================================================================
  const [recentScans, setRecentScans] = useState([]);

  const loadScans = async () => {
    const { data, error } = await supabase
      .from("equipment_scan_logs")
      .select("id, equipment_id, action, scanned_at")
      .order("scanned_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Failed to load scan history:", error);
      return;
    }
    setRecentScans(data || []);
  };

  const equipmentName = (id) =>
    inventoryList.find((i) => String(i.id) === String(id))?.name || `Equipment #${id}`;

  useEffect(() => {
    loadLogs();
    loadScans();
  }, []);

  // ================================================================
  // FR-10: QR Scanner logic
  // ================================================================

  const startScanner = async () => {
    setScanResult(null);
    setScannedEquipmentId(null);
    setIsScanning(true);

    // Wait a tick for the DOM element to actually mount before attaching the camera
    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" }, // rear camera on phones
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            // Successful scan — decodedText is the equipment_id we encoded earlier
            setScannedEquipmentId(decodedText);
            stopScanner();
          },
          () => {
            // per-frame scan failure (no QR in view) — expected, ignore
          }
        );
      } catch (err) {
        console.error("Camera failed to start:", err);
        setScanResult({ error: "Could not access camera. Check browser permissions." });
        setIsScanning(false);
      }
    }, 100);
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        // scanner may already be stopped — safe to ignore
      }
    }
    setIsScanning(false);
  };

  const submitScan = async (action) => {
    if (!scannedEquipmentId) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setScanResult({ error: "You must be logged in to scan equipment." });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/equipment/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          equipment_id: parseInt(scannedEquipmentId, 10),
          action, // must be "checkin" or "checkout" (DB constraint)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setScanResult({ error: data.detail || "Scan failed." });
        return;
      }

      setScanResult(data);
      loadInventory(); // refresh counts in the Inventory tab
      loadScans(); // refresh scan history
    } catch (err) {
      console.error("Scan submission failed:", err);
      setScanResult({ error: "Network error — could not reach the server." });
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setScannedEquipmentId(null);
  };

  // Clean up camera if the user navigates away mid-scan
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // ================================================================
  // Derived data
  // ================================================================

  const filteredLogs = logsList.filter(
    (l) =>
      l.item.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.staff.toLowerCase().includes(logSearch.toLowerCase())
  );

  // Stat cards computed from the same fetched data as the table
  const stats = {
    total: summary?.total ?? 0,
    available: summary?.available ?? 0,
    deployed: summary?.deployed ?? 0,
    unavailable: summary?.unavailable ?? 0,
  };

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      {/* Main Panel Box */}
      <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-10 space-y-6">
        <h1 className="text-2xl font-black uppercase tracking-wide text-white">
          Equipment Inventory
        </h1>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-[#1b212f] text-xs font-black uppercase tracking-wider overflow-x-auto">
          <button
            type="button"
            onClick={() => setSubTab("inventory")}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap ${
              subTab === "inventory"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Inventory
          </button>
          <button
            type="button"
            onClick={() => setSubTab("condition_logs")}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap ${
              subTab === "condition_logs"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Condition Logs
          </button>
          <button
            type="button"
            onClick={() => setSubTab("lost_items")}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap ${
              subTab === "lost_items"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Lost / Missing
          </button>
          <button
            type="button"
            onClick={() => setSubTab("booking_calendar")}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap ${
              subTab === "booking_calendar"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Booking Calendar
          </button>
          <button
            type="button"
            onClick={() => {
              setSubTab("scan_equipment");
              resetScan();
            }}
            className={`pb-3.5 transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              subTab === "scan_equipment"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <ScanLine size={14} />
            Scan Equipment
          </button>
        </div>

        {/* ============================================================== */}
        {/* SUB-TAB 1: INVENTORY                                           */}
        {/* ============================================================== */}
        {subTab === "inventory" && (
          <div className="space-y-6">
            {/* Top Stat Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                  Total Items
                </p>
                <h3 className="text-3xl font-black text-white">{stats.total}</h3>
              </div>
              <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">
                  Available
                </p>
                <h3 className="text-3xl font-black text-emerald-400">{stats.available}</h3>
              </div>
              <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
                  Deployed
                </p>
                <h3 className="text-3xl font-black text-blue-400">{stats.deployed}</h3>
              </div>
              <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">
                  Unavailable
                </p>
                <h3 className="text-3xl font-black text-red-400">{stats.unavailable}</h3>
              </div>
            </div>

            {/* Search & Category Filter Bar */}
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
            </div>

            {/* Loading / error states */}
            {inventoryLoading && (
              <p className="text-xs text-neutral-500">Loading inventory...</p>
            )}
            {inventoryError && (
              <p className="text-xs text-red-500">
                Could not load inventory: {inventoryError}
              </p>
            )}

            {/* Inventory Data Table */}
            <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
              <table className="w-full text-left min-w-[820px] text-xs">
                <thead>
                  <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-[#0b0e14]">
                    <th className="py-4 pl-6">Equipment</th>
                    <th className="py-4">Category</th>
                    <th className="py-4">On Hand</th>
                    <th className="py-4">Status</th>
                    <th className="py-4 pr-6">Last Inspection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141824]">
                  {!inventoryLoading && !inventoryError && pageRows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-500">
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

                      <td className="py-4 pr-6 font-mono text-neutral-400 text-[11px]">{item.lastCheck}</td>
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

        {/* ============================================================== */}
        {/* SUB-TAB 2: CONDITION LOGS                                      */}
        {/* ============================================================== */}
        {subTab === "condition_logs" && (
          <div className="space-y-6">
            {/* Search Bar & Add Button */}
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
                onClick={() => setShowAddLog(!showAddLog)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-red-950/40 shrink-0"
              >
                <Plus size={16} />
                <span>Add Log Entry</span>
              </button>
            </div>

            {/* Info Synced Status */}
            <div className="flex items-center justify-between text-xs text-neutral-400 py-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[11px]">
                  Condition reports submitted by staff from the Inventory page are automatically synced here.
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">{logsList.length} entries</span>
            </div>

            {/* COLLAPSIBLE NEW CONDITION LOG FORM */}
            {showAddLog && (
              <form
                onSubmit={handleAddLogSubmit}
                className="border border-[#1b212f] rounded-2xl p-6 md:p-8 bg-[#090b10] space-y-5 animate-in fade-in duration-150"
              >
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  New Condition Log
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Item Name *
                    </label>
                    <select
                      required
                      value={newEquipmentId}
                      onChange={(e) => setNewEquipmentId(e.target.value)}
                      className="w-full bg-[#0f121a] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                      <option value="">Select equipment...</option>
                      {inventoryList.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Logged By
                    </label>
                    <p className="text-xs text-neutral-400 py-3">
                      Your name is added automatically from your login.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Condition
                  </label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="w-full sm:w-1/2 bg-[#0f121a] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 cursor-pointer"
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
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-[#0f121a] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-[#1b212f] pt-5">
                  <button
                    type="button"
                    onClick={() => setShowAddLog(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-7 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs transition cursor-pointer shadow-lg shadow-red-950/50"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}

            {logsError && (
              <p className="text-xs text-red-500">Could not load condition logs: {logsError}</p>
            )}

            {/* Condition Logs Table */}
            <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
              <table className="w-full text-left min-w-[780px] text-xs">
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
                            log.condition === "GOOD"
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/50"
                              : log.condition === "POOR"
                              ? "bg-red-950/40 text-red-400 border-red-800/50"
                              : "bg-amber-950/40 text-amber-400 border-amber-800/50"
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
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB: LOST / MISSING                                         */}
        {/* ============================================================== */}
        {subTab === "lost_items" && (
          <LostItemsPanel equipment={inventoryList} onChanged={loadInventory} />
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 3: BOOKING CALENDAR                                    */}
        {/* ============================================================== */}
        {subTab === "booking_calendar" && (
          <div className="space-y-6">
            {/* Calendar Box Container */}
            <div className="border border-[#1b212f] rounded-2xl bg-[#090b10] overflow-hidden">
              {/* Header Navigation */}
              <div className="flex items-center justify-between p-6 border-b border-[#1b212f]">
                <button
                  type="button"
                  onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))}
                  className="p-1.5 text-neutral-500 hover:text-white transition cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-widest">
                  <CalendarIcon size={18} className="text-red-600" />
                  {monthLabel}
                </h2>
                <button
                  type="button"
                  onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))}
                  className="p-1.5 text-neutral-500 hover:text-white transition cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-[#1b212f] text-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest py-3 bg-[#0b0e14]">
                <div>SUN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
              </div>

              {bookingsError && (
                <p className="p-4 text-xs text-red-500">Could not load bookings: {bookingsError}</p>
              )}

              {/* Calendar cells */}
              <div className="grid grid-cols-7 text-xs text-neutral-400">
                {Array.from({ length: cellCount }).map((_, i) => {
                  const day = i - firstWeekday + 1;
                  const isCurrentMonth = day >= 1 && day <= daysInMonth;
                  const cellEvents = isCurrentMonth ? upcomingBookings.filter((b) => b.day === day) : [];

                  return (
                    <div
                      key={i}
                      className={`min-h-[110px] border-r border-b border-[#1b212f] p-2.5 ${
                        !isCurrentMonth ? "bg-[#06080c] opacity-30" : "bg-[#090b10]"
                      }`}
                    >
                      {isCurrentMonth && (
                        <span className="text-white font-bold text-xs font-mono">{day}</span>
                      )}
                      <div className="mt-2 space-y-1">
                        {cellEvents.slice(0, 3).map((evt) => (
                          <div key={evt.id} className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${evt.color} shrink-0`}></div>
                            <span className="text-[8px] text-neutral-300 truncate leading-none">
                              {evt.name}
                            </span>
                          </div>
                        ))}
                        {cellEvents.length > 3 && (
                          <span className="text-[8px] text-neutral-500">+{cellEvents.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Color Legend */}
              <div className="p-6 border-t border-[#1b212f] space-y-6">
                <div className="flex items-center gap-6 text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div> Livestream
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> Projector
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div> Lights & Sounds
                  </span>
                </div>

                {/* Upcoming Bookings Table */}
                <div className="border border-[#1b212f] rounded-2xl overflow-hidden bg-[#0b0e14]">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 p-4 border-b border-[#1b212f] flex items-center gap-2 bg-[#090b10]">
                    <CalendarIcon size={14} className="text-red-600" />
                    Upcoming Bookings This Month
                  </h3>

                  <div className="divide-y divide-[#141824]">
                    {upcomingBookings.length === 0 && (
                      <p className="p-4 text-xs text-neutral-500">No bookings this month.</p>
                    )}
                    {upcomingBookings.map((bkg, index) => (
                      <div
                        key={index}
                        className="p-4 flex items-center justify-between hover:bg-[#121622] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${bkg.color}`}></div>
                          <div>
                            <p className="text-xs font-bold text-white">{bkg.name}</p>
                            <p className="text-[10px] text-neutral-500">{bkg.client}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span
                            className={`${bkg.tagBg} text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded`}
                          >
                            {bkg.type}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {bkg.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 4: SCAN EQUIPMENT (FR-10)                              */}
        {/* ============================================================== */}
        {subTab === "scan_equipment" && (
          <div className="space-y-6">
            <div className="border border-[#1b212f] rounded-2xl bg-[#090b10] p-6 md:p-10 flex flex-col items-center text-center space-y-6">
              {/* Idle state — nothing scanned yet, camera not active */}
              {!isScanning && !scannedEquipmentId && !scanResult && (
                <>
                  <ScanLine size={48} className="text-red-600" />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1">
                      Scan Equipment QR Code
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Point your camera at the QR code attached to the equipment to check it in or out.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={startScanner}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider py-3 px-8 rounded-xl transition cursor-pointer shadow-lg shadow-red-950/40"
                  >
                    Start Scanning
                  </button>
                </>
              )}

              {/* Active camera view */}
              {isScanning && (
                <>
                  <div id="qr-reader" ref={scannerRef} className="w-full max-w-sm rounded-xl overflow-hidden border border-[#1b212f]" />
                  <p className="text-xs text-neutral-500">Point the camera at a QR code...</p>
                  <button
                    type="button"
                    onClick={stopScanner}
                    className="border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              )}

              {/* Scanned, awaiting checkout/checkin choice */}
              {scannedEquipmentId && !scanResult && (
                <>
                  <CheckCircle2 size={40} className="text-emerald-500" />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1">
                      QR Code Scanned
                    </h3>
                    <p className="text-xs text-neutral-300">{equipmentName(scannedEquipmentId)}</p>
                    <p className="text-xs text-neutral-500 mt-1">What would you like to do?</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => submitScan("checkout")}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider py-3 px-6 rounded-xl transition cursor-pointer shadow-lg"
                    >
                      Check Out
                    </button>
                    <button
                      type="button"
                      onClick={() => submitScan("checkin")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider py-3 px-6 rounded-xl transition cursor-pointer shadow-lg"
                    >
                      Check In
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={resetScan}
                    className="text-[11px] text-neutral-500 hover:text-white transition cursor-pointer"
                  >
                    Scan a different item
                  </button>
                </>
              )}

              {/* Result — success */}
              {scanResult && !scanResult.error && (
                <>
                  <CheckCircle2 size={40} className="text-emerald-500" />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1">
                      {scanResult.action === "checkout" ? "Checked Out" : "Checked In"}
                    </h3>
                    <p className="text-xs text-neutral-300">{scanResult.equipment_name}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Available now: {scanResult.new_available_quantity}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetScan}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider py-3 px-8 rounded-xl transition cursor-pointer shadow-lg shadow-red-950/40"
                  >
                    Scan Another
                  </button>
                </>
              )}

              {/* Result — error */}
              {scanResult && scanResult.error && (
                <>
                  <XCircle size={40} className="text-red-500" />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1">
                      Scan Failed
                    </h3>
                    <p className="text-xs text-neutral-500">{scanResult.error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={resetScan}
                    className="border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-xl transition cursor-pointer"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>

            {/* Recent scans */}
            <div className="border border-[#1b212f] rounded-2xl bg-[#090b10] overflow-hidden">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 p-4 border-b border-[#1b212f] bg-[#0b0e14]">
                Recent Scans
              </h3>
              {recentScans.length === 0 ? (
                <p className="p-4 text-xs text-neutral-500">No scans yet.</p>
              ) : (
                <div className="divide-y divide-[#141824]">
                  {recentScans.map((s) => (
                    <div key={s.id} className="p-4 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{equipmentName(s.equipment_id)}</span>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                            s.action === "checkout"
                              ? "bg-blue-950/40 text-blue-400 border-blue-800/50"
                              : "bg-emerald-950/40 text-emerald-400 border-emerald-800/50"
                          }`}
                        >
                          {s.action === "checkout" ? "Checked out" : "Checked in"}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-500">
                          {new Date(s.scanned_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentChecklist;
