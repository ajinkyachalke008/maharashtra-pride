import React, { useState, useEffect, useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Search, Globe, Phone, Mail, MapPin, ShieldAlert, Activity, AlertTriangle, CheckCircle, Database, Server, Bitcoin, User, Network } from 'lucide-react';
import { ScrambleText } from '@/components/ui/scramble-text';

export const Route = createFileRoute('/fraudlens/osint')({
  component: OSINTDashboard,
});

type EntityType = 'IP' | 'PHONE' | 'EMAIL' | 'DOMAIN' | 'CRYPTO' | 'USERNAME';

const MOCK_DATA = {};

function OSINTDashboard() {
  const [entityType, setEntityType] = useState<EntityType>('IP');
  const [entityValue, setEntityValue] = useState('');
  const [searchQuery, setSearchQuery] = useState<{ type: EntityType, value: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [scrapingLogs, setScrapingLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrapingLogs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityValue.trim()) return;
    setSearchQuery({ type: entityType, value: entityValue.trim() });
    
    setIsLoading(true);
    setData(null);
    setScrapingLogs([]);
    
    let step = 0;
    const logs = [
      `[SYS] Initializing OSINT collectors for ${entityValue.trim()}...`,
      `[NET] Bypassing CAPTCHA on ClearWeb registries...`,
      `[DB] Querying standard APIs (Truecaller, Shodan, WHOIS)...`,
      `[TOR] Connecting to Onion nodes for DarkWeb dump search...`,
      `[TOR] Found 3 potential database leaks in underground forums.`,
      `[ML] Applying NLP model to extract entities from unstructured text...`,
      `[SYS] Correlating identity graphs...`,
      `[SYS] Aggregating risk vectors and computing final score...`
    ];
    
    const interval = setInterval(() => {
      setScrapingLogs(prev => [...prev, logs[step]]);
      step++;
      if (step >= logs.length) clearInterval(interval);
    }, 250);

    setTimeout(() => {
      // @ts-ignore
      setData(MOCK_DATA[entityType] || MOCK_DATA['IP']);
      setIsLoading(false);
    }, 2500);
  };

  const renderRiskScore = (score: number) => {
    if (score >= 0.7) return <span className="text-red-400 font-bold flex items-center gap-1"><AlertTriangle className="w-4 h-4"/> CRITICAL ({score})</span>;
    if (score >= 0.4) return <span className="text-warning-400 font-bold flex items-center gap-1"><Activity className="w-4 h-4"/> SUSPICIOUS ({score})</span>;
    return <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4"/> BENIGN ({score})</span>;
  };

  const renderIPIntelligence = (data: any) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-background-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <MapPin className="text-primary-400" /> Geolocation
        </h3>
        <dl className="space-y-4">
          <div><dt className="text-sm text-white/40 font-mono">Country</dt><dd className="text-lg text-white">{data.geolocation.country}</dd></div>
          <div><dt className="text-sm text-white/40 font-mono">Coordinates</dt><dd className="font-mono text-white/60">{data.geolocation.latitude}, {data.geolocation.longitude}</dd></div>
        </dl>
      </div>
      <div className="bg-background-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Server className="text-warning-400" /> Infrastructure
        </h3>
        <dl className="space-y-4">
          <div><dt className="text-sm text-white/40 font-mono">ASN</dt><dd className="font-mono text-white">{data.asn.number} - {data.asn.organization}</dd></div>
          <div className="grid grid-cols-2 gap-4">
            <div><dt className="text-sm text-white/40 font-mono">VPN / Proxy</dt><dd className="text-white">{data.threat_intel.is_vpn || data.threat_intel.is_proxy ? 'DETECTED' : 'CLEAN'}</dd></div>
            <div><dt className="text-sm text-white/40 font-mono">Abuse Reports</dt><dd className="text-white">{data.threat_intel.recent_abuse_reports}</dd></div>
          </div>
        </dl>
      </div>
    </div>
  );

  const renderPhoneIntelligence = (data: any) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-background-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Phone className="text-primary-400" /> Caller Identity
        </h3>
        <dl className="space-y-4">
          <div><dt className="text-sm text-white/40 font-mono">Registered Name</dt><dd className="text-lg text-white">{data.caller_id.name}</dd></div>
          <div><dt className="text-sm text-white/40 font-mono">Carrier / Line</dt><dd className="text-white/60">{data.caller_id.carrier} ({data.caller_id.line_type})</dd></div>
        </dl>
      </div>
      <div className="bg-background-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <ShieldAlert className="text-red-400" /> Spam Reputation
        </h3>
        <dl className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div><dt className="text-sm text-white/40 font-mono">Spam Score</dt><dd className="text-xl font-bold text-white">{data.spam_reputation.spam_score}/100</dd></div>
             <div><dt className="text-sm text-white/40 font-mono">User Reports</dt><dd className="text-white">{data.spam_reputation.user_reports}</dd></div>
          </div>
          <div>
            <dt className="text-sm text-white/40 font-mono">Tags</dt>
            <dd className="flex gap-2 mt-1">
              {data.spam_reputation.tags.length > 0 ? data.spam_reputation.tags.map((t: string) => (
                <span key={t} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">{t}</span>
              )) : <span className="text-white/60 text-sm">No malicious tags</span>}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );

  const renderEmailIntelligence = (data: any) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-background-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Database className="text-red-400" /> Breach Intelligence
        </h3>
        <dl className="space-y-4">
          <div><dt className="text-sm text-white/40 font-mono">Known Breaches (Pwned)</dt><dd className="text-xl font-bold text-white">{data.breach_monitoring.pwned_count}</dd></div>
          <div><dt className="text-sm text-white/40 font-mono">Latest Breach Event</dt><dd className="text-white/60">{data.breach_monitoring.latest_breach || 'None on record'}</dd></div>
        </dl>
      </div>
      <div className="bg-background-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Mail className="text-primary-400" /> Domain & Inbox
        </h3>
        <dl className="space-y-4">
          <div><dt className="text-sm text-white/40 font-mono">Domain</dt><dd className="text-white">{data.domain_reputation.domain} {data.domain_reputation.is_disposable && <span className="text-red-400 text-xs border border-red-400 px-1 ml-2">DISPOSABLE</span>}</dd></div>
          <div><dt className="text-sm text-white/40 font-mono">SMTP Reachable</dt><dd className="text-white/60">{data.deliverability.smtp_reachable ? 'YES' : 'NO'}</dd></div>
        </dl>
      </div>
    </div>
  );

  const renderDomainIntelligence = (data: any) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-background-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Globe className="text-primary-400" /> WHOIS Registration
        </h3>
        <dl className="space-y-4">
          <div><dt className="text-sm text-white/40 font-mono">Registrar</dt><dd className="text-white">{data.whois.registrar}</dd></div>
          <div className="grid grid-cols-2 gap-4">
             <div><dt className="text-sm text-white/40 font-mono">Creation Date</dt><dd className="text-white">{data.whois.creation_date}</dd></div>
             <div><dt className="text-sm text-white/40 font-mono">Days Old</dt><dd className="text-white font-mono">{data.whois.days_old}</dd></div>
          </div>
        </dl>
      </div>
      <div className="bg-background-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Activity className="text-warning-400" /> Threat Intel
        </h3>
        <dl className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div><dt className="text-sm text-white/40 font-mono">Phishing List</dt><dd className={data.threat_intel.phishing_detected ? 'text-red-400' : 'text-white/60'}>{data.threat_intel.phishing_detected ? 'FLAGGED' : 'CLEAN'}</dd></div>
             <div><dt className="text-sm text-white/40 font-mono">Malware Hosted</dt><dd className={data.threat_intel.malware_hosted ? 'text-red-400' : 'text-white/60'}>{data.threat_intel.malware_hosted ? 'FLAGGED' : 'CLEAN'}</dd></div>
          </div>
          <div><dt className="text-sm text-white/40 font-mono">A Records (Resolved IP)</dt><dd className="text-white/60 font-mono text-sm">{data.dns.a_records.join(', ')}</dd></div>
        </dl>
      </div>
    </div>
  );

  const renderCryptoIntelligence = (data: any) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-background-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Bitcoin className="text-warning-400" /> Blockchain Data
        </h3>
        <dl className="space-y-4">
          <div><dt className="text-sm text-white/40 font-mono">Network</dt><dd className="text-lg text-white font-bold">{data.blockchain_data.network}</dd></div>
          <div className="grid grid-cols-2 gap-4">
             <div><dt className="text-sm text-white/40 font-mono">Balance</dt><dd className="text-xl text-primary-400 font-mono">{data.blockchain_data.balance}</dd></div>
             <div><dt className="text-sm text-white/40 font-mono">Tx Count</dt><dd className="text-white font-mono">{data.blockchain_data.total_transactions}</dd></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div><dt className="text-sm text-white/40 font-mono">First Seen</dt><dd className="text-white/60">{data.blockchain_data.first_seen}</dd></div>
             <div><dt className="text-sm text-white/40 font-mono">Last Seen</dt><dd className="text-white/60">{data.blockchain_data.last_seen}</dd></div>
          </div>
        </dl>
      </div>
      <div className="bg-background-surface border border-white/5 rounded-xl p-6 border-l-4 border-l-red-500">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Network className="text-red-400" /> Forensic Attribution
        </h3>
        <dl className="space-y-4">
          <div><dt className="text-sm text-white/40 font-mono">Identified Cluster</dt><dd className="text-xl font-bold text-red-400">{data.forensic_attribution.identified_cluster}</dd></div>
          <div><dt className="text-sm text-white/40 font-mono">Exchange Hot Wallet</dt><dd className="text-white/60">{data.forensic_attribution.is_exchange_hot_wallet ? 'YES' : 'NO'}</dd></div>
          <div>
             <dt className="text-sm text-white/40 font-mono mb-2">Illicit Exposure</dt>
             <div className="w-full bg-background-base rounded-full h-2.5">
               <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${data.forensic_attribution.illicit_exposure_pct}%` }}></div>
             </div>
             <dd className="text-white/60 text-right mt-1 text-xs">{data.forensic_attribution.illicit_exposure_pct}%</dd>
          </div>
        </dl>
      </div>
    </div>
  );

  const renderUsernameIntelligence = (data: any) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-background-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <User className="text-primary-400" /> Social Footprint
        </h3>
        <div className="space-y-3">
          <div className="text-sm text-white/40 font-mono mb-4">Searched across {data.social_footprint.platforms_checked} platforms</div>
          {data.social_footprint.details.map((plat: any, i: number) => (
             <div key={i} className="flex items-center justify-between p-3 bg-background-base rounded border border-white/5">
               <span className="font-semibold text-white">{plat.name}</span>
               <span className={plat.found ? 'text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2 py-1 rounded' : 'text-white/40 text-sm'}>
                 {plat.found ? 'FOUND' : 'NOT FOUND'}
               </span>
             </div>
          ))}
        </div>
      </div>
      <div className="bg-background-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Search className="text-warning-400" /> Extracted Intel
        </h3>
        <dl className="space-y-4">
          <div><dt className="text-sm text-white/40 font-mono">Possible Real Name</dt><dd className="text-lg text-white">{data.extracted_intel.possible_real_name || 'Unknown'}</dd></div>
          <div><dt className="text-sm text-white/40 font-mono">Bio Snippet</dt><dd className="text-white/60 italic border-l-2 border-white/5 pl-3 mt-1">{data.extracted_intel.bio_snippet}</dd></div>
          {data.extracted_intel.associated_locations.length > 0 && (
            <div><dt className="text-sm text-white/40 font-mono">Associated Locations</dt><dd className="text-white mt-1">{data.extracted_intel.associated_locations.join(', ')}</dd></div>
          )}
        </dl>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 font-display">
          <Globe className="text-primary-400 w-6 h-6" /> <ScrambleText text="External OSINT Intelligence" />
        </h1>
        <p className="text-white/60"><ScrambleText text="Simulated aggregation of external registries (Truecaller, Shodan, WHOIS, HIBP)." revealDelay={500} /></p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <select 
          value={entityType} 
          onChange={(e) => setEntityType(e.target.value as EntityType)}
          className="bg-background-surface border border-white/5 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 font-mono"
        >
          <option value="IP">IP Address</option>
          <option value="PHONE">Phone Number</option>
          <option value="EMAIL">Email Address</option>
          <option value="DOMAIN">Domain Name</option>
          <option value="CRYPTO">Crypto Wallet</option>
          <option value="USERNAME">Social Username</option>
        </select>
        <input 
          type="text" 
          value={entityValue}
          onChange={(e) => setEntityValue(e.target.value)}
          placeholder={entityType === 'IP' ? 'e.g., 103.45.67.89' : entityType === 'PHONE' ? 'e.g., 9876543210' : entityType === 'CRYPTO' ? 'e.g., bc1q...' : entityType === 'USERNAME' ? 'e.g., scammer99' : `e.g., suspect@${entityType.toLowerCase()}`}
          className="flex-1 bg-background-surface border border-white/5 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 font-mono"
        />
        <button 
          type="submit"
          className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl transition-colors font-bold flex items-center gap-2"
        >
          <Search className="w-5 h-5" /> SCAN
        </button>
      </form>

      {/* Results */}
      {isLoading && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 font-mono text-xs overflow-hidden relative shadow-lg">
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
            <Search className="w-5 h-5 animate-bounce text-primary-500" />
            <span className="text-primary-400 font-bold uppercase tracking-widest animate-pulse">Running OSINT Scan...</span>
          </div>
          <div className="space-y-2 h-[150px] overflow-y-auto">
            {scrapingLogs.map((log, i) => (
              <div key={i} className="text-white/60">
                <span className="text-white/20 mr-2">&gt;</span>
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
            <div className="text-primary-500 animate-pulse mt-2">█</div>
          </div>
        </div>
      )}

      {data && !isLoading && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
             <div>
               <h2 className="text-xl font-mono font-bold text-white">{data.entity}</h2>
               <span className="text-sm text-white/40 uppercase tracking-widest">{data.type} INTELLIGENCE REPORT</span>
             </div>
             <div className="text-right">
               <div className="text-sm text-white/40 mb-1">Composite Risk</div>
               {renderRiskScore(data.risk_score)}
             </div>
          </div>
          
          {data.type === 'IP' && renderIPIntelligence(data.data)}
          {data.type === 'PHONE' && renderPhoneIntelligence(data.data)}
          {data.type === 'EMAIL' && renderEmailIntelligence(data.data)}
          {data.type === 'DOMAIN' && renderDomainIntelligence(data.data)}
          {data.type === 'CRYPTO' && renderCryptoIntelligence(data.data)}
          {data.type === 'USERNAME' && renderUsernameIntelligence(data.data)}
        </div>
      )}
    </div>
  );
}
