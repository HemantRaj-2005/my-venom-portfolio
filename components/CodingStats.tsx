"use client";

import React, { useState, useEffect } from "react";
import { Code, Award, Shield, RefreshCw, Clock, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import ResumeViewer from "./ResumeViewer";

export default function CodingStats() {
  const [stats, setStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isSynced, setIsSynced] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeViewerOpen, setResumeViewerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/analytics");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setProfile(data.profile);
          setIsSynced(data.isSynced === true);
          setLastSynced(data.lastSynced || null);
          setResumeUrl(data.profile?.resumeUrl || null);
        }
      } catch (e) {
        console.error("Failed to load developer statistics:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Format the sync time nicely
  const formatSyncTime = (raw: string | null) => {
    if (!raw) return "Never";
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return raw; // already formatted string
      return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return raw;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full select-none">
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 h-64 flex items-center justify-center animate-pulse">
          <span className="text-zinc-650 font-mono text-xs uppercase tracking-widest">LOADING GITHUB TELEMETRY...</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 h-64 flex items-center justify-center animate-pulse">
          <span className="text-zinc-650 font-mono text-xs uppercase tracking-widest">LOADING LEETCODE TELEMETRY...</span>
        </div>
      </div>
    );
  }

  // Get color for contribution box (electric cyan shades)
  const getContributionColor = (count: number) => {
    if (count === 0) return "bg-zinc-900";
    if (count <= 2) return "bg-[#0b2838] border border-cyan-950/20";
    if (count <= 4) return "bg-[#0f4b62] border border-cyan-800/30";
    if (count <= 6) return "bg-[#147a96] border border-cyan-600/40";
    return "bg-[#00E5FF] shadow-[0_0_6px_rgba(0,229,255,0.6)]";
  };

  const hasGithub = stats?.github && profile?.github;
  const hasLeetcode = stats?.leetcode && profile?.leetcode;

  if (!stats && !profile) {
    return (
      <div className="col-span-2 bg-zinc-950 border border-red-500/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[250px] shadow-lg shadow-red-950/5">
        <Shield className="w-12 h-12 text-red-500 mb-4 animate-pulse" />
        <h3 className="text-base font-bold text-white font-heading">Stark Diagnostics Telemetry: Offline</h3>
        <p className="text-xs text-zinc-500 mt-2 max-w-md leading-relaxed font-sans">
          No developer telemetry data is currently synchronized with MongoDB. Sync your GitHub and LeetCode handles in the Admin Integrations dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">

      {/* Sync Status Banner */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl px-4 py-3 border ${
        isSynced
          ? "bg-emerald-950/10 border-emerald-900/30"
          : "bg-amber-950/10 border-amber-900/30"
      }`}>
        <div className="flex items-center gap-3">
          {isSynced ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          )}
          <div>
            <p className={`text-[11px] font-mono uppercase tracking-widest font-bold ${isSynced ? "text-emerald-400" : "text-amber-400"}`}>
              {isSynced ? "Telemetry Synchronized" : "Telemetry Offline"}
            </p>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">
              {isSynced
                ? "Live data from connected coding profiles"
                : "Profiles not synced. Configure handles and trigger sync via Admin Panel."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Clock className="w-3 h-3 text-zinc-500" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
            Last sync: {formatSyncTime(lastSynced)}
          </span>
        </div>
      </div>

      {/* Resume Viewer Button */}
      {resumeUrl && (
        <div className="flex justify-end">
          <button
            onClick={() => setResumeViewerOpen(true)}
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] border border-cyan-800/30 bg-cyan-950/10 hover:bg-cyan-950/30 hover:border-cyan-600/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            View Resume
          </button>
        </div>
      )}

      <ResumeViewer
        url={resumeUrl}
        isOpen={resumeViewerOpen}
        onClose={() => setResumeViewerOpen(false)}
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">

        {/* Card 1: GitHub Stats */}
        {!hasGithub ? (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 h-64 flex flex-col items-center justify-center text-center shadow-lg">
            <Shield className="w-8 h-8 text-zinc-700 mb-3" />
            <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">GitHub Telemetry</span>
            <span className="text-zinc-500 font-bold mt-4 font-mono text-xs">No data present</span>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#00E5FF]"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">GitHub Profile</span>
                </div>
                <a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-zinc-500 hover:text-[#00E5FF] border border-zinc-900 hover:border-[#00E5FF]/20 bg-black/60 px-2 py-0.5 rounded transition-all"
                >
                  @{profile.github}
                </a>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center py-2 border-b border-zinc-900 mb-6">
                <div>
                  <div className="text-xl font-extrabold text-white font-mono">{stats.github.metrics.totalCommits || 0}</div>
                  <div className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5">Contributions</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white font-mono">{stats.github.profile.publicRepos || 0}</div>
                  <div className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5">Repositories</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white font-mono">{stats.github.metrics.totalPRs || 0}</div>
                  <div className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5">Pull Requests</div>
                </div>
              </div>
            </div>

            {/* Contribution Graph Simulation (Render last 35 cells) */}
            <div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-3">
                Activity Matrix
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {stats.github.heatmap && stats.github.heatmap.slice(-35).map((cell: any, idx: number) => (
                  <span
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-sm transition-all ${getContributionColor(cell.count)}`}
                    title={`${cell.count} commits on ${cell.date}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Card 2: LeetCode Stats */}
        {!hasLeetcode ? (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 h-64 flex flex-col items-center justify-center text-center shadow-lg">
            <Code className="w-8 h-8 text-zinc-700 mb-3" />
            <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">LeetCode Metrics</span>
            <span className="text-zinc-500 font-bold mt-4 font-mono text-xs">No data present</span>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  <Code className="w-5 h-5 text-[#00E5FF]" />
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">LeetCode Metrics</span>
                </div>
                <a
                  href={`https://leetcode.com/u/${profile.leetcode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-zinc-500 hover:text-[#00E5FF] border border-zinc-900 hover:border-[#00E5FF]/20 bg-black/60 px-2 py-0.5 rounded transition-all"
                >
                  @{profile.leetcode}
                </a>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-zinc-900 mb-4 select-none">
                <div className="flex items-center gap-2">
                  <Award className="w-8 h-8 text-amber-500 animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-white tracking-wide">
                      {stats.leetcode.contestRating > 1900 ? "Knight Badge" : "Specialist"}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                      Contest Rating: {stats.leetcode.contestRating} ({stats.leetcode.contestRank})
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-black text-white font-mono">{stats.leetcode.solved.total}</div>
                  <div className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5 text-right">Solved</div>
                </div>
              </div>
            </div>

            {/* Solve splits Progress bars */}
            <div className="space-y-3 font-mono text-[9px] uppercase text-zinc-500 tracking-wider">
              {[
                { label: "Easy", count: stats.leetcode.solved.easy, color: "text-cyan-400", bar: "bg-cyan-400" },
                { label: "Medium", count: stats.leetcode.solved.medium, color: "text-amber-400", bar: "bg-amber-400" },
                { label: "Hard", count: stats.leetcode.solved.hard, color: "text-red-500", bar: "bg-red-500" },
              ].map(({ label, count, color, bar }) => {
                const total = stats.leetcode.solved.total;
                const pct = total > 0 ? Math.min(100, Math.round((count / total) * 100)) : 0;
                return (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between">
                      <span className={color}>{label} ({count})</span>
                      <span className="text-white font-bold">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 border border-zinc-850 rounded-full overflow-hidden">
                      <div className={`h-full ${bar} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
