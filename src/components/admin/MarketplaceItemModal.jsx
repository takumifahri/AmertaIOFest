"use client";

import { useState, useEffect } from "react";
import {
  FaTimes, FaCloudUploadAlt, FaCheckCircle, FaTag, FaCoins, FaInfoCircle, FaLayerGroup
} from "react-icons/fa";
import { getImageUrl } from "@/lib/imageUrl";

export default function MarketplaceItemModal({
  isOpen,
  onClose,
  editingItem,
  onSubmit,
  isSubmitting
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "CLOTHING",
    points: "0",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (editingItem && isOpen) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price.toString(),
        stock: editingItem.stock.toString(),
        category: editingItem.category || "CLOTHING",
        points: (editingItem.points || 0).toString(),
      });
      setPreviewImages(editingItem.images?.map(img => getImageUrl(img.url)) || []);
      setSelectedImages([]);
    } else if (!editingItem && isOpen) {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "CLOTHING",
        points: "0",
      });
      setPreviewImages([]);
      setSelectedImages([]);
    }
  }, [editingItem, isOpen]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, selectedImages);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop with Heavy Blur */}
      <div
        className="absolute h-full inset-0 bg-black/85 backdrop-blur-8xl animate-in fade-in duration-500 translate-y-30"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0a0f0c] border border-gray-100 dark:border-white/10 rounded-[48px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-700 max-h-[90vh] flex flex-col lg:translate-y-30 md:translate-y-60 translate-y-20">

        {/* Header Section */}
        <header className="px-10 py-12 border-b border-gray-50 dark:border-white/5 flex items-start justify-between shrink-0 bg-gradient-to-b from-white/5 to-transparent">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[2px] border border-primary/20">
                Amerta Admin
              </span>
            </div>
            <h2 className="text-4xl font-black text-foreground dark:text-white uppercase italic tracking-tighter leading-none">
              {editingItem ? "Edit Katalog" : "Tambah Barang"}
            </h2>
            <p className="text-gray-500 text-sm font-medium">Lengkapi informasi detail produk untuk dipublikasikan ke marketplace.</p>
          </div>
          <button
            onClick={onClose}
            className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-90 group"
          >
            <FaTimes className="text-lg group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </header>

        {/* Scrollable Form Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar px-10 pt-10 pb-20 space-y-12">

          {/* Section 1: Media */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <FaCloudUploadAlt size={14} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[3px] text-foreground/50">Media & Dokumentasi</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {previewImages.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-[28px] overflow-hidden group border border-white/5 bg-white/5 shadow-inner">
                  <img src={src} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="w-10 h-10 bg-red-500 text-white rounded-2xl flex items-center justify-center transition-all scale-75 group-hover:scale-100 hover:bg-red-600 shadow-lg"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <label className="aspect-square rounded-[28px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-gray-500 hover:text-primary group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FaCloudUploadAlt size={24} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">Tambah Foto</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            </div>
          </section>

          {/* Section 2: General Info */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                <FaInfoCircle size={14} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[3px] text-foreground/50">Informasi Utama</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 ml-2">Nama Produk</label>
                <div className="relative group">
                  <FaTag className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    required
                    type="text"
                    placeholder="E.g: Upcycled Patchwork Kimono"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-white/[0.03] border border-transparent rounded-[24px] py-6 pl-16 pr-8 text-sm font-bold focus:outline-none focus:border-primary/30 transition-all focus:bg-white/[0.07] shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 ml-2">Kategori Koleksi</label>
                <div className="relative group">
                  <FaLayerGroup className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-white/[0.03] border border-transparent rounded-[24px] py-6 pl-16 pr-10 text-sm font-black uppercase tracking-[2px] focus:outline-none focus:border-primary/30 transition-all cursor-pointer appearance-none focus:bg-white/[0.07] shadow-inner"
                  >
                    <option value="CLOTHING">Pakaian / Apparel</option>
                    <option value="ACCESSORIES">Aksesoris / Tas</option>
                    <option value="UPCYCLED">Upcycled Special</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 ml-2">Harga Retail (Rp)</label>
                <input
                  required
                  type="number"
                  placeholder="Set harga jual..."
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-white/[0.03] border border-transparent rounded-[24px] py-6 px-8 text-sm font-bold focus:outline-none focus:border-primary/30 transition-all focus:bg-white/[0.07] shadow-inner"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 ml-2">Jumlah Stok</label>
                <input
                  required
                  type="number"
                  placeholder="Ketersediaan unit..."
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-white/[0.03] border border-transparent rounded-[24px] py-6 px-8 text-sm font-bold focus:outline-none focus:border-primary/30 transition-all focus:bg-white/[0.07] shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 ml-2">Deskripsi Detail Produk</label>
              <textarea
                required
                rows="5"
                placeholder="Jelaskan material, ukuran, dan nilai keberlanjutan produk ini..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-transparent rounded-[32px] py-6 px-8 text-sm font-bold focus:outline-none focus:border-primary/30 transition-all resize-none focus:bg-white/[0.07] shadow-inner leading-relaxed"
              />
            </div>
          </section>

          {/* Section 3: Gamification */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <FaCoins size={14} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[3px] text-foreground/50">Reward Gamification</h3>
            </div>

            <div className="space-y-4">
              <div className="relative group max-w-sm">
                <FaCoins className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="number"
                  placeholder="Points to award (AC)"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-white/[0.03] border border-transparent rounded-[24px] py-6 pl-16 pr-8 text-sm font-bold focus:outline-none focus:border-primary/30 transition-all focus:bg-white/[0.07] shadow-inner"
                />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic ml-2">
                *Jumlah Amerta Coins yang didapat pembeli setelah pesanan selesai.
              </p>
            </div>
          </section>
        </form>

        {/* Action Footer */}
        <footer className="p-10 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-50 dark:border-white/5 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-light disabled:bg-gray-800 text-white py-7 rounded-[32px] text-[14px] font-black uppercase tracking-[6px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="opacity-50">Memproses...</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="text-lg group-hover:scale-125 transition-transform" />
                <span>{editingItem ? "Konfirmasi Update" : "Publikasikan Barang"}</span>
              </>
            )}
          </button>
        </footer>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
}
