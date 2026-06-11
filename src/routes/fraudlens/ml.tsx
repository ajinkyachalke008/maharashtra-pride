import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Brain, Activity, Target, Network, Zap, Loader2, AlertTriangle } from 'lucide-react';
import { useStreamMetrics, useLatentSpace, useSyndicates, LatentNode } from '@/hooks/useDashboardData';

export const Route = createFileRoute('/fraudlens/ml')({
  component: MachineLearningDashboard,
});

function MachineLearningDashboard() {
  const { data: metrics, isLoading, isError } = useStreamMetrics();
  const { data: latentData, isLoading: isLatentLoading } = useLatentSpace();
  const { data: syndicateData, isLoading: isSyndicatesLoading } = useSyndicates();

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
            {isLatentLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin mb-2 opacity-50" />
                <span>Computing Layout...</span>
              </div>
            ) : (
              <LatentSpacePlot nodes={latentData?.nodes || []} />
            )}
          </div>
        </div>

        <div className="bg-background-card border border-white/5 rounded-lg p-6 shadow-xl">
          <h2 className="text-lg font-display text-primary-400 mb-4 border-b border-white/5 pb-2">ACTIVE SYNDICATES</h2>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {isSyndicatesLoading ? (
              <div className="flex items-center gap-2 text-white/40 font-mono p-4">
                <Loader2 className="w-4 h-4 animate-spin" /> Fetching intel...
              </div>
            ) : syndicateData?.mules && syndicateData.mules.length > 0 ? (
              syndicateData.mules.map((mule, idx) => (
                <SyndicateRow 
                  key={mule.account}
                  id={`SYN-${100 + idx}`} 
                  risk="Critical" 
                  nodes={mule.cases.length} 
                  origin={`Cases: ${mule.cases.join(', ')}`} 
                  account={mule.account}
                />
              ))
            ) : (
              <div className="text-white/40 font-mono p-4">No active syndicates detected.</div>
            )}
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
  account?: string;
}

function SyndicateRow({ id, risk, nodes, origin, account }: SyndicateRowProps) {
  const riskColor = risk === 'Critical' ? 'text-danger-500 bg-danger-500/10 border-danger-500/30' : 
                    risk === 'High' ? 'text-warning-500 bg-warning-500/10 border-warning-500/30' : 
                    risk === 'Medium' ? 'text-primary-400 bg-primary-500/10 border-primary-500/30' : 
                    'text-safe-400 bg-safe-500/10 border-safe-500/30';
  
  return (
    <div className="flex items-center justify-between p-3 bg-background-base rounded border border-white/5 hover:border-white/20 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="font-mono text-primary-300 font-bold">{id}</div>
        <div className="text-sm text-white/60">
          {account ? `Acc: ${account}` : `${nodes} Accounts`}
        </div>
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

function LatentSpacePlot({ nodes }: { nodes: LatentNode[] }) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="relative z-10 flex flex-col items-center">
        <Network className="w-8 h-8 mb-2 opacity-50" />
        <span>No Data Available for Projection</span>
      </div>
    );
  }

  const xs = nodes.map(n => n.x);
  const ys = nodes.map(n => n.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const rangeX = (maxX - minX) || 1;
  const rangeY = (maxY - minY) || 1;

  return (
    <>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #3b82f6 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
      <div className="absolute inset-0">
        {nodes.map(node => {
          const px = ((node.x - minX) / rangeX) * 90 + 5;
          const py = ((node.y - minY) / rangeY) * 90 + 5;
          
          let colorClass = "bg-safe-400";
          if (node.cluster === "Critical Risk") colorClass = "bg-danger-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]";
          else if (node.cluster === "High Risk") colorClass = "bg-warning-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]";
          else if (node.cluster === "Medium Risk") colorClass = "bg-primary-400 shadow-[0_0_6px_rgba(96,165,250,0.5)]";

          const size = Math.max(4, Math.min(12, 4 + Math.log10(node.volume || 1)));

          return (
            <div 
              key={node.id} 
              className={`absolute rounded-full ${colorClass} transition-all duration-500`}
              style={{
                left: `${px}%`,
                top: `${py}%`,
                width: `${size}px`,
                height: `${size}px`,
                transform: 'translate(-50%, -50%)'
              }}
              title={`Account: ${node.id}\nRisk: ${node.risk_score.toFixed(2)}\nVol: ${node.volume}`}
            />
          );
        })}
      </div>
      
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-danger-500/10 blur-xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-20 w-32 h-32 rounded-full bg-warning-500/10 blur-xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-primary-500/10 blur-xl pointer-events-none"></div>
    </>
  );
}
