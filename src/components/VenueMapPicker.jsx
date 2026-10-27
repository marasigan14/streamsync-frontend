import React, { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, LocateFixed, LoaderCircle, MapPin } from "lucide-react";
import { apiFetch, peso } from "../lib/api";

/* ------------------------------------------------------------------
   Leaflet (open-source map library) is loaded from a CDN the first time
   the map opens, so no "npm install" is needed.
------------------------------------------------------------------- */
const LEAFLET_VERSION = "1.9.4";
const LEAFLET_CSS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
const LEAFLET_JS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;

// Map pictures (tiles) come from OpenStreetMap: free, no key needed.
// Search, distance and the route line come from OpenRouteService through our backend.
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · Routing &copy; <a href="https://openrouteservice.org">openrouteservice.org</a>';
// Darkens the normal OpenStreetMap tiles so the map matches StreamSync's dark theme.
const DARK_TILES_CSS =
  ".streamsync-dark-tiles{filter:invert(1) hue-rotate(180deg) brightness(.9) contrast(.9) saturate(.6)}";

// Approximate Culiat, QC — only used until the backend sends the exact office pin.
const FALLBACK_OFFICE = { lat: 14.6667, lng: 121.0567 };

let leafletPromise = null;
const loadLeaflet = () => {
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;
  // Wait for BOTH the stylesheet and the script, or the map tiles draw in the wrong place.
  const css = new Promise((resolve) => {
    const existing = document.querySelector(`link[href="${LEAFLET_CSS}"]`);
    if (existing) return resolve();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = LEAFLET_CSS;
    link.onload = () => resolve();
    link.onerror = () => resolve(); // the map still works, just less polished
    document.head.appendChild(link);
  });
  const js = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("The map could not load. Check your internet connection."));
    document.body.appendChild(script);
  });
  leafletPromise = Promise.all([css, js])
    .then(([, L]) => L)
    .catch((err) => {
      leafletPromise = null;
      throw err;
    });
  return leafletPromise;
};

const officeIcon = (L) =>
  L.divIcon({
    className: "",
    html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-6px)">
      <div style="background:#dc2626;color:#fff;font:900 9px Montserrat,sans-serif;letter-spacing:.08em;padding:3px 6px;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,.5)">OUR OFFICE</div>
      <div style="width:10px;height:10px;border-radius:50%;background:#dc2626;border:2px solid #fff;margin-top:3px"></div>
    </div>`,
    iconSize: [80, 34],
    iconAnchor: [40, 34],
  });

/**
 * Ride-hailing style venue picker: the pin stays in the centre, the client
 * drags the map (or searches) until the pin sits on the venue, then confirms.
 *
 * <VenueMapPicker open onClose={...} initial={{lat, lng}} onConfirm={(pin) => ...} />
 * pin = { lat, lng, address, distanceKm, transportFee }
 */
const VenueMapPicker = ({ open, onClose, initial, onConfirm }) => {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const routeRef = useRef(null);
  const officeRef = useRef(FALLBACK_OFFICE);
  const requestId = useRef(0);

  const [loadError, setLoadError] = useState("");
  const [moving, setMoving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pin, setPin] = useState(null); // result from /bookings/pin-distance
  const [pinError, setPinError] = useState("");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Ask the backend for the road distance + address of the map's centre.
  const measureCentre = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;
    const { lat, lng } = map.getCenter();
    const id = ++requestId.current;
    setBusy(true);
    setPinError("");
    try {
      const data = await apiFetch(`/bookings/pin-distance?lat=${lat.toFixed(6)}&lng=${lng.toFixed(6)}`);
      if (id !== requestId.current) return; // the map moved again; ignore this older answer
      setPin(data);
      if (routeRef.current) routeRef.current.remove();
      if (window.L && data.route?.length) {
        routeRef.current = window.L.polyline(data.route, { color: "#ef4444", weight: 4, opacity: 0.85 }).addTo(map);
      }
    } catch (err) {
      if (id !== requestId.current) return;
      setPin(null);
      setPinError(err.message);
      if (routeRef.current) {
        routeRef.current.remove();
        routeRef.current = null;
      }
    } finally {
      if (id === requestId.current) setBusy(false);
    }
  }, []);

  // Build the map when the picker opens; tear it down when it closes.
  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    let moveTimer = null;

    (async () => {
      try {
        const L = await loadLeaflet();
        try {
          const office = await apiFetch("/bookings/office-location");
          if (office?.lat) officeRef.current = { lat: office.lat, lng: office.lng };
        } catch {
          /* keep the fallback office position */
        }
        if (cancelled || !mapEl.current) return;

        const start = initial?.lat ? initial : officeRef.current;
        const map = L.map(mapEl.current, { zoomControl: false, attributionControl: true }).setView(
          [start.lat, start.lng],
          initial?.lat ? 16 : 13
        );
        L.control.zoom({ position: "bottomright" }).addTo(map);
        if (!document.getElementById("streamsync-dark-tiles")) {
          const style = document.createElement("style");
          style.id = "streamsync-dark-tiles";
          style.textContent = DARK_TILES_CSS;
          document.head.appendChild(style);
        }
        L.tileLayer(TILE_URL, {
          attribution: TILE_ATTRIBUTION,
          maxZoom: 19,
          className: "streamsync-dark-tiles",
        }).addTo(map);
        L.marker([officeRef.current.lat, officeRef.current.lng], { icon: officeIcon(L), interactive: false }).addTo(map);
        mapRef.current = map;

        map.on("movestart", () => setMoving(true));
        map.on("moveend", () => {
          setMoving(false);
          clearTimeout(moveTimer);
          moveTimer = setTimeout(measureCentre, 500); // wait until the client stops dragging
        });

        setTimeout(() => map.invalidateSize(), 50); // the modal finished sizing
        if (initial?.lat) measureCentre();
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(moveTimer);
      requestId.current++;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      routeRef.current = null;
      setPin(null);
      setPinError("");
      setResults([]);
      setQuery("");
      setLoadError("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Search suggestions (after the client stops typing).
  useEffect(() => {
    if (!open || query.trim().length < 3) {
      setResults([]);
      setSearchError("");
      return undefined;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError("");
      try {
        const rows = await apiFetch(`/bookings/places?q=${encodeURIComponent(query.trim())}`);
        setResults(rows);
        if (!rows.length) setSearchError("No places found. Try adding the city, or drag the map instead.");
      } catch (err) {
        setResults([]);
        setSearchError(err.message);
      } finally {
        setSearching(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [query, open]);

  const goTo = (lat, lng, zoom = 17) => {
    const map = mapRef.current;
    if (map) map.setView([lat, lng], zoom); // moveend then measures the new centre
  };

  const pickResult = (r) => {
    setResults([]);
    setQuery("");
    goTo(r.lat, r.lng);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setPinError("Your browser can't share its location. Search or drag the map instead.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => goTo(pos.coords.latitude, pos.coords.longitude),
      () => setPinError("Location permission was denied. Search or drag the map instead."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const confirm = () => {
    if (!pin) return;
    onConfirm({
      lat: pin.venue_lat,
      lng: pin.venue_lng,
      address: pin.address,
      distanceKm: pin.distance_km,
      transportFee: pin.transport_fee,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-3xl h-full sm:h-[85vh] bg-[#0e121a] sm:border border-[#1b212f] sm:rounded-2xl overflow-hidden flex flex-col font-['Montserrat',sans-serif] text-white">
        {/* Header + search */}
        <div className="p-4 border-b border-[#1b212f] space-y-3 relative z-[1001] bg-[#0e121a]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">Pin Your Venue</h3>
              <p className="text-[10px] text-neutral-500">
                Drag the map so the red pin sits on your venue, or search for it.
              </p>
            </div>
            <button type="button" onClick={onClose} className="p-2 text-neutral-400 hover:text-white cursor-pointer" aria-label="Close map">
              <X size={18} />
            </button>
          </div>

          <div className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search venue, building, street or city..."
              className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
            />
            {searching && (
              <LoaderCircle size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 animate-spin" />
            )}

            {(results.length > 0 || searchError) && (
              <div className="absolute left-0 right-0 mt-2 bg-[#0e121a] border border-[#1b212f] rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                {results.map((r, i) => (
                  <button
                    key={`${r.lat}-${r.lng}-${i}`}
                    type="button"
                    onClick={() => pickResult(r)}
                    className="w-full text-left px-4 py-3 text-xs text-neutral-200 hover:bg-[#1b212f] flex items-start gap-2.5 border-b border-[#141824] last:border-0 cursor-pointer"
                  >
                    <MapPin size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <span>{r.label}</span>
                  </button>
                ))}
                {searchError && <p className="px-4 py-3 text-xs text-amber-500">{searchError}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Map with a fixed centre pin */}
        <div className="relative flex-1 min-h-[280px]">
          <div ref={mapEl} className="absolute inset-0 bg-[#090b10]" />

          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-amber-500 z-[1000]">
              {loadError}
            </div>
          )}

          {!loadError && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000]" style={{ transform: "translate(-50%, -100%)" }}>
              <svg
                width="40"
                height="52"
                viewBox="0 0 40 52"
                style={{
                  transition: "transform 150ms ease",
                  transform: moving ? "translateY(-10px)" : "translateY(0)",
                  filter: "drop-shadow(0 6px 6px rgba(0,0,0,.55))",
                }}
              >
                <path d="M20 0C9 0 0 9 0 20c0 15 20 32 20 32s20-17 20-32C40 9 31 0 20 0z" fill="#dc2626" />
                <circle cx="20" cy="20" r="7.5" fill="#fff" />
              </svg>
              <div
                className="mx-auto rounded-full bg-black/60"
                style={{ width: moving ? 6 : 10, height: 4, marginTop: 2, transition: "width 150ms ease" }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={useMyLocation}
            className="absolute left-3 bottom-3 z-[1000] flex items-center gap-1.5 bg-[#0e121a]/95 border border-[#1b212f] hover:border-neutral-600 text-[10px] font-black uppercase tracking-wider text-white px-3 py-2.5 rounded-xl cursor-pointer"
          >
            <LocateFixed size={14} className="text-red-500" /> My location
          </button>
        </div>

        {/* Bottom sheet */}
        <div className="p-4 border-t border-[#1b212f] bg-[#0e121a] space-y-3">
          <div className="flex items-start gap-3 min-h-[44px]">
            <MapPin size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              {moving || busy ? (
                <p className="text-xs text-neutral-400 flex items-center gap-2">
                  <LoaderCircle size={13} className="animate-spin" /> Finding the address and route...
                </p>
              ) : pinError ? (
                <p className="text-xs text-amber-500">{pinError}</p>
              ) : pin ? (
                <>
                  <p className="text-xs font-bold text-white leading-snug line-clamp-2">{pin.address}</p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    <span className="text-white font-bold">{pin.distance_km} km</span> by road from our office ·
                    Transport fee <span className="text-white font-bold">{peso(pin.transport_fee)}</span>
                  </p>
                </>
              ) : (
                <p className="text-xs text-neutral-500">Move the map to place the pin on your venue.</p>
              )}
            </div>
          </div>
          <button
            type="button"
            disabled={!pin || moving || busy}
            onClick={confirm}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm Venue Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueMapPicker;
