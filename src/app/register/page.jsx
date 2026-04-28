import Link from "next/link";
import { FaRecycle, FaGoogle, FaArrowLeft } from "react-icons/fa";

export const metadata = {
  title: "Daftar | Amerta",
  description: "Buat akun Amerta Anda dan gabung dalam sirkuler ekonomi.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-background">
      
      {/* Left Column - Visual (Reversed for diversity) */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-amerta-dark">
        <div className="absolute inset-0 bg-gradient-to-tr from-amerta-green/50 to-amerta-dark z-10" />
        
        {/* Abstract subtle waves */}
        <div className="absolute -bottom-[20%] -left-[20%] w-[150%] h-[150%] bg-amerta-green/10 rounded-[100%] z-0" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[120%] h-[120%] bg-white/5 rounded-[100%] z-0" />
        
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
          <div className="mb-10 text-center sm:text-left mt-8 lg:mt-0">
            <h1 className="text-3xl font-extrabold text-amerta-dark mb-2 tracking-tight">Buat Akun Baru</h1>
            <p className="text-gray-500 text-sm">Lengkapi data di bawah ini untuk memulai langkahmu.</p>
          </div>

          <form className="space-y-4" action="#" method="POST">
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
                placeholder="Rizal Pramoedya"
                className="appearance-none block w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all sm:text-sm"
              />
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
                placeholder="anda@email.com"
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
                placeholder="Buat sandi yang kuat"
                className="appearance-none block w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">Minimal 8 karakter, wajib mencakup alfabet dan angka.</p>
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
                    Syarat  Ketentuan
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
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-amerta-green hover:bg-opacity-90 transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerta-green mt-2"
            >
              Mulai Petualangan Sirkuler
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
        </div>
      </div>
      
    </div>
  );
}
