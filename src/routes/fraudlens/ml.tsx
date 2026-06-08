import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Brain, Activity, Target, Network, Zap, Loader2, AlertTriangle } from 'lucide-react';
import { useStreamMetrics } from '@/hooks/useDashboardData';

export const Route = createFileRoute('/fraudlens/ml')({
  component: MachineLearningDashboard,
});

function MachineLearningDashboard() {
  const { data: metrics, isLoading, isError } = useStreamMetrics();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-400 tracking-tight">MACHINE LEARNING CORE</h1>
          <p className="text-white/40 mt-1 font-mono text-sm">Global Model Health & Syndicate Clustering</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded font-mono text-sm tracking-wide transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          <Zap className="w-4 h-4" /> Trigger Global Retrain
        </button>
      </div>

      {isError && (
        <div className="bg-danger-500/10 border border-danger-500/30 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-danger-400" />
          <div>
            <p className="font-mono text-sm text-danger-400 font-bold">Stream Disconnected</p>
            <p className="font-mono text-xs text-danger-400/80">Metrics unavailable. The ML telemetry pipeline is unreachable.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="FRAUDSAGE GNN" status={isError ? "Offline" : "Online"} value={isError ? "N/A" : "98.2%"} subtitle={isError ? "Model unreachable" : "Validation Accuracy"} icon={<Network />} />
        <MetricCard 
          title="ISOLATION FOREST" 
          status={isError ? "Offline" : isLoading ? "Loading" : "Online"} 
          value={isError || metrics?.messages_processed === null ? "N/A" : metrics?.messages_processed?.toLocaleString() || "0"} 
          subtitle="Txns Scanned Today" 
          icon={isLoading ? <Loader2 className="animate-spin" /> : <Activity />} 
        />
        <MetricCard 
          title="K-MEANS SYNDICATES" 
          status={isError ? "Offline" : "Online"} 
          value={isError || metrics?.high_risk_flags === null ? "N/A" : metrics?.high_risk_flags || "0"} 
          subtitle="Active Threat Flags" 
          icon={<Target />} 
        />
        <MetricCard 
          title="STREAM LATENCY" 
          status={!isError && metrics && metrics.active_websocket_clients !== null ? "Live" : "Offline"} 
          value={!isError && metrics && metrics.active_websocket_clients !== null ? "< 50ms" : "N/A"} 
          subtitle="WS Process Time" 
          icon={<Brain />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-background-card border border-white/5 rounded-lg p-6 shadow-xl">
          <h2 className="text-lg font-display text-primary-400 mb-4 border-b border-white/5 pb-2">LATENT SPACE CLUSTERING (t-SNE Projection)</h2>
          <div className="h-64 bg-background-base rounded border border-white/5 flex items-center justify-center text-white/40 font-mono relative overflow-hidden">
            {/* Placeholder for actual D3/Canvas t-SNE plot */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #3b82f6 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10 flex flex-col items-center">
              <Network className="w-8 h-8 mb-2 opacity-50" />
              <span>Awaiting WebSocket Embedding Stream</span>
            </div>
            
            {/* Mock Clusters */}
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-danger-500/20 blur-xl"></div>
            <div className="absolute bottom-10 right-20 w-32 h-32 rounded-full bg-warning-500/20 blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-primary-500/20 blur-xl"></div>
          </div>
        </div>

        <div className="bg-background-card border border-white/5 rounded-lg p-6 shadow-xl">
          <h2 className="text-lg font-display text-primary-400 mb-4 border-b border-white/5 pb-2">ACTIVE SYNDICATES</h2>
          <div className="space-y-4">
            <SyndicateRow id="SYN-101" risk="High" nodes={145} origin="Cross-border Mules" />
            <SyndicateRow id="SYN-102" risk="Critical" nodes={32} origin="Phishing Shells" />
            <SyndicateRow id="SYN-103" risk="Medium" nodes={89} origin="Crypto Layering" />
            <SyndicateRow id="SYN-104" risk="Low" nodes={12} origin="Unverified" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  status: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}

function MetricCard({ title, status, value, subtitle, icon }: MetricCardProps) {
  return (
    <div className="bg-background-card border border-white/5 rounded-lg p-4 flex flex-col hover:border-primary-500/50 transition-colors shadow-lg group">
      <div className="flex justify-between items-start mb-4">
        <div className="text-primary-400 group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[10px] font-mono bg-safe-500/10 text-safe-400 px-2 py-0.5 rounded border border-safe-500/20">{status}</span>
      </div>
      <div className="text-2xl font-display text-white">{value}</div>
      <div className="text-xs text-white/40 font-mono mt-1">{title}</div>
      <div className="text-[10px] text-white/30 mt-2 pt-2 border-t border-white/5">{subtitle}</div>
    </div>
  );
}

interface SyndicateRowProps {
  id: string;
  risk: string;
  nodes: number;
  origin: string;
}

function SyndicateRow({ id, risk, nodes, origin }: SyndicateRowProps) {
  const riskColor = risk === 'Critical' ? 'text-danger-500 bg-danger-500/10 border-danger-500/30' : 
                    risk === 'High' ? 'text-warning-500 bg-warning-500/10 border-warning-500/30' : 
                    risk === 'Medium' ? 'text-primary-400 bg-primary-500/10 border-primary-500/30' : 
                    'text-safe-400 bg-safe-500/10 border-safe-500/30';
  
  return (
    <div className="flex items-center justify-between p-3 bg-background-base rounded border border-white/5 hover:border-white/20 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="font-mono text-primary-300 font-bold">{id}</div>
        <div className="text-sm text-white/60">{nodes} Accounts</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-xs text-white/40 italic hidden sm:block">{origin}</div>
        <div className={`px-2 py-1 rounded text-[10px] font-mono uppercase border ${riskColor}`}>
          {risk}
        </div>
      </div>
    </div>
  );
}
