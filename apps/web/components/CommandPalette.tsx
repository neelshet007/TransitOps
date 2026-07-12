'use client';

import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Compass,
  Truck,
  Users,
  Settings,
  Wrench,
  Terminal,
  BarChart3,
  FileText,
  CreditCard,
  Fuel,
  ArrowRight,
} from 'lucide-react';

const commands = [
  { title: 'Dashboard',          path: '/dashboard',    icon: Terminal,  group: 'Navigate' },
  { title: 'Vehicles',           path: '/vehicles',     icon: Truck,     group: 'Navigate' },
  { title: 'Drivers',            path: '/drivers',      icon: Users,     group: 'Navigate' },
  { title: 'Trips & Dispatch',   path: '/trips',        icon: Compass,   group: 'Navigate' },
  { title: 'Maintenance',        path: '/maintenance',  icon: Wrench,    group: 'Navigate' },
  { title: 'Fuel Logs',          path: '/fuel',         icon: Fuel,      group: 'Navigate' },
  { title: 'Expenses',           path: '/expenses',     icon: CreditCard,group: 'Navigate' },
  { title: 'Analytics',          path: '/analytics',    icon: BarChart3, group: 'Navigate' },
  { title: 'Reports',            path: '/reports',      icon: FileText,  group: 'Navigate' },
  { title: 'System Settings',    path: '/settings',     icon: Settings,  group: 'Navigate' },
];

function CommandPalette() {
  const [isOpen,  setIsOpen]  = useState(false);
  const [query,   setQuery]   = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);  const [focused, setFocused] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  const open  = useCallback(() => { setIsOpen(true);  setQuery(''); setFocused(0); }, []);
  const close = useCallback(() => { setIsOpen(false); setQuery(''); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((o) => { if (!o) { setQuery(''); setFocused(0); } return !o; });
      }
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  const filtered = query.trim()
    ? commands.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const navigate = useCallback((path: string) => {
    router.push(path);
    close();
  }, [router, close]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused((f) => Math.min(f + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setFocused((f) => Math.max(f - 1, 0)); }
    if (e.key === 'Enter' && filtered[focused]) navigate(filtered[focused].path);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-start justify-center pt-[12vh] px-4"
          style={{ zIndex: 99999 }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          {/* Backdrop */}
          <motion.div
            key="cp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/75"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={close}
          />

          {/* Panel */}
          <motion.div
            key="cp-panel"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{ opacity: 0, scale: 0.96,    y: -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-xl bg-brand-card border border-brand-border rounded-dialog shadow-xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-brand-border">
              <Search size={16} className="text-text-muted flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setFocused(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search pages or commands…"
                className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
              <kbd className="text-2xs font-semibold px-1.5 py-0.5 rounded border border-brand-border text-text-muted bg-brand-elevated">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="py-1.5 max-h-[380px] overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-10">
                  No results for "{query}"
                </p>
              ) : (
                (() => {
                  const groups = Array.from(new Set(filtered.map((c) => c.group)));
                  let idx = -1;
                  return groups.map((group) => {
                    const items = filtered.filter((c) => c.group === group);
                    return (
                      <div key={group}>
                        <p className="label-xs px-4 pt-3 pb-1">{group}</p>
                        {items.map((cmd) => {
                          idx++;
                          const i = idx;
                          const Icon = cmd.icon;
                          const isFocused = i === focused;
                          return (
                            <button
                              key={cmd.path}
                              onMouseEnter={() => setFocused(i)}
                              onClick={() => navigate(cmd.path)}
                              className={`flex items-center justify-between gap-3 w-full text-left px-4 py-2.5 transition-colors ${
                                isFocused
                                  ? 'bg-brand-elevated text-text-primary'
                                  : 'text-text-secondary hover:bg-brand-elevated'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-md ${isFocused ? 'bg-accent-purple/15' : 'bg-brand-panel'}`}>
                                  <Icon size={14} className={isFocused ? 'text-accent-purple-mid' : 'text-text-muted'} />
                                </div>
                                <span className="text-sm">{cmd.title}</span>
                              </div>
                              {isFocused && <ArrowRight size={14} className="text-text-muted" />}
                            </button>
                          );
                        })}
                      </div>
                    );
                  });
                })()
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-brand-border">
              <span className="text-2xs text-text-muted flex items-center gap-1">
                <kbd className="px-1 border border-brand-border rounded text-[10px] bg-brand-elevated">↑↓</kbd> navigate
              </span>
              <span className="text-2xs text-text-muted flex items-center gap-1">
                <kbd className="px-1 border border-brand-border rounded text-[10px] bg-brand-elevated">↵</kbd> select
              </span>
              <span className="text-2xs text-text-muted flex items-center gap-1">
                <kbd className="px-1 border border-brand-border rounded text-[10px] bg-brand-elevated">ESC</kbd> close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default memo(CommandPalette);
