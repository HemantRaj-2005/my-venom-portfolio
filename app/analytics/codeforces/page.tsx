"use client";

import React from "react";
import { useAnalytics } from "../layout";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, Cell
} from "recharts";
import { Award, Trophy, Activity } from "lucide-react";

export default function CodeforcesAnalytics() {
  const { stats, profile } = useAnalytics();

  if (!profile?.codeforces || !stats?.codeforces?.rating) {
    return <AnalyticsEmptyState platformName="Codeforces" />;
  }

  const cf = stats.codeforces;

  return (
    <div className="space-y-8 font-sans">
      {/* Platform Header */}
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5" /> Competitive Programming Nodes
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5 tracking-tight">Codeforces Performance Telemetry</h2>
        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-1.5">
          Monitoring ratings timelines, solving tag distributions, and global rankings.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {[
          { label: "Current Rating", val: cf.rating, sub: `Rank: ${cf.rank}`, color: "text-cyan-400" },
          { label: "Maximum Rating", val: cf.maxRating, sub: `Peak: ${cf.maxRank}`, color: "text-amber-400" },
          { label: "Problems Solved", val: cf.solved, sub: "Synced status logs", color: "text-red-400" },
          { label: "Contest Count", val: cf.history?.length || 0, sub: "Participations", color: "text-emerald-400" }
        ].map((card, idx) => (
          <div key={idx} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 select-none">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">{card.label}</span>
            <div className={`text-2xl font-bold ${card.color} mt-2`}>{card.val}</div>
            <span className="text-[8px] text-zinc-650 uppercase tracking-wider mt-1.5 block">{card.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Chart */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5">
            Rating Timeline Growth
          </h3>
          <div className="h-60 select-none">
            {cf.history && cf.history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cf.history} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#141414" />
                  <XAxis dataKey="contest" stroke="#444" tick={false} />
                  <YAxis stroke="#444" tick={{ fontSize: 9, fontFamily: "monospace" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b" }} />
                  <Line type="monotone" dataKey="rating" stroke="#00e5ff" strokeWidth={2} dot={{ fill: "#00e5ff", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center font-mono text-[9px] text-zinc-650 uppercase tracking-widest">
                No active contest rating history records.
              </div>
            )}
          </div>
        </div>

        {/* Tags breakdown bar chart */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5">
            Tags Distribution Analysis
          </h3>
          <div className="h-60 select-none">
            {cf.tags && cf.tags.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cf.tags} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#141414" />
                  <XAxis type="number" stroke="#444" tick={{ fontSize: 9 }} />
                  <YAxis dataKey="name" type="category" stroke="#444" tick={{ fontSize: 9, fontFamily: "monospace" }} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b" }} />
                  <Bar dataKey="count" fill="#00e5ff" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center font-mono text-[9px] text-zinc-650 uppercase tracking-widest">
                No tags solved breakdown logged
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
