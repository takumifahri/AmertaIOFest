import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ToasterProvider from "@/components/ToasterProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Amerta | Keabadian untuk Pakaianmu",
  description: "Platform digital tata kelola limbah tekstil terintegrasi berbasis Circular Economy. Beri kehidupan kedua pada setiap helai pakaian melalui AI Quality Gatekeeper dan Hyper-Local Circle Hub.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-outfit transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToasterProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

