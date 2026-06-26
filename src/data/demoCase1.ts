// ═══════════════════════════════════════════════════════════════════
// FraudLens Demo Case Registry
// ═══════════════════════════════════════════════════════════════════
// Centralized asset mapping for demo case flows.
// Structured for extensibility — add cases here.

import { DEMO_CASE_2 } from './demoCase2';

// ──── Types ──────────────────────────────────────────────────────

export interface DemoCaseAssets {
  htmlReport: {
    filename: string;
    path: string;
    label: string;
  };
  forensicReport: {
    filename: string;
    path: string;
    label: string;
  };
  caseBrief: {
    filename: string;
    path: string;
    label: string;
  };
}

export interface DemoCaseConfig {
  caseId: string;
  firNumber: string;
  title: string;
  classification: string;
  assets: DemoCaseAssets;
  finalStats: {
    transactions: number;
    accounts: number;
  };
  processingStages: {
    label: string;
    durationMs: number;
    logs: string[];
    statsAt?: { transactions?: number; accounts?: number };
  }[];
}

// ──── Case 1 Configuration ──────────────────────────────────────

export const DEMO_CASE_1: DemoCaseConfig = {
  caseId: 'FLC-2026-31901260013198',
  firNumber: '31901260013198',
  title: 'Investment Fraud Investigation',
  classification: 'Investment Fraud / Ponzi',
  assets: {
    htmlReport: {
      filename: 'FraudLens_Case_31901260013198_Report.html',
      path: '/reports/FraudLens_Case_31901260013198_Report.html',
      label: 'Primary Investigation Report',
    },
    forensicReport: {
      filename: 'FraudLens_Forensic_Report_31901260013198.docx',
      path: '/reports/FraudLens_Forensic_Report_31901260013198.docx',
      label: 'Forensic Report',
    },
    caseBrief: {
      filename: 'FraudLens_Case_Brief_31901260013198-1.docx',
      path: '/reports/FraudLens_Case_Brief_31901260013198-1.docx',
      label: 'Case Brief',
    },
  },
  finalStats: {
    transactions: 847,
    accounts: 42,
  },
  processingStages: [
    {
      label: 'Secure evidence package received',
      durationMs: 8000,
      logs: [
        '🔐 Secure evidence package received',
        '📁 Evidence intake initiated — session FLC-2026-31901260013198',
        '🔑 SHA-256 hash computed for chain-of-custody',
        '📋 Evidence manifest created — 1 primary document staged',
      ],
      statsAt: { transactions: 0, accounts: 0 },
    },
    {
      label: 'Validating document structure',
      durationMs: 10000,
      logs: [
        '📄 Validating workbook / document structure...',
        '✅ File signature verified — format integrity confirmed',
        '📊 Document schema analysis: multi-sheet financial workbook detected',
        '🔍 Identifying embedded tables, headers, and metadata fields',
        '✅ Worksheet schema validation passed — 4 data sheets located',
      ],
      statsAt: { transactions: 0, accounts: 0 },
    },
    {
      label: 'Reading transaction rows',
      durationMs: 12000,
      logs: [
        '📖 Reading transaction rows from primary evidence...',
        '🧮 Sheet 1: "Account Statement" — 312 rows indexed',
        '🧮 Sheet 2: "UPI Transactions" — 248 rows indexed',
        '🧮 Sheet 3: "NEFT/RTGS Ledger" — 189 rows indexed',
        '🧮 Sheet 4: "Beneficiary Master" — 98 rows indexed',
        '📊 847 transaction records indexed across 4 worksheets',
      ],
      statsAt: { transactions: 147, accounts: 3 },
    },
    {
      label: 'Extracting account identifiers',
      durationMs: 12000,
      logs: [
        '🏦 Extracting account identifiers...',
        '🧠 Calling Gemini 2.5 Pro via OpenRouter for entity extraction',
        '🔍 NER pass 1: Bank account numbers, IFSC codes',
        '🔍 NER pass 2: UPI VPAs, merchant IDs',
        '🔍 NER pass 3: Named entities — persons, firms, LLPs',
        '✅ 42 unique account identifiers extracted',
        '✅ 18 named entities resolved',
      ],
      statsAt: { transactions: 312, accounts: 12 },
    },
    {
      label: 'Mapping beneficiaries and counterparties',
      durationMs: 10000,
      logs: [
        '🕸️ Mapping beneficiaries and counterparties...',
        '🔗 Building payer → payee relationship matrix',
        '📐 18 beneficiary identifiers normalized',
        '🏢 2 shell entities flagged — no GST/MCA registration found',
        '👤 Vikram Deshmukh — identified as primary fund consolidation endpoint',
        '✅ Entity relationship map complete — 42 nodes, 134 edges',
      ],
      statsAt: { transactions: 478, accounts: 24 },
    },
    {
      label: 'Normalizing timestamps and values',
      durationMs: 8000,
      logs: [
        '⏰ Normalizing timestamps and monetary values...',
        '📅 Date formats reconciled: DD/MM/YYYY, YYYY-MM-DD, DD-Mon-YY',
        '💰 Currency normalization: all values converted to INR base',
        '🔢 Decimal precision standardized to 2 places',
        '✅ Temporal consistency verified — 08 May to 04 Jun 2026 range',
      ],
      statsAt: { transactions: 578, accounts: 31 },
    },
    {
      label: 'Building transaction graph skeleton',
      durationMs: 12000,
      logs: [
        '🌐 Building transaction graph skeleton...',
        '📡 Initializing Neo4j graph engine connector',
        '🔗 Creating Account nodes: 42 entities',
        '🔗 Creating Transaction edges: 847 relationships',
        '🏗️ Graph topology: small-world network detected',
        '📊 Average degree: 4.2 connections per node',
        '🎯 Hub nodes identified: 3 high-centrality accounts',
        '✅ Graph skeleton assembled — ready for analysis',
      ],
      statsAt: { transactions: 712, accounts: 38 },
    },
    {
      label: 'Running duplicate / anomaly pre-checks',
      durationMs: 10000,
      logs: [
        '🔬 Running duplicate / anomaly pre-checks...',
        '🔄 7 duplicate transfer clusters detected',
        '⚠️ 23 transactions flagged: amount below ₹1L threshold (potential splitting)',
        '⚠️ 4 circular flow patterns detected across 3 accounts',
        '🚨 Rapid-relay pattern: avg 47 min between receipt and outbound transfer',
        '✅ Anomaly pre-check complete — 34 items flagged for deep analysis',
      ],
      statsAt: { transactions: 784, accounts: 40 },
    },
    {
      label: 'Detecting suspicious routing patterns',
      durationMs: 12000,
      logs: [
        '🚨 Detecting suspicious routing patterns...',
        '🧠 Running Isolation Forest anomaly detection on transaction vectors',
        '🔴 Pattern #1: Investment Fraud / Ponzi — confidence 0.97',
        '🟠 Pattern #2: Layered Money Mule Network — confidence 0.93',
        '🟠 Pattern #3: Shell Entity Exploitation — confidence 0.91',
        '🟡 Pattern #4: UPI Micro-Splitting — confidence 0.88',
        '📊 Risk scoring: 6 accounts rated CRITICAL, 8 rated HIGH',
        '✅ Suspicious routing analysis complete',
      ],
      statsAt: { transactions: 820, accounts: 41 },
    },
    {
      label: 'Correlating case entities',
      durationMs: 10000,
      logs: [
        '🌐 Correlating case entities across active FIR database...',
        '🔗 Cross-referencing 42 accounts against Pune Cyber Cell registry',
        '🚨 MATCH: Amit Patel (BOB) — linked to FIR 31901260014872',
        '🚨 MATCH: GrowFast Trading Co. (ICICI) — linked to FIR 31901260011340',
        '⚖️ 3 shared entities identified across 2 additional investigations',
        '✅ Cross-case intelligence correlation complete',
      ],
      statsAt: { transactions: 840, accounts: 42 },
    },
    {
      label: 'Generating forensic evidence package',
      durationMs: 14000,
      logs: [
        '📜 Generating forensic evidence package...',
        '⚖️ BNS 2023 charge analysis initiated',
        '⚖️ Recommended: BNS 318 — Cheating by Personation',
        '⚖️ Recommended: IT Act 66D — Cyber Fraud',
        '⚖️ Recommended: BNS 336 — Forgery for Cheating',
        '⚖️ Recommended: BNS 61 — Criminal Conspiracy',
        '🔒 Section 65B compliance engine: evidence hash chain validated',
        '📊 Building court-ready transaction narrative...',
        '✅ Forensic evidence package assembled',
      ],
      statsAt: { transactions: 845, accounts: 42 },
    },
    {
      label: 'Preparing FraudLens investigation reports',
      durationMs: 14000,
      logs: [
        '📄 Preparing FraudLens investigation reports...',
        '📊 Rendering Primary Investigation Report (HTML)...',
        '📝 Generating Detailed Forensic Report (DOCX)...',
        '📋 Compiling Case Brief Summary (DOCX)...',
        '🔐 Applying Section 65B digital signatures',
        '📦 Packaging report deliverables...',
        '✅ 3 report assets generated successfully',
      ],
      statsAt: { transactions: 847, accounts: 42 },
    },
    {
      label: 'Finalizing case output',
      durationMs: 8000,
      logs: [
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '✅ CASE 1 PROCESSING COMPLETE',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '📊 847 transactions analyzed from 1 evidence file',
        '🏦 42 unique accounts identified',
        '🚨 7 suspicious clusters detected',
        '💰 ₹2,47,38,500 total value traced',
        '⚖️ 4 BNS/IT Act charges recommended',
        '🌐 3 cross-case entity links discovered',
        '📦 Investigation report package ready for review',
      ],
      statsAt: { transactions: 847, accounts: 42 },
    },
  ],
};

// ──── Demo Case Registry ────────────────────────────────────────

export const DEMO_CASES: Record<string, DemoCaseConfig> = {
  '1': DEMO_CASE_1,
  '2': DEMO_CASE_2,
};
