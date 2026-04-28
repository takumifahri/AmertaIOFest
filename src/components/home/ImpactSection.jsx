import { FaArrowRight, FaTint } from "react-icons/fa";
import { FiBarChart2, FiTrendingDown } from "react-icons/fi";

export default function ImpactSection() {
  return (
    <section className="py-24 bg-amerta-green text-white relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase mb-3 text-amerta-light-green">Dampak Nyata</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Tindakan Kecil, <br/>Dampak Global.
            </h3>
            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Membuang pakaian ke tempat sampah menciptakan beban lingkungan absolut. Melalui Amerta, Anda berkontribusi langsung menurunkan jejak karbon dan menjaga ketersediaan sumber daya alam bumi.
            </p>
            
            <button className="bg-white text-amerta-green hover:bg-amerta-sand px-8 py-4 rounded-full text-lg font-medium transition-all shadow-xl hover:-translate-y-1 flex items-center gap-2">
              Lihat Laporan Dampak <FaArrowRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <FaTint size={24} />
              </div>
              <h4 className="text-4xl font-bold mb-2">2.5M<span className="text-xl font-normal ml-1">L</span></h4>
              <p className="text-amerta-light-green text-sm font-medium">Air Bersih Dihemat</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 sm:translate-y-8">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <FiTrendingDown size={24} />
              </div>
              <h4 className="text-4xl font-bold mb-2">500<span className="text-xl font-normal ml-1">CO₂e</span></h4>
              <p className="text-amerta-light-green text-sm font-medium">Karbon Tereduksi</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <FiBarChart2 size={24} />
              </div>
              <h4 className="text-4xl font-bold mb-2">60<span className="text-xl font-normal ml-1">%</span></h4>
              <p className="text-amerta-light-green text-sm font-medium">Efisiensi Sortir AI</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 sm:translate-y-8">
               <h4 className="text-2xl font-bold mb-4">Mari wujudkan budaya tanding.</h4>
               <p className="text-sm text-white/80 mb-6">Lawan konsumerisme melalui praktik reuse-reduce-reproduce.</p>
               <a href="/register" className="inline-block text-amerta-light-green font-medium hover:text-white transition-colors underline underline-offset-4">Gabung Sekarang</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
