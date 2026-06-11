import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, AlertTriangle, ShieldAlert, CircleDot, Download } from 'lucide-react';
import { API_BASE_URL } from '../../../config';

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
}

export default function CaseTable({ cases }: Props) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-danger-500 bg-danger-500/10 border-danger-500/20';
      case 'high': return 'text-warning-500 bg-warning-500/10 border-warning-500/20';
      default: return 'text-primary-400 bg-primary-500/10 border-primary-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-warning-400';
      case 'investigating': return 'text-primary-400';
      case 'closed': return 'text-safe-400';
      default: return 'text-white/40';
    }
  };

  return (
    <div className="w-full bg-background-surface border border-white/5 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-black/20 border-b border-white/5 text-xs uppercase text-white/40 tracking-wider">
            <tr>
              <th className="px-6 py-4 font-mono font-medium">Case ID</th>
              <th className="px-6 py-4 font-mono font-medium">Title</th>
              <th className="px-6 py-4 font-mono font-medium">Priority</th>
              <th className="px-6 py-4 font-mono font-medium">Status</th>
              <th className="px-6 py-4 font-mono font-medium text-right">Volume (INR)</th>
              <th className="px-6 py-4 font-mono font-medium text-right">Victims</th>
              <th className="px-6 py-4 font-mono font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-mono text-primary-400 font-medium">{c.case_number}</div>
                  <div className="text-xs text-white/40 mt-1">{new Date(c.created_at).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{c.title}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-medium tracking-wide ${getPriorityColor(c.priority)}`}>
                    {c.priority === 'critical' ? <ShieldAlert className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {c.priority.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wider ${getStatusColor(c.status)}`}>
                    <CircleDot className="w-3.5 h-3.5" />
                    {c.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-white">
                  ₹{c.total_amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="bg-background-base text-white/60 px-2.5 py-1 rounded font-mono text-xs border border-white/5">
                    {c.victim_count}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => window.open(`${API_BASE_URL}/api/v1/cases/${c.id}/export`, '_blank')}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-background-base border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                      title="Download Court-Admissible PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <Link to="/fraudlens" className="inline-flex items-center justify-center p-2 rounded-lg bg-primary-600/10 text-primary-400 hover:bg-primary-600 hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cases.length === 0 && (
          <div className="p-8 text-center text-white/40 font-mono">No cases found matching filters.</div>
        )}
      </div>
    </div>
  );
}
