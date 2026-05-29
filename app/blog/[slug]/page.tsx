import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft, Calendar, Clock, BookOpen } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import BlogCommentSection from "@/components/BlogCommentSection";
import BlogScrollProgress from "@/components/BlogScrollProgress";
import { connection } from "next/server";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });

  if (!post) return { title: "Article Not Found" };

  return {
    title: `${post.title} - The Stark Ledger`,
    description: post.summary || "Technical chronicles.",
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.summary || "Technical blog article details.",
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  await connection();
  const { slug } = await params;

  // Query post with comments
  const post = await db.post.findUnique({
    where: { slug },
    include: { comments: true }
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans pb-24 relative overflow-hidden">
      {/* Dynamic Scroll Progress Bar */}
      <BlogScrollProgress />

      {/* Background glow overlay */}
      <div className="absolute w-[500px] h-[500px] bg-[#00E5FF]/2 rounded-full blur-[140px] top-1/4 left-1/4 pointer-events-none" />

      {/* Hero Banner Header Area */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-28 pb-12 select-none border-b border-[#00E5FF]/15">
        {/* Back navigation */}
        <Link
          href="/blog"
          className="flex items-center gap-2 border border-zinc-900 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-400 hover:text-white px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer w-fit mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go back</span>
        </Link>

        {/* Category & Stats */}
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
          <span className="text-[#00E5FF] bg-[#00E5FF]/5 px-2 py-0.5 rounded border border-[#00E5FF]/20">
            {post.category || "Development"}
          </span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-white leading-tight neon-glow-red">
          {post.title}
        </h1>

        {/* Summary banner */}
        {post.summary && (
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-6 bg-zinc-950 p-4 rounded-xl border border-zinc-900/60 leading-relaxed max-w-3xl">
            <span className="text-[#00E5FF] font-bold font-mono text-[9px] border border-[#00E5FF]/20 px-1 rounded mr-2 uppercase">AI Summary</span>
            {post.summary}
          </p>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 gap-12">
        {/* Render article content */}
        <article className="select-text bg-zinc-950/20 p-6 rounded-2xl border border-zinc-900/40 shadow-inner">
          {(() => {
            if (post.content && post.content.trim().startsWith("[")) {
              try {
                const blocks = JSON.parse(post.content);
                if (Array.isArray(blocks)) {
                  return (
                    <div className="space-y-6">
                      {blocks.map((block: any, idx: number) => {
                        switch (block.type) {
                          case "header":
                            if (block.level === 1) {
                              return <h1 key={idx} className="text-2xl md:text-3xl font-black text-white mt-10 mb-6 tracking-tight border-b border-zinc-900 pb-2">{block.content}</h1>;
                            } else if (block.level === 3) {
                              return <h3 key={idx} className="text-lg font-bold text-zinc-100 mt-6 mb-2 tracking-tight">{block.content}</h3>;
                            } else {
                              return <h2 key={idx} className="text-xl md:text-2xl font-extrabold text-white mt-8 mb-4 tracking-tight border-b border-zinc-900 pb-2">{block.content}</h2>;
                            }
                          case "paragraph":
                            return <div key={idx} className="mb-4 text-zinc-300 text-sm md:text-base leading-relaxed"><MarkdownRenderer content={block.content} /></div>;
                          case "code":
                            return (
                              <pre key={idx} className="bg-black/90 border border-zinc-850 p-5 rounded-xl my-6 overflow-x-auto text-zinc-300 font-mono text-xs md:text-sm leading-relaxed shadow-lg select-text">
                                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-650 uppercase tracking-widest border-b border-zinc-900 pb-2 mb-3 select-none">
                                  <span>Language: {block.language || "generic"}</span>
                                  <span>Dynamic Source</span>
                                </div>
                                <code>{block.content}</code>
                              </pre>
                            );
                          case "quote":
                            return (
                              <blockquote key={idx} className="border-l-4 border-cyan-500 bg-zinc-950/60 px-4 py-3 my-4 italic text-zinc-300 rounded-r">
                                {block.content}
                              </blockquote>
                            );
                          case "callout":
                            return (
                              <div key={idx} className={`border-l-4 p-4 my-4 rounded-r bg-zinc-950/40 ${
                                block.calloutType === "warning" 
                                  ? "border-amber-500 bg-amber-950/5 text-amber-200" 
                                  : block.calloutType === "success" 
                                    ? "border-emerald-500 bg-emerald-950/5 text-emerald-200" 
                                    : "border-cyan-500 bg-cyan-950/5 text-cyan-200"
                              }`}>
                                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                                  {block.calloutType || "info"} node
                                </div>
                                <MarkdownRenderer content={block.content} />
                              </div>
                            );
                          case "image":
                            return (
                              <div key={idx} className="my-6 space-y-2 text-center select-none">
                                <img src={block.url} alt={block.caption || ""} className="mx-auto rounded-xl max-h-[450px] object-cover border border-zinc-800" />
                                {block.caption && <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{block.caption}</p>}
                              </div>
                            );
                          default:
                            return null;
                        }
                      })}
                    </div>
                  );
                }
              } catch (e) {
                console.error("Failed to parse dynamic blog blocks:", e);
              }
            }
            return <MarkdownRenderer content={post.content} />;
          })()}
        </article>

        {/* Tag blocks */}
        <div className="flex flex-wrap gap-1 border-b border-[#00E5FF]/15 pb-10 select-none">
          {post.tags.map((tag: string, idx: number) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-850 text-[10px] font-mono text-zinc-400 uppercase"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Comment log boards */}
        <div className="mt-4">
          <BlogCommentSection postId={post.id || ""} comments={post.comments} />
        </div>
    </div>
  </div>
);
}
