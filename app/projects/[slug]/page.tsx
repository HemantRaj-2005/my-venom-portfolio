import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { 
  ArrowLeft, Globe, Cpu, Server, Database, 
  GitBranch, Code2, AlertTriangle, ShieldCheck, Mail 
} from "lucide-react";
import ProjectInquiryForm from "@/components/ProjectInquiryForm";
import { connection } from "next/server";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.project.findUnique({ where: { slug } });

  if (!project) return { title: "Dossier Not Found" };

  return {
    title: `${project.title} - AI Engineer Portfolio`,
    description: project.seoDesc || project.overview,
    openGraph: {
      title: project.seoTitle || project.title,
      description: project.seoDesc || project.overview,
      images: project.gallery.length > 0 ? [{ url: project.gallery[0] }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  await connection();
  const { slug } = await params;
  
  // Query project dossier
  const project = await db.project.findUnique({
    where: { slug }
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-sans pb-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/2 rounded-full blur-[140px] top-1/4 right-[-100px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-red-500/2 rounded-full blur-[120px] bottom-1/4 left-[-100px] pointer-events-none" />

      {/* Hero Banner Grid */}
      <div className="relative h-[40vh] md:h-[50vh] bg-zinc-950 border-b border-zinc-900 select-none">
        <Image
          src={project.gallery[0] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=60"}
          alt={project.title}
          fill
          className="object-cover opacity-35"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/30 to-black/60 pointer-events-none" />

        {/* Floating Back Navigation */}
        <div className="absolute top-8 left-6 md:left-12 z-20">
          <Link
            href="/projects"
            className="flex items-center gap-2 border border-zinc-800 bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Index</span>
          </Link>
        </div>

        {/* Hero Title details */}
        <div className="absolute bottom-8 left-6 md:left-12 z-10 max-w-4xl">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Project Dossier: {project.id}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Primary Layout Grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Dossier Details */}
        <div className="lg:col-span-2 space-y-10">
          {/* Section 1: Overview */}
          <section className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-4">
              Overview dossier
            </h2>
            <p className="text-zinc-300 leading-relaxed font-sans text-sm md:text-base">
              {project.overview}
            </p>

            {/* CTAs Button Grid */}
            <div className="flex flex-wrap gap-3 mt-8">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 font-semibold text-white px-5 py-3 rounded-xl shadow-lg shadow-emerald-950/20 transition-all cursor-pointer text-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span>Launch Live Site</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 font-semibold text-zinc-300 hover:text-white px-5 py-3 rounded-xl transition-all cursor-pointer text-sm"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  <span>Inspect Code</span>
                </a>
              )}
            </div>
          </section>

          {/* Section 2: Features Grid */}
          <section className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
              Integration Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.features.map((feature: string, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-3 p-4 rounded-xl border border-zinc-900 bg-zinc-950"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Architecture Diagram */}
          <section className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
              System Architecture Diagram
            </h2>
            
            {/* Visual HTML Diagram */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-xl border border-zinc-900 bg-black/60 relative font-mono text-[11px] tracking-wide text-zinc-400">
              
              {/* Box 1: Client Gateway */}
              <div className="flex flex-col items-center justify-center p-4 w-36 bg-zinc-900 border border-zinc-800 rounded-lg text-center gap-1 shadow-md">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white uppercase text-[10px]">Client UI</span>
                <span className="text-[9px] text-zinc-500">React 19 / Canvas</span>
              </div>

              {/* Glowing Arrow Path Connector */}
              <div className="h-6 w-0.5 md:h-0.5 md:w-10 bg-emerald-500/40 relative flex items-center justify-center">
                <div className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              </div>

              {/* Box 2: Next.js Middle Server */}
              <div className="flex flex-col items-center justify-center p-4 w-36 bg-zinc-900 border border-zinc-800 rounded-lg text-center gap-1 shadow-md relative">
                <div className="absolute top-[-8px] right-2 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded">JWT</div>
                <Server className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white uppercase text-[10px]">API Router</span>
                <span className="text-[9px] text-zinc-500">Next.js Edge / Cache</span>
              </div>

              {/* Connector */}
              <div className="h-6 w-0.5 md:h-0.5 md:w-10 bg-emerald-500/40 relative flex items-center justify-center">
                <div className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              </div>

              {/* Box 3: Data Core */}
              <div className="flex flex-col items-center justify-center p-4 w-36 bg-zinc-900 border border-zinc-800 rounded-lg text-center gap-1 shadow-md">
                <Database className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white uppercase text-[10px]">Data Core</span>
                <span className="text-[9px] text-zinc-500">Prisma / MongoDB</span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 font-sans leading-relaxed mt-4">
              <strong>Diagram explanation:</strong> {project.architecture}
            </p>
          </section>

          {/* Section 4: Schema & API flow details */}
          <section className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
              Database Model & API Mapping
            </h2>
            <div className="space-y-6 font-mono text-xs">
              <div className="p-4 rounded-xl border border-zinc-900 bg-black/40">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2 uppercase text-[10px]">
                  <GitBranch className="w-4 h-4" /> Database Schema Mappings
                </div>
                <div className="text-zinc-400 text-[11px] leading-relaxed whitespace-pre-wrap">
                  {project.schemaUrl}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-900 bg-black/40">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2 uppercase text-[10px]">
                  <Code2 className="w-4 h-4" /> API Endpoint Flowchart
                </div>
                <div className="text-zinc-400 text-[11px] leading-relaxed">
                  {project.apiFlow}
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Challenges faced */}
          {project.challenges && (
            <section className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-widest mb-4">
                <AlertTriangle className="w-4.5 h-4.5" /> Engineering Challenges
              </div>
              <p className="text-zinc-300 leading-relaxed font-sans text-sm border-l-2 border-red-500 pl-4">
                {project.challenges}
              </p>
            </section>
          )}

          {/* Section 6: Screenshots Gallery */}
          {project.gallery.length > 1 && (
            <section className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
                System Interface Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.gallery.slice(1).map((image: string, idx: number) => (
                  <div key={idx} className="relative h-44 rounded-xl border border-zinc-900 overflow-hidden bg-zinc-900 shadow">
                    <Image
                      src={image}
                      alt={`${project.title} Screenshot ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Meta Specifications & Prefilled Inquiry */}
        <div className="space-y-6">
          {/* Tech Stack widget */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-4">
              Intelligence Parameters
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-850 text-[10px] font-mono text-zinc-300 uppercase tracking-wide"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="mt-6 space-y-4 border-t border-zinc-900 pt-4 font-mono text-[10px] tracking-wide text-zinc-500 uppercase">
              <div className="flex justify-between">
                <span>Core Target OS:</span>
                <span className="text-white font-bold">Linux / Docker</span>
              </div>
              <div className="flex justify-between">
                <span>Deployment host:</span>
                <span className="text-white font-bold">{project.deployment || "Vercel"}</span>
              </div>
            </div>
          </div>

          {/* Embedded Prefilled Lead Inquiry Form */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 relative">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400/20 to-emerald-500/20 rounded-t-2xl" />
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
              <Mail className="w-4 h-4" /> Project Inquiry
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Request Similar System</h3>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed mb-6">
              Fill out this fast dossier request to schedule a calendar callback matching your budget parameters for a system similar to {project.title}.
            </p>
            <ProjectInquiryForm initialProjectTitle={project.title} />
          </div>
        </div>

      </div>
    </div>
  );
}
