"use client";

import React from "react";
import { Code, Award, GitPullRequest, Bookmark } from "lucide-react";


export default function CodingStats() {
  // Mock GitHub contribution dots (7 columns of 5 rows)
  const githubDots = Array.from({ length: 35 }, (_, idx) => {
    // Randomize activity level (0: none, 1: low, 2: medium, 3: high)
    const level = Math.floor(Math.random() * 4);
    return level;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full select-none">
      
      {/* Card 1: GitHub Stats */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#00E5FF]"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">GitHub Profile</span>
            </div>
            <a
              href="https://github.com/HemantRaj-2005"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-zinc-500 hover:text-[#00E5FF] border border-zinc-900 hover:border-[#00E5FF]/20 bg-black/60 px-2 py-0.5 rounded transition-all"
            >
              @HemantRaj-2005
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center py-2 border-b border-zinc-900 mb-6">
            <div>
              <div className="text-xl font-extrabold text-white font-mono">1,400+</div>
              <div className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5">Contributions</div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-white font-mono">24</div>
              <div className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5">Repositories</div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-white font-mono">80+</div>
              <div className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5">Pull Requests</div>
            </div>
          </div>
        </div>

        {/* Contribution Graph Simulation */}
        <div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-3">
            Simulated Activity Matrix
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {githubDots.map((level, idx) => (
              <span
                key={idx}
                className={`w-3.5 h-3.5 rounded-sm transition-all ${
                  level === 0 ? "bg-zinc-900" :
                  level === 1 ? "bg-[#00E5FF]/10 border border-[#00E5FF]/20" :
                  level === 2 ? "bg-[#00E5FF]/30 border border-[#00E5FF]/40" :
                  "bg-[#00E5FF] shadow-[0_0_6px_rgba(0,229,255,0.6)]"
                }`}
                title={`Level: ${level}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Card 2: LeetCode Stats */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2.5">
              <Code className="w-5 h-5 text-[#00E5FF]" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">LeetCode Metrics</span>
            </div>
            <a
              href="https://leetcode.com/u/HemantRaj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-zinc-500 hover:text-[#00E5FF] border border-zinc-900 hover:border-[#00E5FF]/20 bg-black/60 px-2 py-0.5 rounded transition-all"
            >
              @HemantRaj
            </a>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-zinc-900 mb-4 select-none">
            <div className="flex items-center gap-2">
              <Award className="w-8 h-8 text-amber-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-white tracking-wide">Knight Badge</span>
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Contest Rating: Top 5%</span>
              </div>
            </div>
            <div>
              <div className="text-lg font-black text-white font-mono">450+</div>
              <div className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5 text-right">Solved</div>
            </div>
          </div>
        </div>

        {/* Solve splits Progress bars */}
        <div className="space-y-3 font-mono text-[9px] uppercase text-zinc-500 tracking-wider">
          {/* Easy */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[#00E5FF]">Easy (150/150)</span>
              <span className="text-white font-bold">100%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 border border-zinc-850 rounded-full overflow-hidden">
              <div className="h-full bg-[#00E5FF] rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
          
          {/* Medium */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-amber-400">Medium (250/300)</span>
              <span className="text-white font-bold">83%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 border border-zinc-850 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: "83%" }} />
            </div>
          </div>

          {/* Hard */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-red-500">Hard (50/100)</span>
              <span className="text-white font-bold">50%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 border border-zinc-850 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: "50%" }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
