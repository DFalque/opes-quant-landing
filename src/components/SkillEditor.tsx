import { useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { Skill, SkillDraft } from '../lib/types';
import SkillMarkdown from './SkillMarkdown';

interface Props {
  skillName: string;
}

/**
 * Skill editor (React island). Loads the current SKILL.md, splits it into
 * frontmatter (YAML) and body (markdown), and shows two textareas with
 * a live preview of the rendered markdown body. Buttons: "Save draft" and
 * "Publish" (admin only).
 */
export default function SkillEditor({ skillName }: Props) {
  const [frontmatter, setFrontmatter] = useState('');
  const [body, setBody] = useState('');
  const [bumpType, setBumpType] = useState<'patch' | 'minor' | 'major'>('patch');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [me, skill] = await Promise.all([api.me(), api.skill(skillName)]);
        if (cancelled) return;
        setUser({ username: me.username, role: me.role });
        setFrontmatter(skill.raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)?.[1] ?? '');
        setBody(skill.body);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [skillName]);

  async function saveDraft() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await api.createDraft(skillName, {
        frontmatter_yaml: frontmatter,
        body_markdown: body,
        bump_type: bumpType,
      });
      setMessage('Borrador guardado.');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : (e instanceof Error ? e.message : 'Error'));
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    if (!confirm('¿Publicar este cambio? Esto hará commit, tag y push al repo del server.')) {
      return;
    }
    setPublishing(true);
    setError(null);
    setMessage(null);
    try {
      // First save the draft
      await api.createDraft(skillName, {
        frontmatter_yaml: frontmatter,
        body_markdown: body,
        bump_type: bumpType,
      });
      // Then publish
      const result = await fetch(`/api/skills/${skillName}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${localStorage.getItem('opes_auth') ? JSON.parse(localStorage.getItem('opes_auth')!).username : ''}:${localStorage.getItem('opes_auth') ? JSON.parse(localStorage.getItem('opes_auth')!).password : ''}`)}`,
        },
      });
      const data = await result.json();
      if (data.status === 'success') {
        setMessage(`✓ ${data.message}`);
      } else {
        setError(`Publicación falló: ${data.message}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return <div className="card text-sm text-muted" data-testid="editor-loading">Cargando skill…</div>;
  }
  if (error && !frontmatter) {
    return <div className="card text-sm text-loss" data-testid="editor-load-error">Error: {error}</div>;
  }

  const canPublish = user?.role === 'admin';

  return (
    <div className="space-y-4" data-testid="skill-editor">
      {message && (
        <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-800" data-testid="editor-message">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700" data-testid="editor-error">
          {error}
        </div>
      )}

      <div className="card">
        <label className="label" htmlFor="frontmatter">
          Frontmatter (YAML)
        </label>
        <textarea
          id="frontmatter"
          data-testid="frontmatter-input"
          value={frontmatter}
          onChange={(e) => setFrontmatter(e.target.value)}
          rows={8}
          className="input font-mono text-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <label className="label" htmlFor="body">
            Body (Markdown)
          </label>
          <textarea
            id="body"
            data-testid="body-input"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={20}
            className="input font-mono text-sm"
          />
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Preview</h3>
          <div
            data-testid="preview"
            className="p-3 bg-gray-50 border border-gray-200 rounded min-h-[400px] overflow-auto"
          >
            <SkillMarkdown body={body} />
          </div>
        </div>
      </div>

      <div className="card flex items-center gap-4 flex-wrap">
        <div>
          <label className="label" htmlFor="bump">Bump</label>
          <select
            id="bump"
            data-testid="bump-select"
            value={bumpType}
            onChange={(e) => setBumpType(e.target.value as 'patch' | 'minor' | 'major')}
            className="input"
          >
            <option value="patch">patch (0.0.X)</option>
            <option value="minor">minor (0.X.0)</option>
            <option value="major">major (X.0.0)</option>
          </select>
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={saveDraft}
          disabled={saving || publishing}
          className="btn-secondary"
          data-testid="save-draft-btn"
        >
          {saving ? 'Guardando…' : 'Guardar borrador'}
        </button>
        {canPublish && (
          <button
            type="button"
            onClick={publish}
            disabled={saving || publishing}
            className="btn-primary"
            data-testid="publish-btn"
          >
            {publishing ? 'Publicando…' : 'Publicar'}
          </button>
        )}
      </div>
    </div>
  );
}
