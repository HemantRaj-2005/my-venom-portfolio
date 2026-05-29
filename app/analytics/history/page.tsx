"use client";

import React, { useEffect, useState } from "react";
import { History, TrendingUp, TrendingDown, Award } from "lucide-react";
import type { PeriodReport } from "@/lib/analytics/reports";

export default function HistoryPage() {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "quarterly" | "yearly">("monthly");
  const [snapshots, setSnapshots] = useState<{ id: string; date: string; overallScore: number }[]>([]);
  const [report, setReport] = useState<PeriodReport | null>(null);

  useEffect(() => {
    fetch(`/api/analytics/history?period=${period}`)
      .then((r) => r.json())
      .then((d) => {
        setSnapshots(d.snapshots || []);
        setReport(d.report);
      })
      .catch(console.error);
  }, [period]);

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Historical Tracking
          </span>
          <h2 className="text-3xl font-black text-white mt-1.5">Analytics History</h2>
        </div>
        <div className="flex gap-2">
          {(["weekly", "monthly", "quarterly", "yearly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-[9px] font-mono uppercase px-3 py-1.5 rounded border transition-colors ${
                period === p ? "border-cyan-500/40 text-cyan-400 bg-cyan-950/20" : "border-zinc-800 text-zinc-500"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {snapshots.length === 0 ? (
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-12 text-center">
          <p className="text-xs font-mono text-zinc-500 uppercase">No historical snapshots yet. Sync from admin to begin tracking.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {snapshots.slice(-8).reverse().map((s) => (
              <div key={s.id} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4">
                <span className="text-[8px] font-mono text-zinc-600 uppercase">{new Date(s.date).toLocaleDateString()}</span>
                <div className="text-2xl font-black text-cyan-400 mt-1">{Math.round(s.overallScore)}%</div>
                <span className="text-[8px] font-mono text-zinc-500">Overall Score</span>
              </div>
            ))}
          </div>

          {report && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-950/40 border border-emerald-900/30 rounded-2xl p-6">
                <h3 className="text-xs font-mono uppercase text-emerald-400 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Growth
                </h3>
                {report.growth.length === 0 ? (
                  <p className="text-xs text-zinc-500">No growth detected in this period</p>
                ) : (
                  <ul className="space-y-2">
                    {report.growth.map((g, i) => (
                      <li key={i} className="text-sm text-zinc-300">
                        {g.metric}: +{g.delta} ({g.percent}%)
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-zinc-950/40 border border-red-900/30 rounded-2xl p-6">
                <h3 className="text-xs font-mono uppercase text-red-400 mb-4 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" /> Declines
                </h3>
                {report.declines.length === 0 ? (
                  <p className="text-xs text-zinc-500">No declines in this period</p>
                ) : (
                  <ul className="space-y-2">
                    {report.declines.map((d, i) => (
                      <li key={i} className="text-sm text-zinc-300">{d.metric}: {d.delta}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-zinc-950/40 border border-amber-900/30 rounded-2xl p-6">
                <h3 className="text-xs font-mono uppercase text-amber-400 mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Achievements
                </h3>
                {report.achievements.length === 0 ? (
                  <p className="text-xs text-zinc-500">No achievements in this period</p>
                ) : (
                  <ul className="space-y-2">
                    {report.achievements.map((a, i) => (
                      <li key={i} className="text-sm text-zinc-300">
                        <span className="text-cyan-400">{a.platform}:</span> {a.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
