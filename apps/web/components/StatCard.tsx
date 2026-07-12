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
  sparklineData?: number[]; // Array of 7 values, e.g. [10, 15, 8, 12, 18, 14, 22]
}

export default function StatCard({
  title,
  value,
  description,
  change,
  changeType = 'neutral',
  icon: IconComponent,
  iconColor = 'text-accent-purple',
  sparklineData = [10, 12, 9, 14, 11, 16, 20],
}: StatCardProps) {
  // Compute SVG sparkline points
  const width = 80;
  const height = 30;
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor =
    changeType === 'positive'
      ? '#10B981' // Green
      : changeType === 'negative'
        ? '#EF4444' // Red
        : '#3B82F6'; // Blue

  return (
    <div className="bg-brand-card border border-brand-border rounded-card p-5 shadow-subtle flex flex-col justify-between hover:border-brand-divider transition-all group focus-within:ring-2 focus-within:ring-accent-purple">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
            {title}
          </span>
          <h3 className="text-xl font-bold text-white mt-1.5 tracking-tight select-all">{value}</h3>
        </div>
        {IconComponent && (
          <div className="p-2 bg-brand-bg rounded-lg border border-brand-border group-hover:border-brand-divider transition-colors">
            <IconComponent size={16} className={iconColor} />
          </div>
        )}
      </div>

      {/* Sparkline & Details Footer */}
      <div className="flex items-center justify-between gap-4 mt-6">
        <div>
          {change && (
            <span
              className={`font-semibold px-2 py-0.5 rounded-badge text-[10px] ${
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
          {description && (
            <p className="text-[10px] text-text-muted mt-1 select-none truncate max-w-[110px]">
              {description}
            </p>
          )}
        </div>

        {/* Mini Sparkline Chart */}
        <div className="w-[80px] h-[30px] opacity-85 group-hover:opacity-100 transition-opacity select-none">
          <svg width={width} height={height}>
            <polyline fill="none" stroke={strokeColor} strokeWidth="2" points={points} />
          </svg>
        </div>
      </div>
    </div>
  );
}
