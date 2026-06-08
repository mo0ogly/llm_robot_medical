/**
 * RtModal — Reusable accessible modal wrapper for AEGIS RedTeam Lab.
 *
 * Cycle 004 R4.2 (PDCA): centralizes a11y patterns that were missing on the
 * 4 existing modals (0 role="dialog", no focus trap, no Escape handler).
 *
 * Features:
 *  - role="dialog" + aria-modal + aria-labelledby
 *  - Focus trap: Tab cycles within the modal, Shift+Tab reverses
 *  - Restores focus to the trigger element on close
 *  - Escape key closes the modal
 *  - Click outside the panel closes the modal (configurable)
 *  - Inherits .rt-root design tokens (paper-1 surface, rt-critical accents)
 *
 * Usage:
 *   <RtModal open={open} onClose={() => setOpen(false)} title="Settings">
 *     <p>Modal content</p>
 *   </RtModal>
 */
import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function RtModal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
  labelledBy,
  describedBy,
}) {
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);
  const titleId = labelledBy || 'rt-modal-title';

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape' && open) {
        e.stopPropagation();
        onClose?.();
      }
    },
    [open, onClose]
  );

  const handleTabTrap = useCallback(
    (e) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    []
  );

  // Capture trigger focus + restore on close
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      // Focus first focusable inside the panel after mount
      setTimeout(() => {
        if (!panelRef.current) return;
        const focusables = panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          panelRef.current.focus();
        }
      }, 0);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus?.();
      previousFocusRef.current = null;
    }
  }, [open]);

  // Bind keyboard listeners only when open
  useEffect(() => {
    if (!open) return undefined;
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, handleEscape]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  }[size] || 'max-w-2xl';

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fade-in-up"
      onClick={handleBackdropClick}
      onKeyDown={handleTabTrap}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={`relative w-full ${sizeClass} max-h-[90vh] overflow-hidden bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl flex flex-col`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800">
            <h2 id={titleId} className="text-sm font-bold text-neutral-300 uppercase tracking-wider">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
