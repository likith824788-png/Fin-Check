import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  BarChart3,
  Table,
  AlertTriangle,
  FileCheck,
  BookOpen,
  Download,
  Printer,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import { exportReportToPdf } from '../../utils/pdfExport';
import ExecutiveSummaryReport from './components/ExecutiveSummaryReport';
import ConsistencyReport from './components/ConsistencyReport';
import FindingsRegisterReport from './components/FindingsRegisterReport';
import EvidenceDossierReport from './components/EvidenceDossierReport';
import CompleteAuditDossierReport from './components/CompleteAuditDossierReport';

export default function Reports() {
  const { id } = useParams();

  const reportTypes = [
    {
      id: 'executive_summary',
      title: 'Executive Summary',
      shortTitle: 'Executive Summary',
      icon: BarChart3,
      desc: 'High-level financial health, top discrepancies, and audit committee-level overview.'
    },
    {
      id: 'financial_consistency',
      title: 'Consistency Report',
      shortTitle: 'Consistency Report',
      icon: Table,
      desc: 'Cross-statement consistency evaluation and deterministic variance analysis.'
    },
    {
      id: 'findings_report',
      title: 'Findings Register',
      shortTitle: 'Findings Register',
      icon: AlertTriangle,
      desc: 'Comprehensive inventory of potential issues, unresolved discrepancies, and review items.'
    },
    {
      id: 'evidence_report',
      title: 'Evidence Dossier',
      shortTitle: 'Evidence Dossier',
      icon: FileCheck,
      desc: 'Corroborated evidence, page coordinates, source documents, and supporting references.'
    },
    {
      id: 'complete_review',
      title: 'Complete Audit Dossier',
      shortTitle: 'Complete Audit Dossier',
      icon: BookOpen,
      desc: 'Complete end-to-end financial consistency review containing all major sections.'
    },
  ];

  // Resolve initial report type
  const initialType = reportTypes.some(t => t.id === id) ? id : 'executive_summary';
  const [reportType, setReportType] = useState(initialType);
  const [period, setPeriod] = useState('FY2026');
  const [periodLabel, setPeriodLabel] = useState('FY2026 — Full Year Consolidated');
  
  // Real data state
  const [findings, setFindings] = useState([]);
  const [facts, setFacts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI state
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const reportContainerRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [findingsRes, factsRes, docsRes, statsRes] = await Promise.all([
        api.getFindings().catch(() => ({ data: [] })),
        api.getFacts().catch(() => ({ data: [] })),
        api.getDocuments().catch(() => ({ data: [] })),
        api.getDashboardStats().catch(() => ({ data: null }))
      ]);

      setFindings(findingsRes.data || []);
      setFacts(factsRes.data || []);
      setDocuments(docsRes.data || []);
      setStats(statsRes.data || null);
    } catch (e) {
      console.warn('Reports data loading error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentTypeObj = reportTypes.find(t => t.id === reportType) || reportTypes[0];

  const handlePeriodChange = (e) => {
    const val = e.target.value;
    setPeriod(val);
    if (val === 'FY2026') setPeriodLabel('FY2026 — Full Year Consolidated');
    else if (val === 'Q4 2026') setPeriodLabel('Q4 2026 — Quarterly Close');
    else if (val === 'FY2025') setPeriodLabel('FY2025 — Comparative Audit');
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    await loadData();
    setTimeout(() => {
      setRegenerating(false);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      setGeneratingPdf(true);
      const cleanReportTitle = currentTypeObj.shortTitle.replace(/\s+/g, '_');
      const cleanPeriod = period.replace(/\s+/g, '_');
      const filename = `FINCHECK_AI_${cleanReportTitle}_${cleanPeriod}.pdf`;

      await exportReportToPdf('fincheck-report-document', filename);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      // Fallback: trigger print dialog if direct canvas export fails
      window.print();
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Static metadata per prompt requirements
  const companyName = 'Nova Retail Group Ltd.';
  const analysisDate = '01 October 2026';
  const reportId = 'FIN-2026-00124';

  // Common props for child report templates
  const reportProps = {
    findings,
    facts,
    documents,
    stats,
    period,
    periodLabel,
    companyName,
    analysisDate,
    reportId
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* ========================================================
          1. TOP BAR: TITLE & GLOBAL ACTION SHORTCUTS (No-Print)
      ======================================================== */}
      <div id="report-top-header" className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#087F5B] animate-pulse" />
            <h1 className="text-2xl font-black text-navy-900 tracking-tight">
              Financial Consistency Reports & Assurance Dossiers
            </h1>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            Generate, preview, and download formal deterministic financial consistency audit reports grounded in multi-document optical extractions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="px-3.5 py-1.5 bg-surface hover:bg-background text-navy-700 text-xs font-semibold rounded-lg border border-border flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
            title="Refresh analysis data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin text-[#087F5B]' : ''}`} />
            <span>{regenerating ? 'Updating...' : 'Regenerate'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-surface hover:bg-background text-navy-700 text-xs font-semibold rounded-lg border border-border flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Print report document"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            className="px-4 py-1.5 bg-[#087F5B] hover:bg-[#066347] text-white text-xs font-bold rounded-lg shadow-subtle flex items-center gap-1.5 transition-all disabled:opacity-50 active:scale-95"
            title="Export clean PDF file of only this report"
          >
            <Download className={`w-3.5 h-3.5 ${generatingPdf ? 'animate-bounce' : ''}`} />
            <span>{generatingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          1. REPORT SELECTOR (Specification 1) - No-Print
      ======================================================== */}
      <div id="report-selector-container" className="no-print bg-surface p-5 rounded-card border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <span className="text-[10px] text-navy-500 font-bold uppercase tracking-wider block">
              Step 1: Select Report Format
            </span>
            <h2 className="text-sm font-extrabold text-navy-900 mt-0.5">
              5 Statutory Audit Reporting Types
            </h2>
          </div>

          {/* Reporting Period Selector (Specification 1) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-navy-600">Reporting Period:</span>
            <select
              value={period}
              onChange={handlePeriodChange}
              className="px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none font-bold text-navy-900 focus:ring-1 focus:ring-[#087F5B]"
            >
              <option value="FY2026">FY2026 (Full Year Consolidated)</option>
              <option value="Q4 2026">Q4 2026 (Quarterly Close)</option>
              <option value="FY2025">FY2025 (Comparative Audit)</option>
            </select>
          </div>
        </div>

        {/* 5 Report Type Cards (Specification 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {reportTypes.map((t) => {
            const Icon = t.icon;
            const isSelected = reportType === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setReportType(t.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#087F5B] bg-[#E9F8F2]/40 ring-2 ring-[#087F5B] shadow-2xs'
                    : 'border-border bg-background hover:bg-gray-50/80 hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#087F5B] text-white shadow-xs' : 'bg-surface text-navy-600 border border-border'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <h3 className={`text-xs font-extrabold block leading-tight ${isSelected ? 'text-[#087F5B]' : 'text-navy-900'}`}>
                    {t.shortTitle}
                  </h3>
                  <p className="text-[10px] text-navy-500 mt-1 leading-snug line-clamp-2">
                    {t.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          14. REPORT PREVIEW CONTROLS (Specification 14) - No-Print
      ======================================================== */}
      <div id="report-controls-bar" className="no-print bg-[#FAFBFB] p-3 rounded-lg border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">
            Active Report Preview:
          </span>
          <span className="px-2.5 py-0.5 rounded bg-white border border-gray-200 text-xs font-black text-navy-900">
            {currentTypeObj.title}
          </span>
          <span className="text-[11px] text-gray-500 hidden sm:inline">
            • {periodLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="px-3 py-1.5 bg-white hover:bg-gray-50 text-navy-700 text-xs font-semibold rounded-lg border border-border flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin text-[#087F5B]' : ''}`} />
            <span>Regenerate</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-white hover:bg-gray-50 text-navy-700 text-xs font-semibold rounded-lg border border-border flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            className="px-4 py-1.5 bg-[#087F5B] hover:bg-[#066347] text-white text-xs font-bold rounded-lg shadow-subtle flex items-center gap-1.5 transition-all"
          >
            <Download className={`w-3.5 h-3.5 ${generatingPdf ? 'animate-spin' : ''}`} />
            <span>{generatingPdf ? 'Exporting...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="no-print p-3 bg-[#E9F8F2] border border-[#12A878] rounded-lg text-xs text-[#087F5B] font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#087F5B]" />
          <span>
            Report PDF exported successfully: FINCHECK_AI_{currentTypeObj.shortTitle.replace(/\s+/g, '_')}_{period.replace(/\s+/g, '_')}.pdf
          </span>
        </div>
      )}

      {/* ========================================================
          2. REPORT PREVIEW (Specification 2, 9, 15)
          Rendered inside container with ID 'fincheck-report-document'
          This DOM element alone is exported to PDF and printed!
      ======================================================== */}
      {loading ? (
        <div className="bg-surface rounded-card border border-border p-16 text-center space-y-3 shadow-card">
          <div className="w-8 h-8 rounded-full border-2 border-[#087F5B] border-t-transparent animate-spin mx-auto" />
          <div className="text-xs font-bold text-navy-900">Loading statutory audit facts & findings...</div>
          <div className="text-[11px] text-gray-500">Preparing deterministic consistency review schedule</div>
        </div>
      ) : (
        <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
          {/* Document Scroll Viewport */}
          <div className="max-h-[920px] overflow-y-auto p-6 sm:p-10 lg:p-12 bg-white print:p-0 print:max-h-none print:overflow-visible">
            
            <div
              id="fincheck-report-document"
              ref={reportContainerRef}
              className="bg-white max-w-4xl mx-auto shadow-none print:shadow-none print:max-w-full text-navy-900 font-sans"
            >
              {/* Conditional Rendering of the 5 Report Formats */}
              {reportType === 'executive_summary' && (
                <ExecutiveSummaryReport {...reportProps} />
              )}

              {reportType === 'financial_consistency' && (
                <ConsistencyReport {...reportProps} />
              )}

              {reportType === 'findings_report' && (
                <FindingsRegisterReport {...reportProps} />
              )}

              {reportType === 'evidence_report' && (
                <EvidenceDossierReport {...reportProps} />
              )}

              {reportType === 'complete_review' && (
                <CompleteAuditDossierReport {...reportProps} />
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
