import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Check,
  Plus,
  Sparkles,
  QrCode,
  Upload,
  AlertTriangle,
  FileText,
  Clock,
  Send,
  Save,
  Bookmark,
  MessageSquare,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import logoImage from "../../assets/livestream-logo.png";
import MyBookings from "./MyBookings";

const BookingForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Authenticated user state
  const [userData, setUserData] = useState({
    id: null,
    fullName: "",
    email: "",
    initials: "--",
  });

  // Form Fields
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("Webinar");
  const [clientType, setClientType] = useState("Corporate");
  const [startDate, setStartDate] = useState(searchParams.get("start") || "");
  const [endDate, setEndDate] = useState(searchParams.get("end") || "");
  const [venue, setVenue] = useState("");
  const [estimatedGuests, setEstimatedGuests] = useState("100");
  const [specialNotes, setSpecialNotes] = useState("");

  // Services & Equipment Selection
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(
    searchParams.get("package") ? [searchParams.get("package")] : ["Livestream Package"]
  );

  // Catalog Toggle State
  const [showFullCatalog, setShowFullCatalog] = useState(false);

  // AI Suggester Modal State
  const [showAiModal, setShowAiModal] = useState(false);

  // Payment & Proof State
  const [paymentMethod, setPaymentMethod] = useState("maya"); // default to maya as shown in screenshot
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [policyAgreed, setPolicyAgreed] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Payment Details Data
  const paymentDetails = {
    gcash: {
      accountName: "Livestream Manila",
      accountNumber: "0993 674 2673",
      label: "MOBILE NUMBER",
      note: "Open GCash → Send Money → Express Send or Scan QR. Add your booking name as message.",
      qrColor: "border-blue-600",
      textColor: "text-blue-500",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=09936742673-GCASH-LIVESTREAMMANILA",
    },
    maya: {
      accountName: "Livestream Manila",
      accountNumber: "0993 674 2673",
      label: "MOBILE NUMBER",
      note: "Open Maya → Pay → scan QR or enter mobile number. Add your booking name as payment note.",
      qrColor: "border-emerald-500",
      textColor: "text-emerald-500",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=09936742673-MAYA-LIVESTREAMMANILA",
    },
    bdo: {
      accountName: "Livestream Manila Events",
      accountNumber: "0040 8888 8012",
      label: "ACCOUNT NUMBER",
      note: "Transfer via BDO Online or branch. Account type: Savings. Include your booking ID in the remarks.",
      qrColor: "border-red-600",
      textColor: "text-red-500",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=004088888012-BDO-LIVESTREAMMANILA",
    },
  };

  // Fetch logged in user
  useEffect(() => {
    const fetchUser = async () => {
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
            .select("full_name")
            .eq("id", user.id)
            .maybeSingle();
          if (dbUser) fullName = dbUser.full_name;
        }

        if (!fullName) fullName = user.email?.split("@")[0] || "Client";

        let initials = "U";
        const parts = fullName.trim().split(" ").filter(Boolean);
        if (parts.length >= 2) {
          initials = `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        } else if (parts[0]) {
          initials = parts[0].slice(0, 2).toUpperCase();
        }

        setUserData({
          id: user.id,
          fullName,
          email: user.email || "",
          initials,
        });
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Service Catalog
  const [availableServices, setAvailableServices] = useState([]);

useEffect(() => {
  const loadServices = async () => {
    // Kunin lang ang mga services na NAKA-ON (is_active === true)
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true);

    if (!error && data) {
      setAvailableServices(data);
    }
  };

  loadServices();

  // Realtime subscription: kapag in-off sa admin, kusa ding magtatago sa client
  const channel = supabase
    .channel("services-sync")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "services" },
      () => loadServices()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  // Pre-configured Packages
  const availablePackages = [
    {
      id: "livestream-package",
      name: "Livestream Package",
      desc: "Cameras, TriCaster system, monitors & full streaming rig.",
      price: "₱25,000 / day",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "projector-package",
      name: "Projector Package",
      desc: "High-lumen Epson projectors, stands, screens & laptop.",
      price: "₱8,000 / day",
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "lights-sounds-package",
      name: "Lights & Sounds Package",
      desc: "QSC speakers, DM3 mixer, LED wash bars & wireless mics.",
      price: "₱18,000 / day",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
    },
  ];

  // Individual Full Catalog Items
  const catalogItems = [
    { name: "Televisions", desc: "Large-format displays for stage confidence and audience view.", price: "₱2,500/day", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=600&auto=format&fit=crop" },
    { name: "Cameras", desc: "Broadcast-grade cameras delivering high-definition streaming footage.", price: "₱2,500/day", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop" },
    { name: "Obsbot Camera", desc: "AI-powered robotic camera with auto-tracking for presenters.", price: "₱2,500/day", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop" },
    { name: "TriCaster Video Production System", desc: "Industry live production system: switching, recording & graphics.", price: "₱15,000/day", image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop" },
    { name: "TriCaster Controller", desc: "Dedicated hardware control surface for fast live switching.", price: "₱5,000/day", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop" },
    { name: "Switcher", desc: "Multi-input video switcher for seamless camera transitions.", price: "₱4,000/day", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop" },
    { name: "Recorder", desc: "High-grade video master archive recording device.", price: "₱2,000/day", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" },
    { name: "Communication Sets", desc: "Intercom headsets and belt packs for camera crew.", price: "₱500/day", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop" },
    { name: "Monitors", desc: "Color-accurate field monitors for operators and directors.", price: "₱1,500/day", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop" },
    { name: "Epson Projectors", desc: "High-lumen Epson projectors for bright presentations.", price: "₱3,500/day", image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=600&auto=format&fit=crop" },
    { name: "QSC Speakers", desc: "High-output active loudspeakers for crystal clear audio.", price: "₱4,500/day", image: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=600&auto=format&fit=crop" },
    { name: "DM3 Audio Mixer", desc: "Digital mixing console with professional DSP processing.", price: "₱2,500/day", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop" },
  ];

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleEquipment = (name) => {
    setSelectedEquipment((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]
    );
  };

  // AI Recommendation Engine
  const generateAiRecommendation = () => {
    const type = eventType || "General Event";
    const attendees = parseInt(estimatedGuests) || 100;

    let cost = "₱25,000";
    let pkg = "Livestream Package";
    let text = `For a ${type.toLowerCase()} with ${attendees} attendees, you'll need a professional livestream setup. The Livestream Package includes cameras, TriCaster system, and streaming equipment. We've added a laptop for presentation slides and handheld microphones for presenters.`;

    if (type.includes("Concert") || attendees > 500) {
      cost = "₱43,000";
      pkg = "Lights & Sounds Package";
      text = `Large attendance (${attendees} attendees) requires reinforced stage audio and multi-tier lighting. We recommend combining the Lights & Sounds Package with full broadcast cameras.`;
    } else if (type.includes("Conference") || type.includes("Seminar")) {
      cost = "₱33,000";
      pkg = "Projector Package";
      text = `Conference proceedings benefit from dedicated presentation display arrays. We recommend the Projector Package paired with the Livestream rig.`;
    }

    return { type, attendees, cost, pkg, text };
  };

  const aiRec = generateAiRecommendation();

  // Booking Dispatch Handler
  const handleBookingAction = async (statusType) => {
    setErrorMessage("");
    setActionSuccess("");

    if (statusType === "submitted" || statusType === "pencil_booked") {
      if (!eventName.trim()) {
        setErrorMessage("Please enter an Event Name before proceeding.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (!startDate) {
        setErrorMessage("Please choose at least a Start Date.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (!policyAgreed) {
        setErrorMessage("Please review and agree to the Cancellation Policy.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const payload = {
        user_id: userData.id,
        event_name: eventName || "Untitled Event Draft",
        event_type: eventType,
        client_type: clientType,
        start_date: startDate || null,
        end_date: endDate || startDate || null,
        venue: venue,
        estimated_guests: estimatedGuests ? parseInt(estimatedGuests) : null,
        special_notes: specialNotes,
        services: selectedServices,
        equipment: selectedEquipment,
        payment_method: paymentMethod,
        reference_number: referenceNumber,
        status: statusType,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("bookings").insert([payload]);
      if (error) throw error;

      if (statusType === "submitted") {
        setActionSuccess("Your booking request has been submitted! Our team will review it.");
      } else if (statusType === "pencil_booked") {
        setActionSuccess("Tentative dates saved! Your pencil booking has been recorded.");
      } else {
        setActionSuccess("Draft successfully saved! You can resume this booking anytime.");
      }

      setTimeout(() => {
        navigate("/client/dashboard");
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || "An error occurred while saving your booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-['Montserrat',sans-serif] bg-[#090b10] text-white flex flex-col">
      {/* --- TOP NAVBAR --- */}
      <header className="w-full bg-[#090b10] px-8 py-4 flex items-center justify-between border-b border-[#1b212f] sticky top-0 z-40">
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

          <div className="flex items-center gap-3.5">
            <div className="text-right">
              <p className="text-xs font-bold leading-tight text-white capitalize">
                {userData.fullName || "User"}
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
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-500 transition cursor-pointer"
          >
            <LogOut size={15} />
            <span>LOGOUT</span>
          </button>
        </div>
      </header>

      <div className="h-[1.5px] w-full bg-red-600"></div>

      {/* --- MAIN PAGE CONTAINER --- */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto px-8 py-8 gap-8">
        {/* Left Sidebar */}
        <aside className="w-60 shrink-0 space-y-2.5">
          <button
            onClick={() => navigate("/client/dashboard")}
            className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-[#0f121a]/80 text-neutral-400 hover:text-white hover:bg-[#151924] border border-[#1b212f] transition cursor-pointer"
          >
            <Home size={17} />
            <span>Overview</span>
          </button>
          <button className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-[#ff0000] text-white shadow-lg shadow-red-600/30 transition cursor-pointer">
            <CalendarPlus size={17} />
            <span>Book Service</span>
          </button>
          <button
            onClick={() => navigate("/client/dashboard")}
            className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-[#0f121a]/80 text-neutral-400 hover:text-white hover:bg-[#151924] border border-[#1b212f] transition cursor-pointer"
          >
            <BookOpen size={17} />
            <span>My Bookings</span>
          </button>
          <button
            onClick={() => navigate("/client/dashboard")}
            className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-[#0f121a]/80 text-neutral-400 hover:text-white hover:bg-[#151924] border border-[#1b212f] transition cursor-pointer"
          >
            <CreditCard size={17} />
            <span>Billing & Payments</span>
          </button>
          <button
            onClick={() => navigate("/client/dashboard")}
            className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-[#0f121a]/80 text-neutral-400 hover:text-white hover:bg-[#151924] border border-[#1b212f] transition cursor-pointer"
          >
            <User size={17} />
            <span>My Profile</span>
          </button>
        </aside>

        {/* Form Body */}
        <main className="flex-1 max-w-5xl space-y-8 pb-24">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wide text-white">
              Book a Service
            </h1>
            <p className="text-neutral-400 text-xs mt-1">
              Provide event details to generate automated quote and lock your schedule.
            </p>
          </div>

          {/* Feedback Banners */}
          {actionSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-emerald-400 flex items-center gap-3 text-sm">
              <CheckCircle2 size={18} />
              <span>{actionSuccess}</span>
            </div>
          )}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-600/60 text-red-400 flex items-center gap-3 text-sm">
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Automated Quotation Header with AI Trigger */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-[#171c2e] via-[#15142a] to-[#251322] border border-[#2c334d]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 shrink-0">
                  <Sparkles size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Instant Automated Quotation
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                    Select your required services and equipment to automatically calculate the estimated cost.
                    Once submitted, our team will review the availability and confirm your booking.
                  </p>
                  <p className="text-[11px] text-amber-400 font-semibold pt-1">
                    * Note: Pricing is subject to venue requirements & technical evaluation.
                  </p>
                </div>
              </div>

              {/* AI Trigger Button */}
              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-lg shadow-purple-600/30 hover:scale-105 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>AI Suggester</span>
              </button>
            </div>
          </div>

          {/* 1. EVENT INFORMATION */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Calendar size={16} className="text-red-500" />
              Event Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Event Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual Tech Conference 2026"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                  >
                    <option value="Webinar">Webinar</option>
                    <option value="Corporate Conference">Corporate Conference</option>
                    <option value="Wedding Livestream">Wedding Livestream</option>
                    <option value="Concert / Music Festival">Concert / Music Festival</option>
                    <option value="Sports / Esports Broadcast">Sports / Esports Broadcast</option>
                    <option value="Product Launch">Product Launch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Client Type
                  </label>
                  <select
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                  >
                    <option value="Corporate">Corporate / Enterprise</option>
                    <option value="Agency">Agency / Event Organizer</option>
                    <option value="Individual">Individual / Private Client</option>
                    <option value="Government">Government / NGO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    End Date (Optional for multi-day)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Venue / Event Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PICC Plenary Hall, Pasay City"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Estimated Guests / Attendees
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={estimatedGuests}
                    onChange={(e) => setEstimatedGuests(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 2. SERVICES REQUIRED */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-5">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Services Required
              </h2>
              <p className="text-neutral-400 text-xs mt-0.5">
                Click cards to select all required technical services for this event.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableServices.map((srv) => {
                const isSelected = selectedServices.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleService(srv.id)}
                    className={`relative rounded-xl overflow-hidden border p-4 flex flex-col justify-between transition-all cursor-pointer bg-[#0b0e14] ${
                      isSelected
                        ? "border-red-600 ring-1 ring-red-600 shadow-[0_0_15px_rgba(255,0,0,0.25)]"
                        : "border-[#1b212f] hover:border-neutral-700"
                    }`}
                  >
                    <div className="relative h-28 w-full rounded-lg overflow-hidden mb-3 bg-neutral-900">
                      <img
                        src={srv.image}
                        alt={srv.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                        {srv.badge}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white shadow">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wide text-white mb-1">
                        {srv.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 leading-snug">
                        {srv.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. EQUIPMENT NEEDED + EXPANDABLE FULL CATALOG */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Equipment Needed
                </h2>
                <p className="text-neutral-400 text-xs mt-0.5">
                  Pre-configured equipment packages ready for venue deployment.
                </p>
              </div>

              {/* In-page Full Catalog Expansion Toggle */}
              <button
                type="button"
                onClick={() => setShowFullCatalog(!showFullCatalog)}
                className="text-xs font-bold text-red-500 hover:text-red-400 border border-red-500/40 hover:border-red-500 px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>{showFullCatalog ? "Hide Catalog" : "+ Browse Full Catalog"}</span>
                {showFullCatalog ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Primary Packages Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {availablePackages.map((eq) => {
                const isSelected = selectedEquipment.includes(eq.name);
                return (
                  <div
                    key={eq.id}
                    onClick={() => toggleEquipment(eq.name)}
                    className={`relative rounded-xl overflow-hidden border p-4 flex flex-col justify-between transition-all cursor-pointer bg-[#0b0e14] ${
                      isSelected
                        ? "border-red-600 ring-1 ring-red-600 shadow-[0_0_15px_rgba(255,0,0,0.25)]"
                        : "border-[#1b212f] hover:border-neutral-700"
                    }`}
                  >
                    <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-neutral-900">
                      <img
                        src={eq.image}
                        alt={eq.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white shadow">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wide text-white mb-1">
                        {eq.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 leading-snug mb-2">
                        {eq.desc}
                      </p>
                      <span className="text-red-500 font-extrabold text-xs">
                        {eq.price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Expanded Equipment Grid */}
            {showFullCatalog && (
              <div className="mt-6 pt-6 border-t border-[#1b212f] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-300">
                    Individual Inventory Items ({catalogItems.length})
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    Click to add/remove from equipment list
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-1">
                  {catalogItems.map((item, idx) => {
                    const isSelected = selectedEquipment.includes(item.name);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleEquipment(item.name)}
                        className={`p-3 rounded-xl border bg-[#0b0e14] transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-red-600 ring-1 ring-red-600 shadow-[0_0_12px_rgba(255,0,0,0.2)]"
                            : "border-[#1b212f] hover:border-neutral-700"
                        }`}
                      >
                        <div className="relative h-24 w-full rounded-lg overflow-hidden mb-2.5 bg-neutral-900">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px]">
                              ✓
                            </div>
                          )}
                        </div>
                        <div>
                          <h5 className="text-[11px] font-bold uppercase text-white truncate mb-0.5">
                            {item.name}
                          </h5>
                          <p className="text-[10px] text-neutral-400 line-clamp-2 leading-tight mb-2">
                            {item.desc}
                          </p>
                          <span className="text-red-500 font-black text-[11px]">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* 4. SPECIAL INSTRUCTIONS / NOTES */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Special Instructions / Notes
            </h2>
            <textarea
              rows={4}
              placeholder="Tell us about specific program sequences, physical ingress/egress schedules, or custom graphics needs..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 resize-none"
            />
          </section>

          {/* 5. DOWNPAYMENT METHODS (EXACT REPLICA FROM SCREENSHOT) */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-600/30 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                <QrCode size={16} />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Downpayment Methods
                </h2>
                <p className="text-neutral-400 text-xs mt-0.5">
                  Pay your downpayment to secure your booking date. QR codes are linked to Livestream Manila's official accounts.
                </p>
              </div>
            </div>

            {/* Payment Tabs (GCASH / MAYA / BDO) */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("gcash")}
                className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                  paymentMethod === "gcash"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-[#0b0e14] border border-[#1b212f] text-neutral-400 hover:text-white"
                }`}
              >
                GCash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("maya")}
                className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                  paymentMethod === "maya"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-[#0b0e14] border border-[#1b212f] text-neutral-400 hover:text-white"
                }`}
              >
                Maya
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bdo")}
                className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                  paymentMethod === "bdo"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-[#0b0e14] border border-[#1b212f] text-neutral-400 hover:text-white"
                }`}
              >
                BDO
              </button>
            </div>

            {/* QR Code and Account Info Card */}
            <div className="bg-[#0b0e14] border border-[#1b212f] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-7">
              {/* QR Container */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-44 h-44 bg-white rounded-2xl p-2.5 flex items-center justify-center border-4 ${paymentDetails[paymentMethod].qrColor}`}>
                  <img
                    src={paymentDetails[paymentMethod].qrCode}
                    alt={`${paymentMethod} QR`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest mt-2 ${paymentDetails[paymentMethod].textColor}`}>
                  {paymentMethod}
                </span>
                <span className="text-[10px] text-neutral-500">Scan to pay</span>
              </div>

              {/* Account Details */}
              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#0e121a] border border-[#1b212f] rounded-xl p-4">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Account Name
                    </span>
                    <p className="text-sm font-bold text-white">
                      {paymentDetails[paymentMethod].accountName}
                    </p>
                  </div>
                  <div className="bg-[#0e121a] border border-[#1b212f] rounded-xl p-4">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      {paymentDetails[paymentMethod].label}
                    </span>
                    <p className="text-sm font-mono font-bold text-white">
                      {paymentDetails[paymentMethod].accountNumber}
                    </p>
                  </div>
                </div>

                <div className="bg-[#0e121a] border border-[#1b212f] rounded-xl p-4">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    How to Pay
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {paymentDetails[paymentMethod].note}
                  </p>
                </div>
              </div>
            </div>

            {/* Downpayment Minimums Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                Downpayment Minimums
              </span>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl py-3">
                  <p className="text-base font-black text-white">₱2,000</p>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">Livestream</span>
                </div>
                <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl py-3">
                  <p className="text-base font-black text-white">₱500</p>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">Projector</span>
                </div>
                <div className="bg-[#0b0e14] border border-[#1b212f] rounded-xl py-3">
                  <p className="text-base font-black text-white">₱1,500</p>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">Lights & Sounds</span>
                </div>
              </div>
              <p className="text-[10px] text-neutral-500 text-center pt-1">
                Downpayment is non-refundable once confirmed. Balance is due on the day of the event.
              </p>
            </div>

            {/* Proof of Payment Form */}
            <div className="pt-2 border-t border-[#1b212f] space-y-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                After Paying — Submit Proof
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1.5">
                    Reference / Transaction No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1234567890"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1.5">
                    Upload Payment Screenshot
                  </label>
                  <label className="flex items-center justify-center gap-2.5 px-4 py-3 bg-[#090b10] border border-dashed border-[#242e42] hover:border-neutral-500 rounded-xl cursor-pointer transition text-xs text-neutral-400">
                    <Upload size={15} className="text-red-500" />
                    <span className="truncate">
                      {paymentReceipt ? paymentReceipt.name : "Choose File"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setPaymentReceipt(e.target.files[0] || null)}
                    />
                  </label>
                </div>
              </div>

              <button
                type="button"
                disabled={!referenceNumber && !paymentReceipt}
                className="w-full py-3 rounded-xl bg-[#1a2130] text-neutral-400 font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-neutral-800 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Proof of Payment
              </button>
            </div>
          </section>

          {/* 6. CANCELLATION POLICY */}
          <section className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-7 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Cancellation Policy
              </h2>
            </div>

            <div className="bg-[#090b10] border border-[#1e2638] rounded-xl p-5 text-xs text-neutral-400 leading-relaxed space-y-3 font-normal">
              <p>
                Cancellations made <strong>30 days or more</strong> prior to the event date will receive a full refund of the downpayment minus a 10% administrative fee.
              </p>
              <p>
                Cancellations made <strong>15 to 29 days</strong> prior will receive a 50% refund of the downpayment.
              </p>
              <p>
                Cancellations made <strong>less than 15 days</strong> before the event are non-refundable. Rebooking is subject to equipment availability and may incur a rescheduling fee.
              </p>
              <p>
                In the event of weather emergencies or force majeure, bookings can be rescheduled without penalty within 90 days.
              </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={policyAgreed}
                onChange={(e) => setPolicyAgreed(e.target.checked)}
                className="w-4 h-4 rounded bg-[#090b10] border-neutral-700 accent-red-600 cursor-pointer"
              />
              <span className="text-xs text-neutral-300 font-semibold">
                I have read and agree to the Cancellation Policy and Terms of Service.
              </span>
            </label>
          </section>

          {/* 7. LOYALTY BANNER */}
          <div className="p-4 rounded-xl bg-[#141823] border border-red-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-red-600/30 text-red-500 flex items-center justify-center text-xs">
                ★
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Loyalty Discount Unlocked!
              </span>
            </div>
            <span className="text-xs font-black text-red-500 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded">
              -10%
            </span>
          </div>

          {/* 8. SUBMISSION ACTIONS */}
          <section className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">
              Submission Options
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* SUBMIT REQUEST */}
              <div className="bg-[#121622] border border-red-600/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg shadow-red-950/20">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
                    <Send size={15} />
                    <span>Submit Request</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Instantly notifies the Livestream Manila production team for technical evaluation and date confirmation.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleBookingAction("submitted")}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-widest transition cursor-pointer shadow-md shadow-red-600/30 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Submit Request"}
                </button>
              </div>

              {/* PENCIL BOOK */}
              <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-600/50 transition">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                    <Bookmark size={15} />
                    <span>Pencil Book</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Tentative reservation. Reserves calendar slots temporarily while you finalize event schedules.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleBookingAction("pencil_booked")}
                  className="w-full py-3 rounded-xl bg-[#1d1b15] hover:bg-amber-950/50 text-amber-400 border border-amber-800/60 text-xs font-extrabold uppercase tracking-widest transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Reserving..." : "Pencil Book"}
                </button>
              </div>

              {/* SAVE DRAFT */}
              <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-600 transition">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs uppercase tracking-wider">
                    <Save size={15} />
                    <span>Save Draft</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Save your inputted details without alerting production crew. Resume anytime from your portal.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleBookingAction("draft")}
                  className="w-full py-3 rounded-xl bg-[#141924] hover:bg-[#1a2130] text-neutral-300 border border-[#242e42] text-xs font-extrabold uppercase tracking-widest transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Draft"}
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* --- FUNCTIONAL AI EQUIPMENT SUGGESTER MODAL --- */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0e111a] border border-[#242b3d] rounded-2xl overflow-hidden shadow-2xl text-white font-['Montserrat',sans-serif] animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#1c2233] flex items-center justify-between bg-[#111522]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    AI Equipment Suggester
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Powered by intelligent event analysis
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="w-8 h-8 rounded-full border border-neutral-700 bg-black/40 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Event Analysis Metric Strip */}
              <div className="bg-[#090b10] border border-[#1c2233] rounded-xl p-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-3">
                  <span>📈</span> Event Analysis
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Event Type</span>
                    <span className="text-xs font-bold text-white truncate block">{aiRec.type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Attendees</span>
                    <span className="text-xs font-bold text-white block">{aiRec.attendees}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Budget Range</span>
                    <span className="text-xs font-bold text-neutral-400 block">Not set</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Est. Cost</span>
                    <span className="text-xs font-black text-purple-400 block">{aiRec.cost}</span>
                  </div>
                </div>
              </div>

              {/* AI Written Recommendation Box */}
              <div className="bg-[#090b10] border border-[#1c2233] rounded-xl p-4 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                  AI Recommendation
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  {aiRec.text}
                </p>
              </div>

              {/* Recommended Package Card with Interactive 1-Click Add */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                  Recommended Packages
                </span>

                <div className="p-3.5 bg-[#090b10] border border-[#1c2233] rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop"
                      alt={aiRec.pkg}
                      className="w-16 h-12 object-cover rounded-lg shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-black uppercase text-white">{aiRec.pkg}</h4>
                      <p className="text-[10px] text-neutral-400">
                        Cameras, TriCaster system, monitors, communication sets.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleEquipment(aiRec.pkg)}
                    className={`px-4 py-2 rounded-lg text-[11px] font-extrabold uppercase tracking-wider transition cursor-pointer shrink-0 ${
                      selectedEquipment.includes(aiRec.pkg)
                        ? "bg-emerald-600 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30"
                    }`}
                  >
                    {selectedEquipment.includes(aiRec.pkg) ? "Added ✓" : "Add"}
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-neutral-500 italic">
                💡 Suggestions are based on your event details. You can always customize further.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#1c2233] flex justify-end bg-[#0b0e16]">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg shadow-red-600/30"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Red Chat Button */}
      <button className="fixed bottom-8 right-8 bg-[#ff0000] hover:bg-red-700 text-white p-4 rounded-full shadow-[0_0_18px_rgba(255,0,0,0.45)] transition-all z-50 cursor-pointer">
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

export default BookingForm;