import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft, Star, FileText, GitBranch, ShoppingCart } from "lucide-react";
import RatingForm from "@/components/RatingForm";
import { connection } from "next/server";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

function formatLoggedDate(createdAt: Date | string | null | undefined): string {
  if (!createdAt) return "";
  if (typeof createdAt === "string") return createdAt.slice(0, 10);
  return createdAt.toISOString().slice(0, 10);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  await connection();
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title} - Stark-Tech Code Marketplace`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  await connection();
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
    include: { ratings: true },
  });

  if (!product) {
    notFound();
  }

  const ratings = product.ratings || [];
  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((acc, r) => acc + (r.rating ?? 0), 0) / ratings.length).toFixed(1)
      : "5.0";

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans pb-24 relative overflow-hidden">
      <div className="absolute w-[450px] h-[450px] bg-[#00E5FF]/2 rounded-full blur-[140px] top-1/4 right-[-100px] pointer-events-none" />

      <div className="relative h-[30vh] bg-zinc-950 border-b border-[#00E5FF]/15 select-none">
        <Image
          src={product.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=60"}
          alt={product.title}
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-black/60 pointer-events-none" />

        <div className="absolute top-8 left-6 md:left-12 z-20">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 border border-zinc-800 bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Marketplace</span>
          </Link>
        </div>

        <div className="absolute bottom-8 left-6 md:left-12 z-10 max-w-4xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] bg-[#00E5FF]/5 border border-[#00E5FF]/20 px-2.5 py-0.5 rounded">
            {product.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-white mt-4 neon-glow-red">
            {product.title}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-4">
              Asset description
            </h2>
            <p className="text-zinc-300 leading-relaxed font-sans text-sm md:text-base">{product.description}</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {product.features?.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-850 text-[10px] font-mono text-zinc-400 uppercase tracking-wide"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 text-[#00E5FF] font-mono text-xs uppercase tracking-widest mb-4">
              <FileText className="w-4.5 h-4.5" /> Licensing Agreement
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-sm border-l-2 border-[#00E5FF] pl-4">
              {product.licensing ||
                "Standard Developer Single License. Re-distribution of source codes is forbidden. Custom integrations and commercial SaaS deployment are permitted."}
            </p>
          </section>

          <section className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-6">
              Visitor Reviews
            </h2>

            <div className="flex items-center gap-6 mb-8 p-4 rounded-xl border border-[#00E5FF]/15 bg-black/40">
              <div className="text-center shrink-0">
                <div className="text-4xl font-extrabold text-white font-mono">{averageRating}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-mono">Out of 5</div>
              </div>
              <div className="h-10 w-[1px] bg-zinc-900" />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(Number(averageRating)) ? "fill-amber-400" : "text-zinc-800"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                  Based on {ratings.length} database logs
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-72 overflow-y-auto custom-scrollbar pr-2 mb-8">
              {ratings.length === 0 ? (
                <div className="text-center font-mono text-[10px] text-zinc-600 uppercase tracking-widest py-6">
                  No review records synced yet
                </div>
              ) : (
                ratings.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl border border-zinc-900 bg-zinc-950 space-y-2">
                    <div className="flex justify-between items-center select-none">
                      <span className="text-xs font-bold text-white font-sans">{review.author}</span>
                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-800"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      {review.comment || "Rated without comments."}
                    </p>
                    <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                      Logged: {formatLoggedDate(review.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-zinc-900 pt-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">Submit Review Log</h3>
              <RatingForm productId={product.id || ""} />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 relative">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#E11D2E]/20 via-[#00E5FF]/20 to-[#E11D2E]/20 rounded-t-2xl" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">Checkout Gateway</h3>
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Pricing Matrix</span>
              <div className="text-4xl font-extrabold text-white font-mono">${(product.price ?? 0).toFixed(2)}</div>
            </div>
            <div className="mt-8 space-y-3">
              <a
                href={product.demoUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#E11D2E] hover:bg-[#c11524] font-bold text-white py-3.5 rounded-xl shadow-lg shadow-red-950/20 transition-all cursor-pointer text-xs uppercase tracking-widest active:scale-95"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                <span>Acquire Asset</span>
              </a>
              {product.githubUrl && (
                <a
                  href={product.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 font-bold text-zinc-300 hover:text-white py-3.5 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-widest active:scale-95"
                >
                  <GitBranch className="w-4.5 h-4.5" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
            <div className="mt-6 border-t border-zinc-900 pt-4 flex flex-col gap-2 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
              <div>Secure Payment Processing</div>
              <div>Instant ZIP/Git Access Link</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
