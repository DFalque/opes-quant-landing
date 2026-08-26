/**
 * Global toast event bus.
 *
 * Astro creates separate React islands per page section, so React context
 * doesn't cross islands. We use a CustomEvent on window instead: any
 * component (even outside a React island) can dispatch a toast via
 * `dispatchToast()`, and the single `<ToastContainer client:load />` mounted
 * in Layout.astro listens and renders.
 *
 * Usage:
 *   // From anywhere:
 *   import { dispatchToast } from '@/lib/toast';
 *   dispatchToast('success', 'Guardado');
 *   dispatchToast('error', 'Algo falló', 5000);
 *
 *   // In a component (preferred — type-safe + no string typo):
 *   import { useToastDispatch } from '@/lib/toast';
 *   const toast = useToastDispatch();
 *   toast.success('Hecho');
 */

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastEvent {
  id: number;
  message: string;
  variant: ToastVariant;
  /** Auto-dismiss after this many ms. Set to 0 to disable. */
  duration: number;
}

const TOAST_EVENT = 'opes-quant:toast';
let nextId = 1;

/** Fire a global toast event. Safe to call from any JS context. */
export function dispatchToast(
  variant: ToastVariant,
  message: string,
  duration = 4000,
): void {
  if (typeof window === 'undefined') return;
  const detail: ToastEvent = {
    id: nextId++,
    message,
    variant,
    duration,
  };
  window.dispatchEvent(new CustomEvent<ToastEvent>(TOAST_EVENT, { detail }));
}

/** Hook variant for components: returns typed dispatch helpers. */
export function useToastDispatch() {
  return {
    success: (message: string, duration?: number) => dispatchToast('success', message, duration),
    error: (message: string, duration?: number) => dispatchToast('error', message, duration),
    info: (message: string, duration?: number) => dispatchToast('info', message, duration),
    warning: (message: string, duration?: number) => dispatchToast('warning', message, duration),
  };
}

export const TOAST_EVENT_NAME = TOAST_EVENT;
