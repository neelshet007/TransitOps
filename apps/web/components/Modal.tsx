'use client';

import React, { useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen:       boolean;
  onClose:      () => void;
  title:        string;
  description?: string;
  children:     React.ReactNode;
  size?:        'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

function ModalComponent({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: ModalProps) {
  // Close on Escape
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className={`relative w-full ${sizeClasses[size]} bg-brand-card border border-brand-border rounded-dialog shadow-xl overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-brand-border">
              <div className="min-w-0 pr-4">
                <h2
                  id="modal-title"
                  className="text-sm font-semibold text-text-primary leading-tight"
                >
                  {title}
                </h2>
                {description && (
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="btn-icon flex-shrink-0 -mt-0.5 -mr-1"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[calc(100dvh-180px)] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default memo(ModalComponent);
