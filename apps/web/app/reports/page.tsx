'use client';

import React from 'react';
import { FileText, Download } from 'lucide-react';

export default function ReportsPage() {
  const reportsList = [
    { title: 'Q2 Fleet Maintenance Report', size: '2.4 MB', date: 'Jul 10, 2026' },
    { title: 'Driver Log & Hours audit', size: '1.8 MB', date: 'Jul 05, 2026' },
    { title: 'Operational Revenue Log v2', size: '4.1 MB', date: 'Jun 30, 2026' },
    { title: 'Volumetric Fuel Consumption Summary', size: '920 KB', date: 'Jun 25, 2026' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Operations Reports</h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Download pre-compiled monthly operations spreadsheets, tax invoices, and logs
        </p>
      </div>

      <div className="bg-brand-card border border-brand-border rounded-card p-6 shadow-subtle">
        <h4 className="text-sm font-semibold text-white mb-4 border-b border-brand-divider pb-4">
          Available Downloads
        </h4>
        <div className="divide-y divide-brand-divider">
          {reportsList.map((rep, idx) => (
            <div key={idx} className="flex items-center justify-between py-4 select-none">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-panel border border-brand-border rounded text-accent-purple">
                  <FileText size={18} />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-white">{rep.title}</h5>
                  <p className="text-[10px] text-text-secondary mt-0.5">
                    {rep.size} • Published: {rep.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert('Downloading report file...')}
                className="btn btn-outline text-[11px] py-1.5 px-3 flex items-center gap-1.5"
              >
                <Download size={12} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
