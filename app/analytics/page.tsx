"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnalyticsRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/analytics/overview");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-zinc-500">
      Synapsing suit diagnostics telemetry...
    </div>
  );
}
