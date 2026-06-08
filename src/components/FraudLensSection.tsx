import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Shield, AlertTriangle, Wifi, WifiOff, ChevronRight, Network, FileText, Lock, Globe, Cpu,
  Search, Brain, ShieldCheck, BarChart3, Eye, ExternalLink,
  Map, Radio, Fingerprint, Database, Activity, Zap,
  ArrowRight, Server, MonitorPlay, Layout, Palette, CheckCircle
} from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { ScrambleText } from "@/components/ui/scramble-text";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { FraudLensBackground } from "@/components/ui/fraudlens-background";
import { useDashboardTelemetry, useStreamMetrics, useCases, CaseAlert } from "@/hooks/useDashboardData";
import { useTransactionStream } from "@/hooks/useTransactionStream";

const FRAUDLENS_URL = "https://frontend-lemon-theta-90.vercel.app";

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — HERO INTRODUCTION
   ═══════════════════════════════════════════════════════════════ */

function FraudLensHero() {
  return (
    <div className="relative py-28 md:py-40 text-center overflow-hidden">
      <FraudLensBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        <div className="text-xs tracking-[0.5em] text-sky-400/80 uppercase mb-4">
          Pune Police Cybercrime Cell
        </div>
        <div className="font-devanagari text-lg md:text-xl text-sky-300/70 mb-2">
          फ्रॉडलेन्स
        </div>
        <h2
          className="relative font-display text-6xl md:text-[8rem] font-black tracking-[0.1em] mb-6 uppercase"
          style={{
            filter: "drop-shadow(0px 0px 30px rgba(34, 211, 238, 0.5)) drop-shadow(0px 10px 10px rgba(0,0,0,0.8))",
          }}
        >
          <ScrambleText 
            text="FRAUDLENS" 
            revealDelay={200} 
            revealDuration={2500} 
            repeatDelay={6000} 
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #a5f3fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          />
        </h2>
        <p className="font-display text-base md:text-lg text-white/70 tracking-[0.15em] uppercase max-w-3xl mx-auto mb-8">
          Real-Time Cybercrime Intelligence & Graph Analytics Platform
        </p>
        <div className="h-px w-28 mx-auto bg-gradient-to-r from-transparent via-sky-400/60 to-transparent mb-8" />
        {/* Polished Description Paragraph (Floating) */}
        <div className="max-w-4xl mx-auto mt-8 relative">
          <div 
            className="relative leading-relaxed px-6 py-4 md:px-10 text-cyan-50/90 font-medium text-center min-h-[120px] flex items-center justify-center"
            style={{ 
              fontSize: '1.05em',
              letterSpacing: '0.03em',
              textShadow: '0px 2px 4px rgba(0,0,0,0.8), 0px 0px 15px rgba(34,211,238,0.4)', // Polished glowing 3D shadow
            }}
          >
            <ScrambleText 
              text="An enterprise-grade Cybercrime Management and Intelligence Platform built for Law Enforcement. End-to-end capabilities spanning live transaction ingestion, Neo4j graph network analysis, geospatial IP tracking, OSINT enrichment, and cryptographic court-ready report generation — all powered by GraphSAGE neural networks and real-time Kafka streaming."
              revealDelay={200}
              revealDuration={2500} // Detailed decryption sweep
              repeatDelay={6000} // Pause for 6 seconds
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — MISSION CONTROL STATS (Real Platform KPIs)
   ═══════════════════════════════════════════════════════════════ */

const MISSION_STATS = [
  { value: 3, suffix: "/3", label: "ML Engines Online", sub: "GNN · IF · K-M", color: "text-emerald-400" },
  { value: 19, suffix: "", label: "Forensic Detectors", sub: "12 structural + 7 scam", color: "text-sky-400" },
  { value: 4, suffix: "", label: "Active Syndicates", sub: "SYN-101 through SYN-104", color: "text-rose-400" },
  { value: 98.2, suffix: "%", label: "FraudSAGE Accuracy", sub: "GNN validation", color: "text-amber-400" },
];

function MissionCounter({ to, suffix, active }: { to: number; suffix: string; active: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const isDecimal = to % 1 !== 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(isDecimal ? Math.round(eased * to * 10) / 10 : Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active]);
  return <span>{n}{suffix}</span>;
}

function MissionStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setActive(true); obs.disconnect(); }
    }, { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative py-20 md:py-24">
      <div className="scan-line" />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="text-xs tracking-[0.4em] text-sky-400/70 uppercase mb-3">Mission Control</div>
          <h3 className="font-display text-2xl md:text-4xl text-white/90 tracking-wide">
            Platform Intelligence
          </h3>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
          {MISSION_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative text-center ${i > 0 ? "md:border-l md:border-sky-400/10" : ""}`}
            >
              <div className={`font-display text-4xl md:text-5xl font-bold ${s.color} tracking-wider`}>
                <MissionCounter to={s.value} suffix={s.suffix} active={active} />
              </div>
              <div className="text-[10px] text-white/45 mt-2 tracking-[0.3em] uppercase">{s.label}</div>
              <div className="font-mono text-[10px] text-white/25 mt-1">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — CORE MODULES (The Real FraudLens Modules)
   ═══════════════════════════════════════════════════════════════ */

const MODULES = [
  {
    icon: Activity, code: "HQ", title: "Mission Control",
    desc: "Real-time command dashboard — threat level, protected capital, stream matrix, and automated case ledger with live alert feeds.",
    route: "/",
    theme: "orange" as const, gradientFrom: "#f43f5e", gradientTo: "#f59e0b", hexVar: "#ea580c", hexLight: "#ffedd5", actionText: "Launch HQ"
  },
  {
    icon: Network, code: "GRAPH", title: "Network Explorer",
    desc: "Interactive D3.js fraud ring visualization showing 3-hop suspect/victim/mule node graphs with live stream listening.",
    route: "/graph",
    theme: "blue" as const, gradientFrom: "#3b82f6", gradientTo: "#22d3ee", hexVar: "#2563eb", hexLight: "#dbeafe", actionText: "Explore Graphs"
  },
  {
    icon: Database, code: "DATA", title: "Ingestion Engine",
    desc: "Async transaction ingestion via Kafka/WebSocket — drop PDF, Excel, CSV or Word files to extract transactions and build the graph.",
    route: "/ingest",
    theme: "green" as const, gradientFrom: "#10b981", gradientTo: "#84cc16", hexVar: "#16a34a", hexLight: "#dcfce7", actionText: "Upload Data"
  },
  {
    icon: Eye, code: "WATCH", title: "Blacklist & Watchlist",
    desc: "Institutional memory of confirmed fraud accounts with bank notification tracking and court order status.",
    route: "/watchlist",
    theme: "red" as const, gradientFrom: "#e11d48", gradientTo: "#f43f5e", hexVar: "#dc2626", hexLight: "#fee2e2", actionText: "View Watchlist"
  },
  {
    icon: Map, code: "MAP", title: "Geospatial Intelligence",
    desc: "Deck.gl powered 3D hex volumes, density heatmaps, transaction arcs, and node scatterplots centered on Pune.",
    route: "/map",
    theme: "purple" as const, gradientFrom: "#8b5cf6", gradientTo: "#d946ef", hexVar: "#9333ea", hexLight: "#f3e8ff", actionText: "Open Map"
  },
  {
    icon: Radio, code: "PTNS", title: "Pattern Analysis",
    desc: "19 forensic detectors — Investment Scam, Round Robin, OTP Fraud, Smurfing, Mule Chain, Job Scam — with confidence scoring.",
    route: "/patterns",
    theme: "amber" as const, gradientFrom: "#f59e0b", gradientTo: "#fcd34d", hexVar: "#d97706", hexLight: "#fef3c7", actionText: "Analyze Patterns"
  },
  {
    icon: FileText, code: "RPRT", title: "AI Case Dossiers",
    desc: "Generate official FIRs and charge sheets using OpenRouter LLM with SHA-256 cryptographic hashing for court admissibility.",
    route: "/reports",
    theme: "gold" as const, gradientFrom: "#eab308", gradientTo: "#fde047", hexVar: "#ca8a04", hexLight: "#fef08a", actionText: "Generate Dossier"
  },
  {
    icon: Fingerprint, code: "LINK", title: "Shared Entities",
    desc: "Cross-case connection matrix — Phone, UPI, IFSC, PAN, Name, and Hub-based entity linking across isolated police cases.",
    route: "/entities",
    theme: "blue" as const, gradientFrom: "#0284c7", gradientTo: "#38bdf8", hexVar: "#0284c7", hexLight: "#e0f2fe", actionText: "Link Entities"
  },
  {
    icon: Globe, code: "OSINT", title: "OSINT Intelligence",
    desc: "Simulated aggregation of Truecaller, Shodan, WHOIS, and HIBP registries for IP, domain, phone, and email intelligence.",
    route: "/osint",
    theme: "orange" as const, gradientFrom: "#f97316", gradientTo: "#fb923c", hexVar: "#f97316", hexLight: "#ffedd5", actionText: "Run OSINT Scan"
  },
  {
    icon: Brain, code: "ML", title: "Machine Learning Core",
    desc: "FraudSAGE GNN (98.2%), Isolation Forest, K-Means clustering, SHAP Explainer — with t-SNE latent space visualization.",
    route: "/ml",
    theme: "green" as const, gradientFrom: "#059669", gradientTo: "#34d399", hexVar: "#059669", hexLight: "#d1fae5", actionText: "View ML Core"
  },
  {
    icon: AlertTriangle, code: "ALRT", title: "Alert Center",
    desc: "Real-time alert center with 8 trigger types, auto-escalation, severity classification, and acknowledgement workflow.",
    route: "/alerts",
    theme: "red" as const, gradientFrom: "#be123c", gradientTo: "#fb7185", hexVar: "#e11d48", hexLight: "#ffe4e6", actionText: "Manage Alerts"
  },
  {
    icon: Shield, code: "INTEL", title: "Syndicate Intelligence",
    desc: "Global criminal intelligence — multi-case syndicate overlaps, shared money mule detection, and network risk assessment.",
    route: "/intelligence",
    theme: "purple" as const, gradientFrom: "#7e22ce", gradientTo: "#c084fc", hexVar: "#7e22ce", hexLight: "#f3e8ff", actionText: "View Intelligence"
  },
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const handle = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(0)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  };
  return (
    <div ref={ref} onMouseMove={handle} onMouseLeave={reset} className="tilt-card h-full">
      {children}
    </div>
  );
}

function CoreModules() {
  return (
    <div className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="text-xs tracking-[0.4em] text-sky-400/70 uppercase mb-3">12 Command Modules</div>
          <h3 className="font-display text-2xl md:text-4xl text-white/90 tracking-wide">
            Intelligence Suite
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((m, i) => (
            <motion.a
              key={m.code}
              href={`${FRAUDLENS_URL}${m.route}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-full block group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard>
                <GlowCard
                  customSize={true}
                  glowColor={m.theme}
                  className="w-full h-full !p-0 !border-0 bg-transparent rounded-2xl"
                >
                  <div className="relative w-full h-full p-[2px] rounded-2xl group/border">
                    {/* The Full Border Gradient */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-70 group-hover/border:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(135deg, ${m.gradientFrom}, ${m.gradientTo})` }}
                    />
                    
                    {/* The Full Outer Glow */}
                    <div 
                      className="absolute inset-0 blur-xl rounded-2xl opacity-40 group-hover/border:opacity-70 transition-opacity duration-500"
                      style={{ background: `linear-gradient(135deg, ${m.gradientFrom}, ${m.gradientTo})` }}
                    />

                    {/* The Inner Card Background */}
                    <div className="relative w-full h-full bg-[#0a0a0b] rounded-[14px] flex flex-col p-8 z-30 group-hover:bg-[#0c0c0e] transition-colors duration-500 overflow-hidden group/inner">
                    {/* Dark gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                    
                    {/* EXTRA EFFECT: Scanning line sweeping over the card on hover */}
                    <div className="absolute inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-full group-hover/inner:translate-y-[400px] transition-transform duration-[1.5s] ease-in-out pointer-events-none" />
                    
                    {/* EXTRA EFFECT: Subtle noise/grid pattern */}
                    <div className="absolute inset-0 cyber-grid opacity-[0.03] group-hover/inner:opacity-[0.08] transition-opacity duration-700 pointer-events-none" />

                    {/* Glowing Bottom Spillage (Outer Blur) */}
                    <div 
                      className="absolute -bottom-8 inset-x-4 h-16 blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
                      style={{ backgroundColor: m.hexVar }}
                    />
                    
                    {/* Inner Upward Glow */}
                    <div 
                      className="absolute bottom-0 inset-x-0 h-40 opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none mix-blend-screen"
                      style={{ background: `linear-gradient(to top, ${m.hexVar}, transparent)` }}
                    />

                    {/* EXTRA EFFECT: Themed spotlight behind the icon on hover */}
                    <div 
                      className="absolute -top-10 -left-10 w-40 h-40 blur-[50px] opacity-0 group-hover/inner:opacity-30 transition-opacity duration-700 pointer-events-none"
                      style={{ backgroundColor: m.hexVar }}
                    />

                    {/* Bottom Crisp Bright Line */}
                    <div 
                      className="absolute bottom-0 inset-x-0 h-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ 
                        background: `linear-gradient(90deg, transparent, ${m.hexLight}, transparent)`,
                        boxShadow: `0 -5px 20px 2px ${m.hexVar}`
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-20 flex flex-col h-full pointer-events-none">
                      {/* Top Icon Block */}
                      <div className="w-12 h-12 mb-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] group-hover/inner:-translate-y-1 group-hover/inner:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_20px_-10px_rgba(0,0,0,0.5)] transition-all duration-500">
                        <m.icon className="w-5 h-5 text-white drop-shadow-md group-hover/inner:scale-110 group-hover/inner:rotate-[8deg] transition-all duration-500" strokeWidth={2} />
                      </div>
                      
                      <h4 className="font-display text-xl text-white font-medium tracking-wide mb-3 group-hover/inner:text-transparent group-hover/inner:bg-clip-text group-hover/inner:bg-gradient-to-r group-hover/inner:from-white group-hover/inner:to-white/70 transition-all duration-300">{m.title}</h4>
                      <p className="text-sm text-white/50 leading-relaxed flex-1 font-sans group-hover/inner:text-white/70 transition-colors duration-500">{m.desc}</p>
                      
                      {/* Action Link */}
                      <div className="mt-8 flex items-center gap-2 text-[13px] text-white font-bold tracking-wide group-hover/inner:text-white transition-colors pointer-events-auto">
                        <span>{m.actionText}</span>
                        <ArrowRight className="w-4 h-4 group-hover/inner:translate-x-1.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </GlowCard>
              </TiltCard>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — ACTIVE SYNDICATES & PATTERN DETECTION
   ═══════════════════════════════════════════════════════════════ */

const SYNDICATES = [
  { id: "SYN-101", accounts: 145, type: "Cross-border Mules", severity: "HIGH", color: "#f59e0b" },
  { id: "SYN-102", accounts: 32, type: "Phishing Shells", severity: "CRITICAL", color: "#ef4444" },
  { id: "SYN-103", accounts: 89, type: "Crypto Layering", severity: "MEDIUM", color: "#eab308" },
  { id: "SYN-104", accounts: 12, type: "Unverified", severity: "LOW", color: "#22c55e" },
];

const PATTERNS = [
  { name: "INVESTMENT SCAM", confidence: 89, value: "₹24.5L", accounts: 2, severity: "CRITICAL" },
  { name: "ROUND ROBIN", confidence: 91, value: "₹5.0L", accounts: 3, severity: "CRITICAL" },
  { name: "OTP FRAUD", confidence: 95, value: "₹3.0L", accounts: 2, severity: "CRITICAL" },
  { name: "SMURFING", confidence: 88, value: "₹2.0L", accounts: 2, severity: "HIGH" },
  { name: "MULE CHAIN", confidence: 87, value: "₹7.5L", accounts: 5, severity: "CRITICAL" },
  { name: "JOB SCAM", confidence: 84, value: "₹24.0K", accounts: 1, severity: "HIGH" },
];

function LiveIntelligence() {
  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </div>
              <div className="text-xs tracking-[0.4em] text-rose-400/80 uppercase">Live Operations</div>
            </div>
            <h3 className="font-display text-3xl md:text-5xl text-white/90 tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Active Threat Intelligence
            </h3>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.05] px-4 py-2 rounded-lg backdrop-blur-md">
            <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
            <span className="font-mono text-xs text-sky-400/80 uppercase tracking-widest">Listening to Streams</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Syndicates */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl bg-background-card/60 border border-white/[0.06] p-6 lg:p-8 overflow-hidden backdrop-blur-xl group hover:border-white/[0.1] transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[50px] group-hover:bg-sky-500/10 transition-colors pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <Network className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h4 className="font-display text-xl text-white/90">Syndicate Tracking</h4>
                  <p className="text-[11px] font-mono text-white/40 uppercase tracking-widest mt-0.5">Known threat actor networks</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {SYNDICATES.map((s, i) => (
                <motion.div 
                  key={s.id} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group/item relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
                >
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-transparent group-hover/item:h-3/4 transition-all duration-300 rounded-r-full"
                    style={{ backgroundColor: s.color }}
                  />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-background-surface border border-white/5 flex items-center justify-center shrink-0">
                      <Fingerprint className="w-5 h-5 opacity-50" style={{ color: s.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-white/90">{s.id}</span>
                        <span
                          className="font-mono text-[9px] px-2 py-0.5 rounded border tracking-wider uppercase bg-opacity-10"
                          style={{ color: s.color, borderColor: `${s.color}40`, backgroundColor: `${s.color}15` }}
                        >
                          {s.severity}
                        </span>
                      </div>
                      <div className="text-[11px] text-white/50">{s.type}</div>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center px-2">
                    <div className="text-xl font-display font-bold text-white/80">{s.accounts}</div>
                    <div className="text-[9px] font-mono text-white/30 tracking-widest uppercase">Nodes</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pattern Detection */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl bg-background-card/60 border border-white/[0.06] p-6 lg:p-8 overflow-hidden backdrop-blur-xl group hover:border-white/[0.1] transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[50px] group-hover:bg-rose-500/10 transition-colors pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h4 className="font-display text-xl text-white/90">Pattern Detection</h4>
                  <p className="text-[11px] font-mono text-white/40 uppercase tracking-widest mt-0.5">ML confidence scoring</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {PATTERNS.map((p, i) => (
                <motion.div 
                  key={p.name} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="py-3 px-5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] text-white/80 tracking-wider flex items-center gap-2">
                      <Activity className="w-3 h-3 text-white/40" />
                      {p.name}
                    </span>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded border tracking-wider uppercase ${
                      p.severity === "CRITICAL" ? "text-rose-400 border-rose-400/30 bg-rose-500/10" : "text-amber-400 border-amber-400/30 bg-amber-500/10"
                    }`}>
                      {p.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Confidence bar */}
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${p.confidence}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose-600 to-rose-400"
                      />
                    </div>
                    <span className="font-mono text-[11px] font-bold text-white/70 w-8 text-right shrink-0">{p.confidence}%</span>
                    <div className="w-px h-4 bg-white/10 shrink-0" />
                    <span className="font-mono text-[11px] text-sky-400/70 w-12 text-right shrink-0">{p.value}</span>
                    <div className="w-px h-4 bg-white/10 shrink-0" />
                    <span className="font-mono text-[11px] text-white/40 w-12 text-right shrink-0">{p.accounts} acc</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5 — TECHNOLOGY STACK (Real Stack)
   ═══════════════════════════════════════════════════════════════ */

const TECH_CATEGORIES = [
  {
    title: "AI & Machine Learning",
    color: "emerald",
    hex: "#10b981",
    icon: Brain,
    items: [
      { name: "GraphSAGE", role: "Graph Neural Network", icon: Network },
      { name: "Isolation Forest", role: "Anomaly Detection", icon: Search },
      { name: "K-Means", role: "Syndicate Clustering", icon: Cpu },
      { name: "SHAP", role: "ML Explainability", icon: Zap },
      { name: "OpenRouter", role: "LLM Dossiers", icon: FileText },
    ]
  },
  {
    title: "Data & Infrastructure",
    color: "sky",
    hex: "#0ea5e9",
    icon: Database,
    items: [
      { name: "Neo4j", role: "Graph Database", icon: Database },
      { name: "Kafka", role: "Stream Processing", icon: Activity },
      { name: "PostgreSQL", role: "Relational DB", icon: Server },
      { name: "FastAPI", role: "Backend API", icon: Zap },
      { name: "WebSocket", role: "Real-time Comms", icon: Radio },
    ]
  },
  {
    title: "Visualization & Frontend",
    color: "purple",
    hex: "#a855f7",
    icon: MonitorPlay,
    items: [
      { name: "React / Vite", role: "Frontend Core", icon: Layout },
      { name: "D3.js", role: "Network Visualization", icon: Network },
      { name: "Deck.gl", role: "Geospatial Engine", icon: Map },
      { name: "Tailwind CSS", role: "Styling Engine", icon: Palette },
    ]
  },
  {
    title: "Reporting & Security",
    color: "rose",
    hex: "#f43f5e",
    icon: Shield,
    items: [
      { name: "SHA-256", role: "Evidence Hashing", icon: Lock },
      { name: "reportlab", role: "PDF Generation", icon: FileText },
      { name: "python-docx", role: "DOCX Reports", icon: FileText },
      { name: "Zod", role: "Type Validation", icon: CheckCircle },
    ]
  }
];

function TechStack() {
  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="text-xs tracking-[0.4em] text-purple-400/70 uppercase mb-4">Architecture</div>
          <h3 className="font-display text-3xl md:text-5xl text-white/90 tracking-wide mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Technology Arsenal
          </h3>
          <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
            The underlying infrastructure powering FraudLens. A sophisticated blend of streaming data, machine learning, and advanced visualization technologies working in unison.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {TECH_CATEGORIES.map((category, catIdx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: catIdx * 0.1 }}
              className="relative group/cat h-full"
            >
              {/* Category Card */}
              <div className="h-full rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6 lg:p-8 overflow-hidden backdrop-blur-sm hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                {/* Glow behind icon */}
                <div 
                  className="absolute -top-10 -right-10 w-40 h-40 blur-[60px] opacity-20 group-hover/cat:opacity-40 transition-opacity duration-700 pointer-events-none"
                  style={{ backgroundColor: category.hex }}
                />

                <div className="flex items-center gap-4 mb-8">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center border bg-background-card shrink-0"
                    style={{ 
                      borderColor: `${category.hex}30`,
                      boxShadow: `0 0 20px ${category.hex}10` 
                    }}
                  >
                    <category.icon 
                      className="w-7 h-7 drop-shadow-md" 
                      style={{ color: category.hex }}
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-xl md:text-2xl text-white/90 tracking-wide">
                      {category.title}
                    </h4>
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.hex }} />
                      {category.items.length} Core Modules
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {category.items.map((item, itemIdx) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: (catIdx * 0.1) + (itemIdx * 0.05) }}
                      className="group/item relative flex items-center gap-3 p-3 rounded-xl bg-background-card/50 border border-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300 cursor-default"
                    >
                      {/* Active indicator line on hover */}
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-transparent group-hover/item:h-1/2 transition-all duration-300 rounded-r-full"
                        style={{ backgroundColor: category.hex }}
                      />
                      
                      <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover/item:border-white/[0.15] transition-colors shrink-0">
                        <item.icon className="w-4 h-4 text-white/40 group-hover/item:text-white/90 transition-colors" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white/80 truncate group-hover/item:text-white transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider truncate mt-0.5 group-hover/item:text-white/60 transition-colors">
                          {item.role}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 7 — MODEL HEALTH & ML CORE
   ═══════════════════════════════════════════════════════════════ */

const ML_MODELS = [
  { name: "FraudSAGE GNN", metric: "98.2%", label: "Validation Accuracy", status: "Online", icon: Network },
  { name: "Isolation Forest", metric: "1.2M", label: "Txns Scanned Today", status: "Online", icon: Search },
  { name: "K-Means Syndicates", metric: "5", label: "Active Fraud Rings", status: "Online", icon: Cpu },
  { name: "SHAP Explainer", metric: "< 50ms", label: "Avg Inference Time", status: "Ready", icon: Zap },
];

function MLCore() {
  return (
    <div className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="text-xs tracking-[0.4em] text-emerald-400/70 uppercase mb-3 flex items-center justify-center gap-2">
            <Brain className="w-4 h-4" /> AI Engine
          </div>
          <h3 className="font-display text-3xl md:text-5xl text-white/90 tracking-wide">
            Machine Learning Core
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ML_MODELS.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.03] hover:border-emerald-400/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-500 overflow-hidden group"
            >
              {/* Animated hover gradient line */}
              <div className="absolute inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent -translate-y-[100px] group-hover:translate-y-[200px] transition-transform duration-[1.5s] ease-in-out pointer-events-none" />
              
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 blur-[30px] rounded-full group-hover:bg-emerald-500/20 transition-colors pointer-events-none" />

              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-background-surface border border-white/10 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:scale-110 transition-all duration-500">
                  <m.icon className="w-5 h-5 text-emerald-400/70 group-hover:text-emerald-400 transition-colors" strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {m.status}
                </div>
              </div>

              <div className="relative z-10">
                <div className="font-display text-4xl text-white/90 tracking-wider mb-2 group-hover:text-white transition-colors">{m.metric}</div>
                <div className="font-mono text-[11px] text-emerald-400/80 tracking-wider uppercase mb-1">{m.name}</div>
                <div className="text-xs text-white/40">{m.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 8 — INNOVATION MESSAGE + CTA
   ═══════════════════════════════════════════════════════════════ */

function InnovationMessage() {
  return (
    <div className="relative py-24 md:py-36 text-center overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto px-6 relative z-10"
      >
        <div className="text-xs tracking-[0.5em] text-[var(--gold)]/70 uppercase mb-6">
          Mission Statement
        </div>
        <h3 className="font-display text-3xl md:text-5xl gold-shimmer tracking-wide mb-6">
          Technology Serving Justice
        </h3>
        <div className="font-devanagari text-lg md:text-xl text-[var(--gold)]/60 mb-8">
          सुरक्षित डिजिटल महाराष्ट्र
        </div>
        <div className="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent mb-8" />
        <p className="text-sm md:text-base text-white/50 leading-relaxed mb-10">
          FraudLens is built for the Pune Police Cybercrime Cell — where GraphSAGE neural networks,
          real-time Kafka streams, and Neo4j graph databases converge to track, detect, and dismantle
          cybercrime syndicates. From live transaction ingestion to court-ready SHA-256 sealed evidence reports,
          every capability is engineered for one mission: protecting citizens of Maharashtra.
        </p>
        <p className="font-devanagari text-sm text-[var(--gold)]/50 italic mb-10">
          सद्रक्षणाय खलनिग्रहणाय — To protect the righteous and restrain the wicked.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={FRAUDLENS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-500/10 border border-sky-400/30 text-sky-400 text-sm tracking-wider uppercase hover:bg-sky-500/20 hover:border-sky-400/50 transition-all duration-300 group"
          >
            <span>Launch FraudLens</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <a
            href="https://github.com/ajinkyachalke008/FraudLens"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--gold)]/30 bg-[var(--gold)]/5 text-[var(--gold)] text-sm tracking-wider uppercase hover:bg-[var(--gold)]/10 hover:border-[var(--gold)]/50 transition-all duration-300 group"
          >
            <span>View Source</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════ */

export default function FraudLensSection() {
  return (
    <section id="fraudlens" className="relative bg-[#030608] overflow-hidden">
      {/* Top transition */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, #0d0d0d 0%, transparent 100%)" }}
      />

      <FraudLensHero />
      <MissionStats />
      <CoreModules />
      <LiveIntelligence />
      <TechStack />
      <MLCore />
      <InnovationMessage />

      {/* Bottom transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)" }}
      />
    </section>
  );
}
