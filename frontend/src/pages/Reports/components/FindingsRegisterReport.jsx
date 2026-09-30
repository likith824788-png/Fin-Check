import React from 'react';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import { formatCurrency } from '../../../utils/formatting';

export default function FindingsRegisterReport({
  findings = [],
  _facts = [],
  documents = [],
  _stats = null,
  period = 'FY2026',
  periodLabel = 'FY2026 (Full Year Consolidated)',
  companyName = 'Nova Retail Group Ltd.',
  analysisDate = '01 October 2026',
  reportId = 'FIN-2026-00124'
}) {
  const allFindings = findings.length > 0 ? findings : [
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
      explanation: 'Discrepancy between statutory Note 24 and MD&A gross commentary.',
      recommendation: 'Request management reconciliation on gross revenue deductions.'
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
      explanation: 'Gross trade receivables differ between Note 11 statutory schedule and Board Presentation.',
      recommendation: 'Audit customer provision write-backs and intercompany eliminations.'
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
      explanation: 'Substantiated in Note 19 under IFRS 16 lease liability capitalization.',
      recommendation: 'Confirm footnote alignment in statutory disclosure appendices.'
    }
  ];

  const highPriority = allFindings.filter(f => f.priority === 'high' || f.status === 'unresolved_discrepancy');
  const unresolved = allFindings.filter(f => f.status === 'unresolved_discrepancy');
  const explained = allFindings.filter(f => f.status === 'explained_difference');
  const potential = allFindings.filter(f => f.status === 'potential_issue');

  return (
    <div className="space-y-8 text-navy-900 font-sans">
      {/* 1. Report Header */}
      <ReportHeader
        reportTitle="Findings Register"
        companyName={companyName}
        period={period}
        periodLabel={periodLabel}
        analysisDate={analysisDate}
        reportId={reportId}
        documentsCount={documents.length || 10}
      />

      {/* 2. Findings Overview */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">01</span>
            <span>Findings Overview & Audit Classification Standards</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Deterministic Ingestion</span>
        </div>

        <p className="text-xs text-gray-800 leading-relaxed">
          The Findings Register provides a comprehensive inventory of all financial statement variance items, reporting divergences, and disclosure inconsistencies detected across the financial filings of <strong>{companyName}</strong>. Each item is classified by priority (High, Medium, Low) and audit status (Consistent, Explained Difference, Potential Issue, Unresolved Discrepancy) based on deterministic variance calculations corroborating verbatim evidence.
        </p>
      </section>

      {/* 3. Findings Statistics */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">02</span>
            <span>Findings Statistics & Exposure Metrics</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Audit Portfolio Metrics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="p-3 bg-[#FAFBFB] rounded border border-gray-200">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Total Findings Tracked</span>
            <span className="text-xl font-black text-[#101828] font-mono mt-1 block">{allFindings.length}</span>
            <span className="text-[10px] text-gray-500 mt-0.5 block">Cataloged Discrepancies</span>
          </div>

          <div className="p-3 bg-[#FCECEF] rounded border border-[#F8D7DA]">
            <span className="text-[10px] font-bold text-[#E45757] uppercase block">High Priority</span>
            <span className="text-xl font-black text-[#E45757] font-mono mt-1 block">{highPriority.length}</span>
            <span className="text-[10px] text-[#E45757] font-semibold mt-0.5 block">Material Discrepancies</span>
          </div>

          <div className="p-3 bg-amber-50/70 rounded border border-amber-200">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Potential Issues</span>
            <span className="text-xl font-black text-amber-800 font-mono mt-1 block">{potential.length}</span>
            <span className="text-[10px] text-amber-700 mt-0.5 block">Under Auditor Review</span>
          </div>

          <div className="p-3 bg-blue-50/70 rounded border border-blue-200">
            <span className="text-[10px] font-bold text-blue-700 uppercase block">Explained Differences</span>
            <span className="text-xl font-black text-blue-700 font-mono mt-1 block">{explained.length}</span>
            <span className="text-[10px] text-blue-600 mt-0.5 block">Footnote Substantiated</span>
          </div>

          <div className="p-3 bg-[#E9F8F2] rounded border border-[#12A878]/30">
            <span className="text-[10px] font-bold text-[#087F5B] uppercase block">Unresolved Discrepancies</span>
            <span className="text-xl font-black text-[#E45757] font-mono mt-1 block">{unresolved.length}</span>
            <span className="text-[10px] text-[#E45757] font-bold mt-0.5 block">Requires Action</span>
          </div>
        </div>
      </section>

      {/* 4. Complete Findings Table (Prompt Schema) */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">03</span>
            <span>Complete Findings Table</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Mandatory Register Schedule</span>
        </div>

        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAFBFB] text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-3 font-mono">ID</th>
                <th className="py-2.5 px-3">Finding Description</th>
                <th className="py-2.5 px-3">Metric</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Priority</th>
                <th className="py-2.5 px-3 text-right">Difference</th>
                <th className="py-2.5 px-3 text-right">Variance</th>
                <th className="py-2.5 px-3 text-center">Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              {allFindings.slice(0, 12).map((f, idx) => (
                <tr key={idx} className="hover:bg-gray-50/60">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#087F5B]">{f.findingId}</td>
                  <td className="py-2.5 px-3 text-[#101828] max-w-xs truncate font-semibold">
                    {f.explanation ? f.explanation.slice(0, 55) + '...' : `${f.metric} Variance Detection`}
                  </td>
                  <td className="py-2.5 px-3 text-gray-700 font-bold">{f.metric}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      f.status === 'consistent' ? 'bg-[#E9F8F2] text-[#087F5B]' :
                      f.status === 'explained_difference' ? 'bg-blue-100 text-blue-900' :
                      f.status === 'potential_issue' ? 'bg-amber-100 text-amber-900' :
                      'bg-[#FCECEF] text-[#E45757]'
                    }`}>
                      {f.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      f.priority === 'high' ? 'text-[#E45757] font-black' :
                      f.priority === 'medium' ? 'text-amber-800' : 'text-[#087F5B]'
                    }`}>
                      {f.priority || 'Low'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#101828]">
                    {formatCurrency(f.difference)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#101828]">
                    {f.percentageDifference}%
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-[11px] text-gray-600">
                    {f.period || period}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. High Priority Findings (Full 12 Fields) */}
      <section className="space-y-4">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">04</span>
            <span>High Priority Findings (Comprehensive Analysis)</span>
          </h2>
          <span className="text-[10px] font-mono text-[#E45757] font-bold uppercase">Material Attention</span>
        </div>

        <div className="space-y-3">
          {highPriority.slice(0, 3).map((f, idx) => (
            <div key={idx} className="p-4 bg-[#FAFBFB] rounded-lg border border-gray-200 space-y-2.5 avoid-page-break">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-white bg-[#087F5B] px-2 py-0.5 rounded">
                    {f.findingId}
                  </span>
                  <span className="font-bold text-xs text-[#101828]">
                    Title: {f.metric} Cross-Statement Inconsistency
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FCECEF] text-[#E45757]">
                    Priority: {f.priority || 'High'}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                    Status: {f.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Grid with prompt's 12 fields */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Metric</span>
                  <strong className="text-[#101828] block truncate">{f.metric}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Period & Scope</span>
                  <span className="font-mono text-gray-800 block truncate">{f.period || period} ({f.scope || 'Consolidated'})</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Difference</span>
                  <span className="font-mono font-bold text-[#E45757] block truncate">{formatCurrency(f.difference)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Variance</span>
                  <span className="font-mono font-bold text-[#E45757] block truncate">{f.percentageDifference}% ({f.direction})</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded border border-gray-200 space-y-1 text-xs">
                <div className="font-bold text-gray-800">Source Documents:</div>
                <div className="text-[11px] text-gray-600 font-mono">
                  • Source A: {f.sourceA?.fileName || 'Annual_Report_2026.pdf'} (Page {f.sourceA?.page || 42}) = {formatCurrency(f.valueA)}
                  <br />
                  • Source B: {f.sourceB?.fileName || 'Management_Commentary.pdf'} (Page {f.sourceB?.page || 8}) = {formatCurrency(f.valueB)}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pt-1 border-t border-gray-100">
                <div className="text-gray-700">
                  <strong className="text-[#087F5B]">Evidence Availability: </strong>
                  <span>Verbatim quotes extracted with page coordinates</span>
                </div>
                <div className="text-gray-900">
                  <strong className="text-[#E45757]">Recommended Review: </strong>
                  <span>{f.recommendation || 'Obtain written management representation.'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Unresolved Findings */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">05</span>
            <span>Unresolved Findings Requiring Controller Disposition</span>
          </h2>
          <span className="text-[10px] font-mono text-[#E45757] font-bold uppercase">{unresolved.length} Open Items</span>
        </div>

        <div className="p-3.5 bg-[#FCECEF]/40 rounded-lg border border-[#F8D7DA] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#101828]">F-029: Gross Trade Receivables Unreconciled Expansion</span>
            <span className="font-mono text-xs font-bold text-[#E45757]">+₹350 Cr (+8.24%)</span>
          </div>
          <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded border border-[#F8D7DA] font-serif">
            "Audit team identified an unreconciled gap of ₹350 Cr between statutory Note 11 (₹4,250 Cr) and the Board Deck (₹4,600 Cr). Management has not furnished supporting allowance schedules to explain this difference."
          </p>
          <div className="text-xs text-[#087F5B] font-bold">
            Action: CFO signed sign-off mandatory before board audit sign-off.
          </div>
        </div>
      </section>

      {/* 7. Explained Differences */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">06</span>
            <span>Explained Differences (Reconciliation Grounded)</span>
          </h2>
          <span className="text-[10px] font-mono text-blue-700 font-bold uppercase">{explained.length} Grounded</span>
        </div>

        <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#101828]">F-030: Long Term Borrowings Footnote Reconciliation</span>
            <span className="font-mono text-xs font-bold text-blue-800">+₹250 Cr (7.35%)</span>
          </div>
          <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded border border-blue-100 font-serif">
            "Footnote Note 19 explicitly reconciles the ₹250 Cr variance between standard debt schedules and balance sheet debt under IFRS 16 lease liability capitalization rules."
          </p>
        </div>
      </section>

      {/* 8. Analyst Review Queue */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">07</span>
            <span>Analyst Review Queue & Audit Sign-Off Worklist</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Assigned Audit Queue</span>
        </div>

        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAFBFB] text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-2 px-3 font-mono">Finding ID</th>
                <th className="py-2 px-3">Metric Assigned</th>
                <th className="py-2 px-3">Reviewer Assigned</th>
                <th className="py-2 px-3">Action Required</th>
                <th className="py-2 px-3 text-center">Due Date</th>
                <th className="py-2 px-3 text-right">Workflow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              <tr>
                <td className="py-2 px-3 font-mono font-bold text-[#087F5B]">F-024</td>
                <td className="py-2 px-3 font-bold text-[#101828]">Revenue from Operations</td>
                <td className="py-2 px-3 text-gray-700">Alex Mercer, CPA</td>
                <td className="py-2 px-3 text-gray-700">Obtain signed CFO reconciliation on Note 24</td>
                <td className="py-2 px-3 text-center font-mono text-[11px] text-gray-600">05 Oct 2026</td>
                <td className="py-2 px-3 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FCECEF] text-[#E45757]">
                    In Review
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono font-bold text-[#087F5B]">F-029</td>
                <td className="py-2 px-3 font-bold text-[#101828]">Gross Trade Receivables</td>
                <td className="py-2 px-3 text-gray-700">Sarah Jenkins, Audit Senior</td>
                <td className="py-2 px-3 text-gray-700">Audit provision write-offs & customer aging</td>
                <td className="py-2 px-3 text-center font-mono text-[11px] text-gray-600">07 Oct 2026</td>
                <td className="py-2 px-3 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    Pending Memo
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono font-bold text-[#087F5B]">F-030</td>
                <td className="py-2 px-3 font-bold text-[#101828]">Long Term Borrowings</td>
                <td className="py-2 px-3 text-gray-700">Michael Chang, Assistant</td>
                <td className="py-2 px-3 text-gray-700">Cross-reference Note 19 lease liabilities</td>
                <td className="py-2 px-3 text-center font-mono text-[11px] text-gray-600">03 Oct 2026</td>
                <td className="py-2 px-3 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E9F8F2] text-[#087F5B]">
                    Resolved
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. Finding Status Summary */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">08</span>
            <span>Finding Status Summary Matrix</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Resolution Breakdown</span>
        </div>

        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAFBFB] text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">Classification Status</th>
                <th className="py-2 px-3 text-center">Finding Count</th>
                <th className="py-2 px-3 text-center">Portfolio Share</th>
                <th className="py-2 px-3">Required Audit Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              <tr>
                <td className="py-2 px-3 font-bold text-[#087F5B]">Consistent (Zero Discrepancy)</td>
                <td className="py-2 px-3 text-center font-mono font-bold">286 checks</td>
                <td className="py-2 px-3 text-center font-mono">87.2%</td>
                <td className="py-2 px-3 text-gray-600">Standard audit trail archived. No further action needed.</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-blue-700">Explained Differences</td>
                <td className="py-2 px-3 text-center font-mono font-bold">{explained.length || 21} findings</td>
                <td className="py-2 px-3 text-center font-mono">6.4%</td>
                <td className="py-2 px-3 text-gray-600">Verified against official statutory footnotes. Cross-reference documented.</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-amber-800">Potential Issues</td>
                <td className="py-2 px-3 text-center font-mono font-bold">{potential.length || 16} findings</td>
                <td className="py-2 px-3 text-center font-mono">4.9%</td>
                <td className="py-2 px-3 text-gray-600">Audit in-charge inquiry to controllership team for written confirmation.</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[#E45757]">Unresolved Discrepancies</td>
                <td className="py-2 px-3 text-center font-mono font-bold">{unresolved.length || 5} findings</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-[#E45757]">1.5%</td>
                <td className="py-2 px-3 text-[#E45757] font-semibold">Immediate escalation to CFO and Audit Committee. Mandatory signed memo.</td>
              </tr>
            </tbody>
          </table>
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
