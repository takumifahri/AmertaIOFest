import Link from "next/link";
import { FaRecycle, FaGoogle, FaArrowLeft } from "react-icons/fa";

export const metadata = {
  title: "Masuk | Amerta",
  description: "Masuk ke akun Amerta Anda.",
};

export default function LoginPage({ searchParams }) {
  const verified = searchParams?.verified === "true";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-28 relative">
        <Link href="/" className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-amerta-dark transition-colors">
          <FaArrowLeft /> Kembali ke Beranda
        </Link>
        
        <div className="mx-auto w-full max-w-sm lg:max-w-md animate-fade-in-up">
          <div className="mb-10 text-center sm:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="p-2 bg-amerta-green text-white rounded-xl">
                <FaRecycle size={28} />
              </div>
              <span className="font-bold text-3xl tracking-tighter text-amerta-dark">
                Amerta
              </span>
            </Link>
            <h1 className="text-3xl font-extrabold text-amerta-dark mb-2 tracking-tight">Selamat Datang Kembali</h1>
            <p className="text-gray-500 text-sm">Lanjutkan kontribusi Anda untuk bumi hari ini.</p>
          </div>

          {verified && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-200">
              Akun Anda berhasil diverifikasi. Silakan masuk.
            </div>
          )}

          <div className="mt-8">
            <form className="space-y-5" action="#" method="POST">
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
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-amerta-dark">
                    Kata Sandi
                  </label>
                  <a href="#" className="hidden sm:inline-block text-xs font-medium text-amerta-green hover:underline">
                    Lupa sandi?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="appearance-none block w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amerta-green focus:border-transparent transition-all sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-between sm:hidden">
                <a href="#" className="text-sm font-medium text-amerta-green hover:underline">
                  Lupa sandi?
                </a>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-amerta-green hover:bg-opacity-90 transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerta-green"
              >
                Masuk ke Akun
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-gray-500">Atau masuk dengan</span>
                </div>
              </div>

              <div className="mt-6 gap-3 flex">
                <button
                  type="button"
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm bg-surface border border-gray-200 dark:border-gray-800 text-sm font-medium text-amerta-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <FaGoogle className="text-red-500" />
                  Google
                </button>
              </div>
            </div>
            
            <p className="mt-10 text-center text-sm text-gray-500">
              Belum punya akun?{' '}
              <Link href="/register" className="font-semibold text-amerta-green hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Column - Visual */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-black">
        <img 
          src="https://plus.unsplash.com/premium_photo-1683072005067-455d56d323b4?auto=format&fit=crop&q=80" 
          alt="Recycle Clothes Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/80 z-10" />
        
        <div className="relative z-20 h-full flex flex-col justify-center items-start p-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-medium mb-8">
            <FaRecycle /> Kehidupan Kedua
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Bagikan. Daur Ulang. <br />Ubah Gaya Hidup.
          </h2>
          <p className="text-lg text-white/80 max-w-md leading-relaxed">
            Menjadi bagian dari Amerta berarti kamu ikut menurunkan emisi karbon industri tekstil. Yuk jadikan aksi kecil ini berdampak besar.
          </p>
          
          {/* Mock testimonial / stat */}
          <div className="mt-16 bg-white/10 backdrop-blur border border-white/20 p-6 rounded-2xl max-w-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-white">40+</div>
              <div>
                <p className="text-white font-medium">Mitra Terpercaya</p>
                <div className="flex gap-1 text-sm text-amerta-light-green">Yayasan & Daur Ulang</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
