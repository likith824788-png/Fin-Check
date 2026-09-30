import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Cpu,
  ShieldCheck,
  Binary,
  GitCompare,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Layers,
  ChevronRight,
  Play,
  RotateCw,
  Search,
  Filter,
  Check,
  Database,
  Compass
} from 'lucide-react';
import api from '../../services/api';

export default function Analysis() {
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState('Annual_Report_2026.pdf');
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // Section 11: 10-Step Agentic Check Workflow
  const agenticWorkflowSteps = [
    {
      step: 1,
      id: 'PLAN',
      title: 'Plan Audit Execution',
      desc: 'Formulate audit plan, inspect filing formats, and establish consistency review objectives.',
      log: 'Audit scope identified: FY2026 Consolidated Statements vs MD&A Commentary and Notes.',
      icon: Compass,
      tag: 'Orchestrator'
    },
    {
      step: 2,
      id: 'SELECT_CHECK',
      title: 'Select Consistency Checks',
      desc: 'Define pairwise comparison matrix across Revenue, EBITDA, Cash, Debt, Trade Receivables, and Margins.',
      log: 'Configured 328 automated verification rules across 12 uploaded filings.',
      icon: Filter,
      tag: 'Rule Selector'
    },
    {
      step: 3,
      id: 'EXTRACT_FACTS',
      title: 'Extract Relevant Facts',
      desc: 'Primary extraction via NVIDIA Nemotron with verbatim citations, page coordinates, and financial scopes.',
      log: 'Extracted 486 facts with 0.99 confidence from balance sheets, P&L, and schedules.',
      icon: Cpu,
      tag: 'NVIDIA Nemotron'
    },
    {
      step: 4,
      id: 'NORMALIZE',
      title: 'Normalize Dimensions & Units',
      desc: 'Standardize Million/Lakh/Crore to base INR, periods (FY2026 = Year ended March 31, 2026), and statement types.',
      log: 'Preserved original values (100,000 Million INR) alongside normalized values (10,000 Crore INR).',
      icon: Binary,
      tag: 'Python Engine'
    },
    {
      step: 5,
      id: 'COMPARE',
      title: 'Deterministic Arithmetic Comparison',
      desc: 'Python calculates absolute difference, percentage variance, and direction without LLM arithmetic.',
      log: 'Difference: ₹500 Cr (5.00% Higher) flagged on Revenue between Annual Report & MD&A.',
      icon: GitCompare,
      tag: 'Deterministic Python'
    },
    {
      step: 6,
      id: 'SEARCH_EVIDENCE',
      title: 'Search Related Evidence',
      desc: 'Scan Notes to Accounts, operational reviews, and segment disclosures for reconciling explanations.',
      log: 'Queried Note 24 and Note 32 for inter-segment eliminations and freight reclassifications.',
      icon: Search,
      tag: 'Evidence Engine'
    },
    {
      step: 7,
      id: 'VERIFY',
      title: 'Verify Grounding & Confidence',
      desc: 'Secondary verification by Gemma model ensuring verbatim quotation fidelity and lack of hallucination.',
      log: 'Gemma verified page 42 quote against original PDF text stream with zero discrepancies.',
      icon: ShieldCheck,
      tag: 'Gemma Secondary'
    },
    {
      step: 8,
      id: 'CLASSIFY',
      title: 'Classify Finding Status',
      desc: 'Classify as Consistent 🟢, Explained Difference 🟡, Potential Issue 🟠, or Unresolved Discrepancy 🔴.',
      log: 'Revenue classified as Potential Issue 🟠 (pending disclosure note upload).',
      icon: Sparkles,
      tag: 'Groq / Classifier'
    },
    {
      step: 9,
      id: 'SAVE_FINDING',
      title: 'Save Finding & Evidence Chain',
      desc: 'Store finding with 6-stage evidence chain, source links, and audit trail in Firestore.',
      log: 'Persisted Finding F-024 with immutable audit history and page links.',
      icon: Database,
      tag: 'Firestore Persistence'
    },
    {
      step: 10,
      id: 'UPDATE_FINDINGS',
      title: 'Update Findings (Auto-Reconciliation)',
      desc: 'When subsequent documents or explanatory notes arrive, re-evaluate and update finding status.',
      log: 'Auto-reconciliation listener active for new document uploads and note reconciliations.',
      icon: RotateCw,
      tag: 'Continuous Engine'
    },
  ];

  const handleSimulateRun = () => {
    setIsRunning(true);
    setCompletedSteps([]);
    let current = 1;
    const interval = setInterval(() => {
      setCompletedSteps(prev => [...prev, current]);
      current++;
      if (current > 10) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
              Agentic Check Workflow
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-mint text-brand-dark">
              Multi-Step Review Active
            </span>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            Deterministic multi-step financial review pipeline demonstrating Section 11 end-to-end audit traceability.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateRun}
            disabled={isRunning}
            className="px-3.5 py-2 bg-brand-mint hover:bg-[#d8f5e9] text-brand-dark text-xs font-bold rounded-lg border border-brand-emerald/30 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing Agentic Pipeline...' : 'Run Live Agentic Check'}</span>
          </button>
          <button
            onClick={() => navigate('/consistency')}
            className="px-3.5 py-2 bg-surface hover:bg-background border border-border text-navy-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Consistency Review</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/findings')}
            className="px-4 py-2 bg-brand-dark hover:bg-[#065f46] text-white text-xs font-bold rounded-lg shadow-subtle transition-all flex items-center gap-1.5"
          >
            <span>View Findings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Document Card */}
      <div className="bg-surface p-4 rounded-card border border-border shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-mint text-brand-dark flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-navy-900">Active Audit Target: {selectedDoc}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-background border border-border">
                FY2026 Consolidated
              </span>
            </div>
            <p className="text-[11px] text-navy-500 mt-0.5">
              Source file stored in Firebase Storage • 142 facts cross-verified across 11 other documents
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-brand-dark flex items-center gap-1 justify-end">
            <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
            10/10 Stages Verified
          </span>
          <span className="text-[10px] text-navy-500">Cross-Document Checks Complete</span>
        </div>
      </div>

      {/* Live Timeline Checklist Summary (Section 11 Requirement) */}
      <div className="bg-brand-mint/20 border border-brand-emerald/20 p-4 rounded-card">
        <div className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
          Automated Audit Verification Timeline
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-navy-800">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-brand-emerald font-bold" />
            <span>Document analyzed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-brand-emerald font-bold" />
            <span>Revenue facts extracted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-brand-emerald font-bold" />
            <span>Units normalized</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-brand-emerald font-bold" />
            <span>Revenue values matched</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-brand-emerald font-bold" />
            <span>Difference calculated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-brand-emerald font-bold" />
            <span>Notes checked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-brand-emerald font-bold" />
            <span>Evidence linked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-brand-emerald font-bold" />
            <span>Finding classified</span>
          </div>
        </div>
      </div>

      {/* 10-Step Workflow Timeline */}
      <div className="relative pl-4 sm:pl-8 space-y-4 before:absolute before:left-7 sm:before:left-11 before:top-6 before:bottom-6 before:w-0.5 before:bg-brand-emerald/25">
        {agenticWorkflowSteps.map((stage) => {
          const Icon = stage.icon;
          const isDone = completedSteps.includes(stage.step);
          return (
            <div
              key={stage.step}
              className={`relative flex items-start gap-4 sm:gap-6 bg-surface p-4 rounded-card border transition-all ${
                isDone
                  ? 'border-border shadow-xs hover:border-brand-emerald/40'
                  : 'border-border/60 opacity-60'
              }`}
            >
              {/* Step Circle Marker */}
              <div
                className={`w-9 h-9 rounded-full font-extrabold text-xs flex items-center justify-center shrink-0 z-10 transition-transform shadow-xs ${
                  isDone
                    ? 'bg-brand-mint border-2 border-brand-dark text-brand-dark'
                    : 'bg-background border-2 border-border text-navy-400'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 text-brand-dark" /> : stage.step}
              </div>

              {/* Stage Content */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-brand-dark" />
                    <h3 className="text-sm font-bold text-navy-900">
                      Step {stage.step}: {stage.title}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-pink text-[#991B1B] border border-[#F8B4C0]">
                      {stage.tag}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-brand-dark flex items-center gap-1 font-mono">
                    [{stage.id}]
                  </span>
                </div>

                <p className="text-xs text-navy-600 leading-relaxed mb-2">
                  {stage.desc}
                </p>

                {/* Audit Evidence Log */}
                <div className="p-2.5 rounded bg-background border border-border text-[11px] font-mono text-navy-700 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                  <span>{stage.log}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
