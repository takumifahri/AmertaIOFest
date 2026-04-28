"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  FaHome, FaBoxOpen, FaCommentDots, 
  FaHistory, FaRobot, FaUser, FaStar, 
  FaSignOutAlt, FaRecycle 
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "@/lib/axios";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

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
    { label: "Profil Saya", icon: FaUser, href: "/dashboard/profile" },
    { label: "Amerta Points", icon: FaStar, href: "/dashboard/points" },
  ];

  return (
    <div className="w-full md:w-64 bg-background border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between h-full min-h-screen">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="p-2 bg-amerta-green text-white rounded-xl">
            <FaRecycle size={24} />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-amerta-dark">
            Amerta
          </span>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive 
                    ? "bg-amerta-green text-white shadow-md shadow-amerta-green/20" 
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className={isActive ? "text-white" : "text-gray-400"} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <FaSignOutAlt /> Keluar Akun
        </button>
      </div>
    </div>
  );
}
