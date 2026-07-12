import React, { memo } from 'react';

interface InfoRowProps {
  label:    string;
  value:    React.ReactNode;
  mono?:    boolean;
}

function InfoRow({ label, value, mono = false }: InfoRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-brand-border last:border-0">
      <span className="text-xs text-text-muted flex-shrink-0">{label}</span>
      <span className={`text-xs font-medium text-text-primary text-right ${mono ? 'font-mono' : ''}`}>
        {value ?? <span className="text-text-disabled">—</span>}
      </span>
    </div>
  );
}

export default memo(InfoRow);
