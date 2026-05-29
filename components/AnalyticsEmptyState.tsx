"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Cpu } from "lucide-react";

interface EmptyStateProps {
  platformName: string;
}

export default function AnalyticsEmptyState({ platformName }: EmptyStateProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 select-none font-sans relative overflow-hidden">
      {/* Background neon blur */}
      <div className="absolute w-72 h-72 bg-red-500/2 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="max-w-md w-full bg-zinc-950/40 border border-zinc-900 rounded-2xl p-8 text-center flex flex-col items-center justify-center shadow-xl backdrop-blur-sm relative z-10">
        <ShieldAlert className="w-14 h-14 text-red-500 mb-5 animate-pulse" />
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest">
          {platformName} Telemetry Gated
        </h3>
        <p className="text-xs text-zinc-500 mt-3 leading-relaxed font-mono uppercase">
          No active database cache detected for this node. Connect your platform account in the Integrations panel to view real-time intelligence widgets.
        </p>
        <div className="flex gap-4 mt-8 w-full font-mono text-xs">
          <Link
            href="/admin/dashboard"
            className="flex-1 text-center py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors"
          >
            Connect Platform
          </Link>
        </div>
      </div>
    </div>
  );
}
