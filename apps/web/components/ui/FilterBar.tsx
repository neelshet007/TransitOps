'use client';

import React, { memo } from 'react';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterBarProps {
  filters:  FilterOption[];
  active:   string;
  onChange: (value: string) => void;
  children?: React.ReactNode;
}

function FilterBar({ filters, active, onChange, children }: FilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-1.5 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`filter-tab ${active === f.value ? 'active' : ''}`}
            aria-pressed={active === f.value}
          >
            {f.label}
            {f.count != null && (
              <span className={`text-2xs px-1.5 py-0.5 rounded-full font-semibold ${
                active === f.value
                  ? 'bg-accent-purple/20 text-accent-purple-soft'
                  : 'bg-brand-elevated text-text-muted'
              }`}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export default memo(FilterBar);
