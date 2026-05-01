"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaArrowRight, FaClock, FaTimes } from "react-icons/fa";
import api from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";

export default function ProfileReminder() {
  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);

  // Don't show on auth pages or profile page itself
  const excludedPaths = ["/login", "/register", "/dashboard/profile"];
  const isExcluded = excludedPaths.some(path => pathname.startsWith(path));

  useEffect(() => {
    if (isExcluded) return;

    const checkProfile = async () => {
      try {
        // Simple cookie check (optional but better than calling API if we know we're logged out)
        const hasAuth = document.cookie.includes("isLoggedIn=true");
        if (!hasAuth) return;

        // Check localStorage first
        const dismissed = localStorage.getItem("amerta_profile_reminder_dismissed");
        if (dismissed === "true") return;

        const lastRemind = localStorage.getItem("amerta_profile_reminder_last_date");
        if (lastRemind) {
          const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
          if (Date.now() - parseInt(lastRemind) < twoDaysInMs) return;
        }

        const res = await api.get("/profile/"); // Use profile/me for full details
        const userData = res.data.data;
        setUser(userData);

        // Criteria for incomplete profile
        const isIncomplete = !userData.phone || !userData.address || userData.latitude === null || userData.longitude === null;

        if (isIncomplete) {
          setShow(true);
        }
      } catch (err) {
        // If 401/403, user is not logged in, just ignore
        if (err.response?.status === 401 || err.response?.status === 403) {
            return;
        }
        console.error("Failed to check profile", err);
      }
    };

    checkProfile();
  }, [pathname, isExcluded]);

  const handleRemindLater = () => {
    localStorage.setItem("amerta_profile_reminder_last_date", Date.now().toString());
    setShow(false);
  };

  const handleNeverRemind = () => {
    localStorage.setItem("amerta_profile_reminder_dismissed", "true");
    setShow(false);
  };

  const handleFixNow = () => {
    setShow(false);
    router.push("/dashboard/profile");
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-surface w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl border border-white/10"
        >
          <div className="p-10">
            <div className="w-20 h-20 bg-primary/20 text-primary rounded-[30px] flex items-center justify-center text-3xl mb-8 mx-auto">
              <FaExclamationTriangle />
            </div>
            
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black tracking-tighter uppercase mb-4">Profil Belum Lengkap!</h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Hai <span className="text-foreground font-bold">{user?.name}</span>, kami melihat data profilmu (No. Telp, Alamat, atau Lokasi) masih kosong. 
                </p>
                <div className="mt-6 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
                    <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest leading-relaxed">
                      ⚠️ Warning: Tanpa data ini, kamu tidak akan bisa melakukan Checkout barang atau fitur Chat secara maksimal.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleFixNow}
                className="w-full py-5 bg-primary text-white rounded-3xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3"
              >
                Lengkapi Sekarang <FaArrowRight />
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleRemindLater}
                  className="py-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <FaClock className="text-primary" /> Ingatkan Nanti
                </button>
                <button 
                  onClick={handleNeverRemind}
                  className="py-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-gray-400"
                >
                  <FaTimes /> Jangan Ingatkan
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
