"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring trails for a delayed particle follow look
  const springConfig = { damping: 24, stiffness: 220, mass: 0.6 };
  const trail1X = useSpring(mouseX, springConfig);
  const trail1Y = useSpring(mouseY, springConfig);
  
  const trail2X = useSpring(trail1X, { damping: 18, stiffness: 160, mass: 0.8 });
  const trail2Y = useSpring(trail1Y, { damping: 18, stiffness: 160, mass: 0.8 });

  const trail3X = useSpring(trail2X, { damping: 14, stiffness: 110, mass: 1.0 });
  const trail3Y = useSpring(trail2Y, { damping: 14, stiffness: 110, mass: 1.0 });

  useEffect(() => {
    // Disable on mobile/touch screens
    const isTouchDevice = () => {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    };

    if (isTouchDevice()) return;
    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("clickable")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Spawn a web-shoot ripple at coordinates
      const id = rippleIdRef.current++;
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);

      // Play sound
      if ((window as any).playClickSound) (window as any).playClickSound();

      // Clean up after 800ms
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 800);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      {/* Click Web Ripples Layer */}
      <div className="pointer-events-none fixed inset-0 z-[99999] select-none">
        <AnimatePresence>
          {ripples.map((r) => (
            <div key={r.id} className="absolute" style={{ left: r.x, top: r.y }}>
              {/* Outer web expansion line */}
              <motion.div
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{ width: 140, height: 140, opacity: 0 }}
                exit={{ opacity: 0 }}
                className="absolute border border-cyan-400 border-dashed rounded-full -translate-x-1/2 -translate-y-1/2"
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              {/* Outer web nodes grid */}
              <motion.div
                initial={{ width: 0, height: 0, opacity: 0.6, rotate: 0 }}
                animate={{ width: 90, height: 90, opacity: 0, rotate: 45 }}
                className="absolute border border-red-500 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ borderWidth: 1.5 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {/* Web-Lines Spoke SVG */}
              <motion.svg
                initial={{ scale: 0.1, opacity: 0.8, rotate: 0 }}
                animate={{ scale: 2.0, opacity: 0, rotate: 90 }}
                width="60"
                height="60"
                viewBox="0 0 60 60"
                className="absolute text-cyan-400/80 -translate-x-1/2 -translate-y-1/2"
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <line x1="30" y1="0" x2="30" y2="60" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="10" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50" y1="10" x2="10" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              </motion.svg>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Cursor HUD Elements */}
      <div className="pointer-events-none fixed inset-0 z-[100000] select-none">
        
        {/* Trail 3 (Sparks Cyan) */}
        <motion.div
          className="absolute rounded-full bg-cyan-400 opacity-30 shadow-[0_0_5px_#00e5ff]"
          style={{
            x: trail3X,
            y: trail3Y,
            width: 4,
            height: 4,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />

        {/* Trail 2 (Sparks Red) */}
        <motion.div
          className="absolute rounded-full bg-red-500 opacity-40 shadow-[0_0_5px_#e11d2e]"
          style={{
            x: trail2X,
            y: trail2Y,
            width: 5,
            height: 5,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />

        {/* Trail 1 (HUD telemetry tick) */}
        <motion.div
          className="absolute border border-cyan-400 rounded-full opacity-60"
          style={{
            x: trail1X,
            y: trail1Y,
            width: hovered ? 16 : 10,
            height: hovered ? 16 : 10,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />

        {/* Outer Rotating HUD Crosshair Ring */}
        <motion.div
          className="absolute border border-dashed rounded-full"
          style={{
            x: mouseX,
            y: mouseY,
            width: hovered ? 38 : 28,
            height: hovered ? 38 : 28,
            borderColor: hovered ? "#e11d2e" : "#00e5ff",
            borderWidth: 1.5,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner Laser Pointer Dot */}
        <motion.div
          className="absolute rounded-full bg-red-500 shadow-[0_0_8px_#e11d2e] border border-white/80"
          style={{
            x: mouseX,
            y: mouseY,
            width: hovered ? 8 : 4,
            height: hovered ? 8 : 4,
            translateX: "-50%",
            translateY: "-50%",
          }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
        />
      </div>
    </>
  );
}
