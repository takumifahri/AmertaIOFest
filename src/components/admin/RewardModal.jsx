"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSave, FaTicketAlt, FaGift, FaHandHoldingHeart, FaLeaf, FaGem, FaStar } from "react-icons/fa";
import * as Icons from "react-icons/fa";

export default function RewardModal({ isOpen, onClose, editingItem, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cost: 0,
    type: "VOUCHERS",
    icon: "FaTicketAlt",
    color: "from-blue-600 to-indigo-500",
    tag: "",
    rarity: "Common",
    isActive: true,
    value: 0
  });

  const iconOptions = [
    { name: "Ticket", value: "FaTicketAlt", icon: <FaTicketAlt /> },
    { name: "Gift", value: "FaGift", icon: <FaGift /> },
    { name: "Charity", value: "FaHandHoldingHeart", icon: <FaHandHoldingHeart /> },
    { name: "Leaf", value: "FaLeaf", icon: <FaLeaf /> },
    { name: "Gem", value: "FaGem", icon: <FaGem /> },
    { name: "Star", value: "FaStar", icon: <FaStar /> },
  ];

  const colorOptions = [
    { name: "Blue", value: "from-blue-600 via-cyan-400 to-indigo-500" },
    { name: "Gold", value: "from-amber-400 via-yellow-300 to-orange-500" },
    { name: "Purple", value: "from-purple-600 via-pink-400 to-rose-500" },
    { name: "Green", value: "from-green-600 via-emerald-400 to-teal-500" },
    { name: "Orange", value: "from-orange-600 via-amber-400 to-yellow-500" },
  ];

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || "",
        description: editingItem.description || "",
        cost: editingItem.cost || 0,
        type: editingItem.type || "VOUCHERS",
        icon: editingItem.icon || "FaTicketAlt",
        color: editingItem.color || "from-blue-600 to-indigo-500",
        tag: editingItem.tag || "",
        rarity: editingItem.rarity || "Common",
        isActive: editingItem.isActive !== undefined ? editingItem.isActive : true,
        value: editingItem.value || 0
      });
    } else {
      setFormData({
        title: "",
        description: "",
        cost: 0,
        type: "VOUCHERS",
        icon: "FaTicketAlt",
        color: "from-blue-600 via-cyan-400 to-indigo-500",
        tag: "",
        rarity: "Common",
        isActive: true,
        value: 0
      });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              {editingItem ? "Edit Reward" : "Tambah Reward Baru"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
              <FaTimes size={20} />
            </button>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} 
            className="p-8 space-y-6 max-h-[70vh] overflow-y-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">Judul Reward</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary transition-all"
                  placeholder="Contoh: Voucher Diskon 10k"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">Biaya (Amerta Coins)</label>
                <input 
                  type="number" 
                  required
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="col-span-full space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">Deskripsi</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary transition-all h-24 resize-none"
                  placeholder="Jelaskan detail reward ini..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">Nilai (Rp / Diskon)</label>
                <input 
                  type="number" 
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary transition-all"
                  placeholder="Contoh: 10000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">Tipe</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary transition-all appearance-none"
                >
                  <option value="VOUCHERS">VOUCHER</option>
                  <option value="CHARITY">DONASI / CHARITY</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">Rarity</label>
                <select 
                  value={formData.rarity}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary transition-all appearance-none"
                >
                  <option value="Common">Biasa (Common)</option>
                  <option value="Rare">Langka (Rare)</option>
                  <option value="Epic">Epik (Epic)</option>
                  <option value="Legendary">Legendaris (Legendary)</option>
                </select>
              </div>

              <div className="col-span-full space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">Pilih Icon</label>
                <div className="flex flex-wrap gap-3">
                  {iconOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: opt.value })}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        formData.icon === opt.value ? "bg-primary text-white scale-110" : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {opt.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-full space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">Pilih Tema Warna</label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: opt.value })}
                      className={`h-10 px-4 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.color === opt.value ? "ring-2 ring-primary scale-105" : "opacity-60 hover:opacity-100"
                      } bg-gradient-to-r ${opt.value} text-white`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">Tag / Badge (Opsional)</label>
                <input 
                  type="text" 
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary transition-all"
                  placeholder="Contoh: POPULER, TERBATAS"
                />
              </div>

              <div className="flex items-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${formData.isActive ? "bg-primary" : "bg-gray-600"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${formData.isActive ? "right-1" : "left-1"}`} />
                </button>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Aktif di Toko</span>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary-light disabled:opacity-50 text-white py-5 rounded-[22px] font-black uppercase tracking-[3px] text-xs transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FaSave /> {editingItem ? "Update Reward" : "Simpan Reward"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-5 rounded-[22px] font-black uppercase tracking-[3px] text-xs transition-all"
              >
                Batal
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
