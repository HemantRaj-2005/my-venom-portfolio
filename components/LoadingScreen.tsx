"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Simulate Progress Loading (0 to 100)
  useEffect(() => {
    const duration = 2800; // 2.8 seconds loading simulation
    const interval = 30;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 800); // Allow fadeout animation to complete
          }, 400);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  // 2. Matrix rain fallback canvas animation (when video is missing or errors out)
  useEffect(() => {
    if (!videoError) return;

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

    // Matrix characters: venom symbols, code fragments, alien text
    const chars = "WEAREVENOMAIERROR0110SYSTEMHARNESSINGSYMBIOTE☠".split("");
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0).map(() => Math.floor(Math.random() * -100));

    const draw = () => {
      // Semi-transparent black background to leave trails
      ctx.fillStyle = "rgba(2, 2, 2, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0, 255, 102, 0.35)"; // Venom Green
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw character
        ctx.fillText(text, x, y);

        // Reset drop to top if it reaches bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [videoError]);

  const handleVideoError = () => {
    console.warn("Venom loading video missing or unsupported. Playing organic symbiote fallback.");
    setVideoError(true);
  };

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#020202] select-none overflow-hidden"
        >
          {/* Main Cinematic Video Background */}
          {!videoError ? (
            <video
              ref={videoRef}
              src="/venom_loading.mp4"
              autoPlay
              muted
              playsInline
              loop
              onError={handleVideoError}
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
            />
          ) : (
            // Canvas for Matrix Digital Symbiote Rain
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#000000_90%)] pointer-events-none" />

          {/* Fallback Graphic (Symbiote Eyes and Roar) */}
          {videoError && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.95, 1.05, 0.95],
                opacity: 0.95,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-64 h-64 flex items-center justify-center mb-8"
            >
              {/* Pulsing Glow behind fangs */}
              <div className="absolute w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]" />
              <div className="absolute w-40 h-40 bg-red-500/5 rounded-full blur-[60px]" />
              
              {/* Vector Symbiote Fangs / Eyes */}
              <svg
                width="200"
                height="200"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]"
              >
                {/* Left Eye */}
                <motion.path
                  d="M15 35 C 25 32, 40 40, 48 50 C 35 48, 20 45, 15 35 Z"
                  fill="white"
                  initial={{ d: "M15 35 C 25 32, 40 40, 48 50 C 35 48, 20 45, 15 35 Z" }}
                  animate={{
                    d: [
                      "M15 35 C 25 32, 40 40, 48 50 C 35 48, 20 45, 15 35 Z",
                      "M12 33 C 27 28, 42 38, 49 53 C 33 49, 18 44, 12 33 Z",
                      "M15 35 C 25 32, 40 40, 48 50 C 35 48, 20 45, 15 35 Z"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Right Eye */}
                <motion.path
                  d="M85 35 C 75 32, 60 40, 52 50 C 65 48, 80 45, 85 35 Z"
                  fill="white"
                  initial={{ d: "M85 35 C 75 32, 60 40, 52 50 C 65 48, 80 45, 85 35 Z" }}
                  animate={{
                    d: [
                      "M85 35 C 75 32, 60 40, 52 50 C 65 48, 80 45, 85 35 Z",
                      "M88 33 C 73 28, 58 38, 51 53 C 67 49, 82 44, 88 33 Z",
                      "M85 35 C 75 32, 60 40, 52 50 C 65 48, 80 45, 85 35 Z"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Fangs Opening Roar */}
                <motion.path
                  d="M25 65 Q 50 55 75 65 Q 50 90 25 65 Z"
                  fill="#0c0c0c"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  animate={{
                    d: [
                      "M25 65 Q 50 55 75 65 Q 50 90 25 65 Z",
                      "M20 62 Q 50 48 80 62 Q 50 96 20 62 Z", // Open wider
                      "M25 65 Q 50 55 75 65 Q 50 90 25 65 Z"
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Fangs details - Top Fangs */}
                <path d="M32 60 L36 67 L39 60 M68 60 L64 67 L61 60" fill="white" stroke="white" strokeWidth="1" />
                {/* Bottom Fangs */}
                <path d="M42 78 L45 71 L48 77 M58 78 L55 71 L52 77" fill="white" stroke="white" strokeWidth="1" />
              </svg>
            </motion.div>
          )}

          {/* Loading Progress Information */}
          <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-8 text-center mt-auto mb-16">
            {/* Glowing Tagline */}
            <motion.h2
              initial={{ letterSpacing: "0.1em", opacity: 0 }}
              animate={{ letterSpacing: "0.25em", opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-white text-xs font-bold tracking-[0.25em] uppercase mb-4 drop-shadow-[0_0_10px_rgba(0,255,102,0.4)]"
            >
              We Are Venom
            </motion.h2>

            {/* Counter */}
            <div className="text-4xl font-extrabold text-white font-mono mb-4 tabular-nums">
              {Math.round(progress)}
              <span className="text-emerald-400 text-2xl ml-1">%</span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-1 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden relative shadow-inner">
              {/* Pulse overlay inside loader */}
              <motion.div
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-600 via-emerald-400 to-white"
                style={{ width: `${progress}%` }}
                transition={{ type: "tween" }}
              />
            </div>

            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-3 font-mono">
              Booting Cybernetic Interface...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
