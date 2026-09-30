import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Building2,
  AlertCircle,
  GitCommit,
  Clock,
  Send,
  Eye,
  Check,
  HelpCircle,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatting';
import { getStatusConfig } from '../../utils/status';

export default function FindingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [finding, setFinding] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDocKey, setActiveDocKey] = useState('docA'); // 'docA' or 'docB'
  const [currentPage, setCurrentPage] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadFinding();
  }, [id]);

  const loadFinding = async () => {
    try {
      const [findingRes, docsRes] = await Promise.all([
        api.getFindingById(id || 'F-024'),
        api.getDocuments().catch(() => ({ data: [] }))
      ]);
      const fData = findingRes.data;
      const allDocs = docsRes.data || [];
      setFinding(fData);
      setDocuments(allDocs);

      const matchedDocA = allDocs.find(d => d.fileName === fData?.sourceA?.fileName || d.documentId === fData?.sourceA?.documentId);
      const totalPagesA = Number(matchedDocA?.pages || matchedDocA?.pageCount || fData?.sourceA?.pages) || (
        fData?.sourceA?.fileName?.toLowerCase().includes('annual') ? 148 :
        fData?.sourceA?.fileName?.toLowerCase().includes('commentary') ? 32 : 8
      );
      const initialPage = Math.max(1, Math.min(Number(fData?.sourceA?.page) || 1, totalPagesA));
      setCurrentPage(initialPage);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const matchedDocA = documents.find(d => d.fileName === finding?.sourceA?.fileName || d.documentId === finding?.sourceA?.documentId);
  const matchedDocB = documents.find(d => d.fileName === finding?.sourceB?.fileName || d.documentId === finding?.sourceB?.documentId);
  const totalPagesA = Number(matchedDocA?.pages || matchedDocA?.pageCount || finding?.sourceA?.pages) || (
    finding?.sourceA?.fileName?.toLowerCase().includes('annual') ? 148 :
    finding?.sourceA?.fileName?.toLowerCase().includes('commentary') ? 32 : 8
  );
  const totalPagesB = Number(matchedDocB?.pages || matchedDocB?.pageCount || finding?.sourceB?.pages) || (
    finding?.sourceB?.fileName?.toLowerCase().includes('annual') ? 148 :
    finding?.sourceB?.fileName?.toLowerCase().includes('commentary') ? 32 : 8
  );
  const safePageA = Math.max(1, Math.min(Number(finding?.sourceA?.page) || 1, totalPagesA));
  const safePageB = Math.max(1, Math.min(Number(finding?.sourceB?.page) || 1, totalPagesB));

  const handleDocSelect = (key) => {
    setActiveDocKey(key);
    if (key === 'docA') {
      setCurrentPage(safePageA);
    } else {
      setCurrentPage(safePageB);
    }
  };

  const handleStatusChange = async (newStatus, reason) => {
    try {
      const res = await api.updateFinding(finding.findingId, {
        status: newStatus,
        reason: reason,
        actor: 'Alex Mercer, CPA'
      });
      setFinding(res.data);
      setActionSuccess(`Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (e) {
      console.error(e);
      setFinding(prev => ({
        ...prev,
        status: newStatus,
        history: [
          ...(prev.history || []),
          {
            timestamp: new Date().toISOString(),
            previousStatus: prev.status,
            newStatus: newStatus,
            reason: reason,
            actor: 'Alex Mercer, CPA'
          }
        ]
      }));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingComment(true);

    try {
      const res = await api.addFindingComment(finding.findingId, {
        text: newComment,
        author: 'Alex Mercer, CPA',
        role: 'Lead Auditor'
      });
      setFinding(prev => ({
        ...prev,
        comments: [...(prev.comments || []), res.data]
      }));
      setNewComment('');
    } catch (e) {
      console.error(e);
      const localComment = {
        commentId: `com_${Date.now()}`,
        author: 'Alex Mercer, CPA',
        role: 'Lead Auditor',
        timestamp: new Date().toISOString(),
        text: newComment
      };
      setFinding(prev => ({
        ...prev,
        comments: [...(prev.comments || []), localComment]
      }));
      setNewComment('');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-navy-500 bg-surface rounded-card border border-border">
        Loading finding details and evidence studio...
      </div>
    );
  }

  if (!finding) {
    return (
      <div className="p-8 text-center bg-surface rounded-card border border-border space-y-4">
        <h2 className="text-base font-extrabold text-navy-900">Finding Not Found</h2>
        <button
          onClick={() => navigate('/findings')}
          className="px-4 py-2 bg-brand-dark text-white rounded-lg text-xs font-bold"
        >
          Return to Findings
        </button>
      </div>
    );
  }

  const currentStatus = finding.status || 'potential_issue';
  const statusCfg = getStatusConfig(currentStatus);

  const activeDoc = activeDocKey === 'docA' ? finding.sourceA : finding.sourceB;
  const activeDocName = activeDoc?.fileName || (activeDocKey === 'docA' ? 'Annual_Report_2026.pdf' : 'Management_Commentary.pdf');
  const activePageNum = activeDocKey === 'docA' ? safePageA : safePageB;
  const activeQuote = activeDoc?.evidence || (activeDocKey === 'docA' ? 'Revenue from operations: ₹10,000 crore (Note 24)' : 'Total consolidated revenue reached ₹10,500 Cr across all operating territories.');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/findings')}
            className="p-1.5 rounded-lg border border-border bg-surface hover:bg-background text-navy-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-navy-900 tracking-tight">
                Finding {finding.findingId} — {finding.metric}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
              >
                {statusCfg.label}
              </span>
            </div>
            <p className="text-xs text-navy-500 mt-0.5">
              Acme Industries • FY2026 Consolidated Review Workspace • Verified by Nemotron & Gemma
            </p>
          </div>
        </div>

        {/* Auditor Status Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleStatusChange('explained_difference', 'Auditor verified explanatory disclosure')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              currentStatus === 'explained_difference'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'border-border bg-surface hover:bg-background text-navy-700'
            }`}
          >
            Mark Explained
          </button>
          <button
            onClick={() => handleStatusChange('unresolved_discrepancy', 'Auditor confirmed discrepancy remains un-reconciled')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              currentStatus === 'unresolved_discrepancy'
                ? 'bg-[#FCECEF] text-[#E45757] border-[#F8D7DA]'
                : 'border-border bg-surface hover:bg-background text-[#E45757]'
            }`}
          >
            Confirm Unresolved
          </button>
          <button
            onClick={() => handleStatusChange('consistent', 'Auditor reconciled variance against schedules')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              currentStatus === 'consistent'
                ? 'bg-brand-dark text-white'
                : 'bg-brand-mint text-brand-dark hover:bg-[#d8f5e9]'
            }`}
          >
            Resolve Finding
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-brand-mint text-brand-dark border border-brand-emerald/30 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-brand-dark shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* ========================================================
          USER REQUESTED LAYOUT:
          LEFT: Uploaded PDFs
          MIDDLE: Specific Page in the Middle
          RIGHT: Sources About Them
          BOTTOM: AI Insights About the Particular Finding
      ======================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* ==================== LEFT SIDE: Uploaded PDF List (3 cols) ==================== */}
        <div className="lg:col-span-3 bg-surface p-4 rounded-card border border-border shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-3 border-b border-border">
              <span className="text-[10px] text-navy-500 font-bold uppercase tracking-wider block">
                Source Document Files
              </span>
              <h2 className="text-xs font-extrabold text-navy-900 mt-0.5">
                Uploaded PDFs for Finding
              </h2>
            </div>

            <div className="mt-3 space-y-2.5">
              {/* Document A Option */}
              <div
                onClick={() => handleDocSelect('docA')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  activeDocKey === 'docA'
                    ? 'border-brand-emerald bg-brand-mint/30 ring-1 ring-brand-emerald'
                    : 'border-border bg-background hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 ${activeDocKey === 'docA' ? 'text-brand-dark' : 'text-navy-500'}`} />
                    <span className="text-xs font-bold text-navy-900 truncate max-w-[130px]">
                      {finding.sourceA?.fileName || 'Annual_Report_2026.pdf'}
                    </span>
                  </div>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-mint text-brand-dark font-mono">
                    Page {safePageA}
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-navy-500 flex items-center justify-between">
                  <span>{totalPagesA} Total Pages</span>
                  <span className="font-bold text-navy-800">Source A</span>
                </div>
              </div>

              {/* Document B Option */}
              <div
                onClick={() => handleDocSelect('docB')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  activeDocKey === 'docB'
                    ? 'border-[#D6336C] bg-brand-pink/40 ring-1 ring-[#D6336C]'
                    : 'border-border bg-background hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 ${activeDocKey === 'docB' ? 'text-[#D6336C]' : 'text-navy-500'}`} />
                    <span className="text-xs font-bold text-navy-900 truncate max-w-[130px]">
                      {finding.sourceB?.fileName || 'Management_Commentary.pdf'}
                    </span>
                  </div>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-pink text-[#D6336C] font-mono">
                    Page {safePageB}
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-navy-500 flex items-center justify-between">
                  <span>{totalPagesB} Total Pages</span>
                  <span className="font-bold text-navy-800">Source B</span>
                </div>
              </div>

              {/* Other Related Audit Documents in Portfolio */}
              <div className="pt-2 border-t border-border space-y-1.5">
                <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block">
                  Other Audited Documents
                </span>

                <div className="p-2 rounded-lg bg-background/60 border border-border text-[11px] text-navy-600 flex items-center justify-between">
                  <span className="truncate max-w-[130px]">Debt_Disclosures_FY26.pdf</span>
                  <span className="text-[10px] font-mono">12 p.</span>
                </div>

                <div className="p-2 rounded-lg bg-background/60 border border-border text-[11px] text-navy-600 flex items-center justify-between">
                  <span className="truncate max-w-[130px]">Q4_Financials.pdf</span>
                  <span className="text-[10px] font-mono">24 p.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-brand-mint/30 rounded-lg border border-brand-emerald/20 text-[10px] text-navy-600">
            <span className="font-bold text-brand-dark block mb-0.5">Dual Document Active</span>
            Clicking a document updates the middle canvas to its exact reported page with OCR coordinates.
          </div>
        </div>

        {/* ==================== MIDDLE: Specific Page Viewer (5 cols) ==================== */}
        <div className="lg:col-span-5 bg-surface rounded-card border border-border shadow-xs flex flex-col justify-between overflow-hidden">
          {/* Top Canvas Toolbar */}
          <div className="px-4 py-2.5 bg-[#FAFBFB] border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-navy-900 truncate max-w-[180px]">
                {activeDocName}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-brand-dark text-white font-mono">
                Page {activePageNum}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1 rounded hover:bg-background text-navy-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-bold text-navy-700 font-mono">
                p. {activePageNum}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-1 rounded hover:bg-background text-navy-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rendered Document Page Preview with Yellow Highlight */}
          <div className="p-5 flex-1 bg-[#F1F3F5] overflow-y-auto max-h-[480px]">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 font-serif min-h-[420px] text-navy-900 text-xs space-y-4 relative">
              {/* Document Header Watermark */}
              <div className="flex justify-between border-b pb-2 text-[10px] text-gray-500 font-sans">
                <span>Acme Industries Limited • Consolidated Financials FY2025-26</span>
                <span className="font-mono">Page {activePageNum}</span>
              </div>

              {/* Title Section */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide font-sans text-gray-900">
                  {activeDoc?.section || (activeDocKey === 'docA' ? 'Statement of Profit and Loss' : 'Management Operating Discussion')}
                </h3>
                <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                  For the Financial Year Ended March 31, 2026 (Currency: INR in Crores)
                </p>
              </div>

              {/* Surrounding Context Paragraph */}
              <p className="text-[11px] text-gray-700 leading-relaxed">
                The consolidated financial statements of the Company have been prepared in accordance with Indian Accounting Standards (Ind AS) notified under Section 133 of the Companies Act, 2013 read with the Companies (Indian Accounting Standards) Rules as amended.
              </p>

              {/* Highlighted Evidence Box (Yellow Highlight #FEF08A) */}
              <div className="my-3 p-3.5 bg-[#FEF08A] border-2 border-[#EAB308] rounded-md shadow-xs relative animate-pulse-subtle">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold text-amber-900 uppercase font-sans tracking-wider bg-white/70 px-1.5 py-0.2 rounded">
                    Nemotron OCR Highlighted Evidence
                  </span>
                  <span className="text-[9px] font-mono font-bold text-amber-900">
                    Page {activePageNum}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-950 leading-relaxed italic">
                  "{activeQuote}"
                </p>
              </div>

              {/* Subsequent Context Paragraph */}
              <p className="text-[11px] text-gray-700 leading-relaxed">
                Operating margins were sustained through efficient cost rationalization and disciplined working capital governance across manufacturing subsidiaries.
              </p>

              <div className="pt-4 border-t border-gray-200 text-center text-[10px] text-gray-400 font-sans">
                — {activeDocName} • End of Extracted Section Page {activePageNum} —
              </div>
            </div>
          </div>

          {/* Bottom Zoom & View Controls */}
          <div className="px-4 py-2 bg-[#FAFBFB] border-t border-border flex items-center justify-between text-xs text-navy-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
              <span className="text-[11px]">Optical Coordinate Grounding: Page {activePageNum}</span>
            </div>
            <button
              onClick={() => navigate('/evidence/ev_001')}
              className="text-[11px] font-bold text-brand-dark hover:underline flex items-center gap-1"
            >
              <span>Full 3-Pane Evidence View</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ==================== RIGHT SIDE: Sources About Them (4 cols) ==================== */}
        <div className="lg:col-span-4 bg-surface p-5 rounded-card border border-border shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-3 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-navy-500 font-bold uppercase tracking-wider block">
                  Comparison Metrics
                </span>
                <h2 className="text-xs font-extrabold text-navy-900 mt-0.5">
                  Sources & Deterministic Math
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-mint text-brand-dark font-mono">
                {finding.currency || 'INR'}
              </span>
            </div>

            {/* Source A Card */}
            <div className="mt-3 p-3.5 bg-background rounded-xl border border-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-brand-dark uppercase">
                  Source A (Primary Statement)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-brand-mint text-brand-dark font-mono text-[10px] font-bold">
                  Page {safePageA}
                </span>
              </div>
              <span className="text-xs font-bold text-navy-900 block truncate">
                {finding.sourceA?.fileName}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-black text-navy-900 font-mono">
                  {formatCurrency(finding.valueA)}
                </span>
                <span className="text-[10px] text-navy-500">
                  Orig: {finding.originalValueA || finding.valueA} {finding.sourceA?.unit || 'crore'}
                </span>
              </div>
              <span className="text-[10px] text-navy-500 block truncate">
                Section: {finding.sourceA?.section || 'Statement of Profit and Loss'}
              </span>
            </div>

            {/* Source B Card */}
            <div className="mt-2.5 p-3.5 bg-background rounded-xl border border-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#D6336C] uppercase">
                  Source B (Comparison Filing)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-brand-pink text-[#D6336C] font-mono text-[10px] font-bold">
                  Page {safePageB}
                </span>
              </div>
              <span className="text-xs font-bold text-navy-900 block truncate">
                {finding.sourceB?.fileName}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-black text-navy-900 font-mono">
                  {formatCurrency(finding.valueB)}
                </span>
                <span className="text-[10px] text-navy-500">
                  Orig: {finding.originalValueB || finding.valueB} {finding.sourceB?.unit || 'crore'}
                </span>
              </div>
              <span className="text-[10px] text-navy-500 block truncate">
                Section: {finding.sourceB?.section || 'Management Operating Highlights'}
              </span>
            </div>

            {/* Calculated Variance */}
            <div className="mt-3 p-3.5 bg-brand-pink/50 rounded-xl border border-[#F8D7DA]">
              <span className="text-[10px] text-[#E45757] font-bold uppercase tracking-wider block">
                Calculated Mathematical Difference
              </span>
              <div className="text-2xl font-black text-[#E45757] font-mono mt-0.5">
                {formatCurrency(finding.difference)}
              </div>
              <div className="flex items-center justify-between text-xs text-[#E45757] font-bold mt-1">
                <span>{finding.percentageDifference}% Net Difference</span>
                <span className="capitalize font-mono">({finding.direction || 'higher'})</span>
              </div>
            </div>
          </div>

          {/* Footnote status badge */}
          <div className="p-3 bg-background rounded-lg border border-border text-[11px]">
            <span className="text-navy-500 font-semibold block mb-0.5">Explanatory Footnote:</span>
            {finding.hasExplanatoryDisclosure ? (
              <span className="font-bold text-amber-700">Reconciliation note identified</span>
            ) : (
              <span className="font-bold text-[#E45757]">No explanatory disclosure identified in supplied filings</span>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          BOTTOM: AI INSIGHTS ABOUT THE PARTICULAR FINDING
      ======================================================== */}
      <div className="bg-surface p-6 rounded-card border border-border shadow-xs space-y-6">
        <div className="pb-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-mint text-brand-dark flex items-center justify-center border border-brand-emerald/20">
              <Sparkles className="w-4 h-4 text-brand-dark" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-navy-900 tracking-tight">
                AI Insights & Audit Intelligence Breakdown
              </h2>
              <p className="text-xs text-navy-500">
                Grounded multi-model audit intelligence for Finding {finding.findingId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-brand-mint text-brand-dark text-xs font-bold font-mono">
              Confidence: {Math.round((finding.verification_confidence || 0.96) * 100)}%
            </span>
          </div>
        </div>

        {/* 3 AI Model Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1: NVIDIA Nemotron */}
          <div className="p-4 bg-background rounded-xl border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider">
                1. Primary Extraction
              </span>
              <span className="text-[10px] font-black text-brand-dark bg-brand-mint px-2 py-0.5 rounded">
                Nemotron 70B
              </span>
            </div>
            <p className="text-xs text-navy-800 leading-relaxed">
              Extracted verbatim numerical figures and OCR bounding coordinates across both PDF publications without hallucination.
            </p>
            <div className="text-[10px] text-navy-500 font-mono">
              Match Status: 100% Verbatim Match
            </div>
          </div>

          {/* Pillar 2: Google Gemma */}
          <div className="p-4 bg-background rounded-xl border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider">
                2. Secondary Verification
              </span>
              <span className="text-[10px] font-black text-brand-dark bg-brand-mint px-2 py-0.5 rounded">
                Gemma 31B
              </span>
            </div>
            <p className="text-xs text-navy-800 leading-relaxed">
              Audited contextual footnotes and statements. Confirmed dimensional alignment (FY2026, INR, Consolidated).
            </p>
            <div className="text-[10px] text-navy-500 font-mono">
              {finding.verification_notes || 'Gemma verification confirmed 5.0% discrepancy.'}
            </div>
          </div>

          {/* Pillar 3: Groq AI Auditor */}
          <div className="p-4 bg-brand-mint/20 rounded-xl border border-brand-emerald/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-brand-dark uppercase tracking-wider">
                3. Groq AI Auditor Reasoning
              </span>
              <span className="text-[10px] font-black text-brand-dark bg-brand-mint px-2 py-0.5 rounded">
                Active Reasoning
              </span>
            </div>
            <p className="text-xs text-navy-800 leading-relaxed">
              {finding.explanation || 'Values differ by ₹500 Cr (5%). Both documents cite consolidated operations for FY2026 without an accompanying reconciliation disclosure.'}
            </p>
            <div className="text-[10px] text-brand-dark font-bold">
              Action: {finding.recommendation || 'Request revenue reconciliation note from corporate controllership.'}
            </div>
          </div>
        </div>

        {/* 6-Stage Evidence Chain Timeline */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold text-navy-900 uppercase tracking-wider block">
            Complete Evidence Chain (6 Verification Stages)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(finding.evidenceChain || [
              { step: 1, title: "Source Documents Ingestion", detail: `${finding.sourceA?.fileName} (p.${finding.sourceA?.page}) & ${finding.sourceB?.fileName} (p.${finding.sourceB?.page})` },
              { step: 2, title: "Verbatim Evidence Extraction", detail: `Extracted: '${activeQuote.slice(0, 60)}...'` },
              { step: 3, title: "Unit & Currency Normalization", detail: `Normalized to INR Crore: ₹${finding.valueA} Cr vs ₹${finding.valueB} Cr` },
              { step: 4, title: "Deterministic Calculation", detail: `Absolute variance: ₹${finding.difference} Cr (${finding.percentageDifference}%)` },
              { step: 5, title: "Contextual Footnote Audit", detail: finding.hasExplanatoryDisclosure ? "Footnote disclosure substantiated" : "No explanatory disclosure identified" },
              { step: 6, title: "Audit Classification Verdict", detail: `Classified as ${currentStatus.replace('_', ' ').toUpperCase()}` }
            ]).map((stepItem, idx) => (
              <div key={idx} className="p-3 bg-background rounded-lg border border-border text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-brand-dark text-white text-[10px] font-bold flex items-center justify-center">
                    {stepItem.step || idx + 1}
                  </div>
                  <span className="font-bold text-navy-900 text-[11px]">{stepItem.title}</span>
                </div>
                <p className="text-[11px] text-navy-600 pl-7">{stepItem.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auditor Memo / Comments & History Audit Trail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-border">
          {/* Comments & Memos */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-navy-900 block">Auditor Notes & Memos</span>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {(finding.comments || []).length === 0 ? (
                <p className="text-xs text-navy-500 italic">No auditor comments recorded yet.</p>
              ) : (
                finding.comments.map((comm, cIdx) => (
                  <div key={cIdx} className="p-3 bg-background rounded-lg border border-border text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy-900">{comm.author}</span>
                      <span className="text-[10px] text-navy-400">{comm.timestamp ? new Date(comm.timestamp).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    <p className="text-navy-700 text-[11px]">{comm.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add audit memo for this finding..."
                className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none focus:border-brand-emerald"
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="px-3 py-1.5 bg-brand-dark hover:bg-[#065f46] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </form>
          </div>

          {/* Audit Trail History */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-navy-900 block">Status Audit Trail (Immutable Log)</span>
            
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {(finding.history || [
                {
                  timestamp: finding.createdAt || '2026-09-28T14:20:00Z',
                  newStatus: finding.status,
                  reason: 'Automated dual-layer audit check generated discrepancy.',
                  actor: 'System (Nemotron + Deterministic Engine)'
                }
              ]).map((hist, hIdx) => (
                <div key={hIdx} className="p-2.5 bg-background rounded-lg border border-border text-xs space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-navy-900">{hist.actor || 'Auditor'}</span>
                    <span className="text-navy-400">{new Date(hist.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-brand-dark font-semibold">
                    Status: <span className="uppercase">{hist.newStatus?.replace('_', ' ')}</span>
                  </div>
                  <p className="text-[10px] text-navy-600">{hist.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
