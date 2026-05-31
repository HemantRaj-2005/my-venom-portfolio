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
  const [profile, setProfile] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);

  // Typewriter: displayed text in state (for rendering), all logic in refs
  const [words, setWords] = useState<string[]>([]);
  const [displayText, setDisplayText] = useState("");

  // All typewriter machine state lives in a single ref — never causes re-renders
  const twRef = useRef({
    wordIdx: 0,
    charIdx: 0,
    isDeleting: false,
  });

  // Typewriter engine — runs once after loading, self-schedules with setTimeout
  useEffect(() => {
    if (loading || words.length === 0) return;

    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const tw = twRef.current;
      const fullWord = words[tw.wordIdx];
      if (!fullWord) return;

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
          tw.wordIdx = (tw.wordIdx + 1) % words.length;
          timer = setTimeout(tick, 500);
        } else {
          timer = setTimeout(tick, 50);
        }
      }
    };

    timer = setTimeout(tick, 800); // initial delay after loading
    return () => clearTimeout(timer);
  }, [loading, words]); // eslint-disable-line react-hooks/exhaustive-deps


  const [faqs, setFaqs] = useState<{ id: string; question: string; answer: string }[]>([]);

  // Log visitor view analytics, fetch FAQs, profile, and experiences
  useEffect(() => {
    if (!loading) {
      try {
        fetch("/api/visitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/" }),
        });
      } catch (e) {}

      // Fetch FAQs from API
      const fetchFaqs = async () => {
        try {
          const res = await fetch("/api/faqs");
          const data = await res.json();
          if (data.success && data.faqs) {
            setFaqs(data.faqs);
          }
        } catch (e) {
          console.error("Failed to fetch FAQs:", e);
        }
      };

      // Fetch Profile from API
      const fetchProfile = async () => {
        try {
          const res = await fetch("/api/analytics");
          const data = await res.json();
          if (data.success && data.profile) {
            setProfile(data.profile);
            if (Array.isArray(data.profile.roles) && data.profile.roles.length > 0) {
              setWords(data.profile.roles);
            } else {
              setWords(["Content coming soon"]);
            }
          } else {
            setWords(["Content coming soon"]);
          }
        } catch (e) {
          console.error("Failed to fetch profile:", e);
          setWords(["Content coming soon"]);
        }
      };

      // Fetch Experiences from API
      const fetchExperiences = async () => {
        try {
          const res = await fetch("/api/experience");
          const data = await res.json();
          if (data.success && data.experiences) {
            setExperiences(data.experiences);
          }
        } catch (e) {
          console.error("Failed to fetch experiences:", e);
        }
      };

      fetchFaqs();
      fetchProfile();
      fetchExperiences();
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
                  Hi, I am {profile?.name || "Hemant Raj"} <br />
                  <span className="text-red-500 font-mono text-2xl md:text-3xl block mt-4 border-l-2 border-red-500 pl-4 h-10 select-none">
                    {displayText}
                    <span className="animate-pulse bg-red-500 inline-block w-1.5 h-6 ml-1.5 align-middle" />
                  </span>
                </h1>

                <p className="text-zinc-400 text-sm md:text-base font-sans max-w-lg leading-relaxed select-text">
                  {profile?.bio || "I’m a passionate full-stack developer who enjoys building fast, scalable, and user-centric web applications. My goal is to solve real-world problems with clean code and innovative solutions."}
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

                  {profile?.resumeUrl ? (
                    <a
                      href={profile.resumeUrl}
                      download
                      onClick={handleClick}
                      onMouseEnter={handleHover}
                      className="flex items-center gap-2 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 font-semibold text-zinc-300 hover:text-white px-5 py-3 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider active:scale-95"
                      title="Download Developer Resume"
                    >
                      <Download className="w-4 h-4" />
                      <span>Resume dossier</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 border border-zinc-900 bg-zinc-950/20 text-zinc-600 px-5 py-3 rounded-xl text-xs uppercase tracking-wider cursor-not-allowed">
                      <Download className="w-4 h-4" />
                      <span>Resume coming soon</span>
                    </div>
                  )}
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
                  {experiences.length === 0 ? (
                    <div className="text-zinc-650 uppercase tracking-widest font-mono py-2">
                      Content coming soon
                    </div>
                  ) : (
                    experiences.map((job, jIdx) => (
                      <div key={job.id || jIdx} className="relative space-y-1">
                        <div className="absolute top-1 left-[-31px] w-2.5 h-2.5 rounded-full bg-red-500 border border-black animate-pulse shadow-[0_0_5px_#e11d2e]" />
                        <div className="text-cyan-400 font-bold tracking-widest uppercase">{job.year} - {job.title}</div>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed">{job.description}</p>
                      </div>
                    ))
                  )}
                </div>
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
                {faqs.length === 0 ? (
                  <div className="bg-zinc-950/40 border border-zinc-900/60 rounded-xl p-8 text-center text-zinc-650 uppercase tracking-widest font-mono">
                    No FAQs present. Add FAQs in the admin dashboard panel.
                  </div>
                ) : (
                  faqs.map((faq, idx) => (
                    <div key={faq.id || idx} className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-5 space-y-2">
                      <div className="text-white font-bold tracking-wide">{faq.question}</div>
                      <p className="font-sans text-[11px] text-zinc-500 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))
                )}
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
