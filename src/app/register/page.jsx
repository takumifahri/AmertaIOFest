"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaRecycle, FaGoogle, FaArrowLeft } from "react-icons/fa";
import api from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "USER",
    companyName: "",
    companyPhone: "",
    companyAddress: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const performRegistration = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      };

      if (formData.address) payload.address = formData.address;

      if (formData.role === "COMPANY") {
        payload.companyData = [{
          name: formData.companyName,
          phone: formData.companyPhone,
          address: formData.companyAddress,
        }];
      }

      const res = await api.post("/auth/register", payload);
      setStep(3); // Go to OTP verification step
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Gagal melakukan pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (formData.role === "COMPANY") {
      setStep(2); // Go to company info step
    } else {
      await performRegistration();
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    await performRegistration();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Masukkan 6 digit kode OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/verify-otp", { otp: otpValue });
      router.push("/login?verified=true");
    } catch (err) {
      setError(err.response?.data?.message || "OTP tidak valid atau kadaluarsa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background transition-colors duration-500 selection:bg-primary selection:text-white">
      
      {/* Left Column - Visual */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80" 
          alt="Sustainable Fashion" 
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.3]" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-background/90 z-10" />
        
        <div className="relative z-20 h-full flex flex-col justify-between p-24">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 group cursor-pointer text-[10px] font-black uppercase tracking-[3px] text-white/50 hover:text-white transition-all">
               <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
            </Link>
          </div>
          
          <div>
            <div className="p-4 bg-primary text-white rounded-[24px] shadow-2xl shadow-primary/30 inline-block mb-10">
              <FaRecycle size={32} />
            </div>
            <h2 className="text-5xl xl:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9] uppercase italic">
              Lebih dari <br/><span className="text-primary-light">membersihkan</span> <br/>lemari.
            </h2>
            <p className="text-lg text-white/60 max-w-md leading-relaxed font-medium">
              Daftar sekarang untuk mendigitalkan lemari pakaianmu. Kumpulkan Amerta point di setiap donasi dan dapatkan reward eksklusif.
            </p>
          </div>
          
          <div className="flex gap-6 items-center">
            <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-xl" />
              ))}
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-white/80">Join 5,000+ heroes.</p>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 relative">
        <div className="lg:hidden absolute top-10 left-8 sm:left-12">
          <Link href="/" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all">
            <FaArrowLeft /> Kembali
          </Link>
        </div>
        
        <div className="mx-auto w-full max-w-md animate-fade-in-up">
          {step === 1 ? (
            <>
              <div className="mb-12 text-center sm:text-left mt-12 lg:mt-0">
                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tighter uppercase italic">Create <span className="text-primary">Account</span></h1>
                <p className="text-gray-500 font-medium">Lengkapi data di bawah ini untuk memulai langkahmu.</p>
              </div>

              {error && (
                <div className="mb-8 p-5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold border border-red-100 dark:border-red-500/20">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleStep1Submit}>
                <div>
                  <label htmlFor="role" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    Mendaftar Sebagai
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-5 py-4 bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                  >
                    <option value="USER">Personal / Individu</option>
                    <option value="COMPANY">Perusahaan / Mitra</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                      Nama Lengkap
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Rizal Pramoedya"
                      className="appearance-none block w-full px-5 py-4 bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                      Nomor Telepon
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0812xxxxxx"
                      className="appearance-none block w-full px-5 py-4 bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                    />
                  </div>
                </div>

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
                  <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    Kata Sandi
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Buat sandi yang kuat"
                    className="appearance-none block w-full px-5 py-4 bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                  />
                </div>

                <div className="flex items-start mt-6 mb-8">
                  <div className="flex items-center h-6">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-5 w-5 text-primary focus:ring-primary/20 border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-[12px] font-medium leading-relaxed">
                    <label htmlFor="terms" className="text-gray-500">
                      Saya menyetujui {' '}
                      <a href="#" className="font-black text-primary hover:underline uppercase tracking-tighter">
                        Syarat Ketentuan
                      </a>{' '}
                      dan {' '}
                      <a href="#" className="font-black text-primary hover:underline uppercase tracking-tighter">
                        Privasi
                      </a>.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-5 px-4 bg-primary text-white dark:text-black rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10">{loading ? 'Memproses...' : (formData.role === "COMPANY" ? "Lanjut Pendaftaran" : "Daftar Sekarang")}</span>
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm font-medium text-gray-500">
                  Sudah punya akun?{' '}
                  <Link href="/login" className="font-black text-primary hover:underline uppercase tracking-tighter">
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </>
          ) : step === 2 ? (
            <>
              <div className="mb-12 text-center sm:text-left mt-12 lg:mt-0">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-3 mb-8 group cursor-pointer text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all"
                >
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali
                </button>
                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tighter uppercase italic">Company <span className="text-primary">Info</span></h1>
                <p className="text-gray-500 font-medium">Validasi entitas untuk menyelesaikan pendaftaran.</p>
              </div>

              <form className="space-y-6" onSubmit={handleStep2Submit}>
                <div>
                  <label htmlFor="companyName" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Nama Perusahaan*</label>
                  <input 
                    id="companyName" 
                    name="companyName" 
                    required 
                    value={formData.companyName} 
                    onChange={handleInputChange} 
                    type="text" 
                    placeholder="PT Hijau Bumi"
                    className="appearance-none block w-full px-5 py-4 bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="companyPhone" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Telepon</label>
                    <input 
                      id="companyPhone" 
                      name="companyPhone" 
                      value={formData.companyPhone} 
                      onChange={handleInputChange} 
                      type="tel" 
                      placeholder="021xxxxxxx"
                      className="appearance-none block w-full px-5 py-4 bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                    />
                  </div>
                  <div>
                    <label htmlFor="companyAddress" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Alamat</label>
                    <input 
                      id="companyAddress" 
                      name="companyAddress" 
                      value={formData.companyAddress} 
                      onChange={handleInputChange} 
                      type="text" 
                      placeholder="Graha Bumi Hijau"
                      className="appearance-none block w-full px-5 py-4 bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-5 px-4 bg-primary text-white dark:text-black rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10">{loading ? 'Memproses...' : 'Daftarkan Perusahaan'}</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-12 text-center sm:text-left mt-12 lg:mt-0">
                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tighter uppercase italic">Verify <span className="text-primary">Email</span></h1>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Kami telah mengirimkan 6 digit kode OTP ke <br/><span className="font-black text-primary">{formData.email}</span>.
                </p>
              </div>

              <form className="space-y-8" onSubmit={handleVerifyOtp}>
                <div className="flex justify-between gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-full h-16 text-center text-2xl font-black bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="group relative w-full flex justify-center py-5 px-4 bg-primary text-white dark:text-black rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10">{loading ? 'Verifying...' : 'Konfirmasi Kode'}</span>
                </button>
              </form>

              <p className="mt-10 text-center text-sm font-medium text-gray-500">
                Belum menerima kode?{' '}
                <button
                  onClick={() => {/* resend logic */}}
                  className="font-black text-primary hover:underline focus:outline-none uppercase tracking-tighter"
                >
                  Kirim Ulang
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>  
  );
}
