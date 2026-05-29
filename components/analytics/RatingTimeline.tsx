"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface RatingTimelineProps {
  data: { contest?: string; name?: string; rating: number; rank?: number | string }[];
  title?: string;
}

export default function RatingTimeline({ data, title = "Rating Timeline" }: RatingTimelineProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">{title}</h3>
        <p className="text-xs font-mono text-zinc-500">No contest history available</p>
      </div>
    );
  }

  const chartData = data.map((d, i) => ({
    label: d.contest || d.name || `#${i + 1}`,
    rating: d.rating,
  }));

  return (
    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5">
        {title}
      </h3>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#141414" />
            <XAxis dataKey="label" stroke="#444" tick={{ fontSize: 8, fontFamily: "monospace" }} />
            <YAxis stroke="#444" tick={{ fontSize: 9, fontFamily: "monospace" }} />
            <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b" }} />
            <Line type="monotone" dataKey="rating" stroke="#00e5ff" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
