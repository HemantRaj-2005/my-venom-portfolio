"use client";

import React from "react";
import { useAnalytics } from "../layout";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip
} from "recharts";
import { Code2, Award, Trophy, Activity, CheckCircle2 } from "lucide-react";

export default function LeetCodeAnalytics() {
  const { stats, profile } = useAnalytics();

  if (!profile?.leetcode || !stats?.leetcode) {
    return <AnalyticsEmptyState platformName="LeetCode" />;
  }

  const lc = stats.leetcode as {
    solved: { total: number; easy: number; medium: number; hard: number };
    acceptance: string;
    streak: number;
    ranking: number;
    contestRating: number;
    contestRank: string;
    contestHistory: { name: string; rating: number; rank: number }[];
    topicSolve: { name: string; solved: number; total: number }[];
  };

  if (!lc.solved?.total) {
    return <AnalyticsEmptyState platformName="LeetCode" />;
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Platform Header */}
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5" /> Competitive Programming Nodes
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5 tracking-tight">LeetCode Solving Mastery</h2>
        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-1.5">
          Tracking problem difficulty distributions, contest history logs, and DSA topic masteries.
        </p>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {[
          { label: "Problems Solved", val: lc.solved.total, sub: `Acceptance: ${lc.acceptance}`, color: "text-cyan-400" },
          { label: "Global Ranking", val: lc.ranking ? `#${lc.ranking.toLocaleString()}` : "N/A", sub: "Official LeetCode rank", color: "text-amber-400" },
          { label: "Contest Rating", val: lc.contestRating, sub: lc.contestRank, color: "text-red-400" },
          { label: "Active Streak", val: `${lc.streak} Days`, sub: "Daily submission log", color: "text-emerald-400" }
        ].map((card, idx) => (
          <div key={idx} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 select-none">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">{card.label}</span>
            <div className={`text-2xl font-bold ${card.color} mt-2`}>{card.val}</div>
            <span className="text-[8px] text-zinc-650 uppercase tracking-wider mt-1.5 block">{card.sub}</span>
          </div>
        ))}
      </div>

      {/* Solving Difficulty Splits & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Difficulty Bars */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5">
            Difficulty Distribution
          </h3>
          <div className="space-y-4 font-mono text-xs">
            {[
              { name: "Easy Solved", count: lc.solved.easy, total: lc.solved.total, color: "bg-cyan-400", text: "text-cyan-400" },
              { name: "Medium Solved", count: lc.solved.medium, total: lc.solved.total, color: "bg-amber-500", text: "text-amber-500" },
              { name: "Hard Solved", count: lc.solved.hard, total: lc.solved.total, color: "bg-red-500", text: "text-red-500" }
            ].map((level, idx) => {
              const pct = level.total > 0 ? Math.round((level.count / level.total) * 100) : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-[9px] uppercase font-bold">
                    <span className={level.text}>{level.name}</span>
                    <span className="text-zinc-500">{level.count} ({pct}% of total)</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${level.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-zinc-900/60 pt-4 mt-6 text-center select-none">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Targeting Hard topics this week</span>
          </div>
        </div>

        {/* Topic Mastery Radar */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5">
            DSA Topic Mastery
          </h3>
          <div className="h-60 flex items-center justify-center select-none">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={lc.topicSolve}>
                <PolarGrid stroke="#1f1f1f" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "#666", fontSize: 9, fontFamily: "monospace" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#444" }} />
                <Radar name="Solved" dataKey="solved" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contest Ratings History */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5">
            Contest Rating Progression
          </h3>
          <div className="h-60 select-none">
            {lc.contestHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lc.contestHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#141414" />
                  <XAxis dataKey="name" stroke="#444" tick={false} />
                  <YAxis stroke="#444" tick={{ fontSize: 9, fontFamily: "monospace" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b" }} />
                  <Line type="monotone" dataKey="rating" stroke="#00e5ff" strokeWidth={2} dot={{ fill: "#00e5ff", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center font-mono text-[9px] text-zinc-650 uppercase tracking-widest">
                No active contest rankings logs
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
