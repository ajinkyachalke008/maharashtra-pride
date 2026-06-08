import React, { useState } from 'react';
import { GraphNode, GraphEdge } from './TransactionGraph';
import { LEGAL_SECTIONS, FRAUD_TYPES, LegalSection } from '@/data/legalFramework';
import { FileText, ShieldAlert } from 'lucide-react';

interface GraphSidebarProps {
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  onClose: () => void;
}

export default function GraphSidebar({ selectedNode, selectedEdge, onClose }: GraphSidebarProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'ai' | 'enforcement'>('details');

  if (!selectedNode && !selectedEdge) return null;

  return (
    <div className="w-80 h-full bg-background-card border-l border-white/5 shadow-xl flex flex-col">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-background-surface">
        <h2 className="font-display text-primary-400 font-bold tracking-wider">
          {selectedNode ? 'NODE DETAILS' : 'EDGE DETAILS'}
        </h2>
        <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
          ✕
        </button>
      </div>

      {selectedNode && (
        <div className="flex border-b border-white/5 bg-background-surface">
          <button 
            className={`flex-1 py-2 text-xs font-mono tracking-wider ${activeTab === 'details' ? 'border-b-2 border-primary-500 text-primary-400 bg-white/5' : 'text-white/40 hover:bg-white/5'}`}
            onClick={() => setActiveTab('details')}
          >
            DETAILS
          </button>
          <button 
            className={`flex-1 py-2 text-xs font-mono tracking-wider ${activeTab === 'ai' ? 'border-b-2 border-primary-500 text-primary-400 bg-white/5' : 'text-white/40 hover:bg-white/5'}`}
            onClick={() => setActiveTab('ai')}
          >
            AI
          </button>
          <button 
            className={`flex-1 py-2 text-xs font-mono tracking-wider ${activeTab === 'enforcement' ? 'border-b-2 border-danger-500 text-danger-400 bg-white/5' : 'text-white/40 hover:bg-white/5'}`}
            onClick={() => setActiveTab('enforcement')}
          >
            LEGAL
          </button>
        </div>
      )}

      <div className="p-4 overflow-y-auto flex-1 bg-background-base">
        {selectedNode && activeTab === 'details' && (
          <div className="space-y-6">
            <div>
              <div className="text-xs text-white/40 font-mono mb-1">ACCOUNT NUMBER</div>
              <div className="font-mono text-lg text-white/80">{selectedNode.accountNumber}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded border border-white/5">
                <div className="text-xs text-white/40 font-mono mb-1">RISK SCORE</div>
                <div className={`font-display text-xl ${selectedNode.riskScore > 0.7 ? 'text-danger-500' : selectedNode.riskScore > 0.4 ? 'text-warning-500' : 'text-safe-500'}`}>
                  {(selectedNode.riskScore * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded border border-white/5">
                <div className="text-xs text-white/40 font-mono mb-1">LABEL</div>
                <div className="capitalize text-primary-400 font-semibold">{selectedNode.type}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-white/40 font-mono mb-1">CENTRALITY METRICS</div>
              <div className="space-y-2 bg-white/5 p-3 rounded border border-white/5 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-white/50">PageRank:</span>
                  <span className="text-white/80">{selectedNode.centrality.pageRank.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Betweenness:</span>
                  <span className="text-white/80">{selectedNode.centrality.betweenness.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Degree:</span>
                  <span className="text-white/80">{selectedNode.centrality.degree}</span>
                </div>
              </div>
            </div>
            
            <button className="w-full py-2 bg-danger-500/10 text-danger-400 border border-danger-500/30 rounded hover:bg-danger-500/20 transition-colors font-mono text-sm uppercase tracking-wide">
              Recommend Freeze
            </button>
          </div>
        )}

        {selectedNode && activeTab === 'ai' && (
          <div className="space-y-6">
            <div>
              <div className="text-xs text-white/40 font-mono mb-1">PREDICTIVE FLAG</div>
              <div className="font-mono text-lg text-white/80">{selectedNode.accountNumber}</div>
            </div>
            
            {/* Core Risk Score Card */}
            <div className="bg-white/5 p-4 rounded border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <span className="text-[9px] bg-primary-600/20 text-primary-400 px-1.5 py-0.5 rounded font-mono uppercase">FraudSAGE v1.2</span>
              </div>
              <div className="flex justify-between items-end mb-2 mt-2">
                <span className="text-xs text-white/40 font-mono">GNN Probability</span>
                <span className={`font-display text-3xl font-bold ${selectedNode.riskScore > 0.7 ? 'text-danger-500' : selectedNode.riskScore > 0.4 ? 'text-warning-500' : 'text-safe-500'}`}>
                  {(selectedNode.riskScore * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full transition-all duration-1000 ${selectedNode.riskScore > 0.7 ? 'bg-danger-500' : selectedNode.riskScore > 0.4 ? 'bg-warning-500' : 'bg-safe-500'}`} 
                  style={{ width: `${selectedNode.riskScore * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase">
                <span>Safe</span>
                <span>Review</span>
                <span>Flagged</span>
              </div>
            </div>

            {/* AI Confidence & Embeddings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 p-3 rounded border border-white/5">
                <div className="text-[10px] text-white/40 font-mono mb-1">MODEL CONFIDENCE</div>
                <div className="font-mono text-lg text-primary-400">89.4%</div>
                <div className="text-[9px] text-white/30 mt-1">Based on 16-dim latent vector</div>
              </div>
              <div className="bg-black/20 p-3 rounded border border-white/5">
                <div className="text-[10px] text-white/40 font-mono mb-1">NETWORK DEGREE</div>
                <div className="font-mono text-lg text-primary-400">{selectedNode.centrality.degree} Hops</div>
                <div className="text-[9px] text-white/30 mt-1">Topology complexity</div>
              </div>
            </div>

            {/* Syndicate Assignment */}
            <div className="bg-primary-900/10 border border-primary-500/20 rounded p-3 flex justify-between items-center">
              <div>
                <div className="text-[10px] text-primary-400/80 font-mono mb-1">PREDICTED SYNDICATE</div>
                <div className="text-sm font-mono text-primary-300">SYN-10{Math.floor(Math.random() * 5)}</div>
              </div>
              <div className="bg-primary-500/20 text-primary-300 px-2 py-1 rounded text-xs font-mono">K-Means</div>
            </div>

            {/* SHAP Explanations */}
            <div>
              <div className="text-xs text-white/40 font-mono mb-3 flex items-center justify-between border-b border-white/5 pb-2">
                <span>SHAP EXPLANATION (TREE EXPLAINER)</span>
              </div>
              <div className="space-y-4">
                
                {/* Feature 1 */}
                <div className="text-sm">
                  <div className="flex justify-between font-mono mb-1">
                    <span className="text-white/80 text-xs">Degree Centrality</span>
                    <span className="text-danger-400 text-xs">+0.60 SHAP</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-danger-500" style={{ width: '60%' }}></div>
                  </div>
                  <div className="text-[10px] text-white/30 italic">Account is acting as a massive central relay point.</div>
                </div>
                
                {/* Feature 2 */}
                <div className="text-sm">
                  <div className="flex justify-between font-mono mb-1">
                    <span className="text-white/80 text-xs">Velocity (1h)</span>
                    <span className="text-danger-400 text-xs">+0.45 SHAP</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-danger-400" style={{ width: '45%' }}></div>
                  </div>
                  <div className="text-[10px] text-white/30 italic">Rapid burst of 8 transactions in under an hour.</div>
                </div>

                {/* Feature 3 (Safe factor) */}
                <div className="text-sm">
                  <div className="flex justify-between font-mono mb-1">
                    <span className="text-white/80 text-xs">Account Age</span>
                    <span className="text-safe-400 text-xs">-0.10 SHAP</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden mb-1 flex justify-end">
                    <div className="h-full bg-safe-500" style={{ width: '10%' }}></div>
                  </div>
                  <div className="text-[10px] text-white/30 italic">Older account history slightly reduces risk.</div>
                </div>

              </div>
            </div>

            {/* Action Engine */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <div className="text-[10px] text-white/40 font-mono mb-2">AUTOMATED RECOMMENDATIONS</div>
              {selectedNode.riskScore > 0.7 ? (
                <>
                  <button className="w-full py-2 bg-danger-500/10 text-danger-400 border border-danger-500/30 rounded hover:bg-danger-500/20 transition-colors font-mono text-xs uppercase tracking-wide flex items-center justify-center gap-2">
                    <span>⚡</span> Freeze Account
                  </button>
                  <button onClick={() => setActiveTab('enforcement')} className="w-full py-2 bg-white/5 text-white border border-white/10 rounded hover:border-primary-500/50 transition-colors font-mono text-xs uppercase tracking-wide flex items-center justify-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5" /> View Legal Context
                  </button>
                </>
              ) : selectedNode.riskScore > 0.4 ? (
                <button className="w-full py-2 bg-warning-500/10 text-warning-400 border border-warning-500/30 rounded hover:bg-warning-500/20 transition-colors font-mono text-xs uppercase tracking-wide flex items-center justify-center gap-2">
                  <span>⚠️</span> Request KYC Update
                </button>
              ) : (
                <div className="p-2 bg-safe-500/10 border border-safe-500/30 rounded text-safe-400 text-[10px] font-mono text-center">
                  No automated actions required.
                </div>
              )}
            </div>
          </div>
        )}

        {selectedNode && activeTab === 'enforcement' && (
          <div className="space-y-6">
            <div className="bg-danger-500/10 border border-danger-500/30 p-3 rounded">
              <div className="text-xs font-mono text-danger-400 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> APPLICABLE SECTIONS
              </div>
              <div className="text-[10px] text-white/60 leading-relaxed">
                Based on the GNN prediction mapping to a Mule Network (PMLA) and suspected unauthorized access.
              </div>
            </div>

            <div className="space-y-4">
              {(() => {
                // Dynamically select legal sections based on node risk
                const applicableSections: LegalSection[] = [];
                if (selectedNode.riskScore > 0.8) {
                  applicableSections.push(LEGAL_SECTIONS.find(s => s.id === 'pmla-3')!);
                  applicableSections.push(LEGAL_SECTIONS.find(s => s.id === 'ipc-420')!);
                } else if (selectedNode.riskScore > 0.5) {
                  applicableSections.push(LEGAL_SECTIONS.find(s => s.id === 'it-66d')!);
                } else {
                  applicableSections.push(LEGAL_SECTIONS.find(s => s.id === 'it-43')!);
                }

                return applicableSections.filter(Boolean).map(section => (
                  <div key={section.id} className="bg-white/5 border border-white/10 rounded overflow-hidden">
                    <div className="bg-white/5 px-3 py-2 border-b border-white/10 flex justify-between items-center">
                      <span className="text-xs font-mono text-primary-400 font-bold">{section.act}</span>
                      <span className="text-[10px] font-mono text-white/50 bg-white/10 px-1.5 py-0.5 rounded">{section.section}</span>
                    </div>
                    <div className="p-3">
                      <div className="text-[11px] font-semibold text-white/90 mb-1">{section.title}</div>
                      <div className="text-[10px] text-white/50 leading-relaxed mb-3">
                        {section.description}
                      </div>
                      <div className="flex items-center gap-1.5 bg-danger-500/10 text-danger-400 text-[9px] font-mono px-2 py-1 rounded w-max">
                        <FileText className="w-3 h-3" /> Max Penalty: {section.maxPenalty}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <button className="w-full py-2 bg-primary-600/20 text-primary-400 border border-primary-500/30 rounded hover:bg-primary-600/40 transition-colors font-mono text-xs uppercase tracking-wide">
                Generate FIR Template
              </button>
            </div>
          </div>
        )}

        {selectedEdge && (
          <div className="space-y-6">
            <div>
              <div className="text-xs text-white/40 font-mono mb-1">TRANSACTION REF</div>
              <div className="font-mono text-sm text-white/80 break-all">{selectedEdge.id}</div>
            </div>
            
            <div className="bg-white/5 p-4 rounded border border-white/5 flex flex-col items-center justify-center space-y-2">
              <div className="text-xs text-white/40 font-mono">AMOUNT</div>
              <div className="font-display text-2xl text-primary-400">₹{selectedEdge.amount.toLocaleString('en-IN')}</div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-white/40 font-mono mb-1">SENDER</div>
                <div className="font-mono text-sm text-white/80 bg-white/5 p-2 rounded border border-white/5">
                  {typeof selectedEdge.source === 'string' ? selectedEdge.source : selectedEdge.source.accountNumber}
                </div>
              </div>
              <div className="flex justify-center text-white/40">↓</div>
              <div>
                <div className="text-xs text-white/40 font-mono mb-1">RECEIVER</div>
                <div className="font-mono text-sm text-white/80 bg-white/5 p-2 rounded border border-white/5">
                  {typeof selectedEdge.target === 'string' ? selectedEdge.target : selectedEdge.target.accountNumber}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-white/40 font-mono mb-1">METADATA</div>
              <div className="space-y-2 bg-white/5 p-3 rounded border border-white/5 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-white/50">Time:</span>
                  <span className="text-white/80">{new Date(selectedEdge.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Type:</span>
                  <span className="text-white/80">{selectedEdge.transactionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Risk:</span>
                  <span className={`capitalize ${selectedEdge.riskFlag === 'high' ? 'text-danger-500' : 'text-white/80'}`}>{selectedEdge.riskFlag}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
