"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content by code blocks to isolate formatting
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4 font-sans text-zinc-300 text-sm md:text-base leading-relaxed">
      {parts.map((part, index) => {
        // Handle Code Blocks
        if (part.startsWith("```")) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "code";
          const code = match ? match[2].trim() : part.slice(3, -3).trim();

          return (
            <pre
              key={index}
              className="bg-black/90 border border-zinc-850 p-5 rounded-xl my-6 overflow-x-auto text-zinc-300 font-mono text-xs md:text-sm leading-relaxed shadow-lg select-text"
            >
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-600 uppercase tracking-widest border-b border-zinc-900 pb-2 mb-3 select-none">
                <span>Language: {lang || "generic"}</span>
                <span>GLSL Active</span>
              </div>
              <code>{code}</code>
            </pre>
          );
        }

        // Handle general markdown formatting line by line
        const lines = part.split("\n");
        return lines.map((line, lIdx) => {
          const trimmed = line.trim();

          if (trimmed === "") {
            return <div key={`${index}-${lIdx}`} className="h-2" />;
          }

          // Headers
          if (trimmed.startsWith("### ")) {
            return (
              <h3 key={`${index}-${lIdx}`} className="text-lg font-bold text-zinc-100 mt-6 mb-2 tracking-tight">
                {trimmed.slice(4)}
              </h3>
            );
          }
          if (trimmed.startsWith("## ")) {
            return (
              <h2 key={`${index}-${lIdx}`} className="text-xl md:text-2xl font-extrabold text-white mt-8 mb-4 tracking-tight border-b border-zinc-900 pb-2">
                {trimmed.slice(3)}
              </h2>
            );
          }
          if (trimmed.startsWith("# ")) {
            return (
              <h1 key={`${index}-${lIdx}`} className="text-2xl md:text-3xl font-black text-white mt-10 mb-6 tracking-tight">
                {trimmed.slice(2)}
              </h1>
            );
          }

          // Blockquotes
          if (trimmed.startsWith("> ")) {
            return (
              <blockquote key={`${index}-${lIdx}`} className="border-l-4 border-emerald-500 bg-zinc-950/60 px-4 py-3 my-4 italic text-zinc-300 rounded-r">
                {trimmed.slice(2)}
              </blockquote>
            );
          }

          // Bullet lists
          if (trimmed.startsWith("- ")) {
            return (
              <ul key={`${index}-${lIdx}`} className="list-disc pl-6 text-zinc-400 my-1 font-sans space-y-1">
                <li>{parseInlineMarkdown(trimmed.slice(2))}</li>
              </ul>
            );
          }

          // Numbered lists
          if (/^\d+\.\s/.test(trimmed)) {
            const content = trimmed.replace(/^\d+\.\s/, "");
            return (
              <ol key={`${index}-${lIdx}`} className="list-decimal pl-6 text-zinc-400 my-1 font-sans space-y-1">
                <li>{parseInlineMarkdown(content)}</li>
              </ol>
            );
          }

          // Paragraph
          return (
            <p key={`${index}-${lIdx}`} className="text-zinc-400 mb-2 leading-relaxed">
              {parseInlineMarkdown(trimmed)}
            </p>
          );
        });
      })}
    </div>
  );
}

// Parse bold, code chips, and links
function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Regex matchers
  const boldRegex = /\*\*(.*?)\*\*/g;
  const codeRegex = /`(.*?)`/g;
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;

  let elements: React.ReactNode[] = [];
  let remainingText = text;

  // Split and format bold and code chips
  const tokens = remainingText.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);

  return tokens.map((token, tIdx) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={tIdx} className="font-extrabold text-white">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={tIdx} className="bg-zinc-800/40 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono">{token.slice(1, -1)}</code>;
    }
    if (token.startsWith("[") && token.includes("](")) {
      const match = token.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a
            key={tIdx}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
          >
            {match[1]}
          </a>
        );
      }
    }
    return token;
  });
}
