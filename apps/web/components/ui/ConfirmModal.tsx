'use client';

import React, { memo } from 'react';
import { ShieldAlert } from 'lucide-react';
import Modal from '../Modal';

interface ConfirmModalProps {
  isOpen:      boolean;
  onClose:     () => void;
  onConfirm:   () => void;
  title:       string;
  description: React.ReactNode;
  confirmLabel?: string;
  loading?:    boolean;
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-2.5 bg-accent-red/10 rounded-xl text-accent-red-soft flex-shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div className="text-sm text-text-secondary leading-relaxed">
          {description}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
        <button type="button" onClick={onClose} className="btn btn-outline btn-sm" disabled={loading}>
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="btn btn-danger btn-sm"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            confirmLabel
          )}
        </button>
      </div>
    </Modal>
  );
}

export default memo(ConfirmModal);
