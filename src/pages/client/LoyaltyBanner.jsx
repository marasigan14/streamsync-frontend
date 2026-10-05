import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const LOYALTY_THRESHOLD = 3;
const LOYALTY_DISCOUNT_PERCENT = 10;

// Adjust these to match your real `bookings` table.
const USER_COLUMN = "client_id";
const COUNTED_STATUSES = ["confirmed", "completed"];

const LoyaltyBanner = ({ userId }) => {
  const [bookingCount, setBookingCount] = useState(null); // null = still loading

  useEffect(() => {
    if (!userId) return;

    const loadCount = async () => {
      const { count, error } = await supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq(USER_COLUMN, userId)
        .in("status", COUNTED_STATUSES);

      if (error) {
        console.error("Failed to load booking count:", error);
        setBookingCount(0);
      } else {
        setBookingCount(count ?? 0);
      }
    };

    loadCount();
  }, [userId]);

  if (bookingCount === null) return null;

  const unlocked = bookingCount >= LOYALTY_THRESHOLD;
  const remaining = LOYALTY_THRESHOLD - bookingCount;

  if (unlocked) {
    return (
      <div className="p-4 rounded-xl bg-[#141823] border border-red-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-red-600/30 text-red-500 flex items-center justify-center text-xs">
            ★
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-white">
            Loyalty Discount Unlocked!
          </span>
        </div>
        <span className="text-xs font-black text-red-500 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded">
          -{LOYALTY_DISCOUNT_PERCENT}%
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-[#141823] border border-[#1b212f] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-500 flex items-center justify-center text-xs">
          ★
        </div>
        <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
          {remaining} more booking{remaining > 1 ? "s" : ""} to unlock {LOYALTY_DISCOUNT_PERCENT}% off
        </span>
      </div>
      <span className="text-xs font-black text-neutral-400 bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded">
        {bookingCount}/{LOYALTY_THRESHOLD}
      </span>
    </div>
  );
};

export default LoyaltyBanner;
