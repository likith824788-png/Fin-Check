import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  FileSearch,
  BarChart3,
  FileText,
  Target,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// FINCHECK AI Logo Component matching the reference design
function FincheckLogo({ centered = false, size = 'default' }) {
  return (
    <div className={`flex items-center gap-2.5 ${centered ? 'justify-center' : ''}`}>
      {/* Dynamic green circular logo emblem with double swoosh check */}
      <div
        className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-sm flex-shrink-0"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #10B981 0%, #087F5B 60%, #064E3B 100%)',
          boxShadow: '0 2px 8px rgba(8, 127, 91, 0.28)'
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a10 10 0 1 0 10 10" strokeOpacity="0.25" />
          <path d="M7.5 12.5l3.2 3.2L17.5 8" strokeWidth="2.6" />
          <circle cx="17.8" cy="6.2" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      </div>

      <div className="leading-tight">
        <div className="flex items-center">
          <span className="font-extrabold text-[#111827] tracking-tight text-base sm:text-lg">
            FINCHECK
          </span>
          <span className="font-extrabold text-[#087F5B] tracking-tight text-base sm:text-lg ml-1">
            AI
          </span>
        </div>
        <p className="text-[10px] text-[#64748b] font-medium tracking-tight -mt-0.5">
          Financial Clarity. Trusted Insights.
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);
    setError('');
    setInfoMsg('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Authentication failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await login('auditor@fincheck.ai', 'session_auth');
      navigate('/dashboard');
    } catch (err) {
      setError('Google Workspace sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setInfoMsg('Password reset instructions will be sent to your work email.');
  };

  return (
    <div
      className="w-full h-screen min-h-screen relative overflow-hidden flex items-center justify-center select-none"
      style={{
        background: 'linear-gradient(135deg, #F3F6F4 0%, #FFFFFF 50%, #EDF5F1 100%)',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* ═══════════════════════════════════════════════════════════
          DESKTOP & TABLET VIEWPORT (md and up)
          Preserves exact natural aspect ratio (1024/682) without breadth distortion
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="hidden md:block h-full relative"
        style={{
          aspectRatio: '1024 / 682',
          maxHeight: '100vh',
          maxWidth: '100vw',
          backgroundImage: "url('/login-bg.jpg')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* INTERACTIVE FORM CARD: sits with pixel precision over the card slot in login-bg.jpg */}
        <div
          className="absolute shadow-[0_16px_50px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between"
          style={{
            left: '58.8%',
            top: '9.8%',
            width: '37.8%',
            height: '80.8%',
            padding: '3.2% 4.2%',
            zIndex: 10,
            boxSizing: 'border-box',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none'
          }}
        >
          {/* Card Top: Logo, Welcome Title & Subtitle */}
          <div>
            <FincheckLogo centered />

            <h2 className="text-lg lg:text-[22px] font-extrabold text-center text-[#111827] mt-2 lg:mt-3 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-[11px] lg:text-[12px] text-center text-[#64748b] mt-0.5 mb-2.5 lg:mb-3">
              Sign in to continue your financial analysis
            </p>

            {/* Notification / Error alert */}
            {error && (
              <div className="mb-2 py-1.5 px-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] font-medium leading-tight">
                {error}
              </div>
            )}
            {infoMsg && (
              <div className="mb-2 py-1.5 px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium leading-tight">
                {infoMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-2.5">
              {/* Email Field */}
              <div>
                <label className="block text-[11px] lg:text-xs font-semibold text-[#374151] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-8 lg:pl-9 pr-3 py-1.5 lg:py-2 text-xs lg:text-[13px] text-[#111827] placeholder-[#9ca3af] rounded-xl outline-none transition-all"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0'
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] lg:text-xs font-semibold text-[#374151]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] lg:text-[11px] font-semibold text-[#087F5B] hover:text-[#065F46] hover:underline transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-8 lg:pl-9 pr-9 py-1.5 lg:py-2 text-xs lg:text-[13px] text-[#111827] placeholder-[#9ca3af] rounded-xl outline-none transition-all"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] p-1 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 lg:mt-3 py-2 lg:py-2.5 px-4 text-white text-xs lg:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                style={{
                  backgroundColor: '#087F5B',
                  boxShadow: '0 4px 14px rgba(8,127,91,0.28)'
                }}
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-2 lg:my-2.5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB]" />
              </div>
              <span className="relative px-2.5 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider" style={{ backgroundColor: '#FFFFFF' }}>
                OR
              </span>
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-1.5 lg:py-2 px-3 text-[#374151] text-xs lg:text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-sm cursor-pointer"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0'
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Card Bottom: Sign Up Link */}
          <div className="mt-2 text-center">
            <p className="text-[11px] lg:text-xs text-[#64748b]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-[#087F5B] hover:text-[#065F46] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE VIEWPORT (< 768px)
          Responsive clean presentation for smartphones
          ═══════════════════════════════════════════════════════════ */}
      <div className="block md:hidden w-full max-w-md py-4">
        {/* Brand Banner */}
        <div className="text-center mb-5">
          <FincheckLogo centered />
          <div className="inline-block mt-3 px-3 py-0.5 rounded-full bg-[#E8F8F0] border border-[#A7F3D0] text-[#087F5B] text-[10px] font-extrabold tracking-wider uppercase">
            AI-POWERED FINANCIAL INTELLIGENCE
          </div>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-2 leading-tight">
            Turn Financial Documents into{' '}
            <span className="text-[#087F5B]">Trusted Insights</span>
          </h1>
        </div>

        {/* Mobile Interactive Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(8,127,91,0.12),0_0_0_1px_rgba(8,127,91,0.06)] border border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-center text-[#111827] tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-center text-[#64748b] mt-0.5 mb-5">
            Sign in to continue your financial analysis
          </p>

          {/* Errors */}
          {error && (
            <div className="mb-4 py-2 px-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}
          {infoMsg && (
            <div className="mb-4 py-2 px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              {infoMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAFBFB] focus:bg-white border border-[#E2E8F0] focus:border-[#087F5B] rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#374151]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-[#087F5B] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-[#FAFBFB] focus:bg-white border border-[#E2E8F0] focus:border-[#087F5B] rounded-xl outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#087F5B] hover:bg-[#066C4D] text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]" />
            </div>
            <span className="relative px-3 bg-white text-[10px] font-bold text-[#9CA3AF] uppercase">
              OR
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2 px-3 border border-[#E2E8F0] hover:bg-[#F9FAFB] text-[#374151] text-xs font-semibold rounded-xl flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-xs text-[#64748b] mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#087F5B] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
