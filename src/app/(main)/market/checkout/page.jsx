"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { FaUser, FaPhone, FaMapMarkerAlt, FaArrowRight, FaCamera, FaShoppingBag, FaCoins, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_URL = process.env.NEXT_PUBLIC_API_STORAGE_URL || "http://localhost:3001";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedIds = searchParams.get("items")?.split(",") || null;

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [order, setOrder] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);

  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, cartRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/marketplace/cart")
      ]);
      
      const userData = userRes.data.data.user;
      setUser(userData);

      // Filter cart if selected IDs are present
      let cartData = cartRes.data.data;
      if (selectedIds) {
        cartData = cartData.filter(item => selectedIds.includes(item.id));
      }
      
      setCart(cartData);

      // Prefill form
      setFormData({
        recipientName: userData.name || "",
        phone: userData.phone || "",
        address: userData.address || ""
      });

      if (cartRes.data.data.length === 0) {
        toast.error("Keranjang kosong!");
        router.push("/market");
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.phone || !formData.address) {
      toast.error("Mohon lengkapi data pengiriman");
      return;
    }

    try {
      const checkoutData = {
        ...formData,
        cartItemIds: selectedIds
      };
      const res = await api.post("/marketplace/checkout", checkoutData);
      setOrder(res.data.data);
      setStep(2);
      toast.success("Pesanan berhasil dibuat!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout gagal");
    }
  };

  const handleUploadPayment = async () => {
    if (!paymentProof) {
      toast.error("Pilih foto bukti pembayaran");
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("image", paymentProof);

    try {
      await api.post(`/marketplace/orders/${order.id}/payment`, formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setStep(3); // Success step
      toast.success("Bukti pembayaran dikirim!");
    } catch (err) {
      toast.error("Gagal mengunggah bukti pembayaran");
    } finally {
      setUploading(false);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  const cartPoints = cart.reduce((total, item) => total + (item.item.points * item.quantity), 0);

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
        <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Checkout</h1>
            <div className="flex items-center gap-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step >= s ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
                            {step > s ? <FaCheckCircle /> : s}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s ? "text-foreground" : "text-gray-400"}`}>
                            {s === 1 ? "Pengiriman" : s === 2 ? "Pembayaran" : "Selesai"}
                        </span>
                        {s < 3 && <div className="w-8 h-px bg-gray-200 dark:bg-white/10" />}
                    </div>
                ))}
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-surface rounded-[40px] p-10 border border-gray-100 dark:border-white/10 shadow-xl"
                >
                  <h2 className="text-2xl font-black tracking-tighter uppercase mb-8 flex items-center gap-4">
                    <FaMapMarkerAlt className="text-primary" /> Informasi Pengiriman
                  </h2>
                  <form onSubmit={handleCheckout} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nama Penerima</label>
                            <div className="relative">
                                <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text"
                                    value={formData.recipientName}
                                    onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                                    className="w-full bg-background border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-14 pr-6 focus:border-primary transition-all font-bold text-sm"
                                    placeholder="Nama Lengkap"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nomor WhatsApp</label>
                            <div className="relative">
                                <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-background border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-14 pr-6 focus:border-primary transition-all font-bold text-sm"
                                    placeholder="Contoh: 081234567890"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Alamat Lengkap</label>
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-5 top-4 text-gray-400" />
                            <textarea 
                                rows="4"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="w-full bg-background border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-14 pr-6 focus:border-primary transition-all font-bold text-sm resize-none"
                                placeholder="Tulis alamat pengiriman lengkap..."
                            />
                        </div>
                    </div>
                    
                    <div className="pt-6">
                        <button 
                            type="submit"
                            className="w-full py-6 bg-primary text-white rounded-[30px] text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3"
                        >
                            Konfirmasi & Lanjut Pembayaran <FaArrowRight />
                        </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-surface rounded-[40px] p-10 border border-gray-100 dark:border-white/10 shadow-xl"
                >
                  <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">Instruksi Pembayaran</h2>
                  <p className="text-gray-500 text-sm font-medium mb-8">Hampir selesai! Silakan lakukan transfer sesuai nominal di samping.</p>
                  
                  <div className="p-8 bg-background border border-primary/20 rounded-[30px] mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Metode Pembayaran</span>
                        <span className="font-black text-primary italic">Transfer Bank (BCA)</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-500">Nomor Rekening</p>
                        <p className="text-3xl font-black tracking-tighter">123 456 7890</p>
                    </div>
                    <p className="text-xs font-bold mt-4">Atas Nama: <span className="uppercase">Amerta Circular IO</span></p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Upload Bukti Transfer</h4>
                    <div 
                        onClick={() => document.getElementById('proof-upload').click()}
                        className="aspect-video w-full rounded-[30px] border-4 border-dashed border-gray-100 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all group overflow-hidden relative"
                    >
                        {paymentProof ? (
                            <img 
                                src={URL.createObjectURL(paymentProof)} 
                                className="w-full h-full object-cover"
                                alt="Proof"
                            />
                        ) : (
                            <>
                                <FaCamera className="text-4xl text-gray-200 group-hover:text-primary transition-colors mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 group-hover:text-primary transition-colors">
                                    Pilih Foto Bukti Transfer
                                </p>
                            </>
                        )}
                        <input id="proof-upload" type="file" className="hidden" accept="image/*" onChange={(e) => setPaymentProof(e.target.files[0])} />
                    </div>
                  </div>

                  <div className="pt-10 flex gap-4">
                    <button 
                        onClick={() => setStep(1)}
                        className="flex-1 py-6 bg-gray-100 dark:bg-white/5 rounded-[30px] text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                    >
                        Kembali
                    </button>
                    <button 
                        onClick={handleUploadPayment}
                        disabled={!paymentProof || uploading}
                        className="flex-[2] py-6 bg-primary text-white rounded-[30px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                    >
                        {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Kirim & Konfirmasi <FaCheckCircle /></>}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-surface rounded-[40px] p-20 border border-gray-100 dark:border-white/10 shadow-xl text-center"
                >
                    <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-[40px] flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner">
                        <FaCheckCircle />
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Terima Kasih!</h2>
                    <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">
                        Pesananmu sedang diverifikasi oleh tim Amerta. Poin akan segera masuk ke akunmu setelah verifikasi selesai.
                    </p>
                    <button 
                        onClick={() => router.push("/market")}
                        className="px-12 py-5 bg-primary text-white rounded-3xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
                    >
                        Kembali ke Market
                    </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-[40px] p-8 border border-gray-100 dark:border-white/10 shadow-xl sticky top-32">
                <h3 className="text-xl font-black tracking-tighter uppercase mb-6 flex items-center gap-3">
                    <FaShoppingBag className="text-primary" /> Ringkasan Order
                </h3>
                
                <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/5">
                                <img src={getImageUrl(item.item.images[0]?.url)} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-xs truncate uppercase tracking-tight">{item.item.name}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{item.quantity}x Item</p>
                                <p className="text-sm font-black text-primary">Rp {(item.item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/10">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium italic">Reward Poin</span>
                        <span className="font-black text-primary flex items-center gap-2">
                            <FaCoins className="text-xs" /> +{cartPoints} AP
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Tagihan</span>
                        <span className="text-2xl font-black tracking-tighter">Rp {cartTotal.toLocaleString()}</span>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs">
                        💡
                    </div>
                    <p className="text-[10px] font-bold leading-relaxed text-gray-500">
                        Poin Amerta (AP) akan diberikan secara otomatis setelah admin memvalidasi bukti pembayaranmu.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
