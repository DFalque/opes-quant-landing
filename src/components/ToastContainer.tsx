import { useEffect, useState } from 'react';
import { TOAST_EVENT_NAME, type ToastEvent } from '../lib/toast';

/**
 * Renders the active stack of toasts. Mounted ONCE in Layout.astro with
 * `client:load` so it's available on every page. Listens to global
 * CustomEvents dispatched by `dispatchToast()`.
 */
export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastEvent[]>([]);

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent<ToastEvent>).detail;
      setToasts((prev) => [...prev, detail]);
      if (detail.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== detail.id));
        }, detail.duration);
      }
    }
    window.addEventListener(TOAST_EVENT_NAME, onToast);
    return () => window.removeEventListener(TOAST_EVENT_NAME, onToast);
  }, []);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  if (toasts.length === 0) return null;

  const variantClasses: Record<ToastEvent['variant'], string> = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const variantIcon: Record<ToastEvent['variant'], string> = {
    success: '✓',
    error: '✕',
    info: 'ⓘ',
    warning: '⚠',
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md"
      data-testid="toast-container"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-md border shadow-lg ${variantClasses[t.variant]}`}
          data-testid={`toast-${t.variant}`}
          role="alert"
        >
          <span className="text-lg leading-none mt-0.5" aria-hidden="true">
            {variantIcon[t.variant]}
          </span>
          <span className="flex-1 text-sm">{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="text-current opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Cerrar"
            data-testid="toast-dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
