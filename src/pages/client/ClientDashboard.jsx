import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  CalendarPlus,
  BookOpen,
  CreditCard,
  User,
  Sun,
  Moon,
  LogOut,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  MessageSquare,
  MapPin,
  Check,
  Edit2,
  X,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import logoImage from "../../assets/livestream-logo.png";
import BillingPayments from "./BillingPayments";
import ClientProfile from "./ClientProfile";
import ChatbotModal from "./ChatbotModal";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatbotDismissed, setIsChatbotDismissed] = useState(false);

  // Dynamic user data state 
  const [userData, setUserData] = useState({
    id: null,
    fullName: "",
    firstName: "",
    email: "",
    initials: "--",
  });

  // Edit Equipment Modal States
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState(null);
  const [modalEquipments, setModalEquipments] = useState([]);
  const [updatingEquipment, setUpdatingEquipment] = useState(false);

  // Available equipment list inside the edit modal
  const editableInventory = [
    { id: "cam-4k", name: "4K Cinema Camera", category: "Cameras", price: 15000 },
    { id: "cam-pro", name: "Professional HD Camera", category: "Cameras", price: 10000 },
    { id: "cam-basic", name: "Basic HD Camera", category: "Cameras", price: 5000 },
    { id: "cam-ptz", name: "PTZ Remote Camera", category: "Cameras", price: 8000 },
    { id: "snd-mixer", name: "DM3 Digital Audio Mixer", category: "Audio", price: 2500 },
    { id: "snd-qsc", name: "QSC Active Speakers (Pair)", category: "Audio", price: 4500 },
    { id: "snd-mic", name: "Wireless Handheld Mics (Set of 4)", category: "Audio", price: 2000 },
  ];

  // Default fallback bookings matching the My Bookings screenshot
  const [bookingsList, setBookingsList] = useState([
    {
      id: "b-001",
      event_name: "Annual Company Conference",
      event_type: "Conference",
      status: "confirmed",
      start_date: "2026-06-15",
      time: "09:00 AM - 6:00 PM",
      venue: "SMX Convention Center",
      budget: "₱100,000+",
      services: ["LIVE EVENT STREAMING", "VIDEO PRODUCTION", "AUDIO ENGINEERING"],
      submitted_date: "2026-05-10",
      equipment: ["4K Cinema Camera", "Professional HD Camera"],
      total_price: 80000,
    },
    {
      id: "b-002",
      event_name: "Product Launch Webinar",
      event_type: "Webinar",
      status: "pencil_booked",
      start_date: "2026-07-20",
      time: "2:00 PM - 4:00 PM",
      venue: "Virtual",
      budget: "₱25,000 - ₱50,000",
      services: ["WEBINAR PRODUCTION", "VIRTUAL EVENTS"],
      submitted_date: "2026-05-14",
      equipment: ["Basic HD Camera"],
      total_price: 35000,
    },
    {
      id: "b-003",
      event_name: "Team Building Event",
      event_type: "Corporate",
      status: "completed",
      start_date: "2026-05-28",
      time: "10:00 AM - 5:00 PM",
      venue: "Tagaytay",
      budget: "₱50,000 - ₱100,000",
      services: ["LIVE EVENT STREAMING", "VIDEO PRODUCTION"],
      submitted_date: "2026-04-20",
      equipment: ["Professional HD Camera"],
      total_price: 65000,
    },
    {
      id: "b-004",
      event_name: "Marketing Workshop",
      event_type: "Seminar",
      status: "draft",
      start_date: "2026-08-10",
      time: "9:00 AM - 12:00 PM",
      venue: "BGC Office",
      budget: "₱10,000 - ₱25,000",
      services: ["AUDIO ENGINEERING"],
      submitted_date: "2026-05-20",
      equipment: ["Basic HD Camera"],
      total_price: 18000,
    },
  ]);

  // Fetch logged-in user details from Supabase Auth and database
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const metadata = user.user_metadata || {};
        let fullName =
          metadata.full_name ||
          metadata.name ||
          (metadata.first_name
            ? `${metadata.first_name} ${metadata.last_name || ""}`.trim()
            : "");

        if (!fullName) {
          const { data: dbUser } = await supabase
            .from("users")
            .select("full_name, first_name, last_name")
            .eq("id", user.id)
            .maybeSingle();

          if (dbUser) {
            fullName =
              dbUser.full_name ||
              `${dbUser.first_name || ""} ${dbUser.last_name || ""}`.trim();
          }
        }

        if (!fullName) {
          fullName = user.email ? user.email.split("@")[0] : "Client";
        }

        const firstName = fullName.split(" ")[0];

        let initials = "U";
        const nameParts = fullName.trim().split(" ").filter(Boolean);
        if (nameParts.length >= 2) {
          initials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
        } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
          initials = nameParts[0].slice(0, 2).toUpperCase();
        } else if (nameParts.length === 1) {
          initials = nameParts[0][0].toUpperCase();
        }

        setUserData({
          id: user.id,
          fullName,
          firstName,
          email: user.email || "",
          initials,
        });

        // Try fetching user's actual bookings from database
        try {
          const { data: dbBookings } = await supabase
            .from("bookings")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (dbBookings && dbBookings.length > 0) {
            const formatted = dbBookings.map((b) => ({
              id: b.id,
              event_name: b.event_name || "Untitled Event",
              event_type: b.event_type || "Event",
              status: (b.status || "pending").toLowerCase(),
              start_date: b.start_date || "2026-06-15",
              time: b.time || "09:00 AM - 05:00 PM",
              venue: b.venue || "SMX Convention Center",
              budget: b.budget || "₱25,000 - ₱50,000",
              services: Array.isArray(b.services) && b.services.length > 0 ? b.services : ["LIVE EVENT STREAMING"],
              submitted_date: b.created_at ? b.created_at.split("T")[0] : "2026-05-10",
              equipment: Array.isArray(b.equipment) ? b.equipment : ["Professional HD Camera"],
              total_price: b.total_price || 80000,
            }));
            setBookingsList(formatted);
          }
        } catch (e) {
          // Keep default fallback bookings if query fails
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Open Edit Equipment Modal
  const handleOpenEditModal = (booking) => {
    setSelectedBookingForEdit(booking);
    setModalEquipments(booking.equipment || []);
  };

  // Toggle Equipment checkbox inside modal
  const toggleModalEquipment = (name) => {
    setModalEquipments((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  // Save changes from Edit Equipment Modal
  const handleSaveEquipmentChanges = async () => {
    if (!selectedBookingForEdit) return;
    setUpdatingEquipment(true);

    try {
      const newTotal = modalEquipments.reduce((acc, currName) => {
        const item = editableInventory.find((i) => i.name === currName);
        return acc + (item ? item.price : 8000);
      }, 40000);

      // Attempt updating Supabase
      await supabase
        .from("bookings")
        .update({ equipment: modalEquipments })
        .eq("id", selectedBookingForEdit.id);

      // Update state
      setBookingsList((prev) =>
        prev.map((b) =>
          b.id === selectedBookingForEdit.id
            ? { ...b, equipment: modalEquipments, total_price: newTotal }
            : b
        )
      );
      setSelectedBookingForEdit(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingEquipment(false);
    }
  };

  // Computed Counts
  const totalCount = bookingsList.length;
  const confirmedCount = bookingsList.filter((b) => b.status === "confirmed").length;
  const pendingOrPencilCount = bookingsList.filter(
    (b) => b.status === "pencil_booked" || b.status === "pending"
  ).length;
  const draftsCount = bookingsList.filter((b) => b.status === "draft").length;

  const navItems = [
    { id: "overview", label: "OVERVIEW", icon: Home },
    { id: "book-service", label: "BOOK SERVICE", icon: CalendarPlus, isAction: true },
    { id: "my-bookings", label: "MY BOOKINGS", icon: BookOpen },
    { id: "billing-payments", label: "BILLING & PAYMENTS", icon: CreditCard },
    { id: "my-profile", label: "MY PROFILE", icon: User },
  ];

  return (
    <div className="min-h-screen font-['Montserrat',sans-serif] bg-[#090b10] text-white flex flex-col">
      {/* --- TOP NAVBAR --- */}
      <header className="w-full bg-[#090b10] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/client-main")}
          >
            <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-neutral-700 text-sm">|</span>
          <span className="text-xs font-bold text-neutral-400 tracking-[0.16em] uppercase">
            Client Portal
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-neutral-400 hover:text-white transition cursor-pointer"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* User Profile Info with Dynamic Initials */}
          <div className="flex items-center gap-3.5">
            <div className="text-right">
              <p className="text-xs font-bold leading-tight text-white capitalize">
                {userData.fullName || "Loading..."}
              </p>
              <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                {userData.email}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#141823] border border-neutral-800 flex items-center justify-center font-bold text-xs text-red-500 shadow-inner">
              {userData.initials}
            </div>
          </div>

          <button
  onClick={() => setShowLogoutModal(true)}
  className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-500 transition cursor-pointer"
>
  <LogOut size={15} />
  <span>LOGOUT</span>
</button>
        </div>
      </header>

      {/* Red Accent Line below Header */}
      <div className="h-[1.5px] w-full bg-red-600"></div>

      {/* --- MAIN DASHBOARD LAYOUT --- */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto px-8 py-8 gap-8">
        {/* --- LEFT SIDEBAR --- */}
        <aside className="w-60 shrink-0 space-y-2.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isAction) {
                    navigate("/client/booking");
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#ff0000] text-white shadow-lg shadow-red-600/30"
                    : "bg-[#0f121a]/80 text-neutral-400 hover:text-white hover:bg-[#151924] border border-[#1b212f]"
                }`}
              >
                <item.icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* --- RIGHT CONTENT VIEW --- */}
        <main className="flex-1">
          {/* ==================== 1. TAB: OVERVIEW ==================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-wide text-white">
                  Welcome Back, {userData.firstName || "Client"}
                </h1>
                <p className="text-neutral-400 text-xs mt-1">
                  Here's an overview of your events and account activity.
                </p>
              </div>

              {/* Upper Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-5 min-h-[110px]">
                  <div className="w-14 h-14 rounded-2xl bg-[#141b2b] border border-[#202b45] text-blue-500 flex items-center justify-center shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black leading-none text-white">2</h2>
                    <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mt-1.5">
                      Active Bookings
                    </p>
                  </div>
                </div>

                <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-5 min-h-[110px]">
                  <div className="w-14 h-14 rounded-2xl bg-[#122320] border border-[#1b3a33] text-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black leading-none text-white">5</h2>
                    <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mt-1.5">
                      Past Events
                    </p>
                  </div>
                </div>

                <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex items-center gap-5 min-h-[110px]">
                  <div className="w-14 h-14 rounded-2xl bg-[#261f18] border border-[#3f3020] text-amber-500 flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black leading-none text-white">1</h2>
                    <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mt-1.5">
                      Pending Quotes
                    </p>
                  </div>
                </div>
              </div>

              {/* Lower Grid: Recent Bookings & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      Recent Bookings
                    </h3>
                    <button
                      onClick={() => setActiveTab("my-bookings")}
                      className="text-xs font-bold text-red-600 hover:text-red-500 transition cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-[#0b0e14] border border-[#1a202e] rounded-xl p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">
                          Corporate Webinar 2026
                        </h4>
                        <span className="bg-[#0e241c] text-[#22c55e] border border-[#144231] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Confirmed
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 -mt-1 font-mono">BK-2026-001</p>
                      <div className="flex items-center gap-5 text-xs text-neutral-400 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-neutral-500" /> Aug 15, 2026
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Video size={13} className="text-neutral-500" /> Webinar
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#0b0e14] border border-[#1a202e] rounded-xl p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">
                          Annual Product Launch
                        </h4>
                        <span className="bg-[#2a1d13] text-[#f59e0b] border border-[#482d18] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Pending
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 -mt-1 font-mono">BK-2026-002</p>
                      <div className="flex items-center gap-5 text-xs text-neutral-400 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-neutral-500" /> Oct 05, 2026
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Video size={13} className="text-neutral-500" /> Live Stream
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white mb-5">
                    Quick Actions
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                      onClick={() => setActiveTab("my-bookings")}
                      className="group bg-[#0b0e14] border border-[#1a202e] hover:border-red-600/60 p-6 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer min-h-[120px]"
                    >
                      <FileText size={20} className="text-red-600 mb-2 transition-transform group-hover:scale-110" />
                      <span className="text-xs font-bold text-white block">My Bookings</span>
                      <span className="text-[10px] text-neutral-500 block mt-1">
                        View and manage events
                      </span>
                    </button>

                    <button
                      onClick={() => navigate("/client/booking")}
                      className="group bg-[#0b0e14] border border-[#1a202e] hover:border-red-600/60 p-6 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer min-h-[120px]"
                    >
                      <Calendar size={20} className="text-red-600 mb-2 transition-transform group-hover:scale-110" />
                      <span className="text-xs font-bold text-white block">Book Now</span>
                      <span className="text-[10px] text-neutral-500 block mt-1">
                        Schedule your next livestream
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveTab("billing-payments")}
                    className="w-full group bg-[#0b0e14] border border-[#1a202e] hover:border-red-600/60 p-5 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer"
                  >
                    <CreditCard size={20} className="text-red-600 mb-1.5 transition-transform group-hover:scale-110" />
                    <span className="text-xs font-bold text-white block">
                      Billing & Payments
                    </span>
                    <span className="text-[10px] text-neutral-500 block mt-1">
                      Manage invoices and pay online
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 2. TAB: MY BOOKINGS ==================== */}
          {activeTab === "my-bookings" && (
            <div className="w-full space-y-6">
              <div>
                <h1 className="text-3xl font-black tracking-wide uppercase text-white mb-1">
                  My Bookings
                </h1>
                <p className="text-xs text-neutral-400">
                  Track and manage your livestream service bookings
                </p>
              </div>

              {/* Status Guide */}
              <div className="bg-[#0f121a] border border-[#1b212f] p-5 rounded-2xl">
                <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-3">
                  Booking Status Guide
                </p>
                <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div> Confirmed
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div> Pending
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div> Pencil Book
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-500"></div> Draft
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> Completed
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-800"></div> Cancelled
                  </span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-black text-white">{totalCount}</p>
                </div>

                <div className="bg-[#0f121a] border border-[#1b212f] border-l-4 border-l-red-600 rounded-2xl p-5">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">
                    Confirmed
                  </p>
                  <p className="text-2xl font-black text-red-500">{confirmedCount}</p>
                </div>

                <div className="bg-[#0f121a] border border-[#1b212f] border-l-4 border-l-amber-500 rounded-2xl p-5">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">
                    Pencil / Pending
                  </p>
                  <p className="text-2xl font-black text-amber-500">{pendingOrPencilCount}</p>
                </div>

                <div className="bg-[#0f121a] border border-[#1b212f] border-l-4 border-l-neutral-600 rounded-2xl p-5">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">
                    Drafts
                  </p>
                  <p className="text-2xl font-black text-neutral-400">{draftsCount}</p>
                </div>
              </div>

              {/* Bookings List Cards */}
              <div className="space-y-4">
                {bookingsList.map((booking) => (
                  <div
                    key={booking.id}
                    className={`bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-7 transition-all ${
                      booking.status === "draft" ? "opacity-75 hover:opacity-100" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                      <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">
                          {booking.event_name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#141926] text-neutral-300 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#232b3d]">
                            {booking.event_type}
                          </span>
                          {booking.status === "pencil_booked" && (
                            <span className="bg-amber-950/30 text-amber-500 border border-amber-900/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                              Tentative Hold
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        {booking.status === "confirmed" && (
                          <span className="bg-red-950/40 text-red-500 border border-red-800/50 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            Confirmed
                          </span>
                        )}
                        {booking.status === "pencil_booked" && (
                          <span className="bg-amber-950/40 text-amber-500 border border-amber-800/50 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            Pencil Book
                          </span>
                        )}
                        {booking.status === "completed" && (
                          <span className="bg-blue-950/40 text-blue-500 border border-blue-800/50 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            Completed
                          </span>
                        )}
                        {booking.status === "draft" && (
                          <span className="bg-neutral-800 text-neutral-400 border border-neutral-700 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-[#181f2e] mb-5">
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          <Calendar size={12} className="text-red-500" /> Date
                        </p>
                        <p className="text-sm font-bold text-white">{booking.start_date}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          <Clock size={12} className="text-red-500" /> Time
                        </p>
                        <p className="text-sm font-bold text-white">{booking.time}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          <MapPin size={12} className="text-red-500" /> Location
                        </p>
                        <p className="text-sm font-bold text-white truncate">{booking.venue}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          <span className="text-red-500 font-bold">₱</span> Budget
                        </p>
                        <p className="text-sm font-bold text-white">{booking.budget}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">
                        Services:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {booking.services.map((srv, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold border border-[#20293d] bg-[#090b10] rounded-md px-3 py-1 text-neutral-300 uppercase tracking-wider"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                      <p className="text-xs text-neutral-500">
                        {booking.status === "draft" ? "Last Saved:" : "Submitted:"} {booking.submitted_date}
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                        <button
                          type="button"
                          className="flex-1 sm:flex-none bg-[#ff0000] hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer shadow-md shadow-red-600/30"
                        >
                          View Details
                        </button>

                        {/* Edit Package button opens Edit Equipment Modal */}
                        {booking.status !== "completed" && (
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(booking)}
                            className="flex-1 sm:flex-none bg-[#1442bb] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Edit2 size={13} />
                            <span>Edit Package</span>
                          </button>
                        )}

                        {booking.status === "pencil_booked" && (
                          <button
                            type="button"
                            className="flex-1 sm:flex-none bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer"
                          >
                            Finalize & Submit
                          </button>
                        )}

                        {booking.status === "completed" && (
                          <button
                            type="button"
                            className="flex-1 sm:flex-none bg-[#141926] hover:bg-[#1f2638] text-neutral-300 border border-[#232b3d] text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer"
                          >
                            Book Again
                          </button>
                        )}

                        {booking.status !== "completed" && (
                          <button
                            type="button"
                            className="flex-1 sm:flex-none bg-[#090b10] hover:bg-neutral-800 text-neutral-400 hover:text-white border border-[#1b212f] text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer"
                          >
                            {booking.status === "draft" ? "Delete" : "Cancel"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Need Help Box */}
              <div className="mt-10 bg-[#ff0000] rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-red-950/40">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1">
                    Need Help?
                  </h3>
                  <p className="text-xs text-red-100 max-w-xl leading-relaxed">
                    Have questions about your booking or need to make changes? Our team is here to help you every step of the way.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  <button
                    type="button"
                    className="flex-1 md:flex-none bg-white text-red-600 hover:bg-neutral-100 font-black text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition cursor-pointer shadow"
                  >
                    Contact Support
                  </button>
                  <button
                    type="button"
                    className="flex-1 md:flex-none bg-red-900 hover:bg-red-950 text-white font-black text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition cursor-pointer"
                  >
                    View FAQs
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 3. TAB: BILLING & PAYMENTS ==================== */}
{activeTab === "billing-payments" && (
  <BillingPayments />
)}

          {/* ==================== 4. TAB: MY PROFILE ==================== */}
{activeTab === "my-profile" && (
  <ClientProfile onRequestLogout={() => setShowLogoutModal(true)} />
)}
        </main>
      </div>

      {/* --- EDIT EQUIPMENT MODAL --- */}
      {selectedBookingForEdit && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0e121a] border border-[#20293d] rounded-2xl overflow-hidden shadow-2xl text-white font-['Montserrat',sans-serif] animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center border-b border-[#1b212f] relative">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#142340] border border-[#223963] text-blue-400 flex items-center justify-center">
                <Edit2 size={20} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white">
                Edit Equipment
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Add or remove equipment from your booking. Admin will review and update your quotation.
              </p>
              <button
                type="button"
                onClick={() => setSelectedBookingForEdit(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full border border-neutral-700 bg-black/40 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-[#090b10] border border-[#1b212f] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                    Current Booking
                  </span>
                  <h4 className="text-sm font-extrabold text-white">
                    {selectedBookingForEdit.event_name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {modalEquipments.length} equipment items
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-[#0e241c] text-[#22c55e] border border-[#144231] text-[9px] font-black px-2 py-0.5 rounded-full mb-1 uppercase tracking-wider">
                    Downpayment Paid
                  </span>
                  <p className="text-lg font-black text-white">
                    ₱{selectedBookingForEdit.total_price.toLocaleString()}
                  </p>
                  <span className="text-[9px] text-neutral-500 block uppercase">
                    Current Total
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-2">
                  Select Equipment (Check/Uncheck to add/remove)
                </label>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {editableInventory.map((item) => {
                    const isSelected = modalEquipments.includes(item.name);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleModalEquipment(item.name)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#10192e] border-blue-600/80 text-white shadow-md shadow-blue-950/30"
                            : "bg-[#090b10] border-[#1b212f] text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "border-neutral-700 bg-transparent"
                            }`}
                          >
                            {isSelected && <Check size={11} />}
                          </div>
                          <span className="text-xs font-bold text-white">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-xs font-black text-neutral-200 font-mono">
                          ₱{item.price.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#1b212f] flex items-center gap-3 bg-[#090b10]">
              <button
                type="button"
                onClick={() => setSelectedBookingForEdit(null)}
                className="w-1/2 py-3 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingEquipment}
                onClick={handleSaveEquipmentChanges}
                className="w-1/2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg shadow-blue-600/30 disabled:opacity-50"
              >
                {updatingEquipment ? "Saving Changes..." : "Submit Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

     {/* Floating Red Chat Button (Hidden if dismissed) */}
{!isChatbotDismissed && (
  <button
    onClick={() => setIsChatOpen(!isChatOpen)}
    title="Open LSM Assistant"
    className="fixed bottom-8 right-8 bg-[#ff0000] hover:bg-red-700 text-white p-4 rounded-full shadow-[0_0_18px_rgba(255,0,0,0.45)] transition-all z-50 cursor-pointer"
  >
    <MessageSquare size={24} />
  </button>
)}

{/* Movable Chatbot Modal */}
{!isChatbotDismissed && (
  <ChatbotModal
    isOpen={isChatOpen}
    onClose={() => setIsChatOpen(false)}
    onDismissCompletely={() => {
      setIsChatOpen(false);
      setIsChatbotDismissed(true);
    }}
  />
)}

{/* Subtle restore button if dismissed */}
{isChatbotDismissed && (
  <button
    onClick={() => {
      setIsChatbotDismissed(false);
      setIsChatOpen(true);
    }}
    className="fixed bottom-4 right-4 bg-[#11141c] hover:bg-neutral-800 text-neutral-400 text-[10px] font-bold px-3 py-1.5 rounded-full border border-neutral-800 transition cursor-pointer z-40"
  >
    + Show Assistant
  </button>
)}

      {/* --- LOGOUT CONFIRMATION MODAL (Matching Screenshot) --- */}
{showLogoutModal && (
  <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="w-full max-w-sm bg-black border-2 border-red-600/80 rounded-2xl p-7 text-center shadow-[0_0_25px_rgba(255,0,0,0.25)] animate-in fade-in zoom-in duration-150">
      <h3 className="text-base font-bold text-white mb-6">
        Are you sure you want to log-out?
      </h3>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleLogout}
          className="w-24 py-2.5 rounded-xl bg-[#4b5563] hover:bg-[#374151] text-white text-sm font-semibold transition cursor-pointer"
        >
          Yes
        </button>
        <button
          onClick={() => setShowLogoutModal(false)}
          className="w-24 py-2.5 rounded-xl bg-[#4b5563] hover:bg-[#374151] text-white text-sm font-semibold transition cursor-pointer"
        >
          No
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ClientDashboard;