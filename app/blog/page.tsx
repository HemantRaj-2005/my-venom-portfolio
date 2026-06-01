"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Search, Calendar, Clock, ArrowRight } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  category: string;
  readTime: number;
  featuredImage?: string | null;
  createdAt: string;
}

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  useEffect(() => {
    try {
      fetch("/api/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/blog" }),
      });
    } catch (e) {}

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Compute unique tags from posts
  const allTags = ["All", ...Array.from(new Set(posts.flatMap((p) => p.tags)))];

  const filteredPosts = posts.filter(
    (p) =>
      (selectedTag === "All" || p.tags.includes(selectedTag)) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-24 px-6 md:px-12 relative overflow-hidden font-sans">
      {/* Background glow overlay */}
      <div className="absolute w-[500px] h-[500px] bg-[#00E5FF]/2 rounded-full blur-[140px] top-1/4 right-[-100px] pointer-events-none" />

      {/* Header section */}
      <div className="max-w-4xl mx-auto mb-16 select-none">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#00E5FF] font-mono text-xs uppercase tracking-widest">
            <BookOpen className="w-4.5 h-4.5" /> Technical Chronicles
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-white mt-2 neon-glow-red">
            The Stark Ledger
          </h1>
          <p className="text-sm text-zinc-500 max-w-xl leading-relaxed mt-2 font-sans">
            Deep-dives on high-performance WebGL shaders, Next.js segment compilation cache layers, and custom AI neural weights mapping scripts.
          </p>
        </div>
      </div>

      {/* Search and Tag Chips */}
      <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-[#00E5FF]/15 pb-8 select-none">
        <div className="flex flex-wrap gap-1.5">
          {allTags.slice(0, 8).map((tag, index) => {
            const isSel = selectedTag === tag;
            return (
              <button
                key={index}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isSel
                    ? "bg-[#E11D2E] text-white border border-[#E11D2E]/30"
                    : "bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-white"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950/80 w-full max-w-xs backdrop-blur">
          <Search className="w-4.5 h-4.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search keywords, logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-700 w-full font-mono"
          />
        </div>
      </div>

      {/* Blogs list stack */}
      <div className="max-w-4xl mx-auto space-y-6">
        {loading ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-zinc-600 animate-pulse">
            Retrieving blog databases...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-zinc-650">
            No records available
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-zinc-700">
            No technical posts matched criteria.
          </div>
        ) : (
          filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 hover:border-[#00E5FF]/30 transition-all duration-300 shadow-lg shadow-black/40 hover:shadow-[#00E5FF]/2"
            >
              <div className="flex flex-col gap-4">
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden border border-zinc-800/50">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
                  </div>
                )}

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest select-none">
                  <span className="text-[#00E5FF] bg-[#00E5FF]/5 px-2 py-0.5 rounded border border-[#00E5FF]/20">
                    {post.category || "Development"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>

                {/* Article Header title */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xl md:text-2xl font-bold text-white group-hover:text-[#00E5FF] transition-colors duration-200"
                >
                  {post.title}
                </Link>

                <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                  {post.summary}
                </p>

                {/* Tags and Go links */}
                <div className="flex items-center justify-between mt-4 border-t border-zinc-900 pt-5">
                  <div className="flex flex-wrap gap-1 select-none">
                    {post.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-[9px] font-mono text-zinc-500 uppercase"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 group-hover:text-[#00E5FF] transition-colors cursor-pointer"
                  >
                    <span>Read Ledger</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        )}
    </div>
  </div>
);
}
