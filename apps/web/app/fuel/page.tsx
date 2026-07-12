'use client';

import React from 'react';
import { Fuel } from 'lucide-react';

export default function FuelLogsPage() {
  return (
    <div className="space-y-6 select-none">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Fuel Log Registry</h2>
        <p className="text-xs text-text-secondary mt-0.5">Refueling transactions and audits</p>
      </div>

      <div
        className="bg-brand-card border border-brand-border rounded-card p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto mt-12"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="p-4 bg-accent-blue/10 rounded-full text-accent-blue mb-4">
          <Fuel size={32} />
        </div>
        <h3 className="text-sm font-semibold text-white">Fuel Registry Template</h3>
        <p className="text-xs text-text-secondary mt-2 leading-relaxed max-w-sm">
          This workspace route acts as a placeholder design shell inheriting all global theme
          variables. Ready for database integration.
        </p>
      </div>
    </div>
  );
}
