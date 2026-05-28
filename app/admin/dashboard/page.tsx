"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, Briefcase, Calendar, Mail, FileDown, LogOut, CheckCircle, 
  Trash2, Search, BarChart3, Database, Package, FileText, Download,
  ShieldAlert, Cpu, RefreshCw
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, BarChart, Bar, Cell 
} from "recharts";

// Interfaces for DB records
interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  timeline: string;
  requirements: string;
  projectType: string;
  status: string;
  createdAt: string;
}

interface Callback {
  id: string;
  name: string;
  email: string;
  phone: string;
  timeSlot: string;
  message: string;
  status: string;
  createdAt: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

interface Visitor {
  id: string;
  ip: string;
  device: string;
  browser: string;
  os: string;
  path: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Selected tab state
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "callbacks" | "messages" | "subscribers" | "visitors" | "integrations">("overview");

  // Database lists
  const [leads, setLeads] = useState<Lead[]>([]);
  const [callbacks, setCallbacks] = useState<Callback[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  // Integration handles state
  const [github, setGithub] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [codeforces, setCodeforces] = useState("");
  const [codechef, setCodechef] = useState("");
  const [geeksforgeeks, setGeeksforgeeks] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Authenticate user check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  // Load dashboard records from unified database
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // In Next.js, we can create api endpoints or read localdb directly.
      // Since it's a client page, we can hit helper endpoints or simulate load.
      // To bypass route handler lag, we fetch via standard local REST endpoints.
      const res = await fetch("/api/admin/data");
      const result = await res.json();
      if (result.success) {
        setLeads(result.leads || []);
        setCallbacks(result.callbacks || []);
        setMessages(result.messages || []);
        setSubscribers(result.subscribers || []);
        setVisitors(result.visitors || []);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch integrations config
  const fetchIntegrations = async () => {
    try {
      const res = await fetch("/api/admin/integrations");
      const result = await res.json();
      if (result.success && result.profile) {
        setGithub(result.profile.github || "");
        setLeetcode(result.profile.leetcode || "");
        setCodeforces(result.profile.codeforces || "");
        setCodechef(result.profile.codechef || "");
        setGeeksforgeeks(result.profile.geeksforgeeks || "");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveIntegrations = async (triggerSync: boolean) => {
    setSaveLoading(true);
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const res = await fetch("/api/admin/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          github,
          leetcode,
          codeforces,
          codechef,
          geeksforgeeks,
          triggerSync
        })
      });
      const result = await res.json();
      if (result.success) {
        alert(triggerSync ? "Account sync successfully executed!" : "Integrations successfully saved!");
      } else {
        alert(result.error || "Failed to update configuration.");
      }
    } catch (e) {
      console.error(e);
      alert("Network connection error. Try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadDashboardData();
      fetchIntegrations();
    }
  }, [status]);

  // Update Status endpoints
  const updateStatus = async (type: "lead" | "callback" | "message", id: string, newStatus: string) => {
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const res = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, status: newStatus }),
      });
      if (res.ok) {
        loadDashboardData(); // Refresh grid
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Record endpoints
  const deleteRecord = async (type: "lead" | "callback" | "message" | "subscriber", id: string) => {
    if (!confirm("Are you sure you want to delete this log?")) return;
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      if (res.ok) {
        loadDashboardData(); // Refresh grid
      }
    } catch (e) {
      console.error(e);
    }
  };

  // CSV Export utility
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((item) =>
      Object.values(item)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Guard access checks
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-500">
        Authenticating Secure Portal...
      </div>
    );
  }

  const role = (session?.user as any)?.role;
  if (role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center font-mono text-center p-8">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
        <h2 className="text-xl text-white font-bold">Access Revoked</h2>
        <p className="text-zinc-500 text-xs mt-2 max-w-sm uppercase tracking-wider leading-relaxed">
          Your credentials do not hold the required ADMIN clearance nodes.
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/admin" })}
          className="mt-6 border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white px-5 py-2.5 rounded-lg text-xs uppercase tracking-widest cursor-pointer"
        >
          Logout Session
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // COMPUTED STATS & CHART DATA
  // -------------------------------------------------------------
  const totalVisits = visitors.length;
  const totalLeadsCount = leads.length;
  const totalCallbacksCount = callbacks.length;
  const totalMsgsCount = messages.length;

  // 1. Daily Visitor data logic
  const getVisitorChartData = () => {
    const datesMap: { [key: string]: number } = {};
    // Populate last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      datesMap[dateStr] = 0;
    }

    visitors.forEach((v) => {
      const dateStr = new Date(v.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      if (datesMap[dateStr] !== undefined) {
        datesMap[dateStr]++;
      }
    });

    return Object.entries(datesMap).map(([name, visits]) => ({ name, visits }));
  };

  // 2. Device count split logic
  const getDeviceChartData = () => {
    const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
    visitors.forEach((v) => {
      if (v.device === "Mobile") devices.Mobile++;
      else if (v.device === "Tablet") devices.Tablet++;
      else devices.Desktop++;
    });
    return Object.entries(devices).map(([name, value]) => ({ name, value }));
  };

  // 3. Budget breakdowns logic
  const getBudgetChartData = () => {
    const budgets = { "Under $1k": 0, "$1k - $5k": 0, "$5k - $10k": 0, "$10k+": 0 };
    leads.forEach((l) => {
      if (l.budget?.includes("Under") || l.budget?.includes("1,000")) budgets["Under $1k"]++;
      else if (l.budget?.includes("5,000") && !l.budget?.includes("10,000")) budgets["$1k - $5k"]++;
      else if (l.budget?.includes("10,000")) budgets["$5k - $10k"]++;
      else budgets["$10k+"]++;
    });
    return Object.entries(budgets).map(([name, count]) => ({ name, count }));
  };

  const visitorChartData = getVisitorChartData();
  const deviceChartData = getDeviceChartData();
  const budgetChartData = getBudgetChartData();

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 flex flex-col font-sans select-none">
      {/* Header bar */}
      <header className="h-16 bg-zinc-950 border-b border-zinc-900 px-6 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Database className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Venom Dashboard</h1>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Administrator Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
            SECURE ADM: {session?.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-zinc-500 hover:text-red-400 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-60 bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-900 p-4 space-y-1.5 select-none shrink-0">
          {[
            { id: "overview", name: "Overview Analytics", icon: BarChart3 },
            { id: "leads", name: "Leads (Hire Me)", icon: Briefcase, count: totalLeadsCount },
            { id: "callbacks", name: "Callback Requests", icon: Calendar, count: totalCallbacksCount },
            { id: "messages", name: "Messages", icon: Mail, count: totalMsgsCount },
            { id: "subscribers", name: "Newsletter", icon: FileDown, count: subscribers.length },
            { id: "visitors", name: "Visitor Log", icon: Users, count: totalVisits },
            { id: "integrations", name: "Integrations Sync", icon: Cpu }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchQuery("");
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isSel 
                    ? "bg-zinc-900 border border-zinc-800 text-emerald-400 shadow-md" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4.5 h-4.5" />
                  <span>{tab.name}</span>
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-zinc-900 border border-zinc-800 text-[10px] px-1.5 py-0.5 rounded-full text-zinc-400 font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Dashboard Content view grid */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar select-text bg-[#030303]">
          {loading ? (
            <div className="h-full flex items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-600 animate-pulse">
              Retrieving database nodes...
            </div>
          ) : (
            <>
              {/* Tab 1: Overview Analytics dashboard */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: "Total Views", val: totalVisits, desc: "Unique page accesses", icon: Users, color: "text-emerald-400" },
                      { title: "Active Leads", val: totalLeadsCount, desc: "Hire Me pipeline", icon: Briefcase, color: "text-emerald-400" },
                      { title: "Callback Requests", val: totalCallbacksCount, desc: "Pending schedule bookings", icon: Calendar, color: "text-emerald-400" },
                      { title: "Subscriptions", val: subscribers.length, desc: "Newsletter alerts", icon: FileDown, color: "text-emerald-400" }
                    ].map((card, idx) => (
                      <div key={idx} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3 text-zinc-500">
                          <span className="text-[10px] font-mono uppercase tracking-widest">{card.title}</span>
                          <card.icon className="w-4.5 h-4.5 text-zinc-400" />
                        </div>
                        <div className="text-3xl font-extrabold text-white font-mono">{card.val}</div>
                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">{card.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Charts sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Visitor log line chart */}
                    <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">
                        7-Day Visitor Traffic
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={visitorChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} />
                            <YAxis stroke="#52525b" fontSize={11} tickLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                            <Line type="monotone" dataKey="visits" stroke="#00ff66" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Device distribution donut style bar chart */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">
                        Device Distribution
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={deviceChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} />
                            <YAxis stroke="#52525b" fontSize={11} tickLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                            <Bar dataKey="value" fill="#00ff66" radius={[4, 4, 0, 0]}>
                              {deviceChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? "#00ff66" : index === 1 ? "#3b82f6" : "#f59e0b"} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Budget distribution bar chart */}
                    <div className="lg:col-span-3 bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">
                        Lead Budget Distribution
                      </h3>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={budgetChartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                            <XAxis type="number" stroke="#52525b" fontSize={11} allowDecimals={false} />
                            <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={11} width={80} />
                            <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                            <Bar dataKey="count" fill="#00ff66" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Leads List view */}
              {activeTab === "leads" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 w-full max-w-sm">
                      <Search className="w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search leads by client name, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs text-white w-full"
                      />
                    </div>
                    <button
                      onClick={() => exportToCSV(leads, "lead_dossiers")}
                      className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-inner">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono select-text border-collapse">
                        <thead>
                          <tr className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                            <th className="p-4">Name</th>
                            <th className="p-4">Project Type</th>
                            <th className="p-4">Budget</th>
                            <th className="p-4">Timeline</th>
                            <th className="p-4">Requirements</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {leads
                            .filter((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.email.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((l) => (
                              <tr key={l.id} className="hover:bg-zinc-900/20 text-zinc-300">
                                <td className="p-4 font-sans">
                                  <div className="font-bold text-white">{l.name}</div>
                                  <div className="text-[10px] text-zinc-500">{l.email}</div>
                                  <div className="text-[9px] text-zinc-600 italic mt-0.5">{l.company || "No Company"}</div>
                                </td>
                                <td className="p-4 text-emerald-400">{l.projectType}</td>
                                <td className="p-4 text-zinc-200">{l.budget}</td>
                                <td className="p-4">{l.timeline}</td>
                                <td className="p-4 max-w-[200px] truncate font-sans text-zinc-400" title={l.requirements}>
                                  {l.requirements || "No specifications"}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                                    l.status === "PENDING" ? "bg-amber-950/20 border-amber-800 text-amber-400" : "bg-emerald-950/20 border-emerald-800 text-emerald-400"
                                  }`}>
                                    {l.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                  {l.status === "PENDING" && (
                                    <button
                                      onClick={() => updateStatus("lead", l.id, "CONTACTED")}
                                      className="p-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-400 cursor-pointer"
                                      title="Mark Contacted"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteRecord("lead", l.id)}
                                    className="p-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 cursor-pointer"
                                    title="Delete Log"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Callbacks List view */}
              {activeTab === "callbacks" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 w-full max-w-sm">
                      <Search className="w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search callbacks by client name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs text-white w-full"
                      />
                    </div>
                    <button
                      onClick={() => exportToCSV(callbacks, "callback_appointments")}
                      className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-inner">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono select-text border-collapse">
                        <thead>
                          <tr className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                            <th className="p-4">Client</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Preferred Time</th>
                            <th className="p-4">Message</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {callbacks
                            .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((c) => (
                              <tr key={c.id} className="hover:bg-zinc-900/20 text-zinc-300">
                                <td className="p-4 font-sans">
                                  <div className="font-bold text-white">{c.name}</div>
                                  <div className="text-[10px] text-zinc-500">{c.email}</div>
                                </td>
                                <td className="p-4 text-emerald-400 font-bold">{c.phone}</td>
                                <td className="p-4">{c.timeSlot}</td>
                                <td className="p-4 max-w-[200px] truncate font-sans text-zinc-400" title={c.message}>
                                  {c.message || "No comments"}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                                    c.status === "PENDING" ? "bg-amber-950/20 border-amber-800 text-amber-400" : "bg-emerald-950/20 border-emerald-800 text-emerald-400"
                                  }`}>
                                    {c.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                  {c.status === "PENDING" && (
                                    <button
                                      onClick={() => updateStatus("callback", c.id, "CALLED")}
                                      className="p-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-400 cursor-pointer"
                                      title="Mark Completed"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteRecord("callback", c.id)}
                                    className="p-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 cursor-pointer"
                                    title="Delete Log"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Messages List view */}
              {activeTab === "messages" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 w-full max-w-sm">
                    <Search className="w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search messages by sender name, subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs text-white w-full"
                    />
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-inner">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono select-text border-collapse">
                        <thead>
                          <tr className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                            <th className="p-4">Sender</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Message Body</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {messages
                            .filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.subject.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((m) => (
                              <tr key={m.id} className="hover:bg-zinc-900/20 text-zinc-300">
                                <td className="p-4 font-sans">
                                  <div className="font-bold text-white">{m.name}</div>
                                  <div className="text-[10px] text-zinc-500">{m.email}</div>
                                </td>
                                <td className="p-4 text-emerald-400 font-bold">{m.subject}</td>
                                <td className="p-4 font-sans text-zinc-400 max-w-xs break-words">
                                  {m.message}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                                    m.status === "UNREAD" ? "bg-red-950/20 border-red-800 text-red-400 animate-pulse" : "bg-zinc-900 border-zinc-800 text-zinc-400"
                                  }`}>
                                    {m.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                  {m.status === "UNREAD" && (
                                    <button
                                      onClick={() => updateStatus("message", m.id, "READ")}
                                      className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-zinc-400 cursor-pointer"
                                      title="Mark Read"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteRecord("message", m.id)}
                                    className="p-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 cursor-pointer"
                                    title="Delete Log"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Subscribers List view */}
              {activeTab === "subscribers" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 w-full max-w-sm">
                      <Search className="w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs text-white w-full"
                      />
                    </div>
                    <button
                      onClick={() => exportToCSV(subscribers, "newsletter_subscribers")}
                      className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-inner max-w-xl">
                    <table className="w-full text-left text-xs font-mono select-text border-collapse">
                      <thead>
                        <tr className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                          <th className="p-4">Email Address</th>
                          <th className="p-4">Subscribed Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {subscribers
                          .filter((s) => s.email.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((s) => (
                            <tr key={s.id} className="hover:bg-zinc-900/20 text-zinc-300">
                              <td className="p-4 text-white font-bold">{s.email}</td>
                              <td className="p-4">{new Date(s.createdAt).toLocaleDateString()}</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => deleteRecord("subscriber", s.id)}
                                  className="p-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 cursor-pointer"
                                  title="Unsubscribe Client"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 6: Visitor Logs */}
              {activeTab === "visitors" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                    Real-time Traffic Tracking
                  </h3>
                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-inner">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono select-text border-collapse">
                        <thead>
                          <tr className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">IP Address</th>
                            <th className="p-4">Device</th>
                            <th className="p-4">Platform OS</th>
                            <th className="p-4">Path Visited</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {visitors.slice(0, 100).map((v) => (
                            <tr key={v.id} className="hover:bg-zinc-900/10 text-zinc-400">
                              <td className="p-4 text-zinc-500">{new Date(v.createdAt).toLocaleString()}</td>
                              <td className="p-4 text-zinc-300">{v.ip}</td>
                              <td className={`p-4 font-bold ${
                                v.device === "Mobile" ? "text-blue-400" : v.device === "Tablet" ? "text-amber-400" : "text-emerald-400"
                              }`}>{v.device}</td>
                              <td className="p-4 font-sans text-zinc-300">{v.os} ({v.browser})</td>
                              <td className="p-4 text-emerald-500 font-bold">{v.path}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 7: Integrations Sync Settings */}
              {activeTab === "integrations" && (
                <div className="space-y-6 max-w-xl">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-4">
                      Coding Profiles Integrations Control
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                      Connect your online profiles. If direct API fetches are rate-limited, the dashboard uses seeded fallback metrics automatically.
                    </p>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">GitHub Username</label>
                      <input
                        type="text"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="e.g. HemantRaj-2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">LeetCode Username</label>
                      <input
                        type="text"
                        value={leetcode}
                        onChange={(e) => setLeetcode(e.target.value)}
                        placeholder="e.g. HemantRaj-2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Codeforces Handle</label>
                      <input
                        type="text"
                        value={codeforces}
                        onChange={(e) => setCodeforces(e.target.value)}
                        placeholder="e.g. HemantRaj-2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">CodeChef Handle</label>
                      <input
                        type="text"
                        value={codechef}
                        onChange={(e) => setCodechef(e.target.value)}
                        placeholder="e.g. hemant_2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">GeeksforGeeks Handle</label>
                      <input
                        type="text"
                        value={geeksforgeeks}
                        onChange={(e) => setGeeksforgeeks(e.target.value)}
                        placeholder="e.g. hemantraj2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => handleSaveIntegrations(false)}
                        disabled={saveLoading}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white font-bold py-3.5 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs"
                      >
                        {saveLoading ? "Saving..." : "Save Config"}
                      </button>

                      <button
                        onClick={() => handleSaveIntegrations(true)}
                        disabled={saveLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-bold py-3.5 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                      >
                        <RefreshCw className={`w-4 h-4 ${saveLoading ? "animate-spin" : ""}`} />
                        <span>{saveLoading ? "Syncing..." : "Sync Database Now"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
