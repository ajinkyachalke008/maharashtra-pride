import { DemoCaseConfig } from './demoCase1';

export const DEMO_CASE_2: DemoCaseConfig = {
  caseId: 'FLC-2026-31905260095929',
  firNumber: '31905260095929',
  title: 'Fake Police Video Call Scam (Digital Arrest)',
  classification: 'Digital Arrest / Impersonation',
  assets: {
    htmlReport: {
      filename: 'FraudLens_Case_31905260095929_Report.html',
      path: '/reports/FraudLens_Case_31905260095929_Report.html',
      label: 'Primary Investigation Report',
    },
    forensicReport: {
      filename: 'FraudLens_Forensic_Report_31905260095929.docx',
      path: '/reports/FraudLens_Forensic_Report_31905260095929.docx',
      label: 'Forensic Report',
    },
    caseBrief: {
      filename: 'FraudLens_Case_Brief_31905260095929.docx',
      path: '/reports/FraudLens_Forensic_Report_31905260095929.docx', // Fallback to forensic report if brief missing
      label: 'Case Brief',
    },
  },
  finalStats: {
    transactions: 58,
    accounts: 32,
  },
  processingStages: [
    {
      label: 'Secure evidence package received',
      durationMs: 6000,
      logs: [
        '🔐 Secure evidence package received',
        '📁 Evidence intake initiated — session FLC-2026-31905260095929',
        '🔑 SHA-256 hash computed for chain-of-custody',
        '📋 Evidence manifest created — 1 primary document staged',
      ],
      statsAt: { transactions: 0, accounts: 0 },
    },
    {
      label: 'Validating document structure',
      durationMs: 8000,
      logs: [
        '📄 Validating workbook / document structure...',
        '✅ File signature verified — format integrity confirmed',
        '📊 Document schema analysis: 31905260095929.xlsx detected',
        '✅ Worksheet schema validation passed',
      ],
      statsAt: { transactions: 0, accounts: 0 },
    },
    {
      label: 'Reading transaction rows',
      durationMs: 10000,
      logs: [
        '📖 Reading transaction rows from primary evidence...',
        '🧮 58 transaction records indexed from bank statements',
        '📊 Identifying 5 distinct transfer layers',
      ],
      statsAt: { transactions: 58, accounts: 12 },
    },
    {
      label: 'Extracting account identifiers',
      durationMs: 11000,
      logs: [
        '🏦 Extracting account identifiers...',
        '🧠 Calling Gemini 2.5 Pro via OpenRouter for entity extraction',
        '🔍 NER pass: Bank account numbers, IFSC codes, Jio Payments Bank wallets',
        '✅ 32 unique account identifiers extracted',
      ],
      statsAt: { transactions: 58, accounts: 32 },
    },
    {
      label: 'Mapping layer structure and cash-outs',
      durationMs: 10000,
      logs: [
        '🕸️ Mapping beneficiaries and counterparties...',
        '🔗 Tracing 5 layers of transaction fan-out',
        '🏦 6 near-identical Jio Payments Bank wallets clustered (3321721xxxxxx)',
        '🏢 Tracing physical encashments: 5 cheque encashments flagged',
        '✅ Entity relationship map complete',
      ],
      statsAt: { transactions: 58, accounts: 32 },
    },
    {
      label: 'Detecting suspicious routing patterns',
      durationMs: 10000,
      logs: [
        '🚨 Detecting suspicious routing patterns...',
        '🔴 Pattern #1: Digital Arrest / Impersonation — confidence 0.98',
        '🟠 Pattern #2: Layered Money Mule Network — confidence 0.94',
        '⚠️ ATM Withdrawal clusters in Hardoi district detected',
        '✅ Suspicious routing analysis complete',
      ],
      statsAt: { transactions: 58, accounts: 32 },
    },
    {
      label: 'Generating forensic evidence package',
      durationMs: 12000,
      logs: [
        '📜 Generating forensic evidence package...',
        '🔒 Section 65B compliance engine: evidence hash chain validated',
        '📊 Building court-ready transaction narrative...',
        '✅ Forensic evidence package assembled',
      ],
      statsAt: { transactions: 58, accounts: 32 },
    },
    {
      label: 'Preparing FraudLens investigation reports',
      durationMs: 12000,
      logs: [
        '📄 Preparing FraudLens investigation reports...',
        '📊 Rendering Primary Investigation Report (HTML)...',
        '📝 Generating Detailed Forensic Report (DOCX)...',
        '📦 Packaging report deliverables...',
        '✅ Report assets generated successfully',
      ],
      statsAt: { transactions: 58, accounts: 32 },
    },
    {
      label: 'Finalizing case output',
      durationMs: 8000,
      logs: [
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '✅ CASE 2 PROCESSING COMPLETE',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '📊 58 transactions analyzed from 1 evidence file',
        '🏦 32 unique accounts identified across 5 layers',
        '💰 ₹56,18,206 total value traced',
        '📍 18 ATM withdrawals & 5 cheque encashments flagged',
        '📦 Investigation report package ready for review',
      ],
      statsAt: { transactions: 58, accounts: 32 },
    },
  ],
};
