"use client";

/**
 * SpiderCore – thin wrapper that lazy-loads the full React Three Fiber
 * Spider-Man scene (SpiderScene.tsx) with no SSR.
 *
 * This component is the one referenced in app/page.tsx.
 */

import dynamic from "next/dynamic";

const SpiderSceneDynamic = dynamic(() => import("@/components/SpiderScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[420px] md:min-h-[560px] flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Layered pulsing rings loading animation */}
        <div className="absolute w-40 h-40 rounded-full border border-red-500/20 animate-ping" />
        <div
          className="absolute w-28 h-28 rounded-full border border-cyan-500/20 animate-spin"
          style={{ animationDuration: "3s" }}
        />
        <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
          <span className="text-cyan-400 text-lg font-black animate-pulse">S</span>
        </div>
        <div className="absolute bottom-[-32px] text-[9px] font-mono text-zinc-600 uppercase tracking-widest whitespace-nowrap">
          Syncing Stark-Tech HUD Core...
        </div>
      </div>
    </div>
  ),
});

export default function SpiderCore() {
  return <SpiderSceneDynamic />;
}
