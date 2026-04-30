"use client";

import { motion } from "framer-motion";
import { FaTshirt } from "react-icons/fa";
import { HiOutlineQrCode, HiOutlineMapPin, HiOutlineSparkles } from "react-icons/hi2";

const steps = [
  {
    title: "Sortir Pakaian",
    description: "Pilih pakaian layak pakai atau tekstil yang ingin Anda beri kehidupan kedua.",
    icon: <FaTshirt className="w-6 h-6" />,
    color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400",
  },
  {
    title: "AI Quality Scan",
    description: "Gunakan AI Gatekeeper untuk memvalidasi kualitas dan mendapatkan estimasi poin.",
    icon: <HiOutlineQrCode className="w-6 h-6" />,
    color: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/20 dark:text-blue-400",
  },
  {
    title: "Pilih Drop-off Center",
    description: "Antarkan ke lokasi terdekat atau gunakan layanan jemputan di sekitar Anda.",
    icon: <HiOutlineMapPin className="w-6 h-6" />,
    color: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400",
  },
  {
    title: "Terima Amerta Points",
    description: "Poin akan otomatis masuk ke akun Anda untuk ditukar dengan berbagai reward.",
    icon: <HiOutlineSparkles className="w-6 h-6" />,
    color: "bg-purple-500/10 text-purple-600 dark:bg-purple-400/20 dark:text-purple-400",
  },
];

export default function DonationSteps() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tighter mb-4"
          >
            Tata Cara Donasi
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm"
          >
            Mendonasikan pakaian di Amerta sangatlah mudah dan transparan dengan bantuan teknologi AI.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-surface border border-gray-100 dark:border-white/5 p-8 rounded-[32px] h-full shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group-hover:-translate-y-2">
                <div className={`${step.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {step.icon}
                </div>
                <div className="absolute top-8 right-8 text-4xl font-black text-gray-100 dark:text-white/5 group-hover:text-primary/10 transition-colors">
                  0{index + 1}
                </div>
                <h3 className="text-lg font-black text-foreground mb-3 uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
