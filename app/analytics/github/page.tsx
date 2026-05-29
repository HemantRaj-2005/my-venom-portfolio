"use client";

import React from "react";
import { useAnalytics } from "../layout";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { GitBranch, Star, GitFork, Users, BookOpen, Clock, Activity } from "lucide-react";

export default function GitHubAnalytics() {
  const { stats, profile } = useAnalytics();

  if (!profile?.github || !stats?.github?.profile?.name) {
    return <AnalyticsEmptyState platformName="GitHub" />;
  }

  const gh = stats.github;

  return (
    <div className="space-y-8 font-sans">
      {/* Platform Header */}
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5" /> Node Platform Telemetry
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5 tracking-tight">GitHub Engineering Metrics</h2>
        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-1.5">
          Monitoring profile nodes, repositories, star counts, and open source impact.
        </p>
      </div>

      {/* GitHub Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {[
          { label: "Followers", val: gh.profile.followers, icon: Users, color: "text-cyan-400" },
          { label: "Total Stars Rec", val: gh.metrics.totalStars, icon: Star, color: "text-amber-400" },
          { label: "Forks Generated", val: gh.metrics.totalForks, icon: GitFork, color: "text-purple-400" },
          { label: "Public Repositories", val: gh.profile.publicRepos, icon: BookOpen, color: "text-emerald-400" }
        ].map((card, idx) => (
          <div key={idx} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 select-none relative">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest">{card.label}</span>
            <div className={`text-2xl font-bold ${card.color} mt-2 flex items-center gap-2`}>
              <card.icon className="w-5 h-5 shrink-0" />
              <span>{card.val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Languages Donut */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5">
            Language Composition
          </h3>
          <div className="h-60 flex items-center justify-between gap-4 select-none">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gh.languages}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="percent"
                  >
                    {gh.languages.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2.5">
              {gh.languages.slice(0, 4).map((lang: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-0.5">
                  <div className="flex justify-between text-[9px] font-mono uppercase">
                    <span className="text-zinc-300 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
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

        {/* Stars Growth */}
        <div className="lg:col-span-2 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5">
            Stars & Repositories Growth
          </h3>
          <div className="h-60 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gh.growth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#141414" />
                <XAxis dataKey="month" stroke="#444" tick={{ fontSize: 9, fontFamily: "monospace" }} />
                <YAxis stroke="#444" tick={{ fontSize: 9, fontFamily: "monospace" }} />
                <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b" }} />
                <Line type="monotone" dataKey="stars" name="Stars" stroke="#00e5ff" strokeWidth={2} />
                <Line type="monotone" dataKey="repos" name="Repositories" stroke="#e11d2e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Open Source Impact Statistics */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
          Open Source Contributions Ledger
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
          <div className="border border-zinc-900 bg-zinc-950/80 p-4.5 rounded-xl text-center">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Pull Requests Merged</span>
            <div className="text-3xl font-bold text-white mt-2">{gh.metrics.totalPRs}</div>
          </div>
          <div className="border border-zinc-900 bg-zinc-950/80 p-4.5 rounded-xl text-center">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Active Commits</span>
            <div className="text-3xl font-bold text-white mt-2">{gh.metrics.totalCommits}</div>
          </div>
          <div className="border border-zinc-900 bg-zinc-950/80 p-4.5 rounded-xl text-center">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Issues resolved</span>
            <div className="text-3xl font-bold text-white mt-2">{gh.metrics.totalIssues}</div>
          </div>
        </div>
      </div>

      {/* Pinned Repos Showcase */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
          Starred Repository Nodes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gh.recentRepos.map((repo: any, idx: number) => (
            <a
              key={idx}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-zinc-900 hover:border-cyan-500/20 bg-zinc-950/60 hover:bg-zinc-900/20 p-4 rounded-xl space-y-3 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors uppercase">
                    {repo.name}
                  </span>
                  <span className="text-[8px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded uppercase">
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
  );
}
