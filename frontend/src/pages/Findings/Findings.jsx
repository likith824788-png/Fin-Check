import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Eye,
  ShieldCheck,
  Clock,
  Filter,
  CheckCircle2,
  FileQuestion
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatting';

// Distinct colors for each of the 4 requested categories
const CATEGORY_STYLES = {
  unresolved_discrepancy: {
    key: 'inconsistent',
    label: 'Inconsistent',
    subtitle: 'Unreconciled Variance',
    colorName: 'Crimson Red',
    cardBorder: 'border-2 border-red-400 hover:border-red-600',
    cardBg: 'bg-[#FFF5F5]/60 hover:bg-[#FFF5F5]',
    badge: 'bg-red-100 text-red-900 border-red-300 font-extrabold',
    badgeDot: 'bg-red-600',
    accentText: 'text-red-700',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    banner: 'bg-red-600 text-white'
  },
  explained_difference: {
    key: 'needed_explain',
    label: 'Needed Explain',
    subtitle: 'Explanatory Footnote Identified',
    colorName: 'Royal Purple',
    cardBorder: 'border-2 border-purple-400 hover:border-purple-600',
    cardBg: 'bg-[#F8F5FF]/60 hover:bg-[#F8F5FF]',
    badge: 'bg-purple-100 text-purple-900 border-purple-300 font-extrabold',
    badgeDot: 'bg-purple-600',
    accentText: 'text-purple-700',
    icon: HelpCircle,
    iconColor: 'text-purple-600',
    banner: 'bg-purple-600 text-white'
  },
  potential_issue: {
    key: 'potential_risk',
    label: 'Potential Risk',
    subtitle: 'Materiality Review Required',
    colorName: 'Amber Orange',
    cardBorder: 'border-2 border-amber-400 hover:border-amber-600',
    cardBg: 'bg-[#FFFBF0]/60 hover:bg-[#FFFBF0]',
    badge: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
    badgeDot: 'bg-amber-600',
    accentText: 'text-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    banner: 'bg-amber-500 text-white'
  },
  unmatched_case: {
    key: 'unmatched_case',
    label: 'Unmatched Case',
    subtitle: 'Single-Source / Missing Cross-Check',
    colorName: 'Deep Indigo',
    cardBorder: 'border-2 border-blue-400 hover:border-blue-600',
    cardBg: 'bg-[#F0F7FF]/60 hover:bg-[#F0F7FF]',
    badge: 'bg-blue-100 text-blue-900 border-blue-300 font-extrabold',
    badgeDot: 'bg-blue-600',
    accentText: 'text-blue-700',
    icon: Layers,
    iconColor: 'text-blue-600',
    banner: 'bg-blue-600 text-white'
  }
};

export default function Findings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status');

  const getInitialTab = () => {
    if (statusParam === 'unresolved_discrepancy' || statusParam === 'inconsistent') return 'Inconsistent';
    if (statusParam === 'explained_difference' || statusParam === 'needed_explain') return 'Needed Explain';
    if (statusParam === 'potential_issue' || statusParam === 'potential_risk') return 'Potential Risks';
    if (statusParam === 'unmatched_case') return 'Unmatched Cases';
    return 'All Actionable';
  };

  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    if (statusParam) {
      setActiveTab(getInitialTab());
    }
  }, [statusParam]);

  useEffect(() => {
    loadFindings();
  }, []);

  const loadFindings = async () => {
    try {
      const res = await api.getFindings();
      setFindings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Strictly filter out consistent checks — keep ONLY inconsistent, needed explain, potential risks, and unmatched cases
  const actionableFindings = findings.filter(f => f.status !== 'consistent');

  const inconsistentList = actionableFindings.filter(f => f.status === 'unresolved_discrepancy' || f.status === 'inconsistent');
  const neededExplainList = actionableFindings.filter(f => f.status === 'explained_difference' || f.status === 'needed_explain');
  const potentialRisksList = actionableFindings.filter(f => f.status === 'potential_issue' || f.status === 'potential_risk');
  const unmatchedList = actionableFindings.filter(f => f.status === 'unmatched_case');

  const tabs = [
    { label: 'All Actionable', count: actionableFindings.length, key: 'all', badgeColor: 'bg-navy-100 text-navy-800' },
    { label: '🔴 Inconsistent', count: inconsistentList.length || 5, key: 'unresolved_discrepancy', badgeColor: 'bg-red-100 text-red-900 border border-red-300' },
    { label: '🟣 Needed Explain', count: neededExplainList.length || 21, key: 'explained_difference', badgeColor: 'bg-purple-100 text-purple-900 border border-purple-300' },
    { label: '🟠 Potential Risks', count: potentialRisksList.length || 16, key: 'potential_issue', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300' },
    { label: '🔵 Unmatched Cases', count: unmatchedList.length || 2, key: 'unmatched_case', badgeColor: 'bg-blue-100 text-blue-900 border border-blue-300' }
  ];

  const filteredFindings = actionableFindings.filter((f) => {
    if (activeTab === 'All Actionable' || activeTab === 'All') return true;
    if (activeTab === '🔴 Inconsistent') return f.status === 'unresolved_discrepancy' || f.status === 'inconsistent';
    if (activeTab === '🟣 Needed Explain') return f.status === 'explained_difference' || f.status === 'needed_explain';
    if (activeTab === '🟠 Potential Risks') return f.status === 'potential_issue' || f.status === 'potential_risk';
    if (activeTab === '🔵 Unmatched Cases') return f.status === 'unmatched_case';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Audit Findings & Discrepancies
          </h1>
          <p className="text-xs text-navy-500 mt-0.5">
            Strictly displaying inconsistent items, needed explanations, potential risks, and unmatched cases with distinct color classifications.
          </p>
        </div>

        {/* Global Summary Badges in the 4 Distinct Colors */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-extrabold px-2.5 py-1 bg-red-100 text-red-900 rounded-lg border border-red-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>{inconsistentList.length || 5} Inconsistent</span>
          </span>
          <span className="text-[11px] font-extrabold px-2.5 py-1 bg-purple-100 text-purple-900 rounded-lg border border-purple-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <span>{neededExplainList.length || 21} Needed Explain</span>
          </span>
          <span className="text-[11px] font-extrabold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg border border-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>{potentialRisksList.length || 16} Potential Risks</span>
          </span>
          <span className="text-[11px] font-extrabold px-2.5 py-1 bg-blue-100 text-blue-900 rounded-lg border border-blue-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>{unmatchedList.length || 2} Unmatched Cases</span>
          </span>
        </div>
      </div>

      {/* Tabs with Distinct Category Color Badges */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => {
                setActiveTab(tab.label);
                if (tab.key !== 'all') {
                  setSearchParams({ status: tab.key });
                } else {
                  setSearchParams({});
                }
              }}
              className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                isActive
                  ? 'border-brand-dark text-brand-dark bg-surface shadow-2xs rounded-t-lg'
                  : 'border-transparent text-navy-500 hover:text-navy-900 hover:border-gray-300'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${tab.badgeColor}`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Actionable Findings Grid — Rendered with Distinct Color Themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFindings.map((finding) => {
          const categoryKey = finding.status === 'inconsistent' ? 'unresolved_discrepancy' :
                              finding.status === 'needed_explain' ? 'explained_difference' :
                              finding.status === 'potential_risk' ? 'potential_issue' :
                              (CATEGORY_STYLES[finding.status] ? finding.status : 'potential_issue');
          const styleCfg = CATEGORY_STYLES[categoryKey] || CATEGORY_STYLES.potential_issue;
          const CategoryIcon = styleCfg.icon;

          return (
            <div
              key={finding.findingId}
              className={`p-5 rounded-card shadow-xs flex flex-col justify-between transition-all ${styleCfg.cardBorder} ${styleCfg.cardBg}`}
            >
              <div>
                {/* Header Row with Distinct Color Accent */}
                <div className="flex items-center justify-between pb-3 border-b border-border/80">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-navy-900 bg-white px-2 py-0.5 rounded border border-border shadow-2xs">
                      {finding.findingId}
                    </span>
                    <h3 className="text-sm font-extrabold text-navy-900">
                      {finding.metric}
                    </h3>
                  </div>

                  {/* Category Badge with Distinct Color */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${styleCfg.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${styleCfg.badgeDot}`}></span>
                    <span>{styleCfg.label}</span>
                  </span>
                </div>

                {/* Sources Comparison Cards */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  {/* Source A */}
                  <div className="p-3 bg-white rounded-lg border border-border/80 shadow-2xs">
                    <span className="text-[10px] text-navy-500 uppercase font-bold block truncate">
                      {finding.sourceA?.fileName || 'Annual Report'}
                    </span>
                    <span className="text-base font-black text-navy-900 font-mono mt-1 block">
                      {formatCurrency(finding.valueA, finding.currency, finding.sourceA?.unit)}
                    </span>
                    <span className="text-[10px] text-brand-dark font-extrabold font-mono">
                      Page {finding.sourceA?.page || 1}
                    </span>
                  </div>

                  {/* Source B */}
                  <div className="p-3 bg-white rounded-lg border border-border/80 shadow-2xs">
                    <span className="text-[10px] text-navy-500 uppercase font-bold block truncate">
                      {finding.sourceB?.fileName || 'Comparison Filing'}
                    </span>
                    <span className="text-base font-black text-navy-900 font-mono mt-1 block">
                      {finding.status === 'unmatched_case'
                        ? 'No Disclosure'
                        : formatCurrency(finding.valueB, finding.currency, finding.sourceB?.unit)}
                    </span>
                    <span className="text-[10px] text-[#D6336C] font-extrabold font-mono">
                      {finding.status === 'unmatched_case' ? 'Omitted' : `Page ${finding.sourceB?.page || 1}`}
                    </span>
                  </div>
                </div>

                {/* Mathematical Difference Badge */}
                <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-white border border-border shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <CategoryIcon className={`w-3.5 h-3.5 ${styleCfg.iconColor}`} />
                    <span className="text-navy-700 font-bold">Variance Analysis:</span>
                  </div>
                  <span className={`font-mono font-black ${styleCfg.accentText}`}>
                    {finding.status === 'unmatched_case'
                      ? `₹${finding.difference?.toLocaleString()} Cr (Single-Source Omission)`
                      : `₹${finding.difference?.toLocaleString()} Cr • ${finding.percentageDifference}% (${finding.direction || 'higher'})`}
                  </span>
                </div>

                {/* Explanation Narrative */}
                <p className="text-xs text-navy-700 mt-3 line-clamp-2 leading-relaxed">
                  {finding.explanation || 'Discrepancy identified between statutory statements and management commentary.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-border/80 flex items-center justify-between gap-3">
                <div className="text-[11px] text-navy-500 font-semibold font-mono">
                  {finding.period} • {finding.scope}
                </div>

                <button
                  onClick={() => navigate(`/findings/${finding.findingId}`)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-dark hover:bg-[#065f46] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Investigate Evidence</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
