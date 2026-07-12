'use client';

import React, { useState } from 'react';
import { Save, Building2, Lock, Bell, Palette, CreditCard, Globe, Settings, Shield } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';

const TABS = [
  { id: 'general',       label: 'General',        icon: Building2 },
  { id: 'security',      label: 'Security',        icon: Lock },
  { id: 'notifications', label: 'Notifications',   icon: Bell },
  { id: 'appearance',    label: 'Appearance',      icon: Palette },
  { id: 'billing',       label: 'Billing',         icon: CreditCard },
  { id: 'api',           label: 'API',             icon: Globe },
];

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${on ? 'bg-accent-purple' : 'bg-brand-elevated border border-brand-border'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving,    setSaving]    = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="System Settings" description="Manage workspace configuration, security protocols, and enterprise preferences" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <nav className="w-full lg:w-56 flex-shrink-0 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0" aria-label="Settings navigation">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  active
                    ? 'bg-accent-purple/10 text-text-primary border border-accent-purple/20'
                    : 'text-text-muted hover:text-text-secondary hover:bg-brand-elevated'
                }`}
              >
                <Icon size={15} className={active ? 'text-accent-purple-mid' : 'text-text-disabled'} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content panel */}
        <div className="flex-1 card p-6 min-h-[480px]">
          {activeTab === 'general' && (
            <form onSubmit={handleSave} className="space-y-6">
              <h3 className="section-title pb-4 border-b border-brand-border">Enterprise Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input type="text" defaultValue="VRL Logistics India" className="input-field" />
                </div>
                <div className="form-group">
                  <label className="form-label">GSTIN / Tax ID</label>
                  <input type="text" defaultValue="27AADCV8956R1Z5" className="input-field font-mono" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Headquarters Address</label>
                <input type="text" defaultValue="Plot 45, MIDC Industrial Area, Andheri East, Mumbai, 400093" className="input-field" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-group">
                  <label className="form-label">Primary Contact Email</label>
                  <input type="email" defaultValue="operations@vrl.in" className="input-field" />
                </div>
                <div className="form-group">
                  <label className="form-label">Support Phone</label>
                  <input type="text" defaultValue="+91 1800-456-7890" className="input-field" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Default Currency</label>
                <select className="input-field">
                  <option value="INR">INR (₹) – Indian Rupee</option>
                  <option value="USD">USD ($) – US Dollar</option>
                </select>
              </div>
              <div className="flex justify-end pt-4 border-t border-brand-border">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? (<><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>) : (<><Save size={14} />Save Configuration</>)}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <h3 className="section-title pb-4 border-b border-brand-border flex items-center gap-2">
                <Shield size={16} className="text-accent-blue-soft" /> Security & Access Policies
              </h3>
              {[
                { label: 'Two-Factor Authentication', desc: 'Require all admins to use 2FA on login.', on: true },
                { label: 'Enforce Strong Passwords', desc: 'Minimum 12 chars with numbers and symbols.', on: true },
                { label: 'IP Allowlist', desc: 'Restrict access to pre-approved IP ranges.', on: false },
                { label: 'Session Recording', desc: 'Log user actions for compliance auditing.', on: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 card card-hover">
                  <div>
                    <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle defaultChecked={item.on} />
                </div>
              ))}
              <div className="flex items-center justify-between p-4 card">
                <div>
                  <p className="text-xs font-semibold text-text-primary">Session Timeout</p>
                  <p className="text-xs text-text-muted mt-0.5">Auto-logout inactive users after a period.</p>
                </div>
                <select className="input-field w-auto text-xs">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>Never</option>
                </select>
              </div>
            </div>
          )}

          {activeTab !== 'general' && activeTab !== 'security' && (
            <div className="empty-state h-full">
              <div className="empty-state-icon w-14 h-14">
                <Settings size={24} />
              </div>
              <p className="text-sm font-semibold text-text-secondary capitalize">{activeTab} Settings</p>
              <p className="text-xs text-text-muted max-w-xs">
                This configuration module is being finalised. Check back in the next release.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
