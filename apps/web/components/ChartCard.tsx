import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function ChartCard({ title, subtitle, children, actions }: ChartCardProps) {
  return (
    <div className="bg-brand-card border border-brand-border rounded-card p-6 shadow-subtle flex flex-col">
      <div className="flex items-center justify-between border-b border-brand-divider pb-4 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="flex-1 w-full min-h-[260px] relative">{children}</div>
    </div>
  );
}
