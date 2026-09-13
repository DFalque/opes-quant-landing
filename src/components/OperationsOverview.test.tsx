import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../lib/api', () => {
  class ApiError extends Error {
    status: number;
    body: unknown;
    constructor(status: number, body: unknown) {
      super(`HTTP ${status}`);
      this.status = status;
      this.body = body;
    }
  }

  return {
    ApiError,
    api: {
      health: vi.fn(),
      portfolio: vi.fn(),
      equityCurve: vi.fn(),
      positions: vi.fn(),
      agentMetricsSummary: vi.fn(),
      agentSessions: vi.fn(),
      accounts: vi.fn(),
      services: vi.fn(),
    },
  };
});

import { ApiError, api } from '../lib/api';
import OperationsOverview from './OperationsOverview';

const portfolio = {
  cash_balance: 4200.5,
  positions_count: 1,
  open_positions_value: 1800,
  total_equity: 6000.5,
  realized_pnl_total: 148.4,
  unrealized_pnl_total: 22.1,
  last_updated: '2026-09-13T09:58:00Z',
};

const summary = {
  range: '1w' as const,
  from_date: '2026-09-06',
  to_date: '2026-09-13',
  total_sessions: 2,
  with_metrics_sessions: 2,
  success_count: 2,
  failed_count: 0,
  running_count: 0,
  success_rate_pct: 100,
  total_runtime_seconds: 120,
  total_input_tokens: 1200,
  total_output_tokens: 500,
  total_cost_usd: 0.2,
  avg_cost_per_session_usd: 0.1,
  avg_runtime_per_session_seconds: 60,
  total_errors: 0,
  total_warnings: 0,
  by_day: [{ date: '2026-09-13', cost_usd: 0.2, runtime_seconds: 120, session_count: 2 }],
  metric_source: 'heuristic-v1',
  pricing_version: 'v1',
  top_subagents_by_cost: [],
};

describe('OperationsOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.health).mockResolvedValue({ status: 'ok', version: '0.55.6', db: 'ok', timestamp: '2026-09-13T10:00:00Z' });
    vi.mocked(api.portfolio).mockResolvedValue(portfolio);
    vi.mocked(api.equityCurve).mockResolvedValue([{ date: '2026-09-13', cash: 4200.5, positions_value: 1800, total: 6000.5 }]);
    vi.mocked(api.positions).mockResolvedValue({ items: [], total: 0, open_count: 0, closed_count: 0 });
    vi.mocked(api.agentMetricsSummary).mockResolvedValue(summary);
    vi.mocked(api.agentSessions).mockResolvedValue([]);
    vi.mocked(api.accounts).mockResolvedValue({
      checked_at: '2026-09-13T10:00:00Z',
      accounts: [
        {
          broker: 'alpaca', environment: 'alpaca-paper', status: 'healthy', account_id: '****1234',
          currency: 'USD', equity: 6000.5, cash: 4200.5, buying_power: 8000,
          daily_pnl: 18.4, daily_pnl_pct: 0.31, positions_count: 1, open_orders_count: 0,
          captured_at: '2026-09-13T10:00:00Z', age_seconds: 3, source: 'equity-account-snapshot-v1', message: null,
        },
        {
          broker: 'ibkr', environment: 'ibkr-paper', status: 'unavailable', account_id: null,
          currency: 'USD', equity: null, cash: null, buying_power: null,
          daily_pnl: null, daily_pnl_pct: null, positions_count: null, open_orders_count: null,
          captured_at: null, age_seconds: null, source: 'no-persisted-account-snapshot', message: 'Sin snapshot',
        },
      ],
    });
    vi.mocked(api.services).mockResolvedValue({
      checked_at: '2026-09-13T10:00:00Z',
      source: 'filesystem-heartbeat-manifest',
      services: [{ id: 'intelligence', name: 'Intelligence', domain: 'Decision context', status: 'healthy', version: 'v0.4.0', last_seen_at: '2026-09-13T10:00:00Z', source: 'heartbeat-manifest', message: null }],
    });
  });

  it('renders portfolio, broker cards, chart and production flow', async () => {
    render(<OperationsOverview />);

    await waitFor(() => expect(screen.getAllByText('$6,000.50').length).toBeGreaterThan(0));
    expect(screen.getByText('Alpaca')).toBeInTheDocument();
    expect(screen.getByText('Interactive Brokers')).toBeInTheDocument();
    expect(screen.getByTestId('equity-chart')).toBeInTheDocument();
    expect(screen.getByText('Cómo se mueve OPES')).toBeInTheDocument();
    expect(screen.getByText('Intelligence')).toBeInTheDocument();
  });

  it('keeps the dashboard useful and asks for login when protected data returns 401', async () => {
    vi.mocked(api.portfolio).mockRejectedValue(new ApiError(401, { detail: 'unauthorized' }));
    vi.mocked(api.equityCurve).mockRejectedValue(new ApiError(401, { detail: 'unauthorized' }));
    vi.mocked(api.positions).mockRejectedValue(new ApiError(401, { detail: 'unauthorized' }));
    vi.mocked(api.agentMetricsSummary).mockRejectedValue(new ApiError(401, { detail: 'unauthorized' }));
    vi.mocked(api.agentSessions).mockRejectedValue(new ApiError(401, { detail: 'unauthorized' }));

    render(<OperationsOverview />);

    await waitFor(() => expect(screen.getByTestId('operations-auth-required')).toBeInTheDocument());
    expect(screen.getByText('Interactive Brokers')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ir al login/ })).toHaveAttribute('href', '/login');
  });
});
