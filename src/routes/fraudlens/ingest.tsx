import { useState, useCallback, useRef, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Upload, FileText, FileSpreadsheet, File, CheckCircle2, XCircle,
  AlertTriangle, Loader2, ArrowRight, History, ChevronDown, Eye, Trash2,
  Edit2, GitCommitHorizontal, Image, Download, ExternalLink, FileSearch,
  FileCheck, Shield
} from 'lucide-react';
import { API_BASE_URL } from '@/config';
import { DEMO_CASES, type DemoCaseConfig } from '@/data/demoCase1';

export const Route = createFileRoute('/fraudlens/ingest')({
  component: IngestPage,
});

// ──── Types ──────────────────────────────────────────────────────

interface ParsedTransaction {
  transaction_ref: string;
  timestamp: string;
  amount: number;
  currency: string;
  direction: string;
  from_account: string;
  to_account: string;
  transaction_type: string | null;
  upi_id: string | null;
  narration: string | null;
  source_file: string;
  confidence: number;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'queued' | 'uploading' | 'parsing' | 'parsed' | 'error';
  progress: number;
  transactions: number;
  error?: string;
}

interface IngestionSession {
  session_id: string;
  status: string;
  files_count: number;
  transactions_extracted: number;
  new_accounts_discovered: number;
  created_at: string;
}

// ──── Demo State Types ──────────────────────────────────────────

type DemoStatus = 'idle' | 'armed' | 'processing' | 'complete';

interface DemoState {
  status: DemoStatus;
  activeCaseKey: string | null;
  caseConfig: DemoCaseConfig | null;
  currentStageIndex: number;
  stageProgress: number;
  showReportViewer: boolean;
}

const INITIAL_DEMO_STATE: DemoState = {
  status: 'idle',
  activeCaseKey: null,
  caseConfig: null,
  currentStageIndex: -1,
  stageProgress: 0,
  showReportViewer: false,
};

const MOCK_SESSIONS: IngestionSession[] = [];
const MOCK_PREVIEW: ParsedTransaction[] = [];

// ──── Helpers ──────────────────────────────────────────────────

const FILE_ICONS: Record<string, typeof FileText> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  csv: FileSpreadsheet,
  docx: File,
  png: Image,
  jpg: Image,
  jpeg: Image,
  tiff: Image,
};

const FILE_COLORS: Record<string, string> = {
  pdf: 'text-red-400',
  xlsx: 'text-emerald-400',
  xls: 'text-emerald-400',
  csv: 'text-sky-400',
  docx: 'text-blue-400',
  png: 'text-purple-400',
  jpg: 'text-purple-400',
  jpeg: 'text-purple-400',
  tiff: 'text-purple-400',
};

function getFileExt(name: string): string {
  return name.split('.').pop()?.toLowerCase() || 'unknown';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function formatAmount(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  });
}

function getConfidenceColor(c: number): string {
  if (c >= 0.9) return 'text-emerald-400 bg-emerald-500/10';
  if (c >= 0.7) return 'text-amber-400 bg-amber-400/10';
  return 'text-red-400 bg-red-500/10';
}

// ──── Main Component ──────────────────────────────────────────

function IngestPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<ParsedTransaction[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [parseLog, setParseLog] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [sessions, setSessions] = useState<IngestionSession[]>(MOCK_SESSIONS);
  const [stats, setStats] = useState({ filesProcessed: 0, txnsExtracted: 0, accountsFound: 0 });

  // ──── Demo State ──────────────────────────────────────────
  const [demo, setDemo] = useState<DemoState>(INITIAL_DEMO_STATE);
  const demoTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [parseLog]);


  // ──── Cleanup demo timers on unmount ──────────────────────
  useEffect(() => {
    return () => {
      demoTimersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const addLog = useCallback((msg: string) => {
    const ts = new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setParseLog(prev => [...prev, `[${ts}] ${msg}`]);
  }, []);

  // ──── Demo Processing Engine ──────────────────────────────

  const startDemoProcessing = useCallback((caseConfig: DemoCaseConfig, caseKey: string) => {
    // Clear any existing timers
    demoTimersRef.current.forEach(t => clearTimeout(t));
    demoTimersRef.current = [];

    // Reset state for clean re-run
    setParseLog([]);
    setShowPreview(false);
    setPreview([]);
    setIsUploading(true);
    setStats({ filesProcessed: 1, txnsExtracted: 0, accountsFound: 0 });
    setDemo({
      status: 'processing',
      activeCaseKey: caseKey,
      caseConfig,
      currentStageIndex: 0,
      stageProgress: 0,
      showReportViewer: false,
    });

    // Mark file as uploading → parsing
    setFiles(prev => prev.map((f, idx) => idx === 0
      ? { ...f, status: 'uploading' as const, progress: 15 }
      : f
    ));

    // Schedule all stages
    let cumulativeDelay = 500; // small initial delay

    caseConfig.processingStages.forEach((stage, stageIdx) => {
      const stageStartDelay = cumulativeDelay;

      // Update stage index at start
      const t0 = setTimeout(() => {
        setDemo(prev => ({ ...prev, currentStageIndex: stageIdx }));

        // Update file status
        if (stageIdx === 0) {
          setFiles(prev => prev.map((f, idx) => idx === 0
            ? { ...f, status: 'parsing' as const, progress: 30 }
            : f
          ));
        }
      }, stageStartDelay);
      demoTimersRef.current.push(t0);

      // Schedule individual log lines within the stage
      const logInterval = stage.durationMs / (stage.logs.length + 1);
      stage.logs.forEach((logLine, logIdx) => {
        const logDelay = stageStartDelay + logInterval * (logIdx + 1);
        const tLog = setTimeout(() => {
          addLog(logLine);

          // Update file progress
          const totalStages = caseConfig.processingStages.length;
          const overallProgress = Math.min(95, Math.round(
            ((stageIdx + (logIdx + 1) / stage.logs.length) / totalStages) * 100
          ));
          setFiles(prev => prev.map((f, idx) => idx === 0
            ? { ...f, progress: overallProgress }
            : f
          ));
        }, logDelay);
        demoTimersRef.current.push(tLog);
      });

      // Update stats at end of stage
      if (stage.statsAt) {
        const statsDelay = stageStartDelay + stage.durationMs - 200;
        const tStats = setTimeout(() => {
          setStats(prev => ({
            ...prev,
            txnsExtracted: stage.statsAt!.transactions ?? prev.txnsExtracted,
            accountsFound: stage.statsAt!.accounts ?? prev.accountsFound,
          }));
        }, statsDelay);
        demoTimersRef.current.push(tStats);
      }

      cumulativeDelay += stage.durationMs;
    });

    // Final completion
    const tComplete = setTimeout(() => {
      setFiles(prev => prev.map((f, idx) => idx === 0
        ? { ...f, status: 'parsed' as const, progress: 100, transactions: caseConfig.finalStats.transactions }
        : f
      ));
      setIsUploading(false);
      setStats({
        filesProcessed: 1,
        txnsExtracted: caseConfig.finalStats.transactions,
        accountsFound: caseConfig.finalStats.accounts,
      });
      setDemo(prev => ({ ...prev, status: 'complete', stageProgress: 100 }));

      // Add to ingestion history
      setSessions(prev => [{
        session_id: `demo-${caseConfig.caseId}-${Date.now()}`,
        status: 'complete',
        files_count: 1,
        transactions_extracted: caseConfig.finalStats.transactions,
        new_accounts_discovered: caseConfig.finalStats.accounts,
        created_at: new Date().toISOString(),
      }, ...prev]);
    }, cumulativeDelay + 500);
    demoTimersRef.current.push(tComplete);
  }, [addLog]);

  // ──── Hidden Keyboard Trigger ─────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (demo.status === 'processing' || demo.status === 'complete') return;

      // Ignore if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const caseConfig = DEMO_CASES[e.key];
      if (caseConfig) {
        e.preventDefault();
        
        // If they trigger the demo without uploading a file, fake one for them!
        if (files.length === 0) {
          setFiles([{
            id: `demo-${e.key}-${Date.now()}`,
            name: `${caseConfig.firNumber}.xlsx`,
            size: 245760,
            type: 'xlsx',
            status: 'queued',
            progress: 0,
            transactions: 0,
          }]);
        }
        
        startDemoProcessing(caseConfig, e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files, demo.status, startDemoProcessing]);

  // ──── Standard Handlers (unchanged) ───────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFilesToQueue(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToQueue(Array.from(e.target.files));
    }
  }, []);

  const addFilesToQueue = useCallback((newFiles: globalThis.File[]) => {
    // If demo was complete, reset for re-run
    if (demo.status === 'complete') {
      setDemo(INITIAL_DEMO_STATE);
      setParseLog([]);
      setShowPreview(false);
      setPreview([]);
      setStats({ filesProcessed: 0, txnsExtracted: 0, accountsFound: 0 });
    }

    const queuedFiles: UploadedFile[] = newFiles.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      size: f.size,
      type: getFileExt(f.name),
      status: 'queued' as const,
      progress: 0,
      transactions: 0,
    }));
    setFiles(prev => [...prev, ...queuedFiles]);
    addLog(`📁 ${newFiles.length} file(s) added to queue`);
  }, [addLog, demo.status]);

  // ──── Standard Upload & Parse (non-demo) ──────────────────

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setParseLog([]);

    addLog('🚀 Starting multi-file ingestion...');
    
    let allExtractedTxns: ParsedTransaction[] = [];
    const accounts = new Set<string>();

    for (let i = 0; i < files.length; i++) {
      const fileObj = files[i];
      const actualFile = (fileObj as any).originalFile;
      if (!actualFile) continue;

      setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploading', progress: 30 } : f));
      addLog(`⬆️  Uploading ${fileObj.name} (${formatBytes(fileObj.size)})...`);

      try {
        const formData = new FormData();
        formData.append('file', actualFile);

        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'parsing', progress: 60 } : f));
        addLog(`🧠 Calling OpenRouter LLM for ${fileObj.name} (${fileObj.type.toUpperCase()})`);
        
        // Actually call backend
        const res = await fetch(`${API_BASE_URL}/api/v1/ingest/file`, {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();
        const txns: ParsedTransaction[] = data.transactions || [];
        
        allExtractedTxns = [...allExtractedTxns, ...txns];
        
        txns.forEach(tx => {
            if(tx.from_account) accounts.add(tx.from_account);
            if(tx.to_account) accounts.add(tx.to_account);
        });

        setFiles(prev => prev.map(f => f.id === fileObj.id ? {
          ...f, status: 'parsed', progress: 100, transactions: txns.length
        } : f));
        addLog(`✅ ${fileObj.name} — LLM extracted ${txns.length} transactions`);
      } catch (e: any) {
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error', progress: 100, error: e.message } : f));
        addLog(`❌ Error processing ${fileObj.name}: ${e.message}`);
      }
    }

    setStats({ filesProcessed: files.length, txnsExtracted: allExtractedTxns.length, accountsFound: accounts.size });
    addLog(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    addLog(`📊 TOTAL: ${allExtractedTxns.length} transactions from ${files.length} files`);
    addLog(`🏦 ${accounts.size} unique accounts discovered`);
    addLog(`⏳ Awaiting your review before graph commit...`);

    setPreview(allExtractedTxns);
    setShowPreview(true);
    setIsUploading(false);
  }, [files, addLog]);

  const handleCommit = useCallback(async () => {
    setIsCommitting(true);
    addLog(`\n🔗 Committing to PostgreSQL + Neo4j graph...`);
    
    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/ingest/commit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ transactions: preview })
        });
        
        if (!res.ok) {
            throw new Error(`Server returned ${res.status}`);
        }
        
        const data = await res.json();
        
        addLog(`✅ Graph updated: ${data.accounts_created} nodes, ${data.transactions_committed} edges`);
        addLog(`🎯 Risk scoring triggered for ${data.accounts_created} accounts`);
        
        // Add to history
        setSessions(prev => [{
          session_id: `session-${Date.now()}`,
          status: 'complete',
          files_count: stats.filesProcessed,
          transactions_extracted: data.transactions_committed,
          new_accounts_discovered: data.accounts_created,
          created_at: new Date().toISOString(),
        }, ...prev]);

    } catch (e: any) {
        addLog(`❌ Commit Error: ${e.message}`);
    } finally {
        setIsCommitting(false);
        // Reset
        setFiles([]);
        setShowPreview(false);
        setPreview([]);
        setStats({ filesProcessed: 0, txnsExtracted: 0, accountsFound: 0 });
    }
  }, [addLog, stats, preview]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  // ──── Demo Helpers ────────────────────────────────────────

  const handleResetDemo = useCallback(() => {
    demoTimersRef.current.forEach(t => clearTimeout(t));
    demoTimersRef.current = [];
    setDemo(INITIAL_DEMO_STATE);
    setFiles([]);
    setParseLog([]);
    setShowPreview(false);
    setPreview([]);
    setIsUploading(false);
    setStats({ filesProcessed: 0, txnsExtracted: 0, accountsFound: 0 });
  }, []);

  // ──── Derived state ───────────────────────────────────────

  const isDemoProcessing = demo.status === 'processing';
  const isDemoComplete = demo.status === 'complete';
  const currentCaseConfig = demo.caseConfig;

  // Compute session stats status text
  const getStatusText = () => {
    if (isDemoProcessing) return 'PROCESSING';
    if (isDemoComplete) return 'COMPLETE';
    if (isUploading) return 'PARSING';
    if (isCommitting) return 'COMMITTING';
    if (showPreview) return 'READY';
    return 'IDLE';
  };

  const getStatusColor = () => {
    if (isDemoProcessing) return 'text-amber-400';
    if (isDemoComplete) return 'text-emerald-400';
    if (isUploading) return 'text-amber-400';
    if (showPreview) return 'text-emerald-400';
    return 'text-white/30';
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-white tracking-wider">
            DATA INGESTION
          </h1>
          <p className="text-sm text-white/40 mt-1 font-mono">
            Drop files · Extract transactions · Build the graph
          </p>
        </div>
        <div className="flex gap-3">
          {stats.filesProcessed > 0 && (
            <div className="flex gap-2">
              {[
                { label: 'Files', value: stats.filesProcessed, color: 'text-sky-400' },
                { label: 'Txns', value: stats.txnsExtracted, color: 'text-emerald-400' },
                { label: 'Accounts', value: stats.accountsFound, color: 'text-amber-400' },
              ].map(s => (
                <div key={s.label} className="px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                  <p className={`text-lg font-mono font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Drop Zone + File Queue */}
        <div className="col-span-5 space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300
              ${isDragging
                ? 'border-sky-400/60 bg-sky-400/5 shadow-[inset_0_0_30px_rgba(56,189,248,0.1)]'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.xlsx,.xls,.csv,.docx,.png,.jpg,.jpeg,.tiff"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragging ? 'text-sky-400' : 'text-white/20'}`} />
            <p className="text-white/60 font-medium">
              {isDragging ? 'Release to upload' : 'Drop files here or click to browse'}
            </p>
            <p className="text-xs text-white/30 mt-2 font-mono">
              PDF · Excel · CSV · Word · Images — up to 50MB each
            </p>
          </div>

          {/* File Queue */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider">
                  File Queue ({files.length})
                </h3>
                {!isUploading && !isDemoProcessing && (
                  <button
                    onClick={isDemoComplete ? handleResetDemo : () => { setFiles([]); setPreview([]); setShowPreview(false); }}
                    className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                {files.map(file => {
                  const ext = getFileExt(file.name);
                  const Icon = FILE_ICONS[ext] || File;
                  const color = FILE_COLORS[ext] || 'text-white/40';

                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 group"
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-white/30 font-mono">{formatBytes(file.size)}</span>
                          {file.status === 'parsed' && (
                            <span className="text-[10px] text-emerald-400 font-mono">
                              {file.transactions} txns
                            </span>
                          )}
                        </div>
                        {/* Progress Bar */}
                        {(file.status === 'uploading' || file.status === 'parsing') && (
                          <div className="w-full h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-500"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {file.status === 'queued' && (
                          <button onClick={() => removeFile(file.id)} className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(file.status === 'uploading' || file.status === 'parsing') && (
                          <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
                        )}
                        {file.status === 'parsed' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                        {file.status === 'error' && (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upload Button — only show for non-demo flow */}
              {!isUploading && !isDemoProcessing && !isDemoComplete && files.some(f => f.status === 'queued') && (
                <button
                  onClick={handleUpload}
                  className="w-full py-3 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 font-mono text-sm hover:bg-sky-500/30 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                >
                  <Upload className="w-4 h-4" />
                  Upload & Parse {files.filter(f => f.status === 'queued').length} file(s)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Middle: Parse Log */}
        <div className="col-span-4">
          <div className="rounded-2xl bg-[#0a0e14] border border-white/5 overflow-hidden h-full flex flex-col">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isDemoProcessing || isUploading ? 'bg-amber-400' : isDemoComplete ? 'bg-emerald-400' : 'bg-emerald-400'} animate-pulse`} />
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Parse Log</span>
              {isDemoProcessing && currentCaseConfig && (
                <span className="ml-auto text-[10px] font-mono text-amber-400/60">
                  Stage {demo.currentStageIndex + 1}/{currentCaseConfig.processingStages.length}
                </span>
              )}
            </div>
            <div ref={logRef} className="flex-1 p-4 overflow-y-auto max-h-[400px] scrollbar-thin">
              {parseLog.length === 0 ? (
                <p className="text-white/20 text-xs font-mono text-center mt-8">
                  Upload files to see parse output...
                </p>
              ) : (
                <div className="space-y-1">
                  {parseLog.map((line, i) => (
                    <p key={i} className={`text-[11px] font-mono leading-relaxed ${
                      line.includes('━━') ? 'text-sky-400/60' :
                      line.includes('✅ CASE') ? 'text-emerald-400 font-bold' :
                      line.includes('🚨') ? 'text-red-400/80' :
                      line.includes('⚖️') ? 'text-amber-400/80' :
                      line.includes('✅') ? 'text-emerald-400/70' :
                      line.includes('⚠️') ? 'text-amber-400/70' :
                      line.includes('❌') ? 'text-red-400/80' :
                      'text-white/60'
                    }`}>{line}</p>
                  ))}
                  {isDemoProcessing && (
                    <p className="text-[11px] font-mono text-sky-400/50 animate-pulse mt-1">▌</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Session Stats */}
        <div className="col-span-3">
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 space-y-4">
            <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider">Session Stats</h3>
            {[
              { label: 'Status', value: getStatusText(), color: getStatusColor() },
              { label: 'Files', value: files.length.toString(), color: 'text-white/60' },
              { label: 'Transactions', value: stats.txnsExtracted.toLocaleString(), color: 'text-sky-400' },
              { label: 'Accounts', value: stats.accountsFound.toLocaleString(), color: 'text-amber-400' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-xs text-white/30 font-mono">{s.label}</span>
                <span className={`text-sm font-mono font-bold ${s.color}`}>{s.value}</span>
              </div>
            ))}

            {/* Processing progress indicator for demo */}
            {isDemoProcessing && currentCaseConfig && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/30 font-mono">Progress</span>
                  <span className="text-[10px] font-mono text-sky-400">
                    {Math.round(((demo.currentStageIndex + 1) / currentCaseConfig.processingStages.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${((demo.currentStageIndex + 1) / currentCaseConfig.processingStages.length) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] font-mono text-white/30 truncate">
                  {currentCaseConfig.processingStages[demo.currentStageIndex]?.label || '...'}
                </p>
              </div>
            )}

            {showPreview && !isDemoComplete && (
              <button
                onClick={handleCommit}
                disabled={isCommitting}
                className="w-full py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-sm hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
              >
                {isCommitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Committing...</>
                ) : (
                  <><GitCommitHorizontal className="w-4 h-4" /> Commit to Graph</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Table (non-demo) */}
      {showPreview && preview.length > 0 && (
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-mono text-white/60">
                Preview — {preview.length} transactions extracted
              </h3>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-amber-400/10 text-amber-400 font-mono">
              {preview.filter(t => t.confidence < 0.8).length} low confidence
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Date', 'From', 'To', 'Amount', 'Mode', 'Source', 'Confidence'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-mono text-white/30 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((txn, i) => (
                  <tr
                    key={i}
                    className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                      txn.confidence < 0.7 ? 'bg-red-500/[0.03]' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-xs font-mono text-white/60">
                      {formatDate(txn.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-white/70">{txn.from_account}</td>
                    <td className="px-4 py-3 text-xs font-mono text-white/70">{txn.to_account}</td>
                    <td className="px-4 py-3 text-xs font-mono text-white/80 font-bold">
                      {formatAmount(txn.amount)}
                    </td>
                    <td className="px-4 py-3">
                      {txn.transaction_type ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400">
                          {txn.transaction_type}
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[10px] font-mono text-white/30 max-w-[150px] truncate">
                      {txn.source_file}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${getConfidenceColor(txn.confidence)}`}>
                        {(txn.confidence * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CASE 1 RESULT PACKAGE                                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {isDemoComplete && currentCaseConfig && (
        <div className="space-y-6">
          {/* Result Package Header */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500/[0.06] to-sky-500/[0.04] border border-emerald-500/20 overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-display text-white tracking-wider">
                    INVESTIGATION REPORT PACKAGE
                  </h2>
                  <p className="text-xs font-mono text-white/40 mt-0.5">
                    Case {currentCaseConfig.firNumber} · {currentCaseConfig.title} · {currentCaseConfig.finalStats.transactions} transactions · {currentCaseConfig.finalStats.accounts} accounts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SECTION 65B COMPLIANT
                </span>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  BNS 2023 READY
                </span>
              </div>
            </div>

            {/* Three Report Cards */}
            <div className="px-6 pb-6 grid grid-cols-3 gap-4">
              {/* Card 1: HTML Report (Primary) */}
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5 space-y-4 relative overflow-hidden group hover:border-sky-500/30 transition-all duration-300">
                {/* Accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 to-sky-400" />
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center">
                    <FileSearch className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Primary Investigation Report</h3>
                    <p className="text-[10px] font-mono text-white/30 mt-0.5">HTML · Interactive</p>
                  </div>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Complete interactive investigation report with transaction analysis, entity mapping, risk assessment, and legal charge recommendations.
                </p>
                <p className="text-[10px] font-mono text-white/20 truncate">
                  {currentCaseConfig.assets.htmlReport.filename}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDemo(prev => ({ ...prev, showReportViewer: true }))}
                    className="flex-1 py-2.5 rounded-lg bg-sky-500/15 border border-sky-500/25 text-sky-400 font-mono text-xs hover:bg-sky-500/25 transition-all flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(56,189,248,0.1)]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Report
                  </button>
                  <a
                    href={currentCaseConfig.assets.htmlReport.path}
                    download={currentCaseConfig.assets.htmlReport.filename}
                    className="py-2.5 px-4 rounded-lg bg-white/5 border border-white/10 text-white/50 font-mono text-xs hover:bg-white/10 hover:text-white/70 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Card 2: Forensic DOCX Report */}
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5 space-y-4 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-amber-400" />
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <FileCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Forensic Report</h3>
                    <p className="text-[10px] font-mono text-white/30 mt-0.5">DOCX · Detailed</p>
                  </div>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Detailed forensic investigation document with evidence chain, transaction narratives, and court-admissible findings under Section 65B.
                </p>
                <p className="text-[10px] font-mono text-white/20 truncate">
                  {currentCaseConfig.assets.forensicReport.filename}
                </p>
                <div className="flex gap-2">
                  <a
                    href={currentCaseConfig.assets.forensicReport.path}
                    download={currentCaseConfig.assets.forensicReport.filename}
                    className="flex-1 py-2.5 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-400 font-mono text-xs hover:bg-amber-500/25 transition-all flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(251,191,36,0.1)]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Report
                  </a>
                </div>
              </div>

              {/* Card 3: Case Brief DOCX */}
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5 space-y-4 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-purple-400" />
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Case Brief</h3>
                    <p className="text-[10px] font-mono text-white/30 mt-0.5">DOCX · Summary</p>
                  </div>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Executive case summary brief with key findings, suspect profiles, recommended charges, and cross-case intelligence links.
                </p>
                <p className="text-[10px] font-mono text-white/20 truncate">
                  {currentCaseConfig.assets.caseBrief.filename}
                </p>
                <div className="flex gap-2">
                  <a
                    href={currentCaseConfig.assets.caseBrief.path}
                    download={currentCaseConfig.assets.caseBrief.filename}
                    className="flex-1 py-2.5 rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-400 font-mono text-xs hover:bg-purple-500/25 transition-all flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(168,85,247,0.1)]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Brief
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded HTML Report Viewer */}
          {demo.showReportViewer && (
            <div className="rounded-2xl bg-white/[0.02] border border-sky-500/20 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSearch className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-mono text-white/60">
                    Investigation Report — {currentCaseConfig.firNumber}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={currentCaseConfig.assets.htmlReport.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open in New Tab
                  </a>
                  <button
                    onClick={() => setDemo(prev => ({ ...prev, showReportViewer: false }))}
                    className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
              <iframe
                src={currentCaseConfig.assets.htmlReport.path}
                title="FraudLens Investigation Report"
                className="w-full border-0"
                style={{ height: '80vh', minHeight: '600px' }}
              />
            </div>
          )}
        </div>
      )}

      {/* Ingestion History */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
          <History className="w-4 h-4 text-white/30" />
          <h3 className="text-sm font-mono text-white/40">Ingestion History</h3>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {sessions.length === 0 && (
            <div className="px-5 py-6 text-center">
              <p className="text-xs font-mono text-white/20">No ingestion sessions yet</p>
            </div>
          )}
          {sessions.map(session => (
            <div key={session.session_id} className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  session.status === 'complete' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
                }`}>
                  {session.status.toUpperCase()}
                </span>
                <span className="text-xs text-white/30 font-mono">{formatDate(session.created_at)}</span>
              </div>
              <div className="flex items-center gap-6 text-xs font-mono">
                <span className="text-white/40">{session.files_count} files</span>
                <span className="text-sky-400">{session.transactions_extracted.toLocaleString()} txns</span>
                <span className="text-amber-400">{session.new_accounts_discovered} accounts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
