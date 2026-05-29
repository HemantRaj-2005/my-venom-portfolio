import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import CustomCursor from "@/components/CustomCursor";
import SoundToggle from "@/components/SoundToggle";
import Achievements from "@/components/Achievements";
import Navbar from "@/components/Navbar";

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
      className="h-full antialiased dark font-sans"
      style={{ colorScheme: "dark" }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Noto+Sans:wght@100..900&family=Orbitron:wght@400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#020202] text-zinc-100 selection:bg-cyan-500/20 selection:text-white scroll-smooth overflow-x-hidden">
        <Providers>
          {/* Custom Global Stark HUD cursor */}
          <CustomCursor />
          
          {/* Global Web Audio sound system */}
          <SoundToggle />
          
          {/* Global achievements manager */}
          <Achievements />

          {/* Global navigation header */}
          <Navbar />

          {/* Page contents */}
          <div className="flex-1 flex flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
