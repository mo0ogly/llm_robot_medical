/**
 * useFocusTrap — Confines keyboard focus to a container while a modal is open.
 *
 * Cycle 006 R-focus-trap (PDCA): centralizes the Tab/Shift+Tab cycle pattern
 * so the 4 existing modals can adopt it with one line each, without each
 * one implementing 25 LOC of focus management.
 *
 * Behavior:
 *  - When `active` becomes true: focuses the first focusable inside ref'd container.
 *  - On Tab: if focus is on last focusable, wraps to first.
 *  - On Shift+Tab: if focus is on first focusable, wraps to last.
 *  - When `active` becomes false: restores focus to whatever had focus
 *    before the trap engaged (the trigger button, typically).
 *
 * Usage:
 *   const panelRef = useRef(null);
 *   useFocusTrap(panelRef, isOpen);
 *   <div ref={panelRef} role="dialog">...</div>
 *
 * WCAG: 2.4.3 Focus Order + 2.1.2 No Keyboard Trap (the modal IS the trap
 * by design, but Escape always exits — see ARIA dialog spec).
 */
import { useEffect } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function useFocusTrap(containerRef, active) {
  useEffect(function() {
    if (!active || !containerRef.current) return undefined;

    var prevFocus = document.activeElement;
    var container = containerRef.current;

    // Focus first focusable on mount
    var focusables = container.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      container.setAttribute('tabindex', '-1');
      container.focus();
    }

    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;
      var current = container.querySelectorAll(FOCUSABLE_SELECTOR);
      if (current.length === 0) {
        e.preventDefault();
        return;
      }
      var first = current[0];
      var last = current[current.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener('keydown', handleKeyDown);

    return function() {
      container.removeEventListener('keydown', handleKeyDown);
      if (prevFocus && typeof prevFocus.focus === 'function') {
        prevFocus.focus();
      }
    };
  }, [active, containerRef]);
}
