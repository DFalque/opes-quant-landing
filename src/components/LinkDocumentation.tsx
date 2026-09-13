import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { sitePath } from '../lib/site-path';
import type { LinkDocumentation as LinkDocumentationData } from '../lib/link-documentation';

type Operation = LinkDocumentationData['groups'][number]['operations'][number];
type Field = LinkDocumentationData['groups'][number]['operations'][number]['request'][number];

function JsonBlock({ value, label }: { value: Record<string, unknown>; label: string }) {
  const [copied, setCopied] = useState(false);
  const content = JSON.stringify(value, null, 2);

  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="link-doc-code">
      <div className="link-doc-code-topline">
        <span>{label}</span>
        <button type="button" onClick={copy}>{copied ? 'Copiado' : 'Copiar'}</button>
      </div>
      <pre><code>{content}</code></pre>
    </div>
  );
}

function FieldTable({ fields, emptyLabel }: { fields: Field[]; emptyLabel: string }) {
  if (fields.length === 0) return <p className="link-doc-empty">{emptyLabel}</p>;

  return (
    <div className="link-doc-table-wrap">
      <table className="link-doc-table">
        <thead><tr><th>Campo</th><th>Tipo</th><th>Req.</th><th>Descripción</th></tr></thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.name}>
              <td><code>{field.name}</code></td>
              <td><code>{field.type}</code>{field.constraints && <small>{field.constraints}</small>}</td>
              <td>{field.required ? 'sí' : 'no'}</td>
              <td>{field.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Operation({ operation }: { operation: Operation }) {
  const methodClass = `link-doc-method link-doc-method-${operation.method.toLowerCase()}`;
  const stateClass = operation.state === 'deployed' ? 'link-doc-state-deployed' : 'link-doc-state-disabled';

  return (
    <details className="link-doc-operation" open={operation.id === 'link-market-bars'} data-link-operation data-search={`${operation.id} ${operation.title} ${operation.path} ${operation.description} ${operation.responseContract} ${operation.auth}`}>
      <summary>
        <span className={methodClass}>{operation.method}</span>
        <code>{operation.path}</code>
        <strong>{operation.title}</strong>
        <span className={stateClass}>{operation.state === 'deployed' ? 'deployed' : 'disabled by default'}</span>
      </summary>
      <div className="link-doc-operation-body">
        <div className="link-doc-operation-meta">
          <span>AUTH</span><strong>{operation.auth}</strong>
          <span>CONTRACT</span><strong>{operation.responseContract}</strong>
          <span>RUNTIME</span><strong>{operation.service} {operation.runtimeVersion}</strong>
        </div>
        <p className="link-doc-description">{operation.description}</p>
        <div className="link-doc-boundary"><span>BOUNDARY</span><p>{operation.boundary}</p></div>

        {(operation.requestExample || operation.responseExample) && (
          <div className="link-doc-examples">
            {operation.requestExample && <JsonBlock value={operation.requestExample} label="REQUEST / JSON" />}
            {operation.responseExample && <JsonBlock value={operation.responseExample} label="RESPONSE / EXCERPT" />}
          </div>
        )}

        <div className="link-doc-schema-grid">
          {operation.request.length > 0 && <section><h4>Request body</h4><FieldTable fields={operation.request} emptyLabel="Sin body." /></section>}
          {operation.query.length > 0 && <section><h4>Query / path</h4><FieldTable fields={operation.query} emptyLabel="Sin query." /></section>}
          <section><h4>Response</h4><FieldTable fields={operation.response} emptyLabel="Respuesta sin campos documentados." /></section>
        </div>

        <div className="link-doc-errors"><span>ERRORS</span><p>{operation.errors.join(' · ')}</p></div>
      </div>
    </details>
  );
}

export default function LinkDocumentation() {
  const [reference, setReference] = useState<LinkDocumentationData | null>(null);
  const [error, setError] = useState<'unauthorized' | 'generic' | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    api.linkDocumentation()
      .then((data) => { if (mounted) setReference(data); })
      .catch((reason: unknown) => {
        if (!mounted) return;
        setError(reason instanceof ApiError && (reason.status === 401 || reason.status === 403) ? 'unauthorized' : 'generic');
      });
    return () => { mounted = false; };
  }, []);

  const operationCount = useMemo(
    () => reference?.groups.reduce((total, group) => total + group.operations.length, 0) ?? 0,
    [reference],
  );

  if (error === 'unauthorized') {
    return (
      <div className="link-docs-page link-docs-state-page">
        <span className="link-doc-eyebrow">OPES / PRIVATE DOCUMENTATION</span>
        <h1>Esta referencia requiere<br /><em>una sesión autorizada.</em></h1>
        <p>Los contratos internos de Link no se envían al navegador hasta que el backend confirma tu sesión.</p>
        <a className="link-doc-primary-link" href={sitePath('/login')}>Abrir login <span>↗</span></a>
      </div>
    );
  }

  if (error === 'generic') {
    return (
      <div className="link-docs-page link-docs-state-page">
        <span className="link-doc-eyebrow">OPES / PRIVATE DOCUMENTATION</span>
        <h1>La referencia no está<br /><em>disponible ahora.</em></h1>
        <p>El backend no pudo entregar el catálogo. Revisa el estado del dashboard y vuelve a intentarlo.</p>
        <button className="link-doc-primary-link link-doc-retry" type="button" onClick={() => window.location.reload()}>Reintentar <span>↻</span></button>
      </div>
    );
  }

  if (!reference) {
    return <div className="link-docs-page link-docs-state-page"><span className="link-doc-eyebrow">OPES / PRIVATE DOCUMENTATION</span><h1>Cargando el mapa<br /><em>de Link.</em></h1></div>;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const visibleGroups = reference.groups
    .map((group) => ({
      ...group,
      operations: group.operations.filter((operation) => {
        if (!normalizedQuery) return true;
        const haystack = `${operation.id} ${operation.title} ${operation.path} ${operation.description} ${operation.responseContract} ${operation.auth}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      }),
    }))
    .filter((group) => group.operations.length > 0);

  return (
    <div className="link-docs-page">
      <header className="link-docs-hero">
        <div>
          <span className="link-doc-eyebrow">OPES / PRIVATE DOCUMENTATION / AUTHENTICATED</span>
          <h1>Link.<br /><em>Every call, accounted for.</em></h1>
          <p>Referencia operativa de los contratos desplegados. Cada operación conserva su provenance, su estado y su frontera de ejecución.</p>
        </div>
        <div className="link-doc-version-stack">
          {reference.runtimes.map((runtime) => <div key={runtime.id}><span>{runtime.name}</span><strong>v{runtime.version}</strong><small>{runtime.status}</small></div>)}
        </div>
      </header>

      <div className="link-doc-security-banner">
        <div><span>PRIVATE / READ-ONLY</span><strong>No decision. No order.</strong><p>El catálogo se sirve solo tras autenticación. Link normaliza evidencia y ciclo de vida de watches; no autoriza ni crea órdenes.</p></div>
        <div className="link-doc-security-facts"><span>OPERATIONS <b>{operationCount}</b></span><span>PUBLIC <b>0</b></span><span>EXECUTION <b>FALSE</b></span></div>
      </div>

      <section className="link-docs-section link-doc-semantics">
        <div className="link-doc-section-heading"><span>01 / SEMANTICS</span><h2>Lee el tiempo<br /><em>antes del dato.</em></h2></div>
        <div className="link-doc-semantic-grid">{reference.semantics.map((semantic) => <article key={semantic.term}><code>{semantic.term}</code><p>{semantic.meaning}</p></article>)}</div>
      </section>

      <section className="link-docs-section link-doc-reference" id="link-reference">
        <div className="link-doc-reference-heading"><div className="link-doc-section-heading"><span>02 / API REFERENCE</span><h2>La superficie<br /><em>completa.</em></h2></div><label className="link-doc-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar operaciones..." aria-label="Filtrar operaciones de Link" /></label></div>
        {visibleGroups.map((group) => (
          <section className="link-doc-group" key={group.id}>
            <div className="link-doc-group-heading"><div><span>{group.id === 'link-data' ? '02.1' : '02.2'}</span><h3>{group.name}</h3></div><p>v{group.version} / PRIVATE</p></div>
            {group.operations.map((operation) => <Operation key={operation.id} operation={operation} />)}
          </section>
        ))}
        {normalizedQuery && visibleGroups.length === 0 && <p className="link-doc-filter-note">No hay operaciones que coincidan con la búsqueda.</p>}
      </section>
    </div>
  );
}
