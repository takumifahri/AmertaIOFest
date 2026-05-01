"use client";

import { useState, useEffect,createElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "react-icons/fa";
import {
  FaStar, FaCoins, FaGift, FaHandHoldingHeart,
  FaTicketAlt, FaInfoCircle, FaChevronRight,
  FaCheckCircle, FaLock, FaQrcode, FaFire,
  FaGem, FaLeaf, FaShoppingBag, FaHistory
} from "react-icons/fa";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function RedeemPointsPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("VOUCHERS");
  const [selectedReward, setSelectedReward] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [userRewards, setUserRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchRewards();
    if (activeTab === "HISTORY") fetchHistory();
  }, [activeTab]);

  const fetchHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const response = await api.get("/rewards/my-rewards");
      setUserRewards(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/profile");
      setUser(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRewards = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/rewards");
      setRewards(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat daftar reward.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!selectedReward) return;

    if ((user?.points || 0) < selectedReward.cost) {
      toast.error("Poin kamu tidak cukup, kumpulkan lebih banyak lagi!");
      return;
    }

    setIsRedeeming(true);
    try {
      await api.post(`/rewards/redeem/${selectedReward.id}`);

      toast.success(`Berhasil mengklaim ${selectedReward.title}! Cek inventarismu.`);
      fetchUser();
      fetchHistory();
      setSelectedReward(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal melakukan redeem.";
      toast.error(msg);
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12 mb-24 min-h-screen">
      {/* Dynamic Header / Shop Banner */}
      <section className="relative overflow-hidden bg-[#0a120e] rounded-[60px] border border-white/5 p-10 md:p-20 shadow-[0_0_100px_rgba(0,0,0,0.8)] group">
        <div className="absolute top-[-40%] right-[-10%] w-[80%] h-[180%] bg-primary/10 blur-[150px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-1000 animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[100%] bg-primary-light/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="space-y-8 text-center lg:text-left max-w-2xl">
            {/* <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[4px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Toko Reward Amerta
            </div> */}
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight uppercase italic text-white leading-[0.9]">
              AMERTA <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#3D6B53] to-[#A3B18A]">VAULT</span>
            </h1>
            
            <p className="text-gray-400 font-medium text-xl leading-relaxed max-w-lg">
              Tukarkan <span className="text-white font-bold">Amerta Coins</span> hasil kontribusimu dengan reward eksklusif dan aksi nyata untuk bumi.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                <FaFire className="text-orange-500" />
                <span className="text-xs font-bold text-gray-300">Reward Terbaru</span>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                <FaShoppingBag className="text-primary" />
                <span className="text-xs font-bold text-gray-300">Transaksi Aman</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Holographic Balance Card */}
            <motion.div 
              initial={{ rotateY: 20, rotateX: 10 }}
              animate={{ rotateY: 0, rotateX: 0 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl border border-white/20 p-12 rounded-[50px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary-light/20 opacity-50" />
              
              <div className="relative space-y-8 text-center min-w-[280px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(43,76,59,0.4)]">
                    <FaCoins size={32} className="text-primary animate-bounce-slow" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[5px] text-gray-400">Saldo Kamu</span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                    {user?.points || 0}
                  </p>
                  <p className="text-primary font-black text-sm uppercase tracking-[4px]">Amerta Coins</p>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-[2px] text-gray-500">
                  <span>Level {(Math.floor((user?.points || 0) / 1000) + 1)}</span>
                  <span>XP: {user?.points || 0}</span>
                </div>
              </div>
            </motion.div>
            
            {/* Decorative elements behind card */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 blur-[60px] rounded-full animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-light/10 blur-[60px] rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Navigation & Categories */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
        <div className="flex bg-[#0a120e] p-2 rounded-[30px] border border-white/5 shadow-inner">
          {[
            { id: "VOUCHERS", label: "VOUCHER", icon: <FaTicketAlt /> },
            { id: "CHARITY", label: "DONASI", icon: <FaHandHoldingHeart /> },
            { id: "HISTORY", label: "HISTORY", icon: <FaHistory /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-12 py-4 rounded-[24px] text-[12px] font-black uppercase tracking-[3px] transition-all duration-500 flex items-center gap-3 ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-[24px] shadow-[0_10px_30px_rgba(43,76,59,0.4)]"
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4 text-gray-500 text-[11px] font-black uppercase tracking-[2px]">
          <span className="text-primary">Item Baru Setiap Minggu</span>
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <span>Edisi Terbatas</span>
        </div>
      </div>

      {/* Rewards Storefront Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 min-h-[400px]">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center space-y-4">
             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
             <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Memuat Koleksi Vault...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "HISTORY" ? (
              <div className="col-span-full space-y-10">
                {isHistoryLoading ? (
                  <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : userRewards.length === 0 ? (
                  <div className="text-center py-24 bg-[#0a120e] rounded-[50px] border border-white/5 border-dashed">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-3xl text-gray-700 mx-auto mb-6">
                       <Icons.FaHistory />
                    </div>
                    <p className="text-gray-500 font-black uppercase tracking-[4px] text-[10px]">Belum ada riwayat penukaran</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {/* Wallet Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.values(
                        userRewards.reduce((acc, ur) => {
                          if (!ur.isUsed && ur.reward.type === 'VOUCHERS') {
                            if (!acc[ur.reward.id]) {
                              acc[ur.reward.id] = { 
                                title: ur.reward.title, 
                                count: 0, 
                                color: ur.reward.color,
                                icon: ur.reward.icon
                              };
                            }
                            acc[ur.reward.id].count++;
                          }
                          return acc;
                        }, {})
                      ).map((summary, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-primary/5 border border-primary/20 rounded-[40px] p-8 flex items-center justify-between group hover:bg-primary/10 transition-all"
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${summary.color} flex items-center justify-center text-white text-2xl shadow-xl`}>
                              {summary.icon && Icons[summary.icon] ? createElement(Icons[summary.icon]) : <Icons.FaTicketAlt />}
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-primary uppercase tracking-[2px]">Tersedia</p>
                              <h4 className="text-white font-black uppercase italic truncate max-w-[120px]">{summary.title}</h4>
                            </div>
                          </div>
                          <div className="text-4xl font-black text-white italic tracking-tighter">
                            x{summary.count}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userRewards.map((ur, index) => {
                         const Icon = ur.reward.icon && Icons[ur.reward.icon] ? Icons[ur.reward.icon] : Icons.FaGift;
                         return (
                          <motion.div 
                            key={ur.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`group relative bg-[#0a120e] border ${ur.isUsed ? 'border-white/5 opacity-60' : 'border-white/10'} rounded-[45px] overflow-hidden p-8 flex flex-col gap-6 hover:border-primary/30 transition-all`}
                          >
                            {!ur.isUsed && (
                              <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#2b4c3b]" />
                            )}
                            
                            <div className="flex items-center gap-5">
                              <div className={`w-16 h-16 rounded-[22px] bg-gradient-to-br ${ur.reward.color} flex items-center justify-center text-white text-3xl shadow-2xl group-hover:scale-110 transition-transform`}>
                                <Icon />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-black uppercase italic text-lg leading-tight truncate">{ur.reward.title}</h4>
                                <p className="text-[9px] text-gray-500 font-black tracking-widest uppercase mt-1">
                                  {new Date(ur.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                              </div>
                            </div>

                            <div className="relative overflow-hidden bg-white/[0.03] p-5 rounded-[30px] border border-white/5 flex flex-col gap-3 group/code">
                              <div className="flex items-center justify-between">
                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Unique Code</p>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(ur.code);
                                    toast.success("Kode disalin!");
                                  }}
                                  className="text-[9px] font-black text-primary hover:text-white uppercase tracking-tighter flex items-center gap-2 transition-colors"
                                >
                                  <Icons.FaCopy /> Salin
                                </button>
                              </div>
                              <span className="text-xl font-mono text-white font-black tracking-wider break-all italic">
                                {ur.code}
                              </span>
                            </div>

                            <div className="flex justify-between items-center mt-auto">
                               <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${ur.isUsed ? 'border-red-500/20 bg-red-500/5 text-red-500' : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500'} text-[9px] font-black uppercase tracking-widest`}>
                                 {ur.isUsed ? <Icons.FaTimesCircle /> : <Icons.FaCheckCircle />}
                                 {ur.isUsed ? 'Sudah Digunakan' : 'Siap Digunakan'}
                               </div>
                               {ur.reward.type === 'CHARITY' && (
                                 <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">Donasi Selesai</span>
                               )}
                            </div>
                          </motion.div>
                         )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              rewards
                .filter((r) => r.type === activeTab)
              .map((reward, index) => {
                // Dynamic icon resolver
                const IconComponent = reward.icon && Icons[reward.icon] ? Icons[reward.icon] : Icons.FaGift;
                
                return (
                  <motion.div
                    key={reward.id}
                    layoutId={`reward-${reward.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -15 }}
                    onClick={() => setSelectedReward(reward)}
                    className="group relative bg-[#0a120e] border border-white/5 rounded-[50px] overflow-hidden cursor-pointer hover:border-primary/40 transition-all duration-500 shadow-2xl flex flex-col h-full"
                  >
                    {/* Header Decoration */}
                    <div className={`h-3 bg-gradient-to-r ${reward.color || 'from-primary to-primary-light'} opacity-30 group-hover:opacity-100 transition-opacity`} />
                    
                    <div className="p-10 flex flex-col h-full space-y-8">
                      {/* Item Icon & Badge */}
                      <div className="flex justify-between items-start">
                        <div className={`w-24 h-24 rounded-[32px] bg-gradient-to-br ${reward.color || 'from-primary to-primary-light'} p-0.5 shadow-2xl group-hover:rotate-6 transition-transform duration-500`}>
                          <div className="w-full h-full bg-[#0a120e] rounded-[30px] flex items-center justify-center text-3xl">
                             <span className="text-white group-hover:scale-110 transition-transform duration-500">
                               <IconComponent />
                             </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[2px] bg-white/5 border border-white/10 text-gray-400 group-hover:text-white transition-colors`}>
                            {reward.rarity === 'Common' ? 'Biasa' : reward.rarity === 'Rare' ? 'Langka' : reward.rarity === 'Epic' ? 'Epik' : 'Legendaris'}
                          </span>
                          {reward.tag && (
                            <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[2px] bg-primary/10 text-primary animate-pulse">
                              {reward.tag === 'POPULAR' ? 'POPULER' : reward.tag === 'BEST VALUE' ? 'PILIHAN TERBAIK' : reward.tag === 'EXCLUSIVE' ? 'EKSKLUSIF' : reward.tag === 'ECO-HERO' ? 'PAHLAWAN BUMI' : reward.tag}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="flex-grow space-y-3">
                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tight leading-none group-hover:text-primary transition-colors">
                          {reward.title}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">
                          {reward.description}
                        </p>
                      </div>

                      {/* Price & Action */}
                      <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[2px]">Biaya</p>
                          <div className="flex items-center gap-2 text-white">
                            <FaCoins size={14} className="text-primary" />
                            <span className="text-3xl font-black tracking-tighter">{reward.cost}</span>
                          </div>
                        </div>
                        
                        <button className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                          <FaChevronRight className="text-white group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Card Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${reward.color || 'from-primary to-primary-light'} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none`} />
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Redemption Confirmation Modal */}
      <AnimatePresence>
        {selectedReward && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
              onClick={() => setSelectedReward(null)}
            />

            <motion.div
              layoutId={`reward-${selectedReward.id}`}
              className="relative w-full max-w-lg bg-[#0a120e] rounded-[50px] overflow-hidden shadow-[0_0_100px_rgba(43,76,59,0.2)] border border-white/5 flex flex-col"
            >
              {/* Card Top Section (Voucher Head) */}
              <div className={`relative h-56 bg-gradient-to-br ${selectedReward.color} p-10 flex flex-col items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                  <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-white/20 rotate-45 blur-3xl animate-pulse" />
                </div>

                {(() => {
                  const ModalIcon = selectedReward.icon && Icons[selectedReward.icon] ? Icons[selectedReward.icon] : Icons.FaGift;
                  return (
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative z-10 w-28 h-28 bg-white/10 backdrop-blur-3xl rounded-[35px] border border-white/20 flex items-center justify-center text-6xl text-white shadow-2xl"
                    >
                      <ModalIcon className="drop-shadow-2xl" />
                    </motion.div>
                  );
                })()}
                
                <div className="absolute bottom-6 px-5 py-1 bg-black/40 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[4px] text-white/80">
                   Konfirmasi Penukaran
                </div>
              </div>

              {/* Perforation Line Effect */}
              <div className="relative h-6 bg-transparent flex items-center px-0">
                <div className="absolute left-[-15px] w-8 h-8 rounded-full bg-black/80 z-10" />
                <div className="flex-grow border-b-4 border-dashed border-white/5 mx-6 opacity-20" />
                <div className="absolute right-[-15px] w-8 h-8 rounded-full bg-black/80 z-10" />
              </div>

              {/* Card Body (Voucher Info) */}
              <div className="p-10 md:p-12 space-y-8 bg-[#0a120e]">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                    {selectedReward.title}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed italic max-w-xs mx-auto">
                    {selectedReward.description}
                  </p>
                </div>

                <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-[35px] p-2">
                  <div className="flex-1 flex flex-col items-center py-4 border-r border-white/5">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Dibutuhkan</p>
                    <div className="flex items-center gap-2 text-primary">
                      <FaCoins size={14} />
                      <span className="text-2xl font-black tracking-tighter italic">{selectedReward.cost}</span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center py-4">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Sisa Saldo</p>
                    <div className={`flex items-center gap-2 ${(user?.points || 0) < selectedReward.cost ? 'text-red-500' : 'text-white'}`}>
                      <FaStar size={12} className="opacity-50" />
                      <span className="text-2xl font-black tracking-tighter italic">
                        {Math.max(0, (user?.points || 0) - selectedReward.cost)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRedeem}
                    disabled={isRedeeming || (user?.points || 0) < selectedReward.cost}
                    className="w-full relative group h-20 rounded-[28px] overflow-hidden shadow-2xl disabled:opacity-50 disabled:grayscale transition-all"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-primary to-primary-light transition-all duration-500 ${(user?.points || 0) < selectedReward.cost ? 'from-gray-800 to-gray-700' : ''}`} />
                    <span className="relative z-10 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[4px] text-white italic">
                      {isRedeeming ? (
                        <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {(user?.points || 0) < selectedReward.cost ? 'Poin Kurang' : 'Tukarkan Sekarang'}
                          <FaCheckCircle className="text-sm opacity-60" />
                        </>
                      )}
                    </span>
                  </motion.button>

                  <button
                    onClick={() => setSelectedReward(null)}
                    className="w-full py-2 text-[9px] font-black text-gray-600 uppercase tracking-[3px] hover:text-white transition-all italic"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info Section - Gamified */}
      <section className="bg-[#0a120e] rounded-[50px] p-12 flex flex-col lg:flex-row items-center gap-10 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <FaInfoCircle size={120} />
        </div>
        
        <div className="w-24 h-24 bg-primary/10 rounded-[30px] flex items-center justify-center text-primary shrink-0 shadow-inner border border-primary/20">
          <FaStar size={32} />
        </div>
        
        <div className="space-y-4 text-center lg:text-left flex-grow">
          <h4 className="text-[12px] font-black uppercase tracking-[5px] text-primary">Cara Mendapatkan Lebih Banyak Koin</h4>
          <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-3xl">
            Setiap donasi pakaian yang terverifikasi akan memberikan koin sesuai grade kualitas (A, B, atau C). 
            Transaksi barter yang sukses dan kontribusi komunitas juga akan menambah saldo brankasmu secara otomatis.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">A</div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">B</div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">C</div>
        </div>
      </section>
    </div>
  );
}
