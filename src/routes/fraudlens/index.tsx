import { useEffect, useState, useRef } from "react";
import { createFileRoute } from '@tanstack/react-router';
import { Shield, AlertTriangle, Wifi, WifiOff, ChevronRight, Activity, Zap, Radio, Phone, Globe, Landmark } from "lucide-react";
import { useDashboardTelemetry, useStreamMetrics, useCases, CaseAlert } from "@/hooks/useDashboardData";
import { useTransactionStream } from "@/hooks/useTransactionStream";
import { ScrambleText } from "@/components/ui/scramble-text";
import { RBI_POLICY_RATES } from "@/data/regulatoryData";
import { EMERGENCY_NUMBERS, REPORTING_PORTALS, LAW_ENFORCEMENT } from "@/data/lawEnforcement";

import { API_BASE_URL, WS_BASE_URL } from '../../config';

export const Route = createFileRoute('/fraudlens/')({
  component: DashboardPage,
});
function DashboardPage() {
  const [counter, setCounter] = useState(0);
  const streamContainerRef = useRef<HTMLDivElement>(null);

  // Live data hooks
  const { data: telemetryData, isError: telemetryError } = useDashboardTelemetry();
  const { data: streamData } = useStreamMetrics();
  const { data: casesData, isError: casesError } = useCases();
  const { streamedNodes, connectionStatus } = useTransactionStream(`${WS_BASE_URL}/api/v1/ws/stream`);

  // Resolve live data
  const telemetry = telemetryData?.telemetry;
  const alerts = casesData?.cases?.map((c: CaseAlert) => ({ ...c, amount: c.total_amount })) || [];

  const [streamLog, setStreamLog] = useState<string[]>([
    '[SYS] ✅ Stream Pipeline initialized (Fallback Queue Mode)',
    '[SYS] 🧠 FraudSAGE GNN loaded (16-dim embeddings)',
    '[SYS] 🌲 IsolationForest loaded (4 features)',
    '[SYS] 📡 WebSocket Manager ready',
  ]);

  // Animated counter effect
  useEffect(() => {
    if (!telemetry || telemetry.total_protected_value === 0) return;
    const target = telemetry.total_protected_value;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCounter(current);
    }, 16);
    return () => clearInterval(timer);
  }, [telemetry?.total_protected_value]);

  // Stream log updates from WebSocket
  useEffect(() => {
    if (streamedNodes.length > 0) {
      const last = streamedNodes[streamedNodes.length - 1];
      setStreamLog(prev => [
        ...prev.slice(-20),
        `[${new Date().toLocaleTimeString('en-IN', { hour12: false })}] 🔴 INGESTED ${last.id} → Risk: ${(last.riskScore * 100).toFixed(0)}%`
      ]);
    }
  }, [streamedNodes]);

  // Connection status log
  useEffect(() => {
    if (connectionStatus === 'connected') {
      setStreamLog(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString('en-IN', { hour12: false })}] ✅ WebSocket CONNECTED`]);
    } else if (connectionStatus === 'disconnected') {
      setStreamLog(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString('en-IN', { hour12: false })}] ⚠️ WebSocket DISCONNECTED — fallback data mode`]);
    }
  }, [connectionStatus]);

  // Auto-scroll stream to bottom
  useEffect(() => {
    if (streamContainerRef.current) {
      streamContainerRef.current.scrollTop = streamContainerRef.current.scrollHeight;
    }
  }, [streamLog]);

  const threatColor = !telemetry ? 'text-white/40' : telemetry.threat_level === 'CRITICAL' ? 'text-danger-500' :
                       telemetry.threat_level === 'ELEVATED' ? 'text-warning-400' : 'text-safe-400';
  const threatBg = !telemetry ? 'bg-white/5 border-white/10' : telemetry.threat_level === 'CRITICAL' ? 'bg-danger-500/10 border-danger-500/30' :
                    telemetry.threat_level === 'ELEVATED' ? 'bg-warning-400/10 border-warning-400/30' : 'bg-safe-400/10 border-safe-400/30';

  const wsColor = connectionStatus === 'connected' ? 'text-safe-400' :
                  connectionStatus === 'connecting' ? 'text-warning-400' : 'text-danger-400';
  const wsLabel = connectionStatus === 'connected' ? 'STREAM LIVE' :
                  connectionStatus === 'connecting' ? 'CONNECTING...' : 'OFFLINE';

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold tracking-tight">
            <span className="text-primary-400"><ScrambleText text="MISSION" /></span>{' '}
            <span className="text-white/80"><ScrambleText text="CONTROL" revealDelay={800} /></span>
          </h1>
          <p className="text-xs text-white/40 font-mono mt-1"><ScrambleText text="Pune Police Cybercrime Cell" revealDelay={1200} /></p>
        </div>
        <div className="flex items-center gap-3">
          {/* Data Source Indicator */}
          <div className={`flex items-center gap-2 bg-background-card border border-white/5 rounded-full px-4 py-2`}>
            {connectionStatus === 'connected' ? (
              <Wifi className="w-3.5 h-3.5 text-safe-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-danger-400" />
            )}
            <span className={`text-[10px] font-mono ${wsColor}`}>{wsLabel}</span>
          </div>
          {/* Backend Status */}
          <div className="flex items-center gap-2 bg-background-card border border-white/5 rounded-full px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${telemetryError ? 'bg-danger-400' : 'bg-safe-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${telemetryError ? 'bg-danger-500' : 'bg-safe-500'}`}></span>
            </span>
            <span className={`text-[10px] font-mono ${telemetryError ? 'text-danger-400' : 'text-safe-400'}`}>
              {telemetryError ? 'API OFFLINE' : 'API ONLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* Global Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`relative overflow-hidden rounded-2xl border p-5 ${threatBg} group hover:scale-[1.02] transition-transform`}>
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-warning-400/5 blur-2xl group-hover:bg-warning-400/10 transition-colors" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className={`w-4 h-4 ${threatColor}`} />
              <span className="text-[10px] font-mono text-white/40 tracking-widest"><ScrambleText text="THREAT LEVEL" revealDelay={1000} /></span>
            </div>
            <div className={`text-2xl font-display font-bold tracking-wider ${threatColor}`}>
              {telemetry ? telemetry.threat_level : <span className="text-sm font-mono text-danger-400">UNAVAILABLE</span>}
            </div>
            <div className="text-[10px] text-white/30 font-mono mt-2">
              {telemetry ? `${telemetry.active_cases} active cases generating signal` : 'API Connection Failed'}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-safe-400/20 bg-safe-400/5 p-5 group hover:scale-[1.02] transition-transform">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-safe-400/5 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-safe-400" />
              <span className="text-[10px] font-mono text-white/40 tracking-widest"><ScrambleText text="PROTECTED CAPITAL" revealDelay={1200} /></span>
            </div>
            <div className={`text-2xl font-display font-bold tabular-nums ${telemetry ? 'text-safe-400' : 'text-white/40'}`}>
              {telemetry ? `₹${counter.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : 'N/A'}
            </div>
            <div className="text-[10px] text-white/30 font-mono mt-2">
              {telemetry ? 'Total value intercepted by AI' : 'API Connection Failed'}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-primary-400/20 bg-primary-400/5 p-5 group hover:scale-[1.02] transition-transform">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-primary-400/5 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-[10px] font-mono text-white/40 tracking-widest"><ScrambleText text="ML ENGINES" revealDelay={1400} /></span>
            </div>
            <div className="text-2xl font-display font-bold text-primary-400">3/3</div>
            <div className="flex gap-2 mt-3">
              <span className="text-[9px] font-mono bg-safe-500/10 text-safe-400 px-2 py-0.5 rounded border border-safe-500/20">GNN</span>
              <span className="text-[9px] font-mono bg-safe-500/10 text-safe-400 px-2 py-0.5 rounded border border-safe-500/20">IF</span>
              <span className="text-[9px] font-mono bg-safe-500/10 text-safe-400 px-2 py-0.5 rounded border border-safe-500/20">K-M</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 group hover:scale-[1.02] transition-transform">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-white/50" />
              <span className="text-[10px] font-mono text-white/40 tracking-widest"><ScrambleText text="STREAM I/O" revealDelay={1600} /></span>
            </div>
            <div className={`text-2xl font-display font-bold tabular-nums ${streamData && streamData.messages_processed !== null ? 'text-white/80' : 'text-danger-400'}`}>
              {streamData?.messages_processed ?? <span className="text-sm">OFFLINE</span>}
            </div>
            <div className="text-[10px] text-white/30 font-mono mt-2">
              {streamData && streamData.high_risk_flags !== null ? `${streamData.high_risk_flags} flagged · ${streamData.active_websocket_clients} clients` : 'WebSocket Disconnected'}
            </div>
          </div>
        </div>
      </div>

      {/* Stream Matrix & Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Stream Matrix */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-background-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-background-surface">
            <div className="flex items-center gap-2">
              <Radio className={`w-3.5 h-3.5 ${connectionStatus === 'connected' ? 'text-safe-400' : 'text-danger-400'} animate-pulse`} />
              <span className="text-[10px] font-mono text-white/60 tracking-wider"><ScrambleText text="STREAM MATRIX" revealDelay={1800} /></span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-danger-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-safe-500/60" />
            </div>
          </div>
          <div 
            ref={streamContainerRef}
            className="p-4 h-[300px] overflow-y-auto font-mono text-[10px] leading-relaxed space-y-1 relative"
          >
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <div className="relative z-10">
              {streamLog.map((line, i) => (
                <div
                  key={i}
                  className={`${
                    line.includes('🔴') ? 'text-danger-400' :
                    line.includes('✅') ? 'text-safe-400' :
                    line.includes('⚠️') ? 'text-warning-400' :
                    line.includes('🧠') ? 'text-primary-400' :
                    'text-white/50'
                  } ${i === streamLog.length - 1 ? 'animate-pulse drop-shadow-[0_0_5px_currentColor]' : ''}`}
                >
                  <span className="text-white/20 mr-2 opacity-50">&gt;</span>
                  {line}
                </div>
              ))}
              <div className="text-white/20 animate-pulse mt-1 ml-3">█</div>
            </div>
          </div>
        </div>

        {/* Case Ledger */}
        <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-background-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-background-surface">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-warning-400" />
              <span className="text-[10px] font-mono text-white/60 tracking-wider"><ScrambleText text="AUTOMATED CASE LEDGER" revealDelay={2000} /></span>
            </div>
            <span className="text-[10px] font-mono text-white/30">
              {casesData?.total ?? alerts.length} alerts
            </span>
          </div>

          <div className="divide-y divide-white/5 h-[300px] overflow-y-auto relative">
            {casesError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <AlertTriangle className="w-6 h-6 text-danger-400 mb-2 opacity-50" />
                <p className="text-xs font-mono text-danger-400">No verified data available.</p>
                <p className="text-[10px] text-white/40 mt-1">/api/v1/cases returned an error. No fabricated data will be provided.</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white/40">
                0 Active Alerts
              </div>
            ) : alerts.map((alert: CaseAlert) => {
              const priorityStyle = alert.priority === 'critical'
                ? 'bg-danger-500/10 text-danger-400 border-danger-500/30'
                : alert.priority === 'high'
                ? 'bg-warning-400/10 text-warning-400 border-warning-400/30'
                : alert.priority === 'medium'
                ? 'bg-primary-400/10 text-primary-400 border-primary-400/30'
                : 'bg-white/5 text-white/40 border-white/10';

              return (
                <div key={alert.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors group gap-2">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`px-2 py-1 rounded text-[9px] font-mono uppercase tracking-wider border ${priorityStyle}`}>
                      {alert.priority}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-white/80 font-mono truncate">{alert.case_number}</div>
                      <div className="text-[10px] text-white/30 truncate">{alert.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono text-white/60">₹{(alert.amount || 0).toLocaleString('en-IN')}</div>
                      <div className="text-[9px] text-white/20 font-mono mt-0.5">
                        {alert.status === 'open' ? '🔴 OPEN' : alert.status === 'investigating' ? '🟡 INVESTIGATING' : '🟢 CLOSED'}
                      </div>
                    </div>
                    <a
                      href={`/fraudlens/graph?case=${alert.id}`}
                      className="flex items-center gap-1 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      Investigate <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Regulatory Quick Reference (Real Data) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* RBI Policy Rates */}
        <div className="rounded-2xl border border-white/5 bg-background-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Landmark className="w-4 h-4 text-primary-400" />
            <span className="text-[10px] font-mono text-white/60 tracking-wider">RBI POLICY RATES</span>
            <span className="text-[8px] font-mono text-white/20 ml-auto">MPC {RBI_POLICY_RATES.lastUpdated}</span>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Repo Rate', value: `${RBI_POLICY_RATES.repoRate}%` },
              { label: 'CRR', value: `${RBI_POLICY_RATES.cashReserveRatio}%` },
              { label: 'SLR', value: `${RBI_POLICY_RATES.statutoryLiquidityRatio}%` },
              { label: 'Bank Rate', value: `${RBI_POLICY_RATES.bankRate}%` },
              { label: 'Stance', value: RBI_POLICY_RATES.policyStance },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-xs text-white/40 font-mono">{item.label}</span>
                <span className="text-xs text-white/80 font-mono font-bold">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="text-[8px] font-mono text-white/15 mt-3">Source: rbi.org.in</div>
        </div>

        {/* Pune Cyber Cell */}
        {(() => {
          const cyberCell = LAW_ENFORCEMENT.find(l => l.id === 'pune-cyber-ps');
          if (!cyberCell) return null;
          return (
            <div className="rounded-2xl border border-white/5 bg-background-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-primary-400" />
                <span className="text-[10px] font-mono text-white/60 tracking-wider">CYBER CRIME CELL — PUNE</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-[9px] font-mono text-white/30 mb-1">ADDRESS</div>
                  <div className="text-[11px] text-white/70 leading-relaxed">{cyberCell.address}</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-white/30 mb-1">CONTACT</div>
                  <div className="space-y-1">
                    {cyberCell.phone?.map(p => (
                      <div key={p} className="text-xs text-primary-400 font-mono flex items-center gap-1.5">
                        <Phone className="w-3 h-3" /> {p}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-white/30 mb-1">EMAIL</div>
                  <div className="text-xs text-primary-400 font-mono">{cyberCell.email}</div>
                </div>
              </div>
              <div className="text-[8px] font-mono text-white/15 mt-3">Source: punepolice.gov.in</div>
            </div>
          );
        })()}

        {/* Emergency Helplines */}
        <div className="rounded-2xl border border-white/5 bg-background-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-4 h-4 text-danger-400" />
            <span className="text-[10px] font-mono text-white/60 tracking-wider">EMERGENCY HELPLINES</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-danger-500/5 border border-danger-500/20 rounded-lg px-3 py-2">
              <div>
                <div className="text-xs text-white/80 font-bold">Cyber Crime</div>
                <div className="text-[9px] text-white/30 font-mono">National Helpline</div>
              </div>
              <div className="text-xl font-mono font-bold text-danger-400">{EMERGENCY_NUMBERS.cyberCrimeHelpline}</div>
            </div>
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2">
              <div>
                <div className="text-xs text-white/80">Emergency</div>
                <div className="text-[9px] text-white/30 font-mono">Police / Fire / Ambulance</div>
              </div>
              <div className="text-lg font-mono font-bold text-white/60">{EMERGENCY_NUMBERS.policeEmergency}</div>
            </div>
            <div className="space-y-1.5 mt-2">
              <div className="text-[9px] font-mono text-white/30">REPORTING PORTALS</div>
              {[
                { label: 'National Cyber Crime Portal', url: REPORTING_PORTALS.nationalCyberCrime },
                { label: 'RBI Complaint (SACHET)', url: REPORTING_PORTALS.sachet },
                { label: 'FIU-IND Reporting', url: REPORTING_PORTALS.fiuReporting },
              ].map(p => (
                <div key={p.label} className="flex items-center gap-1.5 text-[10px]">
                  <Globe className="w-3 h-3 text-white/20" />
                  <span className="text-white/40">{p.label}</span>
                  <span className="text-primary-400/60 font-mono ml-auto text-[9px] truncate max-w-[120px]">{p.url.replace('https://', '')}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[8px] font-mono text-white/15 mt-3">Source: cybercrime.gov.in / rbi.org.in</div>
        </div>
      </div>
    </div>
  );
}
