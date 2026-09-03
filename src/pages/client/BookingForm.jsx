import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const promoFromUrl = searchParams.get("promo") || "";
  const equipmentFromUrl = searchParams.get("equipment") || "";

  const [promoCode, setPromoCode] = useState(promoFromUrl);
  const selectedEquipmentList = equipmentFromUrl ? equipmentFromUrl.split(",") : [];

  return (
    <div className="max-w-4xl mx-auto animation-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black tracking-wide uppercase mb-2 text-neutral-900 dark:text-white">
          Book a Service
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Fill out your event details to generate an automated quotation.
        </p>
        {selectedEquipmentList.length > 0 && (
          <div className="mt-4 p-4 bg-red-600/10 border border-red-600/30 rounded-xl text-xs text-red-600 dark:text-red-400 font-semibold uppercase tracking-wider">
            Selected Equipment from Cart: <span className="text-white font-bold">{selectedEquipmentList.join(", ")}</span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors">
        <form className="space-y-8">
          {/* Promo Code */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-red-600 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              Promo
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                Promo Code
              </label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-red-600 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              Event Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  Event Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual Company Conference"
                  className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  Event Type
                </label>
                <select className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors appearance-none">
                  <option>Corporate</option>
                  <option>Webinar</option>
                  <option>Wedding</option>
                  <option>Concert / Festival</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule & Location */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-red-600 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              Schedule & Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-500 focus:border-red-600 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-500 focus:border-red-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                Venue / Location
              </label>
              <input
                type="text"
                placeholder="e.g. SMX Convention Center"
                className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:border-red-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Services Needed */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-red-600 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              Services Needed
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Livestreaming",
                "Video Production",
                "Audio Engineering",
                "Lights & Sounds",
                "Projector Rental",
                "LED Wall",
                "Virtual Event Setup",
                "Content Creation",
              ].map((service, i) => (
                <label
                  key={i}
                  className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl cursor-pointer hover:border-red-600/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    defaultChecked={selectedEquipmentList.some(eq => eq.toLowerCase().includes(service.toLowerCase().split(' ')[0]))}
                    className="w-4 h-4 accent-red-600 bg-neutral-50 dark:bg-black border-neutral-300 dark:border-neutral-700 rounded"
                  />
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    {service}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              className="bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-4 px-10 rounded-xl transition-colors shadow-lg shadow-red-900/20"
            >
              Generate Automated Quotation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;