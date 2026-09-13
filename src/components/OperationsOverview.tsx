import { useCallback, useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api, ApiError } from '../lib/api';
import { formatCurrency, formatDateTime, formatDuration, formatPercent, formatTokens } from '../lib/format';
import { sitePath } from '../lib/site-path';
import type {
  AgentSession,
  AgentSummary,
  EquityCurvePoint,
  HealthStatus,
  BrokerAccount,
  PortfolioSummary,
  Position,
  ServiceStatus,
} from '../lib/types';

type ServiceState = 'operativo' | 'degradado' | 'sin-feed';

interface ProductionService {
  name: string;
  role: string;
  version: string;
  state: ServiceState;
}

const fallbackProductionServices: ProductionService[] = [
  { name: 'Scheduler', role: 'Ventanas y dispatch 24/7', version: 'sin heartbeat', state: 'sin-feed' },
  { name: 'Link', role: 'Market data y broker sync', version: 'sin heartbeat', state: 'sin-feed' },
  { name: 'Wave', role: 'Price action y contexto técnico', version: 'sin heartbeat', state: 'sin-feed' },
  { name: 'Flux', role: 'Estructura de opciones', version: 'sin heartbeat', state: 'sin-feed' },
  { name: 'Intelligence', role: 'Convergencia y decisión', version: 'sin heartbeat', state: 'sin-feed' },
  { name: 'Cortex', role: 'Memoria temporal y relacional', version: 'sin heartbeat', state: 'sin-feed' },
  { name: 'Reflex', role: 'Feedback y evaluación', version: 'sin heartbeat', state: 'sin-feed' },
  { name: 'Atlas', role: 'Macro y noticias', version: 'sin heartbeat', state: 'sin-feed' },
  { name: 'Lens', role: 'Fundamentals y valoración', version: 'sin heartbeat', state: 'sin-feed' },
  { name: 'Vision', role: 'Render visual de sesiones', version: 'sin heartbeat', state: 'sin-feed' },
  { name: 'Signal', role: 'Estadística y calibración', version: 'sin heartbeat', state: 'sin-feed' },
];

interface OverviewData {
  health: HealthStatus | null;
  portfolio: PortfolioSummary | null;
  accounts: BrokerAccount[];
  services: ServiceStatus[];
  curve: EquityCurvePoint[];
  positions: Position[];
  summary: AgentSummary | null;
  sessions: AgentSession[];
}

const emptyData: OverviewData = {
  health: null,
  portfolio: null,
  accounts: [],
  services: [],
  curve: [],
  positions: [],
  summary: null,
  sessions: [],
};

function settledValue<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null;
}

function isUnauthorized(result: PromiseSettledResult<unknown>): boolean {
  return result.status === 'rejected' && result.reason instanceof ApiError && result.reason.status === 401;
}

function stateLabel(state: ServiceState): string {
  if (state === 'operativo') return 'Operativo';
  if (state === 'degradado') return 'Degradado';
  return 'Sin feed';
}

function serviceState(status: ServiceStatus['status']): ServiceState {
  if (status === 'healthy') return 'operativo';
  if (status === 'degraded' || status === 'down') return 'degradado';
  return 'sin-feed';
}

function accountStatusLabel(account: BrokerAccount): string {
  if (account.status === 'healthy') return 'Snapshot reciente';
  if (account.status === 'stale') return 'Snapshot stale';
  if (account.status === 'degraded') return 'Degradado';
  return 'Sin snapshot';
}

function fallbackAccounts(portfolio: PortfolioSummary | null): BrokerAccount[] {
  return [
    {
      broker: 'alpaca',
      environment: 'alpaca-paper',
      status: portfolio ? 'stale' : 'unavailable',
      account_id: null,
      currency: 'USD',
      equity: portfolio?.total_equity ?? null,
      cash: portfolio?.cash_balance ?? null,
      buying_power: null,
      daily_pnl: null,
      daily_pnl_pct: null,
      positions_count: portfolio?.positions_count ?? null,
      open_orders_count: null,
      captured_at: portfolio?.last_updated ?? null,
      age_seconds: null,
      source: 'portfolio-fallback',
      message: 'Endpoint de cuentas aún no disponible; se muestra el resumen agregado.',
    },
    {
      broker: 'ibkr',
      environment: 'ibkr-paper',
      status: 'unavailable',
      account_id: null,
      currency: 'USD',
      equity: null,
      cash: null,
      buying_power: null,
      daily_pnl: null,
      daily_pnl_pct: null,
      positions_count: null,
      open_orders_count: null,
      captured_at: null,
      age_seconds: null,
      source: 'no-persisted-account-snapshot',
      message: 'No hay snapshot de cuenta IBKR persistido para el dashboard.',
    },
  ];
}

function sessionLabel(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === 'success' || normalized === 'completed' || normalized === 'ok') return 'Completada';
  if (normalized === 'running') return 'En curso';
  if (normalized === 'failed' || normalized === 'error') return 'Fallida';
  return status;
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 13 13 3M5 3h8v8" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M13 5.5A5.5 5.5 0 1 0 13.2 10M13 2.5v3h-3" />
    </svg>
  );
}

export default function OperationsOverview() {
  const [data, setData] = useState<OverviewData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [lastLoadedAt, setLastLoadedAt] = useState<Date | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const results = await Promise.allSettled([
      api.health(),
      api.portfolio(),
      api.equityCurve('3m'),
      api.positions({ status: 'open', limit: 50 }),
      api.agentMetricsSummary('1w'),
      api.agentSessions({ limit: 8 }),
      api.accounts(),
      api.services(),
    ]);

    const [healthResult, portfolioResult, curveResult, positionsResult, summaryResult, sessionsResult, accountsResult, servicesResult] = results;
    const nextPortfolio = settledValue(portfolioResult);
    setData({
      health: settledValue(healthResult),
      portfolio: nextPortfolio,
      accounts: settledValue(accountsResult)?.accounts ?? fallbackAccounts(nextPortfolio),
      services: settledValue(servicesResult)?.services ?? [],
      curve: settledValue(curveResult) ?? [],
      positions: settledValue(positionsResult)?.items ?? [],
      summary: settledValue(summaryResult),
      sessions: settledValue(sessionsResult) ?? [],
    });
    setAuthRequired(results.slice(1).some(isUnauthorized));

    const failedRequests = results.filter((result) => result.status === 'rejected' && !isUnauthorized(result));
    if (failedRequests.length === results.length) {
      const firstFailure = failedRequests[0];
      setError(firstFailure?.status === 'rejected' && firstFailure.reason instanceof Error
        ? firstFailure.reason.message
        : 'No se pudo conectar con el dashboard');
    } else if (failedRequests.length > 0) {
      setError('Algunos datos no están disponibles. El resto del panel sigue actualizado.');
    }
    setLastLoadedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const { health, portfolio, accounts, services, curve, positions, summary, sessions } = data;
  const alpaca = accounts.find((account) => account.broker === 'alpaca') ?? fallbackAccounts(portfolio)[0];
  const ibkr = accounts.find((account) => account.broker === 'ibkr') ?? fallbackAccounts(portfolio)[1];
  const serviceRows: ProductionService[] = services.length
    ? services.map((service) => ({
      name: service.name,
      role: service.domain,
      version: service.version ?? (service.status === 'unknown' ? 'sin heartbeat' : '—'),
      state: serviceState(service.status),
    }))
    : fallbackProductionServices;
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
    .slice(0, 5);
  const realizedPnl = portfolio?.realized_pnl_total ?? null;
  const healthState = health?.status === 'ok' ? 'operativo' : health ? 'degradado' : 'sin conexión';

  return (
    <div className="ops-page" data-testid="operations-overview">
      <header className="ops-hero">
        <div>
          <div className="ops-eyebrow"><span className="ops-live-dot" /> Workspace privado / producción</div>
          <h1>Control room <em>de OPES.</em></h1>
          <p>Una lectura rápida del sistema, sus brokers y la actividad que está ocurriendo ahora.</p>
        </div>
        <div className="ops-hero-actions">
          <div className={`ops-runtime-pill ops-runtime-${healthState.replace(' ', '-')}`}>
            <span className="ops-status-dot" />
            <span>Runtime {health ? `v${health.version}` : 'sin verificar'}</span>
          </div>
          <button type="button" className="ops-refresh" onClick={() => void load()} disabled={loading}>
            <RefreshIcon /> {loading ? 'Actualizando' : 'Actualizar'}
          </button>
        </div>
      </header>

      <div className="ops-meta-row">
        <span>Última lectura: {lastLoadedAt ? lastLoadedAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
        <span className="ops-meta-separator" />
        <span>Fuente: gateway del dashboard · datos read-only</span>
      </div>

      {authRequired && (
        <div className="ops-alert ops-alert-auth" data-testid="operations-auth-required">
          <div><strong>El panel está listo, pero falta autenticación.</strong><span>Inicia sesión para consultar cartera, brokers y sesiones de producción.</span></div>
          <a href={sitePath('/login')}>Ir al login <ArrowUpRight /></a>
        </div>
      )}
      {error && !authRequired && <div className="ops-alert" data-testid="operations-partial-error">{error}</div>}

      <section className="ops-kpi-grid" aria-label="Resumen de cartera">
        <MetricCard label="Equity total" value={portfolio ? formatCurrency(portfolio.total_equity) : '—'} detail={portfolio ? `Actualizado ${formatDateTime(portfolio.last_updated)}` : 'Esperando snapshot'} accent="lime" />
        <MetricCard label="Cash disponible" value={portfolio ? formatCurrency(portfolio.cash_balance) : '—'} detail="Cuenta Alpaca · snapshot" />
        <MetricCard label="P&L realizado" value={realizedPnl !== null ? formatCurrency(realizedPnl) : '—'} detail={realizedPnl !== null ? formatPercent((realizedPnl / Math.max(1, portfolio?.cash_balance ?? 1)) * 100) : 'Sin histórico'} tone={realizedPnl !== null && realizedPnl < 0 ? 'loss' : 'profit'} />
        <MetricCard label="Sesiones · 7 días" value={summary ? String(summary.total_sessions) : '—'} detail={summary ? `${summary.success_rate_pct.toFixed(0)}% completadas · ${formatDuration(summary.total_runtime_seconds)}` : 'Sin telemetría'} />
      </section>

      <section className="ops-section-grid ops-broker-section" aria-label="Cuentas y brokers">
        <BrokerCard account={alpaca} broker="Alpaca" eyebrow="Broker / paper" />
        <BrokerCard account={ibkr} broker="Interactive Brokers" eyebrow="Market data / TWS" />
      </section>

      <section className="ops-section-grid ops-chart-section" aria-label="Evolución y actividad">
        <div className="ops-panel ops-chart-panel">
          <PanelHeading eyebrow="Cartera" title="La curva de equity" detail="Últimos 3 meses" />
          {curve.length === 0 ? (
            <EmptyState text={portfolio ? 'Todavía no hay una curva persistida para este rango.' : 'Inicia sesión para cargar el histórico de cartera.'} />
          ) : (
            <div className="ops-chart" data-testid="equity-chart">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={curve} margin={{ top: 12, right: 12, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ops-equity-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#baff36" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#baff36" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e1e5df" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#818980' }} tickFormatter={(value: string) => value.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#818980' }} tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`} axisLine={false} tickLine={false} width={42} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Equity']} labelFormatter={(label: string) => `Fecha ${label}`} contentStyle={{ border: '1px solid #dfe4dd', borderRadius: 4, fontSize: 12 }} />
                  <Area type="monotone" dataKey="total" stroke="#6b9416" strokeWidth={2.5} fill="url(#ops-equity-fill)" activeDot={{ r: 5, fill: '#baff36', stroke: '#172013', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="ops-panel ops-activity-panel">
          <PanelHeading eyebrow="Hermes" title="Actividad reciente" detail="Últimas sesiones" />
          {recentSessions.length === 0 ? (
            <EmptyState text="No hay sesiones disponibles todavía." />
          ) : (
            <div className="ops-session-list" data-testid="recent-sessions">
              {recentSessions.map((session) => (
                <div className="ops-session-row" key={session.id}>
                  <span className={`ops-session-marker ops-session-${session.status.toLowerCase()}`} />
                  <div className="ops-session-copy">
                    <strong>{session.session_key}</strong>
                    <span>{session.agent_type ?? 'agent'} · {formatDateTime(session.started_at)}</span>
                  </div>
                  <div className="ops-session-value">
                    <strong>{sessionLabel(session.status)}</strong>
                    <span>{session.cost_usd ? formatCurrency(session.cost_usd) : formatTokens(session.output_tokens)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <a className="ops-panel-link" href={sitePath('/dashboard/sessions')}>Ver todas las sesiones <ArrowUpRight /></a>
        </div>
      </section>

      <section className="ops-panel ops-flow-panel" aria-labelledby="ops-flow-title">
        <div className="ops-flow-heading">
          <PanelHeading eyebrow="Producción" title="Cómo se mueve OPES" detail="Mapa operativo del sistema" />
          <p>El catálogo refleja la topología conocida. Los estados de cada servicio se irán sustituyendo por health checks granulares a medida que cada API los publique.</p>
        </div>
        <div className="ops-flow-track" id="ops-flow-title">
          {serviceRows.map((service, index) => (
            <div className="ops-flow-node" key={service.name}>
              <div className={`ops-flow-node-top ops-state-${service.state}`}>
                <span className="ops-flow-index">0{index + 1}</span>
                <span className="ops-state-label"><i /> {stateLabel(service.state)}</span>
              </div>
              <strong>{service.name}</strong>
              <span>{service.role}</span>
              <small>{service.version}</small>
               {index < serviceRows.length - 1 && <span className="ops-flow-connector" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </section>

      <section className="ops-lower-grid">
        <div className="ops-panel ops-positions-panel">
          <PanelHeading eyebrow="Exposición" title="Posiciones abiertas" detail={`${positions.length} observadas`} />
          {positions.length === 0 ? (
            <EmptyState text={portfolio ? 'No hay posiciones abiertas.' : 'Autentícate para consultar la exposición.'} />
          ) : (
            <div className="ops-position-table" data-testid="open-positions">
              {positions.map((position) => (
                <div className="ops-position-row" key={position.id}>
                  <strong>{position.ticker}</strong>
                  <span>{position.qty} × {formatCurrency(position.entry_price)}</span>
                  <span className="ops-position-status">Abierta</span>
                </div>
              ))}
            </div>
          )}
          <a className="ops-panel-link" href={sitePath('/dashboard/positions')}>Abrir posiciones <ArrowUpRight /></a>
        </div>
        <div className="ops-panel ops-runtime-panel">
          <PanelHeading eyebrow="Telemetría" title="Pulso del agente" detail="Ventana semanal" />
          <div className="ops-pulse-chart">
            {summary?.by_day.length ? (
              <ResponsiveContainer width="100%" height={170}>
                <BarChart data={summary.by_day} margin={{ top: 12, right: 0, left: -22, bottom: 0 }}>
                  <CartesianGrid stroke="#e1e5df" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#818980' }} tickFormatter={(value: string) => value.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#818980' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => [value, 'Sesiones']} contentStyle={{ border: '1px solid #dfe4dd', borderRadius: 4, fontSize: 12 }} />
                  <Bar dataKey="session_count" fill="#253022" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="Sin telemetría diaria disponible." />
            )}
          </div>
          <div className="ops-runtime-stats">
            <span><b>{summary ? formatTokens(summary.total_input_tokens) : '—'}</b> input</span>
            <span><b>{summary ? formatTokens(summary.total_output_tokens) : '—'}</b> output</span>
            <span><b>{summary ? String(summary.total_errors) : '—'}</b> errores</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, detail, accent, tone }: { label: string; value: string; detail: string; accent?: string; tone?: 'profit' | 'loss' }) {
  return (
    <div className={`ops-metric-card ${accent ? `ops-metric-${accent}` : ''}`}>
      <span>{label}</span>
      <strong className={tone ? `ops-value-${tone}` : ''}>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function BrokerCard({ account, broker, eyebrow }: { account: BrokerAccount; broker: string; eyebrow: string }) {
  const isPositive = account.status === 'healthy';
  const formatValue = (value: number | null) => value === null ? '—' : formatCurrency(value, account.currency);
  const pnl = account.daily_pnl === null ? '—' : `${formatValue(account.daily_pnl)}${account.daily_pnl_pct === null ? '' : ` · ${formatPercent(account.daily_pnl_pct)}`}`;
  return (
    <article className="ops-panel ops-broker-card">
      <div className="ops-broker-topline"><span className="ops-panel-eyebrow">{eyebrow}</span><span className={`ops-broker-status ${isPositive ? '' : 'ops-status-neutral'}`}><i /> {accountStatusLabel(account)}</span></div>
      <h2>{broker}</h2>
      <div className="ops-broker-primary"><strong>{formatValue(account.equity)}</strong><span>Equity observada</span></div>
      <div className="ops-broker-details">
        <div><span>Cash</span><strong>{formatValue(account.cash)}</strong></div>
        <div><span>Buying power</span><strong>{formatValue(account.buying_power)}</strong></div>
        <div><span>Posiciones</span><strong>{account.positions_count ?? '—'}</strong></div>
        <div><span>P&L día</span><strong>{pnl}</strong></div>
      </div>
      <p>{account.message ?? `Fuente: ${account.source}. Esta vista es solo lectura y no crea órdenes.`}</p>
    </article>
  );
}

function PanelHeading({ eyebrow, title, detail }: { eyebrow: string; title: string; detail: string }) {
  return (
    <div className="ops-panel-heading"><div><span className="ops-panel-eyebrow">{eyebrow}</span><h2>{title}</h2></div><span className="ops-panel-detail">{detail}</span></div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="ops-empty"><span className="ops-empty-mark">/</span><p>{text}</p></div>;
}
