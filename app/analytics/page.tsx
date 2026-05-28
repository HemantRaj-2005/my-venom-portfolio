"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Zap, BarChart3, Cpu, Award, Trophy, Activity,
  ArrowLeft, Search, Calendar, Code, CheckCircle, RefreshCw,
  Sparkles, Shield, User, FileText, ChevronRight
} from "lucide-react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import AnalyticsLoading from "./loading";

// Custom SVG component for Github icon to resolve lucide-react module resolution warnings
const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);


// Type definitions
import { DevStatsPayload } from "@/lib/mock-stats";

export default function DeveloperAnalytics() {
  const [activeTab, setActiveTab] = useState<"overview" | "github" | "coding" | "ai">("overview");
  const [stats, setStats] = useState<DevStatsPayload | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Resume score mock analyzer state
  const [resumeScore, setResumeScore] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Recruiter mock interaction count
  const [recruiterCount, setRecruiterCount] = useState(24);

  // Trigger click/hover sound
  const playClick = () => {
    if ((window as any).playClickSound) (window as any).playClickSound();
  };

  const playHover = () => {
    if ((window as any).playHoverSound) (window as any).playHoverSound();
  };

  // Load stats from API
  const loadStats = async (isManual = false) => {
    if (isManual) {
      setSyncing(true);
      playClick();
    }
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setProfile(data.profile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    // Record page view view visitor log
    try {
      fetch("/api/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/analytics" }),
      });
    } catch (e) {}

    loadStats();
  }, []);

  // Run mock resume analyzer
  const analyzeResume = () => {
    playClick();
    setAnalyzing(true);
    setTimeout(() => {
      // Return a premium score based on stats
      const score = stats ? Math.min(stats.auraScore + 2, 98) : 89;
      setResumeScore(score);
      setAnalyzing(false);
      // Increment recruiter view count as easter egg
      setRecruiterCount(prev => prev + 1);
    }, 2000);
  };

  if (loading || !stats) {
    return <AnalyticsLoading />;
  }

  // Get color for contribution box (electric cyan shades)
  const getContributionColor = (count: number) => {
    if (count === 0) return "bg-zinc-950 border-zinc-950/60";
    if (count <= 2) return "bg-[#0b2838] border-cyan-950/10";
    if (count <= 4) return "bg-[#0f4b62] border-cyan-800/20";
    if (count <= 6) return "bg-[#147a96] border-cyan-600/20";
    return "bg-cyan-400 border-cyan-300/30";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-24 px-6 md:px-12 relative overflow-hidden font-sans select-none">
      {/* Cinematic grid overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e1726_1px,transparent_1px),linear-gradient(to_bottom,#0e1726_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/2 rounded-full blur-[140px] top-1/4 left-1/4 pointer-events-none animate-pulse" />

      {/* Header Navigation */}
      <div className="max-w-6xl mx-auto w-full mb-12 select-none relative z-10">
        <Link
          href="/"
          onClick={playClick}
          className="flex items-center gap-2 border border-zinc-900 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-400 hover:text-white px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer w-fit mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Control Center</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest">
              <Activity className="w-4.5 h-4.5" /> Stark-Tech Diagnostics Core
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-2 font-heading">
              Suit Telemetry & Diagnostics
            </h1>
            <p className="text-xs text-zinc-500 max-w-xl leading-relaxed mt-2 font-mono uppercase">
              Synapsing real-time profiles, contest ratings, streaks, and repository telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-500">
              LAST UPDATE: {stats.lastSynced}
            </span>
            <button
              onClick={() => loadStats(true)}
              disabled={syncing}
              className="flex items-center gap-2 border border-zinc-900 hover:border-red-500/30 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync Stats"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Developer Aura Card */}
        <div className="space-y-6">
          <div className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-900 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-black/40">
            {/* Glowing active nodes */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-red-500/20 via-cyan-400/20 to-red-500/20" />
            <div className="absolute bottom-[-150px] right-[-150px] w-64 h-64 bg-cyan-500/2 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex justify-between items-start select-none">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest border border-zinc-900 px-2 py-0.5 rounded">
                Node ID: dev-core-01
              </span>
              <div className="flex items-center gap-1.5 text-red-500 bg-red-950/20 border border-red-800/20 px-2.5 py-0.5 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-red-400" />
                <span className="text-xs font-bold font-mono">{stats.github.metrics.streak} Day Streak</span>
              </div>
            </div>

            {/* Avatar & Title */}
            <div className="text-center mt-6">
              <div className="relative w-24 h-24 mx-auto rounded-full border border-zinc-800 p-1.5 bg-black/60 shadow-lg select-none">
                <img
                  src={stats.github.profile.avatarUrl}
                  alt={stats.github.profile.name}
                  className="w-full h-full rounded-full object-cover grayscale opacity-90 border border-zinc-900"
                />
                <div className="absolute inset-0 rounded-full bg-cyan-500/5 animate-pulse pointer-events-none" />
              </div>
              <h2 className="text-xl font-bold text-white mt-4 font-sans tracking-wide">
                {stats.github.profile.name}
              </h2>
              <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mt-1">
                Suit Rank: Cyber-Slinger V2
              </p>
            </div>

            {/* Aura Score Circular Chart */}
            <div className="mt-8 pt-6 border-t border-zinc-900/60 flex items-center justify-between">
              <div>
                <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Suit Sync Level</h4>
                <div className="text-4xl font-extrabold text-white font-mono mt-1 tracking-tight">
                  {stats.auraScore} <span className="text-xs text-zinc-650 font-normal">/ 100</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-zinc-900 flex items-center justify-center relative select-none">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="26" strokeWidth="4" stroke="#00e5ff" fill="transparent" strokeDasharray="163" strokeDashoffset={163 - (163 * stats.auraScore) / 100} className="transition-all duration-1000" />
                </svg>
                <span className="absolute text-xs font-bold text-cyan-400 font-mono">{stats.auraScore}%</span>
              </div>
            </div>

            {/* Short specs list */}
            <div className="mt-6 space-y-2 border-t border-zinc-900/60 pt-4 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
              <div className="flex justify-between">
                <span className="text-zinc-600">Location Node:</span>
                <span className="text-zinc-300 font-bold">{stats.github.profile.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Git Public Repos:</span>
                <span className="text-cyan-400 font-bold">{stats.github.profile.publicRepos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">LeetCode Solved:</span>
                <span className="text-cyan-400 font-bold">{stats.leetcode.solved.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Codeforces Rating:</span>
                <span className="text-cyan-400 font-bold">{stats.codeforces.rating}</span>
              </div>
            </div>
          </div>

          {/* Interactive Resume Analyzer Card */}
          <div className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-900 rounded-2xl p-6 relative">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-4 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" /> AI Resume Core
            </h3>
            <p className="text-[11px] text-zinc-500 font-sans leading-relaxed mb-6">
              Simulate portfolio performance scoring based on repository commits and DSA stats.
            </p>

            {resumeScore !== null ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                <div className="text-5xl font-black font-mono text-cyan-400">{resumeScore}</div>
                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-2">
                  ATS Recruiter Match Score
                </div>
                <button
                  onClick={() => setResumeScore(null)}
                  className="mt-4 border border-zinc-900 hover:border-zinc-800 text-[10px] font-mono text-zinc-400 hover:text-white px-3 py-1.5 rounded cursor-pointer"
                >
                  Analyze Again
                </button>
              </motion.div>
            ) : (
              <button
                onClick={analyzeResume}
                disabled={analyzing}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 text-zinc-300 hover:text-white py-3 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-widest font-mono hover:border-cyan-500/20"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>Scanning Codebases...</span>
                  </>
                ) : (
                  <span>Trigger Suit AST Scan</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Dashboard Views & Navigation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Custom Cyberpunk Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-4 select-none">
            {[
              { id: "overview", label: "Dashboard Overview", icon: BarChart3 },
              { id: "github", label: "GitHub Telemetry", icon: Github },
              { id: "coding", label: "Competitive Coding", icon: Trophy },
              { id: "ai", label: "AI Insights", icon: Cpu }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSel = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    isSel
                      ? "bg-red-600 text-white border border-red-500/20 shadow-lg shadow-red-950/20"
                      : "bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Render Tab Contents */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Cards Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 relative select-none">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Global Commit Rate</span>
                      <div className="text-3xl font-bold font-mono text-white mt-1">{stats.github.metrics.totalCommits}</div>
                      <div className="text-[8px] font-mono text-cyan-400 mt-1 uppercase tracking-wider">Sync Active</div>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 relative select-none">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">LeetCode Solved</span>
                      <div className="text-3xl font-bold font-mono text-white mt-1">{stats.leetcode.solved.total}</div>
                      <div className="text-[8px] font-mono text-cyan-400 mt-1 uppercase tracking-wider">Acceptance: {stats.leetcode.acceptance}</div>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 relative select-none">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Recruiter Dossier Clicks</span>
                      <div className="text-3xl font-bold font-mono text-white mt-1">{recruiterCount}</div>
                      <div className="text-[8px] font-mono text-amber-500 mt-1 uppercase tracking-wider">High Engagement</div>
                    </div>
                  </div>

                  {/* Skills radar chart and DSA progress */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
                        DSA Domain Strengths
                      </h3>
                      <div className="h-64 flex items-center justify-center select-none">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.skills}>
                            <PolarGrid stroke="#1f1f1f" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: "#666", fontSize: 9, fontFamily: "monospace" }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#444" }} />
                            <Radar name="Proficiency" dataKey="value" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.15} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-4">
                          Activity Logs & Milestones
                        </h3>
                        <div className="space-y-4 font-sans text-xs">
                          {[
                            { date: "May 2026", text: "Successfully deployed custom WebGL morph core mesh shaders." },
                            { date: "Apr 2026", text: "Achieved Expert status on Codeforces rating timeline." },
                            { date: "Mar 2026", text: "Registered 150+ daily active streaks on LeetCode database." },
                            { date: "Feb 2026", text: "Created open-source NextAuth MongoDB credentials boilerplate." }
                          ].map((milestone, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-800/10 px-1.5 py-0.5 rounded tracking-wide shrink-0">
                                {milestone.date}
                              </span>
                              <p className="text-zinc-400 leading-relaxed">{milestone.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-zinc-900/60 pt-4 mt-6 flex justify-between items-center select-none">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Recruiter Action Target:</span>
                        <Link href="/#contact-form" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                          <span>Initiate Developer Inquiry</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: GitHub Telemetry */}
              {activeTab === "github" && (
                <div className="space-y-6">
                  {/* Heatmap Grid */}
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6 flex justify-between items-center select-none">
                      <span>Contribution Streak Heatmap (Last 365 Days)</span>
                      <span className="text-[10px] text-cyan-400 font-bold font-mono">
                        {stats.github.metrics.totalCommits} Commits / Year
                      </span>
                    </h3>
                    
                    {/* Heatmap container */}
                    <div className="overflow-x-auto pr-2 custom-scrollbar select-none">
                      <div className="flex gap-1 h-24 min-w-[640px] items-center">
                        {/* Custom visual contribution cells */}
                        {Array.from({ length: 53 }).map((_, wIdx) => (
                          <div key={wIdx} className="flex flex-col gap-1">
                            {Array.from({ length: 7 }).map((_, dIdx) => {
                              const cellIdx = wIdx * 7 + dIdx;
                              const cell = stats.github.heatmap[cellIdx] || { count: 0 };
                              return (
                                <div
                                  key={dIdx}
                                  title={`${cell.count} commits on ${cell.date}`}
                                  className={`w-2.5 h-2.5 rounded-sm border ${getContributionColor(cell.count)} transition-colors duration-300`}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-1.5 items-center mt-3 text-[9px] font-mono text-zinc-500 uppercase select-none">
                      <span>Less</span>
                      <div className="w-2.5 h-2.5 rounded-sm bg-zinc-900 border border-zinc-950" />
                      <div className="w-2.5 h-2.5 rounded-sm bg-[#0b2838] border border-cyan-950/10" />
                      <div className="w-2.5 h-2.5 rounded-sm bg-[#0f4b62] border border-cyan-800/20" />
                      <div className="w-2.5 h-2.5 rounded-sm bg-[#147a96] border border-cyan-600/20" />
                      <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400 border border-cyan-300/30" />
                      <span>More</span>
                    </div>
                  </div>

                  {/* Language breakdown & commit trends charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pie Chart: Language stats */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
                        Language Distribution
                      </h3>
                      <div className="h-60 flex items-center justify-between gap-4 select-none">
                        <div className="w-1/2 h-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={stats.github.languages}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={60}
                                paddingAngle={3}
                                dataKey="percent"
                              >
                                {stats.github.languages.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-2.5">
                          {stats.github.languages.map((lang, idx) => (
                            <div key={idx} className="flex flex-col gap-0.5">
                              <div className="flex justify-between text-[10px] font-mono uppercase">
                                <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                                  {lang.name}
                                </span>
                                <span className="text-zinc-500">{lang.percent}%</span>
                              </div>
                              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${lang.percent}%`, backgroundColor: lang.color }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Commit stats growth */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
                        Repository Stars Accumulation
                      </h3>
                      <div className="h-60 select-none">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={stats.github.growth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#141414" />
                            <XAxis dataKey="month" stroke="#444" tick={{ fontSize: 9, fontFamily: "monospace" }} />
                            <YAxis stroke="#444" tick={{ fontSize: 9, fontFamily: "monospace" }} />
                            <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b" }} labelStyle={{ color: "#a1a1aa", fontSize: 10, fontFamily: "monospace" }} itemStyle={{ color: "#00e5ff", fontSize: 11, fontFamily: "monospace" }} />
                            <Line type="monotone" dataKey="stars" stroke="#e11d2e" strokeWidth={2} dot={{ fill: "#e11d2e", r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Pinned / Recent Repositories */}
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
                      Sync Pinned Repositories
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stats.github.recentRepos.map((repo, idx) => (
                        <a
                          key={idx}
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={playClick}
                          className="group border border-zinc-900 hover:border-cyan-500/30 bg-zinc-950 hover:bg-zinc-900/40 p-4 rounded-xl space-y-3 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors font-mono uppercase">
                                {repo.name}
                              </span>
                              <span className="text-[8px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded uppercase">
                                {repo.language}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed mt-2">
                              {repo.desc}
                            </p>
                          </div>

                          <div className="flex gap-4 border-t border-zinc-900/60 pt-3 mt-3 font-mono text-[9px] text-zinc-500 uppercase">
                            <div>Stars: <span className="text-zinc-300 font-bold">{repo.stars}</span></div>
                            <div>Forks: <span className="text-zinc-300 font-bold">{repo.forks}</span></div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Competitive Coding */}
              {activeTab === "coding" && (
                <div className="space-y-6">
                  {/* Rating stats row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 relative">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">LeetCode Contest Max</span>
                      <div className="text-3xl font-bold font-mono text-white mt-1">{stats.leetcode.contestRating}</div>
                      <div className="text-[8px] font-mono text-cyan-400 mt-1 uppercase tracking-wider">Rank: {stats.leetcode.contestRank}</div>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 relative">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Codeforces Rating</span>
                      <div className="text-3xl font-bold font-mono text-white mt-1">{stats.codeforces.rating}</div>
                      <div className="text-[8px] font-mono text-cyan-400 mt-1 uppercase tracking-wider">Rank: {stats.codeforces.rank}</div>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 relative">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">CodeChef Tier</span>
                      <div className="text-3xl font-bold font-mono text-white mt-1">{stats.codechef.stars}</div>
                      <div className="text-[8px] font-mono text-cyan-400 mt-1 uppercase tracking-wider">Rating: {stats.codechef.rating}</div>
                    </div>
                  </div>

                  {/* Circular progress & DSA topic solve grids */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LeetCode problems solved counts */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
                        LeetCode Problem Solved Ratios
                      </h3>
                      
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6 select-none">
                        {/* Easy/Medium/Hard columns */}
                        <div className="space-y-4 w-full md:w-1/2">
                          {[
                            { name: "Easy Problems", count: stats.leetcode.solved.easy, total: 400, color: "bg-cyan-400" },
                            { name: "Medium Problems", count: stats.leetcode.solved.medium, total: 600, color: "bg-amber-500" },
                            { name: "Hard Problems", count: stats.leetcode.solved.hard, total: 300, color: "bg-red-500" }
                          ].map((level, idx) => {
                            const pct = Math.round((level.count / level.total) * 100);
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono uppercase">
                                  <span className="text-zinc-300 font-bold">{level.name}</span>
                                  <span className="text-zinc-500">{level.count} / {level.total} ({pct}%)</span>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${level.color}`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col items-center">
                          <div className="relative w-28 h-28 flex items-center justify-center border border-zinc-800/60 rounded-full bg-black/40">
                            <div className="text-center">
                              <span className="text-3xl font-extrabold text-white font-mono">{stats.leetcode.solved.total}</span>
                              <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Total Solved</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Codeforces rating history chart */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
                        Codeforces Contest Timeline
                      </h3>
                      <div className="h-60 select-none">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={stats.codeforces.history} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#141414" />
                            <XAxis dataKey="contest" stroke="#444" tick={false} />
                            <YAxis stroke="#444" tick={{ fontSize: 9, fontFamily: "monospace" }} />
                            <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b" }} labelStyle={{ color: "#a1a1aa", fontSize: 10, fontFamily: "monospace" }} itemStyle={{ color: "#00e5ff", fontSize: 11, fontFamily: "monospace" }} />
                            <Line type="monotone" dataKey="rating" stroke="#e11d2e" strokeWidth={2} dot={{ fill: "#e11d2e", r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* GeeksforGeeks & CodeChef secondary badges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-4">
                        GeeksforGeeks Metrics
                      </h3>
                      <div className="grid grid-cols-2 gap-4 font-mono text-center">
                        <div className="border border-zinc-900 bg-black/40 p-4 rounded-xl">
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">GFG Score</span>
                          <span className="text-2xl font-bold text-white block mt-1">{stats.geeksforgeeks.codingScore}</span>
                        </div>
                        <div className="border border-zinc-900 bg-black/40 p-4 rounded-xl">
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Institute Rank</span>
                          <span className="text-2xl font-bold text-white block mt-1">#{stats.geeksforgeeks.institutionRank}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-4">
                        Codeforces Tags Solved Breakdown
                      </h3>
                      <div className="flex flex-wrap gap-2 select-none">
                        {stats.codeforces.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-850 text-[10px] font-mono text-zinc-400 uppercase"
                          >
                            {tag.name}: <span className="text-white font-bold">{tag.count}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: AI Insights */}
              {activeTab === "ai" && (
                <div className="space-y-6">
                  {/* AI report card items */}
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 relative">
                    <div className="absolute top-[-8px] right-4 bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest shadow-lg shadow-red-950/20">
                      AI Generated
                    </div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
                      Developer Growth Insights
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="border border-zinc-900 bg-black/30 p-4.5 rounded-xl space-y-1">
                          <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest">Weakest DSA Node</span>
                          <p className="text-xs text-zinc-300 font-sans leading-relaxed">{stats.weakestDSA}</p>
                        </div>
                        <div className="border border-zinc-900 bg-black/30 p-4.5 rounded-xl space-y-1">
                          <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest">Consistency Peak</span>
                          <p className="text-xs text-zinc-300 font-sans leading-relaxed">{stats.mostConsistentPeriod}</p>
                        </div>
                        <div className="border border-zinc-900 bg-black/30 p-4.5 rounded-xl space-y-1">
                          <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest">Target Strengths</span>
                          <p className="text-xs text-zinc-300 font-sans leading-relaxed">{stats.bestPerformingTopics}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="border border-zinc-900 bg-black/30 p-4.5 rounded-xl space-y-1">
                          <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest">GitHub Productivity</span>
                          <p className="text-xs text-zinc-300 font-sans leading-relaxed">Score: <span className="font-bold text-white">{stats.githubProductivity}</span></p>
                        </div>
                        <div className="border border-zinc-900 bg-black/30 p-4.5 rounded-xl space-y-1">
                          <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest">Interview Readiness</span>
                          <p className="text-xs text-zinc-300 font-sans leading-relaxed">Match Index: <span className="font-bold text-white">{stats.interviewReadiness}</span></p>
                        </div>
                        <div className="border border-zinc-900 bg-black/30 p-4.5 rounded-xl space-y-1">
                          <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest">Open Source Impact</span>
                          <p className="text-xs text-zinc-300 font-sans leading-relaxed">{stats.openSourceImpact}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly report log */}
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 relative">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-4">
                      Weekly Developer Summary Report
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans border-l-2 border-cyan-500 pl-4 py-1 italic">
                      {stats.weeklyReport}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

