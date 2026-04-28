import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden relative">
        <div className="min-h-full pb-20 md:pb-12">
          {children}
        </div>
      </main>
    </div>
  );
}
