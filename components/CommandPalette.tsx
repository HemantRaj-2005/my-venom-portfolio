"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, Command, ArrowRight, Settings, Moon, Terminal, Calendar, Code, Newspaper, ShoppingBag, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);

  // Command items definitions
  const items = [
    { name: "Go to Home", category: "Navigation", icon: Code, action: () => router.push("/") },
    { name: "Go to Projects Showcase", category: "Navigation", icon: FolderOpen, action: () => router.push("/projects") },
    { name: "Go to SaaS & Code Marketplace", category: "Navigation", icon: ShoppingBag, action: () => router.push("/marketplace") },
    { name: "Go to Technical Blog", category: "Navigation", icon: Newspaper, action: () => router.push("/blog") },
    { name: "Open Hacker Console Terminal", category: "Actions", icon: Terminal, action: () => {
      // Trigger global terminal hook if loaded
      const terminalBtn = document.querySelector('button[title*="Terminal"]') as HTMLButtonElement;
      if (terminalBtn) terminalBtn.click();
    }},
    { name: "Toggle Background Music", category: "Actions", icon: Settings, action: () => {
      // Trigger global sound hook if loaded
      const soundBtn = document.querySelector('button[title*="Ambient"]') as HTMLButtonElement;
      if (soundBtn) soundBtn.click();
    }},
    { name: "Book Callback Appointment", category: "Actions", icon: Calendar, action: () => {
      const formSection = document.getElementById("lead-forms");
      if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
    }},
    { name: "Open Administrator Panel", category: "Settings", icon: Moon, action: () => router.push("/admin") },
    { name: "Inspect Project: Venom Core AI", category: "Projects", icon: Code, action: () => router.push("/projects/venom-core-ai") },
    { name: "Inspect Project: Symbiote SaaS Core", category: "Projects", icon: Code, action: () => router.push("/projects/symbiote-saas-core") },
    { name: "Inspect Project: Web3 Gas Tracker", category: "Projects", icon: Code, action: () => router.push("/projects/web3-carnage") }
  ];

  // Register Global Key Listeners (Ctrl+K and /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, query]);

  // Reset index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Filter commands by search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-[5000] flex items-start justify-center bg-black/85 backdrop-blur-md pt-[10vh] px-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl shadow-emerald-500/5 flex flex-col max-h-[450px]"
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-950 border-b border-zinc-900">
          <Search className="w-5 h-5 text-zinc-500" />
          <input
            autoFocus
            type="text"
            placeholder="Type a search query or command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-zinc-600 w-full"
          />
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-[10px] font-mono text-zinc-500">
            <span className="text-[8px] uppercase">esc</span>
          </div>
        </div>

        {/* Dynamic results scrollbox */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar max-h-[320px] select-text"
        >
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-zinc-600 uppercase tracking-widest">
              No matching records found
            </div>
          ) : (
            // Group and map by category
            Object.entries(
              filteredItems.reduce((acc: any, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
              }, {})
            ).map(([category, catItems]: [string, any]) => (
              <div key={category} className="space-y-1">
                <div className="px-3 text-[9px] font-bold font-mono text-emerald-500 uppercase tracking-widest">
                  {category}
                </div>
                {catItems.map((item: any) => {
                  const globalIndex = filteredItems.indexOf(item);
                  const isSelected = globalIndex === selectedIndex;
                  const IconComp = item.icon;

                  return (
                    <div
                      key={item.name}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "bg-zinc-900 border border-zinc-800 text-white shadow-md shadow-black/40 scale-[1.01]"
                          : "border border-transparent text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className={`w-4.5 h-4.5 ${isSelected ? "text-emerald-400" : "text-zinc-500"}`} />
                        <span className="text-sm font-sans">{item.name}</span>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                          <span>Run</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5" />
            <span>+ K or /</span>
          </div>
        </div>
      </div>
    </div>
  );
}
