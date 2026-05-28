"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

// Local smart responses matched against regex keywords
const getSymbioteResponse = (query: string): string => {
  const q = query.toLowerCase();

  if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
    return "WE DETECT A VISITOR! We are the Symbiote Chatbot. We represent Hemant Raj's coding consciousness. Ask us about his skills, projects, or how to absorb him into your engineering team!";
  }
  if (q.includes("skills") || q.includes("languages") || q.includes("stack") || q.includes("code")) {
    return "HEMANT'S DEV MATRICES HAVE BEEN ENTIRELY ABSORBED! He commands Next.js 16, React 19, TypeScript, vanilla WebGL shaders, Python, PyTorch, and Docker containers. He scales web services and optimizes gas fees!";
  }
  if (q.includes("project") || q.includes("work") || q.includes("portfolio")) {
    return "WE GUARD HIS WORK! He built 'Venom Core AI' (a self-healing code analyzer), 'Symbiote SaaS Core' (stripe template), and EVM gas tracker 'Web3 Carnage'. Click 'View Projects' or type '/projects' in command palette to inspect them!";
  }
  if (q.includes("hire") || q.includes("job") || q.includes("work with") || q.includes("contact")) {
    return "YOU WISH TO ACQUIRE HIS ABILITIES? Excellent. Fill out the 'Hire Me' form on this portal, or request a Callback. We will immediately ping his internal notification triggers. You can also email him at hemantraj2005@gmail.com!";
  }
  if (q.includes("price") || q.includes("pricing") || q.includes("cost") || q.includes("service")) {
    return "HEMANT PROVIDES PREMIUM SERVICES: Full Stack Dev, SaaS Templates, custom dashboards, WebGL/Three.js visual systems, and AI APIs. Check the Services section below for details on rates and packages starting at $49/hr!";
  }
  if (q.includes("resume") || q.includes("cv") || q.includes("experience")) {
    return "HEMANT HAS BUILT CODE FOR DYNAMIC TEAMS. Click the 'Download Resume' button on the Hero screen to pull his complete experience dossier. It tracks his journey from foundational engineering to custom AI pipeline assembly.";
  }
  if (q.includes("venom") || q.includes("symbiote") || q.includes("marvel")) {
    return "WE ARE VENOM! The symbiote binds with Hemant's code. It makes his animations aggressive, his databases secure, and his loading speeds instantaneous. Type 'venom' in the bottom-left Terminal for a surprise...";
  }

  return "WE SEARCHED OUR NEURAL LOGS... but we do not recognize that query. Try asking us about 'skills', 'projects', 'resume', or 'how to hire Hemant'!";
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "WE ARE ALIVE. Ask us anything about Hemant's programming stack or services, if you dare!" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

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

    // Play click sound if defined globally
    if ((window as any).playClickSound) (window as any).playClickSound();

    // Simulate AI thinking delay
    setTimeout(() => {
      const botResponse = getSymbioteResponse(userText);
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
      setIsTyping(false);

      if ((window as any).playHoverSound) (window as any).playHoverSound();
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-22 z-[999] flex items-center justify-center w-12 h-12 rounded-full border border-zinc-800 bg-black/80 text-white backdrop-blur shadow-lg shadow-black/50 transition-all hover:scale-110 hover:border-emerald-500/50 hover:shadow-emerald-500/10 cursor-pointer active:scale-95"
        title="Open AI Symbiote Chatbot"
      >
        <MessageSquare className="w-5 h-5 text-emerald-400" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-ping pointer-events-none" />
      </button>

      {/* Chat Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-22 right-6 z-[1000] w-80 sm:w-96 h-[480px] flex flex-col bg-[#050505] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl shadow-emerald-500/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-900 select-none">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full bg-zinc-900 border border-emerald-500/30 overflow-hidden flex items-center justify-center">
                  <span className="text-[10px] text-emerald-400 font-extrabold animate-pulse">V</span>
                  <span className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping pointer-events-none" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white tracking-wide">VenomGPT AI</span>
                  <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SYSTEM BINDING ACTIVE
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
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-radial-gradient">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-sm font-sans relative ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-700/10"
                        : "bg-zinc-900 text-zinc-200 rounded-bl-none border border-zinc-800/60"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="absolute top-[-8px] left-2 text-[8px] font-mono text-emerald-500 uppercase tracking-widest bg-zinc-950 px-1 rounded-sm border border-zinc-800">
                        Symbiote
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 text-zinc-400 rounded-xl rounded-bl-none px-4 py-3 border border-zinc-800/60 text-xs font-mono flex items-center gap-2">
                    <span className="text-[8px] text-emerald-500 uppercase tracking-widest bg-zinc-950 px-1 rounded-sm border border-zinc-800">
                      Symbiote
                    </span>
                    <span>Absorbing inputs...</span>
                    <span className="flex gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce delay-75" />
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce delay-150" />
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce delay-300" />
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
                    focus();
                  }}
                  className="text-[9px] font-mono font-bold tracking-wide uppercase px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/40 cursor-pointer active:scale-95 transition-all"
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
                placeholder="Ask the symbiote..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none placeholder-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
              />
              <button
                onClick={handleSend}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95 transition-all shadow-md shadow-emerald-700/10"
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
