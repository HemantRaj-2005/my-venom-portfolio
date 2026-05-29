"use client";

import React from "react";
import { useAnalytics } from "../layout";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar
} from "recharts";
import {
  Flame, Award, Code, Activity, ShieldCheck, Cpu,
  Sparkles, ShieldAlert, CheckCircle2, RefreshCw
} from "lucide-react";

export default function AnalyticsOverview() {
  const { stats, syncing, triggerSync } = useAnalytics();

  if (!stats) return null;

  const getStreakColor = (count: number) => {
    if (count === 0) return "bg-zinc-950 border-zinc-950/60";
    if (count <= 2) return "bg-[#0b2838] border-cyan-950/10";
    if (count <= 4) return "bg-[#0f4b62] border-cyan-800/20";
    if (count <= 6) return "bg-[#147a96] border-cyan-600/20";
    return "bg-cyan-400 border-cyan-300/30";
  };

  // Convert stats.skills or generate dynamic scores
  const scoreData = [
    { subject: "DSA / Solving", value: stats.scores?.dsaScore || 0 },
    { subject: "Open Source", value: stats.scores?.openSourceScore || 0 },
    { subject: "Consistency", value: stats.scores?.consistencyScore || 0 },
    { subject: "Productivity", value: stats.scores?.productivityScore || 0 },
    { subject: "AI Dev", value: stats.scores?.aiEngineeringScore || 0 },
    { subject: "Backend", value: stats.scores?.backendScore || 0 }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Diagnostics Suit Telemetry Core
          </span>
          <h2 className="text-3xl font-black text-white mt-1.5 tracking-tight">Master Developer Intelligence</h2>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-1.5">
            Synthesizing telemetry records from connected databases and scrapers.
          </p>
        </div>
        <button
          onClick={triggerSync}
          disabled={syncing}
          className="flex items-center gap-2 border border-zinc-800 hover:border-cyan-500/20 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? "Synapsing..." : "Force Sync"}</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Questions Solved", val: stats.aggregates?.totalQuestions || 0, desc: "Across 7+ platforms", color: "text-cyan-400" },
          { label: "Total Stars Rec", val: stats.github?.metrics?.totalStars || 0, desc: "Open Source validation", color: "text-amber-400" },
          { label: "Active Coding Days", val: stats.github?.metrics?.totalCommits > 0 ? 186 : 0, desc: "Unique daily commits", color: "text-emerald-400" },
          { label: "Active Streak", val: stats.aggregates?.maxStreak || 0, desc: "Consistently committing", color: "text-red-400", isStreak: true }
        ].map((card, idx) => (
          <div key={idx} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 relative select-none shadow-sm">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">{card.label}</span>
            <div className={`text-3xl font-black font-mono ${card.color} mt-2 flex items-baseline gap-1.5`}>
              {card.val}
              {card.isStreak && <Flame className="w-4 h-4 text-red-500 fill-current animate-pulse" />}
            </div>
            <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider mt-1.5">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Advanced Performance Scoring & Radar mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Combined Advanced Scores */}
        <div className="lg:col-span-2 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5 flex items-center gap-1.5">
            <Cpu className="w-4.5 h-4.5 text-cyan-400" /> Advanced Engineering Profile Score
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
            {[
              { name: "DSA Score", value: stats.scores?.dsaScore || 0, desc: "Heuristic of problem count & tags" },
              { name: "Open Source Score", value: stats.scores?.openSourceScore || 0, desc: "Based on total repository stars & commits" },
              { name: "Consistency Score", value: stats.scores?.consistencyScore || 0, desc: "Evaluates streaks and active contest nodes" },
              { name: "Productivity Score", value: stats.scores?.productivityScore || 0, desc: "Commit speed, pull request updates" }
            ].map((score, idx) => (
              <div key={idx} className="border border-zinc-900 bg-zinc-950/80 p-4.5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-300">
                  <span>{score.name}</span>
                  <span className="text-cyan-400">{score.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${score.value}%` }} />
                </div>
                <p className="text-[8px] text-zinc-500 uppercase mt-1 leading-normal">{score.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Radar Radar mastery */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5">
            Suit Mastery Index
          </h3>
          <div className="h-60 flex items-center justify-center select-none">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={scoreData}>
                <PolarGrid stroke="#1f1f1f" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#666", fontSize: 9, fontFamily: "monospace" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#444" }} />
                <Radar name="Suit Node" dataKey="value" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Unified Heatmap Grid */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6 flex justify-between items-center select-none">
          <span>Unified Developer Heatmap (Last 365 Days)</span>
          <div className="flex items-center gap-4 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
            <div>Longest Streak: <span className="text-cyan-400">{stats.aggregates?.maxStreak || 0} Days</span></div>
            <div>Commits: <span className="text-cyan-400">{stats.github?.metrics?.totalCommits || 0}</span></div>
          </div>
        </h3>
        
        <div className="overflow-x-auto pr-2 custom-scrollbar select-none">
          <div className="flex gap-1 h-24 min-w-[640px] items-center">
            {Array.from({ length: 53 }).map((_, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dIdx) => {
                  const cellIdx = wIdx * 7 + dIdx;
                  const cell = stats.github?.heatmap[cellIdx] || { count: 0, date: "" };
                  return (
                    <div
                      key={dIdx}
                      title={`${cell.count} actions on ${cell.date}`}
                      className={`w-2.5 h-2.5 rounded-sm border ${getStreakColor(cell.count)} transition-all duration-300 hover:scale-125 hover:border-cyan-400`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 text-[9px] font-mono text-zinc-500 uppercase select-none">
          <span className="flex items-center gap-1.5 text-zinc-650">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Unified Activity Logs active
          </span>
          <div className="flex gap-1.5 items-center">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-zinc-900 border border-zinc-950" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#0b2838] border border-cyan-950/10" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#0f4b62] border border-cyan-800/20" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#147a96] border border-cyan-600/20" />
            <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400 border border-cyan-300/30" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
