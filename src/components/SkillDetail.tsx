import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Skill } from '../lib/types';
import SkillMarkdown from './SkillMarkdown';

/**
 * Read-only skill detail view. Loaded as a React island in
 * /skills/[name].astro. Reads the skill name from the URL path
 * (since the Astro page is a static placeholder for SPA fallback).
 *
 * Renders:
 *  - back link
 *  - skill header (name, version, description)
 *  - full frontmatter (collapsible details)
 *  - markdown body via <SkillMarkdown>
 */
export default function SkillDetail() {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const name = parts[1] ?? '';
      if (!name) {
        if (!cancelled) setError('Nombre de skill inválido');
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const s = await api.skill(name);
        if (!cancelled) setSkill(s);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="card text-sm text-muted" data-testid="skill-detail-loading">
        Cargando skill…
      </div>
    );
  }
  if (error || !skill) {
    return (
      <div className="card text-sm text-loss" data-testid="skill-detail-error">
        Error: {error ?? 'Skill no encontrada'}
      </div>
    );
  }

  const fm = skill.frontmatter ?? {};
  const version = fm.version ?? '—';
  const description = fm.description ?? '(sin descripción)';
  const fmEntries = Object.entries(fm);
  const editHref = `/skills/${skill.name}/edit`;

  return (
    <div data-testid="skill-detail">
      <div className="mb-4 flex items-center justify-between">
        <a
          href="/skills"
          className="text-sm text-brand-600 hover:text-brand-700"
        >
          &larr; Volver a skills
        </a>
        <a
          href={editHref}
          className="text-sm text-brand-600 hover:text-brand-700"
          data-testid="skill-edit-link"
        >
          Editar →
        </a>
      </div>

      <div className="card mb-4">
        <div className="flex items-center justify-between mb-2 gap-4">
          <h2 className="text-2xl font-bold font-mono break-all">{skill.name}</h2>
          <span className="text-sm font-mono text-muted shrink-0">v{version}</span>
        </div>
        <p className="text-sm text-muted">{description}</p>
        {fmEntries.length > 0 ? (
          <details className="mt-4">
            <summary className="text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer">
              Frontmatter completo
            </summary>
            <pre className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto font-mono">
              {fmEntries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n')}
            </pre>
          </details>
        ) : null}
      </div>

      <div className="card" data-testid="skill-body">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Body</h3>
        <SkillMarkdown body={skill.body} />
      </div>
    </div>
  );
}
