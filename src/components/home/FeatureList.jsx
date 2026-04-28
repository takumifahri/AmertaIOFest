import { MdOutlineDocumentScanner } from "react-icons/md";
import { FaMap, FaCoins } from "react-icons/fa";

export default function FeatureList() {
  const features = [
    {
      id: "ai-gatekeeper",
      icon: <MdOutlineDocumentScanner size={36} />,
      title: "AI-Driven Quality Gatekeeper",
      description: "Ambil foto pakaian Anda. Model Deep Learning kami akan otomatis mendeteksi kerusakan, noda, dan membagi kondisi pakaian ke dalam 4 kategori kelayakan.",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      id: "hyper-local",
      icon: <FaMap size={36} />,
      title: "Hyper-Local Circle Hub",
      description: "Algoritma geolokasi kami mencocokkan Anda dengan titik Drop-off terdekat (Stasiun MRT, Toko Retail, Yayasan) untuk meminimalisir emisi transportasi.",
      color: "text-amerta-green",
      bgColor: "bg-amerta-green/10",
    },
    {
      id: "tokenomics",
      icon: <FaCoins size={36} />,
      title: "Gamified Tokenomics (Amarta Point)",
      description: "Setiap gram tekstil dihargai. Kumpulkan Amarta Point untuk ditukarkan dengan diskon mitra brand berkelanjutan atau dikonversi menjadi voucher donasi amal.",
      color: "text-amerta-accent",
      bgColor: "bg-amerta-accent/10",
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <h2 className="text-sm font-bold text-amerta-green tracking-widest uppercase mb-3">Solusi Kami</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-amerta-dark mb-6">
            Infrastruktur Tekstil Masa Depan
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Kami mengubah cara pandang masyarakat terhadap sampah tekstil dari produk sekali pakai menjadi aset berharga yang terintegrasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className="group bg-surface rounded-3xl p-8 border border-gray-100 dark:border-gray-800/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 dark:bg-white/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
              
              <div className={`inline-flex p-4 rounded-2xl ${feature.bgColor} ${feature.color} mb-6`}>
                {feature.icon}
              </div>
              
              <h4 className="text-xl font-bold text-amerta-dark mb-4">
                {feature.title}
              </h4>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
