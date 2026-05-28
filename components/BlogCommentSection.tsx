"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface BlogCommentSectionProps {
  postId: string;
  comments: Comment[];
}

export default function BlogCommentSection({ postId, comments }: BlogCommentSectionProps) {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) {
      setError("Please fill out your name and comment text.");
      return;
    }

    setError("");
    setLoading(true);

    if ((window as any).playClickSound) (window as any).playClickSound();

    try {
      const res = await fetch("/api/blogs/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          author,
          email,
          content,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setAuthor("");
        setEmail("");
        setContent("");
        router.refresh();
      } else {
        setError(data.error || "Failed to submit comment.");
      }
    } catch (err) {
      setError("Connection to comment API gateway failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-400 border-b border-[#00E5FF]/15 pb-3 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-[#00E5FF]" /> Synchronization logs ({comments.length})
      </h3>

      {/* Comments grid */}
      <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2 select-text">
        {comments.length === 0 ? (
          <div className="text-center font-mono text-[10px] text-zinc-600 uppercase tracking-widest py-8">
            No synchronization logs active.
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/80 space-y-2 relative"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white font-sans">{comment.author}</span>
                <span className="text-[9px] font-mono text-zinc-600">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Submit comment form */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
        <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4 font-heading">
          Add comment dossier
        </h4>

        {success ? (
          <div className="flex items-center gap-3 p-4 border border-[#00E5FF]/30 bg-zinc-950 rounded-xl mb-4">
            <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center shrink-0">
              <Check className="w-4.5 h-4.5 text-[#00E5FF]" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Comment Linked</h5>
              <p className="text-[10px] text-zinc-400 font-sans mt-0.5">
                Your entry has been synchronized with the blog ledger.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
                  Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Gwen Stacy"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/10 transition-all font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gwen@oscorp.dev"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/10 transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
                Comment message
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Submit your comments or queries on these technical parameters..."
                rows={4}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/10 transition-all font-sans resize-none"
              />
            </div>

            {error && (
              <div className="text-[10px] font-mono text-red-500 pl-1 uppercase tracking-wide">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#E11D2E] hover:bg-[#c11524] disabled:bg-zinc-800 disabled:text-zinc-500 font-bold text-white px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow hover:shadow-red-500/10 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Transmitting..." : "Send Comment"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
