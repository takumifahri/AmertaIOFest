"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaUserShield, FaUserTimes, FaCheckCircle, FaTrashAlt, FaEllipsisV } from "react-icons/fa";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/imageUrl";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/management/users?search=${search}&page=${page}`);
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error("Gagal mengambil data user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, page]);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/admin/management/users/${userId}/status`, { is_active: !currentStatus });
      toast.success(`User berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}.`);
      fetchUsers();
    } catch (err) {
      toast.error("Gagal mengubah status user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;
    try {
      await api.delete(`/admin/management/users/${userId}`);
      toast.success("User berhasil dihapus.");
      fetchUsers();
    } catch (err) {
      toast.error("Gagal menghapus user.");
    }
  };

  return (
    <div className="p-8 max-w-8xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground uppercase tracking-tight italic">Manajemen User</h1>
          <p className="text-gray-500 text-sm">Kelola akses dan status pengguna platform Amerta.</p>
        </div>
        
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Cari nama atau email..."
            className="pl-12 pr-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl w-full md:w-80 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Terdaftar</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-6">
                      <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-xl w-full"></div>
                    </td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20">
                          {user.profilePicture ? (
                            <img src={getImageUrl(user.profilePicture)} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{user.name || "No Name"}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 
                        user.role === 'COMPANY' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {user.is_active ? "Aktif" : "Non-aktif"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleToggleStatus(user.id, user.is_active)}
                          className={`p-2 rounded-lg transition-all ${
                            user.is_active 
                            ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10' 
                            : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10'
                          }`}
                          title={user.is_active ? "Nonaktifkan" : "Aktifkan"}
                        >
                          {user.is_active ? <FaUserShield size={16} /> : <FaCheckCircle size={16} />}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                          title="Hapus User"
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Tidak ada user yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Menampilkan {users.length} dari {pagination.total} user
            </p>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Prev
              </button>
              <button 
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold disabled:opacity-50 shadow-md shadow-primary/20 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
