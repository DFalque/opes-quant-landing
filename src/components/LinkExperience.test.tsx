import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import LinkExperience from './LinkExperience';

describe('LinkExperience', () => {
  it('renders both information branches and the enrichment engine', () => {
    render(<LinkExperience />);

    expect(screen.getByRole('heading', { name: /Recoge el mundo/i })).toBeInTheDocument();
    expect(screen.getByText('MACRO / SECTOR')).toBeInTheDocument();
    expect(screen.getByText('MICRO / EMPRESA')).toBeInTheDocument();
    expect(screen.getByText('ENRICHMENT ENGINE')).toBeInTheDocument();
  });

  it('explains the four context operations and downstream consumers', () => {
    render(<LinkExperience />);

    expect(screen.getByText('CAPTURA')).toBeInTheDocument();
    expect(screen.getByText('CONTRASTA')).toBeInTheDocument();
    expect(screen.getByText('CLASIFICA')).toBeInTheDocument();
    expect(screen.getByText('CONECTA')).toBeInTheDocument();
    expect(screen.getByText('Cortex')).toBeInTheDocument();
    expect(screen.getByText('Atlas · Lens · OPES')).toBeInTheDocument();
  });
});
