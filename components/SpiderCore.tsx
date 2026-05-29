"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Target, Activity, Shield } from "lucide-react";

export default function SpiderCore() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 247, y: 182 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for mouse position (normalized from -0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for 3D card rotation (tilt effect)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 120,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 120,
    damping: 20,
  });

  // Glare overlay translation springs
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], ["30%", "70%"]), {
    stiffness: 80,
    damping: 25,
  });
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], ["30%", "70%"]), {
    stiffness: 80,
    damping: 25,
  });

  // Target crosshair springs (exact pixel coordinates inside the image container)
  const targetX = useSpring(useMotionValue(180), { stiffness: 90, damping: 18 });
  const targetY = useSpring(useMotionValue(200), { stiffness: 90, damping: 18 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Telemetry coordinate chatter animation when hovered
  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setCoords({
        x: Math.floor(Math.random() * 320) + 40,
        y: Math.floor(Math.random() * 380) + 40,
      });
    }, 180);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Normalized coords (-0.5 to 0.5) for 3D tilt
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(normX);
    mouseY.set(normY);

    // Target crosshair tracking points (constrain to actual image bounds roughly)
    const pxX = e.clientX - rect.left;
    const pxY = e.clientY - rect.top;
    targetX.set(pxX);
    targetY.set(pxY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (typeof window !== "undefined" && (window as any).playHoverSound) {
      try {
        (window as any).playHoverSound();
      } catch (err) {}
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    // Reset crosshair target to center area
    targetX.set(220);
    targetY.set(240);
  };

  if (!mounted) {
    // Fallback static skeletal render to prevent hydration flicker
    return (
      <div className="w-full min-h-[420px] md:min-h-[560px] flex items-center justify-center select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-40 h-40 rounded-full border border-red-500/20 animate-ping" />
          <div
            className="absolute w-28 h-28 rounded-full border border-cyan-500/20 animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
            <span className="text-cyan-400 text-lg font-black">S</span>
          </div>
          <div className="absolute bottom-[-32px] text-[9px] font-mono text-zinc-600 uppercase tracking-widest whitespace-nowrap">
            INITIALIZING CORE HUD INTEGRITY...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative flex justify-center items-center w-full min-h-[420px] md:min-h-[560px] py-6 select-none"
      style={{ perspective: 1200 }}
    >
      {/* Background Stark Tech concentric rotation rings */}
      <div className="absolute w-[85%] h-[85%] rounded-full border border-dashed border-cyan-500/10 animate-[spin_80s_linear_infinite] pointer-events-none" />
      <div className="absolute w-[70%] h-[70%] rounded-full border border-double border-red-500/5 animate-[spin_50s_linear_infinite_reverse] pointer-events-none" />
      <div className="absolute w-[50%] h-[50%] rounded-full border border-cyan-500/5 animate-[spin_30s_linear_infinite] pointer-events-none" />

      {/* Futuristic Target Vector Ticks */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-cyan-500/30 pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-cyan-500/30 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-cyan-500/30 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-cyan-500/30 pointer-events-none" />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full max-w-[420px] aspect-[4/5] bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-2xl p-4 cursor-crosshair overflow-hidden group transition-all duration-300 hover:border-cyan-500/30"
      >
        {/* Glow Backing Shadow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Diagonal wireframe tech line across the background */}
        <svg className="absolute inset-0 w-full h-full stroke-zinc-900/40 stroke-[0.5] pointer-events-none z-0">
          <line x1="0" y1="0" x2="100%" y2="100%" />
          <line x1="100%" y1="0" x2="0" y2="100%" />
        </svg>

        {/* Dynamic Holographic grid lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />

        {/* Animated Cybernetic Scan Line */}
        <motion.div
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
          className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(0,229,255,0.6)] opacity-40 pointer-events-none z-10"
        />

        {/* Target Reticle Brackets */}
        <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-red-500 pointer-events-none z-20 transition-all group-hover:scale-95" />
        <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-red-500 pointer-events-none z-20 transition-all group-hover:scale-95" />
        <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-red-500 pointer-events-none z-20 transition-all group-hover:scale-95" />
        <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-red-500 pointer-events-none z-20 transition-all group-hover:scale-95" />

        {/* Tech Header Display */}
        <div className="flex justify-between items-center text-[8px] font-mono text-cyan-400/90 mb-3 px-1 pointer-events-none z-10 relative">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="tracking-widest">STARK_SYS_V4.9.2</span>
          </div>
          <div className="text-zinc-500">[STATUS: ONLINE]</div>
        </div>

        {/* Main image container */}
        <div className="relative w-full aspect-[4/4.2] bg-zinc-950/90 rounded-xl border border-zinc-900/90 overflow-hidden flex items-center justify-center z-10">
          
          {/* Futuristic hologram scanlines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%,rgba(0,0,0,0.25))] bg-[size:100%_4px] pointer-events-none z-10" />

          {/* Glowing Screen Glare Reflection */}
          <motion.div 
            className="absolute inset-0 bg-radial-gradient from-white/8 to-transparent pointer-events-none z-20 mix-blend-overlay"
            style={{
              left: glareX,
              top: glareY,
              transform: "translate(-50%, -50%)",
              width: "180%",
              height: "180%"
            }}
          />

          {/* The main hero.png image */}
          <div className="relative w-[90%] h-[90%] flex items-center justify-center">
            <Image
              src="/hero.png"
              alt="Hemant Raj - Developer Core"
              fill
              priority
              sizes="(max-w-768px) 100vw, 400px"
              className="object-contain filter contrast-[1.1] brightness-[1.05] drop-shadow-[0_0_15px_rgba(225,29,46,0.12)] transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          </div>

          {/* Animated HUD Tracker Crosshair following cursor */}
          {isHovered && (
            <motion.div
              style={{
                x: targetX,
                y: targetY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              className="absolute w-20 h-20 pointer-events-none z-20"
            >
              {/* Corner indicators for crosshair */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyan-400" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyan-400" />
              
              {/* Inner ring */}
              <div className="absolute inset-0 m-auto w-12 h-12 border border-dashed border-cyan-400/40 rounded-full animate-spin" style={{ animationDuration: "6s" }} />
              <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-red-500/80" />

              {/* HUD readout coords text */}
              <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 text-[7px] font-mono text-cyan-400 bg-zinc-950/90 px-1 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap">
                LOCK_ON: X:{coords.x} Y:{coords.y}
              </div>
            </motion.div>
          )}

          {/* Static corner brackets for the inner frame */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-zinc-800" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-zinc-800" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-zinc-800" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-zinc-800" />
        </div>

        {/* Telemetry and diagnostic readouts */}
        <div className="mt-3.5 grid grid-cols-3 gap-2 text-[8px] font-mono text-zinc-500 px-1 z-10 relative">
          <div className="space-y-0.5">
            <div className="text-zinc-600 font-bold uppercase tracking-wider">HUD TELEMETRY</div>
            <div className="text-cyan-400/80 flex items-center gap-1">
              <Activity className="w-2 h-2 text-cyan-400 animate-pulse" />
              <span>LINK_CONNECTED</span>
            </div>
          </div>
          <div className="space-y-0.5 text-center">
            <div className="text-zinc-600 font-bold uppercase tracking-wider">TARGET SYSTEM</div>
            <div className="text-red-500/80 flex items-center justify-center gap-1">
              <Shield className="w-2 h-2 text-red-500" />
              <span>SPIDER_ACTIVE</span>
            </div>
          </div>
          <div className="space-y-0.5 text-right font-semibold">
            <div className="text-zinc-600 font-bold uppercase tracking-wider">CALIBRATION</div>
            <div className="text-zinc-400">[GRID MATCH]</div>
          </div>
        </div>

        {/* Micro status indicators at the bottom */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-6 items-center text-[7px] font-mono text-zinc-600 pointer-events-none z-10">
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
            <span>PORT_8080: OK</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full" />
            <span>SSL: SECURE</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
            <span>HEMANT_RAJ_OS</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
