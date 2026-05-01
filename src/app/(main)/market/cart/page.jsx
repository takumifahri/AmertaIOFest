"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight, FaCoins, FaChevronLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STORAGE_URL = process.env.NEXT_PUBLIC_API_STORAGE_URL || "http://localhost:3001";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/marketplace/cart");
      const cartData = res.data.data;
      setCart(cartData);
      // Auto select all initially
      setSelectedItems(cartData.map(item => item.id));
    } catch (err) {
      console.error("Failed to fetch cart", err);
      toast.error("Gagal memuat keranjang");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map(item => item.id));
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await api.patch(`/marketplace/cart/${itemId}`, { quantity: newQty });
      setCart(cart.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
    } catch (err) {
      toast.error("Gagal memperbarui jumlah");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/marketplace/cart/${itemId}`);
      setCart(cart.filter(item => item.id !== itemId));
      setSelectedItems(selectedItems.filter(id => id !== itemId));
      toast.success("Item dihapus");
    } catch (err) {
      toast.error("Gagal menghapus item");
    }
  };

  const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
  const cartTotal = selectedCartItems.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  const cartPoints = selectedCartItems.reduce((total, item) => total + (item.item.points * item.quantity), 0);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Pilih minimal satu barang untuk checkout");
      return;
    }
    // Pass selected IDs to checkout page
    const ids = selectedItems.join(",");
    router.push(`/market/checkout?items=${ids}`);
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${STORAGE_URL}${url}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
            <div>
                <Link href="/market" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-4 group">
                    <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Market
                </Link>
                <h1 className="text-4xl font-black tracking-tighter uppercase">Keranjang Saya</h1>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Terpilih</p>
                <p className="text-2xl font-black text-primary">{selectedItems.length} Barang</p>
            </div>
        </div>

        {cart.length === 0 ? (
          // ... (Empty state remains same)
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-[40px] p-20 border border-gray-100 dark:border-white/10 shadow-xl text-center"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600 rounded-[40px] flex items-center justify-center text-4xl mx-auto mb-8">
              <FaShoppingBag />
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-4">Keranjang Kosong</h2>
            <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">
              Sepertinya kamu belum memilih barang apapun. Yuk, jelajahi koleksi kami sekarang!
            </p>
            <Link 
              href="/market"
              className="inline-flex px-12 py-5 bg-primary text-white rounded-3xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
            >
              Mulai Belanja
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* List Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-8 py-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        checked={selectedItems.length === cart.length && cart.length > 0}
                        onChange={toggleSelectAll}
                        className="w-5 h-5 rounded-lg border-gray-300 text-primary focus:ring-primary accent-primary"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pilih Semua ({cart.length})</span>
                </div>
                {selectedItems.length > 0 && (
                    <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:opacity-80 transition-all">Hapus Terpilih</button>
                )}
              </div>

              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-surface rounded-[30px] p-6 border border-gray-100 dark:border-white/10 flex flex-col md:flex-row items-center gap-6 group hover:border-primary/20 transition-all shadow-sm hover:shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                        <input 
                            type="checkbox" 
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleSelect(item.id)}
                            className="w-5 h-5 rounded-lg border-gray-300 text-primary focus:ring-primary accent-primary"
                        />
                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/5">
                            <img src={getImageUrl(item.item.images[0]?.url)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 text-center md:text-left">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">
                            {item.item.category || "Uncategorized"}
                        </span>
                        <h3 className="text-xl font-black tracking-tighter uppercase mb-2 truncate">{item.item.name}</h3>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <span className="text-lg font-black text-foreground">Rp {item.item.price.toLocaleString()}</span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                                <FaCoins /> +{item.item.points} AP
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-2xl p-1 border border-gray-100 dark:border-white/5">
                            <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/10 text-xs transition-all disabled:opacity-30"
                                disabled={item.quantity <= 1}
                            >
                                <FaMinus />
                            </button>
                            <span className="w-12 text-center font-black text-sm">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/10 text-xs transition-all"
                            >
                                <FaPlus />
                            </button>
                        </div>
                        <button 
                            onClick={() => removeItem(item.id)}
                            className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 px-4 py-2"
                        >
                            <FaTrash /> Hapus
                        </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-[40px] p-8 border border-gray-100 dark:border-white/10 shadow-xl sticky top-32">
                  <h3 className="text-xl font-black tracking-tighter uppercase mb-8">Ringkasan Pesanan</h3>
                  
                  <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-medium italic">Subtotal</span>
                          <span className="font-bold">Rp {cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-medium italic">Biaya Pengiriman</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Gratis</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-medium italic">Total Poin Didapat</span>
                          <span className="font-black text-primary flex items-center gap-2 uppercase">
                              <FaCoins className="text-xs" /> +{cartPoints} AP
                          </span>
                      </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 dark:border-white/10 mb-10">
                      <div className="flex justify-between items-end">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Pembayaran</span>
                          <span className="text-3xl font-black tracking-tighter text-foreground">Rp {cartTotal.toLocaleString()}</span>
                      </div>
                  </div>

                  <button 
                    onClick={() => router.push("/market/checkout")}
                    className="w-full py-6 bg-primary text-white rounded-[30px] text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3"
                  >
                    Lanjut Checkout <FaArrowRight />
                  </button>

                  <div className="mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-[30px] border border-dashed border-gray-200 dark:border-white/10">
                      <p className="text-[10px] font-bold text-gray-500 leading-relaxed text-center italic">
                        "Setiap pembelianmu berkontribusi pada ekonomi sirkular dan pengurangan limbah tekstil di Indonesia."
                      </p>
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
