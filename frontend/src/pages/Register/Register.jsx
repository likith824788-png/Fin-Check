import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('Acme Industries');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, { displayName: name, companyName: company });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface p-8 lg:p-10 rounded-card border border-border shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-extrabold text-navy-900 text-lg tracking-tight">FINCHECK AI</span>
        </div>

        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">
          Create Auditor Account
        </h2>
        <p className="text-xs text-navy-500 mt-1 mb-6">
          Set up your organization workspace for automated consistency review.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-navy-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe, CPA"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAFBFB] focus:bg-white border border-border focus:border-brand-emerald rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Company / Firm</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-navy-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Industries"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAFBFB] focus:bg-white border border-border focus:border-brand-emerald rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-navy-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAFBFB] focus:bg-white border border-border focus:border-brand-emerald rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-navy-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAFBFB] focus:bg-white border border-border focus:border-brand-emerald rounded-lg outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-dark hover:bg-[#065f46] text-white text-sm font-semibold rounded-lg shadow-subtle transition-all flex items-center justify-center gap-2 mt-2"
          >
            Create Workspace
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-navy-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-dark hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
