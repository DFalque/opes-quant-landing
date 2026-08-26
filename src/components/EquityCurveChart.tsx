import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../lib/api';
import { ApiError } from '../lib/types';
import type { EquityCurvePoint } from '../lib/types';
import { formatCurrency } from '../lib/format';

interface Props {
  range?: '1w' | '1m' | '3m' | 'ytd' | 'all';
}

/**
 * Equity curve chart (React island). Fetches the data on mount and renders
 * a Recharts area chart. Shows a loading state and error fallback.
 */
export default function EquityCurveChart({ range = '3m' }: Props) {
  const [data, setData] = useState<EquityCurvePoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .equityCurve(range)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        if (e instanceof ApiError) {
          setError(`${e.status} ${e.message}`);
        } else {
          setError(e instanceof Error ? e.message : 'Error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  if (error) {
    return (
      <div className="card p-6 text-sm text-loss" data-testid="equity-error">
        Error cargando equity curve: {error}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="card p-6 text-sm text-muted" data-testid="equity-loading">
        Cargando…
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="card p-6 text-sm text-muted" data-testid="equity-empty">
        Sin datos para el rango {range}.
      </div>
    );
  }

  return (
    <div className="card" data-testid="equity-chart">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Equity curve ({range})
      </h3>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickFormatter={(d: string) => d.slice(5)}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickFormatter={(v: number) => `$${Math.round(v).toLocaleString()}`}
              width={70}
            />
            <Tooltip
              formatter={(v: number) => formatCurrency(v)}
              contentStyle={{ fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#equityFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
