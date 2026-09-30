import React from 'react';

export default function ReportFooter({
  currentPage = 1,
  totalPages = 1,
  reportId = 'FIN-2026-00124',
  companyName = 'Nova Retail Group Ltd.'
}) {
  return (
    <footer className="report-footer pt-4 mt-8 border-t border-gray-200 text-[10px] text-gray-500 font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 avoid-page-break">
      <div className="flex items-center gap-3">
        <span className="font-bold text-[#101828]">FINCHECK AI</span>
        <span>•</span>
        <span>Financial Statement Consistency Review</span>
        <span>•</span>
        <span>{companyName}</span>
      </div>

      <div className="flex items-center gap-3 text-left sm:text-right">
        <span>Report ID: <strong className="text-gray-700">{reportId}</strong></span>
        <span>•</span>
        <span className="text-[#E45757] font-semibold uppercase tracking-wider">Confidential / Internal Review</span>
        <span>•</span>
        <span className="font-bold text-[#101828] bg-gray-100 px-2 py-0.5 rounded">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </footer>
  );
}
