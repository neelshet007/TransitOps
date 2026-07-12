'use client';

import React, { useState } from 'react';
import { Camera, Save, User, Mail, Shield, Smartphone, Key } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useAuth } from '../../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : 'SA';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="My Profile"
        description="Manage your personal account details, credentials, and contact preferences"
      />

      <div className="card overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-brand-elevated via-accent-purple/10 to-brand-elevated relative" />

        {/* Avatar */}
        <div className="relative px-6 pb-6">
          <div className="absolute -top-10 left-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full border-4 bg-brand-card flex items-center justify-center text-2xl font-bold text-accent-purple-soft bg-accent-purple/10" style={{ borderColor: 'var(--bg-card)' }}>
                {initials}
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-brand-elevated border border-brand-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors" aria-label="Change avatar">
                <Camera size={12} />
              </button>
            </div>
          </div>

          <div className="pt-12">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Personal */}
              <div>
                <h3 className="section-title pb-3 border-b border-brand-border mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className="input-with-icon">
                      <User size={14} className="input-icon" />
                      <input type="text" defaultValue={user ? `${user.first_name} ${user.last_name}` : 'System Admin'} className="input-field" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={14} className="input-icon" />
                      <input type="email" defaultValue={user?.email ?? 'admin@transitops.com'} className="input-field opacity-60 cursor-not-allowed" disabled />
                    </div>
                    <p className="text-2xs text-text-muted mt-1">Contact your IT admin to change email.</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <div className="input-with-icon">
                      <Smartphone size={14} className="input-icon" />
                      <input type="tel" defaultValue="+91 98765 43210" className="input-field" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <div className="input-with-icon">
                      <Shield size={14} className="input-icon text-accent-purple-mid" />
                      <input type="text" defaultValue={user?.roles?.[0] ?? 'Super Admin'} className="input-field opacity-60 cursor-not-allowed font-semibold" disabled />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div>
                <h3 className="section-title pb-3 border-b border-brand-border mb-4">Security</h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 card">
                    <div>
                      <p className="text-xs font-semibold text-text-primary">Password</p>
                      <p className="text-xs text-text-muted mt-0.5">Last changed 45 days ago.</p>
                    </div>
                    <button type="button" className="btn btn-secondary btn-sm w-fit">
                      <Key size={13} /> Change Password
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 card">
                    <div>
                      <p className="text-xs font-semibold text-text-primary">Two-Factor Authentication</p>
                      <p className="text-xs text-text-muted mt-0.5">Add an extra layer of login security.</p>
                    </div>
                    <button type="button" className="btn btn-primary btn-sm w-fit">Enable 2FA</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-brand-border">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? (<><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>) : (<><Save size={14} />Save Changes</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
