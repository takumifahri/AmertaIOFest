"use client";

import { FaArrowRight, FaLeaf, FaRecycle, FaShieldAlt, FaUsers, FaCoins, FaCheckCircle, FaSearch } from "react-icons/fa";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <FaSearch size={24} />,
      title: "Sortir Pakaian",
      description: "Pilih pakaian layak pakai yang sudah tidak Anda gunakan. Pastikan dalam kondisi bersih.",
      color: "blue"
    },
    {
      icon: <FaShieldAlt size={24} />,
      title: "AI Verification",
      description: "Sistem AI Quality Gatekeeper kami akan memvalidasi kualitas pakaian yang Anda donasikan.",
      color: "primary"
    },
    {
      icon: <FaCoins size={24} />,
      title: "Dapatkan Point",
      description: "Setiap donasi yang terverifikasi akan memberikan Anda Leaf Point (AP) yang berharga.",
      color: "amber"
    },
    {
      icon: <FaRecycle size={24} />,
      title: "Redeem & Kontribusi",
      description: "Gunakan poin Anda di Marketplace atau tukarkan dengan barang daur ulang eksklusif.",
      color: "green"
    }
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] -z-10 rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 text-center">
         
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase italic leading-none mb-6 animate-fade-in-up">
            Bagaimana <span className="text-primary">Amerta</span> Bekerja?
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400 text-lg font-medium leading-relaxed animate-fade-in-up delay-100">
            Kami membangun ekosistem fashion sirkular yang transparan, didukung oleh teknologi AI untuk memastikan setiap pakaian mendapatkan kehidupan kedua yang layak.
          </p>
        </div>
      </section>

      {/* Mission & Purpose */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-left">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-foreground uppercase tracking-tight italic">Masalah & Solusi</h2>
              <div className="w-20 h-1.5 bg-primary rounded-full" />
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-black/5 dark:border-white/10 shadow-xl">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-black">!</span>
                  Krisis Limbah Tekstil
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
                  Industri fashion adalah penyumbang polusi terbesar kedua di dunia. Jutaan ton pakaian dibuang ke TPA setiap tahun, padahal sebagian besar masih sangat layak digunakan.
                </p>
              </div>

              <div className="bg-primary/10 p-8 rounded-[32px] border border-primary/20 shadow-xl">
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                  <FaCheckCircle /> Solusi Amerta
                </h3>
                <p className="text-foreground/80 text-sm leading-relaxed font-medium">
                  Amerta menghubungkan donatur, pengolah limbah, dan komunitas kreatif dalam satu platform. Kami memastikan pakaian Anda tidak berakhir sebagai sampah, melainkan sebagai sumber daya baru.
                </p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-right">
             <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary-light/5 rounded-[60px] flex items-center justify-center relative overflow-hidden group border border-white/10">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <FaRecycle size={200} className="text-primary/20 animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-center p-10">
                      <FaLeaf size={64} className="text-primary mx-auto mb-6" />
                      <p className="text-2xl font-black text-foreground uppercase tracking-tighter italic">Sirkularitas Total</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-black/5 dark:bg-white/[0.02] py-32 border-y border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter italic mb-4">4 Langkah Mudah</h2>
            <p className="text-gray-500 font-medium">Ikuti panduan ini untuk mulai berkontribusi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px border-t border-dashed border-gray-300 dark:border-white/10 -z-10" />
                )}
                <div className="bg-white dark:bg-[#0f0f0f] p-8 rounded-[40px] border border-black/5 dark:border-white/10 shadow-lg hover:border-primary/50 transition-all duration-500 group-hover:-translate-y-2">
                  <div className={`w-16 h-16 rounded-[22px] bg-primary/10 text-primary flex items-center justify-center mb-8 shadow-inner`}>
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-black text-foreground uppercase tracking-tight mb-4">{step.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{step.description}</p>
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center font-black text-xs shadow-lg border-4 border-background">
                  0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Gatekeeper Deep Dive */}
      <section className="max-w-7xl mx-auto px-4 py-32">
        <div className="bg-gradient-to-br from-amerta-dark to-black rounded-[60px] p-12 md:p-20 relative overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[2px]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Platform Exclusive
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                AI Quality <span className="text-primary">Gatekeeper</span>
              </h2>
              <p className="text-gray-400 text-lg font-medium leading-relaxed">
                Teknologi kecerdasan buatan kami menganalisis ribuan parameter untuk menentukan grade pakaian:
              </p>
              
              <ul className="space-y-4">
                {[
                  "Deteksi noda, lubang, dan kerusakan tekstil otomatis.",
                  "Klasifikasi jenis bahan dan potensi daur ulang.",
                  "Estimasi nilai poin berdasarkan kondisi riil.",
                  "Transparansi penuh untuk donatur dan penerima."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white/80 font-bold text-sm">
                    <FaCheckCircle className="text-primary shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
               <div className="p-10 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-xl">
                  <FaShieldAlt size={48} className="text-primary mb-6" />
                  <h4 className="text-2xl font-black text-white uppercase mb-4">Akurasi 99.8%</h4>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    Kami menggunakan model Computer Vision terbaru yang dilatih khusus untuk mendeteksi kualitas tekstil dengan tingkat presisi tinggi.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter italic mb-8 leading-tight">
          Siap Memulai Perjalanan <br /> <span className="text-primary">Circular Fashion</span> Anda?
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/register"
            className="bg-primary text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[2px] text-[12px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
          >
            Daftar Sekarang <FaArrowRight />
          </Link>
          <Link
            href="/komunitas"
            className="bg-white/5 border border-white/10 text-foreground px-12 py-5 rounded-2xl font-black uppercase tracking-[2px] text-[12px] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <FaUsers /> Lihat Komunitas
          </Link>
        </div>
      </section>

    </div>
  );
}
