'use client';

import React, { useState } from 'react';
import { Save, Building2, Globe, Lock, Bell, Palette, CreditCard, Shield, Settings } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    alert('Settings successfully updated.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">System Settings</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage your workspace configuration, security protocols, and enterprise preferences.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {[
            { id: 'general', label: 'General Info', icon: Building2 },
            { id: 'security', label: 'Security & Access', icon: Lock },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
            { id: 'api', label: 'API Integrations', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-card text-white shadow-sm border border-brand-border'
                    : 'text-text-secondary hover:text-white hover:bg-brand-panel/50'
                }`}
                style={activeTab === tab.id ? { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' } : {}}
              >
                <Icon size={16} className={activeTab === tab.id ? 'text-accent-purple' : 'text-text-muted'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div 
          className="flex-grow bg-brand-card border border-brand-border rounded-card p-6 shadow-subtle min-h-[500px]"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          {activeTab === 'general' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-base font-semibold text-white mb-6 border-b border-brand-divider pb-4">
                Enterprise Information
              </h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label text-xs">Company Name</label>
                    <input type="text" defaultValue="VRL Logistics India" className="input-field text-sm" />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-xs">GSTIN / Tax ID</label>
                    <input type="text" defaultValue="27AADCV8956R1Z5" className="input-field text-sm" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label text-xs">Headquarters Address</label>
                  <input type="text" defaultValue="Plot 45, MIDC Industrial Area, Andheri East, Mumbai, 400093" className="input-field text-sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label text-xs">Primary Contact Email</label>
                    <input type="email" defaultValue="operations@vrl.in" className="input-field text-sm" />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-xs">Support Phone Number</label>
                    <input type="text" defaultValue="+91 1800-456-7890" className="input-field text-sm" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label text-xs">Default Currency</label>
                  <select className="input-field text-sm bg-brand-panel">
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                  </select>
                </div>

                <div className="flex items-center justify-end pt-6 border-t border-brand-divider mt-8">
                  <button type="submit" disabled={isSaving} className="btn btn-primary flex items-center gap-2">
                    <Save size={14} /> {isSaving ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-base font-semibold text-white mb-6 border-b border-brand-divider pb-4 flex items-center gap-2">
                <Shield size={18} className="text-accent-blue" />
                Security & Access Policies
              </h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-brand-panel rounded-lg border border-brand-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-text-secondary mt-1">Require all administrative users to use 2FA for login.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-brand-card border border-brand-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-purple"></div>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-brand-panel rounded-lg border border-brand-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Enforce Strong Passwords</h4>
                      <p className="text-xs text-text-secondary mt-1">Require at least 12 characters, numbers, and symbols.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-brand-card border border-brand-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-purple"></div>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-brand-panel rounded-lg border border-brand-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Session Timeout</h4>
                      <p className="text-xs text-text-secondary mt-1">Automatically log out inactive users.</p>
                    </div>
                    <select className="input-field text-xs bg-brand-card py-1.5 px-3 max-w-[150px]">
                      <option>15 Minutes</option>
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                      <option>Never</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'general' && activeTab !== 'security' && (
            <div className="flex flex-col items-center justify-center h-64 text-center animate-in fade-in">
              <div className="p-4 bg-brand-panel rounded-full text-text-muted mb-4">
                <Settings size={32} />
              </div>
              <h3 className="text-sm font-semibold text-white capitalize">{activeTab} Settings</h3>
              <p className="text-xs text-text-secondary mt-1 max-w-sm">
                This configuration module is currently being finalized. Check back after the next release update.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
