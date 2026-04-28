import Link from "next/link";
import { FaRecycle, FaInstagram, FaTwitter, FaFacebook, FaArrowRight } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-amerta-green text-white rounded-xl">
                <FaRecycle size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tighter text-amerta-dark">
                Amerta
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Platform digital tata kelola limbah tekstil terintegrasi berbasis Circular Economy. Memberikan kehidupan kedua pada setiap helai pakaian.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-amerta-green transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amerta-green transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amerta-green transition-colors">
                <FaFacebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-amerta-dark mb-6 uppercase tracking-wider text-sm">Layanan</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/ai-check" className="text-gray-600 dark:text-gray-400 hover:text-amerta-green text-sm transition-colors">
                  AI Quality Gatekeeper
                </Link>
              </li>
              <li>
                <Link href="/barter" className="text-gray-600 dark:text-gray-400 hover:text-amerta-green text-sm transition-colors">
                  Hyper-Local Circle Hub
                </Link>
              </li>
              <li>
                <Link href="/market" className="text-gray-600 dark:text-gray-400 hover:text-amerta-green text-sm transition-colors">
                  Amarta Point Market
                </Link>
              </li>
              <li>
                <Link href="/komunitas" className="text-gray-600 dark:text-gray-400 hover:text-amerta-green text-sm transition-colors">
                  Komunitas & Edukasi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-amerta-dark mb-6 uppercase tracking-wider text-sm">Perusahaan</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-amerta-green text-sm transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/mitra" className="text-gray-600 dark:text-gray-400 hover:text-amerta-green text-sm transition-colors">
                  Kemitraan Yayasan
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-gray-600 dark:text-gray-400 hover:text-amerta-green text-sm transition-colors">
                  Sustainability Report
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-amerta-green text-sm transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-amerta-dark mb-6 uppercase tracking-wider text-sm">Tetap Terhubung</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Dapatkan berita terbaru seputar fashion berkelanjutan.
            </p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Alamat Email" 
                className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amerta-green transition-all"
              />
              <button 
                type="submit"
                className="bg-amerta-dark text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-opacity-90 flex items-center justify-center gap-2 transition-colors"
              >
                Berlangganan <FaArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} Amerta Circular Economy. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/privacy" className="hover:text-amerta-green">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-amerta-green">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
