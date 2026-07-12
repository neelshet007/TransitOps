import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  description,
  change,
  changeType = 'neutral',
  icon: IconComponent,
  iconColor = 'text-accent-purple',
}: StatCardProps) {
  return (
    <div className="bg-brand-card border border-brand-border rounded-card p-6 shadow-subtle flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-white mt-1.5 tracking-tight">{value}</h3>
        </div>
        {IconComponent && (
          <div className={`p-2.5 bg-brand-bg rounded-lg border border-brand-border`}>
            <IconComponent size={20} className={iconColor} />
          </div>
        )}
      </div>
      {(change || description) && (
        <div className="flex items-center gap-2 mt-4 text-xs">
          {change && (
            <span
              className={`font-semibold px-1.5 py-0.5 rounded-badge ${
                changeType === 'positive'
                  ? 'bg-accent-green/10 text-accent-green'
                  : changeType === 'negative'
                    ? 'bg-accent-red/10 text-accent-red'
                    : 'bg-text-muted/10 text-text-secondary'
              }`}
            >
              {change}
            </span>
          )}
          {description && <span className="text-text-muted truncate">{description}</span>}
        </div>
      )}
    </div>
  );
}
