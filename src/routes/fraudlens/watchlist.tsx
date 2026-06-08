import { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ShieldAlert, Search, Plus, Filter, AlertTriangle,
  UserX, Building2, Globe2, Wallet, UserCheck,
  MoreVertical, Edit2, Trash2, ShieldCheck, Download
} from 'lucide-react';

export const Route = createFileRoute('/fraudlens/watchlist')({
  component: WatchlistPage,
});

// ──── Types ──────────────────────────────────────────────────

type EntityType = 'INDIVIDUAL' | 'COMPANY' | 'IP' | 'CRYPTO_WALLET';
type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM';

interface WatchlistEntity {
  id: string;
  name: string;
  type: EntityType;
  identifier: string; // ID number, IP, Address
  risk_level: RiskLevel;
  source: string;
  date_added: string;
  matched_txns: number;
  reason: string;
  status: 'ACTIVE' | 'CLEARED';
}

// ──── Mock Data ──────────────────────────────────────────────

const MOCK_WATCHLIST: WatchlistEntity[] = [
  { id: 'w1', name: 'Vikram Singh (Alias)', type: 'INDIVIDUAL', identifier: 'PAN: ABCDE1234F', risk_level: 'CRITICAL', source: 'CBI Look Out Circular', date_added: '2026-05-10', matched_txns: 14, reason: 'Identified as ringleader in 100Cr investment scam. Absconding.', status: 'ACTIVE' },
  { id: 'w2', name: 'NexGen Tech Solutions Pvt Ltd', type: 'COMPANY', identifier: 'CIN: U72900MH2025PTC123456', risk_level: 'HIGH', source: 'Internal Pattern Analysis', date_added: '2026-06-01', matched_txns: 42, reason: 'Shell company suspected of layering funds for international exit.', status: 'ACTIVE' },
  { id: 'w3', name: 'Russian Proxy Exit Node', type: 'IP', identifier: '185.15.59.22', risk_level: 'MEDIUM', source: 'Threat Intel Feed', date_added: '2026-06-05', matched_txns: 8, reason: 'Known VPN exit node used in multiple banking portal login anomalies.', status: 'ACTIVE' },
  { id: 'w4', name: 'DarkNet Vendor Wallet', type: 'CRYPTO_WALLET', identifier: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', risk_level: 'CRITICAL', source: 'Chainalysis API', date_added: '2026-04-20', matched_txns: 3, reason: 'Direct recipient of converted fiat from compromised accounts.', status: 'ACTIVE' },
  { id: 'w5', name: 'Rahul Sharma', type: 'INDIVIDUAL', identifier: 'Phone: +91 9876543210', risk_level: 'HIGH', source: 'NCRP Cyber Cell', date_added: '2026-05-25', matched_txns: 0, reason: 'Number flagged in 50+ OTP fraud complaints.', status: 'ACTIVE' },
  { id: 'w6', name: 'Global Trading FZC', type: 'COMPANY', identifier: 'SWIFT: GTFZAEDX', risk_level: 'CRITICAL', source: 'Interpol Notice', date_added: '2025-11-15', matched_txns: 1, reason: 'Entity blacklisted for hawala operations.', status: 'ACTIVE' },
  { id: 'w7', name: 'Unknown Mule 099', type: 'INDIVIDUAL', identifier: 'Aadhar: XXXX-XXXX-1122', risk_level: 'MEDIUM', source: 'FraudLens Auto-Detect', date_added: '2026-06-02', matched_txns: 12, reason: 'Pattern match: Rapid transit node in case CASE-2026-A8F3.', status: 'CLEARED' },
];

const ICONS = {
  INDIVIDUAL: UserX,
  COMPANY: Building2,
  IP: Globe2,
  CRYPTO_WALLET: Wallet,
};

const RISK_STYLES = {
  CRITICAL: 'bg-red-500/15 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-amber-400/15 text-amber-400 border-amber-500/30',
};

// ──── Component ──────────────────────────────────────────────

function WatchlistPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE');

  const filtered = useMemo(() => {
    let data = MOCK_WATCHLIST;
    if (typeFilter !== 'ALL') data = data.filter(e => e.type === typeFilter);
    if (statusFilter !== 'ALL') data = data.filter(e => e.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(e => 
        e.name.toLowerCase().includes(q) || 
        e.identifier.toLowerCase().includes(q) ||
        e.reason.toLowerCase().includes(q)
      );
    }
    return data;
  }, [searchQuery, typeFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: MOCK_WATCHLIST.filter(e => e.status === 'ACTIVE').length,
    critical: MOCK_WATCHLIST.filter(e => e.status === 'ACTIVE' && e.risk_level === 'CRITICAL').length,
    matches: MOCK_WATCHLIST.reduce((sum, e) => sum + e.matched_txns, 0)
  }), []);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-white tracking-wider flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-primary-400" />
            GLOBAL WATCHLIST
          </h1>
          <p className="text-sm text-white/40 mt-1 font-mono">
            Proactive monitoring of flagged entities, accounts, and infrastructure.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/60 text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export List
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/30 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <Plus className="w-4 h-4" />
            Add Entity
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-1">Active Monitored Entities</p>
          <p className="text-3xl font-display text-white">{stats.total}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-red-500/20 p-5 bg-gradient-to-br from-red-500/5 to-transparent">
          <p className="text-[10px] font-mono text-red-400/60 uppercase tracking-wider mb-1">Critical Risk Entities</p>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <p className="text-3xl font-display text-red-400">{stats.critical}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-1">Total Watchlist Hits</p>
          <p className="text-3xl font-display text-amber-400">{stats.matches}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input type="text" placeholder="Search by name, ID, IP..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background-surface border border-white/5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-primary-500/30 font-mono" />
        </div>

        <div className="flex bg-background-surface border border-white/5 rounded-xl p-1">
          {['ALL', 'INDIVIDUAL', 'COMPANY', 'IP', 'CRYPTO_WALLET'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${typeFilter === t ? 'bg-primary-500/20 text-primary-400' : 'text-white/40 hover:text-white/80'}`}>
              {t === 'ALL' ? 'All Types' : t.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex bg-background-surface border border-white/5 rounded-xl p-1">
          {['ACTIVE', 'CLEARED', 'ALL'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${statusFilter === s ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map(entity => {
          const Icon = ICONS[entity.type];
          return (
            <div key={entity.id} className={`rounded-xl border p-4 transition-all flex flex-col md:flex-row gap-4 md:items-center ${
              entity.status === 'ACTIVE' 
                ? 'bg-background-surface border-white/5 hover:border-white/10' 
                : 'bg-background-base border-white/5 opacity-50 grayscale'
            }`}>
              
              {/* Icon & Primary Info */}
              <div className="flex items-start md:items-center gap-4 flex-1">
                <div className={`p-3 rounded-xl border ${
                  entity.status === 'CLEARED' ? 'bg-white/5 border-white/10 text-white/40' :
                  entity.risk_level === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  entity.risk_level === 'HIGH' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                  'bg-amber-400/10 border-amber-500/20 text-amber-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{entity.name}</h3>
                    {entity.status === 'CLEARED' && (
                      <span className="flex items-center gap-1 text-[9px] font-mono bg-white/10 text-white/60 px-1.5 py-0.5 rounded">
                        <ShieldCheck className="w-3 h-3" /> CLEARED
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-white/50 mt-1">{entity.identifier}</p>
                </div>
              </div>

              {/* Reason & Source */}
              <div className="flex-1">
                <p className="text-sm text-white/70 line-clamp-2">{entity.reason}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded">Source: {entity.source}</span>
                  <span className="text-[10px] font-mono text-white/30">Added: {entity.date_added}</span>
                </div>
              </div>

              {/* Risk & Matches */}
              <div className="flex items-center gap-6 justify-between md:justify-end md:w-64">
                <div className="text-center">
                  <p className="text-lg font-display text-white">{entity.matched_txns}</p>
                  <p className="text-[9px] font-mono text-white/30 uppercase">Hits</p>
                </div>
                <div className="text-center min-w-[80px]">
                   <span className={`text-[10px] font-mono px-2 py-1 rounded border ${RISK_STYLES[entity.risk_level]}`}>
                    {entity.risk_level}
                   </span>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
        
        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/40 font-mono text-sm border border-dashed border-white/10 rounded-2xl">
            No watchlist entities match your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
