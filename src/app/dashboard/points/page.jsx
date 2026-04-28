export default function PointsPage() {
  return (
    <div className="p-6 md:p-12 animate-fade-in-up max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-amerta-dark tracking-tight">Amerta Points</h1>
        <p className="text-gray-500 mt-2">Tukarkan point Anda dengan berbagai kebaikan lingkungan.</p>
      </div>
      
      <div className="bg-gradient-to-br from-amerta-dark to-black rounded-2xl p-8 relative overflow-hidden shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div>
            <p className="text-white/70 font-medium mb-1">Total Saldo Points</p>
            <h2 className="text-5xl font-black text-amerta-light-green tracking-tight">0 <span className="text-2xl font-semibold text-white/50">AP</span></h2>
            <p className="text-white/60 text-sm mt-4 max-w-sm">Dapatkan points dengan mengirimkan pakaian limbah menggunakan DropPoint kami.</p>
          </div>
          
          <div className="mt-8 md:mt-0">
            <button className="px-6 py-3 bg-white text-amerta-dark font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-transform">
              Tukarkan Points
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-amerta-dark mb-4">Riwayat Penukaran</h3>
        <div className="bg-background rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-gray-400">Belum ada riwayat poin.</p>
        </div>
      </div>
    </div>
  );
}
