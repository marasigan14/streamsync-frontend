import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  X,
  Plus,
} from "lucide-react";
import { supabase } from "../../supabaseClient";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Equipment Modal State
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState(null);
  const [modalEquipments, setModalEquipments] = useState([]);
  const [updating, setUpdating] = useState(false);

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

  // Default fallback bookings matching the screenshot
  const defaultBookings = [
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
      equipment: ["4K Cinema Camera", "Professional HD Camera", "DM3 Digital Audio Mixer"],
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
      equipment: ["Professional HD Camera", "QSC Active Speakers (Pair)"],
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
      services: ["VIDEO PRODUCTION"],
      submitted_date: "2026-05-20",
      equipment: ["Basic HD Camera"],
      total_price: 18000,
    },
  ];

  // Fetch bookings for the logged-in client
  const fetchClientBookings = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          // Format supabase rows and fill defaults
          const formatted = data.map((b) => ({
            id: b.id,
            event_name: b.event_name || "Untitled Event",
            event_type: b.event_type || "Event",
            status: (b.status || "pending").toLowerCase(),
            start_date: b.start_date || "To be scheduled",
            time: b.time || "09:00 AM - 05:00 PM",
            venue: b.venue || "Venue TBD",
            budget: b.budget || "₱25,000 - ₱50,000",
            services: Array.isArray(b.services) && b.services.length > 0 ? b.services : ["LIVESTREAM PRODUCTION"],
            submitted_date: b.created_at ? b.created_at.split("T")[0] : "Recent",
            equipment: Array.isArray(b.equipment) ? b.equipment : [],
            total_price: b.total_price || 80000,
          }));
          setBookings(formatted);
        } else {
          setBookings(defaultBookings);
        }
      } else {
        setBookings(defaultBookings);
      }
    } catch (err) {
      setBookings(defaultBookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientBookings();
  }, []);

  // Compute stats
  const totalCount = bookings.length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const pendingOrPencilCount = bookings.filter(
    (b) => b.status === "pencil_booked" || b.status === "pending"
  ).length;
  const draftsCount = bookings.filter((b) => b.status === "draft").length;

  // Open Edit Equipment Modal
  const handleOpenEditModal = (booking) => {
    setSelectedBookingForEdit(booking);
    setModalEquipments(booking.equipment || []);
  };

  // Toggle equipment in modal
  const toggleModalEquipment = (name) => {
    setModalEquipments((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  // Save Modal Changes
  const handleSaveEquipmentChanges = async () => {
    if (!selectedBookingForEdit) return;
    setUpdating(true);

    try {
      // Calculate new mock total
      const newTotal = modalEquipments.reduce((acc, currName) => {
        const item = editableInventory.find((i) => i.name === currName);
        return acc + (item ? item.price : 10000);
      }, 40000);

      // Attempt updating Supabase
      await supabase
        .from("bookings")
        .update({ equipment: modalEquipments })
        .eq("id", selectedBookingForEdit.id);

      // Update state locally
      setBookings((prev) =>
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
      setUpdating(false);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="bg-red-950/40 text-red-500 border border-red-800/50 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            Confirmed
          </span>
        );
      case "pencil_booked":
        return (
          <span className="bg-amber-950/40 text-amber-500 border border-amber-800/50 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            Pencil Book
          </span>
        );
      case "completed":
        return (
          <span className="bg-blue-950/40 text-blue-500 border border-blue-800/50 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            Completed
          </span>
        );
      case "draft":
        return (
          <span className="bg-neutral-800 text-neutral-400 border border-neutral-700 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            Draft
          </span>
        );
      default:
        return (
          <span className="bg-orange-950/40 text-orange-400 border border-orange-800/50 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif]">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black tracking-wide uppercase text-white mb-1">
          My Bookings
        </h1>
        <p className="text-xs text-neutral-400">
          Track and manage your livestream service bookings
        </p>
      </div>

      {/* Booking Status Guide */}
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

      {/* Metrics Row */}
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

      {/* Booking Cards Stack */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className={`bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-7 transition-all ${
              booking.status === "draft" ? "opacity-75 hover:opacity-100" : ""
            }`}
          >
            {/* Header: Title + Tag + Status */}
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
              <div>{renderStatusBadge(booking.status)}</div>
            </div>

            {/* Grid Info Columns */}
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

            {/* Selected Services Tags */}
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

            {/* Card Action Buttons */}
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

                {/* Edit Package button (triggers Edit Equipment Modal) */}
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

      {/* --- EDIT EQUIPMENT MODAL (Screenshot Replica) --- */}
      {selectedBookingForEdit && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0e121a] border border-[#20293d] rounded-2xl overflow-hidden shadow-2xl text-white font-['Montserrat',sans-serif] animate-in fade-in zoom-in duration-200">
            {/* Header */}
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

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Current Booking Summary Card */}
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

              {/* Equipment Checkbox Selection */}
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

            {/* Modal Actions */}
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
                disabled={updating}
                onClick={handleSaveEquipmentChanges}
                className="w-1/2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg shadow-blue-600/30 disabled:opacity-50"
              >
                {updating ? "Saving Changes..." : "Submit Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;