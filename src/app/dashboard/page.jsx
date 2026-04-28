export default function DashboardOverview() {
  return (
    <div className="p-6 md:p-12 animate-fade-in-up">
      <h1 className="text-3xl font-extrabold text-amerta-dark tracking-tight mb-2">Selamat Datang di Amerta Dashboard</h1>
      <p className="text-gray-500">Mulai kelola pakaian dan bantu selamatkan bumi hari ini.</p>
      
      {/* Overview placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-background border border-gray-200 dark:border-gray-800 p-6 rounded-2xl">
          <p className="text-sm font-medium text-gray-500">Pakaian Didonasikan</p>
          <p className="text-3xl font-bold text-amerta-dark mt-2">0</p>
        </div>
        <div className="bg-background border border-gray-200 dark:border-gray-800 p-6 rounded-2xl">
          <p className="text-sm font-medium text-gray-500">Transaksi Aktif</p>
          <p className="text-3xl font-bold text-amerta-dark mt-2">0</p>
        </div>
        <div className="bg-background border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Points</p>
            <p className="text-3xl font-bold text-amerta-green mt-2">0 AP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
