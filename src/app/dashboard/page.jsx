export default function DashboardOverview() {
  return (
    <div className="p-6 md:p-12 pt-24 md:pt-12 animate-fade-in-up">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-2 italic uppercase">Dashboard</h1>
        <p className="text-gray-500 font-medium text-sm md:text-base">Mulai kelola pakaian dan bantu selamatkan bumi hari ini.</p>
      </header>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {[
          { label: "Pakaian Didonasikan", val: "0", sub: "Helai", color: "text-foreground" },
          { label: "Transaksi Aktif", val: "0", sub: "Proses", color: "text-foreground" },
          { label: "Total Points", val: "0", sub: "AP", color: "text-primary" }
        ].map((card, i) => (
          <div key={i} className="bg-background border border-gray-100 dark:border-white/5 p-8 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 group">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{card.label}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-5xl font-black tracking-tighter ${card.color}`}>{card.val}</p>
              <p className="text-sm font-bold text-gray-400">{card.sub}</p>
            </div>
            <div className="mt-6 h-1 w-full bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-primary w-1/3 group-hover:w-1/2 transition-all duration-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
