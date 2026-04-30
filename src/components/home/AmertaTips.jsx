"use client";

import { motion } from "framer-motion";
import { HiOutlineLightBulb, HiOutlineCheckBadge, HiOutlineArrowPathRoundedSquare, HiOutlineUsers } from "react-icons/hi2";

const tips = [
  {
    title: "Bersih itu Wajib",
    description: "Pastikan pakaian sudah dicuci bersih sebelum didonasikan untuk menjaga kualitas pengolahan.",
    icon: <HiOutlineCheckBadge className="w-5 h-5" />,
    tag: "Kebersihan"
  },
  {
    title: "Gunakan Pencahayaan Baik",
    description: "Saat memindai dengan AI Gatekeeper, pastikan berada di ruangan terang agar akurasi maksimal.",
    icon: <HiOutlineLightBulb className="w-5 h-5" />,
    tag: "Teknologi"
  },
  {
    title: "Tukar Poin Secara Bijak",
    description: "Pantau merchant partner di Circle Hub untuk mendapatkan penawaran tukar poin terbaik.",
    icon: <HiOutlineArrowPathRoundedSquare className="w-5 h-5" />,
    tag: "Reward"
  },
  {
    title: "Bergabung di Komunitas",
    description: "Ikuti forum komunitas untuk info workshop upcycling dan event barter eksklusif.",
    icon: <HiOutlineUsers className="w-5 h-5" />,
    tag: "Sosial"
  }
];

export default function AmertaTips() {
  return (
    <section className="py-24 bg-primary/5 dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4"
            >
              <HiOutlineLightBulb className="w-3 h-3" /> Tips & Tricks
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tighter"
            >
              Maksimalkan Kontribusi Anda
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 dark:text-gray-400 text-sm max-w-xs"
          >
            Pelajari cara terbaik untuk berpartisipasi dalam ekosistem ekonomi sirkular Amerta.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface border border-gray-100 dark:border-white/5 p-6 rounded-3xl flex gap-6 items-start hover:border-primary/30 transition-all duration-300 shadow-sm"
            >
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-primary dark:text-emerald-400 shadow-sm">
                {tip.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest block mb-1">
                  {tip.tag}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
