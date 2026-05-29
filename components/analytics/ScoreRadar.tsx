"use client";

import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface ScoreRadarProps {
  scores: Record<string, number | null | undefined>;
  title?: string;
}

export default function ScoreRadar({ scores, title = "Mastery Index" }: ScoreRadarProps) {
  const scoreData = [
    { subject: "DSA", value: scores.dsaScore ?? 0 },
    { subject: "Open Source", value: scores.openSourceScore ?? 0 },
    { subject: "Consistency", value: scores.consistencyScore ?? 0 },
    { subject: "Productivity", value: scores.productivityScore ?? 0 },
    { subject: "AI Dev", value: scores.aiEngineeringScore ?? 0 },
    { subject: "Backend", value: scores.backendScore ?? 0 },
  ].filter((s) => s.value > 0);

  if (scoreData.length === 0) {
    return (
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">{title}</h3>
        <p className="text-xs font-mono text-zinc-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5">
        {title}
      </h3>
      <div className="h-60 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={scoreData}>
            <PolarGrid stroke="#1f1f1f" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#666", fontSize: 9, fontFamily: "monospace" }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#444" }} />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#00e5ff"
              fill="#00e5ff"
              fillOpacity={0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
