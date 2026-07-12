'use client';

import React from 'react';
import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="space-y-6 select-none">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Maintenance Calendar</h2>
        <p className="text-xs text-text-secondary mt-0.5">Preventative servicing schedules</p>
      </div>

      <div
        className="bg-brand-card border border-brand-border rounded-card p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto mt-12"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="p-4 bg-accent-amber/10 rounded-full text-accent-amber mb-4">
          <Wrench size={32} />
        </div>
        <h3 className="text-sm font-semibold text-white">Maintenance Schedule Template</h3>
        <p className="text-xs text-text-secondary mt-2 leading-relaxed max-w-sm">
          This workspace route acts as a placeholder design shell inheriting all global theme
          variables. Ready for database integration.
        </p>
      </div>
    </div>
  );
}
