"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Store onComplete in a ref so the interval effect doesn't depend on it directly
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // 1. Simulate Progress Loading (0 to 100)
  useEffect(() => {
    const duration = 2400; // 2.4 seconds loading simulation
    const interval = 25;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => onCompleteRef.current(), 700); // Allow fadeout animation
          }, 300);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // 2. Holographic Web-Grid Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;

    const draw = () => {
      time += 0.02;
      ctx.fillStyle = "rgba(5, 10, 21, 0.15)"; // Dark blue-black trace background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.8;

      // 1. Draw Tech grid lines
      ctx.strokeStyle = "rgba(0, 229, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Draw Concentric Spider Web Rings
      ctx.strokeStyle = "rgba(0, 229, 255, 0.08)";
      ctx.lineWidth = 1.5;
      const ringCount = 8;
      for (let i = 1; i <= ringCount; i++) {
        const baseRadius = (i / ringCount) * 350;
        const pulse = Math.sin(time * 2 + i) * 12;
        const r = Math.max(10, baseRadius + pulse);

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Draw Web Radial Spoke Lines
      ctx.strokeStyle = "rgba(225, 29, 46, 0.06)";
      const spokes = 12;
      for (let i = 0; i < spokes; i++) {
        const angle = (i / spokes) * Math.PI * 2 + time * 0.05;
        const endX = centerX + Math.cos(angle) * maxRadius;
        const endY = centerY + Math.sin(angle) * maxRadius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      // 4. Sweeping HUD scanning circle
      const sweepRadius = (Math.sin(time * 1.5) * 0.5 + 0.5) * 450 + 50;
      ctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sweepRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw subtle green/cyan scan lines on top
      ctx.fillStyle = "rgba(0, 229, 255, 0.015)";
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050a15] select-none overflow-hidden"
        >
          {/* Web/HUD Canvas Background */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

          {/* Holographic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050505_95%)] pointer-events-none" />

          {/* Central Logo Panel */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: [0.96, 1.04, 0.96],
              opacity: 1,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-48 h-48 flex items-center justify-center mb-6"
          >
            {/* Glowing background circles */}
            <div className="absolute w-36 h-36 bg-cyan-500/10 rounded-full blur-[40px] animate-pulse" />
            <div className="absolute w-28 h-28 bg-red-500/5 rounded-full blur-[25px]" />

            {/* Custom SVG Spider Logo with Glitch Effects */}
            <svg
              width="140"
              height="140"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-red-500 drop-shadow-[0_0_15px_rgba(225,29,46,0.65)] hover:text-cyan-400 transition-colors"
            >
              {/* Spider Body */}
              <circle cx="50" cy="45" r="7" fill="currentColor" />
              <circle cx="50" cy="58" r="10.5" fill="currentColor" />
              <circle cx="50" cy="35" r="4.5" fill="currentColor" />
              
              {/* Left Legs */}
              <path d="M 45 42 Q 26 34 16 48" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 43 48 Q 22 43 14 62" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 43 55 Q 23 60 19 76" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 44 62 Q 28 73 25 86" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
              
              {/* Right Legs */}
              <path d="M 55 42 Q 74 34 84 48" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 57 48 Q 78 43 86 62" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 57 55 Q 77 60 81 76" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 56 62 Q 72 73 75 86" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Loading Progress Info */}
          <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-8 text-center mt-2 select-none">
            {/* Tagline */}
            <motion.h2
              initial={{ letterSpacing: "0.1em", opacity: 0 }}
              animate={{ letterSpacing: "0.22em", opacity: 0.9 }}
              transition={{ duration: 1 }}
              className="text-cyan-400 text-[10px] font-mono font-bold tracking-[0.22em] uppercase mb-4 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
            >
              Stark Tech HUD Diagnostics
            </motion.h2>

            {/* Counter */}
            <div className="text-4xl font-black text-white font-mono mb-4 tabular-nums">
              {Math.round(progress)}
              <span className="text-red-500 text-2xl ml-1 font-sans">%</span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-1 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-red-600 via-cyan-400 to-white"
                style={{ width: `${progress}%` }}
                transition={{ type: "tween" }}
              />
            </div>

            <p className="text-zinc-500 text-[9px] uppercase tracking-[0.18em] mt-3.5 font-mono">
              Booting Stark-AI OS Matrix...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
