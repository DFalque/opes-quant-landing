import { useState } from 'react';
import { api, setStoredAuth, ApiError } from '../lib/api';
import type { User } from '../lib/types';
import { useToastDispatch } from '../lib/toast';

/**
 * Login form (React island). On submit:
 *   1. Validate credentials by calling /api/auth/me with explicit auth.
 *   2. On success: save to localStorage, dispatch "Bienvenido" toast, redirect to /dashboard.
 *   3. On failure: dispatch error toast.
 *
 * Uses the global toast bus (CustomEvent on window) so toasts work even
 * though this island is separate from the ToastContainer island.
 */
export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToastDispatch();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return; // prevent double submit
    setLoading(true);
    try {
      // Verify credentials with explicit auth (not from localStorage).
      const me: User = await api.me(undefined, { username, password });
      if (!me) throw new Error('Empty response from server');
      setStoredAuth({ username, password });
      toast.success(`Bienvenido, ${me.username}`, 2500);
      // Small delay so the toast renders before navigation
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 400);
    } catch (err) {
      setStoredAuth(null);
      if (err instanceof ApiError && err.status === 401) {
        toast.error('Usuario o contraseña incorrectos', 5000);
      } else if (err instanceof ApiError) {
        const body = err.body;
        const detail = body && typeof body === 'object' && 'detail' in body
          ? (body as { detail: string }).detail
          : err.message;
        toast.error(`Error ${err.status}: ${detail}`, 6000);
      } else {
        toast.error(err instanceof Error ? err.message : 'Error desconocido', 5000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
      <div>
        <label htmlFor="username" className="label">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          autoFocus
          data-testid="username-input"
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          data-testid="password-input"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
        data-testid="submit-btn"
      >
        {loading ? 'Verificando…' : 'Entrar'}
      </button>
    </form>
  );
}
