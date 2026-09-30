import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ReportHeader({
  reportTitle = 'Financial Consistency Report',
  companyName = 'Nova Retail Group Ltd.',
  periodLabel = 'FY2026 — Full Year Consolidated',
  analysisDate = '01 October 2026',
  reportId = 'FIN-2026-00124',
  documentsCount = 10,
  leadAuditor = 'Alex Mercer, CPA',
  firmName = 'Apex Audit & Advisory LLP'
}) {
  return (
    <header className="report-header pb-6 mb-6 border-b-2 border-[#087F5B] text-navy-900">
      {/* Top Banner / Letterhead Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-gray-200 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#087F5B] text-white flex items-center justify-center font-black text-sm tracking-wider shadow-xs">
            FC
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-[#101828] flex items-center gap-1.5 font-mono">
              <span>FINCHECK AI</span>
              <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded bg-[#E9F8F2] text-[#087F5B] uppercase tracking-wider border border-[#12A878]/30">
                Audited & Grounded
              </span>
            </div>
            <div className="text-[10px] text-gray-500 font-medium tracking-wide">
              Automated Statutory Financial Consistency & Discrepancy Intelligence
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right text-[11px] text-gray-600 font-mono">
          <div className="font-bold text-[#101828]">{firmName}</div>
          <div className="text-gray-500 text-[10px]">Independent Statutory Assurance Practice</div>
        </div>
      </div>

      {/* Main Report Title Banner */}
      <div className="mb-4">
        <div className="text-[11px] font-bold text-[#087F5B] uppercase tracking-widest mb-1 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#12A878]" />
          <span>FINANCIAL STATEMENT CONSISTENCY REVIEW</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#101828] tracking-tight font-serif">
          {reportTitle}
        </h1>
      </div>

      {/* Official Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#FAFBFB] rounded-lg border border-gray-200 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Report</span>
          <span className="font-bold text-[#101828] block truncate mt-0.5">{reportTitle}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Company</span>
          <span className="font-bold text-[#101828] block truncate mt-0.5">{companyName}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Reporting Period</span>
          <span className="font-bold text-[#101828] block truncate mt-0.5">{periodLabel}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Analysis Date</span>
          <span className="font-semibold text-gray-800 block mt-0.5">{analysisDate}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Report ID</span>
          <span className="font-mono font-bold text-[#087F5B] block mt-0.5">{reportId}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Documents Analyzed</span>
          <span className="font-bold text-gray-800 block mt-0.5">{documentsCount} Filings & Statements</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Engagement Partner</span>
          <span className="font-semibold text-gray-800 block truncate mt-0.5">{leadAuditor}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Engine Verification</span>
          <span className="text-[10px] font-semibold text-[#087F5B] block truncate mt-0.5">
            Deterministic Math + Gemma
          </span>
        </div>
      </div>
    </header>
  );
}
