"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Code, Database, Globe, Server, Terminal, Shield, Zap } from "lucide-react";

export default function InteractiveOrbit() {
  // Orbiting nodes list
  const techNodes = [
    { name: "Next.js", icon: Code, angle: 0, color: "text-white" },
    { name: "PyTorch", icon: Cpu, angle: 45, color: "text-orange-500" },
    { name: "Docker", icon: Server, angle: 90, color: "text-blue-400" },
    { name: "MongoDB", icon: Database, angle: 135, color: "text-green-500" },
    { name: "TypeScript", icon: Terminal, angle: 180, color: "text-blue-500" },
    { name: "Solidity", icon: Shield, angle: 225, color: "text-zinc-400" },
    { name: "Tailwind", icon: Globe, angle: 270, color: "text-sky-400" },
    { name: "FastAPI", icon: Zap, angle: 315, color: "text-teal-400" }
  ];

  const orbitRadius = 130; // Radius in pixels

  return (
    <div className="relative w-80 h-80 flex items-center justify-center select-none scale-[0.8] sm:scale-100">
      {/* Central Core Node */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          boxShadow: [
            "0 0 20px rgba(0, 229, 255, 0.2)",
            "0 0 35px rgba(0, 229, 255, 0.4)",
            "0 0 20px rgba(0, 229, 255, 0.2)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 rounded-full bg-zinc-950 border-2 border-[#00E5FF]/60 flex flex-col items-center justify-center z-10 shadow-lg shadow-[#00E5FF]/20"
      >
        <Cpu className="w-8 h-8 text-[#00E5FF] animate-pulse" />
        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Core AI</span>
      </motion.div>

      {/* Orbit paths lines */}
      <div className="absolute w-[260px] h-[260px] rounded-full border border-dashed border-zinc-800/40 pointer-events-none" />

      {/* Orbiting nodes container */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 w-full h-full"
      >
        {techNodes.map((node, idx) => {
          const Icon = node.icon;
          // Calculate polar coordinates
          const rad = (node.angle * Math.PI) / 180;
          const x = orbitRadius * Math.cos(rad);
          const y = orbitRadius * Math.sin(rad);

          return (
            <motion.div
              key={idx}
              className="absolute w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-lg hover:border-[#00E5FF]/40 cursor-help"
              style={{
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: "translate(-50%, -50%)"
              }}
              title={node.name}
              // Counter-rotate the child element so the icons stay upright
              animate={{ rotate: -360 }}
              transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            >
              <Icon className={`w-5 h-5 ${node.color}`} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
