'use client';

import React, { useState } from 'react';
import { Camera, Save, User, Mail, Shield, Smartphone, Key } from 'lucide-react';

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    alert('Profile successfully updated.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Your Profile</h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Manage your personal account details, credentials, and contact preferences.
        </p>
      </div>

      <div className="bg-brand-card border border-brand-border rounded-card overflow-hidden shadow-subtle">
        {/* Profile Header Banner */}
        <div className="h-32 bg-gradient-to-r from-brand-panel to-accent-purple/20 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 bg-brand-card border-4 border-brand-card rounded-full flex items-center justify-center relative group">
              <div className="w-full h-full rounded-full bg-accent-purple/20 text-accent-purple flex items-center justify-center font-bold text-2xl">
                RK
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-brand-panel border border-brand-border rounded-full text-text-secondary hover:text-white transition-colors group-hover:bg-accent-purple group-hover:text-white">
                <Camera size={14} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="pt-16 p-6">
          <form onSubmit={handleSave} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white border-b border-brand-divider pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label text-xs">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <User size={14} />
                    </div>
                    <input type="text" defaultValue="Rajesh Kumar" className="input-field text-sm pl-9" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <Mail size={14} />
                    </div>
                    <input type="email" defaultValue="rajesh.k@vrl.in" className="input-field text-sm pl-9" disabled />
                  </div>
                  <p className="text-[10px] text-text-muted mt-1">Contact your IT admin to change email address.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label text-xs">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <Smartphone size={14} />
                    </div>
                    <input type="tel" defaultValue="+91 98765 43210" className="input-field text-sm pl-9" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-accent-purple">
                      <Shield size={14} />
                    </div>
                    <input type="text" defaultValue="Super Admin" className="input-field text-sm pl-9 font-medium text-accent-purple bg-brand-panel border-accent-purple/20" disabled />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white border-b border-brand-divider pb-2">
                Security & Authentication
              </h3>
              
              <div className="p-4 bg-brand-panel rounded-lg border border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Password</h4>
                  <p className="text-xs text-text-secondary mt-1">Last changed 45 days ago.</p>
                </div>
                <button type="button" className="btn btn-outline text-xs flex items-center gap-2 w-fit">
                  <Key size={14} /> Change Password
                </button>
              </div>
              
              <div className="p-4 bg-brand-panel rounded-lg border border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-text-secondary mt-1">Add an extra layer of security to your account.</p>
                </div>
                <button type="button" className="btn btn-primary text-xs w-fit">
                  Enable 2FA
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-brand-divider">
              <button type="submit" disabled={isSaving} className="btn btn-primary flex items-center gap-2">
                <Save size={14} /> {isSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
