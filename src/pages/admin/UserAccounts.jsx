import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Adjust this relative path if necessary
import { 
  Search, 
  Filter, 
  UserPlus, 
  Edit, 
  Shield, 
  User, 
  Briefcase,
  Activity,
  X,
  CheckCircle2
} from "lucide-react";

const UserAccounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [toast, setToast] = useState(null);

  // Edit Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("");

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "CLIENT" });

  const mockUsers = [
    { id: "1", name: "John Doe", email: "john.doe@example.com", role: "CLIENT", status: "ACTIVE", joined: "2026-01-15", lastLogin: "2026-05-14", bookings: 3, initials: "J" },
    { id: "2", name: "Jane Smith", email: "jane.smith@livestreammanila.ph", role: "STAFF", status: "ACTIVE", joined: "2025-06-20", lastLogin: "2026-05-15", bookings: null, initials: "J" },
    { id: "3", name: "Admin User", email: "admin@livestreammanila.ph", role: "ADMIN", status: "ACTIVE", joined: "2025-01-01", lastLogin: "2026-05-15", bookings: null, initials: "A" },
    { id: "4", name: "Maria Santos", email: "maria@example.com", role: "CLIENT", status: "ACTIVE", joined: "2026-02-10", lastLogin: "2026-05-12", bookings: 1, initials: "M" },
    { id: "5", name: "Carlos Reyes", email: "carlos@livestreammanila.ph", role: "STAFF", status: "ACTIVE", joined: "2025-08-15", lastLogin: "2026-05-13", bookings: null, initials: "C" },
    { id: "6", name: "Inactive User", email: "inactive@example.com", role: "CLIENT", status: "INACTIVE", joined: "2025-12-01", lastLogin: "2026-03-20", bookings: 0, initials: "I" },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Fetch profiles alongside booking counts
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          full_name,
          email,
          role,
          status,
          created_at,
          last_login,
          bookings ( count )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedData = data.map((u) => {
          const userName = u.name || u.full_name || u.email.split('@')[0];
          const userRole = (u.role || 'CLIENT').toUpperCase();
          const userBookings = userRole === 'CLIENT' 
            ? (u.bookings && u.bookings[0] ? u.bookings[0].count : 0) 
            : null;

          return {
            id: u.id,
            name: userName,
            email: u.email,
            role: userRole,
            status: (u.status || 'ACTIVE').toUpperCase(),
            joined: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : 'N/A',
            lastLogin: u.last_login ? new Date(u.last_login).toISOString().split('T')[0] : 'N/A',
            bookings: userBookings,
            initials: userName.charAt(0).toUpperCase()
          };
        });
        setUsers(formattedData);
      } else {
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error("Supabase Fetch Error:", error.message);
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  // Update Role or Status in Supabase
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: editRole,
          status: editStatus
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: editRole, status: editStatus } : u));
      setSelectedUser(null);
      triggerToast(`Updated profile for ${selectedUser.name}`);
    } catch (error) {
      console.error("Update error:", error.message);
      // Fallback local UI update if offline
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: editRole, status: editStatus } : u));
      setSelectedUser(null);
      triggerToast(`Local update applied for ${selectedUser.name}`);
    }
  };

  // Add New User Record
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.email) return;

    const newRecord = {
      name: newUser.name || newUser.email.split('@')[0],
      email: newUser.email,
      role: newUser.role,
      status: "ACTIVE"
    };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([newRecord])
        .select();

      if (error) throw error;

      fetchUsers();
      setIsAddModalOpen(false);
      setNewUser({ name: "", email: "", role: "CLIENT" });
      triggerToast("User account created!");
    } catch (error) {
      console.error("Add user error:", error.message);
      // Local fallback insert
      const fallbackEntry = {
        id: String(Date.now()),
        name: newRecord.name,
        email: newRecord.email,
        role: newRecord.role,
        status: "ACTIVE",
        joined: new Date().toISOString().split('T')[0],
        lastLogin: "N/A",
        bookings: newRecord.role === "CLIENT" ? 0 : null,
        initials: newRecord.name.charAt(0).toUpperCase()
      };
      setUsers([fallbackEntry, ...users]);
      setIsAddModalOpen(false);
      setNewUser({ name: "", email: "", role: "CLIENT" });
      triggerToast("User added to current view");
    }
  };

  // Filters
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const renderRoleBadge = (role) => {
    switch(role) {
      case "CLIENT":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-green-900/50 text-green-500 bg-green-950/20">{role}</span>;
      case "STAFF":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-blue-900/50 text-blue-500 bg-blue-950/20">{role}</span>;
      case "ADMIN":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border border-purple-900/50 text-purple-400 bg-purple-950/20 flex items-center gap-1"><Shield size={10} /> {role}</span>;
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
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#ff0000] hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors shrink-0 shadow-lg shadow-red-900/20"
          >
            <UserPlus size={16} /> ADD USER
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5">
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">TOTAL USERS</p>
            <p className="text-3xl font-black text-white">{users.length}</p>
          </div>
          <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5">
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">CLIENTS</p>
            <p className="text-3xl font-black text-green-500">{users.filter(u => u.role === 'CLIENT').length}</p>
          </div>
          <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5">
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">STAFF</p>
            <p className="text-3xl font-black text-blue-500">{users.filter(u => u.role === 'STAFF').length}</p>
          </div>
          <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5">
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">ACTIVE TODAY</p>
            <p className="text-3xl font-black text-purple-500">{users.filter(u => u.status === 'ACTIVE').length}</p>
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
                  <td colSpan="7" className="py-8 text-center text-neutral-500 text-xs uppercase font-bold">Loading profiles from database...</td>
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
                          <p className="font-bold text-white text-sm leading-tight">{user.name}</p>
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
                        onClick={() => {
                          setSelectedUser(user);
                          setEditRole(user.role);
                          setEditStatus(user.status);
                        }}
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

        {/* Recent Activity Box */}
        <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-white font-bold tracking-wide uppercase mb-6 text-lg">
            RECENT ACTIVITY
          </h2>
          <div className="space-y-4">
            <div className="bg-[#161616] border border-neutral-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">NEW USER REGISTERED</h3>
              </div>
              <p className="text-sm text-neutral-400 pl-3.5 mb-2">Maria Santos joined as Client</p>
              <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest pl-3.5">2 HOURS AGO</p>
            </div>

            <div className="bg-[#161616] border border-neutral-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">ROLE UPDATED</h3>
              </div>
              <p className="text-sm text-neutral-400 pl-3.5 mb-2">Carlos Reyes promoted to Staff</p>
              <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest pl-3.5">1 DAY AGO</p>
            </div>

            <div className="bg-[#161616] border border-neutral-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">ACCOUNT DEACTIVATED</h3>
              </div>
              <p className="text-sm text-neutral-400 pl-3.5 mb-2">Inactive User account suspended</p>
              <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest pl-3.5">3 DAYS AGO</p>
            </div>
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
            
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Role</label>
                <select 
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
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
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-[#161616] border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase py-3 rounded-lg tracking-wide transition-colors">
                Save Changes
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
            <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-4">Add User Record</h2>
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
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase py-3 rounded-lg tracking-wide transition-colors">
                Create User
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserAccounts;