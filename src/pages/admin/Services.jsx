import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, Check, Loader2 } from "lucide-react";
import { supabase } from "../../supabaseClient";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Adding New Service
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("LIVESTREAM");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("Contact for Quote");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch live services from Supabase
  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      setServices(data);
    } else {
      // Fallback data if table is still loading
      setServices([
        { id: "live-event-streaming", category: "LIVESTREAM", title: "LIVE EVENT STREAMING", description: "Multi-cam live broadcast to YouTube, Facebook, Zoom, and custom RTMP.", price: "Contact for Quote", is_active: true },
        { id: "video-production", category: "FULL PRODUCTION", title: "VIDEO PRODUCTION", description: "4K cinematic multi-camera recording with on-site editing and highlights reel.", price: "Contact for Quote", is_active: true },
        { id: "audio-engineering", category: "LIGHTS & SOUNDS", title: "AUDIO ENGINEERING", description: "Professional FOH and monitor mixing for any venue size.", price: "Contact for Quote", is_active: true },
        { id: "virtual-events", category: "LIVESTREAM", title: "VIRTUAL EVENTS", description: "Fully managed virtual event production with interactive Q&A and polling.", price: "Contact for Quote", is_active: true },
        { id: "webinar-production", category: "LIVESTREAM", title: "WEBINAR PRODUCTION", description: "Branded webinar setup with presenter green room and live moderation.", price: "Contact for Quote", is_active: true },
        { id: "hybrid-events", category: "FULL PRODUCTION", title: "HYBRID EVENTS", description: "Seamless in-venue + virtual audience experience from one production team.", price: "Contact for Quote", is_active: false },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 2. Toggle Active/Inactive in Supabase
  const toggleServiceStatus = async (id, currentStatus) => {
    const nextStatus = !currentStatus;

    // Optimistic UI update
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: nextStatus } : s))
    );

    // Save to Database
    await supabase
      .from("services")
      .update({ is_active: nextStatus })
      .eq("id", id);
  };

  // 3. Delete Service
  const handleDeleteService = async (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    await supabase.from("services").delete().eq("id", id);
  };

  // 4. Create New Service
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    const serviceId = newTitle.toLowerCase().replace(/\s+/g, "-");

    const payload = {
      id: serviceId,
      title: newTitle.trim().toUpperCase(),
      category: newCategory,
      description: newDescription.trim() || "Professional event service.",
      price: newPrice.trim() || "Contact for Quote",
      is_active: true,
    };

    const { error } = await supabase.from("services").insert([payload]);

    if (!error) {
      setServices((prev) => [...prev, payload]);
      setShowAddModal(false);
      setNewTitle("");
      setNewDescription("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-7xl font-['Montserrat',sans-serif] text-white space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
            SERVICES
          </h1>
          <p className="text-xs text-neutral-400">
            Manage the services offered by Livestream Manila.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-red-950/40 shrink-0 cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} />
          <span>ADD SERVICE</span>
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-neutral-500 gap-2">
          <Loader2 size={20} className="animate-spin text-red-600" />
          <span className="text-xs uppercase tracking-wider font-bold">Loading Services...</span>
        </div>
      )}

      {/* Services Grid matching image_e8a080.jpg */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-700 transition"
            >
              <div>
                {/* Card Header: Category & Actions */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-black tracking-widest text-neutral-400 uppercase border border-[#222b3d] bg-[#090b10] px-3 py-1 rounded-full">
                    {service.category}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* Switch Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleServiceStatus(service.id, service.is_active)}
                      className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors cursor-pointer ${
                        service.is_active
                          ? "border border-green-500/60 bg-green-500/10 justify-end"
                          : "border border-neutral-700 bg-transparent justify-start"
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          service.is_active ? "bg-green-500" : "bg-neutral-600"
                        }`}
                      />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteService(service.id)}
                      className="text-neutral-500 hover:text-red-500 transition cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Card Title & Description */}
                <h3 className="text-sm font-black text-white uppercase mb-2">
                  {service.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Card Footer: Price & Status */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#1b212f]">
                <span className="text-xs font-bold text-red-500">
                  {service.price}
                </span>
                <span
                  className={`text-[10px] font-black tracking-wider uppercase ${
                    service.is_active ? "text-green-500" : "text-neutral-600"
                  }`}
                >
                  {service.is_active ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add New Service */}
      {showAddModal && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddService}
            className="w-full max-w-md bg-[#0e121a] border border-[#1b212f] rounded-2xl p-6 space-y-4 shadow-2xl text-white animate-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Add New Service
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-neutral-500 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Service Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DRONE AERIAL FILMING"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-neutral-300 focus:outline-none focus:border-red-600 cursor-pointer"
              >
                <option value="LIVESTREAM">LIVESTREAM</option>
                <option value="FULL PRODUCTION">FULL PRODUCTION</option>
                <option value="LIGHTS & SOUNDS">LIGHTS & SOUNDS</option>
                <option value="CORPORATE">CORPORATE</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Price Display
              </label>
              <input
                type="text"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Contact for Quote"
                className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Short description of technical scope..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-[#090b10] border border-[#1b212f] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg shadow-red-950/40 disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Service"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Services;