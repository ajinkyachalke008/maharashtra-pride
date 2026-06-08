import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { createFileRoute, useSearchParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import TransactionGraph, { GraphNode, GraphEdge } from '@/components/fraudlens/graph/TransactionGraph';
import GraphSidebar from '@/components/fraudlens/graph/GraphSidebar';

import { API_BASE_URL } from '../../config';

export const Route = createFileRoute('/fraudlens/graph')({
  component: GraphPage,
});

function GraphPage() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [searchAccount, setSearchAccount] = useState('ACC-1001');
  const [hops, setHops] = useState(2);

  const { data: liveData, isLoading, isError, error } = useQuery({
    queryKey: ['subgraph', searchAccount, hops],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/v1/graph/subgraph`, {
        params: { account_id: searchAccount, hops }
      });
      return res.data;
    },
    enabled: !!searchAccount,
  });

  const displayNodes = liveData?.nodes || [];
  const displayEdges = liveData?.edges || [];

  const handleNodeClick = (node: GraphNode) => {
    setSelectedEdge(null);
    setSelectedNode(node);
  };

  const handleEdgeClick = (edge: GraphEdge) => {
    setSelectedNode(null);
    setSelectedEdge(edge);
  };

  const handleCloseSidebar = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  return (
    <div className="flex h-full w-full bg-background-base overflow-hidden">
      {/* Main Graph Area */}
      <div className="flex-1 flex flex-col relative p-4 gap-4 h-[calc(100vh-56px)]">
        
        {/* Top Control Bar */}
        <div className="h-16 bg-background-surface border border-white/5 rounded-lg shadow flex items-center justify-between px-6 z-10 shrink-0">
          <div>
            <h1 className="font-display text-xl text-primary-400 font-bold tracking-widest flex items-center gap-3">
              NETWORK EXPLORER
              <span className="text-xs px-2 py-0.5 rounded bg-primary-600/20 text-primary-400">
                LIVE DB
              </span>
            </h1>
            <p className="text-xs text-white/40 font-mono mt-1">
              {liveData?.stats 
                ? `${liveData.stats.node_count} nodes, ${liveData.stats.edge_count} edges found` 
                : 'Enter target account to query'}
            </p>
          </div>
          
          <div className="flex gap-4 items-center">

              <div className="flex gap-2 mr-4">
                <input 
                  type="text" 
                  value={searchAccount}
                  onChange={(e) => setSearchAccount(e.target.value)}
                  className="bg-background-base border border-white/10 rounded px-3 py-1 text-sm font-mono text-white focus:outline-none focus:border-primary-500"
                  placeholder="Target Account..."
                />
                <select 
                  value={hops}
                  onChange={(e) => setHops(Number(e.target.value))}
                  className="bg-background-base border border-white/10 rounded px-2 py-1 text-sm font-mono text-white"
                >
                  <option value={1}>1 Hop</option>
                  <option value={2}>2 Hops</option>
                  <option value={3}>3 Hops</option>
                </select>
              </div>

            <button className="px-4 py-2 bg-background-card border border-white/10 rounded text-sm text-white hover:border-primary-500 transition-colors font-mono">
              Filters
            </button>
            <button className="px-4 py-2 bg-primary-600/20 text-primary-400 border border-primary-500/50 rounded text-sm hover:bg-primary-600/30 transition-colors font-mono">
              Export SVG
            </button>
          </div>
        </div>

        {/* The D3 Canvas */}
        <div className="flex-1 relative rounded-xl overflow-hidden border border-white/5 shadow-lg">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background-base/80 backdrop-blur-sm">
              <div className="font-mono text-primary-400 animate-pulse">Running Cypher traversal...</div>
            </div>
          )}
          
          {isError && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background-base/80 backdrop-blur-sm">
              <div className="font-mono text-danger-500 bg-danger-500/10 border border-danger-500/30 p-4 rounded max-w-lg text-center">
                <p className="font-bold mb-2">Neo4j Database Error</p>
                <p className="text-xs text-white/40">{error?.message || 'Neo4j subgraph query failed: connection timeout'}</p>
                <p className="text-xs text-white/60 mt-4 italic">No verified data available. API returned error. No fabricated data will be provided.</p>
              </div>
            </div>
          )}

          {!isLoading && !isError && displayNodes.length === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background-base/80 backdrop-blur-sm">
              <div className="font-mono text-white/40 bg-white/5 border border-white/10 p-4 rounded max-w-lg text-center">
                <p className="font-bold mb-2">No Results Found</p>
                <p className="text-xs">Node not found in graph. Zero results are accurate intelligence.</p>
              </div>
            </div>
          )}

          {/* Live Stream Status Widget */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-3 bg-background-card/90 backdrop-blur border border-white/5 px-4 py-2 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-safe-500"></span>
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-safe-400 uppercase">Stream Live</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <div className="text-[10px] font-mono text-white/40">Listening for anomalies...</div>
          </div>

          <TransactionGraph 
            nodes={displayNodes} 
            edges={displayEdges} 
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
          />
          
          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-background-surface/80 backdrop-blur border border-white/5 p-4 rounded-lg text-xs font-mono">
            <div className="text-white/40 mb-2 font-bold tracking-wider">NODE LEGEND</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-danger-500"></div> <span className="text-white">Suspect / Fraud</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-warning-500"></div> <span className="text-white">Victim</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white/50"></div> <span className="text-white">Relay / Mule</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-safe-500"></div> <span className="text-white">Clean</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Sidebar */}
      {(selectedNode ?? selectedEdge) && (
        <GraphSidebar 
          selectedNode={selectedNode} 
          selectedEdge={selectedEdge} 
          onClose={handleCloseSidebar} 
        />
      )}
    </div>
  );
}
