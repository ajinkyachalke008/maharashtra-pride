import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import CrossCaseTable from '@/components/fraudlens/intelligence/CrossCaseTable';
import SyndicateGraph from '@/components/fraudlens/intelligence/SyndicateGraph';
import { Network, Activity, ShieldAlert, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/fraudlens/intelligence')({
  component: GlobalIntelligenceDashboard,
});

const MOCK_LINKS_DATA = {
  total_syndicates_detected: 4,
  links: [
    { account: 'ACC-1001', total_volume: 4500000, txn_count: 34, linked_cases: [{ id: 'CASE-2026-A8F3', case_number: 'CASE-2026-A8F3' }, { id: 'CASE-2026-B1D7', case_number: 'CASE-2026-B1D7' }] },
    { account: 'ACC-3091', total_volume: 1250000, txn_count: 12, linked_cases: [{ id: 'CASE-2026-B1D7', case_number: 'CASE-2026-B1D7' }, { id: 'CASE-2026-C9E2', case_number: 'CASE-2026-C9E2' }] }
  ]
};

const MOCK_GRAPH_DATA = {
  nodes: [
    { id: 'c1', label: 'CASE-A8F3', type: 'case_cluster', riskScore: 0.9 },
    { id: 'c2', label: 'CASE-B1D7', type: 'case_cluster', riskScore: 0.8 },
    { id: 'c3', label: 'CASE-C9E2', type: 'case_cluster', riskScore: 0.5 },
    { id: 's1', label: 'ACC-1001', type: 'shared_suspect', riskScore: 0.95 },
    { id: 's2', label: 'ACC-3091', type: 'shared_suspect', riskScore: 0.88 },
  ],
  links: [
    { source: 's1', target: 'c1', type: 'involved_in' },
    { source: 's1', target: 'c2', type: 'involved_in' },
    { source: 's2', target: 'c2', type: 'involved_in' },
    { source: 's2', target: 'c3', type: 'involved_in' },
  ]
};

function GlobalIntelligenceDashboard() {
  const [linksLoading, setLinksLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLinksLoading(false), 600);
    setTimeout(() => setGraphLoading(false), 800);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto bg-background-base p-6 gap-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-warning-500/10 rounded-xl border border-warning-500/20">
          <Network className="w-8 h-8 text-warning-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Global Criminal Intelligence</h1>
          <p className="text-white/40">Detecting multi-case syndicate overlaps and shared money mules.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-background-surface border border-white/5 rounded-xl p-6">
          <h3 className="text-white/40 font-mono text-sm uppercase tracking-wider mb-2">Syndicates Detected</h3>
          <div className="text-4xl font-bold text-white">
            {linksLoading ? <Loader2 className="animate-spin w-8 h-8" /> : MOCK_LINKS_DATA.total_syndicates_detected}
          </div>
        </div>
        <div className="bg-background-surface border border-white/5 rounded-xl p-6">
          <h3 className="text-white/40 font-mono text-sm uppercase tracking-wider mb-2">Total Mules Flagged</h3>
          <div className="text-4xl font-bold text-warning-400">
            {linksLoading ? <Loader2 className="animate-spin w-8 h-8" /> : MOCK_LINKS_DATA.links.length}
          </div>
        </div>
        <div className="bg-background-surface border border-white/5 rounded-xl p-6">
          <h3 className="text-white/40 font-mono text-sm uppercase tracking-wider mb-2">Network Risk Status</h3>
          <div className="flex items-center gap-2 text-red-400">
            <Activity className="w-8 h-8" />
            <span className="text-4xl font-bold">CRITICAL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-primary-400" />
            Macro Syndicate Graph
          </h2>
          <p className="text-sm text-white/40">Visualizing the shared nodes connecting isolated criminal cases.</p>
          {graphLoading ? (
             <div className="w-full h-[600px] bg-background-surface rounded-xl border border-white/5 flex items-center justify-center">
               <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
             </div>
          ) : (
            <SyndicateGraph nodes={MOCK_GRAPH_DATA.nodes as any} links={MOCK_GRAPH_DATA.links as any} />
          )}
        </div>
        
        <div className="space-y-4 xl:col-span-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-warning-400" />
            Shared Mules
          </h2>
          <p className="text-sm text-white/40">Accounts operating across multiple jurisdictions.</p>
          {linksLoading ? (
            <div className="w-full h-64 bg-background-surface rounded-xl border border-white/5 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : (
            <CrossCaseTable links={MOCK_LINKS_DATA.links} />
          )}
        </div>
      </div>
    </div>
  );
}
