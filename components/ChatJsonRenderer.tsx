"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";

interface ChatJsonRendererProps {
  content: string;
}

// Try to extract JSON from a message
function extractJson(text: string): { json: unknown; before: string; after: string } | null {
  // Try ```json ... ``` code blocks first
  const codeBlockMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      const json = JSON.parse(codeBlockMatch[1].trim());
      const before = text.slice(0, codeBlockMatch.index).trim();
      const after = text.slice((codeBlockMatch.index || 0) + codeBlockMatch[0].length).trim();
      return { json, before, after };
    } catch { /* not valid */ }
  }

  // Try raw JSON object/array
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    try {
      const json = JSON.parse(jsonMatch[1]);
      const before = text.slice(0, jsonMatch.index).trim();
      const after = text.slice((jsonMatch.index || 0) + jsonMatch[0].length).trim();
      return { json, before, after };
    } catch { /* not valid */ }
  }

  return null;
}

// Render a string value with smart formatting
function renderString(value: string): React.ReactNode {
  // URL detection
  if (/^https?:\/\//.test(value)) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 decoration-cyan-700/50 hover:decoration-cyan-500 transition-colors break-all"
      >
        {value.length > 60 ? value.slice(0, 57) + "..." : value}
        <ExternalLink className="w-3 h-3 shrink-0" />
      </a>
    );
  }

  // Email detection
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return (
      <a href={`mailto:${value}`} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 decoration-cyan-700/50 transition-colors">
        {value}
      </a>
    );
  }

  // Multi-line text
  if (value.includes("\n")) {
    return (
      <span className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
        {value.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </React.Fragment>
        ))}
      </span>
    );
  }

  return <span className="text-zinc-300">{value}</span>;
}

// Collapsible section for nested objects/arrays
function Collapsible({
  label,
  count,
  children,
  defaultOpen = true,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer mb-1"
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        {label} <span className="text-zinc-700">({count})</span>
      </button>
      {open && <div className="pl-3 border-l border-zinc-800/60 ml-1.5 space-y-2">{children}</div>}
    </div>
  );
}

// Beautiful card-based renderer for JSON objects
function JsonCard({ data, depth = 0 }: { data: Record<string, unknown>; depth?: number }) {
  const entries = Object.entries(data);
  if (entries.length === 0) return <span className="text-zinc-600 text-xs font-mono">{"{}"}</span>;

  // Detect if this is a "response" object with sections
  const hasResponse = typeof data.response === "string";
  const hasSections = Array.isArray(data.sections);
  const hasLinks = Array.isArray(data.links);
  const hasTitle = typeof data.title === "string";

  // If it has a title, render as a card header
  const cardTitle = hasTitle ? (data.title as string) : null;

  return (
    <div className={`${depth > 0 ? "bg-zinc-950/40 border border-zinc-800/40 rounded-lg p-3" : "space-y-3"}`}>
      {cardTitle && (
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-800/40">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
          <span className="text-sm font-bold text-white tracking-tight">{cardTitle}</span>
        </div>
      )}

      {/* Main response text */}
      {hasResponse && (
        <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {renderString(data.response as string)}
        </div>
      )}

      {/* Sections array - each rendered as a subsection */}
      {hasSections && (
        <div className="space-y-2">
          {(data.sections as Array<Record<string, unknown>>).map((section, i) => (
            <SectionCard key={i} section={section} />
          ))}
        </div>
      )}

      {/* Links array */}
      {hasLinks && (
        <div className="flex flex-wrap gap-2 mt-2">
          {(data.links as Array<Record<string, unknown>>).map((link, i) => (
            <LinkChip key={i} link={link} />
          ))}
        </div>
      )}

      {/* Remaining key-value pairs that aren't special keys */}
      {entries
        .filter(([k]) => !["response", "sections", "links", "title", "status", "timestamp"].includes(k))
        .map(([key, val]) => (
          <KeyValueRow key={key} label={key} value={val} depth={depth} />
        ))}
    </div>
  );
}

function SectionCard({ section }: { section: Record<string, unknown> }) {
  const title = section.title as string | undefined;
  const content = section.content;
  const items = section.items;
  const icon = section.icon as string | undefined;

  return (
    <div className="bg-zinc-950/60 border border-zinc-800/50 rounded-xl p-3 hover:border-zinc-700/50 transition-colors">
      {title && (
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">{title}</span>
        </div>
      )}

      {typeof content === "string" && (
        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{content}</p>
      )}

      {Array.isArray(items) && (
        <ul className="space-y-1.5 mt-1">
          {items.map((item: unknown, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
              <span className="text-cyan-600 mt-1.5 text-[8px]">&#9654;</span>
              <span className="leading-relaxed">
                {typeof item === "string" ? item : JSON.stringify(item)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Nested objects in section */}
      {Object.entries(section)
        .filter(([k]) => !["title", "content", "items", "icon"].includes(k))
        .map(([key, val]) => (
          <KeyValueRow key={key} label={key} value={val} depth={1} />
        ))}
    </div>
  );
}

function LinkChip({ link }: { link: Record<string, unknown> }) {
  const name = (link.name as string) || (link.label as string) || "Link";
  const url = (link.url as string) || (link.href as string) || "#";
  const icon = link.icon as string | undefined;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-cyan-800/30 bg-cyan-950/10 text-cyan-400 hover:bg-cyan-950/30 hover:border-cyan-600/40 transition-all"
    >
      {icon && <span>{icon}</span>}
      {name}
      <ExternalLink className="w-3 h-3 opacity-50" />
    </a>
  );
}

function KeyValueRow({ label, value, depth }: { label: string; value: unknown; depth: number }) {
  if (value === null || value === undefined) return null;

  // Simple primitive
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return (
      <div className="flex items-start gap-2 py-1">
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider min-w-[80px] pt-0.5 shrink-0">
          {label.replace(/([A-Z])/g, " $1").trim()}
        </span>
        <span className="text-sm text-zinc-300">
          {typeof value === "string" ? renderString(value) : String(value)}
        </span>
      </div>
    );
  }

  // Array
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return (
      <Collapsible label={label} count={value.length} defaultOpen={depth < 1}>
        {value.map((item, i) => (
          <div key={i} className="text-sm text-zinc-400">
            {typeof item === "string" ? (
              <div className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1 text-[8px]">&#9654;</span>
                {renderString(item)}
              </div>
            ) : typeof item === "object" && item !== null ? (
              <JsonCard data={item as Record<string, unknown>} depth={depth + 1} />
            ) : (
              String(item)
            )}
          </div>
        ))}
      </Collapsible>
    );
  }

  // Nested object
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return null;
    return (
      <Collapsible label={label} count={entries.length} defaultOpen={depth < 1}>
        <JsonCard data={value as Record<string, unknown>} depth={depth + 1} />
      </Collapsible>
    );
  }

  return null;
}

export default function ChatJsonRenderer({ content }: ChatJsonRendererProps) {
  const [copied, setCopied] = useState(false);
  const extracted = extractJson(content);

  // No JSON - render as plain text with markdown-like formatting
  if (!extracted) {
    return <PlainMessage content={content} />;
  }

  const handleCopy = () => {
    const jsonStr = JSON.stringify(extracted.json, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isObject = typeof extracted.json === "object" && extracted.json !== null && !Array.isArray(extracted.json);
  const isArray = Array.isArray(extracted.json);

  return (
    <div className="space-y-3">
      {/* Text before JSON */}
      {extracted.before && <PlainMessage content={extracted.before} />}

      {/* Rendered JSON */}
      <div className="relative group">
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="absolute top-0 right-0 p-1.5 text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
          title="Copy raw JSON"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        {isObject ? (
          <JsonCard data={extracted.json as Record<string, unknown>} />
        ) : isArray ? (
          <div className="space-y-2">
            {(extracted.json as unknown[]).map((item, i) => (
              <div key={i}>
                {typeof item === "object" && item !== null ? (
                  <JsonCard data={item as Record<string, unknown>} />
                ) : (
                  <div className="text-sm text-zinc-300">{String(item)}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-zinc-300">{String(extracted.json)}</div>
        )}
      </div>

      {/* Text after JSON */}
      {extracted.after && <PlainMessage content={extracted.after} />}
    </div>
  );
}

// Render plain text with basic formatting
function PlainMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="text-sm text-zinc-300 leading-relaxed space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Headers
        if (trimmed.startsWith("### ")) {
          return <div key={i} className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mt-3 mb-1">{trimmed.slice(4)}</div>;
        }
        if (trimmed.startsWith("## ")) {
          return <div key={i} className="text-sm font-bold text-white mt-3 mb-1">{trimmed.slice(3)}</div>;
        }

        // Bullet points
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="text-cyan-600 mt-1.5 text-[8px]">&#9654;</span>
              <span>{formatInline(trimmed.slice(2))}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s(.+)/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="text-cyan-500 font-mono text-xs min-w-[16px]">{numMatch[1]}.</span>
              <span>{formatInline(numMatch[2])}</span>
            </div>
          );
        }

        // Empty line
        if (trimmed === "") {
          return <div key={i} className="h-1.5" />;
        }

        // Normal text
        return <div key={i}>{formatInline(trimmed)}</div>;
      })}
    </div>
  );
}

// Format inline markdown (bold, code, links)
function formatInline(text: string): React.ReactNode {
  // Split by bold, code, and links
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);

  return tokens.map((token, i) => {
    // Bold
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={i} className="font-bold text-white">{token.slice(2, -2)}</strong>;
    }
    // Inline code
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code key={i} className="bg-zinc-800/60 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono">
          {token.slice(1, -1)}
        </code>
      );
    }
    // Links [text](url)
    const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
          {linkMatch[1]}
        </a>
      );
    }
    return token;
  });
}
