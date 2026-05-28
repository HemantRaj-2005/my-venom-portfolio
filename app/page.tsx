"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Shield, Code, ArrowRight, Download, Calendar, Mail, 
  Terminal as TermIcon, MessageSquare, ChevronDown, Check, Zap, Sparkles 
} from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import SymbioteCore from "@/components/SymbioteCore";
import CodingStats from "@/components/CodingStats";
import InteractiveOrbit from "@/components/InteractiveOrbit";
import ContactForm from "@/components/ContactForm";
import Chatbot from "@/components/Chatbot";
import CommandPalette from "@/components/CommandPalette";

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  // Typewriter states
  const words = ["AI Engineer", "Full Stack Developer", "Problem Solver"];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Typewriter Loop Effect
  useEffect(() => {
    if (loading) return;

    const handleType = () => {
      const fullWord = words[currentWordIdx];
      
      if (!isDeleting) {
        // Typing characters
        setCurrentText(fullWord.slice(0, currentText.length + 1));
        setTypingSpeed(100);

        if (currentText === fullWord) {
          // Pause at full word
          setTypingSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        // Deleting characters
        setCurrentText(fullWord.slice(0, currentText.length - 1));
        setTypingSpeed(50);

        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIdx((prev) => (prev + 1) % words.length);
          setTypingSpeed(500);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx, loading]);

  // Log visitor view analytics
  useEffect(() => {
    if (!loading) {
      try {
        fetch("/api/visitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/" }),
        });
      } catch (e) {}
    }
  }, [loading]);

  const handleHover = () => {
    if ((window as any).playHoverSound) (window as any).playHoverSound();
  };

  const handleClick = () => {
    if ((window as any).playClickSound) (window as any).playClickSound();
  };

  return (
    <>
      {/* 1. Cinematic Matrix loading screen */}
      <LoadingScreen onComplete={() => setLoading(false)} />

      {!loading && (
        <div className="flex-1 flex flex-col relative select-none">
          {/* Scanline lines overlays */}
          <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[size:100%_4px] z-50 opacity-15" />

          {/* Transparent Header Navigation */}
          <header className="fixed top-0 inset-x-0 h-20 bg-gradient-to-b from-[#020202]/90 to-transparent z-40 px-6 md:px-12 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-zinc-900 border border-emerald-500/30 flex items-center justify-center">
                <span className="text-[10px] text-emerald-400 font-black animate-pulse">V</span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase hidden sm:inline">
                Hemant Raj Dossier
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              <Link href="/" className="text-emerald-400 hover:text-white transition-colors" onMouseEnter={handleHover}>Home</Link>
              <Link href="/projects" className="hover:text-white transition-colors" onMouseEnter={handleHover}>Projects</Link>
              <Link href="/marketplace" className="hover:text-white transition-colors" onMouseEnter={handleHover}>Marketplace</Link>
              <Link href="/blog" className="hover:text-white transition-colors" onMouseEnter={handleHover}>Blog</Link>
              <button 
                onClick={() => {
                  handleClick();
                  document.getElementById("lead-forms")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Hire Me
              </button>
            </nav>

            <div className="flex items-center gap-3">
              {/* Command Palette Trigger */}
              <button
                onClick={() => {
                  handleClick();
                  // Trigger keypress emulation to open command palette
                  const e = new KeyboardEvent("keydown", { ctrlKey: true, key: "k" });
                  window.dispatchEvent(e);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/80 text-[10px] font-mono text-zinc-500 hover:text-white hover:border-zinc-700 transition-all cursor-pointer"
              >
                <span>Console</span>
                <span className="text-[8px] uppercase border border-zinc-800 px-1 rounded bg-black">Ctrl K</span>
              </button>
            </div>
          </header>

          {/* 2. Fullscreen cinematic Hero section */}
          <main className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20 relative bg-[#020202] overflow-hidden">
            {/* Background elements */}
            <div className="absolute w-[600px] h-[600px] bg-emerald-500/2 rounded-full blur-[160px] top-1/4 right-[-100px] pointer-events-none" />
            
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left Column Text details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest select-none">
                  <Shield className="w-4 h-4" /> Systems Core Synchronized
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
                  Hi, I am Hemant <br />
                  <span className="text-emerald-400 font-mono text-2xl md:text-3xl block mt-4 border-l-2 border-emerald-500 pl-4 h-10 select-none">
                    {currentText}
                    <span className="animate-pulse bg-emerald-400 inline-block w-1.5 h-6 ml-1.5 align-middle" />
                  </span>
                </h1>

                <p className="text-zinc-400 text-sm md:text-base font-sans max-w-lg leading-relaxed select-text">
                  I construct ultra-premium full stack web systems, integrate deep model weight API pipelines, and write custom WebGL noise deformation shaders in obsidian-black skins.
                </p>

                {/* CTAs Button list */}
                <div className="flex flex-wrap gap-3 select-none pt-4">
                  <button
                    onClick={() => {
                      handleClick();
                      document.getElementById("lead-forms")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    onMouseEnter={handleHover}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 font-semibold text-white px-5 py-3 rounded-xl shadow-lg shadow-emerald-950/20 transition-all cursor-pointer text-xs uppercase tracking-wider active:scale-95"
                  >
                    <span>Hire Me</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    href="/projects"
                    onClick={handleClick}
                    onMouseEnter={handleHover}
                    className="flex items-center gap-2 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 font-semibold text-zinc-300 hover:text-white px-5 py-3 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider active:scale-95"
                  >
                    <span>Explore Projects</span>
                  </Link>

                  <a
                    href="/resume.pdf"
                    onClick={handleClick}
                    onMouseEnter={handleHover}
                    className="flex items-center gap-2 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 font-semibold text-zinc-300 hover:text-white px-5 py-3 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider active:scale-95"
                    title="Download Developer Resume"
                  >
                    <Download className="w-4 h-4" />
                    <span>Resume dossier</span>
                  </a>
                </div>
              </div>

              {/* Right Column 3D canvas mesh */}
              <div className="w-full h-full flex justify-center items-center">
                <SymbioteCore />
              </div>
            </div>
          </main>

          {/* 3. Stats Section */}
          <section className="py-24 bg-[#030303] border-y border-zinc-900 px-6 md:px-12">
            <div className="max-w-6xl mx-auto w-full space-y-12">
              <div className="text-center space-y-2 select-none">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">Coding stats logs</span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">System Performance Metrics</h2>
              </div>
              <CodingStats />
            </div>
          </section>

          {/* 4. Tech stack Orbit and story timeline section */}
          <section className="py-24 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Tech Stack Orbit */}
              <div className="flex flex-col items-center gap-8">
                <div className="space-y-2 text-center lg:text-left select-none">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">Dynamic Tech stack</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Circular Matrices</h3>
                  <p className="text-zinc-500 text-xs max-w-sm leading-relaxed mt-2 font-sans">
                    Hover over orbiting nodes to inspect custom development parameters. Nodes rotate programmatically.
                  </p>
                </div>
                <InteractiveOrbit />
              </div>

              {/* Story timeline */}
              <div className="space-y-8 select-none">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">Dossier timeline</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Development Journey</h3>
                </div>

                <div className="space-y-6 border-l-2 border-zinc-800/80 pl-6 font-mono text-xs text-zinc-400">
                  {[
                    { year: "2026", title: "Cybernetic Web Systems Architect", desc: "Forging Next.js 16 modular codebases, programmatically synthesized Web Audio APIs, and WebGL dynamic shaders." },
                    { year: "2025", title: "AI Integration Pipelines", desc: "Constructed deep LLM worker pools, fine-tuned LLaMA model nodes, and deployed scalable vector retrieval indexing routes." },
                    { year: "2024", title: "Full Stack Engineer", desc: "Assembled robust e-commerce architectures, integrated stripe payments, and secured credentials authentication matrices." }
                  ].map((job, jIdx) => (
                    <div key={jIdx} className="relative space-y-1">
                      <div className="absolute top-1 left-[-31px] w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black animate-pulse" />
                      <div className="text-emerald-400 font-bold tracking-widest uppercase">{job.year} - {job.title}</div>
                      <p className="font-sans text-[11px] text-zinc-500 leading-relaxed">{job.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 5. Services pricing list comparison card */}
          <section className="py-24 bg-[#030303] border-y border-zinc-900 px-6 md:px-12">
            <div className="max-w-6xl mx-auto w-full space-y-12">
              <div className="text-center space-y-2 select-none">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">Available dossiers packages</span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Services & Pricing Matrices</h2>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs select-none">
                {[
                  { name: "Single Portfolio", price: "$499", desc: "A custom 3-page brutalist template preconfigured with contact forms, visitor logs, and custom SVGs.", features: ["3 custom pages", "Interactive Contact Form", "SEO Meta configurations", "Matrix Loading Screen"] },
                  { name: "SaaS Startup Core", price: "$1,499", desc: "Full stack core pre-built with NextAuth credentials logins, Stripe checkout gateways, and database logs.", features: ["NextAuth & MongoDB settings", "Stripe API configurations", "Analytics dashboards", "Lead scoring systems"] },
                  { name: "Enterprise Custom Shaders", price: "$2,999", desc: "Advanced visuals, WebGL shaders morphing nodes, custom synthesiser drones, and AI chatbots.", features: ["Vanilla Three.js canvases", "Web Audio API Synths", "Offline AI Chatbot widgets", "PWA offline configurations"] }
                ].map((tier, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/20 transition-all shadow-md group">
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-bold text-zinc-500">{tier.name}</span>
                      <div className="text-3xl font-black text-white font-mono">{tier.price}</div>
                      <p className="font-sans text-[11px] text-zinc-500 leading-relaxed">{tier.desc}</p>
                      
                      <div className="h-[1px] bg-zinc-900" />
                      
                      <ul className="space-y-2 pt-2 text-[10px] text-zinc-400">
                        {tier.features.map((f, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        handleClick();
                        document.getElementById("lead-forms")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="mt-8 w-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 text-zinc-300 hover:text-white py-2.5 rounded-xl uppercase tracking-wider text-[10px] font-bold cursor-pointer active:scale-95 transition-all"
                    >
                      Select dossier
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. FAQ collapsible section */}
          <section className="py-24 px-6 md:px-12 select-none">
            <div className="max-w-4xl mx-auto w-full space-y-12">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">Frequently asked logs</span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Security & Integration FAQs</h2>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {[
                  { q: "Is MongoDB database setup required?", a: "No. If DATABASE_URL is not configured, the website automatically executes local JSON-dossier fallbacks inside the .data/ folder. Form submissions persist instantly." },
                  { q: "How does the sound synthesiser function?", a: "It utilizes the native browser Web Audio API to construct ambient noise. No static file triggers are downloaded, ensuring 100% security against copyright blockages." },
                  { q: "How is PWA offline capabilities handled?", a: "By loading caching service-workers that cache root layout matrices. Visitors can open the dossier offline." }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-2">
                    <div className="text-white font-bold tracking-wide">{faq.q}</div>
                    <p className="font-sans text-[11px] text-zinc-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 7. Lead Forms Section */}
          <section className="py-24 bg-[#030303] border-t border-zinc-900 px-6 md:px-12 pb-32">
            <ContactForm />
          </section>

          {/* Floating chatbot bubble */}
          <Chatbot />

          {/* Keyboard shortcut command palette */}
          <CommandPalette />
        </div>
      )}
    </>
  );
}
