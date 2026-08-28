
import React, { useState } from "react";
import { 
  Calendar, Clock, MapPin, Users, CheckCircle2, 
  AlertCircle, ChevronDown, Mail, AlertTriangle, FileText, Check
} from "lucide-react";

const ManageBookings = () => {
  const [subTab, setSubTab] = useState("requests");

  return (
    <div className="max-w-7xl mx-auto animation-fade-in pb-20">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-neutral-900 dark:text-white">Manage Bookings</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Review, approve, or reject booking requests from clients.</p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-neutral-200 dark:border-neutral-800 mb-8 px-2 overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setSubTab("requests")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${subTab === "requests" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          Booking Requests
        </button>
        <button 
          onClick={() => setSubTab("calendar")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${subTab === "calendar" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          Calendar View
        </button>
        <button 
          onClick={() => setSubTab("cancellations")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${subTab === "cancellations" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          Cancellation Logs
        </button>
      </div>

      {subTab === "requests" && (
        <div className="animation-fade-in">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Pending Review</p>
              <h3 className="text-3xl font-black text-amber-500">1</h3>
            </div>
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Pencil Bookings</p>
              <h3 className="text-3xl font-black text-orange-400">2</h3>
            </div>
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Confirmed</p>
              <h3 className="text-3xl font-black text-cyan-400">2</h3>
            </div>
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Approved</p>
              <h3 className="text-3xl font-black text-emerald-500">0</h3>
            </div>
          </div>

          {/* Booking Request List */}
          <div className="space-y-6">
            
            {/* Card 1: Tech Summit 2026 */}
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 transition-colors">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-wide">Tech Summit 2026</h3>
                    <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Pencil Book</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">John Doe • johndoe@example.com</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Submitted: June 10, 2026</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12}/> Date</p>
                    <p className="font-bold text-neutral-900 dark:text-white">2026-06-15</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12}/> Time</p>
                    <p className="font-bold text-neutral-900 dark:text-white">09:00 AM -<br/>05:00 PM</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin size={12}/> Venue</p>
                    <p className="font-bold text-neutral-900 dark:text-white">SMX Convention<br/>Center</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Users size={12}/> Attendees</p>
                    <p className="font-bold text-neutral-900 dark:text-white">500</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Services</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Livestreaming</span>
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Video Production</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Equipment Needed</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Cameras (PTZ)</span>
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Projector</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Notes</p>
                    <div className="bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-sm text-neutral-700 dark:text-neutral-300">
                      Needs backup generator
                    </div>
                  </div>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 px-4 py-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white flex items-center gap-2">
                      <FileText size={14}/> Preliminary Quotation
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-1">
                      Review & Adjust <ChevronDown size={14}/>
                    </span>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#121212] space-y-2 text-sm">
                    <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                      <span>Total Amount:</span>
                      <span className="font-bold text-neutral-900 dark:text-white">₱98,000</span>
                    </div>
                    <div className="flex justify-between items-center text-cyan-600 dark:text-cyan-400 font-bold">
                      <span>Downpayment (50%):</span>
                      <span>₱49,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="w-full lg:w-64 shrink-0 flex flex-col justify-start">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 flex flex-col items-center justify-center text-center h-32">
                  <Clock size={20} className="text-amber-500 mb-2" />
                  <p className="text-xs font-bold text-amber-500 leading-snug">Waiting for automated quote to clear</p>
                </div>
              </div>
            </div>

            {/* Card 2: Sarah & Mike Wedding */}
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 transition-colors">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-wide">Sarah & Mike Wedding</h3>
                    <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Confirmed</span>
                    <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Updated</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Sarah Smith • sarahs@wedding.com</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Submitted: May 10, 2026</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12}/> Date</p>
                    <p className="font-bold text-neutral-900 dark:text-white">2026-06-25</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12}/> Time</p>
                    <p className="font-bold text-neutral-900 dark:text-white">02:00 PM -<br/>08:00 PM</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin size={12}/> Venue</p>
                    <p className="font-bold text-neutral-900 dark:text-white">Tagaytay<br/>Highlands</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Users size={12}/> Attendees</p>
                    <p className="font-bold text-neutral-900 dark:text-white">150</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Services</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Livestreaming</span>
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Video Coverage</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Equipment Needed</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Cameras (PTZ)</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Notes</p>
                    <div className="bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-sm text-neutral-700 dark:text-neutral-300">
                      Outdoor ceremony, please prepare for rain.
                    </div>
                  </div>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 px-4 py-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white flex items-center gap-2">
                      <FileText size={14}/> Preliminary Quotation
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-1 cursor-pointer">
                      View Log and Details <ChevronDown size={14}/>
                    </span>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#121212] space-y-2 text-sm">
                    <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                      <span>Total Amount:</span>
                      <span className="font-bold text-neutral-900 dark:text-white">₱50,000</span>
                    </div>
                    <div className="flex justify-between items-center text-cyan-600 dark:text-cyan-400 font-bold mb-2">
                      <span>Downpayment (50%):</span>
                      <span>₱25,000</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500 mt-2 border-t border-neutral-800 pt-3">
                      <CheckCircle2 size={12}/> Payment Approved
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="w-full lg:w-64 shrink-0 flex flex-col justify-start gap-4">
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3 border border-cyan-500/20">
                    <Check size={20} />
                  </div>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                    Automated Invoice Sent<br/>May 12
                  </p>
                </div>
                <button className="w-full bg-transparent border border-red-900/50 hover:bg-red-950/30 text-red-500 text-xs font-bold tracking-wider py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Mail size={14}/> Send follow up email
                </button>
              </div>
            </div>

            {/* Card 3: Summer Music Fest */}
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 transition-colors opacity-75 hover:opacity-100">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-wide">Summer Music Fest</h3>
                    <span className="bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Rejected</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Mark Johnson • markj@musicfest.com</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Submitted: May 15, 2026</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12}/> Date</p>
                    <p className="font-bold text-neutral-900 dark:text-white">2026-07-10</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12}/> Time</p>
                    <p className="font-bold text-neutral-900 dark:text-white">04:00 PM - 12:00 AM</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin size={12}/> Venue</p>
                    <p className="font-bold text-neutral-900 dark:text-white">Philippine Arena</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Users size={12}/> Attendees</p>
                    <p className="font-bold text-neutral-900 dark:text-white">5000</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Services</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Lights & Sounds</span>
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Live Band</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Equipment Needed</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Concert Rig</span>
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">LED Wall</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Notes</p>
                    <div className="bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-sm text-neutral-700 dark:text-neutral-300">
                      Stage requires 3 wireless roaming cameras.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Product Launch Webinar */}
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 transition-colors border-l-4 border-l-orange-500">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-wide">Product Launch Webinar</h3>
                    <span className="bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Pending Review</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Anna Cruz • annac@example.ph</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Submitted: June 12, 2026</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12}/> Date</p>
                    <p className="font-bold text-neutral-900 dark:text-white">2026-08-10</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12}/> Time</p>
                    <p className="font-bold text-neutral-900 dark:text-white">10:00 AM - 12:00 PM</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin size={12}/> Venue</p>
                    <p className="font-bold text-neutral-900 dark:text-white">Virtual<br/><span className="text-[10px] font-normal text-neutral-500">(Streamed from BGC Office)</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Users size={12}/> Attendees</p>
                    <p className="font-bold text-neutral-900 dark:text-white">100</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Services</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Livestreaming</span>
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Virtual Setup</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Equipment Needed</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Webinar Kit</span>
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">2x Cameras</span>
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Studio Mic Set</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Notes</p>
                    <div className="bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-sm text-neutral-700 dark:text-neutral-300">
                      Client still deciding on final guest list.
                    </div>
                  </div>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 px-4 py-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white flex items-center gap-2">
                      <FileText size={14}/> Preliminary Quotation
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-1">
                      Review & Adjust <ChevronDown size={14}/>
                    </span>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#121212] space-y-2 text-sm">
                    <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                      <span>Total Amount:</span>
                      <span className="font-bold text-neutral-900 dark:text-white">₱38,000</span>
                    </div>
                    <div className="flex justify-between items-center text-cyan-600 dark:text-cyan-400 font-bold">
                      <span>Downpayment (50%):</span>
                      <span>₱19,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="w-full lg:w-64 shrink-0 flex flex-col justify-start gap-4">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 flex flex-col items-center justify-center text-center h-32">
                  <AlertCircle size={20} className="text-orange-500 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 leading-relaxed">
                    Review booking details and confirm
                  </p>
                </div>
                <button className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors shadow-lg shadow-red-900/20">
                  Confirm Booking
                </button>
              </div>
            </div>

            {/* Card 5: University Graduation Ceremony */}
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 transition-colors">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-wide">University Graduation Ceremony</h3>
                    <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Pencil Book</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Carlos Reyes • carlos@university.ph</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Submitted: June 15, 2026</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12}/> Date</p>
                    <p className="font-bold text-neutral-900 dark:text-white">2026-08-30</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12}/> Time</p>
                    <p className="font-bold text-neutral-900 dark:text-white">08:00 AM - 12:00 PM</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin size={12}/> Venue</p>
                    <p className="font-bold text-neutral-900 dark:text-white">Araneta Coliseum</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Users size={12}/> Attendees</p>
                    <p className="font-bold text-neutral-900 dark:text-white">3000</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Services</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Livestreaming</span>
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Multi-Camera Setup</span>
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">LED Wall</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Equipment Needed</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Academic Rollout</span>
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">4x PTZ Cameras</span>
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Switcher</span>
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">LED Controllers</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Notes</p>
                    <div className="bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-sm text-neutral-700 dark:text-neutral-300">
                      Tentative date - may change based on school calendar.
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="w-full lg:w-64 shrink-0 flex flex-col justify-start">
                <div className="border border-amber-900/50 bg-transparent rounded-xl p-5 flex flex-col items-center justify-center text-center h-32">
                  <Clock size={20} className="text-amber-500 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 leading-relaxed">
                    Tentative booking - awaiting client confirmation
                  </p>
                </div>
              </div>
            </div>

            {/* Card 6: Quarterly Sales Conference */}
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 transition-colors">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-wide">Quarterly Sales Conference</h3>
                    <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Confirmed</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Lisa Tan • lisa@company.com</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Submitted: May 20, 2026</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12}/> Date</p>
                    <p className="font-bold text-neutral-900 dark:text-white">2026-09-05</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12}/> Time</p>
                    <p className="font-bold text-neutral-900 dark:text-white">01:00 PM - 05:00 PM</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin size={12}/> Venue</p>
                    <p className="font-bold text-neutral-900 dark:text-white">Marriott Hotel<br/>Manila</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Users size={12}/> Attendees</p>
                    <p className="font-bold text-neutral-900 dark:text-white">300</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Services</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Livestreaming</span>
                      <span className="border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Presentation Recording</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Equipment Needed</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Corporate Standard</span>
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">2x Cameras</span>
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Projector</span>
                      <span className="border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">Audio System</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="w-full lg:w-64 shrink-0 flex flex-col justify-start gap-4">
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3 border border-cyan-500/20">
                    <Check size={20} />
                  </div>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                    Invoice fully paid<br/>June 02
                  </p>
                </div>
                <button className="w-full bg-transparent border border-red-900/50 hover:bg-red-950/30 text-red-500 text-xs font-bold tracking-wider py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  View Event Dashboard
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Placeholders for other tabs to keep navigation active */}
      {subTab === "calendar" && (
        <div className="flex items-center justify-center h-64 text-neutral-500">
          Calendar View interface will be placed here.
        </div>
      )}
      
      {subTab === "cancellations" && (
        <div className="flex items-center justify-center h-64 text-neutral-500">
          Cancellation Logs interface will be placed here.
        </div>
      )}

    </div>
  );
};

export default ManageBookings;