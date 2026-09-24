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
  SlidersHorizontal,
  Package,
  ScanLine,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

const API_URL = import.meta.env.VITE_API_URL;

const EquipmentChecklist = () => {
  const [subTab, setSubTab] = useState("inventory"); // "inventory" | "condition_logs" | "booking_calendar" | "scan_equipment"
  const [showAddLog, setShowAddLog] = useState(false);

  // Filters
  const [inventorySearch, setInventorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [logSearch, setLogSearch] = useState("");

  // Form State for Condition Logs
  const [newItemName, setNewItemName] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newCondition, setNewCondition] = useState("good");
  const [newComment, setNewComment] = useState("");

  // FR-10 Scan Equipment State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); // { equipment_name, action, new_available_quantity } or { error }
  const [scannedEquipmentId, setScannedEquipmentId] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Master Inventory Items (mock data — not yet wired to live API on this page)
  const [inventoryList] = useState([
    { id: 1, name: "Sony FX3 Camera", category: "LIVESTREAM", availability: "4/5", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 2, name: "Cameras", category: "LIVESTREAM", availability: "2/3", status: "MAINTENANCE", lastCheck: "2026-05-19", statusColor: "amber" },
    { id: 3, name: "Obsbot Camera", category: "LIVESTREAM", availability: "1/2", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 4, name: "TriCaster Video Production System", category: "LIVESTREAM", availability: "2/2", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 5, name: "TriCaster Controller", category: "LIVESTREAM", availability: "1/1", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 6, name: "Switcher", category: "LIVESTREAM", availability: "3/4", status: "DEPLOYED", lastCheck: "2026-05-15", statusColor: "blue" },
    { id: 7, name: "Recorder", category: "LIVESTREAM", availability: "2/2", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 8, name: "Communication Sets", category: "LIVESTREAM", availability: "3/4", status: "DEPLOYED", lastCheck: "2026-05-15", statusColor: "blue" },
    { id: 9, name: "Monitors", category: "LIVESTREAM", availability: "2/3", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 10, name: "Epson Projector", category: "PROJECTOR", availability: "2/3", status: "DEPLOYED", lastCheck: "2026-05-15", statusColor: "blue" },
    { id: 11, name: "Standing", category: "PROJECTOR", availability: "2/2", status: "DEPLOYED", lastCheck: "2026-05-15", statusColor: "blue" },
    { id: 12, name: "Camera Stand / Tripod", category: "PROJECTOR", availability: "3/4", status: "DEPLOYED", lastCheck: "2026-05-15", statusColor: "blue" },
    { id: 13, name: "Screen", category: "PROJECTOR", availability: "1/2", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 14, name: "Epson Projectors", category: "PROJECTOR", availability: "2/2", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 15, name: "Projector Stands", category: "PROJECTOR", availability: "1/2", status: "DEPLOYED", lastCheck: "2026-05-15", statusColor: "blue" },
    { id: 16, name: "Projector Screens", category: "PROJECTOR", availability: "1/1", status: "DEPLOYED", lastCheck: "2026-05-15", statusColor: "blue" },
    { id: 17, name: "Laptop", category: "PROJECTOR", availability: "1/1", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 18, name: "Wireless Clicker", category: "PROJECTOR", availability: "2/2", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 19, name: "Wireless Data Transceiver", category: "PROJECTOR", availability: "2/2", status: "DEPLOYED", lastCheck: "2026-05-15", statusColor: "blue" },
    { id: 20, name: "Projector Mount Clamps", category: "PROJECTOR", availability: "4/4", status: "DEPLOYED", lastCheck: "2026-05-15", statusColor: "blue" },
    { id: 21, name: "HDMI Cable (15m/20m)", category: "CABLE", availability: "2/3", status: "DEPLOYED", lastCheck: "2026-05-19", statusColor: "blue" },
    { id: 22, name: "Power Extension Cables", category: "CABLE", availability: "4/5", status: "DEPLOYED", lastCheck: "2026-05-19", statusColor: "blue" },
    { id: 23, name: "DMX Cable (10m)", category: "CABLE", availability: "2/3", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 24, name: "XLR Audio Cable (5m/10m)", category: "CABLE", availability: "6/8", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 25, name: "CAT6 Network Cables", category: "CABLE", availability: "2/2", status: "DEPLOYED", lastCheck: "2026-05-15", statusColor: "blue" },
    { id: 26, name: "SDI Cables (20m)", category: "CABLE", availability: "2/3", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 27, name: "QSC Subwoofer KS118", category: "AUDIO", availability: "2/2", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 28, name: "QSC Speakers", category: "AUDIO", availability: "1/2", status: "DEPLOYED", lastCheck: "2026-05-17", statusColor: "blue" },
    { id: 29, name: "Speaker Stand", category: "AUDIO", availability: "2/2", status: "DEPLOYED", lastCheck: "2026-05-17", statusColor: "blue" },
    { id: 30, name: "Mic Stand", category: "AUDIO", availability: "1/2", status: "DEPLOYED", lastCheck: "2026-05-17", statusColor: "blue" },
    { id: 31, name: "DM3 Digital Console", category: "AUDIO", availability: "1/1", status: "DEPLOYED", lastCheck: "2026-05-18", statusColor: "blue" },
    { id: 32, name: "Sennheiser Wireless Mic", category: "AUDIO", availability: "2/3", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 33, name: "Tigertouch Light Controller", category: "LIGHTING", availability: "1/1", status: "AVAILABLE", lastCheck: "2026-05-18", statusColor: "emerald" },
    { id: 34, name: "LED Par", category: "LIGHTING", availability: "8/12", status: "DEPLOYED", lastCheck: "2026-05-17", statusColor: "blue" },
    { id: 35, name: "Moving Head Light", category: "LIGHTING", availability: "2/4", status: "DEPLOYED", lastCheck: "2026-05-17", statusColor: "blue" },
  ]);

  // Condition Logs List
  const [logsList, setLogsList] = useState([
    {
      id: 1,
      item: "Cameras",
      condition: "GOOD",
      comment: "Sensor cleaned, white balance calibrated. All functions normal.",
      staff: "Juan dela Cruz",
      date: "2026-05-20",
      time: "09:15",
    },
    {
      id: 2,
      item: "HDMI Cables",
      condition: "FAIR",
      comment: "Minor fraying on 3 cables. Recommend replacement before",
      staff: "Maria Santos",
      date: "2026-05-19",
      time: "14:30",
    },
    {
      id: 3,
      item: "Tigertouch Light Controller",
      condition: "GOOD",
      comment: "Firmware updated to v3.2. All DMX channels tested and working.",
      staff: "Jose Reyes",
      date: "2026-05-18",
      time: "11:00",
    },
    {
      id: 4,
      item: "QSC Speakers",
      condition: "GOOD",
      comment: "Full-range test performed at venue. Output levels optimal.",
      staff: "Ana Lim",
      date: "2026-05-17",
      time: "16:45",
    },
    {
      id: 5,
      item: "Switcher",
      condition: "FAIR",
      comment: "Input channel 3 intermittently dropping. Scheduled for service.",
      staff: "Juan dela Cruz",
      date: "2026-05-15",
      time: "10:20",
    },
  ]);

  // Upcoming Bookings for Calendar Tab
  const upcomingBookings = [
    { name: "Tech Corp Annual Conference", client: "Tech Corp Inc.", type: "Livestream", color: "bg-red-600", tagBg: "bg-red-600", date: "2026-06-05" },
    { name: "SM Prom Night", client: "SM Group", type: "Lights & Sounds", color: "bg-purple-500", tagBg: "bg-purple-600", date: "2026-06-06" },
    { name: "BDO Seminar", client: "BDO Unibank", type: "Projector", color: "bg-blue-500", tagBg: "bg-blue-600", date: "2026-06-07" },
    { name: "Church Worship Night", client: "CCF Manila", type: "Lights & Sounds", color: "bg-purple-500", tagBg: "bg-purple-600", date: "2026-06-11" },
    { name: "Product Launch", client: "Globe Telecom", type: "Livestream", color: "bg-red-600", tagBg: "bg-red-600", date: "2026-06-12" },
    { name: "Wedding: Santos", client: "Maria Santos", type: "Livestream", color: "bg-red-600", tagBg: "bg-red-600", date: "2026-06-13" },
    { name: "Training Workshop", client: "Accenture PH", type: "Projector", color: "bg-blue-500", tagBg: "bg-blue-600", date: "2026-06-14" },
    { name: "Awards Ceremony", client: "PLDT", type: "Lights & Sounds", color: "bg-purple-500", tagBg: "bg-purple-600", date: "2026-06-18" },
    { name: "Festival Night", client: "Ayala Corp", type: "Lights & Sounds", color: "bg-purple-500", tagBg: "bg-purple-600", date: "2026-06-19" },
    { name: "Gaming Tournament", client: "Global E-Sports", type: "Livestream", color: "bg-red-600", tagBg: "bg-red-600", date: "2026-06-20" },
    { name: "Graduation Ceremony", client: "UST Manila", type: "Projector", color: "bg-blue-500", tagBg: "bg-blue-600", date: "2026-06-21" },
    { name: "Corporate Gala", client: "Jollibee Corp", type: "Lights & Sounds", color: "bg-purple-500", tagBg: "bg-purple-600", date: "2026-06-25" },
    { name: "Forum & Summit", client: "DTI Philippines", type: "Livestream", color: "bg-red-600", tagBg: "bg-red-600", date: "2026-06-27" },
    { name: "Company Townhall", client: "Meralco", type: "Projector", color: "bg-blue-500", tagBg: "bg-blue-600", date: "2026-06-28" },
  ];

  // Form Submission
  const handleAddLogSubmit = (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newStaffName.trim()) return;

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

    const newEntry = {
      id: Date.now(),
      item: newItemName.trim(),
      condition: newCondition.toUpperCase(),
      comment: newComment.trim() || "Inspection complete.",
      staff: newStaffName.trim(),
      date: dateStr,
      time: timeStr,
    };

    setLogsList((prev) => [newEntry, ...prev]);
    setShowAddLog(false);
    setNewItemName("");
    setNewStaffName("");
    setNewCondition("good");
    setNewComment("");
  };

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
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setScanResult({ error: data.detail || "Scan failed." });
        return;
      }

      setScanResult(data);
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

  // Filter computations
  const filteredInventory = inventoryList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesCat = selectedCategory === "All" || item.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCat;
  });

  const filteredLogs = logsList.filter(
    (l) =>
      l.item.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.staff.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      {/* Main Panel Box */}
      <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-10 space-y-6">
        <h1 className="text-2xl font-black uppercase tracking-wide text-white">
          Equipment Inventory
        </h1>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-[#1b212f] text-xs font-black uppercase tracking-wider">
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
                <h3 className="text-3xl font-black text-white">218</h3>
              </div>
              <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">
                  Available
                </p>
                <h3 className="text-3xl font-black text-emerald-400">198</h3>
              </div>
              <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
                  Deployed
                </p>
                <h3 className="text-3xl font-black text-blue-400">20</h3>
              </div>
              <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">
                  Maintenance
                </p>
                <h3 className="text-3xl font-black text-amber-400">20</h3>
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

            {/* Inventory Data Table */}
            <div className="overflow-x-auto border border-[#1b212f] rounded-2xl bg-[#090b10]">
              <table className="w-full text-left min-w-[820px] text-xs">
                <thead>
                  <tr className="border-b border-[#1b212f] text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-[#0b0e14]">
                    <th className="py-4 pl-6">Equipment</th>
                    <th className="py-4">Category</th>
                    <th className="py-4">Availability</th>
                    <th className="py-4">Status</th>
                    <th className="py-4">Last Inspection</th>
                    <th className="py-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141824]">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-[#121622] transition-colors">
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

                      <td className="py-4 font-mono font-bold text-neutral-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>{item.availability}</span>
                        </span>
                      </td>

                      <td className="py-4">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                            item.statusColor === "emerald"
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/50"
                              : item.statusColor === "blue"
                              ? "bg-blue-950/40 text-blue-400 border-blue-800/50"
                              : "bg-amber-950/40 text-amber-400 border-amber-800/50"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4 font-mono text-neutral-400 text-[11px]">
                        {item.lastCheck}
                      </td>

                      <td className="py-4 pr-6 text-right">
                        <button
                          type="button"
                          className="text-[11px] font-bold text-neutral-400 hover:text-white transition cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              <span className="text-[10px] text-neutral-500 font-mono">0 from staff</span>
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
                    <input
                      type="text"
                      required
                      placeholder="e.g. LED Bar Unit 3"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full bg-[#0f121a] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Staff Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Juan dela Cruz"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      className="w-full bg-[#0f121a] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                    />
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
                  className="p-1.5 text-neutral-500 hover:text-white transition cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-widest">
                  <CalendarIcon size={18} className="text-red-600" />
                  JUNE 2026
                </h2>
                <button
                  type="button"
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

              {/* 35 Calendar Cells */}
              <div className="grid grid-cols-7 grid-rows-5 text-xs text-neutral-400">
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 1; // Align 1st on Monday
                  const isCurrentMonth = day >= 1 && day <= 30;

                  let cellEvents = [];
                  if (day === 5) cellEvents = [{ name: "Tech Corp Annual Con", color: "bg-red-600" }];
                  if (day === 6) cellEvents = [{ name: "SM Prom Night", color: "bg-purple-500" }];
                  if (day === 7) cellEvents = [{ name: "BDO Seminar", color: "bg-blue-500" }];
                  if (day === 11) cellEvents = [{ name: "Church Worship Night", color: "bg-purple-500" }];
                  if (day === 12) cellEvents = [{ name: "Product Launch", color: "bg-red-600" }];
                  if (day === 13) cellEvents = [{ name: "Wedding: Santos", color: "bg-red-600" }];
                  if (day === 14) cellEvents = [{ name: "Training Workshop", color: "bg-blue-500" }];
                  if (day === 18) cellEvents = [{ name: "Awards Ceremony", color: "bg-purple-500" }];
                  if (day === 19) cellEvents = [{ name: "Festival Night", color: "bg-purple-500" }];
                  if (day === 20) cellEvents = [{ name: "Gaming Tournament", color: "bg-red-600" }];
                  if (day === 21) cellEvents = [{ name: "Graduation Ceremony", color: "bg-blue-500" }];
                  if (day === 25) cellEvents = [{ name: "Corporate Gala", color: "bg-purple-500" }];
                  if (day === 27) cellEvents = [{ name: "Forum & Summit", color: "bg-red-600" }];
                  if (day === 28) cellEvents = [{ name: "Company Townhall", color: "bg-blue-500" }];

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
                        {cellEvents.map((evt, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${evt.color} shrink-0`}></div>
                            <span className="text-[8px] text-neutral-300 truncate leading-none">
                              {evt.name}
                            </span>
                          </div>
                        ))}
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
                    <p className="text-xs text-neutral-500">Equipment ID: {scannedEquipmentId}</p>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentChecklist;
