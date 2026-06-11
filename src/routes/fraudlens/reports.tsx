import { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  FileText, Download, Filter, FileBarChart, History,
  Search, Calendar, MoreVertical, Eye, CheckCircle2,
  FileDown, Share2, Mail
} from 'lucide-react';

export const Route = createFileRoute('/fraudlens/reports')({
  component: ReportsPage,
});

// ──── Types ──────────────────────────────────────────────────

interface ReportMetadata {
  id: string;
  title: string;
  type: string;
  status: string;
  generated_at: string;
  generated_by: string;
  format: string;
  size_kb: number;
  tags: string[];
}

// ──── Mock Data ──────────────────────────────────────────────

const MOCK_REPORTS: ReportMetadata[] = [];

const TEMPLATES = [
  { id: 't1', name: 'Standard Case Report', desc: 'Full forensic trace, account details, and graph evidence for a specific case.', icon: '📄' },
  { id: 't2', name: 'Executive Summary', desc: 'High-level aggregation of detected syndicates, total volume, and risk exposure.', icon: '📊' },
  { id: 't3', name: 'Regulatory / SAR Extract', desc: 'Formatted data export suitable for Suspicious Activity Report filing.', icon: '🏛️' },
  { id: 't4', name: 'Raw Data Dump', desc: 'CSV export of all transactions and node properties within a specific time bound.', icon: '🔢' },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  });
}

function formatSize(kb: number) {
  if (kb === 0) return '—';
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

// ──── Component ──────────────────────────────────────────────

function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const filtered = useMemo(() => {
    let data = MOCK_REPORTS;
    if (typeFilter !== 'ALL') data = data.filter(r => r.type === typeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return data;
  }, [searchQuery, typeFilter]);

  const uniqueTypes = useMemo(() => {
    const types = new Set(MOCK_REPORTS.map(r => r.type));
    return ['ALL', ...Array.from(types)];
  }, []);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-white tracking-wider flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary-400" />
            REPORTS & EXPORTS
          </h1>
          <p className="text-sm text-white/40 mt-1 font-mono">
            Generated intelligence briefs, case files, and regulatory extracts.
          </p>
        </div>
        <button 
          onClick={() => setShowGenerateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-400 text-xs font-mono hover:bg-primary-500/30 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.1)]"
        >
          <FileBarChart className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar - Templates */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h3 className="text-sm font-mono text-white/60">Report Templates</h3>
            </div>
            <div className="divide-y divide-white/[0.02]">
              {TEMPLATES.map(t => (
                <div key={t.id} className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{t.icon}</span>
                    <h4 className="text-sm font-bold text-white/90 group-hover:text-primary-400 transition-colors">{t.name}</h4>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-mono">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Report Library */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Controls */}
          <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] border border-white/5 p-4">
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="text" placeholder="Search reports..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-background-base border border-white/5 text-xs text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary-500/30 font-mono" />
              </div>
              
              <select 
                value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                className="bg-background-base border border-white/5 rounded-lg px-3 py-2 text-xs font-mono text-white/80 focus:outline-none focus:border-primary-500/30"
              >
                {uniqueTypes.map(t => <option key={t} value={t}>{t === 'ALL' ? 'All Types' : t}</option>)}
              </select>
            </div>
            
            <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white/80 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-5 py-3 text-left text-[10px] font-mono text-white/30 uppercase tracking-wider">Report Details</th>
                  <th className="px-5 py-3 text-left text-[10px] font-mono text-white/30 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-[10px] font-mono text-white/30 uppercase tracking-wider">Generated</th>
                  <th className="px-5 py-3 text-left text-[10px] font-mono text-white/30 uppercase tracking-wider">Format</th>
                  <th className="px-5 py-3 text-right text-[10px] font-mono text-white/30 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filtered.map(report => (
                  <tr key={report.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${report.status === 'ready' ? 'bg-primary-500/10 text-primary-400' : 'bg-white/5 text-white/20 animate-pulse'}`}>
                          {report.format === 'PDF' ? <FileText className="w-4 h-4" /> : <FileDown className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white/90">{report.title}</p>
                          <div className="flex gap-1.5 mt-1">
                            {report.tags.map(t => (
                              <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/40">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono text-white/60">{report.type}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-mono text-white/80">{formatDate(report.generated_at)}</p>
                      <p className="text-[10px] font-mono text-white/30">by {report.generated_by}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-white/60">{report.format}</span>
                        <span className="text-[10px] font-mono text-white/30">({formatSize(report.size_kb)})</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {report.status === 'ready' ? (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors" title="Share">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
                          GENERATING...
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-white/30 text-sm font-mono">
                      No reports match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
