/**
 * TypeScript types matching the FastAPI Pydantic schemas.
 * Source of truth: backend/opes_quant_dashboard/schemas.py
 */

export type Role = 'admin' | 'editor' | 'viewer';

export interface User {
  id: number;
  username: string;
  role: Role;
  created_at: string;
  last_login_at: string | null;
  activo: number;
}

export interface PortfolioSummary {
  cash_balance: number;
  positions_count: number;
  open_positions_value: number;
  total_equity: number;
  realized_pnl_total: number;
  unrealized_pnl_total: number;
  last_updated: string;
}

export interface EquityCurvePoint {
  date: string;
  cash: number;
  positions_value: number;
  total: number;
}

export type PositionStatus = 'open' | 'closed' | 'cancelled';

export interface Position {
  id: number;
  ticker: string;
  qty: number;
  entry_price: number;
  entry_ts: string;
  exit_price: number | null;
  exit_ts: string | null;
  status: PositionStatus;
  pnl: number | null;
  pnl_pct: number | null;
  close_reason: string | null;
}

export interface PositionList {
  items: Position[];
  total: number;
  open_count: number;
  closed_count: number;
}

export type OrderSide = 'buy' | 'sell';

export interface Order {
  id: number;
  ticker: string;
  side: OrderSide;
  qty: number;
  order_type: string;
  limit_price: number | null;
  filled_price: number | null;
  status: string;
  submitted_ts: string;
  filled_ts: string | null;
  alpaca_order_id: string | null;
  position_id: number | null;
  session_id: number | null;
}

export interface OrderList {
  items: Order[];
  total: number;
}

export interface Analysis {
  id: number;
  session_id: number;
  ticker: string;
  ts: string;
  skill_name: string;
  decision: string | null;
  confidence: number | null;
  reasoning: string | null;
  file_path: string | null;
}

export interface AnalysisList {
  items: Analysis[];
  total: number;
}

export interface AnalysisDetail extends Analysis {
  json_blob: Record<string, unknown>;
}

export interface AgentMetric {
  id: number;
  session_id: number;
  started_at: string;
  ended_at: string | null;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  errors_count: number;
  warnings_count: number;
}

export interface AgentSession {
  id: number;
  session_key: string;
  started_at: string;
  ended_at: string | null;
  status: string;
  model: string | null;
  agent_type: string | null;
  trigger: string | null;
  notes: string | null;
  duration_seconds: number | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_usd: number | null;
  errors_count: number | null;
  warnings_count: number | null;
  subagent_calls: number | null;
  metric_source: string | null;
  subagents: SubagentMetric[];
}

export interface SubagentMetric {
  name: string;
  task_id: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number;
  attempts: number;
  status: string;
  input_chars: number;
  output_chars: number;
  decisions_count: number;
  signals_count: number;
  errors_count: number;
  tools_called_count: number;
  cost_usd: number;
  metric_source: string | null;
}

export interface TopSubagent {
  name: string;
  invocations: number;
  total_duration_seconds: number;
  total_cost_usd: number;
  total_decisions: number;
  total_errors: number;
  avg_duration_seconds: number;
  avg_cost_usd: number;
  max_cost_usd: number;
}

export interface DailyMetricPoint {
  date: string;
  cost_usd: number;
  runtime_seconds: number;
  session_count: number;
}

export interface AgentSummary {
  range: '1d' | '1w' | '1m' | 'all';
  from_date: string;
  to_date: string;
  total_sessions: number;
  with_metrics_sessions: number;
  success_count: number;
  failed_count: number;
  running_count: number;
  success_rate_pct: number;
  total_runtime_seconds: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cost_usd: number;
  avg_cost_per_session_usd: number;
  avg_runtime_per_session_seconds: number;
  total_errors: number;
  total_warnings: number;
  by_day: DailyMetricPoint[];
  metric_source: string | null;
  pricing_version: string | null;
  top_subagents_by_cost: TopSubagent[];
}

export interface Skill {
  name: string;
  frontmatter: Record<string, unknown>;
  body: string;
  raw: string;
}

export interface SkillDraft {
  id: number;
  skill_name: string;
  user_id: number;
  frontmatter_yaml: string;
  body_markdown: string;
  bump_type: 'patch' | 'minor' | 'major';
  status: 'draft' | 'publishing' | 'published' | 'failed';
  created_at: string;
  updated_at: string;
  published_at: string | null;
  commit_sha: string | null;
}

export interface HealthStatus {
  status: 'ok' | 'degraded';
  version: string;
  db: string;
  timestamp: string;
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `API error ${status}`);
    this.status = status;
    this.body = body;
    this.name = 'ApiError';
  }
}
