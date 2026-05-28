"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Motion values for smooth mouse tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Trail physics configuration
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  
  // Trailing points coordinates
  const trail1X = useSpring(mouseX, { damping: 20, stiffness: 180, mass: 0.8 });
  const trail1Y = useSpring(mouseY, { damping: 20, stiffness: 180, mass: 0.8 });

  const trail2X = useSpring(trail1X, { damping: 18, stiffness: 140, mass: 0.9 });
  const trail2Y = useSpring(trail1Y, { damping: 18, stiffness: 140, mass: 0.9 });

  const trail3X = useSpring(trail2X, { damping: 15, stiffness: 110, mass: 1.0 });
  const trail3Y = useSpring(trail2Y, { damping: 15, stiffness: 110, mass: 1.0 });

  const trail4X = useSpring(trail3X, { damping: 12, stiffness: 80, mass: 1.1 });
  const trail4Y = useSpring(trail3Y, { damping: 12, stiffness: 80, mass: 1.1 });

  useEffect(() => {
    // Enable custom cursor only on desktop/devices with cursors
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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      {/* SVG Liquid Goo Filter definition */}
      <svg className="pointer-events-none fixed inset-0 h-0 w-0 z-[-1] select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="symbiote-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Main Cursor and Trails */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999] select-none mix-blend-difference"
        style={{ filter: "url(#symbiote-goo)" }}
      >
        {/* Trail 4 (deepest tail) */}
        <motion.div
          className="absolute rounded-full bg-white opacity-40"
          style={{
            x: trail4X,
            y: trail4Y,
            width: hovered ? 12 : 8,
            height: hovered ? 12 : 8,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />

        {/* Trail 3 */}
        <motion.div
          className="absolute rounded-full bg-white opacity-60"
          style={{
            x: trail3X,
            y: trail3Y,
            width: hovered ? 16 : 12,
            height: hovered ? 16 : 12,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />

        {/* Trail 2 */}
        <motion.div
          className="absolute rounded-full bg-white opacity-80"
          style={{
            x: trail2X,
            y: trail2Y,
            width: hovered ? 22 : 16,
            height: hovered ? 22 : 16,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />

        {/* Trail 1 */}
        <motion.div
          className="absolute rounded-full bg-white"
          style={{
            x: trail1X,
            y: trail1Y,
            width: hovered ? 28 : 22,
            height: hovered ? 28 : 22,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />

        {/* Main Cursor Dot */}
        <motion.div
          className="absolute rounded-full bg-white border border-black"
          style={{
            x: mouseX,
            y: mouseY,
            width: hovered ? 36 : 28,
            height: hovered ? 36 : 28,
            translateX: "-50%",
            translateY: "-50%",
          }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
        />
      </div>
    </>
  );
}
