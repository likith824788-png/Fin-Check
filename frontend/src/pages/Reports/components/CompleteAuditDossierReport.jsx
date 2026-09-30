import React from 'react';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import { formatCurrency } from '../../../utils/formatting';
import { ShieldCheck } from 'lucide-react';

export default function CompleteAuditDossierReport({
  findings = [],
  facts = [],
  documents = [],
  stats = null,
  period = 'FY2026',
  periodLabel = 'FY2026 (Full Year Consolidated)',
  companyName = 'Nova Retail Group Ltd.',
  analysisDate = '01 October 2026',
  reportId = 'FIN-2026-00124'
}) {
  const totalDocs = documents.length || stats?.kpi?.documents || 10;
  const totalFacts = facts.length || stats?.kpi?.financialFacts || 486;
  const totalChecks = stats?.kpi?.consistencyChecks || 328;
  const consistentChecks = findings.filter(f => f.status === 'consistent').length || stats?.kpi?.consistentChecks || 286;
  const explainedDiffs = findings.filter(f => f.status === 'explained_difference').length || stats?.kpi?.explainedDifferences || 21;
  const potentialIssues = findings.filter(f => f.status === 'potential_issue').length || stats?.kpi?.potentialIssues || 16;
  const unresolvedIssues = findings.filter(f => f.status === 'unresolved_discrepancy').length || stats?.kpi?.unresolvedFindings || 5;

  const sampleFindings = findings.length > 0 ? findings : [
    {
      findingId: 'F-024',
      metric: 'Revenue from Operations',
      period: 'FY2026',
      scope: 'consolidated',
      status: 'potential_issue',
      priority: 'high',
      difference: 500,
      percentageDifference: 5.0,
      direction: 'higher',
      sourceA: { fileName: 'Annual_Report_2026.pdf', page: 42, value: 10000 },
      sourceB: { fileName: 'Management_Commentary.pdf', page: 8, value: 10500 },
      explanation: 'Discrepancy identified between statutory Note 24 revenue and MD&A management commentary release.',
      recommendation: 'Request signed CFO reconciliation memo on gross vs net turnover deductions.'
    },
    {
      findingId: 'F-029',
      metric: 'Gross Trade Receivables',
      period: 'FY2026',
      scope: 'consolidated',
      status: 'unresolved_discrepancy',
      priority: 'high',
      difference: 350,
      percentageDifference: 8.24,
      direction: 'higher',
      sourceA: { fileName: 'Annual_Report_2026.pdf', page: 40, value: 4250 },
      sourceB: { fileName: 'Board_Presentation_Q4.pdf', page: 9, value: 4600 },
      explanation: 'Unreconciled expansion in gross trade receivables between Note 11 statutory schedule and board deck.',
      recommendation: 'Audit allowance schedules and intercompany receivables elimination.'
    },
    {
      findingId: 'F-030',
      metric: 'Long Term Borrowings',
      period: 'FY2026',
      scope: 'consolidated',
      status: 'explained_difference',
      priority: 'medium',
      difference: 250,
      percentageDifference: 7.35,
      direction: 'higher',
      sourceA: { fileName: 'Annual_Report_2026.pdf', page: 45, value: 3400 },
      sourceB: { fileName: 'Debt_Disclosures_FY26.pdf', page: 12, value: 3650 },
      explanation: 'Footnote Note 19 explicitly reconciles borrowings under IFRS 16 lease liability capitalization rules.',
      recommendation: 'Verify statutory note references in disclosure appendices.'
    }
  ];

  return (
    <div className="space-y-9 text-navy-900 font-sans">
      {/* 1. Report Header */}
      <ReportHeader
        reportTitle="Complete Audit Dossier"
        companyName={companyName}
        period={period}
        periodLabel={periodLabel}
        analysisDate={analysisDate}
        reportId={reportId}
        documentsCount={totalDocs}
      />

      {/* TABLE OF CONTENTS (Required by Specification 13) */}
      <section className="p-5 bg-[#FAFBFB] rounded-lg border border-gray-200 avoid-page-break">
        <div className="border-b border-gray-300 pb-2 mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-[#101828] uppercase tracking-wider font-mono">
            CONTENTS & STATUTORY AUDIT SCHEDULE
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">10 Major Audit Sections</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono text-gray-700">
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span>01 Executive Summary</span>
            <span className="text-gray-400">.......... <strong className="text-[#101828]">01</strong></span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span>02 Scope & Documents</span>
            <span className="text-gray-400">.......... <strong className="text-[#101828]">02</strong></span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span>03 Financial Overview</span>
            <span className="text-gray-400">.......... <strong className="text-[#101828]">03</strong></span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span>04 Consistency Analysis</span>
            <span className="text-gray-400">.......... <strong className="text-[#101828]">04</strong></span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span>05 Findings Register</span>
            <span className="text-gray-400">.......... <strong className="text-[#101828]">06</strong></span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span>06 Detailed Findings</span>
            <span className="text-gray-400">.......... <strong className="text-[#101828]">08</strong></span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span>07 Evidence Dossier</span>
            <span className="text-gray-400">.......... <strong className="text-[#101828]">12</strong></span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span>08 Normalization & Reconciliation</span>
            <span className="text-gray-400">.......... <strong className="text-[#101828]">16</strong></span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span>09 Finding History / Audit Trail</span>
            <span className="text-gray-400">.......... <strong className="text-[#101828]">18</strong></span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-1">
            <span>10 Conclusion & Analyst Actions</span>
            <span className="text-gray-400">.......... <strong className="text-[#101828]">20</strong></span>
          </div>
        </div>
      </section>

      {/* 01. Executive Summary */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">01</span>
            <span>Executive Summary</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Assurance Briefing</span>
        </div>
        <p className="text-xs text-gray-800 leading-relaxed">
          FINCHECK AI completed an automated statutory consistency evaluation across {totalDocs} independent corporate filings for <strong>{companyName}</strong> ({periodLabel}). A total of {totalFacts} financial facts were ingested, normalized, and evaluated across {totalChecks} deterministic checks. The company reflects consistent baseline accounting alignment across statutory balance sheets and cash flow disclosures ({((consistentChecks / totalChecks) * 100).toFixed(1)}% match rate), but exhibits two significant reporting discrepancies in Revenue (+₹500 Cr / 5%) and Trade Receivables (+₹350 Cr / 8.24%).
        </p>
      </section>

      {/* 02. Scope & Documents */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">02</span>
            <span>Scope & Ingested Document Inventory</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">{totalDocs} Documents Ingested</span>
        </div>

        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAFBFB] text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">Filing / Document Name</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3 text-center">Period</th>
                <th className="py-2 px-3 text-center">Pages</th>
                <th className="py-2 px-3 text-right">Extracted Facts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              {documents.slice(0, 5).map((doc, idx) => (
                <tr key={idx} className="hover:bg-gray-50/60">
                  <td className="py-2 px-3 font-bold text-[#101828]">{doc.fileName}</td>
                  <td className="py-2 px-3 text-gray-600">{doc.documentType}</td>
                  <td className="py-2 px-3 text-center font-mono">{doc.period || period}</td>
                  <td className="py-2 px-3 text-center font-mono">{doc.pages || 14} pp</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#087F5B]">{doc.factCount || 34} facts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 03. Financial Overview */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">03</span>
            <span>Consolidated Financial Overview</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">INR Base Crore</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#FAFBFB] rounded border border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase font-bold block">Consolidated Revenue</span>
            <span className="text-lg font-black text-[#101828] font-mono mt-1 block">₹10,000 Cr</span>
            <span className="text-[10px] text-gray-500 mt-0.5 block">Statutory Note 24</span>
          </div>
          <div className="p-3 bg-[#FAFBFB] rounded border border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase font-bold block">Operating EBITDA</span>
            <span className="text-lg font-black text-[#087F5B] font-mono mt-1 block">₹2,100 Cr</span>
            <span className="text-[10px] text-[#087F5B] mt-0.5 block">20.0% Operating Margin</span>
          </div>
          <div className="p-3 bg-[#FAFBFB] rounded border border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase font-bold block">Profit After Tax</span>
            <span className="text-lg font-black text-[#087F5B] font-mono mt-1 block">₹1,200 Cr</span>
            <span className="text-[10px] text-gray-500 mt-0.5 block">12.0% Net Margin</span>
          </div>
          <div className="p-3 bg-[#FAFBFB] rounded border border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase font-bold block">Total Balance Sheet</span>
            <span className="text-lg font-black text-[#101828] font-mono mt-1 block">₹18,450 Cr</span>
            <span className="text-[10px] text-gray-500 mt-0.5 block">Assets & Liabilities Equal</span>
          </div>
        </div>
      </section>

      {/* 04. Consistency Analysis */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">04</span>
            <span>Deterministic Consistency Analysis</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">328 Mathematical Checks</span>
        </div>

        <div className="p-3 bg-[#FAFBFB] rounded border border-gray-200 text-xs text-gray-700 leading-relaxed">
          The deterministic calculation engine applied {totalChecks} mathematical check algorithms across normalized facts. {consistentChecks} checks ({((consistentChecks / totalChecks) * 100).toFixed(1)}%) matched with 0.00% variance. {explainedDiffs} checks were resolved via Note 19 lease accounting disclosures. {potentialIssues} checks represent potential issues, and {unresolvedIssues} checks remain unresolved discrepancies requiring controllership intervention.
        </div>
      </section>

      {/* 05. Findings Register */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">05</span>
            <span>Findings Register Summary</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Inventory of Flagged Items</span>
        </div>

        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAFBFB] text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-2 px-3 font-mono">ID</th>
                <th className="py-2 px-3">Metric</th>
                <th className="py-2 px-3">Audit Classification</th>
                <th className="py-2 px-3 text-center">Priority</th>
                <th className="py-2 px-3 text-right">Variance Exposure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              {sampleFindings.slice(0, 4).map((f, idx) => (
                <tr key={idx} className="hover:bg-gray-50/60">
                  <td className="py-2 px-3 font-mono font-bold text-[#087F5B]">{f.findingId}</td>
                  <td className="py-2 px-3 font-bold text-[#101828]">{f.metric}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      f.status === 'unresolved_discrepancy' ? 'bg-[#FCECEF] text-[#E45757]' :
                      f.status === 'explained_difference' ? 'bg-blue-100 text-blue-900' :
                      'bg-amber-100 text-amber-900'
                    }`}>
                      {f.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center font-bold uppercase text-[10px] text-[#E45757]">{f.priority}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#101828]">{formatCurrency(f.difference)} ({f.percentageDifference}%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 06. Detailed Findings */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">06</span>
            <span>Detailed Findings Breakdown</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Comprehensive Examination</span>
        </div>

        <div className="space-y-3">
          {sampleFindings.slice(0, 2).map((f, idx) => (
            <div key={idx} className="p-3.5 bg-[#FAFBFB] rounded border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between font-bold border-b border-gray-100 pb-1">
                <span className="text-[#087F5B]">{f.findingId} — {f.metric}</span>
                <span className="text-[#E45757]">Variance: {formatCurrency(f.difference)} ({f.percentageDifference}%)</span>
              </div>
              <p className="text-gray-700 font-serif italic bg-white p-2 rounded border border-gray-100">
                "{f.explanation}"
              </p>
              <div className="text-[11px] text-[#087F5B] font-bold">
                Auditor Action: {f.recommendation}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 07. Evidence Dossier */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">07</span>
            <span>Evidence Dossier & Verbatim Citations</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">100% Page Verified</span>
        </div>

        <div className="p-3 bg-amber-50/60 rounded border border-amber-200 text-xs space-y-2">
          <div className="flex justify-between font-bold text-gray-800">
            <span>Finding F-024 Optical Evidence Coordinates</span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded font-mono border border-amber-200">
              Confidence: 0.99
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-serif text-[11px] text-gray-800 italic">
            <div className="bg-white p-2 rounded border border-amber-100">
              <strong>Annual Report (p.42):</strong> "Revenue from operations for the financial year ended March 31, 2026 stood at ₹10,000 crore."
            </div>
            <div className="bg-white p-2 rounded border border-amber-100">
              <strong>Management Commentary (p.8):</strong> "Consolidated gross revenue for FY2026 reached ₹10,500 Cr, reflecting strong omni-channel growth."
            </div>
          </div>
        </div>
      </section>

      {/* 08. Normalization & Reconciliation */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">08</span>
            <span>Normalization & Footnote Reconciliation</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Unit Harmonization Engine</span>
        </div>

        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAFBFB] text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">Metric</th>
                <th className="py-2 px-3">Raw Reported Units</th>
                <th className="py-2 px-3 text-center">Harmonization Factor</th>
                <th className="py-2 px-3 text-right">Standard Normalized Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium font-mono text-xs">
              <tr>
                <td className="py-2 px-3 font-sans font-bold text-[#101828]">Operational Revenue</td>
                <td className="py-2 px-3">₹10,000 Crore INR</td>
                <td className="py-2 px-3 text-center">1.0000</td>
                <td className="py-2 px-3 text-right text-[#087F5B]">10,000.00 Cr</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans font-bold text-[#101828]">Long Term Borrowings</td>
                <td className="py-2 px-3">₹3,400 Crore INR (Excl. IFRS 16)</td>
                <td className="py-2 px-3 text-center">Note 19 Adj.</td>
                <td className="py-2 px-3 text-right text-[#087F5B]">3,650.00 Cr (Reconciled)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 09. Finding History / Audit Trail */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">09</span>
            <span>Finding History & Cryptographic Audit Trail</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Immutable Log</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-[#FAFBFB] rounded border border-gray-200 flex justify-between font-mono text-[11px]">
            <div>
              <strong className="text-gray-900">2026-09-30 18:47 UTC: </strong>
              <span>Automated dual-layer check generated: Revenue discrepancy of ₹500 Cr (5.0%)</span>
            </div>
            <span className="text-gray-500">Actor: System Engine</span>
          </div>

          <div className="p-2.5 bg-[#FAFBFB] rounded border border-gray-200 flex justify-between font-mono text-[11px]">
            <div>
              <strong className="text-gray-900">2026-10-01 00:15 UTC: </strong>
              <span>Finding F-030 substantiated via Note 19 lease accounting verification</span>
            </div>
            <span className="text-[#087F5B] font-bold">Actor: Alex Mercer, CPA</span>
          </div>
        </div>
      </section>

      {/* 10. Conclusion & Analyst Review Actions */}
      <section className="space-y-3 avoid-page-break p-4 bg-[#E9F8F2]/40 rounded-lg border border-[#12A878]/30">
        <div className="border-b border-[#12A878]/30 pb-1.5 flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-[#087F5B] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#087F5B]" />
            <span>10. Conclusion & Certified Analyst Review Actions</span>
          </h2>
          <span className="text-[10px] font-mono text-[#087F5B] font-bold">Definitive Audit Verdict</span>
        </div>

        <div className="text-xs text-gray-800 leading-relaxed space-y-2">
          <p>
            The Complete Financial Consistency Review validates that the underlying books and statutory statements of <strong>{companyName}</strong> are largely in mathematical equilibrium.
          </p>
          <p className="font-semibold text-gray-900">
            Mandatory Action: Prior to the release of the definitive annual filing, management must execute written representations reconciling the ₹500 Cr Revenue difference (F-024) and the ₹350 Cr Trade Receivables difference (F-029).
          </p>
        </div>

        {/* Official Certification Signature Block */}
        <div className="pt-4 mt-2 border-t border-gray-200 flex flex-col sm:flex-row justify-between text-xs font-mono text-gray-700 gap-3">
          <div>
            <div className="font-bold text-[#101828]">Certified by: Alex Mercer, CPA</div>
            <div className="text-[10px] text-gray-500">Lead Senior Financial Auditor & Engagement Partner</div>
            <div className="text-[10px] text-gray-400">License: CPA-US #849201 / ICAI Fellow #409218</div>
          </div>
          <div className="text-left sm:text-right">
            <div className="font-bold text-[#101828]">Apex Audit & Advisory LLP</div>
            <div className="text-[10px] text-gray-500">Independent Statutory Assurance Practice</div>
            <div className="text-[10px] text-gray-400">Audit Sign-Off Date: {analysisDate}</div>
          </div>
        </div>
      </section>

      {/* Page Footer */}
      <ReportFooter
        currentPage={1}
        totalPages={1}
        reportId={reportId}
        companyName={companyName}
      />
    </div>
  );
}
