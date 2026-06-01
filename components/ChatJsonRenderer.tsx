"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";

function JsonValue({ value, level = 0 }: { value: unknown; level: number }) {
  const [collapsed, setCollapsed] = useState(level > 2);

  if (value === null) return <span className="text-zinc-500">null</span>;
  if (value === undefined) return <span className="text-zinc-500">undefined</span>;

  if (typeof value === "boolean") {
    return <span className="text-amber-400">{String(value)}</span>;
  }

  if (typeof value === "number") {
    return <span className="text-cyan-400">{value}</span>;
  }

  if (typeof value === "string") {
    // Check if it's a URL
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline break-all">
          &quot;{value}&quot;
        </a>
      );
    }
    // Check if it's an email
    if (value.includes("@") && !value.includes(" ")) {
      return (
        <a href={`mailto:${value}`} className="text-emerald-400 hover:underline">
          &quot;{value}&quot;
        </a>
      );
    }
    return <span className="text-green-400">&quot;{value}&quot;</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-zinc-500">[]</span>;

    return (
      <span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center gap-0.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          <span className="text-zinc-600">[</span>
        </button>
        {collapsed ? (
          <span className="text-zinc-600"> {value.length} items ]</span>
        ) : (
          <div className="pl-4 border-l border-zinc-800 ml-1">
            {value.map((item, i) => (
              <div key={i}>
                <JsonValue value={item} level={level + 1} />
                {i < value.length - 1 && <span className="text-zinc-600">,</span>}
              </div>
            ))}
            <span className="text-zinc-600">]</span>
          </div>
        )}
      </span>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span className="text-zinc-500">{"{}"}</span>;

    return (
      <span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center gap-0.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          <span className="text-zinc-600">{"{"}</span>
        </button>
        {collapsed ? (
          <span className="text-zinc-600"> {entries.length} keys {"}"}</span>
        ) : (
          <div className="pl-4 border-l border-zinc-800 ml-1">
            {entries.map(([key, val], i) => (
              <div key={key}>
                <span className="text-purple-400">&quot;{key}&quot;</span>
                <span className="text-zinc-600">: </span>
                <JsonValue value={val} level={level + 1} />
                {i < entries.length - 1 && <span className="text-zinc-600">,</span>}
              </div>
            ))}
            <span className="text-zinc-600">{"}"}</span>
          </div>
        )}
      </span>
    );
  }

  return <span className="text-zinc-400">{String(value)}</span>;
}

interface ChatJsonRendererProps {
  content: string;
  data?: unknown;
}

export default function ChatJsonRenderer({ content, data }: ChatJsonRendererProps) {
  const [copied, setCopied] = useState(false);

  // If data is provided directly, render it
  if (data !== undefined) {
    return <JsonBlock data={data} />;
  }

  // Try to extract JSON from content string
  const extracted = extractJsonFromMessage(content);

  if (!extracted) {
    // No JSON found, render as plain text
    return <span>{content}</span>;
  }

  return (
    <div className="space-y-2">
      {extracted.before && <p className="text-zinc-300">{extracted.before}</p>}
      <JsonBlock data={extracted.json} />
      {extracted.after && <p className="text-zinc-300">{extracted.after}</p>}
    </div>
  );
}

function JsonBlock({ data }: { data: unknown }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
        title="Copy JSON"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <pre className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 overflow-x-auto text-xs font-mono leading-relaxed">
        <JsonValue value={data} level={0} />
      </pre>
    </div>
  );
}

// Utility: try to extract JSON from a message string
export function extractJsonFromMessage(text: string): { json: unknown; before: string; after: string } | null {
  // Try to find ```json ... ``` blocks
  const codeBlockMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      const json = JSON.parse(codeBlockMatch[1].trim());
      const before = text.slice(0, codeBlockMatch.index).trim();
      const after = text.slice((codeBlockMatch.index || 0) + codeBlockMatch[0].length).trim();
      return { json, before, after };
    } catch {
      // Not valid JSON in code block
    }
  }

  // Try to find raw JSON objects or arrays
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    try {
      const json = JSON.parse(jsonMatch[1]);
      const before = text.slice(0, jsonMatch.index).trim();
      const after = text.slice((jsonMatch.index || 0) + jsonMatch[0].length).trim();
      return { json, before, after };
    } catch {
      // Not valid JSON
    }
  }

  return null;
}
