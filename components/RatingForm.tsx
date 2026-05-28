"use client";

import React, { useState } from "react";
import { Star, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface RatingFormProps {
  productId: string;
}

export default function RatingForm({ productId }: RatingFormProps) {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author) {
      setError("Please fill out your reviewer name.");
      return;
    }

    setError("");
    setLoading(true);

    if ((window as any).playClickSound) (window as any).playClickSound();

    try {
      const res = await fetch("/api/products/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          comment,
          author,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        // Refresh server-side data logs
        router.refresh();
      } else {
        setError(data.error || "Failed to submit review.");
      }
    } catch (err) {
      setError("Connection to ratings API gateway failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center gap-3 p-4 border border-emerald-500/30 bg-emerald-950/20 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
          <Check className="w-4.5 h-4.5 text-emerald-400" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Review Logged</h4>
          <p className="text-[10px] text-zinc-400 font-sans mt-0.5">
            Thank you! Your feedback has been verified and stored in the database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md select-none">
      <div className="flex gap-4">
        {/* Name input */}
        <div className="flex-1 space-y-1">
          <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
            Your Name
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="John Watson"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 transition-all font-sans"
          />
        </div>

        {/* Star Rating selector */}
        <div className="space-y-1">
          <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1 block">
            Star Rating
          </label>
          <div className="flex items-center gap-1 h-8">
            {Array.from({ length: 5 }).map((_, i) => {
              const starVal = i + 1;
              const isFilled = hoverRating !== null ? starVal <= hoverRating : starVal <= rating;
              return (
                <button
                  type="button"
                  key={i}
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(starVal)}
                  className="text-zinc-700 hover:text-amber-400 cursor-pointer transition-colors"
                >
                  <Star className={`w-4 h-4 ${isFilled ? "fill-amber-400 text-amber-400" : ""}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
          Review Comments
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience using this code asset..."
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 transition-all font-sans resize-none"
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
        className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 disabled:border-zinc-850 hover:border-zinc-750 disabled:text-zinc-600 font-bold text-zinc-300 hover:text-white px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest cursor-pointer active:scale-95 transition-all"
      >
        {loading ? "Logging..." : "Submit Review"}
      </button>
    </form>
  );
}
