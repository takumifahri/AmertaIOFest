"use client";

import { useState, useEffect } from "react";
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, 
  FaCoins, FaGift, FaChevronRight, FaStar,
  FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import * as Icons from "react-icons/fa";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import RewardModal from "@/components/admin/RewardModal";

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rewards/admin");
      setRewards(res.data.data);
    } catch (err) {
      toast.error("Gagal mengambil data reward");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (reward = null) => {
    setEditingReward(reward);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReward(null);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingReward) {
        await api.patch(`/rewards/${editingReward.id}`, formData);
        toast.success("Reward berhasil diperbarui");
      } else {
        await api.post("/rewards", formData);
        toast.success("Reward baru ditambahkan");
      }
      handleCloseModal();
      fetchRewards();
    } catch (err) {
      toast.error(editingReward ? "Gagal memperbarui reward" : "Gagal menambah reward");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus reward ini?")) return;
    try {
      await api.delete(`/rewards/${id}`);
      toast.success("Reward berhasil dihapus");
      fetchRewards();
    } catch (err) {
      toast.error("Gagal menghapus reward");
    }
  };

  const filteredRewards = rewards.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 animate-fade-in-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
              <FaGift size={24} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic">Kelola Rewards</h1>
              <p className="text-gray-500 font-medium text-sm">Atur item penukaran poin untuk user di Amerta Vault.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-[22px] font-black uppercase tracking-[2px] text-xs transition-all shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95"
        >
          <FaPlus /> Tambah Reward
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative flex-1 group">
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Cari reward..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[22px] py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Grid Storefront Preview for Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-white/5 animate-pulse rounded-[40px]" />
          ))
        ) : filteredRewards.length > 0 ? (
          filteredRewards.map((reward) => {
            const IconComponent = reward.icon && Icons[reward.icon] ? Icons[reward.icon] : Icons.FaGift;
            return (
              <div 
                key={reward.id} 
                className={`relative bg-surface border border-white/5 rounded-[40px] overflow-hidden shadow-xl transition-all ${!reward.isActive && 'opacity-60 grayscale'}`}
              >
                <div className={`h-2 bg-gradient-to-r ${reward.color || 'from-primary to-primary-light'}`} />
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${reward.color || 'from-primary to-primary-light'} flex items-center justify-center text-white text-2xl shadow-lg`}>
                       <IconComponent />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase text-gray-400">
                         {reward.rarity}
                       </span>
                       {!reward.isActive && (
                         <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[8px] font-black uppercase">NONAKTIF</span>
                       )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-1">{reward.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2">{reward.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-primary">
                      <FaCoins size={12} />
                      <span className="text-xl font-black tracking-tighter">{reward.cost}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenModal(reward)}
                        className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button 
                        onClick={() => handleDelete(reward.id)}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
            <FaGift size={40} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-500 font-bold uppercase tracking-[3px] text-xs">Belum ada reward yang dibuat</p>
          </div>
        )}
      </div>

      <RewardModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingItem={editingReward}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
