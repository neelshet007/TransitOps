'use client';

import React, { useEffect, useCallback, memo } from 'react';
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
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end"
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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className={`relative ${width} w-full bg-brand-card border-l border-brand-border shadow-xl flex flex-col h-full`}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between px-6 py-4 border-b border-brand-border flex-shrink-0"
              style={{ minHeight: 58 }}
            >
              <div className="min-w-0 pr-4">
                <h2
                  id="drawer-title"
                  className="text-sm font-semibold text-text-primary leading-tight"
                >
                  {title}
                </h2>
                {description && (
                  <p className="text-xs text-text-secondary mt-0.5">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="btn-icon flex-shrink-0"
                aria-label="Close panel"
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
              <div className="flex-shrink-0 px-6 py-4 border-t border-brand-border bg-brand-panel flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default memo(DrawerComponent);
