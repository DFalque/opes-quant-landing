import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { api, ApiError } from '../lib/api';
import LinkDocumentation from './LinkDocumentation';
import type { LinkDocumentation as LinkDocumentationData } from '../lib/link-documentation';

const reference: LinkDocumentationData = {
  version: 'link-private-reference-v1',
  scope: 'authenticated-dashboard-only',
  title: 'Link / Private contract reference',
  updatedAt: '2026-09-13',
  security: {
    public: false,
    transport: 'private service network',
    credentialPolicy: 'The dashboard never receives or displays Link bearer tokens.',
    execution: { readOnly: true, canAuthorizeOrder: false, canCreateOrder: false },
  },
  semantics: [{ term: 'asOf', meaning: 'Requested cutoff.' }],
  runtimes: [
    { id: 'link-data', name: 'Link Data', version: '0.15.0', status: 'deployed', description: 'Data plane.', boundary: 'No writes.' },
    { id: 'link-live', name: 'Link Live', version: '0.11.0', status: 'deployed', description: 'Watch plane.', boundary: 'No broker writes.' },
  ],
  groups: [{
    id: 'link-data',
    name: 'Link Data',
    version: '0.15.0',
    operations: [{
      id: 'link-market-bars',
      title: 'Obtener barras OHLCV',
      service: 'Link Data',
      runtimeVersion: '0.15.0',
      method: 'POST',
      path: '/v1/market-bars',
      visibility: 'private',
      state: 'deployed',
      auth: 'Bearer; private service token',
      description: 'Barras cerradas.',
      responseContract: 'link-market-bars-response-v1',
      boundary: 'No order creation.',
      request: [{ name: 'instrumentId', type: 'MARKET:TICKER', required: true, description: 'Instrument.' }],
      query: [],
      response: [{ name: 'bars', type: 'bar[]', required: true, description: 'OHLCV.' }],
      errors: ['400 invalid request'],
      requestExample: { version: 'link-market-bars-request-v1', instrumentId: 'US:AAPL' },
      responseExample: { status: 'PARTIAL', pitStatus: 'UNVERIFIED' },
    }],
  }],
};

describe('LinkDocumentation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders deployed runtimes, operation schema and examples after auth', async () => {
    vi.spyOn(api, 'linkDocumentation').mockResolvedValue(reference);

    render(<LinkDocumentation />);

    await waitFor(() => expect(screen.getByText('Obtener barras OHLCV')).toBeInTheDocument());
    expect(screen.getAllByText('Link Data').length).toBeGreaterThan(0);
    expect(screen.getAllByText('v0.15.0').length).toBeGreaterThan(0);
    expect(screen.getByText('link-market-bars-response-v1')).toBeInTheDocument();
    expect(screen.getByText('instrumentId')).toBeInTheDocument();
    expect(screen.getByText('PRIVATE / READ-ONLY')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Filtrar operaciones de Link'), { target: { value: 'options' } });
    expect(screen.getByText('No hay operaciones que coincidan con la búsqueda.')).toBeInTheDocument();
  });

  it('does not render private catalog data when the backend rejects the session', async () => {
    vi.spyOn(api, 'linkDocumentation').mockRejectedValue(new ApiError(401, { detail: 'unauthorized' }));

    render(<LinkDocumentation />);

    await waitFor(() => expect(screen.getByRole('link', { name: /Abrir login/i })).toBeInTheDocument());
    expect(screen.queryByText('/v1/market-bars')).not.toBeInTheDocument();
  });
});
