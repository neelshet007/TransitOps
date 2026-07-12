'use client';

import React, { memo } from 'react';

interface Tab {
  id:    string;
  label: string;
}

interface DrawerTabsProps {
  tabs:     Tab[];
  active:   string;
  onChange: (id: string) => void;
}

function DrawerTabs({ tabs, active, onChange }: DrawerTabsProps) {
  return (
    <div
      className="flex items-center gap-0.5 border-b border-brand-border -mx-6 px-6 mb-2"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
            active === tab.id
              ? 'border-accent-purple-mid text-text-primary'
              : 'border-transparent text-text-muted hover:text-text-secondary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default memo(DrawerTabs);
