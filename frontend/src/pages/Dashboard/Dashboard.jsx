import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Files,
  CheckSquare,
  GitCompare,
  AlertTriangle,
  Play,
  Upload,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  Coins,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../services/api';

// ─── Glass Card ────────────────────────────────────────────────
function Card({ children, className = '', onClick, tint = 'white' }) {
  const tintStyles = {
    white: { background: 'rgba(255,255,255,0.68)', border: '1px solid rgba(255,255,255,0.80)' },
    mint:  { background: 'linear-gradient(135deg, rgba(214,242,229,0.68) 0%, rgba(255,255,255,0.62) 100%)', border: '1px solid rgba(8,127,91,0.18)' },
    rose:  { background: 'linear-gradient(135deg, rgba(255,228,228,0.65) 0%, rgba(255,255,255,0.62) 100%)', border: '1px solid rgba(201,112,112,0.18)' },
    gold:  { background: 'linear-gradient(135deg, rgba(255,243,204,0.65) 0%, rgba(255,255,255,0.62) 100%)', border: '1px solid rgba(212,168,67,0.20)' },
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-200 ${onClick ? 'cursor-pointer card-hover' : ''} ${className}`}
      style={{
        ...tintStyles[tint],
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: '0 4px 24px rgba(8,127,91,0.08), 0 1px 4px rgba(0,0,0,0.03)',
      }}
    >
      {children}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    consistent:           { label: 'Consistent',     bg: 'rgba(8,127,91,0.12)',  color: '#087F5B',  border: 'rgba(8,127,91,0.22)' },
    explained_difference: { label: 'Explained',      bg: 'rgba(37,99,235,0.10)', color: '#2563EB',  border: 'rgba(37,99,235,0.18)' },
    unresolved_discrepancy:{ label: 'Unresolved',    bg: 'rgba(201,112,112,0.12)', color: '#B85555', border: 'rgba(201,112,112,0.22)' },
    potential_issue:      { label: 'Potential Issue', bg: 'rgba(212,168,67,0.14)', color: '#9A7A10', border: 'rgba(212,168,67,0.25)' },
  };
  const s = map[status] || map.potential_issue;
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const res = await api.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunFullAudit = async () => {
    setAuditRunning(true);
    setAuditProgress(15);
    try {
      await api.runFullAnalysis();
      const interval = setInterval(() => {
        setAuditProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => { setAuditRunning(false); navigate('/analysis'); }, 500);
            return 100;
          }
          return prev + 25;
        });
      }, 350);
    } catch (e) {
      setAuditRunning(false);
      navigate('/analysis');
    }
  };

  // ── KPI Cards config ───────────────────────────────────────
  const kpis = [
    {
      title: 'Documents',
      value: stats?.kpi?.documents || 12,
      trend: '+2 new filings',
      icon: Files,
      tint: 'white',
      iconColor: '#5A8A81',
      iconBg: 'rgba(8,127,91,0.08)',
      route: '/documents',
    },
    {
      title: 'Financial Facts',
      value: stats?.kpi?.financialFacts || 486,
      trend: '100% verified trace',
      icon: CheckSquare,
      tint: 'mint',
      iconColor: '#087F5B',
      iconBg: 'rgba(8,127,91,0.12)',
      route: '/facts',
    },
    {
      title: 'Consistency Checks',
      value: stats?.kpi?.consistencyChecks || 328,
      trend: 'Deterministic math',
      icon: GitCompare,
      tint: 'mint',
      iconColor: '#087F5B',
      iconBg: 'rgba(8,127,91,0.10)',
      route: '/consistency',
    },
    {
      title: 'Potential Issues',
      value: stats?.kpi?.potentialIssues || 16,
      trend: 'Review required',
      icon: AlertTriangle,
      tint: 'gold',
      iconColor: '#9A7A10',
      iconBg: 'rgba(212,168,67,0.14)',
      route: '/findings?status=potential_issue',
    },
    {
      title: 'Unresolved',
      value: stats?.kpi?.unresolvedFindings || 5,
      trend: 'Material variance',
      icon: AlertCircle,
      tint: 'rose',
      iconColor: '#B85555',
      iconBg: 'rgba(201,112,112,0.12)',
      route: '/findings?status=unresolved_discrepancy',
    },
    {
      title: 'Explained Diffs',
      value: stats?.kpi?.explainedDifferences || 21,
      trend: 'Notes corroborated',
      icon: ShieldCheck,
      tint: 'white',
      iconColor: '#2563EB',
      iconBg: 'rgba(37,99,235,0.10)',
      route: '/findings?status=explained_difference',
    },
  ];

  const donutData = [
    { name: 'Consistent',           value: stats?.consistencyOverview?.consistent      || 286, color: '#087F5B' },
    { name: 'Explained Differences',value: stats?.consistencyOverview?.explained       || 21,  color: '#3B82F6' },
    { name: 'Potential Issues',      value: stats?.consistencyOverview?.potentialIssues || 16,  color: '#D4A843' },
    { name: 'Unresolved',            value: stats?.consistencyOverview?.unresolved      || 5,   color: '#C97070' },
  ];

  const recentFindingsList = [
    { id: 'F-024', metric: 'Revenue',                    variance: '₹500 Cr (5.00%)',  status: 'potential_issue',         sources: 'Annual Report (p. 42) vs Management Commentary (p. 8)' },
    { id: 'F-029', metric: 'Trade Receivables',           variance: '₹350 Cr (8.24%)',  status: 'unresolved_discrepancy',  sources: 'Annual Report (p. 48) vs MD&A Commentary (p. 12)' },
    { id: 'F-028', metric: 'Segment Operational Revenue', variance: '₹500 Cr (5.00%)',  status: 'explained_difference',    sources: 'P&L Statement vs Note 24 Segment Reconciliation' },
    { id: 'F-025', metric: 'EBITDA (Consolidated)',       variance: '₹0 Cr (0.00%)',    status: 'consistent',              sources: 'Annual Report (p. 42) vs Investor Presentation (p. 6)' },
  ];

  const recentDocsList = [
    { name: 'Annual_Report_2026.pdf',           type: 'Annual Report',     pages: 148, facts: 142, findings: 18, status: 'Completed' },
    { name: 'Management_Commentary_FY26.pdf',   type: 'MD&A Filing',       pages: 32,  facts: 86,  findings: 14, status: 'Completed' },
    { name: 'Note_24_Revenue_Breakdown.pdf',    type: 'Notes to Accounts', pages: 12,  facts: 44,  findings: 4,  status: 'Completed' },
    { name: 'Earnings_Release_Q4_FY26.pdf',     type: 'Earnings Release',  pages: 18,  facts: 62,  findings: 5,  status: 'Completed' },
  ];

  const activityItems = stats?.recentActivity || [
    { title: "Auditor Report 2026 uploaded", time: "12 minutes ago" },
    { title: "4 findings automatically resolved via Note 19", time: "45 minutes ago" },
    { title: "Revenue discrepancy detected (F-024)", time: "2 hours ago" },
    { title: "Full audit check completed for FY2026", time: "3 hours ago" },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* ── Page Title Row ────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4"
        style={{ borderBottom: '1px solid rgba(8,127,91,0.13)' }}
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(8,127,91,0.12)', border: '1px solid rgba(8,127,91,0.22)' }}
            >
              <BarChart3 className="w-4 h-4" style={{ color: '#087F5B' }} />
            </div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1A2E2A' }}>
              Dashboard
            </h1>
          </div>
          <p className="text-[13px]" style={{ color: '#5A8A81' }}>
            Financial Intelligence &amp; Audit Workspace — Acme Industries (FY2026)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/documents', { state: { openUpload: true } })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all active:scale-[0.97]"
            style={{
              background: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(8,127,91,0.22)',
              color: '#087F5B',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(214,242,229,0.70)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.65)'}
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>

          <button
            onClick={handleRunFullAudit}
            disabled={auditRunning}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all active:scale-[0.97] disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #3D9E78 0%, #087F5B 100%)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(8,127,91,0.30)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 22px rgba(8,127,91,0.42)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(8,127,91,0.30)'}
          >
            <Play className="w-4 h-4 fill-white" />
            {auditRunning ? `Running... (${auditProgress}%)` : 'Run Full Audit'}
          </button>
        </div>
      </div>

      {/* ── 6 KPI Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} onClick={() => navigate(kpi.route)} tint={kpi.tint} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold truncate" style={{ color: '#5A8A81' }}>
                  {kpi.title}
                </span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: kpi.iconBg }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: kpi.iconColor }} />
                </div>
              </div>
              <div className="text-2xl font-black tracking-tight leading-none mb-2" style={{ color: '#1A2E2A' }}>
                {kpi.value.toLocaleString()}
              </div>
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                style={{
                  background: 'rgba(8,127,91,0.07)',
                  color: '#5A8A81',
                  border: '1px solid rgba(8,127,91,0.12)',
                }}
              >
                {kpi.trend}
              </span>
            </Card>
          );
        })}
      </div>

      {/* ── Charts Row ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Consistency Donut */}
        <Card className="lg:col-span-6 p-5 flex flex-col justify-between" tint="mint">
          <div
            className="flex items-center justify-between pb-3 mb-1"
            style={{ borderBottom: '1px solid rgba(8,127,91,0.12)' }}
          >
            <div>
              <h2 className="text-[14px] font-bold" style={{ color: '#1A2E2A' }}>Consistency Overview</h2>
              <p className="text-[11px] mt-0.5" style={{ color: '#5A8A81' }}>Cross-statement comparison results</p>
            </div>
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(8,127,91,0.12)', color: '#087F5B', border: '1px solid rgba(8,127,91,0.22)' }}
            >
              328 Total Checks
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-4">
            {/* Donut chart */}
            <div className="relative w-48 h-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={54} outerRadius={78} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val} checks`, name]}
                    contentStyle={{
                      borderRadius: 12,
                      fontSize: 12,
                      background: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(8,127,91,0.15)',
                      color: '#1A2E2A',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black" style={{ color: '#1A2E2A' }}>328</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#5A8A81' }}>Checks</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 w-full sm:w-auto">
              {[
                { label: 'Consistent',       val: '286 (87.2%)', color: '#087F5B' },
                { label: 'Explained',         val: '21 (6.4%)',  color: '#3B82F6' },
                { label: 'Potential Issues',  val: '16 (4.9%)',  color: '#D4A843' },
                { label: 'Unresolved',        val: '5 (1.5%)',   color: '#C97070' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-8 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                    <span style={{ color: '#3D6B63' }}>{item.label}</span>
                  </div>
                  <span className="font-bold" style={{ color: item.color }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/consistency')}
            className="w-full py-2.5 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all mt-2"
            style={{
              background: 'rgba(8,127,91,0.10)',
              border: '1px solid rgba(8,127,91,0.20)',
              color: '#087F5B',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(8,127,91,0.17)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(8,127,91,0.10)'}
          >
            Inspect Full Consistency Matrix
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Card>

        {/* Finding Distribution */}
        <Card className="lg:col-span-6 p-5 flex flex-col" tint="white">
          <div
            className="flex items-center justify-between pb-3 mb-1"
            style={{ borderBottom: '1px solid rgba(8,127,91,0.10)' }}
          >
            <div>
              <h2 className="text-[14px] font-bold" style={{ color: '#1A2E2A' }}>Finding Distribution</h2>
              <p className="text-[11px] mt-0.5" style={{ color: '#5A8A81' }}>Breakdown of consistency and material severity</p>
            </div>
            <button onClick={() => navigate('/findings')}
              className="text-[12px] font-semibold flex items-center gap-1"
              style={{ color: '#087F5B' }}>
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4 py-4 flex-1">
            {[
              { label: 'Consistent (0% Variance)',  count: '286 Verified',        pct: 87.2, color: '#087F5B' },
              { label: 'Explained Differences',     count: '21 Corroborated',     pct: 20,   color: '#3B82F6' },
              { label: 'Potential Issues',           count: '16 Pending Review',   pct: 15,   color: '#D4A843' },
              { label: 'Unresolved Discrepancies',  count: '5 Material Items',    pct: 8,    color: '#C97070' },
            ].map((row, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-[12px] mb-1.5 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: row.color }} />
                    <span style={{ color: '#2F4F49' }}>{row.label}</span>
                  </div>
                  <span className="font-bold" style={{ color: row.color }}>{row.count}</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'rgba(8,127,91,0.07)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${row.pct}%`, background: row.color, opacity: 0.85 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* F-024 Alert */}
          <div
            onClick={() => navigate('/findings/F-024')}
            className="mt-3 p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(255,228,228,0.65) 0%, rgba(255,255,255,0.55) 100%)',
              border: '1px solid rgba(201,112,112,0.22)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,228,228,0.85) 0%, rgba(255,255,255,0.75) 100%)'}
            onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,228,228,0.65) 0%, rgba(255,255,255,0.55) 100%)'}
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" style={{ color: '#B85555' }} />
              <div>
                <span className="text-[12px] font-bold block" style={{ color: '#B85555' }}>
                  F-024: Revenue Inconsistency (₹500 Cr / 5%)
                </span>
                <p className="text-[11px]" style={{ color: '#8A5A5A' }}>
                  Annual Report (₹10,000 Cr) vs Management Commentary (₹10,500 Cr)
                </p>
              </div>
            </div>
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0"
              style={{
                background: 'rgba(201,112,112,0.14)',
                color: '#B85555',
                border: '1px solid rgba(201,112,112,0.24)',
              }}
            >
              Investigate
            </span>
          </div>
        </Card>
      </div>

      {/* ── Recent Findings + Documents ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Findings */}
        <Card className="lg:col-span-6 p-5" tint="white">
          <div
            className="flex items-center justify-between pb-3 mb-3"
            style={{ borderBottom: '1px solid rgba(8,127,91,0.10)' }}
          >
            <div>
              <h2 className="text-[14px] font-bold" style={{ color: '#1A2E2A' }}>Recent Findings</h2>
              <p className="text-[11px] mt-0.5" style={{ color: '#5A8A81' }}>Latest detected consistency items across filings</p>
            </div>
            <button onClick={() => navigate('/findings')} className="text-[12px] font-semibold" style={{ color: '#087F5B' }}>
              View all
            </button>
          </div>

          <div className="space-y-0.5">
            {recentFindingsList.map(item => (
              <div
                key={item.id}
                onClick={() => navigate(`/findings/${item.id}`)}
                className="py-2.5 px-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(214,242,229,0.40)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[13px] font-bold" style={{ color: '#1A2E2A' }}>{item.metric}</span>
                    <span className="text-[10px] font-mono" style={{ color: '#5A8A81' }}>[{item.id}]</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="text-[11px] truncate" style={{ color: '#5A8A81' }}>{item.sources}</div>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <span className="text-[12px] font-bold font-mono block" style={{ color: '#3D6B63' }}>{item.variance}</span>
                  <span className="text-[10px] font-semibold" style={{ color: '#087F5B' }}>Inspect →</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Documents */}
        <Card className="lg:col-span-6 p-5" tint="white">
          <div
            className="flex items-center justify-between pb-3 mb-3"
            style={{ borderBottom: '1px solid rgba(8,127,91,0.10)' }}
          >
            <div>
              <h2 className="text-[14px] font-bold" style={{ color: '#1A2E2A' }}>Recent Documents</h2>
              <p className="text-[11px] mt-0.5" style={{ color: '#5A8A81' }}>Uploaded financial filings under audit review</p>
            </div>
            <button onClick={() => navigate('/documents')} className="text-[12px] font-semibold" style={{ color: '#087F5B' }}>
              Manage all (12)
            </button>
          </div>

          <div className="space-y-0.5">
            {recentDocsList.map((doc, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/documents')}
                className="py-2.5 px-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(214,242,229,0.40)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(8,127,91,0.10)', border: '1px solid rgba(8,127,91,0.16)' }}
                  >
                    <FileText className="w-4 h-4" style={{ color: '#087F5B' }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold truncate max-w-[190px]" style={{ color: '#1A2E2A' }}>{doc.name}</div>
                    <div className="text-[10px]" style={{ color: '#5A8A81' }}>
                      {doc.type} • {doc.pages} pages • {doc.facts} facts
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full block"
                    style={{ background: 'rgba(8,127,91,0.12)', color: '#087F5B', border: '1px solid rgba(8,127,91,0.20)' }}
                  >
                    {doc.status}
                  </span>
                  <div className="text-[10px] mt-0.5" style={{ color: '#5A8A81' }}>{doc.findings} findings</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Analysis Activity Timeline ────────────────────────── */}
      <Card className="p-5" tint="mint">
        <div
          className="flex items-center justify-between pb-3 mb-3"
          style={{ borderBottom: '1px solid rgba(8,127,91,0.12)' }}
        >
          <div>
            <h2 className="text-[14px] font-bold" style={{ color: '#1A2E2A' }}>Analysis Activity</h2>
            <p className="text-[11px] mt-0.5" style={{ color: '#5A8A81' }}>Live ledger of extraction, normalization, and comparison events</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#087F5B' }} />
            <span className="text-[11px] font-medium" style={{ color: '#087F5B' }}>Real-time sync</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
          {activityItems.map((item, idx) => (
            <div
              key={idx}
              className="py-2.5 px-3 rounded-xl flex items-center justify-between transition-all"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.55)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(8,127,91,0.12)', border: '1px solid rgba(8,127,91,0.16)' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#087F5B' }} />
                </div>
                <div>
                  <div className="text-[12px] font-semibold" style={{ color: '#2F4F49' }}>{item.title}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" style={{ color: '#5A8A81' }} />
                    <span className="text-[10px]" style={{ color: '#5A8A81' }}>{item.time}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/findings')}
                className="text-[11px] font-semibold"
                style={{ color: '#087F5B' }}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
