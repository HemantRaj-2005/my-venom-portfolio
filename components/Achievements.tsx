"use client";

import React, { useState, useEffect } from "react";
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

export default function Achievements() {
  const [activeNotification, setActiveNotification] = useState<Achievement | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  // 1. Defined Achievements list
  const achievementsList: Achievement[] = [
    {
      id: "bound",
      title: "Symbiote Bound",
      desc: "Successfully bound with the Venom portfolio interface.",
      icon: Zap,
      color: "border-emerald-500 text-emerald-400"
    },
    {
      id: "terminal",
      title: "Terminal Explorer",
      desc: "Injected a command into the cybernetic console terminal.",
      icon: Trophy,
      color: "border-emerald-500 text-emerald-400"
    },
    {
      id: "palette",
      title: "Command Navigator",
      desc: "Opened the Ctrl+K global search command palette.",
      icon: Sparkles,
      color: "border-indigo-500 text-indigo-400"
    },
    {
      id: "resume",
      title: "Recruiter Authenticated",
      desc: "Triggered the developer resume dossier download.",
      icon: CheckCircle,
      color: "border-blue-500 text-blue-400"
    },
    {
      id: "chat",
      title: "AI Alignment",
      desc: "Synchronized chat messages with VenomGPT AI.",
      icon: Sparkles,
      color: "border-emerald-500 text-emerald-400"
    },
    {
      id: "easteregg",
      title: "WE ARE VENOM",
      desc: "Unleashed the secret symbiote console virus.",
      icon: ShieldAlert,
      color: "border-red-600 text-red-500 shadow-red-500/20"
    }
  ];

  // Helper function to trigger unlocking
  const unlockAchievement = (id: string) => {
    // Prevent double unlocking
    if (unlockedIds.includes(id)) return;

    const ach = achievementsList.find((a) => a.id === id);
    if (!ach) return;

    // Save state
    setUnlockedIds((prev) => [...prev, id]);
    setActiveNotification(ach);

    // Play thud click sound if defined globally
    if ((window as any).playClickSound) {
      (window as any).playClickSound();
    }

    // Trigger explosive confetti on screen
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8, x: 0.9 },
      colors: ["#00ff66", "#ffffff", "#121212"]
    });

    // Auto-clear notification after 4.5 seconds
    setTimeout(() => {
      setActiveNotification(null);
    }, 4500);
  };

  useEffect(() => {
    // Save unlocked state to localStorage to persist across refreshes
    const saved = localStorage.getItem("venom_achievements");
    if (saved) {
      try {
        setUnlockedIds(JSON.parse(saved));
      } catch (e) {}
    }

    // 2. Unlock initial "Bound" achievement after 4.5 seconds
    const boundTimer = setTimeout(() => {
      unlockAchievement("bound");
    }, 4500);

    // 3. Register global event listener triggers
    const checkInteractions = () => {
      // Monitor resume downloads
      const handleResumeClick = () => unlockAchievement("resume");
      // Monitor keyboard shortcut for palette
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
          unlockAchievement("palette");
        }
        if (e.key === "/") {
          unlockAchievement("palette");
        }
      };

      // Expose function triggers on window for terminal and chat integration
      (window as any).triggerTerminalAchievement = () => unlockAchievement("terminal");
      (window as any).triggerChatAchievement = () => unlockAchievement("chat");
      (window as any).triggerEasterAchievement = () => unlockAchievement("easteregg");

      window.addEventListener("keydown", handleKeyDown);
      
      // Select resume download elements
      const resumeBtns = document.querySelectorAll('a[href*="resume"], button[title*="Resume"]');
      resumeBtns.forEach((btn) => btn.addEventListener("click", handleResumeClick));

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        resumeBtns.forEach((btn) => btn.removeEventListener("click", handleResumeClick));
        delete (window as any).triggerTerminalAchievement;
        delete (window as any).triggerChatAchievement;
        delete (window as any).triggerEasterAchievement;
      };
    };

    // Give it a tiny delay to ensure client DOM has mounted
    const cleanupInteractions = checkInteractions();

    return () => {
      clearTimeout(boundTimer);
      if (cleanupInteractions) cleanupInteractions();
    };
  }, [unlockedIds]);

  // Sync to localStorage
  useEffect(() => {
    if (unlockedIds.length > 0) {
      localStorage.setItem("venom_achievements", JSON.stringify(unlockedIds));
    }
  }, [unlockedIds]);

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
