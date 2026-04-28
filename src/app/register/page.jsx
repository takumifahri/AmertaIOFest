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
    <div className="min-h-screen flex bg-background">
      
      {/* Left Column - Visual */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-black">
        <img 
          src="https://plus.unsplash.com/premium_photo-1683072005067-455d56d323b4?auto=format&fit=crop&q=80" 
          alt="Recycle Clothes Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-black/80 z-10" />
        
        <div className="relative z-20 h-full flex flex-col justify-between p-20">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group cursor-pointer text-white/50 hover:text-white transition-colors">
               <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali
            </Link>
          </div>
          
          <div>
            <div className="p-3 bg-white/10 backdrop-blur rounded-2xl inline-block mb-8">
              <FaRecycle size={40} className="text-white" />
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Lebih dari sekadar <br/> membersihkan lemari.
            </h2>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Daftar sekarang untuk mendigitalkan lemari pakaianmu. Kumpulkan Amerta point di setiap donasi dan dapatkan reward dari brand-brand ramah lingkungan.
            </p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-amerta-dark" />
              <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-amerta-dark" />
              <div className="w-10 h-10 rounded-full bg-gray-500 border-2 border-amerta-dark" />
            </div>
            <p className="text-sm font-medium text-white/80">Bergabung bersama 5,000+ pahlawan bumi.</p>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-28 relative">
        <div className="lg:hidden absolute top-8 left-8 sm:left-12">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-amerta-dark transition-colors">
            <FaArrowLeft /> Kembali
          </Link>
        </div>
        
        <div className="mx-auto w-full max-w-sm lg:max-w-md animate-fade-in-up">
          {step === 1 ? (
            <>
              <div className="mb-10 text-center sm:text-left mt-8 lg:mt-0">
                <h1 className="text-3xl font-extrabold text-amerta-dark mb-2 tracking-tight">Buat Akun Baru</h1>
                <p className="text-gray-500 text-sm">Lengkapi data di bawah ini untuk memulai langkahmu.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleStep1Submit}>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-amerta-dark mb-1">
                    Mendaftar Sebagai
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all sm:text-sm"
                  >
                    <option value="USER">Personal / Individu</option>
                    <option value="COMPANY">Perusahaan / Mitra</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-amerta-dark mb-1">
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
                      className="appearance-none block w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-amerta-dark mb-1">
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
                      className="appearance-none block w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-amerta-dark mb-1">
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
                    className="appearance-none block w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-amerta-dark mb-1">
                    Alamat Lengkap (Opsional)
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Jl. Kebahagiaan No 1"
                    className="appearance-none block w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-amerta-dark mb-1">
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
                    className="appearance-none block w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-400">Minimal 6 karakter.</p>
                </div>

                <div className="flex items-start mt-4 mb-6">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-amerta-green focus:ring-amerta-green border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div className="ml-2 text-sm max-w-xs">
                    <label htmlFor="terms" className="text-gray-500">
                      Saya menyetujui {' '}
                      <a href="#" className="font-medium text-amerta-green hover:underline">
                        Syarat Ketentuan
                      </a>{' '}
                      dan {' '}
                      <a href="#" className="font-medium text-amerta-green hover:underline">
                        Kebijakan Privasi
                      </a>.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-amerta-green hover:bg-opacity-90 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerta-green mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Memproses...' : (formData.role === "COMPANY" ? "Pendaftaran Lanjut" : "Mulai Petualangan Sirkuler")}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-background text-gray-500">Daftar instan</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm bg-surface border border-gray-200 dark:border-gray-800 text-sm font-medium text-amerta-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FaGoogle className="text-red-500" />
                    Google
                  </button>
                </div>
              </div>
              
              <p className="mt-8 text-center text-sm text-gray-500">
                Sudah punya akun?{' '}
                <Link href="/login" className="font-semibold text-amerta-green hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </>
          ) : step === 2 ? (
            <>
              {/* Step 2 - Data Perusahaan */}
              <div className="mb-10 text-center sm:text-left mt-8 lg:mt-0">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 mb-6 group cursor-pointer text-gray-500 hover:text-amerta-dark transition-colors text-sm"
                >
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali
                </button>
                <h1 className="text-3xl font-extrabold text-amerta-dark mb-2 tracking-tight">Data Perusahaan</h1>
                <p className="text-gray-500 text-sm">Validasi entitas untuk menyelesaikan pendaftaran.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleStep2Submit}>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-amerta-dark mb-1">Nama Perusahaan*</label>
                  <input 
                    id="companyName" 
                    name="companyName" 
                    required 
                    value={formData.companyName} 
                    onChange={handleInputChange} 
                    type="text" 
                    placeholder="PT Hijau Bumi"
                    className="appearance-none block w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all sm:text-sm" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="companyPhone" className="block text-sm font-medium text-amerta-dark mb-1">Telepon Perusahaan</label>
                    <input 
                      id="companyPhone" 
                      name="companyPhone" 
                      value={formData.companyPhone} 
                      onChange={handleInputChange} 
                      type="tel" 
                      placeholder="021xxxxxxx"
                      className="appearance-none block w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all sm:text-sm" 
                    />
                  </div>
                  <div>
                    <label htmlFor="companyAddress" className="block text-sm font-medium text-amerta-dark mb-1">Alamat Perusahaan</label>
                    <input 
                      id="companyAddress" 
                      name="companyAddress" 
                      value={formData.companyAddress} 
                      onChange={handleInputChange} 
                      type="text" 
                      placeholder="Graha Bumi Hijau"
                      className="appearance-none block w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all sm:text-sm" 
                    />
                  </div>
                </div>

                <div className="flex items-start mt-4 mb-6 pt-4">
                  <div className="flex items-center h-5">
                    <input
                      id="terms2"
                      name="terms2"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-amerta-green focus:ring-amerta-green border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div className="ml-2 text-sm max-w-xs">
                    <label htmlFor="terms2" className="text-gray-500">
                      Entitas yang saya daftarkan sah dan mewakili saya.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-amerta-green hover:bg-opacity-90 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerta-green mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Memproses...' : 'Daftarkan Perusahaan'}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* OTP Verifikasi Step */}
              <div className="mb-10 text-center sm:text-left mt-8 lg:mt-0">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 mb-6 group cursor-pointer text-gray-500 hover:text-amerta-dark transition-colors text-sm"
                >
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali
                </button>
                <h1 className="text-3xl font-extrabold text-amerta-dark mb-2 tracking-tight">Verifikasi Email</h1>
                <p className="text-gray-500 text-sm">
                  Kami telah mengirimkan 6 digit kode OTP ke <span className="font-semibold text-amerta-dark">{formData.email}</span>.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleVerifyOtp}>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-lg font-bold bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-amerta-green hover:bg-opacity-90 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerta-green disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:-translate-y-0"
                >
                  {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-500">
                Belum menerima kode?{' '}
                <button
                  onClick={async () => {
                    try {
                      await api.post("/auth/resend-otp", { email: formData.email });
                      alert("OTP Resent!");
                    } catch (e) {
                      alert("Gagal mengirim ulang OTP");
                    }
                  }}
                  className="font-semibold text-amerta-green hover:underline focus:outline-none"
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
