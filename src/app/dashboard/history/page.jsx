'use client';
import { motion } from 'framer-motion';
import { FaHistory, FaTools } from 'react-icons/fa';

export default function HistoryUnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-20 h-20 bg-primary/10 rounded-[24px] flex items-center justify-center text-primary mb-8"
      >
        <FaHistory size={32} className="animate-pulse" />
      </motion.div>

      <div className="relative mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic"
        >
          Histori <span className="text-primary">Aktivitas</span>
        </motion.h1>
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-1 bg-primary/20 mt-2 rounded-full mx-auto"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface border border-gray-100 dark:border-white/5 p-8 rounded-[32px] max-w-lg shadow-xl"
      >
        <div className="flex items-center justify-center gap-3 text-primary mb-4">
            <FaTools size={18} />
            <span className="text-[10px] font-black uppercase tracking-[3px]">Under Construction</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
          Fitur histori aktivitas sedang dalam tahap pengembangan. Kami akan segera menghadirkan laporan jejak sirkular kamu di sini.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-[10px] font-black text-gray-400 uppercase tracking-[4px]"
      >
        Coming Soon 2026
      </motion.div>
    </div>
  );
}
