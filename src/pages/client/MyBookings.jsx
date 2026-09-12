  // Map real booking_status enum + tentative flag in notes -> UI status keys
  const mapStatus = (dbStatus, notes) => {
    if (dbStatus === "approved") return "confirmed";
    if (dbStatus === "declined" || dbStatus === "cancelled") return "cancelled";
    if (dbStatus === "completed") return "completed";
    if (dbStatus === "pending" && (notes || "").includes("[TENTATIVE / PENCIL BOOKING]")) {
      return "pencil_booked";
    }
    return "pending";
  };

  // Fetch bookings for the logged-in client via the FastAPI backend
  const fetchClientBookings = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setBookings([]);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/bookings/mine", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to load bookings:", await response.text());
        setBookings([]);
        return;
      }

      const data = await response.json();

      const formatted = data.map((b) => ({
        id: b.id,
        event_name: b.event_name || "Untitled Event",
        event_type: b.event_type || "Event",
        status: mapStatus(b.status, b.notes),
        start_date: b.event_date || "To be scheduled",
        time: b.start_time && b.end_time ? `${b.start_time} - ${b.end_time}` : "All Day",
        venue: b.venue || "Venue TBD",
        budget: "Quote pending",
        services: [],
        submitted_date: b.created_at ? b.created_at.split("T")[0] : "Recent",
        equipment: Array.isArray(b.booking_equipment)
          ? b.booking_equipment.map((be) => be.equipment?.name).filter(Boolean)
          : [],
        total_price: b.total_amount || 0,
      }));

      setBookings(formatted);
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };