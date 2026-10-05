import React, { useState } from "react";
import { Send, CheckCircle2, AlertTriangle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const inputClass =
  "w-full bg-black border border-[#2a3345] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-200";
const labelClass = "block text-[11px] tracking-[0.12em] text-neutral-400 uppercase mb-2";

const EMPTY = { first_name: "", last_name: "", email: "", phone: "", event_type: "", message: "" };

// "Send Us a Message" form. Sends the message to the backend (/contact), which emails it to the
// StreamSync inbox. Used on both the public Home page and the logged-in ClientMain page.
const ContactForm = () => {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // { ok: boolean, text: string }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!form.first_name.trim() || !form.email.trim() || form.message.trim().length < 5) {
      setStatus({ ok: false, text: "Please enter your first name, email, and a message." });
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = Array.isArray(data.detail) ? "Please check the form fields." : data.detail;
        throw new Error(detail || "Your message could not be sent.");
      }
      setForm(EMPTY);
      setStatus({ ok: true, text: "Thank you! Your message was sent. We'll get back to you soon." });
    } catch (err) {
      setStatus({
        ok: false,
        text: err.message === "Failed to fetch" ? "Cannot reach the server. Please try again later." : err.message,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>First Name</label>
          <input type="text" placeholder="Juan" value={form.first_name} onChange={update("first_name")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input type="text" placeholder="Dela Cruz" value={form.last_name} onChange={update("last_name")} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Email Address</label>
          <input type="email" placeholder="juan@example.com" value={form.email} onChange={update("email")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone Number</label>
          <input type="text" placeholder="+63 912 345 6789" value={form.phone} onChange={update("phone")} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Event Type</label>
        <input
          type="text"
          placeholder="e.g. Corporate Conference, Concert, Wedding"
          value={form.event_type}
          onChange={update("event_type")}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Message</label>
        <textarea
          rows={4}
          placeholder="Tell us about your event..."
          value={form.message}
          onChange={update("message")}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            status.ok
              ? "bg-emerald-950/60 border-emerald-600/60 text-emerald-400"
              : "bg-red-950/60 border-red-600/60 text-red-400"
          }`}
        >
          {status.ok ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
          <span>{status.text}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className="group/btn w-full bg-[#ff0000] hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold uppercase tracking-[0.12em] text-xs py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/30 hover:shadow-red-700/40 hover:-translate-y-0.5"
      >
        <span>{sending ? "Sending..." : "Send Message"}</span>
        <Send
          size={15}
          className="transition-transform duration-200 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5"
        />
      </button>
    </form>
  );
};

export default ContactForm;
