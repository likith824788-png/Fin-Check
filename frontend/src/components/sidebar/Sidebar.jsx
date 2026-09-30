import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Files,
  UploadCloud,
  Cpu,
  CheckSquare,
  GitCompare,
  AlertTriangle,
  Sparkles,
  FileText,
  LogOut,
  User,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Documents', path: '/documents', icon: Files },
        { label: 'Analysis', path: '/analysis', icon: Cpu }
      ]
    },
    {
      title: 'FINANCIAL INTELLIGENCE',
      items: [
        { label: 'Financial Facts', path: '/facts', icon: CheckSquare },
        { label: 'Consistency', path: '/consistency', icon: GitCompare },
        { label: 'Findings', path: '/findings', icon: AlertTriangle }
      ]
    },
    {
      title: 'AI INTELLIGENCE',
      items: [
        { label: 'AI Auditor', path: '/ai-auditor', icon: Sparkles }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Reports', path: '/reports', icon: FileText }
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
          style={{ background: 'rgba(8,60,45,0.25)' }}
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 sidebar-glass flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* ── Logo / Brand ─────────────────────────────────── */}
        <div
          className="h-16 px-5 flex items-center gap-3 shrink-0"
          style={{ borderBottom: '1px solid rgba(8,127,91,0.15)' }}
        >
          {/* Icon mark — mint green with wave motif */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #3D9E78 0%, #087F5B 100%)',
              boxShadow: '0 4px 12px rgba(8,127,91,0.30)',
            }}
          >
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-[17px] tracking-tight leading-none" style={{ color: '#1A2E2A' }}>
                FINCHECK
              </span>
              <span
                className="text-[10px] font-black px-1.5 py-0.5 rounded-md"
                style={{
                  background: 'linear-gradient(135deg, #3D9E78, #087F5B)',
                  color: 'white',
                }}
              >
                AI
              </span>
            </div>
            <p className="text-[9px] font-semibold tracking-[0.14em] uppercase mt-0.5" style={{ color: '#5A8A81' }}>
              Financial Intelligence
            </p>
          </div>
        </div>

        {/* ── Navigation ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-5">
          {navSections.map((section, idx) => (
            <div key={idx}>
              {/* Section label */}
              <div
                className="px-2 mb-2 text-[10px] font-bold tracking-[0.12em] uppercase"
                style={{ color: 'rgba(8,127,91,0.45)' }}
              >
                {section.title}
              </div>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `relative group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                          isActive ? '' : ''
                        }`
                      }
                      style={({ isActive }) => isActive ? {
                        background: 'linear-gradient(135deg, rgba(8,127,91,0.14) 0%, rgba(214,242,229,0.55) 100%)',
                        border: '1px solid rgba(8,127,91,0.22)',
                        color: '#087F5B',
                        fontWeight: 600,
                      } : {
                        background: 'transparent',
                        border: '1px solid transparent',
                        color: '#2F4F49',
                      }}
                      onMouseEnter={e => {
                        if (!e.currentTarget.querySelector('[data-active]')) {
                          e.currentTarget.style.background = 'rgba(214,242,229,0.45)';
                          e.currentTarget.style.color = '#087F5B';
                        }
                      }}
                      onMouseLeave={e => {
                        // Reset only if not active (active state managed by NavLink)
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          {/* Green left accent bar when active */}
                          {isActive && (
                            <div
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-[52%] rounded-r-full"
                              style={{ background: 'linear-gradient(180deg, #3D9E78, #087F5B)' }}
                            />
                          )}

                          <div className="flex items-center gap-2.5">
                            <Icon
                              className="w-4 h-4 shrink-0 transition-colors"
                              style={{ color: isActive ? '#087F5B' : '#5A8A81' }}
                            />
                            <span>{item.label}</span>
                          </div>

                          {item.badge && (
                            <span
                              className="text-[10px] font-black px-2 py-0.5 rounded-full min-w-[22px] text-center"
                              style={
                                isActive
                                  ? { background: '#087F5B', color: 'white' }
                                  : {
                                      background: 'rgba(201,112,112,0.15)',
                                      color: '#B85555',
                                      border: '1px solid rgba(201,112,112,0.22)',
                                    }
                              }
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom User Section ───────────────────────────── */}
        <div
          className="px-3 py-3 shrink-0 space-y-1"
          style={{ borderTop: '1px solid rgba(8,127,91,0.14)' }}
        >
          {/* Auditor Profile Link */}
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all`
            }
            style={({ isActive }) => isActive ? {
              background: 'rgba(8,127,91,0.10)',
              color: '#087F5B',
            } : {
              color: '#3D6B63',
            }}
          >
            <User className="w-4 h-4" style={{ color: '#5A8A81' }} />
            <span>Auditor Profile</span>
          </NavLink>

          {/* User Card */}
          <div
            className="flex items-center justify-between px-3 py-2.5 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(214,242,229,0.60) 0%, rgba(255,255,255,0.50) 100%)',
              border: '1px solid rgba(8,127,91,0.15)',
            }}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"}
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover shrink-0"
                style={{ border: '2px solid rgba(8,127,91,0.25)' }}
              />
              <div className="overflow-hidden">
                <div className="text-[12px] font-semibold truncate leading-tight" style={{ color: '#1A2E2A' }}>
                  {user?.displayName || 'Alex Mercer, CPA'}
                </div>
                <div className="text-[10px] truncate leading-tight" style={{ color: '#5A8A81' }}>
                  {user?.role || 'Lead Auditor'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg transition-all"
              style={{ color: '#5A8A81' }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#B85555';
                e.currentTarget.style.background = 'rgba(201,112,112,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#5A8A81';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
