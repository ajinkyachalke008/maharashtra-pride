import React, { Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Globe } from 'lucide-react';
import BANK_BRANCHES from '@/data/bankBranches';

export const Route = createFileRoute('/fraudlens/map')({
  component: MapPage,
});

// Lazy load Deck.gl map to prevent SSR issues and reduce initial bundle size
const SpatialMap = React.lazy(() => import('@/components/fraudlens/map/SpatialMap'));

function MapPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)] p-4 gap-4 bg-background-base">
      <div className="h-16 bg-background-surface border border-white/5 rounded-lg shadow flex items-center justify-between px-6 shrink-0">
        <div>
          <h1 className="font-display text-xl text-primary-400 font-bold tracking-widest flex items-center gap-3">
            <Globe className="w-6 h-6" />
            GEOSPATIAL INTELLIGENCE
            <span className="text-xs px-2 py-0.5 rounded bg-primary-600/20 text-primary-400">
              DECK.GL ENGINE
            </span>
          </h1>
          <p className="text-xs text-white/40 font-mono mt-1">
            {BANK_BRANCHES.length} registered bank branches across Maharashtra.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-safe-500"></span>
            </span>
            <span className="text-[10px] font-mono text-safe-400 tracking-wider">{BANK_BRANCHES.length} NODES</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-background-surface rounded-xl border border-white/5 text-primary-500 font-mono animate-pulse shadow-lg">
            Loading Spatial Geometry...
          </div>
        }>
          <SpatialMap banks={BANK_BRANCHES} />
        </Suspense>
      </div>
    </div>
  );
}
