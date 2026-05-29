"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Tag, ArrowUpRight, Code, Shield } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  overview: string;
  techStack: string[];
  performance: number;
  gallery: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = ["All", "AI/ML", "SaaS", "Web3", "DevOps", "Open Source"];

  useEffect(() => {
    // Log visit analytics dynamically
    try {
      fetch("/api/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/projects" }),
      });
    } catch (e) {}

    // Load projects from database client
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleHover = () => {
    if ((window as any).playHoverSound) (window as any).playHoverSound();
  };

  const handleClick = () => {
    if ((window as any).playClickSound) (window as any).playClickSound();
  };

  // Determine if project fits active filter tags
  const fitsFilter = (proj: Project, filter: string) => {
    if (filter === "All") return true;
    if (filter === "AI/ML") {
      return proj.title.includes("AI") || proj.techStack.some(t => /Torch|LLM|Transformer|AI/i.test(t));
    }
    if (filter === "SaaS") {
      return proj.title.includes("SaaS") || proj.techStack.some(t => /Stripe|NextAuth/i.test(t));
    }
    if (filter === "Web3") {
      return proj.title.includes("Web3") || proj.techStack.some(t => /Ethers|IPFS|Solidity/i.test(t));
    }
    if (filter === "DevOps") {
      return proj.techStack.some(t => /Docker|CI|CD|Action|AWS/i.test(t));
    }
    if (filter === "Open Source") {
      return true; // Mock defaults all as open source repositories
    }
    return false;
  };

  const filteredProjects = projects.filter(
    (p) =>
      fitsFilter(p, selectedFilter) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-24 px-6 md:px-12 relative overflow-hidden font-sans">
      {/* Background Ambient lights */}
      <div className="absolute w-[500px] h-[500px] bg-red-500/2 rounded-full blur-[150px] top-[-100px] right-[-100px] pointer-events-none animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/2 rounded-full blur-[100px] bottom-[-100px] left-[-100px] pointer-events-none" />

      {/* Main Header Container */}
      <div className="max-w-6xl mx-auto mb-16 select-none">
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest"
          >
            <Shield className="w-4 h-4" /> SECURE CODE ARCHIVE
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-white mt-2 font-heading"
          >
            Intelligence Dossiers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-zinc-500 max-w-xl leading-relaxed mt-2"
          >
            Monitor and explore fully realized, high-performance production codebases, AI pipelines, and smart contracts wrapped in a Stark-tech cybernetic shell.
          </motion.p>
        </div>
      </div>

      {/* Search and Filters grid */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-zinc-900 pb-8 select-none">
        {/* Chips Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => {
            const isSel = selectedFilter === filter;
            return (
              <button
                key={index}
                onClick={() => {
                  handleClick();
                  setSelectedFilter(filter);
                }}
                onMouseEnter={handleHover}
                className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isSel
                    ? "bg-red-600 text-white border border-red-500/30 shadow-md shadow-red-700/10 scale-105"
                    : "bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Search bar input */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-zinc-850 bg-zinc-950/80 w-full max-w-xs backdrop-blur focus-within:border-cyan-500/30 transition-colors">
          <Search className="w-4.5 h-4.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search technology parameters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-700 w-full font-mono"
          />
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-zinc-650 animate-pulse">
            Decrypting index matrices...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-zinc-650">
            No records available
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-zinc-700">
            No active code archives matched filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative flex flex-col bg-zinc-955 border border-zinc-900 rounded-2xl overflow-hidden hover:border-cyan-500/20 transition-all duration-300 shadow-xl shadow-black/40 hover:shadow-cyan-500/2"
              >
                {/* Custom top bar decoration */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-zinc-900 group-hover:bg-cyan-400 transition-colors duration-300" />

                {/* Card Thumbnail */}
                <div className="h-44 relative overflow-hidden bg-zinc-900">
                  <Image
                    src={proj.gallery[0] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"}
                    alt={proj.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-115 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
                  
                  {/* Performance stats indicator */}
                  <div className="absolute top-4 right-4 bg-black/85 border border-zinc-850 rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-mono text-[10px] text-cyan-400 font-bold backdrop-blur">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>LHS: {proj.performance}%</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col bg-zinc-950/80 backdrop-blur-sm">
                  <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors duration-200 font-sans tracking-wide">
                    {proj.title}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-2 font-sans line-clamp-3 leading-relaxed flex-1">
                    {proj.overview}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1 mt-5">
                    {proj.techStack.slice(0, 3).map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-[9px] font-mono text-zinc-550 uppercase tracking-wide"
                      >
                        {badge}
                      </span>
                    ))}
                    {proj.techStack.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-[9px] font-mono text-zinc-500">
                        +{proj.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Explore button trigger */}
                  <Link
                    href={`/projects/${proj.slug}`}
                    onClick={handleClick}
                    onMouseEnter={handleHover}
                    className="mt-6 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 group-hover:text-cyan-400 transition-colors border-t border-zinc-900 pt-4 cursor-pointer"
                  >
                    <span>Read Dossier</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
    </div>
  </div>
);
}
