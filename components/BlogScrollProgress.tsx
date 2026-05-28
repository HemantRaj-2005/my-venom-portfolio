"use client";

import { motion, useScroll } from "framer-motion";

export default function BlogScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 origin-left z-[9999] shadow-[0_0_8px_rgba(0,255,102,0.6)]"
    />
  );
}
