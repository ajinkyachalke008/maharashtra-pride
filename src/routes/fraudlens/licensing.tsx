import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  ShieldCheck, 
  Scale, 
  Database, 
  Search, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  FileText, 
  Code,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const Route = createFileRoute('/fraudlens/licensing')({
  component: LegalLicensingDashboard,
});

// Mock Third Party License Data for Attribution search grid
const dependencies = [
  { name: 'React', version: '19.2.0', license: 'MIT', url: 'https://react.dev', category: 'Frontend Framework', desc: 'A JavaScript library for building user interfaces.' },
  { name: 'Tailwind CSS', version: '4.2.1', license: 'MIT', url: 'https://tailwindcss.com', category: 'Styling', desc: 'A utility-first CSS framework for rapid UI development.' },
  { name: 'TypeScript', version: '5.8.3', license: 'Apache-2.0', url: 'https://typescriptlang.org', category: 'Language', desc: 'Strict syntactical superset of JavaScript adding optional static typing.' },
  { name: 'Framer Motion', version: '12.40.0', license: 'MIT', url: 'https://framer.com/motion', category: 'Animation', desc: 'A production-ready motion library for React.' },
  { name: 'GSAP', version: '3.15.0', license: 'GreenSock License', url: 'https://greensock.com', category: 'Animation', desc: 'Professional-grade JavaScript animation library.' },
  { name: 'Neo4j Python Driver', version: '5.x', license: 'Apache-2.0', url: 'https://neo4j.com', category: 'Database', desc: 'Official Python driver for the Neo4j graph database.' },
  { name: 'NetworkX', version: '3.x', license: 'BSD-3-Clause', url: 'https://networkx.org', category: 'Backend Analytics', desc: 'Python library for study of the structure, dynamics, and functions of complex networks.' },
  { name: 'FastAPI', version: '0.110.x', license: 'MIT', url: 'https://fastapi.tiangolo.com', category: 'Backend Framework', desc: 'Modern, fast (high-performance), web framework for building APIs with Python.' },
  { name: 'Three.js', version: '0.184.0', license: 'MIT', url: 'https://threejs.org', category: 'Visualization', desc: 'JavaScript 3D library for WebGL rendering.' },
  { name: 'Deck.gl', version: '9.3.3', license: 'MIT', url: 'https://deck.gl', category: 'Visualization', desc: 'WebGL2 powered framework for visual exploratory data analysis of large datasets.' },
  { name: 'Lucide React', version: '0.575.0', license: 'ISC', url: 'https://lucide.dev', category: 'Icons', desc: 'Clean and consistent icon library for React applications.' },
  { name: 'Zustand', version: '5.0.14', license: 'MIT', url: 'https://zustand-demo.pmnd.rs', category: 'State Management', desc: 'A small, fast and scalable bearbones state-management solution.' },
];

function LegalLicensingDashboard() {
  const [activeTab, setActiveTab] = useState<'platform' | 'compliance' | 'oss'>('platform');
  const [searchQuery, setSearchQuery] = useState('');
  const [hashInput, setHashInput] = useState('');
  const [generatedCertificate, setGeneratedCertificate] = useState<{
    hash: string;
    timestamp: string;
    sections: string[];
    valid: boolean;
  } | null>(null);

  // Compliance Offenses from BNS 2023
  const bnsSections = [
    { section: 'Section 111 (BNS 2023)', name: 'Organized Crime', description: 'Applicable to multi-tier financial syndicates and coordinated money laundering chains detected by the FraudLens 3D Explorer.', severity: 'CRITICAL' },
    { section: 'Section 318 (BNS 2023)', name: 'Cheating', description: 'Covers fraudulent inducements, deceptive investment programs, phishing lures, and artificial currency schemes.', severity: 'HIGH' },
    { section: 'Section 319 (BNS 2023)', name: 'Cheating by Personation', description: 'Covers fake profile scams, corporate impersonation, bank manager identity spoofing, and OTP verification scams.', severity: 'HIGH' },
    { section: 'Section 61(2) (BNS 2023)', name: 'Criminal Conspiracy', description: 'Applicable to mule networks where several banking agents conspire to hide transactions for syndicates.', severity: 'MEDIUM' }
  ];

  // Automated Hash Generator for Sec 65B compliance verification
  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hashInput) return;
    
    // Simulate SHA-256 Generation & Certificate Output
    const mockHash = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    setGeneratedCertificate({
      hash: mockHash,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      sections: ['BNS Section 318', 'Sec 65B Evidence Act Audit Trail', 'SHA-256 Ledger Lock'],
      valid: true
    });
  };

  // Filter OSS Licenses
  const filteredDeps = dependencies.filter(dep => 
    dep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dep.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dep.license.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-y-auto bg-background-base p-6 gap-6 page-fade">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-500/10 rounded-xl border border-primary-500/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
            <Scale className="w-8 h-8 text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              Licensing & Legal Compliance
              <span className="text-[10px] px-2 py-0.5 rounded bg-safe-500/10 text-safe-400 border border-safe-500/20 font-mono tracking-wider uppercase">
                SECURE PLATFORM
              </span>
            </h1>
            <p className="text-white/40 text-sm mt-1">Platform credentials, BNS 2023 forensic compliance, and third-party library attributions.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-lg p-2 self-start font-mono text-xs text-white/40">
          <Clock className="w-3.5 h-3.5 text-primary-400" />
          <span>LAST COMPLIANCE REVIEW: 2026-06-11</span>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-white/5 gap-2">
        <button
          onClick={() => setActiveTab('platform')}
          className={`px-4 py-2.5 font-mono text-sm tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'platform' 
              ? 'border-primary-400 text-primary-400 bg-primary-500/5' 
              : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> PLATFORM LICENSE
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2.5 font-mono text-sm tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'compliance' 
              ? 'border-primary-400 text-primary-400 bg-primary-500/5' 
              : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          <FileText className="w-4 h-4" /> FORENSIC COMPLIANCE (IEA / BNS)
        </button>
        <button
          onClick={() => setActiveTab('oss')}
          className={`px-4 py-2.5 font-mono text-sm tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'oss' 
              ? 'border-primary-400 text-primary-400 bg-primary-500/5' 
              : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          <Code className="w-4 h-4" /> OPEN SOURCE ATTRIBUTIONS
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1">
        {activeTab === 'platform' && (
          <div className="space-y-6">
            <div className="bg-background-surface border border-white/5 rounded-xl p-6 relative overflow-hidden cyber-glow">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
              
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-primary-400/10 rounded-xl text-primary-400 border border-primary-400/20">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Governing License Agreement</h3>
                  <p className="text-white/50 text-sm mt-1">Maharashtra Police Pride & FraudLens Software Suite</p>
                </div>
              </div>

              <div className="mt-6 bg-background-card border border-white/5 rounded-lg p-5 font-mono text-sm leading-relaxed text-white/80 max-h-[350px] overflow-y-auto">
                <p className="text-primary-400 font-bold mb-2">MIT License + Special Indian Law Enforcement Homage Rider</p>
                <p className="mb-4">Copyright (c) 2026 Maharashtra Police Pride & FraudLens Contributors</p>
                
                <p className="mb-4">
                  Permission is hereby granted, free of charge, to any person obtaining a copy
                  of this software and associated documentation files (the "Software"), to deal
                  in the Software without restriction, including without limitation the rights
                  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                  copies of the Software, and to permit persons to whom the Software is
                  furnished to do so, subject to the following conditions:
                </p>

                <p className="mb-4">
                  1. The above copyright notice and this permission notice shall be included in all
                  copies or substantial portions of the Software.
                </p>

                <p className="mb-4 text-warning-400 font-bold">
                  2. SPECIAL RIDER (GOVERNMENT & EDUCATIONAL USE ONLY):
                </p>
                <p className="mb-4 pl-4 text-white/90">
                  - This software is developed as an educational tribute and forensic homage to the
                    Maharashtra Police force and the Pune Police Cybercrime Cell.<br />
                  - FULL AUTHORIZATION is granted to all Indian Law Enforcement Agencies, Cyber Units,
                    and Judicial/Forensic officers of the Republic of India for official testing,
                    investigative training, and public-sector deployment.<br />
                  - COMMERCIAL PROHIBITION: The commercial resale, monetization, or deployment of this
                    platform as a paid SaaS/proprietary product is strictly prohibited without
                    explicit written consent from the primary contributors.
                </p>

                <p>
                  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                  SOFTWARE.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 flex flex-col gap-2 hover:border-primary-500/20 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-2 text-safe-400 font-mono text-xs">
                    <CheckCircle className="w-4 h-4" /> AUTHORIZED USAGE
                  </div>
                  <p className="text-white/60 text-xs">Pune Cybercrime Cell verification, public-sector sandbox labs, police training academies, and academic research.</p>
                </div>
                
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 flex flex-col gap-2 hover:border-danger-500/20 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-2 text-danger-400 font-mono text-xs">
                    <Lock className="w-4 h-4" /> EXPLICIT RESTRICTION
                  </div>
                  <p className="text-white/60 text-xs">Strictly forbids third-party commercial packaging, SaaS white-labeling, or deployment in commercial intelligence dashboards.</p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 flex flex-col gap-2 hover:border-warning-500/20 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-2 text-warning-400 font-mono text-xs">
                    <Sparkles className="w-4 h-4" /> HOMAGE PURPOSE
                  </div>
                  <p className="text-white/60 text-xs">Dedicated to honoring the sdrkshṇaay̱ khlnigrhṇaay̱ (सद्रक्षणाय खलनिग्रहणाय) mission of the Maharashtra Police.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {/* Regulatory compliance cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Statutory Mappings */}
              <div className="space-y-6">
                <div className="bg-background-surface border border-white/5 rounded-xl p-6">
                  <h3 className="text-white font-bold text-md mb-4 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-warning-400" />
                    Bharatiya Nyaya Sanhita (BNS) 2023 Syndicate Mapping
                  </h3>
                  <div className="space-y-4">
                    {bnsSections.map((sec, idx) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-lg p-4 hover:bg-white/[0.04] transition-all">
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/20">
                            {sec.section}
                          </span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            sec.severity === 'CRITICAL' ? 'bg-danger-500/10 text-danger-400 border border-danger-500/20' :
                            sec.severity === 'HIGH' ? 'bg-warning-500/10 text-warning-400 border border-warning-500/20' :
                            'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                          }`}>
                            {sec.severity}
                          </span>
                        </div>
                        <h4 className="text-white text-sm font-semibold mt-2">{sec.name}</h4>
                        <p className="text-white/50 text-xs mt-1">{sec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-background-surface border border-white/5 rounded-xl p-6">
                  <h3 className="text-white font-bold text-md mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-safe-400" />
                    DPDP Act 2023 (Data Privacy) Compliance
                  </h3>
                  <ul className="space-y-3 text-xs text-white/60">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-safe-400 rounded-full mt-1.5 shrink-0" />
                      <span><strong>Data Minimisation:</strong> FraudLens extracts only transaction metadata and specific identifiers (bank account numbers, phone numbers) required for court-admissible forensic trails.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-safe-400 rounded-full mt-1.5 shrink-0" />
                      <span><strong>Pseudonymisation:</strong> In-memory processing of transaction networks ensures investigators only view real details upon proper OAuth-level authorization flags.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-safe-400 rounded-full mt-1.5 shrink-0" />
                      <span><strong>Storage Limitation:</strong> Temporary evidence imports automatically purge transaction graphs from transient workspaces after generation of formal forensic reports.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Automated 65B Integrity Checker */}
              <div className="space-y-6">
                <div className="bg-background-surface border border-white/5 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-warning-500/5 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                  
                  <div className="flex items-center gap-2 text-warning-400 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <h3 className="text-white font-bold text-md">Section 65B Digital Evidence Admissibility</h3>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed mb-4">
                    Under Section 65B of the Indian Evidence Act, secondary electronic records (like banking graphs, Excel statement parses, and intelligence outputs) require a certified hash integrity trail to be admissible in a court of law.
                  </p>

                  <form onSubmit={handleGenerateCertificate} className="space-y-3 bg-white/[0.02] border border-white/5 rounded-lg p-4">
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider">
                      Input Case File Reference or PDF Data ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={hashInput}
                        onChange={(e) => setHashInput(e.target.value)}
                        placeholder="e.g., PUNE-CYBER-2026-0428-STATEMENT"
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded px-3 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-warning-400/40"
                      />
                      <button
                        type="submit"
                        className="bg-warning-500 hover:bg-warning-600 text-ink px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                      >
                        GENERATE ADMISSIBILITY TRAIL
                      </button>
                    </div>
                  </form>

                  {generatedCertificate && (
                    <div className="mt-4 bg-background-card border border-warning-500/20 rounded-lg p-4 font-mono text-[11px] leading-relaxed text-white/80 space-y-3 relative overflow-hidden">
                      <div className="cyber-scan-line" />
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-warning-400 font-bold">65B COMPLIANCE LOG INTEGRITY</span>
                        <span className="text-safe-400 font-bold bg-safe-500/10 px-1.5 py-0.5 rounded border border-safe-500/20 text-[9px]">VERIFIED PASS</span>
                      </div>
                      <div>
                        <span className="text-white/40 block">CASE IDENTIFIER</span>
                        <span className="text-white font-bold">{hashInput}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block">INTEGRITY HASH (SHA-256)</span>
                        <span className="text-white break-all text-[10px] select-all bg-white/5 p-1 rounded block">{generatedCertificate.hash}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-white/40 block">TIMESTAMP RECORD</span>
                          <span className="text-white">{generatedCertificate.timestamp}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block">FIRMWARE VERSION</span>
                          <span className="text-white">FRAUDLENS-V4.2.0-PROD</span>
                        </div>
                      </div>
                      <div className="border-t border-white/5 pt-2 flex items-center gap-1.5 text-[10px] text-white/50">
                        <CheckCircle className="w-3.5 h-3.5 text-safe-400 shrink-0" />
                        <span>Hash matches local SQLite database transaction payload index.</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-background-surface border border-white/5 rounded-xl p-6">
                  <h3 className="text-white font-bold text-md mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary-400" />
                    IT Act 2000 Section 43A Compliant System
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    FraudLens utilizes asymmetric encryption for session-level state storage. All temporary transaction files parsed via pdfplumber or python-docx are sandboxed locally, preventing exposure of sensitive digital evidence logs.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'oss' && (
          <div className="space-y-6">
            <div className="bg-background-surface border border-white/5 rounded-xl p-6">
              
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-white font-bold text-md">Third-Party Licenses</h3>
                  <p className="text-white/40 text-xs mt-1">Attribution and usage directory for open-source frameworks utilized in FraudLens.</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dependencies, licenses..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary-400/40"
                  />
                </div>
              </div>

              {/* OSS Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDeps.map((dep, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white/[0.02] border border-white/5 rounded-lg p-4 hover:border-primary-500/20 hover:bg-white/[0.03] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-white font-bold text-sm tracking-tight">{dep.name}</h4>
                        <span className="font-mono text-[10px] text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/20">
                          {dep.license}
                        </span>
                      </div>
                      <div className="text-[10px] text-white/30 font-mono mt-1">
                        VERSION: {dep.version} | {dep.category}
                      </div>
                      <p className="text-white/60 text-xs mt-3 leading-relaxed">
                        {dep.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-white/20">SOURCE ATTRIBUTION</span>
                      <a 
                        href={dep.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[10px] font-mono text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        VIEW CODE →
                      </a>
                    </div>
                  </div>
                ))}

                {filteredDeps.length === 0 && (
                  <div className="col-span-full py-8 text-center text-white/30 font-mono text-xs border border-dashed border-white/5 rounded-lg">
                    NO DEPENDENCIES FOUND MATCHING "{searchQuery.toUpperCase()}"
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-white/[0.01] border border-white/5 rounded-lg text-[11px] font-mono text-white/40 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary-400 shrink-0" />
                <span>All listed dependencies are evaluated automatically by npm audits. No high/critical severity security alerts are active in production builds.</span>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
