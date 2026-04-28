import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 h-screen overflow-y-auto">
        <div className="min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
