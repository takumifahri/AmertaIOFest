"use client";

import { useState, useEffect } from "react";
import { 
  FaPlus, FaEdit, FaTrash, FaArchive, FaBoxOpen, 
  FaSearch, FaCheckCircle, FaTimesCircle,
  FaImage, FaCoins, FaWarehouse
} from "react-icons/fa";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/imageUrl";
import MarketplaceItemModal from "@/components/admin/MarketplaceItemModal";

export default function AdminMarketplacePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/management/marketplace/items");
      setItems(res.data.data);
    } catch (err) {
      toast.error("Gagal mengambil data barang");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (formData, selectedImages) => {
    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    data.append("points", formData.points);
    
    selectedImages.forEach(image => {
      data.append("images", image);
    });

    try {
      if (editingItem) {
        await api.put(`/admin/management/marketplace/items/${editingItem.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Barang berhasil diperbarui");
      } else {
        await api.post("/admin/management/marketplace/items", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Barang berhasil ditambahkan");
      }
      handleCloseModal();
      fetchItems();
    } catch (err) {
      toast.error(editingItem ? "Gagal memperbarui barang" : "Gagal menambahkan barang");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, soft = true) => {
    if (!confirm(`Yakin ingin ${soft ? 'mengarsipkan' : 'menghapus permanen'} barang ini?`)) return;
    
    try {
      await api.delete(`/admin/management/marketplace/items/${id}?soft=${soft}`);
      toast.success(`Barang berhasil ${soft ? 'diarsipkan' : 'dihapus'}`);
      fetchItems();
    } catch (err) {
      toast.error("Gagal menghapus barang");
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === "ALL" || item.category === filterCategory)
  );

  return (
    <div className="p-6 md:p-12 animate-fade-in-up max-w-8xl">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
              <FaWarehouse size={24} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic">Kelola Market</h1>
              <p className="text-gray-500 font-medium text-sm">Update stok, tambah barang, dan kelola katalog Amerta.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-[22px] font-black uppercase tracking-[2px] text-xs transition-all shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95"
        >
          <FaPlus /> Tambah Barang
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative flex-1 group">
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Cari barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[22px] py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[22px] px-8 py-4 text-xs font-black uppercase tracking-[2px] focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="CLOTHING">Pakaian</option>
            <option value="ACCESSORIES">Aksesoris</option>
            <option value="UPCYCLED">Upcycled</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 dark:border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Barang</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Kategori</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Stok</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Harga</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Poin</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-8 py-6">
                      <div className="h-12 bg-gray-100 dark:bg-white/5 rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-white/5 shrink-0">
                          {item.images?.[0] ? (
                            <img src={getImageUrl(item.images[0].url)} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FaImage size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-foreground uppercase tracking-tight leading-none mb-1">{item.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium truncate max-w-[200px]">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                        {item.category || 'CLOTHING'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black tracking-tight ${item.stock > 5 ? 'text-foreground' : 'text-orange-500'}`}>
                          {item.stock}
                        </span>
                        {item.stock === 0 ? (
                          <span className="flex items-center gap-1 text-[8px] font-black uppercase text-red-500">
                            <FaTimesCircle size={8} /> HABIS
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[8px] font-black uppercase text-green-500">
                            <FaCheckCircle size={8} /> TERSEDIA
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black tracking-tighter text-foreground">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1.5 text-primary">
                        <FaCoins size={10} />
                        <span className="text-sm font-black tracking-tighter">{item.points || 0}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, true)}
                          className="p-3 bg-orange-500/10 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                        >
                          <FaArchive size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, false)}
                          className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                      <FaBoxOpen size={32} />
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-[3px] text-xs">Belum ada barang di katalog</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Component */}
      <MarketplaceItemModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
