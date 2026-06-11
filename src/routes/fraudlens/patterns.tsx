import { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Fingerprint, Search, X, Filter, Eye, ChevronRight, Scan,
  AlertTriangle, CheckCircle2, XCircle, Clock
} from 'lucide-react';

export const Route = createFileRoute('/fraudlens/patterns')({
  component: PatternsPage,
});

// ──── Types ──────────────────────────────────────────────────

interface PatternData {
  pattern_id: string;
  pattern_type: string;
  pattern_icon: string;
  category: string;
  confidence: number;
  severity: string;
  involved_accounts: string[];
  involved_transactions: string[];
  victim_count: number;
  timeline_start: string;
  timeline_end: string;
  total_amount: number;
  description: string;
  evidence: Record<string, unknown>;
  status?: string;
}

// ──── Mock Data ──────────────────────────────────────────────

const MOCK_PATTERNS: PatternData[] = [];

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-500/15 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-amber-400/15 text-amber-400 border-amber-500/30',
  LOW: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
};

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-white/10 text-white/50',
  investigating: 'bg-amber-400/15 text-amber-400',
  confirmed: 'bg-emerald-500/15 text-emerald-400',
  false_positive: 'bg-white/5 text-white/20',
};

function formatAmount(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

// ──── Component ──────────────────────────────────────────────

function PatternsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<PatternData | null>(null);

  const filtered = useMemo(() => {
    let data = MOCK_PATTERNS;
    if (categoryFilter !== 'ALL') data = data.filter(p => p.category === categoryFilter);
    if (severityFilter !== 'ALL') data = data.filter(p => p.severity === severityFilter);
    if (statusFilter !== 'ALL') data = data.filter(p => p.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(p =>
        p.pattern_type.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.involved_accounts.some(a => a.toLowerCase().includes(q))
      );
    }
    return data;
  }, [categoryFilter, severityFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => ({
    critical: MOCK_PATTERNS.filter(p => p.severity === 'CRITICAL').length,
    high: MOCK_PATTERNS.filter(p => p.severity === 'HIGH').length,
    medium: MOCK_PATTERNS.filter(p => p.severity === 'MEDIUM').length,
    total: MOCK_PATTERNS.length,
  }), []);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-white tracking-wider flex items-center gap-3">
            <Fingerprint className="w-6 h-6 text-primary-400" />
            PATTERN ANALYSIS
          </h1>
          <p className="text-sm text-white/40 mt-1 font-mono">
            19 forensic detectors • 12 structural + 7 scam playbooks
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-400 text-xs font-mono hover:bg-primary-500/30 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
          <Scan className="w-4 h-4" />
          Scan Now
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'CRITICAL', count: stats.critical, color: 'red', icon: '🔴' },
          { label: 'HIGH', count: stats.high, color: 'orange', icon: '🟠' },
          { label: 'MEDIUM', count: stats.medium, color: 'amber', icon: '🟡' },
          { label: 'TOTAL', count: stats.total, color: 'sky', icon: '📊' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl bg-white/[0.02] border border-white/5 p-4 hover:bg-white/[0.04] transition-all cursor-pointer ${severityFilter === s.label ? 'ring-1 ring-white/20' : ''}`}
               onClick={() => setSeverityFilter(severityFilter === s.label ? 'ALL' : s.label)}>
            <div className="flex items-center justify-between">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-3xl font-display text-white">{s.count}</span>
            </div>
            <p className="text-[10px] font-mono text-white/30 mt-2 tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Category Tabs */}
        <div className="flex rounded-xl bg-white/5 border border-white/5 p-1">
          {[
            { key: 'ALL', label: 'All' },
            { key: 'structural', label: 'Structural' },
            { key: 'scam_playbook', label: 'Scam Playbook' },
          ].map(cat => (
            <button key={cat.key} onClick={() => setCategoryFilter(cat.key)}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                categoryFilter === cat.key ? 'bg-primary-500/15 text-primary-400' : 'text-white/30 hover:text-white/60'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex gap-1.5">
          {[
            { key: 'ALL', label: 'All' },
            { key: 'new', label: 'New' },
            { key: 'investigating', label: 'Investigating' },
            { key: 'confirmed', label: 'Confirmed' },
          ].map(s => (
            <button key={s.key} onClick={() => setStatusFilter(s.key)}
              className={`px-3 py-2 rounded-lg text-[10px] font-mono transition-all ${
                statusFilter === s.key ? 'bg-white/10 text-white/70' : 'text-white/20 hover:text-white/40'
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input type="text" placeholder="Search patterns..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary-500/30 font-mono" />
        </div>
      </div>

      {/* Pattern Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(pattern => (
          <div key={pattern.pattern_id}
            onClick={() => setSelectedPattern(pattern)}
            className={`rounded-2xl bg-white/[0.02] border border-white/5 p-5 hover:bg-white/[0.04] transition-all cursor-pointer group hover:border-white/10 ${
              selectedPattern?.pattern_id === pattern.pattern_id ? 'ring-1 ring-primary-500/30 bg-primary-500/[0.03]' : ''
            }`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{pattern.pattern_icon}</span>
                <div>
                  <p className="text-sm font-mono text-white/80 font-bold">{pattern.pattern_type.replace(/_/g, ' ')}</p>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${pattern.category === 'scam_playbook' ? 'bg-purple-500/15 text-purple-400' : 'bg-white/5 text-white/30'}`}>
                    {pattern.category === 'scam_playbook' ? 'SCAM' : 'STRUCTURAL'}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${SEVERITY_STYLES[pattern.severity]}`}>
                {pattern.severity}
              </span>
            </div>

            {/* Confidence Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-white/30">Confidence</span>
                <span className="text-[10px] font-mono text-white/50">{(pattern.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${
                  pattern.confidence > 0.85 ? 'bg-red-400' : pattern.confidence > 0.7 ? 'bg-orange-400' : 'bg-amber-400'
                }`} style={{ width: `${pattern.confidence * 100}%` }} />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <p className="text-sm font-display text-white/70">{pattern.involved_accounts.length}</p>
                <p className="text-[9px] font-mono text-white/20">accounts</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-display text-white/70">{formatAmount(pattern.total_amount)}</p>
                <p className="text-[9px] font-mono text-white/20">value</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-display text-white/70">{pattern.victim_count || '—'}</p>
                <p className="text-[9px] font-mono text-white/20">victims</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-white/40 line-clamp-2 mb-3">{pattern.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${STATUS_STYLES[pattern.status || 'new']}`}>
                {(pattern.status || 'new').toUpperCase()}
              </span>
              <button className="text-[10px] font-mono text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                View in Graph <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Drawer */}
      {selectedPattern && (
        <div className="fixed inset-y-0 right-0 w-[420px] bg-[#0a0e14] border-l border-white/5 z-50 overflow-y-auto shadow-2xl">
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPattern.pattern_icon}</span>
                <h2 className="text-lg font-display text-white tracking-wider">
                  {selectedPattern.pattern_type.replace(/_/g, ' ')}
                </h2>
              </div>
              <button onClick={() => setSelectedPattern(null)} className="text-white/30 hover:text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Severity + Confidence */}
            <div className="flex gap-3">
              <span className={`text-[10px] font-mono px-3 py-1.5 rounded-full border ${SEVERITY_STYLES[selectedPattern.severity]}`}>
                {selectedPattern.severity}
              </span>
              <span className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/5 text-white/50">
                {(selectedPattern.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>

            {/* Description */}
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
              <p className="text-sm text-white/60 leading-relaxed">{selectedPattern.description}</p>
            </div>

            {/* Accounts */}
            <div>
              <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">Involved Accounts</h3>
              <div className="space-y-1.5">
                {selectedPattern.involved_accounts.map(acc => (
                  <div key={acc} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                    <span className="text-xs font-mono text-white/70">{acc}</span>
                    <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">FLAGGED</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence */}
            <div>
              <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">Evidence</h3>
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 space-y-2">
                {Object.entries(selectedPattern.evidence).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/30">{k.replace(/_/g, ' ')}</span>
                    <span className="text-xs font-mono text-white/60">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions */}
            {selectedPattern.involved_transactions.length > 0 && (
              <div>
                <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">
                  Transactions ({selectedPattern.involved_transactions.length})
                </h3>
                <div className="space-y-1">
                  {selectedPattern.involved_transactions.slice(0, 8).map(txn => (
                    <div key={txn} className="text-[10px] font-mono text-white/30 bg-white/[0.02] px-3 py-1.5 rounded">{txn}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-white/5">
              <button className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 text-xs font-mono hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <XCircle className="w-3.5 h-3.5" /> False Positive
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-amber-400/20 border border-amber-500/30 text-amber-400 text-xs font-mono hover:bg-amber-400/30 transition-all flex items-center justify-center gap-2">
                <Eye className="w-3.5 h-3.5" /> Investigate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
