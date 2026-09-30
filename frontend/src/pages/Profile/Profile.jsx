import React, { useState } from 'react';
import {
  User,
  Building2,
  Sliders,
  ShieldCheck,
  Sparkles,
  Database,
  CheckCircle2,
  Save,
  Check,
  Mail,
  Phone,
  MapPin,
  Award,
  Briefcase,
  FileCheck,
  Lock,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();

  // Auditor Profile State
  const [profileName, setProfileName] = useState(user?.displayName || 'Alex Mercer, CPA');
  const [email, setEmail] = useState('alex.mercer@apexaudit.com');
  const [licenseNo, setLicenseNo] = useState('CPA-US #849201 / ICAI Fellow #409218');
  const [firmName, setFirmName] = useState('Apex Audit & Advisory LLP');
  const [roleTitle, setRoleTitle] = useState('Lead Senior Financial Auditor & Engagement Partner');
  const [officeLocation, setOfficeLocation] = useState('Mumbai Financial Centre / New York');

  // Existed Auditor Parameters State
  const [materialityThreshold, setMaterialityThreshold] = useState('5.0');
  const [toleranceThreshold, setToleranceThreshold] = useState('0.5');
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [baseUnit, setBaseUnit] = useState('crore');
  const [auditScope, setAuditScope] = useState('consolidated');
  const [minConfidence, setMinConfidence] = useState('95');

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="pb-2 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Auditor Profile & Audit Parameters
          </h1>
          <p className="text-xs text-navy-500 mt-0.5">
            Manage your certified auditor profile credentials and active financial consistency parameters.
          </p>
        </div>

        {saved && (
          <div className="px-3.5 py-1.5 bg-brand-mint text-brand-dark border border-brand-emerald/30 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-brand-dark" />
            <span>Profile & Parameters Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: AUDITOR PROFILE DETAILS */}
        <div className="bg-surface p-6 rounded-card border border-border shadow-xs space-y-6">
          <div className="pb-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-mint text-brand-dark flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-navy-900">
                  Certified Auditor Profile
                </h2>
                <p className="text-[11px] text-navy-500">
                  Authorized Signatory & Lead Engagement Credentials
                </p>
              </div>
            </div>

            <span className="px-2.5 py-0.5 bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] text-[10px] font-bold rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Licensed Lead Auditor
            </span>
          </div>

          {/* Profile Card Header with Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-background rounded-xl border border-border">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces"
              alt="Auditor Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-dark shadow-xs"
            />
            <div className="text-center sm:text-left space-y-0.5">
              <h3 className="text-base font-extrabold text-navy-900">{profileName}</h3>
              <p className="text-xs text-brand-dark font-bold">{roleTitle}</p>
              <p className="text-[11px] text-navy-500">{firmName} • {officeLocation}</p>
            </div>
          </div>

          {/* Profile Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-navy-800 mb-1">
                Full Auditor Name & Designation
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-brand-emerald font-semibold text-navy-900"
              />
            </div>

            <div>
              <label className="block font-bold text-navy-800 mb-1">
                Professional CPA / Regulatory License No.
              </label>
              <input
                type="text"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-brand-emerald font-mono font-semibold text-navy-900"
              />
            </div>

            <div>
              <label className="block font-bold text-navy-800 mb-1">
                Audit Firm / Practice Name
              </label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-brand-emerald font-semibold text-navy-900"
              />
            </div>

            <div>
              <label className="block font-bold text-navy-800 mb-1">
                Official Auditor Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-brand-emerald font-semibold text-navy-900"
              />
            </div>

            <div>
              <label className="block font-bold text-navy-800 mb-1">
                Engagement Role & Title
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-brand-emerald font-semibold text-navy-900"
              />
            </div>

            <div>
              <label className="block font-bold text-navy-800 mb-1">
                Office / Regional Location
              </label>
              <input
                type="text"
                value={officeLocation}
                onChange={(e) => setOfficeLocation(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-brand-emerald font-semibold text-navy-900"
              />
            </div>
          </div>

          {/* Active Client Engagement */}
          <div className="p-3.5 bg-brand-mint/30 rounded-xl border border-brand-emerald/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-dark" />
              <div>
                <span className="text-[10px] text-navy-500 font-bold uppercase block">Active Audit Client Portfolio</span>
                <span className="font-extrabold text-navy-900">Acme Industries Limited (FY2025-26 Statutory Review)</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-brand-dark bg-brand-mint px-2 py-0.5 rounded border border-brand-emerald/30">
              In Progress
            </span>
          </div>
        </div>

        {/* SECTION 2: EXISTED AUDITOR PARAMETERS */}
        <div className="bg-surface p-6 rounded-card border border-border shadow-xs space-y-6">
          <div className="pb-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-pink text-[#E45757] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-navy-900">
                  Existed Auditor Parameters & Tolerances
                </h2>
                <p className="text-[11px] text-navy-500">
                  Deterministic thresholds applied by the comparison engine
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-brand-dark bg-brand-mint px-2 py-0.5 rounded">
              Base: INR Crore
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-navy-800 mb-1">
                Discrepancy Materiality Threshold (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={materialityThreshold}
                  onChange={(e) => setMaterialityThreshold(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none font-mono font-bold text-navy-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-500 font-bold">%</span>
              </div>
              <span className="text-[10px] text-navy-500 mt-1 block">
                Variances &gt; 5.0% are flagged as Potential Issues.
              </span>
            </div>

            <div>
              <label className="block font-bold text-navy-800 mb-1">
                Immaterial Tolerance Threshold (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={toleranceThreshold}
                  onChange={(e) => setToleranceThreshold(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none font-mono font-bold text-navy-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-500 font-bold">%</span>
              </div>
              <span className="text-[10px] text-navy-500 mt-1 block">
                Variances &le; 0.5% classified as Consistent.
              </span>
            </div>

            <div>
              <label className="block font-bold text-navy-800 mb-1">
                Minimum Verification Confidence (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none font-mono font-bold text-navy-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-500 font-bold">%</span>
              </div>
              <span className="text-[10px] text-navy-500 mt-1 block">
                Gemma confidence required to mark verified.
              </span>
            </div>

            <div>
              <label className="block font-bold text-navy-800 mb-1">
                Base Reporting Currency
              </label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none font-bold text-navy-900"
              >
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-navy-800 mb-1">
                Normalization Base Unit
              </label>
              <select
                value={baseUnit}
                onChange={(e) => setBaseUnit(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none font-bold text-navy-900 capitalize"
              >
                <option value="crore">Crore (10,000,000)</option>
                <option value="lakh">Lakh (100,000)</option>
                <option value="million">Million (1,000,000)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-navy-800 mb-1">
                Default Audit Scope
              </label>
              <select
                value={auditScope}
                onChange={(e) => setAuditScope(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none font-bold text-navy-900 capitalize"
              >
                <option value="consolidated">Consolidated Group</option>
                <option value="standalone">Standalone Entity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-dark hover:bg-[#065f46] text-white text-xs font-bold rounded-lg shadow-subtle flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Audit Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
}
