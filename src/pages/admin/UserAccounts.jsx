import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../supabaseClient"; // Adjust this relative path if necessary
import {
  Search,
  Filter,
  UserPlus,
  Edit,
  Shield,
  User,
  Briefcase,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

// fetch helper that sends the logged-in admin's token to FastAPI
const authFetch = async (path, options = {}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let res;
  try {
    res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error("Cannot reach the server. Check that the backend is running.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data.detail === "string" ? data.detail : "Request failed");
  }
  return data;
};

const dateOnly = (iso) => (iso ? new Date(iso).toLocaleDateString("en-CA") : "N/A");

const isToday = (iso) => !!iso && new Date(iso).toDateString() === new Date().toDateString();

const timeAgo = (iso) => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "JUST NOW";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} MINUTE${minutes === 1 ? "" : "S"} AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} HOUR${hours === 1 ? "" : "S"} AGO`;
  const days = Math.floor(hours / 24);
  return `${days} DAY${days === 1 ? "" : "S"} AGO`;
};

const capitalize = (s) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : "");

const EMPTY_NEW_USER = { name: "", email: "", role: "STAFF", password: "" };

const UserAccounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [toast, setToast] = useState(null);

  // Edit Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [modalError, setModalError] = useState("");

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState(EMPTY_NEW_USER);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Real accounts from the backend (users table + Supabase Auth)
  const fetchUsers = async () => {
    try {
      const data = await authFetch("/admin/users");
      setUsers(
        data.map((u) => ({
          ...u,
          joined: dateOnly(u.joinedAt),
          lastLogin: dateOnly(u.lastLoginAt),
          initials: (u.name || "?").charAt(0).toUpperCase(),
        }))
      );
      setError("");
    } catch (err) {
      console.error("Failed to load users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEdit = (user) => {
    setModalError("");
    setSelectedUser(user);
    setEditRole(user.role);
    setEditStatus(user.status);
  };

  // Save role / status
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const body = {};
    if (editRole !== selectedUser.role) body.role = editRole.toLowerCase();
    if (editStatus !== selectedUser.status) body.active = editStatus === "ACTIVE";

    if (Object.keys(body).length === 0) {
      setSelectedUser(null);
      return;
    }

    setBusy(true);
    setModalError("");
    try {
      await authFetch(`/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      triggerToast(`Updated account for ${selectedUser.name}`);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // Create a new account (login + users row)
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) return;

    setBusy(true);
    setModalError("");
    try {
      await authFetch("/admin/users", {
        method: "POST",
        body: JSON.stringify({
          name: newUser.name.trim(),
          email: newUser.email.trim(),
          role: newUser.role.toLowerCase(),
          password: newUser.password,
        }),
      });
      setIsAddModalOpen(false);
      setNewUser(EMPTY_NEW_USER);
      triggerToast("User account created!");
      await fetchUsers();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // Filters
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Recent activity built from real account data (sign-ups and last sign-ins)
  const activity = useMemo(() => {
    const events = [];
    users.forEach((u) => {
      if (u.joinedAt) {
        events.push({
          key: `join-${u.id}`,
          at: u.joinedAt,
          title: "NEW USER REGISTERED",
          text: `${u.name} joined as ${capitalize(u.role)}`,
          dot: "bg-green-500",
        });
      }
      if (u.lastLoginAt) {
        events.push({
          key: `login-${u.id}`,
          at: u.lastLoginAt,
          title: "SIGNED IN",
          text: `${u.name} (${capitalize(u.role)}) signed in`,
          dot: "bg-blue-500",
        });
      }
    });
    return events.sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 5);
  }, [users]);

  const renderRoleBadge = (role) => {
    switch (role) {
      case "CLIENT":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-green-900/50 text-green-500 bg-green-950/20">{role}</span>;
      case "STAFF":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-blue-900/50 text-blue-500 bg-blue-950/20">{role}</span>;
      case "ADMIN":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-purple-900/50 text-purple-400 bg-purple-950/20 inline-flex items-center gap-1"><Shield size={10} /> {role}</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-neutral-700 text-neutral-400 bg-neutral-800">{role}</span>;
    }
  };

  const renderStatusBadge = (status) => {
    if (status === "ACTIVE") {
      return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-[#152e18] text-[#4ade80]">{status}</span>;
    }
    return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-neutral-800 text-neutral-400">{status}</span>;
  };

  return (
    <div className="w-full max-w-6xl font-sans space-y-6 relative">

      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-red-600 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-red-500 animate-bounce">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* Top Main Panel */}
      <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 md:p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-white uppercase tracking-wide">
            USER ACCOUNTS
          </h1>
          <button
            onClick={() => {
              setModalError("");
              setNewUser(EMPTY_NEW_USER);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#ff0000] hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors shrink-0 shadow-lg shadow-red-900/20"
          >
            <UserPlus size={16} /> ADD USER
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-900/60 text-red-400 flex items-center gap-3 text-xs">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5">
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">TOTAL USERS</p>
            <p className="text-3xl font-black text-white">{users.length}</p>
          </div>
          <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5">
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">CLIENTS</p>
            <p className="text-3xl font-black text-green-500">{users.filter((u) => u.role === "CLIENT").length}</p>
          </div>
          <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5">
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">STAFF</p>
            <p className="text-3xl font-black text-blue-500">{users.filter((u) => u.role === "STAFF").length}</p>
          </div>
          <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5">
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">ACTIVE TODAY</p>
            <p className="text-3xl font-black text-purple-500">{users.filter((u) => isToday(u.lastLoginAt)).length}</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] border border-neutral-800 text-sm text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-neutral-500 hidden sm:block" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-[#161616] border border-neutral-800 text-xs font-bold text-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors w-full sm:w-auto"
            >
              <option value="ALL">ALL ROLES</option>
              <option value="CLIENT">CLIENTS</option>
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMINS</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] uppercase font-bold text-neutral-500 border-b border-neutral-800">
              <tr>
                <th className="pb-4 px-2">USER</th>
                <th className="pb-4 px-2">ROLE</th>
                <th className="pb-4 px-2">STATUS</th>
                <th className="pb-4 px-2">JOINED</th>
                <th className="pb-4 px-2">LAST LOGIN</th>
                <th className="pb-4 px-2 text-center">BOOKINGS</th>
                <th className="pb-4 px-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-neutral-500 text-xs uppercase font-bold">Loading accounts...</td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="text-neutral-300 hover:bg-[#161616] transition-colors group">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ff0000] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {user.initials}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm leading-tight">
                            {user.name}
                            {user.isSelf && <span className="ml-2 text-[9px] text-neutral-500 font-bold uppercase">(you)</span>}
                          </p>
                          <p className="text-xs text-neutral-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">{renderRoleBadge(user.role)}</td>
                    <td className="py-4 px-2">{renderStatusBadge(user.status)}</td>
                    <td className="py-4 px-2 text-xs text-neutral-400">{user.joined}</td>
                    <td className="py-4 px-2 text-xs text-neutral-400">{user.lastLogin}</td>
                    <td className="py-4 px-2 text-center font-bold text-white">
                      {user.bookings !== null ? user.bookings : <span className="text-neutral-600">--</span>}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button
                        onClick={() => openEdit(user)}
                        title="Edit account"
                        className="text-blue-500 hover:text-blue-400 p-1 transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-neutral-500 text-xs uppercase font-bold">No user accounts found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Layout - Role Permissions & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Role Permissions Box */}
        <div className="bg-[#ff0000] rounded-2xl p-8 shadow-xl shadow-red-900/20">
          <h2 className="text-white font-bold tracking-wide uppercase mb-6 text-lg">
            ROLE PERMISSIONS
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-3 text-white border-b border-red-700/50 pb-5">
              <Shield size={18} className="mt-0.5 shrink-0" />
              <div>
                <h3 className="font-bold text-sm tracking-wider uppercase mb-1">ADMIN</h3>
                <p className="text-xs text-white/90 leading-relaxed font-medium">Full system access, manage all users and bookings</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-white border-b border-red-700/50 pb-5">
              <Briefcase size={18} className="mt-0.5 shrink-0" />
              <div>
                <h3 className="font-bold text-sm tracking-wider uppercase mb-1">STAFF</h3>
                <p className="text-xs text-white/90 leading-relaxed font-medium">Manage schedules, equipment checklists, field operations</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <User size={18} className="mt-0.5 shrink-0" />
              <div>
                <h3 className="font-bold text-sm tracking-wider uppercase mb-1">CLIENT</h3>
                <p className="text-xs text-white/90 leading-relaxed font-medium">Book services, view bookings, access main website</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Box (from real account data) */}
        <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-white font-bold tracking-wide uppercase mb-6 text-lg">
            RECENT ACTIVITY
          </h2>
          <div className="space-y-4">
            {activity.length === 0 ? (
              <p className="text-xs text-neutral-500">No recent activity yet.</p>
            ) : (
              activity.map((ev) => (
                <div key={ev.key} className="bg-[#161616] border border-neutral-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${ev.dot}`}></div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{ev.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-400 pl-3.5 mb-2">{ev.text}</p>
                  <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest pl-3.5">{timeAgo(ev.at)}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* EDIT USER MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-1">Edit Account Details</h2>
            <p className="text-xs text-neutral-500 mb-4">{selectedUser.name} ({selectedUser.email})</p>

            {selectedUser.isSelf && (
              <div className="mb-4 p-3 rounded-xl bg-yellow-950/20 border border-yellow-900/50 text-yellow-500 text-xs">
                This is your own account. You can't change your own role or status.
              </div>
            )}

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/30 border border-red-900/60 text-red-400 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Role</label>
                <select
                  value={editRole}
                  disabled={selectedUser.isSelf}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600 disabled:opacity-50"
                >
                  <option value="CLIENT">CLIENT</option>
                  <option value="STAFF">STAFF</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Status</label>
                <select
                  value={editStatus}
                  disabled={selectedUser.isSelf}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600 disabled:opacity-50"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE (cannot sign in)</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={busy || selectedUser.isSelf}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase py-3 rounded-lg tracking-wide transition-colors disabled:opacity-50"
              >
                {busy ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-4">Add User Account</h2>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/30 border border-red-900/60 text-red-400 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Alex Cruz"
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Assigned Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                >
                  <option value="CLIENT">CLIENT</option>
                  <option value="STAFF">STAFF</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Password</label>
                <input
                  required
                  type="text"
                  minLength={8}
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Share this password with the user securely. It is not shown again.
                </p>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase py-3 rounded-lg tracking-wide transition-colors disabled:opacity-50"
              >
                {busy ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserAccounts;
