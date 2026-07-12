'use client';

import React from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-brand-card border-l border-brand-border shadow-dialog flex flex-col animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="px-6 py-4 border-b border-brand-divider flex items-center justify-between h-[60px]">
            <div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              {description && (
                <p className="text-[11px] text-text-secondary mt-0.5">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-brand-panel text-text-secondary hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-brand-divider bg-brand-panel flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
