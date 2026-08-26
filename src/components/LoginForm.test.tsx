import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('../lib/api', () => {
  return {
    api: {
      me: vi.fn(),
    },
    setStoredAuth: vi.fn(),
    ApiError: class ApiError extends Error {
      status: number;
      body: unknown;
      constructor(status: number, body: unknown, message?: string) {
        super(message ?? `API ${status}`);
        this.status = status;
        this.body = body;
      }
    },
  };
});

import { api, setStoredAuth, ApiError } from '../lib/api';
import LoginForm from './LoginForm';

const TOAST_EVENT = 'opes-quant:toast';
const toastEvents: { variant: string; message: string }[] = [];

function onToast(e: Event) {
  toastEvents.push((e as CustomEvent<{ variant: string; message: string }>).detail);
}

describe('LoginForm', () => {
  beforeEach(() => {
    toastEvents.length = 0;
    vi.clearAllMocks();
    window.addEventListener(TOAST_EVENT, onToast);
  });

  it('renders the form with username and password fields', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
  });

  it('shows "Verificando..." while submitting', async () => {
    let resolveMe!: (v: unknown) => void;
    (api.me as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise((r) => { resolveMe = r; })
    );
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'alice' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'pw' } });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('submit-btn')).toHaveTextContent('Verificando');
    });
    expect(screen.getByTestId('submit-btn')).toBeDisabled();
    resolveMe({ id: 1, username: 'alice', role: 'admin' });
  });

  it('dispatches success toast and saves auth on successful login', async () => {
    (api.me as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 1, username: 'alice', role: 'admin',
    });
    // Mock window.location.href assignment
    delete (window as { location?: unknown }).location;
    (window as unknown as { location: { href: string } }).location = { href: '' };

    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'alice' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'pw' } });
    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(setStoredAuth).toHaveBeenCalledWith({ username: 'alice', password: 'pw' });
    });
    await waitFor(() => {
      const success = toastEvents.find((t) => t.variant === 'success');
      expect(success).toBeTruthy();
      expect(success!.message).toContain('alice');
    });
  });

  it('dispatches error toast on 401', async () => {
    (api.me as ReturnType<typeof vi.fn>).mockRejectedValue(
      new (ApiError as unknown as new (s: number, b: unknown) => ApiError)(401, { detail: 'unauthorized' })
    );
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'alice' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      const err = toastEvents.find((t) => t.variant === 'error');
      expect(err).toBeTruthy();
      expect(err!.message).toContain('Usuario o contraseña incorrectos');
    });
  });

  it('dispatches error toast on network error', async () => {
    (api.me as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network down'));
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'alice' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'pw' } });
    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      const err = toastEvents.find((t) => t.variant === 'error');
      expect(err).toBeTruthy();
      expect(err!.message).toContain('Network down');
    });
  });
});
