"use client";

import Link from "next/link";
import { FaRecycle, FaUser, FaSignOutAlt, FaColumns } from "react-icons/fa";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setIsDropdownOpen(false);
      toast.success("Berhasil keluar.");
    } catch (err) {
      toast.error("Gagal logout.");
    }
  };

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "AI Gatekeeper", href: "/ai-check" },
    { name: "Circle Hub", href: "/barter" },
    { name: "Market", href: "/market" },
    { name: "Komunitas", href: "/komunitas" },
  ];

  return (
    <nav className="sticky top-4 z-50 w-[95%] max-w-7xl mx-auto bg-white/70 dark:bg-background/70 backdrop-blur-2xl border border-gray-200/50 dark:border-white/5 rounded-[28px] transition-all duration-500 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.5)] mt-4">
      <div className="px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center p-1 group-hover:rotate-6 transition-all duration-500 shadow-sm border border-gray-200/50 dark:border-white/10">
                <img src="/images/logo.png" alt="Amerta Logo" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-xl tracking-tighter text-foreground uppercase leading-none">
                  Amerta
                </span>
                <p className="text-[7px] uppercase tracking-[4px] text-primary font-black leading-none mt-1">
                  Circular Economy
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 rounded-xl hover:bg-primary/5 dark:hover:bg-white/5"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-2" />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-primary transition-all duration-300 ring-4 ring-primary/5">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-black">
                        {user.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-surface border border-gray-100 dark:border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in zoom-in slide-in-from-top-4 duration-300 z-[100]">
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-bold text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:text-black transition-all group"
                      >
                        <FaColumns /> Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-bold text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:text-black transition-all group"
                      >
                        <FaUser /> My Profile
                      </Link>
                      <div className="h-px bg-gray-100 dark:bg-white/5 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all group"
                      >
                        <FaSignOutAlt /> Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-500 dark:text-gray-400 hover:text-foreground dark:hover:text-white text-[11px] font-black uppercase tracking-widest transition-all px-4"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-primary hover:bg-primary-light text-white dark:text-black px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
                >
                  Mulai Sekarang
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-400 hover:bg-white/5 transition-all"
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-background/95 backdrop-blur-2xl absolute top-20 left-0 w-full rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden`}>
        <div className="p-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/5 flex flex-col gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="block w-full text-center py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-black bg-primary shadow-xl shadow-primary/20"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block w-full text-center py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-foreground bg-gray-50 dark:bg-white/5"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white bg-primary"
                >
                  Gabung Amerta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>


  );
}
