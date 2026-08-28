import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const Services = () => {
  // Mock Data based on the screenshot
  const [services, setServices] = useState([
    {
      id: 1,
      category: "LIVESTREAM",
      title: "LIVE EVENT STREAMING",
      description: "Multi-cam live broadcast to YouTube, Facebook, Zoom, and custom RTMP.",
      price: "Contact for Quote",
      isActive: true,
    },
    {
      id: 2,
      category: "FULL PRODUCTION",
      title: "VIDEO PRODUCTION",
      description: "4K cinematic multi-camera recording with on-site editing and highlights reel.",
      price: "Contact for Quote",
      isActive: true,
    },
    {
      id: 3,
      category: "LIGHTS & SOUNDS",
      title: "AUDIO ENGINEERING",
      description: "Professional FOH and monitor mixing for any venue size.",
      price: "Contact for Quote",
      isActive: true,
    },
    {
      id: 4,
      category: "LIVESTREAM",
      title: "VIRTUAL EVENTS",
      description: "Fully managed virtual event production with interactive Q&A and polling.",
      price: "Contact for Quote",
      isActive: true,
    },
    {
      id: 5,
      category: "LIVESTREAM",
      title: "WEBINAR PRODUCTION",
      description: "Branded webinar setup with presenter green room and live moderation.",
      price: "Contact for Quote",
      isActive: true,
    },
    {
      id: 6,
      category: "FULL PRODUCTION",
      title: "HYBRID EVENTS",
      description: "Seamless in-venue + virtual audience experience from one production team.",
      price: "Contact for Quote",
      isActive: false,
    },
  ]);

  const toggleServiceStatus = (id) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ));
  };

  return (
    <div className="w-full max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1 uppercase tracking-wide">
            SERVICES
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage the services offered by Livestream Manila.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#ff0000] hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-colors shadow-lg shadow-red-900/20 shrink-0">
          <Plus size={16} /> ADD SERVICE
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service) => (
          <div 
            key={service.id} 
            className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col transition-all hover:border-neutral-700"
          >
            {/* Card Header: Category & Actions */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-bold tracking-widest text-neutral-500 dark:text-neutral-400 uppercase border border-neutral-300 dark:border-neutral-700 px-3 py-1 rounded-full">
                {service.category}
              </span>
              
              <div className="flex items-center gap-3">
                {/* Custom Toggle Switch */}
                <button 
                  onClick={() => toggleServiceStatus(service.id)}
                  className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${
                    service.isActive 
                      ? "border border-green-500/50 bg-green-500/10 justify-end" 
                      : "border border-neutral-600 bg-transparent justify-start"
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${service.isActive ? "bg-green-500" : "bg-neutral-600"}`} />
                </button>
                
                {/* Delete Button */}
                <button className="text-neutral-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="flex-grow">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/50">
              <span className="text-sm font-bold text-red-600 dark:text-red-500">
                {service.price}
              </span>
              <span className={`text-[10px] font-bold tracking-wider uppercase ${
                service.isActive 
                  ? "text-green-500" 
                  : "text-neutral-600"
              }`}>
                {service.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;