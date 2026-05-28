import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Orbitron } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";
import CustomCursor from "@/components/CustomCursor";
import SoundToggle from "@/components/SoundToggle";
import Achievements from "@/components/Achievements";

const orbitronHeading = Orbitron({
  subsets: ["latin"],
  variable: "--font-heading"
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans"
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hemant Raj - AI Engineer & Full Stack Developer",
  description: "Ultra-premium portfolio of Hemant Raj, showcasing dynamic Next.js applications, Stark-tech AI HUD diagnostics, and 3D WebGL designs in a Spider-Man inspired command center skin.",
  keywords: ["AI Engineer", "Full Stack Developer", "WebGL", "Three.js", "Next.js", "React 19", "Prisma", "MongoDB"],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "dark",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        notoSans.variable,
        orbitronHeading.variable
      )}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[#020202] text-zinc-100 selection:bg-emerald-500/20 selection:text-white scroll-smooth overflow-x-hidden">
        <Providers>
          {/* Custom Global Symbiote cursor */}
          <CustomCursor />
          
          {/* Global Web Audio sound system */}
          <SoundToggle />
          
          {/* Global achievements manager */}
          <Achievements />

          {/* Page contents */}
          <div className="flex-1 flex flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
