import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  X,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Header({ onMobileMenuToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 header-glass px-4 lg:px-6 flex items-center justify-between">
      {/* ── Left: Mobile Toggle + Engine Status ──────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 -ml-1 rounded-xl lg:hidden transition-all"
          style={{ color: '#5A8A81' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(8,127,91,0.10)';
            e.currentTarget.style.color = '#087F5B';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#5A8A81';
          }}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Engine status pill removed as requested */}
      </div>

      {/* ── Spacer (Search removed) ─────────────────────────── */}
      <div className="flex-1" />

      {/* ── Right: Actions (Upload button removed) ──────────── */}
      <div className="flex items-center gap-2">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl transition-all"
            style={{ color: '#5A8A81' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(214,242,229,0.55)';
              e.currentTarget.style.color = '#087F5B';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#5A8A81';
            }}
          >
            <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            {/* Red dot */}
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #E8A5A5, #C97070)',
                boxShadow: '0 0 6px rgba(201,112,112,0.6)',
              }}
            />
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-2xl z-50"
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(8,127,91,0.15)',
                boxShadow: '0 20px 50px rgba(8,127,91,0.14), 0 6px 16px rgba(0,0,0,0.06)',
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid rgba(8,127,91,0.10)' }}
              >
                <span className="text-[13px] font-bold" style={{ color: '#1A2E2A' }}>Audit Alerts</span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(201,112,112,0.12)',
                      color: '#B85555',
                      border: '1px solid rgba(201,112,112,0.20)',
                    }}
                  >
                    1 Unresolved
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-0.5 rounded-md transition-colors"
                    style={{ color: '#5A8A81' }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <div
                  onClick={() => { navigate('/findings/F-024'); setShowNotifications(false); }}
                  className="p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,228,228,0.70) 0%, rgba(255,255,255,0.60) 100%)',
                    border: '1px solid rgba(201,112,112,0.20)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,228,228,0.90) 0%, rgba(255,255,255,0.80) 100%)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,228,228,0.70) 0%, rgba(255,255,255,0.60) 100%)'}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5" style={{ color: '#B85555' }} />
                      <span className="text-[12px] font-bold" style={{ color: '#B85555' }}>
                        F-024: Revenue Discrepancy
                      </span>
                    </div>
                    <span className="text-[10px]" style={{ color: '#5A8A81' }}>2h ago</span>
                  </div>
                  <p className="text-[11px]" style={{ color: '#3D6B63' }}>
                    Difference of ₹500 Cr (5%) identified between Annual Report and MD&A.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div
          className="flex items-center gap-2 pl-2 ml-1 cursor-pointer"
          style={{ borderLeft: '1px solid rgba(8,127,91,0.15)' }}
          onClick={() => navigate('/profile')}
        >
          <img
            src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"}
            alt="User avatar"
            className="w-8 h-8 rounded-full object-cover"
            style={{ border: '2px solid rgba(8,127,91,0.28)' }}
          />
        </div>
      </div>
    </header>
  );
}
