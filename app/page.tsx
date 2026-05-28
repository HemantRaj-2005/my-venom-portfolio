"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Shield, Code, ArrowRight, Download, Calendar, Mail, 
  Terminal as TermIcon, MessageSquare, ChevronDown, Check, Zap, Sparkles 
} from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import SpiderCore from "@/components/SpiderCore";
import CodingStats from "@/components/CodingStats";
import InteractiveOrbit from "@/components/InteractiveOrbit";
import ContactForm from "@/components/ContactForm";
import Chatbot from "@/components/Chatbot";
import CommandPalette from "@/components/CommandPalette";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Typewriter: displayed text in state (for rendering), all logic in refs
  const WORDS = ["AI Engineer", "Full Stack Developer", "Problem Solver"];
  const [displayText, setDisplayText] = useState("");

  // All typewriter machine state lives in a single ref — never causes re-renders
  const twRef = useRef({
    wordIdx: 0,
    charIdx: 0,
    isDeleting: false,
  });

  // Typewriter engine — runs once after loading, self-schedules with setTimeout
  useEffect(() => {
    if (loading) return;

    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const tw = twRef.current;
      const fullWord = WORDS[tw.wordIdx];

      if (!tw.isDeleting) {
        // Type next character
        tw.charIdx = Math.min(tw.charIdx + 1, fullWord.length);
        setDisplayText(fullWord.slice(0, tw.charIdx));

        if (tw.charIdx === fullWord.length) {
          // Finished typing — pause then start deleting
          tw.isDeleting = true;
          timer = setTimeout(tick, 2000);
        } else {
          timer = setTimeout(tick, 100);
        }
      } else {
        // Delete one character
        tw.charIdx = Math.max(tw.charIdx - 1, 0);
        setDisplayText(fullWord.slice(0, tw.charIdx));

        if (tw.charIdx === 0) {
          // Finished deleting — move to next word
          tw.isDeleting = false;
          tw.wordIdx = (tw.wordIdx + 1) % WORDS.length;
          timer = setTimeout(tick, 500);
        } else {
          timer = setTimeout(tick, 50);
        }
      }
    };

    timer = setTimeout(tick, 800); // initial delay after loading
    return () => clearTimeout(timer);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps


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
      {/* 1. Cinematic Spider-Verse loading screen */}
      <LoadingScreen onComplete={() => setLoading(false)} />

      {!loading && (
        <div className="flex-1 flex flex-col relative select-none bg-[#050a12] text-zinc-100">
          {/* Scanline lines overlays */}
          <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] z-50 opacity-10" />

          {/* Transparent Header Navigation */}
          <header className="fixed top-0 inset-x-0 h-20 bg-gradient-to-b from-[#050505]/95 to-transparent z-40 px-6 md:px-12 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-zinc-900 border border-cyan-500/30 flex items-center justify-center">
                <span className="text-[10px] text-cyan-400 font-black animate-pulse">S</span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase hidden sm:inline">
                Stark HUD Command Center
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              <Link href="/" className="text-cyan-400 hover:text-white transition-colors" onMouseEnter={handleHover}>Home</Link>
              <Link href="/projects" className="hover:text-white transition-colors" onMouseEnter={handleHover}>Projects</Link>
              <Link href="/marketplace" className="hover:text-white transition-colors" onMouseEnter={handleHover}>Marketplace</Link>
              <Link href="/blog" className="hover:text-white transition-colors" onMouseEnter={handleHover}>Blog</Link>
              <Link href="/analytics" className="hover:text-white transition-colors" onMouseEnter={handleHover}>Suit Analytics</Link>
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
                  const e = new KeyboardEvent("keydown", { ctrlKey: true, key: "k" });
                  window.dispatchEvent(e);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/80 text-[10px] font-mono text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                <span>Console</span>
                <span className="text-[8px] uppercase border border-zinc-800 px-1 rounded bg-black">Ctrl K</span>
              </button>
            </div>
          </header>

          {/* 2. Fullscreen cinematic Hero section */}
          <main className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20 relative bg-[#050505] overflow-hidden">
            {/* Background elements */}
            <div className="absolute w-[600px] h-[600px] bg-red-500/2 rounded-full blur-[160px] top-1/4 right-[-100px] pointer-events-none animate-pulse" />
            <div className="absolute w-[500px] h-[500px] bg-cyan-500/2 rounded-full blur-[140px] bottom-1/4 left-[-100px] pointer-events-none" />
            
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left Column Text details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest select-none">
                  <Shield className="w-4 h-4" /> STARK-HUD ONLINE
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none font-heading">
                  Hi, I am Hemant <br />
                  <span className="text-red-500 font-mono text-2xl md:text-3xl block mt-4 border-l-2 border-red-500 pl-4 h-10 select-none">
                    {displayText}
                    <span className="animate-pulse bg-red-500 inline-block w-1.5 h-6 ml-1.5 align-middle" />
                  </span>
                </h1>

                <p className="text-zinc-400 text-sm md:text-base font-sans max-w-lg leading-relaxed select-text">
                  I construct ultra-premium full stack web systems, integrate deep model weight API pipelines, and write custom WebGL holographic portal shaders in high-tech Stark command skins.
                </p>

                {/* CTAs Button list */}
                <div className="flex flex-wrap gap-3 select-none pt-4">
                  <button
                    onClick={() => {
                      handleClick();
                      document.getElementById("lead-forms")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    onMouseEnter={handleHover}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 font-semibold text-white px-5 py-3 rounded-xl shadow-lg shadow-red-950/20 transition-all cursor-pointer text-xs uppercase tracking-wider active:scale-95 border border-red-500/10"
                  >
                    <span>Hire Me</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    href="/projects"
                    onClick={handleClick}
                    onMouseEnter={handleHover}
                    className="flex items-center gap-2 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 font-semibold text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/20 px-5 py-3 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider active:scale-95"
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
                <SpiderCore />
              </div>
            </div>
          </main>

          {/* 3. Stats Section */}
          <section className="py-24 bg-[#050a12] border-y border-zinc-900 px-6 md:px-12">
            <div className="max-w-6xl mx-auto w-full space-y-12">
              <div className="text-center space-y-2 select-none">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">Suit telemetry parameters</span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight font-heading">Stark Diagnostics Telemetry</h2>
              </div>
              <CodingStats />
            </div>
          </section>

          {/* 4. Tech stack Orbit and story timeline section */}
          <section className="py-24 px-6 md:px-12 relative overflow-hidden bg-[#050505]">
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Tech Stack Orbit */}
              <div className="flex flex-col items-center gap-8">
                <div className="space-y-2 text-center lg:text-left select-none">
                  <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">Dynamic Tech stack</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight font-heading">Web-Slinger Node Matrices</h3>
                  <p className="text-zinc-500 text-xs max-w-sm leading-relaxed mt-2 font-sans">
                    Hover over orbiting nodes to inspect custom development parameters. Nodes rotate programmatically.
                  </p>
                </div>
                <InteractiveOrbit />
              </div>

              {/* Story timeline */}
              <div className="space-y-8 select-none">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">Dossier timeline</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight font-heading">Development Journey</h3>
                </div>

                <div className="space-y-6 border-l-2 border-zinc-850 pl-6 font-mono text-xs text-zinc-400">
                  {[
                    { year: "2026", title: "Stark HUD Systems Architect", desc: "Forging Next.js 16 modular codebases, programmatically synthesized HUD Web Audio APIs, and WebGL holographic shaders." },
                    { year: "2025", title: "AI Neural Net Integration", desc: "Constructed deep LLM worker pools, fine-tuned LLaMA model nodes, and deployed scalable vector retrieval indexing routes." },
                    { year: "2024", title: "Full Stack Engineer", desc: "Assembled robust e-commerce architectures, integrated stripe payments, and secured credentials authentication matrices." }
                  ].map((job, jIdx) => (
                    <div key={jIdx} className="relative space-y-1">
                      <div className="absolute top-1 left-[-31px] w-2.5 h-2.5 rounded-full bg-red-500 border border-black animate-pulse shadow-[0_0_5px_#e11d2e]" />
                      <div className="text-cyan-400 font-bold tracking-widest uppercase">{job.year} - {job.title}</div>
                      <p className="font-sans text-[11px] text-zinc-500 leading-relaxed">{job.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 5. Services pricing list comparison card */}
          <section className="py-24 bg-[#050a12] border-y border-zinc-900 px-6 md:px-12">
            <div className="max-w-6xl mx-auto w-full space-y-12">
              <div className="text-center space-y-2 select-none">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">Available dossiers packages</span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight font-heading">Services & Pricing Matrices</h2>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs select-none">
                {[
                  { name: "Single Portfolio", price: "$499", desc: "A custom 3-page brutalist template preconfigured with contact forms, visitor logs, and custom SVGs.", features: ["3 custom pages", "Interactive Contact Form", "SEO Meta configurations", "Holographic Loading Screen"] },
                  { name: "SaaS Startup Core", price: "$1,499", desc: "Full stack core pre-built with NextAuth credentials logins, Stripe checkout gateways, and database logs.", features: ["NextAuth & MongoDB settings", "Stripe API configurations", "Analytics dashboards", "Lead scoring systems"] },
                  { name: "Enterprise Custom Shaders", price: "$2,999", desc: "Advanced visuals, WebGL shaders morphing nodes, custom synthesiser drones, and AI chatbots.", features: ["WebGL hologram portal canvases", "Web Audio API Synths", "Offline AI Chatbot widgets", "PWA offline configurations"] }
                ].map((tier, idx) => (
                  <div key={idx} className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/20 transition-all shadow-md group">
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-bold text-zinc-500">{tier.name}</span>
                      <div className="text-3xl font-black text-white font-mono">{tier.price}</div>
                      <p className="font-sans text-[11px] text-zinc-500 leading-relaxed">{tier.desc}</p>
                      
                      <div className="h-[1px] bg-zinc-900" />
                      
                      <ul className="space-y-2 pt-2 text-[10px] text-zinc-400 font-sans">
                        {tier.features.map((f, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-cyan-400" />
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
                      className="mt-8 w-full bg-zinc-900 border border-zinc-800 hover:border-red-500/30 hover:text-red-500 text-zinc-300 py-2.5 rounded-xl uppercase tracking-wider text-[10px] font-bold cursor-pointer active:scale-95 transition-all"
                    >
                      Select dossier
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. FAQ collapsible section */}
          <section className="py-24 px-6 md:px-12 select-none bg-[#050505]">
            <div className="max-w-4xl mx-auto w-full space-y-12">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">Frequently asked logs</span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight font-heading">Security & Integration FAQs</h2>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {[
                  { q: "Is MongoDB database setup required?", a: "No. If DATABASE_URL is not configured, the website automatically executes local JSON-dossier fallbacks inside the .data/ folder. Form submissions persist instantly." },
                  { q: "How does the sound synthesiser function?", a: "It utilizes the native browser Web Audio API to construct ambient noise. No static file triggers are downloaded, ensuring 100% security against copyright blockages." },
                  { q: "How is PWA offline capabilities handled?", a: "By loading caching service-workers that cache root layout matrices. Visitors can open the dossier offline." }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-5 space-y-2">
                    <div className="text-white font-bold tracking-wide">{faq.q}</div>
                    <p className="font-sans text-[11px] text-zinc-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 7. Lead Forms Section */}
          <section className="py-24 bg-[#050a12] border-t border-zinc-900 px-6 md:px-12 pb-32">
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
