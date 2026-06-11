import { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Users, Search, X, Shield, Building2, Phone, CreditCard, Fingerprint, User,
  ChevronRight, Scan, AlertTriangle, Link2
} from 'lucide-react';

export const Route = createFileRoute('/fraudlens/entities')({
  component: EntitiesPage,
});

// ──── Types ──────────────────────────────────────────────────

interface EntityData {
  entity_id: string;
  entity_type: string;
  entity_value: string;
  accounts: string[];
  account_count: number;
  cases: string[];
  case_count: number;
  risk_assessment: string;
  is_cross_case: boolean;
}

interface BranchData {
  ifsc: string;
  branch_name: string;
  city: string;
  account_count: number;
  fraud_account_count: number;
  total_fraud_volume: number;
  risk_score: number;
}

// ──── Mock Data ──────────────────────────────────────────────

const MOCK_ENTITIES: EntityData[] = [];

const MOCK_BRANCHES: BranchData[] = [];

const ENTITY_ICONS: Record<string, { icon: string; color: string }> = {
  PHONE: { icon: '📱', color: 'sky' },
  UPI_VPA: { icon: '💳', color: 'purple' },
  IFSC: { icon: '🏦', color: 'emerald' },
  PAN: { icon: '🪪', color: 'amber' },
  NAME: { icon: '👤', color: 'pink' },
  BENEFICIARY: { icon: '🎯', color: 'red' },
};

const RISK_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-500/15 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-amber-400/15 text-amber-400 border-amber-500/30',
  LOW: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
};

const ENTITY_TABS = ['ALL', 'PHONE', 'UPI_VPA', 'IFSC', 'PAN', 'NAME', 'BENEFICIARY'] as const;

function formatAmount(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

// ──── Matrix Component ───────────────────────────────────────

function SharedEntityMatrix({ entities }: { entities: EntityData[] }) {
  // Collect all unique accounts
  const accounts = useMemo(() => {
    const s = new Set<string>();
    entities.forEach(e => e.accounts.forEach(a => s.add(a)));
    return Array.from(s).sort();
  }, [entities]);

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            <th className="px-4 py-3 text-left text-[10px] font-mono text-white/30 uppercase tracking-wider min-w-[180px]">Entity</th>
            {accounts.map(acc => (
              <th key={acc} className="px-2 py-3 text-center text-[9px] font-mono text-white/30 min-w-[80px]">
                <span className="writing-mode-vertical">{acc}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entities.map(entity => (
            <tr key={entity.entity_id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{ENTITY_ICONS[entity.entity_type]?.icon || '🔗'}</span>
                  <div>
                    <p className="text-[10px] font-mono text-white/50 truncate max-w-[140px]">{entity.entity_value}</p>
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${RISK_STYLES[entity.risk_assessment]}`}>
                      {entity.risk_assessment}
                    </span>
                  </div>
                </div>
              </td>
              {accounts.map(acc => (
                <td key={acc} className="px-2 py-2.5 text-center">
                  {entity.accounts.includes(acc) ? (
                    <div className={`w-4 h-4 rounded-full mx-auto ${
                      entity.risk_assessment === 'CRITICAL' ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]' :
                      entity.risk_assessment === 'HIGH' ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]' :
                      'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.3)]'
                    }`} />
                  ) : (
                    <div className="w-4 h-4 rounded-full mx-auto bg-white/[0.03]" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ──── Main Component ─────────────────────────────────────────

function EntitiesPage() {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [showMatrix, setShowMatrix] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let data = MOCK_ENTITIES;
    if (activeTab !== 'ALL') data = data.filter(e => e.entity_type === activeTab);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(e =>
        e.entity_value.toLowerCase().includes(q) ||
        e.accounts.some(a => a.toLowerCase().includes(q))
      );
    }
    return data;
  }, [activeTab, searchQuery]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_ENTITIES.forEach(e => {
      counts[e.entity_type] = (counts[e.entity_type] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-white tracking-wider flex items-center gap-3">
            <Users className="w-6 h-6 text-primary-400" />
            SHARED ENTITIES
          </h1>
          <p className="text-sm text-white/40 mt-1 font-mono">
            Hidden connections between accounts • Phone, UPI, IFSC, PAN, Name, Hub
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowMatrix(!showMatrix)}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
              showMatrix ? 'bg-white/10 text-white/70' : 'bg-white/5 text-white/30 hover:text-white/60'
            }`}>
            <Link2 className="w-3.5 h-3.5" /> Matrix View
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-400 text-xs font-mono hover:bg-primary-500/30 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
            <Scan className="w-4 h-4" /> Run Scan
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-3">
        {ENTITY_TABS.filter(t => t !== 'ALL').map(type => (
          <div key={type}
            onClick={() => setActiveTab(activeTab === type ? 'ALL' : type)}
            className={`rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center hover:bg-white/[0.04] transition-all cursor-pointer ${
              activeTab === type ? 'ring-1 ring-primary-500/30' : ''
            }`}>
            <span className="text-xl">{ENTITY_ICONS[type]?.icon}</span>
            <p className="text-xl font-display text-white mt-1">{typeCounts[type] || 0}</p>
            <p className="text-[8px] font-mono text-white/30 tracking-wider">{type.replace('_', ' ')}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input type="text" placeholder="Search entities or accounts..."
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary-500/30 font-mono" />
      </div>

      {/* Cross-Case Links */}
      {filtered.some(e => e.is_cross_case) && (
        <div className="rounded-2xl bg-red-500/[0.03] border border-red-500/10 p-4">
          <h3 className="text-xs font-mono text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" /> CROSS-CASE LINKS DETECTED
          </h3>
          <div className="space-y-2">
            {filtered.filter(e => e.is_cross_case).map(e => (
              <div key={e.entity_id} className="flex items-center gap-3 text-xs font-mono">
                <span>{ENTITY_ICONS[e.entity_type]?.icon}</span>
                <span className="text-white/60">{e.entity_value}</span>
                <span className="text-white/20">→</span>
                <span className="text-red-400">{e.case_count} cases linked</span>
                <span className="text-white/20">•</span>
                <span className="text-white/40">{e.accounts.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Entity Matrix */}
      {showMatrix && <SharedEntityMatrix entities={filtered} />}

      {/* Entity Table */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Type', 'Value', 'Accounts', 'Cases', 'Risk', 'Cross-Case'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-mono text-white/30 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(entity => (
              <tr key={entity.entity_id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <span className="text-sm">{ENTITY_ICONS[entity.entity_type]?.icon} </span>
                  <span className="text-[10px] font-mono text-white/40">{entity.entity_type}</span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-white/70">{entity.entity_value}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono text-white/50">{entity.account_count} accts</span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-white/40">{entity.case_count}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${RISK_STYLES[entity.risk_assessment]}`}>
                    {entity.risk_assessment}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {entity.is_cross_case && (
                    <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                      <Link2 className="w-3 h-3" /> LINKED
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Branch Intelligence */}
      <div>
        <h2 className="text-lg font-display text-white tracking-wider mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" /> BRANCH INTELLIGENCE
        </h2>
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['IFSC', 'Branch', 'City', 'Accounts', 'Fraud', 'Volume', 'Risk'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_BRANCHES.map(branch => (
                <tr key={branch.ifsc} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <td className="px-4 py-3 text-xs font-mono text-primary-400">{branch.ifsc}</td>
                  <td className="px-4 py-3 text-xs text-white/60">{branch.branch_name}</td>
                  <td className="px-4 py-3 text-xs text-white/40">{branch.city}</td>
                  <td className="px-4 py-3 text-xs font-mono text-white/50">{branch.account_count}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-red-400">{branch.fraud_account_count}</span>
                    <span className="text-[9px] text-white/20 ml-1">({((branch.fraud_account_count / branch.account_count) * 100).toFixed(0)}%)</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-white/50">{formatAmount(branch.total_fraud_volume)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${
                          branch.risk_score > 0.7 ? 'bg-red-400' : branch.risk_score > 0.4 ? 'bg-orange-400' : 'bg-emerald-400'
                        }`} style={{ width: `${branch.risk_score * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-white/30">{(branch.risk_score * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
