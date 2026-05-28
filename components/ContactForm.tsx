"use client";

import React, { useState } from "react";
import { Send, PhoneCall, Mail, CheckCircle, Smartphone } from "lucide-react";

export default function ContactForm() {
  // Form 1: Hire Me CRM Lead state
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadBudget, setLeadBudget] = useState("Under $1,000");
  const [leadTimeline, setLeadTimeline] = useState("Under 1 month");
  const [leadScope, setLeadScope] = useState("");
  const [leadType, setLeadType] = useState("Full Stack Development");
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  // Form 2: Request Callback state
  const [cbName, setCbName] = useState("");
  const [cbEmail, setCbEmail] = useState("");
  const [cbPhone, setCbPhone] = useState("");
  const [cbTime, setCbTime] = useState("Morning (9 AM - 12 PM)");
  const [cbMsg, setCbMsg] = useState("");
  const [cbSuccess, setCbSuccess] = useState(false);
  const [cbLoading, setCbLoading] = useState(false);

  // sound utilities
  const playClick = () => {
    if ((window as any).playClickSound) (window as any).playClickSound();
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) return;
    
    playClick();
    setLeadLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          budget: leadBudget,
          timeline: leadTimeline,
          requirements: leadScope,
          projectType: leadType,
        })
      });
      if (res.ok) {
        setLeadSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLeadLoading(false);
    }
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cbName || !cbEmail || !cbPhone) return;

    playClick();
    setCbLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "callback",
          name: cbName,
          email: cbEmail,
          phone: cbPhone,
          timeSlot: cbTime,
          message: cbMsg
        })
      });
      if (res.ok) {
        setCbSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCbLoading(false);
    }
  };

  return (
    <div id="lead-forms" className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
      
      {/* Box 1: Hire Me CRM Lead pipeline */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 relative">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#E11D2E]/20 via-[#00E5FF]/20 to-[#E11D2E]/20 rounded-t-2xl" />
        <div className="flex items-center gap-2 text-[#00E5FF] font-mono text-xs uppercase tracking-widest mb-3 select-none">
          <Mail className="w-4.5 h-4.5" /> Project Inquiry dossiers
        </div>
        <h3 className="text-xl font-bold text-white mb-2 select-none font-heading">Hire Me</h3>
        <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-6 select-none">
          Deploy a high-performance Stark-tech portfolio web app, custom AI models, or SaaS dashboards.
        </p>

        {leadSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center p-4 border border-[#00E5FF]/30 bg-zinc-900/30 rounded-xl select-none">
            <CheckCircle className="w-10 h-10 text-[#00E5FF] mb-4 animate-bounce" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Parameters Registered</h4>
            <p className="text-xs text-zinc-400 font-sans mt-2 max-w-xs leading-relaxed">
              Your project metrics are synchronized with our core dashboard. The administrator will inspect your parameters.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLeadSubmit} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Peter Parker"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00E5FF]/40 font-sans"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="parker@dailybugle.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00E5FF]/40 font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Project Type</label>
                <select
                  value={leadType}
                  onChange={(e) => setLeadType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 outline-none focus:border-[#00E5FF]/40 font-sans"
                >
                  <option value="Full Stack Development">Full Stack Dev</option>
                  <option value="AI Integration & Pipelines">AI Integration</option>
                  <option value="SaaS Templates">SaaS Templates</option>
                  <option value="Portfolio Websites">Portfolios</option>
                  <option value="Custom API Systems">API Systems</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Target Budget</label>
                <select
                  value={leadBudget}
                  onChange={(e) => setLeadBudget(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 outline-none focus:border-[#00E5FF]/40 font-sans"
                >
                  <option value="Under $1,000">Under $1,000</option>
                  <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000+">$10,000+</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Timeline requirements</label>
              <select
                value={leadTimeline}
                onChange={(e) => setLeadTimeline(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 outline-none focus:border-[#00E5FF]/40 font-sans"
              >
                <option value="Under 1 month">Under 1 month (Aggressive)</option>
                <option value="1 - 3 months">1 - 3 months</option>
                <option value="3+ months">3+ months</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Scope of work</label>
              <textarea
                required
                value={leadScope}
                onChange={(e) => setLeadScope(e.target.value)}
                placeholder="Details of integrations, user limits, required tools..."
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00E5FF]/40 font-sans resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={leadLoading}
              className="w-full bg-[#E11D2E] hover:bg-[#c11524] disabled:bg-zinc-800 disabled:text-zinc-500 font-bold text-white py-3 rounded-xl shadow-lg hover:shadow-red-500/10 cursor-pointer active:scale-98 transition-all uppercase tracking-wider text-xs"
            >
              {leadLoading ? "Locking target..." : "Transmit Project Dossier"}
            </button>
          </form>
        )}
      </div>

      {/* Box 2: Request Callback Appointment */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 relative">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#E11D2E]/20 via-[#00E5FF]/20 to-[#E11D2E]/20 rounded-t-2xl" />
        <div className="flex items-center gap-2 text-[#00E5FF] font-mono text-xs uppercase tracking-widest mb-3 select-none">
          <PhoneCall className="w-4.5 h-4.5" /> Direct voice channel
        </div>
        <h3 className="text-xl font-bold text-white mb-2 select-none font-heading">Book Callback</h3>
        <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-6 select-none">
          Schedule a direct voice callback or meeting parameters with Hemant Raj.
        </p>

        {cbSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center p-4 border border-[#00E5FF]/30 bg-zinc-900/30 rounded-xl select-none">
            <CheckCircle className="w-10 h-10 text-[#00E5FF] mb-4 animate-bounce" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Callback Synchronized</h4>
            <p className="text-xs text-zinc-400 font-sans mt-2 max-w-xs leading-relaxed">
              Your voice slot is locked in. The admin dashboard has logged your schedule index.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCallbackSubmit} className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Your Name</label>
              <input
                type="text"
                required
                value={cbName}
                onChange={(e) => setCbName(e.target.value)}
                placeholder="Gwen Stacy"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00E5FF]/40 font-sans"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={cbEmail}
                  onChange={(e) => setCbEmail(e.target.value)}
                  placeholder="gwen@oscorp.dev"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00E5FF]/40 font-sans"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-[#00E5FF]" /> Phone Node
                </label>
                <input
                  type="tel"
                  required
                  value={cbPhone}
                  onChange={(e) => setCbPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00E5FF]/40 font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Preferred slot</label>
              <select
                value={cbTime}
                onChange={(e) => setCbTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 outline-none focus:border-[#00E5FF]/40 font-sans"
              >
                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Short message (Optional)</label>
              <textarea
                value={cbMsg}
                onChange={(e) => setCbMsg(e.target.value)}
                placeholder="Details about preferred discussion parameters..."
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00E5FF]/40 font-sans resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={cbLoading}
              className="w-full bg-[#E11D2E] hover:bg-[#c11524] disabled:bg-zinc-800 disabled:text-zinc-500 font-bold text-white py-3 rounded-xl shadow-lg hover:shadow-red-500/10 cursor-pointer active:scale-98 transition-all uppercase tracking-wider text-xs"
            >
              {cbLoading ? "Booking slot..." : "Lock Callback Appointment"}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
