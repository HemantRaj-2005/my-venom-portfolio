import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Orbitron } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import CustomCursor from "@/components/CustomCursor";
import SoundToggle from "@/components/SoundToggle";
import Achievements from "@/components/Achievements";
import Navbar from "@/components/Navbar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://hemantraj.dev"),
  title: {
    default: "Hemant Raj | AI Engineer, Full Stack Developer & Competitive Programmer",
    template: "%s | Hemant Raj"
  },
  description: "Explore the personal brand portfolio of Hemant Raj, a Computer Science Engineer, Full Stack Developer, and AI Engineer. Discover scalable backend systems, LLM applications, modern React/Next.js/Django web apps, and problem-solving DSA profiles.",
  keywords: [
    "Hemant Raj",
    "Hemant Raj Portfolio",
    "Hemant Raj Developer",
    "Hemant Raj Software Engineer",
    "Hemant Raj Full Stack Developer",
    "Hemant Raj AI Engineer",
    "Hemant Raj Computer Science Engineer",
    "Hemant Raj Web Developer",
    "Hemant Raj Programmer",
    "Hemant Raj Competitive Programmer",
    "Hire Hemant Raj",
    "Software Engineer Portfolio",
    "AI Engineer Portfolio",
    "Full Stack Software Engineer Portfolio",
    "Modern Software Engineering Portfolio",
    "React and Django Developer",
    "AI Powered Web Applications"
  ],
  alternates: {
    canonical: "./",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Hemant Raj | AI Engineer, Full Stack Developer & Competitive Programmer",
    description: "Explore the software projects, AI powered web applications, and developer tools built by Hemant Raj. Hire Hemant Raj, a Full Stack Developer & AI Engineer.",
    url: "./",
    siteName: "Hemant Raj Tech Portfolio",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Hemant Raj - AI Engineer & Full Stack Developer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hemant Raj | AI Engineer, Full Stack Developer & Competitive Programmer",
    description: "Explore the software projects, AI powered web applications, and developer tools built by Hemant Raj. Hire Hemant Raj, a Full Stack Developer & AI Engineer.",
    images: ["/hero.png"],
  },
  verification: {
    google: "google-site-verification-token",
    yandex: "yandex-verification-token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased dark ${notoSans.variable} ${geist.variable} ${geistMono.variable} ${orbitron.variable}`}
      style={{ colorScheme: "dark" }}
    >
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
