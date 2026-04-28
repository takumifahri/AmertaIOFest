import { MdOutlineDocumentScanner } from "react-icons/md";
import { FaMap, FaCoins } from "react-icons/fa";

export default function FeatureList() {
  const features = [
    {
      id: "ai-gatekeeper",
      icon: <MdOutlineDocumentScanner size={32} />,
      title: "AI Quality Gatekeeper",
      description: "Deep Learning kami mendeteksi kerusakan, noda, dan membagi kondisi pakaian ke dalam 4 kategori kelayakan.",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      id: "hyper-local",
      icon: <FaMap size={32} />,
      title: "Hyper-Local Hub",
      description: "Algoritma geolokasi mencocokkan Anda dengan titik Drop-off terdekat untuk meminimalisir emisi transportasi.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "tokenomics",
      icon: <FaCoins size={32} />,
      title: "Amarta Tokenomics",
      description: "Setiap gram tekstil dihargai. Kumpulkan Amarta Point untuk ditukarkan dengan diskon mitra brand berkelanjutan.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    }
  ];

  return (
    <section className="py-32 bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 px-4">
          <h2 className="text-[10px] font-black text-primary tracking-[4px] uppercase mb-4">Solusi Amerta</h2>
          <h3 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-8 italic uppercase">
            Infrastruktur <span className="text-primary">Masa Depan</span>
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
            Kami mengubah cara pandang masyarakat terhadap sampah tekstil dari produk sekali pakai menjadi aset berharga yang terintegrasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className="group bg-surface rounded-[40px] p-10 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gray-50 dark:bg-white/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-125" />
              
              <div className={`inline-flex p-5 rounded-2xl ${feature.bgColor} ${feature.color} mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              
              <h4 className="text-2xl font-black text-foreground mb-6 tracking-tight">
                {feature.title}
              </h4>
              
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                {feature.description}
              </p>
              
              <div className="mt-8 pt-8 border-t border-gray-50 dark:border-white/5">
                 <span className="text-[10px] font-black uppercase tracking-[2px] text-primary group-hover:gap-3 flex items-center gap-2 transition-all cursor-pointer">
                    Pelajari Selengkapnya →
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
