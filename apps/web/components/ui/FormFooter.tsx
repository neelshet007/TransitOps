import React, { memo } from 'react';

interface FormFooterProps {
  onCancel:     () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?:     boolean;
  disabled?:    boolean;
}

function FormFooter({
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading     = false,
  disabled    = false,
}: FormFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-brand-border">
      <button
        type="button"
        onClick={onCancel}
        className="btn btn-outline btn-sm"
        disabled={loading}
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={loading || disabled}
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </div>
  );
}

export default memo(FormFooter);
