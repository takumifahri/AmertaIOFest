import { FaArrowRight, FaTint, FaCloud, FaLeaf, FaRecycle } from "react-icons/fa";

export default function ImpactSection() {
  return (
    <section className="relative py-32 bg-primary dark:bg-surface overflow-hidden transition-colors duration-500">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <h2 className="text-sm font-black tracking-[4px] uppercase mb-4 text-secondary">Dampak Nyata</h2>
            <h3 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-white">
              Tindakan Kecil, <br/><span className="text-secondary">Dampak Global.</span>
            </h3>
            <p className="text-lg text-white/70 mb-10 max-w-lg leading-relaxed font-medium">
              Membuang pakaian ke tempat sampah menciptakan beban lingkungan absolut. Melalui Amerta, Anda berkontribusi langsung menurunkan jejak karbon.
            </p>
            
            <button className="bg-white text-primary hover:bg-secondary hover:text-white px-10 py-5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3">
              Lihat Laporan Dampak <FaArrowRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: <FaTint />, val: "2.5M", unit: "L", label: "Air Terhemat" },
              { icon: <FaCloud />, val: "1.2k", unit: "Kg", label: "Emisi CO2" },
              { icon: <FaLeaf />, val: "450", unit: "+", label: "Pohon Terlindungi" },
              { icon: <FaRecycle />, val: "85%", unit: "", label: "Efisiensi Sirkular" }
            ].map((stat, i) => (
              <div key={i} className="group bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-[32px] p-8 border border-white/20 dark:border-white/10 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2">
                <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <h4 className="text-4xl font-black mb-2 text-white">{stat.val}<span className="text-xl font-normal ml-1 text-white/60">{stat.unit}</span></h4>
                <p className="text-sm font-bold uppercase tracking-widest text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
