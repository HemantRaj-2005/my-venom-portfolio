"use client";

import React, { createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3, Cpu, Award, Trophy, Activity, ArrowLeft, Shield,
  GitBranch, Code2, Sparkles, BookOpen, History,
  Terminal, Zap, HelpCircle, GraduationCap,
  Layers, Menu, X
} from "lucide-react";
import AnalyticsLoading from "./loading";
import type { AnalyticsResponse } from "@/types/analytics";

interface AnalyticsContextType {
  stats: AnalyticsResponse["stats"];
  profile: AnalyticsResponse["profile"] | null;
  loading: boolean;
  platformStatus: AnalyticsResponse["platformStatus"];
  playClick: () => void;
  refetch: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}

async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch("/api/analytics");
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
  });

  const playClick = () => {
    if ((window as Window & { playClickSound?: () => void }).playClickSound) {
      (window as Window & { playClickSound?: () => void }).playClickSound!();
    }
  };

  const stats = data?.stats ?? null;
  const profile = data?.profile ?? null;
  const platformStatus = data?.platformStatus ?? [];

  if (isLoading) {
    return <AnalyticsLoading />;
  }

  const navItems = [
    { id: "overview", name: "Dossier Overview", path: "/analytics/overview", icon: BarChart3, category: "Core Metrics" },
    { id: "ai-insights", name: "AI Tech Report", path: "/analytics/ai-insights", icon: Cpu, category: "Core Metrics" },
    { id: "comparison", name: "Platform Battle", path: "/analytics/comparison", icon: Trophy, category: "Core Metrics" },
    { id: "history", name: "Historical Logs", path: "/analytics/history", icon: History, category: "Core Metrics" },
    { id: "github", name: "GitHub Telemetry", path: "/analytics/github", icon: GitBranch, handle: profile?.github, category: "Platform Analytics" },
    { id: "leetcode", name: "LeetCode Mastery", path: "/analytics/leetcode", icon: Code2, handle: profile?.leetcode, category: "Platform Analytics" },
    { id: "codeforces", name: "Codeforces Rank", path: "/analytics/codeforces", icon: Award, handle: profile?.codeforces, category: "Platform Analytics" },
    { id: "codechef", name: "CodeChef Stars", path: "/analytics/codechef", icon: Zap, handle: profile?.codechef, category: "Platform Analytics" },
    { id: "geeksforgeeks", name: "GFG Ledger", path: "/analytics/geeksforgeeks", icon: GraduationCap, handle: profile?.geeksforgeeks, category: "Platform Analytics" },
    { id: "hackerrank", name: "HackerRank Skills", path: "/analytics/hackerrank", icon: Layers, handle: profile?.hackerrank, category: "Platform Analytics" },
    { id: "hackerearth", name: "HackerEarth Node", path: "/analytics/hackerearth", icon: Terminal, handle: profile?.hackerearth, category: "Platform Analytics" },
    { id: "atcoder", name: "AtCoder Metrics", path: "/analytics/atcoder", icon: Shield, handle: profile?.atcoder, category: "Platform Analytics" },
    { id: "stackoverflow", name: "StackOverflow Rep", path: "/analytics/stackoverflow", icon: HelpCircle, handle: profile?.stackoverflow, category: "Communities" },
    { id: "devto", name: "Dev.to Articles", path: "/analytics/devto", icon: BookOpen, handle: profile?.devto, category: "Communities" },
    { id: "kaggle", name: "Kaggle Telemetry", path: "/analytics/kaggle", icon: Sparkles, handle: profile?.kaggle, category: "Communities" },
  ];

  const categories = ["Core Metrics", "Platform Analytics", "Communities"];

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#020202] text-zinc-100 py-24 px-6 md:px-12 flex flex-col items-center justify-center relative overflow-hidden font-sans select-none">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 rounded-2xl p-8 text-center flex flex-col items-center justify-center shadow-2xl relative z-10">
          <Shield className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
          <h2 className="text-xl font-bold text-white font-heading">DIAGNOSTICS OFFLINE</h2>
          <p className="text-xs text-zinc-500 mt-3 leading-relaxed font-mono uppercase">
            Connect your account to view analytics
          </p>
          <div className="flex gap-4 mt-8 w-full">
            <Link href="/admin/dashboard" className="flex-1 text-center py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-mono uppercase tracking-wider rounded-lg transition-all font-semibold">
              Admin Portal
            </Link>
            <Link href="/" className="flex-1 text-center py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono uppercase tracking-wider rounded-lg transition-all">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const overallScore = stats.scores?.overallScore ?? 0;

  return (
    <AnalyticsContext.Provider value={{ stats, profile, loading: isLoading, platformStatus, playClick, refetch }}>
      <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col md:flex-row relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0e_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

        <div className="md:hidden h-14 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-4 flex items-center justify-between z-40 relative">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold font-mono tracking-widest text-white">Diagnostics Suit</span>
          </div>
          <button onClick={() => { playClick(); setMobileMenuOpen(!mobileMenuOpen); }} className="text-zinc-400 hover:text-white cursor-pointer">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <aside className={`w-full md:w-64 bg-zinc-950/90 md:bg-zinc-950/50 backdrop-blur-md border-r border-zinc-900 flex flex-col shrink-0 z-30 transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 absolute inset-y-0 left-0 pt-14 md:pt-0" : "-translate-x-full md:translate-x-0 hidden md:flex"
        }`}>
          <div className="p-4 border-b border-zinc-900/60 hidden md:flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div>
                <h1 className="text-xs font-bold text-white tracking-widest font-mono uppercase">DIAGNOSTICS V2</h1>
                <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">Stark Intelligence Core</p>
              </div>
            </div>
            <Link href="/" onClick={playClick} className="p-1.5 rounded hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar select-none">
            {categories.map((cat) => (
              <div key={cat} className="space-y-1">
                <h3 className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest px-2.5 py-1">{cat}</h3>
                {navItems.filter((item) => item.category === cat).map((item) => {
                  const Icon = item.icon;
                  const isSel = pathname === item.path;
                  const isConnected = item.handle !== undefined && item.handle !== null;
                  const status = platformStatus.find((s) => s.platform === item.id);
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      onClick={() => { playClick(); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                        isSel ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-inner" : "text-zinc-400 hover:text-white border border-transparent hover:bg-zinc-900/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSel ? "text-cyan-400" : "text-zinc-500"}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.handle !== undefined && (
                        <div
                          title={status?.error || (isConnected ? `Connected: ${item.handle}` : "Not Connected")}
                          className={`w-1.5 h-1.5 rounded-full ${
                            status?.error ? "bg-red-500" : isConnected ? "bg-emerald-500 shadow-sm shadow-emerald-400" : "bg-zinc-800"
                          }`}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-zinc-900/60 font-mono text-[9px] uppercase tracking-wider text-zinc-500 bg-zinc-950/80">
            <div className="flex justify-between items-center mb-2.5">
              <span>Overall Match:</span>
              <span className="text-cyan-400 font-bold">{overallScore}%</span>
            </div>
            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${overallScore}%` }} />
            </div>
            <Link
              href="/admin/dashboard"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white rounded text-[8px] cursor-pointer transition-colors"
            >
              Sync via Admin Portal
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar select-text bg-[#030303]">
          <div className="max-w-6xl mx-auto w-full relative z-10">{children}</div>
        </main>
      </div>
    </AnalyticsContext.Provider>
  );
}
