import Link from "next/link";
import { FaArrowRight, FaLeaf, FaRecycle, FaMapPin } from "react-icons/fa";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background dark:bg-background pt-20 pb-32">
      {/* Abstract Background Design */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-amerta-light-green/20 dark:bg-amerta-light-green/5 blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-amerta-green/10 dark:bg-amerta-green/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Main Copy */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-800 text-sm font-medium text-amerta-green mb-6 shadow-sm">
              <FaLeaf size={16} />
              <span>Circular Economy untuk Pakaian Anda</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-amerta-dark mb-6 leading-[1.1]">
              Berikan{" "}
              <span className="text-amerta-green dark:text-amerta-light-green">
                Kehidupan Kedua
              </span>{" "}
              Untuk Pakaianmu.
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl leading-relaxed">
              Amerta mengubah limbah tekstil menjadi nilai guna. Jual, donasikan, atau daur ulang pakaian lama Anda secara transparan dengan AI Quality Gatekeeper dan dapatkan <strong>Amarta Point</strong> di setiap helainya.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/register"
                className="inline-flex justify-center items-center gap-2 bg-amerta-green hover:bg-opacity-90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all shadow-xl shadow-amerta-green/20 hover:shadow-amerta-green/40 hover:-translate-y-1"
              >
                Mulai Berdonasi <FaArrowRight size={20} />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex justify-center items-center gap-2 bg-white dark:bg-[#262E26] hover:bg-gray-50 dark:hover:bg-[#343F34] text-amerta-dark dark:text-amerta-sand border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-full text-lg font-medium transition-all"
              >
                Pelajari Caranya
              </Link>
            </div>
            
            {/* Social Proof / Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-3xl font-bold text-amerta-dark">5K+</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Pengguna</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-amerta-dark">12<span className="text-xl">Ton</span></p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Terselamatkan</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-amerta-dark">40+</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Mitra Yayasan</p>
              </div>
            </div>
          </div>

          {/* Hero Visuals */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Generate Image Prompt: Aesthetic minimal clothing rack with diverse organized clothes, sage green and earthy tones. */}
            <div className="absolute top-0 right-0 w-[85%] h-[85%] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 z-10 bg-black relative">
              <img 
                src="https://plus.unsplash.com/premium_photo-1683072005067-455d56d323b4?auto=format&fit=crop&q=80" 
                alt="Baju bekas didaur ulang" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-1000 hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6">
                 <p className="text-white/90 uppercase tracking-widest font-bold text-sm bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg inline-block border border-white/10">Amerta Environment</p>
              </div>
            </div>

            {/* Floating Cards for Features */}
            <div className="absolute bottom-16 left-0 bg-white dark:bg-surface p-5 rounded-2xl shadow-xl z-20 border border-gray-100 dark:border-gray-800 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amerta-green/10 text-amerta-green dark:text-amerta-light-green rounded-lg">
                  <FaMapPin size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-amerta-dark">12 Titik Drop-off</p>
                  <p className="text-xs text-gray-500">Terdeteksi di dekat Anda</p>
                </div>
              </div>
            </div>

            <div className="absolute top-24 -left-8 bg-white dark:bg-surface p-5 rounded-2xl shadow-xl z-20 border border-gray-100 dark:border-gray-800 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amerta-accent/10 text-amerta-accent rounded-lg">
                  <FaRecycle size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-amerta-dark">+450 Point</p>
                  <p className="text-xs text-gray-500">2.5kg Pakaian Bersih</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
