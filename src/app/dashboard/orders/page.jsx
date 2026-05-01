"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { FaBox, FaClock, FaCheckCircle, FaTimesCircle, FaReceipt, FaCoins, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const STORAGE_URL = process.env.NEXT_PUBLIC_API_STORAGE_URL || "http://localhost:3001";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/marketplace/orders/me");
      setOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      toast.error("Gagal memuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "text-yellow-500 bg-yellow-500/10";
      case "VERIFIED": return "text-green-500 bg-green-500/10";
      case "REJECTED": return "text-red-500 bg-red-500/10";
      case "SHIPPED": return "text-blue-500 bg-blue-500/10";
      case "COMPLETED": return "text-emerald-500 bg-emerald-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING": return <FaClock />;
      case "VERIFIED": return <FaCheckCircle />;
      case "REJECTED": return <FaTimesCircle />;
      case "COMPLETED": return <FaCheckCircle />;
      default: return <FaBox />;
    }
  };

  if (loading) return (
    <div className="p-8">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Pesanan Saya</h1>
        <p className="text-gray-500 text-sm italic">Pantau status barang-barang modifikasi Amerta pilihanmu.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface rounded-[30px] p-16 text-center border border-dashed border-gray-200 dark:border-white/10">
          <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-3xl text-gray-300 mx-auto mb-6">
            <FaReceipt />
          </div>
          <h2 className="text-xl font-bold mb-2 uppercase">Belum ada pesanan</h2>
          <p className="text-gray-500 text-sm mb-8">Kamu belum melakukan pembelian apapun di marketplace.</p>
          <a href="/market" className="inline-block px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">Mulai Belanja</a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-[30px] border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="p-6 border-b border-gray-50 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400">
                        <FaReceipt />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Order ID</p>
                        <p className="text-sm font-bold text-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status}
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                    {order.items?.map((orderItem) => (
                        <div key={orderItem.id} className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 shrink-0">
                                {orderItem.item?.images?.[0] && (
                                    <img src={orderItem.item.images[0].url.startsWith('http') ? orderItem.item.images[0].url : `${STORAGE_URL}${orderItem.item.images[0].url}`} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-sm uppercase truncate">{orderItem.item?.name}</h4>
                                <p className="text-xs text-gray-500">{orderItem.quantity}x @ Rp {orderItem.priceAtPurchase.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-sm">Rp {(orderItem.priceAtPurchase * orderItem.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Bayar</p>
                            <p className="text-xl font-black">Rp {order.totalPrice.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Reward AP</p>
                            <p className="text-sm font-black text-primary flex items-center gap-1.5 uppercase">
                                <FaCoins /> +{order.totalPointsAwarded} AP
                            </p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-3 transition-all">
                        Detail Pesanan <FaChevronRight />
                    </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
