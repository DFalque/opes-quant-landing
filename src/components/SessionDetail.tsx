/**
 * SessionDetail — React island for /dashboard/sessions/[key].
 *
 * Reads the session_key from window.location, fetches
 * GET /api/agent/sessions/{key}, renders:
 *   - session-level KPIs (duration, cost, tokens, errors, warnings)
 *   - sub-agents table (name, duration, cost, decisions, tools, errors)
 *
 * The sub-agents list is the key value: shows which sub-agent was called,
 * how long it took, how much it cost, and how many decisions it made.
 */
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ApiError } from '../lib/types';
import type { AgentSession, SubagentMetric } from '../lib/types';
import {
  formatCostUsd,
  formatDateTime,
  formatDuration,
  formatTokens,
} from '../lib/format';

function getSessionKeyFromUrl(): string {
  // /dashboard/sessions/<key> — key is everything after the prefix
  const path = window.location.pathname;
  const prefix = '/dashboard/sessions/';
  if (!path.startsWith(prefix)) return '';
  return decodeURIComponent(path.slice(prefix.length));
}

const statusVariant: Record<string, string> = {
  success: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  running: 'bg-blue-100 text-blue-800',
  aborted: 'bg-yellow-100 text-yellow-800',
  ok: 'bg-green-100 text-green-800',
  partial: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  unknown: 'bg-gray-100 text-gray-800',
};

export default function SessionDetail() {
  const [session, setSession] = useState<AgentSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sessionKey = getSessionKeyFromUrl();
    if (!sessionKey) {
      setError('Session key no encontrada en URL');
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .agentSessionByKey(sessionKey)
      .then((s) => {
        if (cancelled) return;
        setSession(s);
      })
      .catch((e: Error) => {
        if (cancelled) return;
        if (e instanceof ApiError) {
          setError(`HTTP ${e.status}: ${JSON.stringify(e.body)}`);
        } else {
          setError(e.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="card text-sm text-loss" data-testid="session-detail-error">
        Error: {error}
      </div>
    );
  }

  if (loading && !session) {
    return <div className="card text-sm text-muted">Cargando…</div>;
  }

  if (!session) return null;

  const subs = session.subagents || [];
  const subTotalCost = subs.reduce((acc, s) => acc + (s.cost_usd || 0), 0);

  return (
    <div data-testid="session-detail-content">
      {/* Header card: session-level KPIs */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted">Session key</div>
            <div className="font-mono text-lg font-semibold text-gray-900 mt-1" data-testid="session-key">
              {session.session_key}
            </div>
            <div className="text-xs text-muted mt-1">
              {session.agent_type ?? 'orchestrator'} · {session.model ?? 'unknown'}
              {session.trigger && ` · ${session.trigger}`}
            </div>
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              statusVariant[session.status] ?? 'bg-gray-100 text-gray-800'
            }`}
            data-testid="session-status"
          >
            {session.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <KPI label="Duración" value={formatDuration(session.duration_seconds)} />
          <KPI
            label="Coste"
            value={formatCostUsd(session.cost_usd)}
            accent="text-brand-700"
          />
          <KPI
            label="Tokens in/out"
            value={`${formatTokens(session.input_tokens)} / ${formatTokens(session.output_tokens)}`}
            muted
          />
          <KPI
            label="Err / Warn"
            value={`${session.errors_count ?? 0} / ${session.warnings_count ?? 0}`}
            accent={session.errors_count && session.errors_count > 0 ? 'text-red-700' : 'text-gray-900'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
          <div>
            <span className="text-muted">Inicio:</span>{' '}
            <span className="tabular-nums">{formatDateTime(session.started_at)}</span>
          </div>
          <div>
            <span className="text-muted">Fin:</span>{' '}
            <span className="tabular-nums">
              {session.ended_at ? formatDateTime(session.ended_at) : '—'}
            </span>
          </div>
          <div>
            <span className="text-muted">Source:</span>{' '}
            <code className="font-mono text-xs">{session.metric_source ?? '—'}</code>
          </div>
        </div>
      </div>

      {/* Sub-agents section — the core value of this page */}
      <div className="card p-0 overflow-x-auto" data-testid="subagents-section">
        <h3 className="text-sm font-semibold text-gray-900 p-4 pb-2">
          Sub-agentes invocados
          <span className="text-xs text-muted font-normal ml-2">
            ({subs.length} {subs.length === 1 ? 'invocación' : 'invocaciones'}
            {subs.length > 0 && ` · coste total ${formatCostUsd(subTotalCost)}`})
          </span>
        </h3>
        {subs.length === 0 ? (
          <div className="text-sm text-muted p-4" data-testid="no-subagents">
            Esta sesión no tiene sub-agentes registrados (no se ejecutó Paso 4 / Paso 6, o
            el orquestador no escribió los `metricas_subagent_*.json`).
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-xs uppercase tracking-wider text-muted text-left">
                <th className="px-4 py-2 font-semibold">Sub-agente</th>
                <th className="px-4 py-2 font-semibold text-center">Status</th>
                <th className="px-4 py-2 font-semibold text-right">Duración</th>
                <th className="px-4 py-2 font-semibold text-right">Intentos</th>
                <th className="px-4 py-2 font-semibold text-right">Coste</th>
                <th className="px-4 py-2 font-semibold text-right">Chars in/out</th>
                <th className="px-4 py-2 font-semibold text-center">Decisiones</th>
                <th className="px-4 py-2 font-semibold text-center">Tools</th>
                <th className="px-4 py-2 font-semibold text-center">Errores</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {subs.map((s, i) => (
                <tr key={`${s.name}-${s.task_id}-${i}`} className="hover:bg-gray-50" data-testid="subagent-row">
                  <td className="px-4 py-2">
                    <div className="font-mono text-sm font-semibold text-gray-900">{s.name}</div>
                    {s.task_id && (
                      <div className="font-mono text-xs text-muted">{s.task_id}</div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusVariant[s.status] ?? 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-right tabular-nums">
                    {formatDuration(s.duration_seconds)}
                  </td>
                  <td className="px-4 py-2 text-sm text-right tabular-nums text-muted">
                    {s.attempts}
                  </td>
                  <td className="px-4 py-2 text-sm text-right tabular-nums font-semibold text-brand-700">
                    {formatCostUsd(s.cost_usd)}
                  </td>
                  <td className="px-4 py-2 text-sm text-right tabular-nums text-muted">
                    {formatTokens(s.input_chars)} / {formatTokens(s.output_chars)}
                  </td>
                  <td className="px-4 py-2 text-sm text-center tabular-nums">
                    {s.decisions_count}
                  </td>
                  <td className="px-4 py-2 text-sm text-center tabular-nums text-muted">
                    {s.tools_called_count}
                  </td>
                  <td className="px-4 py-2 text-sm text-center">
                    <span className={s.errors_count > 0 ? 'text-red-700 font-semibold' : 'text-muted'}>
                      {s.errors_count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Cost breakdown if subagents exist */}
      {subs.length > 0 && (
        <div className="card mt-6 text-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Coste de la sesión</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted">Sub-agentes ({subs.length})</span>
              <span className="tabular-nums font-mono">{formatCostUsd(subTotalCost)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-gray-200 pt-1 mt-1">
              <span>Total sesión</span>
              <span className="tabular-nums text-brand-700">{formatCostUsd(session.cost_usd)}</span>
            </div>
          </div>
          <p className="text-xs text-muted mt-3">
            El coste total incluye el output del orquestador (heurístico: chars de
            summary.md + README.md / 4) + suma de los costes per-sub-agente. Ver
            <a href="/dashboard/observability" className="text-brand-600 hover:underline">
              Observabilidad
            </a>{' '}
            para el agregado en el tiempo.
          </p>
        </div>
      )}
    </div>
  );
}

function KPI({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: string;
  accent?: string;
  muted?: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      <div
        className={`text-lg font-bold mt-1 ${
          accent ?? (muted ? 'text-gray-700' : 'text-gray-900')
        }`}
      >
        {value}
      </div>
    </div>
  );
}
