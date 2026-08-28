import React, { useState } from "react";
import { 
  Boxes, Search, Plus, Filter, CheckCircle2, 
  AlertTriangle, Wrench, MoreVertical, Edit, Trash2 
} from "lucide-react";

const Inventory = () => {
  const [subTab, setSubTab] = useState("all_assets");

  const inventoryData = [
    { id: "EQ-CAM-001", name: "Sony A7S III (Camera 1)", category: "Cameras", status: "Available", condition: "Excellent", lastMaintenance: "2026-05-10" },
    { id: "EQ-CAM-002", name: "Sony A7S III (Camera 2)", category: "Cameras", status: "Deployed", condition: "Good", lastMaintenance: "2026-04-22" },
    { id: "EQ-CAM-003", name: "Sony A7S III (Camera 3)", category: "Cameras", status: "Maintenance", condition: "Requires Inspection", lastMaintenance: "2026-01-15" },
    { id: "EQ-MIX-001", name: "Yamaha DM3 Digital Mixer", category: "Audio", status: "Available", condition: "Good", lastMaintenance: "2026-06-01" },
    { id: "EQ-SWT-001", name: "Blackmagic ATEM Mini Pro", category: "Switchers", status: "Deployed", condition: "Good", lastMaintenance: "2026-05-28" },
    { id: "EQ-LGT-001", name: "Aputure 120d II Kit", category: "Lighting", status: "Available", condition: "Excellent", lastMaintenance: "2026-06-15" },
    { id: "EQ-PRJ-001", name: "Epson 10000 Lumens Laser", category: "Projectors", status: "Maintenance", condition: "Lamp Replacement", lastMaintenance: "2025-12-10" },
    { id: "EQ-CBL-015", name: "SDI Cable Spool (100m)", category: "Cables & Acc", status: "Available", condition: "Fair", lastMaintenance: "2026-03-05" },
  ];

  return (
    <div className="max-w-7xl mx-auto animation-fade-in pb-20">
      
      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-wide uppercase mb-2 text-neutral-900 dark:text-white">Inventory Management</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage and track all company equipment and assets.</p>
        </div>
        <button className="bg-[#ff0000] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-colors shrink-0">
          <Plus size={16} /> Add New Asset
        </button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Boxes size={20} className="text-blue-500" />
            <h3 className="text-3xl font-black text-white leading-none">156</h3>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Total Assets</p>
        </div>
        
        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 size={20} className="text-emerald-500" />
            <h3 className="text-3xl font-black text-emerald-500 leading-none">112</h3>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Available in Warehouse</p>
        </div>

        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={20} className="text-amber-500" />
            <h3 className="text-3xl font-black text-amber-500 leading-none">38</h3>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Currently Deployed</p>
        </div>

        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Wrench size={20} className="text-red-600" />
            <h3 className="text-3xl font-black text-red-600 leading-none">6</h3>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Under Maintenance</p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-neutral-200 dark:border-neutral-800 mb-8 px-2 overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setSubTab("all_assets")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${subTab === "all_assets" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          All Assets
        </button>
        <button 
          onClick={() => setSubTab("categories")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${subTab === "categories" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          Categories
        </button>
        <button 
          onClick={() => setSubTab("archived")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${subTab === "archived" ? "text-red-600 border-b-2 border-red-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          Archived / Retired
        </button>
      </div>

      {subTab === "all_assets" && (
        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 animation-fade-in">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search by ID, name, or category..." 
                className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors" 
              />
            </div>
            <div className="flex gap-4">
              <select className="bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 focus:border-red-600 focus:outline-none transition-colors appearance-none min-w-[150px]">
                <option value="">All Categories</option>
                <option value="cameras">Cameras</option>
                <option value="audio">Audio</option>
                <option value="lighting">Lighting</option>
                <option value="switchers">Switchers</option>
              </select>
              <button className="bg-transparent border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-bold tracking-wider py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0">
                <Filter size={16} /> Filters
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] uppercase tracking-widest text-neutral-500">
                  <th className="pb-4 font-bold">Asset ID</th>
                  <th className="pb-4 font-bold">Item Name</th>
                  <th className="pb-4 font-bold">Category</th>
                  <th className="pb-4 font-bold">Status</th>
                  <th className="pb-4 font-bold">Condition</th>
                  <th className="pb-4 font-bold">Last Maint.</th>
                  <th className="pb-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {inventoryData.map((item, idx) => (
                  <tr key={idx} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                    <td className="py-4 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">{item.id}</td>
                    <td className="py-4 font-bold text-neutral-900 dark:text-white">{item.name}</td>
                    <td className="py-4 text-neutral-600 dark:text-neutral-400 text-xs">{item.category}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border inline-block
                        ${item.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          item.status === 'Deployed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                          'bg-red-500/10 text-red-500 border-red-500/20'}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`text-[11px] font-bold ${
                        item.condition === 'Excellent' || item.condition === 'Good' ? 'text-emerald-500' : 
                        item.condition === 'Fair' ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="py-4 text-neutral-600 dark:text-neutral-400 text-xs font-mono">{item.lastMaintenance}</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-neutral-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit Asset">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Asset">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {subTab === "categories" && (
        <div className="flex items-center justify-center h-64 text-neutral-500">
          Categories management interface will be placed here.
        </div>
      )}

      {subTab === "archived" && (
        <div className="flex items-center justify-center h-64 text-neutral-500">
          Archived and retired assets will be displayed here.
        </div>
      )}

    </div>
  );
};

export default Inventory;