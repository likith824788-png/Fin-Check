import React from 'react';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import { formatCurrency } from '../../../utils/formatting';
import { ShieldCheck } from 'lucide-react';

export default function ConsistencyReport({
  findings = [],
  _facts = [],
  documents = [],
  stats = null,
  period = 'FY2026',
  periodLabel = 'FY2026 (Full Year Consolidated)',
  companyName = 'Nova Retail Group Ltd.',
  analysisDate = '01 October 2026',
  reportId = 'FIN-2026-00124'
}) {
  const totalChecks = stats?.kpi?.consistencyChecks || 328;
  const consistentChecks = findings.filter(f => f.status === 'consistent').length || stats?.kpi?.consistentChecks || 286;
  const explainedDiffs = findings.filter(f => f.status === 'explained_difference');
  const potentialIssues = findings.filter(f => f.status === 'potential_issue');
  const unresolvedIssues = findings.filter(f => f.status === 'unresolved_discrepancy');

  // Pair list for Documents Compared
  const comparedPairs = [
    {
      docA: 'Annual_Report_2026.pdf',
      typeA: 'Audited Annual Accounts',
      docB: 'Management_Commentary.pdf',
      typeB: 'MD&A / Executive Release',
      checks: 84,
      consistent: 78,
      status: 'Review Required'
    },
    {
      docA: 'Annual_Report_2026.pdf',
      typeA: 'Audited Annual Accounts',
      docB: 'Q4_Financials.pdf',
      typeB: 'Quarterly Results Release',
      checks: 72,
      consistent: 70,
      status: 'Consistent'
    },
    {
      docA: 'Annual_Report_2026.pdf',
      typeA: 'Audited Annual Accounts',
      docB: 'Auditor_Report_2026.pdf',
      typeB: 'Independent Audit Opinion',
      checks: 68,
      consistent: 68,
      status: '100% Match'
    },
    {
      docA: 'Cash_Flow_Schedule_2026.xlsx',
      typeA: 'Operational Cash Schedule',
      docB: 'Annual_Report_2026.pdf',
      typeB: 'Statutory Cash Flow Note',
      checks: 52,
      consistent: 52,
      status: '100% Match'
    },
    {
      docA: 'Board_Presentation_Q4.pdf',
      typeA: 'Executive Deck',
      docB: 'Annual_Report_2026.pdf',
      typeB: 'Statutory Balance Sheet Notes',
      checks: 52,
      consistent: 48,
      status: 'Review Required'
    }
  ];

  return (
    <div className="space-y-8 text-navy-900 font-sans">
      {/* 1. Report Header */}
      <ReportHeader
        reportTitle="Consistency Report"
        companyName={companyName}
        period={period}
        periodLabel={periodLabel}
        analysisDate={analysisDate}
        reportId={reportId}
        documentsCount={documents.length || 10}
      />

      {/* 2. Review Scope */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">01</span>
            <span>Review Scope & Deterministic Comparison Rules</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Automated Pipeline</span>
        </div>

        <p className="text-xs text-gray-800 leading-relaxed">
          This Consistency Report reflects deterministic mathematical comparisons performed between matching metric keys across pairs of independent corporate filings. Ingested numbers are normalized to a common base unit (<strong>INR Base Crore</strong>) prior to evaluating variance. Mathematical comparisons operate under a strict tolerance ceiling of <strong>0.50%</strong>. Any difference exceeding 0.50% without substantiated footnote disclosures is escalated for controllership review.
        </p>
      </section>

      {/* 3. Documents Compared */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">02</span>
            <span>Documents Compared (Dual-Source Lineage)</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Cross-Pair Ingestion</span>
        </div>

        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAFBFB] text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">Primary Source Document (A)</th>
                <th className="py-2 px-3">Comparison Source Document (B)</th>
                <th className="py-2 px-3 text-center">Checks</th>
                <th className="py-2 px-3 text-center">Concordance</th>
                <th className="py-2 px-3 text-right">Audit Determination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              {comparedPairs.map((pair, idx) => (
                <tr key={idx} className="hover:bg-gray-50/60">
                  <td className="py-2 px-3">
                    <span className="font-bold text-[#101828] block truncate max-w-xs">{pair.docA}</span>
                    <span className="text-[10px] text-gray-500">{pair.typeA}</span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="font-bold text-[#101828] block truncate max-w-xs">{pair.docB}</span>
                    <span className="text-[10px] text-gray-500">{pair.typeB}</span>
                  </td>
                  <td className="py-2 px-3 text-center font-mono text-[11px] text-gray-700">{pair.checks} checks</td>
                  <td className="py-2 px-3 text-center font-mono text-[11px] font-bold text-[#087F5B]">
                    {((pair.consistent / pair.checks) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pair.status === 'Review Required' ? 'bg-[#FCECEF] text-[#E45757]' : 'bg-[#E9F8F2] text-[#087F5B]'
                    }`}>
                      {pair.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Consistency Overview */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">03</span>
            <span>Consistency Overview & Variance Breakdown</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">{totalChecks} Executed Checks</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#E9F8F2] rounded border border-[#12A878]/30">
            <span className="text-[10px] font-bold text-[#087F5B] uppercase block">Consistent Matches</span>
            <span className="text-xl font-black text-[#087F5B] font-mono mt-1 block">{consistentChecks}</span>
            <span className="text-[10px] text-[#087F5B] font-medium mt-0.5 block">
              {((consistentChecks / totalChecks) * 100).toFixed(1)}% of total checks
            </span>
          </div>

          <div className="p-3 bg-blue-50/70 rounded border border-blue-200">
            <span className="text-[10px] font-bold text-blue-700 uppercase block">Explained Differences</span>
            <span className="text-xl font-black text-blue-700 font-mono mt-1 block">{explainedDiffs.length || 21}</span>
            <span className="text-[10px] text-blue-600 font-medium mt-0.5 block">Substantiated by Footnotes</span>
          </div>

          <div className="p-3 bg-amber-50/70 rounded border border-amber-200">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Potential Issues</span>
            <span className="text-xl font-black text-amber-800 font-mono mt-1 block">{potentialIssues.length || 16}</span>
            <span className="text-[10px] text-amber-700 font-medium mt-0.5 block">Variance &gt; 0.50%</span>
          </div>

          <div className="p-3 bg-[#FCECEF] rounded border border-[#F8D7DA]">
            <span className="text-[10px] font-bold text-[#E45757] uppercase block">Unresolved Discrepancies</span>
            <span className="text-xl font-black text-[#E45757] font-mono mt-1 block">{unresolvedIssues.length || 5}</span>
            <span className="text-[10px] text-[#E45757] font-medium mt-0.5 block">Material Variance &gt; 5.00%</span>
          </div>
        </div>
      </section>

      {/* 5. Metric-by-Metric Comparison (SOURCE A VS SOURCE B) */}
      <section className="space-y-4">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">04</span>
            <span>Metric-by-Metric Comparison (Source A vs Source B)</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Dual-Source Grounded Schedule</span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {findings.slice(0, 8).map((f, idx) => (
            <div key={idx} className="p-4 bg-[#FAFBFB] rounded-lg border border-gray-200 space-y-3 avoid-page-break">
              {/* Metric header and status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#101828]">{f.metric}</span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600">
                    Period: {f.period || period}
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600 uppercase">
                    Scope: {f.scope || 'Consolidated'}
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  f.status === 'consistent' ? 'bg-[#E9F8F2] text-[#087F5B]' :
                  f.status === 'explained_difference' ? 'bg-blue-100 text-blue-900' :
                  f.status === 'potential_issue' ? 'bg-amber-100 text-amber-900' :
                  'bg-[#FCECEF] text-[#E45757]'
                }`}>
                  Status: {f.status.replace('_', ' ')}
                </span>
              </div>

              {/* SOURCE A VS SOURCE B GRID (Prompt format) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Source A */}
                <div className="p-3 bg-white rounded border border-gray-200 space-y-1">
                  <div className="text-[10px] font-bold text-[#087F5B] uppercase tracking-wider">Source A</div>
                  <div className="text-xs font-bold text-[#101828] truncate">{f.sourceA?.fileName || 'Annual_Report_2026.pdf'}</div>
                  <div className="font-mono text-sm font-black text-[#101828]">
                    {formatCurrency(f.valueA || f.sourceA?.value)}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Page: <strong className="text-gray-700">{f.sourceA?.page || 42}</strong> • Section: <span className="text-gray-700">{f.sourceA?.section || 'Statutory Disclosure'}</span>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 pt-1 border-t border-gray-100">
                    Normalized A: <strong className="text-gray-800">{f.valueA} Cr</strong>
                  </div>
                </div>

                {/* Source B */}
                <div className="p-3 bg-white rounded border border-gray-200 space-y-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Source B</div>
                  <div className="text-xs font-bold text-[#101828] truncate">{f.sourceB?.fileName || 'Management_Commentary.pdf'}</div>
                  <div className="font-mono text-sm font-black text-[#101828]">
                    {formatCurrency(f.valueB || f.sourceB?.value)}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Page: <strong className="text-gray-700">{f.sourceB?.page || 8}</strong> • Section: <span className="text-gray-700">{f.sourceB?.section || 'MD&A'}</span>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 pt-1 border-t border-gray-100">
                    Normalized B: <strong className="text-gray-800">{f.valueB} Cr</strong>
                  </div>
                </div>
              </div>

              {/* Difference and Variance Calculation */}
              <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex flex-wrap items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-gray-500 text-[10px] uppercase font-bold mr-2">Difference:</span>
                  <span className={`font-bold ${f.difference > 0 ? 'text-[#E45757]' : 'text-[#087F5B]'}`}>
                    {formatCurrency(f.difference)}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 text-[10px] uppercase font-bold mr-2">Variance:</span>
                  <span className={`font-bold ${f.difference > 0 ? 'text-[#E45757]' : 'text-[#087F5B]'}`}>
                    {f.percentageDifference}%
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 text-[10px] uppercase font-bold mr-2">Direction:</span>
                  <span className="capitalize text-gray-700 font-semibold">{f.direction || 'equal'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Normalization Results */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">05</span>
            <span>Deterministic Normalization Results</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Standard Unit: INR Base Crore</span>
        </div>

        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAFBFB] text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">Metric</th>
                <th className="py-2 px-3">Original Extracted Format</th>
                <th className="py-2 px-3">Extracted Currency & Unit</th>
                <th className="py-2 px-3 text-center">Conversion Factor</th>
                <th className="py-2 px-3 text-right">Normalized Standard Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              <tr>
                <td className="py-2 px-3 font-bold text-[#101828]">Revenue from Operations</td>
                <td className="py-2 px-3 font-mono">10,000 Crore INR</td>
                <td className="py-2 px-3">INR / Crore</td>
                <td className="py-2 px-3 text-center font-mono">1.0000</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-[#087F5B]">10,000.00 Cr</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[#101828]">EBITDA (Secondary Filing)</td>
                <td className="py-2 px-3 font-mono">2,100,00,00,000 INR</td>
                <td className="py-2 px-3">INR / Absolute</td>
                <td className="py-2 px-3 text-center font-mono">1e-7</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-[#087F5B]">2,100.00 Cr</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[#101828]">Earnings Per Share (EPS)</td>
                <td className="py-2 px-3 font-mono">₹24.50 per equity share</td>
                <td className="py-2 px-3">INR / Per Share</td>
                <td className="py-2 px-3 text-center font-mono">1.0000</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-[#087F5B]">₹24.50 / share</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[#101828]">Total Assets</td>
                <td className="py-2 px-3 font-mono">18,450 Crore INR</td>
                <td className="py-2 px-3">INR / Crore</td>
                <td className="py-2 px-3 text-center font-mono">1.0000</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-[#087F5B]">18,450.00 Cr</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Variance Analysis */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">06</span>
            <span>Mathematical Variance Analysis & Distribution</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-500 uppercase">Tolerance Distribution</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#FAFBFB] rounded border border-gray-200">
            <div className="text-[10px] font-bold text-[#087F5B] uppercase">0.00% Variance</div>
            <div className="text-base font-black text-[#101828] font-mono mt-1">286 Checks (87.2%)</div>
            <p className="text-[10px] text-gray-500 mt-1">Exact deterministic equality across both ingested disclosures.</p>
          </div>

          <div className="p-3 bg-[#FAFBFB] rounded border border-gray-200">
            <div className="text-[10px] font-bold text-blue-700 uppercase">0.01% - 0.50% Variance</div>
            <div className="text-base font-black text-[#101828] font-mono mt-1">21 Checks (6.4%)</div>
            <p className="text-[10px] text-gray-500 mt-1">Acceptable rounding difference; explained by statutory footnote conventions.</p>
          </div>

          <div className="p-3 bg-[#FAFBFB] rounded border border-gray-200">
            <div className="text-[10px] font-bold text-amber-800 uppercase">0.51% - 5.00% Variance</div>
            <div className="text-base font-black text-[#101828] font-mono mt-1">16 Checks (4.9%)</div>
            <p className="text-[10px] text-gray-500 mt-1">Moderate variance requiring controllership confirmation.</p>
          </div>

          <div className="p-3 bg-[#FAFBFB] rounded border border-gray-200">
            <div className="text-[10px] font-bold text-[#E45757] uppercase">&gt; 5.00% Material Variance</div>
            <div className="text-base font-black text-[#E45757] font-mono mt-1">5 Checks (1.5%)</div>
            <p className="text-[10px] text-gray-500 mt-1">Material difference exceeding statutory materiality boundaries.</p>
          </div>
        </div>
      </section>

      {/* 8. Explained Differences */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">07</span>
            <span>Explained Differences (Footnote Substantiated)</span>
          </h2>
          <span className="text-[10px] font-mono text-blue-700 font-bold uppercase">{explainedDiffs.length || 21} Grounded Cases</span>
        </div>

        <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="font-bold text-[#101828]">Finding F-030: Long Term Borrowings Variance</div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
              Footnote Note 19 Identified
            </span>
          </div>
          <div className="grid grid-cols-2 text-xs font-mono text-gray-700">
            <div>Annual Report (p.45): <strong>₹3,400 Cr</strong></div>
            <div>Debt Disclosures (p.12): <strong>₹3,650 Cr</strong></div>
          </div>
          <p className="text-[11px] text-gray-700 italic bg-white p-2 rounded border border-blue-100 font-serif">
            "Variance of ₹250 Cr (7.35%) is fully substantiated in Note 19 under IFRS 16 lease liability capitalization. Operating lease rights capitalized as debt in supplementary debt notes."
          </p>
        </div>
      </section>

      {/* 9. Potential Issues */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">08</span>
            <span>Potential Issues Requiring Audit Scrutiny</span>
          </h2>
          <span className="text-[10px] font-mono text-amber-800 font-bold uppercase">{potentialIssues.length || 16} Items</span>
        </div>

        <div className="p-3.5 bg-amber-50/50 rounded-lg border border-amber-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="font-bold text-[#101828]">Finding F-024: Revenue from Operations Discrepancy</div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
              Variance: 5.00% (+₹500 Cr)
            </span>
          </div>
          <div className="grid grid-cols-2 text-xs font-mono text-gray-700">
            <div>Annual Report Note 24 (p.42): <strong>₹10,000 Cr</strong></div>
            <div>Management Commentary (p.8): <strong>₹10,500 Cr</strong></div>
          </div>
          <p className="text-[11px] text-gray-700 italic bg-white p-2 rounded border border-amber-100 font-serif">
            "Management Discussion reports ₹10,500 Cr in gross operations without detailing whether inter-segment freight deductions of ₹500 Cr explain the discrepancy against Note 24."
          </p>
        </div>
      </section>

      {/* 10. Unresolved Comparisons */}
      <section className="space-y-3 avoid-page-break">
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#087F5B] text-white flex items-center justify-center text-[10px] font-mono">09</span>
            <span>Unresolved Comparisons (High Priority Reconciliation Queue)</span>
          </h2>
          <span className="text-[10px] font-mono text-[#E45757] font-bold uppercase">{unresolvedIssues.length || 5} Unresolved</span>
        </div>

        <div className="p-3.5 bg-[#FCECEF]/60 rounded-lg border border-[#F8D7DA] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="font-bold text-[#101828]">Finding F-029: Gross Trade Receivables Unreconciled Delta</div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FCECEF] text-[#E45757] uppercase">
              Variance: 8.24% (+₹350 Cr)
            </span>
          </div>
          <div className="grid grid-cols-2 text-xs font-mono text-gray-700">
            <div>Statutory Note 11 (p.4): <strong>₹4,250 Cr</strong></div>
            <div>Board Presentation (p.9): <strong>₹4,600 Cr</strong></div>
          </div>
          <p className="text-[11px] text-gray-700 italic bg-white p-2 rounded border border-[#F8D7DA] font-serif">
            "Unsubstantiated ₹350 Cr expansion in Trade Receivables. No aging allowance or provision deduction disclosure found in Board Presentation deck to reconcile against statutory Note 11."
          </p>
        </div>
      </section>

      {/* 11. Consistency Conclusion */}
      <section className="space-y-3 avoid-page-break p-4 bg-[#E9F8F2]/40 rounded-lg border border-[#12A878]/30">
        <div className="border-b border-[#12A878]/30 pb-1.5 flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-[#087F5B] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#087F5B]" />
            <span>10. Consistency Conclusion & Verification Opinion</span>
          </h2>
          <span className="text-[10px] font-mono text-[#087F5B] font-bold">Deterministic Result</span>
        </div>

        <p className="text-xs text-gray-800 leading-relaxed">
          The deterministic cross-document engine established an aggregate consistency index of <strong>87.2%</strong> across {totalChecks} comparisons. Cross-statement coherence is validated for Operating EBITDA, Net Profit, and Operating Cash Flow across all statutory and non-statutory filings. Remediation is strictly restricted to obtaining controllership sign-offs for Revenue (F-024) and Trade Receivables (F-029).
        </p>

        <div className="pt-2 border-t border-gray-200/80 flex justify-between text-[11px] font-mono text-gray-600">
          <span>Signed: Alex Mercer, CPA</span>
          <span>Apex Audit & Advisory LLP • {analysisDate}</span>
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
