import { motion, useReducedMotion } from 'motion/react';
import { landingServices } from '../data/landing-services';
import { sitePath } from '../lib/site-path';

const stages = [
  {
    number: '01',
    label: 'RECIBE',
    title: 'El mercado llega con contexto.',
    copy: 'Link conecta las fuentes y ordena los datos antes de que otra inteligencia los interprete. Así cada lectura sabe de dónde viene y de qué momento es.',
    tone: 'lime',
  },
  {
    number: '02',
    label: 'INTERPRETA',
    title: 'Cada pregunta tiene su propia mirada.',
    copy: 'Atlas, Lens, Wave, Flux y Signal observan escalas diferentes: el entorno, la empresa, el precio, las opciones y la evidencia estadística.',
    tone: 'blue',
  },
  {
    number: '03',
    label: 'REVISA',
    title: 'Las piezas se reúnen sin ocultar las dudas.',
    copy: 'OPES Intelligence compara las lecturas y prepara una recomendación auditable. Vision la hace visible y la revisión humana completa el ciclo.',
    tone: 'violet',
  },
];

const publicRoles: Record<string, string> = {
  signal: 'Contrasta hipótesis con datos históricos.',
  atlas: 'Lee el clima macroeconómico.',
  lens: 'Mira la salud de cada empresa.',
  wave: 'Lee precio, tendencia y estructura.',
  flux: 'Observa opciones y volatilidad.',
  cortex: 'Conserva memoria y contexto.',
  reflex: 'Convierte la revisión en aprendizaje.',
  link: 'Conecta fuentes y ordena los datos.',
  vision: 'Presenta la evidencia de forma visual.',
  'opes-intelligence': 'Reúne las lecturas y sus contradicciones.',
};

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 13 13 3M5 3h8v8" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M13 8H3M7 4 3 8l4 4" />
    </svg>
  );
}

function ArchitecturePage() {
  const reduceMotion = useReducedMotion();
  const architectureUrl = sitePath('/architecture/opes-public.architecture.html');
  const architectureEmbedUrl = `${architectureUrl}?theme=light&present=1`;

  const reveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="architecture-page">
      <nav className="architecture-nav" aria-label="Navegación de arquitectura">
        <a className="architecture-brand" href={sitePath('/')} aria-label="Volver a OPES">
          <span className="architecture-brand-orbit" aria-hidden="true"><span /></span>
          <span>opes</span>
        </a>
        <div className="architecture-nav-meta">
          <span>PUBLIC SYSTEM MAP</span>
          <a href={sitePath('/documentation')}>API docs</a>
          <a href={sitePath('/')}><ArrowLeft /> Volver a OPES</a>
        </div>
      </nav>

      <main>
        <section className="architecture-hero" aria-labelledby="architecture-title">
          <div className="architecture-hero-grid" aria-hidden="true" />
          <div className="architecture-hero-glow" aria-hidden="true" />
          <motion.div
            className="architecture-hero-copy"
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.7 }}
          >
            <span className="architecture-eyebrow">OPES / PUBLIC ARCHITECTURE</span>
            <h1 id="architecture-title">Cómo circula<br /><em>una idea</em> por OPES.</h1>
            <p>
              OPES no es una caja negra ni un único bot. Es una red de inteligencias que
              mira el mercado desde varios ángulos y reúne las piezas cuando están listas.
            </p>
            <div className="architecture-hero-note">
              <span className="architecture-note-dot" />
              <span>Mapa público de alto nivel / sin detalles privados</span>
            </div>
          </motion.div>
          <div className="architecture-hero-side" aria-label="Resumen de la arquitectura">
            <span className="architecture-side-line" />
            <strong>01 — 03</strong>
            <p>Recibir.<br />Interpretar.<br />Revisar.</p>
          </div>
        </section>

        <section className="architecture-map-section" id="mapa" aria-labelledby="map-title">
          <motion.div
            className="architecture-section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={reveal}
            transition={{ duration: 0.7 }}
          >
            <div>
              <span className="architecture-section-index">01 / EL MAPA</span>
              <h2 id="map-title">Una red de piezas.<br /><em>Una lectura completa.</em></h2>
            </div>
            <p>
              Este mapa muestra las relaciones principales del sistema. No pretende enseñar
              cada cable: enseña qué responsabilidad tiene cada pieza y cómo pasa el contexto
              de una a otra.
            </p>
          </motion.div>

          <div className="architecture-map-frame">
            <div className="architecture-map-bar">
              <span><i /> ARCHIFY / OPES PUBLIC MAP</span>
              <span>INTERACTIVE SYSTEM VIEW</span>
            </div>
            <iframe
              className="architecture-map-iframe"
              src={architectureEmbedUrl}
              title="Mapa público de arquitectura de OPES"
              sandbox="allow-scripts"
            />
            <div className="architecture-mobile-map" aria-label="Resumen móvil del flujo de OPES">
              <span className="architecture-mobile-map-kicker">MAPA RESUMIDO / MÓVIL</span>
              <div className="architecture-mobile-map-flow">
                <div className="architecture-mobile-map-line" aria-hidden="true" />
                <div className="architecture-mobile-map-node">
                  <span className="architecture-mobile-map-dot" />
                  <span><strong>Fuentes externas</strong><small>datos del mercado y research</small></span>
                </div>
                <div className="architecture-mobile-map-node">
                  <span className="architecture-mobile-map-dot" />
                  <span><strong>Link</strong><small>conecta y ordena los datos</small></span>
                </div>
                <div className="architecture-mobile-map-node">
                  <span className="architecture-mobile-map-dot" />
                  <span><strong>Inteligencias especializadas</strong><small>macro, empresa, precio, opciones y estadística</small></span>
                </div>
                <div className="architecture-mobile-map-node">
                  <span className="architecture-mobile-map-dot" />
                  <span><strong>OPES Intelligence</strong><small>reúne las lecturas y sus contradicciones</small></span>
                </div>
                <div className="architecture-mobile-map-node">
                  <span className="architecture-mobile-map-dot" />
                  <span><strong>Revisión humana</strong><small>el resultado se entiende y se revisa</small></span>
                </div>
              </div>
            </div>
            <div className="architecture-map-caption">
              <span>Usa el mapa para buscar, enfocar una pieza o seguir una ruta.</span>
              <a href={architectureUrl} target="_blank" rel="noreferrer">
                Abrir mapa completo <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        <section className="architecture-stages-section" aria-labelledby="stages-title">
          <div className="architecture-section-heading architecture-section-heading-compact">
            <div>
              <span className="architecture-section-index">02 / LA HISTORIA</span>
              <h2 id="stages-title">El sistema en<br /><em>tres movimientos.</em></h2>
            </div>
            <p>Una forma sencilla de leer el diagrama sin necesitar conocer la tecnología que hay detrás.</p>
          </div>
          <div className="architecture-stages-grid">
            {stages.map((stage, index) => (
              <motion.article
                className={`architecture-stage architecture-stage-${stage.tone}`}
                key={stage.number}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={reveal}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <div className="architecture-stage-topline">
                  <span>{stage.number}</span>
                  <span>{stage.label}</span>
                </div>
                <h3>{stage.title}</h3>
                <p>{stage.copy}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="architecture-services-section" aria-labelledby="roles-title">
          <div className="architecture-section-heading architecture-section-heading-compact">
            <div>
              <span className="architecture-section-index">03 / LAS PIEZAS</span>
              <h2 id="roles-title">Quién hace<br /><em>qué.</em></h2>
            </div>
            <p>El vocabulario técnico queda debajo de una pregunta más útil: ¿qué aporta cada pieza a la lectura?</p>
          </div>
          <div className="architecture-services-list">
            {landingServices.map((service, index) => (
              <a
                className="architecture-service-row"
                href={sitePath(`/landing/${service.slug}`)}
                key={service.slug}
              >
                <span className={`architecture-service-mark architecture-service-mark-${service.tone}`}>{service.mark}</span>
                <span className="architecture-service-number">0{index + 1}</span>
                <span className="architecture-service-name">{service.name}</span>
                <span className="architecture-service-role">{publicRoles[service.slug]}</span>
                <ArrowUpRight />
              </a>
            ))}
          </div>
        </section>

        <section className="architecture-boundary-section" aria-labelledby="boundary-title">
          <div className="architecture-boundary-mark" aria-hidden="true"><span>O</span></div>
          <div>
            <span className="architecture-section-index">04 / EL LÍMITE</span>
            <h2 id="boundary-title">No todo lo que<br />analiza <em>ejecuta.</em></h2>
            <p>
              La arquitectura separa la lectura de la acción. Los servicios analíticos producen
              contexto y evidencia; las capas de coordinación y seguridad deciden qué puede
              pasar después. La revisión humana sigue teniendo un lugar visible.
            </p>
            <a className="architecture-text-link" href={sitePath('/')}>
              Volver a la visión de OPES <ArrowUpRight />
            </a>
          </div>
        </section>
      </main>

      <footer className="architecture-footer">
        <span>opes / public architecture</span>
        <span>High-level system map / 2026</span>
      </footer>
    </div>
  );
}

export default ArchitecturePage;
