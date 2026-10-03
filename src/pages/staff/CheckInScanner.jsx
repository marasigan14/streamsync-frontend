import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  QrCode,
  Calendar,
  Clock,
  MapPin,
  User,
  Check,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "../../supabaseClient"; // adjust the path if this file lives elsewhere

const API = import.meta.env.VITE_API_URL;

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
const authFetch = async (path, options = {}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data.detail === "string" ? data.detail : "Request failed");
  }
  return data;
};

const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const fmtTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const fmtRange = (start, end) => [fmtTime(start), fmtTime(end)].filter(Boolean).join(" - ");

const fmtClock = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";

const SCANNER_ELEMENT_ID = "qr-reader";

// ---------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------
const CheckInScanner = () => {
  const [step, setStep] = useState("scan"); // "scan" | "review" | "done"
  const [token, setToken] = useState("");
  const [details, setDetails] = useState(null);
  const [manualToken, setManualToken] = useState("");
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [busy, setBusy] = useState(false);
  const handledRef = useRef(false); // stops the camera firing the same scan many times

  // Ask the server to verify a scanned token and return the booking details
  const verifyToken = async (raw) => {
    const value = (raw || "").trim();
    if (!value) return;
    setBusy(true);
    setError("");
    try {
      const data = await authFetch("/staff-portal/check-in/verify", {
        method: "POST",
        body: JSON.stringify({ token: value, confirm: false }),
      });
      setToken(value);
      setDetails(data);
      setStep("review");
    } catch (err) {
      setError(err.message);
      handledRef.current = false; // let the camera try again
    } finally {
      setBusy(false);
    }
  };

  const confirmCheckIn = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await authFetch("/staff-portal/check-in/verify", {
        method: "POST",
        body: JSON.stringify({ token, confirm: true }),
      });
      setDetails(data);
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    handledRef.current = false;
    setToken("");
    setDetails(null);
    setManualToken("");
    setError("");
    setStep("scan");
  };

  // Camera: runs only while on the scan step
  useEffect(() => {
    if (step !== "scan") return;
    let started = false;
    let scanner = null;
    setCameraError("");

    // small delay so React StrictMode's double-mount in dev only starts one camera
    const timer = setTimeout(() => {
      scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (text) => {
            if (handledRef.current) return;
            handledRef.current = true;
            verifyToken(text);
          },
          () => {} // ignore "no QR in frame" noise
        )
        .then(() => {
          started = true;
        })
        .catch(() => {
          setCameraError(
            "Can't access the camera. Allow camera permission (needs HTTPS or localhost), or paste the code below."
          );
        });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scanner && started) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const canConfirm = details && details.is_today && !details.already_checked_in && !busy;

  return (
    <div className="w-full space-y-6 font-['Montserrat',sans-serif] text-white">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
          Check-in Scanner
        </h1>
        <p className="text-xs text-neutral-400">
          Scan a staff member's QR code to verify their assignment and log their arrival.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/60 text-red-400 flex items-center gap-3 text-xs">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: SCAN */}
      {step === "scan" && (
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6 max-w-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-950/50 border border-red-800/60 text-red-500 flex items-center justify-center">
              <QrCode size={18} />
            </div>
            <p className="text-xs font-black uppercase tracking-wider">Point the camera at the QR code</p>
          </div>

          <div
            id={SCANNER_ELEMENT_ID}
            className="w-full min-h-[260px] rounded-xl overflow-hidden bg-black border border-[#1b212f]"
          />

          {cameraError && <p className="text-[11px] text-amber-500">{cameraError}</p>}
          {busy && <p className="text-xs text-neutral-400">Verifying...</p>}

          <div className="border-t border-[#1b212f] pt-5 space-y-3">
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Or paste the QR code text
            </label>
            <textarea
              rows={2}
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="eyJhIjoz..."
              className="w-full bg-[#090b10] border border-[#1e2638] rounded-xl p-3 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500 resize-none"
            />
            <button
              type="button"
              disabled={busy || !manualToken.trim()}
              onClick={() => verifyToken(manualToken)}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Verify
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: REVIEW */}
      {step === "review" && details && (
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-6 md:p-8 space-y-6 max-w-2xl">
          {!details.is_today && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-500 text-xs flex items-center gap-2">
              <AlertTriangle size={14} />
              <span>
                This QR is for {fmtDate(details.date)}. Check-in is only allowed on the event day.
              </span>
            </div>
          )}
          {details.already_checked_in && (
            <div className="p-3 rounded-xl bg-[#0b2419] border border-[#14532d] text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 size={14} />
              <span>Already checked in at {fmtClock(details.checked_in_at)}.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Event</span>
              <h2 className="text-xl font-black uppercase text-white">{details.event_name}</h2>
              <p className="text-xs text-neutral-400">{details.client_name}</p>
            </div>
            <span className="bg-red-950/40 border border-red-900/50 text-red-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded self-start">
              {details.role || "No role set"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs text-neutral-300">
            <div className="flex items-center gap-3">
              <User size={15} className="text-red-500 shrink-0" />
              <span>
                {details.staff_name}{" "}
                <span className="font-mono text-red-500 font-bold">{details.staff_code}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={15} className="text-red-500 shrink-0" />
              <span>{fmtDate(details.date)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={15} className="text-red-500 shrink-0" />
              <span>{fmtRange(details.start_time, details.end_time)}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={15} className="text-red-500 shrink-0" />
              <span>{details.venue}</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
              Equipment ({details.equipment.length})
            </p>
            {details.equipment.length === 0 ? (
              <p className="text-xs text-neutral-500">No equipment attached to this booking.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {details.equipment.map((eq) => (
                  <div
                    key={eq.id}
                    className="p-3 rounded-xl border bg-[#090b10] border-[#181f2e] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{eq.name}</span>
                        <span className="text-[9px] font-bold text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                          {eq.tag}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">{eq.sn}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-400">x{eq.qty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={reset}
              className="py-3 px-5 rounded-xl border border-[#1b212f] text-neutral-400 hover:text-white text-xs font-bold uppercase transition cursor-pointer"
            >
              Scan Another
            </button>
            <button
              type="button"
              disabled={!canConfirm}
              onClick={confirmCheckIn}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition ${
                canConfirm
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-950/50 cursor-pointer"
                  : "bg-[#141926] text-neutral-500 cursor-not-allowed border border-[#1b212f]"
              }`}
            >
              {busy ? "Checking in..." : details.already_checked_in ? "Already Checked In" : "Confirm Check-In"}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DONE */}
      {step === "done" && details && (
        <div className="bg-[#0f121a] border border-[#1b212f] rounded-2xl p-8 text-center space-y-5 max-w-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(34,197,94,0.3)]">
            <Check size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider text-white">Checked In!</h3>
            <p className="text-xs text-neutral-400 mt-1">
              {details.staff_name} is checked in for {details.event_name}.
            </p>
          </div>
          <div className="bg-[#090b10] border border-[#181f2e] rounded-xl p-4 text-xs space-y-2 text-left max-w-sm mx-auto">
            <div className="flex justify-between text-neutral-400">
              <span>Role</span>
              <span className="font-bold text-white">{details.role}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Time</span>
              <span className="font-bold text-white">{fmtClock(details.checked_in_at)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer"
          >
            Scan Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckInScanner;
