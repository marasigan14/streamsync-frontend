import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  QrCode,
  UserPlus,
  Send,
  Smartphone,
  Users,
  Sparkles,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../supabaseClient";

const API_URL = "http://127.0.0.1:8000";

const StaffDeployment = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Suggest/Assign modal state
  const [modalEvent, setModalEvent] = useState(null); // the event object, or null
  const [suggestions, setSuggestions] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [assigning, setAssigning] = useState(false);

  const getToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const fetchEvents = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      // Only approved bookings need staffing
      const bookingsRes = await fetch(`${API_URL}/bookings/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookingsData = await bookingsRes.json();
      const approved = bookingsData.filter((b) => b.status === "approved");

      // Fetch current assignments for each approved booking
      const withAssignments = await Promise.all(
        approved.map(async (b) => {
          const assignRes = await fetch(
            `${API_URL}/bookings/${b.id}/staff-assignments`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const assignData = assignRes.ok ? await assignRes.json() : [];

          return {
            id: b.id,
            title: b.event_name || "Untitled Event",
            date: b.event_date || "TBD",
            location: b.venue || "Venue TBD",
            assignedStaff: assignData.map((a) => ({
              staff_id: a.staff_id,
              name: a.name,
              skills: a.skills,
              status: (a.status || "assigned").toUpperCase(),
              initial: (a.name || "?").charAt(0).toUpperCase(),
            })),
          };
        })
      );

      setEvents(withAssignments);
    } catch (err) {
      console.error("Failed to load staff deployment data:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const totalStaffCount = new Set(
    events.flatMap((e) => e.assignedStaff.map((s) => s.staff_id))
  ).size;
  const deployedCount = events.reduce((sum, e) => sum + e.assignedStaff.length, 0);
  const upcomingCount = events.length;

  // ================================================================
  // Suggest / Assign modal
  // ================================================================

  const openAssignModal = async (event) => {
    setModalEvent(event);
    setSuggestions([]);
    setSelectedStaffIds([]);
    setModalError(null);
    setModalLoading(true);

    const token = await getToken();
    if (!token) {
      setModalError("You must be logged in.");
      setModalLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/bookings/${event.id}/staff-suggestions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();

      if (!response.ok) {
        setModalError(data.detail || "Failed to load suggestions.");
        return;
      }

      if (!data.suggestions || data.suggestions.length === 0) {
        setModalError(data.note || "No staff available for this date.");
        return;
      }

      // Exclude staff already assigned to this event
      const alreadyAssignedIds = new Set(event.assignedStaff.map((s) => s.staff_id));
      setSuggestions(data.suggestions.filter((s) => !alreadyAssignedIds.has(s.staff_id)));
    } catch (err) {
      console.error(err);
      setModalError("Network error — could not reach the server.");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalEvent(null);
    setSuggestions([]);
    setSelectedStaffIds([]);
    setModalError(null);
  };

  const toggleSelection = (staffId) => {
    setSelectedStaffIds((prev) =>
      prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]
    );
  };

  const confirmAssignment = async () => {
    if (!modalEvent || selectedStaffIds.length === 0) return;

    setAssigning(true);
    setModalError(null);

    const token = await getToken();
    if (!token) {
      setModalError("You must be logged in.");
      setAssigning(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/bookings/${modalEvent.id}/assign-staff`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ staff_ids: selectedStaffIds }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setModalError(data.detail || "Failed to assign staff.");
        return;
      }

      closeModal();
      fetchEvents(); // refresh so the event card shows the new assignment
    } catch (err) {
      console.error(err);
      setModalError("Network error — could not reach the server.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
          Staff Deployment
        </h1>
        <p className="text-xs text-neutral-400">
          Coordinate team assignments, track availability, and manage event crews.
        </p>
      </div>

      {/* Top 4 Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
            Staff Deployed
          </p>
          <h3 className="text-3xl font-black text-red-600">{totalStaffCount}</h3>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
            Total Assignments
          </p>
          <h3 className="text-3xl font-black text-emerald-400">{deployedCount}</h3>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
            Upcoming Events
          </p>
          <h3 className="text-3xl font-black text-purple-400">{upcomingCount}</h3>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
            Needing Staff
          </p>
          <h3 className="text-3xl font-black text-amber-400">
            {events.filter((e) => e.assignedStaff.length === 0).length}
          </h3>
        </div>
      </div>

      {loading && <p className="text-neutral-500 text-sm">Loading events...</p>}

      {!loading && events.length === 0 && (
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-8 text-center text-neutral-400 text-sm">
          No confirmed events need staffing right now.
        </div>
      )}

      {/* Events List */}
      <div className="space-y-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6"
          >
            {/* Event Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b212f] pb-5">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-wide mb-1.5">
                  {event.title}
                </h2>
                <div className="flex items-center gap-5 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Calendar size={13} className="text-red-500" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-red-500" />
                    {event.location}
                  </div>
                </div>
              </div>

              <button
                type="button"
                title="QR check-in — part of a separate feature"
                className="flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-600 border border-[#1b212f] bg-[#090b10] rounded-xl cursor-not-allowed self-start md:self-auto opacity-50"
              >
                <QrCode size={13} />
                <span>GENERATE QR</span>
              </button>
            </div>

            {/* Assigned Staff */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-neutral-500 tracking-wider uppercase">
                Assigned Staff ({event.assignedStaff.length})
              </p>
              {event.assignedStaff.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {event.assignedStaff.map((staff) => (
                    <div
                      key={staff.staff_id}
                      className="flex items-center justify-between bg-[#090b10] border border-[#1b212f] rounded-xl p-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow">
                          {staff.initial}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">
                            {staff.name}
                          </p>
                          <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-0.5 font-mono">
                            {staff.skills}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded border ${
                          staff.status === "CONFIRMED"
                            ? "border-emerald-800/50 text-emerald-400 bg-emerald-950/40"
                            : "border-amber-800/50 text-amber-500 bg-amber-950/40"
                        }`}
                      >
                        {staff.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500 italic">
                  No staff assigned yet.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#1b212f]">
              <button
                type="button"
                onClick={() => openAssignModal(event)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md shadow-red-950/40"
              >
                <UserPlus size={14} />
                <span>ASSIGN STAFF</span>
              </button>
              <button
                type="button"
                title="Notifications — part of a separate feature"
                className="flex items-center gap-2 border border-[#1b212f] bg-[#090b10] text-neutral-600 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-not-allowed opacity-50"
              >
                <Send size={14} />
                <span>NOTIFY TEAM</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Field Operations Banner (unchanged — informational only) */}
      <div className="bg-[#ff0000] rounded-2xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-red-950/40">
        <div className="space-y-4">
          <h3 className="text-white font-black text-sm uppercase tracking-widest">
            Field Operations Features
          </h3>
          <div className="space-y-2 text-xs text-white">
            <div className="flex items-center gap-2.5">
              <QrCode size={16} className="opacity-90 shrink-0" />
              <span>QR code check-in for staff at event locations</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Smartphone size={16} className="opacity-90 shrink-0" />
              <span>Mobile app for real-time status updates</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Users size={16} className="opacity-90 shrink-0" />
              <span>Team communication and coordination tools</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center justify-center bg-black hover:bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 shadow-lg"
        >
          View Field Operations Dashboard
        </button>
      </div>

      {/* ============================================================== */}
      {/* MODAL: SUGGEST / ASSIGN STAFF                                  */}
      {/* ============================================================== */}
      {modalEvent && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0e121a] border border-[#1b212f] rounded-2xl p-6 space-y-5 shadow-2xl text-white max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Sparkles size={14} className="text-purple-400" />
                  Suggest Staff
                </h3>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  {modalEvent.title} — {modalEvent.date}
                </p>
              </div>
              <button type="button" onClick={closeModal} className="text-neutral-500 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {modalLoading && (
              <p className="text-xs text-neutral-500 py-6 text-center">Loading suggestions...</p>
            )}

            {!modalLoading && modalError && (
              <div className="text-center py-6 space-y-2">
                <AlertCircle size={24} className="text-red-500 mx-auto" />
                <p className="text-xs text-neutral-400">{modalError}</p>
              </div>
            )}

            {!modalLoading && !modalError && suggestions.length > 0 && (
              <>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                  Ranked by fit — select one or more to assign
                </p>
                <div className="space-y-2">
                  {suggestions.map((s, idx) => {
                    const isSelected = selectedStaffIds.includes(s.staff_id);
                    return (
                      <button
                        key={s.staff_id}
                        type="button"
                        onClick={() => toggleSelection(s.staff_id)}
                        className={`w-full text-left border rounded-xl p-3.5 transition cursor-pointer ${
                          isSelected
                            ? "border-purple-500 bg-purple-950/20"
                            : "border-[#1b212f] bg-[#090b10] hover:border-neutral-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white">
                            {idx === 0 && <span className="text-purple-400 mr-1.5">★ Best fit</span>}
                            {s.name}
                          </p>
                          {isSelected && <Check size={14} className="text-purple-400" />}
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{s.skills}</p>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={selectedStaffIds.length === 0 || assigning}
                  onClick={confirmAssignment}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition cursor-pointer shadow-lg shadow-red-950/40 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {assigning ? "Assigning..." : `Assign ${selectedStaffIds.length || ""} Staff`.trim()}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDeployment;
