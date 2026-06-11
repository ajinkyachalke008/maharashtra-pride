import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import CrossCaseTable from '@/components/fraudlens/intelligence/CrossCaseTable';
import SyndicateGraph from '@/components/fraudlens/intelligence/SyndicateGraph';
import { Network, Activity, ShieldAlert, Loader2, Database } from 'lucide-react';
import { API_BASE_URL } from '../../config';

export const Route = createFileRoute('/fraudlens/intelligence')({
  component: GlobalIntelligenceDashboard,
});

function GlobalIntelligenceDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['intelligence-syndicates'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/v1/intelligence/syndicates`);
      return res.data;
    },
    refetchInterval: 5000 // Refresh every 5s for live intelligence
  });

  const mules = data?.mules || [];
  const syndicates = data?.total_syndicates_detected || 0;
  const engine = data?.engine || 'UNKNOWN';

  // Transform mules into graph nodes for SyndicateGraph
  // This is a basic conversion, ideally backend returns nodes/links format
  const graphNodes = mules.map((m: any) => ({
    id: m.account,
    type: 'account',
    riskScore: 0.9,
    totalVolume: m.volume,
    cases: m.cases
  }));
  
  const graphLinks = mules.flatMap((m: any) => 
    m.cases.map((c: string) => ({
      source: m.account,
      target: c,
      type: 'INVOLVED_IN'
    }))
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto bg-background-base p-6 gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-warning-500/10 rounded-xl border border-warning-500/20">
            <Network className="w-8 h-8 text-warning-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              Legal Enforcement Intelligence
              {engine === 'networkx_portable' && (
                <span className="text-xs px-2 py-0.5 rounded bg-primary-600/20 text-primary-400 font-mono flex items-center gap-1 border border-primary-500/30">
                  <Database className="w-3 h-3" /> PORTABLE MODE
                </span>
              )}
            </h1>
            <p className="text-white/40 text-sm mt-1">Cross-jurisdictional syndicate detection and BNS 2023 legal mappings.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-white/40">v4.0 ACTIVE ENGINE</p>
          <p className="text-sm font-mono text-primary-400 font-bold">{engine.toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-background-surface border border-white/5 rounded-xl p-6">
          <h3 className="text-white/40 font-mono text-sm uppercase tracking-wider mb-2">Syndicates Detected</h3>
          <div className="text-4xl font-bold text-white">
            {isLoading ? <Loader2 className="animate-spin w-8 h-8" /> : syndicates}
          </div>
        </div>
        <div className="bg-background-surface border border-white/5 rounded-xl p-6">
          <h3 className="text-white/40 font-mono text-sm uppercase tracking-wider mb-2">Total Shared Mules</h3>
          <div className="text-4xl font-bold text-warning-400">
            {isLoading ? <Loader2 className="animate-spin w-8 h-8" /> : mules.length}
          </div>
        </div>
        <div className="bg-background-surface border border-white/5 rounded-xl p-6">
          <h3 className="text-white/40 font-mono text-sm uppercase tracking-wider mb-2">Enforcement Mandate</h3>
          <div className="flex items-center gap-2 text-danger-400">
            <ShieldAlert className="w-8 h-8" />
            <span className="text-4xl font-bold font-mono">BNS 2023</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-primary-400" />
            Macro Syndicate Graph
          </h2>
          <p className="text-sm text-white/40">Visualizing the shared nodes connecting isolated criminal cases based on real DB scans.</p>
          {isLoading ? (
             <div className="w-full h-[600px] bg-background-surface rounded-xl border border-white/5 flex items-center justify-center">
               <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
             </div>
          ) : isError ? (
            <div className="w-full h-[600px] bg-background-surface rounded-xl border border-danger-500/20 flex flex-col items-center justify-center text-danger-400 p-6 text-center">
              <ShieldAlert className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-bold">Failed to retrieve intelligence data.</p>
              <p className="text-sm opacity-70 mt-2">Check backend connection. Zero mock data rule enforced.</p>
            </div>
          ) : (
            <SyndicateGraph nodes={graphNodes as any} links={graphLinks as any} />
          )}
        </div>
        
        <div className="space-y-4 xl:col-span-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-warning-400" />
            Actionable Threat Targets
          </h2>
          <p className="text-sm text-white/40">Accounts operating across multiple cases with active BNS 2023 charges.</p>
          {isLoading ? (
            <div className="w-full h-64 bg-background-surface rounded-xl border border-white/5 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : (
            <div className="bg-background-surface border border-white/5 rounded-xl overflow-hidden flex flex-col max-h-[600px]">
              {mules.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm">
                  No active syndicates detected in the current intelligence stream.
                </div>
              ) : (
                <div className="overflow-y-auto p-4 space-y-4">
                  {mules.map((mule: any, idx: number) => (
                    <div key={idx} className="bg-background-base p-4 rounded-lg border border-white/5 border-l-4 border-l-warning-500">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-white font-bold">{mule.account}</span>
                        <span className="text-xs text-primary-400 font-mono">₹{mule.volume.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-xs text-white/40 mb-3">
                        Linked Cases: {mule.cases.join(', ')}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {mule.legal_sections.map((section: string, sIdx: number) => (
                          <span key={sIdx} className="text-[10px] px-2 py-1 bg-danger-500/10 text-danger-400 rounded-sm font-mono border border-danger-500/20">
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
