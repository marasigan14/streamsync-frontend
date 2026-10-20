// Small helpers for calling the FastAPI backend with the logged-in user's token.
import { supabase } from "../supabaseClient";

export const API_URL = (import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export const authHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Not logged in");
  return { Authorization: `Bearer ${session.access_token}` };
};

/** fetch JSON from the backend; throws Error(detail) on a non-2xx response. */
export const apiFetch = async (path, { method = "GET", body, auth = true } = {}) => {
  const headers = auth ? await authHeaders() : {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail.map((d) => d.msg).join(", ")
      : data.detail;
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return data;
};

/** Download a file (PDF / Excel / CSV) from an authenticated endpoint. */
export const apiDownload = async (path, fallbackName = "download") => {
  const res = await fetch(`${API_URL}${path}`, { headers: await authHeaders() });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || `Download failed (${res.status})`);
  }
  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="?([^";]+)"?/);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = match ? match[1] : fallbackName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const peso = (amount) =>
  `₱${Number(amount || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Today's date in the Philippines as YYYY-MM-DD (for <input type="date" min>). */
export const todayPH = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(new Date());
