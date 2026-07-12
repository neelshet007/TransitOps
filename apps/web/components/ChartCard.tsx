import React, { memo, Suspense } from 'react';

interface ChartCardProps {
  title:     string;
  subtitle?: string;
  children:  React.ReactNode;
  actions?:  React.ReactNode;
  minHeight?: number;
}

function ChartCardFallback({ height }: { height: number }) {
  return (
    <div
      className="w-full shimmer-bg rounded"
      style={{ height }}
    />
  );
}

function ChartCardComponent({
  title,
  subtitle,
  children,
  actions,
  minHeight = 260,
}: ChartCardProps) {
  return (
    <div className="card p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-brand-border">
        <div className="min-w-0">
          <h4 className="section-title">{title}</h4>
          {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
      <div className="flex-1 w-full" style={{ minHeight }}>
        <Suspense fallback={<ChartCardFallback height={minHeight} />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}

export default memo(ChartCardComponent);
