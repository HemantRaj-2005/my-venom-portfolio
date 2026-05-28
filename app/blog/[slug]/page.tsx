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
        {/* Render article markdown content */}
        <article className="select-text bg-zinc-950/20 p-6 rounded-2xl border border-zinc-900/40 shadow-inner">
          <MarkdownRenderer content={post.content} />
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
    </div>;
}
