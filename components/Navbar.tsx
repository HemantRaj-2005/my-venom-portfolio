"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const handleHover = () => {
    if (typeof window !== "undefined" && (window as any).playHoverSound) {
      try {
        (window as any).playHoverSound();
      } catch (e) {}
    }
  };

  const handleClick = () => {
    if (typeof window !== "undefined" && (window as any).playClickSound) {
      try {
        (window as any).playClickSound();
      } catch (e) {}
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 h-20 bg-[#050505]/90 border-b border-zinc-900/40 backdrop-blur-md z-40 px-6 md:px-12 flex items-center justify-between select-none">
      <div className="flex items-center gap-2">
        <Link href="/" onClick={handleClick} onMouseEnter={handleHover} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-zinc-900 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-[10px] text-cyan-400 font-black animate-pulse">S</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase hidden sm:inline">
            Stark HUD Command Center
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
        <Link 
          href="/" 
          onClick={handleClick} 
          onMouseEnter={handleHover} 
          className={`hover:text-white transition-colors ${pathname === "/" ? "text-cyan-400" : ""}`}
        >
          Home
        </Link>
        <Link 
          href="/projects" 
          onClick={handleClick} 
          onMouseEnter={handleHover} 
          className={`hover:text-white transition-colors ${pathname.startsWith("/projects") ? "text-cyan-400" : ""}`}
        >
          Projects
        </Link>
        <Link 
          href="/marketplace" 
          onClick={handleClick} 
          onMouseEnter={handleHover} 
          className={`hover:text-white transition-colors ${pathname.startsWith("/marketplace") ? "text-cyan-400" : ""}`}
        >
          Marketplace
        </Link>
        <Link 
          href="/blog" 
          onClick={handleClick} 
          onMouseEnter={handleHover} 
          className={`hover:text-white transition-colors ${pathname.startsWith("/blog") ? "text-cyan-400" : ""}`}
        >
          Blog
        </Link>
        <Link 
          href="/analytics" 
          onClick={handleClick} 
          onMouseEnter={handleHover} 
          className={`hover:text-white transition-colors ${pathname === "/analytics" ? "text-cyan-400" : ""}`}
        >
          Suit Analytics
        </Link>
        <Link
          href="/#lead-forms"
          onClick={handleClick}
          onMouseEnter={handleHover}
          className="hover:text-white transition-colors cursor-pointer text-red-500 border border-red-500/10 bg-red-950/10 px-2.5 py-1 rounded"
        >
          Hire Me
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={() => {
            handleClick();
            const e = new KeyboardEvent("keydown", { ctrlKey: true, key: "k" });
            window.dispatchEvent(e);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/80 text-[10px] font-mono text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer"
        >
          <span>Console</span>
          <span className="text-[8px] uppercase border border-zinc-800 px-1 rounded bg-black">Ctrl K</span>
        </button>
      </div>
    </header>
  );
}
