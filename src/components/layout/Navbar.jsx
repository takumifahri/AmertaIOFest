"use client";

import Link from "next/link";
import { FaRecycle } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "AI Gatekeeper", href: "/ai-check" },
    { name: "Circle Hub", href: "/barter" },
    { name: "Market", href: "/market" },
    { name: "Komunitas", href: "/komunitas" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#121513]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-amerta-green text-white rounded-xl group-hover:bg-amerta-light-green group-hover:text-amerta-dark transition-colors duration-300">
                <FaRecycle size={28} />
              </div>
              <div>
                <span className="font-bold text-2xl tracking-tighter text-amerta-dark dark:text-amerta-sand">
                  Amerta
                </span>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 -mt-1 font-semibold">
                  Keabadian
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-amerta-green px-3 py-2 text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-800">
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-amerta-dark px-3 py-2 text-sm font-medium transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="bg-amerta-green hover:bg-opacity-90 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md shadow-amerta-green/20 hover:shadow-amerta-green/40 hover:-translate-y-0.5"
              >
                Mulai Donasi
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FiX className="block h-6 w-6" /> : <FiMenu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-md absolute w-full`}>
        <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-amerta-green hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3 px-3">
            <Link
              href="/login"
              className="block w-full text-center py-3 rounded-md text-base font-medium text-amerta-dark dark:text-gray-200 bg-gray-50 dark:bg-gray-800"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="block w-full text-center py-3 rounded-md text-base font-medium text-white bg-amerta-green"
            >
              Mulai Donasi
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
