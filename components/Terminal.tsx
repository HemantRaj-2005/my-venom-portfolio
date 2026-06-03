"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TermIcon, ShieldAlert, X, ChevronRight } from "lucide-react";

interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "success" | "system";
}

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: "SpiderOS v1.0.8 - Stark Command Synchronized", type: "system" },
    { text: "Type 'help' for a list of available cybernetic commands.", type: "output" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [glitchActive, setGlitchActive] = useState(false);
  const bufferEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal output
  useEffect(() => {
    if (bufferEndRef.current) {
      bufferEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  // Handle focus when terminal is clicked
  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory = [...history, { text: `visitor@spider-os:~$ ${cmd}`, type: "input" as const }];

    if (trimmed === "") {
      setHistory(newHistory);
      return;
    }

    if ((window as any).playClickSound) (window as any).playClickSound();

    let output: TerminalLine[] = [];

    switch (trimmed) {
      case "help":
        output = [
          { text: "Available commands:", type: "system" },
          { text: "  about    - Details about the developer entity", type: "output" },
          { text: "  skills   - View developer intelligence matrices (Tech Stack)", type: "output" },
          { text: "  projects - Inspect advanced project components", type: "output" },
          { text: "  contact  - Secure communications channels", type: "output" },
          { text: "  spider   - Activate Stark Override Protocol", type: "error" },
          { text: "  clear    - Clear console buffer", type: "output" }
        ];
        break;
      case "clear":
        setHistory([]);
        setInputValue("");
        return;
      case "about":
        output = [
          { text: "Entity Profile: Hemant Raj", type: "success" },
          { text: "Role: AI Engineer | Full Stack Developer | Problem Solver", type: "output" },
          { text: "Philosophy: 'With great code comes great scalability. Forge systems that support the weight.'", type: "system" },
          { text: "Focusing on high-performance dynamic Next.js templates, deep neural nets, and WebGL graphics.", type: "output" }
        ];
        break;
      case "skills":
        output = [
          { text: "Intelligence Matrices (Skills Orbit):", type: "success" },
          { text: "  [Frontend]  React 19, Next.js 16, TypeScript, Tailwind CSS, Framer Motion, Three.js", type: "output" },
          { text: "  [Backend]   Node.js, Express, Go, Python, GraphQL, REST APIs", type: "output" },
          { text: "  [Database]  MongoDB, PostgreSQL, Redis, Prisma ORM, SQL", type: "output" },
          { text: "  [DevOps]    Docker, GitHub Actions, AWS, Vercel, Linux CLI", type: "output" },
          { text: "  [AI/ML]     PyTorch, Transformers, LLM Finetuning, Vector Search", type: "output" }
        ];
        break;
      case "projects":
        output = [
          { text: "Active Projects Showcase:", type: "success" },
          { text: "  1. Stark-Tech Spider OS - Code self-healing tool (Next.js & LLMs)", type: "output" },
          { text: "  2. Sling-Shot SaaS Core - Stripe & NextAuth boilerplate template", type: "output" },
          { text: "  3. Web3 Web-Slinger Gas Tracker - EVM multi-chain gas visualizer", type: "output" },
          { text: "Type 'go [number]' (e.g. 'go 1') to visit or type '/projects' to search dynamic layouts.", type: "system" }
        ];
        break;
      case "go 1":
        window.open("/projects/stark-spider-os", "_blank");
        output = [{ text: "Redirecting to Stark-Tech Spider OS project page...", type: "system" }];
        break;
      case "go 2":
        window.open("/projects/slingshot-saas-core", "_blank");
        output = [{ text: "Redirecting to Sling-Shot SaaS page...", type: "system" }];
        break;
      case "go 3":
        window.open("/projects/web3-webslinger", "_blank");
        output = [{ text: "Redirecting to Web3 Web-Slinger Gas Tracker page...", type: "system" }];
        break;
      case "contact":
        output = [
          { text: "Secure channels established:", type: "success" },
          { text: "  Email:    hemantraj2005@gmail.com", type: "output" },
          { text: "  GitHub:   https://github.com/HemantRaj-2005", type: "output" },
          { text: "  LeetCode: https://leetcode.com/u/HemantRaj", type: "output" }
        ];
        break;
      case "spider":
        setGlitchActive(true);
        output = [
          { text: "OVERRIDE PROTOCOL INITIATED: SYNCING VISUAL OS...", type: "error" },
          { text: "WITH GREAT POWER COMES GREAT RESPONSIBILITY.", type: "error" },
          { text: "Re-routing network grids... Bypassing local console caches...", type: "error" }
        ];
        
        if ((window as any).triggerEasterAchievement) (window as any).triggerEasterAchievement();

        setTimeout(() => {
          setGlitchActive(false);
          setHistory(prev => [...prev, { text: "Stark Protocol successfully synchronized. Security grid active.", type: "system" }]);
        }, 3400);
        break;
      default:
        output = [
          { text: `Command not found: '${cmd}'. Type 'help' for options.`, type: "error" }
        ];
    }

    setHistory([...newHistory, ...output]);
    setInputValue("");
    if ((window as any).triggerTerminalAchievement) (window as any).triggerTerminalAchievement();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputValue);
    }
  };

  return (
    <>
      {/* Floating Action Badge to trigger Terminal */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[999] flex items-center justify-center w-12 h-12 rounded-full border border-zinc-800 bg-black/80 text-white backdrop-blur shadow-lg shadow-black/50 transition-all hover:scale-110 hover:border-cyan-500/50 hover:shadow-cyan-500/10 cursor-pointer active:scale-95"
        title="Open SpiderOS Command Console"
      >
        <TermIcon className="w-5 h-5 text-cyan-400 animate-pulse" />
      </button>

      {/* Terminal Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-all duration-300">
          <div
            onClick={focusInput}
            className={`relative flex flex-col w-full max-w-2xl h-[450px] bg-black border-2 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
              glitchActive 
                ? "border-red-600 animate-bounce shadow-red-500/30 scale-105" 
                : "border-zinc-800 shadow-cyan-500/10"
            }`}
          >
            {/* Scanlines Effect */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] z-50 opacity-30" />

            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#050505] border-b border-zinc-900 select-none">
              <div className="flex items-center gap-2">
                <TermIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                  SpiderOS Command Console
                </span>
                {glitchActive && (
                  <span className="flex items-center gap-1 text-[9px] font-mono text-red-500 animate-pulse">
                    <ShieldAlert className="w-3 h-3" /> OVERRIDE LOG
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Output buffer screen area */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm leading-relaxed space-y-2 select-text custom-scrollbar">
              {history.map((line, idx) => {
                let colorClass = "text-zinc-300";
                if (line.type === "input") colorClass = "text-cyan-400";
                if (line.type === "error") colorClass = "text-red-500 font-semibold";
                if (line.type === "success") colorClass = "text-cyan-300 font-bold";
                if (line.type === "system") colorClass = "text-zinc-500 italic";

                return (
                  <div key={idx} className={`${colorClass} break-words whitespace-pre-wrap`}>
                    {glitchActive && line.type === "error" ? (
                      <span className="inline-block animate-pulse">{line.text}</span>
                    ) : (
                      line.text
                    )}
                  </div>
                );
              })}
              
              {/* Fullscreen Glitch Takeover */}
              {glitchActive && (
                <div className="absolute inset-0 bg-[#050a12] z-40 flex flex-col items-center justify-center font-mono text-red-500 p-8 text-center animate-pulse">
                  <div className="text-4xl font-black mb-4 tracking-tighter uppercase animate-bounce text-red-500 drop-shadow-[0_0_15px_#e11d2e]">
                    WITH GREAT POWER
                  </div>
                  <p className="max-w-md text-xs leading-5 text-cyan-400 uppercase tracking-widest">
                    Stark protocol override detected. Re-routing HUD telemetry and synchronizing digital spider-webs...
                  </p>
                </div>
              )}

              <div ref={bufferEndRef} />
            </div>

            {/* Console Input Bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#050505] border-t border-zinc-900 font-mono text-sm">
              <ChevronRight className="w-4 h-4 text-cyan-400 animate-pulse" />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command (e.g. 'help')..."
                className="flex-1 bg-transparent border-none outline-none text-cyan-400 caret-cyan-500 placeholder-zinc-700 w-full"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
