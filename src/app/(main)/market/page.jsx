"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { FaStore, FaCoins, FaShoppingBag, FaSearch, FaFilter, FaArrowRight, FaCamera } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
const STORAGE_URL = process.env.NEXT_PUBLIC_API_STORAGE_URL || "http://localhost:3001";

export default function MarketplacePage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  useEffect(() => {
    fetchItems();
    const hasAuth = document.cookie.includes("isLoggedIn=true");
    if (hasAuth) {
      fetchCart();
    }
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/marketplace/items");
      setItems(res.data.data);
    } catch (err) {
      console.error("Failed to fetch items", err);
      toast.error("Gagal memuat barang marketplace");
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await api.get("/marketplace/cart");
      setCart(res.data.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  const handleAddToCart = async (item) => {
    const hasAuth = document.cookie.includes("isLoggedIn=true");
    if (!hasAuth) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsAdding(item.id);
    try {
      await api.post("/marketplace/cart", {
        itemId: item.id,
        quantity: 1
      });
      toast.success(`${item.name} ditambahkan ke keranjang`);
      fetchCart();
      setIsCartOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menambah ke keranjang");
    } finally {
      setIsAdding(null);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(itemId);
      return;
    }
    try {
      await api.patch(`/marketplace/cart/${itemId}`, { quantity });
      fetchCart();
    } catch (err) {
      toast.error("Gagal update kuantitas");
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await api.delete(`/marketplace/cart/${itemId}`);
      fetchCart();
      toast.success("Item dihapus dari keranjang");
    } catch (err) {
      toast.error("Gagal menghapus item");
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${STORAGE_URL}${url}`;
  };

  const cartTotal = cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  const cartPoints = cart.reduce((total, item) => total + (item.item.points * item.quantity), 0);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-6 bg-surface border border-gray-200 dark:border-white/10 rounded-[30px] shadow-xl hover:scale-105 transition-all group"
                >
                  <FaShoppingBag className="text-2xl text-primary group-hover:rotate-12 transition-transform" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full border-4 border-background shadow-lg">
                      {cart.length}
                    </span>
                  )}
                </button>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase mb-6">
              AMERTA <span className="text-primary italic">MARKET</span>
            </h1>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg">
              Koleksi eksklusif pakaian upcycled hasil karya tim Amerta. 
              Setiap pembelian mendukung sirkularitas dan memberimu poin tambahan!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Cari item atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-primary transition-all font-bold text-sm"
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-8 py-4 bg-surface border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-widest shadow-sm">
              <FaFilter className="text-primary" /> Filter
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[4/5] bg-surface animate-pulse rounded-[40px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-surface rounded-[40px] overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all"
              >
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img 
                    src={getImageUrl(item.images[0]?.url)} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 right-6">
                    <div className="px-4 py-2 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full flex items-center gap-2 border border-white/20 shadow-lg">
                      <FaCoins className="text-primary text-xs" />
                      <span className="text-xs font-black tracking-tighter">+{item.points} AP</span>
                    </div>
                  </div>
                  {item.category && (
                    <div className="absolute bottom-6 left-6">
                      <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors">
                        {item.name}
                    </h3>
                    <p className="text-lg font-black tracking-tighter text-foreground">
                        Rp {item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    disabled={isAdding === item.id}
                    className="w-full py-4 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isAdding === item.id ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>Tambah ke Keranjang <FaShoppingBag /></>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-surface w-full max-w-md h-full shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase">Keranjang Anda</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total {cart.length} Item</p>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                >
                  <FaFilter className="rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-[40px] flex items-center justify-center mb-6">
                        <FaShoppingBag className="text-3xl text-gray-300" />
                    </div>
                    <p className="text-lg font-black tracking-tight mb-2">Keranjang Kosong</p>
                    <p className="text-gray-500 text-sm font-medium">Mulai berbelanja dan temukan gaya upcycled-mu!</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/10">
                        <img src={getImageUrl(item.item.images[0]?.url)} className="w-full h-full object-cover" alt={item.item.name} />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <div className="flex justify-between items-start">
                                <h4 className="font-black text-sm tracking-tight leading-tight">{item.item.name}</h4>
                                <button 
                                    onClick={() => handleRemoveFromCart(item.itemId)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FaFilter className="rotate-45 text-[10px]" />
                                </button>
                            </div>
                            <p className="text-primary font-black text-sm mt-1">Rp {item.item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/10 p-1">
                                <button 
                                    onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center font-bold hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
                                >-</button>
                                <span className="w-10 text-center text-xs font-black">{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center font-bold hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
                                >+</button>
                            </div>
                            <div className="text-[10px] font-black text-primary flex items-center gap-1">
                                <FaCoins /> +{item.item.points * item.quantity} AP
                            </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 rounded-t-[40px] shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium italic">Total AP Reward</span>
                      <span className="font-black text-primary">+{cartPoints} AP</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black uppercase tracking-widest text-gray-400">Total Harga</span>
                      <span className="text-2xl font-black tracking-tighter">Rp {cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => router.push("/market/cart")}
                      className="py-6 bg-gray-50 dark:bg-white/5 rounded-[30px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                      Lihat Keranjang
                    </button>
                    <button 
                      onClick={() => {
                          setIsCartOpen(false);
                          router.push("/market/checkout");
                      }}
                      className="py-6 bg-primary text-white rounded-[30px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      Checkout <FaArrowRight />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAuthModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl border border-white/10 p-10 text-center"
            >
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-[30px] flex items-center justify-center text-3xl mb-8 mx-auto">
                <FaUser />
              </div>
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-4">Butuh Akses</h3>
              <p className="text-gray-500 font-medium mb-10 leading-relaxed text-sm">
                Silakan login terlebih dahulu untuk mulai belanja dan kumpulkan poin Amerta!
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push("/login")}
                  className="w-full py-5 bg-primary text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3"
                >
                  Login Sekarang <FaArrowRight />
                </button>
                <button 
                  onClick={() => setIsAuthModalOpen(false)}
                  className="w-full py-5 bg-gray-50 dark:bg-white/5 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Nanti Saja
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}