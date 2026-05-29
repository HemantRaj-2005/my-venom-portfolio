"use client";

import React, { useEffect, useState } from "react";
import { useAnalytics } from "../layout";
import ScoreRadar from "@/components/analytics/ScoreRadar";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { Trophy } from "lucide-react";

export default function ComparisonPage() {
  const { stats } = useAnalytics();
  const [comparison, setComparison] = useState<{ platforms: { name: string; solved: number; rating: number; activity: number }[] } | null>(null);

  useEffect(() => {
    fetch("/api/analytics/comparison")
      .then((r) => r.json())
      .then((d) => setComparison(d.comparison))
      .catch(console.error);
  }, []);

  if (!comparison?.platforms?.length) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-black text-white">Platform Comparison</h2>
        <p className="text-xs font-mono text-zinc-500 uppercase">No data available. Connect platforms and sync.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5" /> Cross-Platform Analysis
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5">Platform Battle Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase text-zinc-400 mb-5">Questions Solved per Platform</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparison.platforms}>
                <CartesianGrid strokeDasharray="3 3" stroke="#141414" />
                <XAxis dataKey="name" stroke="#444" tick={{ fontSize: 8 }} />
                <YAxis stroke="#444" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b" }} />
                <Bar dataKey="solved" fill="#00e5ff" name="Solved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase text-zinc-400 mb-5">Rating Comparison</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparison.platforms.filter((p) => p.rating > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#141414" />
                <XAxis dataKey="name" stroke="#444" tick={{ fontSize: 8 }} />
                <YAxis stroke="#444" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b" }} />
                <Bar dataKey="rating" fill="#e11d2e" name="Rating" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {stats?.scores && (
        <ScoreRadar scores={stats.scores as Record<string, number | null>} title="Cross-Platform Strength Radar" />
      )}
    </div>
  );
}
