import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { dispatchToast, useToastDispatch, TOAST_EVENT_NAME } from './toast';
import ToastContainer from '../components/ToastContainer';

describe('toast event bus', () => {
  let received: { variant: string; message: string; id: number; duration: number }[] = [];

  beforeEach(() => {
    received = [];
  });
  afterEach(() => {
    received = [];
  });

  it('dispatchToast fires a CustomEvent with success variant', () => {
    const handler = (e: Event) => received.push((e as CustomEvent<{ variant: string; message: string; id: number; duration: number }>).detail);
    window.addEventListener(TOAST_EVENT_NAME, handler);
    try {
      dispatchToast('success', 'Guardado');
      expect(received).toHaveLength(1);
      expect(received[0].variant).toBe('success');
      expect(received[0].message).toBe('Guardado');
    } finally {
      window.removeEventListener(TOAST_EVENT_NAME, handler);
    }
  });

  it('dispatchToast accepts all 4 variants', () => {
    const handler = (e: Event) => received.push((e as CustomEvent<{ variant: string; message: string; id: number; duration: number }>).detail);
    window.addEventListener(TOAST_EVENT_NAME, handler);
    try {
      dispatchToast('success', 'A');
      dispatchToast('error', 'B');
      dispatchToast('info', 'C');
      dispatchToast('warning', 'D');
      expect(received).toHaveLength(4);
      expect(received.map((r) => r.variant)).toEqual(['success', 'error', 'info', 'warning']);
    } finally {
      window.removeEventListener(TOAST_EVENT_NAME, handler);
    }
  });

  it('dispatchToast default duration is 4000ms', () => {
    let detail: { duration: number } | null = null;
    const handler = (e: Event) => { detail = (e as CustomEvent<{ duration: number }>).detail; };
    window.addEventListener(TOAST_EVENT_NAME, handler);
    try {
      dispatchToast('info', 'msg');
      expect(detail?.duration).toBe(4000);
    } finally {
      window.removeEventListener(TOAST_EVENT_NAME, handler);
    }
  });

  it('dispatchToast accepts custom duration', () => {
    let detail: { duration: number } | null = null;
    const handler = (e: Event) => { detail = (e as CustomEvent<{ duration: number }>).detail; };
    window.addEventListener(TOAST_EVENT_NAME, handler);
    try {
      dispatchToast('error', 'lento', 10000);
      expect(detail?.duration).toBe(10000);
    } finally {
      window.removeEventListener(TOAST_EVENT_NAME, handler);
    }
  });

  it('useToastDispatch returns typed helpers', () => {
    const handler = (e: Event) => received.push((e as CustomEvent<{ variant: string; message: string; id: number; duration: number }>).detail);
    window.addEventListener(TOAST_EVENT_NAME, handler);
    try {
      const t = useToastDispatch();
      t.success('ok');
      t.error('fail');
      t.info('info');
      t.warning('warn');
      expect(received.map((r) => r.variant)).toEqual(['success', 'error', 'info', 'warning']);
    } finally {
      window.removeEventListener(TOAST_EVENT_NAME, handler);
    }
  });
});

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when no toasts', () => {
    render(<ToastContainer />);
    expect(screen.queryByTestId('toast-container')).not.toBeInTheDocument();
  });

  it('renders a toast when an event is dispatched', () => {
    render(<ToastContainer />);
    act(() => {
      dispatchToast('error', 'Algo falló');
    });
    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
    expect(screen.getByText('Algo falló')).toBeInTheDocument();
  });

  it('dismisses a toast on X click', () => {
    render(<ToastContainer />);
    act(() => {
      dispatchToast('info', 'Para tu información');
    });
    const dismiss = screen.getByTestId('toast-dismiss');
    act(() => {
      fireEvent.click(dismiss);
    });
    expect(screen.queryByTestId('toast-info')).not.toBeInTheDocument();
  });
});
