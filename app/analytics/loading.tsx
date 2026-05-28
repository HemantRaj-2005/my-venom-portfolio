export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-24 px-6 md:px-12 flex flex-col font-sans select-none relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute w-[500px] h-[500px] bg-red-500/2 rounded-full blur-[140px] top-1/4 left-1/4 pointer-events-none" />
      
      {/* Header Skeleton */}
      <div className="max-w-6xl mx-auto w-full mb-12 animate-pulse space-y-4">
        <div className="h-4 w-40 bg-zinc-900 rounded border border-zinc-800" />
        <div className="h-10 w-96 bg-zinc-900 rounded" />
        <div className="h-4 w-120 bg-zinc-900 rounded" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Left Column: Aura Card */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 h-96 animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-4 w-20 bg-zinc-900 rounded" />
            <div className="h-6 w-12 bg-zinc-900 rounded" />
          </div>
          <div className="mx-auto w-24 h-24 rounded-full bg-zinc-900" />
          <div className="h-6 w-40 mx-auto bg-zinc-900 rounded" />
          <div className="space-y-2 mt-8">
            <div className="h-4 w-full bg-zinc-900 rounded" />
            <div className="h-4 w-5/6 bg-zinc-900 rounded" />
          </div>
        </div>

        {/* Center/Right: Charts Grid */}
        <div className="lg:col-span-2 space-y-8 animate-pulse">
          <div className="flex gap-2 border-b border-zinc-900 pb-4">
            <div className="h-8 w-24 bg-zinc-900 rounded-lg" />
            <div className="h-8 w-24 bg-zinc-900 rounded-lg" />
            <div className="h-8 w-24 bg-zinc-900 rounded-lg" />
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 h-80" />
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 h-48" />
        </div>
      </div>
    </div>
  );
}
