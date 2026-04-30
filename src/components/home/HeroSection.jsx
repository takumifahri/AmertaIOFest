"use client";

import Link from "next/link";
import { FaArrowRight, FaLeaf, FaRecycle, FaMapPin, FaStar } from "react-icons/fa";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-40 transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-amerta-green/10 dark:bg-amerta-green/10 blur-[150px] animate-pulse" />
        <div className="absolute top-[40%] -left-[5%] w-[500px] h-[500px] rounded-full bg-amerta-accent/10 dark:bg-amerta-accent/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Main Copy */}
          <div className="lg:col-span-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[3px] text-primary mb-8 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Next Gen Circular Hub</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[0.95]">
              Berikan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary to-primary-light">
                Kehidupan Kedua
              </span>{" "}
              Pakaianmu.
            </h1>
            
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-lg leading-relaxed font-medium">
              Amerta mengubah limbah tekstil menjadi nilai guna tinggi. Transparansi penuh dengan <span className="text-primary font-bold">AI Quality Gatekeeper</span> untuk setiap helai pakaian yang kamu sirkulasikan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 mb-14">
              <Link
                href="/register"
                className="group relative inline-flex justify-center items-center gap-3 bg-primary text-white dark:text-black px-10 py-5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 overflow-hidden shadow-xl shadow-primary/20"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">Mulai Berdonasi</span> <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex justify-center items-center gap-3 bg-white/5 text-foreground border border-white/10 px-10 py-5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95"
              >
                Pelajari Caranya
              </Link>
            </div>
            
            {/* Social Proof / Stats */}
            <div className="flex gap-12 items-center pt-10 border-t border-gray-200 dark:border-white/5">
              <div>
                <p className="text-4xl font-black text-foreground tracking-tighter">5K+</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-[2px] font-bold mt-1">Users</p>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-white/10" />
              <div>
                <p className="text-4xl font-black text-foreground tracking-tighter">12<span className="text-xl">t</span></p>
                <p className="text-[10px] text-gray-400 uppercase tracking-[2px] font-bold mt-1">Saved</p>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-white/10" />
              <div>
                <p className="text-4xl font-black text-foreground tracking-tighter">40+</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-[2px] font-bold mt-1">Partners</p>
              </div>
            </div>
          </div>

          {/* Hero Visuals */}
          <div className="lg:col-span-6 relative h-[700px] flex items-center justify-center">
            {/* Main Image Container */}
            <div className="relative w-[85%] h-[85%] rounded-[60px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] z-10 border border-white/50 dark:border-white/10 group">
              <Image 
                src="/images/hero-amerta.png" 
                alt="Amerta Circular Fashion" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            {/* Hyper-Premium Floating Cards
            <div className="absolute -bottom-4 -left-4 bg-white/90 dark:bg-surface/90 backdrop-blur-2xl p-6 rounded-[32px] shadow-2xl z-20 border border-white/50 dark:border-white/10 animate-float">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <FaMapPin size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-foreground uppercase tracking-wider">12 Titik Drop-off</p>
                  <p className="text-[9px] font-medium text-gray-400">Terdeteksi di dekat Anda</p>
                </div>
              </div>
            </div> */}

            {/* <div className="absolute top-10 -right-4 bg-white/90 dark:bg-surface/90 backdrop-blur-2xl p-6 rounded-[32px] shadow-2xl z-20 border border-white/50 dark:border-white/10 animate-float-slow">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-accent text-white rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                  <FaRecycle size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-foreground uppercase tracking-wider">+450 Point</p>
                  <p className="text-[9px] font-medium text-gray-400">2.5kg Pakaian Bersih</p>
                </div>
              </div>
            </div> */}

            {/* Decorative Background Blob */}
            <div className="absolute -z-10 w-full h-full bg-primary/5 rounded-full blur-[100px] scale-150" />
          </div>
        </div>
      </div>
    </section>
  );
}
