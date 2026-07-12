'use client';

import React, { useEffect, useCallback, memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen:       boolean;
  onClose:      () => void;
  title:        string;
  description?: string;
  children:     React.ReactNode;
  footer?:      React.ReactNode;
  width?:       string;
}

function DrawerComponent({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'max-w-md',
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex justify-end"
          style={{ zIndex: 9999 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 bg-black/70"
            style={{ backdropFilter: 'blur(4px)', zIndex: 9998 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative ${width} w-full border-l border-brand-border shadow-xl flex flex-col h-full`}
            style={{ backgroundColor: 'var(--bg-card)', zIndex: 9999 }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between px-6 py-4 border-b border-brand-border flex-shrink-0"
              style={{ minHeight: 58 }}
            >
              <div className="min-w-0 pr-4">
                <h2 id="drawer-title" className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h2>
                {description && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="btn-icon flex-shrink-0"
                aria-label="Close panel"
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {children}
            </div>

            {/* Optional footer */}
            {footer && (
              <div
                className="flex-shrink-0 px-6 py-4 border-t border-brand-border flex items-center justify-end gap-3"
                style={{ backgroundColor: 'var(--bg-panel)' }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default memo(DrawerComponent);
