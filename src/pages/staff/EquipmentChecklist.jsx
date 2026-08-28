import React, { useState } from "react";
import { Search, Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight, UserCircle } from "lucide-react";

const EquipmentChecklist = () => {
  const [subTab, setSubTab] = useState("condition_logs");
  const [showAddLog, setShowAddLog] = useState(false);

  const inventoryItems = [
    { name: "Cameras (PTZ)", category: "Livestream", status: "Available", condition: "Good" },
    { name: "TriCaster Mini 4K", category: "Livestream", status: "Deployed", condition: "Good" },
    { name: "Epson Projector 10000lm", category: "Projector", status: "Available", condition: "Good" },
    { name: "QSC K12.2 Speakers", category: "Lights & Sounds", status: "Available", condition: "Good" },
    { name: "DM3 Digital Mixer", category: "Lights & Sounds", status: "Maintenance", condition: "Fair" },
  ];

  const logs = [
    { item: "Cameras", status: "GOOD", comment: "Sensor cleaned, white balance calibrated. All functions normal.", staff: "Charles", date: "2026-05-20 09:15" },
    { item: "HDMI Cables", status: "FAIR", comment: "Minor fraying on 3 cables. Recommend replacement before next major event.", staff: "Shanel", date: "2026-05-19 14:30" },
    { item: "Tigertouch Light Controller", status: "GOOD", comment: "Firmware updated to v3.2. All DMX channels tested and working.", staff: "Victor", date: "2026-05-18 11:00" },
    { item: "QSC Speakers", status: "GOOD", comment: "Full-range test performed at venue. Output levels optimal.", staff: "Geneth", date: "2026-05-17 16:45" },
    { item: "Switcher", status: "FAIR", comment: "Input channel 3 intermittently dropping. Scheduled for service.", staff: "Julie", date: "2026-05-15 10:20" },
  ];

  return (
    <div className="max-w-6xl mx-auto animation-fade-in">
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 md:p-10">
        <h1 className="text-2xl font-black tracking-wide uppercase text-white mb-8">Equipment Inventory</h1>
        
        <div className="flex items-center gap-8 border-b border-neutral-800 mb-8 px-2 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setSubTab("inventory")}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${subTab === "inventory" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-white"}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setSubTab("condition_logs")}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${subTab === "condition_logs" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-white"}`}
          >
            Condition Logs
          </button>
          <button 
            onClick={() => setSubTab("booking_calendar")}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${subTab === "booking_calendar" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-white"}`}
          >
            Booking Calendar
          </button>
        </div>

        {/* SUB-TAB: INVENTORY */}
        {subTab === "inventory" && (
          <div className="animation-fade-in space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input type="text" placeholder="Search inventory items..." className="w-full bg-black border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-red-600 focus:outline-none transition-colors" />
              </div>
            </div>

            <div className="overflow-x-auto border border-neutral-800 rounded-xl">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="border-b border-neutral-800 text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-black">
                    <th className="py-4 pl-6">Equipment Name</th>
                    <th className="py-4">Category</th>
                    <th className="py-4">Status</th>
                    <th className="py-4 pr-6">Condition</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {inventoryItems.map((item, i) => (
                    <tr key={i} className="border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors">
                      <td className="py-4 pl-6 font-bold text-white">{item.name}</td>
                      <td className="py-4 text-xs text-neutral-400">{item.category}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${item.status === 'Available' ? 'bg-emerald-950/20 text-emerald-500 border-emerald-900/50' : item.status === 'Deployed' ? 'bg-blue-950/20 text-blue-400 border-blue-900/50' : 'bg-amber-950/20 text-amber-500 border-amber-900/50'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-neutral-300 pr-6">{item.condition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB: CONDITION LOGS */}
        {subTab === "condition_logs" && (
          <div className="animation-fade-in">
            {!showAddLog ? (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input type="text" placeholder="Search by item or staff..." className="w-full bg-black border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-red-600 focus:outline-none transition-colors" />
                  </div>
                  <button className="w-12 h-12 bg-black border border-neutral-800 rounded-xl flex items-center justify-center hover:border-neutral-600 transition-colors shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                  </button>
                  <button onClick={() => setShowAddLog(true)} className="bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0">
                    <Plus size={16} /> Add Log Entry
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] text-neutral-400 tracking-wide">Condition reports submitted by staff from the Inventory page are automatically synced here.</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">5 from staff</span>
                </div>

                <div className="overflow-x-auto border border-neutral-800 rounded-xl">
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className="border-b border-neutral-800 text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-black">
                        <th className="py-4 pl-6">Item</th>
                        <th className="py-4">Condition</th>
                        <th className="py-4">Comment</th>
                        <th className="py-4">Staff</th>
                        <th className="py-4 pr-6">Date</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {logs.map((log, i) => (
                        <tr key={i} className="border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors">
                          <td className="py-4 pl-6 font-bold text-white">{log.item}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${log.status === 'GOOD' ? 'bg-emerald-950/20 text-emerald-500 border-emerald-900/50' : 'bg-amber-950/20 text-amber-500 border-amber-900/50'}`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-4 text-xs text-neutral-400 max-w-[300px] truncate">{log.comment}</td>
                          <td className="py-4 text-xs text-neutral-400 flex items-center gap-2 mt-1"><UserCircle size={14}/> {log.staff}</td>
                          <td className="py-4 text-[10px] text-neutral-500 font-mono pr-6">{log.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="border border-neutral-800 rounded-xl p-6 bg-black animation-fade-in">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-6">New Condition Log</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Item Name *</label>
                    <input type="text" placeholder="e.g. LED Bar Unit 3" className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white focus:border-red-600 focus:outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Staff Name *</label>
                    <input type="text" placeholder="e.g. Joash Marasigan" className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white focus:border-red-600 focus:outline-none transition-colors" />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Condition</label>
                  <select className="w-full sm:w-1/2 bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-400 focus:border-red-600 focus:outline-none transition-colors appearance-none">
                    <option value="">Select condition...</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor / Needs Repair</option>
                  </select>
                </div>
                <div className="space-y-2 mb-8">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Comment</label>
                  <textarea rows="3" placeholder="Describe the condition or findings..." className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white focus:border-red-600 focus:outline-none transition-colors resize-none"></textarea>
                </div>
                <div className="flex justify-end gap-4 border-t border-neutral-800 pt-6">
                  <button onClick={() => setShowAddLog(false)} className="px-6 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-xs font-bold tracking-wider">
                    Cancel
                  </button>
                  <button className="bg-[#ff0000] hover:bg-red-700 text-white px-8 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors">
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB: BOOKING CALENDAR */}
        {subTab === "booking_calendar" && (
          <div className="animation-fade-in border border-neutral-800 rounded-2xl bg-black overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <button className="text-neutral-500 hover:text-white transition-colors"><ChevronLeft size={20}/></button>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-widest"><CalendarIcon size={20} className="text-red-600"/> June 2026</h2>
              <button className="text-neutral-500 hover:text-white transition-colors"><ChevronRight size={20}/></button>
            </div>
            
            <div className="grid grid-cols-7 border-b border-neutral-800 text-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest py-3">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            <div className="grid grid-cols-7 grid-rows-5 text-sm text-neutral-600">
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 1; 
                const isCurrentMonth = day >= 1 && day <= 30;
                
                let events = [];
                if (day === 5) events = [{ name: "Tech Corp Annual Con", color: "bg-red-600" }];
                if (day === 6) events = [{ name: "SM Prom Night", color: "bg-purple-500" }];
                if (day === 7) events = [{ name: "BDO Seminar", color: "bg-blue-500" }];
                if (day === 11) events = [{ name: "Church Worship Night", color: "bg-purple-500" }];
                if (day === 12) events = [{ name: "Product Launch", color: "bg-red-600" }];
                if (day === 13) events = [{ name: "Wedding: Santos", color: "bg-red-600" }];
                if (day === 14) events = [{ name: "Training Workshop", color: "bg-blue-500" }];
                if (day === 18) events = [{ name: "Awards Ceremony", color: "bg-purple-500" }];
                if (day === 19) events = [{ name: "Festival Night", color: "bg-purple-500" }];
                if (day === 20) events = [{ name: "Gaming Tournament", color: "bg-red-600" }];
                if (day === 21) events = [{ name: "Graduation Ceremony", color: "bg-blue-500" }];
                if (day === 25) events = [{ name: "Corporate Gala", color: "bg-purple-500" }];
                if (day === 27) events = [{ name: "Forum & Summit", color: "bg-red-600" }];
                if (day === 28) events = [{ name: "Company Townhall", color: "bg-blue-500" }];

                return (
                  <div key={i} className={`min-h-[100px] border-r border-b border-neutral-800 p-2 ${!isCurrentMonth ? 'bg-[#0a0a0a]' : 'bg-[#121212]'}`}>
                    {isCurrentMonth && <span className="text-white font-bold text-xs">{day}</span>}
                    <div className="mt-2 space-y-1">
                      {events.map((evt, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${evt.color}`}></div>
                          <span className="text-[8px] text-neutral-400 truncate leading-none">{evt.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-neutral-800">
              <div className="flex items-center gap-6 mb-8 text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-600"></div> Livestream</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Projector</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Lights & Sounds</span>
              </div>

              <div className="border border-neutral-800 rounded-xl">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 p-4 border-b border-neutral-800 flex items-center gap-2"><CalendarIcon size={14} className="text-red-600"/> Upcoming Bookings This Month</h3>
                <div className="divide-y divide-neutral-800">
                  <div className="p-4 flex items-center justify-between hover:bg-neutral-900/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      <div>
                        <p className="text-sm font-bold text-white">Tech Corp Annual Conference</p>
                        <p className="text-[10px] text-neutral-500">Tech Corp Inc.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Livestream</span>
                      <span className="text-[10px] font-mono text-neutral-500">2026-06-05</span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-neutral-900/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <div>
                        <p className="text-sm font-bold text-white">SM Prom Night</p>
                        <p className="text-[10px] text-neutral-500">SM Group</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="bg-purple-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Lights & Sounds</span>
                      <span className="text-[10px] font-mono text-neutral-500">2026-06-06</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentChecklist;