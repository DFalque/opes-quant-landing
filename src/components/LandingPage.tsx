import { useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { decisionLayer, linkService, serviceModules, visionService } from '../data/landing-services';
import { sitePath } from '../lib/site-path';

const processSteps = [
  {
    number: '01',
    label: 'Recoger',
    title: 'Todo empieza por las fuentes.',
    copy: 'Los datos llegan con identidad, momento, proveedor y procedencia antes de convertirse en evidencia.',
  },
  {
    number: '02',
    label: 'Entender',
    title: 'Cada dato encuentra su escala.',
    copy: 'Macro, sector, empresa, precio y opciones responden preguntas distintas. OPES no los mezcla sin contexto.',
  },
  {
    number: '03',
    label: 'Converger',
    title: 'Las lecturas se ponen a prueba.',
    copy: 'La convergencia reúne evidencia y contradicciones para producir una recomendación auditable, no una orden automática.',
  },
  {
    number: '04',
    label: 'Revisar',
    title: 'Lo ocurrido queda disponible.',
    copy: 'La memoria y el feedback forman una capa de revisión para entender qué funcionó, qué falló y qué queda por demostrar.',
  },
];

const metrics = [
  { value: '10', label: 'servicios en el ecosistema' },
  { value: '3', label: 'escalas de contexto' },
  { value: 'READ-ONLY', label: 'frontera analítica actual' },
];

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 13 13 3M5 3h8v8" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" />
    </svg>
  );
}

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const rawHeroY = useTransform(scrollYProgress, [0, 0.35], [0, -96]);
  const heroY = useSpring(rawHeroY, { stiffness: 80, damping: 24 });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.15]);

  const reveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="landing-page">
      <div className="landing-noise" aria-hidden="true" />
      <nav className="landing-nav" aria-label="Navegación principal">
        <a className="landing-brand" href={sitePath('/')} aria-label="opes, inicio">
          <span className="brand-orbit" aria-hidden="true">
            <span />
          </span>
          <span>opes</span>
        </a>

        <div id="landing-links" className={`landing-links ${menuOpen ? 'is-open' : ''}`}>
          <a href="#sistema" onClick={() => setMenuOpen(false)}>El sistema</a>
          <a href="#metodo" onClick={() => setMenuOpen(false)}>El método</a>
          <a href="#criterio" onClick={() => setMenuOpen(false)}>Criterio</a>
        </div>

        <a className="nav-action" href="#contacto">
          Explorar OPES <ArrowUpRight />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="landing-links"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </nav>

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow hero-glow-one" aria-hidden="true" />
          <div className="hero-glow hero-glow-two" aria-hidden="true" />

          <motion.div
            className="hero-copy"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              OPES / MARKET INTELLIGENCE SYSTEM
            </motion.p>
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              Todo el contexto.
              <br />
              <em>Una forma de entenderlo.</em>
            </motion.h1>
            <motion.p
              className="hero-lede"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42 }}
            >
              OPES conecta datos, análisis, memoria y criterio para separar lo que ocurre,
              lo que importa y lo que todavía no está claro.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.56 }}
            >
              <a className="button button-light" href="#sistema">
                Entender el sistema <ArrowDown />
              </a>
              <a className="text-link" href="#criterio">
                No es una señal. Es el proceso <ArrowUpRight />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-signal"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="signal-topline">
              <span className="signal-label">SESSION / DEMO</span>
              <span className="live-state"><i /> OPES VIEW</span>
            </div>
            <div className="signal-heading">
              <span>US:AAPL</span>
              <strong>ANALYSIS ONLY</strong>
            </div>
            <div className="signal-chart" aria-label="Gráfico abstracto de contexto de mercado">
              <svg viewBox="0 0 520 190" role="img" aria-hidden="true" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="signal-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c5ff4a" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#c5ff4a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path className="chart-fill" d="M0 155 C35 148 36 117 72 126 S100 140 126 115 S160 90 190 108 S221 124 244 86 S274 104 301 74 S328 105 358 55 S385 82 417 45 S448 74 477 30 S500 26 520 14 V190 H0Z" />
                <motion.path
                  className="chart-line"
                  d="M0 155 C35 148 36 117 72 126 S100 140 126 115 S160 90 190 108 S221 124 244 86 S274 104 301 74 S328 105 358 55 S385 82 417 45 S448 74 477 30 S500 26 520 14"
                  initial={{ pathLength: reduceMotion ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, delay: 0.85, ease: 'easeOut' }}
                />
                <circle className="chart-dot" cx="477" cy="30" r="4" />
              </svg>
              <div className="chart-axis"><span>09:30</span><span>12:00</span><span>16:00</span></div>
            </div>
            <div className="signal-footer">
              <span><small>SCOPE</small><b>US:AAPL</b></span>
              <span><small>MODE</small><b className="signal-safe">SHADOW</b></span>
              <span><small>OUTPUT</small><b>REVIEW</b></span>
            </div>
          </motion.div>

          <a className="scroll-cue" href="#sistema">
            <span>BAJA PARA EXPLORAR</span>
            <ArrowDown />
          </a>
        </section>

        <section className="statement-section" id="sistema" aria-labelledby="statement-title">
          <motion.div
            className="section-kicker"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={reveal}
          >
            <span>01</span>
            <span>QUÉ ES OPES</span>
          </motion.div>
          <motion.h2
            id="statement-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.8 }}
            variants={reveal}
          >
            No es otro bot.
            <br />
            Es una forma de <span>pensar el mercado.</span>
          </motion.h2>
          <motion.p
            className="statement-copy"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.8, delay: 0.12 }}
            variants={reveal}
          >
            OPES separa cada frontera, conserva la evidencia y las reúne cuando es
            necesario. Para saber qué está pasando, qué importa y qué falta por validar.
          </motion.p>

          <div className="metric-row">
            {metrics.map((metric, index) => (
              <motion.div
                className="metric"
                key={metric.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.65, delay: index * 0.1 }}
                variants={reveal}
              >
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="services-section" id="servicios" aria-labelledby="services-title">
          <div className="services-heading">
            <span className="section-index">02 / THE NETWORK</span>
            <h2 id="services-title">Una red de inteligencias.<br /><span>Una lectura auditable.</span></h2>
            <p>Servicios independientes. Contratos claros. Una lectura que puede auditarse.</p>
          </div>
          <div className="services-grid">
            {[...serviceModules, linkService, visionService].map((service, index) => (
              <motion.a
                className={`service-card service-card-link service-card-${service.tone}`}
                href={sitePath(`/landing/${service.slug}`)}
                aria-label={`Saber más sobre ${service.name}`}
                key={service.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: (index % 3) * 0.07 }}
                variants={reveal}
                whileHover={reduceMotion ? undefined : { y: -5 }}
              >
                <div className="service-topline">
                  <span className="service-mark" aria-hidden="true">{service.mark}</span>
                  <span className="service-category">{service.category}</span>
                </div>
                <h3>{service.name}</h3>
                <p>{service.copy}</p>
                <span className="service-state">{service.state}</span>
                <span className="service-index">0{index + 1}</span>
              </motion.a>
            ))}
          </div>
          <motion.a
            className="intelligence-core intelligence-core-link"
            href={sitePath('/landing/opes-intelligence')}
            aria-label="Saber más sobre OPES Intelligence"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
          >
            <div>
              <span className="core-kicker">CONVERGENCE / 10</span>
              <h3>{decisionLayer.name}</h3>
            </div>
            <p>Aquí converge la evidencia: contexto, estrategia, contradicciones y el siguiente paso que todavía debe pasar por sus propios gates.</p>
            <div className="core-status"><span><i /> EVIDENCE</span><span><i /> CONTRADICTIONS</span><span><i /> RECOMMENDATION</span></div>
          </motion.a>
        </section>

        <section className="feature-section" aria-label="Principios de OPES">
          <div className="feature-intro">
            <span className="section-index">03 / THE SYSTEM</span>
            <h2>Todo el contexto.<br /><span>En una sola lectura.</span></h2>
          </div>
          <div className="feature-grid">
            <motion.article className="feature-card feature-card-lime" whileHover={reduceMotion ? undefined : { y: -8 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
              <span className="feature-number">01</span>
              <div className="feature-icon icon-radar" aria-hidden="true"><i /><i /><i /></div>
              <h3>Mira el<br />contexto.</h3>
              <p>Macro, empresa, precio, derivados y memoria, cada uno en su frontera.</p>
              <a href="#servicios" aria-label="Descubrir el contexto completo"><ArrowUpRight /></a>
            </motion.article>
            <motion.article className="feature-card feature-card-white" whileHover={reduceMotion ? undefined : { y: -8 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
              <span className="feature-number">02</span>
              <div className="feature-icon icon-layers" aria-hidden="true"><i /><i /><i /></div>
              <h3>Lo hace<br />trazable.</h3>
              <p>Cada lectura conserva origen, momento, evidencia y grado de confianza.</p>
              <a href="#metodo" aria-label="Descubrir el análisis reproducible"><ArrowUpRight /></a>
            </motion.article>
            <motion.article className="feature-card feature-card-blue" whileHover={reduceMotion ? undefined : { y: -8 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
              <span className="feature-number">03</span>
              <div className="feature-icon icon-lock" aria-hidden="true"><i /></div>
              <h3>No fuerza<br />la orden.</h3>
              <p>La capa analítica termina en una recomendación; riesgo y ejecución tienen sus propios gates.</p>
              <a href="#contacto" aria-label="Descubrir la decisión protegida"><ArrowUpRight /></a>
            </motion.article>
          </div>
        </section>

        <section className="method-section" id="metodo" aria-labelledby="method-title">
          <div className="method-heading">
            <span className="section-index">04 / CÓMO TRABAJA</span>
            <h2 id="method-title">De las fuentes.<br /><em>A la evidencia.</em></h2>
            <p>OPES convierte la complejidad del mercado en una lectura que puede revisarse.</p>
          </div>
          <div className="method-list">
            {processSteps.map((step, index) => (
              <button
                className={`method-step ${activeStep === index ? 'is-active' : ''}`}
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                aria-expanded={activeStep === index}
              >
                <span className="method-number">{step.number}</span>
                <span className="method-label">{step.label}</span>
                <span className="method-arrow"><ArrowUpRight /></span>
              </button>
            ))}
            <motion.div
              className="method-detail"
              key={processSteps[activeStep].number}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span>{processSteps[activeStep].number} / {processSteps[activeStep].label.toUpperCase()}</span>
              <h3>{processSteps[activeStep].title}</h3>
              <p>{processSteps[activeStep].copy}</p>
            </motion.div>
          </div>
        </section>

        <section className="principle-section" id="criterio" aria-labelledby="principle-title">
          <div className="principle-mark" aria-hidden="true"><span>O</span></div>
          <div className="principle-content">
            <span className="section-index">05 / EL PRINCIPIO</span>
            <h2 id="principle-title">La mejor decisión<br />no siempre es <em>comprar.</em></h2>
            <p>OPES también sabe esperar cuando el mercado todavía no está claro.</p>
            <a className="button button-dark" href="#contacto">Descubrir OPES <ArrowUpRight /></a>
          </div>
        </section>

        <section className="contact-section" id="contacto" aria-labelledby="contact-title">
          <div className="contact-line" />
          <span className="section-index">06 / EL PRODUCTO</span>
          <h2 id="contact-title">El mercado es complejo.<br /><em>La decisión no tiene por qué serlo.</em></h2>
          <a className="contact-link" href="#sistema">Descubrir OPES <ArrowUpRight /></a>
        </section>
      </main>

      <footer className="landing-footer">
        <a className="landing-brand" href={sitePath('/')} aria-label="opes, inicio">
          <span className="brand-orbit" aria-hidden="true"><span /></span>
          <span>opes</span>
        </a>
        <span>Market intelligence system</span>
        <span>Local draft / 2026</span>
      </footer>
    </div>
  );
}

export default LandingPage;
