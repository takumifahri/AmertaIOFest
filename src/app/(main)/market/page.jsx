'use client';
import { motion } from 'framer-motion';
import { FaTools, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function UnderConstruction() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary mb-8"
      >
        <FaTools size={40} className="animate-bounce" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-4 uppercase"
      >
        Under <span className="text-primary italic">Construction</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 max-w-md mx-auto mb-12 font-medium"
      >
        Kami sedang menyiapkan sesuatu yang luar biasa untuk fitur ini. Kembali lagi segera untuk pengalaman sirkular yang lebih baik!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-foreground hover:bg-white/10 transition-all"
        >
          <FaArrowLeft /> Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}