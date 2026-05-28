"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

// Local smart responses matched against regex keywords
const getSpiderResponse = (query: string): string => {
  const q = query.toLowerCase();

  if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
    return "SPIDER-SENSE DETECTS A VISITOR! Welcome to Hemant Raj's high-tech Stark AI Operating System. Command-center diagnostics are online. Ask me about his tech stack, neural code networks, or scheduling a mission with him!";
  }
  if (q.includes("skills") || q.includes("languages") || q.includes("stack") || q.includes("code")) {
    return "STARK AI SYSTEMS REGISTER MULTIPLE PATHWAYS! Hemant commands Next.js 16, React 19, TypeScript, vanilla WebGL shaders, Python, PyTorch, and Docker containers. He excels in scaling services, styling rich user interfaces, and training custom neural code models.";
  }
  if (q.includes("project") || q.includes("work") || q.includes("portfolio")) {
    return "TELEMETRY PROTOCOLS ACTIVE! Hemant has built several key systems: 'Stark-Tech Spider OS' (AI-driven self-healing analyzer), 'Sling-Shot SaaS Core' (NextAuth/Stripe template), and 'Web3 Web-Slinger Gas Tracker' (multichain visualizer). Type '/projects' to inspect his intelligence dossiers!";
  }
  if (q.includes("hire") || q.includes("job") || q.includes("work with") || q.includes("contact")) {
    return "INITIATING COMMUNICATIONS UPLINK! Excellent choice. Fill out the Hire Inquiry form in the command center below, and our spider-signals will instantly notify Hemant. You can also reach him via email at hemantraj2005@gmail.com!";
  }
  if (q.includes("price") || q.includes("pricing") || q.includes("cost") || q.includes("service")) {
    return "COMMAND CENTER PACKAGES DETECTED: Hemant offers Full Stack Engineering, SaaS templates, custom dashboard visuals, WebGL shader systems, and custom LLM integrations. Checkout the pricing panel below; options start at $49/hr!";
  }
  if (q.includes("resume") || q.includes("cv") || q.includes("experience")) {
    return "DECRYPTING INTEL REPOSITORIES... Hemant's resume dossier is ready for download! Click the 'Resume Dossier' button on the hero dashboard to intercept his full timeline, detailing his development journey from core backend routes to advanced 3D shaders.";
  }
  if (q.includes("venom") || q.includes("symbiote") || q.includes("marvel") || q.includes("spider") || q.includes("stark")) {
    return "WITH GREAT POWER COMES GREAT RESPONSIBILITY! We have overridden all Venom symbiote codes with Stark-tech security grids. The spider-webs are fully functional, responsive at 60FPS, and secure. Try typing 'spider' in the terminal console for override controls...";
  }

  return "WE SEARCHED OUR NEURAL LOGS... but we do not recognize that query. Try asking us about 'skills', 'projects', 'resume', or 'how to hire Hemant'!";
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message once
  useEffect(() => {
    setMessages([
      { sender: "bot", text: "SPIDER-SENSE DETECTS A VISITOR! Ask me anything about Hemant's programming stack, projects, or services." }
    ]);
  }, []);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputVal("");
    setIsTyping(true);

    if ((window as any).playClickSound) (window as any).playClickSound();

    setTimeout(() => {
      const botResponse = getSpiderResponse(userText);
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
      setIsTyping(false);

      if ((window as any).playHoverSound) (window as any).playHoverSound();
      if ((window as any).triggerChatAchievement) (window as any).triggerChatAchievement();
    }, 850);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-22 z-[999] flex items-center justify-center w-12 h-12 rounded-full border border-zinc-800 bg-black/80 text-white backdrop-blur shadow-lg shadow-black/50 transition-all hover:scale-110 hover:border-cyan-500/50 hover:shadow-cyan-500/10 cursor-pointer active:scale-95"
        title="Open AI StarkAI Assistant"
      >
        <MessageSquare className="w-5 h-5 text-cyan-400" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-cyan-400 rounded-full border-2 border-black animate-ping pointer-events-none" />
      </button>

      {/* Chat Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-22 right-6 z-[1000] w-80 sm:w-96 h-[480px] flex flex-col bg-[#050a12]/95 border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/5 backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#050505] border-b border-zinc-900 select-none">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full bg-zinc-900 border border-cyan-500/30 overflow-hidden flex items-center justify-center">
                  <span className="text-[10px] text-cyan-400 font-extrabold animate-pulse">S</span>
                  <span className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping pointer-events-none" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white tracking-wide">StarkAI Assistant</span>
                  <span className="text-[9px] text-cyan-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> STARK SUIT HUD ACTIVE
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Message History Grid */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-gradient-to-b from-[#050a12]/60 to-[#050505]/80">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-sm font-sans relative ${
                      msg.sender === "user"
                        ? "bg-red-600 text-white rounded-br-none shadow-md shadow-red-700/10 border border-red-500/10"
                        : "bg-zinc-900/90 text-zinc-200 rounded-bl-none border border-cyan-500/10 backdrop-blur-sm"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="absolute top-[-8px] left-2 text-[8px] font-mono text-cyan-400 uppercase tracking-widest bg-zinc-950 px-1.5 rounded-sm border border-zinc-800">
                        StarkAI
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900/90 text-zinc-400 rounded-xl rounded-bl-none px-4 py-3 border border-cyan-500/10 text-xs font-mono flex items-center gap-2">
                    <span className="text-[8px] text-cyan-400 uppercase tracking-widest bg-zinc-950 px-1.5 rounded-sm border border-zinc-800">
                      StarkAI
                    </span>
                    <span>Scanning database...</span>
                    <span className="flex gap-1">
                      <span className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce delay-75" />
                      <span className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce delay-150" />
                      <span className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce delay-300" />
                    </span>
                  </div>
                </div>
              )}

              <div ref={logEndRef} />
            </div>

            {/* Suggestions Quick Chips */}
            <div className="px-4 py-2 border-t border-zinc-900 bg-zinc-950 flex flex-wrap gap-1.5 max-h-20 overflow-y-auto select-none">
              {["Skills Stack", "Active Projects", "Download Resume", "How to Hire"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setInputVal(chip);
                  }}
                  className="text-[9px] font-mono font-bold tracking-wide uppercase px-2 py-1 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/40 cursor-pointer active:scale-95 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Message input footer */}
            <div className="flex items-center gap-2 px-3 py-3 bg-zinc-950 border-t border-zinc-900">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the StarkAI..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none placeholder-zinc-650 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
              />
              <button
                onClick={handleSend}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-600 hover:bg-red-500 text-white cursor-pointer active:scale-95 transition-all shadow-md shadow-red-700/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
