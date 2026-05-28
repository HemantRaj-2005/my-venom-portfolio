"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Trophy, CheckCircle, Zap, ShieldAlert, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: any;
  color: string;
}

const achievementsList: Achievement[] = [
  {
    id: "bound",
    title: "Spider-Sense Tuned",
    desc: "Successfully tuned into the Spider-Man portfolio interface.",
    icon: Zap,
    color: "border-cyan-500 text-cyan-400"
  },
  {
    id: "terminal",
    title: "HUD Hacker",
    desc: "Injected a command into the SpiderOS console terminal.",
    icon: Trophy,
    color: "border-cyan-500 text-cyan-400"
  },
  {
    id: "palette",
    title: "Web Weaver",
    desc: "Opened the Ctrl+K command web palette.",
    icon: Sparkles,
    color: "border-red-500 text-red-400"
  },
  {
    id: "resume",
    title: "Dossier Intercepted",
    desc: "Triggered the developer resume dossier download.",
    icon: CheckCircle,
    color: "border-white text-zinc-100"
  },
  {
    id: "chat",
    title: "Stark AI Synchronized",
    desc: "Synchronized chat protocols with the StarkAI companion.",
    icon: Sparkles,
    color: "border-cyan-500 text-cyan-400"
  },
  {
    id: "easteregg",
    title: "WITH GREAT POWER",
    desc: "Unleashed the friendly neighborhood secret code.",
    icon: ShieldAlert,
    color: "border-red-600 text-red-500 shadow-red-500/20"
  }
];

export default function Achievements() {
  const [activeNotification, setActiveNotification] = useState<Achievement | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  // Use a ref so that unlockAchievement closure always reads current value
  // without needing unlockedIds in the effect dependency array
  const unlockedRef = useRef<string[]>([]);
  unlockedRef.current = unlockedIds;

  // Stable unlock function — never changes identity, reads from ref
  const unlockAchievement = useCallback((id: string) => {
    if (unlockedRef.current.includes(id)) return;
    const ach = achievementsList.find((a) => a.id === id);
    if (!ach) return;

    // Save state
    setUnlockedIds((prev) => {
      const next = [...prev, id];
      try { localStorage.setItem("spider_achievements", JSON.stringify(next)); } catch (_) {}
      return next;
    });
    setActiveNotification(ach);

    if ((window as any).playClickSound) (window as any).playClickSound();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8, x: 0.9 },
      colors: ["#e11d2e", "#00e5ff", "#ffffff"]
    });

    setTimeout(() => setActiveNotification(null), 4500);
  }, []); // stable — no state deps, reads via ref

  // Restore persisted achievements once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("spider_achievements");
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        setUnlockedIds(parsed);
      }
    } catch (_) {}
  }, []); // runs once

  // Register global interactions — runs once because unlockAchievement is stable
  useEffect(() => {
    // Unlock initial "Bound" achievement after 4.5 seconds
    const boundTimer = setTimeout(() => unlockAchievement("bound"), 4500);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") unlockAchievement("palette");
      if (e.key === "/") unlockAchievement("palette");
    };
    const handleResumeClick = () => unlockAchievement("resume");

    (window as any).triggerTerminalAchievement = () => unlockAchievement("terminal");
    (window as any).triggerChatAchievement    = () => unlockAchievement("chat");
    (window as any).triggerEasterAchievement  = () => unlockAchievement("easteregg");

    window.addEventListener("keydown", handleKeyDown);
    const resumeBtns = document.querySelectorAll('a[href*="resume"], button[title*="Resume"]');
    resumeBtns.forEach((btn) => btn.addEventListener("click", handleResumeClick));

    return () => {
      clearTimeout(boundTimer);
      window.removeEventListener("keydown", handleKeyDown);
      resumeBtns.forEach((btn) => btn.removeEventListener("click", handleResumeClick));
      delete (window as any).triggerTerminalAchievement;
      delete (window as any).triggerChatAchievement;
      delete (window as any).triggerEasterAchievement;
    };
  }, [unlockAchievement]); // unlockAchievement is stable (useCallback [])

  return (
    <div className="fixed top-6 right-6 z-[99999] pointer-events-none select-none max-w-sm w-full">
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`pointer-events-auto flex items-center justify-between p-4 bg-black border-2 ${activeNotification.color} rounded-xl shadow-xl shadow-black/80 w-full`}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800">
                <activeNotification.icon className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                  Achievement Unlocked
                </span>
                <span className="text-xs font-bold text-white tracking-wide">
                  {activeNotification.title}
                </span>
                <span className="text-[10px] text-zinc-400 font-sans mt-0.5 max-w-[220px]">
                  {activeNotification.desc}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setActiveNotification(null)}
              className="text-zinc-600 hover:text-white transition-colors cursor-pointer self-start ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
