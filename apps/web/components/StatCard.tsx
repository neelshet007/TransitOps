import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title:         string;
  value:         string | number;
  description?:  string;
  change?:       string;
  changeType?:   'positive' | 'negative' | 'neutral';
  icon?:         LucideIcon;
  iconColor?:    string;
  iconBg?:       string;
  sparklineData?: number[];
  loading?:      boolean;
}

const strokeColors = {
  positive: '#34D399',
  negative: '#F87171',
  neutral:  '#60A5FA',
};

function SparklineSVG({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const W = 72;
  const H = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  // Fill area
  const fillPoints = `0,${H} ${points} ${W},${H}`;

  return (
    <svg width={W} height={H} aria-hidden="true">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={fillPoints}
        fill={`url(#sg-${color.replace('#','')})`}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

function StatCardComponent({
  title,
  value,
  description,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-accent-purple-mid',
  iconBg = 'bg-accent-purple/10',
  sparklineData = [10, 12, 9, 14, 11, 16, 20],
  loading = false,
}: StatCardProps) {
  const strokeColor = strokeColors[changeType];

  if (loading) {
    return (
      <div className="stat-card">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="shimmer-bg h-3 w-20 rounded" />
            <div className="shimmer-bg h-7 w-32 rounded" />
          </div>
          <div className="shimmer-bg w-9 h-9 rounded-lg" />
        </div>
        <div className="flex items-end justify-between">
          <div className="shimmer-bg h-3 w-24 rounded" />
          <div className="shimmer-bg h-7 w-18 rounded" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="stat-card card-hover group"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label-xs">{title}</p>
          <p className="text-xl font-bold text-text-primary mt-1.5 leading-none tracking-tight">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`p-2 rounded-xl border border-transparent ${iconBg} flex-shrink-0 transition-transform group-hover:scale-105`}
          >
            <Icon size={17} className={iconColor} aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Bottom row */}
      <div className="flex items-end justify-between gap-3 mt-auto">
        <div className="space-y-1 min-w-0">
          {change && (
            <div className="flex items-center gap-1">
              {changeType === 'positive' && <TrendingUp size={11} className="text-accent-green-soft flex-shrink-0" />}
              {changeType === 'negative' && <TrendingDown size={11} className="text-accent-red-soft flex-shrink-0" />}
              <span
                className={`text-2xs font-semibold ${
                  changeType === 'positive' ? 'text-accent-green-soft' :
                  changeType === 'negative' ? 'text-accent-red-soft' :
                  'text-text-muted'
                }`}
              >
                {change}
              </span>
            </div>
          )}
          {description && (
            <p className="text-2xs text-text-muted truncate">{description}</p>
          )}
        </div>
        <div className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
          <SparklineSVG data={sparklineData} color={strokeColor} />
        </div>
      </div>
    </motion.div>
  );
}

export default memo(StatCardComponent);
