"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // hapus useSearchParams
import { FaRecycle, FaGoogle, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVerified(params.get("verified") === "true");
  }, []);

  useEffect(() => {
    if (verified) {
      toast.success("Akun Anda berhasil diverifikasi. Silakan masuk.", {
        duration: 5000,
      });
    }
  }, [verified]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);
      toast.success("Berhasil masuk!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Kredensial tidak valid atau salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background transition-colors duration-500">
      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 relative">
        <Link href="/" className="absolute top-10 left-8 sm:left-12 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali
        </Link>

        <div className="mx-auto w-full max-w-md animate-fade-in-up">
          <div className="mb-12 text-center sm:text-left">
            <Link href="/" className="inline-flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                <FaRecycle size={28} />
              </div>
              <span className="font-black text-4xl tracking-tighter text-foreground uppercase italic">
                Amerta
              </span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tighter uppercase italic">Welcome <span className="text-primary">Back</span></h1>
            <p className="text-gray-500 font-medium">Lanjutkan kontribusi Anda untuk bumi hari ini.</p>
          </div>

          <div className="mt-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                  Alamat Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="anda@email.com"
                  className="appearance-none block w-full px-5 py-4 bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Kata Sandi
                  </label>
                  <a href="#" className="hidden sm:inline-block text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                    Lupa sandi?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-5 py-4 bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                />
              </div>

              <div className="flex items-center justify-between sm:hidden">
                <a href="#" className="text-xs font-black uppercase tracking-widest text-primary hover:underline">
                  Lupa sandi?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-5 px-4 bg-primary text-white dark:text-black rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">{loading ? 'Memproses...' : 'Masuk ke Akun'}</span>
              </button>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100 dark:border-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="px-4 bg-background text-gray-400 font-black uppercase tracking-widest">Atau masuk dengan</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  className="w-full flex justify-center items-center gap-3 py-4 px-4 rounded-2xl bg-surface border border-gray-100 dark:border-white/5 text-[12px] font-black uppercase tracking-widest text-foreground hover:bg-gray-50 dark:hover:bg-white/5 transition-all hover:shadow-lg"
                >
                  <FaGoogle className="text-red-500" />
                  Google
                </button>
              </div>
            </div>

            <p className="mt-12 text-center text-sm font-medium text-gray-500">
              Belum punya akun?{' '}
              <Link href="/register" className="font-black text-primary hover:underline uppercase tracking-tighter">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Visual */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80"
          alt="Recycle Clothes Background"
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-background/90 z-10" />

        <div className="relative z-20 h-full flex flex-col justify-center items-start p-24">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[3px] mb-10">
            <FaRecycle className="text-primary-light" /> Kehidupan Kedua
          </div>
          <h2 className="text-5xl xl:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9] uppercase italic">
            Bagikan.<br /> Daur Ulang.<br /> <span className="text-primary-light">Ubah Gaya Hidup.</span>
          </h2>
          <p className="text-lg text-white/60 max-w-md leading-relaxed font-medium">
            Menjadi bagian dari Amerta berarti kamu ikut menurunkan emisi karbon industri tekstil secara kolektif.
          </p>

        </div>
      </div>
    </div>
  );
}
