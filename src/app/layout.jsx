import { Outfit } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/ToasterProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  // ... (keeping metadata as is)
  title: {
    default: "Amerta | Keabadian untuk Pakaianmu",
    template: "%s | Amerta"
  },
  description: "Platform digital tata kelola limbah tekstil terintegrasi berbasis Circular Economy. Beri kehidupan kedua pada setiap helai pakaian melalui AI Quality Gatekeeper dan Hyper-Local Circle Hub.",
  keywords: ["limbah tekstil", "circular economy", "amerta", "daur ulang pakaian", "sustainable fashion", "indonesia", "zero waste"],
  authors: [{ name: "Amerta Team" }],
  creator: "Amerta Team",
  publisher: "Amerta",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/amerta.ico",
    shortcut: "/amerta.ico",
    apple: "/amerta.ico",
  },
  openGraph: {
    title: "Amerta | Keabadian untuk Pakaianmu",
    description: "Platform digital tata kelola limbah tekstil terintegrasi berbasis Circular Economy.",
    url: "https://amertaa.netlify.app",
    siteName: "Amerta",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amerta | Keabadian untuk Pakaianmu",
    description: "Platform digital tata kelola limbah tekstil terintegrasi berbasis Circular Economy.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${outfit.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-outfit transition-colors duration-300">
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}

