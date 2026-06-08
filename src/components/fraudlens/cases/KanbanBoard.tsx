import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ShieldAlert, AlertTriangle, IndianRupee, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Case {
  id: string;
  case_number: string;
  title: string;
  status: string;
  priority: string;
  total_amount: number;
  victim_count: number;
  created_at: string;
}

interface Props {
  cases: Case[];
  onStatusChange?: (caseId: string, newStatus: string) => void;
}

const COLUMNS = ['open', 'investigating', 'closed', 'archived'];

export default function KanbanBoard({ cases, onStatusChange }: Props) {
  const { hasPermission } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'critical': return <ShieldAlert className="w-4 h-4 text-danger-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-warning-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-primary-500" />;
    }
  };

  const handleAction = (caseId: string, newStatus: string) => {
    if (!hasPermission('edit_cases')) {
      setAuthError("Access restricted — insufficient role privileges.");
      setTimeout(() => setAuthError(null), 3000);
      return;
    }
    onStatusChange?.(caseId, newStatus);
  };

  return (
    <div className="flex flex-col gap-4">
      {authError && (
        <div className="bg-danger-500/10 border border-danger-500/50 p-3 rounded flex items-center gap-2 text-danger-400 font-mono text-sm animate-in fade-in">
          <AlertTriangle className="w-4 h-4" /> {authError}
        </div>
      )}
      <div className="flex gap-6 overflow-x-auto pb-8 h-[700px]">
        {COLUMNS.map((columnStatus) => {
          const columnCases = cases.filter(c => c.status === columnStatus);
          
          return (
            <div key={columnStatus} className="flex-none w-80 flex flex-col bg-background-surface/50 rounded-xl border border-white/5">
              {/* Column Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-background-surface rounded-t-xl">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest">{columnStatus}</h3>
                <span className="bg-background-base text-white/40 px-2 py-0.5 rounded text-xs font-mono">{columnCases.length}</span>
              </div>

              {/* Column Body */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {columnCases.map((c) => (
                  <div key={c.id} className="bg-background-card border border-white/10 hover:border-primary-500/50 rounded-lg p-4 shadow-lg transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-mono text-primary-400 font-medium bg-primary-500/10 px-2 py-0.5 rounded">{c.case_number}</span>
                      {getPriorityIcon(c.priority)}
                    </div>
                    
                    <h4 className="text-sm font-medium text-white leading-snug mb-3">{c.title}</h4>
                    
                    <div className="flex items-center gap-4 text-xs font-mono text-white/60 mb-4">
                      <div className="flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" /> {(c.total_amount / 1000).toFixed(1)}k</div>
                      <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {c.victim_count}</div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">{new Date(c.created_at).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        {c.status === 'open' && (
                          <button 
                            onClick={() => handleAction(c.id, 'investigating')}
                            className="text-[10px] px-2 py-1 bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 rounded font-mono transition-colors"
                          >
                            Investigate
                          </button>
                        )}
                        {c.status === 'investigating' && (
                          <button 
                            onClick={() => handleAction(c.id, 'closed')}
                            className="text-[10px] px-2 py-1 bg-safe-500/10 text-safe-400 hover:bg-safe-500/20 rounded font-mono transition-colors"
                          >
                            Close Case
                          </button>
                        )}
                        <Link to="/fraudlens" className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-400 group-hover:translate-x-1 transition-transform">
                          Inspect <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                
                {columnCases.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center text-xs font-mono text-white/40">
                    Drop cases here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
