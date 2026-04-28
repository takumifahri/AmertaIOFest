"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  FaHome, FaBoxOpen, FaCommentDots, 
  FaHistory, FaRobot, FaUser, FaStar, 
  FaSignOutAlt, FaRecycle, FaBars, FaChevronLeft, FaLeaf
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "@/lib/axios";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Berhasil keluar.");
      router.push("/login");
    } catch (err) {
      toast.error("Gagal melakukan logout.");
    }
  };

  const navItems = [
    { label: "Overview", icon: FaHome, href: "/dashboard" },
    { label: "Manajemen Barang", icon: FaBoxOpen, href: "/dashboard/items" },
    { label: "Chat", icon: FaCommentDots, href: "/dashboard/chat" },
    { label: "Histori Aktivitas", icon: FaHistory, href: "/dashboard/history" },
    { label: "AI Kurator", icon: FaRobot, href: "/dashboard/ai" },
    { label: "Komunitas", icon: FaLeaf, href: "/komunitas" },
    { label: "Profil Saya", icon: FaUser, href: "/dashboard/profile" },
    { label: "Amerta Points", icon: FaStar, href: "/dashboard/points" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-6 left-6 z-50">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-4 bg-primary text-white rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center border border-white/20 active:scale-95 transition-transform"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Main Sidebar */}
      <div 
        className={`fixed md:relative z-40 inset-y-0 left-0 transition-all duration-300 ease-in-out bg-background border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between h-full min-h-screen
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-2 overflow-hidden">
              <div className="w-10 h-10 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center p-1 shrink-0 border border-gray-100 dark:border-white/10 shadow-sm">
                <img src="/images/logo.png" alt="Amerta Logo" className="w-full h-full object-contain" />
              </div>
              {!isCollapsed && (
                <span className="font-bold text-2xl tracking-tighter text-foreground whitespace-nowrap animate-in fade-in slide-in-from-left-2 transition-all uppercase italic">
                  Amerta
                </span>
              )}
            </Link>
            <button 
              onClick={() => {
                if (window.innerWidth < 768) setIsMobileOpen(false);
                else setIsCollapsed(!isCollapsed);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-foreground transition-colors"
            >
              <FaChevronLeft className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm group ${
                    isActive 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-primary"} shrink-0`} />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap animate-in fade-in slide-in-from-left-1">
                      {item.label}
                    </span>
                  )}
                  {isCollapsed && (
                    <div className="md:fixed left-16 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ml-2">
                       {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
          {user && (
            <div className={`flex items-center gap-3 p-2 rounded-2xl bg-gray-50 dark:bg-white/5 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
               <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                      {user.name?.charAt(0)}
                    </div>
                  )}
               </div>
               {!isCollapsed && (
                 <div className="overflow-hidden">
                    <p className="text-xs font-black truncate text-foreground uppercase tracking-tight">{user.name}</p>
                    <p className="text-[10px] text-gray-500 truncate font-medium">Verified Citizen</p>
                 </div>
               )}
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 group`}
          >
            <FaSignOutAlt className="shrink-0" />
            {!isCollapsed && <span>Keluar Akun</span>}
            {isCollapsed && (
              <div className="md:fixed left-16 bg-red-500 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ml-2">
                Keluar Akun
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
