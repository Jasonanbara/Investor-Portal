'use client';

import React, { useEffect, useCallback } from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = 'md',
  title,
  description,
  children,
  className = '',
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={[
          'relative z-10 w-full rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-6 shadow-2xl',
          'animate-[slideUp_0.2s_ease-out]',
          sizeClasses[size],
          className,
        ].join(' ')}
      >
        {title && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#CFD2E5]">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-[#8b8fa3]">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>

      {/* Keyframe style (injected once) */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

Modal.displayName = 'Modal';

/* ------------------------------------------------------------------ */
/*  Convenience sub-components                                         */
/* ------------------------------------------------------------------ */

const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...props
}) => (
  <div
    className={['mt-6 flex items-center justify-end gap-3', className].join(' ')}
    {...props}
  />
);
ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalFooter };
export type { ModalProps, ModalSize };
