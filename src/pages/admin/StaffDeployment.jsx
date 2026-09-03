import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  QrCode,
  UserPlus,
  Send,
  Smartphone,
  Users,
} from "lucide-react";

const StaffDeployment = () => {
  // State to manage the visibility of the "Assign Staff" dropdown per event
  const [showAssignFor, setShowAssignFor] = useState({});

  // Mock data for events and staff matching prototype screenshots
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "TECH SUMMIT 2026",
      date: "2026-06-15",
      location: "SMX Convention Center",
      assignedStaff: [
        { id: 101, name: "John Doe", role: "CAMERA OPERATOR", status: "CONFIRMED", initials: "J" },
        { id: 102, name: "Jane Smith", role: "CAMERA OPERATOR", status: "CONFIRMED", initials: "J" },
        { id: 103, name: "Mike Johnson", role: "TECHNICAL DIRECTOR", status: "CONFIRMED", initials: "M" },
        { id: 104, name: "Carlos Reyes", role: "AUDIO ENGINEER", status: "PENDING", initials: "C" },
      ],
      stillNeeded: ["AUDIO ENGINEER", "LIGHTING TECHNICIAN"],
      availableStaff: [
        { id: 201, name: "Anna Cruz", role: "LIGHTING TECHNICIAN", initials: "A" },
        { id: 202, name: "David Tan", role: "CAMERA OPERATOR", initials: "D" },
      ],
    },
    {
      id: 2,
      title: "WEDDING LIVESTREAM",
      date: "2026-06-25",
      location: "Tagaytay Highlands",
      assignedStaff: [
        { id: 105, name: "Sarah Lee", role: "CAMERA OPERATOR", status: "PENDING", initials: "S" },
      ],
      stillNeeded: ["CAMERA OPERATOR", "AUDIO ENGINEER"],
      availableStaff: [
        { id: 203, name: "Mark Ramos", role: "CAMERA OPERATOR", initials: "M" },
      ],
    },
  ]);

  const toggleAssign = (eventId) => {
    setShowAssignFor((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const handleAssignStaff = (eventId, staffMember) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const updatedAvailable = event.availableStaff.filter((s) => s.id !== staffMember.id);
          const newAssignedMember = { ...staffMember, status: "PENDING" };

          return {
            ...event,
            assignedStaff: [...event.assignedStaff, newAssignedMember],
            availableStaff: updatedAvailable,
          };
        }
        return event;
      })
    );
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
            Total Staff
          </p>
          <h3 className="text-3xl font-black text-red-600">4</h3>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
            Available
          </p>
          <h3 className="text-3xl font-black text-emerald-400">3</h3>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
            Deployed
          </p>
          <h3 className="text-3xl font-black text-blue-400">1</h3>
        </div>

        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
            Upcoming Events
          </p>
          <h3 className="text-3xl font-black text-purple-400">2</h3>
        </div>
      </div>

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
                className="flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-900/60 bg-red-950/20 hover:bg-red-950/40 rounded-xl transition cursor-pointer self-start md:self-auto"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {event.assignedStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between bg-[#090b10] border border-[#1b212f] rounded-xl p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow">
                        {staff.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">
                          {staff.name}
                        </p>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-0.5 font-mono">
                          {staff.role}
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
            </div>

            {/* Still Needed */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-neutral-500 tracking-wider uppercase">
                Still Needed
              </p>
              <div className="flex flex-wrap gap-2">
                {event.stillNeeded.map((role, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-black text-orange-500 border border-orange-900/50 bg-orange-950/20 px-3 py-1 rounded-md uppercase tracking-wider"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#1b212f]">
              <button
                type="button"
                onClick={() => toggleAssign(event.id)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md shadow-red-950/40"
              >
                <UserPlus size={14} />
                <span>ASSIGN STAFF</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 border border-[#1b212f] bg-[#090b10] hover:bg-neutral-800 text-neutral-300 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                <Send size={14} />
                <span>NOTIFY TEAM</span>
              </button>
            </div>

            {/* Expandable Available Staff Drawer */}
            {showAssignFor[event.id] && (
              <div className="mt-4 bg-[#090b10] border border-[#1b212f] rounded-2xl p-5 space-y-3 animate-in fade-in duration-150">
                <p className="text-[10px] font-black text-neutral-400 tracking-widest uppercase">
                  Available Staff for Deployment
                </p>
                {event.availableStaff.length > 0 ? (
                  <div className="space-y-2">
                    {event.availableStaff.map((staff) => (
                      <div
                        key={staff.id}
                        className="flex items-center justify-between bg-[#0f121a] border border-[#1b212f] rounded-xl p-3"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{staff.name}</p>
                          <p className="text-[10px] text-neutral-500 uppercase font-mono">
                            {staff.role}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAssignStaff(event.id, staff)}
                          className="text-[10px] font-black text-red-500 border border-red-900/50 hover:bg-red-950/40 px-3 py-1.5 rounded-lg transition cursor-pointer uppercase tracking-wider"
                        >
                          ASSIGN
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 italic">
                    All available staff are currently assigned.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Field Operations Banner */}
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
    </div>
  );
};

export default StaffDeployment;