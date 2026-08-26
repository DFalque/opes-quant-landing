/**
 * ObservabilityDashboard — React island for /dashboard/observability.
 *
 * - Range selector (1d/1w/1m/all)
 * - KPI cards: cost, runtime, success rate, session count, tokens, avg cost
 * - Charts: cost/day, runtime/day (Recharts)
 * - Top 10 expensive sessions table
 *
 * Data: GET /api/agent/metrics/summary?range=...
 * Renders error/empty/loading states explicitly.
 */
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../lib/api';
import { ApiError } from '../lib/types';
import type { AgentSummary } from '../lib/types';
import { formatCostUsd, formatDuration, formatNumber, formatTokens } from '../lib/format';

type Range = '1d' | '1w' | '1m' | 'all';

const RANGES: Array<{ key: Range; label: string }> = [
  { key: '1d', label: '1 día' },
  { key: '1w', label: '1 semana' },
  { key: '1m', label: '1 mes' },
  { key: 'all', label: 'Todo' },
];

export default function ObservabilityDashboard() {
  const [range, setRange] = useState<Range>('1w');
  const [summary, setSummary] = useState<AgentSummary | null>(null);
  const [topSessions, setTopSessions] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      api.agentMetricsSummary(range),
      api.agentSessions({ limit: 500 }),
    ])
      .then(([s, sessions]) => {
        if (cancelled) return;
        setSummary(s);
        const withCost = (sessions ?? [])
          .filter((sess: any) => (sess.cost_usd ?? 0) > 0)
          .sort((a: any, b: any) => (b.cost_usd ?? 0) - (a.cost_usd ?? 0))
          .slice(0, 10);
        setTopSessions(withCost);
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
  }, [range]);

  if (error) {
    return (
      <div className="card text-sm text-loss" data-testid="observability-error">
        Error: {error}
      </div>
    );
  }

  return (
    <div data-testid="observability-root">
      <div className="mb-6 flex items-center gap-2" data-testid="range-selector">
        <span className="text-sm text-muted">Rango:</span>
        {RANGES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRange(r.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              range === r.key
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            data-testid={`range-${r.key}`}
            data-active={range === r.key ? 'true' : 'false'}
          >
            {r.label}
          </button>
        ))}
      </div>

      {loading && !summary ? (
        <div className="card text-sm text-muted">Cargando…</div>
      ) : summary ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-testid="kpi-grid">
            <KPICard
              testId="kpi-cost"
              label="Coste total"
              value={formatCostUsd(summary.total_cost_usd)}
              sub={`avg ${formatCostUsd(summary.avg_cost_per_session_usd)} / sesión`}
              accent="text-brand-700"
            />
            <KPICard
              testId="kpi-runtime"
              label="Runtime total"
              value={formatDuration(summary.total_runtime_seconds)}
              sub={`avg ${formatDuration(summary.avg_runtime_per_session_seconds)} / sesión`}
            />
            <KPICard
              testId="kpi-sessions"
              label="Sesiones"
              value={String(summary.total_sessions)}
              sub={`${summary.with_metrics_sessions} con telemetría · success rate ${summary.success_rate_pct.toFixed(1)}%`}
            />
            <KPICard
              testId="kpi-tokens"
              label="Tokens totales"
              value={`${formatTokens(summary.total_input_tokens)} / ${formatTokens(summary.total_output_tokens)}`}
              sub={`${summary.total_errors} errores · ${summary.total_warnings} warnings`}
              accent="text-yellow-700"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="card" data-testid="chart-cost">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Coste diario (USD)</h3>
              {summary.by_day.length === 0 ? (
                <div className="text-sm text-muted py-8 text-center">Sin datos en el rango.</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={summary.by_day} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      tickFormatter={(d: string) => d.slice(5)}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(v: number) => `$${v.toFixed(3)}`} />
                    <Tooltip
                      formatter={(value: number) => [formatCostUsd(value), 'Coste']}
                      labelFormatter={(label: string) => `Fecha: ${label}`}
                    />
                    <Line type="monotone" dataKey="cost_usd" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="card" data-testid="chart-runtime">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Runtime diario (segundos)</h3>
              {summary.by_day.length === 0 ? (
                <div className="text-sm text-muted py-8 text-center">Sin datos en el rango.</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={summary.by_day} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      tickFormatter={(d: string) => d.slice(5)}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <Tooltip
                      formatter={(value: number) => [formatDuration(value), 'Runtime']}
                      labelFormatter={(label: string) => `Fecha: ${label}`}
                    />
                    <Bar dataKey="runtime_seconds" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="card p-0 overflow-x-auto" data-testid="top-sessions">
            <h3 className="text-sm font-semibold text-gray-900 p-4 pb-2">Top 10 sesiones más caras</h3>
            {!topSessions || topSessions.length === 0 ? (
              <div className="text-sm text-muted p-4">Sin sesiones con coste en el rango.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="text-xs uppercase tracking-wider text-muted text-left">
                    <th className="px-4 py-2 font-semibold">#</th>
                    <th className="px-4 py-2 font-semibold">Sesión</th>
                    <th className="px-4 py-2 font-semibold text-right">Coste</th>
                    <th className="px-4 py-2 font-semibold text-right">Duración</th>
                    <th className="px-4 py-2 font-semibold text-right">Tokens in/out</th>
                    <th className="px-4 py-2 font-semibold text-center">Err/Warn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {topSessions.map((s: any, i: number) => (
                    <tr key={s.session_key} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-xs text-muted">{i + 1}</td>
                      <td className="px-4 py-2 text-xs font-mono">
                        <a
                          href={`/dashboard/sessions/${encodeURIComponent(s.session_key)}`}
                          className="text-brand-600 hover:underline"
                        >
                          {s.session_key}
                        </a>
                      </td>
                      <td className="px-4 py-2 text-sm text-right tabular-nums font-semibold text-brand-700">
                        {formatCostUsd(s.cost_usd)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right tabular-nums">
                        {formatDuration(s.duration_seconds)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right tabular-nums text-muted">
                        {formatTokens(s.input_tokens)} / {formatTokens(s.output_tokens)}
                      </td>
                      <td className="px-4 py-2 text-center text-xs">
                        <span className={s.errors_count > 0 ? 'text-red-700' : 'text-muted'}>
                          {s.errors_count ?? 0}
                        </span>
                        {' / '}
                        <span className={s.warnings_count > 0 ? 'text-yellow-700' : 'text-muted'}>
                          {s.warnings_count ?? 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Top 10 sub-agents by cost — helps identify which sub-agent spends too much */}
          {summary.top_subagents_by_cost && summary.top_subagents_by_cost.length > 0 && (
            <div className="card p-0 overflow-x-auto mt-6" data-testid="top-subagents">
              <h3 className="text-sm font-semibold text-gray-900 p-4 pb-2">
                Top 10 sub-agentes por coste
                <span className="text-xs text-muted font-normal ml-2">
                  (acumulado en el rango, para detectar cuál gasta más)
                </span>
              </h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="text-xs uppercase tracking-wider text-muted text-left">
                    <th className="px-4 py-2 font-semibold">Sub-agente</th>
                    <th className="px-4 py-2 font-semibold text-right">Invocaciones</th>
                    <th className="px-4 py-2 font-semibold text-right">Coste total</th>
                    <th className="px-4 py-2 font-semibold text-right">Coste medio</th>
                    <th className="px-4 py-2 font-semibold text-right">Coste máx</th>
                    <th className="px-4 py-2 font-semibold text-right">Runtime total</th>
                    <th className="px-4 py-2 font-semibold text-right">Runtime medio</th>
                    <th className="px-4 py-2 font-semibold text-center">Decisiones</th>
                    <th className="px-4 py-2 font-semibold text-center">Errores</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {summary.top_subagents_by_cost.map((s) => (
                    <tr key={s.name} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm font-mono text-gray-900">{s.name}</td>
                      <td className="px-4 py-2 text-sm text-right tabular-nums text-muted">
                        {s.invocations}
                      </td>
                      <td className="px-4 py-2 text-sm text-right tabular-nums font-semibold text-brand-700">
                        {formatCostUsd(s.total_cost_usd)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right tabular-nums">
                        {formatCostUsd(s.avg_cost_usd)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right tabular-nums text-muted">
                        {formatCostUsd(s.max_cost_usd)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right tabular-nums">
                        {formatDuration(s.total_duration_seconds)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right tabular-nums text-muted">
                        {formatDuration(s.avg_duration_seconds)}
                      </td>
                      <td className="px-4 py-2 text-sm text-center tabular-nums">
                        {s.total_decisions}
                      </td>
                      <td className="px-4 py-2 text-sm text-center">
                        <span className={s.total_errors > 0 ? 'text-red-700 font-semibold' : 'text-muted'}>
                          {s.total_errors}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

function KPICard({
  label,
  value,
  sub,
  accent,
  testId,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  testId?: string;
}) {
  return (
    <div className="card" data-testid={testId}>
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className={`text-2xl font-bold mt-2 ${accent ?? 'text-gray-900'}`}>{value}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  );
}
