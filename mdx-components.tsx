import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-extrabold text-white mt-10 mb-6 tracking-tight border-b border-zinc-800 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-white mt-8 mb-4 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-zinc-100 mt-6 mb-3">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-zinc-400 leading-relaxed mb-5 text-base font-sans">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-6 text-zinc-400 mb-5 space-y-2 font-sans">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 text-zinc-400 mb-5 space-y-2 font-sans">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-zinc-400 leading-relaxed">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-emerald-500 bg-zinc-950/60 backdrop-blur px-5 py-4 my-6 italic text-zinc-300 rounded-r border-dashed">
        {children}
      </blockquote>
    ),
    pre: ({ children }) => (
      <pre className="bg-black/90 border border-zinc-800/80 p-5 rounded-xl my-6 overflow-x-auto text-zinc-300 font-mono text-sm leading-relaxed shadow-lg shadow-black/40">
        {children}
      </pre>
    ),
    code: ({ children }) => (
      <code className="bg-zinc-800/40 text-emerald-400 px-1.5 py-0.5 rounded text-zinc-200 font-mono text-xs border border-zinc-700/30">
        {children}
      </code>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors font-medium"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    img: ({ alt, ...rest }) => (
      <span className="block my-6 overflow-hidden rounded-xl border border-zinc-850 shadow-md">
        <Image
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          width={800}
          height={450}
          {...(rest as Omit<ImageProps, "alt">)}
          alt={alt || "MDX Asset"}
        />
      </span>
    ),
    ...components,
  };
}
