"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

interface ProjectInquiryFormProps {
  initialProjectTitle: string;
}

export default function ProjectInquiryForm({ initialProjectTitle }: ProjectInquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("Under $1,000");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please fill out your name and email.");
      return;
    }

    setError("");
    setLoading(true);

    if ((window as any).playClickSound) (window as any).playClickSound();

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          budget,
          requirements: requirements || `Inquiry regarding a system similar to: ${initialProjectTitle}`,
          projectType: `Similar to: ${initialProjectTitle}`,
          timeline: "Flexible",
          company: "General Client",
          preferredTime: "Anytime",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        // Reset states
        setName("");
        setEmail("");
        setRequirements("");
      } else {
        setError(data.error || "Form submission failed.");
      }
    } catch (err) {
      setError("Connection to api gateway failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 border border-[#00E5FF]/30 bg-zinc-950 rounded-xl">
        <div className="w-9 h-9 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mb-3">
          <Check className="w-5 h-5 text-[#00E5FF]" />
        </div>
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Inquiry Synchronized</h4>
        <p className="text-[10px] text-zinc-400 font-sans mt-1.5 leading-relaxed">
          Your request parameters have been locked in. The admin has been pinged in the dashboard control core.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
          Your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Peter Parker"
          required
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/10 transition-all font-sans"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
          Your Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="parker@dailybugle.com"
          required
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/10 transition-all font-sans"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
          Target Budget
        </label>
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#00E5FF]/40 transition-all font-sans"
        >
          <option value="Under $1,000">Under $1,000</option>
          <option value="$1,000 - $5,000">$1,000 - $5,000</option>
          <option value="$5,000 - $10,000">$5,000 - $10,000</option>
          <option value="$10,000+">$10,000+</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
          Requirements
        </label>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Details on scope, target features, timelines..."
          rows={3}
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
        className="w-full bg-[#E11D2E] hover:bg-[#c11524] disabled:bg-zinc-800 disabled:text-zinc-500 font-bold text-white py-2 rounded-lg text-xs uppercase tracking-wider shadow hover:shadow-red-500/10 cursor-pointer active:scale-98 transition-all"
      >
        {loading ? "Transmitting..." : "Send Request Dossier"}
      </button>
    </form>
  );
}
