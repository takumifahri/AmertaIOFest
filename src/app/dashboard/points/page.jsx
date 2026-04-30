"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { FaCoins, FaHistory, FaGift, FaArrowRight, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function PointsPage() {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await api.get("/profile");
        setPoints(res.data.points || 0);
      } catch (err) {
        console.error("Failed to fetch points", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, []);

  return (
    <div className="p-6 md:p-12 max-w-4xl min-h-screen bg-background text-foreground transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
          AMERTA <span className="text-primary italic">POINTS</span>
        </h1>
        <p className="text-gray-500 font-medium">Tukarkan kontribusimu dengan berbagai reward eksklusif dan voucher belanja.</p>
      </motion.div>
      
      {/* Points Card - Earth Toned Gradient */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary via-primary-light to-secondary rounded-[40px] p-10 relative overflow-hidden shadow-2xl shadow-primary/20 mb-12"
      >
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-black/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="text-white/60 font-black uppercase tracking-[3px] text-[10px] mb-2">Total Saldo Points</p>
            {loading ? (
              <div className="h-16 w-32 bg-white/10 animate-pulse rounded-2xl" />
            ) : (
              <h2 className="text-7xl font-black text-white tracking-tighter flex items-center gap-4 justify-center md:justify-start">
                {points} <span className="text-2xl font-bold opacity-40">AP</span>
              </h2>
            )}
            <p className="text-white/70 text-xs mt-6 max-w-sm font-medium leading-relaxed">
              Dapatkan poin setiap kali donasi pakaianmu diverifikasi dan diselesaikan oleh tim admin Amerta.
            </p>
          </div>
          
          <div className="shrink-0">
            <button 
              disabled={points === 0}
              className="group px-8 py-5 bg-white text-primary font-black uppercase tracking-[2px] text-[12px] rounded-[24px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tukarkan Points <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Info & History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           className="bg-surface border border-gray-200 dark:border-white/5 rounded-[32px] p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <FaHistory />
             </div>
             <h3 className="font-black uppercase tracking-widest text-sm text-foreground">Riwayat Penukaran</h3>
          </div>
          <div className="bg-gray-50 dark:bg-black/20 rounded-2xl p-10 text-center border border-dashed border-gray-200 dark:border-white/5">
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Belum ada riwayat penukaran</p>
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.3 }}
           className="bg-surface border border-gray-200 dark:border-white/5 rounded-[32px] p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-accent/10 text-accent rounded-xl">
                <FaInfoCircle />
             </div>
             <h3 className="font-black uppercase tracking-widest text-sm text-foreground">Cara Dapat Poin</h3>
          </div>
          <div className="space-y-4">
             {[
               { text: "Donasi Pakaian Layak Pakai", points: "+50 AP" },
               { text: "Donasi Pakaian Bisa Diperbaiki", points: "+20 AP" },
               { text: "Donasi Pakaian Daur Ulang", points: "+5 AP" },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <span className="text-[11px] font-bold text-gray-500">{item.text}</span>
                  <span className="text-[11px] font-black text-primary">{item.points}</span>
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
