"use client";

import React, { useEffect, useState } from "react";
import { useAnalytics } from "../layout";
import { Cpu, TrendingUp, TrendingDown, Award } from "lucide-react";

export default function AIInsightsPage() {
  const { stats } = useAnalytics();
  const [insights, setInsights] = useState<{
    aiInsights: Record<string, unknown> | null;
    generatedAt: string | null;
    message?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/analytics/ai-insights")
      .then((r) => r.json())
      .then(setInsights)
      .catch(console.error);
  }, []);

  const ai = insights?.aiInsights || stats?.aiInsights;

  if (!ai) {
    return (
      <div className="space-y-8">
        <div className="border-b border-zinc-900 pb-5">
          <h2 className="text-3xl font-black text-white">AI Engineering Insights</h2>
        </div>
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-12 text-center">
          <Cpu className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-xs font-mono text-zinc-500 uppercase">
            {insights?.message || "Analytics are being generated. Connect platforms and sync from admin."}
          </p>
        </div>
      </div>
    );
  }

  const sections = [
    { title: "Developer Level", content: ai.developerLevel, icon: Cpu },
    { title: "DSA Analysis", content: ai.dsaAnalysis, icon: TrendingUp },
    { title: "Contest Forecast", content: ai.contestForecast, icon: Award },
    { title: "GitHub Analysis", content: ai.gitAnalysis, icon: TrendingUp },
    { title: "Career Readiness", content: ai.careerReadiness, icon: Award },
    { title: "Predictions", content: ai.predictions, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5" /> AI Intelligence Engine
        </span>
        <h2 className="text-3xl font-black text-white mt-1.5">AI Engineering Insights</h2>
        {insights?.generatedAt && (
          <p className="text-[9px] font-mono text-zinc-600 mt-1">
            Generated: {new Date(insights.generatedAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-950/40 border border-emerald-900/30 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase text-emerald-400 mb-4">Strength Areas</h3>
          <ul className="space-y-2">
            {(ai.strengths as string[])?.map((s, i) => (
              <li key={i} className="text-sm text-zinc-300 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-zinc-950/40 border border-red-900/30 rounded-2xl p-6">
          <h3 className="text-xs font-mono uppercase text-red-400 mb-4">Weak Areas</h3>
          <ul className="space-y-2">
            {(ai.weaknesses as string[])?.map((w, i) => (
              <li key={i} className="text-sm text-zinc-300 flex items-center gap-2">
                <TrendingDown className="w-3 h-3 text-red-400" /> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(({ title, content, icon: Icon }) => (
          <div key={title} className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
            <h3 className="text-xs font-mono uppercase text-zinc-400 mb-3 flex items-center gap-2">
              <Icon className="w-4 h-4 text-cyan-400" /> {title}
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{String(content)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
