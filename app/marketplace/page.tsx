"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ArrowRight, ShoppingCart, ShoppingBag, Search, ShieldCheck } from "lucide-react";

interface Rating {
  id: string;
  rating: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isFeatured: boolean;
  ratings: Rating[];
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = ["All", "SaaS Template", "UI Kit", "AI Tool", "API", "Full Stack"];

  useEffect(() => {
    try {
      fetch("/api/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/marketplace" }),
      });
    } catch (e) {}

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getAverageRating = (ratings: Rating[]) => {
    if (!ratings || ratings.length === 0) return 5; // Default to 5 stars
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const fitsFilter = (prod: Product, filter: string) => {
    if (filter === "All") return true;
    return prod.category.toLowerCase().includes(filter.toLowerCase()) || filter.toLowerCase().includes(prod.category.toLowerCase());
  };

  const filteredProducts = products.filter(
    (p) =>
      fitsFilter(p, selectedFilter) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const marketplaceSchema = products.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Stark-Tech Code Marketplace - SaaS templates & codebases",
    "description": "Acquire high-quality production-grade SaaS boilerplates, neural model weights, and custom UI kits.",
    "url": "https://hemantraj.dev/marketplace",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.map((prod, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://hemantraj.dev/marketplace/${prod.id}`,
        "name": prod.title,
        "description": prod.description
      }))
    }
  } : null;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-24 px-6 md:px-12 relative overflow-hidden font-sans">
      {marketplaceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(marketplaceSchema) }}
        />
      )}
      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#00E5FF]/2 rounded-full blur-[140px] top-1/3 left-1/3 pointer-events-none" />

      {/* Header section */}
      <div className="max-w-6xl mx-auto mb-16 select-none">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#00E5FF] font-mono text-xs uppercase tracking-widest">
            <ShoppingBag className="w-4 h-4" /> DIGITAL ASSETS PLATFORM
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-white mt-2 neon-glow-red">
            Stark-Tech Code Marketplace
          </h1>
          <p className="text-sm text-zinc-500 max-w-xl leading-relaxed mt-2 font-sans">
            Acquire production-grade SaaS boilerplates, neural model API access weights, custom UI kits, and Web3 dashboards pre-engineered for rapid deployment.
          </p>
        </div>
      </div>

      {/* Filters and search box */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-[#00E5FF]/15 pb-8 select-none">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => {
            const isSel = selectedFilter === filter;
            return (
              <button
                key={index}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isSel
                    ? "bg-[#E11D2E] text-white border border-[#E11D2E]/30 shadow-md shadow-red-950/20 scale-105"
                    : "bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950/80 w-full max-w-xs backdrop-blur">
          <Search className="w-4.5 h-4.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search templates, plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-700 w-full font-mono"
          />
        </div>
      </div>

      {/* Featured Products Showcase */}
      {selectedFilter === "All" && searchQuery === "" && products.some(p => p.isFeatured) && (
        <div className="max-w-6xl mx-auto mb-16 select-none">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#00E5FF] mb-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Recommended Core Deployments
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products
              .filter(p => p.isFeatured)
              .slice(0, 2)
              .map((prod) => (
                <div
                  key={prod.id}
                  className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-[#00E5FF]/30 transition-all duration-300 shadow-xl shadow-black/80 group"
                >
                  <div className="w-full md:w-44 h-44 relative rounded-xl overflow-hidden shrink-0 bg-zinc-900">
                    <Image
                      src={prod.image}
                      alt={`Featured SaaS template thumbnail: ${prod.title}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] bg-[#00E5FF]/5 border border-[#00E5FF]/20 px-2.5 py-0.5 rounded">
                          {prod.category}
                        </span>
                        <div className="text-lg font-black text-white font-mono">${prod.price.toFixed(2)}</div>
                      </div>
                      <h2 className="text-base font-bold text-white mt-3 group-hover:text-[#00E5FF] transition-colors">
                        {prod.title}
                      </h2>
                      <p className="text-xs text-zinc-400 mt-2 font-sans line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6 border-t border-zinc-800 pt-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-mono text-zinc-300">{getAverageRating(prod.ratings)}</span>
                        <span className="text-[10px] text-zinc-500">({prod.ratings?.length || 0} reviews)</span>
                      </div>
                      
                      <Link
                        href={`/marketplace/${prod.id}`}
                        className="flex items-center gap-1 text-xs font-mono text-zinc-400 group-hover:text-[#00E5FF] font-bold transition-all uppercase tracking-wider cursor-pointer"
                      >
                        <span>Buy Asset</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Grid of marketplace products */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-zinc-600 animate-pulse">
            Loading products index...
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-zinc-650">
            No records available
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-zinc-700">
            No matching products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden hover:border-[#00E5FF]/30 transition-all duration-300 shadow-lg shadow-black/50 group flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 relative bg-zinc-900 overflow-hidden">
                    <Image
                      src={prod.image}
                      alt={`Developer code asset preview: ${prod.title}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-black/80 border border-zinc-800 rounded px-2 py-0.5 text-[9px] font-mono text-[#00E5FF] uppercase tracking-widest backdrop-blur">
                      {prod.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start gap-4">
                    <h2 className="text-sm font-bold text-white group-hover:text-[#00E5FF] transition-colors leading-relaxed">
                      {prod.title}
                    </h2>
                      <div className="text-sm font-bold text-[#00E5FF] font-mono">${prod.price.toFixed(2)}</div>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 font-sans line-clamp-3 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-zinc-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-mono text-zinc-300">{getAverageRating(prod.ratings)}</span>
                  </div>
                  
                  <Link
                    href={`/marketplace/${prod.id}`}
                    className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 group-hover:text-[#00E5FF] font-bold transition-all uppercase tracking-widest cursor-pointer"
                  >
                    <span>Inspect License</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
