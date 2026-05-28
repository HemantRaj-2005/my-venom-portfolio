"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ShieldAlert, Terminal, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "ADMIN") {
      router.push("/admin/dashboard");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both credential fields.");
      return;
    }

    setError("");
    setLoading(true);

    if ((window as any).playClickSound) (window as any).playClickSound();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid security decryption credentials.");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-500">
        Syncing Control session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Background Ambient glows */}
      <div className="absolute w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[140px] top-1/4 left-1/4 pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-red-500/5 rounded-full blur-[120px] bottom-1/4 right-1/4 pointer-events-none" />
      
      {/* Matrix grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-md shadow-2xl shadow-emerald-500/2 relative z-10"
      >
        {/* Venom-inspired card top border line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500/30 via-emerald-400 to-emerald-500/30 rounded-t-2xl" />

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-lg shadow-black">
            <Terminal className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Symbiote Control Center</h2>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-mono">
            Security Decryption Protocol
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 flex items-center gap-3 p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-xs text-red-400"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest pl-1">
              Dossier Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@venom.dev"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-700 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest pl-1">
              Decryption Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-zinc-700 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 font-semibold text-white py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-950/20 hover:shadow-emerald-500/10 transition-all duration-200 mt-2 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center gap-2 text-sm font-mono tracking-wider animate-pulse">
                Decrypting...
              </span>
            ) : (
              <span>Unlock Admin Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          Auth: NextAuth JWT Credentials Strategy
        </div>
      </motion.div>
    </div>
  );
}
