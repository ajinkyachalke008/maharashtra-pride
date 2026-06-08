import React, { useRef, useState, useMemo, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { useTransactionStream } from '@/hooks/useTransactionStream';

export interface GraphNode {
  id: string;
  accountNumber: string;
  type: 'suspect' | 'victim' | 'relay' | 'clean' | 'unknown';
  riskScore: number;
  totalVolume: number;
  transactionCount: number;
  isCentralNode: boolean;
  centrality: {
    pageRank: number;
    betweenness: number;
    degree: number;
  };
  metadata: {
    bankName: string;
    accountType: string;
    registeredName?: string;
  };
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphEdge {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  amount: number;
  timestamp: string;
  transactionType: string;
  upiId?: string;
  riskFlag: 'high' | 'medium' | 'low' | 'unknown';
}

interface TransactionGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick: (node: GraphNode) => void;
  onEdgeClick: (edge: GraphEdge) => void;
}

const colorMap = {
  suspect: '#ef4444', // danger-500
  victim: '#f59e0b', // warning-500
  relay: '#64748b',
  clean: '#22c55e', // safe-500
  unknown: '#94a3b8'
};

const edgeColorMap = {
  high: '#ef4444',
  medium: '#facc15',
  low: '#4ade80',
  unknown: '#64748b'
};

export default function TransactionGraph({ nodes: initialNodes, edges: initialEdges, onNodeClick, onEdgeClick }: TransactionGraphProps) {
  const fgRef = useRef<any>();
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);

  // Consume Live WebSocket Stream
  const { streamedNodes, streamedEdges } = useTransactionStream('wss://fraudlens-backend.onrender.com/api/v1/ws/stream');

  // Merge static query data with live streamed data
  const mergedNodes = useMemo(() => {
    const all = [...initialNodes, ...streamedNodes];
    // Deduplicate by ID
    const unique = new Map(all.map(n => [n.id, n]));
    return Array.from(unique.values());
  }, [initialNodes, streamedNodes]);

  const mergedEdges = useMemo(() => {
    return [...initialEdges, ...streamedEdges];
  }, [initialEdges, streamedEdges]);

  const graphData = useMemo(() => ({
    nodes: mergedNodes,
    links: mergedEdges
  }), [mergedNodes, mergedEdges]);

  // Click handler to zoom into node
  const handleNodeClick = useCallback((node: GraphNode) => {
    onNodeClick(node);
    if (fgRef.current && node.x !== undefined && node.y !== undefined && node.z !== undefined) {
      // Aim at node from outside it
      const distance = 80;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt
        1000  // ms transition duration
      );
    }
  }, [onNodeClick]);

  return (
    <div className="w-full h-full bg-background-surface rounded-xl overflow-hidden border border-white/5 shadow-lg relative">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeId="id"
        nodeLabel="accountNumber"
        nodeColor={(n: any) => colorMap[n.type as keyof typeof colorMap] || colorMap.unknown}
        nodeVal={(n: any) => (n.riskScore || 0) * 5 + 1}
        nodeOpacity={0.9}
        nodeResolution={32}
        linkColor={(l: any) => edgeColorMap[l.riskFlag as keyof typeof edgeColorMap] || edgeColorMap.unknown}
        linkWidth={(l: any) => Math.max(0.5, Math.log10(l.amount || 10) * 0.5)}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.2}
        onNodeClick={handleNodeClick}
        onLinkClick={(l: any) => onEdgeClick(l)}
        onNodeHover={(n: any) => setHoverNode(n)}
        backgroundColor="#050505"
        enableNodeDrag={true}
        d3VelocityDecay={0.1}
      />
      
      {/* 3D Tooltip Overlay */}
      {hoverNode && (
        <div className="absolute bottom-4 right-4 pointer-events-none bg-background-card/90 backdrop-blur border border-white/5 p-4 rounded-xl text-sm font-mono text-white shadow-2xl min-w-[200px]">
          <div className="text-[10px] text-white/40 mb-1">FOCUS NODE</div>
          <div className="font-bold text-primary-400 mb-2">{hoverNode.accountNumber}</div>
          <div className="space-y-1 text-xs text-white/70">
            <div className="flex justify-between">
              <span>Type:</span> <span className="uppercase text-white/90">{hoverNode.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Risk:</span> <span className={`${hoverNode.riskScore > 0.8 ? 'text-danger-400' : 'text-safe-400'}`}>{(hoverNode.riskScore * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Volume:</span> <span>₹{hoverNode.totalVolume.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* 3D Controls Hint */}
      <div className="absolute top-4 right-4 bg-black/40 px-3 py-1.5 rounded font-mono text-[10px] text-white/50 pointer-events-none border border-white/5">
        Left Click: Rotate | Scroll: Zoom | Right Click: Pan
      </div>
    </div>
  );
}
