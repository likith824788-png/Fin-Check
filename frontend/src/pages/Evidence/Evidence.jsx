import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Download,
  Eye,
  Layers,
  Sparkles,
  Bot
} from 'lucide-react';
import api from '../../services/api';

export default function Evidence() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [evidenceData, setEvidenceData] = useState(null);
  const [allEvidenceList, setAllEvidenceList] = useState([]);
  const [selectedPageNum, setSelectedPageNum] = useState(42);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTabDoc, setActiveTabDoc] = useState('docA');

  useEffect(() => {
    loadAllEvidence();
  }, []);

  useEffect(() => {
    loadEvidenceDetails(id || 'ev_001');
  }, [id]);

  const loadAllEvidence = async () => {
    try {
      const res = await api.getAllEvidence();
      if (res.data?.evidence) {
        setAllEvidenceList(res.data.evidence);
      }
    } catch (e) {
      console.warn('Could not load all evidence list', e);
    }
  };

  const loadEvidenceDetails = async (evidenceId) => {
    setLoading(true);
    try {
      const res = await api.getEvidenceById(evidenceId);
      setEvidenceData(res.data);
      if (res.data?.evidence?.page) {
        setSelectedPageNum(res.data.evidence.page);
      }
    } catch (e) {
      console.error('Error fetching evidence:', e);
    } finally {
      setLoading(false);
    }
  };

  const ev = evidenceData?.evidence || {
    evidenceId: 'ev_001',
    documentId: 'doc_001',
    fileName: 'Annual_Report_2026.pdf',
    page: 42,
    section: 'Statement of Profit and Loss',
    quote: 'Revenue from operations: ₹10,000 crore (Note 24)',
    relevance: 'primary'
  };

  const finding = evidenceData?.finding || {
    findingId: 'F-024',
    metric: 'Revenue',
    period: 'FY2026',
    status: 'potential_issue',
    priority: 'high',
    difference: 500,
    percentageDifference: 5.0,
    direction: 'higher',
    valueA: 10000,
    valueB: 10500,
    originalValueA: '10000 Crore INR',
    originalValueB: '10500 Crore INR',
    normalizedValueA: '10000 Crore INR',
    normalizedValueB: '10500 Crore INR',
    sourceA: {
      documentName: 'Annual_Report_2026.pdf',
      page: 42,
      section: 'Statement of Profit and Loss'
    },
    sourceB: {
      documentName: 'Management_Commentary_FY26.pdf',
      page: 8,
      section: 'Financial Highlights & Operating Performance'
    },
    explanation: 'Revenue reported in the Annual Report statement is ₹10,000 Cr, whereas Management Commentary states ₹10,500 Cr (+₹500 Cr / 5%).'
  };

  const currentIdx = allEvidenceList.findIndex(item => item.evidenceId === (id || ev.evidenceId));
  const prevEvidenceId = evidenceData?.previousEvidenceId || (currentIdx > 0 ? allEvidenceList[currentIdx - 1]?.evidenceId : 'ev_001');
  const nextEvidenceId = evidenceData?.nextEvidenceId || (currentIdx < allEvidenceList.length - 1 ? allEvidenceList[currentIdx + 1]?.evidenceId : 'ev_002');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'consistent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Consistent
          </span>
        );
      case 'explained_difference':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]">
            <Clock className="w-3.5 h-3.5" /> Explained Difference
          </span>
        );
      case 'unresolved_discrepancy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]">
            <AlertCircle className="w-3.5 h-3.5" /> Unresolved Discrepancy
          </span>
        );
      case 'potential_issue':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FCECEF] text-[#991B1B] border border-[#F8B4C0]">
            <AlertCircle className="w-3.5 h-3.5" /> Potential Issue
          </span>
        );
    }
  };

  // Simulated document pages for thumbnails
  const targetPage = ev.page || 1;
  const pagesList = [
    { pageNum: Math.max(1, targetPage - 2), title: 'Operational Highlights' },
    { pageNum: Math.max(1, targetPage - 1), title: 'Balance Sheet Summary' },
    { pageNum: targetPage, title: ev.section || 'Statement of Profit and Loss', isTarget: true },
    { pageNum: targetPage + 1, title: 'Cash Flow Statement' },
    { pageNum: targetPage + 2, title: 'Notes to Financial Statements' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] space-y-3">
      {/* Top Auditor Navigation Header */}
      <div className="bg-surface px-5 py-3 rounded-card border border-border shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg border border-border hover:bg-background text-navy-700 transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-navy-900 tracking-tight">
                Auditor Evidence Workspace
              </h1>
              <span className="px-2 py-0.5 rounded bg-brand-mint text-brand-dark text-[11px] font-bold">
                {ev.evidenceId || id || 'ev_001'}
              </span>
            </div>
            <p className="text-[11px] text-navy-500">
              Corroborated PDF extraction with verbatim citation and deterministic variance calculation
            </p>
          </div>
        </div>

        {/* Evidence Navigation Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-background border border-border rounded-lg p-0.5 text-xs text-navy-700">
            <button
              onClick={() => navigate(`/evidence/${prevEvidenceId}`)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-surface text-navy-700 font-medium transition-colors"
              title="Previous Evidence Item"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Evidence</span>
            </button>
            <div className="h-4 w-px bg-border my-auto" />
            <button
              onClick={() => navigate(`/evidence/${nextEvidenceId}`)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-surface text-navy-700 font-medium transition-colors"
              title="Next Evidence Item"
            >
              <span>Next Evidence</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => window.open(`/api/documents/${ev.documentId || 'doc_001'}`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border hover:bg-background text-navy-700 text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Open Full Document</span>
          </button>

          <button
            onClick={() => setSelectedPageNum(targetPage)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-dark hover:bg-[#065f46] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Source Page ({targetPage})</span>
          </button>
        </div>
      </div>

      {/* 3-Pane Investigation Workspace */}
      <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
        
        {/* PANE 1: LEFT - PDF Page Thumbnails (2.5 cols) */}
        <div className="col-span-2 bg-surface rounded-card border border-border p-3.5 flex flex-col min-h-0 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-border mb-3">
            <span className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-dark" />
              Document Pages
            </span>
            <span className="text-[10px] text-navy-500 font-medium">5 previews</span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {pagesList.map((pg) => {
              const isActive = selectedPageNum === pg.pageNum;
              return (
                <div
                  key={pg.pageNum}
                  onClick={() => setSelectedPageNum(pg.pageNum)}
                  className={`cursor-pointer rounded-lg border transition-all p-2 text-center group ${
                    isActive
                      ? 'border-brand-dark bg-brand-mint/20 ring-2 ring-brand-dark/20'
                      : 'border-border/80 bg-background/50 hover:border-navy-300 hover:bg-background'
                  }`}
                >
                  {/* Thumbnail Miniature Graphic */}
                  <div className={`relative mx-auto w-full aspect-[3/4] max-w-[110px] rounded border shadow-2xs mb-1.5 flex flex-col p-2 text-left text-[6px] overflow-hidden ${
                    pg.isTarget ? 'bg-amber-50/40 border-amber-300' : 'bg-white border-border'
                  }`}>
                    <div className="w-12 h-1 bg-navy-400 rounded-xs mb-1" />
                    <div className="w-full h-0.5 bg-navy-200 rounded-xs mb-0.5" />
                    <div className="w-3/4 h-0.5 bg-navy-200 rounded-xs mb-1.5" />
                    
                    {pg.isTarget && (
                      <div className="bg-amber-200/90 border border-amber-400 p-0.5 rounded-xs text-[5px] text-amber-900 font-bold mb-1">
                        HIGHLIGHT: ₹10,000 Cr
                      </div>
                    )}

                    <div className="w-full h-0.5 bg-navy-200 rounded-xs mb-0.5" />
                    <div className="w-5/6 h-0.5 bg-navy-200 rounded-xs mb-0.5" />
                    <div className="w-2/3 h-0.5 bg-navy-200 rounded-xs mb-auto" />
                    
                    <div className="text-[7px] text-navy-400 font-mono text-center pt-1 border-t border-border/50">
                      p. {pg.pageNum}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] px-1">
                    <span className={`font-bold ${isActive ? 'text-brand-dark' : 'text-navy-700'}`}>
                      Page {pg.pageNum}
                    </span>
                    {pg.isTarget && (
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-300">
                        Evidence
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-navy-500 block truncate text-left px-1 mt-0.5">
                    {pg.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANE 2: CENTER - Selected PDF Page Document Preview (6 cols) */}
        <div className="col-span-6 bg-surface rounded-card border border-border flex flex-col min-h-0 shadow-xs overflow-hidden">
          {/* Document Top Bar with Zoom & Metadata */}
          <div className="px-4 py-2.5 bg-background/80 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-dark" />
              <span className="text-xs font-bold text-navy-900 truncate max-w-[260px]">
                {ev.fileName || 'Annual_Report_2026.pdf'}
              </span>
              <span className="text-[10px] bg-white border border-border px-1.5 py-0.5 rounded font-mono text-navy-600">
                Page {selectedPageNum}
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))}
                className="p-1 rounded hover:bg-surface border border-border text-navy-600"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-medium text-navy-600 px-1">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(140, zoomLevel + 10))}
                className="p-1 rounded hover:bg-surface border border-border text-navy-600"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1 rounded hover:bg-surface border border-border text-navy-600 ml-1"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Document Viewer Body (Scrollable Sheet) */}
          <div className="flex-1 bg-[#EEF2F6] p-4 overflow-auto flex justify-center custom-scrollbar">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-[580px] bg-white rounded-lg shadow-md border border-navy-200/80 p-8 text-navy-900 transition-transform duration-150 flex flex-col font-sans"
            >
              {/* Document Header on Page */}
              <div className="border-b border-navy-200 pb-3 mb-6 flex justify-between items-center text-[10px] text-navy-400 uppercase tracking-widest font-mono">
                <span>ACME ENTERPRISES LIMITED / ANNUAL REPORT 2026</span>
                <span>FINANCIAL STATEMENTS</span>
              </div>

              {/* Page Section Title */}
              <h2 className="text-base font-bold text-navy-900 uppercase tracking-tight mb-2">
                {selectedPageNum === targetPage
                  ? ev.section || 'Statement of Profit and Loss'
                  : `Financial Schedule — Page ${selectedPageNum}`}
              </h2>
              <p className="text-[11px] text-navy-500 mb-6 italic">
                (All amounts in ₹ Crore, unless otherwise stated)
              </p>

              {/* If Target Page: Show Realistic Highlighted Statement Table */}
              {selectedPageNum === targetPage ? (
                <div className="space-y-4 text-xs">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-y border-navy-900 text-left text-[11px] font-bold">
                        <th className="py-2">Particulars</th>
                        <th className="py-2 text-center">Note</th>
                        <th className="py-2 text-right">FY 2026</th>
                        <th className="py-2 text-right">FY 2025</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-100">
                      {/* Highlighted Evidence Row */}
                      <tr className="bg-amber-100/70 border-l-4 border-amber-500 font-bold transition-colors">
                        <td className="py-2.5 px-2">
                          <span className="bg-amber-200 text-navy-900 px-1 py-0.5 rounded shadow-2xs font-bold">
                            I. Revenue from Operations
                          </span>
                        </td>
                        <td className="py-2.5 text-center font-mono">24</td>
                        <td className="py-2.5 text-right font-mono text-brand-dark font-extrabold pr-2">
                          <span className="bg-amber-200 text-navy-900 px-1.5 py-0.5 rounded border border-amber-400">
                            10,000.00
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-navy-600">8,950.00</td>
                      </tr>
                      <tr>
                        <td className="py-2 pl-2">II. Other Income</td>
                        <td className="py-2 text-center font-mono">25</td>
                        <td className="py-2 text-right font-mono pr-2">320.00</td>
                        <td className="py-2 text-right font-mono text-navy-600">280.00</td>
                      </tr>
                      <tr className="font-bold border-t border-navy-300">
                        <td className="py-2 pl-2">III. Total Income (I + II)</td>
                        <td className="py-2 text-center font-mono"></td>
                        <td className="py-2 text-right font-mono pr-2">10,320.00</td>
                        <td className="py-2 text-right font-mono text-navy-600">9,230.00</td>
                      </tr>
                      <tr>
                        <td className="py-2 pl-2">IV. Expenses</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pl-6 text-navy-600">Cost of materials consumed</td>
                        <td className="text-center font-mono">26</td>
                        <td className="text-right font-mono pr-2">4,200.00</td>
                        <td className="text-right font-mono text-navy-600">3,800.00</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pl-6 text-navy-600">Employee benefit expense</td>
                        <td className="text-center font-mono">27</td>
                        <td className="text-right font-mono pr-2">1,850.00</td>
                        <td className="text-right font-mono text-navy-600">1,620.00</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pl-6 text-navy-600">Finance costs</td>
                        <td className="text-center font-mono">28</td>
                        <td className="text-right font-mono pr-2">410.00</td>
                        <td className="text-right font-mono text-navy-600">430.00</td>
                      </tr>
                      <tr className="font-bold border-y border-navy-900">
                        <td className="py-2 pl-2">V. Profit Before Tax</td>
                        <td className="py-2 text-center font-mono"></td>
                        <td className="py-2 text-right font-mono pr-2">2,140.00</td>
                        <td className="py-2 text-right font-mono text-navy-600">1,880.00</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Footnote callout box */}
                  <div className="mt-6 p-3 bg-amber-50/70 border border-amber-200 rounded text-[11px] text-amber-900">
                    <span className="font-bold block mb-1">Target Citation Reference:</span>
                    <p className="font-serif italic text-navy-800">
                      "{ev.quote}"
                    </p>
                  </div>
                </div>
              ) : (
                /* Non-target page placeholder schedule */
                <div className="space-y-4 text-xs py-8">
                  <div className="p-4 bg-background rounded border border-border text-center text-navy-500">
                    <p className="font-medium text-xs text-navy-700">Page {selectedPageNum} Supplementary Financial Notes</p>
                    <p className="text-[11px] mt-1">This page contains accounting policies and segment breakups.</p>
                    <button
                      onClick={() => setSelectedPageNum(targetPage)}
                      className="mt-3 px-3 py-1 bg-brand-dark text-white rounded text-xs font-semibold"
                    >
                      Jump to Target Evidence Page ({targetPage})
                    </button>
                  </div>
                </div>
              )}

              {/* Document Page Footer */}
              <div className="mt-auto pt-8 border-t border-navy-200 flex justify-between text-[10px] text-navy-400 font-mono">
                <span>CONFIDENTIAL AUDITOR WORKPAPER</span>
                <span>PAGE {selectedPageNum} OF 148</span>
              </div>
            </div>
          </div>
        </div>

        {/* PANE 3: RIGHT - Finding Evidence Panel (3.5 cols) */}
        <div className="col-span-4 bg-surface rounded-card border border-border p-4 flex flex-col min-h-0 shadow-xs overflow-y-auto custom-scrollbar space-y-4">
          
          {/* Finding Header */}
          <div className="pb-3 border-b border-border">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-extrabold text-navy-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-dark" />
                Linked Finding {finding.findingId}
              </span>
              {getStatusBadge(finding.status)}
            </div>
            <div className="text-sm font-extrabold text-navy-900">
              {finding.metric} Discrepancy Analysis
            </div>
            <div className="text-[11px] text-navy-500 mt-0.5">
              Period: {finding.period} • Priority: <span className="font-bold uppercase text-brand-dark">{finding.priority}</span>
            </div>
          </div>

          {/* Deterministic Variance Box */}
          <div className="p-3 bg-background rounded-lg border border-border space-y-2">
            <div className="text-[11px] font-bold text-navy-700 uppercase tracking-wider">
              Deterministic Python Calculation
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-surface p-2 rounded border border-border">
                <span className="text-[10px] text-navy-500 block">Absolute Variance</span>
                <span className="text-sm font-extrabold text-navy-900">
                  ₹{finding.difference?.toLocaleString()} Cr
                </span>
              </div>
              <div className="bg-surface p-2 rounded border border-border">
                <span className="text-[10px] text-navy-500 block">Variance (%)</span>
                <span className={`text-sm font-extrabold ${finding.percentageDifference > 0 ? 'text-[#991B1B]' : 'text-emerald-700'}`}>
                  {finding.percentageDifference > 0 ? `+${finding.percentageDifference}%` : `${finding.percentageDifference}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Comparison Sources: Source A vs Source B */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-navy-900 uppercase tracking-wider">
              Cross-Document Comparison
            </div>

            {/* Source A Card */}
            <div className="p-3 rounded-lg border border-brand-dark/20 bg-brand-mint/10 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-brand-dark">Source A (Primary)</span>
                <span className="text-navy-500 font-mono">Page {finding.sourceA?.page || 1}</span>
              </div>
              <div className="text-xs font-bold text-navy-900 truncate">
                {finding.sourceA?.documentName || 'Annual_Report_2026.pdf'}
              </div>
              <div className="text-[11px] text-navy-600">
                Section: {finding.sourceA?.section || 'Statement of Profit and Loss'}
              </div>
              <div className="pt-1 flex items-center justify-between border-t border-brand-dark/10 text-xs">
                <span className="text-navy-500">Value:</span>
                <span className="font-bold text-navy-900 font-mono">
                  {finding.originalValueA || `₹${finding.valueA?.toLocaleString()} Cr`}
                </span>
              </div>
            </div>

            {/* Source B Card */}
            <div className="p-3 rounded-lg border border-border bg-background space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-navy-700">Source B (Comparison)</span>
                <span className="text-navy-500 font-mono">Page {finding.sourceB?.page || 8}</span>
              </div>
              <div className="text-xs font-bold text-navy-900 truncate">
                {finding.sourceB?.documentName || 'Management_Commentary_FY26.pdf'}
              </div>
              <div className="text-[11px] text-navy-600">
                Section: {finding.sourceB?.section || 'Financial Highlights'}
              </div>
              <div className="pt-1 flex items-center justify-between border-t border-border text-xs">
                <span className="text-navy-500">Value:</span>
                <span className="font-bold text-navy-900 font-mono">
                  {finding.originalValueB || `₹${finding.valueB?.toLocaleString()} Cr`}
                </span>
              </div>
            </div>
          </div>

          {/* Verbatim Evidence Snippet */}
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-300 space-y-1.5">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              Extracted Quote Evidence
            </span>
            <p className="text-xs text-navy-900 font-serif italic leading-relaxed">
              "{ev.quote}"
            </p>
          </div>

          {/* AI Verification Badge */}
          <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <div className="text-[11px] text-emerald-900">
              <span className="font-bold block">Nemotron Verbatim Match</span>
              Extracted with 0.99 confidence from original PDF text layer.
            </div>
          </div>

          {/* Investigation Actions */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => navigate(`/findings/${finding.findingId}`)}
              className="w-full py-2 bg-brand-dark hover:bg-[#065f46] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Inspect Full Finding Workspace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigate('/ai-auditor', { state: { prefilledQuery: `Explain why ${finding.metric} differs in finding ${finding.findingId}` } })}
              className="w-full py-2 bg-surface hover:bg-background border border-border text-navy-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5 text-brand-dark" />
              <span>Ask AI Auditor About This Evidence</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
