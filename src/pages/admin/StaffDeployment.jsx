import React, { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  QrCode, 
  UserPlus, 
  Send, 
  Smartphone, 
  Users, 
  LayoutDashboard 
} from "lucide-react";

const StaffDeployment = () => {
  // State to manage the visibility of the "Assign Staff" dropdown per event
  const [showAssignFor, setShowAssignFor] = useState({});

  // Mock data for events and staff
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
      ]
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
      availableStaff: []
    }
  ]);

  const toggleAssign = (eventId) => {
    setShowAssignFor(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const handleAssignStaff = (eventId, staffMember) => {
    setEvents(prevEvents => prevEvents.map(event => {
      if (event.id === eventId) {
        // Remove from available, add to assigned with PENDING status
        const updatedAvailable = event.availableStaff.filter(s => s.id !== staffMember.id);
        const newAssignedMember = { ...staffMember, status: "PENDING" };
        
        return {
          ...event,
          assignedStaff: [...event.assignedStaff, newAssignedMember],
          availableStaff: updatedAvailable
        };
      }
      return event;
    }));
  };

  return (
    <div className="w-full max-w-4xl font-sans">
      
      {/* Header */}
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 uppercase tracking-wide">
        STAFF DEPLOYMENT
      </h1>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">TOTAL STAFF</p>
          <p className="text-3xl font-black text-red-600">4</p>
        </div>
        <div className="bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">AVAILABLE</p>
          <p className="text-3xl font-black text-green-500">3</p>
        </div>
        <div className="bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">DEPLOYED</p>
          <p className="text-3xl font-black text-blue-500">1</p>
        </div>
        <div className="bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">UPCOMING EVENTS</p>
          <p className="text-3xl font-black text-purple-500">2</p>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6 mb-8">
        {events.map((event) => (
          <div key={event.id} className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
            
            {/* Event Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5 mb-5">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white uppercase tracking-wide mb-2">
                  {event.title}
                </h2>
                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-red-600" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-red-600" />
                    {event.location}
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-red-500 border border-red-900/50 rounded-lg hover:bg-red-950/30 transition-colors shrink-0">
                <QrCode size={12} /> GENERATE QR
              </button>
            </div>

            {/* Assigned Staff */}
            <div className="mb-6">
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase mb-3">
                ASSIGNED STAFF ({event.assignedStaff.length})
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {event.assignedStaff.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {staff.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                          {staff.name}
                        </p>
                        <p className="text-[9px] text-neutral-500 uppercase tracking-wider mt-0.5">
                          {staff.role}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-full border ${
                      staff.status === "CONFIRMED" 
                        ? "border-green-900/50 text-green-500 bg-green-950/20" 
                        : "border-yellow-900/50 text-yellow-500 bg-yellow-950/20"
                    }`}>
                      {staff.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Still Needed */}
            <div className="mb-6">
              <p className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase mb-2">
                STILL NEEDED
              </p>
              <div className="flex flex-wrap gap-2">
                {event.stillNeeded.map((role, idx) => (
                  <span key={idx} className="text-[9px] font-bold text-orange-500 border border-orange-900/50 bg-orange-950/10 px-3 py-1 rounded-full">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button 
                onClick={() => toggleAssign(event.id)}
                className="flex items-center gap-2 bg-[#ff0000] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-colors"
              >
                <UserPlus size={14} /> ASSIGN STAFF
              </button>
              <button className="flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-colors">
                <Send size={14} /> NOTIFY TEAM
              </button>
            </div>

            {/* Expandable Available Staff Section */}
            {showAssignFor[event.id] && (
              <div className="mt-4 bg-[#161616] border border-neutral-800 rounded-xl p-5">
                <p className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase mb-3">
                  AVAILABLE STAFF
                </p>
                {event.availableStaff.length > 0 ? (
                  <div className="space-y-2">
                    {event.availableStaff.map(staff => (
                      <div key={staff.id} className="flex items-center justify-between bg-[#1a1a1a] rounded-lg p-3">
                        <div>
                          <p className="text-sm font-bold text-white">{staff.name}</p>
                          <p className="text-[10px] text-neutral-500 uppercase">{staff.role}</p>
                        </div>
                        <button 
                          onClick={() => handleAssignStaff(event.id, staff)}
                          className="text-[10px] font-bold text-red-500 border border-red-900/50 hover:bg-red-950/30 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          ASSIGN
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500 italic">No available staff for these roles.</p>
                )}
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Bottom Features Banner */}
      <div className="bg-[#ff0000] rounded-2xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-red-900/20">
        <div>
          <h3 className="text-white font-bold tracking-wide uppercase mb-4">
            FIELD OPERATIONS FEATURES
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white">
              <QrCode size={18} className="opacity-80" />
              <span className="text-sm font-medium">QR code check-in for staff at event locations</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Smartphone size={18} className="opacity-80" />
              <span className="text-sm font-medium">Mobile app for real-time status updates</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Users size={18} className="opacity-80" />
              <span className="text-sm font-medium">Team communication and coordination tools</span>
            </div>
          </div>
        </div>
        
        <button className="flex items-center gap-2 bg-black hover:bg-neutral-900 text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wide transition-colors shrink-0">
          VIEW FIELD OPERATIONS DASHBOARD
        </button>
      </div>

    </div>
  );
};

export default StaffDeployment;