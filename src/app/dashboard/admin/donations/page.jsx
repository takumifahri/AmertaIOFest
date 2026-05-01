"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  FaCheck, FaTimes, FaHourglassHalf, FaTruck,
  FaFilter, FaSearch, FaUser, FaBuilding,
  FaCoins, FaImages, FaEye, FaExclamationTriangle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_CONFIG = {
  PENDING: { label: "Menunggu", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  ONGOING: { label: "Diproses", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  COMPLETED: { label: "Selesai", color: "text-primary bg-primary/10 border-primary/20" },
  CANCELLED: { label: "Dibatalkan", color: "text-red-500 bg-red-500/10 border-red-500/20" },
};

const STORAGE_URL = process.env.NEXT_PUBLIC_API_STORAGE_URL || "http://localhost:3001";

export default function AdminDonationPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, type: null });

  useEffect(() => {
    fetchDonations();
  }, [filterStatus]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const url = filterStatus === "ALL" ? "/donation/all" : `/donation/all?status=${filterStatus}`;
      const res = await api.get(url);
      setDonations(res.data.data);
    } catch (err) {
      toast.error("Gagal mengambil data donasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/donation/${id}/status`, { status: newStatus });
      toast.success(`Status diperbarui ke ${newStatus}`);
      fetchDonations();
      setConfirmModal({ show: false, id: null, type: null });
    } catch (err) {
      toast.error("Gagal memperbarui status.");
    }
  };

  const filteredDonations = donations.filter(d =>
    d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.description?.toLowerCase().includes(search.toLowerCase())
  );

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${STORAGE_URL}${url}`;
  };

  const openConfirmModal = (id, type) => {
    setConfirmModal({ show: true, id, type });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 text-foreground selection:bg-primary selection:text-white transition-colors duration-300">
      <div className="max-w-8xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              DASHBOARD <span className="text-primary italic">DONASI</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">Monitoring dan manajemen alur masuk pakaian limbah secara real-time.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari donatur atau deskripsi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-primary transition-all shadow-sm font-bold"
              />
            </div>
            <div className="flex bg-surface p-1 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm w-full sm:w-auto">
              {["ALL", "PENDING", "ONGOING", "COMPLETED"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? "bg-primary text-white" : "text-gray-400 hover:text-primary"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Donasi", val: donations.length, color: "text-blue-500" },
            { label: "Pending", val: donations.filter(d => d.status === "PENDING").length, color: "text-yellow-500" },
            { label: "Selesai", val: donations.filter(d => d.status === "COMPLETED").length, color: "text-primary" },
            { label: "Poin Diberikan", val: donations.filter(d => d.status === "COMPLETED").reduce((acc, curr) => acc + curr.points, 0), color: "text-accent" },
          ].map((stat, i) => (
            <div key={i} className="bg-surface border border-gray-200 dark:border-white/10 p-6 rounded-[24px] shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 mb-1">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.val.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Modern Data Table */}
        <div className="bg-surface border border-gray-200 dark:border-white/10 rounded-[32px] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-[2px] text-gray-400">Barang</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[2px] text-gray-400">Donatur</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[2px] text-gray-400">Tujuan</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[2px] text-gray-400">Kualitas</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[2px] text-gray-400">Poin</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[2px] text-gray-400">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[2px] text-gray-400 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="p-6"><div className="h-12 bg-gray-100 dark:bg-white/5 rounded-2xl w-full" /></td>
                    </tr>
                  ))
                ) : filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 shrink-0 border border-gray-200 dark:border-white/10">
                          {donation.images?.[0] ? (
                            <img src={getImageUrl(donation.images[0].url)} className="w-full h-full object-cover" alt="Item" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300"><FaImages /></div>
                          )}
                        </div>
                        <div className="max-w-[200px]">
                          <p className="text-xs font-bold text-foreground truncate">{donation.description || "Tanpa deskripsi"}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(donation.createdAt).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                          {donation.user?.name?.charAt(0) || <FaUser />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{donation.user?.name || "Anonim"}</p>
                          <p className="text-[10px] text-gray-500">{donation.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <FaBuilding className="text-accent" />
                        {donation.company?.name || "Pusat Amerta"}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[10px] font-black px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 uppercase tracking-widest text-gray-500">
                        {donation.grade}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-1.5 font-black text-primary text-xs">
                        <FaCoins size={10} />
                        +{donation.points}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_CONFIG[donation.status]?.color}`}>
                        {STATUS_CONFIG[donation.status]?.label}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {donation.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(donation.id, "ONGOING")}
                              title="Terima & Proses"
                              className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                            >
                              <FaTruck size={14} />
                            </button>
                            <button
                              onClick={() => openConfirmModal(donation.id, "CANCELLED")}
                              title="Tolak Donasi"
                              className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                            >
                              <FaTimes size={14} />
                            </button>
                          </>
                        )}
                        {donation.status === "ONGOING" && (
                          <button
                            onClick={() => openConfirmModal(donation.id, "COMPLETED")}
                            title="Selesaikan"
                            className="px-4 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                          >
                            <FaCheck /> Selesai
                          </button>
                        )}
                        <button className="p-3 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-xl hover:text-foreground transition-all">
                          <FaEye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && filteredDonations.length === 0 && (
            <div className="text-center py-24">
              <FaHourglassHalf className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Data tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setConfirmModal({ show: false, id: null, type: null })}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative bg-surface border border-gray-200 dark:border-white/10 rounded-[40px] p-10 max-w-md w-full shadow-2xl"
            >
               <div className={`w-20 h-20 rounded-3xl mb-8 flex items-center justify-center ${confirmModal.type === 'CANCELLED' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                  <FaExclamationTriangle size={40} />
               </div>
               
               <h2 className="text-3xl font-black tracking-tighter uppercase mb-4 text-foreground">
                  Konfirmasi <span className={confirmModal.type === 'CANCELLED' ? 'text-red-500' : 'text-primary italic'}>Aksi</span>
               </h2>
               
               <p className="text-gray-500 font-medium leading-relaxed mb-10">
                  {confirmModal.type === 'CANCELLED' 
                    ? "Apakah Anda yakin ingin menolak donasi ini? Tindakan ini tidak dapat dibatalkan."
                    : "Pastikan semua pakaian telah diverifikasi kualitasnya sebelum menyelesaikan donasi ini."}
               </p>
               
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setConfirmModal({ show: false, id: null, type: null })}
                    className="py-4 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-foreground transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(confirmModal.id, confirmModal.type)}
                    className={`py-4 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 ${confirmModal.type === 'CANCELLED' ? 'bg-red-500 shadow-red-500/20' : 'bg-primary shadow-primary/20'}`}
                  >
                    Ya, {confirmModal.type === 'CANCELLED' ? 'Tolak' : 'Selesaikan'}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
