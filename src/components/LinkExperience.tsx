import { motion, useReducedMotion } from 'motion/react';

const macroTags = ['FED', 'ECB', 'BANCOS CENTRALES', 'GOBIERNOS', 'RESEARCH'];
const microTags = ['FILINGS', 'NOTICIAS', 'PRECIO', 'FUNDAMENTALES', 'EVENTOS'];

const enrichmentSteps = [
  {
    index: '01',
    label: 'CAPTURA',
    title: 'Trae la señal',
    copy: 'Recoge fuentes oficiales y voces relevantes, respetando su origen y momento.',
  },
  {
    index: '02',
    label: 'CONTRASTA',
    title: 'Pone las piezas frente a frente',
    copy: 'Compara versiones, detecta contradicciones y separa un hecho de una interpretación.',
  },
  {
    index: '03',
    label: 'CLASIFICA',
    title: 'Encuentra la escala',
    copy: 'Conecta cada evento con su país, sector, empresa, instrumento y horizonte temporal.',
  },
  {
    index: '04',
    label: 'CONECTA',
    title: 'Entrega contexto',
    copy: 'El resultado queda listo para Cortex, Atlas, Lens y la capa de decisión de OPES.',
  },
];

function SourceGlyph({ type }: { type: 'macro' | 'micro' }) {
  if (type === 'macro') {
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 5v30M5 20h30M9.4 9.4l21.2 21.2M30.6 9.4 9.4 30.6" />
        <circle cx="20" cy="20" r="7" />
        <circle cx="20" cy="5" r="2" />
        <circle cx="35" cy="20" r="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M7 30.5 15.5 22l5 4.5 12.5-15" />
      <path d="M25 11.5h8v8" />
      <path d="M7 34h27" />
      <circle cx="15.5" cy="22" r="2" />
      <circle cx="20.5" cy="26.5" r="2" />
    </svg>
  );
}

function EngineGlyph() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="44" />
      <circle cx="60" cy="60" r="28" />
      <circle cx="60" cy="60" r="5" />
      <path d="M60 16v16M60 88v16M16 60h16M88 60h16" />
      <path d="m29 29 11 11m40 40 11 11M91 29 80 40M40 80 29 91" />
    </svg>
  );
}

function LinkExperience() {
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.65, delay },
  });

  const fade = (delay = 0) => ({
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.65, delay },
  });

  return (
    <div className="link-experience">
      <section className="link-flow-section" id="link-flow" aria-labelledby="link-flow-title">
        <div className="link-flow-heading">
          <motion.div {...reveal()}>
            <span className="link-section-index">THE LINK FLOW / 01</span>
            <h2 id="link-flow-title">Recoge el mundo.<br /><em>Devuelve contexto.</em></h2>
            <p>
              Link no se limita a buscar información. La reúne, la pone en contexto y
              la convierte en una lectura que otras inteligencias pueden utilizar.
            </p>
          </motion.div>
          <motion.div className="link-flow-coordinates" {...reveal(0.15)} aria-hidden="true">
            <span>WORLD SIGNALS</span>
            <i />
            <span>CONTEXT ENGINE</span>
            <i />
            <span>OPES</span>
          </motion.div>
        </div>

        <motion.div className="link-flow-board" {...reveal(0.1)}>
          <div className="link-board-header">
            <span>LINK / INFORMATION LAYER</span>
            <span>CONCEPTUAL FLOW / 001</span>
          </div>

          <div className="link-flow-canvas">
            <svg className="link-flow-lines" viewBox="0 0 1100 620" preserveAspectRatio="none" aria-hidden="true">
              <path className="link-flow-line link-flow-line-macro" d="M297 206C350 206 364 286 468 310" />
              <path className="link-flow-line link-flow-line-micro" d="M297 483C350 483 364 334 468 310" />
              <path className="link-flow-line link-flow-line-output" d="M632 310C736 310 750 139 803 139" />
              <path className="link-flow-line link-flow-line-output" d="M632 310C736 310 750 279 803 279" />
              <circle className="link-flow-node" cx="468" cy="310" r="4" />
              <circle className="link-flow-node" cx="632" cy="310" r="4" />
            </svg>

            <div className="link-flow-column link-flow-inputs">
              <div className="link-column-header"><span>01</span><span>INPUTS</span></div>
              <motion.article className="link-source-card link-source-card-macro" {...reveal(0.2)}>
                <div className="link-source-topline">
                  <span className="link-source-glyph"><SourceGlyph type="macro" /></span>
                  <span>MACRO / SECTOR</span>
                </div>
                <h3>Lo que mueve el tablero.</h3>
                <p>Decisiones públicas, economía, sectores y señales que cambian el clima del mercado.</p>
                <div className="link-tag-list">
                  {macroTags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </motion.article>

              <motion.article className="link-source-card link-source-card-micro" {...reveal(0.3)}>
                <div className="link-source-topline">
                  <span className="link-source-glyph"><SourceGlyph type="micro" /></span>
                  <span>MICRO / EMPRESA</span>
                </div>
                <h3>Lo que explica el activo.</h3>
                <p>Noticias, filings, precio, fundamentales y eventos alrededor de cada compañía.</p>
                <div className="link-tag-list">
                  {microTags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </motion.article>
            </div>

            <motion.div className="link-engine" {...reveal(0.4)}>
              <div className="link-engine-orbit">
                <span className="link-engine-ring link-engine-ring-outer" />
                <span className="link-engine-ring link-engine-ring-inner" />
                <span className="link-engine-spark link-engine-spark-one" />
                <span className="link-engine-spark link-engine-spark-two" />
                <div className="link-engine-core">
                  <EngineGlyph />
                  <strong>LINK</strong>
                </div>
              </div>
              <div className="link-engine-label"><i /> ENRICHMENT ENGINE</div>
              <p>La IA vuelve legible lo que el mundo cuenta de forma fragmentada.</p>
            </motion.div>

            <div className="link-flow-column link-flow-outputs">
              <div className="link-column-header"><span>03</span><span>CONTEXT</span></div>
              <motion.article className="link-output-card" {...fade(0.5)}>
                <div className="link-output-mark">C</div>
                <div>
                  <span>MEMORY LAYER</span>
                  <h3>Cortex</h3>
                  <p>Guarda relaciones, temporalidad y memoria semántica.</p>
                </div>
              </motion.article>
              <motion.article className="link-output-card" {...fade(0.6)}>
                <div className="link-output-mark link-output-mark-accent">O</div>
                <div>
                  <span>INTELLIGENCE LAYER</span>
                  <h3>Atlas · Lens · OPES</h3>
                  <p>El contexto llega a quien tiene que entenderlo y decidir.</p>
                </div>
              </motion.article>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="link-process-section" aria-labelledby="link-process-title">
        <div className="link-process-heading">
          <span className="link-section-index">THE METHOD / 02</span>
          <h2 id="link-process-title">No resume el mundo.<br /><em>Lo hace legible.</em></h2>
          <p>
            Cada pieza conserva su procedencia. Cada conexión explica por qué importa.
            El resultado no es más ruido: es una visión con escala, evidencia y memoria.
          </p>
        </div>
        <div className="link-process-grid">
          {enrichmentSteps.map((step, index) => (
            <motion.article className="link-process-card" key={step.index} {...reveal(index * 0.08)}>
              <div className="link-process-card-topline"><span>{step.index}</span><i /></div>
              <span className="link-process-label">{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="link-perspective-section" aria-labelledby="link-perspective-title">
        <motion.div className="link-perspective-copy" {...reveal()}>
          <span className="link-section-index">THE PERSPECTIVE / 03</span>
          <h2 id="link-perspective-title">Una misma realidad.<br /><em>Tres escalas de lectura.</em></h2>
        </motion.div>
        <div className="link-perspective-grid">
          <motion.article className="link-perspective-card link-perspective-card-macro" {...reveal(0.12)}>
            <span>01 / MACRO</span>
            <strong>¿Qué está cambiando?</strong>
            <p>Países, bancos centrales y economía.</p>
          </motion.article>
          <motion.article className="link-perspective-card link-perspective-card-sector" {...reveal(0.2)}>
            <span>02 / SECTOR</span>
            <strong>¿Dónde se concentra?</strong>
            <p>Industria, rotación y sensibilidad.</p>
          </motion.article>
          <motion.article className="link-perspective-card link-perspective-card-company" {...reveal(0.28)}>
            <span>03 / EMPRESA</span>
            <strong>¿A quién afecta?</strong>
            <p>Compañías, activos y decisiones.</p>
          </motion.article>
        </div>
        <p className="link-perspective-footer">El contexto correcto cambia el significado de cualquier precio.</p>
      </section>
    </div>
  );
}

export default LinkExperience;
