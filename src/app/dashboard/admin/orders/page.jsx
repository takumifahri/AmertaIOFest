"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaEye, FaCheck, FaTimesCircle, FaReceipt, FaTruck, FaCheckCircle, FaCoins, FaBan, FaClock } from "react-icons/fa";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:3001';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isProofOpen, setIsProofOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/management/marketplace/orders");
      setOrders(res.data.data);
    } catch (err) {
      toast.error("Gagal mengambil data pesanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.patch(`/admin/management/marketplace/orders/${orderId}/verify`, { status });
      toast.success(`Pesanan berhasil diupdate ke ${status}`);
      setIsProofOpen(false);
      fetchOrders();
    } catch (err) {
      toast.error("Gagal update status pesanan.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-gray-500/10 text-gray-500";
      case "VERIFYING": return "bg-[#f59e0b]/10 text-[#f59e0b]";
      case "VERIFIED": return "bg-[#3b82f6]/10 text-[#3b82f6]";
      case "REJECTED": return "bg-red-500/10 text-red-500";
      case "SHIPPED": return "bg-[#10b981]/10 text-[#10b981]";
      case "COMPLETED": return "bg-[#d97706]/10 text-[#d97706]";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  const stats = [
    { label: "TOTAL PESANAN", value: orders.length, color: "text-[#3b82f6]" },
    { label: "PENDING", value: orders.filter(o => o.status === "VERIFYING").length, color: "text-[#f59e0b]" },
    { label: "SELESAI", value: orders.filter(o => o.status === "COMPLETED").length, color: "text-[#10b981]" },
    { label: "POIN DIBERIKAN", value: orders.reduce((acc, curr) => acc + curr.totalPointsAwarded, 0), color: "text-[#d97706]" },
  ];

  const filteredOrders = orders.filter(o => {
    if (selectedStatus === "ALL") return true;
    return o.status === selectedStatus;
  });

  if (loading) return <div className="p-20 text-center"><div className="w-12 h-12 border-4 border-[#1a2e21] border-t-primary rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-8 max-w-8xl mx-auto min-h-screen bg-[#080c0a] text-white selection:bg-primary selection:text-white transition-colors duration-300">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            DASHBOARD <span className="text-[#2d4a3e] italic">PESANAN</span>
          </h1>
          <p className="text-gray-600 text-[10px] font-bold mt-2 tracking-wide uppercase italic opacity-80 italic">Monitoring dan manajemen alur transaksi marketplace Amerta secara real-time.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group w-full sm:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a2e21] group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Cari order ID atau pembeli..."
              className="w-full pl-12 pr-6 py-3.5 bg-[#0d1410] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-[#1a2e21]"
            />
          </div>
          
          <div className="flex bg-[#0d1410] p-1 rounded-2xl border border-white/5 overflow-hidden">
            {["ALL", "VERIFYING", "SHIPPED", "COMPLETED"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  selectedStatus === status 
                  ? "bg-[#2d4a3e]/40 text-white shadow-lg border border-white/10" 
                  : "text-[#1a2e21] hover:text-gray-400"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0d1410] p-8 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.color.replace('text-', 'bg-')} opacity-20`} />
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.color} group-hover:scale-110 transition-transform origin-left`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-[#0d1410] rounded-[40px] border border-white/5 shadow-2xl overflow-hidden min-h-[500px] flex flex-col transition-all relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-white/5">
                <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[2px] text-gray-500">BARANG</th>
                <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[2px] text-gray-500">PEMBELI</th>
                <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[2px] text-gray-500 text-center">TOTAL</th>
                <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[2px] text-gray-500 text-center">STATUS</th>
                <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[2px] text-gray-500 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-0">
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse border border-white/5">
                        <FaClock className="text-3xl text-gray-700" />
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-[3px] text-gray-700">DATA TIDAK DITEMUKAN</h3>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#1a2e21] text-lg group-hover:scale-110 group-hover:text-primary transition-all duration-300">
                          <FaReceipt />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-tight group-hover:text-primary transition-colors">#{order.id.slice(0, 8)}</p>
                          <p className="text-[10px] text-gray-600 italic mt-0.5">{order.items?.[0]?.item?.name || "Item Unknown"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-gray-400">{order.recipientName}</p>
                      <p className="text-[10px] text-gray-700 mt-0.5 uppercase tracking-tighter">{order.phone}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <p className="text-xs font-black tracking-tight">Rp {order.totalPrice.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-primary tracking-tighter flex items-center justify-center gap-1">
                        <FaCoins /> +{order.totalPointsAwarded} AP
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => { setSelectedOrder(order); setIsProofOpen(true); }}
                        className="p-3 bg-white/5 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/10 transition-all shadow-sm"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View Proof & Action */}
      <AnimatePresence>
        {isProofOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsProofOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#080c0a] w-full max-w-5xl rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden flex flex-col md:flex-row"
            >
              {/* Proof Image */}
              <div className="md:w-1/2 bg-black flex items-center justify-center p-8 border-r border-white/5">
                {selectedOrder.paymentProof ? (
                    <img 
                        src={selectedOrder.paymentProof.startsWith('http') ? selectedOrder.paymentProof : `${STORAGE_URL}${selectedOrder.paymentProof}`} 
                        className="max-w-full max-h-[75vh] object-contain rounded-3xl shadow-2xl border border-white/10"
                    />
                ) : (
                    <div className="text-gray-800 text-center">
                        <FaBan size={64} className="mx-auto mb-6 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-[4px]">PROOF MISSING</p>
                    </div>
                )}
              </div>

              {/* Order Info & Actions */}
              <div className="md:w-1/2 p-12 flex flex-col bg-gradient-to-br from-[#0d1410] to-[#080c0a]">
                <div className="flex-1">
                    <div className="mb-10 flex justify-between items-start">
                        <div>
                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[2px] ${getStatusColor(selectedOrder.status)}`}>
                                {selectedOrder.status}
                            </span>
                            <h2 className="text-3xl font-black tracking-tighter uppercase mt-4">ORDER #{selectedOrder.id.slice(0, 8)}</h2>
                            <p className="text-[10px] font-bold text-[#1a2e21] uppercase tracking-widest mt-1">Dipesan oleh {selectedOrder.recipientName}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-[#10b981] tracking-tighter">Rp {selectedOrder.totalPrice.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-[#d97706] tracking-widest">+{selectedOrder.totalPointsAwarded} AP</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
                            <p className="text-[9px] font-black text-[#1a2e21] uppercase tracking-[3px] mb-4">DESTINASI PENGIRIMAN</p>
                            <p className="text-sm font-bold leading-relaxed text-gray-300">{selectedOrder.address}</p>
                            <p className="text-xs text-[#1a2e21] mt-2 font-medium italic">{selectedOrder.phone}</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
                            <p className="text-[9px] font-black text-[#1a2e21] uppercase tracking-[3px] mb-4">RINCIAN ITEM</p>
                            <div className="space-y-3">
                                {selectedOrder.items?.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-gray-500">{item.quantity}x <span className="text-white">{item.item?.name}</span></span>
                                        <span className="tracking-tight text-gray-400">Rp {(item.priceAtPurchase * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {selectedOrder.status === "VERIFYING" && (
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleUpdateStatus(selectedOrder.id, "REJECTED")}
                                className="py-5 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 border border-red-500/20 shadow-lg shadow-red-500/5"
                            >
                                <FaTimesCircle size={14} /> TOLAK
                            </button>
                            <button 
                                onClick={() => handleUpdateStatus(selectedOrder.id, "VERIFIED")}
                                className="py-5 bg-[#2d4a3e] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 shadow-2xl shadow-[#2d4a3e]/30 transition-all flex items-center justify-center gap-3"
                            >
                                <FaCheck size={14} /> VERIFIKASI
                            </button>
                        </div>
                    )}
                    {selectedOrder.status === "VERIFIED" && (
                        <button 
                            onClick={() => handleUpdateStatus(selectedOrder.id, "SHIPPED")}
                            className="w-full py-5 bg-[#3b82f6] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
                        >
                            <FaTruck size={14} /> UPDATE KE PENGIRIMAN
                        </button>
                    )}
                    {selectedOrder.status === "SHIPPED" && (
                        <button 
                            onClick={() => handleUpdateStatus(selectedOrder.id, "COMPLETED")}
                            className="w-full py-5 bg-[#d97706] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-amber-600/20 transition-all flex items-center justify-center gap-3"
                        >
                            <FaCheckCircle size={14} /> SELESAIKAN PESANAN
                        </button>
                    )}
                    <button 
                        onClick={() => setIsProofOpen(false)}
                        className="w-full py-4 text-[10px] font-black uppercase tracking-[3px] text-[#1a2e21] hover:text-white transition-all mt-4"
                    >
                        [ KEMBALI ]
                    </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
