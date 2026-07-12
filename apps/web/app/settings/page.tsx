'use client';

import React, { useState } from 'react';
import { Settings, Bell, Shield, Database } from 'lucide-react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    companyName: 'Apex Logistics Operations Inc.',
    timezone: 'America/New_York',
    currency: 'USD',
    idleAlert: '15',
    speedAlert: '75',
    sessionTimeout: '900',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">System Settings</h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Configure general parameters, alert triggers, and security controls for the ERP
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Tabs Column */}
        <div className="bg-brand-card border border-brand-border rounded-card p-4 space-y-1 h-fit select-none">
          <button className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs text-white bg-brand-panel border border-brand-border rounded-button font-medium">
            <Settings size={14} className="text-accent-purple" /> General Profile
          </button>
          <button className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs text-text-secondary hover:text-white hover:bg-brand-panel transition-colors rounded-button">
            <Bell size={14} /> Alert Triggers
          </button>
          <button className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs text-text-secondary hover:text-white hover:bg-brand-panel transition-colors rounded-button">
            <Shield size={14} /> Security Controls
          </button>
          <button className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs text-text-secondary hover:text-white hover:bg-brand-panel transition-colors rounded-button">
            <Database size={14} /> Database Sync
          </button>
        </div>

        {/* Right Settings Form Column */}
        <div className="lg:col-span-3 bg-brand-card border border-brand-border rounded-card p-6">
          <h4 className="text-sm font-semibold text-white mb-4 border-b border-brand-divider pb-4">
            General Configuration
          </h4>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="form-group">
              <label className="form-label text-xs">Registered Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label text-xs">Standard Timezone</label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="input-field text-xs bg-brand-panel"
                >
                  <option value="America/New_York">Eastern Standard (EST)</option>
                  <option value="America/Chicago">Central Standard (CST)</option>
                  <option value="America/Denver">Mountain Standard (MST)</option>
                  <option value="America/Los_Angeles">Pacific Standard (PST)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label text-xs">Operating Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="input-field text-xs bg-brand-panel"
                >
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="CAD">Canadian Dollar (C$)</option>
                </select>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-white mb-4 border-b border-brand-divider pt-6 pb-4">
              Alert Trigger Configurations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label text-xs">Max Idle Alert (Minutes)</label>
                <input
                  type="number"
                  name="idleAlert"
                  value={formData.idleAlert}
                  onChange={handleInputChange}
                  required
                  className="input-field text-xs"
                />
              </div>
              <div className="form-group">
                <label className="form-label text-xs">Speed Alert Threshold (mph)</label>
                <input
                  type="number"
                  name="speedAlert"
                  value={formData.speedAlert}
                  onChange={handleInputChange}
                  required
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-brand-divider">
              <button type="submit" className="btn btn-primary text-xs">
                Save Configurations
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
